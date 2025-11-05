// api/translate.js — Vercel Serverless: translate ONLY dynamic content on demand
// Requires env: OPENAI_API_KEY
const SECRET = process.env.OPENAI_API_KEY;

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!SECRET) return send(res, 500, { error: "Missing OPENAI_API_KEY" });

  try {
    // --- Read body ---
    let raw = "";
    await new Promise((resolve) => {
      req.on("data", (c) => (raw += c));
      req.on("end", resolve);
    });

    const ct = (req.headers["content-type"] || "").toLowerCase();
    if (!ct.includes("application/json")) {
      return send(res, 415, { error: `Send application/json. Got: ${ct || "unknown"}` });
    }

    let body = {};
    try { body = raw ? JSON.parse(raw) : {}; }
    catch { return send(res, 400, { error: "Invalid JSON body" }); }

    const { targetLang = "en", payload } = body || {};
    if (!payload || typeof payload !== "object") {
      return send(res, 400, { error: "Missing 'payload' for translation." });
    }

    // --- System prompt for clean UI translations ---
    const system = `You are a precise UI translator. Return STRICT JSON only:

{
  "title": "string",
  "summary": ["string","string","string"],
  "mainClauses": ["string","string","string","string","string"],
  "potentialIssues": ["string","string","string","string","string"],
  "smartSuggestions": ["string","string","string"],
  "riskNote": "string",
  "clarityNote": "string",
  "scoreLine": "string"
}

Rules:
- Translate cleanly and professionally.
- Tone must match SaaS UI style.
- For German (de): make EVERY sentence 10–15 characters shorter (more concise wording).
- DO NOT add anything not in the original.
- DO NOT add legal advice.
- NO markdown. NO bullets. NO extra keys. JSON ONLY.`;

    const user = [
      {
        type: "text",
        text:
          `Translate this into ${targetLang}:\n\n` +
          JSON.stringify(payload).slice(0, 110000)
      }
    ];

    // --- OpenAI call ---
    let openaiResp;
    try {
      openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SECRET}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user }
          ]
        })
      });
    } catch (err) {
      return send(res, 500, { error: "OpenAI network error: " + err.message });
    }

    if (!openaiResp.ok) {
      const errTxt = await openaiResp.text().catch(() => "");
      return send(res, 502, { error: "OpenAI request failed: " + errTxt });
    }

    const resp = await openaiResp.json().catch(() => ({}));
    const content = resp?.choices?.[0]?.message?.content || "{}";

    let parsed = {};
    try { parsed = JSON.parse(content); }
    catch { return send(res, 500, { error: "Invalid JSON returned by model" }); }

    // --- Shape guard ---
    const arr = (a, n) => (Array.isArray(a) ? a.slice(0, n).map(s => String(s || "")) : []);

    const out = {
      title: String(parsed.title || payload.title || ""),
      summary: arr(parsed.summary, 3),
      mainClauses: arr(parsed.mainClauses, 5),
      potentialIssues: arr(parsed.potentialIssues, 5),
      smartSuggestions: arr(parsed.smartSuggestions, 3),
      riskNote: String(parsed.riskNote || payload.riskNote || ""),
      clarityNote: String(parsed.clarityNote || payload.clarityNote || ""),
      scoreLine: String(parsed.scoreLine || payload.scoreLine || "")
    };

    return send(res, 200, out);

  } catch (err) {
    return send(res, 500, { error: "Translation failed: " + err.message });
  }
}

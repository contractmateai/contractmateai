// api/analyze.js — Serverless (Vercel/Netlify) JSON endpoint
// Requires env: OPENAI_API_KEY
const SECRET = process.env.OPENAI_API_KEY;

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!SECRET) return send(res, 500, { error: "Missing OPENAI_API_KEY" });

  try {
    // Read raw body
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

    const {
      text = "",
      imageDataURI = "",
      originalName = "Contract",
      mime = "",
      role = "signer"
    } = body || {};

    if (!text && !imageDataURI) {
      return send(res, 400, { error: "Provide either text or imageDataURI" });
    }

    // ===== SYSTEM PROMPT =====
    const system = `Return STRICT JSON (no prose) with this shape:

{
  "contractName": "string",
  "contractTitle": "string",
  "role": "signer|writer",
  "detectedLang": "en|de|fr|it|es|pt|nl|ro|sq|tr|ja|zh",
  "analysis": {
    "summary": ["string","string","string"],
    "risk": { "value": 0-100, "note": "string", "band": "green|orange|red", "safety": "generally safe|not that safe|not safe" },
    "clarity": { "value": 0-100, "note": "string", "band": "green|orange|red", "safety": "safe|not that safe|not safe" },
    "mainClauses": ["string","string","string","string","string"],
    "potentialIssues": ["string","string","string","string","string"],
    "smartSuggestions": ["string","string","string"],
    "bars": { "professionalism": 0-100, "favorabilityIndex": 0-100, "deadlinePressure": 0-100, "confidenceToSign": 0-100 },
    "scoreChecker": { "value": 0-100, "band": "red|orange|green", "verdict": "unsafe|safe|very safe", "line": "string" }
  },
  "translations": {
    "en"?: { "title":"...", "summary":["..."], "mainClauses":["..."], "potentialIssues":["..."], "smartSuggestions":["..."], "riskNote":"...", "clarityNote":"..." },
    "it"?: { ... }, "de"?: { ... }, "es"?: { ... }, "fr"?: { ... }, "pt"?: { ... },
    "nl"?: { ... }, "ro"?: { ... }, "sq"?: { ... }, "tr"?: { ... }, "ja"?: { ... }, "zh"?: { ... }
  }
}

Rules:
- Include translated "title" under each language in translations.
- Smart Suggestions must end with "e.g." for examples.
- Potential Issues can have 1–3 sentences.
- Output valid JSON only.`;

    // ===== Trim text to speed up =====
    const MAX_CHARS = 60000;
    const trimmed = String(text).slice(0, MAX_CHARS);

    const userContent = imageDataURI
      ? [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}\nOCR the contract image(s) if needed, then analyze. Follow the SYSTEM schema exactly.` },
          { type: "image_url", image_url: { url: imageDataURI } }
        ]
      : [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}, mime: ${mime}\nAnalyze this contract text:\n${trimmed}\nFollow the SYSTEM schema and constraints exactly.` }
        ];

    // ===== OpenAI call =====
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SECRET}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.15,
        max_tokens: 1600,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: userContent }
        ]
      })
    });

    if (!openaiResp.ok) {
      const errTxt = await openaiResp.text().catch(() => "");
      console.error("OpenAI API error:", openaiResp.status, errTxt);
      return send(res, 502, { error: "Upstream analysis failed" });
    }

    const data = await openaiResp.json().catch(() => ({}));
    const content = data?.choices?.[0]?.message?.content || "{}";

    let parsed = {};
    try { parsed = JSON.parse(content); } catch { parsed = {}; }

    const clamp = (v) => Math.max(0, Math.min(100, Number(v || 0)));
    const stripLead = (s) => String(s || "").replace(/^\s*\d+\s*[.)-]\s*/, "");

    const title = parsed.contractTitle || parsed.contractName || originalName || "Contract";
    const lang = parsed.detectedLang || "en";

    const normalized = {
      contractName: parsed.contractName || originalName || "Contract",
      contractTitle: title,
      role: parsed.role === "writer" ? "writer" : "signer",
      detectedLang: lang,
      analysis: {
        summary: (parsed?.analysis?.summary || []).slice(0, 4),
        risk: {
          value: clamp(parsed?.analysis?.risk?.value),
          note: parsed?.analysis?.risk?.note || "",
          band: parsed?.analysis?.risk?.band || "",
          safety: parsed?.analysis?.risk?.safety || ""
        },
        clarity: {
          value: clamp(parsed?.analysis?.clarity?.value),
          note: parsed?.analysis?.clarity?.note || "",
          band: parsed?.analysis?.clarity?.band || "",
          safety: parsed?.analysis?.clarity?.safety || ""
        },
        mainClauses: (parsed?.analysis?.mainClauses || []).map(s => stripLead(s)).slice(0, 5),
        potentialIssues: (parsed?.analysis?.potentialIssues || []).map(s => stripLead(s)).slice(0, 5),
        smartSuggestions: (parsed?.analysis?.smartSuggestions || []).map(s => stripLead(s)).slice(0, 3),
        bars: parsed?.analysis?.bars || {},
        scoreChecker: parsed?.analysis?.scoreChecker || {}
      },
      translations: parsed.translations || {}
    };

    return send(res, 200, normalized);
  } catch (e) {
    console.error("analyze error", e);
    return send(res, 500, { error: "Could not analyze this file. Try again or use another file." });
  }
};


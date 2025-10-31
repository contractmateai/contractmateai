// api/analyze.js — Vercel Serverless JSON endpoint
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

    const { text = "", imageDataURI = "", originalName = "Contract", mime = "", role = "signer" } = body || {};
    if (!text && !imageDataURI) {
      return send(res, 400, { error: "Provide either text or imageDataURI" });
    }

    // --- System prompt ---
    const system = `You are a contract analyst. Return STRICT JSON only — no prose or markdown — matching EXACTLY this schema and constraints:

Schema:
{
  "contractName": "string",
  "contractTitle": "string",
  "role": "signer|writer",
  "detectedLang": "en|it|de|es|fr|pt|nl|ro|sq|tr|ja|zh",
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
    "en": {...}, "it": {...}, "de": {...}, "es": {...}, "fr": {...},
    "pt": {...}, "nl": {...}, "ro": {...}, "sq": {...}, "tr": {...},
    "ja": {...}, "zh": {...}
  }
}

Hard constraints:
- SUMMARY: 3–4 sentences (array only)
- Risk/Clarity notes ≤ 280 chars
- Main Clauses ≤ 900 chars
- Potential Issues ≤ 1000 chars
- Smart Suggestions ≤ 1000 chars + end with "e.g., …"
- Provide translations for all supported languages.
`;

    // --- User content ---
    const userContent = imageDataURI
      ? [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}\n\nOCR if needed then analyze.` },
          { type: "image_url", image_url: { url: imageDataURI } }
        ]
      : [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}, mime: ${mime}\n\nAnalyze this contract:\n${String(text).slice(0, 200000)}` }
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
            { role: "user", content: userContent }
          ]
        })
      });
    } catch (err) {
      console.error("Network error:", err);
      return send(res, 500, { error: "OpenAI network error: " + err.message });
    }

    if (!openaiResp.ok) {
      const errTxt = await openaiResp.text().catch(() => "");
      console.error("OpenAI error:", openaiResp.status, errTxt);
      return send(res, 502, { error: "OpenAI request failed: " + errTxt });
    }

    const resp = await openaiResp.json().catch(() => ({}));
    const content = resp?.choices?.[0]?.message?.content || "{}";
    let parsed = {};
    try { parsed = JSON.parse(content); }
    catch (e) { return send(res, 500, { error: "Invalid JSON returned by model" }); }

    // --- Normalize output ---
    const capStr = (s, n) => (s || "").trim().slice(0, n);
    const clamp = (v) => Math.max(0, Math.min(100, Number(v || 0)));
    const stripLead = (s) => String(s || "").replace(/^\s*\d+\s*[.)-]\s*/, "");
    const LANGS = ["en","it","de","es","fr","pt","nl","ro","sq","tr","ja","zh"];

    const mainClauses = (parsed?.analysis?.mainClauses || [])
      .filter(Boolean).map(s => stripLead(capStr(s, 900))).slice(0,5);
    const potentialIssues = (parsed?.analysis?.potentialIssues || [])
      .filter(Boolean).map(s => stripLead(capStr(s, 1000))).slice(0,5);
    const smartSuggestions = (parsed?.analysis?.smartSuggestions || [])
      .filter(Boolean).map(s => stripLead(capStr(s, 1000))).slice(0,3);

    const normTr = {};
    const trIn = parsed.translations || {};
    LANGS.forEach(l=>{
      const seg = trIn[l] || {};
      normTr[l] = {
        title: capStr(seg.title, 200),
        summary: Array.isArray(seg.summary)? seg.summary.slice(0,4):[],
        mainClauses: Array.isArray(seg.mainClauses)? seg.mainClauses.slice(0,5):[],
        potentialIssues: Array.isArray(seg.potentialIssues)? seg.potentialIssues.slice(0,5):[],
        smartSuggestions: Array.isArray(seg.smartSuggestions)? seg.smartSuggestions.slice(0,3):[],
        riskNote: capStr(seg.riskNote, 280),
        clarityNote: capStr(seg.clarityNote, 280)
      };
    });

    const normalized = {
      contractName: parsed.contractName || originalName || "Contract",
      contractTitle: parsed.contractTitle || parsed.contractName || originalName || "Contract",
      role: parsed.role === "writer" ? "writer" : "signer",
      detectedLang: parsed.detectedLang || "en",
      analysis: {
        summary: Array.isArray(parsed?.analysis?.summary) ? parsed.analysis.summary.slice(0,4) : [],
        risk: parsed.analysis?.risk || {},
        clarity: parsed.analysis?.clarity || {},
        mainClauses,
        potentialIssues,
        smartSuggestions,
        bars: parsed.analysis?.bars || {},
        scoreChecker: parsed.analysis?.scoreChecker || {}
      },
      translations: normTr
    };

    return send(res, 200, normalized);

  } catch (err) {
    console.error("Analyze error:", err);
    return send(res, 500, { error: "Could not analyze this file. Details: " + err.message });
  }
}

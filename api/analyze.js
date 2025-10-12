// api/analyze.js — Serverless (Vercel) JSON endpoint
// Requires env: OPENAI_API_KEY
const SECRET = process.env.OPENAI_API_KEY;

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

// Default export for ES Modules
export default async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!SECRET) return send(res, 500, { error: "Missing OPENAI_API_KEY" });

  try {
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
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch {
      return send(res, 400, { error: "Invalid JSON body" });
    }

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

// === SYSTEM PROMPT ===
const system = `You are a contract analyst. Return STRICT JSON only — no prose or markdown — matching EXACTLY this schema:

{
  "contractName": "string",
  "detectedLang": "string",
  "analysis": {
    "summary": ["string"],            // one string; use "\\n" between sentences so the UI renders each on its own line
    "risk": "number:0-100",
    "clarity": "number:0-100",
    "compliance": "number:0-100",
    "keyClauses": ["string"],         // 4 items
    "potentialIssues": ["string"],    // 5 items
    "smartSuggestions": ["string"]    // 4 items
  },
  "translations": {
    "langCode": {
      "title": "string",              // translated contract name
      "summary": ["string"],
      "keyClauses": ["string"],
      "potentialIssues": ["string"],
      "smartSuggestions": ["string"]
    }
  }
}

LENGTH RULES (must be met WITHOUT padding, filler, numbers, bullets, or repetition):
- summary[0] length = 438 characters EXACTLY; write multiple complete sentences separated by "\\n". Do not duplicate phrases.
- keyClauses length = 4 items; each item length = 152 chars EXACTLY. Write plain sentences; DO NOT prefix with “Article”, numbers, bullets, or labels.
- potentialIssues length = 5 items; each item length = 104 chars EXACTLY, concise and non-repetitive.
- smartSuggestions length = 4 items; exact lengths per item: [139, 161, 284, 123] characters respectively, concise and non-repetitive.

CLOSURE & STYLE RULES (apply to ALL list items):
- Each item MUST end with a complete, grammatical sentence and natural punctuation (., ?, or !).
- Do NOT cut words mid-word; do NOT leave thoughts unfinished.
- For main clauses: write the clauses only (no “Article …”, numbers, or labels).


QUALITY RULES:
- If source text is short, synthesize plausible, accurate legal content to meet the exact lengths. No "..." and no repeated words to pad.
- Keep grammar and semantics solid; avoid wording repetition across items.
- The 'analysis' must be in the detected original language.
- Provide 'translations' for ALL of: en,it,de,es,fr,pt,nl,ro,sq,tr,zh,ja (including "title").
- Numbers (risk, clarity, compliance) remain the same across languages.`;




    // === USER content ===
    const userContent = imageDataURI
      ? [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}\n\nOCR the contract image(s) if needed, then analyze. Follow the SYSTEM schema exactly.` },
          { type: "image_url", image_url: { url: imageDataURI } }
        ]
      : [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}, mime: ${mime}\n\nAnalyze this contract text:\n${String(text).slice(0, 200000)}\n\nFollow the SYSTEM schema and constraints exactly.` }
        ];

    // === OpenAI call ===
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
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

    if (!openaiResp.ok) {
      const errTxt = await openaiResp.text().catch(() => "");
      console.error("OpenAI API error:", openaiResp.status, errTxt);
      return send(res, 502, { error: "Upstream analysis failed: " + errTxt });
    }

    const resp = await openaiResp.json().catch(() => ({}));
    const content = resp?.choices?.[0]?.message?.content || "{}";

    // === Parse + normalize ===
    let parsed = {};
    try {
      parsed = JSON.parse(content);
      console.log("OpenAI response parsed:", parsed);
    } catch (e) {
      console.error("JSON parse error:", e, content);
      return send(res, 500, { error: "Invalid JSON response from analysis" });
    }

    // Basic normalization
   const normalized = {
  contractName: parsed.contractName || originalName,
  detectedLang: parsed.detectedLang || "en",
  analysis: {
    summary: Array.isArray(parsed.analysis?.summary)
      ? parsed.analysis.summary
      : [String(parsed.analysis?.summary || "")],
    risk: Math.max(0, Math.min(100, Number(parsed.analysis?.risk || 0))),
    clarity: Math.max(0, Math.min(100, Number(parsed.analysis?.clarity || 0))),
    compliance: Math.max(0, Math.min(100, Number(parsed.analysis?.compliance || 0))),
    keyClauses: Array.isArray(parsed.analysis?.keyClauses) ? parsed.analysis.keyClauses : [],
    potentialIssues: Array.isArray(parsed.analysis?.potentialIssues) ? parsed.analysis.potentialIssues : [],
    smartSuggestions: Array.isArray(parsed.analysis?.smartSuggestions) ? parsed.analysis.smartSuggestions : []
  },
  translations: parsed.translations || {}
};

// Expect the model to produce exact lengths and complete sentences; do NOT trim/slice here.
function asArray(x) { return Array.isArray(x) ? x : (x ? [String(x)] : []); }

// Keep summary as a one-element array (UI splits on \n)
normalized.analysis.summary = asArray(parsed.analysis?.summary).slice(0, 1);

// Pass lists through untouched so items remain complete sentences.
normalized.analysis.keyClauses = Array.isArray(parsed.analysis?.keyClauses) ? parsed.analysis.keyClauses : [];
normalized.analysis.potentialIssues = Array.isArray(parsed.analysis?.potentialIssues) ? parsed.analysis.potentialIssues : [];
normalized.analysis.smartSuggestions = Array.isArray(parsed.analysis?.smartSuggestions) ? parsed.analysis.smartSuggestions : [];

// Pass translations through untouched as well.
(() => {
  const trIn = parsed.translations || {};
  const trOut = {};
  for (const code of Object.keys(trIn)) {
    const pack = trIn[code] || {};
    trOut[code] = {
      title: String(pack.title || ""),
      summary: asArray(pack.summary).slice(0, 1),
      keyClauses: Array.isArray(pack.keyClauses) ? pack.keyClauses : [],
      potentialIssues: Array.isArray(pack.potentialIssues) ? pack.potentialIssues : [],
      smartSuggestions: Array.isArray(pack.smartSuggestions) ? pack.smartSuggestions : []
    };
  }
  normalized.translations = trOut;
})();



console.log("Normalized response (trim-only):", normalized);
return send(res, 200, normalized);



  } catch (e) {
    console.error("Full analyze error:", e.message, e.stack);
    return send(res, 500, { error: "Could not analyze this file. Try again or use another file. Details: " + e.message });
  }
};

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
   const system = `You are a contract analyst. Return STRICT JSON only — no prose or markdown — matching EXACTLY this schema and constraints:
{
  "contractName": "string",
  "detectedLang": "string",
  "analysis": {
    "summary": ["string"],
    "risk": "number:0-100",
    "clarity": "number:0-100",
    "compliance": "number:0-100",
    "keyClauses": ["string"],
    "potentialIssues": ["string"],
    "smartSuggestions": ["string"]
  },
  "translations": {
    "langCode": {
      "summary": ["string"],
      "keyClauses": ["string"],
      "potentialIssues": ["string"],
      "smartSuggestions": ["string"]
    }
  }
}
Rules:
- Detect the original language and write the 'analysis' in that original language (no English unless the contract is English).
- Then fill 'translations' for ALL of these codes: en, it, de, es, fr, pt, nl, ro, sq, tr, zh, ja.
- The translations must cover ALL fields: summary, keyClauses, potentialIssues, smartSuggestions.
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

/* ===== Length enforcement (as per your exact specs) ===== */
function trimTo(s, n){ s = String(s||""); return s.length <= n ? s : s.slice(0, n); }
function ensureArray(a){ return Array.isArray(a) ? a : (a ? [String(a)] : []); }

const LIMITS = {
  summaryTotal: 438, // full summary box
  clauseLen: 127,    // 4 items
  issuesLen: 104,    // 5 items
  sugg1Len: 139,
  sugg2Len: 161,
  sugg3Len: 284      // duplicated sentence length
};

// SUMMARY → single string trimmed to 438 chars
{
  const parts = ensureArray(normalized.analysis.summary);
  const joined = parts.join(" ").replace(/\s+/g, " ");
  normalized.analysis.summary = [ trimTo(joined, LIMITS.summaryTotal) ];
}

// MAIN CLAUSES → exactly 4, each trimmed to 127 chars
{
  const src = ensureArray(normalized.analysis.keyClauses);
  const out = [];
  for (let i = 0; i < 4; i++){
    out.push(trimTo(src[i] || "", LIMITS.clauseLen));
  }
  normalized.analysis.keyClauses = out;
}

// POTENTIAL ISSUES → exactly 5, each trimmed to 104 chars
{
  const src = ensureArray(normalized.analysis.potentialIssues);
  const out = [];
  for (let i = 0; i < 5; i++){
    out.push(trimTo(src[i] || "", LIMITS.issuesLen));
  }
  normalized.analysis.potentialIssues = out;
}

// SMART SUGGESTIONS → exactly 3 with per-item limits (note: #3 has duplicated sentence length)
{
  const src = ensureArray(normalized.analysis.smartSuggestions);
  const out = [];
  out.push(trimTo(src[0] || "", LIMITS.sugg1Len));
  out.push(trimTo(src[1] || "", LIMITS.sugg2Len));
  out.push(trimTo(src[2] || "", LIMITS.sugg3Len));
  normalized.analysis.smartSuggestions = out;
}

console.log("Normalized response (length-limited):", normalized);
return send(res, 200, normalized);

  } catch (e) {
    console.error("Full analyze error:", e.message, e.stack);
    return send(res, 500, { error: "Could not analyze this file. Try again or use another file. Details: " + e.message });
  }
};

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
    "summary": ["string"],            // one string; use "\\n" between sentences so they render on separate lines
    "risk": "number:0-100",
    "clarity": "number:0-100",
    "compliance": "number:0-100",
    "keyClauses": ["string"],         // 4 items
    "potentialIssues": ["string"],    // 5 items
    "smartSuggestions": ["string"]    // 3 items
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

LENGTH RULES (must be met WITHOUT padding, filler, or repetition):
- summary[0] length = 438 characters EXACTLY; write multiple sentences separated by "\\n" (newline). No duplicated phrases.
- keyClauses length = 4 items; each item length = 127 chars EXACTLY, concise and non-repetitive.
- potentialIssues length = 5 items; each item length = 104 chars EXACTLY, concise and non-repetitive.
- smartSuggestions length = 3 items; with exact lengths: [139, 161, 284] characters respectively, concise and non-repetitive.

QUALITY RULES:
- If source text is short, synthesize plausible, accurate legal content to meet the exact lengths. No "..." or repeated words to pad.
- Keep grammar correct; avoid wording repetition across items.
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

/* ===== Trim-only guards (no padding; model must satisfy exact lengths) ===== */
function ensureArray(a){ return Array.isArray(a) ? a : (a ? [String(a)] : []); }
function trimTo(s, n){ s = String(s||""); return s.length > n ? s.slice(0, n) : s; }
const LIMITS = { summaryTotal: 438, clauseLen: 127, issuesLen: 104, sugg1Len: 139, sugg2Len: 161, sugg3Len: 284 };

// SUMMARY (keep as a single string; the UI will render each sentence on a new line)
{
  const parts = ensureArray(parsed.analysis?.summary);
  const str = String(parts[0] ?? "");
  normalized.analysis.summary = [ trimTo(str, LIMITS.summaryTotal) ];
}

// 4 CLAUSES
{
  const src = ensureArray(parsed.analysis?.keyClauses);
  normalized.analysis.keyClauses = [
    trimTo(src[0] || "", LIMITS.clauseLen),
    trimTo(src[1] || "", LIMITS.clauseLen),
    trimTo(src[2] || "", LIMITS.clauseLen),
    trimTo(src[3] || "", LIMITS.clauseLen),
  ];
}

// 5 ISSUES
{
  const src = ensureArray(parsed.analysis?.potentialIssues);
  normalized.analysis.potentialIssues = [
    trimTo(src[0] || "", LIMITS.issuesLen),
    trimTo(src[1] || "", LIMITS.issuesLen),
    trimTo(src[2] || "", LIMITS.issuesLen),
    trimTo(src[3] || "", LIMITS.issuesLen),
    trimTo(src[4] || "", LIMITS.issuesLen),
  ];
}

// 3 SUGGESTIONS
{
  const src = ensureArray(parsed.analysis?.smartSuggestions);
  normalized.analysis.smartSuggestions = [
    trimTo(src[0] || "", LIMITS.sugg1Len),
    trimTo(src[1] || "", LIMITS.sugg2Len),
    trimTo(src[2] || "", LIMITS.sugg3Len),
  ];
}

/* ===== Also trim translations; rely on model for exactness/no repetition ===== */
(() => {
  const tr = normalized.translations || {};
  for (const code of Object.keys(tr)) {
    const pack = tr[code] || {};
    // title (added to schema)
    pack.title = String(pack.title || "");
    // summary (single string)
    {
      const parts = ensureArray(pack.summary);
      pack.summary = [ trimTo(String(parts[0] || ""), LIMITS.summaryTotal) ];
    }
    // arrays
    const kc = ensureArray(pack.keyClauses);
    pack.keyClauses = [0,1,2,3].map(i => trimTo(kc[i] || "", LIMITS.clauseLen));
    const pi = ensureArray(pack.potentialIssues);
    pack.potentialIssues = [0,1,2,3,4].map(i => trimTo(pi[i] || "", LIMITS.issuesLen));
    const ss = ensureArray(pack.smartSuggestions);
    pack.smartSuggestions = [
      trimTo(ss[0] || "", LIMITS.sugg1Len),
      trimTo(ss[1] || "", LIMITS.sugg2Len),
      trimTo(ss[2] || "", LIMITS.sugg3Len),
    ];
    tr[code] = pack;
  }
  normalized.translations = tr;
})();

console.log("Normalized response (trim-only):", normalized);
return send(res, 200, normalized);



  } catch (e) {
    console.error("Full analyze error:", e.message, e.stack);
    return send(res, 500, { error: "Could not analyze this file. Try again or use another file. Details: " + e.message });
  }
};

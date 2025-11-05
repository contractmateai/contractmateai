// api/analyze.js — Vercel Serverless JSON endpoint
// Requires env: OPENAI_API_KEY
const SECRET = process.env.OPENAI_API_KEY;

/* ------------------------------- helpers ------------------------------- */
function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}
const clamp01 = (v) => Math.max(0, Math.min(100, Number(v || 0)));
const capStr = (s, n) => (s || "").toString().trim().slice(0, n);
const stripLead = (s) => String(s || "").replace(/^\s*\d+\s*[.)-]\s*/, "");

const LANGS = ["en","it","de","es","fr","pt","nl","ro","sq","tr","ja","zh"];

const SAFE_TRUNC_SENT = (text, delta = 12) => {
  // Make German a bit shorter per sentence (≈10–15 chars)
  if (!text) return text;
  const t = text.toString();
  if (t.length <= 40) return t; // don't mutilate very short lines
  const keep = Math.max(0, t.length - delta);
  // try to cut on a space boundary if possible
  const cut = t.lastIndexOf(" ", keep);
  return t.slice(0, cut > 30 ? cut : keep);
};

// Your three reference templates as a safe fallback (Option A format).
const SMART_TEMPLATES = [
  "Consider including a clause that specifies the governing law for any disputes, e.g., “This contract shall be governed by the laws of Italy.”",
  "Ensure that all parties fully understand the implications of excluding any provisions of the Convention, e.g., “Parties may opt-out of certain liability clauses.”",
  "Include a clear dispute resolution mechanism, e.g., “Any disputes arising from this contract shall be resolved through arbitration in Vienna.”"
];

// enforce Option A (single string with example), exactly 3 items, and length ceilings similar to samples
function normalizeSmartSuggestions(arrIn) {
  const MAX_LEN = 220; // close to your samples; keeps them short and tidy
  let out = Array.isArray(arrIn) ? arrIn.filter(Boolean).map(String) : [];

  // Must be exactly 3; fix count first
  if (out.length < 3) {
    out = [...out, ...SMART_TEMPLATES].slice(0, 3);
  } else if (out.length > 3) {
    out = out.slice(0, 3);
  }

  // Ensure each item matches Option A style and is not too long
  out = out.map((s, i) => {
    let t = stripLead(capStr(s, MAX_LEN + 40)); // soft limit before enforcing
    // If it doesn't include "e.g.," (or “e.g.,” smart quotes), replace with template
    const hasEg = /e\.g\.,|“e\.g\.,|e\.g\.,“|e\.g\., "| e\.g\.,/.test(t) || /e\.g\.,/i.test(t);
    if (!hasEg) t = SMART_TEMPLATES[i];
    // Hard cap
    t = capStr(t, MAX_LEN);
    return t;
  });

  return out;
}

// Build scoreChecker safely and consistently with UI states
function buildScoreChecker(inSC, riskVal, clarVal) {
  // Prefer model's numeric value, else derive a rough one from clarity/risk
  const value = clamp01(inSC?.value ?? Math.round((clarVal * 0.6) + ((100 - riskVal) * 0.4)));
  let band, verdict, line;

  if (value <= 33) {
    band = "red"; verdict = "unsafe";
    line = "Unsafe: review key risks before signing.";
  } else if (value <= 66) {
    band = "orange"; verdict = "safe";
    line = "Just safe: proceed with caution and address flagged items.";
  } else {
    band = "green"; verdict = "very safe";
    line = "Very safe: only minor adjustments are suggested.";
  }

  return {
    value,
    band,
    verdict,
    line
  };
}

// Normalize bars (provide defaults if missing)
function normalizeBars(barsIn, riskVal, clarVal) {
  const professionalism = clamp01(barsIn?.professionalism ?? Math.round((clarVal * 0.7) + 20));
  const favorabilityIndex = clamp01(barsIn?.favorabilityIndex ?? Math.round(((100 - riskVal) + clarVal) / 2));
  const deadlinePressure = clamp01(barsIn?.deadlinePressure ?? Math.round(40 + (riskVal * 0.4)));
  const confidenceToSign = clamp01(barsIn?.confidenceToSign ?? Math.round((clarVal * 0.6) + ((100 - riskVal) * 0.4)));
  return { professionalism, favorabilityIndex, deadlinePressure, confidenceToSign };
}

// Build translation bucket; if missing, fall back to source; shorten German
function normalizeTranslations(parsed, normalized) {
  const trIn = parsed.translations || {};
  const out = {};

  LANGS.forEach((l) => {
    const seg = trIn[l] || {};

    // Source (detected language) data:
    const srcSummary = normalized.analysis.summary || [];
    const srcClauses = normalized.analysis.mainClauses || [];
    const srcIssues = normalized.analysis.potentialIssues || [];
    const srcSuggest = normalized.analysis.smartSuggestions || [];
    const srcTitle = normalized.contractTitle || normalized.contractName || "Contract";

    // Pull translated arrays if available; else fallback to source
    let summary = Array.isArray(seg.summary) ? seg.summary.slice(0, 4) : srcSummary.slice(0, 4);
    let mainClauses = Array.isArray(seg.mainClauses) ? seg.mainClauses.slice(0, 5) : srcClauses.slice(0, 5);
    let potentialIssues = Array.isArray(seg.potentialIssues) ? seg.potentialIssues.slice(0, 5) : srcIssues.slice(0, 5);
    let smartSuggestions = Array.isArray(seg.smartSuggestions) ? seg.smartSuggestions.slice(0, 3) : srcSuggest.slice(0, 3);

    // Title / notes
    const riskNote = capStr(seg.riskNote || "", 280);
    const clarityNote = capStr(seg.clarityNote || "", 280);
    const title = capStr(seg.title || srcTitle, 200);

    // German shortening rule: shave ~10–15 chars per sentence for dynamic box content
    if (l === "de") {
      summary = summary.map((s) => SAFE_TRUNC_SENT(s, 12));
      mainClauses = mainClauses.map((s) => SAFE_TRUNC_SENT(s, 12));
      potentialIssues = potentialIssues.map((s) => SAFE_TRUNC_SENT(s, 12));
      smartSuggestions = smartSuggestions.map((s) => SAFE_TRUNC_SENT(s, 12));
    }

    out[l] = {
      title,
      summary,
      mainClauses,
      potentialIssues,
      smartSuggestions,
      riskNote,
      clarityNote
    };
  });

  return out;
}

/* -------------------------------- handler ------------------------------ */
export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!SECRET) return send(res, 500, { error: "Missing OPENAI_API_KEY" });

  try {
    // Read body
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

    // Accepted inputs: raw text OR a dataURI image (OCR on the model side)
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

    /* ------------------------ Prompt (strict JSON) ------------------------ */
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
- Smart Suggestions: EXACTLY 3 items. Each item must be ONE sentence and include a tiny example using the format “e.g., “…”. Keep each item short like the samples.
- Provide translations for all supported languages (translate dynamic content: summary, mainClauses, potentialIssues, smartSuggestions, and contractTitle).`;

    const userContent = imageDataURI
      ? [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}\n\nOCR if needed then analyze.` },
          { type: "image_url", image_url: { url: imageDataURI } }
        ]
      : [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}, mime: ${mime}\n\nAnalyze this contract:\n${String(text).slice(0, 200000)}` }
        ];

    /* ---------------------------- OpenAI call ---------------------------- */
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

    /* --------------------------- normalization -------------------------- */
    const riskIn = parsed?.analysis?.risk || {};
    const clarIn = parsed?.analysis?.clarity || {};

    const riskVal = clamp01(riskIn.value);
    const clarVal = clamp01(clarIn.value);

    const mainClauses = (parsed?.analysis?.mainClauses || [])
      .filter(Boolean).map(s => stripLead(capStr(s, 900))).slice(0,5);

    const potentialIssues = (parsed?.analysis?.potentialIssues || [])
      .filter(Boolean).map(s => stripLead(capStr(s, 1000))).slice(0,5);

    // Option A smart suggestions (force 3, one-liners with e.g., examples)
    const smartSuggestions = normalizeSmartSuggestions(parsed?.analysis?.smartSuggestions || []);

    // Bars and Score Checker (fixed to avoid wrong “nearly perfect” on unsafe)
    const bars = normalizeBars(parsed?.analysis?.bars || {}, riskVal, clarVal);
    const scoreChecker = buildScoreChecker(parsed?.analysis?.scoreChecker, riskVal, clarVal);

    // Risk/Clarity notes (cap length)
    const riskObj = {
      value: riskVal,
      note: capStr(riskIn.note || "", 280),
      band: riskIn.band || (riskVal <= 25 ? "green" : riskVal <= 58 ? "orange" : "red"),
      safety: riskIn.safety || (riskVal <= 25 ? "generally safe" : riskVal <= 58 ? "not that safe" : "not safe")
    };

    const clarObj = {
      value: clarVal,
      note: capStr(clarIn.note || "", 280),
      band: clarIn.band || (clarVal >= 78 ? "green" : clarVal >= 49 ? "orange" : "red"),
      safety: clarIn.safety || (clarVal >= 78 ? "safe" : clarVal >= 49 ? "not that safe" : "not safe")
    };

    // Core normalized payload
    const normalized = {
      contractName: parsed.contractName || originalName || "Contract",
      contractTitle: parsed.contractTitle || parsed.contractName || originalName || "Contract",
      role: parsed.role === "writer" ? "writer" : "signer",
      detectedLang: parsed.detectedLang || "en",
      analysis: {
        summary: Array.isArray(parsed?.analysis?.summary) ? parsed.analysis.summary.slice(0,4) : [],
        risk: riskObj,
        clarity: clarObj,
        mainClauses,
        potentialIssues,
        smartSuggestions,
        bars,
        scoreChecker
      },
      translations: {} // filled next
    };

    // Build translations (dynamic content + title); if missing, fallback
    const translations = normalizeTranslations(parsed, normalized);

    normalized.translations = translations;

    /* ------------------------------ respond ----------------------------- */
    return send(res, 200, normalized);

  } catch (err) {
    console.error("Analyze error:", err);
    return send(res, 500, { error: "Could not analyze this file. Details: " + err.message });
  }
}

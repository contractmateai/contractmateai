// api/analyze.js — Serverless (Vercel/Netlify) JSON endpoint
// Requires env: OPENAI_API_KEY
const SECRET = process.env.OPENAI_API_KEY;

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

module.exports = async (req, res) => {
  // CORS (okay even if same-origin)
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

    // Enforce JSON
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

    // === SYSTEM PROMPT (schema + constraints tuned for your UI) ===
    const system = `You are a contract analyst. Return STRICT JSON only — no prose or markdown — matching EXACTLY this schema and constraints:

Supported UI languages: en, it, de, es, fr, pt, nl, ro, sq, tr, ja, zh.
If the contract's detected language is one of these, WRITE THE ANALYSIS FIELDS in that language.
If the detected language is NOT supported, write the analysis in English.
Additionally, include a "translations" object with best-effort human-quality translations for the supported languages (at least "en"). It's okay if some languages are missing.

Schema:
{
  "contractName": "string",
  "contractTitle": "string",
  "role": "signer|writer",
  "detectedLang": "en|it|de|es|fr|pt|nl|ro|sq|tr|ja|zh",
  "analysis": {
    "summary": ["string","string","string"],                      // 3–4 concise sentences (array)
    "risk": { "value": 0-100, "note": "string", "band": "green|orange|red", "safety": "generally safe|not that safe|not safe" },
    "clarity": { "value": 0-100, "note": "string", "band": "green|orange|red", "safety": "safe|not that safe|not safe" },
    "mainClauses": ["string","string","string","string","string"], // up to 5; fuller sentences; DO NOT prefix with numbers
    "potentialIssues": ["string","string","string","string","string"], // up to 5; each can be 1–3 sentences
    "smartSuggestions": ["string","string","string"],              // exactly 3; allow a brief example ("For example: …")
    "bars": { "professionalism": 0-100, "favorabilityIndex": 0-100, "deadlinePressure": 0-100, "confidenceToSign": 0-100 },
    "scoreChecker": { "value": 0-100, "band": "red|orange|green", "verdict": "unsafe|safe|very safe", "line": "string" }
  },
  "translations": {
    // OPTIONAL: include as many of these as you can; each mirrors the arrays above
    // You may also include "riskNote" and "clarityNote" string keys to translate those notes.
    "en"?: { "summary": ["..."], "mainClauses": ["..."], "potentialIssues": ["..."], "smartSuggestions": ["..."], "riskNote": "string", "clarityNote": "string" },
    "it"?: { "...": "..." },
    "de"?: { "...": "..." },
    "es"?: { "...": "..." },
    "fr"?: { "...": "..." },
    "pt"?: { "...": "..." },
    "nl"?: { "...": "..." },
    "ro"?: { "...": "..." },
    "sq"?: { "...": "..." },
    "tr"?: { "...": "..." },
    "ja"?: { "...": "..." },
    "zh"?: { "...": "..." }
  }
}

Hard constraints:
- Echo user role in "role".
- "contractTitle": infer clean title (e.g., “Non-Disclosure Agreement”) or derive from filename.
- SUMMARY: 3–4 sentences total, plain language; output as an array (for spacing).
- RISK (lower = safer): 0–25 green, 26–58 orange, 59–100 red. Short note ≤ 280 chars.
  Safety: green="generally safe", orange="not that safe", red="not safe".
- CLAUSE CLARITY (higher = clearer): 0–48 red, 49–77 orange, 78–100 green. Short note ≤ 280 chars.
  Safety: green="safe", orange="not that safe", red="not safe".
- MAIN CLAUSES: up to 5; fuller sentences (can be longer than usual); do not start with numbers or bullets.
- POTENTIAL ISSUES: up to 5; 1–3 sentences each allowed.
- SMART SUGGESTIONS: exactly 3; allow a brief example ("For example: …").
- Bars thresholds:
  professionalism/favorability/confidence: 0–48 red, 49–74 orange, 75–100 green
  deadlinePressure: 0–35 green, 36–68 orange, 69–100 red
- SCORE CHECKER thresholds: 0–48 red, 49–77 orange, 78–100 green; verdict red="unsafe", orange="safe", green="very safe"; line red="The contract isnt done well", orange="The contract is done well", green="The contract is nearly perfectly done".
- Tailor to role ("signer" = protective asks; "writer" = drafting/negotiation).
- If info is insufficient, keep arrays short and scores conservative, but NEVER break schema.
- Output VALID JSON only.`;

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
      return send(res, 502, { error: "Upstream analysis failed" });
    }

    const data = await openaiResp.json().catch(() => ({}));
    const content = data?.choices?.[0]?.message?.content || "{}";

    // === Parse + normalize (enforce bands/labels/caps; strip leading numbering) ===
    let parsed = {};
    try { parsed = JSON.parse(content); } catch { parsed = {}; }

    const bandRisk = v => (v <= 25 ? "green" : v <= 58 ? "orange" : "red");
    const bandClarity = v => (v >= 78 ? "green" : v >= 49 ? "orange" : "red");
    const scoreBand = v => (v <= 48 ? "red" : v <= 77 ? "orange" : "green");

    // UI labels: green=Totally safe, orange=Generally safe, red=Not safe
    const riskSafety    = b => b === "green" ? "totally safe" : b === "orange" ? "generally safe" : "not safe";
    const claritySafety = b => b === "green" ? "totally safe" : b === "orange" ? "generally safe" : "not safe";

    const scoreLine  = b => b === "green" ? "The contract is nearly perfectly done"
                         : b === "orange" ? "The contract is done well"
                         : "The contract isnt done well";
    const scoreVerdict = b => b === "green" ? "very safe" : b === "orange" ? "safe" : "unsafe";

    const capStr = (s, n) => (s || "").trim().slice(0, n);
    const clamp = (v) => { v = Number(v || 0); return Math.max(0, Math.min(100, v)); };
    const stripLead = (s) => String(s || "").replace(/^\s*\d+\s*[.)-]\s*/, "");

    const roleOut = parsed.role === "writer" ? "writer" : "signer";
    const title = parsed.contractTitle || parsed.contractName || originalName || "Contract";
    const lang  = parsed.detectedLang || "en";

    // Summary array (3–4)
    let summaryArr = Array.isArray(parsed?.analysis?.summary) ? parsed.analysis.summary : [];
    summaryArr = summaryArr.filter(Boolean).map((s) => s.trim()).slice(0,4);

    // Risk
    const rVal  = clamp(parsed?.analysis?.risk?.value ?? parsed?.analysis?.risk);
    const rBand = parsed?.analysis?.risk?.band || bandRisk(rVal);
    const rNote = capStr(parsed?.analysis?.risk?.note || "", 280);
    const rSafe = riskSafety(rBand);

    // Clarity
    const cVal  = clamp(parsed?.analysis?.clarity?.value ?? parsed?.analysis?.clarity);
    const cBand = parsed?.analysis?.clarity?.band || bandClarity(cVal);
    const cNote = capStr(parsed?.analysis?.clarity?.note || "", 280);
    const cSafe = claritySafety(cBand);

    // Clauses/issues/suggestions (longer + strip numbering)
    const mainClauses = (parsed?.analysis?.mainClauses || [])
      .filter(Boolean).map(s => stripLead(capStr(s, 600))).slice(0,5);

    const potentialIssues = (parsed?.analysis?.potentialIssues || [])
      .filter(Boolean).map(s => stripLead(capStr(s, 800))).slice(0,5);

    let smartSuggestions = (parsed?.analysis?.smartSuggestions || [])
      .filter(Boolean).map(s => stripLead(capStr(s, 800))).slice(0,3);
    while (smartSuggestions.length < 3) smartSuggestions.push("");

    // Bars
    const barsIn = parsed?.analysis?.bars || {};
    const bars = {
      professionalism:  clamp(barsIn.professionalism),
      favorabilityIndex: clamp(barsIn.favorabilityIndex),
      deadlinePressure: clamp(barsIn.deadlinePressure),
      confidenceToSign: clamp(barsIn.confidenceToSign)
    };

    // Score checker
    const scVal = clamp(parsed?.analysis?.scoreChecker?.value);
    const scBand = parsed?.analysis?.scoreChecker?.band || scoreBand(scVal);
    const scLine = parsed?.analysis?.scoreChecker?.line || scoreLine(scBand);
    const scVerdict = parsed?.analysis?.scoreChecker?.verdict || scoreVerdict(scBand);

    // Final normalized payload
    const normalized = {
      contractName: parsed.contractName || originalName || "Contract",
      contractTitle: title,
      role: roleOut,
      detectedLang: lang,
      analysis: {
        summary: summaryArr,
        risk: { value: rVal, note: rNote, band: rBand, safety: rSafe },
        clarity: { value: cVal, note: cNote, band: cBand, safety: cSafe },
        mainClauses,
        potentialIssues,
        smartSuggestions,
        bars,
        scoreChecker: { value: scVal, band: scBand, verdict: scVerdict, line: scLine }
      },
      translations: parsed.translations || {}
    };

    return send(res, 200, normalized);
  } catch (e) {
    console.error("analyze error", e);
    return send(res, 500, { error: "Could not analyze this file. Try again or use another file." });
  }
};

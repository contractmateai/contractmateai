// api/analyze.js — Serverless (Vercel/Netlify) JSON endpoint
// Requires env: OPENAI_API_KEY
const SECRET = process.env.OPENAI_API_KEY;

// Supported UI languages (codes must match the menu in analysis.html)
const SUPPORTED = ["en","it","de","es","fr","pt","nl","ro","sq","tr","ja","zh"];

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
      role = "signer",
      // If you need 3–8s latency, send { fast: true } from the client.
      fast = false
    } = body || {};

    if (!text && !imageDataURI) {
      return send(res, 400, { error: "Provide either text or imageDataURI" });
    }

    // === SYSTEM PROMPT (schema + constraints synced with UI) ===
    const system = `You are a contract analyst. Return STRICT JSON only — no prose — matching EXACTLY this schema and constraints:

Schema:
{
  "contractName": "string",
  "contractTitle": "string",
  "role": "signer|writer",
  "detectedLang": "en|it|de|es|fr|pt|nl|ro|sq|tr|ja|zh",
  "analysis": {
    "summary": ["string","string","string"],                      // 3–4 sentences (array)
    "risk": { "value": 0-100, "note": "string", "band": "green|orange|red", "safety": "totally safe|generally safe|not safe" },
    "clarity": { "value": 0-100, "note": "string", "band": "green|orange|red", "safety": "totally safe|generally safe|not safe" },
    "mainClauses": ["string","string","string","string","string"], // up to 5; full sentences; DO NOT prefix with numbers
    "potentialIssues": ["string","string","string","string","string"], // up to 5; each 1–3 sentences
    "smartSuggestions": ["string","string","string"],              // exactly 3; may include a short example: "For example: …"
    "bars": { "professionalism": 0-100, "favorabilityIndex": 0-100, "deadlinePressure": 0-100, "confidenceToSign": 0-100 },
    "scoreChecker": { "value": 0-100, "band": "red|orange|green", "verdict": "unsafe|safe|very safe", "line": "string" }
  },
  "translations": {
    // replicate summary/mainClauses/potentialIssues/smartSuggestions in the following codes if asked:
    // en,it,de,es,fr,pt,nl,ro,sq,tr,ja,zh
  }
}

Hard constraints:
- Echo user role in "role".
- "contractTitle": infer a clean title (e.g., "Non-Disclosure Agreement") or derive from filename.
- SUMMARY: 3–4 sentences total in the contract's original language; array form.
- RISK (lower = safer): 0–25 green, 26–58 orange, 59–100 red. Note ≤ 280 chars.
  Safety labels: green="totally safe", orange="generally safe", red="not safe".
- CLARITY (higher = clearer): 0–48 red, 49–77 orange, 78–100 green. Note ≤ 280 chars.
  Safety labels: green="totally safe", orange="generally safe", red="not safe".
- MAIN CLAUSES: up to 5; full sentences (longer ok); do not start with numbers/bullets.
- POTENTIAL ISSUES: up to 5; 1–3 sentences each; longer allowed.
- SMART SUGGESTIONS: exactly 3; longer allowed; include a brief example when useful.
- Bars thresholds:
  professionalism/favorability/confidence: 0–48 red, 49–74 orange, 75–100 green
  deadlinePressure: 0–35 green, 36–68 orange, 69–100 red
- SCORE CHECKER thresholds: 0–48 red, 49–77 orange, 78–100 green; verdict red="unsafe", orange="safe", green="very safe"; line red="The contract isnt done well", orange="The contract is done well", green="The contract is nearly perfectly done".
- Tailor to role ("signer" = protective asks; "writer" = drafting/negotiation).
- If info is insufficient, keep arrays short and scores conservative, but NEVER break schema.
- Output VALID JSON only.`;

    // === USER content ===
    const baseUser = imageDataURI
      ? [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}\n\nOCR the contract image(s) if needed, then analyze. Follow the SYSTEM schema exactly.` },
          { type: "image_url", image_url: { url: imageDataURI } }
        ]
      : [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}, mime: ${mime}\n\nAnalyze this contract text:\n${String(text).slice(0, fast ? 30000 : 200000)}\n\nFollow the SYSTEM schema and constraints exactly.` }
        ];

    // Ask for translations unless fast mode is on
    const transAsk = fast
      ? "DO NOT include translations to minimize latency."
      : `Also include a "translations" object with the same four arrays translated into ALL of these codes: ${SUPPORTED.join(", ")}.`;

    baseUser[0].text += `\n\n${transAsk}`;

    // === OpenAI call ===
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SECRET}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.1,
        top_p: 0.1,
        presence_penalty: 0,
        frequency_penalty: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: baseUser }
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

    // === Parse + normalize (bands/safety; strip numbering; ensure translations shape) ===
    let parsed = {};
    try { parsed = JSON.parse(content); } catch { parsed = {}; }

    const bandRisk = v => (v <= 25 ? "green" : v <= 58 ? "orange" : "red");
    const bandClarity = v => (v >= 78 ? "green" : v >= 49 ? "orange" : "red");
    const scoreBand = v => (v <= 48 ? "red" : v <= 77 ? "orange" : "green");

    const safetyFromBand = b => b === "green" ? "totally safe" : b === "orange" ? "generally safe" : "not safe";
    const scoreLine  = b => b === "green" ? "The contract is nearly perfectly done"
                         : b === "orange" ? "The contract is done well"
                         : "The contract isnt done well";
    const scoreVerdict = b => b === "green" ? "very safe" : b === "orange" ? "safe" : "unsafe";

    const capStr = (s, n) => (s || "").trim().slice(0, n);
    const clamp = (v) => { v = Number(v || 0); return Math.max(0, Math.min(100, v)); };
    const stripLead = (s) => String(s || "").replace(/^\s*\d+\s*[.)-]\s*/, "");

    const roleOut = parsed.role === "writer" ? "writer" : "signer";
    const title = parsed.contractTitle || parsed.contractName || originalName || "Contract";
    const detectedLang = SUPPORTED.includes(parsed.detectedLang) ? parsed.detectedLang : "en";

    // Arrays
    const toArr = (v) => Array.isArray(v) ? v.filter(Boolean).map(x => x.trim()) : [];
    let summaryArr = toArr(parsed?.analysis?.summary).slice(0,4);

    // Risk/Clarity
    const rVal  = clamp(parsed?.analysis?.risk?.value ?? parsed?.analysis?.risk);
    const rBand = parsed?.analysis?.risk?.band || bandRisk(rVal);
    const rNote = capStr(parsed?.analysis?.risk?.note || "", 280);
    const rSafe = parsed?.analysis?.risk?.safety || safetyFromBand(rBand);

    const cVal  = clamp(parsed?.analysis?.clarity?.value ?? parsed?.analysis?.clarity);
    const cBand = parsed?.analysis?.clarity?.band || bandClarity(cVal);
    const cNote = capStr(parsed?.analysis?.clarity?.note || "", 280);
    const cSafe = parsed?.analysis?.clarity?.safety || safetyFromBand(cBand);

    // Lists
    const mainClauses = toArr(parsed?.analysis?.mainClauses).map(s => stripLead(capStr(s, 600))).slice(0,5);
    const potentialIssues = toArr(parsed?.analysis?.potentialIssues).map(s => stripLead(capStr(s, 700))).slice(0,5);
    let smartSuggestions = toArr(parsed?.analysis?.smartSuggestions).map(s => stripLead(capStr(s, 700))).slice(0,3);
    while (smartSuggestions.length < 3) smartSuggestions.push("");

    // Bars & Score
    const barsIn = parsed?.analysis?.bars || {};
    const bars = {
      professionalism:  clamp(barsIn.professionalism),
      favorabilityIndex: clamp(barsIn.favorabilityIndex),
      deadlinePressure: clamp(barsIn.deadlinePressure),
      confidenceToSign: clamp(barsIn.confidenceToSign)
    };

    const scVal = clamp(parsed?.analysis?.scoreChecker?.value);
    const scBand = parsed?.analysis?.scoreChecker?.band || scoreBand(scVal);
    const scLine = parsed?.analysis?.scoreChecker?.line || scoreLine(scBand);
    const scVerdict = parsed?.analysis?.scoreChecker?.verdict || scoreVerdict(scBand);

    // Build translations (ensure object exists; if fast==true or missing, at least seed with detected language)
    let translations = parsed.translations && typeof parsed.translations === "object" ? parsed.translations : {};
    const pack = { summary: summaryArr, mainClauses, potentialIssues, smartSuggestions };

    // Seed detected language with pack if empty
    if (!translations[detectedLang]) translations[detectedLang] = pack;

    // Also always provide English fallback
    if (!translations.en) translations.en = pack;

    // Final normalized payload
    const normalized = {
      contractName: parsed.contractName || originalName || "Contract",
      contractTitle: title,
      role: roleOut,
      detectedLang,
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
      translations
    };

    return send(res, 200, normalized);
  } catch (e) {
    console.error("analyze error", e);
    return send(res, 500, { error: "Could not analyze this file. Try again or use another file." });
  }
};


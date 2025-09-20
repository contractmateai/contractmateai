// api/analyze.js — Serverless (Vercel/Netlify) JSON endpoint
// Env: OPENAI_API_KEY
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
    // body
    let raw = "";
    await new Promise((resolve) => { req.on("data", c => raw += c); req.on("end", resolve); });
    const ct = (req.headers["content-type"] || "").toLowerCase();
    if (!ct.includes("application/json")) return send(res, 415, { error: `Send application/json. Got: ${ct || "unknown"}` });

    let body = {};
    try { body = raw ? JSON.parse(raw) : {}; } catch { return send(res, 400, { error: "Invalid JSON body" }); }

    const { text = "", imageDataURI = "", originalName = "Contract", mime = "", role = "signer" } = body || {};
    if (!text && !imageDataURI) return send(res, 400, { error: "Provide either text or imageDataURI" });

    // ===== SYSTEM (compact, requires full per-language blocks incl. title) =====
    const system = `You are a contract analyst. Return STRICT JSON only (no prose) with this exact shape:

{
 "contractName":"string",
 "contractTitle":"string",
 "role":"signer|writer",
 "detectedLang":"en|it|de|es|fr|pt|nl|ro|sq|tr|ja|zh",
 "analysis":{
   "summary":["string","string","string"],
   "risk":{"value":0-100,"note":"string","band":"green|orange|red","safety":"generally safe|not that safe|not safe"},
   "clarity":{"value":0-100,"note":"string","band":"green|orange|red","safety":"safe|not that safe|not safe"},
   "mainClauses":["string","string","string","string","string"],
   "potentialIssues":["string","string","string","string","string"],
   "smartSuggestions":["string","string","string"],            // each ends with "e.g., …"
   "bars":{"professionalism":0-100,"favorabilityIndex":0-100,"deadlinePressure":0-100,"confidenceToSign":0-100},
   "scoreChecker":{"value":0-100,"band":"red|orange|green","verdict":"unsafe|safe|very safe","line":"string"}
 },
 "translations":{
   // Provide ALL languages with: title, summary[], mainClauses[], potentialIssues[], smartSuggestions[], riskNote, clarityNote
   "en":{"title":"","summary":[],"mainClauses":[],"potentialIssues":[],"smartSuggestions":[],"riskNote":"","clarityNote":""},
   "it":{"title":"","summary":[],"mainClauses":[],"potentialIssues":[],"smartSuggestions":[],"riskNote":"","clarityNote":""},
   "de":{"title":"","summary":[],"mainClauses":[],"potentialIssues":[],"smartSuggestions":[],"riskNote":"","clarityNote":""},
   "es":{"title":"","summary":[],"mainClauses":[],"potentialIssues":[],"smartSuggestions":[],"riskNote":"","clarityNote":""},
   "fr":{"title":"","summary":[],"mainClauses":[],"potentialIssues":[],"smartSuggestions":[],"riskNote":"","clarityNote":""},
   "pt":{"title":"","summary":[],"mainClauses":[],"potentialIssues":[],"smartSuggestions":[],"riskNote":"","clarityNote":""},
   "nl":{"title":"","summary":[],"mainClauses":[],"potentialIssues":[],"smartSuggestions":[],"riskNote":"","clarityNote":""},
   "ro":{"title":"","summary":[],"mainClauses":[],"potentialIssues":[],"smartSuggestions":[],"riskNote":"","clarityNote":""},
   "sq":{"title":"","summary":[],"mainClauses":[],"potentialIssues":[],"smartSuggestions":[],"riskNote":"","clarityNote":""},
   "tr":{"title":"","summary":[],"mainClauses":[],"potentialIssues":[],"smartSuggestions":[],"riskNote":"","clarityNote":""},
   "ja":{"title":"","summary":[],"mainClauses":[],"potentialIssues":[],"smartSuggestions":[],"riskNote":"","clarityNote":""},
   "zh":{"title":"","summary":[],"mainClauses":[],"potentialIssues":[],"smartSuggestions":[],"riskNote":"","clarityNote":""}
 }
}

Rules:
- Echo role.
- Contract title: infer a clean title (e.g., "Non-Disclosure Agreement") or derive from filename.
- Summary: 3–4 sentences TOTAL (array len 3–4).
- Thresholds: risk 0–25 green / 26–58 orange / 59–100 red; clarity 0–48 red / 49–77 orange / 78–100 green.
- Potential issues: up to 5, each 1–3 sentences.
- Smart suggestions: exactly 3 and each ends with "e.g., …" and a concrete example.
- Bars thresholds: prof/favor/conf 0–48 red,49–74 orange,75–100 green; deadline 0–35 green,36–68 orange,69–100 red.
- Score checker thresholds: 0–48 red,49–77 orange,78–100 green; verdict red="unsafe", orange="safe", green="very safe"; line red="The contract isnt done well", orange="The contract is done well", green="The contract is nearly perfectly done".
- Output VALID JSON only.`;

    const userContent = imageDataURI
      ? [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}\n\nOCR image(s) if needed, then analyze and translate per SYSTEM.` },
          { type: "image_url", image_url: { url: imageDataURI } }
        ]
      : [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}, mime: ${mime}\n\nAnalyze this contract text and translate as specified:\n${String(text).slice(0, 120000)}` }
        ];

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${SECRET}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: system }, { role: "user", content: userContent }],
        max_tokens: 1800 // keep latency down
      })
    });

    if (!resp.ok) {
      const errTxt = await resp.text().catch(() => "");
      console.error("OpenAI API error:", resp.status, errTxt);
      return send(res, 502, { error: "Upstream analysis failed" });
    }

    const data = await resp.json().catch(() => ({}));
    const content = data?.choices?.[0]?.message?.content || "{}";

    // ===== normalize =====
    let parsed = {};
    try { parsed = JSON.parse(content); } catch { parsed = {}; }

    const clamp = (v) => { v = Number(v || 0); return Math.max(0, Math.min(100, v)); };
    const bandRisk = v => (v <= 25 ? "green" : v <= 58 ? "orange" : "red");
    const bandClarity = v => (v >= 78 ? "green" : v >= 49 ? "orange" : "red");
    const scoreBand = v => (v <= 48 ? "red" : v <= 77 ? "orange" : "green");
    const capStr = (s, n) => (s || "").toString().trim().slice(0, n);
    const stripLead = (s) => String(s || "").replace(/^\s*\d+\s*[.)-]\s*/, "");

    const roleOut = parsed.role === "writer" ? "writer" : "signer";
    const title = parsed.contractTitle || parsed.contractName || originalName || "Contract";
    const lang  = parsed.detectedLang || "en";

    const summaryArr = (Array.isArray(parsed?.analysis?.summary) ? parsed.analysis.summary : [])
      .filter(Boolean).map(s => s.trim()).slice(0,4);

    const rVal  = clamp(parsed?.analysis?.risk?.value ?? parsed?.analysis?.risk);
    const rBand = parsed?.analysis?.risk?.band || bandRisk(rVal);
    const rNote = capStr(parsed?.analysis?.risk?.note || "", 280);

    const cVal  = clamp(parsed?.analysis?.clarity?.value ?? parsed?.analysis?.clarity);
    const cBand = parsed?.analysis?.clarity?.band || bandClarity(cVal);
    const cNote = capStr(parsed?.analysis?.clarity?.note || "", 280);

    const mainClauses = (parsed?.analysis?.mainClauses || []).filter(Boolean).map(s => stripLead(capStr(s, 900))).slice(0,5);
    const potentialIssues = (parsed?.analysis?.potentialIssues || []).filter(Boolean).map(s => stripLead(capStr(s, 1000))).slice(0,5);
    let smartSuggestions = (parsed?.analysis?.smartSuggestions || []).filter(Boolean).map(s => {
      let t = stripLead(capStr(s, 1000));
      if (!/\beg\.,/i.test(t)) t = t.replace(/\.\s*$/, "") + " e.g., …";
      return t;
    }).slice(0,3);
    while (smartSuggestions.length < 3) smartSuggestions.push("");

    const barsIn = parsed?.analysis?.bars || {};
    const bars = {
      professionalism:  clamp(barsIn.professionalism),
      favorabilityIndex: clamp(barsIn.favorabilityIndex),
      deadlinePressure: clamp(barsIn.deadlinePressure),
      confidenceToSign: clamp(barsIn.confidenceToSign)
    };

    const scVal = clamp(parsed?.analysis?.scoreChecker?.value);
    const scBand = parsed?.analysis?.scoreChecker?.band || scoreBand(scVal);
    const scLine = parsed?.analysis?.scoreChecker?.line ||
      (scBand === "green" ? "The contract is nearly perfectly done" :
       scBand === "orange" ? "The contract is done well" : "The contract isnt done well");
    const scVerdict = parsed?.analysis?.scoreChecker?.verdict ||
      (scBand === "green" ? "very safe" : scBand === "orange" ? "safe" : "unsafe");

    const LANGS = ["en","it","de","es","fr","pt","nl","ro","sq","tr","ja","zh"];
    const trIn = (parsed.translations && typeof parsed.translations === "object") ? parsed.translations : {};
    const normTr = {};
    LANGS.forEach(l=>{
      const seg = trIn[l] || {};
      normTr[l] = {
        title: typeof seg.title === "string" ? capStr(seg.title, 300) : undefined,
        summary: Array.isArray(seg.summary)? seg.summary.slice(0,4) : undefined,
        mainClauses: Array.isArray(seg.mainClauses)? seg.mainClauses.slice(0,5) : undefined,
        potentialIssues: Array.isArray(seg.potentialIssues)? seg.potentialIssues.slice(0,5) : undefined,
        smartSuggestions: Array.isArray(seg.smartSuggestions)? seg.smartSuggestions.slice(0,3) : undefined,
        riskNote: typeof seg.riskNote === "string" ? capStr(seg.riskNote, 280) : undefined,
        clarityNote: typeof seg.clarityNote === "string" ? capStr(seg.clarityNote, 280) : undefined
      };
    });

    const normalized = {
      contractName: parsed.contractName || originalName || "Contract",
      contractTitle: title,
      role: roleOut,
      detectedLang: lang,
      analysis: {
        summary: summaryArr,
        risk: { value: rVal, note: rNote, band: rBand, safety: rBand==="green"?"generally safe":rBand==="orange"?"not that safe":"not safe" },
        clarity: { value: cVal, note: cNote, band: cBand, safety: cBand==="green"?"safe":cBand==="orange"?"not that safe":"not safe" },
        mainClauses,
        potentialIssues,
        smartSuggestions,
        bars,
        scoreChecker: { value: scVal, band: scBand, verdict: scVerdict, line: scLine }
      },
      translations: normTr
    };

    return send(res, 200, normalized);
  } catch (e) {
    console.error("analyze error", e);
    return send(res, 500, { error: "Could not analyze this file. Try again or use another file." });
  }
};

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
    let raw = "";
    await new Promise((resolve) => { req.on("data", c => raw += c); req.on("end", resolve); });

    const ct = (req.headers["content-type"] || "").toLowerCase();
    if (!ct.includes("application/json")) {
      return send(res, 415, { error: `Send application/json. Got: ${ct || "unknown"}` });
    }

    let body = {};
    try { body = raw ? JSON.parse(raw) : {}; }
    catch { return send(res, 400, { error: "Invalid JSON body" }); }

    const { text = "", imageDataURI = "", originalName = "Contract", mime = "", role = "signer" } = body || {};
    if (!text && !imageDataURI) return send(res, 400, { error: "Provide either text or imageDataURI" });

    // ——— System prompt: return ONLY base analysis (fast). Translations handled by /api/translate.
    const system = `You are a contract analyst. Return STRICT JSON only — no prose or markdown — exactly:

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
    "smartSuggestions": ["string","string","string"],  // each ends with "e.g., …" + a concrete example
    "bars": { "professionalism": 0-100, "favorabilityIndex": 0-100, "deadlinePressure": 0-100, "confidenceToSign": 0-100 },
    "scoreChecker": { "value": 0-100, "band": "red|orange|green", "verdict": "unsafe|safe|very safe", "line": "string" }
  }
}

Rules:
- Echo user role.
- Infer a clean contractTitle.
- Summary: 3–4 sentences total (array).
- Risk thresholds: 0–25 green, 26–58 orange, 59–100 red (note ≤280 chars).
- Clarity thresholds: 0–48 red, 49–77 orange, 78–100 green (note ≤280 chars).
- Main clauses: up to 5 full sentences (no leading numbers/bullets).
- Potential issues: up to 5, each 1–3 sentences.
- Smart suggestions: exactly 3 and each must end with "e.g., …".
- Bars thresholds: prof/fav/conf 0–48 red, 49–74 orange, 75–100 green; deadline 0–35 green, 36–68 orange, 69–100 red.
- Score checker thresholds same as clarity; verdict red="unsafe", orange="safe", green="very safe"; line red="The contract isnt done well", orange="The contract is done well", green="The contract is nearly perfectly done".
- Output VALID JSON only. No extra text. Keep succinct.`;

    // User content (trim text for speed)
    const userContent = imageDataURI
      ? [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}\nOCR images if needed, then analyze per schema.` },
          { type: "image_url", image_url: { url: imageDataURI } }
        ]
      : [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}, mime: ${mime}\nAnalyze this contract text:\n${String(text).slice(0, 60000)}\nFollow the SYSTEM schema exactly.` }
        ];

    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${SECRET}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.15,
        top_p: 0.8,
        max_tokens: 950, // small + fast (translations are handled separately)
        response_format: { type: "json_object" },
        messages: [{ role: "system", content: system }, { role: "user", content: userContent }]
      })
    });

    if (!openaiResp.ok) {
      const errTxt = await openaiResp.text().catch(() => "");
      console.error("OpenAI API error:", openaiResp.status, errTxt);
      return send(res, 502, { error: "Upstream analysis failed" });
    }

    const data = await openaiResp.json().catch(() => ({}));
    let parsed = {};
    try { parsed = JSON.parse(data?.choices?.[0]?.message?.content || "{}"); } catch {}

    // Normalize + clamp
    const clamp = (v)=>{ v=Number(v||0); return Math.max(0, Math.min(100, v)); };
    const stripLead = s => String(s||"").replace(/^\s*\d+\s*[.)-]\s*/,"");
    const cap = (s,n)=>String(s||"").trim().slice(0,n);

    const barsIn = parsed?.analysis?.bars || {};
    const normalized = {
      contractName: parsed.contractName || originalName || "Contract",
      contractTitle: parsed.contractTitle || parsed.contractName || originalName || "Contract",
      role: parsed.role === "writer" ? "writer" : "signer",
      detectedLang: (parsed.detectedLang || "en").toLowerCase(),
      analysis: {
        summary: (parsed?.analysis?.summary||[]).slice(0,4),
        risk: { value: clamp(parsed?.analysis?.risk?.value), note: cap(parsed?.analysis?.risk?.note,280), band: parsed?.analysis?.risk?.band, safety: parsed?.analysis?.risk?.safety },
        clarity: { value: clamp(parsed?.analysis?.clarity?.value), note: cap(parsed?.analysis?.clarity?.note,280), band: parsed?.analysis?.clarity?.band, safety: parsed?.analysis?.clarity?.safety },
        mainClauses: (parsed?.analysis?.mainClauses||[]).map(s=>cap(stripLead(s),900)).slice(0,5),
        potentialIssues: (parsed?.analysis?.potentialIssues||[]).map(s=>cap(stripLead(s),1000)).slice(0,5),
        smartSuggestions: (parsed?.analysis?.smartSuggestions||[]).map(s=>{
          let t=cap(stripLead(s),1000); if(!/\beg\.,/i.test(t)) t=t.replace(/\.\s*$/,"")+" e.g., …"; return t;
        }).slice(0,3),
        bars: {
          professionalism:  clamp(barsIn.professionalism),
          favorabilityIndex: clamp(barsIn.favorabilityIndex),
          deadlinePressure:  clamp(barsIn.deadlinePressure),
          confidenceToSign:  clamp(barsIn.confidenceToSign)
        },
        scoreChecker: {
          value: clamp(parsed?.analysis?.scoreChecker?.value),
          band: parsed?.analysis?.scoreChecker?.band,
          verdict: parsed?.analysis?.scoreChecker?.verdict,
          line: parsed?.analysis?.scoreChecker?.line
        }
      }
    };

    return send(res, 200, normalized);
  } catch (e) {
    console.error("analyze error", e);
    return send(res, 500, { error: "Could not analyze this file. Try again or use another file." });
  }
};

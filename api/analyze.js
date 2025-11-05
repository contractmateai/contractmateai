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

    // --- System prompt ---
    const system = `You are a contract analyst. Return STRICT JSON only:

{
  "contractName": "string",
  "contractTitle": "string",
  "role": "signer|writer",
  "detectedLang": "en|it|de|es|fr|pt|nl|ro|sq|tr|ja|zh",
  "analysis": {
    "summary": ["string","string","string"],
    "risk": { "value": 0-100, "note": "string (<=280 chars)", "band": "green|orange|red", "safety": "generally safe|not that safe|not safe" },
    "clarity": { "value": 0-100, "note": "string (<=280 chars)", "band": "green|orange|red", "safety": "safe|not that safe|not safe" },
    "mainClauses": ["string","string","string","string","string"],
    "potentialIssues": ["string","string","string","string","string"],
    "smartSuggestions": [
      "Include governing law, e.g., 'This contract shall be governed by the laws of Italy.'",
      "Clarify opt-outs, e.g., 'Parties may opt-out of certain liability clauses.'",
      "Add dispute mechanism, e.g., 'Disputes resolved through arbitration in Vienna.'"
    ],
    "bars": { "professionalism": 0-100, "favorabilityIndex": 0-100, "deadlinePressure": 0-100, "confidenceToSign": 0-100 },
    "scoreChecker": { "value": 0-100, "band": "red|orange|green", "verdict": "unsafe|safe|very safe", "line": "string" }
  }
}

Rules:
- SUMMARY = 3 clear sentences.
- Smart Suggestions must be EXACTLY 3 and must include short “e.g.,” examples.
- scoreChecker.line MUST match verdict.
- No translations here. No extra explanations.`;

    // --- User content ---
    const userContent = imageDataURI
      ? [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}\nOCR if needed then analyze.` },
          { type: "image_url", image_url: { url: imageDataURI } }
        ]
      : [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}, mime: ${mime}\nAnalyze this contract:\n${String(text).slice(0, 110000)}` }
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
          temperature: 0.15,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: userContent }
          ]
        })
      });
    } catch (err) {
      return send(res, 500, { error: "OpenAI network error: " + err.message });
    }

    if (!openaiResp.ok) {
      const errTxt = await openaiResp.text().catch(() => "");
      return send(res, 502, { error: "OpenAI request failed: " + errTxt });
    }

    const resp = await openaiResp.json().catch(() => ({}));
    const content = resp?.choices?.[0]?.message?.content || "{}";

    let parsed = {};
    try { parsed = JSON.parse(content); }
    catch { return send(res, 500, { error: "Invalid JSON returned by model" }); }

    // --- Normalize ---
    const cap = (s, n) => (s || "").trim().slice(0, n);
    const clamp = (v) => Math.max(0, Math.min(100, Number(v || 0)));
    const stripLead = (s) => String(s || "").replace(/^\s*\d+\s*[.)-]\s*/, "");

    const mainClauses = (parsed?.analysis?.mainClauses || [])
      .filter(Boolean).map(s => stripLead(cap(s, 900))).slice(0,5);

    const potentialIssues = (parsed?.analysis?.potentialIssues || [])
      .filter(Boolean).map(s => stripLead(cap(s, 1000))).slice(0,5);

    const smartSuggestions = (parsed?.analysis?.smartSuggestions || [])
      .filter(Boolean).map(s => stripLead(cap(s, 250))).slice(0,3);

    // ✅ FIXED SCORE CHECKER HERE
    const scIn = parsed?.analysis?.scoreChecker || {};
    const scVal = clamp(scIn.value);
    let verdict =
      scVal < 34 ? "unsafe" :
      scVal < 67 ? "safe" :
      "very safe";

    let band =
      verdict === "unsafe" ? "red" :
      verdict === "safe" ? "orange" :
      "green";

    // ✅ Your new sentence
    const line = "Determines the overall score.";

    const normalized = {
      contractName: parsed.contractName || originalName || "Contract",
      contractTitle: parsed.contractTitle || parsed.contractName || originalName,
      role: parsed.role === "writer" ? "writer" : "signer",
      detectedLang: parsed.detectedLang || "en",

      analysis: {
        summary: Array.isArray(parsed?.analysis?.summary)
          ? parsed.analysis.summary.slice(0,3)
          : [],

        risk: {
          value: clamp(parsed?.analysis?.risk?.value),
          note: cap(parsed?.analysis?.risk?.note, 280),
          band,
          safety: parsed?.analysis?.risk?.safety || ""
        },

        clarity: {
          value: clamp(parsed?.analysis?.clarity?.value),
          note: cap(parsed?.analysis?.clarity?.note, 280),
          band,
          safety: parsed?.analysis?.clarity?.safety || ""
        },

        mainClauses,
        potentialIssues,
        smartSuggestions,

        bars: {
          professionalism: clamp(parsed?.analysis?.bars?.professionalism),
          favorabilityIndex: clamp(parsed?.analysis?.bars?.favorabilityIndex),
          deadlinePressure: clamp(parsed?.analysis?.bars?.deadlinePressure),
          confidenceToSign: clamp(parsed?.analysis?.bars?.confidenceToSign)
        },

        scoreChecker: { value: scVal, band, verdict, line }
      }
    };

    return send(res, 200, normalized);

  } catch (err) {
    return send(res, 500, { error: "Could not analyze this file. Details: " + err.message });
  }
}

// api/analyze.js — Vercel Serverless JSON endpoint (A1: fast base analysis only)
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

    // --- System prompt (tight + small to keep responses fast) ---
    const system = `You are a contract analyst. Return STRICT JSON only matching exactly this:

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
      "Start each item with a short instruction and end with a very short example using “e.g., …”. Keep each item concise like: 'Include governing law, e.g., “This contract shall be governed by the laws of Italy.”'",
      "Keep it concise like: 'Clarify opt-outs, e.g., “Parties may opt-out of certain liability clauses.”'",
      "Keep it concise like: 'Add arbitration seat, e.g., “Disputes resolved via arbitration in Vienna.”'"
    ],
    "bars": { "professionalism": 0-100, "favorabilityIndex": 0-100, "deadlinePressure": 0-100, "confidenceToSign": 0-100 },
    "scoreChecker": { "value": 0-100, "band": "red|orange|green", "verdict": "unsafe|safe|very safe", "line": "string (short, matches verdict)" }
  }
}

Rules:
- SUMMARY must be 3 sentences, clear and plain.
- smartSuggestions MUST be exactly 3 items, each concise and with an “e.g., …” example (very short).
- scoreChecker.line MUST match verdict (no positive line for unsafe).
- No translations here. Do NOT include any extra properties or prose.`;

    // --- User content ---
    const userContent = imageDataURI
      ? [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}\n\nOCR if needed then analyze.` },
          { type: "image_url", image_url: { url: imageDataURI } }
        ]
      : [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}, mime: ${mime}\n\nAnalyze this contract:\n${String(text).slice(0, 110000)}` }
        ];

    // --- OpenAI call (fast small model + low temperature) ---
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
    catch { return send(res, 500, { error: "Invalid JSON returned by model" }); }

    // --- Normalize (tight) ---
    const cap = (s, n) => (s || "").trim().slice(0, n);
    const clamp = (v) => Math.max(0, Math.min(100, Number(v || 0)));
    const stripLead = (s) => String(s || "").replace(/^\s*\d+\s*[.)-]\s*/, "");

    const mainClauses = (parsed?.analysis?.mainClauses || [])
      .filter(Boolean).map(s => stripLead(cap(s, 900))).slice(0,5);
    const potentialIssues = (parsed?.analysis?.potentialIssues || [])
      .filter(Boolean).map(s => stripLead(cap(s, 1000))).slice(0,5);
    const smartSuggestions = (parsed?.analysis?.smartSuggestions || [])
      .filter(Boolean).map(s => stripLead(cap(s, 220))).slice(0,3); // keep short, fits UI

    // score safety guard: ensure line matches verdict
    const scIn = parsed?.analysis?.scoreChecker || {};
    const scVal = clamp(scIn.value);
    let verdict = scIn.verdict || (scVal < 34 ? "unsafe" : scVal < 67 ? "safe" : "very safe");
    let band = verdict === "unsafe" ? "red" : verdict === "safe" ? "orange" : "green";
    let line;
    if (verdict === "unsafe") line = "This contract is unsafe. Review carefully before proceeding.";
    else if (verdict === "safe") line = "The contract is just safe. Address minor points if needed.";
    else line = "The contract appears solid with balanced terms.";

    const normalized = {
      contractName: parsed.contractName || originalName || "Contract",
      contractTitle: parsed.contractTitle || parsed.contractName || originalName || "Contract",
      role: parsed.role === "writer" ? "writer" : "signer",
      detectedLang: parsed.detectedLang || "en",
      analysis: {
        summary: Array.isArray(parsed?.analysis?.summary) ? parsed.analysis.summary.slice(0,3) : [],
        risk: {
          value: clamp(parsed?.analysis?.risk?.value),
          note: cap(parsed?.analysis?.risk?.note, 280),
          band: parsed?.analysis?.risk?.band || (clamp(parsed?.analysis?.risk?.value) <= 25 ? "green" : clamp(parsed?.analysis?.risk?.value) <= 58 ? "orange" : "red"),
          safety: parsed?.analysis?.risk?.safety || "generally safe"
        },
        clarity: {
          value: clamp(parsed?.analysis?.clarity?.value),
          note: cap(parsed?.analysis?.clarity?.note, 280),
          band: parsed?.analysis?.clarity?.band || (clamp(parsed?.analysis?.clarity?.value) >= 78 ? "green" : clamp(parsed?.analysis?.clarity?.value) >= 49 ? "orange" : "red"),
          safety: parsed?.analysis?.clarity?.safety || "safe"
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

    // Nothing else (no translations here)
    return send(res, 200, normalized);

  } catch (err) {
    console.error("Analyze error:", err);
    return send(res, 500, { error: "Could not analyze this file. Details: " + err.message });
  }
}

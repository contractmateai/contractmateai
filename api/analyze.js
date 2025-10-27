// api/analyze.js — Vercel serverless JSON endpoint
// Requires env: OPENAI_API_KEY
const SECRET = process.env.OPENAI_API_KEY;

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

export default async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!SECRET) return send(res, 500, { error: "Missing OPENAI_API_KEY" });

  // Toggle testing mode (set to false in production)
  const TESTING = false; // ⬅️ Set to false in production

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
    const { text = "", imageDataURI = "", originalName = "Contract", mime = "", role = "signer" } = body || {};
    if (!text && !imageDataURI && !TESTING) {
      return send(res, 400, { error: "Provide either text or imageDataURI" });
    }

    // Testing mode (returns mobile’s fake data, adapted to desktop schema)
    if (TESTING) {
      const fake = {
        contractName: "Non-Disclosure Agreement (NDA)",
        detectedLang: "en",
        analysis: {
          summary: [
            "This contract is generally favorable with low overall risk, but several timing and remedy definitions could be tightened to avoid avoidable confusion between the parties.\nPayment schedule and termination rights are presented in clear, plain language; still, a couple of legacy phrases can be simplified so non-lawyers can follow without re-reading.\nWatch late-fee compounding and define 'material breach' with an objective test so everyday admin delays don’t escalate into disputes."
          ],
          risk: 25,
          clarity: 80,
          compliance: 95,
          keyClauses: [
            "Payment Terms: Net 30 with 2% per month late fee; add a short grace period and a cap so charges remain predictable.",
            "Scope of Work: Deliverables listed in Schedule A; include acceptance criteria so approvals are objective.",
            "IP & Licensing: Client owns final assets; creator keeps tools, methods and pre-existing know-how.",
            "Termination: 30-day convenience; immediate for cause. Add a ten-day cure for minor issues to prevent accidental termination."
          ],
          potentialIssues: [
            "Late-fee compounding escalates costs on long delays; switch to simple interest with a reasonable cap to prevent outsized penalties.",
            "Indemnity is one-sided and uncapped; replace with mutual indemnity and add a commercial cap tied to fees for proportional risk.",
            "Undefined cure periods allow immediate termination for minor faults; add a standard 10-day cure for non-critical breaches.",
            "Ambiguous definition of “material breach” invites disputes; specify an objective test and carve-out for trivial delays.",
            "Scope changes lack a written change-order process; require signed amendments with impact on price/timeline captured."
          ],
          smartSuggestions: [
            "Add objective acceptance criteria and a short user-testing window for each milestone so sign-off is clear and quick.",
            "Insert a 5–7 day grace period before late fees accrue and convert compounding to simple interest with a total cap.",
            "Define “material breach” and include a standard ten-day cure (except for true emergencies) to minimize unnecessary escalations.",
            "Require written change-orders for scope changes to ensure clarity and agreement on price/timeline impacts."
          ]
        },
        translations: {
          en: {
            title: "Non-Disclosure Agreement (NDA)",
            summary: [
              "This contract is generally favorable with low overall risk, but several timing and remedy definitions could be tightened to avoid avoidable confusion between the parties.\nPayment schedule and termination rights are presented in clear, plain language; still, a couple of legacy phrases can be simplified so non-lawyers can follow without re-reading.\nWatch late-fee compounding and define 'material breach' with an objective test so everyday admin delays don’t escalate into disputes."
            ],
            keyClauses: [
              "Payment Terms: Net 30 with 2% per month late fee; add a short grace period and a cap so charges remain predictable.",
              "Scope of Work: Deliverables listed in Schedule A; include acceptance criteria so approvals are objective.",
              "IP & Licensing: Client owns final assets; creator keeps tools, methods and pre-existing know-how.",
              "Termination: 30-day convenience; immediate for cause. Add a ten-day cure for minor issues to prevent accidental termination."
            ],
            potentialIssues: [
              "Late-fee compounding escalates costs on long delays; switch to simple interest with a reasonable cap to prevent outsized penalties.",
              "Indemnity is one-sided and uncapped; replace with mutual indemnity and add a commercial cap tied to fees for proportional risk.",
              "Undefined cure periods allow immediate termination for minor faults; add a standard 10-day cure for non-critical breaches.",
              "Ambiguous definition of “material breach” invites disputes; specify an objective test and carve-out for trivial delays.",
              "Scope changes lack a written change-order process; require signed amendments with impact on price/timeline captured."
            ],
            smartSuggestions: [
              "Add objective acceptance criteria and a short user-testing window for each milestone so sign-off is clear and quick.",
              "Insert a 5–7 day grace period before late fees accrue and convert compounding to simple interest with a total cap.",
              "Define “material breach” and include a standard ten-day cure (except for true emergencies) to minimize unnecessary escalations.",
              "Require written change-orders for scope changes to ensure clarity and agreement on price/timeline impacts."
            ]
          }
          // Add other languages (it, de, es, fr, pt, nl, ro, sq, tr, zh, ja) as needed
        }
      };
      return send(res, 200, fake);
    }

    // System prompt (desktop’s strict schema)
    const system = `You are a contract analyst. Return STRICT JSON only — no prose or markdown — matching EXACTLY this schema:
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
      "title": "string",
      "summary": ["string"],
      "keyClauses": ["string"],
      "potentialIssues": ["string"],
      "smartSuggestions": ["string"]
    }
  }
}
LENGTH RULES:
- summary[0] length = 540–660 chars; at least 4 sentences with "\\n" between them; end with a complete sentence.
- keyClauses length = 4 items; each 152 chars EXACTLY.
- potentialIssues length = 5 items; each 104 chars EXACTLY.
- smartSuggestions length = 4 items; lengths [139, 161, 284, 123] chars respectively.
CLOSURE & STYLE:
- All items end with a complete sentence and punctuation (., ?, !).
- No numbers, bullets, or labels in clauses; no repetition.
- Synthesize plausible legal content if text is short.
QUALITY:
- Analysis in detected language; translations for en, it, de, es, fr, pt, nl, ro, sq, tr, zh, ja.
- Numbers (risk, clarity, compliance) consistent across languages.`;

    // User content
    const userContent = imageDataURI
      ? [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}\n\nOCR the contract image(s) if needed, then analyze. Follow the SYSTEM schema exactly.` },
          { type: "image_url", image_url: { url: imageDataURI } }
        ]
      : [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}, mime: ${mime}\n\nAnalyze this contract text:\n${String(text).slice(0, 200000)}\n\nFollow the SYSTEM schema and constraints exactly.` }
        ];

    // OpenAI call
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET}`,
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
      return send(res, 502, { error: "Upstream analysis failed: " + errTxt });
    }

    const resp = await openaiResp.json().catch(() => ({}));
    const content = resp?.choices?.[0]?.message?.content || "{}";

    // Parse and normalize
    let parsed = {};
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      return send(res, 500, { error: "Invalid JSON response from analysis" });
    }

    const normalized = {
      contractName: parsed.contractName || originalName,
      detectedLang: parsed.detectedLang || "en",
      analysis: {
        summary: Array.isArray(parsed.analysis?.summary) ? parsed.analysis.summary : [String(parsed.analysis?.summary || "")],
        risk: Math.max(0, Math.min(100, Number(parsed.analysis?.risk || 0))),
        clarity: Math.max(0, Math.min(100, Number(parsed.analysis?.clarity || 0))),
        compliance: Math.max(0, Math.min(100, Number(parsed.analysis?.compliance || 0))),
        keyClauses: Array.isArray(parsed.analysis?.keyClauses) ? parsed.analysis.keyClauses : [],
        potentialIssues: Array.isArray(parsed.analysis?.potentialIssues) ? parsed.analysis.potentialIssues : [],
        smartSuggestions: Array.isArray(parsed.analysis?.smartSuggestions) ? parsed.analysis.smartSuggestions : []
      },
      translations: (() => {
        const trIn = parsed.translations || {};
        const trOut = {};
        for (const code of Object.keys(trIn)) {
          const pack = trIn[code] || {};
          trOut[code] = {
            title: String(pack.title || ""),
            summary: Array.isArray(pack.summary) ? pack.summary : [String(pack.summary || "")],
            keyClauses: Array.isArray(pack.keyClauses) ? pack.keyClauses : [],
            potentialIssues: Array.isArray(pack.potentialIssues) ? pack.potentialIssues : [],
            smartSuggestions: Array.isArray(pack.smartSuggestions) ? pack.smartSuggestions : []
          };
        }
        return trOut;
      })()
    };

    return send(res, 200, normalized);
  } catch (e) {
    console.error("Analyze error:", e.message);
    return send(res, 500, { error: "Could not analyze this file. Try again or use another file. Details: " + e.message });
  }
};

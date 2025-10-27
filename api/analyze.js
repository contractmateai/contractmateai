// api/analyze.js — Final unified production endpoint for SignSense
// Requires: OPENAI_API_KEY (Vercel env)

const SECRET = process.env.OPENAI_API_KEY;

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

export default async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!SECRET) return send(res, 500, { error: "Missing OPENAI_API_KEY" });

  try {
    let raw = "";
    await new Promise(resolve => {
      req.on("data", c => (raw += c));
      req.on("end", resolve);
    });

    let body = {};
    try {
      body = JSON.parse(raw || "{}");
    } catch {
      return send(res, 400, { error: "Invalid JSON body" });
    }

    const { files = [], role = "signer", mode = "desktop" } = body || {};
    const text = files?.[0]?.text || "";
    const imageDataURI = files?.[0]?.imageDataURI || "";
    const originalName = files?.[0]?.name || "Contract";
    const mime = files?.[0]?.mime || "";

    if (!text && !imageDataURI) {
      return send(res, 400, { error: "No contract content found" });
    }

    // ========== PROMPTS ==========
    const systemDesktop = `
You are a contract analyst. Return STRICT JSON only — matching EXACTLY this schema:

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

Follow these LENGTH and QUALITY RULES strictly:

SUMMARY RULES:
- One string only, containing 4–5 full sentences separated by "\\n"
- Each summary must be between 540–660 characters.
- No bullets, no numbering, no repetition, no filler.

KEY CLAUSES:
- Exactly 4 items.
- Each clause must be 152 characters exactly.
- Each is a plain grammatical sentence (no numbers or labels).

POTENTIAL ISSUES:
- Exactly 5 items.
- Each issue must be 104 characters exactly.
- Must be distinct, concise, and complete sentences.

SMART SUGGESTIONS:
- Exactly 4 items with strict lengths: [139, 161, 284, 123] characters respectively.
- All must be complete grammatical sentences without redundancy.

QUALITY RULES:
- No markdown, no commentary, no “...” padding.
- Each list item ends with correct punctuation.
- If input text is short, synthesize realistic legal material to meet constraints.
- The 'analysis' is in the detected original language.
- Provide translations for: en, it, de, es, fr, pt, nl, ro, sq, tr, zh, ja.
- Risk, clarity, compliance values: 0–100. Use integers.
- Numbers remain the same across all languages.
`;

    const systemMobile = `
You are a legal contract analyzer for a compact mobile UI. Return ONLY valid JSON exactly matching:

{
  "summary": ["string"],
  "risk": { "value": number, "note": "string" },
  "clarity": { "value": number, "note": "string" },
  "clauses": ["string"],
  "issues": ["string"],
  "suggestions": ["string"],
  "meters": {
    "professionalism": number,
    "confidence": number,
    "favorability": number,
    "deadline": number
  }
}

Rules:
- summary: 3–5 concise sentences (<= 32 words each)
- risk/clarity values: 0–100, notes <= 30 words
- lists: 3–6 items, <= 28 words each
- meters: all 0–100 integers
Output ONLY valid JSON, no prose or comments.`;

    const userPrompt =
      mode === "mobile"
        ? `Analyze this contract for mobile format and follow the system schema exactly:\n"""${text || ""}"""`
        : `Analyze this contract text for full desktop schema. Role: ${role}\nOriginal file: ${originalName}, mime: ${mime}\n"""${text || ""}"""`;

    const systemPrompt = mode === "mobile" ? systemMobile : systemDesktop;

    // ========== CALL OPENAI ==========
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
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    if (!openaiResp.ok) {
      const errTxt = await openaiResp.text().catch(() => "");
      console.error("OpenAI API error:", openaiResp.status, errTxt);
      return send(res, 502, { error: "OpenAI API failed", details: errTxt });
    }

    const data = await openaiResp.json().catch(() => ({}));
    const raw = data?.choices?.[0]?.message?.content || "{}";
    let parsed = {};
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("JSON parse error:", e, raw);
      return send(res, 500, { error: "Invalid JSON from OpenAI" });
    }

    return send(res, 200, parsed);
  } catch (e) {
    console.error("Fatal analyze error:", e);
    return send(res, 500, { error: "Internal Server Error", details: e.message });
  }
};

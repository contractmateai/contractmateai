// /pages/api/analyze.js  (or /api/analyze.js on Vercel)
// Node 18+ runtime

export default async function handler(req, res) {
  // Basic CORS for your static site
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.status(204).end();
  }
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Toggle testing mode here
  const TESTING = true; // ⬅️ set to false in production

  try {
    const { text } = req.body || {};
    if (!text && !TESTING) {
      return res.status(400).json({ error: "Missing 'text' in request body." });
    }

    // ---------- Testing mode (no cost) ----------
    if (TESTING) {
      const fake = {
        summary: [
          "This contract is generally favorable with low overall risk, but several timing and remedy definitions should be tightened.",
          "Payment terms and termination rights are clear, yet a few legacy phrases can be simplified for non-lawyers.",
          "Define “material breach” objectively and control late-fee compounding to avoid disputes."
        ],
        risk: { value: 25, note: "Termination, dispute handling and scope changes need to be tightened a bit better." },
        clarity: { value: 80, note: "Some provisions are thin on definitions which reduces predictability in changes." },
        clauses: [
          "Payment Terms: Net 30; add short grace period and a cap on late fees.",
          "Scope: Deliverables in Schedule A; include objective acceptance criteria.",
          "IP & Licensing: Client owns final assets; creator retains pre-existing know-how.",
          "Termination: 30-day convenience; add 10-day cure for minor issues.",
          "Confidentiality: Standard carve-outs; reasonable survival period."
        ],
        issues: [
          "Compounding late fees can escalate costs; use simple interest with a cap.",
          "Indemnity is one-sided; replace with mutual indemnity and a commercial cap.",
          "No defined cure periods for minor breaches; add a standard 10-day cure."
        ],
        suggestions: [
          "Add objective test for 'material breach' and carve-out for trivial delays.",
          "Insert 5–7 day grace period before late fees accrue and cap total fees.",
          "Define milestone acceptance and a short user-testing window."
        ],
        meters: { professionalism: 95, confidence: 75, favorability: 75, deadline: 18 }
      };
      return res.status(200).json(fake);
    }

    // ---------- Real API call ----------
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    // Prompt asks for the exact shape your UI expects.
    const prompt = `
You are a contract analyst. Return ONLY a strict JSON object with this exact shape and constraints:

{
  "summary": string[] (3-5 short bullets, <= 32 words each),
  "risk": { "value": number (0-100), "note": string (<= 30 words) },
  "clarity": { "value": number (0-100), "note": string (<= 30 words) },
  "clauses": string[] (3-8 items, <= 28 words each),
  "issues": string[] (3-8 items, <= 28 words each),
  "suggestions": string[] (3-8 items, <= 28 words each),
  "meters": {
    "professionalism": number (0-100),
    "confidence": number (0-100),
    "favorability": number (0-100),
    "deadline": number (0-100)
  }
}

Analyze the following contract text:

"""${text || ""}"""
`.trim();

    // Using Chat Completions with JSON response format (widely supported).
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // light + cheap; switch to a larger model if you want
        response_format: { type: "json_object" },
        temperature: 0.2,
        messages: [
          { role: "system", content: "You are a precise legal contract analyzer. Output only valid JSON per the schema." },
          { role: "user", content: prompt }
        ]
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      return res.status(502).json({
        error: "OpenAI API Error",
        details: data?.error?.message || "Unknown error",
      });
    }

    // Parse JSON safely
    let parsed;
    try {
      const content = data?.choices?.[0]?.message?.content || "{}";
      parsed = JSON.parse(content);
    } catch (e) {
      return res.status(500).json({ error: "Failed to parse model JSON." });
    }

    // ---------- Minimal validation / clamping ----------
    const clamp = (n) => Math.max(0, Math.min(100, Number.isFinite(+n) ? +n : 0));
    const arr = (v) => Array.isArray(v) ? v.map(x => String(x)).filter(Boolean) : [];

    const out = {
      summary: arr(parsed.summary).slice(0, 5),
      risk: {
        value: clamp(parsed?.risk?.value),
        note: String(parsed?.risk?.note || "")
      },
      clarity: {
        value: clamp(parsed?.clarity?.value),
        note: String(parsed?.clarity?.note || "")
      },
      clauses: arr(parsed.clauses).slice(0, 8),
      issues: arr(parsed.issues).slice(0, 8),
      suggestions: arr(parsed.suggestions).slice(0, 8),
      meters: {
        professionalism: clamp(parsed?.meters?.professionalism),
        confidence:      clamp(parsed?.meters?.confidence),
        favorability:    clamp(parsed?.meters?.favorability),
        deadline:        clamp(parsed?.meters?.deadline)
      }
    };

    return res.status(200).json(out);
  } catch (error) {
    console.error("🔥 analyze error:", error);
    return res.status(500).json({ error: "Failed to analyze contract", details: error?.message || String(error) });
  }
}

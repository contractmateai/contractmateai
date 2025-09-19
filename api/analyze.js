// api/analyze.js — ZERO dependencies; expects JSON { text?, imageDataURI?, originalName?, mime?, role? }
const SECRET = process.env.OPENAI_API_KEY;

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

module.exports = async (req, res) => {
  // Basic CORS (safe to keep even if same-origin)
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

    // Content-Type guard to avoid JSON.parse on multipart/form-data (which caused your previous error)
    const ct = (req.headers["content-type"] || "").toLowerCase();
    if (!ct.includes("application/json")) {
      return send(res, 415, { error: `Send application/json. Got: ${ct || "unknown"}` });
    }

    let body = {};
    try {
      body = raw ? JSON.parse(raw) : {};
    } catch (e) {
      return send(res, 400, { error: "Invalid JSON body" });
    }

    const { text = "", imageDataURI = "", originalName = "Contract", mime = "", role = "signer" } = body || {};
    if (!text && !imageDataURI) {
      return send(res, 400, { error: "Provide either text or imageDataURI" });
    }

    const system = `You analyze contracts. Return strictly valid JSON with:
{
  "summary": string,
  "scores": { "risk": 0-100, "clarity": 0-100, "compliance": 0-100 },
  "keyClauses": string[],
  "potentialIssues": string[],
  "smartSuggestions": string[]
}
Be concise, avoid legalese, and tailor suggestions to the user's role: "${role}".`;

    const userContent = imageDataURI
      ? [
          { type: "text", text: `Analyze this contract image (${originalName}). Extract readable text if needed and then analyze.` },
          { type: "image_url", image_url: { url: imageDataURI } }
        ]
      : [
          { type: "text", text: `Analyze this contract text (${originalName}, ${mime}):\n\n${String(text).slice(0, 200000)}` }
        ];

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

    // Parse model JSON (fall back to safe defaults)
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        summary: "",
        scores: { risk: 0, clarity: 0, compliance: 0 },
        keyClauses: [],
        potentialIssues: [],
        smartSuggestions: [],
        _raw: content
      };
    }

    // ✨ Normalize to what the frontend expects
    const normalized = {
      contractName: originalName || "Contract",
      detectedLang: "en", // You can plug in real detection later if you want
      analysis: {
        summary: parsed.summary || "",
        risk: Number(parsed.scores?.risk ?? 0) || 0,
        clarity: Number(parsed.scores?.clarity ?? 0) || 0,
        compliance: Number(parsed.scores?.compliance ?? 0) || 0,
        keyClauses: Array.isArray(parsed.keyClauses) ? parsed.keyClauses : [],
        potentialIssues: Array.isArray(parsed.potentialIssues) ? parsed.potentialIssues : [],
        smartSuggestions: Array.isArray(parsed.smartSuggestions) ? parsed.smartSuggestions : []
      },
      translations: {}
    };

    return send(res, 200, normalized);
  } catch (e) {
    console.error("analyze error", e);
    return send(res, 500, { error: "Could not analyze this file. Try again or use another file." });
  }
};


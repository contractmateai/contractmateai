// api/analyze.js  — NO external deps, works without package.json
// Accepts JSON { text?: string, imageDataURI?: string, originalName?: string, mime?: string }
// Returns JSON analysis.

const SECRET = process.env.OPENAI_API_KEY;

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!SECRET) return send(res, 500, { error: "Missing OPENAI_API_KEY" });

  try {
    // read raw body
    let raw = "";
    await new Promise((resolve) => {
      req.on("data", (c) => (raw += c));
      req.on("end", resolve);
    });

    const body = raw ? JSON.parse(raw) : {};
    const { text, imageDataURI, originalName, mime } = body || {};

    const system = `You analyze contracts. Return strictly valid JSON with:
{
  "summary": string,
  "scores": { "risk": 0-100, "clarity": 0-100, "compliance": 0-100 },
  "keyClauses": string[],
  "potentialIssues": string[],
  "smartSuggestions": string[]
}`;

    const userContent = imageDataURI
      ? [
          { type: "text", text: `Analyze this contract image (${originalName || ""}).` },
          { type: "image_url", image_url: { url: imageDataURI } }
        ]
      : [
          { type: "text", text: `Analyze this contract text (${originalName || ""}, ${mime || ""}):\n\n${(text || "").slice(0, 200000)}` }
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

    const data = await openaiResp.json();
    const content = data?.choices?.[0]?.message?.content || "{}";

    let parsed;
    try { parsed = JSON.parse(content); }
    catch { parsed = { summary: "", scores: { risk: 0, clarity: 0, compliance: 0 }, keyClauses: [], potentialIssues: [], smartSuggestions: [], _raw: content }; }

    return send(res, 200, { ok: true, data: parsed });
  } catch (e) {
    console.error("analyze error", e);
    return send(res, 500, { ok: false, error: "Could not analyze this file. Try again or use another file." });
  }
};

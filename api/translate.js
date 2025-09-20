// api/translate.js — translate ONE language on demand
// Body: { target: "ja"|"de"|..., source: "en"|..., title, summary[], mainClauses[], potentialIssues[], smartSuggestions[], riskNote, clarityNote }
// Returns { title, summary[], mainClauses[], potentialIssues[], smartSuggestions[], riskNote, clarityNote }
const SECRET = process.env.OPENAI_API_KEY;

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!SECRET) return send(res, 500, { error: "Missing OPENAI_API_KEY" });

  try {
    let raw = "";
    await new Promise((resolve)=>{ req.on("data", c=>raw+=c); req.on("end", resolve); });
    let body = {};
    try { body = raw ? JSON.parse(raw) : {}; } catch { return send(res, 400, { error: "Invalid JSON" }); }

    const {
      target = "en",
      source = "en",
      title = "",
      summary = [],
      mainClauses = [],
      potentialIssues = [],
      smartSuggestions = [],
      riskNote = "",
      clarityNote = ""
    } = body || {};

    const system = `You are a precise legal translator. Output STRICT JSON only, no commentary.
Translate from ${source} to ${target}. Preserve meaning, tone, and list lengths. Do NOT shorten or paraphrase away details.
Schema:
{
  "title": "string",
  "summary": ["string", "..."],
  "mainClauses": ["string", "..."],
  "potentialIssues": ["string", "..."],
  "smartSuggestions": ["string", "..."],  // keep "e.g., ..." parts intact and grammatically correct
  "riskNote": "string",
  "clarityNote": "string"
}`;

    const user = {
      title,
      summary,
      mainClauses,
      potentialIssues,
      smartSuggestions,
      riskNote,
      clarityNote
    };

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${SECRET}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.1,
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify(user) }
        ]
      })
    });

    if (!resp.ok) {
      const txt = await resp.text().catch(()=> "");
      console.error("translate error", resp.status, txt);
      return send(res, 502, { error: "Translation upstream failed" });
    }

    let out = {};
    try { out = JSON.parse((await resp.json())?.choices?.[0]?.message?.content || "{}"); } catch {}
    return send(res, 200, out);
  } catch (e) {
    console.error("translate error", e);
    return send(res, 500, { error: "Could not translate" });
  }
};

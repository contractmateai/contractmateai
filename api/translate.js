// api/translate.js - On-demand translation endpoint

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

export default async function handler(req, res) {
  const SECRET = process.env.OPENAI_API_KEY;

  // CORS + METHOD HANDLING
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "POST")
    return send(res, 405, { error: "Method not allowed" });
  if (!SECRET) return send(res, 500, { error: "Missing OPENAI_API_KEY" });

  try {
    // Support both Express (req.body) and Vercel serverless (stream reading)
    let body = req.body;

    if (!body || typeof body !== "object") {
      let raw = "";
      await new Promise((resolve, reject) => {
        req.on("data", (c) => (raw += c));
        req.on("end", resolve);
        req.on("error", reject);
      });

      const ct = (req.headers["content-type"] || "").toLowerCase();
      if (!ct.includes("application/json")) {
        return send(res, 415, { error: `Send application/json. Got: ${ct}` });
      }

      try {
        body = raw ? JSON.parse(raw) : {};
      } catch (err) {
        return send(res, 400, { error: "Invalid JSON body" });
      }
    }

    const { targetLang = "en", content = {} } = body || {};

    if (!content || Object.keys(content).length === 0) {
      return send(res, 400, { error: "Provide content to translate" });
    }

    // Construct translation prompt
    const prompt = `Translate the following contract analysis content to ${targetLang.toUpperCase()}. Return ONLY valid JSON with this exact structure:
{
  "summary": ["sentence1", "sentence2", "sentence3"],
  "mainClauses": ["clause1", "clause2", "clause3", "clause4", "clause5"],
  "potentialIssues": ["issue1", "issue2", "issue3", "issue4", "issue5"],
  "smartSuggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "riskNote": "translated risk note",
  "clarityNote": "translated clarity note",
  "scoreLine": "translated score line"
}

IMPORTANT RULES:
- Maintain the same meaning and tone
- Keep technical terms accurate
- For German: be concise (10-15 chars shorter)
- Preserve all array lengths
- Return valid JSON only

Original content to translate:
${JSON.stringify(content, null, 2)}`;

    // Call OpenAI
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let openaiResp;
    try {
      openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SECRET}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.3,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are a professional translator. Return only valid JSON with the exact structure requested.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });
      clearTimeout(timeoutId);
    } catch (err) {
      clearTimeout(timeoutId);
      const msg =
        err.name === "AbortError" ? "Request timeout (>30s)" : err.message;
      return send(res, 500, { error: "OpenAI error: " + msg });
    }

    if (!openaiResp.ok) {
      const errTxt = await openaiResp.text().catch(() => "");
      return send(res, 502, { error: "OpenAI request failed: " + errTxt });
    }

    let parsed = {};
    try {
      const resp = await openaiResp.json();
      const content = resp?.choices?.[0]?.message?.content || "{}";
      parsed = JSON.parse(content);
    } catch (err) {
      return send(res, 500, {
        error: "Invalid JSON returned by model: " + err.message,
      });
    }

    // Return translated content
    return send(res, 200, {
      targetLang,
      translation: parsed,
    });
  } catch (err) {
    return send(res, 500, {
      error: "Could not translate content. Details: " + err.message,
    });
  }
}

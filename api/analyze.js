export default async function handler(req, res) {
  if (req.method !== "POST") { 
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Toggle testing mode here
  const testing = true; // ⬅️ Set to false to use real OpenAI API

  try {
    const { text } = req.body;

    if (testing) {
      // ✅ Fake response for testing (no cost)
      const fakeResponse = {
        summary: "This contract outlines a service agreement between two parties, detailing payment terms, responsibilities, and confidentiality.",
        risk: 25,
        clarity: 80,
        compliance: 90,
        keyClauses: [
          "Payment due within 30 days",
          "Work-for-hire clause",
          "Non-disclosure agreement"
        ],
        potentialIssues: [
          "No clause for late payment penalties",
          "Termination terms are vague"
        ],
        smartSuggestions: [
          "Add clear termination conditions",
          "Include a late payment fee clause",
          "Specify deliverable milestones"
        ]
      };
      return res.status(200).json(fakeResponse);
    }

    // ✅ Real API call when not testing
    const openaiKey = process.env.OPENAI_API_KEY;
    console.log("🔑 ENV KEY:", openaiKey ? "✅ Exists" : "❌ Missing");

    if (!openaiKey) {
      return res.status(500).json({ error: "Missing OpenAI API Key" });
    }

    const prompt = `
    Analyze this contract and return only valid JSON in this format:
    {
      "summary": string,
      "risk": number (0-100),
      "clarity": number (0-100),
      "compliance": number (0-100),
      "keyClauses": array of strings,
      "potentialIssues": array of strings,
      "smartSuggestions": array of strings
    }

    Contract:
    """${text}"""
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a legal contract analyzer. Only respond with pure JSON. No markdown. No code blocks."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("🔥 OpenAI Error Response:", data);
      return res.status(500).json({
        error: "OpenAI API Error",
        details: data?.error?.message || "Unknown error from OpenAI",
      });
    }

    const content = data?.choices?.[0]?.message?.content || "";

    // Extract JSON from response
    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}");
    const cleanJson = content.substring(jsonStart, jsonEnd + 1);

    const parsed = JSON.parse(cleanJson);

    res.status(200).json(parsed);
  } catch (error) {
    console.error("🔥 Error details:", error);
    res.status(500).json({
      error: "Failed to analyze contract",
      details: error.message,
    });
  }
}


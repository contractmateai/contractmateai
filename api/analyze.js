// pages/api/analyze.js
import formidable from "formidable";
import fs from "fs";
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // <-- Add your key in Vercel later
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse uploaded file
    const form = new formidable.IncomingForm();
    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const file = data.files.file[0];
    const fileText = fs.readFileSync(file.filepath, "utf-8");

    // Send to OpenAI
    const prompt = `
Analyze this contract text and return JSON with:
- summary (3 bullet points),
- risk (0-100),
- clarity (0-100),
- compliance (0-100),
- keyClauses (array),
- potentialIssues (array),
- smartSuggestions (array).

Contract:
"""${fileText}"""
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a legal assistant. Respond ONLY with valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const resultText = response.choices[0].message.content.trim();

    // Return parsed JSON
    return res.status(200).json(JSON.parse(resultText));
  } catch (err) {
    console.error("Error analyzing contract:", err);
    return res.status(500).json({ error: "Failed to analyze file" });
  }
}

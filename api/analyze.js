import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false, // required for formidable
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // <-- make sure this is set in Vercel
});

// Helper to extract JSON safely
function extractJSON(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Invalid JSON response");
  return JSON.parse(text.slice(start, end + 1));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("🔹 API request received");

    // Parse uploaded file
    const form = new formidable.IncomingForm();
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    if (!files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const filePath = file.filepath;
    const fileName = file.originalFilename.toLowerCase();

    console.log("📂 Uploaded file:", fileName);

    // --- Step 1: Extract text from file ---
    let fileText = "";
    if (fileName.endsWith(".pdf")) {
      console.log("🔹 Parsing PDF...");
      const pdfBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(pdfBuffer);
      fileText = pdfData.text;
    } else if (fileName.endsWith(".docx")) {
      console.log("🔹 Parsing DOCX...");
      const docBuffer = fs.readFileSync(filePath);
      const docResult = await mammoth.extractRawText({ buffer: docBuffer });
      fileText = docResult.value;
    } else if (fileName.endsWith(".txt")) {
      console.log("🔹 Parsing TXT...");
      fileText = fs.readFileSync(filePath, "utf-8");
    } else {
      return res.status(400).json({ error: "Unsupported file type. Please upload PDF, DOCX, or TXT." });
    }

    if (!fileText.trim()) {
      console.error("❌ Extracted text is empty!");
      return res.status(400).json({ error: "No readable text found in this file" });
    }

    console.log("✅ Extracted text length:", fileText.length);

    // --- Step 2: Build prompt for OpenAI ---
    const prompt = `
Analyze the following contract text and return ONLY JSON with these fields:
{
  "summary": ["3 short bullet points"],
  "risk": 0-100,
  "clarity": 0-100,
  "compliance": 0-100,
  "keyClauses": ["important clause 1", "important clause 2"],
  "potentialIssues": ["issue 1", "issue 2"],
  "smartSuggestions": ["suggestion 1", "suggestion 2"]
}

Contract:
"""${fileText.slice(0, 8000)}"""
`;

    // --- Step 3: Send to OpenAI ---
    console.log("🔹 Sending to OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a legal contract analyzer. Respond ONLY with JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const resultText = response.choices[0].message.content.trim();
    console.log("🔹 OpenAI response:", resultText);

    let parsedResult;
    try {
      parsedResult = extractJSON(resultText);
    } catch (err) {
      console.error("❌ JSON parse error:", err.message);
      return res.status(500).json({ error: "Invalid JSON from AI", raw: resultText });
    }

    // --- Step 4: Return data to frontend ---
    return res.status(200).json({
      contractName: file.originalFilename,
      detectedLang: "en",
      analysis: parsedResult,
    });
  } catch (err) {
    console.error("🔥 Server error:", err);
    return res.status(500).json({ error: "Failed to analyze file", details: err.message });
  }
}

import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractJSON(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Invalid JSON response");
  return JSON.parse(text.slice(start, end + 1));
}

export default async function handler(req, res) {
  console.log("📩 Incoming request...");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = new formidable.IncomingForm();
    const { files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    if (!files.file) {
      console.error("❌ No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    const filePath = file.filepath;
    const fileName = file.originalFilename.toLowerCase();

    console.log("📂 Uploaded file:", fileName);

    // Extract text
    let fileText = "";
    if (fileName.endsWith(".pdf")) {
      console.log("Parsing PDF...");
      const pdfBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(pdfBuffer);
      fileText = pdfData.text;
    } else if (fileName.endsWith(".docx")) {
      console.log("Parsing DOCX...");
      const docBuffer = fs.readFileSync(filePath);
      const docResult = await mammoth.extractRawText({ buffer: docBuffer });
      fileText = docResult.value;
    } else if (fileName.endsWith(".txt")) {
      console.log("Parsing TXT...");
      fileText = fs.readFileSync(filePath, "utf-8");
    } else {
      console.error("❌ Unsupported file type:", fileName);
      return res.status(400).json({ error: "Unsupported file type" });
    }

    if (!fileText.trim()) {
      console.error("❌ Extracted text is empty!");
      return res.status(400).json({ error: "No readable text found" });
    }

    console.log("✅ Extracted text length:", fileText.length);

    // Send to OpenAI
    console.log("🔹 Sending to OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a legal contract analyzer. Respond ONLY with JSON.",
        },
        {
          role: "user",
          content: `
Analyze the following contract and return ONLY JSON:
{
  "summary": ["3 bullet points"],
  "risk": 0-100,
  "clarity": 0-100,
  "compliance": 0-100,
  "keyClauses": [],
  "potentialIssues": [],
  "smartSuggestions": []
}
Contract:
"""${fileText.slice(0, 8000)}"""
          `,
        },
      ],
      temperature: 0.2,
    });

    const resultText = response.choices[0].message.content.trim();
    console.log("🤖 OpenAI response:", resultText);

    let parsedResult;
    try {
      parsedResult = extractJSON(resultText);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err.message);
      return res.status(500).json({ error: "Invalid JSON from AI", raw: resultText });
    }

    return res.status(200).json({
      contractName: file.originalFilename,
      detectedLang: "en",
      analysis: parsedResult,
    });
  } catch (err) {
    console.error("🔥 Server Error:", err);
    return res.status(500).json({ error: "Failed to analyze file", details: err.message });
  }
}

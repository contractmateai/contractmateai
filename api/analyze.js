import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false, // Required for formidable
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("🔹 Request received at /api/analyze");

    // Parse the incoming form
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
    const fileType = file.mimetype || file.originalFilename.split(".").pop();
    console.log("📂 Uploaded file type:", fileType);

    // --- Extract text based on file type ---
    let fileText = "";
    if (fileType.includes("pdf")) {
      console.log("🔹 Parsing PDF...");
      const pdfBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(pdfBuffer);
      fileText = pdfData.text;
    } else if (
      fileType.includes("docx") ||
      fileType.includes("wordprocessingml")
    ) {
      console.log("🔹 Parsing DOCX...");
      const docBuffer = fs.readFileSync(filePath);
      const docResult = await mammoth.extractRawText({ buffer: docBuffer });
      fileText = docResult.value;
    } else if (
      fileType.includes("txt") ||
      fileType === "text/plain" ||
      file.originalFilename.endsWith(".txt")
    ) {
      console.log("🔹 Parsing TXT...");
      fileText = fs.readFileSync(filePath, "utf-8");
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    if (!fileText.trim()) {
      console.error("❌ Extracted text is empty!");
      return res.status(400).json({ error: "Could not extract text from file" });
    }

    console.log("✅ File text extracted, length:", fileText.length);

    // --- Build the prompt for OpenAI ---
    const prompt = `
You are an AI contract reviewer. Analyze the following contract text and return ONLY valid JSON with these fields:
{
  "summary": ["3 bullet point summary"],
  "risk": 0-100,
  "clarity": 0-100,
  "compliance": 0-100,
  "keyClauses": ["important clause 1", "important clause 2"],
  "potentialIssues": ["issue 1", "issue 2"],
  "smartSuggestions": ["suggestion 1", "suggestion 2"]
}

Contract text:
"""${fileText.slice(0, 4000)}"""  // truncated to avoid token limit
`;

    // --- Call OpenAI ---
    console.log("🔹 Sending text to OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a legal assistant. Respond ONLY with valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    const resultText = response.choices[0].message.content.trim();
    console.log("🔹 OpenAI raw response:", resultText);

    let parsedResult;
    try {
      parsedResult = JSON.parse(resultText);
    } catch (err) {
      console.error("❌ Failed to parse OpenAI response as JSON:", err.message);
      return res.status(500).json({ error: "Invalid JSON from AI", raw: resultText });
    }

    // --- Return the parsed analysis ---
    return res.status(200).json({
      contractName: file.originalFilename,
      detectedLang: "en",
      analysis: parsedResult,
    });
  } catch (err) {
    console.error("🔥 Server error in /api/analyze:", err);
    return res.status(500).json({ error: "Failed to analyze file", details: err.message });
  }
}

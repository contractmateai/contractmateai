// /api/analyze.js  (ESM; requires "type":"module" in package.json)
import { promises as fsp, readFileSync } from "fs";
import { formidable as makeForm } from "formidable";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false, // required for Formidable
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Safely pull the first {...} JSON block
function extractJSON(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("AI did not return JSON");
  }
  return JSON.parse(text.slice(start, end + 1));
}

async function parseUpload(req) {
  const form = makeForm({ multiples: false, keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY is missing" });
    }

    // 1) get the uploaded file
    const { files, fields } = await parseUpload(req);
    const role = (fields?.role && String(fields.role)) || "signer";

    const fileAny = files?.file;
    const fileObj = Array.isArray(fileAny) ? fileAny[0] : fileAny;
    if (!fileObj?.filepath) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = fileObj.filepath;
    const original = (fileObj.originalFilename || "contract").toLowerCase();

    // 2) extract text
    let fileText = "";
    if (original.endsWith(".pdf")) {
      const buf = readFileSync(filePath);
      const pdf = await pdfParse(buf);
      fileText = pdf.text || "";
    } else if (original.endsWith(".docx")) {
      const buf = readFileSync(filePath);
      const doc = await mammoth.extractRawText({ buffer: buf });
      fileText = doc.value || "";
    } else if (original.endsWith(".txt")) {
      fileText = readFileSync(filePath, "utf8");
    } else {
      return res
        .status(400)
        .json({ error: "Unsupported file type. Use PDF, DOCX, or TXT." });
    }

    // cleanup temp file if present
    try { await fsp.unlink(filePath); } catch {}

    if (!fileText.trim()) {
      return res.status(400).json({ error: "No readable text found in file" });
    }

    // 3) call OpenAI
    const prompt = `
Analyze this contract and return ONLY valid JSON with these fields:
{
  "summary": ["3 short bullets"],
  "risk": 0-100,
  "clarity": 0-100,
  "compliance": 0-100,
  "keyClauses": ["..."],
  "potentialIssues": ["..."],
  "smartSuggestions": ["..."]
}

Contract:
"""${fileText.slice(0, 8000)}"""
(assume the user is the "${role}")
`;

    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are a legal contract analyzer. Respond ONLY with valid JSON. No prose, no code fences.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = ai.choices?.[0]?.message?.content?.trim() || "";
    let analysis;
    try {
      analysis = extractJSON(raw);
    } catch (e) {
      return res.status(500).json({ error: "Invalid JSON from AI", raw });
    }

    // 4) return to the frontend
    return res.status(200).json({
      contractName: fileObj.originalFilename || "Contract",
      detectedLang: "en",
      analysis,
    });
  } catch (err) {
    console.error("api/analyze error:", err);
    return res.status(500).json({ error: "Failed to analyze file", details: String(err.message || err) });
  }
}

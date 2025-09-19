import formidable from "formidable";
import fs from "fs";
import OpenAI from "openai";
import mammoth from "mammoth";
import pdf from "pdf-parse";

export const config = { api: { bodyParser: false } };

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Extract safe JSON
function extractJSON(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Invalid JSON in model output");
  return JSON.parse(text.slice(start, end + 1));
}

// Parse DOCX using Mammoth
async function extractDocxText(filePath) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value || "";
}

// Parse PDF using pdf-parse
async function extractPdfText(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);
  return data.text || "";
}

// Plain text fallback
function extractPlainText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const form = new formidable.IncomingForm({ keepExtensions: true });
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, flds, fls) => (err ? reject(err) : resolve({ fields: flds, files: fls })));
    });

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploadedFile) return res.status(400).json({ error: "No file uploaded" });

    const filePath = uploadedFile.filepath;
    const originalName = uploadedFile.originalFilename.toLowerCase();

    let fileText = "";
    if (originalName.endsWith(".pdf")) {
      fileText = await extractPdfText(filePath);
    } else if (originalName.endsWith(".docx")) {
      fileText = await extractDocxText(filePath);
    } else if (originalName.endsWith(".txt")) {
      fileText = extractPlainText(filePath);
    } else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    if (!fileText || fileText.trim().length < 20) {
      return res.status(400).json({ error: "Empty or unreadable file" });
    }

    // === OpenAI analysis ===
    const prompt = `
Analyze the following contract text and return only valid JSON:
{
  "summary": string[],
  "risk": number,
  "clarity": number,
  "compliance": number,
  "keyClauses": string[],
  "potentialIssues": string[],
  "smartSuggestions": string[],
  "detectedLang": string
}

Contract:
"""${fileText.slice(0, 12000)}"""
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: "You are a legal contract analysis assistant. Respond ONLY in JSON." },
        { role: "user", content: prompt },
      ],
    });

    const analysis = extractJSON(completion.choices[0].message.content);

    return res.status(200).json({
      contractName: uploadedFile.originalFilename || "Contract",
      detectedLang: analysis.detectedLang || "en",
      analysis: {
        summary: analysis.summary || [],
        risk: analysis.risk || 0,
        clarity: analysis.clarity || 0,
        compliance: analysis.compliance || 0,
        keyClauses: analysis.keyClauses || [],
        potentialIssues: analysis.potentialIssues || [],
        smartSuggestions: analysis.smartSuggestions || [],
      },
      translations: {},
      role: fields.role || "signer",
    });
  } catch (err) {
    console.error("Analyze error:", err);
    return res.status(500).json({ error: err.message || "Failed to analyze file" });
  }
}

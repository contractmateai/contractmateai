import formidable from "formidable";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

export const config = { api: { bodyParser: false } };

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper: extract JSON safely
function extractJSON(str = "") {
  const i = str.indexOf("{");
  const j = str.lastIndexOf("}");
  if (i === -1 || j === -1 || j <= i) throw new Error("No JSON in response");
  return JSON.parse(str.slice(i, j + 1));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // Parse form upload
    const form = new formidable.IncomingForm({ keepExtensions: true });
    const { files, fields } = await new Promise((resolve, reject) => {
      form.parse(req, (err, flds, fls) => (err ? reject(err) : resolve({ fields: flds, files: fls })));
    });

    const uploaded = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploaded) return res.status(400).json({ error: "No file uploaded" });

    const role = (fields.role && String(fields.role)) || "signer";
    const mime = uploaded.mimetype || "";
    const ext = path.extname(uploaded.originalFilename || "").toLowerCase();

    // Convert file to base64 for OpenAI Vision
    const buf = fs.readFileSync(uploaded.filepath);
    const b64 = buf.toString("base64");
    const dataUrl = `data:${mime || "application/pdf"};base64,${b64}`;

    // Step 1: Extract text using OpenAI Vision for any file type
    const vision = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      messages: [
        { role: "system", content: "Extract all text from this document or image. Output plain text only." },
        {
          role: "user",
          content: [
            { type: "text", text: "Read every word you can. Output only the text content." },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    });

    const extracted = (vision.choices?.[0]?.message?.content || "").trim();
    if (!extracted || extracted.length < 40) {
      console.error("File extraction failed or too short:", extracted);
      return res.status(400).json({ error: "Could not read text from file." });
    }

    // Step 2: Analyze extracted text
    const analyzePrompt = `
Analyze this contract text. Return ONLY valid JSON:
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

Contract text:
"""${extracted.slice(0, 12000)}"""
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: "You are a careful legal assistant. Respond only with pure JSON." },
        { role: "user", content: analyzePrompt },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content || "";
    const analysis = extractJSON(raw);

    // Return payload
    return res.status(200).json({
      contractName: uploaded.originalFilename || "Contract",
      detectedLang: analysis.detectedLang || "en",
      analysis: {
        summary: Array.isArray(analysis.summary) ? analysis.summary : [String(analysis.summary || "")],
        risk: Number(analysis.risk ?? 0),
        clarity: Number(analysis.clarity ?? 0),
        compliance: Number(analysis.compliance ?? 0),
        keyClauses: analysis.keyClauses || [],
        potentialIssues: analysis.potentialIssues || [],
        smartSuggestions: analysis.smartSuggestions || [],
      },
      translations: {},
      role,
    });
  } catch (err) {
    console.error("Analyze error:", err);
    return res.status(500).json({ error: err.message || "Failed to analyze file" });
  }
}


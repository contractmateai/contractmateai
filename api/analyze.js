// /api/analyze.js
import formidable from "formidable";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import pdfParse from "pdf-parse";

export const config = { api: { bodyParser: false } };

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set this in Vercel/Env
});

// tiny helper: safely pull JSON from a model reply even if it adds text
function extractJSON(str = "") {
  const i = str.indexOf("{");
  const j = str.lastIndexOf("}");
  if (i === -1 || j === -1 || j <= i) throw new Error("No JSON in response");
  return JSON.parse(str.slice(i, j + 1));
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    // 1) Parse the multipart form
    const form = new formidable.IncomingForm({ keepExtensions: true });
    const { files, fields } = await new Promise((resolve, reject) => {
      form.parse(req, (err, flds, fls) => (err ? reject(err) : resolve({ fields: flds, files: fls })));
    });

    // your <input name="file" …> is "file"
    const uploaded = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploaded) return res.status(400).json({ error: "No file uploaded" });

    const role = (fields.role && String(fields.role)) || "signer";
    const mime = uploaded.mimetype || "";
    const ext = path.extname(uploaded.originalFilename || "").toLowerCase();

    // 2) Extract TEXT from the file (branch by type)
    let extracted = "";

    if (mime.startsWith("text/") || ext === ".txt") {
      // plain text
      extracted = fs.readFileSync(uploaded.filepath, "utf-8");

    } else if (mime === "application/pdf" || ext === ".pdf") {
      // PDF → text via pdf-parse
      const buf = fs.readFileSync(uploaded.filepath);
      const pdf = await pdfParse(buf);
      extracted = (pdf.text || "").trim();

    } else if (mime.startsWith("image/") || [".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
      // IMAGE → text via OpenAI Vision
      const buf = fs.readFileSync(uploaded.filepath);
      const b64 = buf.toString("base64");
      const dataUrl = `data:${mime || "image/png"};base64,${b64}`;

      const vision = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.1,
        messages: [
          { role: "system", content: "Extract all legible contract text from the image. Respond with plain text only." },
          {
            role: "user",
            content: [
              { type: "text", text: "Read every word you can. Output only the text you see." },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      });

      extracted = (vision.choices?.[0]?.message?.content || "").trim();

    } else {
      return res.status(415).json({ error: "Unsupported file type. Use .txt, .pdf, or an image." });
    }

    if (!extracted || extracted.length < 40) {
      return res.status(400).json({ error: "Could not read text from this file. Try a clearer file." });
    }

    // 3) Build the analysis prompt
    const analyzePrompt = `
Analyze the following contract text. Return ONLY valid JSON in this schema:
{
  "summary": string[] (exactly 3 concise bullet points),
  "risk": number,           // 0-100
  "clarity": number,        // 0-100
  "compliance": number,     // 0-100 (use as "confidence to sign" proxy)
  "keyClauses": string[],
  "potentialIssues": string[],
  "smartSuggestions": string[],
  "detectedLang": string    // ISO code like "en", "es", etc.
}

Contract text:
"""${extracted.slice(0, 15000)}"""
`;

    // 4) Ask OpenAI for the contract analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: "You are a careful legal assistant. Always respond with pure JSON." },
        { role: "user", content: analyzePrompt },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content || "";
    const analysis = extractJSON(raw);

    // 5) Wrap into the shape your frontend expects
    const payload = {
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
      translations: {}, // you’ll fill this later when we add dropdown translations
      role,            // pass through who they are
    };

    return res.status(200).json(payload);
  } catch (err) {
    console.error("analyze error:", err);
    return res.status(500).json({ error: "Failed to analyze file" });
  }
}

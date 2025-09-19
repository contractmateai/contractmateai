// api/analyze.js — Vercel Node serverless (NOT Edge)
// Supports PDF (pdf-parse), DOCX (mammoth), TXT, and images (OpenAI Vision)

const { IncomingForm } = require("formidable");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const OpenAI = require("openai");

const TMP_DIR = "/tmp";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      multiples: false,
      uploadDir: TMP_DIR,
      keepExtensions: true,
      maxFileSize: 25 * 1024 * 1024
    });
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
  });
}

async function extractText(filePath, mime, originalFilename) {
  const ext = (originalFilename || "").toLowerCase();
  const buf = fs.readFileSync(filePath);

  if (mime === "text/plain" || ext.endsWith(".txt")) return buf.toString("utf8");

  if (mime === "application/pdf" || ext.endsWith(".pdf")) {
    const data = await pdfParse(buf);
    return data.text || "";
  }

  if (
    mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer: buf });
    return result.value || "";
  }

  if (mime.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(ext)) {
    const b64 = buf.toString("base64");
    return { __imageDataURI: `data:${mime};base64,${b64}` };
  }

  throw new Error("Unsupported file type");
}

async function analyzeWithOpenAI(content) {
  const system = `You analyze contracts. Return JSON with:
- summary (string)
- scores: { risk: 0-100, clarity: 0-100, compliance: 0-100 }
- keyClauses: string[]
- potentialIssues: string[]
- smartSuggestions: string[]
Ensure valid JSON.`;

  const messages =
    typeof content === "object" && content.__imageDataURI
      ? [
          { role: "system", content: system },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this contract image." },
              { type: "image_url", image_url: { url: content.__imageDataURI } }
            ]
          }
        ]
      : [
          { role: "system", content: system },
          {
            role: "user",
            content: [{ type: "text", text: "Analyze this contract text:\n\n" + (content || "").slice(0, 200000) }]
          }
        ];

  const r = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.2,
    response_format: { type: "json_object" }
  });

  let out = r.choices?.[0]?.message?.content || "{}";
  try { return JSON.parse(out); } catch {
    return { summary: "", scores: { risk: 0, clarity: 0, compliance: 0 }, keyClauses: [], potentialIssues: [], smartSuggestions: [], _raw: out };
  }
}

function send(res, code, data) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });

  try {
    const { files } = await parseForm(req);
    const file = files?.file || files?.upload || Object.values(files || {})[0];
    if (!file) return send(res, 400, { error: "No file uploaded" });

    const filePath = file.filepath || file.path || path.join(TMP_DIR, file.originalFilename);
    const mime = file.mimetype || "application/octet-stream";
    const name = file.originalFilename || file.newFilename || "";

    const extracted = await extractText(filePath, mime, name);
    const data = await analyzeWithOpenAI(extracted);

    return send(res, 200, { ok: true, data });
  } catch (e) {
    console.error("Analyze error:", e);
    return send(res, 500, { ok: false, error: "Could not analyze this file. Try again or use another file." });
  }
};

// pages/api/analyze.js
export const config = { api: { bodyParser: false } }; // we'll accept multipart/form-data

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // We don't parse the file yet (that's step 2). We just consume the stream.
    await new Promise((resolve, reject) => {
      req.on("data", () => {});  // drain
      req.on("end", resolve);
      req.on("error", reject);
    });

    // --- MOCK PAYLOAD that matches what your index.html expects ---
    return res.status(200).json({
      contractName: "Uploaded_Contract.pdf",
      detectedLang: "en",
      analysis: {
        summary: [
          "This contract is generally favorable with low overall risk.",
          "Payment schedule and termination rights are standard.",
          "Watch late-fee compounding and define 'material breach'."
        ],
        risk: 25,
        clarity: 80,
        compliance: 90,
        keyClauses: [
          "Payment Terms — Net 30 with 2% per month late fee.",
          "Scope of Work — Deliverables listed in Schedule A.",
          "Termination — 30-day convenience; immediate for cause.",
          "IP & Licensing — Client owns final assets; creator keeps tools."
        ],
        potentialIssues: [
          "Late fee compounding escalates costs on long delays.",
          "Indemnity is one-sided; consider mutual or capped liability."
        ],
        smartSuggestions: [
          "Add a 5–7 day grace period before late fees.",
          "Define 'material breach' + 10-day cure period.",
          "List milestones and acceptance criteria."
        ]
      },
      translations: {}
    });
  } catch (err) {
    console.error("analyze error:", err);
    return res.status(500).json({ error: "Server error while analyzing file" });
  }
}

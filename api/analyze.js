// pages/api/analyze.js  (Next.js)
// or api/analyze.js     (Vercel serverless)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text = "", filename = "Untitled_Contract" } = req.body;

    // For now this is a FAKE response (so you can integrate safely).
    // We’ll switch to real OpenAI later.
    const fake = {
      contractName: filename.replace(/\.[^.]+$/, "").replace(/[_\-]+/g, " "),
      detectedLang: "en", // default English; we’ll auto-detect later
      analysis: {
        summary: [
          "This contract is generally favorable with low overall risk, but several timing and remedy definitions could be tightened to avoid avoidable confusion between the parties.",
          "Payment schedule and termination rights are presented in clear, plain language; still, a couple of legacy phrases can be simplified so non-lawyers can follow without re-reading.",
          "Watch late-fee compounding and define 'material breach' with an objective test so everyday admin delays don’t escalate into disputes."
        ],
        risk: { value: 25, note: "Clear terms overall, but missing late fees and dispute process." },
        clarity: { value: 80, note: "Plain language used, but some clauses need clearer detail." },
        clauses: [
          "Payment Terms: Net 30 with 2% per month late fee; add a cap so charges remain predictable.",
          "Scope of Work: Deliverables listed in Schedule A; include acceptance criteria so approvals are objective.",
          "IP & Licensing: Client owns final assets; creator keeps tools, methods and pre-existing know-how.",
          "Termination: 30-day convenience; immediate for cause. Add a ten-day cure for minor issues."
        ],
        issues: [
          "Late-fee compounding escalates costs on long delays; switch to simple interest with a reasonable cap.",
          "Indemnity is one-sided and uncapped; replace with mutual indemnity with a commercial cap.",
          "Undefined cure periods allow immediate termination for minor faults; add a standard 10-day cure.",
          "Ambiguous 'material breach' invites disputes; specify an objective test & carve-out for trivial delays.",
          "Scope changes lack a written change-order process; require signed amendments with price/timeline impact."
        ],
        suggestions: [
          "Add objective acceptance criteria and a short user-testing window so sign-off is clear and quick.",
          "Insert a 5–7 day grace period before late fees and convert compounding to simple interest with a cap.",
          "Define “material breach” and include a standard 10-day cure (except true emergencies)."
        ],
        meters: { professionalism: 90, favorability: 75, deadline: 18, confidence: 75 },
        scoreChecker: 80
      },
      // translation slots we’ll fill later (when we add OpenAI)
      i18n: { EN: null, IT: null, DE: null, ES: null, FR: null, PT: null, NL: null, RO: null, SQ: null, TR: null, ZH: null, JA: null }
    };

    return res.status(200).json(fake);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to analyze contract" });
  }
}


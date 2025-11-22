// api/analyze.js — Vercel Serverless JSON endpoint
// Requires env: OPENAI_API_KEY
const SECRET = process.env.OPENAI_API_KEY;

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

// Static UI translations for verdict labels + score line
const UI = {
  en: {
    summary: "Summary",
    risk: "Risk",
    clarity: "Clarity",
    mainClauses: "Main Clauses",
    potentialIssues: "Potential Issues",
    smartSuggestions: "Smart Suggestions",
    score: "Overall Score",
    unsafe: "Unsafe",
    safe: "Safe",
    verySafe: "Very Safe",
    scoreLine: "Determines the overall score.",
    conf: "Confidence to sign freely"
  },
  it: {
    summary: "Riassunto",
    risk: "Rischio",
    clarity: "Chiarezza",
    mainClauses: "Clausole Principali",
    potentialIssues: "Problemi Potenziali",
    smartSuggestions: "Suggerimenti Intelligenti",
    score: "Punteggio Complessivo",
    unsafe: "Non Sicuro",
    safe: "Sicuro",
    verySafe: "Molto Sicuro",
    scoreLine: "Determina il punteggio complessivo.",
    conf: "Fiducia per firmare liberamente"
  },
  // ✅ UPDATED GERMAN STRINGS
  de: {
    summary: "Zusammenfassung",
    risk: "Risiko",
    clarity: "Klarheit",
    mainClauses: "Hauptklauseln",
    potentialIssues: "Mögliche Probleme",
    smartSuggestions: "Intelligente Vorschläge",
    score: "Gesamtwertung",
    unsafe: "schlecht",
    safe: "gut",
    verySafe: "sehr gut",
    scoreLine: "Gesamtwertung",
    conf: "Unterschrifts-Sicherheit"
  },
  es: {
    summary: "Resumen",
    risk: "Riesgo",
    clarity: "Claridad",
    mainClauses: "Cláusulas Principales",
    potentialIssues: "Problemas Potenciales",
    smartSuggestions: "Sugerencias Inteligentes",
    score: "Puntuación General",
    unsafe: "Inseguro",
    safe: "Seguro",
    verySafe: "Muy Seguro",
    scoreLine: "Determina la puntuación general.",
    conf: "Confianza para firmar libremente"
  },
  fr: {
    summary: "Résumé",
    risk: "Risque",
    clarity: "Clarté",
    mainClauses: "Clauses Principales",
    potentialIssues: "Problèmes Potentiels",
    smartSuggestions: "Suggestions Intelligentes",
    score: "Score Global",
    unsafe: "Dangereux",
    safe: "Sûr",
    verySafe: "Très Sûr",
    scoreLine: "Détermine le score global.",
    conf: "Confiance pour signer librement"
  },
  pt: {
    summary: "Resumo",
    risk: "Risco",
    clarity: "Clareza",
    mainClauses: "Cláusulas Principais",
    potentialIssues: "Problemas Potenciais",
    smartSuggestions: "Sugestões Inteligentes",
    score: "Pontuação Geral",
    unsafe: "Inseguro",
    safe: "Seguro",
    verySafe: "Muito Seguro",
    scoreLine: "Determina a pontuação geral.",
    conf: "Confiança para assinar livremente"
  },
  nl: {
    summary: "Samenvatting",
    risk: "Risico",
    clarity: "Duidelijkheid",
    mainClauses: "Hoofdclausules",
    potentialIssues: "Mogelijke Problemen",
    smartSuggestions: "Slimme Suggesties",
    score: "Totale Score",
    unsafe: "Onveilig",
    safe: "Veilig",
    verySafe: "Zeer Veilig",
    scoreLine: "Bepaalt de totale score.",
    conf: "Vertrouwen om vrij te ondertekenen"
  },
  ro: {
    summary: "Rezumat",
    risk: "Risc",
    clarity: "Claritate",
    mainClauses: "Clauze Principale",
    potentialIssues: "Probleme Potențiale",
    smartSuggestions: "Sugestii Inteligente",
    score: "Scor General",
    unsafe: "Nesigur",
    safe: "Sigur",
    verySafe: "Foarte Sigur",
    scoreLine: "Determină scorul general.",
    conf: "Încredere pentru a semna liber"
  },
  sq: {
    summary: "Përmbledhje",
    risk: "Rrezik",
    clarity: "Qartësi",
    mainClauses: "Klauzola Kryesore",
    potentialIssues: "Probleme të Mundshme",
    smartSuggestions: "Sugjerime të Zgjuara",
    score: "Rezultati i Përgjithshëm",
    unsafe: "e keqe",
    safe: "e mirë",
    verySafe: "shumë e mirë",
    scoreLine: "Përcakton rezultatin e përgjithshëm.",
    conf: "Besim për të nënshkruar lirisht"
  },
  tr: {
    summary: "Özet",
    risk: "Risk",
    clarity: "Netlik",
    mainClauses: "Ana Maddeler",
    potentialIssues: "Potansiyel Sorunlar",
    smartSuggestions: "Akıllı Öneriler",
    score: "Genel Puan",
    unsafe: "Güvensiz",
    safe: "Güvenli",
    verySafe: "Çok Güvenli",
    scoreLine: "Genel puanı belirler.",
    conf: "Serbestçe imzalama güveni"
  },
  ja: {
    summary: "要約",
    risk: "リスク",
    clarity: "明瞭さ",
    mainClauses: "主要条項",
    potentialIssues: "潜在的問題",
    smartSuggestions: "スマートな提案",
    score: "総合スコア",
    unsafe: "危険",
    safe: "安全",
    verySafe: "非常に安全",
    scoreLine: "総合スコアを決定します。",
    conf: "自由に署名する自信"
  },
  zh: {
    summary: "摘要",
    risk: "风险",
    clarity: "清晰度",
    mainClauses: "主要条款",
    potentialIssues: "潜在问题",
    smartSuggestions: "智能建议",
    score: "总体评分",
    unsafe: "不安全",
    safe: "安全",
    verySafe: "非常安全",
    scoreLine: "确定总体评分。",
    conf: "自由签署的信心"
  }
};

const SUPPORTED_LANGS = [
  "en","it","de","es","fr","pt","nl","ro","sq","tr","ja","zh"
];

export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!SECRET) return send(res, 500, { error: "Missing OPENAI_API_KEY" });

  try {
    // --- Read body ---
    let raw = "";
    await new Promise((resolve) => {
      req.on("data", (c) => (raw += c));
      req.on("end", resolve);
    });

    const ct = (req.headers["content-type"] || "").toLowerCase();
    if (!ct.includes("application/json")) {
      return send(res, 415, { error: `Send application/json. Got: ${ct || "unknown"}` });
    }

    let body = {};
    try { body = raw ? JSON.parse(raw) : {}; }
    catch { return send(res, 400, { error: "Invalid JSON body" }); }

    const {
      text = "",
      imageDataURI = "",
      originalName = "Contract",
      mime = "",
      role = "signer",
      targetLang = "en" // still used for ui labels only
    } = body || {};

    if (!text && !imageDataURI) {
      return send(res, 400, { error: "Provide either text or imageDataURI" });
    }

    const uiLang = UI[targetLang] ? targetLang : "en";
    const t = UI[uiLang];

    // --- System prompt ---
    // IMPORTANT:
    // 1) First detect language of contract => detectedLang
    // 2) Main "analysis" content must be in detectedLang
    // 3) ALSO return "translations" for all SUPPORTED_LANGS (en,it,de,es,fr,pt,nl,ro,sq,tr,ja,zh)
    const system = `You are a contract analyst. Return STRICT JSON only in this structure:

{
  "contractName": "string",
  "contractTitle": "string",
  "role": "signer|writer",
  "detectedLang": "en|it|de|es|fr|pt|nl|ro|sq|tr|ja|zh",
  "analysis": {
    "summary": ["string","string","string"],
    "risk": { "value": 0-100, "note": "string (<=280 chars)", "band": "green|orange|red", "safety": "generally safe|not that safe|not safe" },
    "clarity": { "value": 0-100, "note": "string (<=280 chars)", "band": "green|orange|red", "safety": "safe|not that safe|not safe" },
    "mainClauses": ["string","string","string","string","string"],
    "potentialIssues": ["string","string","string","string","string"],
    "smartSuggestions": [
      "Include governing law, e.g., 'This contract shall be governed by the laws of Italy.'",
      "Clarify opt-outs, e.g., 'Parties may opt-out of certain liability clauses.'",
      "Add dispute mechanism, e.g., 'Disputes resolved through arbitration in Vienna.'"
    ],
    "bars": { "professionalism": 0-100, "favorabilityIndex": 0-100, "deadlinePressure": 0-100, "confidenceToSign": 0-100 },
    "scoreChecker": { "value": 0-100, "band": "red|orange|green", "verdict": "unsafe|safe|very safe", "line": "string" }
  },
  "translations": {
    "en": {
      "title": "string",
      "summary": ["string","string","string"],
      "mainClauses": ["string","string","string","string","string"],
      "potentialIssues": ["string","string","string","string","string"],
      "smartSuggestions": ["string","string","string"],
      "scoreLine": "string"
    },
    "it": { "title": "string", "summary": [...], "mainClauses": [...], "potentialIssues": [...], "smartSuggestions": [...], "scoreLine": "string" },
    "de": { "title": "string", "summary": [...], "mainClauses": [...], "potentialIssues": [...], "smartSuggestions": [...], "scoreLine": "string" },
    "es": { "title": "string", "summary": [...], "mainClauses": [...], "potentialIssues": [...], "smartSuggestions": [...], "scoreLine": "string" },
    "fr": { "title": "string", "summary": [...], "mainClauses": [...], "potentialIssues": [...], "smartSuggestions": [...], "scoreLine": "string" },
    "pt": { "title": "string", "summary": [...], "mainClauses": [...], "potentialIssues": [...], "smartSuggestions": [...], "scoreLine": "string" },
    "nl": { "title": "string", "summary": [...], "mainClauses": [...], "potentialIssues": [...], "smartSuggestions": [...], "scoreLine": "string" },
    "ro": { "title": "string", "summary": [...], "mainClauses": [...], "potentialIssues": [...], "smartSuggestions": [...], "scoreLine": "string" },
    "sq": { "title": "string", "summary": [...], "mainClauses": [...], "potentialIssues": [...], "smartSuggestions": [...], "scoreLine": "string" },
    "tr": { "title": "string", "summary": [...], "mainClauses": [...], "potentialIssues": [...], "smartSuggestions": [...], "scoreLine": "string" },
    "ja": { "title": "string", "summary": [...], "mainClauses": [...], "potentialIssues": [...], "smartSuggestions": [...], "scoreLine": "string" },
    "zh": { "title": "string", "summary": [...], "mainClauses": [...], "potentialIssues": [...], "smartSuggestions": [...], "scoreLine": "string" }
  }
}

Rules:
- First detect the language of the contract text and set "detectedLang" correctly.
- The main "analysis" content (summary, risk.note, clarity.note, mainClauses, potentialIssues, smartSuggestions, scoreChecker.line) must be written in the detectedLang.
- SUMMARY must be exactly 3 clear sentences.
- "smartSuggestions" must be EXACTLY 3 items and each must contain a short “e.g.,” example (or equivalent in that language).
- "scoreChecker.line" MUST logically match the "verdict" (unsafe / safe / very safe).
- In the "translations" object, create high-quality translations of title, summary, mainClauses, potentialIssues, smartSuggestions and scoreLine into each listed language code.
- Make the German ("de") translations slightly concise: keep each sentence about 10–15 characters shorter than the original, but still natural.
- Do NOT include any extra keys, comments or prose outside this JSON structure.`;

    // --- User content ---
    const userContent = imageDataURI
      ? [
          { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}\nOCR if needed then analyze.` },
          { type: "image_url", image_url: { url: imageDataURI } }
        ]
      : [
          {
            type: "text",
            text:
              `Role: ${role}\nOriginal file: ${originalName}, mime: ${mime}\n` +
              `Analyze this contract and follow the JSON spec precisely:\n` +
              String(text).slice(0, 110000)
          }
        ];

    // --- OpenAI call ---
    let openaiResp;
    try {
      openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SECRET}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.15,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: userContent }
          ]
        })
      });
    } catch (err) {
      return send(res, 500, { error: "OpenAI network error: " + err.message });
    }

    if (!openaiResp.ok) {
      const errTxt = await openaiResp.text().catch(() => "");
      return send(res, 502, { error: "OpenAI request failed: " + errTxt });
    }

    const resp = await openaiResp.json().catch(() => ({}));
    const content = resp?.choices?.[0]?.message?.content || "{}";

    let parsed = {};
    try { parsed = JSON.parse(content); }
    catch {
      return send(res, 500, { error: "Invalid JSON returned by model" });
    }

    // --- Normalize ---
    const cap = (s, n) => (s || "").trim().slice(0, n);
    const clamp = (v) => Math.max(0, Math.min(100, Number(v || 0)));
    const stripLead = (s) => String(s || "").replace(/^\s*\d+\s*[.)-]\s*/, "");

    const baseSummary = Array.isArray(parsed?.analysis?.summary)
      ? parsed.analysis.summary.slice(0, 3)
      : [];

    const mainClauses = (parsed?.analysis?.mainClauses || [])
      .filter(Boolean)
      .map(s => stripLead(cap(s, 900)))
      .slice(0, 5);

    const potentialIssues = (parsed?.analysis?.potentialIssues || [])
      .filter(Boolean)
      .map(s => stripLead(cap(s, 1000)))
      .slice(0, 5);

    const smartSuggestions = (parsed?.analysis?.smartSuggestions || [])
      .filter(Boolean)
      .map(s => stripLead(cap(s, 250)))
      .slice(0, 3);

    const scIn = parsed?.analysis?.scoreChecker || {};
    const scVal = clamp(scIn.value);

    let verdict =
      scVal < 34 ? "unsafe" :
      scVal < 67 ? "safe" :
      "verySafe";

    let band =
      verdict === "unsafe" ? "red" :
      verdict === "safe" ? "orange" :
      "green";

    const barsIn = parsed?.analysis?.bars || {};

    // --- Translations normalization (for Option A on the report page) ---
    const trIn = parsed?.translations || {};
    const translations = {};

    SUPPORTED_LANGS.forEach(code => {
      const src = trIn[code] || {};
      const sumArr = Array.isArray(src.summary) ? src.summary : (src.summary ? [String(src.summary)] : []);
      const mcArr = Array.isArray(src.mainClauses) ? src.mainClauses : (src.mainClauses ? [String(src.mainClauses)] : []);
      const piArr = Array.isArray(src.potentialIssues) ? src.potentialIssues : (src.potentialIssues ? [String(src.potentialIssues)] : []);
      const ssArr = Array.isArray(src.smartSuggestions) ? src.smartSuggestions : (src.smartSuggestions ? [String(src.smartSuggestions)] : []);

      translations[code] = {
        title: cap(src.title || "", 200),
        summary: sumArr.map(s => cap(s, 320)).slice(0, 3),
        mainClauses: mcArr.map(s => stripLead(cap(s, 900))).slice(0, 5),
        potentialIssues: piArr.map(s => stripLead(cap(s, 1000))).slice(0, 5),
        smartSuggestions: ssArr.map(s => stripLead(cap(s, 250))).slice(0, 3),
        scoreLine: cap(src.scoreLine || "", 280)
      };
    });

    const detectedLang = parsed.detectedLang && SUPPORTED_LANGS.includes(parsed.detectedLang)
      ? parsed.detectedLang
      : "en";

    const normalized = {
      contractName: parsed.contractName || originalName || "Contract",
      contractTitle: parsed.contractTitle || parsed.contractName || originalName,
      role: parsed.role === "writer" ? "writer" : "signer",
      detectedLang,
      targetLang: uiLang,
      ui: t,
      analysis: {
        summary: baseSummary,
        risk: {
          value: clamp(parsed?.analysis?.risk?.value),
          note: cap(parsed?.analysis?.risk?.note, 280),
          band,
          safety: parsed?.analysis?.risk?.safety || ""
        },
        clarity: {
          value: clamp(parsed?.analysis?.clarity?.value),
          note: cap(parsed?.analysis?.clarity?.note, 280),
          band,
          safety: parsed?.analysis?.clarity?.safety || ""
        },
        mainClauses,
        potentialIssues,
        smartSuggestions,
        bars: {
          professionalism: clamp(barsIn.professionalism),
          favorabilityIndex: clamp(barsIn.favorabilityIndex),
          deadlinePressure: clamp(barsIn.deadlinePressure),
          confidenceToSign: clamp(barsIn.confidenceToSign)
        },
        scoreChecker: {
          value: scVal,
          band,
          verdict,
          line: cap(scIn.line || t.scoreLine, 280),
          verdictLabel: t[verdict] || t.safe
        }
      },
      translations
    };

    return send(res, 200, normalized);
  } catch (err) {
    return send(res, 500, { error: "Could not analyze this file. Details: " + err.message });
  }
}

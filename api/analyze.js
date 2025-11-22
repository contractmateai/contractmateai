// api/analyze.js — FINAL FULL VERSION
// Requires env: OPENAI_API_KEY
const SECRET = process.env.OPENAI_API_KEY;

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

// -------------------------------------------
// STATIC UI LABEL TRANSLATIONS
// (ALL FIXED EXACTLY AS USER REQUESTED)
// -------------------------------------------
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
    conf: "Confidence to sign freely",
    riskLineStatic: "The contract risk score is based on the clauses' fairness and obligations.",
    clarityLineStatic: "The clarity score reflects how easy it is to understand the terms."
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
    conf: "Fiducia per firmare liberamente",
    riskLineStatic: "La valutazione del rischio si basa sull'equità delle clausole e sugli obblighi.",
    clarityLineStatic: "La chiarezza indica quanto siano comprensibili i termini."
  },

  // -------------------------
  // FIXED GERMAN (YOUR RULES)
  // -------------------------
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
    conf: "Unterschrifts-Sicherheit",

    // EXACT WORDING YOU REQUESTED:
    riskLineStatic: "Die Risikobewertung basiert auf Fairness und Pflichten der Klauseln.",
    clarityLineStatic: "Die Klarheitswertung zeigt, wie leicht die Vertragsregeln verständlich sind."
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
    conf: "Confianza para firmar libremente",
    riskLineStatic: "La puntuación de riesgo se basa en la equidad y obligaciones de las cláusulas.",
    clarityLineStatic: "La claridad refleja lo fácil que es entender los términos."
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
    conf: "Confiance pour signer librement",
    riskLineStatic: "L'évaluation du risque repose sur l'équité et les obligations des clauses.",
    clarityLineStatic: "La clarté indique la facilité de compréhension des termes."
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
    conf: "Confiança para assinar livremente",
    riskLineStatic: "A pontuação de risco é baseada na equidade e obrigações das cláusulas.",
    clarityLineStatic: "A clareza reflete a facilidade de entender os termos."
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
    conf: "Vertrouwen om vrij te ondertekenen",
    riskLineStatic: "De risicoanalyse is gebaseerd op eerlijkheid en verplichtingen van de clausules.",
    clarityLineStatic: "De duidelijkheid toont hoe begrijpelijk de voorwaarden zijn."
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
    conf: "Încredere pentru a semna liber",
    riskLineStatic: "Scorul de risc se bazează pe echitatea și obligațiile clauzelor.",
    clarityLineStatic: "Claritatea arată cât de ușor sunt de înțeles termenii."
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
    conf: "Besim për të nënshkruar lirisht",
    riskLineStatic: "Vlerësimi i rrezikut bazohet në drejtësinë dhe detyrimet e klauzolave.",
    clarityLineStatic: "Qartësia tregon sa lehtë kuptohen termat."
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
    conf: "Serbestçe imzalama güveni",
    riskLineStatic: "Risk puanı, maddelerin adaleti ve yükümlülüklerine dayanır.",
    clarityLineStatic: "Netlik, şartların anlaşılabilirliğini gösterir."
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
    conf: "自由に署名する自信",
    riskLineStatic: "リスク評価は条項の公平性と義務に基づきます。",
    clarityLineStatic: "明瞭性は条項の理解しやすさを示します。"
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
    conf: "自由签署的信心",
    riskLineStatic: "风险评分基于条款的公平性和义务。",
    clarityLineStatic: "清晰度表示条款的易懂程度。"
  }
};

// languages allowed for first-render
const SUPPORTED_LANGS = ["en","it","de","es","fr","pt","nl","ro","sq","tr","ja","zh"];

export default async function handler(req, res) {

  // ----------------------------------
  // CORS + METHOD HANDLING
  // ----------------------------------
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return send(res, 204, {});
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  if (!SECRET) return send(res, 500, { error: "Missing OPENAI_API_KEY" });

  try {
    let raw = "";
    await new Promise((resolve) => {
      req.on("data", (c) => (raw += c));
      req.on("end", resolve);
    });

    const ct = (req.headers["content-type"] || "").toLowerCase();
    if (!ct.includes("application/json")) {
      return send(res, 415, { error: `Send application/json. Got: ${ct}` });
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
      targetLang = "en"       // UI language selector
    } = body || {};

    if (!text && !imageDataURI) {
      return send(res, 400, { error: "Provide text or imageDataURI" });
    }

    const uiLang = UI[targetLang] ? targetLang : "en";
    const t = UI[uiLang];

    // ------------------------------------------------------------------
    // SYSTEM PROMPT — returns main analysis + translations in all langs
    // ------------------------------------------------------------------
    const system = `You are a contract analyst. Return STRICT JSON only using this exact structure:

{
  "contractName": "string",
  "contractTitle": "string",
  "role": "signer|writer",
  "detectedLang": "en|it|de|es|fr|pt|nl|ro|sq|tr|ja|zh",
  "analysis": {
    "summary": ["string","string","string"],
    "risk": { "value": 0-100, "note": "string", "band": "green|orange|red", "safety": "generally safe|not that safe|not safe" },
    "clarity": { "value": 0-100, "note": "string", "band": "green|orange|red", "safety": "safe|not that safe|not safe" },
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
    "en": {...}, "it": {...}, "de": {...}, "es": {...}, "fr": {...}, "pt": {...},
    "nl": {...}, "ro": {...}, "sq": {...}, "tr": {...}, "ja": {...}, "zh": {...}
  }
}

RULES:
- Detect language of contract text properly.
- Main “analysis” must be in detectedLang.
- If detectedLang is NOT one of: en,it,de,es,fr,pt,nl,ro,sq,tr,ja,zh → use **English**.
- summary must be exactly 3 clean sentences.
- smartSuggestions exactly 3, each with e.g.
- scoreChecker.line must logically match verdict.
- translations.* must contain translated fields.
- German translations must be concise (10–15 chars shorter).`;

    // USER CONTENT FOR MODEL
    const userContent =
      imageDataURI
        ? [
            { type: "text", text: `Role: ${role}\nOriginal file: ${originalName}\nOCR then analyze.` },
            { type: "image_url", image_url: { url: imageDataURI } }
          ]
        : [
            {
              type: "text",
              text:
                `Role: ${role}\nOriginal file: ${originalName}\nAnalyze this contract:\n` +
                String(text).slice(0, 110000)
            }
          ];

    // --------------------------------------
    // OPENAI CALL — FAST MODEL
    // --------------------------------------
    let openaiResp;
    try {
      openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SECRET}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
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

    let parsed = {};
    try {
      const resp = await openaiResp.json();
      parsed = JSON.parse(resp?.choices?.[0]?.message?.content || "{}");
    } catch {
      return send(res, 500, { error: "Invalid JSON returned by model" });
    }

    // --------------------------------------
    // NORMALIZATION
    // --------------------------------------
    const cap = (s, n) => (s || "").trim().slice(0, n);
    const clamp = (v) => Math.max(0, Math.min(100, Number(v || 0)));
    const stripLead = (s) => String(s || "").replace(/^\s*\d+\s*[.)-]\s*/, "");

    let detectedLang =
      parsed.detectedLang && SUPPORTED_LANGS.includes(parsed.detectedLang)
        ? parsed.detectedLang
        : "en";

    // FIRST RENDER = detectedLang
    const firstRenderLang = detectedLang;

    const trIn = parsed.translations || {};
    const translationsOut = {};

    SUPPORTED_LANGS.forEach(code => {
      const src = trIn[code] || {};
      translationsOut[code] = {
        title: cap(src.title || "", 200),
        summary: (src.summary || []).map(s => cap(s, 320)).slice(0, 3),
        mainClauses: (src.mainClauses || []).map(s => stripLead(cap(s, 900))).slice(0, 5),
        potentialIssues: (src.potentialIssues || []).map(s => stripLead(cap(s, 1000))).slice(0, 5),
        smartSuggestions: (src.smartSuggestions || []).map(s => stripLead(cap(s, 250))).slice(0, 3),
        scoreLine: cap(src.scoreLine || "", 280)
      };
    });

    const sc = parsed.analysis.scoreChecker || {};
    const scVal = clamp(sc.value);

    let verdict =
      scVal < 34 ? "unsafe" :
      scVal < 67 ? "safe" :
      "verySafe";

    return send(res, 200, {
      contractName: parsed.contractName || originalName,
      contractTitle: parsed.contractTitle || parsed.contractName || originalName,
      role: parsed.role === "writer" ? "writer" : "signer",
      detectedLang: firstRenderLang,
      targetLang: uiLang,
      ui: UI[firstRenderLang],  // FIRST RENDER IN DETECTED LANGUAGE

      analysis: {
        summary: parsed.analysis.summary || [],
        risk: {
          value: clamp(parsed.analysis.risk.value),
          note: cap(parsed.analysis.risk.note, 280),
          band: parsed.analysis.risk.band,
          safety: parsed.analysis.risk.safety
        },
        clarity: {
          value: clamp(parsed.analysis.clarity.value),
          note: cap(parsed.analysis.clarity.note, 280),
          band: parsed.analysis.clarity.band,
          safety: parsed.analysis.clarity.safety
        },
        mainClauses: parsed.analysis.mainClauses || [],
        potentialIssues: parsed.analysis.potentialIssues || [],
        smartSuggestions: parsed.analysis.smartSuggestions || [],
        bars: parsed.analysis.bars || {},
        scoreChecker: {
          value: scVal,
          band: parsed.analysis.scoreChecker.band,
          verdict,
          line: cap(parsed.analysis.scoreChecker.line, 280),
          verdictLabel: UI[firstRenderLang][verdict]
        }
      },

      translations: translationsOut
    });

  } catch (err) {
    return send(res, 500, { error: "Could not analyze this file. Details: " + err.message });
  }
}

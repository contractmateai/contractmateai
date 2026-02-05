// Static translations for all supported languages
const STATIC_TRANSLATIONS = {
  en: {
    summary: "Summary",
    professionalism: "Professionalism",
    favorability: "Favorability",
    deadlinePressure: "Deadline Pressure",
    potentialIssues: "Potential Issues",
    riskLevel: "Risk Level",
    clauseClarity: "Clause Clarity",
    smartSuggestions: "Suggestions",
    mainClauses: "Main Clauses",
    overallScore: "Final Score",
    confidenceToSign: "Confidence to Sign",
    riskStatic: "Based on clause fairness and obligations.",
    clarityStatic: "Reflects how easy the terms are to understand.",
    scoreStatic: "Determines the final score.",
    unsafe: "Unsafe",
    notThatSafe: "Not that safe",
    safe: "Safe",
    verySafe: "Very Safe",
  },

  es: {
    summary: "Resumen",
    professionalism: "Profesionalismo",
    favorability: "Favorabilidad",
    deadlinePressure: "Presión de plazo",
    potentialIssues: "Posibles problemas",
    riskLevel: "Nivel de riesgo",
    clauseClarity: "Claridad de cláusulas",
    smartSuggestions: "Sugerencias",
    mainClauses: "Cláusulas principales",
    overallScore: "Puntuación final",
    confidenceToSign: "Confianza para firmar",
    riskStatic: "Basado en equidad y obligaciones.",
    clarityStatic: "Indica qué tan claros son los términos.",
    scoreStatic: "Determina la puntuación final.",
    unsafe: "No seguro",
    notThatSafe: "No tan seguro",
    safe: "Seguro",
    verySafe: "Muy seguro",
  },

  de: {
    summary: "Zusammenfassung",
    professionalism: "Professionalität",
    favorability: "Vorteilhaftigkeit",
    deadlinePressure: "Zeitdruck",
    potentialIssues: "Mögliche Probleme",
    riskLevel: "Risikostufe",
    clauseClarity: "Klauselklarheit",
    smartSuggestions: "Vorschläge",
    mainClauses: "Hauptklauseln",
    overallScore: "Endbewertung",
    confidenceToSign: "Unterschriftssicherheit",
    riskStatic: "Basierend auf Fairness und Pflichten.",
    clarityStatic: "Zeigt Verständlichkeit der Klauseln.",
    scoreStatic: "Bestimmt die Endbewertung.",
    unsafe: "Unsicher",
    notThatSafe: "Nicht so sicher",
    safe: "Sicher",
    verySafe: "Sehr sicher",
  },

  fr: {
    summary: "Résumé",
    professionalism: "Professionnalisme",
    favorability: "Avantage",
    deadlinePressure: "Pression de délai",
    potentialIssues: "Problèmes potentiels",
    riskLevel: "Niveau de risque",
    clauseClarity: "Clarté des clauses",
    smartSuggestions: "Suggestions",
    mainClauses: "Clauses principales",
    overallScore: "Score final",
    confidenceToSign: "Confiance pour signer",
    riskStatic: "Basé sur l’équité et les obligations.",
    clarityStatic: "Indique la clarté des termes.",
    scoreStatic: "Détermine le score final.",
    unsafe: "Risqué",
    notThatSafe: "Pas si sûr",
    safe: "Sûr",
    verySafe: "Très sûr",
  },

  it: {
    summary: "Riepilogo",
    professionalism: "Professionalità",
    favorability: "Convenienza",
    deadlinePressure: "Pressione scadenze",
    potentialIssues: "Problemi potenziali",
    riskLevel: "Livello di rischio",
    clauseClarity: "Chiarezza clausole",
    smartSuggestions: "Suggerimenti",
    mainClauses: "Clausole principali",
    overallScore: "Punteggio finale",
    confidenceToSign: "Fiducia alla firma",
    riskStatic: "Basato su equità e obblighi.",
    clarityStatic: "Indica quanto sono chiari i termini.",
    scoreStatic: "Determina il punteggio finale.",
    unsafe: "Rischioso",
    notThatSafe: "Non così sicuro",
    safe: "Sicuro",
    verySafe: "Molto sicuro",
  },

  pt: {
    summary: "Resumo",
    professionalism: "Profissionalismo",
    favorability: "Vantagem",
    deadlinePressure: "Pressão de prazo",
    potentialIssues: "Possíveis problemas",
    riskLevel: "Nível de risco",
    clauseClarity: "Clareza das cláusulas",
    smartSuggestions: "Sugestões",
    mainClauses: "Cláusulas principais",
    overallScore: "Pontuação final",
    confidenceToSign: "Confiança para assinar",
    riskStatic: "Baseado em justiça e obrigações.",
    clarityStatic: "Mostra a clareza dos termos.",
    scoreStatic: "Define a pontuação final.",
    unsafe: "Arriscado",
    notThatSafe: "Não tão seguro",
    safe: "Seguro",
    verySafe: "Muito seguro",
  },

  nl: {
    summary: "Samenvatting",
    professionalism: "Professionaliteit",
    favorability: "Voordeel",
    deadlinePressure: "Tijdsdruk",
    potentialIssues: "Mogelijke problemen",
    riskLevel: "Risiconiveau",
    clauseClarity: "Clausuleduidelijkheid",
    smartSuggestions: "Suggesties",
    mainClauses: "Hoofdclausules",
    overallScore: "Eindscore",
    confidenceToSign: "Vertrouwen om te tekenen",
    riskStatic: "Gebaseerd op eerlijkheid en plichten.",
    clarityStatic: "Geeft duidelijkheid van voorwaarden aan.",
    scoreStatic: "Bepaalt de eindscore.",
    unsafe: "Onveilig",
    notThatSafe: "Niet zo veilig",
    safe: "Veilig",
    verySafe: "Zeer veilig",
  },

  ro: {
    summary: "Rezumat",
    professionalism: "Profesionalism",
    favorability: "Avantaj",
    deadlinePressure: "Presiune termen",
    potentialIssues: "Probleme posibile",
    riskLevel: "Nivel de risc",
    clauseClarity: "Claritate clauze",
    smartSuggestions: "Sugestii",
    mainClauses: "Clauze principale",
    overallScore: "Scor final",
    confidenceToSign: "Încredere la semnare",
    riskStatic: "Bazat pe echitate și obligații.",
    clarityStatic: "Arată cât de clare sunt condițiile.",
    scoreStatic: "Determină scorul final.",
    unsafe: "Nesigur",
    notThatSafe: "Nu prea sigur",
    safe: "Sigur",
    verySafe: "Foarte sigur",
  },

  sq: {
    summary: "Përmbledhje",
    professionalism: "Profesionalizëm",
    favorability: "Përfitim",
    deadlinePressure: "Presion afati",
    potentialIssues: "Probleme të mundshme",
    riskLevel: "Niveli i rrezikut",
    clauseClarity: "Qartësi klauzolash",
    smartSuggestions: "Sugjerime",
    mainClauses: "Klauzola kryesore",
    overallScore: "Rezultati final",
    confidenceToSign: "Besim për nënshkrim",
    riskStatic: "Bazuar në drejtësi dhe detyrime.",
    clarityStatic: "Tregon sa të qarta janë kushtet.",
    scoreStatic: "Përcakton rezultatin final.",
    unsafe: "I pasigurt",
    notThatSafe: "Jo shumë i sigurt",
    safe: "I sigurt",
    verySafe: "Shumë i sigurt",
  },

  zh: {
    summary: "摘要",
    professionalism: "专业性",
    favorability: "有利性",
    deadlinePressure: "期限压力",
    potentialIssues: "潜在问题",
    riskLevel: "风险等级",
    clauseClarity: "条款清晰度",
    smartSuggestions: "建议",
    mainClauses: "主要条款",
    overallScore: "最终评分",
    confidenceToSign: "签署信心",
    riskStatic: "基于条款公平性和义务。",
    clarityStatic: "反映条款理解难度。",
    scoreStatic: "决定最终评分。",
    unsafe: "不安全",
    notThatSafe: "不是很安全",
    safe: "安全",
    verySafe: "非常安全",
  },

  ja: {
    summary: "要約",
    professionalism: "専門性",
    favorability: "有利性",
    deadlinePressure: "期限圧力",
    potentialIssues: "潜在的な問題",
    riskLevel: "リスクレベル",
    clauseClarity: "条項の明確さ",
    smartSuggestions: "提案",
    mainClauses: "主要条項",
    overallScore: "最終スコア",
    confidenceToSign: "署名の信頼度",
    riskStatic: "条項の公平性と義務に基づく。",
    clarityStatic: "条項の分かりやすさを示す。",
    scoreStatic: "最終スコアを決定。",
    unsafe: "危険",
    notThatSafe: "あまり安全ではない",
    safe: "安全",
    verySafe: "非常に安全",
  },

  tr: {
    summary: "Özet",
    professionalism: "Profesyonellik",
    favorability: "Avantaj",
    deadlinePressure: "Süre baskısı",
    potentialIssues: "Olası sorunlar",
    riskLevel: "Risk seviyesi",
    clauseClarity: "Madde açıklığı",
    smartSuggestions: "Öneriler",
    mainClauses: "Ana maddeler",
    overallScore: "Final puanı",
    confidenceToSign: "İmzalama güveni",
    riskStatic: "Adalet ve yükümlülüklere dayanır.",
    clarityStatic: "Şartların anlaşılmasını gösterir.",
    scoreStatic: "Final puanı belirler.",
    unsafe: "Riskli",
    notThatSafe: "O kadar güvenli değil",
    safe: "Güvenli",
    verySafe: "Çok güvenli",
  },
};

// Helper for risk verdict color and label
import React, { useState, useEffect, useRef } from "react";

// Helper for risk verdict color and label
function riskVerdictKey(val) {
  const v = clamp(val);
  if (v <= 29) return "very_safe";
  if (v <= 62) return "not_safe";
  return "unsafe";
}

// Helper for clarity verdict color and label
function clarityVerdictKey(val) {
  const v = clamp(val);
  if (v >= 63) return "very_safe";
  if (v >= 30) return "not_safe";
  return "unsafe";
}

import AnalysisSidebar from "../components/AnalysisSidebar";
import AnalysisDrawer from "../components/AnalysisDrawer";
import PDFGenerator from "../utils/PDFGenerator";
import "../styles/analysis.css";

function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(val) || 0));
}

const bandColor = {
  green: "var(--green)",
  orange: "var(--orange)",
  red: "var(--red)",
};

const dotColor = {
  "generally safe": "var(--green)",
  safe: "var(--green)",
  "not that safe": "var(--orange)",
  "not safe": "var(--red)",
  unsafe: "var(--red)",
  "very safe": "var(--green)",
};

const Analysis = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState(null);
  const [lang, setLang] = useState("en");
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEmailInline, setShowEmailInline] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [downloading, setDownloading] = useState(false);

  // Translation state
  const [translationCache, setTranslationCache] = useState({});
  const [isTranslating, setIsTranslating] = useState(false);

  // Show/hide download bar based on scroll (like original)
  useEffect(() => {
    const handleScroll = () => {
      const dlWrap = document.getElementById("dlWrap");
      if (!dlWrap) return;

      const scrolledFromBottom =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);

      const show = scrolledFromBottom <= 320;
      dlWrap.style.display = show ? "flex" : "none";
      dlWrap.style.opacity = show ? 1 : 0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    setTimeout(handleScroll, 200);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Email modal/inline logic
  const isMobile = () => window.matchMedia("(max-width: 980px)").matches;

  const openEmailForm = () => {
    if (isMobile()) {
      setShowEmailInline(true);
    } else {
      setShowEmailModal(true);
    }
    setEmail("");
    setEmailError("");
  };

  const closeEmailForm = () => {
    setShowEmailModal(false);
    setShowEmailInline(false);
    setEmail("");
    setEmailError("");
  };

  const validEmail = (e) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((e || "").trim());

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    if (!validEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setDownloading(true);

    try {
      // Get original analysis data
      const analysis = data?.analysis || {};

      // Use cached translation if available for the selected language
      const cachedTranslation = translationCache[lang] || {};

      // Fallback to API translations (though they're usually empty)
      const apiTranslation =
        data?.translations?.[lang]?.analysis ||
        data?.translations?.[String(lang || "").toUpperCase()]?.analysis ||
        {};

      // Get translated arrays - prioritize cache, then API, then original
      const translatedSummary =
        Array.isArray(cachedTranslation.summary) &&
        cachedTranslation.summary.length
          ? cachedTranslation.summary
          : Array.isArray(apiTranslation.summary) &&
              apiTranslation.summary.length
            ? apiTranslation.summary
            : Array.isArray(analysis.summary) && analysis.summary.length
              ? analysis.summary
              : [];

      const translatedIssues =
        Array.isArray(cachedTranslation.potentialIssues) &&
        cachedTranslation.potentialIssues.length
          ? cachedTranslation.potentialIssues
          : Array.isArray(apiTranslation.potentialIssues) &&
              apiTranslation.potentialIssues.length
            ? apiTranslation.potentialIssues
            : Array.isArray(analysis.potentialIssues) &&
                analysis.potentialIssues.length
              ? analysis.potentialIssues
              : [];

      const translatedSuggestions =
        Array.isArray(cachedTranslation.smartSuggestions) &&
        cachedTranslation.smartSuggestions.length
          ? cachedTranslation.smartSuggestions
          : Array.isArray(apiTranslation.smartSuggestions) &&
              apiTranslation.smartSuggestions.length
            ? apiTranslation.smartSuggestions
            : Array.isArray(analysis.smartSuggestions) &&
                analysis.smartSuggestions.length
              ? analysis.smartSuggestions
              : [];

      const translatedClauses =
        Array.isArray(cachedTranslation.mainClauses) &&
        cachedTranslation.mainClauses.length
          ? cachedTranslation.mainClauses
          : Array.isArray(apiTranslation.mainClauses) &&
              apiTranslation.mainClauses.length
            ? apiTranslation.mainClauses
            : Array.isArray(analysis.mainClauses) && analysis.mainClauses.length
              ? analysis.mainClauses
              : [];

      // Get translated notes
      const translatedRiskNote =
        cachedTranslation.riskNote ||
        apiTranslation.risk?.note ||
        analysis.risk?.note ||
        "";

      const translatedClarityNote =
        cachedTranslation.clarityNote ||
        apiTranslation.clarity?.note ||
        analysis.clarity?.note ||
        "";

      const translatedScoreLine =
        cachedTranslation.scoreLine ||
        apiTranslation.scoreChecker?.line ||
        analysis.scoreChecker?.line ||
        "";

      // Build translated risk/clarity/score objects
      const translatedRisk = {
        value: analysis.risk?.value || 0,
        note: translatedRiskNote,
        safety: analysis.risk?.safety || "Unknown",
        band: analysis.risk?.band || "green",
      };

      const translatedClarity = {
        value: analysis.clarity?.value || 0,
        note: translatedClarityNote,
        safety: analysis.clarity?.safety || "Unknown",
        band: analysis.clarity?.band || "green",
      };

      const translatedScoreChecker = {
        value: analysis.scoreChecker?.value || 0,
        line: translatedScoreLine,
        safety: analysis.scoreChecker?.safety || "Unknown",
        band: analysis.scoreChecker?.band || "green",
        verdict: analysis.scoreChecker?.verdict || "safe",
      };

      // Map API response structure to PDF generator expectations with translated content
      const pdfData = {
        title: data.contractTitle || data.contractName || "Contract",
        summary: translatedSummary,
        risk: translatedRisk,
        clarity: translatedClarity,
        clauses: translatedClauses,
        issues: translatedIssues,
        suggestions: translatedSuggestions,
        meters: {
          professionalism: analysis?.bars?.professionalism ?? 65,
          favorability: analysis?.bars?.favorability ?? 50,
          deadline: analysis?.bars?.deadline ?? 40,
          confidence: analysis?.bars?.confidence ?? 70,
        },
        analysis: {
          scoreChecker: translatedScoreChecker,
        },
      };

      // pdf-generator exports a class -> must instantiate
      const pdfGen = new PDFGenerator();
      await pdfGen.generatePDF("SignSense_Report", pdfData, lang);
    } catch (err) {
      console.error(err);
      alert("Could not generate PDF report.");
    }

    setDownloading(false);
    closeEmailForm();
  };

  // For animating SVG arcs
  const riskArcRef = useRef();
  const clarArcRef = useRef();
  const scoreArcRef = useRef();

  useEffect(() => {
    // Load analysis result from localStorage (as in original HTML)
    let raw = localStorage.getItem("analysisRaw");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setData(parsed);
        setLang(parsed.targetLang || parsed.detectedLang || "en");
      } catch {}
    }
  }, []);

  // Animate SVG arcs when data changes
  useEffect(() => {
    if (!data) return;

    const { analysis } = data;

    // Helper for arc
    function setArc(ref, value, color) {
      if (!ref.current) return;

      const raw = clamp(value, 0, 100);
      const pct = (raw === 0 ? 1 : raw) / 100;

      const r = 64;
      const c = 2 * Math.PI * r;

      // INLINE style wins over CSS for SVG presentation props
      ref.current.style.strokeDasharray = `${c}`;
      ref.current.style.strokeDashoffset = `${c * (1 - pct)}`;
      ref.current.style.stroke = color;
    }

    // Professionalism & Favorability bar color logic
    function getProfFavColor(val) {
      if (val <= 29) return bandColor.red;
      if (val <= 70) return bandColor.orange;
      return bandColor.green;
    }

    // Deadline pressure bar color logic
    function getDeadlineColor(val) {
      if (val <= 29) return bandColor.green;
      if (val <= 64) return bandColor.orange;
      return bandColor.red;
    }

    // Risk Level circle chart: green 0-29% very safe, orange 30-62% safe, 63-100 red unsafe
    function getRiskColor(val) {
      if (val <= 29) return bandColor.green;
      if (val <= 62) return bandColor.orange;
      return bandColor.red;
    }

    // Clause Clarity & Overall Score chart: red 0-29% unsafe, orange 30-62% safe, green 63-100 very safe
    function getClarityColor(val) {
      if (val <= 29) return bandColor.red;
      if (val <= 62) return bandColor.orange;
      return bandColor.green;
    }

    setArc(
      riskArcRef,
      analysis?.risk?.value,
      getRiskColor(analysis?.risk?.value),
    );
    setArc(
      clarArcRef,
      analysis?.clarity?.value,
      getClarityColor(analysis?.clarity?.value),
    );
    setArc(
      scoreArcRef,
      analysis?.scoreChecker?.value,
      getClarityColor(analysis?.scoreChecker?.value),
    );

    // Silence unused warnings (kept exactly like your original logic)
    getProfFavColor(clamp(analysis?.bars?.professionalism));
    getProfFavColor(clamp(analysis?.bars?.favorabilityIndex));
    getDeadlineColor(clamp(analysis?.bars?.deadlinePressure));
  }, [data]);

  // Translate content on-demand when switching language
  const translateContent = async (targetLang, originalAnalysis) => {
    // Skip if already in cache
    if (translationCache[targetLang]) {
      return translationCache[targetLang];
    }

    // Skip translation for English - use original
    if (targetLang === "en") {
      return originalAnalysis;
    }

    setIsTranslating(true);

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetLang,
          content: {
            summary: originalAnalysis.summary,
            mainClauses: originalAnalysis.mainClauses,
            potentialIssues: originalAnalysis.potentialIssues,
            smartSuggestions: originalAnalysis.smartSuggestions,
            riskNote: originalAnalysis.risk?.note,
            clarityNote: originalAnalysis.clarity?.note,
            scoreLine: originalAnalysis.scoreChecker?.line,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const result = await response.json();
      const translated = result.translation;

      // Cache the translation
      setTranslationCache((prev) => ({
        ...prev,
        [targetLang]: translated,
      }));

      return translated;
    } catch (error) {
      console.error("Translation error:", error);
      // Return original on error
      return originalAnalysis;
    } finally {
      setIsTranslating(false);
    }
  };

  // Language switching with translation
  const handleLangClick = async (code) => {
    setLang(code);
    setLangMenuOpen(false);

    // Trigger translation if not English and not cached
    if (code !== "en" && data?.analysis && !translationCache[code]) {
      await translateContent(code, data.analysis);
    }
  };

  // Dropdown open/close logic
  const langBtnRef = useRef();
  const langMenuRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(e.target) &&
        langBtnRef.current &&
        !langBtnRef.current.contains(e.target)
      ) {
        setLangMenuOpen(false);
      }
    }

    if (langMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langMenuOpen]);

  // Helper for translation fields
  const baseUI = data?.ui || {};
  const tr =
    data?.translations?.[lang] ||
    data?.translations?.[String(lang || "").toUpperCase()] ||
    {};

  const staticTr = STATIC_TRANSLATIONS[lang] || STATIC_TRANSLATIONS.en;
  const ui = tr.ui || tr.UI || tr.labels || tr.strings || tr.text || baseUI;

  // ALWAYS pull box titles + static lines from STATIC_TRANSLATIONS first
  const tLabel = (k, fallback) => staticTr?.[k] || ui?.[k] || fallback;
  // Map verdict string to translation key
  const verdictToTrKey = (v) =>
    v === "very_safe"
      ? "verySafe"
      : v === "not_safe"
        ? "notThatSafe"
        : "unsafe";

  // Static sentences (always translated)
  const staticRiskNote =
    staticTr?.riskStatic || STATIC_TRANSLATIONS.en.riskStatic;
  const staticClarityNote =
    staticTr?.clarityStatic || STATIC_TRANSLATIONS.en.clarityStatic;
  const staticScoreNote =
    staticTr?.scoreStatic || STATIC_TRANSLATIONS.en.scoreStatic;

  // translated dynamic arrays (fallback to original if missing)
  const analysis = data?.analysis || {};

  // Use cached translation if available, otherwise use API response or original
  const cachedTranslation = translationCache[lang] || {};
  const tAnalysis = cachedTranslation || tr.analysis || {};

  // Robust fallback for summary: try all possible fields, prefer arrays, fallback to string split
  function getSummaryArr() {
    const candidates = [
      tAnalysis.summary,
      tr.summary,
      analysis.summary,
      analysis.summaryText,
      analysis.summaryLines,
    ];
    for (const c of candidates) {
      if (Array.isArray(c) && c.length) return c;
      if (typeof c === "string" && c.trim())
        return c
          .split(/\r?\n|•|- /g)
          .map((s) => s.trim())
          .filter(Boolean);
    }
    return [];
  }
  // Use translated arrays with proper fallback to original English
  const tSummary =
    Array.isArray(tAnalysis.summary) && tAnalysis.summary.length
      ? tAnalysis.summary
      : Array.isArray(analysis.summary) && analysis.summary.length
        ? analysis.summary
        : [];

  const tIssues =
    Array.isArray(tAnalysis.potentialIssues) && tAnalysis.potentialIssues.length
      ? tAnalysis.potentialIssues
      : Array.isArray(analysis.potentialIssues) &&
          analysis.potentialIssues.length
        ? analysis.potentialIssues
        : ["—"];

  const tSuggestions =
    Array.isArray(tAnalysis.smartSuggestions) &&
    tAnalysis.smartSuggestions.length
      ? tAnalysis.smartSuggestions
      : Array.isArray(analysis.smartSuggestions) &&
          analysis.smartSuggestions.length
        ? analysis.smartSuggestions
        : [];

  const tClauses =
    Array.isArray(tAnalysis.mainClauses) && tAnalysis.mainClauses.length
      ? tAnalysis.mainClauses
      : Array.isArray(analysis.mainClauses) && analysis.mainClauses.length
        ? analysis.mainClauses
        : ["—"];

  // Translated notes (risk, clarity, score)
  const tRiskNote = tAnalysis.riskNote || analysis.risk?.note || "";
  const tClarityNote = tAnalysis.clarityNote || analysis.clarity?.note || "";
  const tScoreLine = tAnalysis.scoreLine || analysis.scoreChecker?.line || "";

  // translated title (fallback to original)
  const tTitle =
    tAnalysis.contractTitle ??
    tr.contractTitle ??
    data?.contractTitle ??
    data?.contractName ??
    "—";

  // Use static muted color for all explanations
  const mutedStyle = { color: "var(--muted)", fontSize: 15 };

  // Only allow 'unsafe', 'safe', 'very safe' verdicts
  const verdictDotColor = {
    unsafe: "var(--red)",
    safe: "var(--green)",
    verysafe: "var(--green)",
  };

  // Helper to always show fallback/defaults for boxes
  function normalizeList(v) {
    if (Array.isArray(v))
      return v
        .filter(Boolean)
        .map((x) => String(x).trim())
        .filter(Boolean);

    if (typeof v === "string") {
      return v
        .split(/\r?\n|•|- /g)
        .map((s) => String(s).trim())
        .filter(Boolean);
    }

    // sometimes API sends { items: [...] }
    if (v && typeof v === "object") {
      const maybe = v.items || v.list || v.values;
      if (Array.isArray(maybe))
        return maybe
          .filter(Boolean)
          .map((x) => String(x).trim())
          .filter(Boolean);
    }

    return [];
  }

  function fallbackArr(v) {
    return normalizeList(v);
  }

  // Prevent unused warnings (kept)
  getSummaryArr();
  verdictDotColor.unsafe;

  return (
    <>
      <AnalysisDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="layout">
        <AnalysisSidebar />

        <main className="main">
          <div className="analysis-header-row">
            <div className="analysis-header-left">
              <span className="analysis-overview-label" id="uiOverview">
                {ui.overview || "Overview"}
              </span>
            </div>

            <div className="analysis-header-right">
              <div className={`lang${langMenuOpen ? " open" : ""}`} id="lang">
                <button
                  className="lang-btn"
                  id="langBtn"
                  type="button"
                  ref={langBtnRef}
                  onClick={() => setLangMenuOpen((v) => !v)}
                  aria-expanded={langMenuOpen}
                  aria-haspopup="listbox"
                  disabled={isTranslating}
                  style={{
                    opacity: isTranslating ? 0.6 : 1,
                    cursor: isTranslating ? "wait" : "pointer",
                  }}
                >
                  {isTranslating ? (
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid #3b3b3b",
                        borderTop: "2px solid #fff",
                        borderRadius: "50%",
                        animation: "spin 0.6s linear infinite",
                      }}
                    />
                  ) : (
                    <span
                      id="langNow"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 400,
                        fontSize: "20px",
                      }}
                    >
                      {lang.toUpperCase()}
                    </span>
                  )}
                  <span className="caret" aria-hidden="true"></span>
                </button>

                {langMenuOpen && (
                  <div
                    className="lang-menu"
                    id="langMenu"
                    role="listbox"
                    aria-label="Report Language"
                    ref={langMenuRef}
                  >
                    {Object.entries({
                      en: "English",
                      it: "Italiano",
                      de: "Deutsch",
                      es: "Español",
                      fr: "Français",
                      pt: "Português",
                      nl: "Nederlands",
                      ro: "Română",
                      sq: "Shqip",
                      tr: "Türkçe",
                      zh: "中文",
                      ja: "日本語",
                    }).map(([code, label]) => (
                      <div
                        className="lang-item"
                        data-code={code}
                        key={code}
                        onClick={() => handleLangClick(code)}
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: lang === code ? 600 : 400,
                          fontSize: "20px",
                          background: lang === code ? "#e2e2e2" : "transparent",
                          color: lang === code ? "#000" : undefined,
                        }}
                        tabIndex={0}
                        role="option"
                        aria-selected={lang === code}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              borderBottom: "1px solid #e2e2e2",
              margin: "0 0 18px 0",
              height: 0,
            }}
          ></div>

          {isTranslating && (
            <div
              style={{
                padding: "10px 16px",
                background: "#1c1b22",
                border: "1px solid #3b3b3b",
                borderRadius: "12px",
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontFamily: "Inter, sans-serif",
                fontSize: "15px",
                color: "#bdbdbd",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #3b3b3b",
                  borderTop: "2px solid #bdbdbd",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              />
              <span>Translating content...</span>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}

          <div className="doc-title">
            <span className="label" id="uiTitleLabel">
              {ui.title || "Title:"}
            </span>
            <span className="value" id="uiTitleValue">
              {" "}
              {tTitle}
            </span>
          </div>

          <div className="grid">
            <div className="left">
              <section className="card" id="summaryCard">
                <h3 style={{ fontWeight: 400 }}>
                  <img src="https://imgur.com/CuQFbD7.png" alt="" />
                  <span id="uiSummary">
                    {tLabel("summary", STATIC_TRANSLATIONS.en.summary)}
                  </span>
                </h3>

                <div
                  className="list"
                  id="summaryText"
                  style={{ fontSize: "20px" }}
                >
                  {tSummary.length > 0 ? (
                    tSummary.map((s, i) => (
                      <div key={i} style={{ ...mutedStyle, fontSize: "20px" }}>
                        {s}
                      </div>
                    ))
                  ) : (
                    <div style={{ ...mutedStyle, fontSize: "18px" }}>
                      No summary available.
                    </div>
                  )}
                </div>
              </section>

              <section className="card meter-block" id="profCard">
                <div className="meter-head">
                  <div className="meter-title">
                    <img src="https://imgur.com/EdMAMnx.png" alt="" />
                    <span id="uiProfessionalism">
                      {tLabel("professionalism", "Professionalism")}
                    </span>
                  </div>
                  <div id="confVal">
                    {clamp(analysis.bars?.professionalism)}%
                  </div>
                </div>

                <div className="meter">
                  <div
                    id="confFill"
                    className="fill"
                    style={{
                      width: `${clamp(analysis.bars?.professionalism)}%`,
                      background:
                        clamp(analysis.bars?.professionalism) <= 29
                          ? bandColor.red
                          : clamp(analysis.bars?.professionalism) <= 70
                            ? bandColor.orange
                            : bandColor.green,
                    }}
                  ></div>
                </div>
              </section>

              <section className="card meter-block" id="favCard">
                <div className="meter-head">
                  <div className="meter-title">
                    <img src="https://imgur.com/UDRuIvO.png" alt="" />
                    <span id="uiFavorability">
                      {tLabel("favorability", "Favorability")}
                    </span>
                  </div>
                  <div id="favVal">
                    {clamp(analysis.bars?.favorabilityIndex)}%
                  </div>
                </div>

                <div className="meter">
                  <div
                    id="favFill"
                    className="fill"
                    style={{
                      width: `${clamp(analysis.bars?.favorabilityIndex)}%`,
                      background:
                        clamp(analysis.bars?.favorabilityIndex) <= 29
                          ? bandColor.red
                          : clamp(analysis.bars?.favorabilityIndex) <= 70
                            ? bandColor.orange
                            : bandColor.green,
                    }}
                  ></div>
                </div>
              </section>

              <section className="card meter-block" id="deadCard">
                <div className="meter-head">
                  <div className="meter-title">
                    <img src="https://imgur.com/VXZ3kD8.png" alt="" />
                    <span id="uiDeadline">
                      {tLabel("deadlinePressure", "Deadline Pressure")}
                    </span>
                  </div>
                  <div id="deadVal">
                    {clamp(analysis.bars?.deadlinePressure)}%
                  </div>
                </div>

                <div className="meter">
                  <div
                    id="deadFill"
                    className="fill"
                    style={{
                      width: `${clamp(analysis.bars?.deadlinePressure)}%`,
                      background:
                        clamp(analysis.bars?.deadlinePressure) <= 29
                          ? bandColor.green
                          : clamp(analysis.bars?.deadlinePressure) <= 64
                            ? bandColor.orange
                            : bandColor.red,
                    }}
                  ></div>
                </div>
              </section>

              <section className="card" id="issuesCard">
                <h3 style={{ fontWeight: 400 }}>
                  <img src="https://imgur.com/ppLDtiq.png" alt="" />
                  <span id="uiIssues">
                    {tLabel(
                      "potentialIssues",
                      STATIC_TRANSLATIONS.en.potentialIssues,
                    )}
                  </span>
                </h3>

                <ul
                  className="bullets"
                  id="issuesList"
                  style={{ fontSize: "20px" }}
                >
                  {fallbackArr(tIssues).map((issue, i) => (
                    <li key={i} style={{ ...mutedStyle, fontSize: "20px" }}>
                      {issue}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="card" id="suggestionsCard">
                <h3 style={{ fontWeight: 400 }}>
                  <img src="https://imgur.com/EoVDfd5.png" alt="" />
                  <span id="uiSuggestions">
                    {tLabel(
                      "smartSuggestions",
                      STATIC_TRANSLATIONS.en.smartSuggestions,
                    )}
                  </span>
                </h3>

                <div
                  className="list numbered"
                  id="suggestionsList"
                  style={{ fontSize: "20px" }}
                >
                  {tSuggestions.length > 0 ? (
                    tSuggestions.map((s, i) => (
                      <div key={i} style={{ ...mutedStyle, fontSize: "20px" }}>
                        {`${i + 1}. ${s}`}
                      </div>
                    ))
                  ) : (
                    <div style={{ ...mutedStyle, fontSize: "18px" }}>
                      No suggestions available.
                    </div>
                  )}
                </div>
              </section>
            </div>

            <div className="right">
              <section className="card" id="riskCard">
                <div className="hcard">
                  <div className="circle">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle
                        className="track"
                        cx="70"
                        cy="70"
                        r="64"
                        strokeWidth="12"
                        fill="none"
                      ></circle>
                      <circle
                        ref={riskArcRef}
                        id="riskArc"
                        className="arc"
                        cx="70"
                        cy="70"
                        r="64"
                        strokeWidth="12"
                        fill="none"
                      ></circle>
                    </svg>
                    <div className="val" id="riskVal">
                      {clamp(analysis.risk?.value)}%
                    </div>
                  </div>

                  <div className="htext">
                    <h3 style={{ marginBottom: 0, fontWeight: 400 }}>
                      <img src="https://imgur.com/Myp6Un4.png" alt="" />
                      <span id="uiRisk">
                        {tLabel("riskLevel", "Risk Level")}
                      </span>
                    </h3>

                    <div className="muted" id="riskNote" style={mutedStyle}>
                      {staticRiskNote}
                    </div>

                    <div className="status">
                      <span
                        className="dot"
                        id="riskDot"
                        style={{
                          background:
                            riskVerdictKey(clamp(analysis.risk?.value)) ===
                            "unsafe"
                              ? "var(--red)"
                              : riskVerdictKey(clamp(analysis.risk?.value)) ===
                                  "not_safe"
                                ? "var(--orange)"
                                : "var(--green)",
                        }}
                      ></span>

                      <span id="riskBadge">
                        {tLabel(
                          verdictToTrKey(
                            riskVerdictKey(clamp(analysis.risk?.value)),
                          ),
                          STATIC_TRANSLATIONS.en.unsafe,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="card" id="clarCard">
                <div className="hcard">
                  <div className="circle">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle
                        className="track"
                        cx="70"
                        cy="70"
                        r="64"
                        strokeWidth="12"
                        fill="none"
                      ></circle>
                      <circle
                        ref={clarArcRef}
                        id="clarArc"
                        className="arc"
                        cx="70"
                        cy="70"
                        r="64"
                        strokeWidth="12"
                        fill="none"
                      ></circle>
                    </svg>
                    <div className="val" id="clarVal">
                      {clamp(analysis.clarity?.value)}%
                    </div>
                  </div>

                  <div className="htext">
                    <h3 style={{ marginBottom: 0, fontWeight: 400 }}>
                      <img src="https://imgur.com/o39xZtC.png" alt="" />
                      <span id="uiClarity">
                        {tLabel(
                          "clauseClarity",
                          STATIC_TRANSLATIONS.en.clauseClarity,
                        )}
                      </span>
                    </h3>

                    <div className="muted" id="clarNote" style={mutedStyle}>
                      {staticClarityNote}
                    </div>

                    <div className="status">
                      <span
                        className="dot"
                        id="clarDot"
                        style={{
                          background:
                            clarityVerdictKey(analysis?.clarity?.value) ===
                            "unsafe"
                              ? "var(--red)"
                              : clarityVerdictKey(analysis?.clarity?.value) ===
                                  "not_safe"
                                ? "var(--orange)"
                                : "var(--green)",
                        }}
                      />
                      <span id="clarBadge">
                        {tLabel(
                          verdictToTrKey(
                            clarityVerdictKey(clamp(analysis?.clarity?.value)),
                          ),
                          STATIC_TRANSLATIONS.en.unsafe,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="card" id="clausesCard">
                <h3 style={{ fontWeight: 400 }}>
                  <img src="https://imgur.com/K04axKU.png" alt="" />
                  <span id="uiClauses">
                    {tLabel("mainClauses", STATIC_TRANSLATIONS.en.mainClauses)}
                  </span>
                </h3>

                <div
                  className="list numbered"
                  id="clausesList"
                  style={{ fontSize: "20px" }}
                >
                  {fallbackArr(tClauses).map((c, i) => (
                    <div key={i} style={{ ...mutedStyle, fontSize: "20px" }}>
                      {`${i + 1}. ${c}`}
                    </div>
                  ))}
                </div>
              </section>

              <section className="card" id="scoreCard">
                <div className="hcard">
                  <div className="circle">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle
                        className="track"
                        cx="70"
                        cy="70"
                        r="64"
                        strokeWidth="12"
                        fill="none"
                      ></circle>
                      <circle
                        ref={scoreArcRef}
                        id="scoreArc"
                        className="arc"
                        cx="70"
                        cy="70"
                        r="64"
                        strokeWidth="12"
                        fill="none"
                      ></circle>
                    </svg>
                    <div className="val" id="scorePct">
                      {clamp(analysis.scoreChecker?.value)}%
                    </div>
                  </div>

                  <div className="score-side">
                    <h3 style={{ marginBottom: 0 }}>
                      <img src="https://imgur.com/mFvyCj7.png" alt="" />
                      <span id="uiScoreChecker">
                        {tLabel("overallScore", "Final Score")}
                      </span>
                    </h3>

                    <div className="score-remark" id="scoreRemark">
                      {staticScoreNote}
                    </div>

                    <div className="score-bar">
                      <span
                        className="score-ind"
                        id="scoreInd"
                        style={{
                          left: `calc(${clamp(analysis.scoreChecker?.value)}% - 1.5px)`,
                        }}
                      ></span>
                    </div>

                    <div className="score-scale">
                      <span id="scaleUnsafe">
                        {tLabel("unsafe", STATIC_TRANSLATIONS.en.unsafe)}
                      </span>
                      <span id="scaleSafe">
                        {tLabel("safe", STATIC_TRANSLATIONS.en.safe)}
                      </span>
                      <span id="scaleVerySafe">
                        {tLabel("verySafe", STATIC_TRANSLATIONS.en.verySafe)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="card meter-block" id="confRightCard">
                <div className="meter-head">
                  <div className="meter-title">
                    <img src="https://imgur.com/nUGfg96.png" alt="" />
                    <span id="uiConfidence">
                      {tLabel("confidenceToSign", "Confidence to Sign")}
                    </span>
                  </div>
                  <div id="conf2Val">
                    {clamp(analysis.bars?.confidenceToSign)}%
                  </div>
                </div>

                <div className="meter">
                  <div
                    id="conf2Fill"
                    className="fill"
                    style={{
                      width: `${clamp(analysis.bars?.confidenceToSign)}%`,
                      background:
                        clamp(analysis.bars?.confidenceToSign) <= 29
                          ? bandColor.red
                          : clamp(analysis.bars?.confidenceToSign) <= 70
                            ? bandColor.orange
                            : bandColor.green,
                    }}
                  ></div>
                </div>
              </section>
            </div>
            {/* End .right */}
          </div>
          {/* End .grid */}
        </main>
      </div>

      {/* Download and Email Modal (functionality to be restored next) */}
      <div
        className="download-wrap"
        id="dlWrap"
        style={{
          display: "flex",
          justifyContent: "center",
          zIndex: 60,
          opacity: 1,
        }}
      >
        <button
          className="download"
          id="downloadBtn"
          onClick={openEmailForm}
          style={{
            background: "#f2f9fe",
            color: "#000",
            border: "1px solid #cfcfcf",
            borderRadius: "16px",
            padding: "16px 26px",
            display: "inline-flex",
            gap: "12px",
            alignItems: "center",
            cursor: "pointer",
            fontWeight: 400,
            fontSize: "18px",
            boxShadow: "0 6px 28px rgba(0,0,0,.28)",
          }}
        >
          Download Report
        </button>

        {showEmailInline && (
          <form
            id="emailInline"
            className="email-inline"
            noValidate
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              width: "min(92vw,340px)",
              background: "#141319",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "10px 12px",
              boxShadow: "0 6px 28px rgba(0,0,0,.28)",
              position: "absolute",
              bottom: "70px",
            }}
            onSubmit={handleEmailSubmit}
          >
            <div className="email-title">Insert email to download</div>

            <div
              className="email-row"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <input
                id="emailInputInline"
                className="input"
                type="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                style={{
                  flex: 1,
                  background: "#0f0e14",
                  border: "1px solid #5a5a5a",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "18px",
                }}
              />

              <button
                className="btn primary"
                id="emailGo"
                type="submit"
                disabled={downloading}
                style={{
                  padding: "7px 8px",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                {downloading ? "..." : "Done"}
              </button>
            </div>

            {emailError && (
              <div
                id="emailErrInline"
                className="email-err"
                style={{ color: "#ff6b6b", fontSize: "13px", display: "block" }}
              >
                {emailError}
              </div>
            )}
          </form>
        )}
      </div>

      {showEmailModal && (
        <div
          className="modal"
          id="emailModal"
          aria-modal="true"
          role="dialog"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <div
            className="modal-card"
            style={{
              background: "#141319",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              padding: "18px",
              width: "min(480px,92vw)",
            }}
          >
            <h4
              style={{
                margin: "0 0 10px",
                fontSize: "20px",
                fontWeight: 400,
                fontFamily: "Inter, sans-serif",
              }}
            >
              Enter your email to download the PDF report
            </h4>

            <div
              className="modal-row"
              style={{ display: "flex", gap: "10px", marginTop: "12px" }}
            >
              <input
                id="emailInputModal"
                className="input"
                type="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                style={{
                  flex: 1,
                  background: "#0f0e14",
                  border: "1px solid #5a5a5a",
                  borderRadius: "10px",
                  padding: "12px",
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "18px",
                }}
              />

              <button
                className="btn primary"
                id="emailSubmit"
                onClick={handleEmailSubmit}
                disabled={downloading}
                style={{
                  background: "#f2f9fe",
                  color: "#000",
                  borderColor: "#cfcfcf",
                  padding: "12px 14px",
                  borderRadius: "10px",
                }}
              >
                {downloading ? "..." : "Download"}
              </button>

              <button
                className="btn"
                id="emailCancel"
                onClick={closeEmailForm}
                style={{
                  background: "#0f0e14",
                  color: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "12px 14px",
                }}
              >
                Cancel
              </button>
            </div>

            {emailError && (
              <div
                id="emailErrModal"
                className="email-err"
                style={{ color: "#ff6b6b", fontSize: "13px", display: "block" }}
              >
                {emailError}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Analysis;
// End of file

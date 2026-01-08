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
import PDFGenerator from "../utils/pdf-generator";
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
      const pdfData = { ...data, lang, email };

      // supports: export default class { generatePDF(){} }
      // AND: export default { generatePDF(){} }
      if (PDFGenerator && typeof PDFGenerator.generatePDF === "function") {
        await PDFGenerator.generatePDF("SignSense_Report", pdfData, lang);
      } else {
        const pdfGen = new PDFGenerator();
        await pdfGen.generatePDF("SignSense_Report", pdfData, lang);
      }
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

    setArc(riskArcRef, analysis?.risk?.value, getRiskColor(analysis?.risk?.value));
    setArc(
      clarArcRef,
      analysis?.clarity?.value,
      getClarityColor(analysis?.clarity?.value)
    );
    setArc(
      scoreArcRef,
      analysis?.scoreChecker?.value,
      getClarityColor(analysis?.scoreChecker?.value)
    );

    // Silence unused warnings (kept exactly like your original logic)
    getProfFavColor(clamp(analysis?.bars?.professionalism));
    getProfFavColor(clamp(analysis?.bars?.favorabilityIndex));
    getDeadlineColor(clamp(analysis?.bars?.deadlinePressure));
  }, [data]);

  // Language switching (UI only)
  const handleLangClick = (code) => {
    setLang(code);
    setLangMenuOpen(false);
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
  const tLabel = (k, fallback) => ui?.[k] || staticTr?.[k] || fallback;

  // Static sentences (always translated)
  const staticRiskNote = staticTr?.riskStatic || STATIC_TRANSLATIONS.en.riskStatic;
  const staticClarityNote =
    staticTr?.clarityStatic || STATIC_TRANSLATIONS.en.clarityStatic;
  const staticScoreNote =
    staticTr?.scoreStatic || STATIC_TRANSLATIONS.en.scoreStatic;

  // Verdict words
  const verdictText = {
    unsafe: tLabel("unsafe", STATIC_TRANSLATIONS.en.unsafe),
    notThatSafe: tLabel("notThatSafe", STATIC_TRANSLATIONS.en.notThatSafe),
    safe: tLabel("safe", STATIC_TRANSLATIONS.en.safe),
    verySafe: tLabel("verySafe", STATIC_TRANSLATIONS.en.verySafe),
  };

  // translated dynamic arrays (fallback to original if missing)
  const analysis = data?.analysis || {};
  const tAnalysis = tr.analysis || {};


  // Robust fallback for summary: try all possible fields, prefer arrays, fallback to string split
  function getSummaryArr() {
    const candidates = [
      tAnalysis.summary,
      tr.summary,
      analysis.summary,
      analysis.summaryText,
      analysis.summaryLines
    ];
    for (const c of candidates) {
      if (Array.isArray(c) && c.length) return c;
      if (typeof c === 'string' && c.trim()) return c.split(/\r?\n|•|- /g).map(s => s.trim()).filter(Boolean);
    }
    return [];
  }
  const tSummary = getSummaryArr();

  const tIssues =
    (Array.isArray(tAnalysis.potentialIssues) && tAnalysis.potentialIssues.length
      ? tAnalysis.potentialIssues
      : Array.isArray(tr.potentialIssues) && tr.potentialIssues.length
      ? tr.potentialIssues
      : Array.isArray(analysis.potentialIssues) && analysis.potentialIssues.length
      ? analysis.potentialIssues
      : Array.isArray(analysis.issues) && analysis.issues.length
      ? analysis.issues
      : Array.isArray(analysis.potentialIssuesText) &&
        analysis.potentialIssuesText.length
      ? analysis.potentialIssuesText
      : ["—"]);


  // Robust fallback for smart suggestions: try all possible fields, prefer arrays, fallback to string split
  function getSuggestionsArr() {
    const candidates = [
      tAnalysis.smartSuggestions,
      tr.smartSuggestions,
      analysis.smartSuggestions,
      analysis.suggestions,
      analysis.smartSuggestionsText
    ];
    for (const c of candidates) {
      if (Array.isArray(c) && c.length) return c;
      if (typeof c === 'string' && c.trim()) return c.split(/\r?\n|•|- /g).map(s => s.trim()).filter(Boolean);
    }
    return [];
  }
  const tSuggestions = getSuggestionsArr();

  const tClauses =
    (Array.isArray(tAnalysis.mainClauses) && tAnalysis.mainClauses.length
      ? tAnalysis.mainClauses
      : Array.isArray(tr.mainClauses) && tr.mainClauses.length
      ? tr.mainClauses
      : Array.isArray(analysis.mainClauses) && analysis.mainClauses.length
      ? analysis.mainClauses
      : Array.isArray(analysis.clauses) && analysis.clauses.length
      ? analysis.clauses
      : Array.isArray(analysis.mainClausesText) && analysis.mainClausesText.length
      ? analysis.mainClausesText
      : ["—"]);

  // translated title (fallback to original)
  const tTitle =
    tAnalysis.contractTitle ?? tr.contractTitle ?? data?.contractTitle ?? data?.contractName ?? "—";

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
    if (Array.isArray(v)) return v.filter(Boolean).map((x) => String(x).trim()).filter(Boolean);

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
        return maybe.filter(Boolean).map((x) => String(x).trim()).filter(Boolean);
    }

    return [];
  }

  function fallbackArr(v) {
    return normalizeList(v);
  }

  // For summary, merge translation and AI summary if both exist
  function getSummaryArr() {
    const aiSummary = analysis.summary;
    const trSummary = tr.summary;
    if (Array.isArray(trSummary) && trSummary.length) return trSummary;
    if (Array.isArray(aiSummary) && aiSummary.length) return aiSummary;
    return [];
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
                >
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
                  <span id="uiSummary">{tLabel("summary", "Summary")}</span>
                </h3>

                <div className="list" id="summaryText" style={{ fontSize: "20px" }}>
                  {tSummary.length > 0 ? (
                    tSummary.map((s, i) => (
                      <div key={i} style={{ ...mutedStyle, fontSize: "20px" }}>
                        {s}
                      </div>
                    ))
                  ) : (
                    <div style={{ ...mutedStyle, fontSize: "18px" }}>No summary available.</div>
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
                  <div id="confVal">{clamp(analysis.bars?.professionalism)}%</div>
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
                  <div id="favVal">{clamp(analysis.bars?.favorabilityIndex)}%</div>
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
                  <div id="deadVal">{clamp(analysis.bars?.deadlinePressure)}%</div>
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
                  <span id="uiIssues">{tLabel("potentialIssues", "Potential Issues")}</span>
                </h3>

                <ul className="bullets" id="issuesList" style={{ fontSize: "20px" }}>
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
                  <span id="uiSuggestions">{tLabel("smartSuggestions", "Suggestions")}</span>
                </h3>

                <div className="list numbered" id="suggestionsList" style={{ fontSize: "20px" }}>
                  {tSuggestions.length > 0 ? (
                    tSuggestions.map((s, i) => (
                      <div key={i} style={{ ...mutedStyle, fontSize: "20px" }}>
                        {`${i + 1}. ${s}`}
                      </div>
                    ))
                  ) : (
                    <div style={{ ...mutedStyle, fontSize: "18px" }}>No suggestions available.</div>
                  )}
                </div>
              </section>
            </div>

            <div className="right">
              <section className="card" id="riskCard">
                <div className="hcard">
                  <div className="circle">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle className="track" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
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
                      <span id="uiRisk">{tLabel("riskLevel", "Risk Level")}</span>
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
                            riskVerdictKey(clamp(analysis.risk?.value)) === "unsafe"
                              ? "var(--red)"
                              : riskVerdictKey(clamp(analysis.risk?.value)) === "not_safe"
                              ? "var(--orange)"
                              : "var(--green)",
                        }}
                      ></span>

                      <span id="riskBadge">
                        {riskVerdictKey(clamp(analysis.risk?.value)) === "unsafe"
                          ? verdictText.unsafe
                          : riskVerdictKey(clamp(analysis.risk?.value)) === "not_safe"
                          ? verdictText.notThatSafe
                          : verdictText.verySafe}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="card" id="clarCard">
                <div className="hcard">
                  <div className="circle">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle className="track" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
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
                      <span id="uiClarity">{tLabel("clauseClarity", "Clause Clarity")}</span>
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
                            clarityVerdictKey(analysis?.clarity?.value) === "unsafe"
                              ? "var(--red)"
                              : clarityVerdictKey(analysis?.clarity?.value) === "not_safe"
                              ? "var(--orange)"
                              : "var(--green)",
                        }}
                      />
                      <span id="clarBadge">
                        {clarityVerdictKey(analysis?.clarity?.value) === "unsafe"
                          ? verdictText.unsafe
                          : clarityVerdictKey(analysis?.clarity?.value) === "not_safe"
                          ? verdictText.notThatSafe
                          : verdictText.verySafe}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="card" id="clausesCard">
                <h3 style={{ fontWeight: 400 }}>
                  <img src="https://imgur.com/K04axKU.png" alt="" />
                  <span id="uiClauses">{tLabel("mainClauses", "Main Clauses")}</span>
                </h3>

                <div className="list numbered" id="clausesList" style={{ fontSize: "20px" }}>
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
                      <circle className="track" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
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
                      <span id="uiScoreChecker">{tLabel("overallScore", "Final Score")}</span>
                    </h3>

                    <div className="score-remark" id="scoreRemark">
                      {staticScoreNote}
                    </div>

                    <div className="score-bar">
                      <span
                        className="score-ind"
                        id="scoreInd"
                        style={{ left: `calc(${clamp(analysis.scoreChecker?.value)}% - 1.5px)` }}
                      ></span>
                    </div>

                    <div className="score-scale">
                      <span id="scaleUnsafe">{verdictText.unsafe}</span>
                      <span id="scaleSafe">{verdictText.safe}</span>
                      <span id="scaleVerySafe">{verdictText.verySafe}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="card meter-block" id="confRightCard">
                <div className="meter-head">
                  <div className="meter-title">
                    <img src="https://imgur.com/nUGfg96.png" alt="" />
                    <span id="uiConfidence">{tLabel("confidenceToSign", "Confidence to Sign")}</span>
                  </div>
                  <div id="conf2Val">{clamp(analysis.bars?.confidenceToSign)}%</div>
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

            <div className="email-row" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
            <h4 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: 400, fontFamily: "Inter, sans-serif" }}>
              Enter your email to download the PDF report
            </h4>

            <div className="modal-row" style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
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

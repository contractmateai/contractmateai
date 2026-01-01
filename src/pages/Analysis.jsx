


import React, { useState, useEffect, useRef } from "react";

import AnalysisSidebar from "../components/AnalysisSidebar";
import AnalysisDrawer from "../components/AnalysisDrawer";

import "../styles/analysis.css";


function clamp(val, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(val) || 0));
}

const bandColor = {
  green: "var(--green)",
  orange: "var(--orange)",
  red: "var(--red)"
};

const dotColor = {
  "generally safe": "var(--green)",
  "safe": "var(--green)",
  "not that safe": "var(--orange)",
  "not safe": "var(--red)",
  "unsafe": "var(--red)",
  "very safe": "var(--green)"
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
      const scrolledFromBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
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
  const isMobile = () => window.matchMedia('(max-width: 980px)').matches;
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
  const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((e || '').trim());
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
      // PDF generation logic
      // PDF generation logic (window.PDFGenerator loaded via script)
      if (window.PDFGenerator) {
        const pdfGen = new window.PDFGenerator();
        // Compose data for PDF (use current language)
        const pdfData = {
          ...data,
          lang,
          email,
        };
        await pdfGen.generatePDF('SignSense_Report', pdfData, lang);
      } else {
        alert("PDF generator not loaded.");
      }
    } catch (err) {
      alert("Could not generate the PDF.");
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
      // Always show at least 2% arc for visibility
      const pct = Math.max(clamp(value, 0, 100), 2) / 100;
      const r = 64;
      const c = 2 * Math.PI * r;
      ref.current.setAttribute("stroke-dasharray", c);
      ref.current.setAttribute("stroke-dashoffset", c * (1 - pct));
      ref.current.setAttribute("stroke", color);
    }
    // Color logic for bands (match Analyze.js/HTML)
    function getRiskColor(val) {
      if (val <= 25) return bandColor.green;
      if (val <= 58) return bandColor.orange;
      return bandColor.red;
    }
    function getClarityColor(val) {
      if (val >= 78) return bandColor.green;
      if (val >= 49) return bandColor.orange;
      return bandColor.red;
    }
    function getScoreColor(val) {
      if (val >= 75) return bandColor.green;
      if (val >= 49) return bandColor.orange;
      return bandColor.red;
    }
    setArc(riskArcRef, analysis?.risk?.value, getRiskColor(analysis?.risk?.value));
    setArc(clarArcRef, analysis?.clarity?.value, getClarityColor(analysis?.clarity?.value));
    setArc(scoreArcRef, analysis?.scoreChecker?.value, getScoreColor(analysis?.scoreChecker?.value));
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
  const t = data?.ui || {};
  const tr = data?.translations?.[lang] || {};
  const analysis = data?.analysis || {};

  // Static sentences (from Analyze.js/HTML)
  const staticRiskNote = {
    en: "The contract risk score is based on the clauses' fairness and obligations.",
    it: "Il punteggio di rischio del contratto si basa sull'equità delle clausole.",
    de: "Der Vertragsrisikowert basiert auf Fairness und Verpflichtungen.",
    es: "La puntuación de riesgo se basa en la equidad de las cláusulas.",
    fr: "Le score de risque du contrat est basé sur l'équité des clauses.",
    zh: "合同风险分数基于条款的公平性和义务。"
  };
  const staticClarityNote = {
    en: "The clarity score reflects how easy it is to understand the terms.",
    it: "Il punteggio di chiarezza riflette la facilità di comprensione.",
    de: "Der Klarheitswert zeigt, wie einfach die Bedingungen zu verstehen sind.",
    es: "La puntuación de claridad refleja la facilidad de comprensión.",
    fr: "Le score de clarté reflète la facilité de compréhension.",
    zh: "清晰度分数反映了理解条款的难易程度。"
  };
  // Use static muted color for all explanations
  const mutedStyle = { color: 'var(--muted)', fontSize: 15 };

  // Helper to always show fallback/defaults for boxes
  function fallbackArr(arr, def) {
    if (Array.isArray(arr) && arr.length) return arr;
    if (typeof def === 'string') return [def];
    return def || ["—"];
  }

  return (
    <>
      <AnalysisDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="layout">
        <AnalysisSidebar />
        <main className="main">
          <div className="analysis-header-row">
            <div className="analysis-header-left">
              <span className="analysis-overview-label" id="uiOverview">{t.overview || "Overview"}</span>
            </div>
            <div className="analysis-header-right">
              <div className={`lang${langMenuOpen ? ' open' : ''}`} id="lang">
                <button
                  className="lang-btn"
                  id="langBtn"
                  type="button"
                  ref={langBtnRef}
                  onClick={() => setLangMenuOpen((v) => !v)}
                  aria-expanded={langMenuOpen}
                  aria-haspopup="listbox"
                >
                  <span id="langNow" style={{fontFamily:'Inter, sans-serif',fontWeight:400,fontSize:'20px'}}>{lang.toUpperCase()}</span><span className="caret" aria-hidden="true"></span>
                </button>
                {langMenuOpen && (
                  <div
                    className="lang-menu"
                    id="langMenu"
                    role="listbox"
                    aria-label="Report Language"
                    ref={langMenuRef}
                  >
                    {Object.entries({en:"English",it:"Italiano",de:"Deutsch",es:"Español",fr:"Français",pt:"Português",nl:"Nederlands",ro:"Română",sq:"Shqip",tr:"Türkçe",zh:"中文",ja:"日本語"}).map(([code, label]) => (
                      <div
                        className="lang-item"
                        data-code={code}
                        key={code}
                        onClick={() => handleLangClick(code)}
                        style={{fontFamily:'Inter, sans-serif',fontWeight: lang === code ? 600 : 400, fontSize:'20px', background: lang === code ? '#e2e2e2' : 'transparent', color: lang === code ? '#000' : undefined}}
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
          <div style={{borderBottom:'1px solid #e2e2e2',margin:'0 0 18px 0',height:0}}></div>
          <div className="doc-title">
            <span className="label" id="uiTitleLabel">{t.title || "Title:"}</span>
            <span className="value" id="uiTitleValue"> {' '}{data?.contractTitle || data?.contractName || "—"}</span>
          </div>
          <div className="grid">
            <div className="left">
              <section className="card" id="summaryCard">
                <h3 style={{fontWeight:400}}><img src="https://imgur.com/CuQFbD7.png" alt="" /><span id="uiSummary">{t.summary || "Summary"}</span></h3>
                <div className="list" id="summaryText" style={{fontSize: '20px'}}>
                  {fallbackArr(tr.summary || analysis.summary, "No summary available.").map((s, i) => (
                    <div key={i} style={{...mutedStyle, fontSize: '20px'}}>{s}</div>
                  ))}
                </div>
              </section>
              <section className="card meter-block" id="profCard">
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/EdMAMnx.png" alt="" /><span id="uiProfessionalism">{t.prof || "Professionalism"}</span></div>
                  <div id="confVal">{clamp(analysis.bars?.professionalism)}%</div>
                </div>
                <div className="meter"><div id="confFill" className="fill" style={{width: `${clamp(analysis.bars?.professionalism)}%`, background: bandColor[analysis.risk?.band]}}></div></div>
              </section>
              <section className="card meter-block" id="favCard">
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/UDRuIvO.png" alt="" /><span id="uiFavorability">{t.fav || "Favorability Index"}</span></div>
                  <div id="favVal">{clamp(analysis.bars?.favorabilityIndex)}%</div>
                </div>
                <div className="meter"><div id="favFill" className="fill" style={{width: `${clamp(analysis.bars?.favorabilityIndex)}%`, background: bandColor[analysis.risk?.band]}}></div></div>
              </section>
              <section className="card meter-block" id="deadCard">
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/VXZ3kD8.png" alt="" /><span id="uiDeadline">{t.deadline || "Deadline pressure"}</span></div>
                  <div id="deadVal">{clamp(analysis.bars?.deadlinePressure)}%</div>
                </div>
                <div className="meter"><div id="deadFill" className="fill" style={{width: `${clamp(analysis.bars?.deadlinePressure)}%`, background: bandColor[analysis.risk?.band]}}></div></div>
              </section>
              <section className="card" id="issuesCard">
                <h3 style={{fontWeight:400}}><img src="https://imgur.com/ppLDtiq.png" alt="" /><span id="uiIssues">{t.potentialIssues || "Potential Issues"}</span></h3>
                <ul className="bullets" id="issuesList" style={{fontSize: '20px'}}>
                  {fallbackArr(tr.potentialIssues || analysis.potentialIssues, "No issues detected.").map((issue, i) => (
                    <li key={i} style={{...mutedStyle, fontSize: '20px'}}>{issue}</li>
                  ))}
                </ul>
              </section>
              <section className="card" id="suggestionsCard">
                <h3 style={{fontWeight:400}}><img src="https://imgur.com/EoVDfd5.png" alt="" /><span id="uiSuggestions">{t.smartSuggestions || "Smart Suggestions"}</span></h3>
                <div className="list numbered" id="suggestionsList" style={{fontSize: '20px'}}>
                  {fallbackArr(tr.smartSuggestions || analysis.smartSuggestions, "No suggestions available.").map((s, i) => (
                    <div key={i} style={{...mutedStyle, fontSize: '20px'}}>{`${i+1}. ${s}`}</div>
                  ))}
                </div>
              </section>
            </div>
            <div className="right">
              <section className="card" id="riskCard">
                <div className="hcard">
                  <div className="circle">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle className="track" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                      <circle ref={riskArcRef} id="riskArc" className="arc" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                    </svg>
                    <div className="val" id="riskVal">{clamp(analysis.risk?.value)}%</div>
                  </div>
                  <div className="htext">
                    <h3 style={{ marginBottom: 0, fontWeight:400 }}><img src="https://imgur.com/Myp6Un4.png" alt="" /><span id="uiRisk">Risk Level</span></h3>
                    <div className="muted" id="riskNote" style={mutedStyle}>{staticRiskNote[lang] || staticRiskNote.en}</div>
                    <div className="status"><span className="dot" id="riskDot" style={{background: dotColor[analysis.risk?.safety?.toLowerCase()] || "var(--green)"}}></span><span id="riskBadge">{(analysis.risk?.safety || "Generally Safe").replace(/^(\w)/, c => c.toUpperCase())}</span></div>
                  </div>
                </div>
              </section>
              <section className="card" id="clarCard">
                <div className="hcard">
                  <div className="circle">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle className="track" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                      <circle ref={clarArcRef} id="clarArc" className="arc" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                    </svg>
                    <div className="val" id="clarVal">{clamp(analysis.clarity?.value)}%</div>
                  </div>
                  <div className="htext">
                    <h3 style={{ marginBottom: 0, fontWeight:400 }}><img src="https://imgur.com/o39xZtC.png" alt="" /><span id="uiClarity">Clause Clarity</span></h3>
                    <div className="muted" id="clarNote" style={mutedStyle}>{staticClarityNote[lang] || staticClarityNote.en}</div>
                    <div className="status"><span className="dot" id="clarDot" style={{background: dotColor[analysis.clarity?.safety?.toLowerCase()] || "var(--green)"}}></span><span id="clarBadge">{(analysis.clarity?.safety || "Generally Safe").replace(/^(\w)/, c => c.toUpperCase())}</span></div>
                  </div>
                </div>
              </section>
              <section className="card" id="clausesCard">
                <h3 style={{fontWeight:400}}><img src="https://imgur.com/K04axKU.png" alt="" /><span id="uiClauses">{t.mainClauses || "Main Clauses"}</span></h3>
                <div className="list numbered" id="clausesList" style={{fontSize: '20px'}}>
                  {fallbackArr(tr.mainClauses || analysis.mainClauses, "No main clauses found.").map((c, i) => (
                    <div key={i} style={{...mutedStyle, fontSize: '20px'}}>{`${i+1}. ${c}`}</div>
                  ))}
                </div>
              </section>
              <section className="card" id="scoreCard">
                <div className="hcard">
                  <div className="circle">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle className="track" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                      <circle ref={scoreArcRef} id="scoreArc" className="arc" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                      <div
                        className="lang-item"
                        data-code={code}
                        key={code}
                        onClick={() => handleLangClick(code)}
                        style={{
                          fontFamily:'Inter, sans-serif',
                          fontWeight:400,
                          fontSize:'15px',
                          color:'var(--muted)',
                          border: lang === code ? '1.5px solid var(--border)' : '1.5px solid transparent',
                          background: lang === code ? 'rgba(255,255,255,0.04)' : 'transparent',
                          boxShadow: lang === code ? '0 0 0 2px #23232a' : 'none',
                          transition:'all .18s',
                          outline:'none'
                        }}
                        tabIndex={0}
                        role="option"
                        aria-selected={lang === code}
                      >
                        {label}
                      </div>
                  </div>
                </div>
              </section>
              <section className="card meter-block" id="confRightCard">
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/nUGfg96.png" alt="" /><span id="uiConfidence">{t.conf || "Confidence to sign freely"}</span></div>
                  <div id="conf2Val">{clamp(analysis.bars?.confidenceToSign)}%</div>
                </div>
                <div className="meter"><div id="conf2Fill" className="fill" style={{width: `${clamp(analysis.bars?.confidenceToSign)}%`, background: bandColor[analysis.risk?.band]}}></div></div>
              </section>
            </div>
          </div>
        </main>
      </div>
      {/* Download and Email Modal (functionality to be restored next) */}
      <div className="download-wrap" id="dlWrap" style={{display:'flex',justifyContent:'center',zIndex:60,opacity:1}}>
        <button className="download" id="downloadBtn" onClick={openEmailForm} style={{background:'#f2f9fe',color:'#000',border:'1px solid #cfcfcf',borderRadius:'16px',padding:'16px 26px',display:'inline-flex',gap:'12px',alignItems:'center',cursor:'pointer',fontWeight:400,fontSize:'18px',boxShadow:'0 6px 28px rgba(0,0,0,.28)'}}>Download Report</button>
        {showEmailInline && (
          <form id="emailInline" className="email-inline" noValidate style={{display:'flex',flexDirection:'column',gap:'8px',width:'min(92vw,340px)',background:'#141319',border:'1px solid var(--border)',borderRadius:'14px',padding:'10px 12px',boxShadow:'0 6px 28px rgba(0,0,0,.28)',position:'absolute',bottom:'70px'}} onSubmit={handleEmailSubmit}>
            <div className="email-title">Insert email to download</div>
            <div className="email-row" style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <input id="emailInputInline" className="input" type="email" inputMode="email" placeholder="you@example.com" value={email} onChange={handleEmailChange} style={{flex:1,background:'#0f0e14',border:'1px solid #5a5a5a',borderRadius:'10px',padding:'10px 12px',color:'#fff',fontFamily:'Inter, sans-serif',fontWeight:400,fontSize:'18px'}} />
              <button className="btn primary" id="emailGo" type="submit" disabled={downloading} style={{padding:'7px 8px',borderRadius:'8px',fontSize:'15px',fontWeight:500}}>{downloading ? '...' : 'Done'}</button>
            </div>
            {emailError && <div id="emailErrInline" className="email-err" style={{color:'#ff6b6b',fontSize:'13px',display:'block'}}>{emailError}</div>}
          </form>
        )}
      </div>
      {showEmailModal && (
        <div className="modal" id="emailModal" aria-modal="true" role="dialog" style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100}}>
          <div className="modal-card" style={{background:'#141319',border:'1px solid var(--border)',borderRadius:'18px',padding:'18px',width:'min(480px,92vw)'}}>
            <h4 style={{margin:'0 0 10px',fontSize:'20px',fontWeight:400,fontFamily:'Inter, sans-serif'}}>Enter your email to download the PDF report</h4>
            <div className="modal-row" style={{display:'flex',gap:'10px',marginTop:'12px'}}>
              <input id="emailInputModal" className="input" type="email" inputMode="email" placeholder="you@example.com" value={email} onChange={handleEmailChange} style={{flex:1,background:'#0f0e14',border:'1px solid #5a5a5a',borderRadius:'10px',padding:'12px',color:'#fff',fontFamily:'Inter, sans-serif',fontWeight:400,fontSize:'18px'}} />
              <button className="btn primary" id="emailSubmit" onClick={handleEmailSubmit} disabled={downloading} style={{background:'#f2f9fe',color:'#000',borderColor:'#cfcfcf',padding:'12px 14px',borderRadius:'10px'}}>{downloading ? '...' : 'Download'}</button>
              <button className="btn" id="emailCancel" onClick={closeEmailForm} style={{background:'#0f0e14',color:'#fff',border:'1px solid var(--border)',borderRadius:'10px',padding:'12px 14px'}}>Cancel</button>
            </div>
            {emailError && <div id="emailErrModal" className="email-err" style={{color:'#ff6b6b',fontSize:'13px',display:'block'}}>{emailError}</div>}
          </div>
        </div>
      )}
    </>
  );
};

export default Analysis;




import React, { useState, useEffect, useRef } from "react";


import AnalysisSidebar from "../components/AnalysisSidebar";
import AnalysisDrawer from "../components/AnalysisDrawer";
import PDFGenerator from "../../public/js/pdf-generator";
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
      const pdfGen = new PDFGenerator();
      const pdfData = { ...data, lang, email };
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
  const baseUI = data?.ui || {};
  const tr = data?.translations?.[lang] || {};
  const ui = tr.ui || tr.UI || baseUI;
  const analysis = data?.analysis || {};
  // Use static muted color for all explanations
  const mutedStyle = { color: 'var(--muted)', fontSize: 15 };

  // Static sentences from analyze.js (always translated)
  const staticRiskNote = ui.riskLineStatic || "";
  const staticClarityNote = ui.clarityLineStatic || "";
  const staticScoreNote = ui.scoreLine || "";

  // Only allow 'unsafe', 'safe', 'very safe' verdicts
  const verdictMap = {
    unsafe: ui.unsafe || "Unsafe",
    safe: ui.safe || "Safe",
    verysafe: ui.verySafe || "Very Safe"
  };
  // Dot color logic for verdicts
  const dotColor = {
    unsafe: "var(--red)",
    safe: "var(--green)",
    verysafe: "var(--green)"
  };

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
              <span className="analysis-overview-label" id="uiOverview">{ui.overview || "Overview"}</span>
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
            <span className="label" id="uiTitleLabel">{ui.title || "Title:"}</span>
            <span className="value" id="uiTitleValue"> {' '}{data?.contractTitle || data?.contractName || "—"}</span>
          </div>
          <div className="grid">
            <div className="left">
              <section className="card" id="summaryCard">
                <h3 style={{fontWeight:400}}><img src="https://imgur.com/CuQFbD7.png" alt="" /><span id="uiSummary">{ui.summary || "Summary"}</span></h3>
                <div className="list" id="summaryText" style={{fontSize: '20px'}}>
                  {fallbackArr(tr.summary || analysis.summary, "—").map((s, i) => (
                    <div key={i} style={{...mutedStyle, fontSize: '20px'}}>{s}</div>
                  ))}
                </div>
              </section>
              <section className="card meter-block" id="profCard">
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/EdMAMnx.png" alt="" /><span id="uiProfessionalism">{ui.prof || "Professionalism"}</span></div>
                  <div id="confVal">{clamp(analysis.bars?.professionalism)}%</div>
                </div>
                <div className="meter"><div id="confFill" className="fill" style={{width: `${clamp(analysis.bars?.professionalism)}%`, background: bandColor[analysis.risk?.band]}}></div></div>
              </section>
              <section className="card meter-block" id="favCard">
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/UDRuIvO.png" alt="" /><span id="uiFavorability">{ui.fav || "Favorability Index"}</span></div>
                  <div id="favVal">{clamp(analysis.bars?.favorabilityIndex)}%</div>
                </div>
                <div className="meter"><div id="favFill" className="fill" style={{width: `${clamp(analysis.bars?.favorabilityIndex)}%`, background: bandColor[analysis.risk?.band]}}></div></div>
              </section>
              <section className="card meter-block" id="deadCard">
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/VXZ3kD8.png" alt="" /><span id="uiDeadline">{ui.deadline || "Deadline pressure"}</span></div>
                  <div id="deadVal">{clamp(analysis.bars?.deadlinePressure)}%</div>
                </div>
                <div className="meter"><div id="deadFill" className="fill" style={{width: `${clamp(analysis.bars?.deadlinePressure)}%`, background: bandColor[analysis.risk?.band]}}></div></div>
              </section>
              <section className="card" id="issuesCard">
                <h3 style={{fontWeight:400}}><img src="https://imgur.com/ppLDtiq.png" alt="" /><span id="uiIssues">{ui.potentialIssues || "Potential Issues"}</span></h3>
                <ul className="bullets" id="issuesList" style={{fontSize: '20px'}}>
                  {fallbackArr(tr.potentialIssues || analysis.potentialIssues, "—").map((issue, i) => (
                    <li key={i} style={{...mutedStyle, fontSize: '20px'}}>{issue}</li>
                  ))}
                </ul>
              </section>
              <section className="card" id="suggestionsCard">
                <h3 style={{fontWeight:400}}><img src="https://imgur.com/EoVDfd5.png" alt="" /><span id="uiSuggestions">{ui.smartSuggestions || "Smart Suggestions"}</span></h3>
                <div className="list numbered" id="suggestionsList" style={{fontSize: '20px'}}>
                  {fallbackArr(tr.smartSuggestions || analysis.smartSuggestions, "—").map((s, i) => (
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
                    <h3 style={{ marginBottom: 0, fontWeight:400 }}><img src="https://imgur.com/Myp6Un4.png" alt="" /><span id="uiRisk">{ui.risk || "Risk Level"}</span></h3>
                      <div className="muted" id="riskNote" style={mutedStyle}>{staticRiskNote}</div>
                    <div className="status"><span className="dot" id="riskDot" style={{background: dotColor[analysis.risk?.safety?.toLowerCase()] || "var(--green)"}}></span><span id="riskBadge">{verdictMap[(analysis.risk?.safety || '').replace(/\s/g, '').toLowerCase()] || verdictMap.safe}</span></div>
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
                    <h3 style={{ marginBottom: 0, fontWeight:400 }}><img src="https://imgur.com/o39xZtC.png" alt="" /><span id="uiClarity">{ui.clarity || "Clause Clarity"}</span></h3>
                      <div className="muted" id="clarNote" style={mutedStyle}>{staticClarityNote}</div>
                    <div className="status"><span className="dot" id="clarDot" style={{background: dotColor[analysis.clarity?.safety?.toLowerCase()] || "var(--green)"}}></span><span id="clarBadge">{verdictMap[(analysis.clarity?.safety || '').replace(/\s/g, '').toLowerCase()] || verdictMap.safe}</span></div>
                  </div>
                </div>
              </section>
              <section className="card" id="clausesCard">
                <h3 style={{fontWeight:400}}><img src="https://imgur.com/K04axKU.png" alt="" /><span id="uiClauses">{ui.mainClauses || "Main Clauses"}</span></h3>
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
                    </svg>
                    <div className="val" id="scorePct">{clamp(analysis.scoreChecker?.value)}%</div>
                  </div>
                  <div className="score-side">
                    <h3 style={{ marginBottom: 0 }}><img src="https://imgur.com/mFvyCj7.png" alt="" /><span id="uiScoreChecker">{ui.score || "Overall Score"}</span></h3>
                      <div className="score-remark" id="scoreRemark">{staticScoreNote}</div>
                    <div className="score-bar"><span className="score-ind" id="scoreInd" style={{left: `calc(${clamp(analysis.scoreChecker?.value)}% - 1.5px)`}}></span></div>
                    <div className="score-scale">
                      <span id="scaleUnsafe">{ui.unsafe || "Unsafe"}</span>
                      <span id="scaleSafe">{ui.safe || "Safe"}</span>
                      <span id="scaleVerySafe">{ui.verySafe || "Very Safe"}</span>
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
            </div> {/* End .right */}
          </div> {/* End .grid */}
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
}
export default Analysis;
// End of file

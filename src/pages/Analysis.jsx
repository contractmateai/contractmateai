


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
      const pct = clamp(value, 0, 100) / 100;
      const r = 64;
      const c = 2 * Math.PI * r;
      ref.current.setAttribute("stroke-dasharray", c);
      ref.current.setAttribute("stroke-dashoffset", c * (1 - pct));
      ref.current.setAttribute("stroke", color);
    }
    setArc(riskArcRef, analysis?.risk?.value, bandColor[analysis?.risk?.band] || "var(--green)");
    setArc(clarArcRef, analysis?.clarity?.value, bandColor[analysis?.clarity?.band] || "var(--green)");
    setArc(scoreArcRef, analysis?.scoreChecker?.value, bandColor[analysis?.scoreChecker?.band] || "var(--green)");
  }, [data]);

  // Language switching (UI only)
  const handleLangClick = (code) => {
    setLang(code);
  };

  // Helper for translation fields
  const t = data?.ui || {};
  const tr = data?.translations?.[lang] || {};
  const analysis = data?.analysis || {};

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
              <div className="lang" id="lang">
                <button className="lang-btn" id="langBtn" type="button">
                  <span id="langNow">{lang.toUpperCase()}</span><span className="caret" aria-hidden="true"></span>
                </button>
                <div className="lang-menu" id="langMenu" role="listbox" aria-label="Report Language">
                  {Object.entries({en:"English",it:"Italiano",de:"Deutsch",es:"Español",fr:"Français",pt:"Português",nl:"Nederlands",ro:"Română",sq:"Shqip",tr:"Türkçe",zh:"中文",ja:"日本語"}).map(([code, label]) => (
                    <div className="lang-item" data-code={code} key={code} onClick={() => handleLangClick(code)}>{label}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="doc-title">
            <span className="label" id="uiTitleLabel">{t.title || "Title:"}</span>
            <span className="value" id="uiTitleValue">{data?.contractTitle || data?.contractName || "—"}</span>
          </div>
          <div className="grid">
            <div className="left">
              <section className="card" id="summaryCard">
                <h3><img src="https://imgur.com/CuQFbD7.png" alt="" /><span id="uiSummary">{t.summary || "Summary"}</span></h3>
                <div className="list" id="summaryText">
                  {(tr.summary || analysis.summary || []).map((s, i) => (
                    <div key={i}>{s}</div>
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
                <h3><img src="https://imgur.com/ppLDtiq.png" alt="" /><span id="uiIssues">{t.potentialIssues || "Potential Issues"}</span></h3>
                <ul className="bullets" id="issuesList">
                  {(tr.potentialIssues || analysis.potentialIssues || []).map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </section>
              <section className="card" id="suggestionsCard">
                <h3><img src="https://imgur.com/EoVDfd5.png" alt="" /><span id="uiSuggestions">{t.smartSuggestions || "Smart Suggestions"}</span></h3>
                <div className="list numbered" id="suggestionsList">
                  {(tr.smartSuggestions || analysis.smartSuggestions || []).map((s, i) => (
                    <div key={i}>{s}</div>
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
                    <h3 style={{ marginBottom: 0 }}><img src="https://imgur.com/Myp6Un4.png" alt="" /><span id="uiRisk">{t.risk || "Risk Level"}</span></h3>
                    <div className="muted" id="riskNote">{analysis.risk?.note}</div>
                    <div className="status"><span className="dot" id="riskDot" style={{background: dotColor[analysis.risk?.safety?.toLowerCase()] || "var(--green)"}}></span><span id="riskBadge">{analysis.risk?.safety || "Generally Safe"}</span></div>
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
                    <h3 style={{ marginBottom: 0 }}><img src="https://imgur.com/o39xZtC.png" alt="" /><span id="uiClarity">{t.clarity || "Clause Clarity"}</span></h3>
                    <div className="muted" id="clarNote">{analysis.clarity?.note}</div>
                    <div className="status"><span className="dot" id="clarDot" style={{background: dotColor[analysis.clarity?.safety?.toLowerCase()] || "var(--green)"}}></span><span id="clarBadge">{analysis.clarity?.safety || "Generally Safe"}</span></div>
                  </div>
                </div>
              </section>
              <section className="card" id="clausesCard">
                <h3><img src="https://imgur.com/K04axKU.png" alt="" /><span id="uiClauses">{t.mainClauses || "Main Clauses"}</span></h3>
                <div className="list numbered" id="clausesList">
                  {(tr.mainClauses || analysis.mainClauses || []).map((c, i) => (
                    <div key={i}>{c}</div>
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
                    <h3 style={{ marginBottom: 0 }}><img src="https://imgur.com/mFvyCj7.png" alt="" /><span id="uiScoreChecker">{t.score || "Score Checker"}</span></h3>
                    <div className="score-remark" id="scoreRemark">{tr.scoreLine || analysis.scoreChecker?.line || "Determines the overall score."}</div>
                    <div className="score-bar"><span className="score-ind" id="scoreInd" style={{left: `calc(${clamp(analysis.scoreChecker?.value)}% - 1.5px)`}}></span></div>
                    <div className="score-scale">
                      <span id="scaleUnsafe">{t.unsafe || "Unsafe"}</span>
                      <span id="scaleSafe">{t.safe || "Safe"}</span>
                      <span id="scaleVerySafe">{t.verysafe || "Very Safe"}</span>
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
      <div className="download-wrap" id="dlWrap">
        <button className="download" id="downloadBtn">Download Report</button>
        <form id="emailInline" className="email-inline" noValidate>
          <div className="email-title">Insert email to download</div>
          <div className="email-row">
            <input id="emailInputInline" className="input" type="email" inputMode="email" placeholder="you@example.com" />
            <button className="btn primary" id="emailGo" type="submit">Done</button>
          </div>
          <div id="emailErrInline" className="email-err">Please enter a valid email address.</div>
        </form>
      </div>
      <div className="modal" id="emailModal" aria-modal="true" role="dialog">
        <div className="modal-card">
          <h4>Enter your email to download the PDF report</h4>
          <div className="modal-row">
            <input id="emailInputModal" className="input" type="email" inputMode="email" placeholder="you@example.com" />
            <button className="btn primary" id="emailSubmit">Download</button>
            <button className="btn" id="emailCancel">Cancel</button>
          </div>
          <div id="emailErrModal" className="email-err">Please enter a valid email address.</div>
        </div>
      </div>
    </>
  );
};

export default Analysis;

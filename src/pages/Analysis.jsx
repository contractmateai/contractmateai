
import React, { useEffect } from "react";
import "../styles/home.css";

const Analysis = () => {
  useEffect(() => {
    // If legacy JS is needed for this page, load it here or ensure it's loaded globally
    // Example: window.AOS && window.AOS.init();
    // PDF generator and other scripts are loaded globally via index.html
  }, []);

  return (
    <>
      {/* Scrim and Drawer for mobile navigation */}
      <div id="scrim" className="scrim" aria-hidden="true"></div>
      <aside id="drawer" className="drawer" aria-label="Menu" aria-hidden="true">
        <div className="brand-row">
          <img src="https://imgur.com/Z5hv7K9.png" alt="SignSense logo" />
          <span>SignSense</span>
        </div>
        <nav className="nav">
          <a className="active" href="#"><img className="arr" src="https://imgur.com/CHGomYz.png" alt="" /><img className="icon" src="https://imgur.com/lnQTDuo.png" alt="" /><span>Overview</span></a>
          <a href="/index.html"><img className="arr" src="https://imgur.com/xhkeG0y.png" alt="" /><img className="icon" src="https://imgur.com/kE3okdE.png" alt="" /><span>Home</span></a>
          <a href="/privacy.html"><img className="arr" src="https://imgur.com/xhkeG0y.png" alt="" /><img className="icon" src="https://imgur.com/krMnFVT.png" alt="" /><span>Privacy</span></a>
          <a href="#"><img className="arr" src="https://imgur.com/xhkeG0y.png" alt="" /><img className="icon" src="https://imgur.com/6zHviT6.png" alt="" /><span>Contact Us</span></a>
          <a href="#" id="leaveReview"><img className="arr" src="https://imgur.com/xhkeG0y.png" alt="" /><img className="icon" src="https://imgur.com/zwr9SOe.png" alt="" /><span>Add a Review</span></a>
        </nav>
        <div className="push"></div>
        <div className="end">
          <div>All rights reserved.</div>
          <div>© 2025 SignSense</div>
          <div className="footer-sep"></div>
          <div>Not legal advice.<br />For informational use only.</div>
        </div>
      </aside>
      <div className="layout">
        <aside className="sidebar">
          <div className="brand">
            <a href="/index.html" aria-label="Go to homepage">
              <img src="https://imgur.com/Z5hv7K9.png" alt="SignSense logo" />
              <span>SignSense</span>
            </a>
          </div>
          <nav className="nav">
            <a className="active" href="#"><img className="arr" src="https://imgur.com/CHGomYz.png" alt="" /><img className="icon" src="https://imgur.com/lnQTDuo.png" alt="" /><span>Overview</span></a>
            <a href="/index.html"><img className="arr" src="https://imgur.com/xhkeG0y.png" alt="" /><img className="icon" src="https://imgur.com/kE3okdE.png" alt="" /><span>Home</span></a>
            <a href="/privacy.html"><img className="arr" src="https://imgur.com/xhkeG0y.png" alt="" /><img className="icon" src="https://imgur.com/krMnFVT.png" alt="" /><span>Privacy</span></a>
            <a href="#"><img className="arr" src="https://imgur.com/xhkeG0y.png" alt="" /><img className="icon" src="https://imgur.com/6zHviT6.png" alt="" /><span>Contact Us</span></a>
            <a href="#" id="leaveReview2"><img className="arr" src="https://imgur.com/xhkeG0y.png" alt="" /><img className="icon" src="https://imgur.com/zwr9SOe.png" alt="" /><span>Add a Review</span></a>
          </nav>
          <div className="push"></div>
          <div className="end-only" id="sidebarEnd">
            <div className="legal">All rights reserved.</div>
            <div className="copy2">© 2025 SignSense</div>
            <div className="footer-sep"></div>
            <div className="copy">Not legal advice.<br />For informational use only.</div>
          </div>
        </aside>
        <main className="main">
          <div className="topbar">
            <div className="top-left">
              <button id="menuBtn" className="menu-btn" aria-label="Open menu">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5h18M3 12h18M3 17.5h18" /></svg>
              </button>
              <div className="top-title" id="uiOverview">Overview</div>
            </div>
            <div className="lang" id="lang">
              <button className="lang-btn" id="langBtn" type="button">
                <span id="langNow">EN</span><span className="caret" aria-hidden="true"></span>
              </button>
              <div className="lang-menu" id="langMenu" role="listbox" aria-label="Report Language">
                <div className="lang-item" data-code="en">English</div>
                <div className="lang-item" data-code="it">Italiano</div>
                <div className="lang-item" data-code="de">Deutsch</div>
                <div className="lang-item" data-code="es">Español</div>
                <div className="lang-item" data-code="fr">Français</div>
                <div className="lang-item" data-code="pt">Português</div>
                <div className="lang-item" data-code="nl">Nederlands</div>
                <div className="lang-item" data-code="ro">Română</div>
                <div className="lang-item" data-code="sq">Shqip</div>
                <div className="lang-item" data-code="tr">Türkçe</div>
                <div className="lang-item" data-code="zh">中文</div>
                <div className="lang-item" data-code="ja">日本語</div>
              </div>
            </div>
          </div>
          <div className="doc-title">
            <span className="label" id="uiTitleLabel">Title:</span>
            <span className="value" id="uiTitleValue">—</span>
          </div>
          <div className="grid">
            <div className="left">
              <section className="card" id="summaryCard">
                <h3><img src="https://imgur.com/CuQFbD7.png" alt="" /><span id="uiSummary">Summary</span></h3>
                <div className="list" id="summaryText"></div>
              </section>
              <section className="card meter-block" id="profCard">
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/EdMAMnx.png" alt="" /><span id="uiProfessionalism">Professionalism</span></div>
                  <div id="confVal">0%</div>
                </div>
                <div className="meter"><div id="confFill" className="fill"></div></div>
              </section>
              <section className="card meter-block" id="favCard">
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/UDRuIvO.png" alt="" /><span id="uiFavorability">Favorability Index</span></div>
                  <div id="favVal">0%</div>
                </div>
                <div className="meter"><div id="favFill" className="fill"></div></div>
              </section>
              <section className="card meter-block" id="deadCard">
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/VXZ3kD8.png" alt="" /><span id="uiDeadline">Deadline pressure</span></div>
                  <div id="deadVal">0%</div>
                </div>
                <div className="meter"><div id="deadFill" className="fill"></div></div>
              </section>
              <section className="card" id="issuesCard">
                <h3><img src="https://imgur.com/ppLDtiq.png" alt="" /><span id="uiIssues">Potential Issues</span></h3>
                <ul className="bullets" id="issuesList"></ul>
              </section>
              <section className="card" id="suggestionsCard">
                <h3><img src="https://imgur.com/EoVDfd5.png" alt="" /><span id="uiSuggestions">Smart Suggestions</span></h3>
                <div className="list numbered" id="suggestionsList"></div>
              </section>
            </div>
            <div className="right">
              <section className="card" id="riskCard">
                <div className="hcard">
                  <div className="circle">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle className="track" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                      <circle id="riskArc" className="arc" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                    </svg>
                    <div className="val" id="riskVal">0%</div>
                  </div>
                  <div className="htext">
                    <h3 style={{ marginBottom: 0 }}><img src="https://imgur.com/Myp6Un4.png" alt="" /><span id="uiRisk">Risk Level</span></h3>
                    <div className="muted" id="riskNote"></div>
                    <div className="status"><span className="dot" id="riskDot"></span><span id="riskBadge">Generally Safe</span></div>
                  </div>
                </div>
              </section>
              <section className="card" id="clarCard">
                <div className="hcard">
                  <div className="circle">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle className="track" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                      <circle id="clarArc" className="arc" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                    </svg>
                    <div className="val" id="clarVal">0%</div>
                  </div>
                  <div className="htext">
                    <h3 style={{ marginBottom: 0 }}><img src="https://imgur.com/o39xZtC.png" alt="" /><span id="uiClarity">Clause Clarity</span></h3>
                    <div className="muted" id="clarNote"></div>
                    <div className="status"><span className="dot" id="clarDot"></span><span id="clarBadge">Generally Safe</span></div>
                  </div>
                </div>
              </section>
              <section className="card" id="clausesCard">
                <h3><img src="https://imgur.com/K04axKU.png" alt="" /><span id="uiClauses">Main Clauses</span></h3>
                <div className="list numbered" id="clausesList"></div>
              </section>
              <section className="card" id="scoreCard">
                <div className="hcard">
                  <div className="circle">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle className="track" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                      <circle id="scoreArc" className="arc" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                    </svg>
                    <div className="val" id="scorePct">80%</div>
                  </div>
                  <div className="score-side">
                    <h3 style={{ marginBottom: 0 }}><img src="https://imgur.com/mFvyCj7.png" alt="" /><span id="uiScoreChecker">Score Checker</span></h3>
                    <div className="score-remark" id="scoreRemark">Determines the overall score.</div>
                    <div className="score-bar"><span className="score-ind" id="scoreInd"></span></div>
                    <div className="score-scale">
                      <span id="scaleUnsafe">Unsafe</span>
                      <span id="scaleSafe">Safe</span>
                      <span id="scaleVerySafe">Very Safe</span>
                    </div>
                  </div>
                </div>
              </section>
              <section className="card meter-block" id="confRightCard">
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/nUGfg96.png" alt="" /><span id="uiConfidence">Confidence to sign freely</span></div>
                  <div id="conf2Val">0%</div>
                </div>
                <div className="meter"><div id="conf2Fill" className="fill"></div></div>
              </section>
            </div>
          </div>
        </main>
      </div>
      {/* Download and Email Modal */}
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
      {/*
        Legacy JS for this page (drawer, language, PDF, etc.) is loaded globally via index.html.
        If you need to move any inline scripts to React, use useEffect and reference window/global objects.
      */}
    </>
  );
};

export default Analysis;

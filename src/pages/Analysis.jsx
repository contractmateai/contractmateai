


import React, { useState } from "react";
import AnalysisSidebar from "../components/AnalysisSidebar";
import AnalysisDrawer from "../components/AnalysisDrawer";
import AnalysisTopbar from "../components/AnalysisTopbar";
import "../styles/home.css";

const Analysis = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      <AnalysisDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <div className="layout">
        <AnalysisSidebar />
        <main className="main">
          <AnalysisTopbar onMenuClick={() => setDrawerOpen(true)} />
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
    </>
  );
};

export default Analysis;

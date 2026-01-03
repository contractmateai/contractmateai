import React, { useState, useEffect, useRef } from "react";
import AnalysisSidebar from "../components/AnalysisSidebar";
import AnalysisDrawer from "../components/AnalysisDrawer";
import PDFGenerator from "../utils/pdf-generator";
import "../styles/analysis.css";

// Static translations for all supported languages
const STATIC_TRANSLATIONS = {
    en: {
      summary: "Summary",
      professionalism: "Professionalism",
      mainClauses: "Cláusulas principales",
      overview: "Resumen",
      overallScore: "Puntuación final",
      confidenceToSign: "Confianza para firmar",
      riskStatic: "Basado en justicia y obligaciones.",
      clarityStatic: "Muestra la claridad de los términos.",
      scoreStatic: "Define la puntuación final.",
      unsafe: "Inseguro",
      notThatSafe: "No tan seguro",
      safe: "Seguro",
      verySafe: "Muy seguro",
      titleLabel: "Título:",
      overview: "Resumen"
    },

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

// ...existing code...

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
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!validEmail(email)) {
      setEmailError("Please enter a valid email address.");
      // ...existing code...
  };

// Static translations for all supported languages
const STATIC_TRANSLATIONS = {
  en: {
    summary: "Summary",
    professionalism: "Professionalism",
  }

  // Helper for risk verdict color and label
    unsafe: "Inseguro",
    notThatSafe: "No tan seguro",
    safe: "Seguro",
    verySafe: "Muy seguro",
    titleLabel: "Título:",
    overview: "Resumen"
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
    titleLabel: "Título:",
    overview: "Resumo"
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
    titleLabel: "Titel:",
    overview: "Samenvatting"
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
    titleLabel: "Titlu:",
    overview: "Rezumat"
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
    titleLabel: "Titulli:",
    overview: "Përmbledhje"
  },
  zh: {
    summary: "摘要",
    professionalism: "专业性",
    favorability: "有利性",
    deadlinePressure: "期限压力",
    potentialIssues: "潜在问题",
    riskLevel: "风险等级",
    clauseClarity: "条款清晰度",
    smartSuggestions: "智能建议",
    mainClauses: "主要条款",
    overallScore: "总分",
    confidenceToSign: "签署信心",
    riskStatic: "基于公平和义务。",
    clarityStatic: "显示条款的清晰度。",
    scoreStatic: "定义最终分数。",
    unsafe: "不安全",
    notThatSafe: "不太安全",
    safe: "安全",
    verySafe: "非常安全",
    titleLabel: "标题：",
    overview: "概览"
  },
  ja: {
    summary: "要約",
    professionalism: "専門性",
    favorability: "有利性",
    deadlinePressure: "期限圧力",
    potentialIssues: "潜在的な問題",
    riskLevel: "リスクレベル",
    clauseClarity: "条項の明確さ",
    smartSuggestions: "スマートな提案",
    mainClauses: "主な条項",
    overallScore: "総合得点",
    confidenceToSign: "署名の自信",
    riskStatic: "公正と義務に基づく。",
    clarityStatic: "条件の明確さを示します。",
    scoreStatic: "最終スコアを定義します。",
    unsafe: "安全ではない",
    notThatSafe: "あまり安全ではない",
    safe: "安全",
    verySafe: "とても安全",
    titleLabel: "タイトル：",
    overview: "概要"
  },
  tr: {
    summary: "Özet",
    professionalism: "Profesyonellik",
    favorability: "Avantaj",
    deadlinePressure: "Süre baskısı",
    potentialIssues: "Olası sorunlar",
    riskLevel: "Risk seviyesi",
    clauseClarity: "Madde açıklığı",
    smartSuggestions: "Akıllı öneriler",
    mainClauses: "Ana maddeler",
    overallScore: "Genel puan",
    confidenceToSign: "İmzalama güveni",
    riskStatic: "Adalet ve yükümlülüklere dayalıdır.",
    clarityStatic: "Şartların açıklığını gösterir.",
    scoreStatic: "Nihai puanı tanımlar.",
    unsafe: "Güvensiz",
    notThatSafe: "Çok güvenli değil",
    safe: "Güvenli",
    verySafe: "Çok güvenli",
    titleLabel: "Başlık:",
    overview: "Özet"
  }
};
  // Use static muted color for all explanations
  const mutedStyle = { color: 'var(--muted)', fontSize: 15 };

  // (removed duplicate staticRiskNote/staticClarityNote/staticScoreNote)

  // Only allow 'unsafe', 'safe', 'very safe' verdicts
// Only allow 'unsafe', 'safe', 'very safe' verdicts


 const verdictDotColor = {
  unsafe: "var(--red)",
  safe: "var(--green)",
  verysafe: "var(--green)"
};



  // Helper to always show fallback/defaults for boxes
  function normalizeList(v) {
  if (Array.isArray(v)) return v.filter(Boolean).map(x => String(x).trim()).filter(Boolean);

  if (typeof v === "string") {
    const aiSummary = analysis.summary;
    const trSummary = tr.summary;
    if (Array.isArray(trSummary) && trSummary.length) return trSummary;
    if (Array.isArray(aiSummary) && aiSummary.length) return aiSummary;
    return [];
  }

    // ...existing code...
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/EdMAMnx.png" alt="" /><span id="uiProfessionalism">{tLabel("professionalism", "Professionalism")}</span>
</div>
                  <div id="confVal">{clamp(analysis.bars?.professionalism)}%</div>
                </div>
                <div className="meter"><div id="confFill" className="fill" style={{width: `${clamp(analysis.bars?.professionalism)}%`, background: (clamp(analysis.bars?.professionalism) <= 29 ? bandColor.red : clamp(analysis.bars?.professionalism) <= 70 ? bandColor.orange : bandColor.green)
}}></div></div>
              </section>
              <section className="card meter-block" id="favCard">
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/UDRuIvO.png" alt="" /><span id="uiFavorability">{tLabel("favorability", "Favorability")}</span>
</div>
                  <div id="favVal">{clamp(analysis.bars?.favorabilityIndex)}%</div>
                </div>
                <div className="meter"><div id="favFill" className="fill" style={{width: `${clamp(analysis.bars?.favorabilityIndex)}%`, background: (clamp(analysis.bars?.favorabilityIndex) <= 29 ? bandColor.red : clamp(analysis.bars?.favorabilityIndex) <= 70 ? bandColor.orange : bandColor.green)
}}></div></div>
              </section>
              <section className="card meter-block" id="deadCard">
                <div className="meter-head">
                  <div className="meter-title"><img src="https://imgur.com/VXZ3kD8.png" alt="" /><span id="uiDeadline">{tLabel("deadlinePressure", "Deadline Pressure")}</span>
</div>
                  <div id="deadVal">{clamp(analysis.bars?.deadlinePressure)}%</div>
                </div>
                <div className="meter"><div id="deadFill" className="fill" style={{width: `${clamp(analysis.bars?.deadlinePressure)}%`, background: (clamp(analysis.bars?.deadlinePressure) <= 29 ? bandColor.green : clamp(analysis.bars?.deadlinePressure) <= 64 ? bandColor.orange : bandColor.red)
}}></div></div>
              </section>
              <section className="card" id="issuesCard">
                <h3 style={{fontWeight:400}}><img src="https://imgur.com/ppLDtiq.png" alt="" /><span id="uiIssues">{tLabel("potentialIssues", "Potential Issues")}</span>
</h3>
                <ul className="bullets" id="issuesList" style={{fontSize: '20px'}}>
                  {(fallbackArr(tIssues).length ? fallbackArr(tIssues) : ["—"]).map((issue, i) => (
                    <li key={i} style={{...mutedStyle, fontSize: '20px'}}>{issue}</li>
                  ))}

                </ul>
              </section>
              <section className="card" id="suggestionsCard">
                <h3 style={{fontWeight:400}}><img src="https://imgur.com/EoVDfd5.png" alt="" /><span id="uiSuggestions">{tLabel("smartSuggestions", "Suggestions")}</span>
</h3>
                <div className="list numbered" id="suggestionsList" style={{fontSize: '20px'}}>
                  {(fallbackArr(tSuggestions).length ? fallbackArr(tSuggestions) : ["—"]).map((s, i) => (
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
                    <h3 style={{ marginBottom: 0, fontWeight:400 }}><img src="https://imgur.com/Myp6Un4.png" alt="" /><span id="uiRisk">{tLabel("riskLevel", "Risk Level")}</span>
</h3>
                    <div className="muted" id="riskNote" style={mutedStyle}>{staticRiskNote}</div>
                    <div className="status">
                      <span
                        className="dot"
                        id="riskDot"
                        // ...existing code...
                <div className="hcard">
                  <div className="circle">
                    <svg width="140" height="140" viewBox="0 0 140 140">
                      <circle className="track" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                      <circle ref={clarArcRef} id="clarArc" className="arc" cx="70" cy="70" r="64" strokeWidth="12" fill="none"></circle>
                    </svg>
                    <div className="val" id="clarVal">{clamp(analysis.clarity?.value)}%</div>
                  </div>
                  <div className="htext">
                    <h3 style={{ marginBottom: 0, fontWeight:400 }}><img src="https://imgur.com/o39xZtC.png" alt="" /><span id="uiClarity">{tLabel("clauseClarity", "Clause Clarity")}</span>
</h3>
                      <div className="muted" id="clarNote" style={mutedStyle}>{staticClarityNote}</div>
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
          : "var(--green)"
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
                <h3 style={{fontWeight:400}}><img src="https://imgur.com/K04axKU.png" alt="" /><span id="uiClauses">{tLabel("mainClauses", "Main Clauses")}</span>
</h3>
                <div className="list numbered" id="clausesList" style={{fontSize: '20px'}}>
                {(fallbackArr(tClauses).length ? fallbackArr(tClauses) : ["—"]).map((c, i) => (
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
                    <h3 style={{ marginBottom: 0 }}><img src="https://imgur.com/mFvyCj7.png" alt="" /><span id="uiScoreChecker">{tLabel("overallScore", "Final Score")}</span>
</h3>
                      <div className="score-remark" id="scoreRemark">{staticScoreNote}</div>
                    <div className="score-bar"><span className="score-ind" id="scoreInd" style={{left: `calc(${clamp(analysis.scoreChecker?.value)}% - 1.5px)`}}></span></div>
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
                  <div className="meter-title"><img src="https://imgur.com/nUGfg96.png" alt="" /><span id="uiConfidence">{tLabel("confidenceToSign", "Confidence to Sign")}</span>
</div>
                  <div id="conf2Val">{clamp(analysis.bars?.confidenceToSign)}%</div>
                </div>
                <div className="meter"><div id="conf2Fill" className="fill" style={{width: `${clamp(analysis.bars?.confidenceToSign)}%`, background: (clamp(analysis.bars?.confidenceToSign) <= 29 ? bandColor.red : clamp(analysis.bars?.confidenceToSign) <= 70 ? bandColor.orange : bandColor.green)
}}></div></div>
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

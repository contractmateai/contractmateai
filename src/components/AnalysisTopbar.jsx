import React from "react";

const AnalysisTopbar = ({ onMenuClick }) => (
  <div className="topbar">
    <div className="top-left">
      <button id="menuBtn" className="menu-btn" aria-label="Open menu" onClick={onMenuClick}>
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
);

export default AnalysisTopbar;

// src/components/Topbar.jsx
import React from "react";

export default function Topbar() {
  return (
    <div className="topbar" id="topbar">
      <div className="topbar-left">
        <a href="index.html">
          <img
            className="topbar-logo"
            src="https://imgur.com/t8UWYN3.png"
            alt="SignSense logo"
          />
        </a>
        <a href="index.html" className="topbar-brand">
          SignSense
        </a>
      </div>

      <nav className="topbar-nav">
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          See How It Works
        </a>
        <a href="index.html">Home</a>
        <a href="contact.html">Contact</a>
      </nav>

      <button className="menu-toggle" id="menuToggle" aria-label="Menu">
        <span className="bar b1"></span>
        <span className="bar b2"></span>
        <span className="bar b3"></span>
      </button>

      {/* mobile menu overlay + panel */}
      <div className="menu-overlay" id="menuOverlay"></div>
      <div className="menu-panel" id="menuPanel" aria-hidden="true">
        <nav className="menu-list">
          <a
            className="menu-item"
            href="https://youtube.com"
            target="_blank"
            rel="noopener"
          >
            See How It Works <span className="chev">›</span>
          </a>
          <a className="menu-item" href="index.html">
            Home <span className="chev">›</span>
          </a>
          <a className="menu-item" href="contact.html">
            Contact <span className="chev">›</span>
          </a>
        </nav>
        <div className="menu-disclaimer">
          <div>Not legal advice.</div>
          <div>© 2025 SignSense. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
}

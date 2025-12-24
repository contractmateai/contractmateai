import React, { useEffect } from "react";
import "../styles/cookies.css";

const Cookies = () => {
  useEffect(() => {
    // Topbar hide/show on scroll
    const bar = document.getElementById("topbarWrap");
    let lastY = window.scrollY;
    let ticking = false;
    function onScroll() {
      const y = window.scrollY;
      if (y > lastY && y > 80) {
        bar && bar.classList.add("hide");
      } else {
        bar && bar.classList.remove("hide");
      }
      lastY = y <= 0 ? 0 : y;
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
    // Fade-in on load + on scroll
    const toReveal = Array.from(document.querySelectorAll("[data-reveal]"));
    toReveal.forEach(el => el.classList.add("reveal"));
    const io = new window.IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    toReveal.forEach(el => io.observe(el));
    window.addEventListener("load", () => {
      toReveal.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.85) el.classList.add("show");
      });
      const bg = document.getElementById("heroBg");
      if (bg) { bg.classList.add("show"); }
    });
    // Mobile menu functionality
    const topbar = document.getElementById('topbar');
    const menuToggle = document.getElementById('menuToggle');
    const menuPanel = document.getElementById('menuPanel');
    const menuOverlay = document.getElementById('menuOverlay');
    function positionPanel() {
      if (!topbar || !menuPanel) return;
      const r = topbar.getBoundingClientRect();
      menuPanel.style.top = (r.top + r.height + 0) + 'px';
    }
    if (menuToggle && menuPanel && menuOverlay) {
      positionPanel();
      window.addEventListener('resize', positionPanel);
      function openMenu() {
        positionPanel();
        menuPanel.classList.add('open');
        menuOverlay.classList.add('show');
        menuToggle.classList.add('open');
        topbar.classList.add('merged');
      }
      function closeMenu() {
        menuPanel.classList.remove('open');
        menuOverlay.classList.remove('show');
        menuToggle.classList.remove('open');
        topbar.classList.remove('merged');
      }
      menuToggle.addEventListener('click', () => {
        if (menuPanel.classList.contains('open')) closeMenu(); else openMenu();
      });
      menuOverlay.addEventListener('click', closeMenu);
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
      window.addEventListener('scroll', () => {
        if (menuPanel.classList.contains('open')) closeMenu();
      }, { passive: true });
    }
    // Cleanup
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", null);
      window.removeEventListener('resize', positionPanel);
    };
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <div className="topbar-wrap" id="topbarWrap">
        <div className="topbar" id="topbar">
          <div className="topbar-left">
            <a href="/">
              <img className="topbar-logo" src="https://imgur.com/t8UWYN3.png" alt="SignSense logo" />
            </a>
            <a href="/" className="topbar-brand">SignSense</a>
          </div>
          <nav className="topbar-nav">
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">See How It Works</a>
            <a href="/">Home</a>
            <a href="/contact">Contact</a>
          </nav>
          <button className="menu-toggle" id="menuToggle" aria-label="Menu">
            <span className="bar b1"></span>
            <span className="bar b2"></span>
            <span className="bar b3"></span>
          </button>
        </div>
      </div>
      <div className="menu-overlay" id="menuOverlay"></div>
      <div className="menu-panel" id="menuPanel" aria-hidden="true">
        <nav className="menu-list">
          <a className="menu-item" href="https://youtube.com" target="_blank" rel="noopener">See How It Works <span className="chev">›</span></a>
          <a className="menu-item" href="/">Home <span className="chev">›</span></a>
          <a className="menu-item" href="/contact">Contact <span className="chev">›</span></a>
        </nav>
        <div className="menu-disclaimer">
          <div>Not legal advice.</div>
          <div>© 2025 SignSense. All rights reserved.</div>
        </div>
      </div>
      <div className="pad-top"></div>
      {/* HERO HEADER */}
      <section className="hero-frame">
        <div className="hero-bg" id="heroBg"></div>
        <div className="hero-content" data-reveal>
          <h1 className="hero-title">Cookie Policy</h1>
          <div className="hero-sub">Last Updated: 06 October 2025</div>
        </div>
      </section>
      <div className="after-hero-spacer"></div>
      {/* CONTENT */}
      <div className="content" data-reveal>
        <div className="intro-title">How SignSense uses cookies &amp; local storage</div>
        <p>This Cookie Policy explains how SignSense (“we”, “our”, “us”) uses cookies and similar technologies (like localStorage and sessionStorage) on our website. For personal data processing, see our <a href="/privacy">Privacy Policy</a>.</p>
        <h2>1) What are cookies &amp; similar tech?</h2>
        <p><strong>Cookies</strong> are small text files placed on your device by your browser. We also use <strong>localStorage</strong> and <strong>sessionStorage</strong>, which store data in your browser to support site functionality.</p>
        <h2>2) What we use them for</h2>
        <ul>
          <li><strong>Strictly Necessary (Essential):</strong> Core features like maintaining the navigation bar behavior or basic preferences. These are required for the site to function.</li>
          <li><strong>Functional:</strong> Quality-of-life features—for example, optionally keeping a draft of text (in your browser only) so you don’t lose it if you navigate away.</li>
          <li><strong>Analytics (optional):</strong> Privacy-focused usage metrics (e.g., performance, page views). Not used for ads or profiling.</li>
        </ul>
        <h2>3) Examples of browser storage we may use</h2>
        <ul>
          <li><code>ss_menu_open</code> (sessionStorage): remembers if the mobile/compact menu is open. Duration: session.</li>
          <li><code>ss_upload_draft</code> (localStorage): optional temporary draft to prevent accidental loss before analysis. Duration: until cleared.</li>
          <li><code>ss_consent</code> (localStorage or cookie): your cookie preferences/consent so we don’t ask repeatedly. Duration: up to 12 months.</li>
        </ul>
        <h2>4) Third-party services</h2>
        <p>We may use privacy-respecting analytics or infrastructure providers that set their own cookies. We do not use advertising cookies. See the <a href="/privacy">Privacy Policy</a> for details on data processing with third parties (e.g., AI providers strictly for analysis).</p>
        <h2>5) Managing your choices</h2>
        <ul>
          <li><strong>Consent banner:</strong> On your first visit, you can accept or manage preferences. Essential items are always on.</li>
          <li><strong>Browser controls:</strong> Block/delete cookies and clear site data (including localStorage/sessionStorage) in your browser settings.</li>
          <li><strong>Analytics opt-out:</strong> If enabled, decline analytics in the banner or by clearing consent (via a “Manage Cookies” link, if present).</li>
        </ul>
        <h2>6) Your rights (GDPR/EEA)</h2>
        <p>In the EEA/UK, essential storage relies on our legitimate interests to provide the service; optional categories rely on your consent. You can withdraw consent at any time using the banner/preferences. For data rights requests, contact <strong>support@signsense.io</strong>.</p>
        <h2>7) Do Not Track</h2>
        <p>Some browsers send a “Do Not Track” (DNT) signal. Because there isn’t a common standard, we don’t respond to DNT at this time. You can still manage cookies using the options above.</p>
        <h2>8) Updates</h2>
        <p>We may update this Cookie Policy as our site evolves. The “Last Updated” date reflects the latest version.</p>
        <h2>9) Contact</h2>
        <p>Questions? Email us at <strong>support@signsense.io</strong>.</p>
      </div>
      {/* READY SECTION */}
      <section className="ready-section" data-reveal>
        <div className="ready-img">
          <img src="https://imgur.com/pgBZqHw.png" alt="Ready to review" />
          <a href="/" className="back-btn">Back to Homepage</a>
        </div>
      </section>
      {/* FOOTER (desktop) */}
      <div className="site-footer-wrap">
        <footer className="site-footer">
          <div className="footer-left">
            <a href="/">
              <img className="footer-logo" src="https://imgur.com/BcUqgKZ.png" alt="SignSense logo" />
            </a>
            <div className="footer-left-inner">
              <a href="/" className="footer-brand">SignSense</a>
              <div className="footer-tagline">
                <div>No confusion, no legal jargon.</div>
                <div>For informational use only. Not legal advice.</div>
              </div>
            </div>
          </div>
          <div className="footer-col">
            <div className="footer-title">Quick Menu</div>
            <nav className="footer-links">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">How it Works</a>
              <a href="https://tally.so/r/3EGJpA" target="_blank" rel="noopener noreferrer">Leave Review</a>
            </nav>
          </div>
          <div className="footer-col">
            <div className="footer-title">Information</div>
            <nav className="footer-links">
              <a href="/contact">Contact</a>
              <a href="/">Home</a>
            </nav>
          </div>
          <div className="footer-col">
            <div className="footer-title">Socials</div>
            <nav className="footer-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer">X</a>
            </nav>
          </div>
        </footer>
        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-links">
            <div className="footer-links-group">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/cookies">Cookie Policy</a>
            </div>
            <span className="footer-copy">© 2025 SignSense. All rights reserved.</span>
          </div>
        </div>
      </div>
      {/* FOOTER (mobile) */}
      <footer className="site-footer-mobile">
        <div className="footer-wrap">
          <div className="footer-brandrow">
            <div className="footer-logo">
              <img src="https://imgur.com/t8UWYN3.png" alt="SignSense logo" />
              <span>SignSense</span>
            </div>
            <div className="footer-copy">© 2025 SignSense. All rights reserved.</div>
            <div className="footer-disclaimer">For informational use only. Not legal advice.</div>
          </div>
          <div className="footer-socials">
            <a className="social-btn" href="https://x.com" target="_blank" rel="noopener" aria-label="X">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.73l-4.7-6.35L5.6 22H3l7.07-8.07L1.5 2h6.8l4.22 5.8L18.244 2Zm-1.18 18h1.77L8.05 4h-1.8l10.82 16Z"/></svg>
            </a>
            <a className="social-btn" href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12.07C22 6.52 17.52 2 12 2S2 6.52 2 12.07c0 5.02 3.66 9.19 8.44 9.93v-7.03H7.9V12.1h2.54V9.79c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.87h-2.34V22c4.78-.74 8.44-4.91 8.44-9.93Z"/></svg>
            </a>
            <a className="social-btn" href="https://www.instagram.com/signsense.io/" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11.001 5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 .001 7.001A3.5 3.5 0 0 0 12 9.5Zm5.25-2.25a1 1 0 1 1 0 2.001 1 1 0 0 1 0-2Z"/></svg>
            </a>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h4>Help</h4>
              <a className="footer-link" href="/contact">Contact us</a>
              <a className="footer-link" href="https://youtube.com" target="_blank" rel="noopener">How it Works</a>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <a className="footer-link" href="https://tally.so/r/3EGJpA" target="_blank" rel="noopener">Leave Review</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a className="footer-link" href="/terms">Terms of Service</a>
              <a className="footer-link" href="/privacy">Privacy Policy</a>
              <a className="footer-link" href="/cookies">Cookie Policy</a>
            </div>
          </div>
          <div className="footer-bottom-space"></div>
        </div>
      </footer>
    </>
  );
};

export default Cookies;

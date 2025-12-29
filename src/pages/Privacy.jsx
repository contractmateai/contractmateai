import React, { useEffect } from "react";
import "../styles/cookies.css";

const Privacy = () => {
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
          <h1 className="hero-title">Privacy Policy</h1>
          <div className="hero-sub">Last Updated: 24 August 2025</div>
        </div>
      </section>
      <div className="after-hero-spacer"></div>
      {/* CONTENT */}
      <div className="content" data-reveal>
        <div className="intro-title">Intro</div>
        <p>Welcome to SignSense (“we”, “our”, or “us”). Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and AI-powered contract review services.</p>
        <h2>1) Information We Collect</h2>
        <p>We only collect the minimal information necessary to provide our services:</p>
        <ul>
          <li><b>Uploaded Documents:</b> When you upload a contract or document, the content is temporarily processed by our AI systems to generate an analysis. We do not permanently store your documents after processing unless explicitly stated (e.g., if you request report storage).</li>
          <li><b>Usage Data:</b> We may collect non-identifiable usage information (e.g., page visits, clicks, or device type) to improve our website and services.</li>
          <li><b>Email Address (Optional):</b> If you request a downloadable report or sign up for updates, we may collect your email. Providing your email is optional and will never be shared or sold.</li>
        </ul>
        <h2>2) How We Use Your Information</h2>
        <p>We use your information solely to:</p>
        <ul>
          <li>Process and analyze uploaded contracts with AI.</li>
          <li>Deliver requested results or reports back to you.</li>
          <li>Improve the performance, reliability, and security of our services.</li>
          <li>Communicate with you only if you provide your email for reports or updates.</li>
        </ul>
        <p>We do not sell, rent, or share your data with third parties for advertising or marketing.</p>
        <h2>3) Data Processing & Third Parties</h2>
        <p>Our AI contract analysis may be powered by OpenAI or similar trusted providers. Documents may be transmitted to these services strictly for analysis purposes. All third-party providers are required to follow strong privacy and security practices and comply with data protection laws (such as GDPR and, where applicable, CCPA).</p>
        <h2>4) Data Retention</h2>
        <ul>
          <li>Uploaded contracts are not stored after analysis, except for temporary caching required to process your request.</li>
          <li>Emails (if provided) are stored securely and used only to deliver requested reports or updates.</li>
        </ul>
        <h2>5) Cookies and Analytics</h2>
        <p>We may use cookies or privacy-focused analytics tools (e.g., Google Analytics, Plausible) to monitor performance and improve our website. These tools do not collect personal or contract data.</p>
        <h2>6) Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Request access to the personal data we hold about you.</li>
          <li>Request correction or deletion of your data.</li>
          <li>Opt out of any optional communications.</li>
        </ul>
        <p>To exercise your rights, contact us at: [Insert Email].</p>
        <h2>7) Data Security</h2>
        <p>We take steps to protect your information during transmission and processing, including encryption and secure connections. However, no system is 100% secure. We recommend avoiding uploads of highly sensitive or classified documents.</p>
        <h2>8) Legal Basis (GDPR Notice)</h2>
        <p>If you are located in the European Economic Area (EEA), we process your personal data under the following legal bases:</p>
        <ul>
          <li>To provide and operate our services (Article 6(1)(b) GDPR).</li>
          <li>With your consent, where applicable (Article 6(1)(a) GDPR).</li>
          <li>To comply with legal obligations (Article 6(1)(c) GDPR).</li>
        </ul>
        <h2>9) Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.</p>
        <h2>10) Contact Us</h2>
        <p>If you have questions about this Privacy Policy or how we handle your data, please contact us:<br/>Email: [Insert Contact Email]</p>
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

export default Privacy;

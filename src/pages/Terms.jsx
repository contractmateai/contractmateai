import React, { useEffect } from "react";
import "../styles/cookies.css";

const Terms = () => {
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
          <h1 className="hero-title">Terms of Service</h1>
          <div className="hero-sub">Last Updated: 14 September 2025</div>
        </div>
      </section>
      <div className="after-hero-spacer"></div>
      {/* CONTENT */}
      <div className="content" data-reveal>
        <div className="intro-title">Introduction</div>
        <p>Welcome to SignSense (“<strong>SignSense</strong>,” “<strong>we</strong>,” “<strong>our</strong>,” or “<strong>us</strong>”). These Terms &amp; Conditions (“<strong>Terms</strong>”) govern your access to and use of our website and AI-powered contract review tool (collectively, the “<strong>Services</strong>”). By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, please do not use the Services.</p>
        <h2>1) Who We Are</h2>
        <p>SignSense is owned and operated by an individual based in Albania (Europe). There is no registered company entity at this time.</p>
        <h2>2) What We Provide</h2>
        <p>SignSense provides an AI-powered contract review experience that analyzes uploaded documents to generate summaries, highlight key clauses, and surface potential issues. The Service is currently <strong>free to use</strong>, and <strong>no account or registration</strong> is required.</p>
        <h2>3) Not Legal Advice</h2>
        <p><strong>SignSense is not a law firm and the output is not legal advice.</strong> Content generated by our AI is provided for informational purposes only and may be incomplete, inaccurate, or not applicable to your specific situation. You should consult a qualified attorney for legal advice. You acknowledge that you use the results at your own discretion and risk.</p>
        <h2>4) Eligibility &amp; Use</h2>
        <ul>
          <li>No specific age restriction is imposed; however, you represent that you have the legal capacity to enter into these Terms or are using the Services with appropriate guidance.</li>
          <li>You agree to comply with these Terms and all applicable laws while using the Services.</li>
        </ul>
        <h2>5) Uploads &amp; Data Handling</h2>
        <ul>
          <li><strong>No Permanent Storage:</strong> Uploaded documents are processed to generate results and are <strong>not stored</strong> after analysis, aside from any temporary caching technically required to complete the request.</li>
          <li><strong>Email (Optional):</strong> If you choose to provide an email (e.g., to receive a report), it will be used only to deliver the requested materials or updates you opt into.</li>
          <li><strong>Privacy Policy:</strong> For details on how we handle personal data, please refer to our <a href="/privacy">Privacy Policy</a>.</li>
        </ul>
        <h2>6) Acceptable Use &amp; Prohibited Conduct</h2>
        <p>You agree not to misuse the Services. Prohibited conduct includes, without limitation:</p>
        <ul>
          <li>Uploading unlawful, infringing, or malicious content; or content you do not have the right to share.</li>
          <li>Attempting to reverse engineer, scrape, or harvest data from the Services.</li>
          <li>Interfering with or disrupting the integrity or performance of the Services.</li>
          <li>Using the Services to create or disseminate legal documents that you present as attorney-reviewed.</li>
        </ul>
        <h2>7) Intellectual Property</h2>
        <ul>
          <li>All rights, title, and interest in the Services, including the site design, logos, graphics, and other materials, are owned by SignSense or its licensors.</li>
          <li>You may use the Services for personal or internal business purposes. You may not copy, modify, distribute, or create derivative works from any part of the Services, except as expressly permitted by law.</li>
        </ul>
        <h2>8) Service Availability &amp; Changes</h2>
        <p>We aim to keep the Services available but do not guarantee uninterrupted or error-free operation. We may modify, suspend, or discontinue any aspect of the Services at any time, with or without notice.</p>
        <h2>9) Third-Party Services</h2>
        <p>Our analysis may utilize third-party AI providers (e.g., OpenAI) solely to process your documents for the requested output. We do not control and are not responsible for third-party services or websites linked from our site.</p>
        <h2>10) Warranty Disclaimer</h2>
        <p>The Services are provided on an “<strong>AS IS</strong>” and “<strong>AS AVAILABLE</strong>” basis without warranties of any kind, express or implied, including but not limited to warranties of accuracy, fitness for a particular purpose, and non-infringement.</p>
        <h2>11) Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, SignSense and its owner will not be liable for any indirect, incidental, special, consequential, or exemplary damages, or any loss of profits, data, or goodwill, arising from or related to your use of the Services or reliance on the outputs. Your sole and exclusive remedy for dissatisfaction with the Services is to stop using them.</p>
        <h2>12) Indemnification</h2>
        <p>You agree to indemnify and hold harmless SignSense and its owner from any claims, damages, liabilities, costs, and expenses (including reasonable attorneys’ fees) arising out of or related to: (a) your use of the Services; (b) your content or uploads; or (c) your violation of these Terms or applicable laws.</p>
        <h2>13) Governing Law &amp; Dispute Resolution</h2>
        <p>These Terms are governed by the laws of Albania, without regard to its conflict of laws principles. You agree that the courts located in Tirana, Albania shall have exclusive jurisdiction over any dispute arising from or relating to these Terms or the Services.</p>
        <h2>14) Changes to These Terms</h2>
        <p>We may update these Terms from time to time. The “Last Updated” date at the top will reflect the latest changes. Your continued use of the Services after changes become effective constitutes acceptance of the revised Terms.</p>
        <h2>15) Contact</h2>
        <p>If you have questions about these Terms or the Services, please contact us at: <strong>support@signsense.io</strong></p>
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

export default Terms;

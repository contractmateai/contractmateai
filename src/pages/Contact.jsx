import React, { useRef, useEffect } from "react";

function Contact() {
  const formRef = useRef();
  const btnRef = useRef();
  const alertRef = useRef();

  useEffect(() => {
    const container = document.getElementById("heroParticles");
    if (!container) return;
    const NUM = 35;
    const DURATION = 16;
    function sideBiasedPercent() {
      const r = Math.random();
      if (r < 0.375) {
        return Math.random() * 20;
      } else if (r < 0.75) {
        return 80 + Math.random() * 20;
      } else {
        return 20 + Math.random() * 60;
      }
    }
    for (let i = 0; i < NUM; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = sideBiasedPercent() + "%";
      p.style.bottom = -20 + "px";
      p.style.animationDuration = DURATION + "s";
      p.style.animationDelay = (-Math.random() * DURATION) + "s";
      container.appendChild(p);
    }
  }, []);

  // Contact form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    const btn = btnRef.current;
    const alertBox = alertRef.current;
    if (!form || !btn || !alertBox) return;
    alertBox.textContent = '';
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !phone || !email || !message) {
      alertBox.textContent = 'Please fill out all fields.';
      alertBox.style.color = '#ffb3b3';
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alertBox.textContent = 'Please enter a valid email address.';
      alertBox.style.color = '#ffb3b3';
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Sending…';
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, message, to: 'support@signsense.io' })
      });
      if (!res.ok) throw new Error('Network response was not ok');
      alertBox.textContent = 'Thanks! Your message has been sent.';
      alertBox.style.color = '#aafe2a';
      form.reset();
      btn.textContent = 'Sent!';
      setTimeout(() => { btn.disabled = false; btn.textContent = 'Send'; }, 4000);
    } catch (err) {
      alertBox.textContent = 'Sorry, something went wrong. Please try again.';
      alertBox.style.color = '#ffb3b3';
      btn.disabled = false;
      btn.textContent = 'Send';
    }
  };

  return (
    <>
      {/* FLOATING TOP BAR (WITH MOBILE MENU) */}
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
      {/* HERO */}
      <section className="hero-frame" data-aos="fade-in">
        <div className="hero-bg">
          <div className="hero-particles" id="heroParticles"></div>
        </div>
        <div className="hero-content" data-aos="fade-up">
          <div className="badge">We’re Here For You</div>
          <h1 className="hero-title">We’re Ready To<br />Listen And Respond</h1>
          <div className="hero-sub">Whether it's feedback, questions, or ideas — we're just a message away.</div>
        </div>
      </section>
      <div className="after-hero-spacer"></div>
      {/* CONTACT */}
      <section className="contact-section" data-aos="fade-up">
        <div className="contact-wrap" id="contact">
          <div className="contact-card">
            <div>
              <form id="contactForm" ref={formRef} noValidate autoComplete="off" onSubmit={handleSubmit}>
                <div className="row">
                  <input className="field" type="text" id="name" name="name" placeholder="Name" required />
                  <input className="field" type="tel" id="phone" name="phone" placeholder="Phone" required />
                </div>
                <input
                  className="field email"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck="false"
                  inputMode="email"
                />
                <textarea className="field" id="message" name="message" placeholder="Message" required></textarea>
                <button className="send-btn" id="sendBtn" ref={btnRef} type="submit">Send</button>
                <div className="sla">We will contact you within 24 hours.</div>
                <div id="formAlert" ref={alertRef} style={{ marginTop: 10, fontSize: 14, color: '#d8cccc' }}></div>
              </form>
            </div>
            <aside className="contact-info">
              <div className="info-title">Contact Information</div>
              <div className="info-sub">
                <div>Your feedback matters.</div>
                <div className="future">Let's build a better future together.</div>
              </div>
              <div className="info-list">
                <div className="info-item">
                  <img className="info-icon" src="https://imgur.com/Drq6L0n.png" alt="WhatsApp icon" />
                  <div className="info-text">
                    <div className="info-label">WhatsApp:</div>
                    <div className="info-value"><a href="https://wa.me/355696902900">+355 69 690 2900</a></div>
                  </div>
                </div>
                <div className="info-item">
                  <img className="info-icon" src="https://imgur.com/V3ziuzH.png" alt="Email icon" />
                  <div className="info-text">
                    <div className="info-label">Email:</div>
                    <div className="info-value"><a href="mailto:support@signsense.io">support@signsense.io</a></div>
                  </div>
                </div>
              </div>
              <div className="mobile-contact-info">
                <div className="info-label">WhatsApp:</div>
                <div className="info-value"><a href="https://wa.me/355696902900">+355 69 690 2900</a></div>
                <div className="info-label">Email:</div>
                <div className="info-value"><a href="mailto:support@signsense.io">support@signsense.io</a></div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section className="faq-section" data-aos="fade-up">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <div className="faq-list" id="faqList">
          <div className="faq-item">
            <div className="faq-head">
              <span>What languages do you support?</span>
              <svg className="faq-arrow" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <div className="faq-a">We support English, Spanish, German, French, Italian, Portuguese, Dutch, Romanian, Albanian, Chinese, Japanese, and Turkish.</div>
          </div>
          <div className="faq-item">
            <div className="faq-head">
              <span>Is SignSense legally binding?</span>
              <svg className="faq-arrow" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <div className="faq-a">No. SignSense explains your contract using AI, but it isn’t legally binding and doesn’t replace professional legal advice.</div>
          </div>
          <div className="faq-item">
            <div className="faq-head">
              <span>What types of contracts can I upload?</span>
              <svg className="faq-arrow" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <div className="faq-a">Most standard agreements—leases, NDAs, freelance/service contracts, employment offers, and more.</div>
          </div>
          <div className="faq-item">
            <div className="faq-head">
              <span>Is my data secure?</span>
              <svg className="faq-arrow" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <div className="faq-a">Yes. Uploads are processed securely; we don’t sell your data or share your files with third parties.</div>
          </div>
        </div>
      </section>
      {/* FOOTER (DESKTOP) */}
      <div className="site-footer-wrap" data-aos="fade-in">
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
            <a href="/privacy.html">Privacy Policy</a>
            <a href="/terms.html">Terms & Conditions</a>
            <a href="/cookies">Cookie Policy</a>
            <span className="footer-copy">© 2025 SignSense. All rights reserved.</span>
          </div>
        </div>
      </div>
      {/* FOOTER (MOBILE) */}
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
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.73l-4.7-6.35L5.6 22H3l7.07-8.07L1.5 2h6.8l4.22 5.8L18.244 2Zm-1.18 18h1.77L8.05 4h-1.8l10.82 16Z" /></svg>
            </a>
            <a className="social-btn" href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 12.07C22 6.52 17.52 2 12 2S2 6.52 2 12.07c0 5.02 3.66 9.19 8.44 9.93v-7.03H7.9V12.1h2.54V9.79c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.87h-2.34V22c4.78-.74 8.44-4.91 8.44-9.93Z" /></svg>
            </a>
            <a className="social-btn" href="https://www.instagram.com/signsense.io/" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11.001 5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 .001 7.001A3.5 3.5 0 0 0 12 9.5Zm5.25-2.25a1 1 0 1 1 0 2.001 1 1 0 0 1 0-2Z" /></svg>
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
              <a className="footer-link" href="/terms.html">Terms of Service</a>
              <a className="footer-link" href="/privacy.html">Privacy Policy</a>
              <a className="footer-link" href="/cookies">Cookie Policy</a>
            </div>
          </div>
          <div className="footer-bottom-space"></div>
        </div>
      </footer>

    </>
  );
}

export default Contact;

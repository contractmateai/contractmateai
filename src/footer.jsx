// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <>
      {/* Desktop footer */}
      <div className="site-footer-wrap desktop-only">
        <footer className="site-footer desktop-only">
          <div className="footer-left">
            <a href="index.html">
              <img
                className="footer-logo"
                src="https://imgur.com/BcUqgKZ.png"
                alt="SignSense logo"
              />
            </a>
            <div className="footer-left-inner">
              <a href="index.html" className="footer-brand">
                SignSense
              </a>
              <div className="footer-tagline">
                <div>No confusion, no legal jargon.</div>
                <div>For informational use only. Not legal advice.</div>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-title">Quick Menu</div>
            <nav className="footer-links">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                How it Works
              </a>
              <a
                href="https://tally.so/r/3EGJpA"
                target="_blank"
                rel="noopener noreferrer"
              >
                Leave Review
              </a>
            </nav>
          </div>

          <div className="footer-col">
            <div className="footer-title">Information</div>
            <nav className="footer-links">
              <a href="contact.html">Contact</a>
              <a href="index.html">Home</a>
            </nav>
          </div>

          <div className="footer-col">
            <div className="footer-title">Socials</div>
            <nav className="footer-links">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                X
              </a>
            </nav>
          </div>
        </footer>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-links">
            <a href="privacy.html">Privacy Policy</a>
            <a href="terms.html">Terms of Service</a>
            <a href="cookies.html">Cookie Policy</a>
            <span className="footer-copy">
              © 2025 SignSense. All rights reserved.
            </span>
          </div>
        </div>
      </div>

      {/* Mobile footer */}
      <footer className="site-footer-mobile">
        <div className="footer-wrap">
          <div className="footer-brandrow">
            <div className="footer-logo">
              <img
                src="https://imgur.com/t8UWYN3.png"
                alt="SignSense logo"
              />
              <span>SignSense</span>
            </div>
            <div className="footer-copy">
              © 2025 SignSense. All rights reserved.
            </div>
            <div className="footer-disclaimer">
              For informational use only. Not legal advice.
            </div>
          </div>

          <div className="footer-socials">
            {/* X */}
            <a
              className="social-btn"
              href="https://x.com"
              target="_blank"
              rel="noopener"
              aria-label="X"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.73l-4.7-6.35L5.6 22H3l7.07-8.07L1.5 2h6.8l4.22 5.8L18.244 2Zm-1.18 18h1.77L8.05 4h-1.8l10.82 16Z" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              className="social-btn"
              href="https://facebook.com"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12.07C22 6.52 17.52 2 12 2S2 6.52 2 12.07c0 5.02 3.66 9.19 8.44 9.93v-7.03H7.9V12.1h2.54V9.79c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.87h-2.34V22c4.78-.74 8.44-4.91 8.44-9.93Z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              className="social-btn"
              href="https://www.instagram.com/signsense.io/"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11.001 5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 .001 7.001A3.5 3.5 0 0 0 12 9.5Zm5.25-2.25a1 1 0 1 1 0 2.001 1 1 0 0 1 0-2Z" />
              </svg>
            </a>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4>Help</h4>
              <a className="footer-link" href="contact.html">
                Contact us
              </a>
              <a
                className="footer-link"
                href="https://youtube.com"
                target="_blank"
                rel="noopener"
              >
                How it Works
              </a>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <a
                className="footer-link"
                href="https://tally.so/r/3EGJpA"
                target="_blank"
                rel="noopener"
              >
                Leave Review
              </a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a className="footer-link" href="terms.html">
                Terms of Service
              </a>
              <a className="footer-link" href="privacy.html">
                Privacy Policy
              </a>
              <a className="footer-link" href="cookies.html">
                Cookie Policy
              </a>
            </div>
          </div>
          <div className="footer-bottom-space"></div>
        </div>
      </footer>
    </>
  );
}

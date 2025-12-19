// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
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
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
            >
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
          <span className="footer-copy">© 2025 SignSense. All rights reserved.</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;

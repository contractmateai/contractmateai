// src/components/Faq.jsx
import React from "react";

export default function Faq() {
  return (
    <section className="faq-section" data-aos="fade-up">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        <div className="faq-item">
          <button className="faq-q" type="button">
            <span>What languages do you support?</span>
            <svg className="chev" viewBox="0 0 24 24" width="26" height="26">
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="faq-a">
            We support English, Spanish, German, French, Italian, Portuguese,
            Dutch, Romanian, Albanian, Chinese, Japanese, and Turkish. More
            coming soon!
          </div>
        </div>

        <div className="faq-item">
          <button className="faq-q" type="button">
            <span>Is SignSense legally binding or a replacement for a lawyer?</span>
            <svg className="chev" viewBox="0 0 24 24" width="26" height="26">
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="faq-a">
            No. SignSense explains your contract using AI, but it isn’t legally
            binding and doesn’t replace professional legal advice.
          </div>
        </div>

        <div className="faq-item">
          <button className="faq-q" type="button">
            <span>What types of contracts can I upload?</span>
            <svg className="chev" viewBox="0 0 24 24" width="26" height="26">
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="faq-a">
            Most standard agreements—leases, NDAs, freelance/service contracts,
            employment offers, and more.
          </div>
        </div>

        <div className="faq-item">
          <button className="faq-q" type="button">
            <span>Is my data secure when I upload a contract?</span>
            <svg className="chev" viewBox="0 0 24 24" width="26" height="26">
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="faq-a">
            Yes. Uploads are processed securely; we don’t sell your data or
            share your files with third parties.
          </div>
        </div>
      </div>
    </section>
  );
}

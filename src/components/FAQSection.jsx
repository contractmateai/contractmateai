// src/components/FaqSection.jsx
import React, { useState } from 'react';

const faqs = [
  {
    q: "What languages do you support?",
    a: "We support English, Spanish, German, French, Italian, Portuguese, Dutch, Romanian, Albanian, Chinese, Japanese, and Turkish. More coming soon!",
  },
  {
    q: "Is SignSense legally binding or a replacement for a lawyer?",
    a: "No. SignSense explains your contract using AI, but it isn’t legally binding and doesn’t replace professional legal advice.",
  },
  {
    q: "What types of contracts can I upload?",
    a: "Most standard agreements—leases, NDAs, freelance/service contracts, employment offers, and more.",
  },
  {
    q: "Is my data secure when I upload a contract?",
    a: "Yes. Uploads are processed securely; we don’t sell your data or share your files with third parties.",
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" data-aos="fade-up">
      <h2 className="faq-title">Frequently Asked Questions</h2>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
            key={index}
          >
            <button
              className="faq-q"
              type="button"
              onClick={() => toggle(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span>{faq.q}</span>
              <svg
                className="chev"
                viewBox="0 0 24 24"
                width="26"
                height="26"
                aria-hidden="true"
              >
                <path
                  d="M6 9l6 6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div
              className="faq-a"
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
            >
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;

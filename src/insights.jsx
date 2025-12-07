// src/components/Insights.jsx
import React from "react";

export default function Insights() {
  return (
    <>
      <div
        style={{
          textAlign: "center",
          marginTop: "80px",
          marginBottom: "24px",
        }}
      >
        <div className="section-badge animated-arrow-bttn">
          Instant Clarity Engine{" "}
          <span className="animated-arrow diag" aria-hidden="true">
            ↗
          </span>
        </div>
      </div>

      {/* Desktop + mobile headings (same as HTML) */}
      <h2 className="section-title hide-on-mobile">
        Smarter Reviews,
        <br />
        Faster Decisions
      </h2>

      <p className="section-sub hide-on-mobile">
        AI highlights key clauses, risks, and red flags
        <br />
        so you can sign smarter and with confidence.
      </p>

      <h2 className="section-title show-on-mobile">
        <span className="nowrap">Way Smarter Reviews</span>
        <br />
        <span className="nowrap">
          <span className="lime">Faster&nbsp;Decisions</span>
        </span>
      </h2>

      <p className="section-sub show-on-mobile">
        <span className="nowrap">AI highlights, key clauses, risks</span>
        <br />
        <span className="nowrap">red&nbsp;flags so you can sign smarter</span>
      </p>

      <section className="insight-section" data-aos="fade-up">
        <div className="insight-content">
          <div className="insight-left moving-line-wrapper">
            <span className="yellow-line" id="yellowLine"></span>
            <div className="moving-line-content">
              <img
                src="https://i.imgur.com/a6QxhzQ.png"
                alt="Insights UI"
              />
            </div>
          </div>

          <div className="insight-right hide-on-mobile">
            <div className="insight-icon-row">
              <img
                className="circle-icon"
                src="https://i.imgur.com/VVGvghi.png"
                alt="AI icon"
                loading="lazy"
              />
              <img
                className="circle-icon"
                src="https://i.imgur.com/woCjWUt.png"
                alt="Speed icon"
                loading="lazy"
              />
              <img
                className="circle-icon"
                src="https://i.imgur.com/0IzXvgs.png"
                alt="Shield/Secure icon"
                loading="lazy"
              />
            </div>
            <h2>
              Understand Your Contract <br />
              <span>Instantly with AI</span>
            </h2>
            <p>
              Reveal hidden risks and key terms so you can review contracts
              clearly, quickly, and without confusion.
            </p>
            <a
              id="insightReviewBtn"
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-outline animated-arrow-bttn"
            >
              Learn More{" "}
              <span className="animated-arrow diag" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

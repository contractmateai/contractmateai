// src/components/InsightSection.jsx
import React, { useEffect, useRef } from 'react';

const InsightSection = () => {
  const yellowLineRef = useRef(null);

  useEffect(() => {
    const yellowLine = yellowLineRef.current;
    if (!yellowLine) return;

    // The moving yellow glow animation is purely CSS-driven via @keyframes move-around
    // We only need to ensure it's present and running.
    // No JavaScript logic is required beyond the CSS you already have in App.css.

    // Optional: Force a reflow to restart animation if needed (rarely necessary)
    // yellowLine.style.animation = 'none';
    // void yellowLine.offsetWidth;
    // yellowLine.style.animation = 'move-around 8s linear infinite';

    // No cleanup needed since it's pure CSS animation
  }, []);

  return (
    <section className="insight-section" data-aos="fade-up">
      <div className="insight-content">
        {/* Left side - Image with moving yellow glow */}
        <div className="insight-left moving-line-wrapper">
          <span className="yellow-line" ref={yellowLineRef}></span>
          <div className="moving-line-content">
            <img
              src="https://i.imgur.com/a6QxhzQ.png"
              alt="SignSense Insights UI showing contract analysis"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right side - Text content (hidden on mobile via CSS) */}
        <div className="insight-right hide-on-mobile">
          <div className="insight-icon-row">
            <img
              className="circle-icon"
              src="https://i.imgur.com/VVGvghi.png"
              alt="AI intelligence icon"
              loading="lazy"
            />
            <img
              className="circle-icon"
              src="https://i.imgur.com/woCjWUt.png"
              alt="Speed and efficiency icon"
              loading="lazy"
            />
            <img
              className="circle-icon"
              src="https://i.imgur.com/0IzXvgs.png"
              alt="Security and privacy shield icon"
              loading="lazy"
            />
          </div>

          <h2>
            Understand Your Contract <br />
            <span>Instantly with AI</span>
          </h2>

          <p>
            Reveal hidden risks and key terms so you can review contracts clearly, quickly, and without confusion.
          </p>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-outline animated-arrow-bttn"
          >
            Learn More <span className="animated-arrow diag" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default InsightSection;

// src/components/ScrollFeatures.jsx
import React, { useRef, useEffect } from 'react';

const featuresTop = [
  { label: "No Signup", icon: "https://imgur.com/dKG0KXh.png" },
  { label: "Secure Processing", icon: "https://imgur.com/Cbflaz5.png" },
  { label: "PDF Export", icon: "https://imgur.com/RozMHbN.png" },
  { label: "Risk Indicator", icon: "https://imgur.com/hDBmbBP.png" },
  { label: "Your Data Stays Yours", icon: "https://imgur.com/SaW85D2.png" },
  { label: "Smart Summary", icon: "https://imgur.com/dPCWJg7.png" },
  { label: "Language Detection", icon: "https://imgur.com/Xv2u5Mz.png" },
  { label: "Key Clauses", icon: "https://imgur.com/cv1DrX1.png" },
];

const featuresBottom = [
  { label: "Legal Insights", icon: "https://imgur.com/0TgzL8P.png" },
  { label: "Suggestions Engine", icon: "https://imgur.com/JMV0gKS.png" },
  { label: "Clause Warnings", icon: "https://imgur.com/MAZkZHs.png" },
  { label: "AI Review", icon: "https://imgur.com/o8K46Sk.png" },
  { label: "No legal jargon", icon: "https://imgur.com/3PU7xU0.png" },
  { label: "Deadline Pressure", icon: "https://imgur.com/rlaNjHT.png" },
  { label: "Modern Design", icon: "https://imgur.com/Ie8CwXO.png" },
  { label: "Confidence to Sign", icon: "https://imgur.com/5DGepME.png" },
];

const ScrollFeatures = () => {
  const topRowRef = useRef(null);
  const bottomRowRef = useRef(null);

  useEffect(() => {
    // Populate both rows with duplicated items for seamless looping
    const populateRow = (rowRef, features) => {
      if (!rowRef.current) return;

      const makeSet = () => {
        const frag = document.createDocumentFragment();
        features.forEach((f) => {
          const el = document.createElement("div");
          el.className = "scroll-item";
          el.innerHTML = `<img src="${f.icon}" alt="${f.label}" loading="lazy"><span>${f.label}</span>`;
          frag.appendChild(el);
        });
        return frag;
      };

      const firstSet = makeSet();
      const secondSet = makeSet(); // Duplicate for smooth infinite scroll

      rowRef.current.appendChild(firstSet);
      rowRef.current.appendChild(secondSet);
    };

    populateRow(topRowRef, featuresTop);
    populateRow(bottomRowRef, featuresBottom);

    // Ticker function for infinite scrolling
    const makeTicker = (rowRef, pxPerSecond = 36, direction = "left") => {
      if (!rowRef.current) return;

      let x = 0;
      let w = 0;
      let last = performance.now();
      let rafId = null;

      const speed = direction === "left" ? -pxPerSecond : pxPerSecond;

      const measure = () => {
        w = rowRef.current.scrollWidth / 2;
      };

      const tick = (now) => {
        const dt = (now - last) / 1000;
        last = now;
        x += speed * dt;

        // Seamless loop: reset when fully scrolled one set
        if (x <= -w) x += w;
        if (x >= 0) x -= w;

        rowRef.current.style.transform = `translateX(${x}px)`;
        rafId = requestAnimationFrame(tick);
      };

      const start = () => {
        measure();
        last = performance.now();
        rafId = requestAnimationFrame(tick);
      };

      const stop = () => {
        if (rafId) cancelAnimationFrame(rafId);
      };

      // Start ticker
      start();

      // Handle resize (re-measure width)
      const handleResize = () => measure();
      window.addEventListener("resize", handleResize, { passive: true });

      // Cleanup
      return () => {
        stop();
        window.removeEventListener("resize", handleResize);
      };
    };

    // Run tickers in opposite directions
    const topTickerCleanup = makeTicker(topRowRef, 36, "right");
    const bottomTickerCleanup = makeTicker(bottomRowRef, 36, "left");

    // Cleanup on unmount
    return () => {
      topTickerCleanup?.();
      bottomTickerCleanup?.();
    };
  }, []);

  return (
    <div className="scroll-full">
      <div className="scroll-wrapper">
        <section className="scroll-section" data-aos="fade-up">
          <h3>Everything you need for clarity &amp; security in one seamless experience.</h3>
          <div className="scroll-strip top-row" ref={topRowRef}></div>
          <div className="scroll-strip bottom-row" ref={bottomRowRef}></div>
          <div className="scroll-shadow-left"></div>
          <div className="scroll-shadow-right"></div>
        </section>
      </div>
    </div>
  );
};

export default ScrollFeatures;

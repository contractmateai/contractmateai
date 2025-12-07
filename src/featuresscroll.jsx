// src/components/FeaturesScroll.jsx
import React from "react";

export default function FeaturesScroll() {
  return (
    <div className="scroll-full">
      <div className="scroll-wrapper">
        <section className="scroll-section" data-aos="fade-up">
          <h3>
            Everything you need for clarity &amp; security in one seamless
            experience.
          </h3>

          <div className="scroll-strip top-row"></div>
          <div className="scroll-strip bottom-row"></div>
          <div className="scroll-shadow-left"></div>
          <div className="scroll-shadow-right"></div>
        </section>
      </div>
    </div>
  );
}

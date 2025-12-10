// src/App.jsx
import React from "react";

import Topbar from "./topbar.jsx";
import Hero from "./hero.jsx";
import LogoStrip from "./logostrip.jsx";
import Insights from "./insights.jsx";
import FeaturesScroll from "./featuresscroll.jsx";
import Reviews from "./reviews.jsx";
import Faq from "./faq.jsx";
import Footer from "./footer.jsx";
import UploadLogic from "./uploadlogic.jsx";


export default function App() {
  return (
    <>
      {/* particles container stays at top like in your HTML */}
      <div className="topbar-wrap" id="topbarWrap">
        <Topbar />
      </div>

      <div className="particle-container" id="particles" />

      <div className="hero-wrapper">
        <Hero />
      </div>

      <LogoStrip />

      <Insights />

      <FeaturesScroll />

      {/* watch-video-section is currently display:none in your CSS, so we skip component */}

      <Reviews />

      <Faq />

      <Footer />

      {/* JS logic that wires everything (scrolls, upload, faq, etc.) */}
      <UploadLogic />
    </>
  );
}
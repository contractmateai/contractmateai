// src/App.jsx
import React from "react";

import Topbar from "./Topbar.jsx";
import Hero from "./Hero.jsx";
import LogoStrip from "./LogoStrip.jsx";
import Insights from "./Insights.jsx";
import FeaturesScroll from "./FeaturesScroll.jsx";
import Reviews from "./Reviews.jsx";
import Faq from "./Faq.jsx";
import Footer from "./Footer.jsx";
import UploadLogic from "./UploadLogic.jsx";


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

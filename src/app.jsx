// src/App.jsx
import React from "react";
import Topbar from "./components/Topbar.jsx";
import Hero from "./components/Hero.jsx";
import LogoStrip from "./components/LogoStrip.jsx";
import Insights from "./components/Insights.jsx";
import FeaturesScroll from "./components/FeaturesScroll.jsx";
import Reviews from "./components/Reviews.jsx";
import Faq from "./components/Faq.jsx";
import Footer from "./components/Footer.jsx";
import UploadLogic from "./components/UploadLogic.jsx";

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

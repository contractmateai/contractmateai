// src/App.jsx
import React from "react";

// all these files are in src/, so no /components folder
import Topbar from "./topbar.jsx";
import Hero from "./hero.jsx";
import LogoStrip from "./logostrip.jsx";
import Insights from "./insights.jsx";
import FeaturesScroll from "./featurescroll.jsx";
import Reviews from "./reviews.jsx";
import Faq from "./faq.jsx";
import Footer from "./footer.jsx";
import UploadLogic from "./uploadlogic.jsx";

export default function App() {
  return (
    <>
      {/* top bar */}
      <div className="topbar-wrap" id="topbarWrap">
        <Topbar />
      </div>

      {/* particles */}
      <div className="particle-container" id="particles" />

      {/* hero */}
      <div className="hero-wrapper">
        <Hero />
      </div>

      {/* rest of homepage */}
      <LogoStrip />
      <Insights />
      <FeaturesScroll />
      <Reviews />
      <Faq />
      <Footer />

      {/* scripts / wiring */}
      <UploadLogic />
    </>
  );
}

// src/components/Hero.jsx
import React from "react";

export default function Hero() {
  return (
    <>
      <section className="hero reveal-on-load">
        <div className="hero-upper">
          <div className="tagline-absolute animated-arrow-bttn">
            <span className="chip">AI</span>
            Legal DocReview Tool
            <span className="animated-arrow diag" aria-hidden="true">
              ↗
            </span>
          </div>

          {/* DESKTOP */}
          <h1 className="hide-on-mobile">
            Make Sense Of What
            <br />
            <span>You’re Signing</span>
          </h1>

          {/* MOBILE */}
          <h1 className="show-on-mobile">
            <span>
              Make&nbsp;<span className="lime">Sense</span>&nbsp;Of&nbsp;What
            </span>
            <span>
              You’re&nbsp;<span className="lime">Signing</span>
            </span>
          </h1>

          {/* DESKTOP subtext */}
          <p className="subtext hide-on-mobile">
            Free contract reviewing and no need at all for any account creation
            or sign up.
          </p>

          {/* MOBILE subtext */}
          <p className="subtext show-on-mobile">
            Free contract reviewing and no need for
            <br />
            an account creation or sign up.
          </p>
        </div>

        <div id="ctaWrap" className="cta-wrapper">
          <button id="reviewBtn" className="cta-btn animated-arrow-bttn">
            Review A Contract{" "}
            <span className="animated-arrow diag" aria-hidden="true">
              ↗
            </span>
          </button>
        </div>

        <div id="rolePicker" className="role-picker" hidden>
          <span className="role-title">You are:</span>
          <div className="role-buttons">
            <button type="button" className="role-btn" data-role="signer">
              The Signer
            </button>
            <button type="button" className="role-btn" data-role="writer">
              The Writer
            </button>
          </div>
        </div>

        {/* MOBILE-ONLY YOUTUBE */}
        <div className="yt-wrap show-on-mobile">
          <div className="yt-box">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
              title="SignSense video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      <div className="app-container">
        <div className="app-wrapper" id="appWrapper">
          <div className="app-frame">
            <div className="glint-line" aria-hidden="true"></div>
            <img
              className="app-preview"
              src="https://i.imgur.com/slsiM6i.png"
              alt="App Preview"
            />
          </div>
        </div>
      </div>
    </>
  );
}

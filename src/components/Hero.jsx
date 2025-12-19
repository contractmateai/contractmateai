// src/components/Hero.jsx
import React from 'react';

const Hero = ({
  onCTA,
  showRolePicker,
  onRoleSelect,
  selectedRole,
  fileInputRef,
  cameraInputRef,
  onFileChange,
}) => {
  return (
    <div className="hero-wrapper">
      <section className="hero reveal-on-load">
        <div className="hero-upper">
          <div className="tagline-absolute animated-arrow-bttn">
            <span className="chip">AI</span>
            Legal DocReview Tool
            <span className="animated-arrow diag" aria-hidden="true">↗</span>
          </div>

          {/* Desktop headline */}
          <h1 className="hide-on-mobile">
            Make Sense Of What<br />
            <span>You’re Signing</span>
          </h1>

          {/* Mobile headline */}
          <h1 className="show-on-mobile">
            <span>
              Make&nbsp;<span className="lime">Sense</span>&nbsp;Of&nbsp;What
            </span>
            <span>
              You’re&nbsp;<span className="lime">Signing</span>
            </span>
          </h1>

          {/* Desktop subtext */}
          <p className="subtext hide-on-mobile">
            Free contract reviewing and no need at all for any account creation or sign up.
          </p>

          {/* Mobile subtext */}
          <p className="subtext show-on-mobile">
            Free contract reviewing and no need for<br />
            an account creation or sign up.
          </p>
        </div>

        <div className="cta-wrapper">
          {/* Main CTA button - only visible when role picker is hidden */}
          {!showRolePicker && (
            <button onClick={onCTA} className="cta-btn animated-arrow-bttn">
              Review A Contract
              <span className="animated-arrow diag" aria-hidden="true">↗</span>
            </button>
          )}
        </div>

        {/* Role picker - shown only after file selection */}
        <div className="role-picker" hidden={!showRolePicker}>
          <span className="role-title">You are:</span>
          <div className="role-buttons">
            <button
              type="button"
              className={`role-btn ${selectedRole === 'signer' ? 'active' : ''}`}
              onClick={() => onRoleSelect('signer')}
            >
              The Signer
            </button>
            <button
              type="button"
              className={`role-btn ${selectedRole === 'writer' ? 'active' : ''}`}
              onClick={() => onRoleSelect('writer')}
            >
              The Writer
            </button>
          </div>
        </div>

        {/* Mobile-only YouTube embed */}
        <div className="yt-wrap show-on-mobile">
          <div className="yt-box">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
              title="SignSense demo video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,image/*"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={onFileChange}
        />
      </section>
    </div>
  );
};

export default Hero;

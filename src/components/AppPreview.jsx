// src/components/AppPreview.jsx
import React, { useRef, useEffect } from 'react';

const AppPreview = () => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (wrapperRef.current) {
        // When scrolled more than 50px → flat (0deg), otherwise tilted (12deg)
        wrapperRef.current.style.transform =
          scrollY > 50 ? 'rotateX(0deg)' : 'rotateX(12deg)';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial check on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="app-container">
      <div className="app-wrapper" ref={wrapperRef}>
        <div className="app-frame">
          {/* Glint animation - pure CSS */}
          <div className="glint-line" aria-hidden="true"></div>

          <img
            className="app-preview"
            src="https://i.imgur.com/slsiM6i.png"
            alt="SignSense app preview showing contract analysis interface"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default AppPreview;
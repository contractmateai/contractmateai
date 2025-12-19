// src/components/LogoStrip.jsx
import React, { useRef, useEffect } from 'react';

const LogoStrip = () => {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const LOGO_SRC = 'https://i.imgur.com/2SUo8mv.png';
    const COPIES = 12; // Number of logo repeats for smooth infinite scroll

    // Populate the track with logos
    const populateLogos = () => {
      track.innerHTML = ''; // Clear any existing
      for (let i = 0; i < COPIES; i++) {
        const img = document.createElement('img');
        img.src = LOGO_SRC;
        img.alt = 'Powered by logos';
        img.className = 'logo-piece';
        img.loading = 'lazy';
        img.decoding = 'async';
        track.appendChild(img);
      }
    };

    populateLogos();

    let x = 0;
    let pieceWidth = 0;
    let lastTime = performance.now();
    let animationFrameId = null;

    const SECONDS_PER_FULL_LOOP = 150; // Matches original smooth speed

    // Measure the width of one logo piece
    const measurePieceWidth = () => {
      const firstLogo = track.querySelector('.logo-piece');
      if (firstLogo && firstLogo.complete) {
        pieceWidth = firstLogo.getBoundingClientRect().width;
      } else {
        // Fallback: wait for images to load
        setTimeout(measurePieceWidth, 100);
      }
    };

    const tick = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000; // in seconds
      lastTime = currentTime;

      if (pieceWidth > 0) {
        const pxPerSecond = (pieceWidth * COPIES) / SECONDS_PER_FULL_LOOP;
        x -= pxPerSecond * deltaTime;

        const fullLoopDistance = pieceWidth * COPIES;
        if (x <= -fullLoopDistance) {
          x += fullLoopDistance;
        }

        track.style.transform = `translateX(${x}px)`;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    // Start measuring and animation
    measurePieceWidth();
    animationFrameId = requestAnimationFrame(tick);

    // Handle resize
    const handleResize = () => {
      measurePieceWidth();
      x = 0; // Reset position on resize for clean restart
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup on unmount
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="logo-strip">
      <div className="logo-track" ref={trackRef}></div>
      <div className="logo-fade left"></div>
      <div className="logo-fade right"></div>
    </section>
  );
};

export default LogoStrip;

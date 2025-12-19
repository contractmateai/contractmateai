// src/components/Topbar.jsx
import React, { forwardRef, useState, useEffect } from 'react';

const Topbar = forwardRef(({ menuOpen, setMenuOpen }, ref) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 80) {
        setHide(true);
      } else {
        setHide(false);
      }
      lastY = y <= 0 ? 0 : y;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`topbar-wrap ${hide ? 'hide' : ''}`} ref={ref}>
      <div className={`topbar ${menuOpen ? 'merged' : ''}`}>
        <div className="topbar-left">
          <a href="index.html">
            <img
              className="topbar-logo"
              src="https://imgur.com/t8UWYN3.png"
              alt="SignSense logo"
            />
          </a>
          <a href="index.html" className="topbar-brand">
            SignSense
          </a>
        </div>

        <nav className="topbar-nav">
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            See How It Works
          </a>
          <a href="index.html">Home</a>
          <a href="contact.html">Contact</a>
        </nav>

        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className="bar b1"></span>
          <span className="bar b2"></span>
          <span className="bar b3"></span>
        </button>
      </div>
    </div>
  );
});

Topbar.displayName = 'Topbar'; // Helpful for debugging in React DevTools

export default Topbar;

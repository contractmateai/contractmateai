import React, { useState } from 'react';
import '../styles/CookieConsent.css';

const COOKIE_POLICY_URL = '/cookies.html';

export default function CookieConsent() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  const handleAccept = () => {
    setFading(true);
    setTimeout(() => setVisible(false), 300);
  };

  const handleReject = () => {
    setFading(true);
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return (
    <div className={`cookie-consent-box${fading ? ' fade-out' : ''}`}> 
      <button className="cookie-close" onClick={handleReject} aria-label="Close">×</button>
      <p>
        We use cookies to personalize content, improve performance, and better understand how visitors interact with our website.<br/>
        Learn more about how we use cookies in our{' '}
        <a
          href={COOKIE_POLICY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="cookie-link"
        >
          Cookie Policy.
        </a>
      </p>
      <div className="cookie-buttons">
        <button className="cookie-btn reject" onClick={handleReject}>Reject all</button>
        <button className="cookie-btn accept" onClick={handleAccept}>Accept all</button>
      </div>
    </div>
  );
}
}

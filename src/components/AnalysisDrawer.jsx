import React from "react";

const AnalysisDrawer = ({ open, onClose }) => (
  <>
    <div id="scrim" className={`scrim${open ? ' show' : ''}`} aria-hidden={!open} onClick={onClose}></div>
    <aside id="drawer" className={`drawer${open ? ' open' : ''}`} aria-label="Menu" aria-hidden={!open}>
      <div className="brand-row">
        <a href="/" aria-label="Go to homepage">
          <img src="https://imgur.com/Z5hv7K9.png" alt="SignSense logo" />
          <span>SignSense</span>
        </a>
      </div>
      <nav className="nav">
        <a className="active" href="#"><img className="arr" src="https://imgur.com/CHGomYz.png" alt="" /><img className="icon" src="https://imgur.com/lnQTDuo.png" alt="" /><span>Overview</span></a>
        <a href="/"><img className="arr" src="https://imgur.com/xhkeG0y.png" alt="" /><img className="icon" src="https://imgur.com/kE3okdE.png" alt="" /><span>Home</span></a>
        <a href="/privacy"><img className="arr" src="https://imgur.com/xhkeG0y.png" alt="" /><img className="icon" src="https://imgur.com/krMnFVT.png" alt="" /><span>Privacy</span></a>
        <a href="/contact"><img className="arr" src="https://imgur.com/xhkeG0y.png" alt="" /><img className="icon" src="https://imgur.com/6zHviT6.png" alt="" /><span>Contact Us</span></a>
        <a href="https://tally.so/r/3EGJpA" target="_blank" rel="noopener" id="leaveReview"><img className="arr" src="https://imgur.com/xhkeG0y.png" alt="" /><img className="icon" src="https://imgur.com/zwr9SOe.png" alt="" /><span>Add a Review</span></a>
      </nav>
      <div className="push"></div>
      <div className="end">
        <div>All rights reserved.</div>
        <div>© 2025 SignSense</div>
        <div className="footer-sep"></div>
        <div>Not legal advice.<br />For informational use only.</div>
      </div>
    </aside>
  </>
);

export default AnalysisDrawer;

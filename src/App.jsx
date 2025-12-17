import React, { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AppPreview from './components/AppPreview';
import LogoStrip from './components/LogoStrip';
import InstantClarity from './components/InstantClarity';
import InsightSection from './components/InsightSection';
import ScrollingFeatures from './components/ScrollingFeatures';
import ReviewsSection from './components/ReviewsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import MobileFooter from './components/MobileFooter';

function App() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [showRolePicker, setShowRolePicker] = useState(false);

  useEffect(() => {
    // Particles
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none -z-10';
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = `${Math.random() * 1600}px`;
      p.style.width = p.style.height = `${1 + Math.random() * 2.5}px`;
      p.style.animationDuration = `${25 + Math.random() * 15}s`;
      container.appendChild(p);
    }
  }, []);

  const handleReviewClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    if (e.target.files.length) {
      setFiles(Array.from(e.target.files));
      setShowRolePicker(true);
    }
  };

  return (
    <>
      <Header />
      <Hero onReviewClick={handleReviewClick} showRolePicker={showRolePicker} files={files} />
      <AppPreview />
      <LogoStrip />
      <InstantClarity />
      <InsightSection />
      <ScrollingFeatures />
      <ReviewsSection />
      <FAQSection />
      <Footer />
      <MobileFooter />

      <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,image/*" className="hidden" onChange={handleFileChange} />
    </>
  );
}

export default App;
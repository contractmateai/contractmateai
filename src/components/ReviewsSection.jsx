// src/components/ReviewsSection.jsx
import React, { useState, useEffect, useRef } from 'react';

const reviewsData = [
  "https://i.imgur.com/jX2IqjQ.png",
  "https://i.imgur.com/k42nv4C.png",
  "https://i.imgur.com/6M6XO2l.png",
  "https://i.imgur.com/YMDEKZm.png",
  "https://i.imgur.com/I9iQu88.png",
];

const ReviewsSection = () => {
  const [perPage, setPerPage] = useState(3);
  const [baseIndex, setBaseIndex] = useState(reviewsData.length); // Start at first duplicated set
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const dotsRef = useRef(null);

  let itemWidth = 0; // Width of one card + gap

  // Measure item width (card + gap)
  const measureItemWidth = () => {
    if (!trackRef.current) return;
    const card = trackRef.current.querySelector('.review-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(trackRef.current).gap || '24');
    itemWidth = card.getBoundingClientRect().width + gap;
  };

  // Apply transform
  const applyTransform = (index, animate = true) => {
    if (!trackRef.current) return;
    trackRef.current.style.transition = animate ? 'transform 0.35s ease' : 'none';
    trackRef.current.style.transform = `translateX(${-index * itemWidth}px)`;
  };

  // Update active dots
  const updateDots = () => {
    if (!dotsRef.current) return;
    const dots = dotsRef.current.querySelectorAll('.review-dot');
    const currentStart = baseIndex % reviewsData.length;
    dots.forEach((dot, i) => {
      const relativePos = (i - currentStart + reviewsData.length) % reviewsData.length;
      dot.classList.toggle('active', relativePos < perPage);
    });
  };

  // Responsive per-page calculation
  useEffect(() => {
    const updatePerPage = () => {
      const width = window.innerWidth;
      setPerPage(width <= 640 ? 1 : width <= 1100 ? 2 : 3);
    };
    updatePerPage();
    window.addEventListener('resize', updatePerPage);
    return () => window.removeEventListener('resize', updatePerPage);
  }, []);

  // Initial setup: populate cards, dots, measure, start autoplay
  useEffect(() => {
    if (!trackRef.current || !dotsRef.current) return;

    // Clear and populate track with 3 full sets for seamless looping
    trackRef.current.innerHTML = '';
    for (let set = 0; set < 3; set++) {
      reviewsData.forEach((src, idx) => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `<img src="${src}" alt="User review ${idx + 1}" loading="lazy" />`;
        trackRef.current.appendChild(card);
      });
    }

    // Create dots
    dotsRef.current.innerHTML = '';
    reviewsData.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'review-dot';
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => {
        const current = baseIndex % reviewsData.length;
        let delta = i - current;
        // Shortest path
        if (Math.abs(delta) > reviewsData.length / 2) {
          delta += delta > 0 ? -reviewsData.length : reviewsData.length;
        }
        setBaseIndex(prev => prev + delta);
      });
      dotsRef.current.appendChild(dot);
    });

    measureItemWidth();
    applyTransform(baseIndex, false);
    updateDots();

    // Auto-advance every 5 seconds
    const interval = setInterval(() => {
      setBaseIndex(prev => prev + perPage);
    }, 5000);

    // Handle resize
    const handleResize = () => {
      measureItemWidth();
      applyTransform(baseIndex, false);
      updateDots();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [perPage]);

  // React to baseIndex changes: animate, recenter, update dots
  useEffect(() => {
    measureItemWidth();
    applyTransform(baseIndex, true);
    updateDots();

    // Seamless loop: recenter without animation after transition
    const totalCards = reviewsData.length;
    if (baseIndex >= 2 * totalCards) {
      setTimeout(() => {
        setBaseIndex(baseIndex - totalCards);
      }, 350);
    } else if (baseIndex < totalCards) {
      setTimeout(() => {
        setBaseIndex(baseIndex + totalCards);
      }, 350);
    }
  }, [baseIndex]);

  // Drag / swipe support
  useEffect(() => {
    if (!viewportRef.current || !trackRef.current) return;

    let isDragging = false;
    let startX = 0;
    let initialTransform = 0;

    const startDrag = (clientX) => {
      isDragging = true;
      startX = clientX;
      initialTransform = -baseIndex * itemWidth;
      viewportRef.current.style.cursor = 'grabbing';
    };

    const drag = (clientX) => {
      if (!isDragging) return;
      const deltaX = clientX - startX;
      trackRef.current.style.transition = 'none';
      trackRef.current.style.transform = `translateX(${initialTransform + deltaX}px)`;
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      viewportRef.current.style.cursor = 'grab';
      trackRef.current.style.transition = 'transform 0.35s ease';

      // Optional: snap to nearest card based on drag distance
      // For now, just keep current position (auto-play will continue)
    };

    // Mouse events
    viewportRef.current.addEventListener('mousedown', (e) => startDrag(e.clientX));
    window.addEventListener('mousemove', (e) => drag(e.clientX));
    window.addEventListener('mouseup', endDrag);

    // Touch events
    viewportRef.current.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
    viewportRef.current.addEventListener('touchmove', (e) => drag(e.touches[0].clientX), { passive: true });
    window.addEventListener('touchend', endDrag);

    return () => {
      // Cleanup listeners if needed
    };
  }, [baseIndex]);

  return (
    <section className="reviews-section" data-aos="fade-up">
      <div className="reviews-header">
        <div className="reviews-title">
          <h2>
            What <span className="green">Our Clients</span> Say
          </h2>
          <div className="reviews-sub">Hear Directly From Our Satisfied Users</div>
        </div>
      </div>

      <div className="reviews-viewport" ref={viewportRef}>
        <div className="reviews-track" ref={trackRef}></div>
      </div>

      <div className="review-dots" ref={dotsRef}></div>

      <div className="leave-review-wrap">
        <a
          href="https://tally.so/r/3EGJpA"
          target="_blank"
          rel="noopener noreferrer"
          className="leave-review animated-arrow-bttn"
        >
          Leave A Review <span className="animated-arrow diag" aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
};

export default ReviewsSection;

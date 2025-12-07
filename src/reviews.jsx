// src/components/Reviews.jsx
import React from "react";

export default function Reviews() {
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

      <div className="reviews-viewport" id="reviewsViewport">
        <div className="reviews-track" id="reviewsTrack">
          <div className="review-card">
            <img src="https://i.imgur.com/jX2IqjQ.png" alt="Review 1" />
          </div>
          <div className="review-card">
            <img src="https://i.imgur.com/k42nv4C.png" alt="Review 2" />
          </div>
          <div className="review-card">
            <img src="https://i.imgur.com/6M6XO2l.png" alt="Review 3" />
          </div>
          <div className="review-card">
            <img src="https://i.imgur.com/YMDEKZm.png" alt="Review 4" />
          </div>
          <div className="review-card">
            <img src="https://i.imgur.com/I9iQu88.png" alt="Review 5" />
          </div>
        </div>
      </div>

      <div className="review-dots" id="reviewDots"></div>

      <div className="leave-review-wrap">
        <a
          className="leave-review animated-arrow-bttn"
          href="https://tally.so/r/3EGJpA"
          target="_blank"
          rel="noopener noreferrer"
        >
          Leave A Review{" "}
          <span className="animated-arrow diag" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>
    </section>
  );
}

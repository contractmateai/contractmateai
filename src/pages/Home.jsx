// contractmateai/src/pages/Home.jsx
import React, { useRef, useState, useEffect, useMemo } from "react";
import CookieConsent from "../components/CookieConsent";

// Feature rows for the homepage ticker
const featuresTop = [
  { icon: "https://imgur.com/dKG0KXh.png", label: "No Signup" },
  { icon: "https://imgur.com/Cbflaz5.png", label: "Secure Processing" },
  { icon: "https://imgur.com/RozMHbN.png", label: "PDF Export" },
  { icon: "https://imgur.com/hDBmbBP.png", label: "Risk Indicator" },
  { icon: "https://imgur.com/SaW85D2.png", label: "Your Data Stays Yours" },
  { icon: "https://imgur.com/dPCWJg7.png", label: "Smart Summary" },
  { icon: "https://imgur.com/Xv2u5Mz.png", label: "Language Detection" },
  { icon: "https://imgur.com/cv1DrX1.png", label: "Key Clauses" },
];
const featuresBottom = [
  { icon: "https://imgur.com/0TgzL8P.png", label: "Legal Insights" },
  { icon: "https://imgur.com/JMV0gKS.png", label: "Suggestions Engine" },
  { icon: "https://imgur.com/MAZkZHs.png", label: "Clause Warnings" },
  { icon: "https://imgur.com/o8K46Sk.png", label: "AI Review" },
  { icon: "https://imgur.com/3PU7xU0.png", label: "No legal jargon" },
  { icon: "https://imgur.com/rlaNjHT.png", label: "Deadline Pressure" },
  { icon: "https://imgur.com/Ie8CwXO.png", label: "Modern Design" },
  { icon: "https://imgur.com/5DGepME.png", label: "Confidence to Sign" },
];

// NOTE: This Home.jsx expects these to be available globally (like you had in HTML):
// - AOS (optional; if you don't use it in React, nothing breaks)
// - pdfjsLib (PDF.js) and mammoth (DOCX)
// PDF.js import (local, not global)
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

export default function Home() {
    // ===== app preview tilt on scroll =====
    useEffect(() => {
      const wrapper = appWrapperRef.current;
      if (!wrapper) return;
      const handleScroll = () => {
        const st = window.scrollY;
        wrapper.style.transform = st > 50 ? "rotateX(0deg)" : "rotateX(12deg)";
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  const topbarWrapRef = useRef(null);
  const topbarRef = useRef(null);
  const menuToggleRef = useRef(null);
  const menuPanelRef = useRef(null);
  const menuOverlayRef = useRef(null);

  const particlesRef = useRef(null);
  const appWrapperRef = useRef(null);

  const logoTrackRef = useRef(null);

  const reviewsViewportRef = useRef(null);
  const reviewsTrackRef = useRef(null);
  const reviewDotsRef = useRef(null);

  const contractFileRef = useRef(null);
  const contractCameraRef = useRef(null);

  const [rolePickerVisible, setRolePickerVisible] = useState(false);
  const [reviewBtnVisible, setReviewBtnVisible] = useState(true);
  const [activeRole, setActiveRole] = useState(null);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressStages = [
    { min: 0, max: 15, label: 'Preparing report' },
    { min: 16, max: 30, label: 'Creating summary' },
    { min: 31, max: 45, label: 'Listing main clauses' },
    { min: 46, max: 60, label: 'Listing potential issues' },
    { min: 61, max: 76, label: 'Preparing suggestions' },
    { min: 77, max: 85, label: 'Finishing up' },
    { min: 86, max: 100, label: 'Final touches' },
  ];
  const getProgressLabel = (pct) => {
    for (const stage of progressStages) {
      if (pct >= stage.min && pct <= stage.max) return stage.label;
    }
    return '';
  };

  // camera bottom sheet (iOS-style overlay)
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetCount, setSheetCount] = useState(1);

  // files
  const pickedFilesRef = useRef([]);
  const cameraResolveRef = useRef(null);

  // ===== helpers =====
  const isMobile = () => window.matchMedia("(max-width: 980px)").matches;

  // ===== stage reveal =====
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("stage1");
    if (reduce) {
      document.body.classList.add("stage2", "stage3");
      return;
    }
    const t1 = setTimeout(() => document.body.classList.add("stage2"), 80);
    const t2 = setTimeout(() => document.body.classList.add("stage3"), 160);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // ===== AOS init (optional) =====
  useEffect(() => {
    try {
      if (window.AOS && typeof window.AOS.init === "function") {
        window.AOS.init({ once: true });
      }
    } catch {
      // ignore
    }
  }, []);



  // ===== particles =====
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    // Only show on desktop (not mobile)
    if (window.matchMedia('(max-width: 980px)').matches) {
      setParticles([]);
      return;
    }
    const num = 50;
    const arr = [];
    for (let i = 0; i < num; i++) {
      const duration = 25 + Math.random() * 15;
      const size = 1 + Math.random() * 2.5;
      arr.push({
        left: Math.random() * window.innerWidth,
        top: Math.random() * 1600,
        width: size,
        height: size,
        animationDuration: duration,
        key: i + '-' + Math.random().toString(36).slice(2)
      });
    }
    setParticles(arr);
  }, []);

  // ===== features ticker (rolling features) =====
  useEffect(() => {
    const topRow = document.getElementById("featuresTopRow");
    const bottomRow = document.getElementById("featuresBottomRow");
    if (!topRow || !bottomRow) return;

    // Helper to populate a row with features, duplicated for seamless scroll
    const populateRow = (row, features) => {
      if (!row) return;
      row.innerHTML = "";
      const makeSet = () => {
        const frag = document.createDocumentFragment();
        features.forEach((f) => {
          const el = document.createElement("div");
          el.className = "scroll-item";
          el.innerHTML = `<img src="${f.icon}" alt="" loading="lazy"><span>${f.label}</span>`;
          frag.appendChild(el);
        });
        return frag;
      };
      row.appendChild(makeSet());
      row.appendChild(makeSet());
    };
    populateRow(topRow, featuresTop);
    populateRow(bottomRow, featuresBottom);

    // Ticker animation
    const makeTicker = (row, { pxPerSecond = 36, direction = "left" } = {}) => {
      const speed = direction === "left" ? -pxPerSecond : pxPerSecond;
      let x = 0;
      let w = 0;
      let raf = 0;
      let last = performance.now();
      const measure = () => {
        w = row.scrollWidth / 2;
        if (!w) setTimeout(measure, 60);
      };
      const tick = (now) => {
        const dt = (now - last) / 1000;
        last = now;
        x += speed * dt;
        if (x <= -w) x += w;
        if (x > 0) x -= w;
        row.style.transform = `translateX(${x}px)`;
        raf = requestAnimationFrame(tick);
      };
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      const start = () => {
        if (media.matches) {
          row.style.transform = "none";
          return;
        }
        measure();
        last = performance.now();
        raf = requestAnimationFrame(tick);
      };
      const stop = () => { if (raf) cancelAnimationFrame(raf); };
      const onResize = () => measure();
      window.addEventListener("resize", onResize, { passive: true });
      media.addEventListener?.("change", () => { stop(); start(); });
      start();
      return () => { stop(); window.removeEventListener("resize", onResize); };
    };
    const cleanTop = makeTicker(topRow, { pxPerSecond: 36, direction: "right" });
    const cleanBot = makeTicker(bottomRow, { pxPerSecond: 36, direction: "left" });
    return () => { cleanTop?.(); cleanBot?.(); };
  }, []);

  // ===== logo strip ticker =====
  useEffect(() => {
    const track = logoTrackRef.current;
    if (!track) return;

    track.innerHTML = "";
    const src = "https://i.imgur.com/2SUo8mv.png";
    const COPIES = 12;

    for (let i = 0; i < COPIES; i++) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Powered-by logos";
      img.className = "logo-piece";
      img.decoding = "async";
      track.appendChild(img);
    }

    const SECONDS_PER_LOOP = 150;
    let x = 0;
    let pieceW = 0;
    let raf = 0;
    let last = performance.now();

    const measure = () => {
      const first = track.querySelector(".logo-piece");
      if (!first || !first.complete) {
        setTimeout(measure, 50);
        return;
      }
      pieceW = first.getBoundingClientRect().width || first.naturalWidth;
    };

    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      const pxPerSecond = (pieceW * COPIES) / SECONDS_PER_LOOP;
      x -= pxPerSecond * dt;
      const loop = pieceW * COPIES;
      if (x <= -loop) x += loop;
      track.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => measure();

    measure();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ===== topbar hide on scroll =====
  useEffect(() => {
    const bar = topbarWrapRef.current;
    if (!bar) return;

    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 80) bar.classList.add("hide");
      else bar.classList.remove("hide");
      lastY = y <= 0 ? 0 : y;
      ticking = false;
    };

    const onScrollEvt = () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScrollEvt, { passive: true });
    return () => window.removeEventListener("scroll", onScrollEvt);
  }, []);

  // ===== mobile menu =====
  useEffect(() => {
    const topbar = topbarRef.current;
    const menuToggle = menuToggleRef.current;
    const menuPanel = menuPanelRef.current;
    const menuOverlay = menuOverlayRef.current;
    if (!topbar || !menuToggle || !menuPanel || !menuOverlay) return;

    const positionPanel = () => {
      const r = topbar.getBoundingClientRect();
      menuPanel.style.top = `${r.top + r.height + 0}px`;
    };

    const openMenu = () => {
      positionPanel();
      menuPanel.classList.add("open");
      menuOverlay.classList.add("show");
      menuToggle.classList.add("open");
      topbar.classList.add("merged");
      menuPanel.setAttribute("aria-hidden", "false");
    };

    const closeMenu = () => {
      menuPanel.classList.remove("open");
      menuOverlay.classList.remove("show");
      menuToggle.classList.remove("open");
      topbar.classList.remove("merged");
      menuPanel.setAttribute("aria-hidden", "true");
    };

    const onToggle = () => {
      if (menuPanel.classList.contains("open")) closeMenu();
      else openMenu();
    };

    positionPanel();
    window.addEventListener("resize", positionPanel);
    menuToggle.addEventListener("click", onToggle);
    menuOverlay.addEventListener("click", closeMenu);

    const onKey = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);

    const onScroll = () => {
      if (menuPanel.classList.contains("open")) closeMenu();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", positionPanel);
      menuToggle.removeEventListener("click", onToggle);
      menuOverlay.removeEventListener("click", closeMenu);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // ===== reviews carousel + dots + autoplay (same logic) =====
  useEffect(() => {
    const track = reviewsTrackRef.current;
    const dotsEl = reviewDotsRef.current;
    const viewport = reviewsViewportRef.current;
    if (!track || !dotsEl || !viewport) return;

    const originals = Array.from(track.children);
    const TOTAL = originals.length;

    // triple clone
    track.innerHTML = "";
    for (let k = 0; k < 3; k++) originals.forEach((n) => track.appendChild(n.cloneNode(true)));

    let perPage = 3;
    const computePerPage = () => {
      const w = window.innerWidth;
      perPage = w <= 640 ? 1 : w <= 1100 ? 2 : 3;
    };
    computePerPage();

    let itemW = 0;
    const measure = () => {
      const c = track.querySelector(".review-card");
      const gap = parseFloat(getComputedStyle(track).gap || 24);
      itemW = (c ? c.getBoundingClientRect().width : 0) + gap;
    };
    measure();

    let baseIndex = TOTAL;
    const setTransform = (i, animate) => {
      if (!animate) track.style.transition = "none";
      track.style.transform = `translateX(${-i * itemW}px)`;
      if (!animate) {
        track.offsetHeight;
        track.style.transition = "transform .35s ease";
      }
    };
    setTransform(baseIndex, false);

    const mod = (n, m) => ((n % m) + m) % m;
    const groupStarts = [0, 2];
    const toggleMode = () => perPage === 3 && TOTAL === 5;

    const currentGroup = () => {
      const p = mod(baseIndex, TOTAL);
      return p === groupStarts[1] ? 1 : 0;
    };

    const updateDots = () => {
      const children = [...dotsEl.children];
      if (toggleMode()) {
        const g = currentGroup();
        const active = g === 0 ? new Set([0, 1, 2]) : new Set([2, 3, 4]);
        children.forEach((d, i) => d.classList.toggle("active", active.has(i)));
      } else {
        const start = mod(baseIndex, TOTAL);
        children.forEach((d, i) => {
          const k = (i - start + TOTAL) % TOTAL;
          d.classList.toggle("active", k < perPage);
        });
      }
    };

    const renderDots = () => {
      dotsEl.innerHTML = "";
      for (let i = 0; i < TOTAL; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "review-dot";
        b.addEventListener("click", () => {
          if (toggleMode()) {
            const g = i < 2 ? 0 : i > 2 ? 1 : currentGroup() === 0 ? 0 : 1;
            goGroup(g);
          } else {
            goToStart(i);
          }
          restartAutoplay();
        });
        dotsEl.appendChild(b);
      }
      updateDots();
    };

    const recenterIfNeeded = () => {
      if (baseIndex >= 2 * TOTAL) {
        baseIndex -= TOTAL;
        setTransform(baseIndex, false);
      } else if (baseIndex < TOTAL) {
        baseIndex += TOTAL;
        setTransform(baseIndex, false);
      }
    };

    const goDelta = (delta) => {
      baseIndex += delta;
      setTransform(baseIndex, true);
      track.addEventListener(
        "transitionend",
        () => {
          recenterIfNeeded();
          updateDots();
        },
        { once: true }
      );
    };

    const goGroup = (g) => {
      const p = mod(baseIndex, TOTAL);
      if (g === 0) {
        if (p === groupStarts[0]) return;
        goDelta(3);
      } else {
        if (p === groupStarts[1]) return;
        goDelta(2);
      }
    };

    const goPrevGroup = () => {
      const p = mod(baseIndex, TOTAL);
      baseIndex += p === groupStarts[0] ? -3 : -2;
      setTransform(baseIndex, true);
      track.addEventListener(
        "transitionend",
        () => {
          recenterIfNeeded();
          updateDots();
        },
        { once: true }
      );
    };

    const goToStart = (dotIdx) => {
      const p = mod(baseIndex, TOTAL);
      baseIndex = baseIndex + ((dotIdx - p + TOTAL) % TOTAL);
      setTransform(baseIndex, true);
      track.addEventListener(
        "transitionend",
        () => {
          recenterIfNeeded();
          updateDots();
        },
        { once: true }
      );
    };

    let timer = null;
    const startAutoplay = () => {
      stopAutoplay();
      timer = setInterval(() => {
        if (toggleMode()) goGroup(currentGroup() === 0 ? 1 : 0);
        else goDelta(perPage);
      }, 5000);
    };
    const stopAutoplay = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    const snap = () => {
      setTransform(baseIndex, false);
      updateDots();
    };

    const onResize = () => {
      computePerPage();
      measure();
      snap();
    };

    // drag/swipe smoother
    viewport.style.cursor = "grab";
    let isDown = false;
    let startX = 0;
    let startTx = 0;
    let moved = false;

    const getTx = () => {
      const m = getComputedStyle(track).transform;
      if (m && m !== "none") {
        const p = m.replace("matrix(", "").replace(")", "").split(",");
        return parseFloat(p[4] || 0);
      }
      return 0;
    };

    const setTx = (x) => {
      track.style.transition = "none";
      track.style.transform = `translateX(${x}px)`;
    };

    const endDrag = () => {
      isDown = false;
      viewport.style.cursor = "grab";
      track.offsetHeight;
      track.style.transition = "transform .35s ease";
      setTimeout(() => (moved = false), 0);
    };

    const startDrag = (clientX) => {
      isDown = true;
      moved = false;
      startX = clientX;
      startTx = getTx();
      viewport.style.cursor = "grabbing";
    };

    const moveDrag = (clientX) => {
      if (!isDown) return;
      const dx = clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      setTx(startTx + dx);
    };

    const onMouseDown = (e) => {
      e.preventDefault();
      startDrag(e.clientX);
    };

    const onMouseMove = (e) => moveDrag(e.clientX);
    const onMouseUp = () => endDrag();

    const onTouchStart = (e) => startDrag(e.touches[0].clientX);
    const onTouchMove = (e) => moveDrag(e.touches[0].clientX);
    const onTouchEnd = () => endDrag();

    const onClickCapture = (e) => {
      if (moved) e.preventDefault();
    };

    renderDots();
    startAutoplay();

    window.addEventListener("resize", onResize, { passive: true });

    viewport.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseup", onMouseUp);

    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    viewport.addEventListener("click", onClickCapture, true);

    return () => {
      stopAutoplay();
      window.removeEventListener("resize", onResize);

      viewport.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      viewport.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  // ===== FAQ accordion =====
  const onFaqClick = (e) => {
    const btn = e.currentTarget;
    const item = btn.parentElement;
    if (!item.classList.contains("open")) {
      document.querySelectorAll(".faq-item.open").forEach((i) => i.classList.remove("open"));
    }
    item.classList.toggle("open");
  };

  // ===== file to payload (same logic) =====
  const fileToPayload = async (file) => {
    try {
      const name = file.name || "file";
      const mime = file.type || "application/octet-stream";
      const ext = name.toLowerCase();

      if (mime === "text/plain" || ext.endsWith(".txt")) {
        return { text: await file.text(), originalName: name, mime };
      }

      if (mime === "application/pdf" || ext.endsWith(".pdf")) {
        const buf = await file.arrayBuffer();

        // Use imported pdfjsLib directly

        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        let full = "";
        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const content = await page.getTextContent();
          full += content.items.map((i) => i.str).join(" ") + "\n";
        }
        return { text: full, originalName: name, mime };
      }

      if (
        mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        ext.endsWith(".docx")
      ) {
        const mammoth = window.mammoth;
        if (!mammoth) throw new Error("mammoth not found. Include Mammoth.js in your app.");
        const buf = await file.arrayBuffer();
        const res = await mammoth.extractRawText({ arrayBuffer: buf });
        return { text: res.value || "", originalName: name, mime };
      }

      if (mime.startsWith("image/") || /\.(png|jpe?g|webp)$/i.test(ext)) {
        const dataUrl = await new Promise((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.readAsDataURL(file);
        });
        return { imageDataURI: dataUrl, originalName: name, mime };
      }

      throw new Error("Unsupported file type: " + mime);
    } catch (e) {
      console.error("fileToPayload error:", e.message);
      throw e;
    }
  };

  // ===== camera flow =====
  const showSheet = (count) => {
    setSheetCount(count);
    setSheetVisible(true);
  };
  const hideSheet = () => setSheetVisible(false);

  const handleCameraFlow = async () => {
    let count = pickedFilesRef.current.length;

    while (count < 10) {
      if (count > 0) {
        const more = await new Promise((resolve) => {
          cameraResolveRef.current = resolve;
          showSheet(count);
        });
        if (!more) break;
      }

      const inputCamera = contractCameraRef.current;
      if (!inputCamera) break;

      inputCamera.value = "";
      inputCamera.click();

      const newPhoto = await new Promise((resolve) => {
        inputCamera.onchange = () => resolve(inputCamera.files?.[0] || null);
      });

      if (!newPhoto) break;
      pickedFilesRef.current.push(newPhoto);
      count++;
    }

    if (pickedFilesRef.current.length) {
      setReviewBtnVisible(false);
      setRolePickerVisible(true);
    }
  };

  // expose for your older logic (kept)
  useEffect(() => {
    window.handleCameraFlow = handleCameraFlow;
    return () => {
      try {
        delete window.handleCameraFlow;
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== CTA click =====
  const onReviewClick = (e) => {
    e.preventDefault();
    pickedFilesRef.current = [];

    const input = contractFileRef.current;
    if (!input) return;
    input.value = "";
    input.click();
  };

  // ===== file input change =====
  const onContractFileChange = () => {
    const input = contractFileRef.current;
    if (!input || !input.files || !input.files.length) return;

    pickedFilesRef.current = Array.from(input.files).slice(0, 10);

    // NOW hide button, show role picker
    setReviewBtnVisible(false);
    setRolePickerVisible(true);
  };

  // ===== camera input change =====
  const onContractCameraChange = () => {
    const inputCamera = contractCameraRef.current;
    if (!inputCamera || !inputCamera.files || !inputCamera.files.length) return;

    pickedFilesRef.current = Array.from(inputCamera.files);

    const first = inputCamera.files[0];
    const usedCamera = inputCamera.files.length === 1 && first.type.startsWith("image/");

    if (usedCamera) {
      setTimeout(() => {
        handleCameraFlow();
      }, 200);
      return;
    }

    setReviewBtnVisible(false);
    setRolePickerVisible(true);
  };

  // ===== role click -> analyze =====
  const onRolePick = async (role) => {
    setActiveRole(role);
    setRolePickerVisible(false);
    setShowProgressBar(true);
    setProgress(0);

    // Progress bar logic: fill up to 90% over 8 seconds, then wait for API
    let pct = 0;
    let interval;
    let done = false;
    const fillTo = 90;
    const fillDuration = 8000; // ms
    const fillStep = fillTo / (fillDuration / 100);
    function tick() {
      if (done) return;
      pct += fillStep;
      if (pct > fillTo) pct = fillTo;
      setProgress(Math.round(pct));
      if (pct < fillTo) {
        interval = setTimeout(tick, 100);
      }
    }
    tick();

    // Start API call in parallel
    let apiError = null;
    let analysisResult = null;
    try {
      if (!pickedFilesRef.current.length) {
        throw new Error("Please choose a contract file first.");
      }
      const file = pickedFilesRef.current[0];
      if (file.size > 10_000_000) {
        throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
      }
      const payloadArr = await Promise.all(pickedFilesRef.current.map(fileToPayload));
      const body = {
        ...payloadArr[0],
        role: role || "signer",
      };
      const resp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err?.error || "Analysis failed");
      }
      analysisResult = await resp.json();
    } catch (e) {
      apiError = e;
    }
    done = true;
    clearTimeout(interval);
    // Fill to 100% over 1s
    let finishPct = pct;
    const finishStep = (100 - finishPct) / 10;
    let finishCount = 0;
    function finishTick() {
      finishPct += finishStep;
      if (finishPct > 100) finishPct = 100;
      setProgress(Math.round(finishPct));
      finishCount++;
      if (finishCount < 10) {
        setTimeout(finishTick, 100);
      } else {
        setTimeout(() => {
          if (apiError) {
            alert(`Error processing file: ${apiError.message}`);
            setShowProgressBar(false);
            setRolePickerVisible(true);
            return;
          }
          localStorage.setItem("analysisRaw", JSON.stringify(analysisResult));
          window.location.href = "/analysis";
        }, 400);
      }
    }
    finishTick();
  };

  // ===== sheet buttons =====
  const onSheetAddMore = () => {
    hideSheet();
    if (cameraResolveRef.current) cameraResolveRef.current(true);
  };
  const onSheetContinue = () => {
    hideSheet();
    if (cameraResolveRef.current) cameraResolveRef.current(false);
  };

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar-wrap" id="topbarWrap" ref={topbarWrapRef}>
        <div className="topbar" id="topbar" ref={topbarRef}>
          <div className="topbar-left">
            <a href="index.html">
              <img className="topbar-logo" src="https://imgur.com/t8UWYN3.png" alt="SignSense logo" />
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
            <a href="/contact">Contact</a>
          </nav>

          <button className="menu-toggle" id="menuToggle" aria-label="Menu" ref={menuToggleRef}>
            <span className="bar b1"></span>
            <span className="bar b2"></span>
            <span className="bar b3"></span>
          </button>
        </div>
      </div>

      <div className="menu-overlay" id="menuOverlay" ref={menuOverlayRef}></div>

      <div className="menu-panel" id="menuPanel" aria-hidden="true" ref={menuPanelRef}>
        <nav className="menu-list">
          <a className="menu-item" href="https://youtube.com" target="_blank" rel="noopener">
            See How It Works <span className="chev">›</span>
          </a>
          <a className="menu-item" href="index.html">
            Home <span className="chev">›</span>
          </a>
          <a className="menu-item" href="/contact">
            Contact <span className="chev">›</span>
          </a>
        </nav>
        <div className="menu-disclaimer">
          <div>Not legal advice.</div>
          <div>© 2025 SignSense. All rights reserved.</div>
        </div>
      </div>

      {/* PARTICLES */}
      <div className="particle-container" id="particles" ref={particlesRef}>
        {particles.map((p) => (
          <div
            className="particle"
            key={p.key}
            style={{
              left: p.left,
              top: p.top,
              width: p.width,
              height: p.height,
              animationDuration: `${p.animationDuration}s`,
            }}
          />
        ))}
      </div>

      <div className="hero-wrapper">
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

            {/* DESKTOP */}
            <p className="subtext hide-on-mobile">
              Free contract reviewing and no need at all for any account creation or sign up.
            </p>

            {/* MOBILE */}
            <p className="subtext show-on-mobile">
              Free contract reviewing and no need for
              <br />
              an account creation or sign up.
            </p>
          </div>

          <div id="ctaWrap" className="cta-wrapper">
            {reviewBtnVisible && (
              <button id="reviewBtn" className="cta-btn animated-arrow-bttn" onClick={onReviewClick}>
                Review A Contract{" "}
                <span className="animated-arrow diag" aria-hidden="true">
                  ↗
                </span>
              </button>
            )}
          </div>

          {/* Role Picker or Progress Bar */}
          {!showProgressBar && (
            <div id="rolePicker" className="role-picker" hidden={!rolePickerVisible}>
              <span className="role-title">You are:</span>
              <div className="role-buttons">
                <button
                  type="button"
                  className={`role-btn ${activeRole === "signer" ? "active" : ""}`}
                  data-role="signer"
                  onClick={() => onRolePick("signer")}
                >
                  The Signer
                </button>
                <button
                  type="button"
                  className={`role-btn ${activeRole === "writer" ? "active" : ""}`}
                  data-role="writer"
                  onClick={() => onRolePick("writer")}
                >
                  The Writer
                </button>
              </div>
            </div>
          )}
          {showProgressBar && (
            <div className="progress-bar-wrap" style={{ width: 340, margin: '32px auto 0', textAlign: 'center' }}>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: 600, marginBottom: 10 }}>{progress}% complete</div>
              <div style={{ background: '#23304a', borderRadius: 8, height: 6, width: '100%', overflow: 'hidden', marginBottom: 14 }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #5ecfff 60%, #3b82f6 100%)', transition: 'width 0.3s' }}></div>
              </div>
              <div style={{ color: '#b6c6e3', fontSize: 16, fontWeight: 500 }}>{getProgressLabel(progress)}</div>
            </div>
          )}

          {/* MOBILE-ONLY YT */}
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

        {/* APP PREVIEW */}
        <div className="app-container">
          <div className="app-wrapper" id="appWrapper" ref={appWrapperRef}>
            <div className="app-frame">
              <div className="glint-line" aria-hidden="true"></div>
              <img className="app-preview" src="https://i.imgur.com/slsiM6i.png" alt="App Preview" />
            </div>
          </div>
        </div>
      </div>

      {/* LOGO STRIP */}
      <section className="logo-strip">
        <div className="logo-track" id="logoTrack" ref={logoTrackRef}></div>
        <div className="logo-fade left"></div>
        <div className="logo-fade right"></div>
      </section>

      {/* SECTION BADGE + TITLES */}
      <div style={{ textAlign: "center", marginTop: 80, marginBottom: 24 }}>
        <div className="section-badge animated-arrow-bttn">
          Instant Clarity Engine{" "}
          <span className="animated-arrow diag" aria-hidden="true">
            ↗
          </span>
        </div>
      </div>

      {/* DESKTOP */}
      <h2 className="section-title hide-on-mobile">
        Smarter Reviews,
        <br />
        Faster Decisions
      </h2>

      <p className="section-sub hide-on-mobile">
        AI highlights key clauses, risks, and red flags
        <br />
        so you can sign smarter and with confidence.
      </p>

      {/* MOBILE */}
      <h2 className="section-title show-on-mobile">
        <span className="nowrap">Way Smarter Reviews</span>
        <br />
        <span className="nowrap">
          <span className="lime">Faster&nbsp;Decisions</span>
        </span>
      </h2>

      <p className="section-sub show-on-mobile">
        <span className="nowrap">AI highlights, key clauses, risks</span>
        <br />
        <span className="nowrap">red&nbsp;flags so you can sign smarter</span>
      </p>

      {/* INSIGHTS */}
      <section className="insight-section" data-aos="fade-up">
        <div className="insight-content">
          <div className="insight-left moving-line-wrapper">
            <span className="yellow-line" id="yellowLine"></span>
            <div className="moving-line-content">
              <img src="https://i.imgur.com/a6QxhzQ.png" alt="Insights UI" />
            </div>
          </div>

          <div className="insight-right hide-on-mobile">
            <div className="insight-icon-row">
              <img className="circle-icon" src="https://i.imgur.com/VVGvghi.png" alt="AI icon" loading="lazy" />
              <img className="circle-icon" src="https://i.imgur.com/woCjWUt.png" alt="Speed icon" loading="lazy" />
              <img className="circle-icon" src="https://i.imgur.com/0IzXvgs.png" alt="Shield/Secure icon" loading="lazy" />
            </div>
            <h2>
              Understand Your Contract <br />
              <span>Instantly with AI</span>
            </h2>
            <p>Reveal hidden risks and key terms so you can review contracts clearly, quickly, and without confusion.</p>
            <a
              id="insightReviewBtn"
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-outline animated-arrow-bttn"
            >
              Learn More{" "}
              <span className="animated-arrow diag" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SCROLL */}
      <div className="scroll-full">
        <div className="scroll-wrapper">
          <section className="scroll-section" data-aos="fade-up">
            <h3>Everything you need for clarity &amp; security in one seamless experience.</h3>
            <div className="scroll-strip top-row" id="featuresTopRow"></div>
            <div className="scroll-strip bottom-row" id="featuresBottomRow"></div>
            <div className="scroll-shadow-left"></div>
            <div className="scroll-shadow-right"></div>
          </section>
        </div>
      </div>

      {/* WATCH VIDEO (hidden by CSS in your code) */}
      <section className="watch-video-section" data-aos="fade-up">
        <div className="video-content">
          <div className="video-text">
            <h2>
              Take a deeper look to
              <br />
              see how SignSense
              <br />
              really works.
            </h2>
            <p>
              Curious how SignSense works? Watch our video for a clear, step-by-step look at how we simplify your
              contracts
            </p>
            <a
              id="watchBtn"
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="watch-btn animated-arrow-bttn"
            >
              Watch on Channel{" "}
              <span className="animated-arrow diag" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
          <div className="video-box">
            <iframe
              className="video-embed"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
              title="SignSense Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews-section" data-aos="fade-up">
        <div className="reviews-header">
          <div className="reviews-title">
            <h2>
              What <span className="green">Our Clients</span> Say
            </h2>
            <div className="reviews-sub">Hear Directly From Our Satisfied Users</div>
          </div>
        </div>

        <div className="reviews-viewport" id="reviewsViewport" ref={reviewsViewportRef}>
          <div className="reviews-track" id="reviewsTrack" ref={reviewsTrackRef}>
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

        <div className="review-dots" id="reviewDots" ref={reviewDotsRef}></div>

        <div className="leave-review-wrap">
          <a className="leave-review animated-arrow-bttn" href="https://tally.so/r/3EGJpA" target="_blank" rel="noopener noreferrer">
            Leave A Review{" "}
            <span className="animated-arrow diag" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" data-aos="fade-up">
        <h2 className="faq-title">Frequently Asked Questions</h2>

        <div className="faq-list">
          <div className="faq-item">
            <button className="faq-q" type="button" onClick={onFaqClick}>
              <span>What languages do you support?</span>
              <svg className="chev" viewBox="0 0 24 24" width="26" height="26">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="faq-a">
              We support English, Spanish, German, French, Italian, Portuguese, Dutch, Romanian, Albanian, Chinese,
              Japanese, and Turkish. More coming soon!
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q" type="button" onClick={onFaqClick}>
              <span>Is SignSense legally binding or a replacement for a lawyer?</span>
              <svg className="chev" viewBox="0 0 24 24" width="26" height="26">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="faq-a">
              No. SignSense explains your contract using AI, but it isn’t legally binding and doesn’t replace
              professional legal advice.
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q" type="button" onClick={onFaqClick}>
              <span>What types of contracts can I upload?</span>
              <svg className="chev" viewBox="0 0 24 24" width="26" height="26">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="faq-a">
              Most standard agreements—leases, NDAs, freelance/service contracts, employment offers, and more.
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-q" type="button" onClick={onFaqClick}>
              <span>Is my data secure when I upload a contract?</span>
              <svg className="chev" viewBox="0 0 24 24" width="26" height="26">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <div className="faq-a">
              Yes. Uploads are processed securely; we don’t sell your data or share your files with third parties.
            </div>
          </div>
        </div>
      </section>

      {/* DESKTOP FOOTER */}
      <div className="site-footer-wrap desktop-only">
        <footer className="site-footer desktop-only">
          <div className="footer-left">
            <a href="index.html">
              <img className="footer-logo" src="https://imgur.com/BcUqgKZ.png" alt="SignSense logo" />
            </a>
            <div className="footer-left-inner">
              <a href="index.html" className="footer-brand">
                SignSense
              </a>
              <div className="footer-tagline">
                <div>No confusion, no legal jargon.</div>
                <div>For informational use only. Not legal advice.</div>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-title">Quick Menu</div>
            <nav className="footer-links">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                How it Works
              </a>
              <a href="https://tally.so/r/3EGJpA" target="_blank" rel="noopener noreferrer">
                Leave Review
              </a>
            </nav>
          </div>

          <div className="footer-col">
            <div className="footer-title">Information</div>
            <nav className="footer-links">
              <a href="/contact">Contact</a>
              <a href="index.html">Home</a>
            </nav>
          </div>

          <div className="footer-col">
            <div className="footer-title">Socials</div>
            <nav className="footer-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                X
              </a>
            </nav>
          </div>
        </footer>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-links">
            <div className="footer-links-group">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/cookies">Cookie Policy</a>
            </div>
            <span className="footer-copy">© 2025 SignSense. All rights reserved.</span>
          </div>
        </div>
      </div>

      {/* MOBILE FOOTER */}
      <footer className="site-footer-mobile">
        <div className="footer-wrap">
          <div className="footer-brandrow">
            <div className="footer-logo">
              <img src="https://imgur.com/t8UWYN3.png" alt="SignSense logo" />
              <span>SignSense</span>
            </div>
            <div className="footer-copy">© 2025 SignSense. All rights reserved.</div>
            <div className="footer-disclaimer">For informational use only. Not legal advice.</div>
          </div>

          <div className="footer-socials">
            <a className="social-btn" href="https://x.com" target="_blank" rel="noopener" aria-label="X">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2H21l-6.52 7.45L22.5 22h-6.73l-4.7-6.35L5.6 22H3l7.07-8.07L1.5 2h6.8l4.22 5.8L18.244 2Zm-1.18 18h1.77L8.05 4h-1.8l10.82 16Z" />
              </svg>
            </a>

            <a className="social-btn" href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12.07C22 6.52 17.52 2 12 2S2 6.52 2 12.07c0 5.02 3.66 9.19 8.44 9.93v-7.03H7.9V12.1h2.54V9.79c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.87h-2.34V22c4.78-.74 8.44-4.91 8.44-9.93Z" />
              </svg>
            </a>

            <a
              className="social-btn"
              href="https://www.instagram.com/signsense.io/"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11.001 5.5 5.5 0 0 1 0-11Zm0 2a3.5 3.5 0 1 0 .001 7.001A3.5 3.5 0 0 0 12 9.5Zm5.25-2.25a1 1 0 1 1 0 2.001 1 1 0 0 1 0-2Z" />
              </svg>
            </a>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4>Help</h4>
              <a className="footer-link" href="/contact">
                Contact us
              </a>
              <a className="footer-link" href="https://youtube.com" target="_blank" rel="noopener">
                How it Works
              </a>
            </div>

            <div className="footer-col">
              <h4>Product</h4>
              <a className="footer-link" href="https://tally.so/r/3EGJpA" target="_blank" rel="noopener">
                Leave Review
              </a>
            </div>

            <div className="footer-col">
              <h4>Legal</h4>
              <a className="footer-link" href="/terms">
                Terms of Service
              </a>
              <a className="footer-link" href="/privacy">
                Privacy Policy
              </a>
              <a className="footer-link" href="/cookies">
                Cookie Policy
              </a>
            </div>
          </div>

          <div className="footer-bottom-space"></div>
        </div>
      </footer>

      {/* UPLOAD INPUTS */}
      <input
        id="contractFile"
        ref={contractFileRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,image/*"
        style={{ display: "none" }}
        onChange={onContractFileChange}
      />

      <input
        id="contractCamera"
        ref={contractCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={onContractCameraChange}
      />

      {/* iOS Bottom Sheet: Add More Photos */}
      {sheetVisible && (
        <div id="addMoreSheet" className="sheet-backdrop" style={{ display: "flex" }}>
          <div className="sheet-panel">
            <div className="sheet-title" id="sheetCount">
              {sheetCount}/10 photos added
            </div>
            <button className="sheet-btn sheet-yes" id="sheetAddMore" onClick={onSheetAddMore}>
              Add More
            </button>
            <button className="sheet-btn sheet-no" id="sheetContinue" onClick={onSheetContinue}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Cookie Consent Box */}
      <CookieConsent />
    </>
  );
}

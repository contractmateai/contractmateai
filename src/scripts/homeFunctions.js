// src/scripts/homeFunctions.js
// Runs as a side-effect module (no exports). Assumes DOM elements are rendered by React components.

if (typeof window === "undefined") {
  // Server or build-time: do nothing
} else {
  // AOS init (AOS script should be included in index.html)
  if (window.AOS) {
    window.AOS.init?.({ once: true });
  }

  // Helper: run when DOM ready
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  // Stage classes for entrance animations
  onReady(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.body.classList.add('stage1');
    if (reduce) {
      document.body.classList.add('stage2', 'stage3');
    } else {
      setTimeout(() => document.body.classList.add('stage2'), 80);
      setTimeout(() => document.body.classList.add('stage3'), 160);
    }
  });

  // Particles
  onReady(() => {
    const container = document.getElementById("particles");
    if (container) {
      const num = 50;
      for (let i = 0; i < num; i++) {
        const p = document.createElement("div");
        p.className = "particle";
        const duration = 25 + Math.random() * 15;
        const size = 1 + Math.random() * 2.5;
        p.style.left = `${Math.random() * window.innerWidth}px`;
        p.style.top = `${Math.random() * 1600}px`;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.animationDuration = `${duration}s`;
        container.appendChild(p);
      }
    }
  });

  // App tilt on scroll
  onReady(() => {
    const wrapper = document.getElementById("appWrapper");
    if (wrapper) {
      window.addEventListener("scroll", () => {
        const st = window.scrollY;
        wrapper.style.transform = st > 50 ? "rotateX(0deg)" : "rotateX(12deg)";
      }, { passive: true });
    }
  });

  // Feature ticker population + ticker logic
  onReady(() => {
    const topRow = document.querySelector(".top-row");
    const bottomRow = document.querySelector(".bottom-row");
    const featuresTop = [
      { label: "No Signup", icon: "https://imgur.com/dKG0KXh.png" },
      { label: "Secure Processing", icon: "https://imgur.com/Cbflaz5.png" },
      { label: "PDF Export", icon: "https://imgur.com/RozMHbN.png" },
      { label: "Risk Indicator", icon: "https://imgur.com/hDBmbBP.png" },
      { label: "Your Data Stays Yours", icon: "https://imgur.com/SaW85D2.png" },
      { label: "Smart Summary", icon: "https://imgur.com/dPCWJg7.png" },
      { label: "Language Detection", icon: "https://imgur.com/Xv2u5Mz.png" },
      { label: "Key Clauses", icon: "https://imgur.com/cv1DrX1.png" },
    ];
    const featuresBottom = [
      { label: "Legal Insights", icon: "https://imgur.com/0TgzL8P.png" },
      { label: "Suggestions Engine", icon: "https://imgur.com/JMV0gKS.png" },
      { label: "Clause Warnings", icon: "https://imgur.com/MAZkZHs.png" },
      { label: "AI Review", icon: "https://imgur.com/o8K46Sk.png" },
      { label: "No legal jargon", icon: "https://imgur.com/3PU7xU0.png" },
      { label: "Deadline Pressure", icon: "https://imgur.com/rlaNjHT.png" },
      { label: "Modern Design", icon: "https://imgur.com/Ie8CwXO.png" },
      { label: "Confidence to Sign", icon: "https://imgur.com/5DGepME.png" },
    ];

    function populateRow(row, features) {
      if (!row) return;
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
    }

    populateRow(topRow, featuresTop);
    populateRow(bottomRow, featuresBottom);

    function makeTicker(row, { pxPerSecond = 36, direction = "left" } = {}) {
      if (!row) return;
      const speed = direction === "left" ? -pxPerSecond : pxPerSecond;
      let x = 0, w = 0, raf = 0, last = performance.now();
      function measure() { w = row.scrollWidth / 2; if (!w) { setTimeout(measure, 60); } }
      function tick(now) {
        const dt = (now - last) / 1000; last = now;
        x += speed * dt;
        if (x <= -w) x += w;
        if (x > 0) x -= w;
        row.style.transform = `translateX(${x}px)`;
        raf = requestAnimationFrame(tick);
      }
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      function start() { if (media.matches) { row.style.transform = "none"; return; } measure(); last = performance.now(); raf = requestAnimationFrame(tick); }
      function stop() { if (raf) cancelAnimationFrame(raf); }
      window.addEventListener("resize", measure, { passive: true });
      media.addEventListener?.("change", () => { stop(); start(); });
      start();
    }

    window.addEventListener("load", () => {
      makeTicker(topRow,    { pxPerSecond: 36, direction: "right" });
      makeTicker(bottomRow, { pxPerSecond: 36, direction: "left"  });
    });
  });

  // Logo track auto-scroller
  onReady(() => {
    (function () {
      const track = document.getElementById('logoTrack');
      if (!track) return;
      const src = 'https://i.imgur.com/2SUo8mv.png';
      const COPIES = 12;
      for (let i = 0; i < COPIES; i++) {
        const img = document.createElement('img');
        img.src = src; img.alt = 'Powered-by logos'; img.className = 'logo-piece'; img.decoding = 'async';
        track.appendChild(img);
      }
      const SECONDS_PER_LOOP = 150;
      function run() {
        let x = 0, pieceW = 0, last = performance.now();
        function measure() {
          const first = track.querySelector('.logo-piece');
          if (!first || !first.complete) { setTimeout(measure, 50); return; }
          pieceW = first.getBoundingClientRect().width || first.naturalWidth;
        }
        function tick(now) {
          const dt = (now - last) / 1000; last = now;
          const pxPerSecond = (pieceW * COPIES) / SECONDS_PER_LOOP;
          x -= pxPerSecond * dt; const loop = pieceW * COPIES; if (x <= -loop) x += loop;
          track.style.transform = `translateX(${x}px)`; requestAnimationFrame(tick);
        }
        measure(); requestAnimationFrame(tick); window.addEventListener('resize', measure, { passive: true });
      }
      window.addEventListener('load', run);
    })();
  });

  // Topbar hide on scroll
  onReady(() => {
    (function () {
      const bar = document.getElementById("topbarWrap");
      if (!bar) return;
      let lastY = window.scrollY, ticking = false;
      function onScroll() {
        const y = window.scrollY;
        if (y > lastY && y > 80) { bar.classList.add("hide"); } else { bar.classList.remove("hide"); }
        lastY = y <= 0 ? 0 : y; ticking = false;
      }
      window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
    })();
  });

  // Reviews carousel + dots, autoplay
  onReady(() => {
    (function () {
      const track = document.getElementById("reviewsTrack");
      const dotsEl = document.getElementById("reviewDots");
      if (!track || !dotsEl) return;

      const originals = Array.from(track.children);
      const TOTAL = originals.length;
      track.innerHTML = "";
      for (let k = 0; k < 3; k++) originals.forEach(n => track.appendChild(n.cloneNode(true)));

      let perPage = 3;
      function computePerPage() {
        const w = window.innerWidth;
        perPage = (w <= 640) ? 1 : (w <= 1100) ? 2 : 3;
      }
      computePerPage();

      let itemW = 0;
      function measure() {
        const c = track.querySelector(".review-card");
        const gap = parseFloat(getComputedStyle(track).gap || 24);
        itemW = (c ? c.getBoundingClientRect().width : 0) + gap;
      }
      measure();

      let baseIndex = TOTAL;
      function setTransform(i, animate) {
        if (!animate) track.style.transition = "none";
        track.style.transform = `translateX(${-i * itemW}px)`;
        if (!animate) { track.offsetHeight; track.style.transition = "transform .35s ease"; }
      }
      setTransform(baseIndex, false);

      const mod = (n,m) => ((n % m) + m) % m;
      const groupStarts = [0, 2];
      const toggleMode = () => (perPage === 3 && TOTAL === 5);

      function renderDots() {
        dotsEl.innerHTML = "";
        for (let i = 0; i < TOTAL; i++) {
          const b = document.createElement("button");
          b.type = "button"; b.className = "review-dot";
          b.addEventListener("click", () => {
            if (toggleMode()) {
              let g = (i < 2) ? 0 : (i > 2) ? 1 : (currentGroup() === 0 ? 0 : 1);
              goGroup(g);
            } else { goToStart(i); }
            restartAutoplay();
          });
          dotsEl.appendChild(b);
        }
        updateDots();
      }

      function currentGroup() { const p = mod(baseIndex, TOTAL); return (p === groupStarts[1]) ? 1 : 0; }
      function updateDots() {
        const g = toggleMode() ? currentGroup() : null;
        const children = [...dotsEl.children];
        if (toggleMode()) {
          const active = g === 0 ? new Set([0,1,2]) : new Set([2,3,4]);
          children.forEach((d, i) => d.classList.toggle("active", active.has(i)));
        } else {
          const start = mod(baseIndex, TOTAL);
          children.forEach((d, i) => { const k = (i - start + TOTAL) % TOTAL; d.classList.toggle("active", k < perPage); });
        }
      }

      function recenterIfNeeded() {
        if (baseIndex >= 2 * TOTAL) { baseIndex -= TOTAL; setTransform(baseIndex, false); }
        else if (baseIndex < TOTAL) { baseIndex += TOTAL; setTransform(baseIndex, false); }
      }

      function goDelta(delta) { baseIndex += delta; setTransform(baseIndex, true); track.addEventListener("transitionend", () => { recenterIfNeeded(); updateDots(); }, { once: true }); }
      function goGroup(g) { const p = mod(baseIndex, TOTAL); if (g === 0) { if (p === groupStarts[0]) return; goDelta(3); } else { if (p === groupStarts[1]) return; goDelta(2); } }
      function goPrevGroup() { const p = mod(baseIndex, TOTAL); baseIndex += (p === groupStarts[0]) ? -3 : -2; setTransform(baseIndex, true); track.addEventListener("transitionend", () => { recenterIfNeeded(); updateDots(); }, { once: true }); }
      function goToStart(dotIdx) { const p = mod(baseIndex, TOTAL); baseIndex = baseIndex + ((dotIdx - p + TOTAL) % TOTAL); setTransform(baseIndex, true); track.addEventListener("transitionend", () => { recenterIfNeeded(); updateDots(); }, { once: true }); }

      const next = document.getElementById("revNext");
      const prev = document.getElementById("revPrev");
      const nextMobile = document.getElementById("revNextMobile");
      const prevMobile = document.getElementById("revPrevMobile");

      next?.addEventListener("click", () => { if (toggleMode()) goGroup(currentGroup() === 0 ? 1 : 0); else goDelta(perPage); restartAutoplay(); });
      prev?.addEventListener("click", () => { if (toggleMode()) goPrevGroup(); else goDelta(-perPage); restartAutoplay(); });
      nextMobile?.addEventListener('click', () => { if (toggleMode()) goGroup(currentGroup() === 0 ? 1 : 0); else goDelta(perPage); restartAutoplay(); });
      prevMobile?.addEventListener('click', () => { if (toggleMode()) goPrevGroup(); else goDelta(-perPage); restartAutoplay(); });

      let timer = null;
      function startAutoplay() { stopAutoplay(); timer = setInterval(() => { if (toggleMode()) goGroup(currentGroup() === 0 ? 1 : 0); else goDelta(perPage); }, 5000); }
      function stopAutoplay() { if (timer) clearInterval(timer); timer = null; }
      function restartAutoplay() { stopAutoplay(); startAutoplay(); }
      renderDots(); startAutoplay();

      function snap() { setTransform(baseIndex, false); updateDots(); }
      window.addEventListener("resize", () => { computePerPage(); measure(); snap(); }, { passive: true });
    })();
  });

  // Reviews drag/gesture support
  onReady(() => {
    (function () {
      const viewport = document.querySelector('.reviews-viewport');
      const track = document.getElementById('reviewsTrack');
      if (!viewport || !track) return;
      viewport.style.cursor = 'grab';
      let isDown = false, startX = 0, startTx = 0, moved = false;
      function getTx() { const m = getComputedStyle(track).transform; if (m && m !== 'none') { const p = m.replace('matrix(', '').replace(')', '').split(','); return parseFloat(p[4] || 0); } return 0; }
      function setTx(x) { track.style.transition = 'none'; track.style.transform = `translateX(${x}px)`; }
      function end() { isDown = false; viewport.style.cursor = 'grab'; track.offsetHeight; track.style.transition = 'transform .35s ease'; setTimeout(() => (moved = false), 0); }
      function start(clientX) { isDown = true; moved = false; startX = clientX; startTx = getTx(); viewport.style.cursor = 'grabbing'; }
      function move(clientX) { if (!isDown) return; const dx = clientX - startX; if (Math.abs(dx) > 3) moved = true; setTx(startTx + dx); }
      viewport.addEventListener('mousedown', e => { e.preventDefault(); start(e.clientX); });
      window.addEventListener('mousemove', e => move(e.clientX), { passive: true });
      window.addEventListener('mouseup', end);
      viewport.addEventListener('touchstart', e => start(e.touches[0].clientX), { passive: true });
      viewport.addEventListener('touchmove',  e => move(e.touches[0].clientX),   { passive: true });
      window.addEventListener('touchend', end);
      viewport.addEventListener('click', e => { if (moved) e.preventDefault(); }, true);
    })();
  });

  // FAQ toggles
  onReady(() => {
    document.querySelectorAll(".faq-item .faq-q").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.parentElement;
        if (!item.classList.contains("open")) {
          document.querySelectorAll(".faq-item.open").forEach((i) => i.classList.remove("open"));
        }
        item.classList.toggle("open");
      });
    });
    // ensure none open by default
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  });

  // Mobile menu panel / toggle handling
  onReady(() => {
    const topbar = document.getElementById('topbar');
    const menuToggle = document.getElementById('menuToggle');
    const menuPanel  = document.getElementById('menuPanel');
    const menuOverlay= document.getElementById('menuOverlay');
    if (!topbar || !menuToggle || !menuPanel || !menuOverlay) return;
    function positionPanel(){ const r = topbar.getBoundingClientRect(); menuPanel.style.top = (r.top + r.height + 0) + 'px'; }
    positionPanel(); window.addEventListener('resize', positionPanel);
    function openMenu(){ positionPanel(); menuPanel.classList.add('open'); menuOverlay.classList.add('show'); menuToggle.classList.add('open'); topbar.classList.add('merged'); }
    function closeMenu(){ menuPanel.classList.remove('open'); menuOverlay.classList.remove('show'); menuToggle.classList.remove('open'); topbar.classList.remove('merged'); }
    menuToggle.addEventListener('click', () => { if(menuPanel.classList.contains('open')) closeMenu(); else openMenu(); });
    menuOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeMenu(); });
    window.addEventListener('scroll', () => { if (menuPanel.classList.contains('open')) closeMenu(); }, { passive:true });
  });

  // File upload, payload building, and role picker logic
  onReady(() => {
    (async () => {
      async function fileToPayload(file) {
        try {
          const name = file.name || "file";
          const mime = file.type || "application/octet-stream";
          const ext = name.toLowerCase();
          if (mime === "text/plain" || ext.endsWith(".txt")) {
            return { text: await file.text(), originalName: name, mime };
          }
          if (mime === "application/pdf" || ext.endsWith(".pdf")) {
            if (!window.pdfjsLib) throw new Error("pdfjsLib not available");
            const buf = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
            let full = "";
            for (let p = 1; p <= pdf.numPages; p++) {
              const page = await pdf.getPage(p);
              const content = await page.getTextContent();
              full += content.items.map((i) => i.str).join(" ") + "\n";
            }
            return { text: full, originalName: name, mime };
          }
          if (mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || ext.endsWith(".docx")) {
            if (!window.mammoth) throw new Error("mammoth not available");
            const buf = await file.arrayBuffer();
            const res = await window.mammoth.extractRawText({ arrayBuffer: buf });
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
      }

      const input = document.getElementById("contractFile");
      const inputCamera = document.getElementById("contractCamera");
      const roleUI = document.getElementById("rolePicker");
      const ctaBtn = document.getElementById("reviewBtn");
      if (!input || !roleUI || !ctaBtn) return;
      let pickedFiles = [];

      function isMobile() {
        return window.matchMedia('(max-width: 980px)').matches;
      }

      ctaBtn.addEventListener("click", (e) => {
        e.preventDefault();
        pickedFiles = [];
        input.value = "";
        input.click();
      });

      input.addEventListener("change", async () => {
        if (!input.files || !input.files.length) return;
        pickedFiles = Array.from(input.files);
        ctaBtn.style.display = "none";
        roleUI.hidden = false;
      });

      if (inputCamera) {
        inputCamera.addEventListener("change", async () => {
          if (!inputCamera.files || !inputCamera.files.length) return;
          pickedFiles = Array.from(inputCamera.files);
          const first = inputCamera.files[0];
          const usedCamera = inputCamera.files.length === 1 && first.type.startsWith("image/");
          if (usedCamera) {
            setTimeout(() => { if (window.handleCameraFlow) window.handleCameraFlow(); }, 200);
            return;
          }
          ctaBtn.style.display = "none";
          roleUI.hidden = false;
        });
      }

      roleUI.querySelectorAll('.role-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          roleUI.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (!pickedFiles.length) {
            alert("Please choose a contract file first.");
            return;
          }
          try {
            const file = pickedFiles[0];
            if (file.size > 10_000_000) {
              alert(`File ${file.name} is too large. Maximum size is 10MB.`);
              return;
            }
            const payloadArr = await Promise.all(pickedFiles.map(fileToPayload));
            const body = { ...payloadArr[0], role: btn.dataset.role || "signer" };
            const resp = await fetch("/api/analyze", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            });
            if (!resp.ok) {
              const err = await resp.json().catch(() => ({}));
              throw new Error(err?.error || "Analysis failed");
            }
            const analysisResult = await resp.json();
            localStorage.setItem("analysisRaw", JSON.stringify(analysisResult));
            window.location.href = "analysis.html";
          } catch (e) {
            alert(`Error processing file: ${e.message}`);
          }
        });
      });
    })();
  });

  // Camera flow bottom-sheet logic (separate IIFE)
  onReady(() => {
    (function () {
      const input = document.getElementById("contractFile");
      const inputCamera = document.getElementById("contractCamera");
      const roleUI = document.getElementById("rolePicker");
      const ctaBtn = document.getElementById("reviewBtn");
      const sheet = document.getElementById("addMoreSheet");
      const sheetAddMore = document.getElementById("sheetAddMore");
      const sheetCont = document.getElementById("sheetContinue");
      const sheetCount = document.getElementById("sheetCount");
      if (!input || !inputCamera || !roleUI || !ctaBtn) return;
      let pickedFiles = [];
      let cameraResolve = null;

      function showSheet(count) {
        if (!sheet || !sheetCount) return;
        sheetCount.textContent = `${count}/10 photos added`;
        sheet.style.display = "flex";
      }
      function hideSheet() {
        if (!sheet) return;
        sheet.style.display = "none";
      }

      if (sheetAddMore) sheetAddMore.onclick = () => { hideSheet(); if (cameraResolve) cameraResolve(true); };
      if (sheetCont) sheetCont.onclick = () => { hideSheet(); if (cameraResolve) cameraResolve(false); };

      async function handleCameraFlow() {
        let count = pickedFiles.length;
        while (count < 10) {
          if (count > 0) {
            const more = await new Promise(resolve => {
              cameraResolve = resolve;
              showSheet(count);
            });
            if (!more) break;
          }
          inputCamera.value = "";
          inputCamera.click();
          const newPhoto = await new Promise(resolve => {
            inputCamera.onchange = () => resolve(inputCamera.files?.[0] || null);
          });
          if (!newPhoto) break;
          pickedFiles.push(newPhoto);
          count++;
        }
        if (pickedFiles.length) {
          ctaBtn.style.display = "none";
          roleUI.hidden = false;
        }
      }

      input.addEventListener("change", () => {
        if (!input.files.length) return;
        const first = input.files[0];
        const fromCamera = inputCamera.capture === "environment";
        if (fromCamera && first.type.startsWith("image/")) {
          pickedFiles = [first];
          setTimeout(handleCameraFlow, 300);
          return;
        }
        pickedFiles = Array.from(input.files).slice(0, 10);
        ctaBtn.style.display = "none";
        roleUI.hidden = false;
      });

      window.handleCameraFlow = handleCameraFlow;
    })();
  });

}
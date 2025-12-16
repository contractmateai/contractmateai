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
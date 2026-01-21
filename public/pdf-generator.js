// ...existing code...
/**
 * PDF Generator Module for SignSense Analysis Reports
 * Handles all PDF generation functionality independently from the web interface
 */

import { jsPDF } from "jspdf";

class PDFGenerator {
  constructor() {
    this.ASSETS = {
      logo: "https://i.imgur.com/aRIGT9V.png",
      risk: "https://i.imgur.com/hSkzUQu.png",
      clarity: "https://i.imgur.com/3J3mzur.png",
      pro: "https://i.imgur.com/FLqsaQJ.png",
      fav: "https://i.imgur.com/GIAYFBC.png",
      dead: "https://i.imgur.com/BbyV5gF.png",
      score: "https://i.imgur.com/H47wt5e.png",
      confidence: "https://i.imgur.com/GzPeaz5.png",
    };
    this.STYLE = {
      TITLE_BOTTOM_MARGIN: 10,
      PAGE_MARGIN: 30,
      HEADER_HEIGHT: 120,
      CONTENT_START_Y: 148,
      SECTION_MARGIN_BOTTOM: 30,
      SECTION_HEADER_SPACING: 10,
      CARD_PADDING: 10,
      TEXT_LINE_HEIGHT: 16,
      TEXT_ITEM_SPACING: 6,
      TITLE_CONTENT_SPACING: 24,
      ROW_GAP: 26,
      SMALL_GAP: 14,
      BOX_BORDER_WIDTH: 2,
      BOX_CORNER_RADIUS: 16,
      BOX_MARGIN: 6,
      BOX_VERTICAL_OFFSET: 18,
      BOX_CONTENT_PADDING: 24,
      FONT_SIZE: {
        HEADER_LARGE: 54,
        SECTION_TITLE: 16,
        CONTENT: 14,
        SMALL: 12,
        TINY: 11,
        MINI: 10,
      },
      CARD_HEIGHT_DONUT: 130,
      BAR_HEIGHT: 80,
      BAR_ROW_SPACING: 70,
      SCORE_CARD_HEIGHT: 150,
    };
  }

  // Translation dictionary (STATIC_TRANSLATIONS from Analysis.jsx)
  static STATIC_TRANSLATIONS = {
    en: {
      summary: "Summary",
      professionalism: "Professionalism",
      favorability: "Favorability",
      deadlinePressure: "Deadline Pressure",
      potentialIssues: "Potential Issues",
      riskLevel: "Risk Level",
      clauseClarity: "Clause Clarity",
      smartSuggestions: "Suggestions",
      mainClauses: "Main Clauses",
      overallScore: "Final Score",
      confidenceToSign: "Confidence to Sign",
      riskStatic: "Based on clause fairness and obligations.",
      clarityStatic: "Reflects how easy the terms are to understand.",
      scoreStatic: "Determines the final score.",
      unsafe: "Unsafe",
      notThatSafe: "Not that safe",
      safe: "Safe",
      verySafe: "Very Safe",
    },
    // ... (other languages from Analysis.jsx, omitted for brevity)
  };

  // Translation helper
  getT(lang, translations) {
    const dict = PDFGenerator.STATIC_TRANSLATIONS[lang] || PDFGenerator.STATIC_TRANSLATIONS.en;
    return (key) => (dict[key] || (translations?.[lang]?.[key]) || key);
  }

  // Verdict/tag logic matching Analysis.jsx
  getVerdictTag(type, value, t) {
    if (type === "risk") {
      if (value <= 29) return t("verySafe");
      if (value <= 62) return t("notThatSafe");
      return t("unsafe");
    }
    if (type === "clarity") {
      if (value >= 63) return t("verySafe");
      if (value >= 30) return t("notThatSafe");
      return t("unsafe");
    }
    if (type === "score") {
      if (value >= 78) return t("verySafe");
      if (value >= 49) return t("safe");
      if (value >= 30) return t("notThatSafe");
      return t("unsafe");
    }
    return "";
  }

  // ...existing methods remain unchanged, but all static text and tags should use t(key) and getVerdictTag()...

  /* ===== Font Management ===== */
  async ensurePoppins(doc) {
    try {
      const list = doc.getFontList ? doc.getFontList() : {};
      if (list && list.Poppins) return true;

      const REG_URL =
        "https://cdn.jsdelivr.net/gh/google/fonts/ofl/poppins/Poppins-Regular.ttf";
      const BLD_URL =
        "https://cdn.jsdelivr.net/gh/google/fonts/ofl/poppins/Poppins-Bold.ttf";

      async function fetchAsBase64(url) {
        const r = await fetch(url, { mode: "cors" });
        if (!r.ok) throw new Error("font fetch failed " + r.status);
        const buf = await r.arrayBuffer();
        let binary = "";
        const bytes = new Uint8Array(buf);
        for (let i = 0; i < bytes.byteLength; i++)
          binary += String.fromCharCode(bytes[i]);
        return btoa(binary);
      }

      const [regB64, boldB64] = await Promise.all([
        fetchAsBase64(REG_URL),
        fetchAsBase64(BLD_URL),
      ]);
      doc.addFileToVFS("Poppins-Regular.ttf", regB64);
      doc.addFont("Poppins-Regular.ttf", "Poppins", "normal");
      doc.addFileToVFS("Poppins-Bold.ttf", boldB64);
      doc.addFont("Poppins-Bold.ttf", "Poppins", "bold");
      return true;
    } catch (e) {
      console.warn("Poppins failed to load — using helvetica fallback.", e);
      return false;
    }
  }

  /* ===== Image Utilities ===== */
  async imgToDataURL(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Image fetch failed " + res.status);
    const buf = await res.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i++)
      binary += String.fromCharCode(bytes[i]);
    return "data:image/png;base64," + btoa(binary);
  }

  /* ===== Color Management ===== */
  // Color logic matches Analysis.jsx
  getColorFor(metric, v, band) {
    if (metric === "risk") {
      // Green (<=29%), Orange (30-62%), Red (63-100%)
      if (v <= 29) return "#28e070"; // green
      if (v <= 62) return "#df911a"; // orange
      return "#fe0000"; // red
    }
    if (metric === "clarity" || metric === "score") {
      // Red (<=29%), Orange (30-62%), Green (63-100%)
      if (v <= 29) return "#fe0000"; // red
      if (v <= 62) return "#df911a"; // orange
      return "#28e070"; // green
    }
    if (metric === "professionalism") {
      if (v <= 29) return "#fe0000";
      if (v <= 70) return "#df911a";
      return "#28e070";
    }
    if (metric === "favorability") {
      if (v <= 29) return "#fe0000";
      if (v <= 70) return "#df911a";
      return "#28e070";
    }
    if (metric === "deadline") {
      if (v <= 29) return "#28e070";
      if (v <= 64) return "#df911a";
      return "#fe0000";
    }
    if (metric === "confidence") {
      if (v <= 29) return "#fe0000";
      if (v <= 62) return "#df911a";
      return "#28e070";
    }
    return "#df911a";
  }

  getBadgeBgColor(band) {
    return band === "green"
      ? [240, 255, 240]
      : band === "orange"
      ? [255, 244, 230]
      : [255, 230, 230];
  }

  getDotColor(band) {
    return band === "green"
      ? [40, 224, 112]
      : band === "orange"
      ? [223, 145, 26]
      : [254, 0, 0];
  }

  capitalizeSafety(safety) {
    return safety
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }

  /* ===== Canvas-based Chart Generation ===== */
  gradientBarPNG(width, height = 15, indPos) {
    const c = document.createElement("canvas");
    // Use higher resolution for better quality
    const scale = 2;
    c.width = width * scale;
    c.height = (height + 20) * scale; // extra for indicator
    const ctx = c.getContext("2d");

    // Scale context for high-DPI rendering
    ctx.scale(scale, scale);

    // Enable better anti-aliasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Precise rounded bar rendering
    const r = height / 2;

    // Create precise clipping path for rounded rectangle
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(r, 10);
    ctx.lineTo(width - r, 10);
    ctx.arc(width - r, 10 + r, r, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(r, 10 + height);
    ctx.arc(r, 10 + r, r, Math.PI / 2, -Math.PI / 2, false);
    ctx.closePath();
    ctx.clip();

    // Enhanced gradient with smoother transitions
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, "#fe0000"); // Pure red
    grad.addColorStop(0.45, "#ffd166"); // Gold
    grad.addColorStop(1, "#28e070"); // Green
    ctx.fillStyle = grad;
    ctx.fillRect(0, 10, width, height);

    ctx.restore();

    // Precise indicator line perfectly centered with the bar
    const pos = Math.max(0, Math.min(1, indPos)) * width;
    const extension = 2; // Same extension above and below the bar
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.lineCap = "round"; // Rounded line caps for better appearance
    ctx.beginPath();
    ctx.moveTo(pos, 10 - extension); // Start: bar top (10) minus extension
    ctx.lineTo(pos, 10 + height + extension); // End: bar bottom (10 + height) plus extension
    ctx.stroke();

    return c.toDataURL("image/png");
  }

  donutPNG(pct, color = "#28e070", size = 150) {
    const c = document.createElement("canvas");
    // Use higher resolution for better quality
    const scale = 2;
    c.width = size * scale;
    c.height = size * scale;
    const ctx = c.getContext("2d");

    // Scale context for high-DPI rendering
    ctx.scale(scale, scale);

    // Enable better anti-aliasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cx = size / 2,
      cy = size / 2;
    const ringW = 10; // Fixed 10px stroke width
    const r = Math.round(size * 0.42);

    // Background track with precise rendering
    ctx.lineWidth = ringW;
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
    ctx.stroke();

    // Value arc with enhanced precision
    const a0 = -Math.PI / 2;
    const a1 = a0 + (Math.max(0, Math.min(100, pct)) / 100) * Math.PI * 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = ringW;
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0, a1, false);
    ctx.stroke();

    // White center with precise edges
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(cx, cy, r - ringW + 4, 0, Math.PI * 2, false);
    ctx.fill();

    // % text
    ctx.fillStyle = "#000";
    ctx.font = `bold ${Math.round(size * 0.26)}px Poppins, Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${Math.round(pct)}%`, cx, cy);

    return c.toDataURL("image/png");
  }

  pillBarPNG(pct, width, height = 20, fill = "#9ef0b6") {
    const c = document.createElement("canvas");
    // Use higher resolution for better quality
    const scale = 2;
    c.width = width * scale;
    c.height = height * scale;
    const ctx = c.getContext("2d");

    // Scale context for high-DPI rendering
    ctx.scale(scale, scale);

    // Enable better anti-aliasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const r = height / 2;

    // Draw black rounded container background with more precise rendering
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(width - r, 0);
    ctx.arc(width - r, r, r, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(r, height);
    ctx.arc(r, r, r, Math.PI / 2, -Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    // Inner progress bar with more precise insets for cleaner appearance
    const borderWidth = 1.5; // Slightly thicker border for better definition
    const innerWidth = width - borderWidth * 2;
    const innerHeight = height - borderWidth * 2;
    const innerR = innerHeight / 2;
    const offsetX = borderWidth;
    const offsetY = borderWidth;

    // Create precise clipping path for inner rounded shape
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(offsetX + innerR, offsetY);
    ctx.lineTo(offsetX + innerWidth - innerR, offsetY);
    ctx.arc(
      offsetX + innerWidth - innerR,
      offsetY + innerR,
      innerR,
      -Math.PI / 2,
      Math.PI / 2
    );
    ctx.lineTo(offsetX + innerR, offsetY + innerHeight);
    ctx.arc(
      offsetX + innerR,
      offsetY + innerR,
      innerR,
      Math.PI / 2,
      -Math.PI / 2
    );
    ctx.closePath();
    ctx.clip();

    // Fill to percentage with more precise rounded edges
    const inner = Math.max(0, Math.min(100, pct)) / 100;
    const progressWidth = innerWidth * inner;

    if (progressWidth > 0) {
      ctx.fillStyle = fill;

      // Use sub-pixel precision for smoother curves
      const minRadius = Math.min(innerR, progressWidth / 2);

      ctx.beginPath();

      if (progressWidth >= innerWidth - 0.1) {
        // Account for floating point precision
        // Full progress - complete rounded rectangle with precise curves
        ctx.moveTo(offsetX + innerR, offsetY);
        ctx.lineTo(offsetX + innerWidth - innerR, offsetY);
        ctx.arc(
          offsetX + innerWidth - innerR,
          offsetY + innerR,
          innerR,
          -Math.PI / 2,
          Math.PI / 2,
          false
        );
        ctx.lineTo(offsetX + innerR, offsetY + innerHeight);
        ctx.arc(
          offsetX + innerR,
          offsetY + innerR,
          innerR,
          Math.PI / 2,
          -Math.PI / 2,
          false
        );
      } else if (progressWidth > innerR * 1.8) {
        // Partial progress with precise rounded right edge
        const rightCenterX = offsetX + progressWidth - minRadius;
        ctx.moveTo(offsetX + innerR, offsetY);
        ctx.lineTo(rightCenterX, offsetY);
        ctx.arc(
          rightCenterX,
          offsetY + minRadius,
          minRadius,
          -Math.PI / 2,
          Math.PI / 2,
          false
        );
        ctx.lineTo(offsetX + innerR, offsetY + innerHeight);
        ctx.arc(
          offsetX + innerR,
          offsetY + innerR,
          innerR,
          Math.PI / 2,
          -Math.PI / 2,
          false
        );
      } else {
        // Small progress - smooth left rounded edge only
        ctx.moveTo(offsetX + innerR, offsetY);
        ctx.lineTo(offsetX + progressWidth, offsetY);
        ctx.lineTo(offsetX + progressWidth, offsetY + innerHeight);
        ctx.lineTo(offsetX + innerR, offsetY + innerHeight);
        ctx.arc(
          offsetX + innerR,
          offsetY + innerR,
          innerR,
          Math.PI / 2,
          -Math.PI / 2,
          false
        );
      }

      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    return c.toDataURL("image/png");
  }

  /* ===== PDF Layout Helpers ===== */
  drawBox(doc, x, y, w, h) {
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(this.STYLE.BOX_BORDER_WIDTH);
    doc.roundedRect(
      x,
      y,
      w,
      h,
      this.STYLE.BOX_CORNER_RADIUS,
      this.STYLE.BOX_CORNER_RADIUS
    );
  }

  tagWithIcon(doc, x, y, icon, label) {
    // black chip behind title - reduced padding
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(x, y, doc.getTextWidth(label) + 64, 24, 10, 10, "F");
    if (icon) doc.addImage(icon, "PNG", x + 8, y + 3, 18, 18);
    doc.setTextColor(255, 255, 255);
    doc.setFont(doc.getFont().fontName, "bold");
    doc.setFontSize(12);
    doc.text(label, x + 32, y + 17);
    doc.setTextColor(0, 0, 0);
  }

  tinyText(doc, txt, x, y, w, lh = 14) {
    const lines = doc.splitTextToSize(String(txt || ""), w);
    doc.setFont(doc.getFont().fontName, "normal");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    lines.forEach((ln, i) => doc.text(ln, x, y + i * lh));
    doc.setTextColor(0, 0, 0);
    return y + lines.length * lh;
  }

  drawHeader(doc) {
    const W = doc.internal.pageSize.getWidth();
    const M = this.STYLE.PAGE_MARGIN;

    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, W, this.STYLE.HEADER_HEIGHT, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont(doc.getFont().fontName, "bold");
    doc.setFontSize(this.STYLE.FONT_SIZE.HEADER_LARGE);
    doc.text("Contract Report", M, 72);
    doc.setFont(doc.getFont().fontName, "normal");
    doc.setFontSize(this.STYLE.FONT_SIZE.SECTION_TITLE);
    const dt = new Date();
    const day = String(dt.getDate()).padStart(2, "0");
    const month = dt.toLocaleString("en", { month: "long" });
    const year = dt.getFullYear();
    doc.text(`Generated on ${day} ${month} ${year}`, M, 100);
    doc.setTextColor(0, 0, 0);
  }

  drawFooter(doc, page, logoImg) {
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = this.STYLE.PAGE_MARGIN;

    // Logo positioned 10px from right edge on both pages
    // if (logoImg) doc.addImage(logoImg, "PNG", W - 50, H - 120, 40, 40);

    // centered + fully underlined disclaimer with "not" bold
    const parts = [
      "Kindly keep in mind that although you might find this report helpful, this is ",
      "not",
      " legal advice.",
    ];
    doc.setFont(doc.getFont().fontName, "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const y = H - 4; // Position text 4px from bottom of page
    let w = 0;
    parts.forEach((p) => (w += doc.getTextWidth(p)));
    let xx = (W - w) / 2;
    doc.setFont(doc.getFont().fontName, "normal");
    doc.text(parts[0], xx, y);
    xx += doc.getTextWidth(parts[0]);
    doc.setFont(doc.getFont().fontName, "bold");
    doc.text(parts[1], xx, y);
    xx += doc.getTextWidth(parts[1]);
    doc.setFont(doc.getFont().fontName, "normal");
    doc.text(parts[2], xx, y);
    doc.setLineWidth(0.8);
    doc.line((W - w) / 2, y + 1, (W + w) / 2, y + 1); // Underline below text

    // PAGE container appears on both pages - left aligned with straight left edge, rounded right edge
    const pageContainerWidth = 100; // Same width as SignSense container
    const containerHeight = 24; // Same height as other containers
    doc.setFillColor(0, 0, 0);

    // Left-aligned: straight left edge (flush with page), rounded right edge
    // Main rectangle (straight left side)
    doc.rect(0, H - 44, pageContainerWidth - 5, containerHeight, "F");
    // Right rounded part
    doc.roundedRect(
      pageContainerWidth - 10,
      H - 44,
      10,
      containerHeight,
      5,
      5,
      "F"
    );

    doc.setTextColor(255, 255, 255);
    doc.setFont(doc.getFont().fontName, "bold");
    doc.setFontSize(14);
    const pageTextY = H - 44 + containerHeight / 2 + 4;
    doc.text(`PAGE ${page}`, pageContainerWidth / 2, pageTextY, {
      align: "center",
    });

    // SignSense container - page 1: left side, page 2: right side
    const pillW = pageContainerWidth - 20; // PAGE container width minus 20px padding (10px each side)
    const pillX = page === 1 ? 10 : W - pillW - 10; // Page 1: 10px from left, Page 2: 10px from right
    const pillHeight = 24; // Same height as PAGE container
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(pillX, H - 78, pillW, pillHeight, 5, 5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont(doc.getFont().fontName, "bold");
    doc.setFontSize(10);

    // Calculate icon and text positioning
    const containerPadding = 3;
    const iconSize = pillHeight - 2 * containerPadding - 4; // Smaller icon with additional 4px padding
    const iconTextGap = 4; // Gap between icon and text

    if (logoImg) {
      // Calculate total content width (icon + gap + text)
      const textWidth = doc.getTextWidth("SignSense");
      const totalContentWidth = iconSize + iconTextGap + textWidth;

      // Center the entire content block within container
      const contentStartX = pillX + (pillW - totalContentWidth) / 2;

      // Position icon on the left
      const iconX = contentStartX;
      const iconY = H - 78 + (pillHeight - iconSize) / 2; // Vertically center icon within container
      doc.addImage(logoImg, "PNG", iconX, iconY, iconSize, iconSize);

      // Position text next to icon
      const textX = contentStartX + iconSize + iconTextGap;
      const signSenseTextY = H - 78 + pillHeight / 2 + 4;
      doc.text("SignSense", textX, signSenseTextY);
    } else {
      // No icon - center text as before
      const signSenseTextY = H - 78 + pillHeight / 2 + 4;
      doc.text("SignSense", pillX + pillW / 2, signSenseTextY, {
        align: "center",
      });
    }

    // Page 2 extras: © container
    if (page === 2) {
      // Copyright text in container with same width as PAGE container - split into 2 rows
      const firstLine = "© 2025 SignSense.";
      const secondLine = "All rights reserved.";

      // Use same width as PAGE container
      doc.setFont(doc.getFont().fontName, "normal");
      doc.setFontSize(7); // Reduced font size for better spacing
      const copyrightWidth = 100; // Same width as PAGE container
      const copyrightHeight = 24; // Same as PAGE container
      const copyrightX = W - copyrightWidth; // Align to right edge

      // Draw right-aligned container with rounded left corners only
      doc.setFillColor(0, 0, 0);

      // Right-aligned: straight right edge (flush with page), rounded left edge
      // Main rectangle (straight right side)
      doc.rect(
        copyrightX + 5,
        H - 44,
        copyrightWidth - 5,
        copyrightHeight,
        "F"
      );
      // Left rounded part
      doc.roundedRect(copyrightX, H - 44, 10, copyrightHeight, 5, 5, "F");
      doc.setTextColor(255, 255, 255);

      // Position text with proper vertical centering: center both labels as a block within container
      const labelMargin = 3; // Small margin between labels
      const lineHeight = 6; // Height per line of text (reduced for smaller font)
      const containerTop = H - 44;

      // Calculate total content height (both lines + margin between them)
      const totalContentHeight = lineHeight * 2 + labelMargin;

      // Center the content block within the 24px container
      const contentStartY =
        containerTop + (copyrightHeight - totalContentHeight) / 2;

      // Position lines from the centered starting point
      const firstLineY = contentStartY + lineHeight; // First line baseline
      const secondLineY = firstLineY + labelMargin + lineHeight; // Second line baseline

      doc.text(firstLine, copyrightX + 10, firstLineY);
      doc.text(secondLine, copyrightX + 10, secondLineY);
    }
  }

  /* ===== Main PDF Generation Function ===== */
  async generatePDF(filename, data, lang) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    // Setup fonts
    await this.ensurePoppins(doc);
    const FONT = doc.getFontList && doc.getFontList().Poppins ? "Poppins" : "helvetica";
    const bold = () => doc.setFont(FONT, "bold");
    const reg = () => doc.setFont(FONT, "normal");
    const fonftSize = { xsm: 10, sm: 12, md: 14, lg: 16 };
    // Translation function
    const t = this.getT(lang, data?.translations);
    // Helper for verdict/tag
    const getVerdict = (type, value) => this.getVerdictTag(type, value, t);
    // Helper for safe text rendering
    const safeText = (v) => (v == null ? "—" : String(v));
    reg();

    // Page metrics
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = this.STYLE.PAGE_MARGIN;

    // Preload icons
    const IM = {};
    for (const k in this.ASSETS) {
      try {
        IM[k] = await this.imgToDataURL(this.ASSETS[k]);
      } catch {
        IM[k] = null;
      }
    }

    /* ================= PAGE 1 ================= */
    this.drawHeader(doc);
    let y = this.STYLE.CONTENT_START_Y;

    // Title - split into bold label and regular value (translated)
    bold();
    doc.setFontSize(fonftSize.lg);
    const titleLabel = t("title") || "Title: ";
    doc.text(titleLabel, M, y);
    const labelWidth = doc.getTextWidth(titleLabel);
    reg();
    doc.setFontSize(fonftSize.lg);
    doc.text(safeText(data.title), M + labelWidth, y);
    y += this.STYLE.TITLE_BOTTOM_MARGIN + 20;

    // Summary card (translated)
    let sTop = y + this.STYLE.SECTION_HEADER_SPACING,
      sY = sTop;
    const sW = W - M * 2 + this.STYLE.BOX_MARGIN * 2;
    bold();
    doc.setFontSize(this.STYLE.FONT_SIZE.SECTION_TITLE);
    doc.text(t("summary") + ":", M + this.STYLE.CARD_PADDING, sY);
    sY += this.STYLE.TITLE_CONTENT_SPACING;
    (Array.isArray(data.summary) ? data.summary : [data.summary]).forEach(
      (item) => {
        sY =
          this.tinyText(
            doc,
            safeText(item),
            M + this.STYLE.CARD_PADDING,
            sY,
            W - M * 2 - 40,
            this.STYLE.TEXT_LINE_HEIGHT
          ) + this.STYLE.TEXT_ITEM_SPACING;
      }
    );
    this.drawBox(
      doc,
      M - this.STYLE.BOX_MARGIN,
      sTop - this.STYLE.BOX_VERTICAL_OFFSET,
      sW,
      sY - sTop + this.STYLE.BOX_CONTENT_PADDING
    );
    y = sTop + (sY - sTop) + this.STYLE.SECTION_MARGIN_BOTTOM;

    // drawTestLine();

    // Percentage Breakdown (translated)
    const extendedMarginPage1 = M - this.STYLE.BOX_MARGIN;
    bold();
    doc.setFontSize(fonftSize.lg);
    doc.text(t("percentageBreakdown") || "Percentage Breakdown", extendedMarginPage1, y);
    y += this.STYLE.TITLE_BOTTOM_MARGIN;

    const colGap = this.STYLE.SMALL_GAP;
    const availableWidthPage1 = W - extendedMarginPage1 * 2; // Total width from extended margins
    const colW = (availableWidthPage1 - colGap) / 2;
    const cardH = this.STYLE.CARD_HEIGHT_DONUT;
    const leftX = extendedMarginPage1;
    const rightX = extendedMarginPage1 + colW + colGap;

    // RISK card - Two column layout (translated)
    this.drawBox(doc, leftX, y, colW, cardH);
    const riskPct = Number(data?.risk?.value ?? 0);
    // Match Analysis.jsx: Green (<=29%), Orange (30-62%), Red (63-100%)
    const riskBand = riskPct <= 29 ? "green" : riskPct <= 62 ? "orange" : "red";
    const riskColor = this.getColorFor("risk", riskPct, riskBand);
    const chartSize = 116;
    const chartX = leftX + 10;
    const chartY = y + (cardH - chartSize) / 2;
    const riskImg = this.donutPNG(riskPct, riskColor, 150);
    doc.addImage(riskImg, "PNG", chartX, chartY, chartSize, chartSize);
    const cardPadding = 10;
    const columnGap = 10;
    const rightColX = leftX + cardPadding + chartSize + columnGap;
    const rightColWidth = colW - 2 * cardPadding - chartSize - columnGap;
    const componentGap = 10;
    let rightY = y + 8;
    const rightColBottom = y + cardH - 8;
    const tagWidth = Math.min(doc.getTextWidth(t("riskLevel")) + 64, rightColWidth);
    const riskLevelTextContainerHeight = 24;
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(rightColX, rightY, tagWidth, riskLevelTextContainerHeight, 3, 3, "F");
    if (IM.risk) doc.addImage(IM.risk, "PNG", rightColX + 8, rightY + 3, 18, 18);
    doc.setTextColor(255, 255, 255);
    doc.setFont(doc.getFont().fontName, "bold");
    doc.setFontSize(12);
    const riskTextStartX = rightColX + 29;
    doc.text(t("riskLevel"), riskTextStartX, rightY + 16);
    doc.setTextColor(0, 0, 0);

    const topComponentHeight = 30; // Fixed height for risk level tag
    const bottomComponentHeight = 14; // Fixed height for status badge (10px square + some padding)

    // Component 3: Status badge with colored square - positioned at bottom (BOTTOM - FIXED, translated)
    const statusY = rightColBottom - bottomComponentHeight;
    const dotCol = this.getDotColor(riskBand);
    doc.setFillColor(...dotCol);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.roundedRect(rightColX, statusY + 2, 10, 10, 2, 2, "FD");
    reg();
    doc.setFontSize(11);
    doc.text(getVerdict("risk", riskPct), rightColX + 16, statusY + 11);

    // Component 2: General description text - takes remaining height (MIDDLE - DYNAMIC, translated)
    const textStartY = rightY + topComponentHeight + componentGap;
    const textEndY = statusY - componentGap;
    const availableTextHeight = textEndY - textStartY;
    // Use static description from translation
    this.tinyText(
      doc,
      t("riskStatic"),
      rightColX,
      textStartY,
      rightColWidth,
      14
    );

    // CLARITY card - Two column layout (translated)
    this.drawBox(doc, rightX, y, colW, cardH);
    const clarPct = Number(data?.clarity?.value ?? 0);
    // Match Analysis.jsx: Red (<=29%), Orange (30-62%), Green (63-100%)
    const clarBand = clarPct <= 29 ? "red" : clarPct <= 62 ? "orange" : "green";
    const clarColor = this.getColorFor("clarity", clarPct, clarBand);
    const clarityChartX = rightX + 10;
    const clarityChartY = y + (cardH - chartSize) / 2;
    const clarImg = this.donutPNG(clarPct, clarColor, 150);
    doc.addImage(clarImg, "PNG", clarityChartX, clarityChartY, chartSize, chartSize);
    const clarityRightColX = rightX + cardPadding + chartSize + columnGap;
    const clarityRightColWidth = colW - 2 * cardPadding - chartSize - columnGap;
    let clarityRightY = y + 8;
    const clarityRightColBottom = y + cardH - 8;
    const clarityTagWidth = Math.min(doc.getTextWidth(t("clauseClarity")) + 64, clarityRightColWidth);
    const clarityTextContainerHeight = 24;
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(clarityRightColX, clarityRightY, clarityTagWidth, clarityTextContainerHeight, 3, 3, "F");
    if (IM.clarity) doc.addImage(IM.clarity, "PNG", clarityRightColX + 8, clarityRightY + 3, 18, 18);
    doc.setTextColor(255, 255, 255);
    doc.setFont(doc.getFont().fontName, "bold");
    doc.setFontSize(12);
    const textStartX = clarityRightColX + 29;
    doc.text(t("clauseClarity"), textStartX, clarityRightY + 16);
    doc.setTextColor(0, 0, 0);

    // Component 3: Status badge with colored square - positioned at bottom (BOTTOM - FIXED, translated)
    const clarityStatusY = clarityRightColBottom - bottomComponentHeight;
    const clarityDotCol = this.getDotColor(clarBand);
    doc.setFillColor(...clarityDotCol);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.roundedRect(clarityRightColX, clarityStatusY + 2, 10, 10, 2, 2, "FD");
    reg();
    doc.setFontSize(11);
    doc.text(getVerdict("clarity", clarPct), clarityRightColX + 16, clarityStatusY + 11);

    // Component 2: General description text - takes remaining height (MIDDLE - DYNAMIC, translated)
    const clarityTextStartY = clarityRightY + topComponentHeight + componentGap;
    const clarityTextEndY = clarityStatusY - componentGap;
    const clarityAvailableTextHeight = clarityTextEndY - clarityTextStartY;
    // Use static description from translation
    this.tinyText(
      doc,
      t("clarityStatic"),
      clarityRightColX,
      clarityTextStartY,
      clarityRightColWidth,
      14
    );

    // Bars + Clauses row
    y += cardH + this.STYLE.ROW_GAP;
    const extendedMarginPage1Bars = M - this.STYLE.BOX_MARGIN;
    const availableWidthPage1Bars = W - extendedMarginPage1Bars * 2;
    const colGapBars = this.STYLE.SMALL_GAP;
    const leftXBars = extendedMarginPage1Bars;
    const rightXBars = leftXBars + (availableWidthPage1Bars - colGapBars) / 2 + colGapBars;
    const colWBars = (availableWidthPage1Bars - colGapBars) / 2;
    bold();
    doc.setFontSize(fonftSize.lg);
    doc.text(t("statisticalBars") || "Statistical Bars", leftXBars, y);

    const barRow = (label, pct, icon, xPos, yTop, width, metric) => {
      const padding = 4; // Top and bottom padding
      const rowGap = 5; // Gap between elements
      const labelHeight = 14; // Font size for label
      const barHeight = 10; // Progress bar height
      const percentageHeight = 12; // Font size for percentage

      // Calculate total container height: padding + label + gap + bar + gap + percentage + padding
      const bH =
        padding +
        labelHeight +
        rowGap +
        barHeight +
        rowGap +
        percentageHeight +
        padding;
      const bW = width;

      this.drawBox(doc, xPos, yTop, bW, bH);

      // Icon circle container (if icon exists)
      const iconSize = bH - padding * 2; // Circle height = container height minus top/bottom padding
      const iconPadding = 8; // Padding inside the circle
      const actualIconSize = iconSize - iconPadding * 2; // Icon size after padding
      let contentStartX = xPos + 8; // Reduced left padding from 16 to 8

      if (icon) {
        // Draw circle container for icon
        const iconCenterX = xPos + 8 + iconSize / 2;
        const iconCenterY = yTop + padding + iconSize / 2; // Respect top padding

        // Draw thin black circle border
        doc.setDrawColor(0, 0, 0); // Black border
        doc.setLineWidth(2); // Slightly thicker border
        doc.circle(iconCenterX, iconCenterY, iconSize / 2, "S");

        // Add icon centered in circle - using full icon space without extra padding
        const iconX = iconCenterX - (iconSize - 4) / 2; // 2px margin from border on each side
        const iconY = iconCenterY - (iconSize - 4) / 2;
        doc.addImage(icon, "PNG", iconX, iconY, iconSize - 4, iconSize - 4);

        // Adjust content start position to account for icon circle
        contentStartX = xPos + 8 + iconSize + 12; // Icon circle + gap
      }

      let innerY = yTop + padding; // Start with top padding

      // Label on top
      bold();
      // Use smaller font size for longer "Confidence to sign freely" label
      const fontSize = label === "Confidence to sign freely" ? 12 : 14;
      doc.setFontSize(fontSize);
      doc.text(label, contentStartX, innerY + labelHeight); // Add font height to Y position
      innerY += labelHeight + rowGap; // Move down by label height + gap

      // Full width bar chart in the middle (adjusted width if icon exists)
      const barColor = this.getColorFor(metric, pct);
      const barStartX = contentStartX;
      const barWidth = icon ? bW - (contentStartX - xPos) - 8 : bW - 16; // Reduced right padding from 16 to 8
      const bar = this.pillBarPNG(pct, barWidth, barHeight, barColor);
      doc.addImage(bar, "PNG", barStartX, innerY, barWidth, barHeight);
      innerY += barHeight + rowGap; // Move down by bar height + gap

      // Percentage aligned right at the bottom
      bold();
      doc.setFontSize(12);
      doc.text(`${pct}%`, xPos + bW - 8, innerY + percentageHeight - 2, {
        align: "right",
      });
    };

    // Get meter values from data or use defaults
    const meters = data.meters || {};

    let barY = y + this.STYLE.TITLE_BOTTOM_MARGIN;

    barRow(
      "Professionalism",
      Math.round(Number(meters.professionalism ?? 65)),
      IM.pro,
      leftXBars,
      barY,
      colWBars,
      "professionalism"
    );
    barY += this.STYLE.BAR_ROW_SPACING;

    barRow(
      "Favorability Index",
      Math.round(Number(meters.favorability ?? 50)),
      IM.fav,
      leftXBars,
      barY,
      colWBars,
      "favorability"
    );
    barY += this.STYLE.BAR_ROW_SPACING;

    barRow(
      "Deadline Pressure",
      Math.round(Number(meters.deadline ?? 40)),
      IM.dead,
      leftXBars,
      barY,
      colWBars,
      "deadline"
    );
    barY += this.STYLE.BAR_ROW_SPACING;

    // Right column: Main Clauses (aligned to barsTop)
    const clX = rightXBars,
      clY = y + this.STYLE.TITLE_BOTTOM_MARGIN;

    titleText("Main Clauses", clX, y);
    y += this.STYLE.TITLE_BOTTOM_MARGIN;

    let listY = clY + 26;
    const listW = colWBars;
    // Calculate height so bottom border is 20px from page bottom
    const bottomMargin = 20;
    const containerHeight = H - clY - bottomMargin;
    this.drawBox(doc, clX, clY, listW, containerHeight);
    reg();
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    const items = (Array.isArray(data.clauses) ? data.clauses : []).slice(0, 5);
    items.forEach((t, i) => {
      doc.text(`${i + 1}.`, clX + 10, listY); // Reduced left padding from 20 to 10
      listY =
        this.tinyText(doc, String(t), clX + 26, listY, listW - 32, 16) + 8; // Reduced padding: 26 instead of 36, and 32 instead of 48
    });
    doc.setTextColor(0, 0, 0);

    this.drawFooter(doc, 1, IM.logo);

    /* ================= PAGE 2 ================= */
    doc.addPage();
    this.drawHeader(doc);
    let y2 = this.STYLE.CONTENT_START_Y;

    // Potential Issues
    bold();
    doc.setFontSize(this.STYLE.FONT_SIZE.SECTION_TITLE);
    doc.text("Potential Issues that might occur", M, y2);

    let iTop = y2 + this.STYLE.SECTION_HEADER_SPACING,
      iY = iTop + this.STYLE.FONT_SIZE.TINY + this.STYLE.CARD_PADDING;

    // drawTestLine(iTop);

    const iW = W - M * 2 + this.STYLE.BOX_MARGIN * 2;
    console.log("iW", iW);

    (Array.isArray(data.issues) ? data.issues : []).forEach((it) => {
      reg();
      doc.setFontSize(this.STYLE.FONT_SIZE.TINY);
      doc.setTextColor(20, 20, 20);
      doc.text("•", M + 10, iY); // Reduced left padding from 16 to 10
      doc.setTextColor(0, 0, 0);
      iY =
        this.tinyText(
          doc,
          String(it),
          M + 24, // Reduced left padding from 30 to 24
          iY,
          W - M * 2 - 32, // Reduced total horizontal padding from 40 to 32
          this.STYLE.TEXT_LINE_HEIGHT
        ) + this.STYLE.TEXT_ITEM_SPACING;
    });
    this.drawBox(
      doc,
      M - this.STYLE.BOX_MARGIN,
      iTop, // Start box 6px above the title
      iW,
      iY - y2 // Adjust height accordingly
    );

    y2 = iTop + (iY - iTop) + this.STYLE.SECTION_MARGIN_BOTTOM + 8;

    // Smart Suggestions
    bold();
    doc.setFontSize(this.STYLE.FONT_SIZE.SECTION_TITLE);
    doc.text("Smart Suggestions", M, y2);
    const s2Top = y2 + this.STYLE.SECTION_HEADER_SPACING;

    let s2Y = s2Top + this.STYLE.FONT_SIZE.TINY + this.STYLE.CARD_PADDING;
    (Array.isArray(data.suggestions) ? data.suggestions : []).forEach(
      (s, i) => {
        const num = `${i + 1}. `;
        reg();
        doc.setFontSize(this.STYLE.FONT_SIZE.TINY);
        doc.setTextColor(20, 20, 20);
        doc.text(num, M + 10, s2Y); // Reduced left padding from 16 to 10
        doc.setTextColor(0, 0, 0);
        s2Y =
          this.tinyText(
            doc,
            String(s),
            M + 24, // Reduced left padding from 30 to 24
            s2Y,
            W - M * 2 - 32, // Reduced total horizontal padding from 40 to 32
            this.STYLE.TEXT_LINE_HEIGHT
          ) + this.STYLE.TEXT_ITEM_SPACING;
      }
    );
    const ssCardHeight = s2Y - y2 + this.STYLE.BOX_CONTENT_PADDING;

    this.drawBox(
      doc,
      M - this.STYLE.BOX_MARGIN,
      s2Top, // Start box 6px above the title
      iW,
      ssCardHeight // Adjust height accordingly
    );
    // y2 = s2Top + (s2Y - s2Top) - y + this.STYLE.SECTION_MARGIN_BOTTOM;
    y2 += ssCardHeight + this.STYLE.SECTION_MARGIN_BOTTOM;

    // Score + Confidence row
    const gap = this.STYLE.SMALL_GAP;
    const extendedMargin = M - this.STYLE.BOX_MARGIN; // Match the Smart Suggestions box margin
    const availableWidth = W - extendedMargin * 2; // Total width from extended margins
    const leftW = (availableWidth - gap) * 0.58;
    const rightW = availableWidth - gap - leftW;
    const rowH = this.STYLE.SCORE_CARD_HEIGHT;

    // Score card - Two column layout (same structure as RISK/CLARITY cards)
    this.drawBox(doc, extendedMargin, y2, leftW, rowH);

    // Use the same value and banding as clarity (match Analysis.jsx)
    const scorePct = Math.round(Number(data?.clarity?.value ?? 0));
    const scoreBand = scorePct <= 29 ? "red" : scorePct <= 62 ? "orange" : "green";
    const scoreColor = this.getColorFor("score", scorePct, scoreBand);

    // Left column: Donut chart with same style and size as other charts
    const scoreChartX = extendedMargin + 10; // Same padding as RISK/CLARITY
    const scoreChartY = y2 + (rowH - chartSize) / 2; // Vertically center the chart
    const scoreDonut = this.donutPNG(scorePct, scoreColor, 150);
    doc.addImage(
      scoreDonut,
      "PNG",
      scoreChartX,
      scoreChartY,
      chartSize,
      chartSize
    );

    // Right column: Three components taking full width and remaining height
    const scoreRightColX = extendedMargin + cardPadding + chartSize + columnGap;
    const scoreRightColWidth = leftW - 2 * cardPadding - chartSize - columnGap;

    let scoreRightY = y2 + 8; // Same top padding as other cards
    const scoreRightColBottom = y2 + rowH - 8; // Bottom of the right column with padding

    // Component 1: Score Checker tag with black container - full width (TOP - FIXED)
    const scoreTagWidth = scoreRightColWidth; // Use full width of right column
    const scoreTextContainerHeight = 24;
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(
      scoreRightColX,
      scoreRightY,
      scoreTagWidth,
      scoreTextContainerHeight,
      3,
      3,
      "F"
    );
    if (IM.score)
      doc.addImage(
        IM.score,
        "PNG",
        scoreRightColX + 8,
        scoreRightY + 3,
        18,
        18
      );
    doc.setTextColor(255, 255, 255);
    doc.setFont(doc.getFont().fontName, "bold");
    doc.setFontSize(12);
    // Change title to Final Score
    doc.text(
      t("overallScore"),
      scoreRightColX + scoreTagWidth / 2,
      scoreRightY + 16,
      {
        align: "center",
      }
    );
    doc.setTextColor(0, 0, 0);

    const scoreTopComponentHeight = 30; // Fixed height for score checker tag
    const scoreBottomComponentHeight = 14; // Fixed height for status badge (10px square + some padding)

    // Component 3: Gradient bar with indicator - positioned above status badge (BOTTOM-1 - FIXED)
    const gradientBarHeight = 42; // Height including labels
    const scoreGradientY =
      scoreRightColBottom -
      gradientBarHeight -
      scoreBottomComponentHeight -
      componentGap;

    // Gradient bar with indicator - full width of right column
    const scoreBarW = scoreRightColWidth;
    const indPos = scorePct / 100;
    const gradBar = this.gradientBarPNG(scoreBarW, 15, indPos);
    doc.addImage(gradBar, "PNG", scoreRightColX, scoreGradientY, scoreBarW, 42);

    // Scale labels below gradient bar
    reg();
    doc.setFontSize(9);
    // Use report page labels
    doc.text(t("unsafe"), scoreRightColX, scoreGradientY + 42);
    doc.text(t("notThatSafe"), scoreRightColX + scoreBarW / 2, scoreGradientY + 42, {
      align: "center",
    });
    doc.text(t("verySafe"), scoreRightColX + scoreBarW, scoreGradientY + 42, {
      align: "right",
    });

    // Component 4: Status badge with colored square - positioned at bottom (BOTTOM - FIXED)
    const scoreStatusY = scoreRightColBottom - scoreBottomComponentHeight;
    const scoreDotCol = this.getDotColor(scoreBand);
    doc.setFillColor(...scoreDotCol);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.roundedRect(scoreRightColX, scoreStatusY + 2, 10, 10, 2, 2, "FD");
    reg();
    doc.setFontSize(11);
    // Remove the label (no generally safe/unsafe/very safe for final score)
    // (Do not render any label here)

    // Component 2: Description text - takes remaining height (MIDDLE - DYNAMIC)
    const scoreTextStartY =
      scoreRightY + scoreTopComponentHeight + componentGap;
    // const scoreTextEndY = scoreGradientY - componentGap;
    // const scoreAvailableTextHeight = scoreTextEndY - scoreTextStartY;

    // Position text to fill the available middle space - full width
    // Use static description for final score
    this.tinyText(
      doc,
      t("scoreStatic"),
      scoreRightColX,
      scoreTextStartY,
      scoreRightColWidth,
      14
    );

    const confV = Math.round(Number(meters.confidence ?? 70));
    // Use label as on report page
    barRow(
      t("confidenceToSign"),
      confV,
      IM.confidence,
      extendedMargin + leftW + gap,
      y2,
      rightW,
      "confidence"
    );

    this.drawFooter(doc, 2, IM.logo);

    // Save
    doc.save((filename || "SignSense_Report") + ".pdf");

    // Open in new tab (optional)
    // const blob = doc.output("blob");
    // const url = URL.createObjectURL(blob);
    // window.open(url, "_blank");
  }
}

// Export for use in other files
if (typeof window !== "undefined") {
  window.PDFGenerator = PDFGenerator;
}

// Also support module export if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = PDFGenerator;
}
export default PDFGenerator;
// ...existing code...
//       BOX_VERTICAL_OFFSET: 18,
//       BOX_CONTENT_PADDING: 24,
//       FONT_SIZE: {
//         HEADER_LARGE: 54,
//         SECTION_TITLE: 16,
//         CONTENT: 14,
//         SMALL: 12,
//         TINY: 11,
//         MINI: 10,
//       },
//       CARD_HEIGHT_DONUT: 130,
//       BAR_HEIGHT: 80,
//       BAR_ROW_SPACING: 70,
//       SCORE_CARD_HEIGHT: 150,
//     };
//   }

//   // Translation dictionary (STATIC_TRANSLATIONS from Analysis.jsx)
//   static STATIC_TRANSLATIONS = {
//     en: {
//       summary: "Summary",
//       professionalism: "Professionalism",
//       favorability: "Favorability",
//       deadlinePressure: "Deadline Pressure",
//       potentialIssues: "Potential Issues",
//       riskLevel: "Risk Level",
//       clauseClarity: "Clause Clarity",
//       smartSuggestions: "Suggestions",
//       mainClauses: "Main Clauses",
//       overallScore: "Final Score",
//       confidenceToSign: "Confidence to Sign",
//       riskStatic: "Based on clause fairness and obligations.",
//       clarityStatic: "Reflects how easy the terms are to understand.",
//       scoreStatic: "Determines the final score.",
//       unsafe: "Unsafe",
//       notThatSafe: "Not that safe",
//       safe: "Safe",
//       verySafe: "Very Safe",
//     },
//     // ... (other languages from Analysis.jsx, omitted for brevity)
//   };

//   // Translation helper
//   getT(lang, translations) {
//     const dict = PDFGenerator.STATIC_TRANSLATIONS[lang] || PDFGenerator.STATIC_TRANSLATIONS.en;
//     return (key) => (dict[key] || (translations?.[lang]?.[key]) || key);
//   }

//   // Verdict/tag logic matching Analysis.jsx
//   getVerdictTag(type, value, t) {
//     if (type === "risk") {
//       if (value <= 29) return t("verySafe");
//       if (value <= 62) return t("notThatSafe");
//       return t("unsafe");
//     }
//     if (type === "clarity") {
//       if (value >= 63) return t("verySafe");
//       if (value >= 30) return t("notThatSafe");
//       return t("unsafe");
//     }
//     if (type === "score") {
//       if (value >= 78) return t("verySafe");
//       if (value >= 49) return t("safe");
//       if (value >= 30) return t("notThatSafe");
//       return t("unsafe");
//     }
//     return "";
//   }

//   // ...existing methods remain unchanged, but all static text and tags should use t(key) and getVerdictTag()...

//   /* ===== Font Management ===== */
//   async ensurePoppins(doc) {
//     try {
//       const list = doc.getFontList ? doc.getFontList() : {};
//       if (list && list.Poppins) return true;

//       const REG_URL =
//         "https://cdn.jsdelivr.net/gh/google/fonts/ofl/poppins/Poppins-Regular.ttf";
//       const BLD_URL =
//         "https://cdn.jsdelivr.net/gh/google/fonts/ofl/poppins/Poppins-Bold.ttf";

//       async function fetchAsBase64(url) {
//         const r = await fetch(url, { mode: "cors" });
//         if (!r.ok) throw new Error("font fetch failed " + r.status);
//         const buf = await r.arrayBuffer();
//         let binary = "";
//         const bytes = new Uint8Array(buf);
//         for (let i = 0; i < bytes.byteLength; i++)
//           binary += String.fromCharCode(bytes[i]);
//         return btoa(binary);
//       }

//       const [regB64, boldB64] = await Promise.all([
//         fetchAsBase64(REG_URL),
//         fetchAsBase64(BLD_URL),
//       ]);
//       doc.addFileToVFS("Poppins-Regular.ttf", regB64);
//       doc.addFont("Poppins-Regular.ttf", "Poppins", "normal");
//       doc.addFileToVFS("Poppins-Bold.ttf", boldB64);
//       doc.addFont("Poppins-Bold.ttf", "Poppins", "bold");
//       return true;
//     } catch (e) {
//       console.warn("Poppins failed to load — using helvetica fallback.", e);
//       return false;
//     }
//   }

//   /* ===== Image Utilities ===== */
//   async imgToDataURL(url) {
//     const res = await fetch(url);
//     if (!res.ok) throw new Error("Image fetch failed " + res.status);
//     const buf = await res.arrayBuffer();
//     let binary = "";
//     const bytes = new Uint8Array(buf);
//     for (let i = 0; i < bytes.length; i++)
//       binary += String.fromCharCode(bytes[i]);
//     return "data:image/png;base64," + btoa(binary);
//   }

//   /* ===== Color Management ===== */
//   getColorFor(metric, v, band) {
//     if (metric === "risk")
//       return v <= 25 ? "#00ff65" : v <= 58 ? "#df911a" : "#fe0000";
//     if (metric === "clarity" || metric === "score")
//       return v >= 78 ? "#00ff65" : v >= 49 ? "#df911a" : "#fe0000";
//     if (metric === "professionalism")
//       return v >= 75 ? "#00ff65" : v >= 49 ? "#df911a" : "#fe0000";
//     if (metric === "favorability")
//       return v >= 75 ? "#00ff65" : v >= 49 ? "#df911a" : "#fe0000";
//     if (metric === "deadline")
//       return v <= 35 ? "#00ff65" : v <= 68 ? "#df911a" : "#fe0000";
//     if (metric === "confidence")
//       return v >= 75 ? "#00ff65" : v >= 49 ? "#df911a" : "#fe0000";
//     return "#df911a";
//   }

//   getBadgeBgColor(band) {
//     return band === "green"
//       ? [240, 255, 240]
//       : band === "orange"
//       ? [255, 244, 230]
//       : [255, 230, 230];
//   }

//   getDotColor(band) {
//     return band === "green"
//       ? [40, 224, 112]
//       : band === "orange"
//       ? [223, 145, 26]
//       : [254, 0, 0];
//   }

//   capitalizeSafety(safety) {
//     return safety
//       .split(" ")
//       .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
//       .join(" ");
//   }

//   /* ===== Canvas-based Chart Generation ===== */
//   gradientBarPNG(width, height = 15, indPos) {
//     const c = document.createElement("canvas");
//     // Use higher resolution for better quality
//     const scale = 2;
//     c.width = width * scale;
//     c.height = (height + 20) * scale; // extra for indicator
//     const ctx = c.getContext("2d");

//     // Scale context for high-DPI rendering
//     ctx.scale(scale, scale);

//     // Enable better anti-aliasing
//     ctx.imageSmoothingEnabled = true;
//     ctx.imageSmoothingQuality = "high";

//     // Precise rounded bar rendering
//     const r = height / 2;

//     // Create precise clipping path for rounded rectangle
//     ctx.save();
//     ctx.beginPath();
//     ctx.moveTo(r, 10);
//     ctx.lineTo(width - r, 10);
//     ctx.arc(width - r, 10 + r, r, -Math.PI / 2, Math.PI / 2, false);
//     ctx.lineTo(r, 10 + height);
//     ctx.arc(r, 10 + r, r, Math.PI / 2, -Math.PI / 2, false);
//     ctx.closePath();
//     ctx.clip();

//     // Enhanced gradient with smoother transitions
//     const grad = ctx.createLinearGradient(0, 0, width, 0);
//     grad.addColorStop(0, "#fe0000"); // Pure red
//     grad.addColorStop(0.45, "#ffd166"); // Gold
//     grad.addColorStop(1, "#28e070"); // Green
//     ctx.fillStyle = grad;
//     ctx.fillRect(0, 10, width, height);

//     ctx.restore();

//     // Precise indicator line perfectly centered with the bar
//     const pos = Math.max(0, Math.min(1, indPos)) * width;
//     const extension = 2; // Same extension above and below the bar
//     ctx.strokeStyle = "#000";
//     ctx.lineWidth = 3;
//     ctx.lineCap = "round"; // Rounded line caps for better appearance
//     ctx.beginPath();
//     ctx.moveTo(pos, 10 - extension); // Start: bar top (10) minus extension
//     ctx.lineTo(pos, 10 + height + extension); // End: bar bottom (10 + height) plus extension
//     ctx.stroke();

//     return c.toDataURL("image/png");
//   }

//   donutPNG(pct, color = "#28e070", size = 150) {
//     const c = document.createElement("canvas");
//     // Use higher resolution for better quality
//     const scale = 2;
//     c.width = size * scale;
//     c.height = size * scale;
//     const ctx = c.getContext("2d");

//     // Scale context for high-DPI rendering
//     ctx.scale(scale, scale);

//     // Enable better anti-aliasing
//     ctx.imageSmoothingEnabled = true;
//     ctx.imageSmoothingQuality = "high";

//     const cx = size / 2,
//       cy = size / 2;
//     const ringW = 10; // Fixed 10px stroke width
//     const r = Math.round(size * 0.42);

//     // Background track with precise rendering
//     ctx.lineWidth = ringW;
//     ctx.strokeStyle = "#000";
//     ctx.beginPath();
//     ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
//     ctx.stroke();

//     // Value arc with enhanced precision
//     const a0 = -Math.PI / 2;
//     const a1 = a0 + (Math.max(0, Math.min(100, pct)) / 100) * Math.PI * 2;
//     ctx.lineCap = "round";
//     ctx.strokeStyle = color;
//     ctx.lineWidth = ringW;
//     ctx.beginPath();
//     ctx.arc(cx, cy, r, a0, a1, false);
//     ctx.stroke();

//     // White center with precise edges
//     ctx.fillStyle = "#fff";
//     ctx.beginPath();
//     ctx.arc(cx, cy, r - ringW + 4, 0, Math.PI * 2, false);
//     ctx.fill();

//     // % text
//     ctx.fillStyle = "#000";
//     ctx.font = `bold ${Math.round(size * 0.26)}px Poppins, Arial`;
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillText(`${Math.round(pct)}%`, cx, cy);

//     return c.toDataURL("image/png");
//   }

//   pillBarPNG(pct, width, height = 20, fill = "#9ef0b6") {
//     const c = document.createElement("canvas");
//     // Use higher resolution for better quality
//     const scale = 2;
//     c.width = width * scale;
//     c.height = height * scale;
//     const ctx = c.getContext("2d");

//     // Scale context for high-DPI rendering
//     ctx.scale(scale, scale);

//     // Enable better anti-aliasing
//     ctx.imageSmoothingEnabled = true;
//     ctx.imageSmoothingQuality = "high";

//     const r = height / 2;

//     // Draw black rounded container background with more precise rendering
//     ctx.fillStyle = "#000";
//     ctx.beginPath();
//     ctx.moveTo(r, 0);
//     ctx.lineTo(width - r, 0);
//     ctx.arc(width - r, r, r, -Math.PI / 2, Math.PI / 2);
//     ctx.lineTo(r, height);
//     ctx.arc(r, r, r, Math.PI / 2, -Math.PI / 2);
//     ctx.closePath();
//     ctx.fill();

//     // Inner progress bar with more precise insets for cleaner appearance
//     const borderWidth = 1.5; // Slightly thicker border for better definition
//     const innerWidth = width - borderWidth * 2;
//     const innerHeight = height - borderWidth * 2;
//     const innerR = innerHeight / 2;
//     const offsetX = borderWidth;
//     const offsetY = borderWidth;

//     // Create precise clipping path for inner rounded shape
//     ctx.save();
//     ctx.beginPath();
//     ctx.moveTo(offsetX + innerR, offsetY);
//     ctx.lineTo(offsetX + innerWidth - innerR, offsetY);
//     ctx.arc(
//       offsetX + innerWidth - innerR,
//       offsetY + innerR,
//       innerR,
//       -Math.PI / 2,
//       Math.PI / 2
//     );
//     ctx.lineTo(offsetX + innerR, offsetY + innerHeight);
//     ctx.arc(
//       offsetX + innerR,
//       offsetY + innerR,
//       innerR,
//       Math.PI / 2,
//       -Math.PI / 2
//     );
//     ctx.closePath();
//     ctx.clip();

//     // Fill to percentage with more precise rounded edges
//     const inner = Math.max(0, Math.min(100, pct)) / 100;
//     const progressWidth = innerWidth * inner;

//     if (progressWidth > 0) {
//       ctx.fillStyle = fill;

//       // Use sub-pixel precision for smoother curves
//       const minRadius = Math.min(innerR, progressWidth / 2);

//       ctx.beginPath();

//       if (progressWidth >= innerWidth - 0.1) {
//         // Account for floating point precision
//         // Full progress - complete rounded rectangle with precise curves
//         ctx.moveTo(offsetX + innerR, offsetY);
//         ctx.lineTo(offsetX + innerWidth - innerR, offsetY);
//         ctx.arc(
//           offsetX + innerWidth - innerR,
//           offsetY + innerR,
//           innerR,
//           -Math.PI / 2,
//           Math.PI / 2,
//           false
//         );
//         ctx.lineTo(offsetX + innerR, offsetY + innerHeight);
//         ctx.arc(
//           offsetX + innerR,
//           offsetY + innerR,
//           innerR,
//           Math.PI / 2,
//           -Math.PI / 2,
//           false
//         );
//       } else if (progressWidth > innerR * 1.8) {
//         // Partial progress with precise rounded right edge
//         const rightCenterX = offsetX + progressWidth - minRadius;
//         ctx.moveTo(offsetX + innerR, offsetY);
//         ctx.lineTo(rightCenterX, offsetY);
//         ctx.arc(
//           rightCenterX,
//           offsetY + minRadius,
//           minRadius,
//           -Math.PI / 2,
//           Math.PI / 2,
//           false
//         );
//         ctx.lineTo(offsetX + innerR, offsetY + innerHeight);
//         ctx.arc(
//           offsetX + innerR,
//           offsetY + innerR,
//           innerR,
//           Math.PI / 2,
//           -Math.PI / 2,
//           false
//         );
//       } else {
//         // Small progress - smooth left rounded edge only
//         ctx.moveTo(offsetX + innerR, offsetY);
//         ctx.lineTo(offsetX + progressWidth, offsetY);
//         ctx.lineTo(offsetX + progressWidth, offsetY + innerHeight);
//         ctx.lineTo(offsetX + innerR, offsetY + innerHeight);
//         ctx.arc(
//           offsetX + innerR,
//           offsetY + innerR,
//           innerR,
//           Math.PI / 2,
//           -Math.PI / 2,
//           false
//         );
//       }

//       ctx.closePath();
//       ctx.fill();
//     }
//     ctx.restore();

//     return c.toDataURL("image/png");
//   }

//   /* ===== PDF Layout Helpers ===== */
//   drawBox(doc, x, y, w, h) {
//     doc.setDrawColor(0, 0, 0);
//     doc.setLineWidth(this.STYLE.BOX_BORDER_WIDTH);
//     doc.roundedRect(
//       x,
//       y,
//       w,
//       h,
//       this.STYLE.BOX_CORNER_RADIUS,
//       this.STYLE.BOX_CORNER_RADIUS
//     );
//   }

//   tagWithIcon(doc, x, y, icon, label) {
//     // black chip behind title - reduced padding
//     doc.setFillColor(0, 0, 0);
//     doc.roundedRect(x, y, doc.getTextWidth(label) + 64, 24, 10, 10, "F");
//     if (icon) doc.addImage(icon, "PNG", x + 8, y + 3, 18, 18);
//     doc.setTextColor(255, 255, 255);
//     doc.setFont(doc.getFont().fontName, "bold");
//     doc.setFontSize(12);
//     doc.text(label, x + 32, y + 17);
//     doc.setTextColor(0, 0, 0);
//   }

//   tinyText(doc, txt, x, y, w, lh = 14) {
//     const lines = doc.splitTextToSize(String(txt || ""), w);
//     doc.setFont(doc.getFont().fontName, "normal");
//     doc.setFontSize(11);
//     doc.setTextColor(20, 20, 20);
//     lines.forEach((ln, i) => doc.text(ln, x, y + i * lh));
//     doc.setTextColor(0, 0, 0);
//     return y + lines.length * lh;
//   }

//   drawHeader(doc) {
//     const W = doc.internal.pageSize.getWidth();
//     const M = this.STYLE.PAGE_MARGIN;

//     doc.setFillColor(0, 0, 0);
//     doc.rect(0, 0, W, this.STYLE.HEADER_HEIGHT, "F");
//     doc.setTextColor(255, 255, 255);
//     doc.setFont(doc.getFont().fontName, "bold");
//     doc.setFontSize(this.STYLE.FONT_SIZE.HEADER_LARGE);
//     doc.text("Contract Report", M, 72);
//     doc.setFont(doc.getFont().fontName, "normal");
//     doc.setFontSize(this.STYLE.FONT_SIZE.SECTION_TITLE);
//     const dt = new Date();
//     const day = String(dt.getDate()).padStart(2, "0");
//     const month = dt.toLocaleString("en", { month: "long" });
//     const year = dt.getFullYear();
//     doc.text(`Generated on ${day} ${month} ${year}`, M, 100);
//     doc.setTextColor(0, 0, 0);
//   }

//   drawFooter(doc, page, logoImg) {
//     const W = doc.internal.pageSize.getWidth();
//     const H = doc.internal.pageSize.getHeight();
//     const M = this.STYLE.PAGE_MARGIN;

//     // Logo positioned 10px from right edge on both pages
//     // if (logoImg) doc.addImage(logoImg, "PNG", W - 50, H - 120, 40, 40);

//     // centered + fully underlined disclaimer with "not" bold
//     const parts = [
//       "Kindly keep in mind that although you might find this report helpful, this is ",
//       "not",
//       " legal advice.",
//     ];
//     doc.setFont(doc.getFont().fontName, "normal");
//     doc.setFontSize(11);
//     doc.setTextColor(0, 0, 0);
//     const y = H - 4; // Position text 4px from bottom of page
//     let w = 0;
//     parts.forEach((p) => (w += doc.getTextWidth(p)));
//     let xx = (W - w) / 2;
//     doc.setFont(doc.getFont().fontName, "normal");
//     doc.text(parts[0], xx, y);
//     xx += doc.getTextWidth(parts[0]);
//     doc.setFont(doc.getFont().fontName, "bold");
//     doc.text(parts[1], xx, y);
//     xx += doc.getTextWidth(parts[1]);
//     doc.setFont(doc.getFont().fontName, "normal");
//     doc.text(parts[2], xx, y);
//     doc.setLineWidth(0.8);
//     doc.line((W - w) / 2, y + 1, (W + w) / 2, y + 1); // Underline below text

//     // PAGE container appears on both pages - left aligned with straight left edge, rounded right edge
//     const pageContainerWidth = 100; // Same width as SignSense container
//     const containerHeight = 24; // Same height as other containers
//     doc.setFillColor(0, 0, 0);

//     // Left-aligned: straight left edge (flush with page), rounded right edge
//     // Main rectangle (straight left side)
//     doc.rect(0, H - 44, pageContainerWidth - 5, containerHeight, "F");
//     // Right rounded part
//     doc.roundedRect(
//       pageContainerWidth - 10,
//       H - 44,
//       10,
//       containerHeight,
//       5,
//       5,
//       "F"
//     );

//     doc.setTextColor(255, 255, 255);
//     doc.setFont(doc.getFont().fontName, "bold");
//     doc.setFontSize(14);
//     const pageTextY = H - 44 + containerHeight / 2 + 4;
//     doc.text(`PAGE ${page}`, pageContainerWidth / 2, pageTextY, {
//       align: "center",
//     });

//     // SignSense container - page 1: left side, page 2: right side
//     const pillW = pageContainerWidth - 20; // PAGE container width minus 20px padding (10px each side)
//     const pillX = page === 1 ? 10 : W - pillW - 10; // Page 1: 10px from left, Page 2: 10px from right
//     const pillHeight = 24; // Same height as PAGE container
//     doc.setFillColor(0, 0, 0);
//     doc.roundedRect(pillX, H - 78, pillW, pillHeight, 5, 5, "F");
//     doc.setTextColor(255, 255, 255);
//     doc.setFont(doc.getFont().fontName, "bold");
//     doc.setFontSize(10);

//     // Calculate icon and text positioning
//     const containerPadding = 3;
//     const iconSize = pillHeight - 2 * containerPadding - 4; // Smaller icon with additional 4px padding
//     const iconTextGap = 4; // Gap between icon and text

//     if (logoImg) {
//       // Calculate total content width (icon + gap + text)
//       const textWidth = doc.getTextWidth("SignSense");
//       const totalContentWidth = iconSize + iconTextGap + textWidth;

//       // Center the entire content block within container
//       const contentStartX = pillX + (pillW - totalContentWidth) / 2;

//       // Position icon on the left
//       const iconX = contentStartX;
//       const iconY = H - 78 + (pillHeight - iconSize) / 2; // Vertically center icon within container
//       doc.addImage(logoImg, "PNG", iconX, iconY, iconSize, iconSize);

//       // Position text next to icon
//       const textX = contentStartX + iconSize + iconTextGap;
//       const signSenseTextY = H - 78 + pillHeight / 2 + 4;
//       doc.text("SignSense", textX, signSenseTextY);
//     } else {
//       // No icon - center text as before
//       const signSenseTextY = H - 78 + pillHeight / 2 + 4;
//       doc.text("SignSense", pillX + pillW / 2, signSenseTextY, {
//         align: "center",
//       });
//     }

//     // Page 2 extras: © container
//     if (page === 2) {
//       // Copyright text in container with same width as PAGE container - split into 2 rows
//       const firstLine = "© 2025 SignSense.";
//       const secondLine = "All rights reserved.";

//       // Use same width as PAGE container
//       doc.setFont(doc.getFont().fontName, "normal");
//       doc.setFontSize(7); // Reduced font size for better spacing
//       const copyrightWidth = 100; // Same width as PAGE container
//       const copyrightHeight = 24; // Same as PAGE container
//       const copyrightX = W - copyrightWidth; // Align to right edge

//       // Draw right-aligned container with rounded left corners only
//       doc.setFillColor(0, 0, 0);

//       // Right-aligned: straight right edge (flush with page), rounded left edge
//       // Main rectangle (straight right side)
//       doc.rect(
//         copyrightX + 5,
//         H - 44,
//         copyrightWidth - 5,
//         copyrightHeight,
//         "F"
//       );
//       // Left rounded part
//       doc.roundedRect(copyrightX, H - 44, 10, copyrightHeight, 5, 5, "F");
//       doc.setTextColor(255, 255, 255);

//       // Position text with proper vertical centering: center both labels as a block within container
//       const labelMargin = 3; // Small margin between labels
//       const lineHeight = 6; // Height per line of text (reduced for smaller font)
//       const containerTop = H - 44;

//       // Calculate total content height (both lines + margin between them)
//       const totalContentHeight = lineHeight * 2 + labelMargin;

//       // Center the content block within the 24px container
//       const contentStartY =
//         containerTop + (copyrightHeight - totalContentHeight) / 2;

//       // Position lines from the centered starting point
//       const firstLineY = contentStartY + lineHeight; // First line baseline
//       const secondLineY = firstLineY + labelMargin + lineHeight; // Second line baseline

//       doc.text(firstLine, copyrightX + 10, firstLineY);
//       doc.text(secondLine, copyrightX + 10, secondLineY);
//     }
//   }

//   /* ===== Main PDF Generation Function ===== */
//   async generatePDF(filename, data, lang) {
//     const doc = new jsPDF({ unit: "pt", format: "a4" });

//     // Setup fonts
//     await this.ensurePoppins(doc);
//     const FONT = doc.getFontList && doc.getFontList().Poppins ? "Poppins" : "helvetica";
//     const bold = () => doc.setFont(FONT, "bold");
//     const reg = () => doc.setFont(FONT, "normal");
//     const fonftSize = { xsm: 10, sm: 12, md: 14, lg: 16 };
//     // Translation function
//     const t = this.getT(lang, data?.translations);
//     // Helper for verdict/tag
//     const getVerdict = (type, value) => this.getVerdictTag(type, value, t);
//     // Helper for safe text rendering
//     const safeText = (v) => (v == null ? "—" : String(v));
//     reg();

//     // Page metrics
//     const W = doc.internal.pageSize.getWidth();
//     const H = doc.internal.pageSize.getHeight();
//     const M = this.STYLE.PAGE_MARGIN;

//     // Preload icons
//     const IM = {};
//     for (const k in this.ASSETS) {
//       try {
//         IM[k] = await this.imgToDataURL(this.ASSETS[k]);
//       } catch {
//         IM[k] = null;
//       }
//     }

//     /* ================= PAGE 1 ================= */
//     this.drawHeader(doc);
//     let y = this.STYLE.CONTENT_START_Y;

//     // Title - split into bold label and regular value (translated)
//     bold();
//     doc.setFontSize(fonftSize.lg);
//     const titleLabel = t("title") || "Title: ";
//     doc.text(titleLabel, M, y);
//     const labelWidth = doc.getTextWidth(titleLabel);
//     reg();
//     doc.setFontSize(fonftSize.lg);
//     doc.text(safeText(data.title), M + labelWidth, y);
//     y += this.STYLE.TITLE_BOTTOM_MARGIN + 20;

//     // Summary card (translated)
//     let sTop = y + this.STYLE.SECTION_HEADER_SPACING,
//       sY = sTop;
//     const sW = W - M * 2 + this.STYLE.BOX_MARGIN * 2;
//     bold();
//     doc.setFontSize(this.STYLE.FONT_SIZE.SECTION_TITLE);
//     doc.text(t("summary") + ":", M + this.STYLE.CARD_PADDING, sY);
//     sY += this.STYLE.TITLE_CONTENT_SPACING;
//     (Array.isArray(data.summary) ? data.summary : [data.summary]).forEach(
//       (item) => {
//         sY =
//           this.tinyText(
//             doc,
//             safeText(item),
//             M + this.STYLE.CARD_PADDING,
//             sY,
//             W - M * 2 - 40,
//             this.STYLE.TEXT_LINE_HEIGHT
//           ) + this.STYLE.TEXT_ITEM_SPACING;
//       }
//     );
//     this.drawBox(
//       doc,
//       M - this.STYLE.BOX_MARGIN,
//       sTop - this.STYLE.BOX_VERTICAL_OFFSET,
//       sW,
//       sY - sTop + this.STYLE.BOX_CONTENT_PADDING
//     );
//     y = sTop + (sY - sTop) + this.STYLE.SECTION_MARGIN_BOTTOM;

//     // drawTestLine();

//     // Percentage Breakdown (translated)
//     const extendedMarginPage1 = M - this.STYLE.BOX_MARGIN;
//     bold();
//     doc.setFontSize(fonftSize.lg);
//     doc.text(t("percentageBreakdown") || "Percentage Breakdown", extendedMarginPage1, y);
//     y += this.STYLE.TITLE_BOTTOM_MARGIN;

//     const colGap = this.STYLE.SMALL_GAP;
//     const availableWidthPage1 = W - extendedMarginPage1 * 2; // Total width from extended margins
//     const colW = (availableWidthPage1 - colGap) / 2;
//     const cardH = this.STYLE.CARD_HEIGHT_DONUT;
//     const leftX = extendedMarginPage1;
//     const rightX = extendedMarginPage1 + colW + colGap;

//     // RISK card - Two column layout (translated)
//     this.drawBox(doc, leftX, y, colW, cardH);
//     const riskPct = Number(data?.risk?.value ?? 0);
//     const riskBand = riskPct <= 25 ? "green" : riskPct <= 58 ? "orange" : "red";
//     const riskColor = this.getColorFor("risk", riskPct, riskBand);
//     const chartSize = 116;
//     const chartX = leftX + 10;
//     const chartY = y + (cardH - chartSize) / 2;
//     const riskImg = this.donutPNG(riskPct, riskColor, 150);
//     doc.addImage(riskImg, "PNG", chartX, chartY, chartSize, chartSize);
//     const cardPadding = 10;
//     const columnGap = 10;
//     const rightColX = leftX + cardPadding + chartSize + columnGap;
//     const rightColWidth = colW - 2 * cardPadding - chartSize - columnGap;
//     const componentGap = 10;
//     let rightY = y + 8;
//     const rightColBottom = y + cardH - 8;
//     const tagWidth = Math.min(doc.getTextWidth(t("riskLevel")) + 64, rightColWidth);
//     const riskLevelTextContainerHeight = 24;
//     doc.setFillColor(0, 0, 0);
//     doc.roundedRect(rightColX, rightY, tagWidth, riskLevelTextContainerHeight, 3, 3, "F");
//     if (IM.risk) doc.addImage(IM.risk, "PNG", rightColX + 8, rightY + 3, 18, 18);
//     doc.setTextColor(255, 255, 255);
//     doc.setFont(doc.getFont().fontName, "bold");
//     doc.setFontSize(12);
//     const riskTextStartX = rightColX + 29;
//     doc.text(t("riskLevel"), riskTextStartX, rightY + 16);
//     doc.setTextColor(0, 0, 0);

//     const topComponentHeight = 30; // Fixed height for risk level tag
//     const bottomComponentHeight = 14; // Fixed height for status badge (10px square + some padding)

//     // Component 3: Status badge with colored square - positioned at bottom (BOTTOM - FIXED, translated)
//     const statusY = rightColBottom - bottomComponentHeight;
//     const dotCol = this.getDotColor(riskBand);
//     doc.setFillColor(...dotCol);
//     doc.setDrawColor(0, 0, 0);
//     doc.setLineWidth(1);
//     doc.roundedRect(rightColX, statusY + 2, 10, 10, 2, 2, "FD");
//     reg();
//     doc.setFontSize(11);
//     doc.text(getVerdict("risk", riskPct), rightColX + 16, statusY + 11);

//     // Component 2: General description text - takes remaining height (MIDDLE - DYNAMIC, translated)
//     const textStartY = rightY + topComponentHeight + componentGap;
//     const textEndY = statusY - componentGap;
//     const availableTextHeight = textEndY - textStartY;
//     this.tinyText(
//       doc,
//       t("riskStatic") || safeText(data.risk?.note),
//       rightColX,
//       textStartY,
//       rightColWidth,
//       14
//     );

//     // CLARITY card - Two column layout (translated)
//     this.drawBox(doc, rightX, y, colW, cardH);
//     const clarPct = Number(data?.clarity?.value ?? 0);
//     const clarBand = clarPct >= 78 ? "green" : clarPct >= 49 ? "orange" : "red";
//     const clarColor = this.getColorFor("clarity", clarPct, clarBand);
//     const clarityChartX = rightX + 10;
//     const clarityChartY = y + (cardH - chartSize) / 2;
//     const clarImg = this.donutPNG(clarPct, clarColor, 150);
//     doc.addImage(clarImg, "PNG", clarityChartX, clarityChartY, chartSize, chartSize);
//     const clarityRightColX = rightX + cardPadding + chartSize + columnGap;
//     const clarityRightColWidth = colW - 2 * cardPadding - chartSize - columnGap;
//     let clarityRightY = y + 8;
//     const clarityRightColBottom = y + cardH - 8;
//     const clarityTagWidth = Math.min(doc.getTextWidth(t("clauseClarity")) + 64, clarityRightColWidth);
//     const clarityTextContainerHeight = 24;
//     doc.setFillColor(0, 0, 0);
//     doc.roundedRect(clarityRightColX, clarityRightY, clarityTagWidth, clarityTextContainerHeight, 3, 3, "F");
//     if (IM.clarity) doc.addImage(IM.clarity, "PNG", clarityRightColX + 8, clarityRightY + 3, 18, 18);
//     doc.setTextColor(255, 255, 255);
//     doc.setFont(doc.getFont().fontName, "bold");
//     doc.setFontSize(12);
//     const textStartX = clarityRightColX + 29;
//     doc.text(t("clauseClarity"), textStartX, clarityRightY + 16);
//     doc.setTextColor(0, 0, 0);

//     // Component 3: Status badge with colored square - positioned at bottom (BOTTOM - FIXED, translated)
//     const clarityStatusY = clarityRightColBottom - bottomComponentHeight;
//     const clarityDotCol = this.getDotColor(clarBand);
//     doc.setFillColor(...clarityDotCol);
//     doc.setDrawColor(0, 0, 0);
//     doc.setLineWidth(1);
//     doc.roundedRect(clarityRightColX, clarityStatusY + 2, 10, 10, 2, 2, "FD");
//     reg();
//     doc.setFontSize(11);
//     doc.text(getVerdict("clarity", clarPct), clarityRightColX + 16, clarityStatusY + 11);

//     // Component 2: General description text - takes remaining height (MIDDLE - DYNAMIC, translated)
//     const clarityTextStartY = clarityRightY + topComponentHeight + componentGap;
//     const clarityTextEndY = clarityStatusY - componentGap;
//     const clarityAvailableTextHeight = clarityTextEndY - clarityTextStartY;
//     this.tinyText(
//       doc,
//       t("clarityStatic") || safeText(data.clarity?.note),
//       clarityRightColX,
//       clarityTextStartY,
//       clarityRightColWidth,
//       14
//     );

//     // Bars + Clauses row
//     y += cardH + this.STYLE.ROW_GAP;
//     const extendedMarginPage1Bars = M - this.STYLE.BOX_MARGIN;
//     const availableWidthPage1Bars = W - extendedMarginPage1Bars * 2;
//     const colGapBars = this.STYLE.SMALL_GAP;
//     const leftXBars = extendedMarginPage1Bars;
//     const rightXBars = leftXBars + (availableWidthPage1Bars - colGapBars) / 2 + colGapBars;
//     const colWBars = (availableWidthPage1Bars - colGapBars) / 2;
//     bold();
//     doc.setFontSize(fonftSize.lg);
//     doc.text(t("statisticalBars") || "Statistical Bars", leftXBars, y);

//     const barRow = (label, pct, icon, xPos, yTop, width, metric) => {
//       const padding = 4; // Top and bottom padding
//       const rowGap = 5; // Gap between elements
//       const labelHeight = 14; // Font size for label
//       const barHeight = 10; // Progress bar height
//       const percentageHeight = 12; // Font size for percentage

//       // Calculate total container height: padding + label + gap + bar + gap + percentage + padding
//       const bH =
//         padding +
//         labelHeight +
//         rowGap +
//         barHeight +
//         rowGap +
//         percentageHeight +
//         padding;
//       const bW = width;

//       this.drawBox(doc, xPos, yTop, bW, bH);

//       // Icon circle container (if icon exists)
//       const iconSize = bH - padding * 2; // Circle height = container height minus top/bottom padding
//       const iconPadding = 8; // Padding inside the circle
//       const actualIconSize = iconSize - iconPadding * 2; // Icon size after padding
//       let contentStartX = xPos + 8; // Reduced left padding from 16 to 8

//       if (icon) {
//         // Draw circle container for icon
//         const iconCenterX = xPos + 8 + iconSize / 2;
//         const iconCenterY = yTop + padding + iconSize / 2; // Respect top padding

//         // Draw thin black circle border
//         doc.setDrawColor(0, 0, 0); // Black border
//         doc.setLineWidth(2); // Slightly thicker border
//         doc.circle(iconCenterX, iconCenterY, iconSize / 2, "S");

//         // Add icon centered in circle - using full icon space without extra padding
//         const iconX = iconCenterX - (iconSize - 4) / 2; // 2px margin from border on each side
//         const iconY = iconCenterY - (iconSize - 4) / 2;
//         doc.addImage(icon, "PNG", iconX, iconY, iconSize - 4, iconSize - 4);

//         // Adjust content start position to account for icon circle
//         contentStartX = xPos + 8 + iconSize + 12; // Icon circle + gap
//       }

//       let innerY = yTop + padding; // Start with top padding

//       // Label on top
//       bold();
//       // Use smaller font size for longer "Confidence to sign freely" label
//       const fontSize = label === "Confidence to sign freely" ? 12 : 14;
//       doc.setFontSize(fontSize);
//       doc.text(label, contentStartX, innerY + labelHeight); // Add font height to Y position
//       innerY += labelHeight + rowGap; // Move down by label height + gap

//       // Full width bar chart in the middle (adjusted width if icon exists)
//       const barColor = this.getColorFor(metric, pct);
//       const barStartX = contentStartX;
//       const barWidth = icon ? bW - (contentStartX - xPos) - 8 : bW - 16; // Reduced right padding from 16 to 8
//       const bar = this.pillBarPNG(pct, barWidth, barHeight, barColor);
//       doc.addImage(bar, "PNG", barStartX, innerY, barWidth, barHeight);
//       innerY += barHeight + rowGap; // Move down by bar height + gap

//       // Percentage aligned right at the bottom
//       bold();
//       doc.setFontSize(12);
//       doc.text(`${pct}%`, xPos + bW - 8, innerY + percentageHeight - 2, {
//         align: "right",
//       });
//     };

//     // Get meter values from data or use defaults
//     const meters = data.meters || {};

//     let barY = y + this.STYLE.TITLE_BOTTOM_MARGIN;

//     barRow(
//       "Professionalism",
//       Math.round(Number(meters.professionalism ?? 65)),
//       IM.pro,
//       leftXBars,
//       barY,
//       colWBars,
//       "professionalism"
//     );
//     barY += this.STYLE.BAR_ROW_SPACING;

//     barRow(
//       "Favorability Index",
//       Math.round(Number(meters.favorability ?? 50)),
//       IM.fav,
//       leftXBars,
//       barY,
//       colWBars,
//       "favorability"
//     );
//     barY += this.STYLE.BAR_ROW_SPACING;

//     barRow(
//       "Deadline Pressure",
//       Math.round(Number(meters.deadline ?? 40)),
//       IM.dead,
//       leftXBars,
//       barY,
//       colWBars,
//       "deadline"
//     );
//     barY += this.STYLE.BAR_ROW_SPACING;

//     // Right column: Main Clauses (aligned to barsTop)
//     const clX = rightXBars,
//       clY = y + this.STYLE.TITLE_BOTTOM_MARGIN;

//     titleText("Main Clauses", clX, y);
//     y += this.STYLE.TITLE_BOTTOM_MARGIN;

//     let listY = clY + 26;
//     const listW = colWBars;
//     // Calculate height so bottom border is 20px from page bottom
//     const bottomMargin = 20;
//     const containerHeight = H - clY - bottomMargin;
//     this.drawBox(doc, clX, clY, listW, containerHeight);
//     reg();
//     doc.setFontSize(12);
//     doc.setTextColor(20, 20, 20);
//     const items = (Array.isArray(data.clauses) ? data.clauses : []).slice(0, 5);
//     items.forEach((t, i) => {
//       doc.text(`${i + 1}.`, clX + 10, listY); // Reduced left padding from 20 to 10
//       listY =
//         this.tinyText(doc, String(t), clX + 26, listY, listW - 32, 16) + 8; // Reduced padding: 26 instead of 36, and 32 instead of 48
//     });
//     doc.setTextColor(0, 0, 0);

//     this.drawFooter(doc, 1, IM.logo);

//     /* ================= PAGE 2 ================= */
//     doc.addPage();
//     this.drawHeader(doc);
//     let y2 = this.STYLE.CONTENT_START_Y;

//     // Potential Issues
//     bold();
//     doc.setFontSize(this.STYLE.FONT_SIZE.SECTION_TITLE);
//     doc.text("Potential Issues that might occur", M, y2);

//     let iTop = y2 + this.STYLE.SECTION_HEADER_SPACING,
//       iY = iTop + this.STYLE.FONT_SIZE.TINY + this.STYLE.CARD_PADDING;

//     // drawTestLine(iTop);

//     const iW = W - M * 2 + this.STYLE.BOX_MARGIN * 2;
//     console.log("iW", iW);

//     (Array.isArray(data.issues) ? data.issues : []).forEach((it) => {
//       reg();
//       doc.setFontSize(this.STYLE.FONT_SIZE.TINY);
//       doc.setTextColor(20, 20, 20);
//       doc.text("•", M + 10, iY); // Reduced left padding from 16 to 10
//       doc.setTextColor(0, 0, 0);
//       iY =
//         this.tinyText(
//           doc,
//           String(it),
//           M + 24, // Reduced left padding from 30 to 24
//           iY,
//           W - M * 2 - 32, // Reduced total horizontal padding from 40 to 32
//           this.STYLE.TEXT_LINE_HEIGHT
//         ) + this.STYLE.TEXT_ITEM_SPACING;
//     });
//     this.drawBox(
//       doc,
//       M - this.STYLE.BOX_MARGIN,
//       iTop, // Start box 6px above the title
//       iW,
//       iY - y2 // Adjust height accordingly
//     );

//     y2 = iTop + (iY - iTop) + this.STYLE.SECTION_MARGIN_BOTTOM + 8;

//     // Smart Suggestions
//     bold();
//     doc.setFontSize(this.STYLE.FONT_SIZE.SECTION_TITLE);
//     doc.text("Smart Suggestions", M, y2);
//     const s2Top = y2 + this.STYLE.SECTION_HEADER_SPACING;

//     let s2Y = s2Top + this.STYLE.FONT_SIZE.TINY + this.STYLE.CARD_PADDING;
//     (Array.isArray(data.suggestions) ? data.suggestions : []).forEach(
//       (s, i) => {
//         const num = `${i + 1}. `;
//         reg();
//         doc.setFontSize(this.STYLE.FONT_SIZE.TINY);
//         doc.setTextColor(20, 20, 20);
//         doc.text(num, M + 10, s2Y); // Reduced left padding from 16 to 10
//         doc.setTextColor(0, 0, 0);
//         s2Y =
//           this.tinyText(
//             doc,
//             String(s),
//             M + 24, // Reduced left padding from 30 to 24
//             s2Y,
//             W - M * 2 - 32, // Reduced total horizontal padding from 40 to 32
//             this.STYLE.TEXT_LINE_HEIGHT
//           ) + this.STYLE.TEXT_ITEM_SPACING;
//       }
//     );
//     const ssCardHeight = s2Y - y2 + this.STYLE.BOX_CONTENT_PADDING;

//     this.drawBox(
//       doc,
//       M - this.STYLE.BOX_MARGIN,
//       s2Top, // Start box 6px above the title
//       iW,
//       ssCardHeight // Adjust height accordingly
//     );
//     // y2 = s2Top + (s2Y - s2Top) - y + this.STYLE.SECTION_MARGIN_BOTTOM;
//     y2 += ssCardHeight + this.STYLE.SECTION_MARGIN_BOTTOM;

//     // Score + Confidence row
//     const gap = this.STYLE.SMALL_GAP;
//     const extendedMargin = M - this.STYLE.BOX_MARGIN; // Match the Smart Suggestions box margin
//     const availableWidth = W - extendedMargin * 2; // Total width from extended margins
//     const leftW = (availableWidth - gap) * 0.58;
//     const rightW = availableWidth - gap - leftW;
//     const rowH = this.STYLE.SCORE_CARD_HEIGHT;

//     // Score card - Two column layout (same structure as RISK/CLARITY cards)
//     this.drawBox(doc, extendedMargin, y2, leftW, rowH);

//     const scorePct = Math.round(Number(data?.clarity?.value ?? 0));
//     const scoreBand =
//       scorePct >= 78 ? "green" : scorePct >= 49 ? "orange" : "red";
//     const scoreColor = this.getColorFor("score", scorePct, scoreBand);

//     // Left column: Donut chart with same style and size as other charts
//     const scoreChartX = extendedMargin + 10; // Same padding as RISK/CLARITY
//     const scoreChartY = y2 + (rowH - chartSize) / 2; // Vertically center the chart
//     const scoreDonut = this.donutPNG(scorePct, scoreColor, 150);
//     doc.addImage(
//       scoreDonut,
//       "PNG",
//       scoreChartX,
//       scoreChartY,
//       chartSize,
//       chartSize
//     );

//     // Right column: Three components taking full width and remaining height
//     const scoreRightColX = extendedMargin + cardPadding + chartSize + columnGap;
//     const scoreRightColWidth = leftW - 2 * cardPadding - chartSize - columnGap;

//     let scoreRightY = y2 + 8; // Same top padding as other cards
//     const scoreRightColBottom = y2 + rowH - 8; // Bottom of the right column with padding

//     // Component 1: Score Checker tag with black container - full width (TOP - FIXED)
//     const scoreTagWidth = scoreRightColWidth; // Use full width of right column
//     const scoreTextContainerHeight = 24;
//     doc.setFillColor(0, 0, 0);
//     doc.roundedRect(
//       scoreRightColX,
//       scoreRightY,
//       scoreTagWidth,
//       scoreTextContainerHeight,
//       3,
//       3,
//       "F"
//     );
//     if (IM.score)
//       doc.addImage(
//         IM.score,
//         "PNG",
//         scoreRightColX + 8,
//         scoreRightY + 3,
//         18,
//         18
//       );
//     doc.setTextColor(255, 255, 255);
//     doc.setFont(doc.getFont().fontName, "bold");
//     doc.setFontSize(12);
//     doc.text(
//       "Score Checker",
//       scoreRightColX + scoreTagWidth / 2,
//       scoreRightY + 16,
//       {
//         align: "center",
//       }
//     );
//     doc.setTextColor(0, 0, 0);

//     const scoreTopComponentHeight = 30; // Fixed height for score checker tag
//     const scoreBottomComponentHeight = 14; // Fixed height for status badge (10px square + some padding)

//     // Component 3: Gradient bar with indicator - positioned above status badge (BOTTOM-1 - FIXED)
//     const gradientBarHeight = 42; // Height including labels
//     const scoreGradientY =
//       scoreRightColBottom -
//       gradientBarHeight -
//       scoreBottomComponentHeight -
//       componentGap;

//     // Gradient bar with indicator - full width of right column
//     const scoreBarW = scoreRightColWidth;
//     const indPos = scorePct / 100;
//     const gradBar = this.gradientBarPNG(scoreBarW, 15, indPos);
//     doc.addImage(gradBar, "PNG", scoreRightColX, scoreGradientY, scoreBarW, 42);

//     // Scale labels below gradient bar
//     reg();
//     doc.setFontSize(9);
//     doc.text("Unsafe", scoreRightColX, scoreGradientY + 42);
//     doc.text("Safe", scoreRightColX + scoreBarW / 2, scoreGradientY + 42, {
//       align: "center",
//     });
//     doc.text("Very Safe", scoreRightColX + scoreBarW, scoreGradientY + 42, {
//       align: "right",
//     });

//     // Component 4: Status badge with colored square - positioned at bottom (BOTTOM - FIXED)
//     const scoreStatusY = scoreRightColBottom - scoreBottomComponentHeight;
//     const scoreDotCol = this.getDotColor(scoreBand);
//     doc.setFillColor(...scoreDotCol);
//     doc.setDrawColor(0, 0, 0);
//     doc.setLineWidth(1);
//     doc.roundedRect(scoreRightColX, scoreStatusY + 2, 10, 10, 2, 2, "FD");
//     reg();
//     doc.setFontSize(11);
//     doc.text(
//       this.capitalizeSafety(
//         data?.analysis?.scoreChecker?.safety || "Generally Safe"
//       ),
//       scoreRightColX + 16,
//       scoreStatusY + 11
//     );

//     // Component 2: Description text - takes remaining height (MIDDLE - DYNAMIC)
//     const scoreTextStartY =
//       scoreRightY + scoreTopComponentHeight + componentGap;
//     // const scoreTextEndY = scoreGradientY - componentGap;
//     // const scoreAvailableTextHeight = scoreTextEndY - scoreTextStartY;

//     // Position text to fill the available middle space - full width
//     this.tinyText(
//       doc,
//       data?.analysis?.scoreChecker?.line ||
//         "The contract is nearly perfectly done.",
//       scoreRightColX,
//       scoreTextStartY,
//       scoreRightColWidth,
//       14
//     );

//     const confV = Math.round(Number(meters.confidence ?? 70));
//     barRow(
//       "Confidence to sign freely",
//       confV,
//       IM.confidence,
//       extendedMargin + leftW + gap,
//       y2,
//       rightW,
//       "confidence"
//     );

//     this.drawFooter(doc, 2, IM.logo);

//     // Save
//     doc.save((filename || "SignSense_Report") + ".pdf");

//     // Open in new tab (optional)
//     // const blob = doc.output("blob");
//     // const url = URL.createObjectURL(blob);
//     // window.open(url, "_blank");
//   }
// }

// // Export for use in other files
// if (typeof window !== "undefined") {
//   window.PDFGenerator = PDFGenerator;
// }

// // Also support module export if needed
// if (typeof module !== "undefined" && module.exports) {
//   module.exports = PDFGenerator;
// }
// export default PDFGenerator;
>>>>>>> dd2a924d29cc833dc7ce86cb77e713bafd624f64

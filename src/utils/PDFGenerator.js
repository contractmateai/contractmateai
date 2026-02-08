/**
 * PDF Generator Module for SignSense Analysis Reports
 * Handles all PDF generation functionality independently from the web interface
 * This is the proper layout version of the PDF generator
 */
import { jsPDF } from "jspdf";
import { TRANSLATIONS } from "./translations";

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

    // Use centralized translations from shared module
    this.TRANSLATIONS = TRANSLATIONS;

    // Centralized Style Configuration
    this.STYLE = {
      //Title:
      TITLE_BOTTOM_MARGIN: 10,

      // Page Layout
      PAGE_MARGIN: 30,
      HEADER_HEIGHT: 120,
      CONTENT_START_Y: 148,

      // Spacing & Margins
      SECTION_MARGIN_BOTTOM: 30,
      SECTION_HEADER_SPACING: 10,
      CARD_PADDING: 10,
      TEXT_LINE_HEIGHT: 16,
      TEXT_ITEM_SPACING: 6,
      TITLE_CONTENT_SPACING: 24,

      // Layout Gaps
      ROW_GAP: 26,
      SMALL_GAP: 14,

      // Card & Box Styling
      BOX_BORDER_WIDTH: 2,
      BOX_CORNER_RADIUS: 16,
      BOX_MARGIN: 6,
      BOX_VERTICAL_OFFSET: 18,
      BOX_CONTENT_PADDING: 24,

      // Typography
      FONT_SIZE: {
        HEADER_LARGE: 54,
        SECTION_TITLE: 16,
        CONTENT: 14,
        SMALL: 12,
        TINY: 11,
        MINI: 10,
      },

      // Content Dimensions
      CARD_HEIGHT_DONUT: 130,
      BAR_HEIGHT: 80,
      BAR_ROW_SPACING: 70,
      SCORE_CARD_HEIGHT: 150,
    };
  }

  /* ===== Font Management ===== */
  async ensureMultiLanguageFonts(doc, lang) {
    const cjkLanguages = ["zh", "ja", "ko"];
    this._isCJK = cjkLanguages.includes(lang);
    this._lang = lang;
    // Use canvas rendering for ALL non-English languages:
    // - CJK: browser fonts needed (jsPDF can't embed CJK fonts)
    // - Latin (Romanian, etc.): Poppins CDN file causes broken jsPDF metrics
    this._useCanvasText = lang !== "en";

    if (this._useCanvasText) {
      console.log(`Language '${lang}' → using canvas text rendering`);
      return "helvetica"; // Base font for non-text elements (lines, numbers)
    }

    // English: Load Poppins (works perfectly for ASCII)
    try {
      const list = doc.getFontList ? doc.getFontList() : {};
      if (list && list.Poppins) return "Poppins";

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
      return "Poppins";
    } catch (e) {
      console.warn("Poppins failed to load — using helvetica fallback.", e);
      return "helvetica";
    }
  }

  /* ===== CJK Canvas Text Rendering ===== */

  /** Get browser-native font family for canvas text rendering */
  _getCanvasFontFamily() {
    const cjkFamilies = {
      zh: '"Noto Sans SC", "Microsoft YaHei", "PingFang SC", "SimHei", "WenQuanYi Micro Hei", sans-serif',
      ja: '"Noto Sans JP", "Yu Gothic", "Hiragino Sans", "Hiragino Kaku Gothic Pro", "MS Gothic", sans-serif',
      ko: '"Noto Sans KR", "Malgun Gothic", "Apple Gothic", "NanumGothic", sans-serif',
    };
    if (cjkFamilies[this._lang]) return cjkFamilies[this._lang];
    // Latin scripts (Romanian, etc.): system fonts with full diacritics support
    return '"Segoe UI", "Helvetica Neue", "Arial", "Liberation Sans", sans-serif';
  }

  /** Wrap text for canvas rendering (CJK-aware: can break at any character) */
  _canvasWrapText(ctx, text, maxWidthPx) {
    const str = String(text || "");
    if (!str) return [""];

    const lines = [];
    let currentLine = "";

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === "\n") {
        lines.push(currentLine);
        currentLine = "";
        continue;
      }
      const testLine = currentLine + char;
      if (
        ctx.measureText(testLine).width > maxWidthPx &&
        currentLine.length > 0
      ) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines.length > 0 ? lines : [""];
  }

  /** Render text as a canvas image and add to PDF. Returns new Y position. */
  _canvasText(doc, text, x, y, options = {}) {
    const {
      fontSize = 11,
      bold = false,
      maxWidth = 400,
      lineHeight = 14,
      color = "#141414",
      align = "left",
    } = options;

    const str = String(text || "");
    if (!str.trim()) return y;

    const scale = 3; // High-DPI for crisp rendering
    const fontFamily = this._getCanvasFontFamily();
    const fontWeight = bold ? "bold" : "normal";
    const font = `${fontWeight} ${fontSize * scale}px ${fontFamily}`;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = font;

    // Wrap text
    const maxWidthPx = maxWidth * scale;
    const lines = this._canvasWrapText(ctx, str, maxWidthPx);

    // Size canvas
    const lineHeightPx = lineHeight * scale;
    canvas.width = Math.ceil(maxWidthPx);
    canvas.height = Math.ceil(lines.length * lineHeightPx + scale * 2);

    // Render text on canvas
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = "top";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    lines.forEach((line, i) => {
      if (align === "center") {
        const w = ctx.measureText(line).width;
        ctx.fillText(line, (maxWidthPx - w) / 2, i * lineHeightPx);
      } else if (align === "right") {
        const w = ctx.measureText(line).width;
        ctx.fillText(line, maxWidthPx - w, i * lineHeightPx);
      } else {
        ctx.fillText(line, 0, i * lineHeightPx);
      }
    });

    // Add rendered text as image to PDF
    const imgWidth = canvas.width / scale;
    const imgHeight = canvas.height / scale;
    doc.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      x,
      y,
      imgWidth,
      imgHeight,
    );

    return y + lines.length * lineHeight;
  }

  /** Universal text method: uses jsPDF for English, canvas for other languages */
  _text(doc, text, x, y, options = {}) {
    if (this._useCanvasText) {
      return this._canvasText(doc, text, x, y, options);
    }
    // Latin: use native jsPDF text
    if (options.bold) doc.setFont(doc.getFont().fontName, "bold");
    else doc.setFont(doc.getFont().fontName, "normal");
    if (options.fontSize) doc.setFontSize(options.fontSize);
    if (options.color) {
      const c = options.color;
      if (typeof c === "string" && c.startsWith("#")) {
        const r = parseInt(c.slice(1, 3), 16);
        const g = parseInt(c.slice(3, 5), 16);
        const b = parseInt(c.slice(5, 7), 16);
        doc.setTextColor(r, g, b);
      }
    }
    const jOpts = {};
    if (options.maxWidth) jOpts.maxWidth = options.maxWidth;
    if (options.align) jOpts.align = options.align;
    doc.text(String(text || ""), x, y, jOpts);
    return y + (options.lineHeight || options.fontSize || 14);
  }

  /* ===== Image Utilities ===== */
  async imgToDataURL(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Image fetch failed " + res.status);
      const buf = await res.arrayBuffer();
      let binary = "";
      const bytes = new Uint8Array(buf);
      for (let i = 0; i < bytes.length; i++)
        binary += String.fromCharCode(bytes[i]);
      return "data:image/png;base64," + btoa(binary);
    } catch (e) {
      console.warn(`Failed to load image: ${url}`, e);
      return null;
    }
  }

  /* ===== Color Management ===== */
  getColorFor(metric, v, band) {
    if (metric === "risk")
      return v <= 25 ? "#00ff65" : v <= 58 ? "#df911a" : "#fe0000";
    if (metric === "clarity" || metric === "score")
      return v >= 78 ? "#00ff65" : v >= 49 ? "#df911a" : "#fe0000";
    if (metric === "professionalism")
      return v >= 75 ? "#00ff65" : v >= 49 ? "#df911a" : "#fe0000";
    if (metric === "favorability")
      return v >= 75 ? "#00ff65" : v >= 49 ? "#df911a" : "#fe0000";
    if (metric === "deadline")
      return v <= 35 ? "#00ff65" : v <= 68 ? "#df911a" : "#fe0000";
    if (metric === "confidence")
      return v >= 75 ? "#00ff65" : v >= 49 ? "#df911a" : "#fe0000";
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
    const scale = 2;
    c.width = width * scale;
    c.height = (height + 20) * scale;
    const ctx = c.getContext("2d");

    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const r = height / 2;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(r, 10);
    ctx.lineTo(width - r, 10);
    ctx.arc(width - r, 10 + r, r, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(r, 10 + height);
    ctx.arc(r, 10 + r, r, Math.PI / 2, -Math.PI / 2, false);
    ctx.closePath();
    ctx.clip();

    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, "#fe0000");
    grad.addColorStop(0.45, "#ffd166");
    grad.addColorStop(1, "#28e070");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 10, width, height);

    ctx.restore();

    const pos = Math.max(0, Math.min(1, indPos)) * width;
    const extension = 2;
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(pos, 10 - extension);
    ctx.lineTo(pos, 10 + height + extension);
    ctx.stroke();

    return c.toDataURL("image/png");
  }

  donutPNG(pct, color = "#28e070", size = 150) {
    const c = document.createElement("canvas");
    const scale = 2;
    c.width = size * scale;
    c.height = size * scale;
    const ctx = c.getContext("2d");

    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cx = size / 2,
      cy = size / 2;
    const ringW = 10;
    const r = Math.round(size * 0.42);

    ctx.lineWidth = ringW;
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
    ctx.stroke();

    const a0 = -Math.PI / 2;
    const a1 = a0 + (Math.max(0, Math.min(100, pct)) / 100) * Math.PI * 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = ringW;
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0, a1, false);
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(cx, cy, r - ringW + 4, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.fillStyle = "#000";
    // Use system fonts for canvas (percentage numbers work in any font)
    ctx.font = `bold ${Math.round(size * 0.26)}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${Math.round(pct)}%`, cx, cy);

    return c.toDataURL("image/png");
  }

  pillBarPNG(pct, width, height = 20, fill = "#9ef0b6") {
    const c = document.createElement("canvas");
    const scale = 2;
    c.width = width * scale;
    c.height = height * scale;
    const ctx = c.getContext("2d");

    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const r = height / 2;

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(width - r, 0);
    ctx.arc(width - r, r, r, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(r, height);
    ctx.arc(r, r, r, Math.PI / 2, -Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    const borderWidth = 1.5;
    const innerWidth = width - borderWidth * 2;
    const innerHeight = height - borderWidth * 2;
    const innerR = innerHeight / 2;
    const offsetX = borderWidth;
    const offsetY = borderWidth;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(offsetX + innerR, offsetY);
    ctx.lineTo(offsetX + innerWidth - innerR, offsetY);
    ctx.arc(
      offsetX + innerWidth - innerR,
      offsetY + innerR,
      innerR,
      -Math.PI / 2,
      Math.PI / 2,
    );
    ctx.lineTo(offsetX + innerR, offsetY + innerHeight);
    ctx.arc(
      offsetX + innerR,
      offsetY + innerR,
      innerR,
      Math.PI / 2,
      -Math.PI / 2,
    );
    ctx.closePath();
    ctx.clip();

    const inner = Math.max(0, Math.min(100, pct)) / 100;
    const progressWidth = innerWidth * inner;

    if (progressWidth > 0) {
      ctx.fillStyle = fill;

      const minRadius = Math.min(innerR, progressWidth / 2);

      ctx.beginPath();

      if (progressWidth >= innerWidth - 0.1) {
        ctx.moveTo(offsetX + innerR, offsetY);
        ctx.lineTo(offsetX + innerWidth - innerR, offsetY);
        ctx.arc(
          offsetX + innerWidth - innerR,
          offsetY + innerR,
          innerR,
          -Math.PI / 2,
          Math.PI / 2,
          false,
        );
        ctx.lineTo(offsetX + innerR, offsetY + innerHeight);
        ctx.arc(
          offsetX + innerR,
          offsetY + innerR,
          innerR,
          Math.PI / 2,
          -Math.PI / 2,
          false,
        );
      } else if (progressWidth > innerR * 1.8) {
        const rightCenterX = offsetX + progressWidth - minRadius;
        ctx.moveTo(offsetX + innerR, offsetY);
        ctx.lineTo(rightCenterX, offsetY);
        ctx.arc(
          rightCenterX,
          offsetY + minRadius,
          minRadius,
          -Math.PI / 2,
          Math.PI / 2,
          false,
        );
        ctx.lineTo(offsetX + innerR, offsetY + innerHeight);
        ctx.arc(
          offsetX + innerR,
          offsetY + innerR,
          innerR,
          Math.PI / 2,
          -Math.PI / 2,
          false,
        );
      } else {
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
          false,
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
      this.STYLE.BOX_CORNER_RADIUS,
    );
  }

  tinyText(doc, txt, x, y, w, lh = 14) {
    if (this._useCanvasText) {
      return this._canvasText(doc, txt, x, y, {
        fontSize: 11,
        maxWidth: w,
        lineHeight: lh,
        color: "#141414",
      });
    }
    // Set font and size BEFORE splitTextToSize so it calculates correctly
    doc.setFont(doc.getFont().fontName, "normal");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);

    // splitTextToSize uses the current font settings to calculate line breaks
    const lines = doc.splitTextToSize(String(txt || ""), w);

    // Render each line without maxWidth (already split)
    lines.forEach((ln, i) => {
      doc.text(ln, x, y + i * lh);
    });

    doc.setTextColor(0, 0, 0);
    return y + lines.length * lh;
  }

  /** Measure text width — uses canvas for CJK, jsPDF for Latin */
  _measureText(doc, text, fontSize, bold = false) {
    if (this._useCanvasText) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const weight = bold ? "bold" : "normal";
      ctx.font = `${weight} ${fontSize}px ${this._getCanvasFontFamily()}`;
      return ctx.measureText(String(text || "")).width;
    }
    doc.setFont(doc.getFont().fontName, bold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    return doc.getTextWidth(String(text || ""));
  }

  drawHeader(doc, tr) {
    const W = doc.internal.pageSize.getWidth();
    const M = this.STYLE.PAGE_MARGIN;

    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, W, this.STYLE.HEADER_HEIGHT, "F");

    if (this._useCanvasText) {
      // Non-English: render header text via canvas
      // Auto-scale title font size to fit within header
      const maxTitleWidth = W - M * 2;
      let titleFontSize = this.STYLE.FONT_SIZE.HEADER_LARGE; // 54
      let measured = this._measureText(
        doc,
        tr.contractReport,
        titleFontSize,
        true,
      );
      while (measured > maxTitleWidth && titleFontSize > 24) {
        titleFontSize -= 2;
        measured = this._measureText(
          doc,
          tr.contractReport,
          titleFontSize,
          true,
        );
      }
      // Position title near top of header
      const titleY = 18;
      const titleEndY = this._canvasText(doc, tr.contractReport, M, titleY, {
        fontSize: titleFontSize,
        bold: true,
        maxWidth: maxTitleWidth,
        lineHeight: titleFontSize * 1.15,
        color: "#ffffff",
      });
      // Position date below title with gap
      const dt = new Date();
      const day = String(dt.getDate()).padStart(2, "0");
      const month = dt.toLocaleString("en", { month: "long" });
      const year = dt.getFullYear();
      const dateY = Math.max(titleEndY + 4, 85);
      this._canvasText(
        doc,
        `${tr.generatedOn} ${day} ${month} ${year}`,
        M,
        dateY,
        {
          fontSize: this.STYLE.FONT_SIZE.SECTION_TITLE,
          maxWidth: maxTitleWidth,
          lineHeight: this.STYLE.FONT_SIZE.SECTION_TITLE * 1.3,
          color: "#ffffff",
        },
      );
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFont(doc.getFont().fontName, "bold");
      doc.setFontSize(this.STYLE.FONT_SIZE.HEADER_LARGE);
      doc.text(tr.contractReport, M, 72);
      doc.setFont(doc.getFont().fontName, "normal");
      doc.setFontSize(this.STYLE.FONT_SIZE.SECTION_TITLE);
      const dt = new Date();
      const day = String(dt.getDate()).padStart(2, "0");
      const month = dt.toLocaleString("en", { month: "long" });
      const year = dt.getFullYear();
      doc.text(`${tr.generatedOn} ${day} ${month} ${year}`, M, 100);
    }
    doc.setTextColor(0, 0, 0);
  }

  drawFooter(doc, page, logoImg, tr) {
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = this.STYLE.PAGE_MARGIN;

    const parts = [tr.notLegalAdvice, tr.not, tr.legalAdviceEnd];
    const y = H - 4;

    if (this._useCanvasText) {
      // Non-English: render disclaimer as single canvas text line, centered
      const fullDisclaimer = parts.join("");
      const disclaimerWidth = this._measureText(doc, fullDisclaimer, 11, false);
      const disclaimerX = (W - disclaimerWidth) / 2;
      this._canvasText(doc, fullDisclaimer, disclaimerX, y - 10, {
        fontSize: 11,
        maxWidth: disclaimerWidth + 10,
        lineHeight: 14,
        color: "#000000",
      });
      doc.setLineWidth(0.8);
      doc.line(disclaimerX, y + 1, disclaimerX + disclaimerWidth, y + 1);
    } else {
      doc.setFont(doc.getFont().fontName, "normal");
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
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
      doc.line((W - w) / 2, y + 1, (W + w) / 2, y + 1);
    }

    const pageContainerWidth = 100;
    const containerHeight = 24;
    doc.setFillColor(0, 0, 0);

    doc.rect(0, H - 44, pageContainerWidth - 5, containerHeight, "F");
    doc.roundedRect(
      pageContainerWidth - 10,
      H - 44,
      10,
      containerHeight,
      5,
      5,
      "F",
    );

    doc.setTextColor(255, 255, 255);
    doc.setFont(doc.getFont().fontName, "bold");
    doc.setFontSize(14);
    const pageTextY = H - 44 + containerHeight / 2 + 4;
    if (this._useCanvasText) {
      this._canvasText(doc, `${tr.page} ${page}`, 0, H - 44 + 4, {
        fontSize: 14,
        bold: true,
        maxWidth: pageContainerWidth,
        lineHeight: 16,
        color: "#ffffff",
        align: "center",
      });
    } else {
      doc.text(`${tr.page} ${page}`, pageContainerWidth / 2, pageTextY, {
        align: "center",
      });
    }

    const pillW = pageContainerWidth - 20;
    const pillX = page === 1 ? 10 : W - pillW - 10;
    const pillHeight = 24;
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(pillX, H - 78, pillW, pillHeight, 5, 5, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont(doc.getFont().fontName, "bold");
    doc.setFontSize(10);

    const containerPadding = 3;
    const iconSize = pillHeight - 2 * containerPadding - 4;
    const iconTextGap = 4;

    if (logoImg) {
      const textWidth = doc.getTextWidth("SignSense");
      const totalContentWidth = iconSize + iconTextGap + textWidth;
      const contentStartX = pillX + (pillW - totalContentWidth) / 2;

      const iconX = contentStartX;
      const iconY = H - 78 + (pillHeight - iconSize) / 2;
      doc.addImage(logoImg, "PNG", iconX, iconY, iconSize, iconSize);

      const textX = contentStartX + iconSize + iconTextGap;
      const signSenseTextY = H - 78 + pillHeight / 2 + 4;
      doc.text("SignSense", textX, signSenseTextY);
    } else {
      const signSenseTextY = H - 78 + pillHeight / 2 + 4;
      doc.text("SignSense", pillX + pillW / 2, signSenseTextY, {
        align: "center",
      });
    }

    if (page === 2) {
      const firstLine = "© 2025 SignSense.";
      const secondLine = "All rights reserved.";

      doc.setFont(doc.getFont().fontName, "normal");
      doc.setFontSize(7);
      const copyrightWidth = 100;
      const copyrightHeight = 24;
      const copyrightX = W - copyrightWidth;

      doc.setFillColor(0, 0, 0);

      doc.rect(
        copyrightX + 5,
        H - 44,
        copyrightWidth - 5,
        copyrightHeight,
        "F",
      );
      doc.roundedRect(copyrightX, H - 44, 10, copyrightHeight, 5, 5, "F");
      doc.setTextColor(255, 255, 255);

      const labelMargin = 3;
      const lineHeight = 6;
      const containerTop = H - 44;

      const totalContentHeight = lineHeight * 2 + labelMargin;

      const contentStartY =
        containerTop + (copyrightHeight - totalContentHeight) / 2;

      const firstLineY = contentStartY + lineHeight;
      const secondLineY = firstLineY + labelMargin + lineHeight;

      doc.text(firstLine, copyrightX + 10, firstLineY);
      doc.text(secondLine, copyrightX + 10, secondLineY);
    }
  }

  /* ===== Main PDF Generation Function ===== */
  async generatePDF(filename, data, lang) {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    // Load appropriate font based on language
    const FONT = await this.ensureMultiLanguageFonts(doc, lang);

    // Get translations for the selected language (fallback to English)
    const tr = this.TRANSLATIONS[lang] || this.TRANSLATIONS.en;

    const fonftSize = {
      xsm: 10,
      sm: 12,
      md: 14,
      lg: 16,
    };

    const bold = () => doc.setFont(FONT, "bold");
    const reg = () => doc.setFont(FONT, "normal");
    const useCanvas = this._useCanvasText;

    // CJK-aware title text renderer
    const titleText = (
      text,
      xPos,
      yPos,
      size = fonftSize.lg,
      isBold = true,
    ) => {
      if (useCanvas) {
        this._canvasText(doc, text, xPos, yPos - size + 2, {
          fontSize: size,
          bold: isBold,
          maxWidth: W - xPos - this.STYLE.PAGE_MARGIN,
          lineHeight: size * 1.3,
          color: "#000000",
        });
      } else {
        if (isBold) bold();
        else reg();
        doc.setFontSize(size);
        doc.text(text, xPos, yPos);
      }
    };

    // CJK-aware single-line label renderer (for black-on-white labels)
    const labelText = (
      text,
      xPos,
      yPos,
      size = 11,
      isBold = false,
      color = "#000000",
    ) => {
      if (useCanvas) {
        this._canvasText(doc, text, xPos, yPos - size + 2, {
          fontSize: size,
          bold: isBold,
          maxWidth: W - xPos - 10,
          lineHeight: size * 1.3,
          color,
        });
      } else {
        if (isBold) bold();
        else reg();
        doc.setFontSize(size);
        if (color && color !== "#000000") {
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          doc.setTextColor(r, g, b);
        }
        doc.text(String(text), xPos, yPos);
        doc.setTextColor(0, 0, 0);
      }
    };

    reg();

    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = this.STYLE.PAGE_MARGIN;

    const IM = {};
    for (const k in this.ASSETS) {
      try {
        IM[k] = await this.imgToDataURL(this.ASSETS[k]);
      } catch {
        IM[k] = null;
      }
    }

    /* ================= PAGE 1 ================= */
    this.drawHeader(doc, tr);
    let y = this.STYLE.CONTENT_START_Y;

    if (useCanvas) {
      // Non-English: render title label + value together via canvas
      this._canvasText(
        doc,
        (tr.title || "Title") + ": " + (data.title || "—"),
        M,
        y - fonftSize.lg + 2,
        {
          fontSize: fonftSize.lg,
          bold: true,
          maxWidth: W - M * 2,
          lineHeight: fonftSize.lg * 1.4,
          color: "#000000",
        },
      );
    } else {
      bold();
      doc.setFontSize(fonftSize.lg);
      doc.text(tr.title + ": ", M, y);
      const labelWidth = doc.getTextWidth(tr.title + ": ");
      reg();
      doc.setFontSize(fonftSize.lg);
      doc.text(data.title || "—", M + labelWidth, y);
    }
    y += this.STYLE.TITLE_BOTTOM_MARGIN + 20;

    let sTop = y + this.STYLE.SECTION_HEADER_SPACING,
      sY = sTop;
    const sW = W - M * 2 + this.STYLE.BOX_MARGIN * 2;
    if (useCanvas) {
      this._canvasText(
        doc,
        tr.summaryOfContract,
        M + this.STYLE.CARD_PADDING,
        sY - this.STYLE.FONT_SIZE.SECTION_TITLE + 2,
        {
          fontSize: this.STYLE.FONT_SIZE.SECTION_TITLE,
          bold: true,
          maxWidth: W - M * 2 - this.STYLE.CARD_PADDING * 2,
          lineHeight: this.STYLE.FONT_SIZE.SECTION_TITLE * 1.3,
          color: "#000000",
        },
      );
    } else {
      bold();
      doc.setFontSize(this.STYLE.FONT_SIZE.SECTION_TITLE);
      doc.text(tr.summaryOfContract, M + this.STYLE.CARD_PADDING, sY, {
        maxWidth: W - M * 2 - this.STYLE.CARD_PADDING * 2,
      });
    }
    sY += this.STYLE.TITLE_CONTENT_SPACING;
    (Array.isArray(data.summary) ? data.summary : [data.summary]).forEach(
      (item) => {
        sY =
          this.tinyText(
            doc,
            String(item),
            M + this.STYLE.CARD_PADDING,
            sY,
            W - M * 2 - this.STYLE.CARD_PADDING * 2,
            this.STYLE.TEXT_LINE_HEIGHT,
          ) + this.STYLE.TEXT_ITEM_SPACING;
      },
    );
    this.drawBox(
      doc,
      M - this.STYLE.BOX_MARGIN,
      sTop - this.STYLE.BOX_VERTICAL_OFFSET,
      sW,
      sY - sTop + this.STYLE.BOX_CONTENT_PADDING,
    );
    y = sTop + (sY - sTop) + this.STYLE.SECTION_MARGIN_BOTTOM;

    titleText(tr.percentageBreakdown, M - this.STYLE.BOX_MARGIN, y);
    y += this.STYLE.TITLE_BOTTOM_MARGIN;

    const colGap = this.STYLE.SMALL_GAP;
    const availableWidthPage1 = W - (M - this.STYLE.BOX_MARGIN) * 2;
    const colW = (availableWidthPage1 - colGap) / 2;
    const cardH = this.STYLE.CARD_HEIGHT_DONUT;
    const leftX = M - this.STYLE.BOX_MARGIN;
    const rightX = leftX + colW + colGap;

    this.drawBox(doc, leftX, y, colW, cardH);

    const riskPct = Number(data?.risk?.value ?? 0);
    const riskBand = riskPct <= 25 ? "green" : riskPct <= 58 ? "orange" : "red";
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

    const tagWidth = useCanvas
      ? Math.min(
          this._measureText(doc, tr.riskLevel, 12, true) + 64,
          rightColWidth,
        )
      : Math.min(doc.getTextWidth(tr.riskLevel) + 64, rightColWidth);

    const riskLevelTextContainerHeight = 24;
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(
      rightColX,
      rightY,
      tagWidth,
      riskLevelTextContainerHeight,
      3,
      3,
      "F",
    );
    if (IM.risk)
      doc.addImage(IM.risk, "PNG", rightColX + 8, rightY + 3, 18, 18);
    const riskTextStartX = rightColX + 29;
    if (useCanvas) {
      this._canvasText(doc, tr.riskLevel, riskTextStartX, rightY + 5, {
        fontSize: 12,
        bold: true,
        maxWidth: tagWidth - 35,
        lineHeight: 14,
        color: "#ffffff",
      });
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFont(doc.getFont().fontName, "bold");
      doc.setFontSize(12);
      doc.text(tr.riskLevel, riskTextStartX, rightY + 16);
    }
    doc.setTextColor(0, 0, 0);

    const topComponentHeight = 30;
    const bottomComponentHeight = 14;

    const statusY = rightColBottom - bottomComponentHeight;
    const dotCol = this.getDotColor(riskBand);
    doc.setFillColor(...dotCol);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.roundedRect(rightColX, statusY + 2, 10, 10, 2, 2, "FD");
    reg();
    doc.setFontSize(11);
    labelText(
      this.capitalizeSafety(data.risk?.safety || ""),
      rightColX + 16,
      statusY + 11,
      11,
    );

    const textStartY = rightY + topComponentHeight + componentGap;
    const textEndY = statusY - componentGap;

    this.tinyText(
      doc,
      data.risk?.note || "",
      rightColX,
      textStartY,
      rightColWidth,
      14,
    );

    this.drawBox(doc, rightX, y, colW, cardH);

    const clarPct = Number(data?.clarity?.value ?? 0);
    const clarBand = clarPct >= 78 ? "green" : clarPct >= 49 ? "orange" : "red";
    const clarColor = this.getColorFor("clarity", clarPct, clarBand);

    const clarityChartX = rightX + 10;
    const clarityChartY = y + (cardH - chartSize) / 2;
    const clarImg = this.donutPNG(clarPct, clarColor, 150);
    doc.addImage(
      clarImg,
      "PNG",
      clarityChartX,
      clarityChartY,
      chartSize,
      chartSize,
    );

    const clarityRightColX = rightX + cardPadding + chartSize + columnGap;
    const clarityRightColWidth = colW - 2 * cardPadding - chartSize - columnGap;

    let clarityRightY = y + 8;
    const clarityRightColBottom = y + cardH - 8;

    const clarityTagWidth = useCanvas
      ? Math.min(
          this._measureText(doc, tr.clauseClarity, 12, true) + 64,
          clarityRightColWidth,
        )
      : Math.min(doc.getTextWidth(tr.clauseClarity) + 64, clarityRightColWidth);
    const clarityTextContainerHeight = 24;
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(
      clarityRightColX,
      clarityRightY,
      clarityTagWidth,
      clarityTextContainerHeight,
      3,
      3,
      "F",
    );
    if (IM.clarity)
      doc.addImage(
        IM.clarity,
        "PNG",
        clarityRightColX + 8,
        clarityRightY + 3,
        18,
        18,
      );
    const clarityTextStartX = clarityRightColX + 29;
    if (useCanvas) {
      this._canvasText(
        doc,
        tr.clauseClarity,
        clarityTextStartX,
        clarityRightY + 5,
        {
          fontSize: 12,
          bold: true,
          maxWidth: clarityTagWidth - 35,
          lineHeight: 14,
          color: "#ffffff",
        },
      );
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFont(doc.getFont().fontName, "bold");
      doc.setFontSize(12);
      doc.text(tr.clauseClarity, clarityTextStartX, clarityRightY + 16);
    }
    doc.setTextColor(0, 0, 0);

    const clarityStatusY = clarityRightColBottom - bottomComponentHeight;
    const clarityDotCol = this.getDotColor(clarBand);
    doc.setFillColor(...clarityDotCol);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.roundedRect(clarityRightColX, clarityStatusY + 2, 10, 10, 2, 2, "FD");
    reg();
    doc.setFontSize(11);
    labelText(
      this.capitalizeSafety(data.clarity?.safety || ""),
      clarityRightColX + 16,
      clarityStatusY + 11,
      11,
    );

    const clarityTextStartY = clarityRightY + topComponentHeight + componentGap;

    this.tinyText(
      doc,
      data.clarity?.note || "",
      clarityRightColX,
      clarityTextStartY,
      clarityRightColWidth,
      14,
    );

    y += cardH + this.STYLE.ROW_GAP;

    const extendedMarginPage1Bars = M - this.STYLE.BOX_MARGIN;
    const availableWidthPage1Bars = W - extendedMarginPage1Bars * 2;
    const colGapBars = this.STYLE.SMALL_GAP;
    const leftXBars = extendedMarginPage1Bars;
    const rightXBars =
      leftXBars + (availableWidthPage1Bars - colGapBars) / 2 + colGapBars;
    const colWBars = (availableWidthPage1Bars - colGapBars) / 2;

    titleText(tr.statisticalBars, leftXBars, y);

    const barRow = (label, pct, icon, xPos, yTop, width, metric) => {
      const padding = 4;
      const rowGap = 5;
      const labelHeight = 14;
      const barHeight = 10;
      const percentageHeight = 12;

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

      const iconSize = bH - padding * 2;
      const iconPadding = 8;
      const actualIconSize = iconSize - iconPadding * 2;
      let contentStartX = xPos + 8;

      if (icon) {
        const iconCenterX = xPos + 8 + iconSize / 2;
        const iconCenterY = yTop + padding + iconSize / 2;

        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(2);
        doc.circle(iconCenterX, iconCenterY, iconSize / 2, "S");

        const iconX = iconCenterX - (iconSize - 4) / 2;
        const iconY = iconCenterY - (iconSize - 4) / 2;
        doc.addImage(icon, "PNG", iconX, iconY, iconSize - 4, iconSize - 4);

        contentStartX = xPos + 8 + iconSize + 12;
      }

      let innerY = yTop + padding;

      const fontSize = label === "Confidence to sign freely" ? 12 : 14;
      if (useCanvas) {
        this._canvasText(doc, label, contentStartX, innerY, {
          fontSize,
          bold: true,
          maxWidth: bW - (contentStartX - xPos) - 8,
          lineHeight: fontSize * 1.2,
          color: "#000000",
        });
      } else {
        bold();
        doc.setFontSize(fontSize);
        doc.text(label, contentStartX, innerY + labelHeight);
      }
      innerY += labelHeight + rowGap;

      const barColor = this.getColorFor(metric, pct);
      const barStartX = contentStartX;
      const barWidth = icon ? bW - (contentStartX - xPos) - 8 : bW - 16;
      const bar = this.pillBarPNG(pct, barWidth, barHeight, barColor);
      doc.addImage(bar, "PNG", barStartX, innerY, barWidth, barHeight);
      innerY += barHeight + rowGap;

      bold();
      doc.setFontSize(12);
      doc.text(`${pct}%`, xPos + bW - 8, innerY + percentageHeight - 2, {
        align: "right",
      });
    };

    const meters = data.meters || {};

    let barY = y + this.STYLE.TITLE_BOTTOM_MARGIN;

    barRow(
      tr.professionalism,
      Math.round(Number(meters.professionalism ?? 65)),
      IM.pro,
      leftXBars,
      barY,
      colWBars,
      "professionalism",
    );
    barY += this.STYLE.BAR_ROW_SPACING;

    barRow(
      tr.favorabilityIndex,
      Math.round(Number(meters.favorability ?? 50)),
      IM.fav,
      leftXBars,
      barY,
      colWBars,
      "favorability",
    );
    barY += this.STYLE.BAR_ROW_SPACING;

    barRow(
      tr.deadlinePressure,
      Math.round(Number(meters.deadline ?? 40)),
      IM.dead,
      leftXBars,
      barY,
      colWBars,
      "deadline",
    );
    barY += this.STYLE.BAR_ROW_SPACING;

    const clX = rightXBars,
      clY = y + this.STYLE.TITLE_BOTTOM_MARGIN;

    titleText(tr.mainClauses, clX, y);
    y += this.STYLE.TITLE_BOTTOM_MARGIN;

    let listY = clY + 26;
    const listW = colWBars;
    const bottomMargin = 20;
    const containerHeight = H - clY - bottomMargin;
    this.drawBox(doc, clX, clY, listW, containerHeight);
    reg();
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    const items = (Array.isArray(data.clauses) ? data.clauses : []).slice(0, 5);
    items.forEach((t, i) => {
      labelText(`${i + 1}.`, clX + 10, listY, 12);
      listY =
        this.tinyText(doc, String(t), clX + 26, listY, listW - 32, 16) + 8;
    });
    doc.setTextColor(0, 0, 0);

    this.drawFooter(doc, 1, IM.logo, tr);

    /* ================= PAGE 2 ================= */
    doc.addPage();
    this.drawHeader(doc, tr);
    let y2 = this.STYLE.CONTENT_START_Y;

    titleText(tr.potentialIssues, M, y2, this.STYLE.FONT_SIZE.SECTION_TITLE);

    let iTop = y2 + this.STYLE.SECTION_HEADER_SPACING,
      iY = iTop + this.STYLE.FONT_SIZE.TINY + this.STYLE.CARD_PADDING;

    const iW = W - M * 2 + this.STYLE.BOX_MARGIN * 2;

    (Array.isArray(data.issues) ? data.issues : []).forEach((it) => {
      reg();
      doc.setFontSize(this.STYLE.FONT_SIZE.TINY);
      doc.setTextColor(20, 20, 20);
      doc.text("•", M + 10, iY);
      doc.setTextColor(0, 0, 0);
      iY =
        this.tinyText(
          doc,
          String(it),
          M + 24,
          iY,
          W - M * 2 - 32,
          this.STYLE.TEXT_LINE_HEIGHT,
        ) + this.STYLE.TEXT_ITEM_SPACING;
    });
    this.drawBox(doc, M - this.STYLE.BOX_MARGIN, iTop, iW, iY - y2);

    y2 = iTop + (iY - iTop) + this.STYLE.SECTION_MARGIN_BOTTOM + 8;

    titleText(tr.smartSuggestions, M, y2, this.STYLE.FONT_SIZE.SECTION_TITLE);
    const s2Top = y2 + this.STYLE.SECTION_HEADER_SPACING;

    let s2Y = s2Top + this.STYLE.FONT_SIZE.TINY + this.STYLE.CARD_PADDING;
    (Array.isArray(data.suggestions) ? data.suggestions : []).forEach(
      (s, i) => {
        const num = `${i + 1}. `;
        reg();
        doc.setFontSize(this.STYLE.FONT_SIZE.TINY);
        doc.setTextColor(20, 20, 20);
        doc.text(num, M + 10, s2Y);
        doc.setTextColor(0, 0, 0);
        s2Y =
          this.tinyText(
            doc,
            String(s),
            M + 24,
            s2Y,
            W - M * 2 - 32,
            this.STYLE.TEXT_LINE_HEIGHT,
          ) + this.STYLE.TEXT_ITEM_SPACING;
      },
    );
    const ssCardHeight = s2Y - y2 + this.STYLE.BOX_CONTENT_PADDING;

    this.drawBox(doc, M - this.STYLE.BOX_MARGIN, s2Top, iW, ssCardHeight);
    y2 += ssCardHeight + this.STYLE.SECTION_MARGIN_BOTTOM;

    const gap = this.STYLE.SMALL_GAP;
    const extendedMargin = M - this.STYLE.BOX_MARGIN;
    const availableWidth = W - extendedMargin * 2;
    const leftW = (availableWidth - gap) * 0.58;
    const rightW = availableWidth - gap - leftW;
    const rowH = this.STYLE.SCORE_CARD_HEIGHT;

    this.drawBox(doc, extendedMargin, y2, leftW, rowH);

    const scorePct = Math.round(
      Number(data?.analysis?.scoreChecker?.value ?? 0),
    );
    const scoreBand =
      scorePct >= 78 ? "green" : scorePct >= 49 ? "orange" : "red";
    const scoreColor = this.getColorFor("score", scorePct, scoreBand);

    const scoreChartX = extendedMargin + 10;
    const scoreChartY = y2 + (rowH - chartSize) / 2;
    const scoreDonut = this.donutPNG(scorePct, scoreColor, 150);
    doc.addImage(
      scoreDonut,
      "PNG",
      scoreChartX,
      scoreChartY,
      chartSize,
      chartSize,
    );

    const scoreRightColX = extendedMargin + cardPadding + chartSize + columnGap;
    const scoreRightColWidth = leftW - 2 * cardPadding - chartSize - columnGap;

    let scoreRightY = y2 + 8;
    const scoreRightColBottom = y2 + rowH - 8;

    const scoreTagWidth = scoreRightColWidth;
    const scoreTextContainerHeight = 24;
    doc.setFillColor(0, 0, 0);
    doc.roundedRect(
      scoreRightColX,
      scoreRightY,
      scoreTagWidth,
      scoreTextContainerHeight,
      3,
      3,
      "F",
    );
    if (IM.score)
      doc.addImage(
        IM.score,
        "PNG",
        scoreRightColX + 8,
        scoreRightY + 3,
        18,
        18,
      );
    if (useCanvas) {
      this._canvasText(doc, tr.scoreChecker, scoreRightColX, scoreRightY + 5, {
        fontSize: 12,
        bold: true,
        maxWidth: scoreTagWidth,
        lineHeight: 14,
        color: "#ffffff",
        align: "center",
      });
    } else {
      doc.setTextColor(255, 255, 255);
      doc.setFont(doc.getFont().fontName, "bold");
      doc.setFontSize(12);
      doc.text(
        tr.scoreChecker,
        scoreRightColX + scoreTagWidth / 2,
        scoreRightY + 16,
        { align: "center" },
      );
    }
    doc.setTextColor(0, 0, 0);

    const scoreTopComponentHeight = 30;
    const scoreBottomComponentHeight = 14;

    const gradientBarHeight = 42;
    const scoreGradientY =
      scoreRightColBottom -
      gradientBarHeight -
      scoreBottomComponentHeight -
      componentGap;

    const scoreBarW = scoreRightColWidth;
    const indPos = scorePct / 100;
    const gradBar = this.gradientBarPNG(scoreBarW, 15, indPos);
    doc.addImage(gradBar, "PNG", scoreRightColX, scoreGradientY, scoreBarW, 42);

    reg();
    doc.setFontSize(9);
    if (useCanvas) {
      this._canvasText(doc, tr.unsafe, scoreRightColX, scoreGradientY + 34, {
        fontSize: 9,
        maxWidth: scoreBarW / 3,
        lineHeight: 10,
        color: "#000000",
      });
      this._canvasText(
        doc,
        tr.safe,
        scoreRightColX + scoreBarW / 3,
        scoreGradientY + 34,
        {
          fontSize: 9,
          maxWidth: scoreBarW / 3,
          lineHeight: 10,
          color: "#000000",
          align: "center",
        },
      );
      this._canvasText(
        doc,
        tr.verySafe,
        scoreRightColX + (scoreBarW * 2) / 3,
        scoreGradientY + 34,
        {
          fontSize: 9,
          maxWidth: scoreBarW / 3,
          lineHeight: 10,
          color: "#000000",
          align: "right",
        },
      );
    } else {
      doc.text(tr.unsafe, scoreRightColX, scoreGradientY + 42);
      doc.text(tr.safe, scoreRightColX + scoreBarW / 2, scoreGradientY + 42, {
        align: "center",
      });
      doc.text(tr.verySafe, scoreRightColX + scoreBarW, scoreGradientY + 42, {
        align: "right",
      });
    }

    const scoreStatusY = scoreRightColBottom - scoreBottomComponentHeight;
    const scoreDotCol = this.getDotColor(scoreBand);
    doc.setFillColor(...scoreDotCol);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    doc.roundedRect(scoreRightColX, scoreStatusY + 2, 10, 10, 2, 2, "FD");
    reg();
    doc.setFontSize(11);
    labelText(
      this.capitalizeSafety(data?.analysis?.scoreChecker?.safety || ""),
      scoreRightColX + 16,
      scoreStatusY + 11,
      11,
    );

    const scoreTextStartY =
      scoreRightY + scoreTopComponentHeight + componentGap;

    this.tinyText(
      doc,
      data?.analysis?.scoreChecker?.line ||
        "The contract is nearly perfectly done.",
      scoreRightColX,
      scoreTextStartY,
      scoreRightColWidth,
      14,
    );

    const confV = Math.round(Number(meters.confidence ?? 70));
    barRow(
      tr.confidenceToSign,
      confV,
      IM.confidence,
      extendedMargin + leftW + gap,
      y2,
      rightW,
      "confidence",
    );

    this.drawFooter(doc, 2, IM.logo, tr);

    doc.save((filename || "SignSense_Report") + ".pdf");
  }
}

export default PDFGenerator;

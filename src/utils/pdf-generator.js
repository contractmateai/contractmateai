

import { jsPDF } from "jspdf";

class PDFGenerator {
  constructor() {
    this.doc = null;
  }

  // Helper: Draw a rounded rectangle box
  drawBox(x, y, w, h) {
    this.doc.setLineWidth(1.2);
    this.doc.roundedRect(x, y, w, h, 10, 10);
  }


  // Helper: Draw a bold section title
  sectionTitle(text, x, y) {
    if (text == null) return;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(14);
    this.doc.text(String(text), x, y);
  }

  // Helper: Draw a normal label
  label(text, x, y) {
    if (text == null) return;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(12);
    this.doc.text(String(text), x, y);
  }

  // Helper: Draw a small label
  smallLabel(text, x, y) {
    if (text == null) return;
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.text(String(text), x, y);
  }

  // Helper: Draw a bold label
  boldLabel(text, x, y) {
    if (text == null) return;
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.doc.text(String(text), x, y);
  }

  // Helper: Draw a footer
  drawFooter(pageNum, totalPages, lang, copyrightYear) {
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const pageHeight = this.doc.internal.pageSize.getHeight();
    // Page number
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(12);
    this.doc.text(`PAGE ${pageNum}`, 20, pageHeight - 30);
    // SignSense logo text (right)
    this.doc.setFontSize(14);
    this.doc.text("SignSense", pageWidth - 60, pageHeight - 30, { align: "right" });
    // Legal advice disclaimer (center, bottom)
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.text(
      lang === "es"
        ? "Tenga en cuenta que aunque este informe puede ser útil, esto no es asesoría legal."
        : "Kindly keep in mind that although you might find this report helpful, this is not legal advice.",
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );
    // Copyright (page 2+)
    if (pageNum > 1) {
      this.doc.setFontSize(9);
      this.doc.text(
        `© ${copyrightYear} SignSense.\nAll rights reserved.`,
        pageWidth - 60,
        pageHeight - 50,
        { align: "right" }
      );
    }
  }



  // Helper: Canvas-based donut chart (from public/pdf-generator.js)
  donutPNG(pct, color = "#28e070", size = 150) {
    const c = document.createElement("canvas");
    const scale = 2;
    c.width = size * scale;
    c.height = size * scale;
    const ctx = c.getContext("2d");
    ctx.scale(scale, scale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const cx = size / 2, cy = size / 2;
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
    ctx.font = `bold ${Math.round(size * 0.26)}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${Math.round(pct)}%`, cx, cy);
    return c.toDataURL("image/png");
  }


  // Helper: Draw a horizontal bar (as a placeholder)
  drawBar(x, y, percent, color, label, valueLabel) {
    this.doc.setDrawColor(0);
    this.doc.setFillColor(255, 255, 255);
    this.doc.roundedRect(x, y, 90, 14, 7, 7, "FD");
    this.doc.setFillColor(color[0], color[1], color[2]);
    this.doc.roundedRect(x, y, 90 * percent / 100, 14, 7, 7, "F");
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.text(String(label), x - 5, y + 11, { align: "right" });
    this.doc.setFont("helvetica", "bold");
    this.doc.text(String(valueLabel), x + 95, y + 11);
  }

  // Main PDF generation function
  async generatePDF(filename, data, lang = "en") {
    this.doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = this.doc.internal.pageSize.getWidth();
    const copyrightYear = new Date().getFullYear();
    // --- PAGE 1 ---
    // Header
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(38);
    this.doc.text(
      lang === "es" ? "Informe de Contrato" : "Contract Report",
      pageWidth / 2,
      70,
      { align: "center" }
    );
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(16);
    const dateStr = new Date().toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    this.doc.text(
      (lang === "es" ? "Generado el " : "Generated on ") + dateStr,
      pageWidth / 2,
      100,
      { align: "center" }
    );

    // Title
    this.boldLabel((lang === "es" ? "Título: " : "Title: ") + (data.title || "—"), 60, 140);

    // Summary box
    this.sectionTitle(lang === "es" ? "Resumen del Contrato:" : "Summary of Contract:", 60, 170);
    this.drawBox(50, 155, pageWidth - 100, 60 + 16 * (data.summary?.length || 1));
    this.label(Array.isArray(data.summary) ? data.summary.join("\n") : data.summary, 60, 195);


    // Percentage Breakdown
    this.sectionTitle(lang === "es" ? "Desglose porcentual" : "Percentage Breakdown", 60, 250);
    // Risk donut (canvas-based)
    const riskImg = this.donutPNG(data.risk?.value ?? 0, "#28e070", 116);
    this.doc.addImage(riskImg, "PNG", 60, 260, 116, 116);
    this.label(data.risk?.note || "", 60, 320);
    // Clarity donut (canvas-based)
    const clarImg = this.donutPNG(data.clarity?.value ?? 0, "#28e070", 116);
    this.doc.addImage(clarImg, "PNG", 180, 260, 116, 116);
    this.label(data.clarity?.note || "", 180, 320);

    // Statistical Bars
    this.sectionTitle(lang === "es" ? "Barras estadísticas" : "Statistical Bars", 60, 370);
    this.drawBar(60, 390, data.meters?.professionalism ?? 0, [0, 200, 0], lang === "es" ? "Profesionalismo" : "Professionalism", `${data.meters?.professionalism ?? 0}%`);
    this.drawBar(60, 410, data.meters?.favorability ?? 0, [255, 180, 0], lang === "es" ? "Índice de Favorabilidad" : "Favorability Index", `${data.meters?.favorability ?? 0}%`);
    this.drawBar(60, 430, data.meters?.deadline ?? 0, [0, 200, 0], lang === "es" ? "Presión de Plazo" : "Deadline Pressure", `${data.meters?.deadline ?? 0}%`);

    // Main Clauses
    this.sectionTitle(lang === "es" ? "Cláusulas principales" : "Main Clauses", 300, 370);
    let clauseY = 390;
    (Array.isArray(data.clauses) ? data.clauses : []).forEach((cl, i) => {
      this.label(`${i + 1}. ${cl}`, 300, clauseY);
      clauseY += 18;
    });

    // Footer
    this.drawFooter(1, 2, lang, copyrightYear);

    // --- PAGE 2 ---
    this.doc.addPage();
    // Header
    this.doc.setFont("helvetica", "bold");
    this.doc.setFontSize(38);
    this.doc.text(
      lang === "es" ? "Informe de Contrato" : "Contract Report",
      pageWidth / 2,
      70,
      { align: "center" }
    );
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(16);
    this.doc.text(
      (lang === "es" ? "Generado el " : "Generated on ") + dateStr,
      pageWidth / 2,
      100,
      { align: "center" }
    );

    // Potential Issues
    this.sectionTitle(lang === "es" ? "Posibles problemas que pueden ocurrir" : "Potential Issues that might occur", 60, 140);
    this.drawBox(50, 150, pageWidth - 100, 60 + 16 * (data.issues?.length || 1));
    let issueY = 170;
    (Array.isArray(data.issues) ? data.issues : []).forEach((it) => {
      this.label("• " + it, 60, issueY);
      issueY += 16;
    });

    // Smart Suggestions
    this.sectionTitle(lang === "es" ? "Sugerencias inteligentes" : "Smart Suggestions", 60, issueY + 20);
    this.drawBox(50, issueY + 30, pageWidth - 100, 60 + 16 * (data.suggestions?.length || 1));
    let suggY = issueY + 50;
    (Array.isArray(data.suggestions) ? data.suggestions : []).forEach((s, i) => {
      this.label(`${i + 1}. ${s}`, 60, suggY);
      suggY += 16;
    });

    // Score Checker (Donut)
    const scoreImg = this.donutPNG(data.clarity?.value ?? 0, "#28e070", 116);
    this.doc.addImage(scoreImg, "PNG", 60, suggY + 20, 116, 116);
    this.label(data.analysis?.scoreChecker?.line || "", 60, suggY + 80);
    // Confidence Bar
    this.drawBar(200, suggY + 20, data.meters?.confidence ?? 0, [0, 200, 0], lang === "es" ? "Confianza para firmar libremente" : "Confidence to sign freely", `${data.meters?.confidence ?? 0}%`);

    // Footer
    this.drawFooter(2, 2, lang, copyrightYear);

    // Save
    this.doc.save((filename || "SignSense_Report") + ".pdf");
  }
}

export default PDFGenerator;

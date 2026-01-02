import { jsPDF } from "jspdf";
// PDF Generator Module for SignSense Analysis Reports
// Handles all PDF generation functionality independently from the web interface

class PDFGenerator {
  constructor() {
    // Initialize jsPDF document
    this.doc = new jsPDF();
  }

  addTitle(title) {
    // Set font size for the title
    this.doc.setFontSize(22);
    // Add title to the document
    this.doc.text(title, 10, 10);
  }

  addText(text) {
    // Set font size for the text
    this.doc.setFontSize(12);
    // Add text to the document
    this.doc.text(text, 10, 20);
  }

  savePDF(filename) {
    // Save the generated PDF with the given filename
    this.doc.save(filename);
  }

  // ...existing methods...
}

export default PDFGenerator;

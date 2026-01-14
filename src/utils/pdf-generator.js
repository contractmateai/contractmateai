
import { jsPDF } from "jspdf";

class PDFGenerator {
  async generatePDF(filename, data, lang) {
    this.doc = new jsPDF();
    this.addTitle("SignSense Contract Analysis");
    this.addText(`Language: ${lang}`);
    this.addText(`Email: ${data.email || "-"}`);
    this.savePDF(`${filename}.pdf`);
  }
  constructor() {
    this.doc = new jsPDF();
  }
  addTitle(title) {
    this.doc.setFontSize(22);
    this.doc.text(title, 10, 10);
  }
  addText(text) {
    this.doc.setFontSize(12);
    this.doc.text(text, 10, 20);
  }
  savePDF(filename) {
    this.doc.save(filename);
  }
}

export default PDFGenerator;

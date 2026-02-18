import type jsPDF from "jspdf";

// Brand colors
const GOLD = [197, 160, 89] as const; // #C5A059
const DARK = [10, 10, 10] as const;
const WHITE = [255, 255, 255] as const;
const ZINC400 = [161, 161, 170] as const;
const ZINC600 = [82, 82, 91] as const;

const MARGIN = 20;
const PAGE_WIDTH = 210; // A4
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

// Lazy singleton — jsPDF + autotable only loaded when PDF is actually generated (~112KB deferred)
let jsPDFCtor: typeof import("jspdf").default | null = null;
async function loadJsPDF() {
  if (!jsPDFCtor) {
    const [mod] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
    jsPDFCtor = mod.default;
  }
  return jsPDFCtor;
}

export async function createBasePDF(title: string, subtitle?: string): Promise<jsPDF> {
  const JsPDF = await loadJsPDF();
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  // Header background
  doc.setFillColor(...DARK);
  doc.rect(0, 0, PAGE_WIDTH, 40, "F");

  // Gold accent line
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, 38, PAGE_WIDTH - MARGIN, 38);

  // Title
  doc.setTextColor(...GOLD);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("PORTAL LUSITANO", MARGIN, 14);

  doc.setTextColor(...WHITE);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(title, MARGIN, 26);

  if (subtitle) {
    doc.setTextColor(...ZINC400);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, MARGIN, 33);
  }

  // Date on right
  doc.setTextColor(...ZINC600);
  doc.setFontSize(8);
  const date = new Date().toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(date, PAGE_WIDTH - MARGIN, 14, { align: "right" });

  return doc;
}

export function addSection(doc: jsPDF, title: string, y: number): number {
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.setTextColor(...GOLD);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(title.toUpperCase(), MARGIN, y);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y + 2, MARGIN + 40, y + 2);
  return y + 10;
}

export function addKeyValue(doc: jsPDF, key: string, value: string, y: number): number {
  if (y > 275) {
    doc.addPage();
    y = 20;
  }
  doc.setTextColor(...ZINC400);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(key, MARGIN, y);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.text(value, MARGIN + 65, y);
  return y + 6;
}

export function addProgressBar(
  doc: jsPDF,
  label: string,
  value: number,
  max: number,
  y: number,
  color: readonly [number, number, number] = GOLD
): number {
  if (y > 270) {
    doc.addPage();
    y = 20;
  }
  const barWidth = 80;
  const barX = MARGIN + 65;
  const pct = Math.min(value / max, 1);

  doc.setTextColor(...ZINC400);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(label, MARGIN, y);

  // Background
  doc.setFillColor(40, 40, 40);
  doc.roundedRect(barX, y - 3, barWidth, 4, 1, 1, "F");

  // Fill
  if (pct > 0) {
    doc.setFillColor(...color);
    doc.roundedRect(barX, y - 3, barWidth * pct, 4, 1, 1, "F");
  }

  // Value text
  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(`${value}/${max}`, barX + barWidth + 3, y);

  return y + 8;
}

export function addFooter(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer line
    doc.setDrawColor(...ZINC600);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, 282, PAGE_WIDTH - MARGIN, 282);

    // Footer text
    doc.setTextColor(...ZINC600);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("portal-lusitano.pt", MARGIN, 287);
    doc.text(
      "Este documento e uma estimativa e nao substitui avaliacao profissional.",
      MARGIN,
      291
    );
    doc.text(`Pagina ${i}/${pageCount}`, PAGE_WIDTH - MARGIN, 287, {
      align: "right",
    });
  }
}

export function addWatermark(doc: jsPDF, text: string = "VERSAO GRATUITA"): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    // Diagonal watermark - use GState for opacity if available
    const centerX = PAGE_WIDTH / 2;
    const centerY = 297 / 2;
    doc.text(text, centerX, centerY, {
      align: "center",
      angle: 45,
    });
  }
}

export function addText(
  doc: jsPDF,
  text: string,
  y: number,
  options?: {
    size?: number;
    color?: readonly [number, number, number];
    bold?: boolean;
    maxWidth?: number;
  }
): number {
  if (y > 275) {
    doc.addPage();
    y = 20;
  }
  const { size = 9, color = WHITE, bold = false, maxWidth = CONTENT_WIDTH } = options || {};
  doc.setTextColor(...color);
  doc.setFontSize(size);
  doc.setFont("helvetica", bold ? "bold" : "normal");
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, MARGIN, y);
  return y + lines.length * (size * 0.5) + 2;
}

export { GOLD, DARK, WHITE, ZINC400, ZINC600, MARGIN, CONTENT_WIDTH, PAGE_WIDTH };

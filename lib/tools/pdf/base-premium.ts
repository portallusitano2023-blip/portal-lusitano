import type jsPDF from "jspdf";

// ─── Brand Colors ─────────────────────────────────────────────────────────────
export const GOLD: [number, number, number] = [197, 160, 89];
export const GOLD_DIM: [number, number, number] = [140, 110, 60];
export const DARK_BG: [number, number, number] = [10, 10, 10];
export const CARD_BG: [number, number, number] = [18, 18, 18];
export const CARD_BG2: [number, number, number] = [25, 25, 25];
export const WHITE: [number, number, number] = [255, 255, 255];
export const ZINC300: [number, number, number] = [212, 212, 216];
export const ZINC400: [number, number, number] = [161, 161, 170];
export const ZINC600: [number, number, number] = [82, 82, 91];
export const GREEN: [number, number, number] = [34, 197, 94];
export const AMBER: [number, number, number] = [251, 146, 60];
export const RED: [number, number, number] = [239, 68, 68];

// ─── Layout Constants ─────────────────────────────────────────────────────────
export const MARGIN = 20;
export const PAGE_W = 210;
export const PAGE_H = 297;
export const CONTENT_W = PAGE_W - MARGIN * 2; // 170mm

// ─── jsPDF Loader ─────────────────────────────────────────────────────────────
let jsPDFCtor: typeof import("jspdf").default | null = null;
export async function loadJsPDF() {
  if (!jsPDFCtor) {
    const [mod] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
    jsPDFCtor = mod.default;
  }
  return jsPDFCtor;
}

export async function createPremiumPDF(): Promise<jsPDF> {
  const JsPDF = await loadJsPDF();
  return new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
}

// ─── Text Safety ─────────────────────────────────────────────────────────────
/** Strip diacritics for Helvetica font compatibility in jsPDF */
export function safe(s: string | number | null | undefined): string {
  if (s == null) return "";
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7F]/g, "?");
}

// ─── Page Helpers ─────────────────────────────────────────────────────────────

/** Fill entire page with dark background */
export function fillPageBg(doc: jsPDF): void {
  doc.setFillColor(...DARK_BG);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
}

/** Gold top bar with PORTAL LUSITANO branding (cover page) */
export function addCoverTopBar(doc: jsPDF): void {
  // Solid gold bar
  doc.setFillColor(...GOLD);
  doc.rect(0, 0, PAGE_W, 10, "F");
  // Brand name in black on gold
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("PORTAL LUSITANO", PAGE_W / 2, 7, { align: "center" });
}

/** Header bar for inner pages (pages 2+) */
export function addPageHeader(doc: jsPDF, title: string, pageLabel: string): void {
  // Dark header bg
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, PAGE_W, 22, "F");
  // Gold bottom accent line
  doc.setFillColor(...GOLD);
  doc.rect(0, 22, PAGE_W, 0.5, "F");
  // Portal Lusitano label
  doc.setTextColor(...GOLD);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("PORTAL LUSITANO", MARGIN, 9);
  // Page title
  doc.setTextColor(...WHITE);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(safe(title), MARGIN, 17);
  // Page label (right)
  doc.setTextColor(...ZINC400);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(safe(pageLabel), PAGE_W - MARGIN, 17, { align: "right" });
}

// ─── Hero Value Card ──────────────────────────────────────────────────────────

export interface HeroConfig {
  value: number;
  min: number;
  max: number;
  horseName: string;
}

/** Large value hero card with gold border — the centrepiece of the cover */
export function addValueHero(doc: jsPDF, cfg: HeroConfig, y: number): number {
  const { value, min, max, horseName } = cfg;
  const cardH = 50;
  const cardX = MARGIN;
  const cardW = CONTENT_W;

  // Card background
  doc.setFillColor(...CARD_BG);
  doc.roundedRect(cardX, y, cardW, cardH, 3, 3, "F");

  // Gold border
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.7);
  doc.roundedRect(cardX, y, cardW, cardH, 3, 3, "S");

  // Left gold accent strip
  doc.setFillColor(...GOLD);
  doc.roundedRect(cardX, y, 3, cardH, 1.5, 1.5, "F");

  // "VALOR ESTIMADO" label
  doc.setTextColor(...ZINC400);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("VALOR ESTIMADO", cardX + 9, y + 10);

  // Horse name (gold, below label)
  if (horseName) {
    doc.setTextColor(...GOLD);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    const nameLines = doc.splitTextToSize(safe(horseName.toUpperCase()), 90);
    doc.text(nameLines[0] || safe(horseName.toUpperCase()), cardX + 9, y + 18);
  }

  // Main EUR value (large)
  const valueStr = value.toLocaleString("pt-PT");
  doc.setTextColor(...WHITE);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(valueStr, cardX + 9, y + 36);

  // EUR suffix in gold
  doc.setTextColor(...GOLD);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("EUR", cardX + 9, y + 44);

  // Right side: range
  doc.setTextColor(...ZINC400);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("Intervalo de mercado", cardX + cardW - 5, y + 18, { align: "right" });

  const rangeStr = `${min.toLocaleString("pt-PT")} - ${max.toLocaleString("pt-PT")} EUR`;
  doc.setTextColor(...ZINC300);
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.text(rangeStr, cardX + cardW - 5, y + 29, { align: "right" });

  doc.setTextColor(...ZINC600);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("com base nos dados fornecidos", cardX + cardW - 5, y + 36, { align: "right" });

  return y + cardH + 7;
}

// ─── Metrics Row ──────────────────────────────────────────────────────────────

export interface MetricBox {
  label: string;
  value: string;
}

/** Row of 4 metric indicator boxes */
export function addMetricsRow(doc: jsPDF, metrics: MetricBox[], y: number): number {
  const count = metrics.length;
  const gap = 3;
  const boxW = (CONTENT_W - gap * (count - 1)) / count;
  const boxH = 22;

  metrics.forEach((m, i) => {
    const x = MARGIN + i * (boxW + gap);

    // Box background
    doc.setFillColor(...CARD_BG2);
    doc.roundedRect(x, y, boxW, boxH, 2, 2, "F");

    // Gold top accent bar
    doc.setFillColor(...GOLD);
    doc.roundedRect(x, y, boxW, 1.5, 0.5, 0.5, "F");

    // Value text
    doc.setTextColor(...WHITE);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(safe(m.value), x + boxW / 2, y + 13, { align: "center" });

    // Label text
    doc.setTextColor(...ZINC400);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(safe(m.label), x + boxW / 2, y + 19.5, { align: "center" });
  });

  return y + boxH + 6;
}

// ─── Training Level ───────────────────────────────────────────────────────────

const TRAINING_LEVELS = [
  { key: "iniciacao", label: "Iniciacao" },
  { key: "elementar", label: "Elementar" },
  { key: "medio", label: "Medio" },
  { key: "avancado", label: "Avancado" },
  { key: "alto_escolar", label: "A.Escolar" },
  { key: "internacional", label: "Intern." },
] as const;

/** Segmented training level indicator */
export function addTrainingLevel(doc: jsPDF, treinoKey: string, y: number): number {
  const activeIdx = TRAINING_LEVELS.findIndex((l) => l.key === treinoKey);
  const segW = CONTENT_W / TRAINING_LEVELS.length;
  const segH = 7;

  // Section label
  doc.setTextColor(...ZINC400);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("NIVEL DE TREINO", MARGIN, y - 2);

  TRAINING_LEVELS.forEach((level, i) => {
    const x = MARGIN + i * segW;
    const isCurrent = i === activeIdx;
    const isPast = i < activeIdx;

    if (isCurrent) {
      doc.setFillColor(...GOLD);
    } else if (isPast) {
      doc.setFillColor(...GOLD_DIM);
    } else {
      doc.setFillColor(30, 30, 30);
    }

    doc.roundedRect(x + 0.5, y, segW - 1, segH, 1, 1, "F");

    // Label below each segment
    if (isCurrent) {
      doc.setTextColor(...GOLD);
      doc.setFont("helvetica", "bold");
    } else {
      doc.setTextColor(...ZINC600);
      doc.setFont("helvetica", "normal");
    }
    doc.setFontSize(6);
    doc.text(safe(level.label), x + segW / 2, y + segH + 4.5, { align: "center" });
  });

  return y + segH + 11;
}

// ─── Section Title ────────────────────────────────────────────────────────────

/** Gold section title with accent line */
export function addSectionTitle(doc: jsPDF, title: string, y: number): number {
  doc.setTextColor(...GOLD);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(safe(title.toUpperCase()), MARGIN, y);

  // Short gold underline + extended dark underline
  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, y + 2.5, 28, 0.4, "F");
  doc.setFillColor(35, 35, 35);
  doc.rect(MARGIN + 28, y + 2.5, CONTENT_W - 28, 0.4, "F");

  return y + 11;
}

// ─── Key-Value Pair ───────────────────────────────────────────────────────────

/** Key-value pair for horse data (two-column layout) */
export function addKV(
  doc: jsPDF,
  key: string,
  value: string,
  x: number,
  y: number,
  colW: number = 80
): number {
  // Key (small, muted)
  doc.setTextColor(...ZINC600);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(safe(key).toUpperCase(), x, y);

  // Value (white, bold) — truncate to column width
  doc.setTextColor(...ZINC300);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  const safeVal = safe(value);
  const lines = doc.splitTextToSize(safeVal, colW - 2);
  doc.text(lines[0] ?? safeVal, x, y + 5.5);

  return y + 12;
}

// ─── Large Progress Bar ───────────────────────────────────────────────────────

/** Color-coded large progress bar for category scores */
export function addLargeBar(
  doc: jsPDF,
  label: string,
  score: number,
  max: number,
  y: number
): number {
  const barH = 10;
  const labelW = 60;
  const barX = MARGIN + labelW + 5;
  const barW = CONTENT_W - labelW - 5;
  const pct = Math.min(Math.max(score / max, 0), 1);

  // Color by percentage
  let color: [number, number, number];
  if (pct >= 0.75) color = GREEN;
  else if (pct >= 0.5) color = GOLD;
  else if (pct >= 0.3) color = AMBER;
  else color = RED;

  // Label (left side)
  doc.setTextColor(...ZINC400);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const labelLines = doc.splitTextToSize(safe(label), labelW);
  doc.text(labelLines[0] ?? safe(label), MARGIN, y + barH / 2 + 1.5);

  // Score number (right of label area)
  doc.setTextColor(...ZINC600);
  doc.setFontSize(7.5);
  doc.text(`${score}/${max}`, barX - 2, y + barH / 2 + 1.5, { align: "right" });

  // Bar track
  doc.setFillColor(30, 30, 30);
  doc.roundedRect(barX, y, barW, barH, 2, 2, "F");

  // Bar fill
  if (pct > 0.01) {
    doc.setFillColor(...color);
    doc.roundedRect(barX, y, Math.max(barW * pct, 5), barH, 2, 2, "F");
  }

  // Percentage label inside bar (only if wide enough)
  if (pct > 0.1) {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    const pctLabel = `${Math.round(pct * 100)}%`;
    const textX = barX + barW * pct - 2;
    doc.text(pctLabel, textX, y + barH / 2 + 1.5, { align: "right" });
  }

  return y + barH + 4;
}

// ─── Bullet Item ─────────────────────────────────────────────────────────────

export type BulletType = "forte" | "fraco" | "recomendacao";

const BULLET_CONFIG: Record<
  BulletType,
  { bg: [number, number, number]; prefix: string; prefixColor: [number, number, number] }
> = {
  forte: { bg: [18, 48, 28], prefix: "+", prefixColor: GREEN },
  fraco: { bg: [50, 24, 10], prefix: "!", prefixColor: AMBER },
  recomendacao: { bg: [35, 28, 8], prefix: ">", prefixColor: GOLD },
};

/** Pill-styled bullet item — height adapts to text length */
export function addBulletItem(doc: jsPDF, text: string, type: BulletType, y: number): number {
  const cfg = BULLET_CONFIG[type];
  const maxTextW = CONTENT_W - 16;
  const lines = doc.splitTextToSize(safe(text), maxTextW);
  const lineH = 4.5;
  const padY = 3;
  const pillH = lines.length * lineH + padY * 2;

  // Pill background
  doc.setFillColor(...cfg.bg);
  doc.roundedRect(MARGIN, y, CONTENT_W, pillH, 2, 2, "F");

  // Prefix icon
  doc.setTextColor(...cfg.prefixColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(cfg.prefix, MARGIN + 3.5, y + padY + lineH);

  // Text lines
  doc.setTextColor(...ZINC300);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  (lines as string[]).forEach((line, i) => {
    doc.text(line, MARGIN + 11, y + padY + lineH + i * lineH);
  });

  return y + pillH + 2.5;
}

// ─── Footer ───────────────────────────────────────────────────────────────────

/** Premium footer on every page */
export function addPremiumFooter(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer background
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 284, PAGE_W, 13, "F");

    // Gold separator line
    doc.setFillColor(...GOLD);
    doc.rect(MARGIN, 284, CONTENT_W, 0.3, "F");

    // Left: disclaimer
    doc.setTextColor(...ZINC600);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(
      "portal-lusitano.pt  |  Avaliacao estimativa. Nao substitui avaliacao profissional.",
      MARGIN,
      290
    );

    // Right: page number
    doc.setTextColor(...ZINC400);
    doc.text(`${i} / ${pageCount}`, PAGE_W - MARGIN, 290, { align: "right" });

    // Gold centre dot
    doc.setFillColor(...GOLD);
    doc.circle(PAGE_W / 2, 290.5, 0.7, "F");
  }
}

/** Diagonal watermark for free-tier PDFs */
export function addPremiumWatermark(doc: jsPDF, text = "VERSAO GRATUITA"): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(38, 38, 38);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text(text, PAGE_W / 2, PAGE_H / 2, { align: "center", angle: 45 });
  }
}

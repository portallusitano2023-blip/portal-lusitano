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
/**
 * Normalise text for jsPDF's built-in Helvetica/Latin-1 encoding.
 * NFC keeps composed chars like é, ã, ç, â, ó together.
 * All Portuguese characters sit inside Latin-1 (U+0000–U+00FF), so only
 * characters genuinely outside that block are replaced with "?".
 */
export function safe(s: string | number | null | undefined): string {
  if (s == null) return "";
  // NFC keeps composed chars like é, ã, ç, â, ó together
  // Only strip characters truly outside Latin-1 (above U+00FF)
  return String(s)
    .normalize("NFC")
    .replace(/[^\x00-\xFF]/g, "?");
}

// ─── Page Helpers ─────────────────────────────────────────────────────────────

/** Fill entire page with dark background */
export function fillPageBg(doc: jsPDF): void {
  doc.setFillColor(...DARK_BG);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
}

/** Gold gradient top bar with PORTAL LUSITANO branding (cover page) — 18mm tall */
export function addCoverTopBar(doc: jsPDF): void {
  const barH = 18;

  // Dark base (full bar)
  doc.setFillColor(8, 8, 8);
  doc.rect(0, 0, PAGE_W, barH, "F");

  // Gold bottom accent strip
  doc.setFillColor(...GOLD);
  doc.rect(0, barH - 1.5, PAGE_W, 1.5, "F");

  // Brand name — gold, bold, centered
  doc.setTextColor(...GOLD);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("PORTAL LUSITANO", PAGE_W / 2, 9, { align: "center" });

  // Subtitle — white, normal, centered
  doc.setTextColor(...WHITE);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Relatório de Avaliação Equina", PAGE_W / 2, 15, { align: "center" });
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
  percentil: number;
}

/**
 * Redesigned value hero card — two-panel layout.
 * Left (60%): VALOR ESTIMADO label + EUR value + range.
 * Right (40%): decorative diamond with "Top X%" percentile.
 * Height: 65mm.
 */
export function addValueHero(doc: jsPDF, cfg: HeroConfig, y: number): number {
  const { value, min, max, percentil } = cfg;
  const cardH = 65;
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

  // ── Left panel (60%) ──
  const leftW = cardW * 0.6;

  // "VALOR ESTIMADO" label
  doc.setTextColor(...ZINC400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("VALOR ESTIMADO", cardX + 9, y + 11);

  // Main EUR value (large hero element)
  const valueStr = value.toLocaleString("pt-PT");
  doc.setTextColor(...WHITE);
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text(valueStr, cardX + 9, y + 36);

  // "EUR" in gold
  doc.setTextColor(...GOLD);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("EUR", cardX + 9, y + 47);

  // Range below
  const rangeStr = `${min.toLocaleString("pt-PT")} — ${max.toLocaleString("pt-PT")} EUR`;
  doc.setTextColor(...ZINC400);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(rangeStr, cardX + 9, y + 57);

  // ── Right panel (40%) ──
  const rightX = cardX + leftW + 2;
  const rightCenterX = rightX + (cardW * 0.4 - 2) / 2;
  const diamondCY = y + cardH / 2;

  // Decorative diamond outline (rhombus) in gold
  const dSize = 20; // half-size of the diamond
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  // Draw rhombus manually using lines (top → right → bottom → left → top)
  doc.lines(
    [
      [dSize, dSize], // top-right
      [dSize, dSize], // bottom-right
      [-dSize, dSize], // bottom-left
      [-dSize, -dSize], // top-left
    ],
    rightCenterX,
    diamondCY - dSize,
    [1, 1],
    "S",
    true
  );

  // Top X% inside diamond
  const topPct = Math.max(1, 100 - percentil);
  doc.setTextColor(...GOLD);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Top ${topPct}%`, rightCenterX, diamondCY - 2, { align: "center" });

  // "do mercado" below
  doc.setTextColor(...ZINC400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("do mercado", rightCenterX, diamondCY + 6, { align: "center" });

  return y + cardH + 7;
}

// ─── Metrics Row ──────────────────────────────────────────────────────────────

export interface MetricBox {
  label: string;
  value: string;
}

/** Row of 4 metric indicator boxes — 26mm tall */
export function addMetricsRow(doc: jsPDF, metrics: MetricBox[], y: number): number {
  const count = metrics.length;
  const gap = 3;
  const boxW = (CONTENT_W - gap * (count - 1)) / count;
  const boxH = 26;

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
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text(safe(m.value), x + boxW / 2, y + 15, { align: "center" });

    // Label text
    doc.setTextColor(...ZINC400);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(safe(m.label), x + boxW / 2, y + 22, { align: "center" });
  });

  return y + boxH + 6;
}

// ─── Training Level ───────────────────────────────────────────────────────────

const TRAINING_LEVELS = [
  { key: "iniciacao", label: "Iniciação" },
  { key: "elementar", label: "Elementar" },
  { key: "medio", label: "Médio" },
  { key: "avancado", label: "Avançado" },
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
  doc.text("NÍVEL DE TREINO", MARGIN, y - 2);

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

/**
 * Section title with a colored count pill to the right of the text.
 * pillColor: RGB color for the pill background.
 */
export function addSectionTitleWithCount(
  doc: jsPDF,
  title: string,
  count: number,
  pillColor: [number, number, number],
  y: number
): number {
  // Title text
  doc.setTextColor(...GOLD);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(safe(title.toUpperCase()), MARGIN, y);

  // Measure title width to position pill right after
  const titleW = doc.getTextWidth(safe(title.toUpperCase()));

  // Pill dimensions
  const pillLabel = String(count);
  doc.setFontSize(7);
  const pillTextW = doc.getTextWidth(pillLabel);
  const pillW = pillTextW + 5;
  const pillH = 4;
  const pillX = MARGIN + titleW + 3;
  const pillY = y - pillH + 1;

  // Pill background
  doc.setFillColor(...pillColor);
  doc.roundedRect(pillX, pillY, pillW, pillH, pillH / 2, pillH / 2, "F");

  // Pill text
  doc.setTextColor(...WHITE);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(pillLabel, pillX + pillW / 2, y - 0.5, { align: "center" });

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

/** Color-coded large progress bar for category scores — 13mm tall */
export function addLargeBar(
  doc: jsPDF,
  label: string,
  score: number,
  max: number,
  y: number
): number {
  const barH = 13;
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
  doc.setFontSize(8.5);
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

  // Subtle glow layer (15% opacity) — slightly wider and taller
  if (pct > 0.01) {
    const fillW = Math.max(barW * pct, 5);
    doc.setFillColor(
      Math.round(color[0] * 0.15 + 30 * 0.85),
      Math.round(color[1] * 0.15 + 30 * 0.85),
      Math.round(color[2] * 0.15 + 30 * 0.85)
    );
    doc.roundedRect(barX - 1, y - 0.5, fillW + 2, barH + 1, 2, 2, "F");

    // Bar fill (solid color on top of glow)
    doc.setFillColor(...color);
    doc.roundedRect(barX, y, fillW, barH, 2, 2, "F");
  }

  // Percentage label inside bar (only if wide enough)
  if (pct > 0.1) {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(8.5);
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

// ─── Radar Chart ─────────────────────────────────────────────────────────────

interface RadarCategory {
  nome: string;
  score: number;
  impacto: number;
  descricao: string;
}

/**
 * Spider/radar chart showing up to 8 category scores (0-10 scale).
 * Drawn with pure jsPDF vector commands — no canvas or images.
 * Returns the y position after the chart (centerY + radius + label margin).
 */
export function addRadarChart(doc: jsPDF, categories: RadarCategory[], y: number): number {
  const n = Math.min(categories.length, 8);
  if (n < 3) return y; // need at least 3 axes

  const centerX = PAGE_W / 2;
  const centerY = y + 42;
  const radius = 32;

  // ── Grid rings at 25 %, 50 %, 75 %, 100 % ──
  const ringColors: [number, number, number][] = [
    [22, 22, 22],
    [26, 26, 26],
    [30, 30, 30],
    [35, 35, 35],
  ];
  const ringPcts = [0.25, 0.5, 0.75, 1.0];

  ringPcts.forEach((pct, ri) => {
    const pts: [number, number][] = [];
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      pts.push([
        centerX + radius * pct * Math.cos(angle),
        centerY + radius * pct * Math.sin(angle),
      ]);
    }
    doc.setDrawColor(...ringColors[ri]);
    doc.setLineWidth(0.3);
    // Draw the ring polygon segment by segment
    for (let i = 0; i < n; i++) {
      const next = (i + 1) % n;
      doc.line(pts[i][0], pts[i][1], pts[next][0], pts[next][1]);
    }
  });

  // ── Axis lines from center to each vertex ──
  doc.setDrawColor(...ZINC600);
  doc.setLineWidth(0.25);
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    doc.line(
      centerX,
      centerY,
      centerX + radius * Math.cos(angle),
      centerY + radius * Math.sin(angle)
    );
  }

  // ── Data polygon — collect vertices ──
  const dataPts: [number, number][] = categories.slice(0, n).map((cat, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const pct = Math.min(Math.max(cat.score / 10, 0), 1);
    return [centerX + radius * pct * Math.cos(angle), centerY + radius * pct * Math.sin(angle)];
  });

  // Fill polygon — dark gold mix to simulate 25 % opacity gold
  doc.setFillColor(50, 40, 15);
  doc.setDrawColor(50, 40, 15);
  doc.setLineWidth(0);
  // Draw fill as a series of triangles from center (fan fill)
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    // Use doc.lines to draw a filled triangle
    const [x0, y0] = dataPts[i];
    const [x1, y1] = dataPts[next];
    doc.lines(
      [
        [x0 - centerX, y0 - centerY],
        [x1 - x0, y1 - y0],
        [centerX - x1, centerY - y1],
      ],
      centerX,
      centerY,
      [1, 1],
      "F",
      true
    );
  }

  // Stroke polygon outline in gold
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.7);
  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    doc.line(dataPts[i][0], dataPts[i][1], dataPts[next][0], dataPts[next][1]);
  }

  // Gold dots at each data vertex
  doc.setFillColor(...GOLD);
  dataPts.forEach(([px, py]) => {
    doc.circle(px, py, 1.2, "F");
  });

  // ── Axis labels ──
  doc.setTextColor(...ZINC400);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  categories.slice(0, n).forEach((cat, i) => {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    const labelR = radius + 9;
    const lx = centerX + labelR * Math.cos(angle);
    const ly = centerY + labelR * Math.sin(angle);
    const label = safe(cat.nome).slice(0, 12);
    doc.text(label, lx, ly, { align: "center", baseline: "middle" });
  });

  // ── Center label ──
  doc.setTextColor(...ZINC600);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("0", centerX, centerY, { align: "center", baseline: "middle" });

  return centerY + radius + 14;
}

// ─── KV with Health Badge ─────────────────────────────────────────────────────

const SAUDE_COLORS: Record<string, [number, number, number]> = {
  excelente: [34, 197, 94], // GREEN
  muito_bom: [34, 197, 94], // green
  bom: [197, 160, 89], // GOLD
  regular: [251, 146, 60], // AMBER
};

/**
 * KV pair for the health field — identical to addKV but adds a small
 * color-coded status circle to the right of the value text.
 */
export function addKVWithHealthBadge(
  doc: jsPDF,
  key: string,
  value: string,
  healthKey: string,
  x: number,
  y: number,
  colW: number = 80
): number {
  // Key (small, muted)
  doc.setTextColor(...ZINC600);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(safe(key).toUpperCase(), x, y);

  // Value text
  doc.setTextColor(...ZINC300);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  const safeVal = safe(value);
  const lines = doc.splitTextToSize(safeVal, colW - 10);
  doc.text(lines[0] ?? safeVal, x, y + 5.5);

  // Status circle
  const badgeColor: [number, number, number] = SAUDE_COLORS[healthKey] ?? ZINC400;
  doc.setFillColor(...badgeColor);
  doc.circle(x + colW - 6, y + 4, 1.8, "F");

  return y + 12;
}

// ─── Score Grid ───────────────────────────────────────────────────────────────

/**
 * Renders a 3-column grid of score cells, each with a label, numeric value,
 * colored left accent bar, and a mini horizontal progress bar.
 * Returns the y position after the grid.
 */
export function addScoreGrid(
  doc: jsPDF,
  items: { label: string; score: number; max?: number }[],
  y: number
): number {
  const cols = 3;
  const gap = 3;
  const cellW = (CONTENT_W - gap * (cols - 1)) / cols;
  const cellH = 14;

  for (let i = 0; i < items.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = MARGIN + col * (cellW + gap);
    const cellY = y + row * (cellH + 2);
    const item = items[i];
    const max = item.max ?? 10;
    const pct = Math.min(Math.max(item.score / max, 0), 1);

    // Determine color by percentage
    let color: [number, number, number];
    if (pct >= 0.8) color = GREEN;
    else if (pct >= 0.6) color = GOLD;
    else if (pct >= 0.4) color = AMBER;
    else color = RED;

    // Cell background
    doc.setFillColor(22, 22, 22);
    doc.roundedRect(x, cellY, cellW, cellH, 1.5, 1.5, "F");

    // Color left bar (thin)
    doc.setFillColor(...color);
    doc.roundedRect(x, cellY, 2, cellH, 1, 1, "F");

    // Label
    doc.setTextColor(...ZINC600);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(safe(item.label).toUpperCase(), x + 5, cellY + 5);

    // Score value (large)
    doc.setTextColor(...WHITE);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(String(item.score), x + 5, cellY + 11);

    // /max
    doc.setTextColor(...ZINC600);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(`/${max}`, x + 5 + doc.getTextWidth(String(item.score)) + 1, cellY + 11);

    // Mini horizontal progress bar at bottom
    const trackH = 2;
    const trackW = cellW - 10;
    const trackX = x + 5;
    const trackY = cellY + cellH - 3.5;
    doc.setFillColor(30, 30, 30);
    doc.roundedRect(trackX, trackY, trackW, trackH, 0.5, 0.5, "F");
    if (pct > 0.01) {
      doc.setFillColor(...color);
      doc.roundedRect(trackX, trackY, Math.max(trackW * pct, 2), trackH, 0.5, 0.5, "F");
    }
  }

  const rows = Math.ceil(items.length / cols);
  return y + rows * (cellH + 2) + 2;
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
      "portal-lusitano.pt  |  Avaliação estimativa. Não substitui avaliação profissional.",
      MARGIN,
      290
    );

    // Right: page number pill background (CARD_BG2 tone)
    const pillX = PAGE_W - MARGIN - 15;
    doc.setFillColor(25, 25, 25);
    doc.roundedRect(pillX, 286, 14, 6, 3, 3, "F");

    // Page number in gold inside pill
    doc.setTextColor(...GOLD);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.text(`${i} / ${pageCount}`, pillX + 7, 290, { align: "center" });

    // Gold centre dot
    doc.setFillColor(...GOLD);
    doc.circle(PAGE_W / 2, 290.5, 0.7, "F");
  }
}

/** Diagonal watermark for free-tier PDFs */
export function addPremiumWatermark(doc: jsPDF, text = "VERSÃO GRATUITA"): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(38, 38, 38);
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text(text, PAGE_W / 2, PAGE_H / 2, { align: "center", angle: 45 });
  }
}

// ─── Value Bar Chart ──────────────────────────────────────────────────────────

/**
 * Horizontal bar chart showing value at different training levels.
 * The current level is highlighted in gold; others in a dim color.
 * Returns the y position after the chart.
 */
export function addValueBarChart(
  doc: jsPDF,
  levels: { label: string; value: number; isCurrent: boolean }[],
  y: number
): number {
  const labelW = 38;
  const barAreaX = MARGIN + labelW + 3;
  const barAreaW = CONTENT_W - labelW - 3;
  const maxVal = Math.max(...levels.map((l) => l.value));
  const barH = 6;
  const rowH = barH + 3;

  levels.forEach((level, i) => {
    const rowY = y + i * rowH;
    const fillW = Math.max((level.value / maxVal) * barAreaW, 3);

    // Label
    doc.setTextColor(...(level.isCurrent ? WHITE : ZINC600));
    doc.setFontSize(level.isCurrent ? 7.5 : 7);
    doc.setFont("helvetica", level.isCurrent ? "bold" : "normal");
    doc.text(safe(level.label), MARGIN + labelW, rowY + barH - 1, { align: "right" });

    // Bar track
    doc.setFillColor(22, 22, 22);
    doc.roundedRect(barAreaX, rowY, barAreaW, barH, 1, 1, "F");

    // Bar fill
    if (level.isCurrent) {
      doc.setFillColor(...GOLD);
    } else {
      doc.setFillColor(45, 36, 12);
    }
    doc.roundedRect(barAreaX, rowY, fillW, barH, 1, 1, "F");

    // Value label at end of bar
    const valStr =
      level.value >= 1000 ? `${Math.round(level.value / 1000)}k EUR` : `${level.value} EUR`;
    doc.setTextColor(...(level.isCurrent ? GOLD : ZINC600));
    doc.setFontSize(6.5);
    doc.setFont("helvetica", level.isCurrent ? "bold" : "normal");
    doc.text(safe(valStr), barAreaX + fillW + 2, rowY + barH - 1);

    // Gold dot indicator for current level
    if (level.isCurrent) {
      doc.setFillColor(...GOLD);
      doc.circle(barAreaX - 3, rowY + barH / 2, 1.5, "F");
    }
  });

  return y + levels.length * rowH + 4;
}

// ─── Score Arc ────────────────────────────────────────────────────────────────

/**
 * Circular arc gauge showing a score from 0–100.
 * Uses a 270° sweep starting at the 7 o'clock position.
 * Draws a dark track ring, then a gold arc for the filled portion,
 * the numeric score centered, and a small "SCORE" label below.
 */
export function addScoreArc(
  doc: jsPDF,
  score: number, // 0-100
  cx: number,
  cy: number,
  r: number
): void {
  // Background circle track
  doc.setDrawColor(30, 30, 30);
  doc.setLineWidth(2.5);
  doc.circle(cx, cy, r, "S");

  // Score arc — approximate with many short line segments
  const startAngle = -Math.PI * 0.75; // 7 o'clock position
  const sweep = Math.PI * 1.5 * (score / 100); // max sweep is 270°
  const endAngle = startAngle + sweep;
  const steps = 36;

  doc.setDrawColor(...GOLD);
  doc.setLineWidth(2.5);
  for (let i = 0; i < steps; i++) {
    const a1 = startAngle + (sweep * i) / steps;
    const a2 = startAngle + (sweep * (i + 1)) / steps;
    if (a2 > endAngle) break;
    doc.line(
      cx + r * Math.cos(a1),
      cy + r * Math.sin(a1),
      cx + r * Math.cos(a2),
      cy + r * Math.sin(a2)
    );
  }

  // Score number centered in arc
  doc.setTextColor(...WHITE);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`${score}%`, cx, cy + 1, { align: "center", baseline: "middle" });

  // Small "SCORE" label below the arc
  doc.setTextColor(...ZINC400);
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "normal");
  doc.text("SCORE", cx, cy + r + 4, { align: "center" });
}

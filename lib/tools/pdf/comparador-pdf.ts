import {
  loadJsPDF,
  safe,
  GOLD,
  GOLD_DIM,
  CARD_BG,
  ZINC400,
  ZINC600,
  WHITE,
  GREEN,
  AMBER,
  MARGIN,
} from "./base-premium";

// ─── Landscape A4 Constants ───────────────────────────────────────────────────
// A4 landscape: 297mm wide × 210mm tall
const L_PAGE_W = 297;
const L_PAGE_H = 210;
const L_CONTENT_W = L_PAGE_W - MARGIN * 2; // 257mm

// ─── Cavalo interface (mirrors comparador-cavalos/page.tsx) ───────────────────

interface CavaloComp {
  id?: string;
  nome: string;
  idade: number;
  sexo: string;
  altura: number;
  pelagem: string;
  linhagem: string;
  linhagemFamosa?: string;
  treino: string;
  temperamento: number;
  saude: number;
  conformacao: number;
  andamentos: number;
  elevacao: number;
  regularidade: number;
  competicoes: string;
  premios?: number;
  preco: number;
  blup: number;
  registoAPSL: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map a 0–max score to a brand color band */
function scoreColor(score: number, max = 100): [number, number, number] {
  const pct = score / max;
  if (pct >= 0.75) return GREEN;
  if (pct >= 0.5) return GOLD;
  if (pct >= 0.3) return AMBER;
  return [239, 68, 68]; // RED
}

/** Fill the landscape page with a dark canvas background */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fillLandscapeBg(doc: any): void {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 4;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "rgb(10,10,10)";
    ctx.fillRect(0, 0, 4, 4);
    doc.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, L_PAGE_W, L_PAGE_H);
  } else {
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, L_PAGE_W, L_PAGE_H, "F");
  }
}

/** 16mm top bar with brand + title + date */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addLandscapeTopBar(doc: any, title: string, right: string): void {
  doc.setFillColor(8, 8, 8);
  doc.rect(0, 0, L_PAGE_W, 16, "F");
  // Gold accent strip
  doc.setFillColor(...GOLD);
  doc.rect(0, 14.8, L_PAGE_W, 1.2, "F");
  // Brand
  doc.setTextColor(...GOLD);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("PORTAL LUSITANO", MARGIN, 9);
  // Title centred
  doc.setTextColor(...WHITE);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(safe(title), L_PAGE_W / 2, 9, { align: "center" });
  // Right label
  doc.setTextColor(...ZINC400);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(safe(right), L_PAGE_W - MARGIN, 9, { align: "right" });
}

/** Footer applied to every page — must be called after all pages are added */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addLandscapeFooter(doc: any): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(15, 15, 15);
    doc.rect(0, L_PAGE_H - 11, L_PAGE_W, 11, "F");
    doc.setFillColor(...GOLD);
    doc.rect(MARGIN, L_PAGE_H - 11, L_CONTENT_W, 0.3, "F");

    doc.setTextColor(...ZINC600);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(
      safe(
        "portal-lusitano.pt  |  An\u00e1lise gerada pelo Portal Lusitano. Avalia\u00e7\u00e3o estimativa \u2014 n\u00e3o substitui avalia\u00e7\u00e3o profissional."
      ),
      MARGIN,
      L_PAGE_H - 4.5
    );

    const pillX = L_PAGE_W - MARGIN - 14;
    doc.setFillColor(25, 25, 25);
    doc.roundedRect(pillX, L_PAGE_H - 9, 13, 6, 3, 3, "F");
    doc.setTextColor(...GOLD);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.text(`${i} / ${pageCount}`, pillX + 6.5, L_PAGE_H - 4.5, { align: "center" });
  }
}

/** Small score arc drawn in pure jsPDF vectors */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addMiniArc(doc: any, score: number, cx: number, cy: number, r: number): void {
  const startAngle = -Math.PI * 0.75;
  const sweep = Math.PI * 1.5 * (score / 100);
  const endAngle = startAngle + sweep;
  const steps = 36;

  // Track
  doc.setDrawColor(25, 25, 25);
  doc.setLineWidth(2.2);
  doc.circle(cx, cy, r, "S");

  // Filled arc in gold
  if (score > 0) {
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(1.8);
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
  }

  // Score number centred
  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(`${score}`, cx, cy + 1, { align: "center", baseline: "middle" });
}

/** Horizontal mini bar for a 0–max metric */
function addMiniBar(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: any,
  label: string,
  value: number,
  max: number,
  x: number,
  y: number,
  colW: number
): number {
  const barH = 4;
  const labelW = colW * 0.48;
  const barX = x + labelW + 2;
  const barW = colW - labelW - 8;
  const pct = Math.min(Math.max(value / max, 0), 1);
  const color = scoreColor(value, max);

  doc.setTextColor(...ZINC400);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text(safe(label), x, y + barH - 0.5);

  doc.setFillColor(28, 28, 28);
  doc.roundedRect(barX, y, barW, barH, 1, 1, "F");

  if (pct > 0.01) {
    doc.setFillColor(...color);
    doc.roundedRect(barX, y, Math.max(barW * pct, 2), barH, 1, 1, "F");
  }

  doc.setTextColor(...color);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text(`${value}`, barX + barW + 1.5, y + barH - 0.5);

  return y + barH + 2.5;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * Generates a premium landscape A4 PDF comparing up to 4 horses.
 *
 * Signature matches what comparador-cavalos/page.tsx already calls:
 *   generateComparadorPDF(cavalos, scores, vencedorNome, melhorValorNome)
 *
 * Triggers a browser download directly — no blob URL returned.
 */
export async function generateComparadorPDF(
  cavalos: CavaloComp[],
  scores: number[],
  vencedorNome: string,
  melhorValorNome: string
): Promise<void> {
  const JsPDF = await loadJsPDF();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = new JsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const date = new Date().toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const refNum = `PLC-${Date.now().toString(36).toUpperCase().slice(-8)}`;
  const n = Math.min(cavalos.length, 4);

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — SCORECARD COMPARATIVO (um cartão por cavalo, lado a lado)
  // ═══════════════════════════════════════════════════════════════════════════
  fillLandscapeBg(doc);
  addLandscapeTopBar(doc, "Compara\u00e7\u00e3o de Cavalos", date);

  // Decorative background circle
  doc.setDrawColor(18, 18, 18);
  doc.setLineWidth(0.4);
  doc.circle(L_PAGE_W * 0.78, L_PAGE_H * 0.5, 55, "S");

  const colGap = 4;
  const colW = (L_CONTENT_W - colGap * (n - 1)) / n;
  const cardTopY = 21;
  const cardH = L_PAGE_H - cardTopY - 14; // leave room for footer

  cavalos.slice(0, n).forEach((cavalo, i) => {
    const score = scores[i] ?? 0;
    const cx = MARGIN + i * (colW + colGap);
    const isVencedor = cavalo.nome === vencedorNome;
    const isMelhorValor = !isVencedor && cavalo.nome === melhorValorNome;
    const color = scoreColor(score, 100);

    // Card background
    if (isVencedor) {
      doc.setFillColor(26, 20, 7);
    } else {
      doc.setFillColor(...CARD_BG);
    }
    doc.roundedRect(cx, cardTopY, colW, cardH, 3, 3, "F");

    // Top accent bar
    if (isVencedor) {
      doc.setFillColor(...GOLD);
    } else {
      doc.setFillColor(...GOLD_DIM);
    }
    doc.roundedRect(cx, cardTopY, colW, 2, 1.5, 1.5, "F");

    // Gold border for winner
    if (isVencedor) {
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.6);
      doc.roundedRect(cx, cardTopY, colW, cardH, 3, 3, "S");
    }

    let y = cardTopY + 5;

    // Badge row
    if (isVencedor) {
      const bLabel = safe("Melhor Score");
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      const bW = doc.getTextWidth(bLabel) + 6;
      doc.setFillColor(40, 32, 10);
      doc.roundedRect(cx + (colW - bW) / 2, y, bW, 5, 1.5, 1.5, "F");
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.3);
      doc.roundedRect(cx + (colW - bW) / 2, y, bW, 5, 1.5, 1.5, "S");
      doc.setTextColor(...GOLD);
      doc.text(bLabel, cx + colW / 2, y + 3.5, { align: "center" });
      y += 8;
    } else if (isMelhorValor) {
      const bLabel = safe("Melhor Valor");
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      const bW = doc.getTextWidth(bLabel) + 6;
      doc.setFillColor(8, 35, 18);
      doc.roundedRect(cx + (colW - bW) / 2, y, bW, 5, 1.5, 1.5, "F");
      doc.setDrawColor(...GREEN);
      doc.setLineWidth(0.3);
      doc.roundedRect(cx + (colW - bW) / 2, y, bW, 5, 1.5, 1.5, "S");
      doc.setTextColor(...GREEN);
      doc.text(bLabel, cx + colW / 2, y + 3.5, { align: "center" });
      y += 8;
    } else {
      y += 3;
    }

    // Horse name
    doc.setTextColor(...WHITE);
    doc.setFontSize(isVencedor ? 10 : 9);
    doc.setFont("helvetica", "bold");
    const nameLines = doc.splitTextToSize(safe(cavalo.nome), colW - 6) as string[];
    doc.text(nameLines[0] ?? safe(cavalo.nome), cx + colW / 2, y, { align: "center" });
    y += 5;

    // Score arc
    const arcR = 9;
    const arcCX = cx + colW / 2;
    const arcCY = y + arcR + 1;
    addMiniArc(doc, score, arcCX, arcCY, arcR);
    y = arcCY + arcR + 4;

    // "Score Global" label
    doc.setTextColor(...ZINC400);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text("Score Global", arcCX, y, { align: "center" });
    y += 5;

    // Thin separator
    doc.setFillColor(35, 35, 35);
    doc.rect(cx + 4, y, colW - 8, 0.3, "F");
    y += 4;

    // Key data rows (label left, value right)
    const kvItems: { k: string; v: string }[] = [
      { k: "Sexo", v: cavalo.sexo },
      { k: "Idade", v: `${cavalo.idade} anos` },
      { k: "Treino", v: cavalo.treino },
      { k: "Linhagem", v: cavalo.linhagem },
      { k: "Competi\u00e7\u00f5es", v: cavalo.competicoes },
      { k: "Pre\u00e7o", v: `${cavalo.preco.toLocaleString("pt-PT")} \u20ac` },
    ];

    kvItems.forEach(({ k, v }) => {
      doc.setTextColor(...ZINC600);
      doc.setFontSize(5.5);
      doc.setFont("helvetica", "normal");
      doc.text(safe(k).toUpperCase(), cx + 4, y);
      doc.setTextColor(...ZINC400);
      doc.setFontSize(7);
      doc.setFont("helvetica", isVencedor ? "bold" : "normal");
      const vLines = doc.splitTextToSize(safe(v), colW - 8) as string[];
      doc.text(vLines[0] ?? safe(v), cx + colW - 4, y, { align: "right" });
      y += 6;
    });

    // Separator
    y += 1;
    doc.setFillColor(35, 35, 35);
    doc.rect(cx + 4, y, colW - 8, 0.3, "F");
    y += 4;

    // Score mini bars: Conformação, Andamentos, Saúde, Temperamento
    const barItems = [
      { label: "Conforma\u00e7\u00e3o", value: cavalo.conformacao, max: 10 },
      { label: "Andamentos", value: cavalo.andamentos, max: 10 },
      { label: "Sa\u00fade", value: cavalo.saude, max: 10 },
      { label: "Temperamento", value: cavalo.temperamento, max: 10 },
    ];
    barItems.forEach(({ label, value, max }) => {
      y = addMiniBar(doc, label, value, max, cx + 4, y, colW - 8);
    });

    // BLUP pill at bottom of card
    y += 2;
    const blupColor: [number, number, number] =
      cavalo.blup > 110 ? GREEN : cavalo.blup > 100 ? GOLD : AMBER;
    doc.setFillColor(
      Math.round(blupColor[0] * 0.15 + 18 * 0.85),
      Math.round(blupColor[1] * 0.15 + 18 * 0.85),
      Math.round(blupColor[2] * 0.15 + 18 * 0.85)
    );
    const blupLabel = safe(`BLUP ${cavalo.blup}`);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    const blupPillW = doc.getTextWidth(blupLabel) + 6;
    doc.roundedRect(cx + (colW - blupPillW) / 2, y, blupPillW, 5, 1.5, 1.5, "F");
    doc.setTextColor(...blupColor);
    doc.text(blupLabel, cx + colW / 2, y + 3.5, { align: "center" });

    // APSL dot indicator (right corner of card)
    if (cavalo.registoAPSL) {
      doc.setFillColor(...GOLD);
      doc.circle(cx + colW - 5, cardTopY + 7, 1.6, "F");
      doc.setTextColor(...ZINC600);
      doc.setFontSize(5);
      doc.setFont("helvetica", "normal");
      doc.text("APSL", cx + colW - 5, cardTopY + 11.5, { align: "center" });
    }

    // Score bar at very bottom of card for visual comparison
    const barY = cardTopY + cardH - 6;
    const scoreBarW = (colW - 8) * (score / 100);
    doc.setFillColor(25, 25, 25);
    doc.roundedRect(cx + 4, barY, colW - 8, 3, 1, 1, "F");
    if (score > 0) {
      doc.setFillColor(...color);
      doc.roundedRect(cx + 4, barY, Math.max(scoreBarW, 3), 3, 1, 1, "F");
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 2 — TABELA COMPARATIVA DETALHADA
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  fillLandscapeBg(doc);
  addLandscapeTopBar(doc, "Tabela Comparativa", `Ref: ${refNum}`);

  // Table constants
  const TABLE_Y = 22;
  const ROW_H = 7.5;
  const LABEL_COL_W = 46;
  const DATA_COL_W = (L_CONTENT_W - LABEL_COL_W) / n;

  // Column header row
  doc.setFillColor(20, 20, 20);
  doc.roundedRect(MARGIN, TABLE_Y, L_CONTENT_W, ROW_H, 1.5, 1.5, "F");
  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, TABLE_Y + ROW_H - 0.5, L_CONTENT_W, 0.5, "F");

  cavalos.slice(0, n).forEach((cavalo, i) => {
    const cellX = MARGIN + LABEL_COL_W + i * DATA_COL_W;
    const isWinner = cavalo.nome === vencedorNome;
    doc.setTextColor(
      isWinner ? GOLD[0] : WHITE[0],
      isWinner ? GOLD[1] : WHITE[1],
      isWinner ? GOLD[2] : WHITE[2]
    );
    doc.setFontSize(7.5);
    doc.setFont("helvetica", isWinner ? "bold" : "normal");
    const nameLines = doc.splitTextToSize(safe(cavalo.nome), DATA_COL_W - 4) as string[];
    doc.text(nameLines[0] ?? safe(cavalo.nome), cellX + DATA_COL_W / 2, TABLE_Y + ROW_H / 2 + 1.5, {
      align: "center",
      baseline: "middle",
    });
  });

  // Table rows
  const tableRows: { label: string; getValue: (c: CavaloComp, idx: number) => string }[] = [
    { label: "Score Global", getValue: (_, idx) => `${scores[idx] ?? 0} pts` },
    { label: "Idade", getValue: (c) => `${c.idade} anos` },
    { label: "Sexo", getValue: (c) => c.sexo },
    { label: "Altura", getValue: (c) => `${c.altura} cm` },
    { label: "Pelagem", getValue: (c) => c.pelagem },
    { label: "Linhagem", getValue: (c) => c.linhagem },
    { label: "Treino", getValue: (c) => c.treino },
    { label: "Competi\u00e7\u00f5es", getValue: (c) => c.competicoes },
    { label: "Conforma\u00e7\u00e3o", getValue: (c) => `${c.conformacao}/10` },
    { label: "Andamentos", getValue: (c) => `${c.andamentos}/10` },
    { label: "Eleva\u00e7\u00e3o", getValue: (c) => `${c.elevacao}/10` },
    { label: "Regularidade", getValue: (c) => `${c.regularidade}/10` },
    { label: "Sa\u00fade", getValue: (c) => `${c.saude}/10` },
    { label: "Temperamento", getValue: (c) => `${c.temperamento}/10` },
    { label: "BLUP", getValue: (c) => String(c.blup) },
    { label: "Registo APSL", getValue: (c) => (c.registoAPSL ? "Sim" : "N\u00e3o") },
    {
      label: "Pre\u00e7o",
      getValue: (c) => `${c.preco.toLocaleString("pt-PT")} \u20ac`,
    },
    {
      label: "Valor / Ponto",
      getValue: (c, idx) =>
        scores[idx] > 0
          ? `${Math.round(c.preco / scores[idx]).toLocaleString("pt-PT")} \u20ac`
          : "N/A",
    },
  ];

  tableRows.forEach((row, rowIdx) => {
    const rowY = TABLE_Y + (rowIdx + 1) * ROW_H;
    // Alternating row bg
    doc.setFillColor(
      rowIdx % 2 === 0 ? 14 : 18,
      rowIdx % 2 === 0 ? 14 : 18,
      rowIdx % 2 === 0 ? 14 : 18
    );
    doc.rect(MARGIN, rowY, L_CONTENT_W, ROW_H, "F");

    // Row label
    doc.setTextColor(...ZINC400);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(safe(row.label), MARGIN + 3, rowY + ROW_H / 2 + 1.5);

    // Vertical separator after label column
    doc.setDrawColor(30, 30, 30);
    doc.setLineWidth(0.2);
    doc.line(MARGIN + LABEL_COL_W, rowY, MARGIN + LABEL_COL_W, rowY + ROW_H);

    // Data cells
    cavalos.slice(0, n).forEach((cavalo, i) => {
      const cellX = MARGIN + LABEL_COL_W + i * DATA_COL_W;
      const value = row.getValue(cavalo, i);
      const isWinner = cavalo.nome === vencedorNome;
      const isScoreRow = row.label === "Score Global";

      // Highlight winner's score cell
      if (isScoreRow && isWinner) {
        doc.setFillColor(40, 32, 10);
        doc.rect(cellX, rowY, DATA_COL_W, ROW_H, "F");
      }

      doc.setTextColor(
        isScoreRow && isWinner ? GOLD[0] : WHITE[0],
        isScoreRow && isWinner ? GOLD[1] : WHITE[1],
        isScoreRow && isWinner ? GOLD[2] : WHITE[2]
      );
      doc.setFontSize(7);
      doc.setFont("helvetica", isScoreRow && isWinner ? "bold" : "normal");
      doc.text(safe(value), cellX + DATA_COL_W / 2, rowY + ROW_H / 2 + 1.5, { align: "center" });

      // Column separator (not after last)
      if (i < n - 1) {
        doc.setDrawColor(30, 30, 30);
        doc.setLineWidth(0.2);
        doc.line(cellX + DATA_COL_W, rowY, cellX + DATA_COL_W, rowY + ROW_H);
      }
    });
  });

  // ── Winner summary card at bottom ──
  const summaryY = TABLE_Y + (tableRows.length + 1) * ROW_H + 4;
  if (summaryY < L_PAGE_H - 22) {
    const summaryH = 16;
    doc.setFillColor(26, 20, 7);
    doc.roundedRect(MARGIN, summaryY, L_CONTENT_W, summaryH, 2, 2, "F");
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.roundedRect(MARGIN, summaryY, L_CONTENT_W, summaryH, 2, 2, "S");
    doc.setFillColor(...GOLD);
    doc.roundedRect(MARGIN, summaryY, 3, summaryH, 1.5, 1.5, "F");

    doc.setTextColor(...GOLD);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text(safe("VENCEDOR  \u2014  " + vencedorNome), MARGIN + 8, summaryY + 6);

    const winnerIdx = cavalos.findIndex((c) => c.nome === vencedorNome);
    const winner = winnerIdx >= 0 ? cavalos[winnerIdx] : null;
    const winnerScore = winnerIdx >= 0 ? (scores[winnerIdx] ?? 0) : 0;

    doc.setTextColor(...ZINC400);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const summaryLine = winner
      ? safe(
          `Score: ${winnerScore} pts  \u2022  Treino: ${winner.treino}  \u2022  BLUP: ${winner.blup}  \u2022  Pre\u00e7o: ${winner.preco.toLocaleString("pt-PT")} \u20ac  \u2022  Melhor valor/ponto: ${melhorValorNome}`
        )
      : safe(`Score: ${winnerScore} pts`);
    doc.text(summaryLine, MARGIN + 8, summaryY + 12);
  }

  // ── Footer on all pages ──
  addLandscapeFooter(doc);

  // ── Download ──
  const fileName = `comparacao-cavalos-${Date.now().toString(36).toUpperCase().slice(-6)}.pdf`;
  doc.save(fileName);
}

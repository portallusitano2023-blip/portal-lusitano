import type { Result } from "./types";
import {
  createPremiumPDF,
  fillPageBg,
  addCoverTopBar,
  addPageHeader,
  addSectionTitle,
  addBulletItem,
  addMetricsRow,
  addScoreArc,
  addPremiumFooter,
  addPremiumWatermark,
  safe,
  GOLD,
  CARD_BG,
  CARD_BG2,
  DARK_BG,
  WHITE,
  ZINC300,
  ZINC400,
  ZINC600,
  GREEN,
  AMBER,
  MARGIN,
  PAGE_W,
  PAGE_H,
  CONTENT_W,
} from "@/lib/tools/pdf/base-premium";

// ─── Profile display config ───────────────────────────────────────────────────

const PROFILE_LABELS: Record<string, string> = {
  competidor: "Competidor de Elite",
  tradicional: "Cavaleiro Tradicional",
  criador: "Criador / Produtor",
  amador: "Cavaleiro Amador",
};

const PROFILE_COLORS: Record<string, [number, number, number]> = {
  competidor: [197, 160, 89],  // GOLD
  tradicional: [34, 197, 94],  // GREEN
  criador: [251, 146, 60],     // AMBER
  amador: [99, 179, 237],      // BLUE
};

// ─── Main Export ──────────────────────────────────────────────────────────────

export async function generateProfilePDF(
  result: Result,
  scores: Record<string, number>
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = await createPremiumPDF();

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const mainPct = Math.round((scores[result.profile] / totalScore) * 100);
  const profileColor: [number, number, number] = PROFILE_COLORS[result.profile] ?? GOLD;
  const date = new Date().toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const refNum = `PLQ-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  // Sort all profiles by score descending
  const allProfiles = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({
      key: k,
      label: PROFILE_LABELS[k] ?? k,
      pct: Math.round((v / totalScore) * 100),
      color: PROFILE_COLORS[k] ?? GOLD,
    }));

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — COVER
  // ═══════════════════════════════════════════════════════════════════════════
  fillPageBg(doc);

  // Decorative background lines
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.3);
  doc.line(PAGE_W, 0, PAGE_W - PAGE_H, PAGE_H);
  doc.line(PAGE_W + 50, 0, PAGE_W + 50 - PAGE_H, PAGE_H);
  doc.setDrawColor(15, 15, 15);
  doc.setLineWidth(0.4);
  doc.circle(PAGE_W * 0.75, PAGE_H * 0.4, 60, "S");

  addCoverTopBar(doc);

  // Gold corner brackets
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  const bLen = 3;
  const bTop = 22;
  const bBot = 268;
  const bL = MARGIN - 4;
  const bR = PAGE_W - MARGIN + 4;
  doc.line(bL, bTop, bL + bLen, bTop);
  doc.line(bL, bTop, bL, bTop + bLen);
  doc.line(bR, bTop, bR - bLen, bTop);
  doc.line(bR, bTop, bR, bTop + bLen);
  doc.line(bL, bBot, bL + bLen, bBot);
  doc.line(bL, bBot, bL, bBot - bLen);
  doc.line(bR, bBot, bR - bLen, bBot);
  doc.line(bR, bBot, bR, bBot - bLen);

  // Score arc (top-right)
  addScoreArc(doc, mainPct, PAGE_W - MARGIN - 14, 35, 10);

  // Profile title
  let y = 28;
  doc.setTextColor(...WHITE);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(safe(result.title), CONTENT_W - 28);
  doc.text(titleLines[0] ?? safe(result.title), MARGIN, y);
  if (titleLines[1]) {
    y += 7;
    doc.text(titleLines[1], MARGIN, y);
  }

  // Gold underline
  y += 4;
  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, y, CONTENT_W, 0.6, "F");

  // Subtitle
  y += 7;
  doc.setTextColor(...profileColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(safe(result.subtitle), MARGIN, y);

  // Description
  y += 7;
  doc.setTextColor(...ZINC400);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize(safe(result.description), CONTENT_W);
  const descShown = descLines.slice(0, 4);
  doc.text(descShown, MARGIN, y);
  y += descShown.length * 5 + 6;

  // ── Profile match hero card ───────────────────────────────────────────────
  const heroH = 42;
  doc.setFillColor(...CARD_BG);
  doc.roundedRect(MARGIN, y, CONTENT_W, heroH, 3, 3, "F");
  doc.setDrawColor(...profileColor);
  doc.setLineWidth(0.7);
  doc.roundedRect(MARGIN, y, CONTENT_W, heroH, 3, 3, "S");
  doc.setFillColor(...profileColor);
  doc.roundedRect(MARGIN, y, 3, heroH, 1.5, 1.5, "F");

  // Left: percentage display
  doc.setTextColor(...ZINC400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("COMPATIBILIDADE COM PERFIL", MARGIN + 9, y + 10);

  doc.setTextColor(...WHITE);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text(`${mainPct}%`, MARGIN + 9, y + 32);

  doc.setTextColor(...profileColor);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(safe(result.title), MARGIN + 9, y + 39);

  // Right: profile distribution mini bars
  const rightStartX = MARGIN + CONTENT_W * 0.42;
  const rightBarW = CONTENT_W * 0.54;

  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.text("DISTRIBUIÇÃO DE PERFIL", rightStartX, y + 8);

  allProfiles.slice(0, 4).forEach((p, i) => {
    const barY = y + 12 + i * 7.5;
    const barW = rightBarW * (p.pct / 100);

    // Label
    doc.setTextColor(p.key === result.profile ? WHITE[0] : ZINC600[0], p.key === result.profile ? WHITE[1] : ZINC600[1], p.key === result.profile ? WHITE[2] : ZINC600[2]);
    doc.setFontSize(6);
    doc.setFont("helvetica", p.key === result.profile ? "bold" : "normal");
    doc.text(safe(p.label), rightStartX, barY + 3);

    // Bar track
    doc.setFillColor(25, 25, 25);
    doc.roundedRect(rightStartX + 36, barY, rightBarW - 36, 4, 0.8, 0.8, "F");

    // Bar fill
    if (p.pct > 0) {
      doc.setFillColor(...p.color);
      doc.roundedRect(rightStartX + 36, barY, Math.max((rightBarW - 36) * (p.pct / 100), 2), 4, 0.8, 0.8, "F");
    }

    // Percentage label
    doc.setTextColor(p.key === result.profile ? p.color[0] : ZINC600[0], p.key === result.profile ? p.color[1] : ZINC600[1], p.key === result.profile ? p.color[2] : ZINC600[2]);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text(`${p.pct}%`, rightStartX + rightBarW + 2, barY + 3);
  });

  y += heroH + 8;

  // ── Key metrics ───────────────────────────────────────────────────────────
  y = addMetricsRow(
    doc,
    [
      { label: "Match de Perfil", value: `${mainPct}%` },
      { label: "Características", value: `${result.characteristics.length}` },
      { label: "Disciplinas", value: `${result.disciplinas.length}` },
      { label: "Próximos Passos", value: `${result.nextSteps.length}` },
    ],
    y
  );

  // ── Ideal horse preview ───────────────────────────────────────────────────
  y += 4;
  doc.setFillColor(35, 35, 35);
  doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
  y += 8;

  doc.setFillColor(...CARD_BG2);
  doc.roundedRect(MARGIN, y, CONTENT_W, 28, 2, 2, "F");
  doc.setFillColor(...GOLD);
  doc.roundedRect(MARGIN, y, CONTENT_W, 1.5, 0.5, 0.5, "F");

  doc.setTextColor(...ZINC600);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("CAVALO IDEAL PARA O SEU PERFIL", PAGE_W / 2, y + 7, { align: "center" });

  const horseItems = [
    { k: "Idade", v: result.idealHorse.age },
    { k: "Altura", v: result.idealHorse.height },
    { k: "Treino", v: result.idealHorse.training },
    { k: "Preço", v: result.idealHorse.priceRange },
  ];
  const hColW = CONTENT_W / 4;
  horseItems.forEach((item, i) => {
    const hx = MARGIN + i * hColW + 3;
    doc.setTextColor(...ZINC600);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(safe(item.k).toUpperCase(), hx, y + 15);
    doc.setTextColor(...ZINC300);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    const valLines = doc.splitTextToSize(safe(item.v), hColW - 6);
    doc.text(valLines[0] ?? safe(item.v), hx, y + 21);
  });

  y += 36;

  // ── Content preview ───────────────────────────────────────────────────────
  const previews = [
    "Características completas do perfil  (pág. 2)",
    "Cavalo ideal e regiões recomendadas  (pág. 2)",
    "Custos anuais estimados  (pág. 3)",
    "Linhagens e cavalos de referência  (pág. 3)",
    "Dicas e próximos passos  (pág. 4)",
  ];
  const colW2 = CONTENT_W / 2 - 4;
  const colRX2 = MARGIN + CONTENT_W / 2 + 4;
  const itemLineH = 7;

  previews.forEach((p, idx) => {
    const isRight = idx >= 3;
    const xPos = isRight ? colRX2 : MARGIN;
    const rowIdx = isRight ? idx - 3 : idx;
    const yPos = y + rowIdx * itemLineH;
    doc.setFillColor(...GOLD);
    doc.circle(xPos + 2, yPos - 1, 0.9, "F");
    doc.setTextColor(...ZINC400);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(safe(p), colW2 - 8);
    doc.text(lines[0] ?? safe(p), xPos + 7, yPos);
  });

  y += 3 * itemLineH + 4;

  // Bottom gold accent
  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, 270, CONTENT_W, 0.4, "F");
  doc.setTextColor(...GOLD);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(`PORTAL LUSITANO  |  ANÁLISE DE PERFIL EQUESTRE  |  ${safe(date)}`, PAGE_W / 2, 275, { align: "center" });
  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text(`Ref: ${refNum}`, PAGE_W - MARGIN, 280, { align: "right" });

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 2 — CARACTERÍSTICAS & CAVALO IDEAL
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  fillPageBg(doc);
  addPageHeader(doc, "Características & Cavalo Ideal", "Página 2 de 4");

  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.text(safe(result.title).slice(0, 40), PAGE_W / 2, 15, { align: "center" });

  y = 30;

  // Characteristics
  y = addSectionTitle(doc, "Características do Perfil", y);

  result.characteristics.forEach((c, i) => {
    if (y > 265) return;
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = col === 0 ? MARGIN : MARGIN + CONTENT_W / 2 + 3;
    const cy = y - (col === 0 ? 0 : 8) + row * 8;

    if (col === 0) {
      // Item on left
      doc.setFillColor(18, 18, 18);
      doc.roundedRect(MARGIN, cy - 4, CONTENT_W / 2 - 3, 7, 1, 1, "F");
      doc.setFillColor(...profileColor);
      doc.circle(MARGIN + 4, cy - 0.5, 1.2, "F");
      doc.setTextColor(...ZINC300);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const cLines = doc.splitTextToSize(safe(c), CONTENT_W / 2 - 16);
      doc.text(cLines[0] ?? safe(c), MARGIN + 9, cy);
    } else {
      // Item on right
      doc.setFillColor(18, 18, 18);
      doc.roundedRect(MARGIN + CONTENT_W / 2 + 3, cy - 4, CONTENT_W / 2 - 3, 7, 1, 1, "F");
      doc.setFillColor(...profileColor);
      doc.circle(MARGIN + CONTENT_W / 2 + 7, cy - 0.5, 1.2, "F");
      doc.setTextColor(...ZINC300);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const cLines = doc.splitTextToSize(safe(c), CONTENT_W / 2 - 16);
      doc.text(cLines[0] ?? safe(c), MARGIN + CONTENT_W / 2 + 12, cy);
    }

    if (col === 1 || i === result.characteristics.length - 1) {
      y += 8;
    }
  });

  y += 6;

  // Disciplines as pills
  if (result.disciplinas.length > 0) {
    y = addSectionTitle(doc, "Disciplinas Recomendadas", y);
    let dx = MARGIN;
    result.disciplinas.forEach((d) => {
      if (y > 265) return;
      const label = safe(d);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      const dw = doc.getTextWidth(label) + 8;
      if (dx + dw > PAGE_W - MARGIN) {
        dx = MARGIN;
        y += 10;
      }
      doc.setFillColor(
        Math.round(profileColor[0] * 0.15 + DARK_BG[0] * 0.85),
        Math.round(profileColor[1] * 0.15 + DARK_BG[1] * 0.85),
        Math.round(profileColor[2] * 0.15 + DARK_BG[2] * 0.85)
      );
      doc.roundedRect(dx, y - 4, dw, 6, 1.5, 1.5, "F");
      doc.setDrawColor(...profileColor);
      doc.setLineWidth(0.3);
      doc.roundedRect(dx, y - 4, dw, 6, 1.5, 1.5, "S");
      doc.setTextColor(...profileColor);
      doc.text(label, dx + dw / 2, y + 0.5, { align: "center" });
      dx += dw + 3;
    });
    y += 14;
  }

  // Separator
  doc.setFillColor(35, 35, 35);
  doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
  y += 9;

  // Ideal horse section
  y = addSectionTitle(doc, "Cavalo Ideal para o Seu Perfil", y);

  const horseCardH = 40;
  doc.setFillColor(...CARD_BG);
  doc.roundedRect(MARGIN, y, CONTENT_W, horseCardH, 3, 3, "F");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, y, CONTENT_W, horseCardH, 3, 3, "S");
  doc.setFillColor(...GOLD);
  doc.roundedRect(MARGIN, y, 3, horseCardH, 1.5, 1.5, "F");

  const horseFields = [
    { k: "Idade", v: result.idealHorse.age },
    { k: "Altura", v: result.idealHorse.height },
    { k: "Nível de Treino", v: result.idealHorse.training },
    { k: "Temperamento", v: result.idealHorse.temperament },
    { k: "Faixa de Preço", v: result.idealHorse.priceRange },
  ];

  const hfColW = CONTENT_W / 2 - 4;
  let hfX = MARGIN + 9;
  let hfY = y + 10;

  horseFields.forEach((hf, i) => {
    if (i === 2) {
      hfX = MARGIN + CONTENT_W / 2 + 6;
      hfY = y + 10;
    }
    doc.setTextColor(...ZINC600);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text(safe(hf.k).toUpperCase(), hfX, hfY);
    doc.setTextColor(...ZINC300);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    const vLines = doc.splitTextToSize(safe(hf.v), hfColW - 4);
    doc.text(vLines[0] ?? safe(hf.v), hfX, hfY + 5.5);
    hfY += 13;
  });

  y += horseCardH + 8;

  // Recommended regions
  if (result.recommendedRegions.length > 0) {
    y = addSectionTitle(doc, "Regiões Recomendadas", y);

    const regGap = 3;
    const regW = (CONTENT_W - regGap * (result.recommendedRegions.length - 1)) / Math.max(result.recommendedRegions.length, 1);
    const regH = 14;

    result.recommendedRegions.slice(0, 5).forEach((reg, i) => {
      const rx = MARGIN + i * (Math.min(regW, 50) + regGap);
      doc.setFillColor(...CARD_BG2);
      doc.roundedRect(rx, y, Math.min(regW, 50), regH, 2, 2, "F");
      doc.setFillColor(...GOLD);
      doc.roundedRect(rx, y, Math.min(regW, 50), 1.5, 0.5, 0.5, "F");
      doc.setTextColor(...ZINC400);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.text(safe(reg), rx + Math.min(regW, 50) / 2, y + 10, { align: "center" });
    });

    y += regH + 10;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 3 — CUSTOS & LINHAGENS
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  fillPageBg(doc);
  addPageHeader(doc, "Custos & Linhagens", "Página 3 de 4");

  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.text(safe(result.title).slice(0, 40), PAGE_W / 2, 15, { align: "center" });

  y = 30;

  // Annual costs hero card
  y = addSectionTitle(doc, "Custos Anuais Estimados", y);

  const costsH = 28;
  doc.setFillColor(...CARD_BG);
  doc.roundedRect(MARGIN, y, CONTENT_W, costsH, 3, 3, "F");
  doc.setDrawColor(...profileColor);
  doc.setLineWidth(0.7);
  doc.roundedRect(MARGIN, y, CONTENT_W, costsH, 3, 3, "S");
  doc.setFillColor(...profileColor);
  doc.roundedRect(MARGIN, y, 3, costsH, 1.5, 1.5, "F");

  // Range label
  doc.setTextColor(...ZINC400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("INTERVALO ANUAL ESTIMADO", MARGIN + 9, y + 10);

  const costsStr = `${result.annualCosts.min.toLocaleString("pt-PT")} — ${result.annualCosts.max.toLocaleString("pt-PT")} EUR`;
  doc.setTextColor(...WHITE);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(safe(costsStr), MARGIN + 9, y + 22);

  // Monthly estimate
  const monthlyMin = Math.round(result.annualCosts.min / 12);
  const monthlyMax = Math.round(result.annualCosts.max / 12);
  doc.setTextColor(...ZINC600);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    safe(`~${monthlyMin.toLocaleString("pt-PT")} — ${monthlyMax.toLocaleString("pt-PT")} EUR / mês`),
    PAGE_W - MARGIN - 5,
    y + 22,
    { align: "right" }
  );

  y += costsH + 8;

  // Cost includes
  if (result.annualCosts.includes.length > 0) {
    doc.setTextColor(...ZINC600);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.text("INCLUI:", MARGIN, y);
    y += 5;

    const includesCols = 2;
    const includesColW = CONTENT_W / includesCols - 3;
    result.annualCosts.includes.forEach((item, i) => {
      if (y > 265) return;
      const col = i % includesCols;
      const row = Math.floor(i / includesCols);
      const ix = MARGIN + col * (includesColW + 6);
      const iy = y + row * 6;

      doc.setFillColor(...profileColor);
      doc.circle(ix + 2, iy - 0.5, 0.8, "F");
      doc.setTextColor(...ZINC400);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      const iLines = doc.splitTextToSize(safe(item), includesColW - 8);
      doc.text(iLines[0] ?? safe(item), ix + 6, iy);
    });

    const includesRows = Math.ceil(result.annualCosts.includes.length / includesCols);
    y += includesRows * 6 + 8;
  }

  // Separator
  doc.setFillColor(35, 35, 35);
  doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
  y += 9;

  // Lineages
  if (result.linhagens.length > 0) {
    y = addSectionTitle(doc, "Linhagens Recomendadas", y);

    result.linhagens.forEach((lin) => {
      if (y > 265) return;
      const linH = 16;
      doc.setFillColor(...CARD_BG2);
      doc.roundedRect(MARGIN, y, CONTENT_W, linH, 2, 2, "F");
      doc.setFillColor(...GOLD);
      doc.roundedRect(MARGIN, y, 2.5, linH, 1, 1, "F");

      doc.setTextColor(...WHITE);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(safe(lin.name), MARGIN + 7, y + 7);

      doc.setTextColor(...ZINC400);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      const rLines = doc.splitTextToSize(safe(lin.reason), CONTENT_W - 12);
      doc.text(rLines[0] ?? safe(lin.reason), MARGIN + 7, y + 13);

      y += linH + 3;
    });
    y += 4;
  }

  // Famous horses
  if (result.famousHorses && result.famousHorses.length > 0) {
    doc.setFillColor(35, 35, 35);
    doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
    y += 9;

    y = addSectionTitle(doc, "Cavalos de Referência PSL", y);

    const fhCols = 2;
    const fhColW = CONTENT_W / fhCols - 3;

    result.famousHorses.slice(0, 6).forEach((fh, i) => {
      if (y > 260) return;
      const col = i % fhCols;
      const row = Math.floor(i / fhCols);
      const fx = MARGIN + col * (fhColW + 6);
      const fy = y + row * 14;

      doc.setFillColor(18, 18, 18);
      doc.roundedRect(fx, fy - 3, fhColW, 13, 1.5, 1.5, "F");
      doc.setFillColor(...GOLD);
      doc.roundedRect(fx, fy - 3, fhColW, 1.5, 0.5, 0.5, "F");

      doc.setTextColor(...WHITE);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(safe(fh.name), fx + 4, fy + 2);

      doc.setTextColor(...ZINC600);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "normal");
      const achLines = doc.splitTextToSize(safe(fh.achievement), fhColW - 8);
      doc.text(achLines[0] ?? safe(fh.achievement), fx + 4, fy + 7);
    });

    const fhRows = Math.ceil(Math.min(result.famousHorses.length, 6) / fhCols);
    y += fhRows * 14 + 6;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 4 — DICAS & PRÓXIMOS PASSOS
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  fillPageBg(doc);
  addPageHeader(doc, "Dicas & Próximos Passos", "Página 4 de 4");

  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.text(safe(result.title).slice(0, 40), PAGE_W / 2, 15, { align: "center" });

  y = 30;

  // Tips
  if (result.tips.length > 0) {
    y = addSectionTitle(doc, "Dicas para o Seu Perfil", y);
    for (const tip of result.tips) {
      if (y > 265) break;
      y = addBulletItem(doc, tip, "recomendacao", y);
    }
    y += 6;
  }

  // Separator
  if (y < 200) {
    doc.setFillColor(35, 35, 35);
    doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
    y += 9;
  }

  // Next steps as numbered list
  if (result.nextSteps.length > 0) {
    y = addSectionTitle(doc, "Próximos Passos Recomendados", y);

    result.nextSteps.forEach((step, i) => {
      if (y > 268) return;
      const stepH = 14;
      doc.setFillColor(18, 18, 18);
      doc.roundedRect(MARGIN, y, CONTENT_W, stepH, 2, 2, "F");

      // Step number circle
      doc.setFillColor(...profileColor);
      doc.circle(MARGIN + 6, y + stepH / 2, 3.5, "F");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}`, MARGIN + 6, y + stepH / 2 + 1.5, { align: "center" });

      // Step text
      doc.setTextColor(...ZINC300);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      const sLines = doc.splitTextToSize(safe(step), CONTENT_W - 20);
      doc.text(sLines[0] ?? safe(step), MARGIN + 14, y + stepH / 2 + 1.5);

      y += stepH + 2;
    });
    y += 6;
  }

  // ── Timeline section (if space allows) ─────────────────────────────────────
  if (result.timeline && result.timeline.length > 0 && y < 220) {
    doc.setFillColor(35, 35, 35);
    doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
    y += 9;

    y = addSectionTitle(doc, "Cronograma Recomendado", y);

    result.timeline.slice(0, 6).forEach((tl, i) => {
      if (y > 268) return;

      const tCols = 3;
      const tColW = CONTENT_W / tCols - 2;
      const col = i % tCols;
      const row = Math.floor(i / tCols);
      const tx = MARGIN + col * (tColW + 3);
      const ty = y + row * 22;
      const tlH = 20;

      doc.setFillColor(...CARD_BG2);
      doc.roundedRect(tx, ty, tColW, tlH, 1.5, 1.5, "F");
      doc.setFillColor(...profileColor);
      doc.roundedRect(tx, ty, tColW, 1.5, 0.5, 0.5, "F");

      doc.setTextColor(...GOLD);
      doc.setFontSize(6);
      doc.setFont("helvetica", "bold");
      doc.text(safe(tl.month).toUpperCase(), tx + 4, ty + 6);

      doc.setTextColor(...WHITE);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      const ttLines = doc.splitTextToSize(safe(tl.title), tColW - 6);
      doc.text(ttLines[0] ?? safe(tl.title), tx + 4, ty + 11);

      doc.setTextColor(...ZINC600);
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      const tdLines = doc.splitTextToSize(safe(tl.description), tColW - 6);
      doc.text(tdLines[0] ?? safe(tl.description), tx + 4, ty + 16);
    });

    const tlRows = Math.ceil(Math.min(result.timeline.length, 6) / 3);
    y += tlRows * 22 + 6;
  }

  // ── Certification block ────────────────────────────────────────────────────
  const certY = Math.max(y + 4, 240);
  if (certY < 268) {
    const certH = 24;
    doc.setFillColor(18, 18, 18);
    doc.roundedRect(MARGIN, certY, CONTENT_W, certH, 3, 3, "F");
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.6);
    doc.roundedRect(MARGIN, certY, CONTENT_W, certH, 3, 3, "S");
    doc.setFillColor(...GOLD);
    doc.roundedRect(MARGIN, certY, 3, certH, 1.5, 1.5, "F");

    doc.setTextColor(...GOLD);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("ANÁLISE DE PERFIL — PORTAL LUSITANO", MARGIN + 9, certY + 7);

    doc.setFillColor(35, 35, 35);
    doc.rect(MARGIN + 9, certY + 9, CONTENT_W - 13, 0.3, "F");

    doc.setTextColor(...WHITE);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(safe(result.title), MARGIN + 9, certY + 16);

    doc.setTextColor(...ZINC400);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(
      safe(`Compatibilidade: ${mainPct}%  |  ${date}  |  Ref: ${refNum}`),
      MARGIN + 9,
      certY + 22
    );

    // Profile color pill
    const profStr = safe(result.profile.toUpperCase());
    doc.setFontSize(7);
    const profW = doc.getTextWidth(profStr) + 8;
    doc.setFillColor(30, 30, 30);
    doc.roundedRect(PAGE_W - MARGIN - profW - 2, certY + 8, profW, 8, 2, 2, "F");
    doc.setTextColor(...profileColor);
    doc.setFont("helvetica", "bold");
    doc.text(profStr, PAGE_W - MARGIN - profW / 2 - 2, certY + 13.5, { align: "center" });
  }

  // ── Footer ──────────────────────────────────────────────────────────────────
  addPremiumFooter(doc);
  addPremiumWatermark(doc, "PORTAL LUSITANO");

  doc.save(`analise-perfil-${result.profile}-${Date.now().toString(36).slice(-6)}.pdf`);
}

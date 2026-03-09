import {
  createPremiumPDF,
  fillPageBg,
  addCoverTopBar,
  addPageHeader,
  addSectionTitle,
  addSectionTitleWithCount,
  addKV,
  addKVWithHealthBadge,
  addLargeBar,
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
  ZINC400,
  ZINC600,
  ZINC300,
  GREEN,
  AMBER,
  RED,
  MARGIN,
  PAGE_W,
  PAGE_H,
  CONTENT_W,
} from "./base-premium";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CavaloCompat {
  nome: string;
  sexo: string;
  idade: number;
  altura: number;
  pelagem: string;
  linhagem: string;
  conformacao: number;
  andamentos: number;
  temperamento: string;
  saude: number;
  blup: number;
  coi: number;
}

interface ResultadoCompat {
  score: number;
  nivel: string;
  coi: number;
  blup: number;
  altura: { min: number; max: number };
  pelagens: { cor: string; prob: number; genetica: string }[];
  riscos: { texto: string; severidade: "alto" | "medio" | "baixo" }[];
  factores: { nome: string; score: number; max: number; tipo: string; descricao: string }[];
  recomendacoes: string[];
  pontosForteseFracos: { fortes: string[]; fracos: string[] };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nivelColor(score: number): [number, number, number] {
  if (score >= 80) return GREEN;
  if (score >= 60) return GOLD;
  if (score >= 40) return AMBER;
  return RED;
}

function riscoColor(
  severidade: "alto" | "medio" | "baixo"
): [number, number, number] {
  if (severidade === "alto") return RED;
  if (severidade === "medio") return AMBER;
  return GOLD;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export async function generateCompatibilidadePDF(
  garanhao: CavaloCompat,
  egua: CavaloCompat,
  resultado: ResultadoCompat,
  language?: string,
  isPremium = false
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = await createPremiumPDF();
  const L = (pt: string, en: string, es?: string): string =>
    language === "en" ? en : language === "es" && es ? es : pt;
  const locale = language === "en" ? "en-GB" : language === "es" ? "es-ES" : "pt-PT";
  const pairName = `${garanhao.nome || L("Garanhão", "Stallion", "Garañón")} × ${egua.nome || L("Égua", "Mare", "Yegua")}`;
  const date = new Date().toLocaleDateString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const refNum = `PLP-${Date.now().toString(36).toUpperCase().slice(-8)}`;
  const scoreColor = nivelColor(resultado.score);

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — COVER
  // ═══════════════════════════════════════════════════════════════════════════
  fillPageBg(doc);

  // Background decorative elements
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.3);
  doc.line(PAGE_W, 0, PAGE_W - PAGE_H, PAGE_H);
  doc.line(PAGE_W + 50, 0, PAGE_W + 50 - PAGE_H, PAGE_H);
  doc.setDrawColor(15, 15, 15);
  doc.setLineWidth(0.4);
  doc.circle(PAGE_W * 0.72, PAGE_H * 0.42, 55, "S");

  addCoverTopBar(doc, language);

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

  // Compatibility score arc (top-right)
  addScoreArc(doc, resultado.score, PAGE_W - MARGIN - 14, 35, 10);

  // Title
  let y = 28;
  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(safe(pairName), CONTENT_W - 28);
  doc.text(titleLines[0] ?? safe(pairName), MARGIN, y);
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
  doc.setTextColor(...ZINC400);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(L("Análise de Compatibilidade Genética e Reprodutiva PSL", "PSL Genetic and Reproductive Compatibility Analysis", "Análisis de Compatibilidad Genética y Reproductiva PSL"), MARGIN, y);

  // Compatibility level badge
  y += 8;
  const nivelLabel = safe(resultado.nivel);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  const nivelW = doc.getTextWidth(nivelLabel) + 10;
  doc.setFillColor(
    Math.round(scoreColor[0] * 0.2 + DARK_BG[0] * 0.8),
    Math.round(scoreColor[1] * 0.2 + DARK_BG[1] * 0.8),
    Math.round(scoreColor[2] * 0.2 + DARK_BG[2] * 0.8)
  );
  doc.roundedRect(MARGIN, y, nivelW, 6, 1.5, 1.5, "F");
  doc.setDrawColor(...scoreColor);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, nivelW, 6, 1.5, 1.5, "S");
  doc.setTextColor(...scoreColor);
  doc.text(nivelLabel, MARGIN + nivelW / 2, y + 4, { align: "center" });
  y += 12;

  // ── Hero Score Card ──────────────────────────────────────────────────────
  const heroH = 52;
  doc.setFillColor(...CARD_BG);
  doc.roundedRect(MARGIN, y, CONTENT_W, heroH, 3, 3, "F");
  doc.setDrawColor(...scoreColor);
  doc.setLineWidth(0.7);
  doc.roundedRect(MARGIN, y, CONTENT_W, heroH, 3, 3, "S");
  doc.setFillColor(...scoreColor);
  doc.roundedRect(MARGIN, y, 3, heroH, 1.5, 1.5, "F");

  // Left: score value
  doc.setTextColor(...ZINC400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(L("SCORE DE COMPATIBILIDADE", "COMPATIBILITY SCORE", "SCORE DE COMPATIBILIDAD"), MARGIN + 9, y + 11);

  doc.setTextColor(...WHITE);
  doc.setFontSize(38);
  doc.setFont("helvetica", "bold");
  doc.text(`${resultado.score}`, MARGIN + 9, y + 34);

  doc.setTextColor(...scoreColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("/100", MARGIN + 9, y + 44);

  // Right: three key genetic metrics
  const rightX = MARGIN + CONTENT_W * 0.5;
  const rightW = CONTENT_W * 0.5 - 6;

  // COI
  doc.setTextColor(...ZINC600);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(L("COI PREVISTO", "PREDICTED COI", "COI PREVISTO"), rightX, y + 11);
  doc.setTextColor(...WHITE);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(`${resultado.coi.toFixed(1)}%`, rightX, y + 22);

  // BLUP
  doc.setTextColor(...ZINC600);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(L("BLUP PREVISTO", "PREDICTED BLUP", "BLUP PREVISTO"), rightX + rightW / 2, y + 11, { align: "center" });
  doc.setTextColor(...WHITE);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(`${resultado.blup}`, rightX + rightW / 2, y + 22, { align: "center" });

  // Height range
  doc.setTextColor(...ZINC600);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(L("ALTURA ESTIMADA", "ESTIMATED HEIGHT", "ALTURA ESTIMADA"), rightX + rightW, y + 11, { align: "right" });
  doc.setTextColor(...WHITE);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${resultado.altura.min}-${resultado.altura.max} cm`,
    rightX + rightW,
    y + 22,
    { align: "right" }
  );

  // Mini metric bar under COI/BLUP/height
  const coiPct = Math.min(resultado.coi / 12, 1); // 12% max COI warning threshold
  const coiColor: [number, number, number] = resultado.coi < 3 ? GREEN : resultado.coi < 6 ? GOLD : AMBER;
  const miniBarW = rightW - 4;
  doc.setFillColor(30, 30, 30);
  doc.roundedRect(rightX, y + 28, miniBarW, 3, 0.8, 0.8, "F");
  if (coiPct > 0.01) {
    doc.setFillColor(...coiColor);
    doc.roundedRect(rightX, y + 28, Math.max(miniBarW * (1 - coiPct), 4), 3, 0.8, 0.8, "F");
  }
  doc.setTextColor(...ZINC600);
  doc.setFontSize(5.5);
  doc.setFont("helvetica", "normal");
  doc.text(L("Saúde Genética", "Genetic Health", "Salud Genética"), rightX, y + 35);
  doc.setTextColor(...coiColor);
  doc.setFont("helvetica", "bold");
  doc.text(
    resultado.coi < 3 ? L("Excelente", "Excellent", "Excelente") : resultado.coi < 6 ? L("Boa", "Good", "Buena") : L("Atenção", "Attention", "Atención"),
    rightX + miniBarW,
    y + 35,
    { align: "right" }
  );

  // Separator
  doc.setDrawColor(35, 35, 35);
  doc.setLineWidth(0.3);
  doc.line(rightX - 5, y + 5, rightX - 5, y + heroH - 5);

  y += heroH + 6;

  // ── Metrics Row ────────────────────────────────────────────────────────────
  y = addMetricsRow(
    doc,
    [
      { label: L("Compatibilidade", "Compatibility", "Compatibilidad"), value: `${resultado.score}%` },
      { label: L("Progenitores", "Progenitors", "Progenitores"), value: "2" },
      { label: L("Factores Avaliados", "Factors Evaluated", "Factores Evaluados"), value: `${resultado.factores.length}` },
      { label: L("Pelagens Previstas", "Predicted Coats", "Pelajes Previstos"), value: `${resultado.pelagens.length}` },
    ],
    y
  );

  // ── Progenitor summary ──────────────────────────────────────────────────────
  y += 4;
  doc.setFillColor(35, 35, 35);
  doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
  y += 8;

  const halfW = CONTENT_W / 2 - 4;
  const garX = MARGIN;
  const eguaX = MARGIN + CONTENT_W / 2 + 4;

  // Garanhão card
  doc.setFillColor(...CARD_BG2);
  doc.roundedRect(garX, y, halfW, 22, 2, 2, "F");
  doc.setFillColor(...GOLD);
  doc.roundedRect(garX, y, halfW, 1.5, 0.5, 0.5, "F");
  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text(L("GARANHÃO ♂", "STALLION ♂", "GARAÑÓN ♂"), garX + halfW / 2, y + 6, { align: "center" });
  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const garName = doc.splitTextToSize(safe(garanhao.nome || L("Garanhão", "Stallion", "Garañón")), halfW - 8);
  doc.text(garName[0], garX + halfW / 2, y + 13, { align: "center" });
  doc.setTextColor(...ZINC400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`${garanhao.idade} ${L("anos", "years", "años")} · ${garanhao.altura} cm · BLUP ${garanhao.blup}`, garX + halfW / 2, y + 19, { align: "center" });

  // Égua card
  doc.setFillColor(...CARD_BG2);
  doc.roundedRect(eguaX, y, halfW, 22, 2, 2, "F");
  doc.setFillColor(...GOLD);
  doc.roundedRect(eguaX, y, halfW, 1.5, 0.5, 0.5, "F");
  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text(L("ÉGUA ♀", "MARE ♀", "YEGUA ♀"), eguaX + halfW / 2, y + 6, { align: "center" });
  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const eguaName = doc.splitTextToSize(safe(egua.nome || L("Égua", "Mare", "Yegua")), halfW - 8);
  doc.text(eguaName[0], eguaX + halfW / 2, y + 13, { align: "center" });
  doc.setTextColor(...ZINC400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`${egua.idade} ${L("anos", "years", "años")} · ${egua.altura} cm · BLUP ${egua.blup}`, eguaX + halfW / 2, y + 19, { align: "center" });

  // "×" connector
  doc.setTextColor(...GOLD);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("×", PAGE_W / 2, y + 13, { align: "center" });

  y += 30;

  // ── Content preview ─────────────────────────────────────────────────────────
  const previews = [
    L("Dados dos progenitores comparados  (pág. 2)", "Compared progenitor data  (p. 2)", "Datos de los progenitores comparados  (pág. 2)"),
    L("Análise por factor de compatibilidade  (pág. 2)", "Compatibility factor analysis  (p. 2)", "Análisis por factor de compatibilidad  (pág. 2)"),
    L("Previsão de pelagens da cria  (pág. 3)", "Offspring coat prediction  (p. 3)", "Previsión de pelajes de la cría  (pág. 3)"),
    L("Alertas genéticos e riscos  (pág. 3)", "Genetic alerts and risks  (p. 3)", "Alertas genéticas y riesgos  (pág. 3)"),
    L("Pontos fortes, fracos e recomendações  (pág. 3)", "Strengths, weaknesses and recommendations  (p. 3)", "Puntos fuertes, débiles y recomendaciones  (pág. 3)"),
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

  // ── Bottom accent ───────────────────────────────────────────────────────────
  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, 270, CONTENT_W, 0.4, "F");
  doc.setTextColor(...GOLD);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(L("PORTAL LUSITANO  |  ANÁLISE REPRODUTIVA", "PORTAL LUSITANO  |  REPRODUCTIVE ANALYSIS", "PORTAL LUSITANO  |  ANÁLISIS REPRODUCTIVO") + "  |  " + safe(date), PAGE_W / 2, 275, { align: "center" });
  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text(`Ref: ${refNum}`, PAGE_W - MARGIN, 280, { align: "right" });

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 2 — PROGENITORES & ANÁLISE POR FACTOR
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  fillPageBg(doc);
  addPageHeader(doc, L("Dados dos Progenitores", "Progenitor Data", "Datos de los Progenitores"), L("Página 2 de 3", "Page 2 of 3", "Página 2 de 3"));

  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.text(safe(pairName).slice(0, 40), PAGE_W / 2, 15, { align: "center" });

  y = 30;
  y = addSectionTitle(doc, L("Comparação dos Progenitores", "Progenitor Comparison", "Comparación de los Progenitores"), y);

  // Two-column horse data
  const colLX = MARGIN;
  const colRX = MARGIN + CONTENT_W / 2 + 5;
  const colW = CONTENT_W / 2 - 7;

  // Column headers
  doc.setFillColor(...CARD_BG2);
  doc.roundedRect(colLX, y, colW, 8, 1.5, 1.5, "F");
  doc.setFillColor(...GOLD);
  doc.roundedRect(colLX, y, colW, 1.5, 0.5, 0.5, "F");
  doc.setTextColor(...ZINC400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(L("GARANHÃO", "STALLION", "GARAÑÓN"), colLX + colW / 2, y + 5.5, { align: "center" });

  doc.setFillColor(...CARD_BG2);
  doc.roundedRect(colRX, y, colW, 8, 1.5, 1.5, "F");
  doc.setFillColor(...GOLD);
  doc.roundedRect(colRX, y, colW, 1.5, 0.5, 0.5, "F");
  doc.setTextColor(...ZINC400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(L("ÉGUA", "MARE", "YEGUA"), colRX + colW / 2, y + 5.5, { align: "center" });

  y += 12;

  let yL = y;
  let yR = y;

  yL = addKV(doc, L("Nome", "Name", "Nombre"), garanhao.nome || L("Não especificado", "Not specified", "No especificado"), colLX, yL, colW);
  yL = addKV(doc, L("Idade", "Age", "Edad"), `${garanhao.idade} ${L("anos", "years", "años")}`, colLX, yL, colW);
  yL = addKV(doc, L("Altura", "Height", "Altura"), `${garanhao.altura} cm`, colLX, yL, colW);
  yL = addKV(doc, L("Pelagem", "Coat", "Pelaje"), safe(garanhao.pelagem), colLX, yL, colW);
  yL = addKV(doc, L("Linhagem", "Lineage", "Linaje"), safe(garanhao.linhagem), colLX, yL, colW);
  yL = addKV(doc, L("Conformação", "Conformation", "Conformación"), `${garanhao.conformacao}/10`, colLX, yL, colW);
  yL = addKV(doc, L("Andamentos", "Gaits", "Aires"), `${garanhao.andamentos}/10`, colLX, yL, colW);
  yL = addKV(doc, L("Temperamento", "Temperament", "Temperamento"), safe(garanhao.temperamento), colLX, yL, colW);
  yL = addKVWithHealthBadge(doc, L("Saúde", "Health", "Salud"), `${garanhao.saude}/10`, garanhao.saude >= 8 ? "excelente" : garanhao.saude >= 6 ? "bom" : "regular", colLX, yL, colW);
  yL = addKV(doc, "BLUP", `${garanhao.blup}`, colLX, yL, colW);
  yL = addKV(doc, "COI", `${garanhao.coi}%`, colLX, yL, colW);

  yR = addKV(doc, L("Nome", "Name", "Nombre"), egua.nome || L("Não especificado", "Not specified", "No especificado"), colRX, yR, colW);
  yR = addKV(doc, L("Idade", "Age", "Edad"), `${egua.idade} ${L("anos", "years", "años")}`, colRX, yR, colW);
  yR = addKV(doc, L("Altura", "Height", "Altura"), `${egua.altura} cm`, colRX, yR, colW);
  yR = addKV(doc, L("Pelagem", "Coat", "Pelaje"), safe(egua.pelagem), colRX, yR, colW);
  yR = addKV(doc, L("Linhagem", "Lineage", "Linaje"), safe(egua.linhagem), colRX, yR, colW);
  yR = addKV(doc, L("Conformação", "Conformation", "Conformación"), `${egua.conformacao}/10`, colRX, yR, colW);
  yR = addKV(doc, L("Andamentos", "Gaits", "Aires"), `${egua.andamentos}/10`, colRX, yR, colW);
  yR = addKV(doc, L("Temperamento", "Temperament", "Temperamento"), safe(egua.temperamento), colRX, yR, colW);
  yR = addKVWithHealthBadge(doc, L("Saúde", "Health", "Salud"), `${egua.saude}/10`, egua.saude >= 8 ? "excelente" : egua.saude >= 6 ? "bom" : "regular", colRX, yR, colW);
  yR = addKV(doc, "BLUP", `${egua.blup}`, colRX, yR, colW);
  yR = addKV(doc, "COI", `${egua.coi}%`, colRX, yR, colW);

  y = Math.max(yL, yR) + 6;

  // Separator
  doc.setFillColor(35, 35, 35);
  doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
  y += 9;

  // Factor analysis bars
  y = addSectionTitle(doc, L("Análise por Factor de Compatibilidade", "Compatibility Factor Analysis", "Análisis por Factor de Compatibilidad"), y);

  for (const f of resultado.factores) {
    if (y > 265) break;
    y = addLargeBar(doc, f.nome, f.score, f.max, y, f.descricao || undefined);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 3 — PELAGENS, RISCOS & RECOMENDAÇÕES
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  fillPageBg(doc);
  addPageHeader(doc, L("Previsão Genética & Recomendações", "Genetic Prediction & Recommendations", "Previsión Genética & Recomendaciones"), L("Página 3 de 3", "Page 3 of 3", "Página 3 de 3"));

  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.text(safe(pairName).slice(0, 40), PAGE_W / 2, 15, { align: "center" });

  y = 30;

  // ── Coat colour predictions ────────────────────────────────────────────────
  if (resultado.pelagens.length > 0) {
    y = addSectionTitle(doc, L("Previsão de Pelagem da Cria", "Offspring Coat Prediction", "Previsión de Pelaje de la Cría"), y);

    const coatCols = Math.min(resultado.pelagens.length, 3);
    const coatGap = 3;
    const coatW = (CONTENT_W - coatGap * (coatCols - 1)) / coatCols;
    const coatH = 24;

    resultado.pelagens.slice(0, 6).forEach((p, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const cx = MARGIN + col * (coatW + coatGap);
      const cy = y + row * (coatH + 3);

      const probColor: [number, number, number] = p.prob >= 40 ? GREEN : p.prob >= 20 ? GOLD : ZINC400;

      doc.setFillColor(...CARD_BG2);
      doc.roundedRect(cx, cy, coatW, coatH, 2, 2, "F");
      doc.setFillColor(...probColor);
      doc.roundedRect(cx, cy, coatW, 1.5, 0.5, 0.5, "F");

      doc.setTextColor(...WHITE);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.text(safe(p.cor), cx + coatW / 2, cy + 9, { align: "center" });

      doc.setTextColor(...probColor);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`${p.prob}%`, cx + coatW / 2, cy + 17, { align: "center" });

      doc.setTextColor(...ZINC600);
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      const genLines = doc.splitTextToSize(safe(p.genetica), coatW - 4);
      doc.text(genLines[0] ?? safe(p.genetica), cx + coatW / 2, cy + 22, { align: "center" });
    });

    const coatRows = Math.ceil(Math.min(resultado.pelagens.length, 6) / 3);
    y += coatRows * (coatH + 3) + 4;
  }

  // ── Genetic risks ──────────────────────────────────────────────────────────
  if (resultado.riscos.length > 0) {
    y = addSectionTitleWithCount(doc, L("Alertas e Riscos Genéticos", "Genetic Alerts and Risks", "Alertas y Riesgos Genéticos"), resultado.riscos.length, RED, y);

    for (const r of resultado.riscos) {
      if (y > 265) break;
      const rColor = riscoColor(r.severidade);
      const rBulletType = r.severidade === "alto" ? "fraco" : "recomendacao";

      // Severity badge
      const sevLabel = `${r.severidade.toUpperCase()}`;
      y = addBulletItem(doc, `[${sevLabel}] ${r.texto}`, rBulletType, y);
    }
    y += 4;
  }

  // ── Strengths ──────────────────────────────────────────────────────────────
  if (resultado.pontosForteseFracos.fortes.length > 0) {
    y = addSectionTitleWithCount(
      doc,
      L("Pontos Fortes da Combinação", "Combination Strengths", "Puntos Fuertes de la Combinación"),
      resultado.pontosForteseFracos.fortes.length,
      GREEN,
      y
    );
    for (const ponto of resultado.pontosForteseFracos.fortes) {
      if (y > 265) break;
      y = addBulletItem(doc, ponto, "forte", y);
    }
    y += 4;
  }

  // ── Weaknesses ─────────────────────────────────────────────────────────────
  if (resultado.pontosForteseFracos.fracos.length > 0) {
    y = addSectionTitleWithCount(
      doc,
      L("Áreas de Atenção", "Areas of Attention", "Áreas de Atención"),
      resultado.pontosForteseFracos.fracos.length,
      AMBER,
      y
    );
    for (const ponto of resultado.pontosForteseFracos.fracos) {
      if (y > 265) break;
      y = addBulletItem(doc, ponto, "fraco", y);
    }
    y += 4;
  }

  // ── Recommendations ────────────────────────────────────────────────────────
  if (resultado.recomendacoes.length > 0) {
    y = addSectionTitleWithCount(
      doc,
      L("Recomendações", "Recommendations", "Recomendaciones"),
      resultado.recomendacoes.length,
      GOLD,
      y
    );
    for (const rec of resultado.recomendacoes) {
      if (y > 265) break;
      y = addBulletItem(doc, rec, "recomendacao", y);
    }
    y += 4;
  }

  // ── Methodology note ───────────────────────────────────────────────────────
  if (y < 258) {
    y += 4;
    const methBoxH = 22;
    doc.setFillColor(25, 25, 25);
    doc.roundedRect(MARGIN, y, CONTENT_W, methBoxH, 2, 2, "F");
    doc.setFillColor(...GOLD);
    doc.roundedRect(MARGIN, y, 2.5, methBoxH, 1, 1, "F");

    doc.setTextColor(...GOLD);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(L("METODOLOGIA DE ANÁLISE", "ANALYSIS METHODOLOGY", "METODOLOGÍA DE ANÁLISIS"), MARGIN + 7, y + 6);

    const methBullets = [
      safe(L(
        "Cálculo de COI (Coeficiente de Endogamia) previsto com base nas linhagens dos progenitores",
        "COI (Inbreeding Coefficient) calculation predicted based on progenitor lineages",
        "Cálculo de COI (Coeficiente de Endogamia) previsto con base en los linajes de los progenitores"
      )),
      safe(L(
        "BLUP estimado pela média ponderada dos valores genéticos dos pais e descendentes",
        "BLUP estimated by weighted average of parents' and descendants' genetic values",
        "BLUP estimado por la media ponderada de los valores genéticos de los padres y descendientes"
      )),
      safe(L(
        "Compatibilidade avaliada por 8+ factores incluindo genética, morfologia, temperamento e saúde",
        "Compatibility evaluated by 8+ factors including genetics, morphology, temperament and health",
        "Compatibilidad evaluada por 8+ factores incluyendo genética, morfología, temperamento y salud"
      )),
    ];

    doc.setTextColor(...ZINC400);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    methBullets.forEach((bullet, i) => {
      const bulletY = y + 12 + i * 4.5;
      doc.setFillColor(...GOLD);
      doc.circle(MARGIN + 8.5, bulletY - 1, 0.7, "F");
      const bulletLines = doc.splitTextToSize(bullet, CONTENT_W - 18) as string[];
      doc.setTextColor(...ZINC400);
      doc.text(bulletLines[0] ?? bullet, MARGIN + 11, bulletY);
    });
  }

  // ── Footer & watermark ─────────────────────────────────────────────────────
  addPremiumFooter(doc, language);
  if (!isPremium) {
    addPremiumWatermark(doc, language);
  }

  doc.save(
    `compatibilidade-${garanhao.nome || "garanhao"}-${egua.nome || "egua"}-${Date.now()}.pdf`
  );
}

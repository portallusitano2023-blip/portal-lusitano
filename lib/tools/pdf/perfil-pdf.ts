import {
  createPremiumPDF,
  fillPageBg,
  addCoverTopBar,
  addPageHeader,
  addSectionTitle,
  addBulletItem,
  addKV,
  addMetricsRow,
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
  MARGIN,
  PAGE_W,
  PAGE_H,
  CONTENT_W,
} from "./base-premium";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PerfilData {
  profile: string;
  title: string;
  subtitle: string;
  description: string;
  characteristics: string[];
  idealHorse: {
    age: string;
    height: string;
    training: string;
    temperament: string;
    priceRange: string;
  };
  annualCosts: {
    min: number;
    max: number;
    includes: string[];
  };
  recommendedRegions: string[];
  linhagens: { name: string; reason: string }[];
  disciplinas: string[];
  tips: string[];
  nextSteps: string[];
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export async function generatePerfilPDF(profileData: PerfilData, language?: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = await createPremiumPDF();
  const locale = language === "en" ? "en-GB" : language === "es" ? "es-ES" : "pt-PT";
  const trMes = language === "en" ? "month" : language === "es" ? "mes" : "mês";
  const date = new Date().toLocaleDateString(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const refNum = `PLR-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — COVER
  // ═══════════════════════════════════════════════════════════════════════════
  fillPageBg(doc);

  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.3);
  doc.line(PAGE_W, 0, PAGE_W - PAGE_H, PAGE_H);
  doc.setDrawColor(15, 15, 15);
  doc.setLineWidth(0.4);
  doc.circle(PAGE_W * 0.75, PAGE_H * 0.4, 60, "S");

  addCoverTopBar(doc);

  // Gold corner brackets
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  const bLen = 3;
  doc.line(MARGIN - 4, 22, MARGIN - 4 + bLen, 22);
  doc.line(MARGIN - 4, 22, MARGIN - 4, 22 + bLen);
  doc.line(PAGE_W - MARGIN + 4, 22, PAGE_W - MARGIN + 4 - bLen, 22);
  doc.line(PAGE_W - MARGIN + 4, 22, PAGE_W - MARGIN + 4, 22 + bLen);
  doc.line(MARGIN - 4, 268, MARGIN - 4 + bLen, 268);
  doc.line(MARGIN - 4, 268, MARGIN - 4, 268 - bLen);
  doc.line(PAGE_W - MARGIN + 4, 268, PAGE_W - MARGIN + 4 - bLen, 268);
  doc.line(PAGE_W - MARGIN + 4, 268, PAGE_W - MARGIN + 4, 268 - bLen);

  let y = 28;

  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(safe(profileData.title), CONTENT_W - 10);
  doc.text(titleLines[0] ?? safe(profileData.title), MARGIN, y);

  y += 4;
  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, y, CONTENT_W, 0.6, "F");

  y += 7;
  doc.setTextColor(...GOLD);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(safe(profileData.subtitle), MARGIN, y);

  y += 7;
  doc.setTextColor(...ZINC400);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  const descLines = doc.splitTextToSize(safe(profileData.description), CONTENT_W);
  doc.text(descLines.slice(0, 4), MARGIN, y);
  y += descLines.slice(0, 4).length * 5 + 8;

  // Key metrics row
  y = addMetricsRow(
    doc,
    [
      { label: "Características", value: `${profileData.characteristics.length}` },
      { label: "Disciplinas", value: `${profileData.disciplinas.length}` },
      {
        label: "Custos/Ano",
        value: `${Math.round(profileData.annualCosts.min / 1000)}k-${Math.round(profileData.annualCosts.max / 1000)}k€`,
      },
      { label: "Linhagens", value: `${profileData.linhagens.length}` },
    ],
    y
  );

  y += 6;

  // Ideal horse preview card
  const iHH = 34;
  doc.setFillColor(...CARD_BG);
  doc.roundedRect(MARGIN, y, CONTENT_W, iHH, 3, 3, "F");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, y, CONTENT_W, iHH, 3, 3, "S");
  doc.setFillColor(...GOLD);
  doc.roundedRect(MARGIN, y, 3, iHH, 1.5, 1.5, "F");

  doc.setTextColor(...ZINC400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("CAVALO IDEAL — RESUMO", MARGIN + 9, y + 8);

  const ihColW = CONTENT_W / 2 - 10;
  const ihItems = [
    { k: "Idade", v: profileData.idealHorse.age },
    { k: "Altura", v: profileData.idealHorse.height },
    { k: "Treino", v: profileData.idealHorse.training },
    { k: "Preço", v: profileData.idealHorse.priceRange },
  ];

  ihItems.forEach((ih, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const ihX = MARGIN + 9 + col * (ihColW + 10);
    const ihY = y + 16 + row * 10;
    doc.setTextColor(...ZINC600);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(safe(ih.k).toUpperCase(), ihX, ihY);
    doc.setTextColor(...ZINC300);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(safe(ih.v), ihX, ihY + 5.5);
  });

  y += iHH + 8;

  // Content preview
  const previews = [
    "Características detalhadas do perfil  (pág. 2)",
    "Disciplinas e regiões recomendadas  (pág. 2)",
    "Custos anuais estimados e detalhe  (pág. 3)",
    "Linhagens recomendadas  (pág. 3)",
    "Dicas e próximos passos  (pág. 3)",
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

  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, 270, CONTENT_W, 0.4, "F");
  doc.setTextColor(...GOLD);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(`PORTAL LUSITANO  |  RELATÓRIO DE PERFIL  |  ${safe(date)}`, PAGE_W / 2, 275, { align: "center" });
  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text(`Ref: ${refNum}`, PAGE_W - MARGIN, 280, { align: "right" });

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 2 — CARACTERÍSTICAS & DISCIPLINAS
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  fillPageBg(doc);
  addPageHeader(doc, "Características & Disciplinas", "Página 2 de 3");

  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.text(safe(profileData.title).slice(0, 40), PAGE_W / 2, 15, { align: "center" });

  y = 30;

  y = addSectionTitle(doc, "Características do Perfil", y);

  const halfW = CONTENT_W / 2 - 3;
  profileData.characteristics.forEach((c, i) => {
    if (y > 265) return;
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = MARGIN + col * (halfW + 6);

    if (col === 0) {
      doc.setFillColor(18, 18, 18);
      doc.roundedRect(MARGIN, y + row * 8 - 4, halfW, 7, 1, 1, "F");
      doc.setFillColor(...GOLD);
      doc.circle(MARGIN + 4, y + row * 8 - 0.5, 1.2, "F");
      doc.setTextColor(...ZINC300);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const cLines = doc.splitTextToSize(safe(c), halfW - 12);
      doc.text(cLines[0] ?? safe(c), MARGIN + 9, y + row * 8);
    } else {
      doc.setFillColor(18, 18, 18);
      doc.roundedRect(MARGIN + halfW + 6, y + row * 8 - 4, halfW, 7, 1, 1, "F");
      doc.setFillColor(...GOLD);
      doc.circle(MARGIN + halfW + 10, y + row * 8 - 0.5, 1.2, "F");
      doc.setTextColor(...ZINC300);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const cLines = doc.splitTextToSize(safe(c), halfW - 12);
      doc.text(cLines[0] ?? safe(c), MARGIN + halfW + 15, y + row * 8);
    }

    if (col === 1 || i === profileData.characteristics.length - 1) {
      if (i === profileData.characteristics.length - 1 && col === 0) {
        y += 8;
      } else {
        y += 0;
      }
    }
  });

  const charRows = Math.ceil(profileData.characteristics.length / 2);
  y += charRows * 8 + 8;

  // Disciplines
  if (profileData.disciplinas.length > 0) {
    doc.setFillColor(35, 35, 35);
    doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
    y += 9;
    y = addSectionTitle(doc, "Disciplinas Equestres", y);

    let dx = MARGIN;
    profileData.disciplinas.forEach((d) => {
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
        Math.round(GOLD[0] * 0.12 + DARK_BG[0] * 0.88),
        Math.round(GOLD[1] * 0.12 + DARK_BG[1] * 0.88),
        Math.round(GOLD[2] * 0.12 + DARK_BG[2] * 0.88)
      );
      doc.roundedRect(dx, y - 4, dw, 6, 1.5, 1.5, "F");
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.3);
      doc.roundedRect(dx, y - 4, dw, 6, 1.5, 1.5, "S");
      doc.setTextColor(...GOLD);
      doc.text(label, dx + dw / 2, y + 0.5, { align: "center" });
      dx += dw + 3;
    });
    y += 14;
  }

  // Recommended regions
  if (profileData.recommendedRegions.length > 0) {
    doc.setFillColor(35, 35, 35);
    doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
    y += 9;
    y = addSectionTitle(doc, "Regiões Recomendadas", y);

    const regPerRow = Math.min(profileData.recommendedRegions.length, 4);
    const regGap = 3;
    const regW = (CONTENT_W - regGap * (regPerRow - 1)) / regPerRow;
    const regH = 14;

    profileData.recommendedRegions.slice(0, 8).forEach((reg, i) => {
      if (y > 265) return;
      const col = i % 4;
      const row = Math.floor(i / 4);
      const rx = MARGIN + col * (regW + regGap);
      const ry = y + row * (regH + 3);

      doc.setFillColor(...CARD_BG2);
      doc.roundedRect(rx, ry, regW, regH, 2, 2, "F");
      doc.setFillColor(...GOLD);
      doc.roundedRect(rx, ry, regW, 1.5, 0.5, 0.5, "F");
      doc.setTextColor(...ZINC400);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      doc.text(safe(reg), rx + regW / 2, ry + 10, { align: "center" });
    });

    const regRows = Math.ceil(Math.min(profileData.recommendedRegions.length, 8) / 4);
    y += regRows * (regH + 3) + 8;
  }

  // Cavalo ideal detail
  if (y < 220) {
    doc.setFillColor(35, 35, 35);
    doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
    y += 9;
    y = addSectionTitle(doc, "Detalhe do Cavalo Ideal", y);

    const colLX = MARGIN;
    const colRX = MARGIN + CONTENT_W / 2 + 5;
    const colW = CONTENT_W / 2 - 7;
    let yL = y;
    let yR = y;

    yL = addKV(doc, "Idade", profileData.idealHorse.age, colLX, yL, colW);
    yL = addKV(doc, "Altura", profileData.idealHorse.height, colLX, yL, colW);
    yL = addKV(doc, "Faixa de Preço", profileData.idealHorse.priceRange, colLX, yL, colW);

    yR = addKV(doc, "Nível de Treino", profileData.idealHorse.training, colRX, yR, colW);
    yR = addKV(doc, "Temperamento", profileData.idealHorse.temperament, colRX, yR, colW);

    y = Math.max(yL, yR) + 6;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 3 — CUSTOS, LINHAGENS & PRÓXIMOS PASSOS
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  fillPageBg(doc);
  addPageHeader(doc, "Custos, Linhagens & Próximos Passos", "Página 3 de 3");

  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.text(safe(profileData.title).slice(0, 40), PAGE_W / 2, 15, { align: "center" });

  y = 30;

  // Annual costs card
  y = addSectionTitle(doc, "Custos Anuais Estimados", y);

  const costsH = 24;
  doc.setFillColor(...CARD_BG);
  doc.roundedRect(MARGIN, y, CONTENT_W, costsH, 3, 3, "F");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.7);
  doc.roundedRect(MARGIN, y, CONTENT_W, costsH, 3, 3, "S");
  doc.setFillColor(...GOLD);
  doc.roundedRect(MARGIN, y, 3, costsH, 1.5, 1.5, "F");

  doc.setTextColor(...ZINC400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("INTERVALO ANUAL", MARGIN + 9, y + 9);

  const costsStr = `${profileData.annualCosts.min.toLocaleString(locale)} — ${profileData.annualCosts.max.toLocaleString(locale)} EUR`;
  doc.setTextColor(...WHITE);
  doc.setFontSize(15);
  doc.setFont("helvetica", "bold");
  doc.text(safe(costsStr), MARGIN + 9, y + 19);

  const monthlyMin = Math.round(profileData.annualCosts.min / 12);
  const monthlyMax = Math.round(profileData.annualCosts.max / 12);
  doc.setTextColor(...ZINC600);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    safe(`~${monthlyMin.toLocaleString(locale)} — ${monthlyMax.toLocaleString(locale)} EUR/${trMes}`),
    PAGE_W - MARGIN - 5,
    y + 19,
    { align: "right" }
  );

  y += costsH + 6;

  if (profileData.annualCosts.includes.length > 0) {
    const inclCols = 2;
    const inclColW = CONTENT_W / inclCols - 3;
    profileData.annualCosts.includes.forEach((item, i) => {
      if (y > 265) return;
      const col = i % inclCols;
      const row = Math.floor(i / inclCols);
      const ix = MARGIN + col * (inclColW + 6);
      const iy = y + row * 6;

      doc.setFillColor(...GOLD);
      doc.circle(ix + 2, iy - 0.5, 0.8, "F");
      doc.setTextColor(...ZINC400);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      const iLines = doc.splitTextToSize(safe(item), inclColW - 8);
      doc.text(iLines[0] ?? safe(item), ix + 6, iy);
    });
    const inclRows = Math.ceil(profileData.annualCosts.includes.length / inclCols);
    y += inclRows * 6 + 8;
  }

  // Lineages
  if (profileData.linhagens.length > 0) {
    doc.setFillColor(35, 35, 35);
    doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
    y += 9;
    y = addSectionTitle(doc, "Linhagens Recomendadas", y);

    profileData.linhagens.forEach((lin) => {
      if (y > 260) return;
      const linH = 15;
      doc.setFillColor(...CARD_BG2);
      doc.roundedRect(MARGIN, y, CONTENT_W, linH, 2, 2, "F");
      doc.setFillColor(...GOLD);
      doc.roundedRect(MARGIN, y, 2.5, linH, 1, 1, "F");

      doc.setTextColor(...WHITE);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(safe(lin.name), MARGIN + 7, y + 6);

      doc.setTextColor(...ZINC400);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      const rLines = doc.splitTextToSize(safe(lin.reason), CONTENT_W - 12);
      doc.text(rLines[0] ?? safe(lin.reason), MARGIN + 7, y + 12);

      y += linH + 3;
    });
    y += 4;
  }

  // Tips
  if (profileData.tips.length > 0) {
    doc.setFillColor(35, 35, 35);
    doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
    y += 9;
    y = addSectionTitle(doc, "Dicas", y);
    for (const tip of profileData.tips.slice(0, 5)) {
      if (y > 265) break;
      y = addBulletItem(doc, tip, "recomendacao", y);
    }
    y += 4;
  }

  // Next steps
  if (profileData.nextSteps.length > 0 && y < 255) {
    doc.setFillColor(35, 35, 35);
    doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
    y += 9;
    y = addSectionTitle(doc, "Próximos Passos", y);

    profileData.nextSteps.forEach((step, i) => {
      if (y > 265) return;
      const stepH = 12;
      doc.setFillColor(18, 18, 18);
      doc.roundedRect(MARGIN, y, CONTENT_W, stepH, 2, 2, "F");

      doc.setFillColor(...GOLD);
      doc.circle(MARGIN + 5.5, y + stepH / 2, 3.2, "F");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}`, MARGIN + 5.5, y + stepH / 2 + 1.5, { align: "center" });

      doc.setTextColor(...ZINC300);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      const sLines = doc.splitTextToSize(safe(step), CONTENT_W - 18);
      doc.text(sLines[0] ?? safe(step), MARGIN + 13, y + stepH / 2 + 1.5);

      y += stepH + 2;
    });
  }

  // Footer & watermark
  addPremiumFooter(doc);
  addPremiumWatermark(doc, "PORTAL LUSITANO");

  doc.save(`perfil-equestre-${profileData.profile}-${Date.now()}.pdf`);
}

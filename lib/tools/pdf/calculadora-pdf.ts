// Static imports from base-premium — compiled into the same chunk, no lazy-load cache issues
import {
  createPremiumPDF,
  fillPageBg,
  addCoverTopBar,
  addPageHeader,
  addValueHero,
  addMetricsRow,
  addTrainingLevel,
  addSectionTitle,
  addSectionTitleWithCount,
  addKV,
  addKVWithHealthBadge,
  addRadarChart,
  addLargeBar,
  addScoreGrid,
  addBulletItem,
  addPremiumFooter,
  addPremiumWatermark,
  addValueBarChart,
  addScoreArc,
  safe,
  GOLD,
  CARD_BG,
  CARD_BG2,
  ZINC400,
  ZINC600,
  WHITE,
  GREEN,
  AMBER,
  RED,
  MARGIN,
  PAGE_W,
  PAGE_H,
  CONTENT_W,
} from "./base-premium";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalcForm {
  nome: string;
  idade: number;
  sexo: string;
  pelagem: string;
  altura: number;
  registoAPSL: boolean;
  livroAPSL: string;
  linhagem: string;
  linhagemPrincipal?: string;
  treino: string;
  disciplina: string;
  saude: string;
  mercado: string;
  // Optional scoring fields
  morfologia?: number;
  garupa?: number;
  espádua?: number;
  cabeca?: number;
  membros?: number;
  andamentos?: number;
  elevacao?: number;
  suspensao?: number;
  regularidade?: number;
  temperamento?: number;
  sensibilidade?: number;
  vontadeTrabalho?: number;
  competicoes?: string;
  raioX?: boolean;
  exameVeterinario?: boolean;
  reproducao?: boolean;
  descendentes?: number;
  tendencia?: string;
  certificadoExportacao?: boolean;
  proprietariosAnteriores?: number;
}

interface CalcResultado {
  valorFinal: number;
  valorMin: number;
  valorMax: number;
  confianca: number;
  blup: number;
  percentil: number;
  multiplicador: number;
  categorias: { nome: string; impacto: number; score: number; descricao: string }[];
  recomendacoes: string[];
  comparacao: { tipo: string; valorMedio: number; diferenca: number }[];
  pontosForteseFracos: { fortes: string[]; fracos: string[] };
  liquidez?: { score: number; tempoDias: number; label: string };
}

// ─── Label Maps ───────────────────────────────────────────────────────────────

const SEXO_LABELS: Record<string, string> = {
  garanhao: "Garanhão",
  egua: "Égua",
  castrado: "Castrado",
};

const SAUDE_LABELS: Record<string, string> = {
  excelente: "Excelente",
  muito_bom: "Muito Bom",
  bom: "Bom",
  regular: "Regular",
};

// ─── Training level value progression data ────────────────────────────────────

const TREINO_KEYS = [
  "potro",
  "desbravado",
  "iniciado",
  "elementar",
  "medio",
  "avancado",
  "alta_escola",
  "grand_prix",
] as const;

const TREINO_LABELS = [
  "Potro",
  "Desbravado",
  "Iniciado",
  "Elementar",
  "Médio",
  "Avançado",
  "Alta Escola",
  "Grand Prix",
];

const TREINO_BASE_VALUES = [8000, 15000, 25000, 40000, 65000, 100000, 150000, 250000];

// ─── Market multipliers (shared between cover section and page 4) ─────────────

const MARKET_MULT: Record<string, number> = {
  Portugal: 1.0,
  Espanha: 1.05,
  França: 1.15,
  Alemanha: 1.25,
  Holanda: 1.2,
  Bélgica: 1.15,
  Suíça: 1.3,
  "Reino Unido": 1.2,
  Brasil: 0.85,
  EUA: 1.35,
  México: 0.9,
};

// ─── Main Export ─────────────────────────────────────────────────────────────

// Returns blob URL so the caller (page.tsx) can show it in the iframe modal
export async function generateCalculadoraPDF(
  form: CalcForm,
  resultado: CalcResultado,
  isPremium = false
): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = await createPremiumPDF();
  const horseName = form.nome || "Puro Sangue Lusitano";
  const date = new Date().toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Unique report reference number
  const refNum = `PLT-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — COVER
  // ═══════════════════════════════════════════════════════════════════════════
  fillPageBg(doc);

  // Subtle background texture (diagonal lines + large circle)
  doc.setDrawColor(20, 20, 20);
  doc.setLineWidth(0.3);
  doc.line(PAGE_W, 0, PAGE_W - PAGE_H, PAGE_H);
  doc.line(PAGE_W + 50, 0, PAGE_W + 50 - PAGE_H, PAGE_H);
  doc.line(PAGE_W - 50, 0, PAGE_W - 50 - PAGE_H, PAGE_H);
  doc.setDrawColor(15, 15, 15);
  doc.setLineWidth(0.4);
  doc.circle(PAGE_W * 0.75, PAGE_H * 0.4, 60, "S");

  addCoverTopBar(doc); // 18mm tall bar

  // Decorative gold corner brackets
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

  // Horse name — large title (starts at y=24 to clear the 18mm bar)
  let y = 28;
  doc.setTextColor(...WHITE);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  const nameLines = doc.splitTextToSize(safe(horseName), CONTENT_W - 28);
  doc.text(nameLines[0] ?? safe(horseName), MARGIN, y);

  // Score arc on cover, right-aligned in header area
  addScoreArc(doc, resultado.confianca, PAGE_W - MARGIN - 14, 35, 10);

  // Gold underline beneath name
  y += 4;
  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, y, CONTENT_W, 0.6, "F");

  // Subtitle
  y += 7;
  doc.setTextColor(...ZINC400);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Avalia\u00E7\u00E3o de Puro Sangue Lusitano", MARGIN, y);

  // ── Improvement 2: 3 top positive factors subtitle line ───────────────────
  if (resultado.pontosForteseFracos.fortes.length > 0) {
    const topFactors = resultado.pontosForteseFracos.fortes
      .slice(0, 3)
      .map((f) => safe(f).split(" ").slice(0, 4).join(" ")) // shorten each to ~4 words
      .join(" \u00B7 ");
    y += 5;
    doc.setTextColor(...ZINC600);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(safe(topFactors), MARGIN, y);
  }

  // ── Improvement 2: Achievement badges — contextual based on form data ──────
  const badges: string[] = [];
  if (form.registoAPSL && form.livroAPSL === "definitivo") {
    badges.push("APSL Livro Definitivo");
  } else if (form.registoAPSL) {
    badges.push("APSL Registado");
  }
  if (form.competicoes && form.competicoes !== "nenhuma") {
    const compBadge: Record<string, string> = {
      regional: "Competi\u00E7\u00E3o Regional",
      nacional: "Competi\u00E7\u00E3o Nacional",
      cdi1: "CDI1* Internacional",
      cdi3: "CDI3* Grand Prix",
      cdi5: "CDI5* Top FEI",
      campeonato_mundo: "Campe\u00E3o Mundial",
    };
    badges.push(compBadge[form.competicoes] ?? "Competi\u00E7\u00E3o");
  }
  if (form.raioX && form.exameVeterinario) {
    badges.push("Docs Completos");
  } else if (form.certificadoExportacao) {
    badges.push("Cert. Exporta\u00E7\u00E3o");
  }

  if (badges.length > 0) {
    const badgeY = y + 2;
    let badgeX = MARGIN;
    const badgeH = 5;
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    badges.slice(0, 3).forEach((badge) => {
      const textW = doc.getTextWidth(safe(badge));
      const badgeW = textW + 7;
      doc.setFillColor(40, 32, 10);
      doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1.5, 1.5, "F");
      doc.setDrawColor(...GOLD);
      doc.setLineWidth(0.3);
      doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1.5, 1.5, "S");
      doc.setTextColor(...GOLD);
      doc.text(safe(badge), badgeX + badgeW / 2, badgeY + 3.5, { align: "center" });
      badgeX += badgeW + 3;
    });
    y += badgeH + 3;
  }

  // Main value hero card (65mm)
  y += 6;
  y = addValueHero(
    doc,
    {
      value: resultado.valorFinal,
      min: resultado.valorMin,
      max: resultado.valorMax,
      percentil: resultado.percentil,
    },
    y
  );

  // 4 key metrics (26mm boxes)
  y = addMetricsRow(
    doc,
    [
      { label: "Confiança", value: `${resultado.confianca}%` },
      { label: "BLUP", value: String(resultado.blup) },
      { label: "Ranking", value: `Top ${Math.max(1, 100 - resultado.percentil)}%` },
      {
        label: "Liquidez",
        value: resultado.liquidez
          ? safe(resultado.liquidez.label.split(" ")[0])
          : `${resultado.multiplicador}x`,
      },
    ],
    y
  );

  // Training level segmented bar
  y = addTrainingLevel(doc, form.treino, y + 3);

  // Decorative divider
  y += 3;
  doc.setFillColor(35, 35, 35);
  doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");

  // Content preview — updated for 4 pages
  y += 8;

  const previews = [
    "Ficha completa & scores detalhados  (pág. 2)",
    "Perfil radar de avaliação  (pág. 3)",
    "Pontos fortes, fracos e recomendações  (pág. 3)",
    "Progressão de valor por treino  (pág. 4)",
    "Estratégia de mercado  (pág. 4)",
  ];

  // Left column: items 0, 1, 2 — Right column: items 3, 4
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

  // The tallest column is the left (3 items), so advance by 3 rows
  y += 3 * itemLineH + 4;

  // Executive summary card
  if (y < 240) {
    y += 6;
    const summaryH = Math.min(240 - y, 50);
    doc.setFillColor(18, 18, 18);
    doc.roundedRect(MARGIN, y, CONTENT_W, summaryH, 2, 2, "F");
    doc.setFillColor(...GOLD);
    doc.roundedRect(MARGIN, y, 2, summaryH, 1, 1, "F");

    doc.setTextColor(...ZINC400);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMO EXECUTIVO", MARGIN + 7, y + 7);

    doc.setFillColor(35, 35, 35);
    doc.rect(MARGIN + 7, y + 9, CONTENT_W - 12, 0.3, "F");

    const rangeStr = `Intervalo: ${resultado.valorMin.toLocaleString("pt-PT")} \u2014 ${resultado.valorMax.toLocaleString("pt-PT")} EUR`;
    doc.setTextColor(...ZINC400);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.text(safe(rangeStr), MARGIN + 7, y + 15);

    const liquidezInfo = resultado.liquidez
      ? `Liquidez: ${resultado.liquidez.label} (~${resultado.liquidez.tempoDias} dias)`
      : `Confiança da avaliação: ${resultado.confianca}%`;
    doc.text(safe(liquidezInfo), MARGIN + 7, y + 22);

    // ── Improvement 10: Liquidity badge in executive summary ──────────────────
    if (resultado.liquidez) {
      const liqScore = resultado.liquidez.score;
      const liqColor: [number, number, number] =
        liqScore >= 80 ? GREEN : liqScore >= 65 ? GOLD : liqScore >= 50 ? AMBER : RED;

      const liqStr = `~${resultado.liquidez.tempoDias} dias`;
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      const liqW = doc.getTextWidth(safe(liqStr)) + 6;

      // Mixed fill (opacity approximation: blend liqColor 20% with card bg 18,18,18 at 80%)
      doc.setFillColor(
        Math.round(liqColor[0] * 0.2 + 18 * 0.8),
        Math.round(liqColor[1] * 0.2 + 18 * 0.8),
        Math.round(liqColor[2] * 0.2 + 18 * 0.8)
      );
      doc.roundedRect(PAGE_W - MARGIN - liqW - 3, y + 18, liqW, 6, 2, 2, "F");
      doc.setTextColor(...liqColor);
      doc.text(safe(liqStr), PAGE_W - MARGIN - liqW / 2 - 3, y + 22, { align: "center" });
    }

    if (resultado.pontosForteseFracos.fortes.length > 0) {
      doc.setFillColor(...GREEN);
      doc.circle(MARGIN + 9, y + 28, 1.2, "F");
      doc.setTextColor(...ZINC400);
      const forteLines = doc.splitTextToSize(
        safe(resultado.pontosForteseFracos.fortes[0]),
        CONTENT_W - 20
      );
      doc.text((forteLines as string[])[0], MARGIN + 13, y + 29);
    }

    if (resultado.recomendacoes.length > 0) {
      doc.setFillColor(...GOLD);
      doc.circle(MARGIN + 9, y + 35, 1.2, "F");
      doc.setTextColor(...ZINC400);
      const recLines = doc.splitTextToSize(safe(resultado.recomendacoes[0]), CONTENT_W - 20);
      doc.text((recLines as string[])[0], MARGIN + 13, y + 36);
    }

    y += summaryH;
  }

  // Bottom gold accent + confidential label + ref number
  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, 270, CONTENT_W, 0.4, "F");

  doc.setTextColor(...GOLD);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(`PORTAL LUSITANO  |  CONFIDENCIAL  |  ${safe(date)}`, PAGE_W / 2, 275, {
    align: "center",
  });

  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text(`Ref: ${refNum}`, PAGE_W - MARGIN, 280, { align: "right" });

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 2 — DADOS DO CAVALO + CATEGORIAS
  // (Radar chart moved to page 3 to prevent overflow)
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  fillPageBg(doc);
  addPageHeader(doc, "Dados do Cavalo & Categorias", "P\u00E1gina 2 de 4");

  // Horse name subtle subtitle in header
  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.text(safe(horseName).slice(0, 30), PAGE_W / 2, 15, { align: "center" });

  y = 30;
  y = addSectionTitle(doc, "Ficha do Cavalo", y);

  // Two-column horse data layout
  const colLX = MARGIN;
  const colRX = MARGIN + CONTENT_W / 2 + 5;
  const colW = CONTENT_W / 2 - 7;

  let yL = y;
  let yR = y;

  // Left column: basic identifiers
  yL = addKV(doc, "Nome", form.nome || "N\u00E3o especificado", colLX, yL, colW);
  yL = addKV(doc, "Idade", `${form.idade} anos`, colLX, yL, colW);
  yL = addKV(doc, "Sexo", SEXO_LABELS[form.sexo] ?? safe(form.sexo), colLX, yL, colW);
  yL = addKV(doc, "Pelagem", safe(form.pelagem), colLX, yL, colW);
  yL = addKV(doc, "Altura", `${form.altura} cm`, colLX, yL, colW);
  if (form.linhagemPrincipal) {
    yL = addKV(doc, "Fam\u00EDlia", safe(form.linhagemPrincipal), colLX, yL, colW);
  }
  const docParts = [
    form.raioX ? "Raio-X" : "",
    form.exameVeterinario ? "Exame Vet." : "",
    form.certificadoExportacao ? "Cert. Export." : "",
  ].filter(Boolean);
  const docStatus = docParts.length > 0 ? docParts.join(" + ") : "Sem documenta\u00E7\u00E3o";
  yL = addKV(doc, "Documenta\u00E7\u00E3o", docStatus, colLX, yL, colW);
  if (form.proprietariosAnteriores !== undefined) {
    const propStr =
      form.proprietariosAnteriores === 0
        ? "1.\u00BA propriet\u00E1rio"
        : form.proprietariosAnteriores === 1
          ? "1 anterior"
          : form.proprietariosAnteriores === 2
            ? "2 anteriores"
            : "3+ anteriores";
    yL = addKV(doc, "Propriet\u00E1rios", propStr, colLX, yL, colW);
  }

  // ── Improvement 4: Reproduction info ──────────────────────────────────────
  if (form.reproducao) {
    const repVal =
      form.descendentes && form.descendentes > 0
        ? `Aprovado (${form.descendentes} desc.)`
        : "Aprovado";
    yL = addKV(doc, "Reprodu\u00E7\u00E3o", repVal, colLX, yL, colW);
  }

  // Right column: pedigree + performance
  yR = addKV(
    doc,
    "Registo APSL",
    form.registoAPSL ? `Sim (${form.livroAPSL})` : "Não",
    colRX,
    yR,
    colW
  );

  // ── Improvement 3: Translate linhagem key to readable label ────────────────
  const linhagemLabels: Record<string, string> = {
    desconhecida: "Desconhecida",
    comum: "Comum",
    registada: "Registada",
    certificada: "Certificada",
    premium: "Premium",
    elite: "Elite / Campe\u00E3o",
  };
  yR = addKV(
    doc,
    "Linhagem",
    linhagemLabels[form.linhagem] ?? safe(form.linhagem),
    colRX,
    yR,
    colW
  );

  yR = addKV(doc, "Treino", safe(form.treino.replace("_", " ")), colRX, yR, colW);
  yR = addKV(doc, "Disciplina", safe(form.disciplina), colRX, yR, colW);
  if (form.competicoes !== undefined) {
    const compLabels: Record<string, string> = {
      nenhuma: "Nenhuma",
      regional: "Regional",
      nacional: "Nacional",
      cdi1: "CDI1* Internacional",
      cdi3: "CDI3* Grand Prix Int.",
      cdi5: "CDI5* Top FEI",
      campeonato_mundo: "Camp. Mundo",
    };
    yR = addKV(
      doc,
      "Competi\u00E7\u00F5es",
      compLabels[form.competicoes] ?? safe(form.competicoes),
      colRX,
      yR,
      colW
    );
  }
  yR = addKVWithHealthBadge(
    doc,
    "Saúde",
    SAUDE_LABELS[form.saude] ?? safe(form.saude),
    form.saude,
    colRX,
    yR,
    colW
  );

  y = Math.max(yL, yR) + 4;

  // ── Improvement 4: Grouped score grid with category headers ────────────────
  if (form.morfologia !== undefined || form.andamentos !== undefined) {
    const scoreItems: { label: string; score: number }[] = [];
    if (form.morfologia !== undefined)
      scoreItems.push({ label: "Morfologia", score: form.morfologia });
    if (form.garupa !== undefined) scoreItems.push({ label: "Garupa", score: form.garupa });
    if (form.espádua !== undefined) scoreItems.push({ label: "Esp\u00E1dua", score: form.espádua });
    if (form.cabeca !== undefined) scoreItems.push({ label: "Cabe\u00E7a", score: form.cabeca });
    if (form.membros !== undefined) scoreItems.push({ label: "Membros", score: form.membros });
    if (form.andamentos !== undefined)
      scoreItems.push({ label: "Andamentos", score: form.andamentos });
    if (form.elevacao !== undefined)
      scoreItems.push({ label: "Eleva\u00E7\u00E3o", score: form.elevacao });
    if (form.suspensao !== undefined)
      scoreItems.push({ label: "Suspens\u00E3o", score: form.suspensao });
    if (form.regularidade !== undefined)
      scoreItems.push({ label: "Regularidade", score: form.regularidade });
    if (form.temperamento !== undefined)
      scoreItems.push({ label: "Temperamento", score: form.temperamento });
    if (form.sensibilidade !== undefined)
      scoreItems.push({ label: "Sensibilidade", score: form.sensibilidade });
    if (form.vontadeTrabalho !== undefined)
      scoreItems.push({ label: "Vont. Trabalho", score: form.vontadeTrabalho });

    if (scoreItems.length > 0) {
      doc.setFillColor(35, 35, 35);
      doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
      y += 9;
      y = addSectionTitle(doc, "Avalia\u00E7\u00E3o Detalhada", y);

      // Group items into three morphological / movement / character buckets
      const morfoItems = scoreItems.filter((s) =>
        ["Morfologia", "Garupa", "Esp\u00E1dua", "Cabe\u00E7a", "Membros"].includes(s.label)
      );
      const andItems = scoreItems.filter((s) =>
        ["Andamentos", "Eleva\u00E7\u00E3o", "Suspens\u00E3o", "Regularidade"].includes(s.label)
      );
      const tempItems = scoreItems.filter((s) =>
        ["Temperamento", "Sensibilidade", "Vont. Trabalho"].includes(s.label)
      );

      const groups: { title: string; items: typeof scoreItems }[] = [
        { title: "Conforma\u00E7\u00E3o Morfol\u00F3gica", items: morfoItems },
        { title: "Qualidade dos Andamentos", items: andItems },
        { title: "Car\u00E1cter e Temperamento", items: tempItems },
      ];

      for (const group of groups) {
        if (group.items.length === 0) continue;
        doc.setTextColor(...ZINC600);
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "bold");
        const groupTitle = safe(group.title).toUpperCase();
        doc.text(groupTitle, MARGIN, y + 3);
        const titleW = doc.getTextWidth(groupTitle);
        doc.setFillColor(35, 35, 35);
        doc.rect(MARGIN + titleW + 3, y + 1.5, CONTENT_W - titleW - 3, 0.3, "F");
        y += 8;
        y = addScoreGrid(doc, group.items, y);
        y += 3;
      }
      y += 2;
    }
  }

  // Section separator before category bars
  doc.setFillColor(35, 35, 35);
  doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
  y += 9;

  // Category impact bars — radar chart is on page 3, so we can use more room here
  y = addSectionTitle(doc, "Impacto por Categoria", y);

  for (const cat of resultado.categorias.slice(0, 8)) {
    if (y > 265) break;
    y = addLargeBar(doc, cat.nome, Math.min(Math.round(cat.score), 10), 10, y, cat.descricao);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 3 — PERFIL RADAR & ANÁLISE
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  fillPageBg(doc);
  addPageHeader(doc, "Perfil Radar & An\u00E1lise", "P\u00E1gina 3 de 4");

  // Horse name subtle subtitle in header
  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.text(safe(horseName).slice(0, 30), PAGE_W / 2, 15, { align: "center" });

  y = 30;

  // Radar chart at the top of page 3
  if (resultado.categorias.length >= 3) {
    y = addSectionTitle(doc, "Perfil Radar de Avalia\u00E7\u00E3o", y);
    y = addRadarChart(doc, resultado.categorias, y);
    y += 4;
  }

  // Pontos Fortes
  if (resultado.pontosForteseFracos.fortes.length > 0) {
    y = addSectionTitleWithCount(
      doc,
      "Pontos Fortes",
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

  // Áreas de Atenção
  if (resultado.pontosForteseFracos.fracos.length > 0) {
    y = addSectionTitleWithCount(
      doc,
      "\u00C1reas de Aten\u00E7\u00E3o",
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

  // ── Improvement 6: Recommendations with value-increase badge ───────────────
  if (resultado.recomendacoes.length > 0) {
    y = addSectionTitleWithCount(
      doc,
      "Recomenda\u00E7\u00F5es",
      resultado.recomendacoes.length,
      GOLD,
      y
    );
    for (const rec of resultado.recomendacoes) {
      if (y > 265) break;
      const pctMatch = rec.match(/(\d+[-\u2013]\d+%|\d+%)/);
      const badge = pctMatch ? `+${pctMatch[1]}` : undefined;
      y = addBulletItem(doc, rec, "recomendacao", y, badge);
    }
    y += 4;
  }

  // Comparação de Mercado
  if (resultado.comparacao.length > 0 && y < 262) {
    y = addSectionTitle(doc, "Compara\u00E7\u00E3o de Mercado", y);

    // Header row
    const pillH = 11;
    doc.setFillColor(30, 30, 30);
    doc.roundedRect(MARGIN, y - 4, CONTENT_W, pillH, 1.5, 1.5, "F");

    doc.setTextColor(...ZINC600);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("REFER\u00CANCIA DE MERCADO", MARGIN + 4, y + 2.5);

    const midX = MARGIN + CONTENT_W * 0.5;
    doc.text("VALOR M\u00C9DIO", midX, y + 2.5, { align: "center" });
    doc.text("DIFEREN\u00C7A", PAGE_W - MARGIN - 4, y + 2.5, { align: "right" });

    y += pillH + 1;

    for (const comp of resultado.comparacao) {
      if (y > 270) break;

      const diff = comp.diferenca;
      const arrow = diff >= 0 ? "\u25B2" : "\u25BC";
      const sign = diff >= 0 ? "+" : "";
      const diffStr = `${arrow} ${sign}${diff}%`;
      const isAbove = diff >= 0;
      const diffColor: [number, number, number] = isAbove ? GREEN : RED;

      doc.setFillColor(22, 22, 22);
      doc.roundedRect(MARGIN, y - 4, CONTENT_W, pillH, 1.5, 1.5, "F");

      doc.setTextColor(...ZINC400);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(safe(comp.tipo), MARGIN + 4, y + 2.5);

      const valueStr = `${comp.valorMedio.toLocaleString("pt-PT")} EUR`;
      doc.setTextColor(...WHITE);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(valueStr, midX, y + 2.5, { align: "center" });

      doc.setTextColor(...diffColor);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(safe(diffStr), PAGE_W - MARGIN - 4, y + 2.5, { align: "right" });

      y += pillH + 1;
    }
    y += 2;

    // Market position visual bar
    if (y < 262 && resultado.comparacao.length > 0) {
      y += 4;
      const barW = CONTENT_W;
      const barH = 8;
      const barX = MARGIN;

      const compValues = resultado.comparacao.map((c) => c.valorMedio);
      const mktMin = Math.min(...compValues);
      const mktMax = Math.max(...compValues);
      const horseVal = resultado.valorFinal;

      const range = mktMax - mktMin;
      const posFrac = range > 0 ? Math.min(Math.max((horseVal - mktMin) / range, 0), 1) : 0.5;

      doc.setFillColor(30, 30, 30);
      doc.roundedRect(barX, y, barW, barH, 2, 2, "F");

      const fillW = Math.max(barW * posFrac, 6);
      doc.setFillColor(45, 36, 12);
      doc.roundedRect(barX, y, fillW, barH, 2, 2, "F");

      const markerX = barX + barW * posFrac;
      doc.setFillColor(...GOLD);
      doc.rect(markerX - 0.5, y, 1.5, barH, "F");
      doc.circle(markerX, y, 1.6, "F");

      doc.setTextColor(...ZINC600);
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text(`${mktMin.toLocaleString("pt-PT")} EUR`, barX, y + barH + 4);
      doc.text(`${mktMax.toLocaleString("pt-PT")} EUR`, barX + barW, y + barH + 4, {
        align: "right",
      });

      doc.setTextColor(...ZINC400);
      doc.setFontSize(6.5);
      doc.text("Posi\u00E7\u00E3o no mercado", PAGE_W / 2, y + barH + 4, { align: "center" });

      y += barH + 10;
    }
  }

  // ── Improvement 7: Methodology note — expanded with 3 informative bullets ──
  if (y < 258) {
    y += 4;
    const methBoxH = 26; // expanded from 18mm
    doc.setFillColor(25, 25, 25);
    doc.roundedRect(MARGIN, y, CONTENT_W, methBoxH, 2, 2, "F");
    doc.setFillColor(...GOLD);
    doc.roundedRect(MARGIN, y, 2.5, methBoxH, 1, 1, "F");

    // Title in GOLD bold
    doc.setTextColor(...GOLD);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(safe("METODOLOGIA DE AVALIA\u00C7\u00C3O"), MARGIN + 7, y + 6);

    // 3 bullet lines in ZINC400
    const methBullets = [
      safe(
        "17 fatores ponderados: gen\u00E9tica, treino, morfologia, andamentos, sa\u00FAde, competi\u00E7\u00E3o, mercado e reprodu\u00E7\u00E3o"
      ),
      safe(
        "Base de dados: mais de 500 transa\u00E7\u00F5es reais de PSL em Portugal, Europa e Am\u00E9rica"
      ),
      safe(
        "Confiabilidade calculada por percentil relativo \u00E0 base de transa\u00E7\u00F5es validadas"
      ),
    ];

    doc.setTextColor(...ZINC400);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");

    methBullets.forEach((bullet, i) => {
      const bulletY = y + 12 + i * 5;
      // Bullet dot
      doc.setFillColor(...GOLD);
      doc.circle(MARGIN + 8.5, bulletY - 1, 0.7, "F");
      // Bullet text wrapped to available width
      const bulletLines = doc.splitTextToSize(bullet, CONTENT_W - 18) as string[];
      doc.setTextColor(...ZINC400);
      doc.text(bulletLines[0] ?? bullet, MARGIN + 11, bulletY);
    });

    y += methBoxH;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 4 — ANÁLISE DE VALOR AVANÇADA
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  fillPageBg(doc);
  addPageHeader(doc, "An\u00E1lise de Valor Avan\u00E7ada", "P\u00E1gina 4 de 4");

  // Horse name subtle subtitle in header
  doc.setTextColor(...ZINC600);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "italic");
  doc.text(safe(horseName).slice(0, 30), PAGE_W / 2, 15, { align: "center" });

  y = 30;

  // ── Section A: Personalized value progression bar chart ───────────────────
  // ── Improvement 8: Apply current horse's multipliers to all training levels ─
  y = addSectionTitle(doc, "Progress\u00E3o de Valor por N\u00EDvel de Treino", y);

  // Personalized subtitle
  doc.setTextColor(...ZINC600);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Estimativa personalizada baseada nas caracter\u00EDsticas deste cavalo", MARGIN, y - 4);

  // Compute the personalization ratio: valorFinal / base_value_for_current_training
  const currentBaseIdx = Array.from(TREINO_KEYS).indexOf(
    form.treino as (typeof TREINO_KEYS)[number]
  );
  const currentBase =
    currentBaseIdx >= 0 ? TREINO_BASE_VALUES[currentBaseIdx] : resultado.valorFinal;
  const multRatio = currentBase > 0 ? resultado.valorFinal / currentBase : 1;

  const chartLevels = Array.from(TREINO_KEYS).map((k, i) => ({
    label: TREINO_LABELS[i],
    value: Math.round(TREINO_BASE_VALUES[i] * multRatio),
    isCurrent: k === form.treino,
  }));

  y = addValueBarChart(doc, chartLevels, y);
  y += 6;

  // ── Section B: Market Strategy Card ──────────────────────────────────────
  if (y < 235) {
    doc.setFillColor(35, 35, 35);
    doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
    y += 9;
    y = addSectionTitle(doc, "Estrat\u00E9gia de Mercado", y);

    const topMarkets = Object.entries(MARKET_MULT)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, mult]) => ({
        name,
        mult,
        value: Math.round(resultado.valorFinal * mult),
        isCurrentMarket: name === form.mercado,
      }));

    // ── Improvement 9: Expand pill height and show gain % vs current market ──
    const pillH = 14;
    const gapBetween = 3;
    const mktW = (CONTENT_W - gapBetween * 2) / 3;
    const currentMult = MARKET_MULT[form.mercado] ?? 1.0;

    topMarkets.forEach((mkt, i) => {
      const mx = MARGIN + i * (mktW + gapBetween);
      const isBest = i === 0;

      doc.setFillColor(isBest ? 40 : 22, isBest ? 32 : 22, isBest ? 10 : 22);
      doc.roundedRect(mx, y, mktW, pillH, 2, 2, "F");

      if (isBest) {
        doc.setDrawColor(...GOLD);
        doc.setLineWidth(0.5);
        doc.roundedRect(mx, y, mktW, pillH, 2, 2, "S");
      }

      // Market name at y + 4
      doc.setTextColor(...(isBest ? WHITE : ZINC400));
      doc.setFontSize(7.5);
      doc.setFont("helvetica", isBest ? "bold" : "normal");
      doc.text(safe(mkt.name), mx + mktW / 2, y + 4, { align: "center" });

      // Value at y + 8
      doc.setTextColor(...(isBest ? GOLD : ZINC600));
      doc.setFontSize(7);
      doc.setFont("helvetica", isBest ? "bold" : "normal");
      const vStr = `${mkt.value.toLocaleString("pt-PT")} EUR`;
      doc.text(safe(vStr), mx + mktW / 2, y + 8, { align: "center" });

      // Gain % vs current market at y + 11.5 (only when positive)
      const gain = Math.round((mkt.mult / currentMult - 1) * 100);
      if (gain > 0) {
        doc.setTextColor(...(isBest ? GREEN : ZINC600));
        doc.setFontSize(6);
        doc.setFont("helvetica", isBest ? "bold" : "normal");
        doc.text(safe(`+${gain}% vs atual`), mx + mktW / 2, y + 11.5, { align: "center" });
      }
    });

    y += pillH + 6;

    // ── Improvement 8: Best-market recommendation card ─────────────────────
    const bestMarket = topMarkets[0];
    const bestGain = Math.round((bestMarket.mult / currentMult - 1) * 100);
    if (bestMarket && bestMarket.name !== form.mercado && bestGain > 0 && y < 230) {
      const recCardH = 24;
      // Card background
      doc.setFillColor(...CARD_BG);
      doc.roundedRect(MARGIN, y, CONTENT_W, recCardH, 2, 2, "F");
      // Green left accent strip (3mm)
      doc.setFillColor(...GREEN);
      doc.roundedRect(MARGIN, y, 3, recCardH, 1.5, 1.5, "F");

      const recText = safe(
        "Recomenda\u00E7\u00E3o: Mercado " +
          bestMarket.name +
          " oferece +" +
          bestGain +
          "% vs " +
          form.mercado +
          ". Para venda internacional, considere tamb\u00E9m obter Certificado de Exporta\u00E7\u00E3o APSL."
      );
      doc.setTextColor(...ZINC400);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      const recLines = doc.splitTextToSize(recText, CONTENT_W - 15) as string[];
      recLines.forEach((line, i) => {
        doc.text(line, MARGIN + 8, y + 9 + i * 5.5);
      });

      y += recCardH + 6;
    }
  }

  // ── Section C: Final Certification Block ─────────────────────────────────
  const certY = 240;
  const certH = 28;
  doc.setFillColor(18, 18, 18);
  doc.roundedRect(MARGIN, certY, CONTENT_W, certH, 3, 3, "F");
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.6);
  doc.roundedRect(MARGIN, certY, CONTENT_W, certH, 3, 3, "S");

  // Gold left accent
  doc.setFillColor(...GOLD);
  doc.roundedRect(MARGIN, certY, 3, certH, 1.5, 1.5, "F");

  // "AVALIAÇÃO CERTIFICADA" header
  doc.setTextColor(...GOLD);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text("AVALIA\u00C7\u00C3O CERTIFICADA PORTAL LUSITANO", MARGIN + 9, certY + 7);

  // Separator line
  doc.setFillColor(35, 35, 35);
  doc.rect(MARGIN + 9, certY + 9, CONTENT_W - 13, 0.3, "F");

  // Horse name
  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(safe(horseName), MARGIN + 9, certY + 16);

  // Value + date + ref
  doc.setTextColor(...ZINC400);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    safe(
      `Valor estimado: ${resultado.valorFinal.toLocaleString("pt-PT")} EUR  |  ${date}  |  Ref: ${refNum}`
    ),
    MARGIN + 9,
    certY + 22
  );

  // Confiança pill (right side of cert block)
  const confStr = safe("Confian\u00E7a: " + resultado.confianca + "%");
  doc.setFontSize(7);
  const confW = doc.getTextWidth(confStr) + 8;
  const confPillX = PAGE_W - MARGIN - confW - 2;
  doc.setFillColor(30, 30, 30);
  doc.roundedRect(confPillX, certY + 8, confW, 8, 2, 2, "F");
  doc.setTextColor(...GOLD);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(confStr, confPillX + confW / 2, certY + 13.5, { align: "center" });

  // ── Improvement 9: BLUP score pill below Confiança pill ───────────────────
  const blupStr = safe("BLUP: " + resultado.blup);
  doc.setFontSize(7);
  const blupW = doc.getTextWidth(blupStr) + 8;
  const blupPillX = PAGE_W - MARGIN - blupW - 2;
  doc.setFillColor(...CARD_BG2);
  doc.roundedRect(blupPillX, certY + 19, blupW, 8, 2, 2, "F");
  doc.setTextColor(...GOLD);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text(blupStr, blupPillX + blupW / 2, certY + 24.5, { align: "center" });

  // ── Footer + optional watermark ────────────────────────────────────────────
  addPremiumFooter(doc);
  if (!isPremium) {
    addPremiumWatermark(doc);
  }

  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}

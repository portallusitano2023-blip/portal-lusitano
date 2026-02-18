import {
  createPremiumPDF,
  fillPageBg,
  addCoverTopBar,
  addPageHeader,
  addValueHero,
  addMetricsRow,
  addTrainingLevel,
  addSectionTitle,
  addKV,
  addLargeBar,
  addBulletItem,
  addPremiumFooter,
  addPremiumWatermark,
  safe,
  GOLD,
  ZINC400,
  ZINC600,
  WHITE,
  GREEN,
  MARGIN,
  PAGE_W,
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
  treino: string;
  disciplina: string;
  saude: string;
  mercado: string;
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
}

// ─── Label Maps ───────────────────────────────────────────────────────────────

const SEXO_LABELS: Record<string, string> = {
  garanhao: "Garanhao",
  egua: "Egua",
  castrado: "Castrado",
};

const SAUDE_LABELS: Record<string, string> = {
  excelente: "Excelente",
  boa: "Boa",
  problemas_menores: "Problemas menores",
  problemas_graves: "Problemas graves",
};

// ─── Main Export ─────────────────────────────────────────────────────────────

export async function generateCalculadoraPDF(
  form: CalcForm,
  resultado: CalcResultado,
  isPremium = false
): Promise<void> {
  const doc = await createPremiumPDF();
  const horseName = form.nome || "Puro Sangue Lusitano";
  const date = new Date().toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 1 — COVER
  // ═══════════════════════════════════════════════════════════════════════════
  fillPageBg(doc);
  addCoverTopBar(doc);

  // Report type + date
  let y = 16;
  doc.setTextColor(...ZINC400);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("RELATORIO DE AVALIACAO", MARGIN, y);
  doc.text(safe(date), PAGE_W - MARGIN, y, { align: "right" });

  // Thin separator
  y = 21;
  doc.setFillColor(35, 35, 35);
  doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");

  // Horse name — large title
  y = 32;
  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  const nameLines = doc.splitTextToSize(safe(horseName), CONTENT_W);
  doc.text(nameLines[0] ?? safe(horseName), MARGIN, y);

  // Subtitle
  y = 41;
  doc.setTextColor(...ZINC400);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Avaliacao de Puro Sangue Lusitano", MARGIN, y);

  // Hero value card
  y = 48;
  y = addValueHero(
    doc,
    {
      value: resultado.valorFinal,
      min: resultado.valorMin,
      max: resultado.valorMax,
      horseName,
    },
    y
  );

  // 4 key metrics
  y = addMetricsRow(
    doc,
    [
      { label: "Confianca", value: `${resultado.confianca}%` },
      { label: "BLUP", value: String(resultado.blup) },
      { label: "Ranking", value: `Top ${Math.max(1, 100 - resultado.percentil)}%` },
      { label: "Multiplicador", value: `${resultado.multiplicador}x` },
    ],
    y
  );

  // Training level segmented bar
  y = addTrainingLevel(doc, form.treino, y + 3);

  // ── Report preview list ──────────────────────────────────────────────────
  y += 3;
  doc.setFillColor(35, 35, 35);
  doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
  y += 9;

  doc.setTextColor(...ZINC400);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Este relatorio inclui:", MARGIN, y);
  y += 8;

  const previews = [
    "Ficha completa do cavalo  (pag. 2)",
    "Impacto por categoria de avaliacao  (pag. 2)",
    "Pontos fortes e areas de atencao  (pag. 3)",
    "Recomendacoes personalizadas  (pag. 3)",
    "Comparacao com o mercado atual  (pag. 3)",
  ];
  previews.forEach((p) => {
    doc.setFillColor(...GOLD);
    doc.circle(MARGIN + 2, y - 1, 0.9, "F");
    doc.setTextColor(...ZINC400);
    doc.setFontSize(8);
    doc.text(p, MARGIN + 7, y);
    y += 7;
  });

  // Bottom gold accent + confidential label
  doc.setFillColor(...GOLD);
  doc.rect(MARGIN, 276, CONTENT_W, 0.4, "F");
  doc.setTextColor(...GOLD);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("PORTAL LUSITANO  |  CONFIDENCIAL", PAGE_W / 2, 281, { align: "center" });

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 2 — DADOS DO CAVALO + CATEGORIAS
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  fillPageBg(doc);
  addPageHeader(doc, "Dados do Cavalo & Categorias", "Pagina 2 de 3");

  y = 30;
  y = addSectionTitle(doc, "Ficha do Cavalo", y);

  // Two-column horse data layout
  const colLX = MARGIN;
  const colRX = MARGIN + CONTENT_W / 2 + 5;
  const colW = CONTENT_W / 2 - 7;

  let yL = y;
  let yR = y;

  // Left column: basic identifiers
  yL = addKV(doc, "Nome", form.nome || "Nao especificado", colLX, yL, colW);
  yL = addKV(doc, "Idade", `${form.idade} anos`, colLX, yL, colW);
  yL = addKV(doc, "Sexo", SEXO_LABELS[form.sexo] ?? safe(form.sexo), colLX, yL, colW);
  yL = addKV(doc, "Pelagem", safe(form.pelagem), colLX, yL, colW);
  yL = addKV(doc, "Altura", `${form.altura} cm`, colLX, yL, colW);

  // Right column: pedigree + performance
  yR = addKV(
    doc,
    "Registo APSL",
    form.registoAPSL ? `Sim (${form.livroAPSL})` : "Nao",
    colRX,
    yR,
    colW
  );
  yR = addKV(doc, "Linhagem", safe(form.linhagem), colRX, yR, colW);
  yR = addKV(doc, "Treino", safe(form.treino.replace("_", " ")), colRX, yR, colW);
  yR = addKV(doc, "Disciplina", safe(form.disciplina), colRX, yR, colW);
  yR = addKV(doc, "Saude", SAUDE_LABELS[form.saude] ?? safe(form.saude), colRX, yR, colW);

  y = Math.max(yL, yR) + 4;

  // Section separator
  doc.setFillColor(35, 35, 35);
  doc.rect(MARGIN, y, CONTENT_W, 0.3, "F");
  y += 9;

  // Category impact bars
  y = addSectionTitle(doc, "Impacto por Categoria", y);

  for (const cat of resultado.categorias.slice(0, 8)) {
    if (y > 272) break;
    y = addLargeBar(doc, cat.nome, Math.round(cat.score), 10, y);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PAGE 3 — ANÁLISE & RECOMENDAÇÕES
  // ═══════════════════════════════════════════════════════════════════════════
  doc.addPage();
  fillPageBg(doc);
  addPageHeader(doc, "Analise & Recomendacoes", "Pagina 3 de 3");

  y = 30;

  // Pontos Fortes
  if (resultado.pontosForteseFracos.fortes.length > 0) {
    y = addSectionTitle(doc, "Pontos Fortes", y);
    for (const ponto of resultado.pontosForteseFracos.fortes) {
      if (y > 265) break;
      y = addBulletItem(doc, ponto, "forte", y);
    }
    y += 4;
  }

  // Áreas de Atenção
  if (resultado.pontosForteseFracos.fracos.length > 0) {
    y = addSectionTitle(doc, "Areas de Atencao", y);
    for (const ponto of resultado.pontosForteseFracos.fracos) {
      if (y > 265) break;
      y = addBulletItem(doc, ponto, "fraco", y);
    }
    y += 4;
  }

  // Recomendações
  if (resultado.recomendacoes.length > 0) {
    y = addSectionTitle(doc, "Recomendacoes", y);
    for (const rec of resultado.recomendacoes) {
      if (y > 265) break;
      y = addBulletItem(doc, rec, "recomendacao", y);
    }
    y += 4;
  }

  // Comparação de Mercado
  if (resultado.comparacao.length > 0 && y < 262) {
    y = addSectionTitle(doc, "Comparacao de Mercado", y);

    for (const comp of resultado.comparacao) {
      if (y > 270) break;

      const diff = comp.diferenca;
      const diffStr = `${diff >= 0 ? "+" : ""}${diff}%`;
      const valueStr = `${comp.valorMedio.toLocaleString("pt-PT")} EUR  (${diffStr})`;

      // Background pill for each comparison row
      doc.setFillColor(22, 22, 22);
      doc.roundedRect(MARGIN, y - 4, CONTENT_W, 9, 1.5, 1.5, "F");

      doc.setTextColor(...ZINC400);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(safe(comp.tipo), MARGIN + 4, y + 1.5);

      // Green if above market, red if below
      const isAbove = diff >= 0;
      doc.setTextColor(isAbove ? GREEN[0] : 239, isAbove ? GREEN[1] : 68, isAbove ? GREEN[2] : 68);
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text(safe(valueStr), PAGE_W - MARGIN - 4, y + 1.5, { align: "right" });

      y += 11;
    }
    y += 2;
  }

  // Methodology note at bottom of page 3
  if (y < 260) {
    y += 4;
    doc.setFillColor(25, 25, 25);
    doc.roundedRect(MARGIN, y, CONTENT_W, 18, 2, 2, "F");
    doc.setFillColor(...GOLD);
    doc.roundedRect(MARGIN, y, 2.5, 18, 1, 1, "F");

    doc.setTextColor(...ZINC600);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("METODOLOGIA", MARGIN + 7, y + 6);
    doc.setFont("helvetica", "normal");
    const methodLines = doc.splitTextToSize(
      "Avaliacao baseada em 8 categorias ponderadas: linhagem, treino, morfologia, andamentos, saude, competicao, mercado e reproducao. Valores de mercado recolhidos de vendas reais de PSL em Portugal e Europa.",
      CONTENT_W - 12
    );
    (methodLines as string[]).forEach((line, i) => {
      doc.text(line, MARGIN + 7, y + 12 + i * 4);
    });
  }

  // ── Footer + optional watermark ────────────────────────────────────────────
  addPremiumFooter(doc);
  if (!isPremium) {
    addPremiumWatermark(doc);
  }

  const safeName = safe(form.nome || "lusitano")
    .toLowerCase()
    .replace(/\s+/g, "-");
  doc.save(`avaliacao-${safeName}-${Date.now()}.pdf`);
}

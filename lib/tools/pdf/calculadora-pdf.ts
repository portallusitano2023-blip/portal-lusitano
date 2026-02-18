import {
  createBasePDF,
  addSection,
  addKeyValue,
  addProgressBar,
  addFooter,
  addText,
  GOLD,
  ZINC400,
  MARGIN,
} from "./base";

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

export async function generateCalculadoraPDF(
  form: CalcForm,
  resultado: CalcResultado
): Promise<void> {
  const doc = await createBasePDF(
    "Relatorio de Avaliacao",
    form.nome ? `Cavalo: ${form.nome}` : "Avaliacao de Puro Sangue Lusitano"
  );

  let y = 50;

  // Main Value
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(`${resultado.valorFinal.toLocaleString("pt-PT")} EUR`, MARGIN, y);
  y += 8;

  doc.setTextColor(...ZINC400);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Intervalo: ${resultado.valorMin.toLocaleString("pt-PT")} - ${resultado.valorMax.toLocaleString("pt-PT")} EUR`,
    MARGIN,
    y
  );
  y += 4;
  doc.text(
    `Confianca: ${resultado.confianca}% | BLUP: ${resultado.blup} | Top ${Math.max(1, 100 - resultado.percentil)}% | Mult: ${resultado.multiplicador}x`,
    MARGIN,
    y
  );
  y += 12;

  // Horse Details
  y = addSection(doc, "Dados do Cavalo", y);
  y = addKeyValue(doc, "Nome", form.nome || "Nao especificado", y);
  y = addKeyValue(doc, "Idade", `${form.idade} anos`, y);
  const sexoLabels: Record<string, string> = {
    garanhao: "Garanhao",
    egua: "Egua",
    castrado: "Castrado",
  };
  y = addKeyValue(doc, "Sexo", sexoLabels[form.sexo] || form.sexo, y);
  y = addKeyValue(doc, "Pelagem", form.pelagem, y);
  y = addKeyValue(doc, "Altura", `${form.altura} cm`, y);
  y = addKeyValue(doc, "Registo APSL", form.registoAPSL ? `Sim (${form.livroAPSL})` : "Nao", y);
  y = addKeyValue(doc, "Linhagem", form.linhagem, y);
  y = addKeyValue(doc, "Treino", form.treino.replace("_", " "), y);
  y = addKeyValue(doc, "Disciplina", form.disciplina, y);
  y = addKeyValue(doc, "Saude", form.saude, y);
  y = addKeyValue(doc, "Mercado", form.mercado, y);
  y += 6;

  // Category Impact
  y = addSection(doc, "Impacto por Categoria", y);
  for (const cat of resultado.categorias.slice(0, 8)) {
    y = addProgressBar(doc, cat.nome, Math.round(cat.score), 10, y);
  }
  y += 4;

  // Market Comparison
  y = addSection(doc, "Comparacao de Mercado", y);
  for (const comp of resultado.comparacao) {
    y = addKeyValue(
      doc,
      comp.tipo,
      `${comp.valorMedio.toLocaleString("pt-PT")} EUR (${comp.diferenca >= 0 ? "+" : ""}${comp.diferenca}%)`,
      y
    );
  }
  y += 4;

  // Strengths & Weaknesses
  if (resultado.pontosForteseFracos.fortes.length > 0) {
    y = addSection(doc, "Pontos Fortes", y);
    for (const ponto of resultado.pontosForteseFracos.fortes) {
      y = addText(doc, `+ ${ponto}`, y, { color: [34, 197, 94] as const });
    }
    y += 2;
  }

  if (resultado.pontosForteseFracos.fracos.length > 0) {
    y = addSection(doc, "Areas de Atencao", y);
    for (const ponto of resultado.pontosForteseFracos.fracos) {
      y = addText(doc, `- ${ponto}`, y, { color: [251, 146, 60] as const });
    }
    y += 2;
  }

  // Recommendations
  if (resultado.recomendacoes.length > 0) {
    y = addSection(doc, "Recomendacoes", y);
    for (const rec of resultado.recomendacoes) {
      y = addText(doc, `> ${rec}`, y, { color: GOLD });
    }
  }

  addFooter(doc);
  doc.save(`avaliacao-${form.nome || "lusitano"}-${Date.now()}.pdf`);
}

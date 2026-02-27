import type { Cavalo, ScoreFactor } from "./types";
import { TREINOS, COMPETICOES } from "./data";

// ============================================
// SCORING
// ============================================

export function calcularScore(c: Cavalo): number {
  let score = 0;

  // Idade (ideal 6-12) - 10pts
  score += c.idade >= 6 && c.idade <= 12 ? 10 : c.idade >= 4 && c.idade <= 15 ? 7 : 4;

  // Altura (ideal 158-168) - 8pts
  score += c.altura >= 158 && c.altura <= 168 ? 8 : c.altura >= 155 && c.altura <= 170 ? 6 : 4;

  // Linhagem - 15pts
  const linPoints: Record<string, number> = {
    Desconhecida: 3,
    Registada: 8,
    Certificada: 11,
    Premium: 13,
    Elite: 15,
  };
  score += linPoints[c.linhagem] || 8;

  // Treino - 15pts
  const treino = TREINOS.find((t) => t.value === c.treino);
  score += treino ? Math.round(treino.nivel * 1.9) : 5;

  // Conformação - 10pts
  score += c.conformacao;

  // Andamentos - 10pts
  score += c.andamentos;

  // Elevação e Regularidade - 5pts cada
  score += Math.round(c.elevacao / 2);
  score += Math.round(c.regularidade / 2);

  // Temperamento - 7pts
  score += Math.round(c.temperamento * 0.7);

  // Saúde - 7pts
  score += Math.round(c.saude * 0.7);

  // Competições - 8pts
  const comp = COMPETICOES.find((co) => co.value === c.competicoes);
  score += comp ? Math.round((comp.mult - 1) * 20 + 5) : 5;

  // BLUP bónus - 5pts
  score += c.blup > 110 ? 5 : c.blup > 100 ? 3 : 1;

  // Registo APSL bónus
  if (c.registoAPSL) score += 3;

  return Math.min(score, 100);
}

export function calcularValorPorPonto(c: Cavalo): number {
  const score = calcularScore(c);
  return score > 0 ? Math.round(c.preco / score) : 0;
}

// Score de potencial: score máximo atingível dado idade e treino atual
export function calcularPotencial(c: Cavalo): number {
  const scoreAtual = calcularScore(c);
  const treino = TREINOS.find((t) => t.value === c.treino);
  const nivel = treino?.nivel ?? 4;
  const nivelMax = 8; // Grand Prix

  // Cavalos mais jovens têm mais margem de progressão
  const ageFactor = c.idade <= 5 ? 1.0 : c.idade <= 8 ? 0.75 : c.idade <= 11 ? 0.45 : 0.15;

  // Margem de treino: cada nível vale ~1.9 pts no scoring
  const treinoHeadroom = (nivelMax - nivel) * 1.9;

  // Margem de competição: máximo (Internacional) = ~15pts
  const comp = COMPETICOES.find((co) => co.value === c.competicoes);
  const compScore = comp ? Math.round((comp.mult - 1) * 20 + 5) : 5;
  const compMax = 13;
  const compHeadroom = Math.max(0, compMax - compScore);

  const potencialBonus = Math.round((treinoHeadroom + compHeadroom) * ageFactor);
  return Math.min(100, scoreAtual + potencialBonus);
}

// ROI estimado a 5 anos
export function calcularROI(c: Cavalo): { roi5yr: number; breakEven: number; horizonte: string } {
  const treino = TREINOS.find((t) => t.value === c.treino);
  const nivel = treino?.nivel ?? 4;

  let annualRate = 0.02;
  if (c.idade <= 5 && nivel <= 3) annualRate = 0.16;
  else if (c.idade <= 7 && nivel <= 4) annualRate = 0.1;
  else if (c.idade >= 8 && c.idade <= 12 && nivel >= 5) annualRate = 0.05;
  else if (c.idade > 14) annualRate = -0.04;

  const estimatedValue5yr = Math.round(c.preco * Math.pow(1 + annualRate, 5));
  const roi5yr = Math.round(((estimatedValue5yr - c.preco) / c.preco) * 100);

  const baseTraining = 200 + nivel * 100;
  const annualCost =
    400 * 12 + 150 * 12 + 80 * 12 + 60 * 12 + baseTraining * 12 + Math.round(c.preco * 0.04);
  const monthlyAppreciation = (c.preco * Math.max(annualRate, 0)) / 12;
  const monthlyCost = annualCost / 12;
  const breakEven =
    monthlyAppreciation > monthlyCost
      ? Math.round(c.preco / (monthlyAppreciation - monthlyCost))
      : 120;

  const horizonte =
    c.idade <= 5
      ? "5-10 anos"
      : c.idade <= 8
        ? "3-5 anos"
        : c.idade <= 12
          ? "2-3 anos"
          : "Curto prazo";

  return { roi5yr, breakEven: Math.min(breakEven, 120), horizonte };
}

// ============================================
// DISCIPLINE SCORING
// ============================================

export function calcDisciplineScore(c: Cavalo, weights: Record<string, number>): number {
  const treinoNorm = ((TREINOS.find((t) => t.value === c.treino)?.nivel ?? 4) / 7) * 10;
  const blupNorm = Math.min(c.blup / 15, 10);
  const fieldMap: Record<string, number> = {
    elevacao: c.elevacao,
    andamentos: c.andamentos,
    regularidade: c.regularidade,
    conformacao: c.conformacao,
    temperamento: c.temperamento,
    saude: c.saude,
    treino: treinoNorm,
    blup: blupNorm,
  };
  const total = Object.entries(weights).reduce(
    (sum, [field, w]) => sum + (fieldMap[field] ?? 5) * w,
    0
  );
  return Math.min(100, Math.round(total * 10));
}

// ============================================
// SCORE FACTORS
// ============================================

export function getScoreFactors(c: Cavalo): ScoreFactor[] {
  const idadeScore = c.idade >= 6 && c.idade <= 12 ? 10 : c.idade >= 4 && c.idade <= 15 ? 7 : 4;
  const alturaScore =
    c.altura >= 158 && c.altura <= 168 ? 8 : c.altura >= 155 && c.altura <= 170 ? 6 : 4;
  const linPoints: Record<string, number> = {
    Desconhecida: 3,
    Registada: 8,
    Certificada: 11,
    Premium: 13,
    Elite: 15,
  };
  const linhagemScore = linPoints[c.linhagem] || 8;
  const treinoObj = TREINOS.find((tr) => tr.value === c.treino);
  const treinoScore = treinoObj ? Math.round(treinoObj.nivel * 1.9) : 5;
  const elevacaoScore = Math.round(c.elevacao / 2);
  const regularidadeScore = Math.round(c.regularidade / 2);
  const temperamentoScore = Math.round(c.temperamento * 0.7);
  const saudeScore = Math.round(c.saude * 0.7);
  const comp = COMPETICOES.find((co) => co.value === c.competicoes);
  const compScore = comp ? Math.round((comp.mult - 1) * 20 + 5) : 5;
  const blupScore = c.blup > 110 ? 5 : c.blup > 100 ? 3 : 1;
  const apslScore = c.registoAPSL ? 3 : 0;

  return [
    { name: "Linhagem", weight: "15%", score: linhagemScore, max: 15 },
    { name: "Treino", weight: "15%", score: treinoScore, max: 15 },
    { name: "Conformação", weight: "10%", score: c.conformacao, max: 10 },
    { name: "Andamentos", weight: "10%", score: c.andamentos, max: 10 },
    { name: "Idade", weight: "10%", score: idadeScore, max: 10 },
    { name: "Competições", weight: "8%", score: compScore, max: 8 },
    { name: "Altura", weight: "8%", score: alturaScore, max: 8 },
    { name: "Temperamento", weight: "7%", score: temperamentoScore, max: 7 },
    { name: "Saúde", weight: "7%", score: saudeScore, max: 7 },
    { name: "BLUP", weight: "5%", score: blupScore, max: 5 },
    { name: "Elevação", weight: "5%", score: elevacaoScore, max: 5 },
    { name: "Regularidade", weight: "5%", score: regularidadeScore, max: 5 },
    { name: "Registo APSL", weight: "3%", score: apslScore, max: 3 },
  ];
}

// ============================================
// HELPERS
// ============================================

export function getMelhor(cavalos: Cavalo[], campo: keyof Cavalo, maior = true): number {
  const vals = cavalos.map((c) => c[campo] as number);
  return maior ? Math.max(...vals) : Math.min(...vals);
}

export function getClasseCor(val: number, melhor: number, maior = true): string {
  if (maior) {
    return val === melhor
      ? "text-emerald-400 font-semibold"
      : val < melhor * 0.8
        ? "text-red-400"
        : "text-[var(--foreground-secondary)]";
  }
  return val === melhor
    ? "text-emerald-400 font-semibold"
    : val > melhor * 1.2
      ? "text-red-400"
      : "text-[var(--foreground-secondary)]";
}

// ============================================
// VERDICT GENERATION (PRO)
// ============================================

export function gerarVeredicto(c: Cavalo) {
  const score = calcularScore(c);
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (c.conformacao >= 8) strengths.push("Conformação excelente");
  else if (c.conformacao <= 5) weaknesses.push("Conformação abaixo da média");
  if (c.andamentos >= 8) strengths.push("Andamentos de alta qualidade");
  else if (c.andamentos <= 5) weaknesses.push("Andamentos precisam de trabalho");
  if (c.temperamento >= 8) strengths.push("Temperamento exemplar");
  else if (c.temperamento <= 5) weaknesses.push("Temperamento pode ser desafiante");
  if (c.saude >= 8) strengths.push("Excelente estado de saúde");
  else if (c.saude <= 5) weaknesses.push("Saúde requer atenção");
  if (c.blup > 110) strengths.push("BLUP acima da média da raça");
  else if (c.blup < 90) weaknesses.push("BLUP abaixo da média");
  if (c.registoAPSL) strengths.push("Registo APSL confirmado");
  else weaknesses.push("Sem registo APSL");
  if (c.idade >= 6 && c.idade <= 12) strengths.push("Idade ideal de performance");
  else if (c.idade > 16) weaknesses.push("Idade avançada");
  if (c.competicoes === "Internacional") strengths.push("Experiência internacional");
  if (c.competicoes === "Nacional") strengths.push("Experiência em competição nacional");

  const bestUse =
    c.competicoes !== "Nenhuma"
      ? "Competição"
      : c.sexo === "Égua" && c.conformacao >= 7
        ? "Criação"
        : score >= 60
          ? "Investimento"
          : "Lazer";

  const riskLevel: "Baixo" | "Médio" | "Alto" =
    c.idade > 16 || c.saude <= 5 ? "Alto" : c.idade > 14 || c.saude <= 6 ? "Médio" : "Baixo";

  const recommendation =
    score >= 75
      ? `${c.nome} é um cavalo excepcional com elevado potencial. A combinação de ${c.treino.toLowerCase()} com ${c.linhagem.toLowerCase()} torna-o uma escolha sólida para ${bestUse.toLowerCase()}.`
      : score >= 50
        ? `${c.nome} apresenta qualidades interessantes para ${bestUse.toLowerCase()}. Recomenda-se investir em treino para maximizar o potencial demonstrado.`
        : `${c.nome} necessita de desenvolvimento em várias áreas. Considere uma avaliação veterinária detalhada antes de avançar.`;

  return {
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    bestUse,
    riskLevel,
    recommendation,
  };
}

// ============================================
// COST PROJECTIONS (PRO)
// ============================================

export function gerarCustos(c: Cavalo) {
  const treino = TREINOS.find((t) => t.value === c.treino);
  const nivel = treino?.nivel ?? 4;
  const baseTraining = 200 + nivel * 100;

  return {
    nome: c.nome,
    purchasePrice: c.preco,
    annualCosts: {
      pensao: 400 * 12,
      alimentacao: 150 * 12,
      veterinario: 80 * 12,
      ferrador: 60 * 12,
      treino: baseTraining * 12,
      seguro: Math.round(c.preco * 0.04),
    },
    estimatedValue5yr: Math.round(
      c.preco * (c.idade >= 4 && c.idade <= 10 ? 1.1 : c.idade > 14 ? 0.6 : 0.85)
    ),
  };
}

// ============================================
// CSV EXPORT
// ============================================

export function exportarCSV(cavalos: Cavalo[]) {
  const headers = [
    "Nome",
    "Idade",
    "Sexo",
    "Altura (cm)",
    "Pelagem",
    "Linhagem",
    "Treino",
    "Conformação",
    "Andamentos",
    "Elevação",
    "Regularidade",
    "Temperamento",
    "Saúde",
    "Competições",
    "Prémios",
    "Preço (€)",
    "BLUP",
    "Registo APSL",
    "Score Global",
    "Valor por Ponto (€)",
  ];

  const rows = cavalos.map((c) => {
    const score = calcularScore(c);
    const valorPorPonto = score > 0 ? Math.round(c.preco / score) : "N/A";
    return [
      c.nome || "—",
      c.idade,
      c.sexo || "—",
      c.altura,
      c.pelagem || "—",
      c.linhagem || "—",
      c.treino || "—",
      c.conformacao,
      c.andamentos,
      c.elevacao,
      c.regularidade,
      c.temperamento,
      c.saude,
      c.competicoes || "—",
      c.premios,
      c.preco,
      c.blup,
      c.registoAPSL ? "Sim" : "Não",
      score,
      valorPorPonto,
    ];
  });

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell);
          return str.includes(",") || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
        })
        .join(",")
    )
    .join("\n");

  // BOM para compatibilidade com Excel (caracteres portugueses)
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `comparacao-cavalos-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

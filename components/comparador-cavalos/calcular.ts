import type { Cavalo, ScoreFactor, CategoryWeights } from "./types";
import { TREINOS, COMPETICOES, LINHAGENS, localizedLabel } from "./data";

type TrFn = (pt: string, en: string, es: string) => string;
const defaultTr: TrFn = (pt) => pt;

// ============================================
// SCORING
// ============================================

export function calcularScore(c: Cavalo): number {
  let score = 0;

  // Idade (ideal ~9) - 10pts (continuous)
  const ageDist = Math.abs(c.idade - 9);
  score += Math.max(4, 10 - ageDist);

  // Altura (ideal ~163) - 8pts (continuous)
  const htDist = Math.abs(c.altura - 163);
  score += Math.max(4, 8 - Math.floor(htDist / 2));

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
  score += treino ? Math.round((treino.nivel / 8) * 15) : 5;

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

  // Competições - 15pts
  const comp = COMPETICOES.find((co) => co.value === c.competicoes);
  score += comp ? Math.round((comp.mult - 1) * 20 + 5) : 5;

  // BLUP bónus - 5pts (continuous)
  score += Math.min(5, Math.round(normalizeBlup(c.blup) / 2));

  // Prémios bónus - 5pts
  score += Math.min(5, c.premios);

  // Registo APSL bónus
  if (c.registoAPSL) score += 3;

  return Math.min(Math.round(score), 100);
}

// ============================================
// DEFAULT WEIGHTS & WEIGHTED SCORING
// ============================================

export const DEFAULT_WEIGHTS: CategoryWeights = {
  linhagem: 15,
  treino: 15,
  conformacao: 10,
  andamentos: 10,
  idade: 10,
  competicoes: 15,
  altura: 8,
  temperamento: 7,
  saude: 7,
  blup: 5,
  elevacao: 5,
  regularidade: 5,
  premios: 5,
  registoAPSL: 3,
};

/**
 * Weighted version of calcularScore.
 * With DEFAULT_WEIGHTS the result is identical to calcularScore.
 * Weights are normalised so that shifting emphasis does not inflate/deflate
 * the 0-100 scale.
 */
export function calcularScoreWeighted(c: Cavalo, weights: CategoryWeights): number {
  const defaultTotal = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);
  const currentTotal = Object.values(weights).reduce((a, b) => a + b, 0);
  if (currentTotal === 0) return 0;

  const scale = defaultTotal / currentTotal;
  const w = (key: keyof CategoryWeights): number => {
    const dw = DEFAULT_WEIGHTS[key];
    return dw > 0 ? (weights[key] * scale) / dw : 0;
  };

  let score = 0;

  // Idade (ideal ~9) — base 10 pts (continuous)
  const ageDist = Math.abs(c.idade - 9);
  score += Math.max(4, 10 - ageDist) * w("idade");

  // Altura (ideal ~163) — base 8 pts (continuous)
  const htDist = Math.abs(c.altura - 163);
  score += Math.max(4, 8 - Math.floor(htDist / 2)) * w("altura");

  // Linhagem — base 15 pts
  const linPoints: Record<string, number> = { Desconhecida: 3, Registada: 8, Certificada: 11, Premium: 13, Elite: 15 };
  score += (linPoints[c.linhagem] || 8) * w("linhagem");

  // Treino — base 15 pts
  const treino = TREINOS.find((t) => t.value === c.treino);
  score += (treino ? Math.round((treino.nivel / 8) * 15) : 5) * w("treino");

  // Conformacao — base 10 pts
  score += c.conformacao * w("conformacao");

  // Andamentos — base 10 pts
  score += c.andamentos * w("andamentos");

  // Elevacao — base 5 pts
  score += Math.round(c.elevacao / 2) * w("elevacao");

  // Regularidade — base 5 pts
  score += Math.round(c.regularidade / 2) * w("regularidade");

  // Temperamento — base 7 pts
  score += Math.round(c.temperamento * 0.7) * w("temperamento");

  // Saude — base 7 pts
  score += Math.round(c.saude * 0.7) * w("saude");

  // Competicoes
  const comp = COMPETICOES.find((co) => co.value === c.competicoes);
  score += (comp ? Math.round((comp.mult - 1) * 20 + 5) : 5) * w("competicoes");

  // BLUP bonus — base 5 pts (continuous)
  score += Math.min(5, Math.round(normalizeBlup(c.blup) / 2)) * w("blup");

  // Premios bonus — base 5 pts
  score += Math.min(5, c.premios) * w("premios");

  // Registo APSL bonus
  if (c.registoAPSL) score += 3 * w("registoAPSL");

  return Math.min(Math.round(score), 100);
}

export function calcularValorPorPontoWeighted(c: Cavalo, weights: CategoryWeights): number {
  const score = calcularScoreWeighted(c, weights);
  if (score === 0 || c.preco === 0) return Infinity;
  return Math.round(c.preco / score);
}

export function calcularValorPorPonto(c: Cavalo): number {
  const score = calcularScore(c);
  if (score === 0 || c.preco === 0) return Infinity;
  return Math.round(c.preco / score);
}

// Score de potencial: score máximo atingível dado idade e treino atual
export function calcularPotencial(c: Cavalo, weights?: CategoryWeights): number {
  const scoreAtual = weights ? calcularScoreWeighted(c, weights) : calcularScore(c);
  const treino = TREINOS.find((t) => t.value === c.treino);
  const nivel = treino?.nivel ?? 4;
  const nivelMax = 8; // Grand Prix

  // Cavalos mais jovens têm mais margem de progressão
  const ageFactor = c.idade <= 5 ? 1.0 : c.idade <= 8 ? 0.75 : c.idade <= 11 ? 0.45 : 0.15;

  // Margem de treino: cada nível vale ~(nivel/8)*15 pts no scoring
  const treinoHeadroom = ((nivelMax - nivel) / 8) * 15;

  // Margem de competição: máximo (Internacional) = ~15pts
  const comp = COMPETICOES.find((co) => co.value === c.competicoes);
  const compScore = comp ? Math.round((comp.mult - 1) * 20 + 5) : 5;
  const compMax = 15;
  const compHeadroom = Math.max(0, compMax - compScore);

  const potencialBonus = Math.round((treinoHeadroom + compHeadroom) * ageFactor);
  return Math.min(100, scoreAtual + potencialBonus);
}

// ROI estimado a 5 anos
export function calcularROI(c: Cavalo, tr: TrFn = defaultTr): { roi5yr: number; breakEven: number; horizonte: string } {
  const treino = TREINOS.find((t) => t.value === c.treino);
  const nivel = treino?.nivel ?? 4;

  let annualRate = 0.02;
  if (c.idade <= 5 && nivel <= 3) annualRate = 0.16;
  else if (c.idade <= 7 && nivel <= 4) annualRate = 0.1;
  else if (c.idade >= 8 && c.idade <= 12 && nivel >= 5) annualRate = 0.05;
  else if (c.idade > 14) annualRate = -0.04;

  const estimatedValue5yr = Math.round(c.preco * Math.pow(1 + annualRate, 5));
  const roi5yr = c.preco > 0
    ? Math.round(((estimatedValue5yr - c.preco) / c.preco) * 100)
    : 0;

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
      ? tr("5-10 anos", "5-10 years", "5-10 años")
      : c.idade <= 8
        ? tr("3-5 anos", "3-5 years", "3-5 años")
        : c.idade <= 12
          ? tr("2-3 anos", "2-3 years", "2-3 años")
          : tr("Curto prazo", "Short term", "Corto plazo");

  return { roi5yr, breakEven: Math.min(breakEven, 120), horizonte };
}

// ============================================
// BLUP NORMALIZATION
// ============================================

export function normalizeBlup(b: number): number {
  return Math.min(10, Math.max(0, (b - 70) / 6));
}

// ============================================
// DISCIPLINE SCORING
// ============================================

export function calcDisciplineScore(c: Cavalo, weights: Record<string, number>): number {
  const treinoNorm = ((TREINOS.find((t) => t.value === c.treino)?.nivel ?? 4) / 8) * 10;
  const blupNorm = normalizeBlup(c.blup);
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

export function getScoreFactors(c: Cavalo, tr: TrFn = defaultTr, weights?: CategoryWeights): ScoreFactor[] {
  const ageDist = Math.abs(c.idade - 9);
  const idadeScore = Math.max(4, 10 - ageDist);
  const htDist = Math.abs(c.altura - 163);
  const alturaScore = Math.max(4, 8 - Math.floor(htDist / 2));
  const linPoints: Record<string, number> = {
    Desconhecida: 3,
    Registada: 8,
    Certificada: 11,
    Premium: 13,
    Elite: 15,
  };
  const linhagemScore = linPoints[c.linhagem] || 8;
  const treinoObj = TREINOS.find((t) => t.value === c.treino);
  const treinoScore = treinoObj ? Math.round((treinoObj.nivel / 8) * 15) : 5;
  const elevacaoScore = Math.round(c.elevacao / 2);
  const regularidadeScore = Math.round(c.regularidade / 2);
  const temperamentoScore = Math.round(c.temperamento * 0.7);
  const saudeScore = Math.round(c.saude * 0.7);
  const comp = COMPETICOES.find((co) => co.value === c.competicoes);
  const compScore = comp ? Math.round((comp.mult - 1) * 20 + 5) : 5;
  const blupScore = Math.min(5, Math.round(normalizeBlup(c.blup) / 2));
  const premiosScore = Math.min(5, c.premios);
  const apslScore = c.registoAPSL ? 3 : 0;

  if (weights) {
    const defaultTotal = Object.values(DEFAULT_WEIGHTS).reduce((a, b) => a + b, 0);
    const currentTotal = Object.values(weights).reduce((a, b) => a + b, 0);
    const w = (key: keyof CategoryWeights): number => {
      const dw = DEFAULT_WEIGHTS[key];
      return currentTotal > 0 && dw > 0 ? (weights[key] * (defaultTotal / currentTotal)) / dw : 0;
    };
    const pct = (key: keyof CategoryWeights) =>
      currentTotal > 0 ? `${Math.round((weights[key] / currentTotal) * 100)}%` : "0%";

    const wf = (key: keyof CategoryWeights) => w(key);

    return [
      { name: tr("Linhagem", "Lineage", "Linaje"), weight: pct("linhagem"), score: Math.round(linhagemScore * wf("linhagem")), max: Math.round(15 * wf("linhagem")) },
      { name: tr("Treino", "Training", "Entrenamiento"), weight: pct("treino"), score: Math.round(treinoScore * wf("treino")), max: Math.round(15 * wf("treino")) },
      { name: tr("Conformação", "Conformation", "Conformación"), weight: pct("conformacao"), score: Math.round(c.conformacao * wf("conformacao")), max: Math.round(10 * wf("conformacao")) },
      { name: tr("Andamentos", "Gaits", "Aires"), weight: pct("andamentos"), score: Math.round(c.andamentos * wf("andamentos")), max: Math.round(10 * wf("andamentos")) },
      { name: tr("Idade", "Age", "Edad"), weight: pct("idade"), score: Math.round(idadeScore * wf("idade")), max: Math.round(10 * wf("idade")) },
      { name: tr("Competições", "Competitions", "Competiciones"), weight: pct("competicoes"), score: Math.round(compScore * wf("competicoes")), max: Math.round(15 * wf("competicoes")) },
      { name: tr("Altura", "Height", "Altura"), weight: pct("altura"), score: Math.round(alturaScore * wf("altura")), max: Math.round(8 * wf("altura")) },
      { name: tr("Temperamento", "Temperament", "Temperamento"), weight: pct("temperamento"), score: Math.round(temperamentoScore * wf("temperamento")), max: Math.round(7 * wf("temperamento")) },
      { name: tr("Saúde", "Health", "Salud"), weight: pct("saude"), score: Math.round(saudeScore * wf("saude")), max: Math.round(7 * wf("saude")) },
      { name: "BLUP", weight: pct("blup"), score: Math.round(blupScore * wf("blup")), max: Math.round(5 * wf("blup")) },
      { name: tr("Elevação", "Elevation", "Elevación"), weight: pct("elevacao"), score: Math.round(elevacaoScore * wf("elevacao")), max: Math.round(5 * wf("elevacao")) },
      { name: tr("Regularidade", "Regularity", "Regularidad"), weight: pct("regularidade"), score: Math.round(regularidadeScore * wf("regularidade")), max: Math.round(5 * wf("regularidade")) },
      { name: tr("Prémios", "Awards", "Premios"), weight: pct("premios"), score: Math.round(premiosScore * wf("premios")), max: Math.round(5 * wf("premios")) },
      { name: tr("Registo APSL", "APSL Registration", "Registro APSL"), weight: pct("registoAPSL"), score: Math.round(apslScore * wf("registoAPSL")), max: Math.round(3 * wf("registoAPSL")) },
    ];
  }

  return [
    { name: tr("Linhagem", "Lineage", "Linaje"), weight: "15%", score: linhagemScore, max: 15 },
    { name: tr("Treino", "Training", "Entrenamiento"), weight: "15%", score: treinoScore, max: 15 },
    { name: tr("Conformação", "Conformation", "Conformación"), weight: "10%", score: c.conformacao, max: 10 },
    { name: tr("Andamentos", "Gaits", "Aires"), weight: "10%", score: c.andamentos, max: 10 },
    { name: tr("Idade", "Age", "Edad"), weight: "10%", score: idadeScore, max: 10 },
    { name: tr("Competições", "Competitions", "Competiciones"), weight: "15%", score: compScore, max: 15 },
    { name: tr("Altura", "Height", "Altura"), weight: "8%", score: alturaScore, max: 8 },
    { name: tr("Temperamento", "Temperament", "Temperamento"), weight: "7%", score: temperamentoScore, max: 7 },
    { name: tr("Saúde", "Health", "Salud"), weight: "7%", score: saudeScore, max: 7 },
    { name: "BLUP", weight: "5%", score: blupScore, max: 5 },
    { name: tr("Elevação", "Elevation", "Elevación"), weight: "5%", score: elevacaoScore, max: 5 },
    { name: tr("Regularidade", "Regularity", "Regularidad"), weight: "5%", score: regularidadeScore, max: 5 },
    { name: tr("Prémios", "Awards", "Premios"), weight: "5%", score: premiosScore, max: 5 },
    { name: tr("Registo APSL", "APSL Registration", "Registro APSL"), weight: "3%", score: apslScore, max: 3 },
  ];
}

// ============================================
// TIE-BREAKING WINNER HELPERS
// ============================================

/**
 * Find the overall winner among horses.
 * When scores are tied, lower price wins (better value).
 */
export function findVencedor(
  cavalos: Cavalo[],
  scoreFn: (c: Cavalo) => number = calcularScore
): Cavalo {
  if (cavalos.length === 0) return {} as Cavalo;
  return cavalos.reduce((a, b) => {
    const sa = scoreFn(a);
    const sb = scoreFn(b);
    if (sa !== sb) return sa > sb ? a : b;
    // Tie-breaker: lower price = better value
    return a.preco <= b.preco ? a : b;
  });
}

/**
 * Find the horse with best cost-benefit (lowest price per point).
 * Ties broken by higher score.
 */
export function findMelhorValor(
  cavalos: Cavalo[],
  scoreFn: (c: Cavalo) => number = calcularScore
): Cavalo {
  if (cavalos.length === 0) return {} as Cavalo;
  return cavalos.reduce((a, b) => {
    const sa = scoreFn(a);
    const sb = scoreFn(b);
    const va = sa > 0 && a.preco > 0 ? a.preco / sa : Infinity;
    const vb = sb > 0 && b.preco > 0 ? b.preco / sb : Infinity;
    if (va !== vb) return va < vb ? a : b;
    // Tie-breaker: higher score
    return sa >= sb ? a : b;
  });
}

// ============================================
// HELPERS
// ============================================

export function getMelhor(cavalos: Cavalo[], campo: keyof Cavalo, maior = true): number {
  if (cavalos.length === 0) return 0;
  const vals = cavalos.map((c) => c[campo] as number);
  return maior ? Math.max(...vals) : Math.min(...vals);
}

const GOOD_THRESHOLD = 0.8;
const EXCELLENT_THRESHOLD = 1.2;

export function getClasseCor(val: number, melhor: number, maior = true): string {
  if (melhor === 0) return "text-[var(--foreground-secondary)]";
  if (maior) {
    return val === melhor
      ? "text-emerald-400 font-semibold"
      : val < melhor * GOOD_THRESHOLD
        ? "text-red-400"
        : "text-[var(--foreground-secondary)]";
  }
  return val === melhor
    ? "text-emerald-400 font-semibold"
    : val > melhor * EXCELLENT_THRESHOLD
      ? "text-red-400"
      : "text-[var(--foreground-secondary)]";
}

// ============================================
// VERDICT GENERATION (PRO)
// ============================================

export function gerarVeredicto(c: Cavalo, tr: TrFn = defaultTr, language?: string, weights?: CategoryWeights) {
  const score = weights ? calcularScoreWeighted(c, weights) : calcularScore(c);
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  const treinoLabel = localizedLabel(TREINOS.find((t) => t.value === c.treino) ?? { label: c.treino }, language).toLowerCase();
  const linhagemLabel = localizedLabel(LINHAGENS.find((l) => l.value === c.linhagem) ?? { label: c.linhagem }, language).toLowerCase();

  if (c.conformacao >= 8) strengths.push(tr("Conformação excelente", "Excellent conformation", "Conformación excelente"));
  else if (c.conformacao <= 5) weaknesses.push(tr("Conformação abaixo da média", "Below average conformation", "Conformación por debajo de la media"));
  if (c.andamentos >= 8) strengths.push(tr("Andamentos de alta qualidade", "High quality gaits", "Aires de alta calidad"));
  else if (c.andamentos <= 5) weaknesses.push(tr("Andamentos precisam de trabalho", "Gaits need work", "Aires necesitan trabajo"));
  if (c.temperamento >= 8) strengths.push(tr("Temperamento exemplar", "Exemplary temperament", "Temperamento ejemplar"));
  else if (c.temperamento <= 5) weaknesses.push(tr("Temperamento pode ser desafiante", "Temperament can be challenging", "Temperamento puede ser desafiante"));
  if (c.saude >= 8) strengths.push(tr("Excelente estado de saúde", "Excellent health condition", "Excelente estado de salud"));
  else if (c.saude <= 5) weaknesses.push(tr("Saúde requer atenção", "Health requires attention", "Salud requiere atención"));
  if (c.blup > 110) strengths.push(tr("BLUP acima da média da raça", "BLUP above breed average", "BLUP por encima del promedio de la raza"));
  else if (c.blup < 90) weaknesses.push(tr("BLUP abaixo da média", "BLUP below average", "BLUP por debajo del promedio"));
  if (c.registoAPSL) strengths.push(tr("Registo APSL confirmado", "APSL registration confirmed", "Registro APSL confirmado"));
  else weaknesses.push(tr("Sem registo APSL", "No APSL registration", "Sin registro APSL"));
  if (c.idade >= 6 && c.idade <= 12) strengths.push(tr("Idade ideal de performance", "Ideal performance age", "Edad ideal de rendimiento"));
  else if (c.idade > 16) weaknesses.push(tr("Idade avançada", "Advanced age", "Edad avanzada"));
  if (c.competicoes === "Internacional") strengths.push(tr("Experiência internacional", "International experience", "Experiencia internacional"));
  if (c.competicoes === "Nacional") strengths.push(tr("Experiência em competição nacional", "National competition experience", "Experiencia en competición nacional"));

  const bestUse =
    c.competicoes !== "Nenhuma"
      ? tr("Competição", "Competition", "Competición")
      : (c.sexo === "Égua" || c.sexo === "Garanhão") && c.conformacao >= 7
        ? tr("Criação", "Breeding", "Cría")
        : score >= 60
          ? tr("Investimento", "Investment", "Inversión")
          : tr("Lazer", "Leisure", "Ocio");

  const riskLevel =
    c.idade > 16 || c.saude <= 5 ? tr("Alto", "High", "Alto") : c.idade > 14 || c.saude <= 6 ? tr("Médio", "Medium", "Medio") : tr("Baixo", "Low", "Bajo");

  const recommendation =
    score >= 75
      ? tr(
          `${c.nome} é um cavalo excepcional com elevado potencial. A combinação de ${treinoLabel} com ${linhagemLabel} torna-o uma escolha sólida para ${bestUse.toLowerCase()}.`,
          `${c.nome} is an exceptional horse with high potential. The combination of ${treinoLabel} with ${linhagemLabel} makes it a solid choice for ${bestUse.toLowerCase()}.`,
          `${c.nome} es un caballo excepcional con alto potencial. La combinación de ${treinoLabel} con ${linhagemLabel} lo convierte en una elección sólida para ${bestUse.toLowerCase()}.`
        )
      : score >= 50
        ? tr(
            `${c.nome} apresenta qualidades interessantes para ${bestUse.toLowerCase()}. Recomenda-se investir em treino para maximizar o potencial demonstrado.`,
            `${c.nome} presents interesting qualities for ${bestUse.toLowerCase()}. Investing in training is recommended to maximise the demonstrated potential.`,
            `${c.nome} presenta cualidades interesantes para ${bestUse.toLowerCase()}. Se recomienda invertir en entrenamiento para maximizar el potencial demostrado.`
          )
        : tr(
            `${c.nome} necessita de desenvolvimento em várias áreas. Considere uma avaliação veterinária detalhada antes de avançar.`,
            `${c.nome} needs development in several areas. Consider a detailed veterinary assessment before proceeding.`,
            `${c.nome} necesita desarrollo en varias áreas. Considere una evaluación veterinaria detallada antes de avanzar.`
          );

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

  // Use same compound growth logic as calcularROI
  let annualRate = 0.02;
  if (c.idade <= 5 && nivel <= 3) annualRate = 0.16;
  else if (c.idade <= 7 && nivel <= 4) annualRate = 0.1;
  else if (c.idade >= 8 && c.idade <= 12 && nivel >= 5) annualRate = 0.05;
  else if (c.idade > 14) annualRate = -0.04;

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
    estimatedValue5yr: Math.round(c.preco * Math.pow(1 + annualRate, 5)),
  };
}

// ============================================
// CSV EXPORT
// ============================================

export function exportarCSV(cavalos: Cavalo[], tr: TrFn = defaultTr, weights?: CategoryWeights) {
  // Inline translation maps for categorical fields
  const localSexo = (s: string) => s === "Garanhão" ? tr("Garanhão", "Stallion", "Semental") : s === "Égua" ? tr("Égua", "Mare", "Yegua") : tr("Castrado", "Gelding", "Castrado");
  const localTreino = (t: string) => {
    const map: Record<string, string> = {
      Potro: tr("Potro","Foal","Potro"), Desbravado: tr("Desbravado","Green-broke","Desbravado"),
      Iniciado: tr("Iniciado","Started","Iniciado"), Elementar: tr("Elementar","Elementary","Elemental"),
      "Médio": tr("Médio","Medium","Medio"), "Avançado": tr("Avançado","Advanced","Avanzado"),
      "Alta Escola": tr("Alta Escola","High School","Alta Escuela"), "Grand Prix": tr("Grand Prix","Grand Prix","Grand Prix")
    };
    return map[t] || t;
  };
  const localPelagem = (p: string) => {
    const map: Record<string, string> = {
      "Ruço": tr("Ruço","Grey","Ruano"), Castanho: tr("Castanho","Bay","Castaño"),
      Preto: tr("Preto","Black","Negro"), "Alazão": tr("Alazão","Chestnut","Alazán"),
      Baio: tr("Baio","Dun","Bayo"), Palomino: tr("Palomino","Palomino","Palomino"),
      Isabelo: tr("Isabelo","Buckskin","Isabelo")
    };
    return map[p] || p;
  };
  const localLinhagem = (l: string) => {
    const map: Record<string, string> = {
      Desconhecida: tr("Desconhecida","Unknown","Desconocida"), Registada: tr("Registada","Registered","Registrada"),
      Certificada: tr("Certificada","Certified","Certificada"), Premium: tr("Premium","Premium","Premium"),
      Elite: tr("Elite","Elite","Élite")
    };
    return map[l] || l;
  };
  const localCompetições = (c: string) => {
    const map: Record<string, string> = {
      Nenhuma: tr("Nenhuma","None","Ninguna"), Regional: tr("Regional","Regional","Regional"),
      Nacional: tr("Nacional","National","Nacional"), Internacional: tr("Internacional","International","Internacional")
    };
    return map[c] || c;
  };

  const headers = [
    tr("Nome", "Name", "Nombre"),
    tr("Idade", "Age", "Edad"),
    tr("Sexo", "Sex", "Sexo"),
    tr("Altura (cm)", "Height (cm)", "Altura (cm)"),
    tr("Pelagem", "Coat", "Capa"),
    tr("Linhagem", "Lineage", "Linaje"),
    tr("Linhagem Famosa", "Famous Lineage", "Linaje Famoso"),
    tr("Treino", "Training", "Entrenamiento"),
    tr("Conformação", "Conformation", "Conformación"),
    tr("Andamentos", "Gaits", "Aires"),
    tr("Elevação", "Elevation", "Elevación"),
    tr("Regularidade", "Regularity", "Regularidad"),
    tr("Temperamento", "Temperament", "Temperamento"),
    tr("Saúde", "Health", "Salud"),
    tr("Competições", "Competitions", "Competiciones"),
    tr("Prémios", "Awards", "Premios"),
    tr("Preço (€)", "Price (€)", "Precio (€)"),
    "BLUP",
    tr("Registo APSL", "APSL Registration", "Registro APSL"),
    tr("Score Global", "Global Score", "Score Global"),
    tr("Valor por Ponto (€)", "Value per Point (€)", "Valor por Punto (€)"),
  ];

  const rows = cavalos.map((c) => {
    const score = weights ? calcularScoreWeighted(c, weights) : calcularScore(c);
    const valorPorPonto = score > 0 && c.preco > 0 ? Math.round(c.preco / score) : "N/A";
    return [
      c.nome || "—",
      c.idade,
      c.sexo ? localSexo(c.sexo) : "—",
      c.altura,
      c.pelagem ? localPelagem(c.pelagem) : "—",
      c.linhagem ? localLinhagem(c.linhagem) : "—",
      c.linhagemFamosa || "—",
      c.treino ? localTreino(c.treino) : "—",
      c.conformacao,
      c.andamentos,
      c.elevacao,
      c.regularidade,
      c.temperamento,
      c.saude,
      c.competicoes ? localCompetições(c.competicoes) : "—",
      c.premios,
      c.preco,
      c.blup,
      c.registoAPSL ? tr("Sim", "Yes", "Sí") : tr("Não", "No", "No"),
      score,
      valorPorPonto,
    ];
  });

  // Include weight configuration when custom weights are provided
  const weightRows: (string | number)[][] = [];
  if (weights) {
    weightRows.push([]);
    weightRows.push([tr("Configuração de Pesos", "Weight Configuration", "Configuración de Pesos")]);
    const totalW = Object.values(weights).reduce((a, b) => a + b, 0);
    for (const [key, value] of Object.entries(weights)) {
      const pct = totalW > 0 ? Math.round((value / totalW) * 100) : 0;
      weightRows.push([key, `${pct}%`]);
    }
  }

  const csvContent = [headers, ...rows, ...weightRows]
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

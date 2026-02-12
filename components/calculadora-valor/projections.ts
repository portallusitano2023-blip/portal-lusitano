// ============================================
// PROJECÇÕES PRO - Calculadora de Valor
// ============================================

import { VALORES_BASE } from "./data";
import type { FormData } from "./types";

// Curva de depreciação/apreciação por idade
// Modelo estimativo - valores pico entre 7-12 anos
function getAgeFactor(age: number): number {
  if (age <= 0) return 0.5;
  if (age === 1) return 0.55;
  if (age === 2) return 0.65;
  if (age === 3) return 0.75;
  if (age === 4) return 0.85;
  if (age === 5) return 0.95;
  if (age === 6) return 1.05;
  if (age >= 7 && age <= 12) return 1.15;
  if (age === 13) return 1.05;
  if (age === 14) return 0.95;
  if (age === 15) return 0.85;
  if (age === 16) return 0.75;
  if (age === 17) return 0.65;
  if (age === 18) return 0.58;
  if (age === 19) return 0.52;
  return Math.max(0.4, 0.52 - (age - 19) * 0.04);
}

export interface InvestmentProjection {
  year: number;
  label: string;
  value: number;
}

export function calcularProjecaoValor(
  valorActual: number,
  idadeActual: number
): InvestmentProjection[] {
  const currentFactor = getAgeFactor(idadeActual);
  const offsets = [0, 1, 2, 3, 5];
  const labels = ["Agora", "+1 ano", "+2 anos", "+3 anos", "+5 anos"];

  return offsets.map((offset, i) => {
    const futureAge = idadeActual + offset;
    const futureFactor = getAgeFactor(futureAge);
    const ratio = currentFactor > 0 ? futureFactor / currentFactor : 1;
    return {
      year: offset,
      label: labels[i],
      value: Math.round(valorActual * ratio),
    };
  });
}

// Níveis de treino ordenados
const TRAINING_ORDER = [
  "potro",
  "desbravado",
  "iniciado",
  "elementar",
  "medio",
  "avancado",
  "alta_escola",
  "grand_prix",
];

const TRAINING_LABELS: Record<string, string> = {
  potro: "Potro",
  desbravado: "Desbravado",
  iniciado: "Iniciado",
  elementar: "Elementar",
  medio: "Médio (M)",
  avancado: "Avançado (S)",
  alta_escola: "Alta Escola",
  grand_prix: "Grand Prix",
};

// Custo estimado e duração para transição entre níveis
// Valores são estimativas de mercado português
const TRAINING_TRANSITIONS: Record<string, { costMin: number; costMax: number; months: string }> = {
  potro_desbravado: { costMin: 2000, costMax: 5000, months: "6-12" },
  desbravado_iniciado: { costMin: 4000, costMax: 8000, months: "6-12" },
  iniciado_elementar: { costMin: 5000, costMax: 10000, months: "12-18" },
  elementar_medio: { costMin: 6000, costMax: 12000, months: "12-18" },
  medio_avancado: { costMin: 10000, costMax: 20000, months: "18-24" },
  avancado_alta_escola: { costMin: 15000, costMax: 30000, months: "24-36" },
  alta_escola_grand_prix: { costMin: 20000, costMax: 40000, months: "24-48" },
};

export interface TrainingROILevel {
  level: string;
  label: string;
  estimatedValue: number;
  roi: number;
  costRange: string;
  duration: string;
  cumulativeCostMin: number;
  cumulativeCostMax: number;
}

export function calcularTrainingROI(
  form: FormData,
  valorActual: number,
  totalMultiplier: number
): TrainingROILevel[] {
  const currentIndex = TRAINING_ORDER.indexOf(form.treino);
  if (currentIndex === -1 || currentIndex >= TRAINING_ORDER.length - 1) return [];

  const levels: TrainingROILevel[] = [];
  let cumulativeCostMin = 0;
  let cumulativeCostMax = 0;

  // Calculate the current training multiplier contribution
  const currentBase = VALORES_BASE[form.treino];
  const nonTrainingMult = currentBase > 0 ? valorActual / currentBase : totalMultiplier;

  for (let i = currentIndex + 1; i < TRAINING_ORDER.length; i++) {
    const prevLevel = TRAINING_ORDER[i - 1];
    const nextLevel = TRAINING_ORDER[i];
    const transKey = `${prevLevel}_${nextLevel}`;
    const transition = TRAINING_TRANSITIONS[transKey];

    if (transition) {
      cumulativeCostMin += transition.costMin;
      cumulativeCostMax += transition.costMax;
    }

    const newBase = VALORES_BASE[nextLevel];
    const estimatedValue = Math.round(newBase * nonTrainingMult);
    const roi =
      valorActual > 0 ? Math.round(((estimatedValue - valorActual) / valorActual) * 100) : 0;

    levels.push({
      level: nextLevel,
      label: TRAINING_LABELS[nextLevel] || nextLevel,
      estimatedValue,
      roi,
      costRange: transition
        ? `€${transition.costMin.toLocaleString("pt-PT")} - €${transition.costMax.toLocaleString("pt-PT")}`
        : "",
      duration: transition ? `${transition.months} meses` : "",
      cumulativeCostMin,
      cumulativeCostMax,
    });
  }

  return levels;
}

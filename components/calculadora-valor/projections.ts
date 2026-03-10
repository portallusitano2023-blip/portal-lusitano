// ============================================
// PROJECÇÕES PRO - Calculadora de Valor
// ============================================

import { VALORES_BASE } from "./data";
import { calcMultIdade } from "./utils";
import type { FormData } from "./types";

// Use the shared age factor from utils.ts (single source of truth)
// calcMultIdade handles: peak at 8-10, gradual decline, potro default

export interface InvestmentProjection {
  year: number;
  label: string;
  value: number;
}

export function calcularProjecaoValor(
  valorActual: number,
  idadeActual: number,
  labels?: string[]
): InvestmentProjection[] {
  const currentFactor = calcMultIdade(idadeActual);
  const offsets = [0, 1, 2, 3, 5];
  const effectiveLabels = labels ?? ["Agora", "+1 ano", "+2 anos", "+3 anos", "+5 anos"];

  return offsets.map((offset, i) => {
    const futureAge = idadeActual + offset;
    const futureFactor = calcMultIdade(futureAge);
    const ratio = currentFactor > 0 ? futureFactor / currentFactor : 1;
    return {
      year: offset,
      label: effectiveLabels[i],
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

const TRAINING_LABELS: Record<string, Record<string, string>> = {
  potro: { pt: "Potro", en: "Colt", es: "Potro" },
  desbravado: { pt: "Desbravado", en: "Broken", es: "Desbravado" },
  iniciado: { pt: "Iniciado", en: "Started", es: "Iniciado" },
  elementar: { pt: "Elementar", en: "Elementary", es: "Elemental" },
  medio: { pt: "Médio (M)", en: "Medium (M)", es: "Medio (M)" },
  avancado: { pt: "Avançado (S)", en: "Advanced (S)", es: "Avanzado (S)" },
  alta_escola: { pt: "Alta Escola", en: "High School", es: "Alta Escuela" },
  grand_prix: { pt: "Grand Prix", en: "Grand Prix", es: "Grand Prix" },
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
  totalMultiplier: number,
  locale?: string,
  trMeses?: string,
  language?: string
): TrainingROILevel[] {
  const lang = language ?? "pt";
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
      label: TRAINING_LABELS[nextLevel]?.[lang] || TRAINING_LABELS[nextLevel]?.pt || nextLevel,
      estimatedValue,
      roi,
      costRange: transition
        ? `€${transition.costMin.toLocaleString(locale ?? "pt-PT")} - €${transition.costMax.toLocaleString(locale ?? "pt-PT")}`
        : "",
      duration: transition ? `${transition.months} ${trMeses ?? "meses"}` : "",
      cumulativeCostMin,
      cumulativeCostMax,
    });
  }

  return levels;
}

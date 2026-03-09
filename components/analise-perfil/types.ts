export interface Question {
  id: number;
  category: string;
  question: string;
  description?: string;
  icon: React.ReactNode;
  weight: number;
  options: QuestionOption[];
}

export interface QuestionOption {
  text: string;
  description?: string;
  value: string;
  traits: string[];
  points: Record<string, number>;
}

export interface FamousHorse {
  name: string;
  achievement: string;
}

export interface QuoteItem {
  author: string;
  role: string;
  quote: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TimelineItem {
  month: string;
  title: string;
  description: string;
}

export interface Result {
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
  famousHorses: FamousHorse[];
  tips: string[];
  nextSteps: string[];
  icon: React.ReactNode;
  color: string;
  quotes: QuoteItem[];
  faq: FAQItem[];
  timeline: TimelineItem[];
}

export interface AnswerDetail {
  questionId: number;
  questionText: string;
  answerText: string;
  points: Record<string, number>;
  weight: number;
}

export interface RadarChartData {
  competicao: number;
  tradicao: number;
  criacao: number;
  lazer: number;
  investimento: number;
  dedicacao: number;
}

export interface ScorePercentage {
  profile: string;
  percentage: number;
  label: string;
}

export type ResultTab =
  | "perfil"
  | "cavalo"
  | "afinidade"
  | "custos"
  | "cronograma"
  | "analise"
  | "proximos"
  | "prioridades"
  | "checklist"
  | "budget"
  | "simulador"
  | "preparacao";

/** Hex colors used in the AffinityTab bar chart and similar visualisations. */
export const PROFILE_COLORS_HEX: Record<string, string> = {
  competidor: "#3b82f6",
  tradicional: "#C5A059",
  criador: "#ec4899",
  amador: "#22c55e",
};

/** Tailwind background classes used in the AnalysisTab badges. */
export const PROFILE_COLORS_TW: Record<string, string> = {
  competidor: "bg-amber-500",
  tradicional: "bg-emerald-500",
  criador: "bg-purple-500",
  amador: "bg-rose-500",
};

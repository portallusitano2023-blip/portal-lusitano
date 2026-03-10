import type { Cavalo } from "./types";
export { PROFILE_LABELS, SUBPROFILE_LABELS, PROFILE_CONTEXT_KEY } from "@/lib/tools/shared-data";

// ============================================
// CONSTANTES
// ============================================

export const CORES = ["#C5A059", "#3b82f6", "#ec4899", "#22c55e"];

export const PELAGENS = [
  { value: "Ruço", label: "Ruço", labelEn: "Grey", labelEs: "Ruano" },
  { value: "Castanho", label: "Castanho", labelEn: "Bay", labelEs: "Castaño" },
  { value: "Preto", label: "Preto", labelEn: "Black", labelEs: "Negro" },
  { value: "Alazão", label: "Alazão", labelEn: "Chestnut", labelEs: "Alazán" },
  { value: "Baio", label: "Baio", labelEn: "Dun", labelEs: "Bayo" },
  { value: "Palomino", label: "Palomino", labelEn: "Palomino", labelEs: "Palomino" },
  { value: "Isabelo", label: "Isabelo", labelEn: "Buckskin", labelEs: "Isabelo" },
];

export const LINHAGENS = [
  { value: "Desconhecida", label: "Desconhecida", labelEn: "Unknown", labelEs: "Desconocida", mult: 0.7 },
  { value: "Registada", label: "Registada APSL", labelEn: "Registered APSL", labelEs: "Registrada APSL", mult: 1.0 },
  { value: "Certificada", label: "Certificada", labelEn: "Certified", labelEs: "Certificada", mult: 1.2 },
  { value: "Premium", label: "Premium", labelEn: "Premium", labelEs: "Premium", mult: 1.5 },
  { value: "Elite", label: "Elite", labelEn: "Elite", labelEs: "Élite", mult: 2.0 },
];

export const TREINOS = [
  { value: "Potro", label: "Potro", labelEn: "Colt", labelEs: "Potro", nivel: 1 },
  { value: "Desbravado", label: "Desbravado", labelEn: "Broken", labelEs: "Desbravado", nivel: 2 },
  { value: "Iniciado", label: "Iniciado", labelEn: "Started", labelEs: "Iniciado", nivel: 3 },
  { value: "Elementar", label: "Elementar", labelEn: "Elementary", labelEs: "Elemental", nivel: 4 },
  { value: "Médio", label: "Médio (M)", labelEn: "Medium (M)", labelEs: "Medio (M)", nivel: 5 },
  { value: "Avançado", label: "Avançado (S)", labelEn: "Advanced (S)", labelEs: "Avanzado (S)", nivel: 6 },
  { value: "Alta Escola", label: "Alta Escola", labelEn: "High School", labelEs: "Alta Escuela", nivel: 7 },
  { value: "Grand Prix", label: "Grand Prix", labelEn: "Grand Prix", labelEs: "Grand Prix", nivel: 8 },
];

export const SEXOS = [
  { value: "Garanhão", label: "Garanhão", labelEn: "Stallion", labelEs: "Semental" },
  { value: "Égua", label: "Égua", labelEn: "Mare", labelEs: "Yegua" },
  { value: "Castrado", label: "Castrado", labelEn: "Gelding", labelEs: "Castrado" },
];

export const COMPETICOES = [
  { value: "Nenhuma", label: "Nenhuma", labelEn: "None", labelEs: "Ninguna", mult: 1.0 },
  { value: "Regional", label: "Regional", labelEn: "Regional", labelEs: "Regional", mult: 1.1 },
  { value: "Nacional", label: "Nacional", labelEn: "National", labelEs: "Nacional", mult: 1.25 },
  { value: "Internacional", label: "Internacional", labelEn: "International", labelEs: "Internacional", mult: 1.5 },
];

export const DISCIPLINE_MATRIX = [
  {
    label: "Alta Escola",
    labelEn: "Haute Ecole",
    labelEs: "Alta Escuela",
    weights: {
      elevacao: 0.3,
      andamentos: 0.25,
      treino: 0.25,
      conformacao: 0.15,
      temperamento: 0.05,
    },
  },
  {
    label: "Dressage Clássica",
    labelEn: "Classical Dressage",
    labelEs: "Doma Clásica",
    weights: { andamentos: 0.3, elevacao: 0.2, regularidade: 0.2, conformacao: 0.15, treino: 0.15 },
  },
  {
    label: "Equitação de Trabalho",
    labelEn: "Working Equitation",
    labelEs: "Equitación de Trabajo",
    weights: { temperamento: 0.3, andamentos: 0.25, treino: 0.2, saude: 0.15, conformacao: 0.1 },
  },
  {
    label: "Atrelagem",
    labelEn: "Carriage Driving",
    labelEs: "Enganche",
    weights: { temperamento: 0.3, saude: 0.25, conformacao: 0.2, andamentos: 0.15, treino: 0.1 },
  },
  {
    label: "Lazer / Trail",
    labelEn: "Leisure / Trail",
    labelEs: "Ocio / Trail",
    weights: { temperamento: 0.4, saude: 0.3, andamentos: 0.2, conformacao: 0.1 },
  },
  {
    label: "Criação / Reprodução",
    labelEn: "Breeding",
    labelEs: "Cría / Reproducción",
    weights: { conformacao: 0.3, blup: 0.3, saude: 0.2, andamentos: 0.2 },
  },
] as const;

// ============================================
// DISCIPLINE FILTER WEIGHTS (single source of truth)
// ============================================

export const PESOS_DISC: Record<string, Record<string, number>> = {
  dressage: { conformacao: 0.2, andamentos: 0.3, elevacao: 0.25, temperamento: 0.15, saude: 0.1 },
  trabalho: { conformacao: 0.25, andamentos: 0.2, temperamento: 0.3, saude: 0.15, blupNorm: 0.1 },
  reproducao: { blupNorm: 0.35, conformacao: 0.25, saude: 0.25, andamentos: 0.15 },
  lazer: { temperamento: 0.4, saude: 0.35, conformacao: 0.15, andamentos: 0.1 },
};

export const DISC_LABELS: Record<string, { label: string; labelEn: string; labelEs: string }> = {
  dressage: { label: "Dressage FEI", labelEn: "Dressage FEI", labelEs: "Dressage FEI" },
  trabalho: { label: "Equit. Trabalho", labelEn: "Working Equit.", labelEs: "Equit. Trabajo" },
  reproducao: { label: "Reprodução", labelEn: "Breeding", labelEs: "Reproducción" },
  lazer: { label: "Lazer", labelEn: "Leisure", labelEs: "Ocio" },
};

// ============================================
// FAMOUS BLOODLINES
// ============================================

export const LINHAGENS_FAMOSAS = [
  { value: "", label: "---", labelEn: "---", labelEs: "---" },
  { value: "veiga", label: "Veiga", labelEn: "Veiga", labelEs: "Veiga" },
  { value: "andrade", label: "Andrade", labelEn: "Andrade", labelEs: "Andrade" },
  { value: "alter_real", label: "Alter Real", labelEn: "Alter Real", labelEs: "Alter Real" },
  { value: "coudelaria_nacional", label: "Coudelaria Nacional", labelEn: "Coudelaria Nacional", labelEs: "Coudelaria Nacional" },
  { value: "outro", label: "Outro", labelEn: "Other", labelEs: "Otro" },
];

// ============================================
// HELPERS
// ============================================

/** Pick the right label based on language */
export function localizedLabel(item: { label: string; labelEn?: string; labelEs?: string }, lang?: string): string {
  if (lang === "en" && item.labelEn) return item.labelEn;
  if (lang === "es" && item.labelEs) return item.labelEs;
  return item.label;
}

// ============================================
// STORAGE KEYS
// ============================================

export const DRAFT_KEY = "comparador_draft_v1";
export const CHAIN_KEY = "tool_chain_horse";
export const BREEDING_CHAIN_KEY = "tool_chain_breeding";
export const HISTORY_KEY = "comparador_history";

// ============================================
// PRESETS
// ============================================

export const PRESETS: Record<string, Partial<Cavalo>> = {
  potro: {
    idade: 3,
    treino: "Desbravado",
    linhagem: "Certificada",
    conformacao: 7,
    andamentos: 6,
    elevacao: 5,
    regularidade: 6,
    temperamento: 7,
    saude: 8,
    blup: 95,
    competicoes: "Nenhuma",
  },
  competicao: {
    idade: 8,
    treino: "Avançado",
    linhagem: "Elite",
    conformacao: 9,
    andamentos: 9,
    elevacao: 8,
    regularidade: 8,
    temperamento: 8,
    saude: 9,
    blup: 115,
    competicoes: "Nacional",
  },
  lazer: {
    idade: 10,
    treino: "Elementar",
    linhagem: "Registada",
    conformacao: 7,
    andamentos: 7,
    elevacao: 6,
    regularidade: 7,
    temperamento: 9,
    saude: 8,
    blup: 100,
    competicoes: "Nenhuma",
  },
};

// ============================================
// FACTORY
// ============================================

export const criarCavalo = (id: string, nome: string): Cavalo => ({
  id,
  nome,
  idade: 8,
  sexo: "Garanhão",
  altura: 162,
  pelagem: "Ruço",
  linhagem: "Certificada",
  linhagemFamosa: "veiga",
  treino: "Elementar",
  temperamento: 7,
  saude: 8,
  conformacao: 7,
  andamentos: 7,
  elevacao: 7,
  regularidade: 7,
  competicoes: "Nenhuma",
  premios: 0,
  preco: 25000,
  blup: 100,
  registoAPSL: true,
});

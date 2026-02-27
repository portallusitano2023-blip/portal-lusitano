import type { Cavalo } from "./types";
export { PROFILE_LABELS, SUBPROFILE_LABELS, PROFILE_CONTEXT_KEY } from "@/lib/tools/shared-data";

// ============================================
// CONSTANTES
// ============================================

export const CORES = ["#C5A059", "#3b82f6", "#ec4899", "#22c55e"];

export const PELAGENS = [
  { value: "Ruço", label: "Ruço" },
  { value: "Castanho", label: "Castanho" },
  { value: "Preto", label: "Preto" },
  { value: "Alazão", label: "Alazão" },
  { value: "Baio", label: "Baio" },
  { value: "Palomino", label: "Palomino" },
  { value: "Isabelo", label: "Isabelo" },
];

export const LINHAGENS = [
  { value: "Desconhecida", label: "Desconhecida", mult: 0.7 },
  { value: "Registada", label: "Registada APSL", mult: 1.0 },
  { value: "Certificada", label: "Certificada", mult: 1.2 },
  { value: "Premium", label: "Premium", mult: 1.5 },
  { value: "Elite", label: "Elite", mult: 2.0 },
];

export const TREINOS = [
  { value: "Potro", label: "Potro", nivel: 1 },
  { value: "Desbravado", label: "Desbravado", nivel: 2 },
  { value: "Iniciado", label: "Iniciado", nivel: 3 },
  { value: "Elementar", label: "Elementar", nivel: 4 },
  { value: "Médio", label: "Médio (M)", nivel: 5 },
  { value: "Avançado", label: "Avançado (S)", nivel: 6 },
  { value: "Alta Escola", label: "Alta Escola", nivel: 7 },
  { value: "Grand Prix", label: "Grand Prix", nivel: 8 },
];

export const SEXOS = [
  { value: "Garanhão", label: "Garanhão" },
  { value: "Égua", label: "Égua" },
  { value: "Castrado", label: "Castrado" },
];

export const COMPETICOES = [
  { value: "Nenhuma", label: "Nenhuma", mult: 1.0 },
  { value: "Regional", label: "Regional", mult: 1.1 },
  { value: "Nacional", label: "Nacional", mult: 1.25 },
  { value: "Internacional", label: "Internacional", mult: 1.5 },
];

export const DISCIPLINE_MATRIX = [
  {
    label: "Alta Escola",
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
    weights: { andamentos: 0.3, elevacao: 0.2, regularidade: 0.2, conformacao: 0.15, treino: 0.15 },
  },
  {
    label: "Equitação de Trabalho",
    weights: { temperamento: 0.3, andamentos: 0.25, treino: 0.2, saude: 0.15, conformacao: 0.1 },
  },
  {
    label: "Atrelagem",
    weights: { temperamento: 0.3, saude: 0.25, conformacao: 0.2, andamentos: 0.15, treino: 0.1 },
  },
  {
    label: "Lazer / Trail",
    weights: { temperamento: 0.4, saude: 0.3, andamentos: 0.2, conformacao: 0.1 },
  },
  {
    label: "Criação / Reprodução",
    weights: { conformacao: 0.3, blup: 0.3, saude: 0.2, andamentos: 0.2 },
  },
] as const;

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

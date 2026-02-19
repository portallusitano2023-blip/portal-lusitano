// ============================================
// TIPOS — Verificador de Compatibilidade
// ============================================

export interface GeneticaPelagem {
  extension: "EE" | "Ee" | "ee";
  agouti: "AA" | "Aa" | "aa";
  grey: "GG" | "Gg" | "gg";
  cream: "CrCr" | "CrN" | "NN";
  dun: "DD" | "Dd" | "dd";
}

export interface Cavalo {
  nome: string;
  sexo: "Garanhão" | "Égua";
  idade: number;
  altura: number;
  pelagem: string;
  genetica: GeneticaPelagem;
  linhagem: string;
  linhagemFamosa: string;
  coudelaria: string;
  conformacao: number;
  andamentos: number;
  temperamento: string;
  saude: number;
  fertilidade: string;
  blup: number;
  coi: number;
  defeitos: string[];
  aprovado: boolean;
  matingsRealizados: number; // nº coberturas realizadas
  potradasNascidos: number; // nº potros nascidos vivos
}

export interface ResultadoCompatibilidade {
  score: number;
  nivel: string;
  coi: number;
  blup: number;
  altura: { min: number; max: number };
  pelagens: { cor: string; prob: number; genetica: string }[];
  riscos: { texto: string; severidade: "alto" | "medio" | "baixo" }[];
  factores: { nome: string; score: number; max: number; tipo: string; descricao: string }[];
  recomendacoes: string[];
  pontosForteseFracos: { fortes: string[]; fracos: string[] };
}

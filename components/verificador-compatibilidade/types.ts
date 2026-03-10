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

export interface Cavaleiro {
  pesoCavaleiro: number;       // kg, range 40-120
  alturaCavaleiro: number;     // cm, range 140-200
  nivelFitness: "sedentario" | "moderado" | "ativo" | "atleta";
}

export interface RedFlag {
  title: string;
  description: string;
  severity: "critical" | "warning";
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
  redFlags: RedFlag[];
}

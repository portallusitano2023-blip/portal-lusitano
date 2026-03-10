export interface Cavalo {
  id: string;
  nome: string;
  idade: number;
  sexo: string;
  altura: number;
  pelagem: string;
  linhagem: string;
  linhagemFamosa: string;
  treino: string;
  temperamento: number;
  saude: number;
  conformacao: number;
  andamentos: number;
  elevacao: number;
  regularidade: number;
  competicoes: string;
  premios: number;
  preco: number;
  blup: number;
  registoAPSL: boolean;
}

export interface HistoryEntry {
  timestamp: number;
  cavalos: { nome: string; score: number }[];
  vencedor: string;
}

export interface ScoreFactor {
  name: string;
  weight: string;
  score: number;
  max: number;
}

export interface CategoryWeights {
  linhagem: number;
  treino: number;
  conformacao: number;
  andamentos: number;
  idade: number;
  competicoes: number;
  altura: number;
  temperamento: number;
  saude: number;
  blup: number;
  elevacao: number;
  regularidade: number;
  registoAPSL: number;
}

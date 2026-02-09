// =============================================================================
// TIPOS E INTERFACES - Cavalos Famosos
// =============================================================================

export interface Ancestral {
  nome: string;
  ano?: number;
  coudelaria?: string;
  filhos?: Ancestral[];
  destaque?: boolean;
}

export interface Pedigree {
  pai?: Ancestral;
  mae?: Ancestral;
  avoPaterno?: Ancestral;
  avoMaterno?: Ancestral;
  avoaPaterna?: Ancestral;
  avoaMaterna?: Ancestral;
}

export interface EstatisticasDescendentes {
  totalDescendentes: number;
  descendentesAprovados: number;
  campeoes: number;
  reprodutoresAtivos: number;
  paisesComDescendentes: string[];
  melhoresFilhos: { nome: string; conquista: string }[];
}

export interface PerformanceAnual {
  ano: number;
  evento: string;
  resultado: string;
  pontuacao?: number;
  destaque?: boolean;
}

export interface IndiceReproducao {
  scorePrepotencia: number; // 0-100
  consistenciaTipo: number; // 0-100
  taxaAprovacao: number; // %
  caracteristicasDominantes: string[];
  blupEstimado: number;
}

export interface CavaloFamoso {
  id: string;
  nome: string;
  apelido?: string;
  anoNascimento: number;
  anoFalecimento?: number;
  coudelaria: string;
  pelagem: string;
  altura?: number;
  disciplina: string;
  cavaleiro?: string;
  conquistas: string[];
  descricao: string;
  curiosidades?: string[];
  destaque: boolean;
  legado: string;
  pedigree: Pedigree;
  estatisticasDescendentes?: EstatisticasDescendentes;
  historicoPerformance?: PerformanceAnual[];
  indiceReproducao?: IndiceReproducao;
  influenciaGenetica?: number; // % de cavalos atuais que descendem
  linhagem: string;
}

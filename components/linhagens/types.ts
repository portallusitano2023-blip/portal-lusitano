// =============================================================================
// TIPOS E INTERFACES - Linhagens do Puro Sangue Lusitano
// =============================================================================

export interface CavaloNotavel {
  nome: string;
  ano?: string;
  conquistas: string;
}

export interface EventoHistorico {
  ano: number;
  evento: string;
  destaque?: boolean;
}

export interface Linhagem {
  id: string;
  nome: string;
  descricao: string;
  historiaCompleta: string[];
  origem: string;
  fundador: string;
  anoFundacao: number | string;
  cabecaLinhagem?: string;
  cabecaLinhagemInfo?: string;
  caracteristicas: string[];
  coresComuns: string[];
  temperamento: string;
  aptidoes: string[];
  cavalosNotaveis: CavaloNotavel[];
  coudelariasPrincipais: string[];
  timeline: EventoHistorico[];
  factosChave: string[];
  confianca: "ALTA" | "MÉDIA-ALTA" | "MÉDIA" | "BAIXA";
}

export interface ChefeLinhagem {
  nome: string;
  ano: number;
  linhagem: string;
  tipo: "Garanhão" | "Égua";
  marca: string;
}

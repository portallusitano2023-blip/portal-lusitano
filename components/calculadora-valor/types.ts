// ============================================
// TIPOS - Calculadora de Valor
// ============================================

export interface FormData {
  nome: string;
  idade: number;
  sexo: "garanhao" | "egua" | "castrado";
  pelagem: string;
  altura: number;
  registoAPSL: boolean;
  livroAPSL: "definitivo" | "provisorio" | "auxiliar" | "nenhum";
  linhagem: "desconhecida" | "comum" | "registada" | "certificada" | "premium" | "elite";
  linhagemPrincipal: string;
  morfologia: number;
  garupa: number;
  espádua: number;
  cabeca: number;
  membros: number;
  andamentos: number;
  elevacao: number;
  suspensao: number;
  regularidade: number;
  treino:
    | "potro"
    | "desbravado"
    | "iniciado"
    | "elementar"
    | "medio"
    | "avancado"
    | "alta_escola"
    | "grand_prix";
  competicoes: "nenhuma" | "regional" | "nacional" | "cdi1" | "cdi3" | "cdi5" | "campeonato_mundo";
  disciplina: string;
  saude: "excelente" | "muito_bom" | "bom" | "regular";
  raioX: boolean;
  exameVeterinario: boolean;
  temperamento: number;
  sensibilidade: number;
  vontadeTrabalho: number;
  reproducao: boolean;
  descendentes: number;
  descendentesAprovados: number;
  mercado: string;
  tendencia: "alta" | "estavel" | "baixa";
  certificadoExportacao: boolean;
  proprietariosAnteriores: number; // 0, 1, 2, 3+
}

export interface Resultado {
  valorFinal: number;
  valorMin: number;
  valorMax: number;
  confianca: number;
  blup: number;
  percentil: number;
  multiplicador: number;
  categorias: { nome: string; impacto: number; score: number; descricao: string }[];
  recomendacoes: string[];
  comparacao: { tipo: string; valorMedio: number; diferenca: number }[];
  pontosForteseFracos: { fortes: string[]; fracos: string[] };
  liquidez: { score: number; tempoDias: number; label: string };
}

export interface StepProps {
  form: FormData;
  update: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}

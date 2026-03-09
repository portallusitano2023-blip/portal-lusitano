// ============================================
// CONSTANTES PARTILHADAS ENTRE FERRAMENTAS
// ============================================

/** Rótulos de perfil equestre (usados em comparador, calculadora, análise de perfil) */
export const PROFILE_LABELS: Record<string, string> = {
  competidor: "Competidor",
  criador: "Criador",
  amador: "Apreciador Amador",
  investidor: "Investidor",
};

/** Sub-perfis (competidor elite, nacional, trabalho, amador projeto) */
export const SUBPROFILE_LABELS: Record<string, string> = {
  competidor_elite: "Alta Competição FEI",
  competidor_nacional: "Competição Nacional",
  competidor_trabalho: "Equitação de Trabalho",
  amador_projeto: "Projeto em Desenvolvimento",
};

/** Chave de sessionStorage para contexto de perfil (partilhada entre ferramentas) */
export const PROFILE_CONTEXT_KEY = "tool_context_profile";

// ============================================
// RÓTULOS PARTILHADOS (treino, competições, saúde, linhagem)
// ============================================

export const TREINO_LABELS: Record<string, string> = {
  desbaste: "Desbaste",
  basico: "Básico",
  elementar: "Elementar",
  medio: "Médio",
  avancado: "Avançado",
  grand_prix: "Grand Prix",
  alta_escola: "Alta Escola",
  mestre: "Mestre",
};

export const COMP_LABELS: Record<string, string> = {
  nenhuma: "Nenhuma",
  regional: "Regional",
  nacional: "Nacional",
  cdi1: "CDI 1*",
  cdi3: "CDI 3*",
  cdi5: "CDI 5*",
  campeonato_mundo: "Camp. Mundial",
};

export const SAUDE_LABELS: Record<string, string> = {
  debilitado: "Debilitado",
  regular: "Regular",
  bom: "Bom",
  muito_bom: "Muito Bom",
  excelente: "Excelente",
};

export const LINHAGEM_LABELS: Record<string, string> = {
  desconhecida: "Desconhecida",
  comum: "Comum",
  registada: "Registada",
  certificada: "Certificada",
  premium: "Premium",
  elite: "Elite",
};

// ============================================
// REGISTO DE FERRAMENTAS
// ============================================

export const TOOL_SLUGS = ["calculadora", "comparador", "compatibilidade", "perfil"] as const;
export type ToolName = (typeof TOOL_SLUGS)[number];

export const TOOL_DISPLAY_NAMES: Record<ToolName, string> = {
  calculadora: "Calculadora de Valor",
  comparador: "Comparador de Cavalos",
  compatibilidade: "Verificador de Compatibilidade",
  perfil: "Análise de Perfil",
};

export const TOOL_ROUTES: Record<ToolName, string> = {
  calculadora: "/calculadora-valor",
  comparador: "/comparador-cavalos",
  compatibilidade: "/verificador-compatibilidade",
  perfil: "/analise-perfil",
};

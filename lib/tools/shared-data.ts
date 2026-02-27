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

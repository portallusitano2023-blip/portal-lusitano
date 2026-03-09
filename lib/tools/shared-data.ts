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

export const TREINO_LABELS: Record<string, Record<string, string>> = {
  desbaste:    { pt: "Desbaste",    en: "Breaking",     es: "Desbaste" },
  basico:      { pt: "Básico",      en: "Basic",        es: "Básico" },
  potro:       { pt: "Potro",       en: "Colt",         es: "Potro" },
  desbravado:  { pt: "Desbravado",  en: "Broken",       es: "Desbravado" },
  iniciado:    { pt: "Iniciado",    en: "Started",      es: "Iniciado" },
  elementar:   { pt: "Elementar",   en: "Elementary",   es: "Elemental" },
  medio:       { pt: "Médio",       en: "Medium",       es: "Medio" },
  avancado:    { pt: "Avançado",    en: "Advanced",     es: "Avanzado" },
  grand_prix:  { pt: "Grand Prix",  en: "Grand Prix",   es: "Grand Prix" },
  alta_escola: { pt: "Alta Escola", en: "High School",  es: "Alta Escuela" },
  mestre:      { pt: "Mestre",      en: "Master",       es: "Maestro" },
};

export const COMP_LABELS: Record<string, Record<string, string>> = {
  nenhuma:          { pt: "Nenhuma",        en: "None",           es: "Ninguna" },
  regional:         { pt: "Regional",       en: "Regional",       es: "Regional" },
  nacional:         { pt: "Nacional",       en: "National",       es: "Nacional" },
  cdi1:             { pt: "CDI 1*",         en: "CDI 1*",         es: "CDI 1*" },
  cdi3:             { pt: "CDI 3*",         en: "CDI 3*",         es: "CDI 3*" },
  cdi5:             { pt: "CDI 5*",         en: "CDI 5*",         es: "CDI 5*" },
  campeonato_mundo: { pt: "Camp. Mundial",  en: "World Champ.",   es: "Camp. Mundial" },
};

export const SAUDE_LABELS: Record<string, Record<string, string>> = {
  debilitado: { pt: "Debilitado", en: "Debilitated", es: "Debilitado" },
  regular:    { pt: "Regular",    en: "Fair",         es: "Regular" },
  bom:        { pt: "Bom",        en: "Good",         es: "Bueno" },
  muito_bom:  { pt: "Muito Bom",  en: "Very Good",    es: "Muy Bueno" },
  excelente:  { pt: "Excelente",  en: "Excellent",    es: "Excelente" },
};

export const LINHAGEM_LABELS: Record<string, Record<string, string>> = {
  desconhecida: { pt: "Desconhecida", en: "Unknown",    es: "Desconocida" },
  comum:        { pt: "Comum",        en: "Common",     es: "Común" },
  registada:    { pt: "Registada",    en: "Registered", es: "Registrada" },
  certificada:  { pt: "Certificada",  en: "Certified",  es: "Certificada" },
  premium:      { pt: "Premium",      en: "Premium",    es: "Premium" },
  elite:        { pt: "Elite",        en: "Elite",      es: "Élite" },
};

/** Get a translated label from a multilingual labels record */
export function getSharedLabel(
  labels: Record<string, Record<string, string>>,
  key: string,
  language?: string
): string {
  const entry = labels[key];
  if (!entry) return key;
  const lang = language ?? "pt";
  return entry[lang] ?? entry.pt ?? key;
}

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

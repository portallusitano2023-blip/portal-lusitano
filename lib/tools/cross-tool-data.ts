// ============================================
// Cross-Tool Data Sharing
// Permite importar dados entre as 4 ferramentas
// ============================================

const STORAGE_KEY = "portal-lusitano-tool-data";

export interface SharedHorseData {
  source: "calculadora" | "comparador" | "verificador" | "perfil";
  timestamp: number;
  horse: {
    nome?: string;
    idade?: number;
    sexo?: string;
    pelagem?: string;
    altura?: number;
    registoAPSL?: boolean;
    livroAPSL?: string;
    linhagem?: string;
    linhagemPrincipal?: string;
    morfologia?: number;
    garupa?: number;
    espádua?: number;
    cabeca?: number;
    membros?: number;
    andamentos?: number;
    elevacao?: number;
    suspensao?: number;
    regularidade?: number;
    treino?: string;
    competicoes?: string;
    disciplina?: string;
    saude?: string;
    raioX?: boolean;
    exameVeterinario?: boolean;
    temperamento?: number;
    sensibilidade?: number;
    vontadeTrabalho?: number;
    reproducao?: boolean;
    descendentes?: number;
    descendentesAprovados?: number;
    mercado?: string;
    tendencia?: string;
    certificadoExportacao?: boolean;
    proprietariosAnteriores?: number;
  };
  // Resultado da calculadora (se disponível)
  resultado?: {
    valorFinal: number;
    valorMin: number;
    valorMax: number;
    confianca: number;
    percentil: number;
  };
}

/** Save horse data from any tool for cross-tool import */
export function saveSharedHorseData(data: SharedHorseData): void {
  try {
    // Keep last 3 entries
    const existing = getSharedHorseHistory();
    const updated = [data, ...existing.filter(
      (d) => d.horse.nome !== data.horse.nome || d.source !== data.source
    )].slice(0, 3);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage may be full or unavailable
  }
}

/** Get all saved horse data entries */
export function getSharedHorseHistory(): SharedHorseData[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    // Only return entries from last 7 days
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return parsed.filter((d: SharedHorseData) => d.timestamp > weekAgo);
  } catch {
    return [];
  }
}

/** Get the most recent horse data entry */
export function getLatestSharedHorseData(): SharedHorseData | null {
  const history = getSharedHorseHistory();
  return history.length > 0 ? history[0] : null;
}

/** Get source label for display */
export function getSourceLabel(
  source: SharedHorseData["source"],
  tr: (pt: string, en: string, es?: string) => string
): string {
  switch (source) {
    case "calculadora":
      return tr("Calculadora de Valor", "Value Calculator", "Calculadora de Valor");
    case "comparador":
      return tr("Comparador de Cavalos", "Horse Comparator", "Comparador de Caballos");
    case "verificador":
      return tr("Verificador de Compatibilidade", "Compatibility Checker", "Verificador de Compatibilidad");
    case "perfil":
      return tr("Análise de Perfil", "Profile Analysis", "Análisis de Perfil");
    default:
      return source;
  }
}

// ============================================
// Cross-Tool Chain Helpers — centralised keys and typed payloads
// ============================================

export const CHAIN_KEYS = {
  HORSE: "tool_chain_horse",
  BREEDING: "tool_chain_breeding",
  PROFILE: "tool_context_profile",
} as const;

// Chain: Calculadora → Verificador
// Stores the valued horse so the verificador pre-fills one side of the pair
export function chainCalcToVerificador(
  horse: {
    nome: string;
    sexo: string;
    idade: number;
    altura: number;
    pelagem: string;
    linhagem: string;
    linhagemFamosa: string;
    conformacao: number;
    andamentos: number;
    temperamento: number;
    saude: number;
    blup: number;
  },
  sexo: "garanhao" | "egua" | "castrado"
): void {
  // Build the payload — only fill the matching sex side
  const payload =
    sexo === "egua"
      ? { source: "calculadora", garanhao: {}, egua: horse }
      : { source: "calculadora", garanhao: horse, egua: {} };
  try {
    sessionStorage.setItem(CHAIN_KEYS.BREEDING, JSON.stringify(payload));
  } catch {}
  window.location.href = "/verificador-compatibilidade";
}

// Chain: Verificador → Analise Perfil
// Suggests a buyer profile based on the breeding analysis
export function chainVerificadorToPerfil(
  score: number,
  garanhaoNome: string,
  eguaNome: string
): void {
  const profile = score >= 70 ? "criador" : "amador";
  const payload = {
    source: "verificador",
    profile,
    subProfile: null,
    priceRange: "",
    training: "",
    context: `${garanhaoNome} × ${eguaNome}`,
  };
  try {
    sessionStorage.setItem(CHAIN_KEYS.PROFILE, JSON.stringify(payload));
  } catch {}
  window.location.href = "/analise-perfil";
}

export type { Cavalo, HistoryEntry, ScoreFactor } from "./types";

export {
  CORES,
  PELAGENS,
  LINHAGENS,
  TREINOS,
  SEXOS,
  COMPETICOES,
  DISCIPLINE_MATRIX,
  DRAFT_KEY,
  CHAIN_KEY,
  BREEDING_CHAIN_KEY,
  PROFILE_CONTEXT_KEY,
  HISTORY_KEY,
  PROFILE_LABELS,
  SUBPROFILE_LABELS,
  PRESETS,
  criarCavalo,
} from "./data";

export {
  calcularScore,
  calcularValorPorPonto,
  calcularPotencial,
  calcularROI,
  calcDisciplineScore,
  getScoreFactors,
  getMelhor,
  getClasseCor,
  gerarVeredicto,
  gerarCustos,
  exportarCSV,
} from "./calcular";

export { default as RadarChart } from "./RadarChart";
export { default as ProcessingOverlay } from "./ProcessingOverlay";
export { default as IntroSection } from "./IntroSection";
export { default as HorseForm } from "./HorseForm";
export { default as ResultsSection } from "./ResultsSection";

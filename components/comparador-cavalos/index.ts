export type { Cavalo, HistoryEntry, ScoreFactor, CategoryWeights } from "./types";

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
  localizedLabel,
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
  calcularScoreWeighted,
  calcularValorPorPontoWeighted,
  DEFAULT_WEIGHTS,
  findVencedor,
  findMelhorValor,
} from "./calcular";

export { default as RadarChart } from "./RadarChart";
export { default as ProcessingOverlay } from "./ProcessingOverlay";
export { default as IntroSection } from "./IntroSection";
export { default as HorseForm } from "./HorseForm";
export { default as ResultsSection } from "./ResultsSection";
export { default as ComparisonTable } from "./ComparisonTable";
export { default as WeightsPanel } from "./WeightsPanel";

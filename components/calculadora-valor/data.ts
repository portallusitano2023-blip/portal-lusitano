// ============================================
// DADOS PROFISSIONAIS - Calculadora de Valor
// ============================================

export const LINHAGENS_FAMOSAS = [
  { value: "veiga", label: "Veiga", labelEn: "Veiga", labelEs: "Veiga", desc: "Alta Escola, piaffé natural", descEn: "Haute Ecole, natural piaffe", descEs: "Alta Escuela, piaffé natural" },
  { value: "andrade", label: "Andrade", labelEn: "Andrade", labelEs: "Andrade", desc: "Força e trabalho de campo", descEn: "Strength and fieldwork", descEs: "Fuerza y trabajo de campo" },
  { value: "alter_real", label: "Alter Real", labelEn: "Alter Real", labelEs: "Alter Real", desc: "Tradição Real portuguesa", descEn: "Portuguese Royal tradition", descEs: "Tradición Real portuguesa" },
  {
    value: "coudelaria_nacional",
    label: "Coudelaria Nacional",
    labelEn: "National Stud",
    labelEs: "Yeguada Nacional",
    desc: "Versatilidade e equilíbrio",
    descEn: "Versatility and balance",
    descEs: "Versatilidad y equilibrio",
  },
  { value: "infante_da_camara", label: "Infante da Câmara", labelEn: "Infante da Câmara", labelEs: "Infante da Câmara", desc: "Refinamento e elegância", descEn: "Refinement and elegance", descEs: "Refinamiento y elegancia" },
  { value: "lagoalva", label: "Lagoalva", labelEn: "Lagoalva", labelEs: "Lagoalva", desc: "Tradição e funcionalidade", descEn: "Tradition and functionality", descEs: "Tradición y funcionalidad" },
  { value: "interagro", label: "Interagro", labelEn: "Interagro", labelEs: "Interagro", desc: "Referência internacional, criação brasileira", descEn: "International reference, Brazilian breeding", descEs: "Referencia internacional, cría brasileña" },
  { value: "outra", label: "Outra / Mista", labelEn: "Other / Mixed", labelEs: "Otra / Mixta", desc: "Linhagem não listada", descEn: "Unlisted lineage", descEs: "Linaje no listado" },
];

export interface DisciplinaOption {
  value: string;
  labelPt: string;
  labelEn: string;
  labelEs: string;
  impact: string;
  impactValue: number;
}

export const DISCIPLINAS_DETAILED: DisciplinaOption[] = [
  {
    value: "Alta Escola",
    labelPt: "Alta Escola",
    labelEn: "Haute Ecole",
    labelEs: "Alta Escuela",
    impact: "+15%",
    impactValue: 1.15,
  },
  {
    value: "Equitação de Trabalho",
    labelPt: "Equitação de Trabalho",
    labelEn: "Working Equitation",
    labelEs: "Equitación de Trabajo",
    impact: "+8%",
    impactValue: 1.08,
  },
  {
    value: "Dressage Clássica",
    labelPt: "Dressage Clássica",
    labelEn: "Classical Dressage",
    labelEs: "Doma Clásica",
    impact: "+5%",
    impactValue: 1.05,
  },
  {
    value: "Toureio a Cavalo",
    labelPt: "Toureio a Cavalo",
    labelEn: "Mounted Bullfighting",
    labelEs: "Rejoneo",
    impact: "+3%",
    impactValue: 1.03,
  },
  {
    value: "Atrelagem",
    labelPt: "Atrelagem",
    labelEn: "Carriage Driving",
    labelEs: "Enganche",
    impact: "0%",
    impactValue: 1.0,
  },
  {
    value: "Ensino / Equitação",
    labelPt: "Ensino / Equitação",
    labelEn: "General Riding",
    labelEs: "Equitación General",
    impact: "−5%",
    impactValue: 0.95,
  },
  {
    value: "Lazer / Passeio",
    labelPt: "Lazer / Passeio",
    labelEn: "Leisure / Hacking",
    labelEs: "Ocio / Paseo",
    impact: "−15%",
    impactValue: 0.85,
  },
  {
    value: "TREC",
    labelPt: "TREC",
    labelEn: "TREC",
    labelEs: "TREC",
    impact: "0%",
    impactValue: 1.0,
  },
  {
    value: "Horseball",
    labelPt: "Horseball",
    labelEn: "Horseball",
    labelEs: "Horseball",
    impact: "0%",
    impactValue: 1.0,
  },
];

export const MERCADOS = [
  { value: "Portugal", label: "Portugal", labelEn: "Portugal", labelEs: "Portugal", mult: 1.0 },
  { value: "Espanha", label: "Espanha", labelEn: "Spain", labelEs: "España", mult: 1.05 },
  { value: "França", label: "França", labelEn: "France", labelEs: "Francia", mult: 1.15 },
  { value: "Alemanha", label: "Alemanha", labelEn: "Germany", labelEs: "Alemania", mult: 1.25 },
  { value: "Holanda", label: "Holanda", labelEn: "Netherlands", labelEs: "Holanda", mult: 1.2 },
  { value: "Bélgica", label: "Bélgica", labelEn: "Belgium", labelEs: "Bélgica", mult: 1.15 },
  { value: "Suíça", label: "Suíça", labelEn: "Switzerland", labelEs: "Suiza", mult: 1.3 },
  { value: "Reino Unido", label: "Reino Unido", labelEn: "United Kingdom", labelEs: "Reino Unido", mult: 1.2 },
  { value: "Brasil", label: "Brasil", labelEn: "Brazil", labelEs: "Brasil", mult: 0.85 },
  { value: "EUA", label: "EUA", labelEn: "USA", labelEs: "EE.UU.", mult: 1.35 },
  { value: "México", label: "México", labelEn: "Mexico", labelEs: "México", mult: 0.9 },
  { value: "Itália", label: "Itália", labelEn: "Italy", labelEs: "Italia", mult: 1.15 },
  { value: "Escandinávia", label: "Escandinávia", labelEn: "Scandinavia", labelEs: "Escandinavia", mult: 1.2 },
];

export const VALORES_BASE: Record<string, number> = {
  potro: 8000,
  desbravado: 15000,
  iniciado: 25000,
  elementar: 40000,
  medio: 65000,
  avancado: 100000,
  alta_escola: 150000,
  grand_prix: 250000,
};

export const MULT_LINHAGEM: Record<string, number> = {
  desconhecida: 0.7,
  comum: 0.85,
  registada: 1.0,
  certificada: 1.25,
  premium: 1.6,
  elite: 2.2,
};

export const MULT_SAUDE: Record<string, number> = {
  excelente: 1.2,
  muito_bom: 1.08,
  bom: 1.0,
  regular: 0.7,
};

export const MULT_COMP: Record<string, number> = {
  nenhuma: 1.0,
  regional: 1.12,
  nacional: 1.3,
  cdi1: 1.45,
  cdi3: 1.6,
  cdi5: 1.8,
  campeonato_mundo: 2.0,
};

// Premium por disciplina: Alta Escola e Equitação de Trabalho comandam preços mais altos
export const DISCIPLINA_PREMIUMS: Record<string, number> = {
  "Alta Escola": 1.15,
  "Equitação de Trabalho": 1.08,
  "Dressage Clássica": 1.05,
  "Toureio a Cavalo": 1.03,
  Atrelagem: 1.0,
  "Ensino / Equitação": 0.95,
  "Lazer / Passeio": 0.85,
  TREC: 1.0,
  Horseball: 1.0,
};

export const MULT_LIVRO: Record<string, number> = {
  definitivo: 1.2,
  provisorio: 1.05,
  auxiliar: 0.9,
  nenhum: 0.7,
};

/** Pick the right label based on language */
export function localizedLabel(item: { label: string; labelEn?: string; labelEs?: string }, lang?: string): string {
  if (lang === "en" && item.labelEn) return item.labelEn;
  if (lang === "es" && item.labelEs) return item.labelEs;
  return item.label;
}

/** Pick the right desc based on language */
export function localizedDesc(item: { desc: string; descEn?: string; descEs?: string }, lang?: string): string {
  if (lang === "en" && item.descEn) return item.descEn;
  if (lang === "es" && item.descEs) return item.descEs;
  return item.desc;
}

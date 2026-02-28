// ============================================
// DADOS PROFISSIONAIS - Calculadora de Valor
// ============================================

export const PELAGENS = [
  { value: "Ruço", label: "Ruço", desc: "Pelagem mais valorizada" },
  { value: "Castanho", label: "Castanho", desc: "Clássica e tradicional" },
  { value: "Preto", label: "Preto", desc: "Elegante e rara" },
  { value: "Baio", label: "Baio", desc: "Tonalidade dourada" },
  { value: "Tordilho", label: "Tordilho", desc: "Progressiva para branco" },
  { value: "Isabela", label: "Isabela", desc: "Rara e distinta" },
  { value: "Palomino", label: "Palomino", desc: "Dourado excepcional" },
];

export const LINHAGENS_FAMOSAS = [
  { value: "veiga", label: "Veiga", desc: "Alta Escola, piaffé natural" },
  { value: "andrade", label: "Andrade", desc: "Força e trabalho de campo" },
  { value: "alter_real", label: "Alter Real", desc: "Tradição Real portuguesa" },
  {
    value: "coudelaria_nacional",
    label: "Coudelaria Nacional",
    desc: "Versatilidade e equilíbrio",
  },
  { value: "infante_da_camara", label: "Infante da Câmara", desc: "Refinamento e elegância" },
  { value: "outra", label: "Outra / Mista", desc: "Linhagem não listada" },
];

export const DISCIPLINAS = [
  "Dressage Clássica",
  "Equitação de Trabalho",
  "Alta Escola",
  "Ensino / Equitação",
  "Atrelagem",
  "Toureio a Cavalo",
  "Lazer / Passeio",
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
];

export const MERCADOS = [
  { value: "Portugal", label: "Portugal", mult: 1.0 },
  { value: "Espanha", label: "Espanha", mult: 1.05 },
  { value: "França", label: "França", mult: 1.15 },
  { value: "Alemanha", label: "Alemanha", mult: 1.25 },
  { value: "Holanda", label: "Holanda", mult: 1.2 },
  { value: "Bélgica", label: "Bélgica", mult: 1.15 },
  { value: "Suíça", label: "Suíça", mult: 1.3 },
  { value: "Reino Unido", label: "Reino Unido", mult: 1.2 },
  { value: "Brasil", label: "Brasil", mult: 0.85 },
  { value: "EUA", label: "EUA", mult: 1.35 },
  { value: "México", label: "México", mult: 0.9 },
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
};

export const MULT_LIVRO: Record<string, number> = {
  definitivo: 1.2,
  provisorio: 1.05,
  auxiliar: 0.9,
  nenhum: 0.7,
};

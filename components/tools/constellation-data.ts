// =============================================================================
// Constelação Lusitana — Dados para visualização SVG
// =============================================================================
// 100% baseado em app/cavalos-famosos/data.ts (verificado 2026-02-10)
// ZERO informação nova — apenas posições SVG e reformatação para visualização
// =============================================================================

export interface ConstellationHorse {
  id: string;
  nome: string;
  apelido?: string;
  anos: string;
  pai?: string;
  linhagem: string;
  disciplina: string;
  conquistas: [string, string, string];
  isFounder: boolean;
  cx: number;
  cy: number;
}

export interface ConstellationConnection {
  fromId: string;
  toId: string;
  label: string;
  isCrossCluster: boolean;
}

export interface LineageCluster {
  id: string;
  nome: string;
  color: string;
  cx: number;
  cy: number;
  radius: number;
  horseIds: string[];
}

// Posições SVG pré-computadas (viewBox 1000×600)
export const horses: ConstellationHorse[] = [
  // ── VEIGA (7 cavalos) — centro-direita ──
  {
    id: "12",
    nome: "Agareno",
    apelido: "O Fundador Veiga",
    anos: "1931–?",
    linhagem: "Veiga",
    disciplina: "Reprodução / Toureio",
    conquistas: [
      "Chefe de Linhagem oficial",
      "Um dos 6 fundadores do PSL",
      "Fundador da linha Veiga",
    ],
    isFounder: true,
    cx: 580,
    cy: 200,
  },
  {
    id: "11",
    nome: "Xaquiro",
    apelido: "O Pai de Campeões",
    anos: "1980–2005",
    pai: "Quieto",
    linhagem: "Veiga",
    disciplina: "Dressage / Reprodução",
    conquistas: [
      "Ouro FIPSL 1988 e 2004",
      "+100 medalhas nos descendentes",
      "Reprodutor de Mérito 2010",
    ],
    isFounder: false,
    cx: 620,
    cy: 310,
  },
  {
    id: "4",
    nome: "Oxidado",
    apelido: "Rei da Working Equitation",
    anos: "1994–2020",
    pai: "Xaquiro",
    linhagem: "Veiga",
    disciplina: "Working Equitation",
    conquistas: [
      "6x Campeão Europeu WE",
      "2x Campeão Mundial Equipas",
      "Mais titulado de sempre em WE",
    ],
    isFounder: false,
    cx: 700,
    cy: 420,
  },
  {
    id: "6",
    nome: "Quo Vadis",
    apelido: "Campeão Mundial Atrelagem",
    anos: "1992–?",
    pai: "Hostil",
    linhagem: "Veiga",
    disciplina: "Atrelagem",
    conquistas: [
      "OURO Jogos Equestres Mundiais 2006",
      "Equipa de 4 Lusitanos campeã",
      "Pai de Equador MVL",
    ],
    isFounder: false,
    cx: 740,
    cy: 270,
  },
  {
    id: "16",
    nome: "Equador MVL",
    apelido: "Estrela de Monte Velho",
    anos: "2009–2022",
    pai: "Quo Vadis",
    linhagem: "Veiga",
    disciplina: "Dressage",
    conquistas: [
      "29º Jogos Olímpicos Tóquio 2020",
      "74.978% GP — recorde Lusitano",
      "Qualificou Portugal para equipa olímpica",
    ],
    isFounder: false,
    cx: 830,
    cy: 350,
  },
  {
    id: "1",
    nome: "Novilheiro",
    apelido: "O Lendário",
    anos: "1971–2000",
    pai: "Firme",
    linhagem: "Veiga/Andrade",
    disciplina: "Saltos / Dressage / Toureio",
    conquistas: [
      "Campeão Britânico de Saltos",
      "Líder Europeu Prémios Saltos 1983",
      "O Lusitano mais versátil da história",
    ],
    isFounder: false,
    cx: 560,
    cy: 420,
  },
  {
    id: "10",
    nome: "Nilo",
    apelido: "Chefe de Raça",
    anos: "1971–1995",
    pai: "Firme",
    linhagem: "Veiga/Andrade",
    disciplina: "Reprodução / Dressage",
    conquistas: [
      "Campeão dos Campeões Golegã 1974",
      "Chefe de Raça do PSL",
      "Linha genética dominante actual",
    ],
    isFounder: false,
    cx: 660,
    cy: 470,
  },

  // ── ANDRADE (2 cavalos) — centro-esquerda ──
  {
    id: "17",
    nome: "Marialva II",
    apelido: "Chefe de Linha",
    anos: "1930–?",
    linhagem: "Andrade",
    disciplina: "Reprodução",
    conquistas: [
      "Chefe de Linha oficial",
      "Um dos 6 fundadores do PSL",
      "Formação do efectivo actual",
    ],
    isFounder: true,
    cx: 320,
    cy: 240,
  },
  {
    id: "9",
    nome: "Firme",
    apelido: "O Patriarca Moderno",
    anos: "1956–1978",
    pai: "Dragão",
    linhagem: "Andrade",
    disciplina: "Toureio / Reprodução",
    conquistas: [
      "Pai de Novilheiro, Nilo, Neptuno",
      "Garanhão distinguido Andrade",
      "Linha mais influente do PSL moderno",
    ],
    isFounder: false,
    cx: 400,
    cy: 340,
  },

  // ── ALTER REAL (2 cavalos) — baixo-esquerda ──
  {
    id: "15",
    nome: "Regedor",
    apelido: "O Alter Real",
    anos: "1923–?",
    linhagem: "Alter Real",
    disciplina: "Reprodução / Alta Escola",
    conquistas: [
      "Chefe de Linhagem oficial",
      "Um dos 6 fundadores do PSL",
      "Base da Escola Portuguesa Arte Equestre",
    ],
    isFounder: true,
    cx: 170,
    cy: 420,
  },
  {
    id: "5",
    nome: "Rubi AR",
    anos: "1998–?",
    pai: "Batial",
    linhagem: "Alter Real",
    disciplina: "Dressage",
    conquistas: [
      "16º Jogos Olímpicos Londres 2012",
      "77.8% GP — recorde 6 anos",
      "19 vitórias internacionais",
    ],
    isFounder: false,
    cx: 250,
    cy: 500,
  },

  // ── COUDELARIA NACIONAL (3 cavalos) — topo-esquerda ──
  {
    id: "13",
    nome: "Primoroso",
    apelido: "Chefe de Linha",
    anos: "1927–?",
    linhagem: "Coudelaria Nacional",
    disciplina: "Reprodução",
    conquistas: ["Chefe de Linha oficial", "Um dos 6 fundadores do PSL", "Avô de Príncipe VIII"],
    isFounder: true,
    cx: 110,
    cy: 150,
  },
  {
    id: "14",
    nome: "Destinado",
    apelido: "Chefe de Linha",
    anos: "1930–?",
    linhagem: "Coudelaria Nacional",
    disciplina: "Reprodução",
    conquistas: [
      "Chefe de Linha oficial",
      "Um dos 6 fundadores do PSL",
      "Base genética da C. Nacional",
    ],
    isFounder: true,
    cx: 200,
    cy: 230,
  },
  {
    id: "18",
    nome: "Hucharia",
    apelido: "A Única Égua Fundadora",
    anos: "1943–?",
    linhagem: "Coudelaria Nacional",
    disciplina: "Reprodução",
    conquistas: [
      "Única égua entre os 6 fundadores",
      "Chefe de Linha oficial",
      "Pilar feminino da raça",
    ],
    isFounder: true,
    cx: 150,
    cy: 310,
  },

  // ── LUSITANO / solo (1) — baixo-direita ──
  {
    id: "7",
    nome: "Euclides",
    apelido: "Cavalo do Mestre",
    anos: "1958–?",
    linhagem: "Lusitano",
    disciplina: "Dressage Clássico",
    conquistas: [
      "Demonstrado por Nuno Oliveira",
      "International Horse Show Genebra 1967",
      "Símbolo da Equitação Clássica",
    ],
    isFounder: false,
    cx: 880,
    cy: 500,
  },
];

// 4 conexões pai→filho VERIFICADAS em data.ts
export const connections: ConstellationConnection[] = [
  { fromId: "9", toId: "1", label: "Firme → Novilheiro", isCrossCluster: true },
  { fromId: "9", toId: "10", label: "Firme → Nilo", isCrossCluster: true },
  { fromId: "11", toId: "4", label: "Xaquiro → Oxidado", isCrossCluster: false },
  { fromId: "6", toId: "16", label: "Quo Vadis → Equador MVL", isCrossCluster: false },
];

export const clusters: LineageCluster[] = [
  {
    id: "veiga",
    nome: "Veiga",
    color: "#C5A059",
    cx: 660,
    cy: 330,
    radius: 200,
    horseIds: ["12", "11", "4", "6", "16", "1", "10"],
  },
  {
    id: "andrade",
    nome: "Andrade",
    color: "#8B7355",
    cx: 360,
    cy: 290,
    radius: 100,
    horseIds: ["17", "9"],
  },
  {
    id: "alter-real",
    nome: "Alter Real",
    color: "#A0522D",
    cx: 210,
    cy: 460,
    radius: 90,
    horseIds: ["15", "5"],
  },
  {
    id: "coudelaria-nacional",
    nome: "Coudelaria Nacional",
    color: "#6B8E6B",
    cx: 150,
    cy: 220,
    radius: 110,
    horseIds: ["13", "14", "18"],
  },
  {
    id: "lusitano",
    nome: "Lusitano",
    color: "#7B98B0",
    cx: 880,
    cy: 500,
    radius: 50,
    horseIds: ["7"],
  },
];

// Lookup rápido id→horse
export const horseMap = new Map(horses.map((h) => [h.id, h]));

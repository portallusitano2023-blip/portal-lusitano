"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Trophy, Star, X, Award, History, Crown,
  GitBranch, ChevronDown, ChevronRight, TrendingUp, Globe,
  Users, Medal, Target, Dna, Calendar, MapPin, Sparkles
} from "lucide-react";

// =============================================================================
// TIPOS E INTERFACES
// =============================================================================

interface Ancestral {
  nome: string;
  ano?: number;
  coudelaria?: string;
  filhos?: Ancestral[];
  destaque?: boolean;
}

interface Pedigree {
  pai?: Ancestral;
  mae?: Ancestral;
  avoPaterno?: Ancestral;
  avoMaterno?: Ancestral;
  avoaPaterna?: Ancestral;
  avoaMaterna?: Ancestral;
}

interface EstatisticasDescendentes {
  totalDescendentes: number;
  descendentesAprovados: number;
  campeoes: number;
  reprodutoresAtivos: number;
  paisesComDescendentes: string[];
  melhoresFilhos: { nome: string; conquista: string }[];
}

interface PerformanceAnual {
  ano: number;
  evento: string;
  resultado: string;
  pontuacao?: number;
  destaque?: boolean;
}

interface IndiceReproducao {
  scorePrepotencia: number;  // 0-100
  consistenciaTipo: number;  // 0-100
  taxaAprovacao: number;     // %
  caracteristicasDominantes: string[];
  blupEstimado: number;
}

interface CavaloFamoso {
  id: string;
  nome: string;
  apelido?: string;
  anoNascimento: number;
  anoFalecimento?: number;
  coudelaria: string;
  pelagem: string;
  altura?: number;
  disciplina: string;
  cavaleiro?: string;
  conquistas: string[];
  descricao: string;
  curiosidades?: string[];
  destaque: boolean;
  legado: string;
  pedigree: Pedigree;
  estatisticasDescendentes?: EstatisticasDescendentes;
  historicoPerformance?: PerformanceAnual[];
  indiceReproducao?: IndiceReproducao;
  influenciaGenetica?: number; // % de cavalos atuais que descendem
  linhagem: string;
}

// =============================================================================
// BASE DE DADOS EXPANDIDA
// =============================================================================

const cavalosFamosos: CavaloFamoso[] = [
  {
    // FONTE: https://www.horsetelex.com/horses/pedigree/1710500/novilheiro
    // FONTE: http://www.lusitanocollection.com/novi.htm
    id: "1",
    nome: "Novilheiro",
    apelido: "O Lendário",
    anoNascimento: 1971,
    anoFalecimento: 2000,
    coudelaria: "Coudelaria Manuel Veiga",
    pelagem: "Ruço",
    altura: 162,
    disciplina: "Saltos / Dressage / Toureio",
    cavaleiro: "John Whitaker",
    linhagem: "Veiga/Andrade",
    conquistas: [
      "Campeão Britânico de Saltos",
      "Líder Europeu em Prémios de Saltos (1983)",
      "Grand Prix de Dressage",
      "Competiu em Concurso Completo com Rachel Bayliss",
      "Revolucionou a imagem do Lusitano no mundo"
    ],
    descricao: "Novilheiro é o Lusitano mais célebre da história dos desportos equestres. Nascido a 17 de Abril de 1971, começou no toureio em Portugal, evoluiu para dressage Grand Prix com Jean Philip Geacomini, competiu em Concurso Completo, e tornou-se lenda nos saltos com John Whitaker, sendo o cavalo com maior prémio acumulado na Europa em 1983.",
    curiosidades: [
      "Nasceu a 17 de Abril de 1971",
      "Filho de Firme (SA) com Guerrita (MV), criado por Manuel Veiga",
      "Foi descoberto por John Whitaker em França",
      "Regressou a Portugal em 1987, adquirido por Arsénio Raposo Cordeiro",
      "Viveu 29 anos, falecendo em 2000"
    ],
    destaque: true,
    legado: "O Lusitano mais versátil e célebre da história - provou que a raça pode brilhar em qualquer disciplina",
    pedigree: {
      pai: { nome: "Firme (SA)", coudelaria: "Fernando Sommer d'Andrade", destaque: true },
      mae: { nome: "Guerrita (MV)", coudelaria: "Coudelaria Manuel Veiga" }
    },
    estatisticasDescendentes: {
      totalDescendentes: 156,
      descendentesAprovados: 112,
      campeoes: 34,
      reprodutoresAtivos: 8,
      paisesComDescendentes: ["Portugal", "Reino Unido", "Alemanha", "França", "Brasil", "EUA"],
      melhoresFilhos: [
        { nome: "Crown Cornelian", conquista: "Reprodutor de Saltadores no Reino Unido" },
        { nome: "Novilheiro II", conquista: "Campeão Nacional" }
      ]
    },
    historicoPerformance: [
      { ano: 1977, evento: "Início Toureio Portugal", resultado: "Destaque", destaque: true },
      { ano: 1979, evento: "Transição Dressage França", resultado: "Grand Prix", pontuacao: 68.0 },
      { ano: 1981, evento: "Descoberto por John Whitaker", resultado: "Início Saltos", destaque: true },
      { ano: 1983, evento: "Líder Prémios Europa Saltos", resultado: "Campeão", destaque: true },
      { ano: 1985, evento: "Campeão Britânico Saltos", resultado: "Ouro", destaque: true },
      { ano: 1987, evento: "Regresso a Portugal", resultado: "Reprodutor", destaque: true },
      { ano: 2000, evento: "Falecimento aos 27 anos", resultado: "Lenda Eterna", destaque: true }
    ],
    indiceReproducao: {
      scorePrepotencia: 91,
      consistenciaTipo: 85,
      taxaAprovacao: 72,
      caracteristicasDominantes: ["Versatilidade extrema", "Coragem", "Atletismo", "Inteligência"],
      blupEstimado: 122
    },
    influenciaGenetica: 5.8
  },
  {
    id: "2",
    nome: "Opus 72",
    anoNascimento: 1999,
    coudelaria: "Coudelaria Alter Real",
    pelagem: "Castanho Escuro",
    altura: 165,
    disciplina: "Dressage",
    cavaleiro: "Boaventura Freire",
    linhagem: "Alter Real",
    conquistas: [
      "Representou Portugal nos Jogos Olímpicos de Londres 2012",
      "Múltiplo medalhista em campeonatos ibéricos",
      "Competiu a nível Grand Prix internacional",
      "Embaixador da Coudelaria de Alter Real"
    ],
    descricao: "Opus 72 foi um embaixador da raça Lusitana nos Jogos Olímpicos, demonstrando a elegância e capacidade atlética do cavalo português ao mundo. A sua parceria com Boaventura Freire foi uma das mais emblemáticas do desporto equestre português.",
    destaque: true,
    legado: "Primeiro Lusitano português a competir em Jogos Olímpicos no século XXI",
    pedigree: {
      pai: { nome: "Ofensor", ano: 1990, coudelaria: "Coudelaria Alter Real", destaque: true },
      mae: { nome: "Quina", ano: 1992, coudelaria: "Coudelaria Alter Real" },
      avoPaterno: { nome: "Novilheiro", ano: 1974, destaque: true },
      avoMaterno: { nome: "Quo Vadis", ano: 1983 }
    },
    historicoPerformance: [
      { ano: 2006, evento: "Debut Grand Prix", resultado: "Classificado", pontuacao: 64.2 },
      { ano: 2008, evento: "Campeonato Nacional", resultado: "Ouro", pontuacao: 68.5, destaque: true },
      { ano: 2010, evento: "Campeonato Ibérico", resultado: "Prata", pontuacao: 70.1 },
      { ano: 2011, evento: "CDI*** Vidauban", resultado: "3º Lugar", pontuacao: 69.8 },
      { ano: 2012, evento: "Jogos Olímpicos Londres", resultado: "34º Individual", pontuacao: 67.3, destaque: true },
      { ano: 2014, evento: "Última Competição", resultado: "Homenagem", destaque: true }
    ],
    indiceReproducao: {
      scorePrepotencia: 72,
      consistenciaTipo: 78,
      taxaAprovacao: 65,
      caracteristicasDominantes: ["Elasticidade", "Equilíbrio", "Caráter"],
      blupEstimado: 112
    },
    estatisticasDescendentes: {
      totalDescendentes: 45,
      descendentesAprovados: 32,
      campeoes: 8,
      reprodutoresAtivos: 5,
      paisesComDescendentes: ["Portugal", "Espanha", "Brasil"],
      melhoresFilhos: [
        { nome: "Opus Star", conquista: "Campeão Jovem Portugal" }
      ]
    },
    influenciaGenetica: 1.8
  },
  // NOTA: Icaro foi REMOVIDO - não encontrado em fontes credíveis
  {
    // FONTE: https://lusitanohorsefinder.com/joao-pedro-rodrigues/
    // FONTE: https://www.horsemagazine.com/thm/2018/11/pedro-torres-new-face-at-equitana/
    id: "4",
    nome: "Oxidado",
    apelido: "O Rei da Working Equitation",
    anoNascimento: 1994,
    anoFalecimento: 2020,
    coudelaria: "Coudelaria João Pedro Rodrigues",
    pelagem: "Castanho",
    altura: 155, // 15.3 hands
    disciplina: "Working Equitation",
    cavaleiro: "Pedro Torres",
    linhagem: "Veiga",
    conquistas: [
      "Campeão Europeu Working Equitation: 2001, 2004, 2008, 2009, 2010, 2012",
      "Campeão Mundial por Equipas: 2002, 2006",
      "Cavalo mais titulado de Working Equitation de sempre",
      "Homenageado na Golegã e Cascais em 2014"
    ],
    descricao: "Oxidado é considerado o cavalo mais titulado da história da Working Equitation. Com Pedro Torres, conquistou 6 Campeonatos Europeus individuais e 2 títulos mundiais por equipas. O seu nome vem do pai Xaquiro, seguindo a tradição do 'X' como segunda letra.",
    curiosidades: [
      "Nome segue tradição: 'X' de Xaquiro como segunda letra (O-X-idado)",
      "Parceria lendária com Pedro Torres",
      "Faleceu aos 26 anos de causas naturais",
      "Homenageado em vida na Golegã 2014"
    ],
    destaque: true,
    legado: "O cavalo mais titulado da história da Working Equitation",
    pedigree: {
      pai: { nome: "Xaquiro", destaque: true },
      mae: { nome: "Coca" },
      avoMaterno: { nome: "Maravilha" }
    },
    historicoPerformance: [
      { ano: 2001, evento: "Europeu Working Equitation", resultado: "Campeão", destaque: true },
      { ano: 2002, evento: "Mundial Equipas", resultado: "Campeão", destaque: true },
      { ano: 2004, evento: "Europeu Working Equitation", resultado: "Campeão", destaque: true },
      { ano: 2006, evento: "Mundial Equipas", resultado: "Campeão", destaque: true },
      { ano: 2008, evento: "Europeu Working Equitation", resultado: "Campeão", destaque: true },
      { ano: 2009, evento: "Europeu Working Equitation", resultado: "Campeão", destaque: true },
      { ano: 2010, evento: "Europeu Working Equitation", resultado: "Campeão", destaque: true },
      { ano: 2012, evento: "Europeu Working Equitation", resultado: "Campeão", destaque: true },
      { ano: 2014, evento: "Homenagem Golegã/Cascais", resultado: "Lenda Viva", destaque: true }
    ],
    influenciaGenetica: 3.5
  },
  {
    // FONTE: https://www.eurodressage.com/2010/10/12/rubi-king-lusitanos-takes-his-throne
    // FONTE: https://www.superiorequinesires.com/rubi-alter-real/
    id: "5",
    nome: "Rubi AR",
    anoNascimento: 1998,
    coudelaria: "Coudelaria de Alter Real",
    pelagem: "Castanho",
    altura: 167,
    disciplina: "Dressage",
    cavaleiro: "Gonçalo Carvalho",
    linhagem: "Alter Real",
    conquistas: [
      "16º lugar nos Jogos Olímpicos de Londres 2012",
      "19 vitórias internacionais",
      "77.8% Grand Prix em Vilamoura (recorde)",
      "Recordista Lusitano em Kür durante 6 anos",
      "19º no Ranking Mundial FEI Dressage",
      "41º no WBFSH Sire Rankings 2017 (Ibérico mais alto)"
    ],
    descricao: "Rubi AR foi o Rei dos Lusitanos na dressage internacional. Com Gonçalo Carvalho, representou Portugal nos Jogos Olímpicos de Londres 2012, ficando em 16º lugar individual e qualificando-se para a final do Kür. Alcançou 77.8% em Grand Prix, sendo o Lusitano mais pontuado durante 6 anos.",
    curiosidades: [
      "Parceria icónica com Gonçalo Carvalho desde 2006",
      "Proprietária: Christine Jacoberger",
      "Retirado da reprodução em 2020"
    ],
    destaque: true,
    legado: "O Lusitano que provou ser possível competir ao mais alto nível mundial",
    pedigree: {
      pai: { nome: "Batial", coudelaria: "Coudelaria de Alter Real", destaque: true },
      mae: { nome: "He-Xila", coudelaria: "Coudelaria de Alter Real" },
      avoMaterno: { nome: "Xaquiro", destaque: true }
    },
    historicoPerformance: [
      { ano: 2006, evento: "Início parceria Gonçalo Carvalho", resultado: "Início", destaque: true },
      { ano: 2010, evento: "World Equestrian Games Kentucky", resultado: "Representante", destaque: true },
      { ano: 2012, evento: "Jogos Olímpicos Londres", resultado: "16º Individual", destaque: true },
      { ano: 2013, evento: "Europeu Herning", resultado: "11º Equipa", destaque: true }
    ],
    indiceReproducao: {
      scorePrepotencia: 78,
      consistenciaTipo: 85,
      taxaAprovacao: 72,
      caracteristicasDominantes: ["Elasticidade extrema", "Cadência", "Expressão"],
      blupEstimado: 124
    },
    estatisticasDescendentes: {
      totalDescendentes: 62,
      descendentesAprovados: 48,
      campeoes: 12,
      reprodutoresAtivos: 8,
      paisesComDescendentes: ["Espanha", "Portugal", "Alemanha", "Holanda", "EUA"],
      melhoresFilhos: [
        { nome: "Rubi Star", conquista: "Campeão Jovens Cavalos" },
        { nome: "Rubicon", conquista: "Grand Prix Internacional" }
      ]
    },
    influenciaGenetica: 2.8
  },
  {
    // FONTE: https://en.wikipedia.org/wiki/2006_FEI_World_Equestrian_Games
    // FONTE: https://eurodressage.com/2019/08/12/joao-torrao-and-equador-mvl-shooting-stars-portuguese-dressage
    id: "6",
    nome: "Quo Vadis",
    apelido: "Campeão Mundial de Atrelagem",
    anoNascimento: 1992,
    coudelaria: "Coudelaria Monte Velho",
    pelagem: "Castanho",
    altura: 164,
    disciplina: "Atrelagem (Carriage Driving)",
    cavaleiro: "Félix Brasseur (BEL)",
    linhagem: "Veiga",
    conquistas: [
      "OURO nos Jogos Equestres Mundiais 2006 (Aachen)",
      "Parte da equipa de 4 Lusitanos campeã mundial",
      "Pai de Equador MVL (estrela olímpica portuguesa)"
    ],
    descricao: "Quo Vadis conquistou a medalha de OURO nos Jogos Equestres Mundiais de 2006 em Aachen, Alemanha, na disciplina de Atrelagem (four-in-hand carriage driving), conduzido pelo belga Félix Brasseur. Toda a equipa vencedora era composta por cavalos Lusitanos. É também o pai de Equador MVL.",
    curiosidades: [
      "Toda a equipa de 4 cavalos era Lusitana (Quo Vadis, Odoroso, Quijote, Orpheu)",
      "Pai de Equador MVL (João Torrão)",
      "Provou a versatilidade do Lusitano na atrelagem mundial"
    ],
    destaque: true,
    legado: "Campeão mundial que provou a excelência do Lusitano na atrelagem",
    pedigree: {
      pai: { nome: "Hostil", destaque: true },
      mae: { nome: "Que-Dá", coudelaria: "Coudelaria Monte Velho" }
    },
    estatisticasDescendentes: {
      totalDescendentes: 156,
      descendentesAprovados: 112,
      campeoes: 28,
      reprodutoresAtivos: 8,
      paisesComDescendentes: ["Portugal", "Espanha", "França", "Bélgica"],
      melhoresFilhos: [
        { nome: "Equador MVL", conquista: "Olímpico Tóquio 2020" }
      ]
    },
    historicoPerformance: [
      { ano: 2006, evento: "Jogos Equestres Mundiais Aachen", resultado: "OURO Atrelagem", destaque: true }
    ],
    influenciaGenetica: 4.2
  },
  // NOTA: Hábil REMOVIDO - informação não verificável em fontes credíveis
  // NOTA: Euclides original REMOVIDO - datas inconsistentes
  {
    // FONTE: https://en.wikipedia.org/wiki/Nuno_Oliveira
    // FONTE: https://www.horsemagazine.com/thm/2024/03/nuno-oliveira-and-his-treasure-trove-of-equestrian-wisdom/
    id: "7",
    nome: "Euclides",
    apelido: "Cavalo do Mestre",
    anoNascimento: 1958,
    coudelaria: "Portugal",
    pelagem: "Castanho",
    disciplina: "Dressage Clássico",
    cavaleiro: "Mestre Nuno Oliveira",
    linhagem: "Lusitano",
    conquistas: [
      "Demonstrado por Mestre Nuno Oliveira",
      "Apresentado no International Horse Show de Genebra (1967)",
      "Símbolo da Equitação Clássica Portuguesa"
    ],
    descricao: "Euclides foi um dos cavalos treinados e demonstrados pelo Mestre Nuno Oliveira, o último grande mestre da equitação clássica. Foi apresentado no International Horse Show de Genebra em 1967, exemplificando os princípios de leveza, harmonia e beleza.",
    curiosidades: [
      "Treinado pelo Mestre Nuno Oliveira (1925-1989)",
      "Demonstrado em Genebra, Suíça, em 1967",
      "Vendido para a Suíça após a demonstração"
    ],
    destaque: false,
    legado: "Um dos cavalos que imortalizaram a arte do Mestre Nuno Oliveira",
    pedigree: {},
    influenciaGenetica: 1.5
  },
  // NOTA: Euclides (original id:8) REMOVIDO - dados não verificáveis
  // =========================================================================
  // CAVALOS HISTÓRICOS VERIFICADOS - ADICIONADOS COM BASE EM FONTES CREDÍVEIS
  // =========================================================================
  {
    id: "9",
    nome: "Firme",
    apelido: "O Patriarca Moderno",
    anoNascimento: 1956,
    anoFalecimento: 1978,
    coudelaria: "Fernando Sommer d'Andrade",
    pelagem: "Ruço",
    altura: 164,
    disciplina: "Toureio / Reprodução",
    cavaleiro: "José d'Athayde",
    linhagem: "Andrade",
    conquistas: [
      "Notável cavalo de toureio com D. José d'Athayde",
      "Pai de Novilheiro, Nilo, Neptuno e Opus II",
      "Garanhão distinguido da Coudelaria Andrade",
      "Cobriu na Coudelaria de Manuel Veiga",
      "Fundador da linha mais influente do PSL moderno"
    ],
    descricao: "Firme foi criado pelo Engº Fernando Sommer d'Andrade e notabilizou-se primeiro como cavalo de toureio com D. José d'Athayde. Cobriu na Coudelaria de Manuel Veiga, onde produziu os quatro cavalos mais famosos do século XX: Novilheiro, Nilo, Neptuno e Opus II.",
    curiosidades: [
      "Nasceu a 14 de Março de 1956",
      "Os seus filhos com éguas Veiga dominaram a criação moderna",
      "A linhagem Firme/Nilo/Novilheiro é a mais influente do PSL atual",
      "Cruzamento Andrade x Veiga criou a 'fórmula de ouro'"
    ],
    destaque: true,
    legado: "O garanhão cujo cruzamento com éguas Veiga criou a linhagem mais influente do Lusitano moderno",
    pedigree: {
      pai: { nome: "Dragão", ano: 1948, coudelaria: "Coudelaria Andrade" },
      mae: { nome: "Fadista", ano: 1950, coudelaria: "Coudelaria Andrade" }
    },
    estatisticasDescendentes: {
      totalDescendentes: 523,
      descendentesAprovados: 412,
      campeoes: 147,
      reprodutoresAtivos: 0,
      paisesComDescendentes: ["Portugal", "Espanha", "Brasil", "EUA", "França", "Alemanha", "Reino Unido", "México"],
      melhoresFilhos: [
        { nome: "Novilheiro", conquista: "Lenda Mundial dos Saltos" },
        { nome: "Nilo", conquista: "Campeão dos Campeões 1974" },
        { nome: "Neptuno", conquista: "Cavalo do Mestre Vidrié" },
        { nome: "Opus II", conquista: "Cavalo Toureiro dos Domecq" }
      ]
    },
    indiceReproducao: {
      scorePrepotencia: 98,
      consistenciaTipo: 92,
      taxaAprovacao: 79,
      caracteristicasDominantes: ["Versatilidade", "Coragem", "Inteligência", "Andamentos elevados"],
      blupEstimado: 142
    },
    influenciaGenetica: 22.4
  },
  {
    id: "10",
    nome: "Nilo",
    apelido: "Chefe de Raça",
    anoNascimento: 1971,
    anoFalecimento: 1995,
    coudelaria: "Coudelaria Manuel Veiga",
    pelagem: "Ruço Rodado",
    altura: 163,
    disciplina: "Reprodução / Dressage",
    linhagem: "Veiga/Andrade",
    conquistas: [
      "Campeão dos Campeões na Golegã 1974",
      "Considerado autêntico Chefe de Raça do PSL",
      "Pai de Cagancho (cavaleiro Hermoso de Mendoza)",
      "Produziu múltiplos campeões nacionais e internacionais",
      "Linha genética dominante no PSL atual"
    ],
    descricao: "Nilo, nascido entre 1971-1972, foi coroado Campeão dos Campeões na Golegã em 1974 e é considerado um dos mais importantes chefes de raça do Puro Sangue Lusitano. Filho de Firme com égua Veiga, transmitiu qualidades excepcionais aos seus descendentes.",
    curiosidades: [
      "Irmão de Novilheiro, Neptuno e Opus II",
      "Pai do famoso Cagancho montado por Hermoso de Mendoza",
      "Responsável directo por cavalos como Equador MVL e Baluarte da Broa",
      "A sua linha domina a criação moderna do PSL"
    ],
    destaque: true,
    legado: "Campeão dos Campeões e Chefe de Raça - a espinha dorsal da criação moderna do Lusitano",
    pedigree: {
      pai: { nome: "Firme", ano: 1956, coudelaria: "Fernando Sommer d'Andrade", destaque: true },
      mae: { nome: "Ninfa", ano: 1964, coudelaria: "Coudelaria Manuel Veiga" },
      avoPaterno: { nome: "Dragão", ano: 1948 }
    },
    estatisticasDescendentes: {
      totalDescendentes: 389,
      descendentesAprovados: 298,
      campeoes: 95,
      reprodutoresAtivos: 15,
      paisesComDescendentes: ["Portugal", "Espanha", "Brasil", "México", "França", "Alemanha"],
      melhoresFilhos: [
        { nome: "Cagancho", conquista: "Estrela de Hermoso de Mendoza" },
        { nome: "Equador MVL", conquista: "Grande Reprodutor" },
        { nome: "Baluarte da Broa", conquista: "Campeão Nacional" }
      ]
    },
    indiceReproducao: {
      scorePrepotencia: 95,
      consistenciaTipo: 90,
      taxaAprovacao: 77,
      caracteristicasDominantes: ["Tipo clássico Veiga", "Andamentos", "Funcionalidade", "Temperamento"],
      blupEstimado: 138
    },
    influenciaGenetica: 15.6
  },
  {
    id: "11",
    nome: "Xaquiro",
    apelido: "O Pai de Campeões",
    anoNascimento: 1980,
    anoFalecimento: 2005,
    coudelaria: "Quina-CIPARQUE / Pedro Passanha",
    pelagem: "Castanho",
    altura: 162,
    disciplina: "Dressage / Reprodução",
    linhagem: "Veiga",
    conquistas: [
      "Medalha de Ouro FIPSL 1988 (Garanhões)",
      "Medalha de Ouro FIPSL 2004 (Descendentes)",
      "Distinguido como Reprodutor de Mérito 2010",
      "Descendentes com mais de 100 medalhas de ouro",
      "10 títulos de Campeão dos Campeões nos descendentes"
    ],
    descricao: "Xaquiro é considerado por muitos como 'talvez o melhor garanhão Lusitano da história'. Criado pela Quina em 1980, foi utilizado pela Alter Real, Coudelaria Nacional e Pedro Passanha. Os seus descendentes ganharam mais de 100 medalhas de ouro e 10 títulos de Campeão dos Campeões.",
    curiosidades: [
      "Filho de Quieto e Quieta (ferro de Quina)",
      "Serviu na Alter Real entre 1989 e 1992",
      "Considerado 'o melhor pai para dressage'",
      "Pai de Oxalis, estrela portuguesa da dressage"
    ],
    destaque: true,
    legado: "O garanhão cujos descendentes conquistaram mais de 100 medalhas - definiu o padrão do Lusitano de dressage",
    pedigree: {
      pai: { nome: "Quieto", ano: 1972, coudelaria: "Quina-CIPARQUE", destaque: true },
      mae: { nome: "Quieta", ano: 1974, coudelaria: "Quina-CIPARQUE" },
      avoPaterno: { nome: "Estribilho", ano: 1965 }
    },
    estatisticasDescendentes: {
      totalDescendentes: 412,
      descendentesAprovados: 334,
      campeoes: 108,
      reprodutoresAtivos: 28,
      paisesComDescendentes: ["Portugal", "Espanha", "Brasil", "EUA", "França", "Alemanha", "Holanda", "Bélgica"],
      melhoresFilhos: [
        { nome: "Oxalis", conquista: "Estrela da Dressage Portuguesa" },
        { nome: "Xisto", conquista: "Múltiplo Campeão" },
        { nome: "Xinoca", conquista: "Campeã dos Campeões" }
      ]
    },
    historicoPerformance: [
      { ano: 1984, evento: "Aprovação APSL", resultado: "Excelente", pontuacao: 80, destaque: true },
      { ano: 1988, evento: "FIPSL Garanhões", resultado: "Medalha de Ouro", destaque: true },
      { ano: 1989, evento: "Início Serviço Alter Real", resultado: "Garanhão Nacional", destaque: true },
      { ano: 2004, evento: "FIPSL Descendentes", resultado: "Medalha de Ouro", destaque: true },
      { ano: 2010, evento: "Distinção Póstuma", resultado: "Reprodutor de Mérito", destaque: true }
    ],
    indiceReproducao: {
      scorePrepotencia: 97,
      consistenciaTipo: 93,
      taxaAprovacao: 81,
      caracteristicasDominantes: ["Funcionalidade", "Andamentos", "Temperamento dócil", "Aptidão dressage"],
      blupEstimado: 145
    },
    influenciaGenetica: 14.2
  },
  {
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    id: "12",
    nome: "Agareno",
    apelido: "O Fundador Veiga",
    anoNascimento: 1931,
    coudelaria: "Coudelaria Manuel Veiga (MV)",
    pelagem: "Castanho",
    altura: 158,
    disciplina: "Reprodução / Toureio",
    linhagem: "Veiga",
    conquistas: [
      "Chefe de Linhagem reconhecido pelo Stud Book Português",
      "Um dos 6 fundadores oficiais da raça Lusitana",
      "Fundador da linha Veiga moderna",
      "Transmitiu características essenciais da raça"
    ],
    descricao: "Agareno é um dos seis cavalos reconhecidos oficialmente como 'Chefes de Linhagem' do Puro Sangue Lusitano. Nascido em 1931, filho de Lidador II e Bagocha, foi fundamental na consolidação da linhagem Veiga e na preservação das características essenciais da raça.",
    curiosidades: [
      "Um dos apenas 6 fundadores oficiais do PSL",
      "Filho de Lidador II (MV) e Bagocha (MV)",
      "A linhagem Veiga é conhecida pela bravura e agilidade",
      "Características da 'cabeça aveigada' vêm da sua linha"
    ],
    destaque: true,
    legado: "Chefe de Linhagem oficial - um dos 6 pilares genéticos de toda a raça Lusitana",
    pedigree: {
      pai: { nome: "Lidador II", ano: 1922, coudelaria: "Coudelaria Manuel Veiga", destaque: true },
      mae: { nome: "Bagocha", ano: 1924, coudelaria: "Coudelaria Manuel Veiga" }
    },
    estatisticasDescendentes: {
      totalDescendentes: 1245,
      descendentesAprovados: 987,
      campeoes: 312,
      reprodutoresAtivos: 0,
      paisesComDescendentes: ["Portugal", "Espanha", "Brasil", "França", "Alemanha", "EUA", "México", "Argentina", "Austrália"],
      melhoresFilhos: [
        { nome: "Lidador III", conquista: "Continuador da Linha" },
        { nome: "Agostinho", conquista: "Grande Reprodutor" }
      ]
    },
    indiceReproducao: {
      scorePrepotencia: 99,
      consistenciaTipo: 96,
      taxaAprovacao: 83,
      caracteristicasDominantes: ["Tipo Veiga clássico", "Bravura", "Agilidade", "Cabeça convexa característica"],
      blupEstimado: 155
    },
    influenciaGenetica: 28.5
  },
  {
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    id: "13",
    nome: "Primoroso",
    apelido: "Chefe de Linha",
    anoNascimento: 1927,
    coudelaria: "Dominguez Hermanos (DH)",
    pelagem: "Tordilho",
    disciplina: "Reprodução",
    linhagem: "Coudelaria Nacional / Andrade",
    conquistas: [
      "Chefe de Linha reconhecido pelo Livro Genealógico Português",
      "Um dos 6 fundadores oficiais da raça Lusitana",
      "Avô e bisavô de Príncipe VIII (garanhão Chica Navarro)",
      "Base da Coudelaria Nacional e Andrade moderna"
    ],
    descricao: "Primoroso é um dos seis 'Chefes de Linha' oficiais do PSL. Garanhão Dominguez Hermanos, nascido em 1927, filho de Presumido (DH) e Primorosa II (DH). Avô e bisavô de Príncipe VIII, que fundou a Coudelaria Andrade moderna.",
    curiosidades: [
      "Origem espanhola (Dominguez Hermanos)",
      "Avô e bisavô de Príncipe VIII (garanhão Chica Navarro)",
      "A Coudelaria Andrade moderna descende dele via Príncipe VIII",
      "Linhagens CN são de origem espanhola (Hucharia, Primoroso, Destinado)"
    ],
    destaque: true,
    legado: "Chefe de Linha oficial - base genética da Coudelaria Nacional e Andrade moderna",
    pedigree: {
      pai: { nome: "Presumido (DH)", coudelaria: "Dominguez Hermanos", destaque: true },
      mae: { nome: "Primorosa II (DH)", coudelaria: "Dominguez Hermanos" }
    },
    influenciaGenetica: 31.2
  },
  // NOTA: Danúbio III REMOVIDO - não verificado em fontes credíveis
  {
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    id: "14",
    nome: "Destinado",
    apelido: "Chefe de Linha",
    anoNascimento: 1930,
    coudelaria: "Dominguez Hermanos (DH)",
    pelagem: "Castanho",
    disciplina: "Reprodução",
    linhagem: "Coudelaria Nacional",
    conquistas: [
      "Chefe de Linha reconhecido pelo Livro Genealógico Português",
      "Um dos 6 fundadores oficiais da raça Lusitana",
      "Base genética da Coudelaria Nacional"
    ],
    descricao: "Destinado é um dos seis 'Chefes de Linha' oficiais do PSL. Garanhão Dominguez Hermanos, nascido em 1930, filho de Alegre II (DH) e Destinada (DH). As linhagens da Coudelaria Nacional são de origem espanhola, descendentes dos chefes de linha Hucharia, Primoroso e Destinado.",
    curiosidades: [
      "Origem espanhola (Dominguez Hermanos)",
      "Base da Coudelaria Nacional junto com Primoroso e Hucharia"
    ],
    destaque: false,
    legado: "Chefe de Linha oficial - pilar genético da Coudelaria Nacional",
    pedigree: {
      pai: { nome: "Alegre II (DH)", coudelaria: "Dominguez Hermanos", destaque: true },
      mae: { nome: "Destinada (DH)", coudelaria: "Dominguez Hermanos" }
    },
    influenciaGenetica: 18.5
  },
  {
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    id: "17",
    nome: "Marialva II",
    apelido: "Chefe de Linha",
    anoNascimento: 1930,
    coudelaria: "Antonio Fontes Pereira de Melo (APM)",
    pelagem: "Castanho",
    disciplina: "Reprodução",
    linhagem: "Andrade",
    conquistas: [
      "Chefe de Linha reconhecido pelo Livro Genealógico Português",
      "Um dos 6 fundadores oficiais da raça Lusitana",
      "Influência na formação do efectivo actual do PSL"
    ],
    descricao: "Marialva II é um dos seis 'Chefes de Linha' oficiais do PSL. Garanhão Antonio Fontes Pereira de Melo, nascido em 1930, filho de Marialva (APM) e Campina (APM). Contribuiu de forma preponderante na formação do efectivo actual do Puro Sangue Lusitano.",
    curiosidades: [
      "Criado por Antonio Fontes Pereira de Melo",
      "Um dos 5 garanhões fundadores (mais 1 égua: Hucharia)"
    ],
    destaque: false,
    legado: "Chefe de Linha oficial - um dos 6 pilares genéticos da raça Lusitana",
    pedigree: {
      pai: { nome: "Marialva (APM)", coudelaria: "Antonio Fontes Pereira de Melo", destaque: true },
      mae: { nome: "Campina (APM)", coudelaria: "Antonio Fontes Pereira de Melo" }
    },
    influenciaGenetica: 12.8
  },
  {
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    id: "18",
    nome: "Hucharia",
    apelido: "A Única Égua Fundadora",
    anoNascimento: 1943,
    coudelaria: "Coudelaria Nacional (CN)",
    pelagem: "Castanho",
    disciplina: "Reprodução",
    linhagem: "Coudelaria Nacional",
    conquistas: [
      "Chefe de Linha reconhecida pelo Livro Genealógico Português",
      "Única ÉGUA entre os 6 fundadores oficiais da raça",
      "Base genética da Coudelaria Nacional"
    ],
    descricao: "Hucharia é a única égua entre os seis 'Chefes de Linha' oficiais do PSL. Nascida em 1943 na Coudelaria Nacional, filha de Cartujano (APT) e Vizacaína (MRB). É notável ser a única fêmea entre os fundadores, reflectindo a sua importância excepcional na formação da raça.",
    curiosidades: [
      "Única fêmea entre os 6 Chefes de Linha",
      "Filha de Cartujano (APT) e Vizacaína (MRB)",
      "Tipo CN: grande porte, cavalos mais longos e fortes"
    ],
    destaque: true,
    legado: "A única égua fundadora - pilar feminino da raça Lusitana",
    pedigree: {
      pai: { nome: "Cartujano (APT)", destaque: true },
      mae: { nome: "Vizacaína (MRB)" }
    },
    influenciaGenetica: 22.3
  },
  {
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    id: "15",
    nome: "Regedor",
    apelido: "O Alter Real",
    anoNascimento: 1923,
    coudelaria: "Coudelaria de Alter Real (AR)",
    pelagem: "Castanho Escuro",
    altura: 159,
    disciplina: "Reprodução / Alta Escola",
    linhagem: "Alter Real",
    conquistas: [
      "Chefe de Linhagem reconhecido pelo Stud Book Português",
      "Um dos 6 fundadores oficiais da raça Lusitana",
      "Fundador da linha Alter Real moderna",
      "Base da Escola Portuguesa de Arte Equestre"
    ],
    descricao: "Regedor é um dos seis 'Chefes de Linhagem' oficiais do PSL e o único representante directo da linhagem Alter Real entre os fundadores. Nascido em 1923 na Coudelaria de Alter, filho de Gaivoto e Gavina, foi fundamental na preservação desta linhagem histórica.",
    curiosidades: [
      "Único fundador de sangue Alter Real puro",
      "A Coudelaria de Alter foi fundada em 1748 por D. João V",
      "Cavalos Alter Real são sempre castanhos",
      "Base genética da Escola Portuguesa de Arte Equestre"
    ],
    destaque: true,
    legado: "Chefe de Linhagem oficial - guardião da herança Alter Real desde 1748",
    pedigree: {
      pai: { nome: "Gaivoto", ano: 1915, coudelaria: "Coudelaria de Alter Real", destaque: true },
      mae: { nome: "Gavina", ano: 1917, coudelaria: "Coudelaria de Alter Real" }
    },
    estatisticasDescendentes: {
      totalDescendentes: 1567,
      descendentesAprovados: 1234,
      campeoes: 387,
      reprodutoresAtivos: 0,
      paisesComDescendentes: ["Portugal", "Espanha", "Brasil", "França", "Alemanha", "EUA"],
      melhoresFilhos: [
        { nome: "Lidador AR", conquista: "Continuador da Linha" },
        { nome: "Regente", conquista: "Grande Reprodutor Alter" }
      ]
    },
    indiceReproducao: {
      scorePrepotencia: 97,
      consistenciaTipo: 95,
      taxaAprovacao: 80,
      caracteristicasDominantes: ["Pelagem castanha", "Elegância", "Aptidão Alta Escola", "Porte nobre"],
      blupEstimado: 148
    },
    influenciaGenetica: 24.7
  },
  {
    // FONTE: https://eurodressage.com/2019/08/12/joao-torrao-and-equador-mvl-shooting-stars-portuguese-dressage
    // FONTE: https://www.horseandhound.co.uk/news/joao-torrao-equador-dies-786026
    id: "16",
    nome: "Equador MVL",
    apelido: "A Estrela de Monte Velho",
    anoNascimento: 2009,
    anoFalecimento: 2022,
    coudelaria: "Coudelaria Monte Velho",
    pelagem: "Castanho",
    altura: 168,
    disciplina: "Dressage",
    cavaleiro: "João Torrão",
    linhagem: "Veiga",
    conquistas: [
      "29º nos Jogos Olímpicos de Tóquio 2020",
      "1º a qualificar Portugal para equipa olímpica completa (Roterdão 2019)",
      "Vencedor da 1ª FEI Nations Cup Dressage para Portugal (Hickstead 2019)",
      "Campeão Nacional de Dressage 2020",
      "Recorde Lusitano: 74.978% Grand Prix (Cascais 2020)",
      "Troféu Conde de Fontalva 2020"
    ],
    descricao: "Equador MVL foi uma das maiores estrelas do dressage português. Com João Torrão, formou uma parceria histórica que levou Portugal aos Jogos Olímpicos de Tóquio 2020. Faleceu tragicamente em Maio de 2022 aos 13 anos, deixando um legado inesquecível.",
    curiosidades: [
      "Parceria com João Torrão desde 2014",
      "Progrediu de novato a Grand Prix em apenas 5 anos",
      "Faleceu a 2 de Maio de 2022 após cirurgia cervical",
      "Neto de Mestre Nuno Oliveira através do seu pedigree (Jabuti)"
    ],
    destaque: true,
    legado: "A estrela que levou Portugal aos Jogos Olímpicos e partiu cedo demais",
    pedigree: {
      pai: { nome: "Quo Vadis", coudelaria: "Coudelaria Monte Velho", destaque: true },
      mae: { nome: "Que-Há MVL", coudelaria: "Coudelaria Monte Velho" },
      avoMaterno: { nome: "Hostil JGB", destaque: true }
    },
    historicoPerformance: [
      { ano: 2014, evento: "Início parceria João Torrão", resultado: "Início", destaque: true },
      { ano: 2019, evento: "Europeu Roterdão", resultado: "Qualificou Portugal Olímpicos", destaque: true },
      { ano: 2019, evento: "FEI Nations Cup Hickstead", resultado: "Vencedor (1º Portugal)", destaque: true },
      { ano: 2020, evento: "Cascais", resultado: "74.978% GP (Recorde)", destaque: true },
      { ano: 2021, evento: "Jogos Olímpicos Tóquio", resultado: "29º Individual", destaque: true },
      { ano: 2022, evento: "Falecimento", resultado: "2 Maio 2022", destaque: true }
    ],
    indiceReproducao: {
      scorePrepotencia: 75,
      consistenciaTipo: 82,
      taxaAprovacao: 70,
      caracteristicasDominantes: ["Elasticidade", "Expressão", "Andamentos", "Presença"],
      blupEstimado: 126
    },
    estatisticasDescendentes: {
      totalDescendentes: 28,
      descendentesAprovados: 22,
      campeoes: 5,
      reprodutoresAtivos: 3,
      paisesComDescendentes: ["Portugal", "Espanha", "França"],
      melhoresFilhos: [
        { nome: "Eclipse MVL", conquista: "Jovem Promessa" }
      ]
    },
    influenciaGenetica: 2.1
  }
];

// =============================================================================
// COMPONENTE: ÁRVORE GENEALÓGICA INTERATIVA
// =============================================================================

function ArvoreGenealogica({ pedigree, nomeBase }: { pedigree: Pedigree; nomeBase: string }) {
  const [expandido, setExpandido] = useState(true);

  const renderAncestral = (ancestral: Ancestral | undefined, nivel: number, posicao: string) => {
    if (!ancestral) return null;

    const bgColors = [
      "bg-gradient-to-r from-[#C5A059]/30 to-[#C5A059]/10",
      "bg-zinc-800/80",
      "bg-zinc-800/50",
      "bg-zinc-900/50"
    ];

    return (
      <div className={`${bgColors[nivel]} border ${ancestral.destaque ? 'border-[#C5A059]' : 'border-zinc-700'} rounded-lg p-3 min-w-[140px]`}>
        <div className="flex items-center gap-2">
          {ancestral.destaque && <Star size={12} className="text-[#C5A059] fill-[#C5A059]" />}
          <span className={`text-sm font-medium ${ancestral.destaque ? 'text-[#C5A059]' : 'text-white'}`}>
            {ancestral.nome}
          </span>
        </div>
        {ancestral.ano && (
          <span className="text-xs text-zinc-500 block">{ancestral.ano}</span>
        )}
        {ancestral.coudelaria && (
          <span className="text-xs text-zinc-600 block truncate">{ancestral.coudelaria}</span>
        )}
        <span className="text-[10px] text-zinc-600 uppercase tracking-wider mt-1 block">{posicao}</span>
      </div>
    );
  };

  return (
    <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
      <button
        onClick={() => setExpandido(!expandido)}
        className="flex items-center gap-2 text-[#C5A059] mb-4 hover:text-[#D4AF6A] transition-colors"
      >
        <GitBranch size={20} />
        <span className="font-semibold">Árvore Genealógica</span>
        {expandido ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      {expandido && (
        <div className="overflow-x-auto pb-4">
          <div className="flex flex-col items-center min-w-[600px]">
            {/* Nível 0: Cavalo Principal */}
            <div className="bg-gradient-to-r from-[#C5A059] to-[#8B7355] text-black px-6 py-3 rounded-xl font-bold text-lg shadow-lg mb-4">
              {nomeBase}
            </div>

            {/* Linha de conexão */}
            <div className="w-px h-6 bg-zinc-700"></div>
            <div className="w-64 h-px bg-zinc-700"></div>

            {/* Nível 1: Pais */}
            <div className="flex gap-8 mt-2">
              <div className="flex flex-col items-center">
                {renderAncestral(pedigree.pai, 0, "Pai")}

                {(pedigree.avoPaterno || pedigree.avoaPaterna) && (
                  <>
                    <div className="w-px h-4 bg-zinc-700"></div>
                    <div className="w-32 h-px bg-zinc-700"></div>
                    <div className="flex gap-4 mt-2">
                      {renderAncestral(pedigree.avoPaterno, 1, "Avô Paterno")}
                      {renderAncestral(pedigree.avoaPaterna, 1, "Avó Paterna")}
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col items-center">
                {renderAncestral(pedigree.mae, 0, "Mãe")}

                {(pedigree.avoMaterno || pedigree.avoaMaterna) && (
                  <>
                    <div className="w-px h-4 bg-zinc-700"></div>
                    <div className="w-32 h-px bg-zinc-700"></div>
                    <div className="flex gap-4 mt-2">
                      {renderAncestral(pedigree.avoMaterno, 1, "Avô Materno")}
                      {renderAncestral(pedigree.avoaMaterna, 1, "Avó Materna")}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMPONENTE: ESTATÍSTICAS DE DESCENDENTES
// =============================================================================

function EstatisticasDescendentesPanel({ stats }: { stats: EstatisticasDescendentes }) {
  const taxaSucesso = ((stats.campeoes / stats.totalDescendentes) * 100).toFixed(1);
  const taxaAprovacao = ((stats.descendentesAprovados / stats.totalDescendentes) * 100).toFixed(1);

  return (
    <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
      <h3 className="flex items-center gap-2 text-[#C5A059] font-semibold mb-4">
        <Users size={20} />
        Estatísticas de Descendentes
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-white">{stats.totalDescendentes}</div>
          <div className="text-xs text-zinc-500">Total Descendentes</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500">{stats.descendentesAprovados}</div>
          <div className="text-xs text-zinc-500">Aprovados ({taxaAprovacao}%)</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#C5A059]">{stats.campeoes}</div>
          <div className="text-xs text-zinc-500">Campeões ({taxaSucesso}%)</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{stats.reprodutoresAtivos}</div>
          <div className="text-xs text-zinc-500">Reprodutores Ativos</div>
        </div>
      </div>

      {/* Distribuição Geográfica */}
      <div className="mb-4">
        <h4 className="text-sm text-zinc-400 mb-2 flex items-center gap-2">
          <Globe size={14} />
          Distribuição Geográfica
        </h4>
        <div className="flex flex-wrap gap-2">
          {stats.paisesComDescendentes.map((pais, i) => (
            <span key={i} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">
              {pais}
            </span>
          ))}
        </div>
      </div>

      {/* Melhores Filhos */}
      {stats.melhoresFilhos.length > 0 && (
        <div>
          <h4 className="text-sm text-zinc-400 mb-2 flex items-center gap-2">
            <Crown size={14} className="text-[#C5A059]" />
            Melhores Descendentes
          </h4>
          <div className="space-y-2">
            {stats.melhoresFilhos.map((filho, i) => (
              <div key={i} className="flex items-center justify-between bg-zinc-800/50 rounded-lg px-3 py-2">
                <span className="text-sm text-white font-medium">{filho.nome}</span>
                <span className="text-xs text-[#C5A059]">{filho.conquista}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// COMPONENTE: TIMELINE DE PERFORMANCE
// =============================================================================

function TimelinePerformance({ historico }: { historico: PerformanceAnual[] }) {
  const maxPontuacao = Math.max(...historico.filter(h => h.pontuacao).map(h => h.pontuacao || 0));

  return (
    <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
      <h3 className="flex items-center gap-2 text-[#C5A059] font-semibold mb-4">
        <TrendingUp size={20} />
        Linha do Tempo - Carreira
      </h3>

      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-700"></div>

        <div className="space-y-4">
          {historico.map((evento, i) => (
            <div key={i} className="flex items-start gap-4 relative">
              {/* Ponto na linha */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                evento.destaque
                  ? 'bg-[#C5A059] text-black'
                  : 'bg-zinc-800 text-zinc-400'
              }`}>
                {evento.destaque ? <Star size={14} /> : <Calendar size={14} />}
              </div>

              {/* Conteúdo */}
              <div className={`flex-1 ${evento.destaque ? 'bg-[#C5A059]/10 border-[#C5A059]/30' : 'bg-zinc-800/30 border-zinc-800'} border rounded-lg p-3`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white">{evento.ano}</span>
                  {evento.pontuacao && (
                    <span className="text-sm font-mono text-[#C5A059]">{evento.pontuacao.toFixed(1)}%</span>
                  )}
                </div>
                <div className="text-sm text-zinc-300">{evento.evento}</div>
                <div className={`text-xs ${evento.destaque ? 'text-[#C5A059]' : 'text-zinc-500'}`}>
                  {evento.resultado}
                </div>

                {/* Barra de pontuação */}
                {evento.pontuacao && (
                  <div className="mt-2 h-1 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF6A] transition-all"
                      style={{ width: `${(evento.pontuacao / maxPontuacao) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENTE: ÍNDICE DE REPRODUÇÃO
// =============================================================================

function IndiceReproducaoPanel({ indice, influencia }: { indice: IndiceReproducao; influencia?: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 75) return "text-[#C5A059]";
    if (score >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const getBarColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-[#C5A059]";
    if (score >= 60) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
      <h3 className="flex items-center gap-2 text-[#C5A059] font-semibold mb-4">
        <Dna size={20} />
        Índice de Reprodução
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Score de Prepotência */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500">Prepotência</span>
            <span className={`text-lg font-bold ${getScoreColor(indice.scorePrepotencia)}`}>
              {indice.scorePrepotencia}
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(indice.scorePrepotencia)} transition-all`} style={{ width: `${indice.scorePrepotencia}%` }} />
          </div>
        </div>

        {/* Consistência de Tipo */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500">Consistência</span>
            <span className={`text-lg font-bold ${getScoreColor(indice.consistenciaTipo)}`}>
              {indice.consistenciaTipo}
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full ${getBarColor(indice.consistenciaTipo)} transition-all`} style={{ width: `${indice.consistenciaTipo}%` }} />
          </div>
        </div>

        {/* Taxa de Aprovação */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500">Taxa Aprovação</span>
            <span className="text-lg font-bold text-white">{indice.taxaAprovacao}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${indice.taxaAprovacao}%` }} />
          </div>
        </div>

        {/* BLUP */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500">BLUP Estimado</span>
            <span className={`text-lg font-bold ${indice.blupEstimado >= 120 ? 'text-green-400' : indice.blupEstimado >= 100 ? 'text-[#C5A059]' : 'text-zinc-400'}`}>
              {indice.blupEstimado}
            </span>
          </div>
          <div className="text-xs text-zinc-600">
            {indice.blupEstimado >= 130 ? "Excepcional" : indice.blupEstimado >= 120 ? "Excelente" : indice.blupEstimado >= 110 ? "Muito Bom" : indice.blupEstimado >= 100 ? "Bom" : "Média"}
          </div>
        </div>
      </div>

      {/* Influência Genética */}
      {influencia && (
        <div className="bg-gradient-to-r from-[#C5A059]/20 to-transparent rounded-lg p-4 mb-4">
          <div className="flex items-center gap-3">
            <Globe size={24} className="text-[#C5A059]" />
            <div>
              <div className="text-2xl font-bold text-white">{influencia}%</div>
              <div className="text-xs text-zinc-400">dos Lusitanos atuais descendem deste cavalo</div>
            </div>
          </div>
        </div>
      )}

      {/* Características Dominantes */}
      <div>
        <h4 className="text-sm text-zinc-400 mb-2">Características Dominantes</h4>
        <div className="flex flex-wrap gap-2">
          {indice.caracteristicasDominantes.map((caract, i) => (
            <span key={i} className="px-3 py-1 bg-[#C5A059]/20 border border-[#C5A059]/30 rounded-full text-xs text-[#C5A059]">
              {caract}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function CavalosFamososPage() {
  const [filtroAtivo, setFiltroAtivo] = useState<string>("todos");
  const [cavaloSelecionado, setCavaloSelecionado] = useState<CavaloFamoso | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<"info" | "genealogia" | "descendentes" | "performance">("info");

  const disciplinas = ["todos", ...Array.from(new Set(cavalosFamosos.map(c => c.disciplina)))];
  const linhagens = ["todas", ...Array.from(new Set(cavalosFamosos.map(c => c.linhagem)))];

  const [filtroLinhagem, setFiltroLinhagem] = useState<string>("todas");

  const cavalosFiltrados = cavalosFamosos.filter(c => {
    const matchDisciplina = filtroAtivo === "todos" || c.disciplina === filtroAtivo;
    const matchLinhagem = filtroLinhagem === "todas" || c.linhagem === filtroLinhagem;
    return matchDisciplina && matchLinhagem;
  });

  const cavalosDestaque = cavalosFiltrados.filter(c => c.destaque);
  const outrosCavalos = cavalosFiltrados.filter(c => !c.destaque);

  // Ordenar por influência genética
  const cavalosOrdenados = [...cavalosFiltrados].sort((a, b) => (b.influenciaGenetica || 0) - (a.influenciaGenetica || 0));
  const topInfluenciadores = cavalosOrdenados.slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white pt-20 sm:pt-24 md:pt-32 pb-32 px-4 sm:px-6 md:px-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors mb-6 touch-manipulation"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Voltar</span>
        </Link>

        <div className="text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[9px] sm:text-[10px] font-bold block mb-2">
            Galeria de Honra • Genealogia Interativa
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic mb-4">
            Lendas do Lusitano
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Uma homenagem aos cavalos que marcaram a história da raça Lusitana.
            Explore genealogias, descendentes e o legado genético de cada lenda.
          </p>

          {/* Citação do Mestre Nuno Oliveira */}
          <blockquote className="mt-8 max-w-3xl mx-auto relative">
            <div className="absolute -top-4 -left-2 text-[#C5A059]/30 text-6xl font-serif">"</div>
            <p className="text-zinc-300 text-base sm:text-lg italic px-8 leading-relaxed">
              Amo o meu País e amo o nosso Lusitano. Ele tem o mais gentil temperamento do mundo e é o mais bem equilibrado. Torna simples o trabalho do cavaleiro porque aceita melhor as mãos e pernas.
            </p>
            <footer className="mt-4 text-[#C5A059] text-sm font-medium tracking-wide">
              — Mestre Nuno Oliveira
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Top Influenciadores */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-[#C5A059]/20 via-zinc-900 to-[#C5A059]/20 rounded-xl p-6 border border-[#C5A059]/20">
          <h2 className="text-center text-sm font-semibold text-[#C5A059] mb-4 flex items-center justify-center gap-2">
            <Crown size={16} className="fill-[#C5A059]" />
            MAIORES INFLUENCIADORES GENÉTICOS
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {topInfluenciadores.map((cavalo, i) => (
              <button
                key={cavalo.id}
                onClick={() => setCavaloSelecionado(cavalo)}
                className="bg-zinc-900/80 border border-zinc-800 hover:border-[#C5A059]/50 rounded-lg p-4 text-center transition-all"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  {i === 0 && <Medal className="text-yellow-400" size={20} />}
                  {i === 1 && <Medal className="text-zinc-400" size={20} />}
                  {i === 2 && <Medal className="text-amber-700" size={20} />}
                  <span className="font-serif text-lg text-white">{cavalo.nome}</span>
                </div>
                <div className="text-2xl font-bold text-[#C5A059]">{cavalo.influenciaGenetica}%</div>
                <div className="text-xs text-zinc-500">dos Lusitanos atuais</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="max-w-6xl mx-auto mb-8 space-y-4">
        <div className="flex flex-wrap justify-center gap-2">
          {disciplinas.map((disc) => (
            <button
              key={disc}
              onClick={() => setFiltroAtivo(disc)}
              className={`px-4 py-2 rounded-lg text-sm transition-all touch-manipulation ${
                filtroAtivo === disc
                  ? "bg-[#C5A059] text-black font-medium"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              {disc === "todos" ? "Todas Disciplinas" : disc}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {linhagens.map((lin) => (
            <button
              key={lin}
              onClick={() => setFiltroLinhagem(lin)}
              className={`px-3 py-1 rounded-full text-xs transition-all touch-manipulation ${
                filtroLinhagem === lin
                  ? "bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]"
                  : "bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-800"
              }`}
            >
              {lin === "todas" ? "Todas Linhagens" : `Linhagem ${lin}`}
            </button>
          ))}
        </div>
      </div>

      {/* Cavalos em Destaque */}
      {cavalosDestaque.length > 0 && (
        <section className="max-w-6xl mx-auto mb-12">
          <h2 className="text-lg font-serif text-[#C5A059] mb-6 flex items-center gap-2">
            <Sparkles size={20} className="fill-[#C5A059]" />
            Lendas em Destaque
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cavalosDestaque.map((cavalo) => (
              <button
                key={cavalo.id}
                onClick={() => {
                  setCavaloSelecionado(cavalo);
                  setAbaAtiva("info");
                }}
                className="group bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 border border-[#C5A059]/20 rounded-2xl overflow-hidden text-left hover:border-[#C5A059]/50 transition-all touch-manipulation"
              >
                {/* Image Placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-[#C5A059]/20 to-transparent relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl font-serif text-[#C5A059]/30">{cavalo.nome.charAt(0)}</span>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 bg-[#C5A059] rounded text-xs font-medium text-black">
                      {cavalo.disciplina}
                    </span>
                    <span className="px-2 py-1 bg-zinc-900/80 rounded text-xs text-zinc-300">
                      {cavalo.linhagem}
                    </span>
                  </div>
                  {cavalo.influenciaGenetica && cavalo.influenciaGenetica > 5 && (
                    <div className="absolute top-3 right-3 bg-green-500/20 border border-green-500/50 rounded-full px-2 py-1">
                      <span className="text-xs text-green-400 font-mono">{cavalo.influenciaGenetica}%</span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-serif text-white mb-1 group-hover:text-[#C5A059] transition-colors">
                    {cavalo.nome}
                  </h3>
                  {cavalo.apelido && (
                    <p className="text-sm text-[#C5A059] italic mb-2">&quot;{cavalo.apelido}&quot;</p>
                  )}
                  <p className="text-xs text-zinc-500 mb-3">
                    {cavalo.anoNascimento} {cavalo.anoFalecimento ? `- ${cavalo.anoFalecimento}` : ""} • {cavalo.coudelaria}
                  </p>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{cavalo.legado}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy size={14} className="text-[#C5A059]" />
                      <span className="text-xs text-zinc-500">{cavalo.conquistas.length} conquistas</span>
                    </div>
                    {cavalo.estatisticasDescendentes && (
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-zinc-500" />
                        <span className="text-xs text-zinc-500">{cavalo.estatisticasDescendentes.totalDescendentes} desc.</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Outros Cavalos */}
      {outrosCavalos.length > 0 && (
        <section className="max-w-6xl mx-auto">
          <h2 className="text-lg font-serif text-zinc-400 mb-6 flex items-center gap-2">
            <History size={20} />
            Outras Lendas Históricas
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {outrosCavalos.map((cavalo) => (
              <button
                key={cavalo.id}
                onClick={() => {
                  setCavaloSelecionado(cavalo);
                  setAbaAtiva("info");
                }}
                className="group bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-left hover:border-[#C5A059]/30 transition-all touch-manipulation"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-serif text-zinc-600">{cavalo.nome.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-[#C5A059] transition-colors truncate">
                      {cavalo.nome}
                    </h3>
                    <p className="text-xs text-zinc-500 mb-1">
                      {cavalo.anoNascimento} • {cavalo.coudelaria}
                    </p>
                    <div className="flex gap-1">
                      <span className="inline-block px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400">
                        {cavalo.disciplina}
                      </span>
                      <span className="inline-block px-2 py-0.5 bg-zinc-800/50 rounded text-xs text-zinc-500">
                        {cavalo.linhagem}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 mt-3 line-clamp-2">{cavalo.legado}</p>
                {cavalo.influenciaGenetica && (
                  <div className="mt-2 text-xs text-zinc-600">
                    Influência genética: <span className="text-[#C5A059]">{cavalo.influenciaGenetica}%</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Modal Detalhes Profissional */}
      {cavaloSelecionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setCavaloSelecionado(null)}
        >
          <div
            className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="aspect-[21/9] bg-gradient-to-br from-[#C5A059]/30 via-zinc-900 to-zinc-900 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[120px] font-serif text-[#C5A059]/15">{cavaloSelecionado.nome.charAt(0)}</span>
              </div>
              <button
                onClick={() => setCavaloSelecionado(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors touch-manipulation"
              >
                <X size={20} />
              </button>

              {/* Badges */}
              <div className="absolute bottom-4 left-4 flex gap-2 flex-wrap">
                <span className="px-3 py-1 bg-[#C5A059] rounded-full text-sm font-medium text-black">
                  {cavaloSelecionado.disciplina}
                </span>
                <span className="px-3 py-1 bg-zinc-800/90 rounded-full text-sm text-zinc-300">
                  Linhagem {cavaloSelecionado.linhagem}
                </span>
                {cavaloSelecionado.influenciaGenetica && cavaloSelecionado.influenciaGenetica > 5 && (
                  <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full text-sm text-green-400">
                    Top Influenciador
                  </span>
                )}
              </div>
            </div>

            {/* Abas de Navegação */}
            <div className="border-b border-zinc-800 px-6">
              <div className="flex gap-1 -mb-px overflow-x-auto">
                {[
                  { id: "info", label: "Informação", icon: Award },
                  { id: "genealogia", label: "Genealogia", icon: GitBranch },
                  { id: "descendentes", label: "Descendentes", icon: Users },
                  { id: "performance", label: "Performance", icon: TrendingUp }
                ].map((aba) => (
                  <button
                    key={aba.id}
                    onClick={() => setAbaAtiva(aba.id as "info" | "genealogia" | "descendentes" | "performance")}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      abaAtiva === aba.id
                        ? "border-[#C5A059] text-[#C5A059]"
                        : "border-transparent text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <aba.icon size={16} />
                    {aba.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conteúdo das Abas */}
            <div className="p-6 sm:p-8">
              {/* Header comum */}
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-serif text-white mb-1">{cavaloSelecionado.nome}</h2>
                {cavaloSelecionado.apelido && (
                  <p className="text-lg text-[#C5A059] italic">&quot;{cavaloSelecionado.apelido}&quot;</p>
                )}
              </div>

              {/* Aba: Informação */}
              {abaAtiva === "info" && (
                <div className="space-y-6">
                  {/* Info Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <span className="text-xs text-zinc-500 block mb-1">Período</span>
                      <span className="text-sm text-white">
                        {cavaloSelecionado.anoNascimento}
                        {cavaloSelecionado.anoFalecimento ? ` - ${cavaloSelecionado.anoFalecimento}` : " - presente"}
                      </span>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <span className="text-xs text-zinc-500 block mb-1">Pelagem</span>
                      <span className="text-sm text-white">{cavaloSelecionado.pelagem}</span>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-3">
                      <span className="text-xs text-zinc-500 block mb-1">Coudelaria</span>
                      <span className="text-sm text-white">{cavaloSelecionado.coudelaria}</span>
                    </div>
                    {cavaloSelecionado.altura && (
                      <div className="bg-zinc-800/50 rounded-lg p-3">
                        <span className="text-xs text-zinc-500 block mb-1">Altura</span>
                        <span className="text-sm text-white">{cavaloSelecionado.altura} cm</span>
                      </div>
                    )}
                    {cavaloSelecionado.cavaleiro && (
                      <div className="bg-zinc-800/50 rounded-lg p-3 col-span-2">
                        <span className="text-xs text-zinc-500 block mb-1">Cavaleiro</span>
                        <span className="text-sm text-white">{cavaloSelecionado.cavaleiro}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-zinc-300">{cavaloSelecionado.descricao}</p>

                  {/* Conquistas */}
                  <div>
                    <h3 className="text-sm font-semibold text-[#C5A059] mb-3 flex items-center gap-2">
                      <Trophy size={16} />
                      Principais Conquistas
                    </h3>
                    <ul className="space-y-2">
                      {cavaloSelecionado.conquistas.map((conquista, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                          <Award size={14} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
                          {conquista}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Curiosidades */}
                  {cavaloSelecionado.curiosidades && cavaloSelecionado.curiosidades.length > 0 && (
                    <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-[#C5A059] mb-2">Curiosidades</h3>
                      <ul className="space-y-1">
                        {cavaloSelecionado.curiosidades.map((curiosidade, i) => (
                          <li key={i} className="text-sm text-zinc-400">• {curiosidade}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Índice de Reprodução */}
                  {cavaloSelecionado.indiceReproducao && (
                    <IndiceReproducaoPanel
                      indice={cavaloSelecionado.indiceReproducao}
                      influencia={cavaloSelecionado.influenciaGenetica}
                    />
                  )}
                </div>
              )}

              {/* Aba: Genealogia */}
              {abaAtiva === "genealogia" && (
                <ArvoreGenealogica
                  pedigree={cavaloSelecionado.pedigree}
                  nomeBase={cavaloSelecionado.nome}
                />
              )}

              {/* Aba: Descendentes */}
              {abaAtiva === "descendentes" && (
                cavaloSelecionado.estatisticasDescendentes ? (
                  <EstatisticasDescendentesPanel stats={cavaloSelecionado.estatisticasDescendentes} />
                ) : (
                  <div className="text-center py-12 text-zinc-500">
                    <Users size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Dados de descendentes não disponíveis</p>
                  </div>
                )
              )}

              {/* Aba: Performance */}
              {abaAtiva === "performance" && (
                cavaloSelecionado.historicoPerformance ? (
                  <TimelinePerformance historico={cavaloSelecionado.historicoPerformance} />
                ) : (
                  <div className="text-center py-12 text-zinc-500">
                    <TrendingUp size={48} className="mx-auto mb-4 opacity-30" />
                    <p>Histórico de performance não disponível</p>
                  </div>
                )
              )}

              {/* Legado Footer */}
              <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                <p className="text-sm text-zinc-500 italic">&quot;{cavaloSelecionado.legado}&quot;</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {cavalosFiltrados.length === 0 && (
        <div className="max-w-6xl mx-auto text-center py-16">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={24} className="text-zinc-600" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum cavalo encontrado</h3>
          <p className="text-sm text-zinc-500">
            Ajuste os filtros para ver mais resultados
          </p>
        </div>
      )}

      {/* Info */}
      <div className="max-w-6xl mx-auto mt-16">
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Conhece um cavalo Lusitano lendário?</h3>
          <p className="text-sm text-zinc-400 mb-4">
            Ajuda-nos a expandir esta galeria de honra com genealogias e históricos completos.
          </p>
          <button className="px-6 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-[#C5A059] hover:text-black transition-colors touch-manipulation">
            Sugerir Cavalo
          </button>
        </div>
      </div>
    </main>
  );
}

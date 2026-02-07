"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  MapPin,
  Users,
  Award,
  ChevronRight,
  X,
  Star,
  Dna,
  Crown,
  Shield,
  Landmark,
  Heart,
  Target,
  Clock,
  Sparkles,
} from "lucide-react";

// =============================================================================
// TIPOS E INTERFACES
// =============================================================================

interface CavaloNotavel {
  nome: string;
  ano?: string;
  conquistas: string;
}

interface EventoHistorico {
  ano: number;
  evento: string;
  destaque?: boolean;
}

interface Linhagem {
  id: string;
  nome: string;
  descricao: string;
  historiaCompleta: string[];
  origem: string;
  fundador: string;
  anoFundacao: number | string;
  cabecaLinhagem?: string;
  cabecaLinhagemInfo?: string;
  caracteristicas: string[];
  coresComuns: string[];
  temperamento: string;
  aptidoes: string[];
  cavalosNotaveis: CavaloNotavel[];
  coudelariasPrincipais: string[];
  timeline: EventoHistorico[];
  factosChave: string[];
  confianca: "ALTA" | "MÉDIA-ALTA" | "MÉDIA" | "BAIXA";
}

// =============================================================================
// DADOS VERIFICADOS COM FONTES CITADAS
// =============================================================================

// FONTES GLOBAIS:
// https://lusitanohorsefinder.com/lusitano-bloodlines/
// https://lusitanohorsefinder.com/lusitano-bloodlines-part-ii/
// https://www.cavalo-lusitano.com (APSL - Stud Book Oficial)
// Livro Genealógico Português de Equinos (31/Dez/1989) - 6 Chefes de Linha

const linhagens: Linhagem[] = [
  {
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
    // FONTE: https://baroquehorsemagazine.com/manuel-veiga-stud/ (Baroque Horse Magazine)
    // FONTE: https://www.equilife.world/ (Equilife World)
    // FONTE: https://interagro.com.br (Interagro Lusitanos)
    // FONTE: http://www.lusitanocollection.com/novi.htm (Novilheiro)
    id: "veiga",
    nome: "Veiga",
    descricao:
      "A linhagem Veiga é a mais emblemática e reconhecível do Lusitano, com cavalos compactos, ágeis e de bravura notável. Fundada no início do século XIX, produziu alguns dos cavalos mais célebres da raça.",
    historiaCompleta: [
      "A linhagem Veiga tem origem na Quinta da Broa, em Azinhaga (Ribatejo), fundada por Rafael José da Cunha há mais de 180 anos. O programa de criação foi desenvolvido com base em dois garanhões Alter Real doados pelo Rei D. Fernando II.",
      "Manuel Veiga Tavares, bisneto do fundador, continuou o programa, dando origem à famosa marca 'MV'. A linhagem consolidou-se com o garanhão Agareno (nascido em 1931), filho de Lidador e Bagocha, que se tornou um dos seis Chefes de Linhagem oficiais do Puro Sangue Lusitano.",
      "O cruzamento histórico do garanhão Firme (da coudelaria Andrade) com éguas Veiga produziu quatro dos cavalos mais famosos do século XX: Novilheiro, Nilo, Neptuno e Opus II — criando a chamada 'fórmula de ouro' do Lusitano moderno.",
      "Hoje, a influência Veiga está presente em praticamente todas as coudelarias de referência do mundo.",
    ],
    origem: "Quinta da Broa, Azinhaga, Ribatejo",
    fundador: "Rafael José da Cunha",
    anoFundacao: "Séc. XIX",
    cabecaLinhagem: "Agareno",
    cabecaLinhagemInfo:
      "Nascido em 1931, filho de Lidador (MV) e Bagocha (MV). Um dos 6 Chefes de Linhagem oficiais do PSL.",
    caracteristicas: [
      "Perfil convexo pronunciado (cabeça 'aveigada')",
      "Corpo compacto e bem proporcionado",
      "Pernas finas mas resistentes",
      "Pescoço arqueado e musculado",
      "Garupa inclinada",
      "Porte relativamente pequeno mas poderoso",
      "Movimentos ágeis e elevados",
    ],
    coresComuns: ["Ruço", "Castanho", "Preto", "Tordilho"],
    temperamento:
      "Corajosos e reactivos, com bravura natural. Muito inteligentes e sensíveis, respondem bem a cavaleiros experientes. A sua vivacidade torna-os excepcionais para toureio e working equitation.",
    aptidoes: ["Toureio", "Working Equitation", "Dressage", "Saltos"],
    cavalosNotaveis: [
      // FONTE: http://www.lusitanocollection.com/novi.htm
      {
        nome: "Novilheiro",
        ano: "1971-2000",
        conquistas:
          "O Lusitano mais célebre da história. Campeão de saltos com John Whitaker, líder europeu em prémios (1983). Também competiu em dressage Grand Prix e concurso completo.",
      },
      // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
      {
        nome: "Opus 72",
        ano: "1972",
        conquistas:
          "Famoso cavalo de toureio de Álvaro Domecq, demonstrando a versatilidade da linhagem Veiga.",
      },
      // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
      {
        nome: "Nilo",
        ano: "1971-1995",
        conquistas:
          "Campeão dos Campeões na Golegã 1974. Considerado autêntico Chefe de Raça do PSL moderno.",
      },
      // FONTE: https://lusitanohorsefinder.com/joao-pedro-rodrigues/
      {
        nome: "Oxidado",
        ano: "1994-2020",
        conquistas:
          "6x Campeão Europeu de Working Equitation com Pedro Torres. O cavalo mais titulado da história da disciplina.",
      },
    ],
    coudelariasPrincipais: [
      "Manuel Veiga (histórica)",
      "Quinta da Broa",
      "Monte Velho",
      "Ortigão Costa",
    ],
    timeline: [
      {
        ano: 1931,
        evento: "Nasce Agareno (Lidador x Bagocha), futuro Chefe de Linhagem",
        destaque: true,
      },
      {
        ano: 1956,
        evento:
          "Nasce Firme na Coudelaria Andrade — futuro pai da geração de ouro",
      },
      {
        ano: 1971,
        evento: "Nascem Novilheiro e Nilo (Firme x éguas Veiga)",
        destaque: true,
      },
      {
        ano: 1974,
        evento: "Nilo coroado Campeão dos Campeões na Golegã",
        destaque: true,
      },
      {
        ano: 1983,
        evento:
          "Novilheiro é o cavalo com maior prémio acumulado em saltos na Europa",
        destaque: true,
      },
      {
        ano: 1989,
        evento: "Agareno reconhecido oficialmente como Chefe de Linhagem no Stud Book",
        destaque: true,
      },
    ],
    factosChave: [
      "Agareno é um dos 6 Chefes de Linhagem oficiais do PSL",
      "Stock fundador incluiu 2 garanhões Alter Real doados pela coroa",
      "O cruzamento Firme (Andrade) × éguas Veiga criou a linhagem moderna mais influente",
      "Novilheiro provou que o Lusitano pode brilhar em qualquer disciplina equestre",
    ],
    confianca: "ALTA",
  },
  {
    // FONTE: https://www.herdadedoazinhal.com/en/the-stud-farm/ (Herdade do Azinhal)
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
    // FONTE: https://interagro.com.br (Interagro Lusitanos)
    // FONTE: https://en.wikipedia.org/wiki/Ruy_d%27Andrade (Wikipedia)
    // FONTE: https://en.wikipedia.org/wiki/Sorraia_horse (Wikipedia - Sorraia)
    id: "andrade",
    nome: "Andrade",
    descricao:
      "A linhagem Andrade produziu cavalos com presença, andamentos e temperamento notáveis. Fundada pelo Dr. Ruy d'Andrade, ganhou mais Campeonatos de Criação que qualquer outra coudelaria e foi decisiva na salvação da linha Alter Real.",
    historiaCompleta: [
      "A coudelaria Andrade foi formada em 1894 por Dr. Ruy d'Andrade (1880-1967), com éguas de criadores espanhóis como Hermanos Guerrero, D. Vicente Romero y Garcia e D. António Perez Tinao, todos de sangue Cartujano puro.",
      "A coudelaria ganhou mais Campeonatos de Criação do que qualquer outra, incluindo os títulos de Campeão Ibérico em 1970 e 1972. Garanhões notáveis incluem Rumboso, Arriero, Bergantin, Cartujano, Saltador, Novelero e Príncipe VIII.",
      "Dr. Ruy d'Andrade adquiriu dois garanhões idosos — Vigilante e Regedor — e Marialva II, salvando a linha Alter Real da extinção. Em 1942, transferiu este pequeno efectivo para o Ministério da Agricultura quando a coudelaria reabriu.",
      "O Dr. Ruy d'Andrade também é reconhecido pela descoberta e preservação do cavalo Sorraia, uma raça primitiva ibérica. Após a sua morte em 1967, a coudelaria dividiu-se entre os seus filhos, com operações em Coruche, Elvas e Torres Vedras.",
    ],
    origem: "Portugal (Coruche, Elvas, Torres Vedras)",
    fundador: "Dr. Ruy d'Andrade (1880-1967)",
    anoFundacao: 1894,
    cabecaLinhagem: "Marialva II",
    cabecaLinhagemInfo:
      "Marialva II (n. 1930, APM) é reconhecido como Chefe de Linha oficial associado à linhagem Andrade. Nota: as fontes divergem sobre a atribuição exacta dos 6 fundadores às linhagens.",
    caracteristicas: [
      "Cavalos altos e potentes",
      "Perfil quase recto (sub-convexo)",
      "Garupa arredondada e musculada",
      "Ossatura mais forte que a Veiga",
      "Pescoço longo e bem inserido",
      "Andamentos amplos e cadenciados",
      "Porte nobre e majestoso",
    ],
    coresComuns: ["Castanho", "Ruço", "Tordilho", "Preto"],
    temperamento:
      "Mais calmos e equilibrados que os Veiga. Dóceis mas enérgicos, com boa capacidade de concentração. Excelentes para cavaleiros de todos os níveis.",
    aptidoes: ["Dressage", "Toureio", "Trabalho", "Reprodução"],
    cavalosNotaveis: [
      // FONTE: http://www.lusitanocollection.com/novi.htm
      {
        nome: "Firme",
        ano: "1956-1978",
        conquistas:
          "Garanhão da Coudelaria Andrade que, cruzado com éguas Veiga, produziu Novilheiro, Nilo, Neptuno e Opus II. Cavalo de toureio com D. José d'Athayde.",
      },
    ],
    coudelariasPrincipais: [
      "Fernando Sommer d'Andrade (histórica)",
      "Herdade do Azinhal",
      "Interagro (Brasil)",
    ],
    timeline: [
      { ano: 1894, evento: "Dr. Ruy d'Andrade funda a coudelaria com éguas espanholas Cartujanas", destaque: true },
      {
        ano: 1920,
        evento: "Dr. Ruy d'Andrade descobre cavalos Sorraia selvagens perto de Coruche",
        destaque: true,
      },
      {
        ano: 1930,
        evento: "Nasce Marialva II (APM), futuro Chefe de Linha oficial",
        destaque: true,
      },
      {
        ano: 1938,
        evento:
          "Dr. Ruy d'Andrade salva a linha Alter Real com Vigilante, Regedor e Marialva II",
        destaque: true,
      },
      {
        ano: 1942,
        evento: "Transfere o efectivo Alter Real para o Ministério da Agricultura",
      },
      {
        ano: 1956,
        evento: "Nasce Firme, o garanhão que criaria a 'fórmula de ouro'",
        destaque: true,
      },
      { ano: 1967, evento: "Falecimento de Dr. Ruy d'Andrade aos 87 anos" },
      {
        ano: 1970,
        evento: "Campeão Ibérico de Criação (também em 1972)",
        destaque: true,
      },
    ],
    factosChave: [
      "Dr. Ruy d'Andrade SALVOU a linha Alter Real da extinção (1938-1942)",
      "Dr. Ruy d'Andrade descobriu e preservou o cavalo Sorraia (1920-1937)",
      "Ganhou mais Campeonatos de Criação que qualquer outra coudelaria",
      "O garanhão Firme (Andrade) × éguas Veiga = geração de ouro do Lusitano",
    ],
    confianca: "ALTA",
  },
  {
    // FONTE: https://en.wikipedia.org/wiki/Alter_Real (Wikipedia)
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
    // FONTE: https://www.eurodressage.com/2010/10/12/rubi-king-lusitanos-takes-his-throne
    // FONTE: https://www.superiorequinesires.com/rubi-alter-real/
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines-part-ii/ (EPAE info)
    id: "alter-real",
    nome: "Alter Real",
    descricao:
      "A mais antiga e nobre linhagem equestre de Portugal, fundada pela coroa em 1748. Cavalos barrocos, compactos e de acção alta, hoje a base da Escola Portuguesa de Arte Equestre.",
    historiaCompleta: [
      "A Coudelaria de Alter Real foi fundada em 1748 pelo Rei D. João V, no âmbito de uma política de criação equina iniciada em 1708. O stock original consistiu em cerca de 300 éguas ibéricas, maioritariamente espanholas. A coudelaria tornou-se famosa em toda a Europa como o melhor local para adquirir cavalos de Alta Escola.",
      "A linhagem sobreviveu a múltiplas crises: as invasões napoleónicas (a partir de 1807) dizimaram os efectivos, e após a Revolução Republicana de 1910, a coudelaria foi encerrada, garanhões castrados, cavalos vendidos e registos genealógicos queimados.",
      "A salvação veio pelas mãos do Dr. Ruy d'Andrade, que adquiriu dois garanhões idosos — Vigilante e Regedor — e Marialva II. Em 1942, transferiu este pequeno efectivo para o Ministério da Agricultura quando a coudelaria reabriu.",
      "Regedor (nascido em 1923), filho de Gaivoto e Gavina, tornou-se o Chefe de Linhagem oficial da linha Alter Real. Hoje, a coudelaria é gerida pela Companhia das Lezírias (desde 2013) e cria cavalos exclusivamente para a Escola Portuguesa de Arte Equestre.",
    ],
    origem: "Alter do Chão, Portalegre",
    fundador: "Rei D. João V (1748)",
    anoFundacao: 1748,
    cabecaLinhagem: "Regedor",
    cabecaLinhagemInfo:
      "Nascido em 1923, filho de Gaivoto e Gavina. Único Chefe de Linhagem de sangue Alter Real puro entre os 6 fundadores oficiais.",
    caracteristicas: [
      "Cavalos muito barrocos e compactos",
      "Silhueta redonda e musculada",
      "Acção alta de joelhos (knee action)",
      "Porte nobre e imponente",
      "Crina e cauda abundantes",
      "Pescoço curvo e poderoso",
      "Aptidão natural para Alta Escola",
    ],
    coresComuns: ["Castanho", "Baio"],
    temperamento:
      "Nobres e cooperantes, com disposição natural para a Alta Escola. Cavalos de presença imponente, equilibrados e com grande vontade de trabalhar.",
    aptidoes: ["Alta Escola", "Dressage", "Atrelagem", "Cerimónia"],
    cavalosNotaveis: [
      // FONTE: https://www.eurodressage.com/2010/10/12/rubi-king-lusitanos-takes-his-throne
      // FONTE: https://www.superiorequinesires.com/rubi-alter-real/
      {
        nome: "Rubi AR",
        ano: "1998",
        conquistas:
          "16º nos Jogos Olímpicos de Londres 2012 com Gonçalo Carvalho. 77.8% Grand Prix (recorde Lusitano). 19 vitórias internacionais. 5 estrelas de mérito APSL.",
      },
      // FONTE: https://www.lusitanostud.com/blog/2019/8/20/the-kings-stud-alter-real
      {
        nome: "Gentil",
        ano: "Séc. XVIII",
        conquistas:
          "Cavalo Alter Real escolhido pelo Marquês de Marialva como modelo para a estátua equestre de D. José I no Terreiro do Paço, Lisboa.",
      },
      // FONTE: Livro Genealógico Português de Equinos
      {
        nome: "Regedor",
        ano: "1923",
        conquistas:
          "Chefe de Linhagem oficial do PSL. Fundador da linha Alter Real moderna. Base genética da EPAE.",
      },
    ],
    coudelariasPrincipais: [
      "Coudelaria de Alter Real (Fundação Alter Real)",
      "Escola Portuguesa de Arte Equestre",
    ],
    timeline: [
      {
        ano: 1747,
        evento: "Importação de ~300 éguas ibéricas de Espanha",
      },
      {
        ano: 1748,
        evento: "Rei D. João V funda a Coudelaria de Alter Real",
        destaque: true,
      },
      {
        ano: 1807,
        evento: "Invasões napoleónicas devastam os efectivos",
      },
      {
        ano: 1910,
        evento:
          "Revolução Republicana: registos queimados, garanhões castrados",
      },
      {
        ano: 1923,
        evento: "Nasce Regedor (Gaivoto x Gavina), futuro Chefe de Linhagem",
        destaque: true,
      },
      {
        ano: 1938,
        evento:
          "Dr. Ruy d'Andrade salva a linhagem com Vigilante, Regedor e Marialva II",
        destaque: true,
      },
      {
        ano: 1989,
        evento: "Regedor reconhecido como Chefe de Linhagem no Stud Book",
        destaque: true,
      },
      {
        ano: 2012,
        evento: "Rubi AR nos Jogos Olímpicos de Londres (16º individual)",
        destaque: true,
      },
    ],
    factosChave: [
      "Fundada em 1748, é a coudelaria real mais antiga de Portugal em funcionamento contínuo",
      "Stock original: cerca de 300 éguas ibéricas, maioritariamente espanholas",
      "Quase extinta após invasões napoleónicas e Revolução de 1910",
      "Salva por Dr. Ruy d'Andrade com Vigilante, Regedor e Marialva II",
      "Hoje cria cavalos exclusivamente para a Escola Portuguesa de Arte Equestre",
    ],
    confianca: "ALTA",
  },
  {
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines/
    // FONTE: https://lusitanohorsefinder.com/lusitano-bloodlines-part-ii/
    // FONTE: https://interagro.com.br (Interagro Lusitanos)
    // FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
    id: "coudelaria-nacional",
    nome: "Coudelaria Nacional",
    descricao:
      "A Coudelaria Nacional, também conhecida como Fonte Boa, é a instituição estatal responsável pela preservação e melhoria genética do Lusitano. Os seus cavalos são maiores, mais redondos e versáteis.",
    historiaCompleta: [
      "A Coudelaria Nacional foi fundada em 1887. Está localizada na Quinta da Fonte Boa, em Santarém, nas férteis margens do rio Tejo.",
      "A Coudelaria Nacional tem Chefes de Linha oficiais associados, incluindo Hucharia (n. 1943), notável por ser a única égua entre os seis fundadores oficiais da raça. Primoroso (n. 1927) e Destinado (n. 1930), ambos de origem Dominguez Hermanos, são também garanhões fundadores associados a esta linha.",
      "Os cavalos CN são tipicamente maiores, mais redondos e com dorsos mais compridos, tornando-os muito adequados para atrelagem e dressage.",
      "Hoje, a Coudelaria Nacional faz parte da Fundação Alter Real, juntamente com a Coudelaria de Alter e a Escola Portuguesa de Arte Equestre.",
    ],
    origem: "Quinta da Fonte Boa, Santarém",
    fundador: "Estado Português (1887)",
    anoFundacao: 1887,
    cabecaLinhagem: "Hucharia",
    cabecaLinhagemInfo:
      "Hucharia (n. 1943, CN), única égua entre os 6 fundadores oficiais. Primoroso (n. 1927, DH) e Destinado (n. 1930, DH) são garanhões fundadores de origem Dominguez Hermanos também associados a esta linha.",
    caracteristicas: [
      "Cavalos maiores que a média da raça",
      "Corpo mais longo e arredondado",
      "Garupas altas e musculadas",
      "Ossatura robusta",
      "Dorso mais comprido",
      "Andamentos amplos e regulares",
      "Grande capacidade de tracção",
    ],
    coresComuns: ["Castanho", "Ruço", "Tordilho"],
    temperamento:
      "Calmos e fiáveis, com boa disposição para o trabalho. Versáteis e adaptáveis, adequados a múltiplas disciplinas.",
    aptidoes: ["Atrelagem", "Dressage", "Trabalho", "Reprodução"],
    cavalosNotaveis: [
      // FONTE: Wikipedia (Lusitano) + Lusitano Horse Finder
      {
        nome: "Hucharia",
        ano: "1943",
        conquistas:
          "Única égua entre os 6 Chefes de Linha oficiais do PSL. Filha de Cartujano e Viscaína.",
      },
    ],
    coudelariasPrincipais: [
      "Coudelaria Nacional / Fonte Boa",
      "Fundação Alter Real",
    ],
    timeline: [
      {
        ano: 1887,
        evento: "Fundação da Coudelaria Nacional",
        destaque: true,
      },
      {
        ano: 1927,
        evento: "Nasce Primoroso (DH), futuro Chefe de Linha",
        destaque: true,
      },
      {
        ano: 1930,
        evento: "Nasce Destinado (DH), futuro Chefe de Linha",
        destaque: true,
      },
      {
        ano: 1943,
        evento: "Nasce Hucharia (CN), única égua Chefe de Linha",
        destaque: true,
      },
      {
        ano: 1989,
        evento:
          "Primoroso, Destinado e Hucharia reconhecidos no Stud Book oficial",
        destaque: true,
      },
    ],
    factosChave: [
      "3 dos 6 Chefes de Linha oficiais são desta linhagem (Primoroso, Destinado, Hucharia)",
      "Hucharia é a ÚNICA égua entre os 6 fundadores oficiais da raça",
      "Linhagens CN têm origem espanhola (Dominguez Hermanos)",
      "Faz parte da Fundação Alter Real",
    ],
    confianca: "MÉDIA-ALTA",
  },
  // NOTA: As linhagens Coimbra e Infante da Câmara foram removidas por falta de
  // fontes credíveis verificáveis online. A informação disponível sobre estas linhagens
  // existe principalmente em literatura equestre especializada portuguesa (livros, registos APSL)
  // que não pudemos verificar. Preferimos omitir a publicar informação não confirmada.
  // Se no futuro obtivermos fontes escritas credíveis, estas linhagens poderão ser adicionadas.
];

// Os 6 Chefes de Linhagem oficiais reconhecidos no Stud Book (1989)
// FONTE: Livro Genealógico Português de Equinos (31/Dez/1989)
// NOTA: A atribuição dos 6 fundadores às linhagens varia conforme a fonte.
// Apresentamos aqui a marca de origem de cada cavalo (verificável no Stud Book).
const chefesLinhagem = [
  { nome: "Agareno", ano: 1931, linhagem: "Veiga", tipo: "Garanhão", marca: "MV" },
  { nome: "Primoroso", ano: 1927, linhagem: "Dominguez Hermanos", tipo: "Garanhão", marca: "DH" },
  { nome: "Destinado", ano: 1930, linhagem: "Dominguez Hermanos", tipo: "Garanhão", marca: "DH" },
  { nome: "Marialva II", ano: 1930, linhagem: "Fontes Pereira de Melo", tipo: "Garanhão", marca: "APM" },
  { nome: "Regedor", ano: 1923, linhagem: "Alter Real", tipo: "Garanhão", marca: "AR" },
  { nome: "Hucharia", ano: 1943, linhagem: "Coudelaria Nacional", tipo: "Égua", marca: "CN" },
];

// Timeline global de eventos históricos
// FONTES: Compiladas de todas as fontes individuais acima
const timelineGlobal: EventoHistorico[] = [
  { ano: 1748, evento: "Rei D. João V funda a Coudelaria de Alter Real em Alter do Chão", destaque: true },
  { ano: 1807, evento: "Invasões napoleónicas (1807-1811) devastam as coudelarias" },
  { ano: 1887, evento: "Fundação da Coudelaria Nacional", destaque: true },
  { ano: 1894, evento: "Dr. Ruy d'Andrade funda a coudelaria Andrade com éguas espanholas" },
  { ano: 1910, evento: "Revolução: coudelaria Alter encerrada, registos queimados, garanhões castrados" },
  { ano: 1920, evento: "Dr. Ruy d'Andrade descobre cavalos Sorraia selvagens perto de Coruche" },
  { ano: 1923, evento: "Nasce Regedor (AR), futuro Chefe de Linhagem", destaque: true },
  { ano: 1927, evento: "Nasce Primoroso (DH), futuro Chefe de Linha" },
  { ano: 1930, evento: "Nascem Destinado (DH) e Marialva II (APM)" },
  { ano: 1931, evento: "Nasce Agareno (MV), futuro Chefe de Linhagem", destaque: true },
  { ano: 1938, evento: "Dr. Ruy d'Andrade adquire Vigilante, Regedor e Marialva II — salva a linha Alter Real", destaque: true },
  { ano: 1942, evento: "Efectivo Alter Real transferido para o Ministério da Agricultura" },
  { ano: 1943, evento: "Nasce Hucharia (CN), única égua fundadora" },
  { ano: 1967, evento: "Falecimento de Dr. Ruy d'Andrade aos 87 anos" },
  { ano: 1989, evento: "Stud Book reconhece oficialmente os 6 Chefes de Linhagem do PSL", destaque: true },
];

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function LinhagenPage() {
  const [selectedLinhagem, setSelectedLinhagem] = useState<Linhagem | null>(
    null
  );
  const [showTimeline, setShowTimeline] = useState(false);

  const linhagensPrincipais = linhagens.filter((l) =>
    ["veiga", "andrade", "alter-real", "coudelaria-nacional"].includes(l.id)
  );

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors mb-8 touch-manipulation"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Voltar</span>
          </Link>

          <div className="text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] block mb-4">
              Conhecimento
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
              Guia das Linhagens
            </h1>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              Descubra a história e as características das principais linhagens
              do cavalo Lusitano. Séculos de selecção e tradição equestre.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Introdução */}
        <div
          className="mb-16 p-8 bg-zinc-900/50 border border-white/10 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center flex-shrink-0 hidden sm:flex">
              <Dna className="text-[#C5A059]" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-white mb-4">
                A Importância das Linhagens
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                O cavalo Lusitano possui linhagens distintas que foram
                desenvolvidas ao longo de séculos por famílias dedicadas à
                criação. Cada linhagem tem características próprias em termos de
                conformação, temperamento e aptidões.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Em 1989, o Livro Genealógico Português de Equinos reconheceu
                oficialmente{" "}
                <span className="text-[#C5A059] font-medium">
                  6 Chefes de Linhagem
                </span>{" "}
                como os pilares genéticos de toda a raça: 5 garanhões (Agareno,
                Primoroso, Destinado, Marialva II e Regedor) e 1 égua
                (Hucharia).
              </p>
            </div>
          </div>
        </div>

        {/* Os 6 Chefes de Linhagem */}
        <section
          className="mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.15s" }}
        >
          <h2 className="text-2xl font-serif text-white mb-2 text-center">
            Os 6 Chefes de Linhagem Oficiais
          </h2>
          <p className="text-zinc-500 text-sm text-center mb-8">
            Livro Genealógico Português de Equinos (31/Dez/1989)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {chefesLinhagem.map((chefe) => (
              <div
                key={chefe.nome}
                className={`text-center p-4 border transition-colors ${
                  chefe.tipo === "Égua"
                    ? "bg-[#C5A059]/10 border-[#C5A059]/30"
                    : "bg-zinc-900/50 border-white/10 hover:border-[#C5A059]/30"
                }`}
              >
                <div className="w-12 h-12 mx-auto bg-[#C5A059]/10 rounded-full flex items-center justify-center mb-3">
                  {chefe.tipo === "Égua" ? (
                    <Heart className="text-[#C5A059]" size={20} />
                  ) : (
                    <Crown className="text-[#C5A059]" size={20} />
                  )}
                </div>
                <h3 className="text-white font-serif text-sm mb-1">
                  {chefe.nome}
                </h3>
                <p className="text-zinc-500 text-xs">{chefe.ano}</p>
                <p className="text-[#C5A059] text-xs mt-1">{chefe.marca}</p>
                <p className="text-zinc-600 text-[10px] mt-1 uppercase tracking-wider">
                  {chefe.linhagem}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Linhagens Principais */}
        <section className="mb-16">
          <h2
            className="text-lg font-serif text-[#C5A059] mb-8 flex items-center gap-2 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          >
            <Sparkles size={20} className="fill-[#C5A059]" />
            Linhagens Principais
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {linhagensPrincipais.map((linhagem, index) => (
              <LinhagemCard
                key={linhagem.id}
                linhagem={linhagem}
                index={index}
                onSelect={() => setSelectedLinhagem(linhagem)}
              />
            ))}
          </div>
        </section>

        {/* Nota sobre outras linhagens */}
        <section className="mb-16">
          <div
            className="p-6 bg-zinc-900/30 border border-white/10 rounded opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.25s" }}
          >
            <h3 className="text-sm font-serif text-zinc-400 mb-2 flex items-center gap-2">
              <BookOpen size={16} />
              Outras Linhagens
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Existem outras linhagens reconhecidas na criação do Lusitano, como a{" "}
              <strong className="text-zinc-400">Coimbra</strong> e a{" "}
              <strong className="text-zinc-400">Infante da Câmara</strong>.
              No entanto, a informação disponível online sobre estas linhagens é
              muito limitada, existindo principalmente em literatura equestre
              especializada e registos da APSL. Por rigor, optámos por não
              publicar dados que não possamos verificar em fontes credíveis.
            </p>
          </div>
        </section>

        {/* Timeline Histórica */}
        <section
          className="mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.35s" }}
        >
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="w-full text-left p-6 bg-zinc-900/50 border border-white/10 hover:border-[#C5A059]/30 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Clock className="text-[#C5A059]" size={24} />
              <div>
                <h2 className="text-xl font-serif text-white">
                  Timeline Histórica das Linhagens
                </h2>
                <p className="text-zinc-500 text-sm">
                  De 1748 a 1989 — os momentos que definiram a raça Lusitana
                </p>
              </div>
            </div>
            <ChevronRight
              size={20}
              className={`text-[#C5A059] transition-transform ${
                showTimeline ? "rotate-90" : ""
              }`}
            />
          </button>

          {showTimeline && (
            <div className="mt-4 p-6 bg-zinc-900/30 border border-white/5">
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800" />
                <div className="space-y-4">
                  {timelineGlobal
                    .sort((a, b) => a.ano - b.ano)
                    .map((evento, i) => (
                      <div key={i} className="flex items-start gap-4 relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                            evento.destaque
                              ? "bg-[#C5A059] text-black"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {evento.destaque ? (
                            <Star size={14} />
                          ) : (
                            <Calendar size={14} />
                          )}
                        </div>
                        <div
                          className={`flex-1 ${
                            evento.destaque
                              ? "bg-[#C5A059]/10 border-[#C5A059]/30"
                              : "bg-zinc-800/30 border-zinc-800"
                          } border p-3`}
                        >
                          <span className="text-sm font-bold text-white">
                            {evento.ano}
                          </span>
                          <p
                            className={`text-sm ${
                              evento.destaque
                                ? "text-zinc-300"
                                : "text-zinc-400"
                            }`}
                          >
                            {evento.evento}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Dicas para Escolher */}
        <section
          className="mt-20 p-8 bg-gradient-to-r from-[#C5A059]/10 via-transparent to-[#C5A059]/10 border border-[#C5A059]/20 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.4s" }}
        >
          <h2 className="text-2xl font-serif text-white mb-6 text-center">
            Como Escolher a Linhagem Ideal?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-[#C5A059] rounded-full flex items-center justify-center mb-4">
                <span className="text-black font-bold">1</span>
              </div>
              <h3 className="text-white font-serif mb-2">
                Defina o Objectivo
              </h3>
              <p className="text-zinc-400 text-sm">
                Dressage, toureio, working equitation ou lazer? Cada linhagem
                tem aptidões específicas. A Veiga excela no toureio e WE, a
                Alter Real na Alta Escola, a Andrade no dressage.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-[#C5A059] rounded-full flex items-center justify-center mb-4">
                <span className="text-black font-bold">2</span>
              </div>
              <h3 className="text-white font-serif mb-2">
                Considere o Temperamento
              </h3>
              <p className="text-zinc-400 text-sm">
                Os Veiga são mais reactivos e corajosos, ideais para cavaleiros
                experientes. Os Andrade e Coudelaria Nacional são mais calmos e
                versáteis, adequados a todos os níveis.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-[#C5A059] rounded-full flex items-center justify-center mb-4">
                <span className="text-black font-bold">3</span>
              </div>
              <h3 className="text-white font-serif mb-2">
                Visite Coudelarias
              </h3>
              <p className="text-zinc-400 text-sm">
                Conheça cavalos de diferentes linhagens pessoalmente. Cada
                exemplar é único e a interacção directa é insubstituível.
              </p>
            </div>
          </div>
        </section>

        {/* Modal de Linhagem */}
        {selectedLinhagem && (
          <LinhagemModal
            linhagem={selectedLinhagem}
            onClose={() => setSelectedLinhagem(null)}
          />
        )}
      </div>
    </main>
  );
}

// =============================================================================
// CARD DE LINHAGEM (PRINCIPAL)
// =============================================================================

function LinhagemCard({
  linhagem,
  index,
  onSelect,
}: {
  linhagem: Linhagem;
  index: number;
  onSelect: () => void;
}) {
  const iconMap: Record<string, typeof Shield> = {
    veiga: Target,
    andrade: Award,
    "alter-real": Landmark,
    "coudelaria-nacional": Shield,
  };
  const Icon = iconMap[linhagem.id] || Dna;

  return (
    <button
      onClick={onSelect}
      className="text-left group relative overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
    >
      <div className="relative h-96 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-[#C5A059]/5">
        {/* Background icon */}
        <div className="absolute top-8 right-8 opacity-10">
          <Icon size={120} className="text-[#C5A059]" />
        </div>

        <div className="absolute inset-0 border border-white/10 group-hover:border-[#C5A059]/50 transition-colors" />

        {/* Badge de data */}
        <div className="absolute top-4 left-4 bg-black/60 text-[#C5A059] px-3 py-1 text-sm flex items-center gap-2">
          <Calendar size={14} />
          Desde {linhagem.anoFundacao}
        </div>

        {/* Nível de confiança */}
        <div className="absolute top-4 right-4 bg-black/60 text-zinc-400 px-2 py-1 text-[10px] uppercase tracking-wider">
          {linhagem.confianca}
        </div>

        {/* Conteúdo */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {/* Chefe de Linhagem */}
          {linhagem.cabecaLinhagem && (
            <div className="flex items-center gap-2 mb-3">
              <Crown size={14} className="text-[#C5A059]" />
              <span className="text-xs text-[#C5A059]">
                Chefe de Linhagem: {linhagem.cabecaLinhagem}
              </span>
            </div>
          )}

          <h3 className="text-2xl font-serif text-white group-hover:text-[#C5A059] transition-colors mb-2">
            Linhagem {linhagem.nome}
          </h3>

          <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
            <MapPin size={14} className="text-[#C5A059]" />
            {linhagem.origem}
          </div>

          <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
            {linhagem.descricao}
          </p>

          {/* Aptidões */}
          <div className="flex flex-wrap gap-2 mb-4">
            {linhagem.aptidoes.slice(0, 4).map((apt) => (
              <span
                key={apt}
                className="text-xs bg-[#C5A059]/10 text-[#C5A059] px-2 py-0.5"
              >
                {apt}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[#C5A059] text-sm">
            Explorar linhagem
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// MODAL DE LINHAGEM (EXPANDIDO)
// =============================================================================

function LinhagemModal({
  linhagem,
  onClose,
}: {
  linhagem: Linhagem;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "historia" | "caracteristicas" | "cavalos" | "timeline"
  >("historia");

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto animate-[fadeSlideIn_0.3s_ease-out_forwards]"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-white/10 max-w-4xl w-full my-8 relative opacity-0 animate-[scaleIn_0.3s_ease-out_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:bg-black transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="relative h-48 md:h-56 bg-gradient-to-br from-[#C5A059]/20 via-zinc-900 to-zinc-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[100px] font-serif text-[#C5A059]/10">
              {linhagem.nome.charAt(0)}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-2">
              {linhagem.cabecaLinhagem && (
                <span className="text-xs bg-[#C5A059]/20 text-[#C5A059] px-2 py-1 flex items-center gap-1">
                  <Crown size={12} />
                  {linhagem.cabecaLinhagem}
                </span>
              )}
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1">
                Confiança: {linhagem.confianca}
              </span>
            </div>
            <h2 className="text-3xl font-serif text-white">
              Linhagem {linhagem.nome}
            </h2>
            <p className="text-[#C5A059] mt-1">
              {linhagem.origem} &bull; Desde {linhagem.anoFundacao}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-zinc-800 px-8">
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {[
              { id: "historia" as const, label: "História", icon: BookOpen },
              {
                id: "caracteristicas" as const,
                label: "Características",
                icon: Dna,
              },
              { id: "cavalos" as const, label: "Cavalos Notáveis", icon: Star },
              { id: "timeline" as const, label: "Timeline", icon: Clock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#C5A059] text-[#C5A059]"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          {/* Tab: História */}
          {activeTab === "historia" && (
            <div className="space-y-6">
              {/* Fundador */}
              <div className="flex items-center gap-3 p-4 bg-[#C5A059]/10 border border-[#C5A059]/20">
                <Users className="text-[#C5A059]" size={24} />
                <div>
                  <div className="text-zinc-500 text-xs uppercase">
                    Fundador
                  </div>
                  <div className="text-white font-serif">
                    {linhagem.fundador}
                  </div>
                </div>
              </div>

              {/* Cabeça de Linhagem Info */}
              {linhagem.cabecaLinhagemInfo && (
                <div className="flex items-center gap-3 p-4 bg-zinc-800/50 border border-zinc-700">
                  <Crown className="text-[#C5A059]" size={24} />
                  <div>
                    <div className="text-zinc-500 text-xs uppercase">
                      Chefe de Linhagem
                    </div>
                    <div className="text-zinc-300 text-sm">
                      {linhagem.cabecaLinhagemInfo}
                    </div>
                  </div>
                </div>
              )}

              {/* História Completa */}
              <div>
                <h3 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-[#C5A059]" />
                  História
                </h3>
                <div className="space-y-4">
                  {linhagem.historiaCompleta.map((paragrafo, i) => (
                    <p key={i} className="text-zinc-400 leading-relaxed">
                      {paragrafo}
                    </p>
                  ))}
                </div>
              </div>

              {/* Factos Chave */}
              <div className="bg-[#C5A059]/5 border border-[#C5A059]/20 p-4">
                <h3 className="text-sm font-semibold text-[#C5A059] mb-3 flex items-center gap-2">
                  <Sparkles size={14} />
                  Factos Chave
                </h3>
                <ul className="space-y-2">
                  {linhagem.factosChave.map((facto, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-zinc-300"
                    >
                      <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full mt-1.5 flex-shrink-0" />
                      {facto}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab: Características */}
          {activeTab === "caracteristicas" && (
            <div className="space-y-8">
              {/* Morfologia */}
              <div>
                <h3 className="text-lg font-serif text-white mb-3">
                  Morfologia
                </h3>
                <ul className="grid md:grid-cols-2 gap-2">
                  {linhagem.caracteristicas.map((car, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-zinc-400"
                    >
                      <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                      {car}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Temperamento */}
              <div>
                <h3 className="text-lg font-serif text-white mb-3">
                  Temperamento
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {linhagem.temperamento}
                </p>
              </div>

              {/* Cores e Aptidões */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-serif text-white mb-3">
                    Cores Comuns
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {linhagem.coresComuns.map((cor) => (
                      <span
                        key={cor}
                        className="bg-zinc-800 text-zinc-300 px-3 py-1 text-sm"
                      >
                        {cor}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif text-white mb-3">
                    Aptidões
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {linhagem.aptidoes.map((apt) => (
                      <span
                        key={apt}
                        className="bg-[#C5A059]/10 text-[#C5A059] px-3 py-1 text-sm"
                      >
                        {apt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coudelarias */}
              {linhagem.coudelariasPrincipais.length > 0 && (
                <div>
                  <h3 className="text-lg font-serif text-white mb-3">
                    Coudelarias de Referência
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {linhagem.coudelariasPrincipais.map((coud) => (
                      <span
                        key={coud}
                        className="bg-zinc-800 text-zinc-300 px-3 py-1 text-sm"
                      >
                        {coud}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Cavalos Notáveis */}
          {activeTab === "cavalos" && (
            <div className="space-y-4">
              <h3 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
                <Award size={18} className="text-[#C5A059]" />
                Lusitanos Notáveis desta Linhagem
              </h3>
              {linhagem.cavalosNotaveis.length > 0 ? (
                <div className="space-y-4">
                  {linhagem.cavalosNotaveis.map((cavalo, i) => (
                    <div
                      key={i}
                      className="p-5 bg-zinc-800/50 border border-white/5"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Star
                          size={16}
                          className="text-[#C5A059] fill-[#C5A059]"
                        />
                        <span className="text-white font-serif text-lg">
                          {cavalo.nome}
                        </span>
                        {cavalo.ano && (
                          <span className="text-zinc-500 text-sm">
                            ({cavalo.ano})
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed pl-6">
                        {cavalo.conquistas}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  <Star size={32} className="mx-auto mb-3 opacity-30" />
                  <p>
                    Informação limitada sobre cavalos notáveis desta linhagem.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Timeline */}
          {activeTab === "timeline" && (
            <div className="space-y-4">
              <h3 className="text-lg font-serif text-white mb-4 flex items-center gap-2">
                <Clock size={18} className="text-[#C5A059]" />
                Momentos Históricos
              </h3>
              {linhagem.timeline.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800" />
                  <div className="space-y-4">
                    {linhagem.timeline
                      .sort((a, b) => a.ano - b.ano)
                      .map((evento, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-4 relative"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                              evento.destaque
                                ? "bg-[#C5A059] text-black"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {evento.destaque ? (
                              <Star size={14} />
                            ) : (
                              <Calendar size={14} />
                            )}
                          </div>
                          <div
                            className={`flex-1 ${
                              evento.destaque
                                ? "bg-[#C5A059]/10 border-[#C5A059]/30"
                                : "bg-zinc-800/30 border-zinc-800"
                            } border p-3`}
                          >
                            <span className="text-sm font-bold text-white">
                              {evento.ano}
                            </span>
                            <p
                              className={`text-sm ${
                                evento.destaque
                                  ? "text-zinc-300"
                                  : "text-zinc-400"
                              }`}
                            >
                              {evento.evento}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  <Clock size={32} className="mx-auto mb-3 opacity-30" />
                  <p>Timeline limitada para esta linhagem.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

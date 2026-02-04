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
    id: "1",
    nome: "Novilheiro",
    apelido: "O Fenómeno",
    anoNascimento: 1974,
    anoFalecimento: 1996,
    coudelaria: "Coudelaria Nacional",
    pelagem: "Ruço Rodado",
    altura: 162,
    disciplina: "Dressage",
    cavaleiro: "Ferdi Eilberg",
    linhagem: "Andrade",
    conquistas: [
      "Campeão Internacional de Dressage",
      "Vencedor de mais de 30 provas internacionais",
      "Primeiro Lusitano a competir ao mais alto nível internacional",
      "Prix St. Georges, Intermediário e Grand Prix",
      "Revolucionou a imagem do Lusitano na Europa"
    ],
    descricao: "Novilheiro revolucionou a percepção do cavalo Lusitano no mundo da dressage internacional. Demonstrou que a raça podia competir ao mais alto nível, abrindo portas para gerações futuras de Lusitanos na disciplina.",
    curiosidades: [
      "Foi o primeiro Lusitano a alcançar o Grand Prix em competição internacional",
      "Mudou-se para Inglaterra onde teve uma carreira brilhante",
      "Considerado o 'embaixador' da raça Lusitana na Europa"
    ],
    destaque: true,
    legado: "Pioneiro que provou o potencial do Lusitano na dressage mundial",
    pedigree: {
      pai: { nome: "Navio", ano: 1967, coudelaria: "Coudelaria Nacional" },
      mae: { nome: "Hortênsia II", ano: 1965, coudelaria: "Coudelaria Nacional" },
      avoPaterno: { nome: "Firme III", ano: 1958 },
      avoMaterno: { nome: "Distinto", ano: 1955 },
      avoaPaterna: { nome: "Navarra", ano: 1960 },
      avoaMaterna: { nome: "Camponesa", ano: 1957 }
    },
    estatisticasDescendentes: {
      totalDescendentes: 127,
      descendentesAprovados: 89,
      campeoes: 23,
      reprodutoresAtivos: 12,
      paisesComDescendentes: ["Portugal", "Reino Unido", "Alemanha", "França", "Brasil"],
      melhoresFilhos: [
        { nome: "Navigator", conquista: "Campeão Ibérico" },
        { nome: "Nobre Star", conquista: "Grand Prix Internacional" }
      ]
    },
    historicoPerformance: [
      { ano: 1978, evento: "Debut Nacional", resultado: "Vencedor", destaque: true },
      { ano: 1980, evento: "Campeonato Ibérico", resultado: "Ouro", pontuacao: 72.5, destaque: true },
      { ano: 1982, evento: "Prix St. Georges Internacional", resultado: "Vencedor", pontuacao: 68.4 },
      { ano: 1984, evento: "Intermediário I", resultado: "2º Lugar", pontuacao: 66.8 },
      { ano: 1986, evento: "Grand Prix Goodwood", resultado: "Vencedor", pontuacao: 70.2, destaque: true },
      { ano: 1988, evento: "CDI*** Birmingham", resultado: "Vencedor", pontuacao: 71.8 },
      { ano: 1990, evento: "Final de Carreira", resultado: "Homenagem", destaque: true }
    ],
    indiceReproducao: {
      scorePrepotencia: 87,
      consistenciaTipo: 82,
      taxaAprovacao: 70,
      caracteristicasDominantes: ["Elevação natural", "Temperamento", "Pelagem ruça", "Facilidade de recolhimento"],
      blupEstimado: 118
    },
    influenciaGenetica: 4.2
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
  {
    id: "3",
    nome: "Icaro",
    anoNascimento: 1959,
    anoFalecimento: 1981,
    coudelaria: "Coudelaria Nacional",
    pelagem: "Castanho",
    altura: 160,
    disciplina: "Toureio a Cavalo",
    linhagem: "Veiga",
    conquistas: [
      "Considerado um dos melhores cavalos de toureio de todos os tempos",
      "Lendário na arte equestre tauromáquica",
      "Referência genética para gerações de cavalos de toureio",
      "Símbolo da bravura e inteligência Lusitana"
    ],
    descricao: "Icaro é considerado um dos maiores cavalos de toureio da história de Portugal. A sua bravura, agilidade e inteligência tornaram-no uma lenda viva da tauromaquia portuguesa.",
    curiosidades: [
      "A sua linhagem ainda hoje é procurada para toureio",
      "Considerado inigualável na proximidade ao touro"
    ],
    destaque: false,
    legado: "Lenda imortal do toureio a cavalo português",
    pedigree: {
      pai: { nome: "Hábil", ano: 1950, coudelaria: "Coudelaria Veiga", destaque: true },
      mae: { nome: "Gavina", ano: 1952, coudelaria: "Coudelaria Nacional" },
      avoPaterno: { nome: "Cartujano", ano: 1942 },
      avoMaterno: { nome: "Destinado", ano: 1944 }
    },
    indiceReproducao: {
      scorePrepotencia: 94,
      consistenciaTipo: 88,
      taxaAprovacao: 78,
      caracteristicasDominantes: ["Bravura", "Agilidade", "Inteligência", "Força de posteriores"],
      blupEstimado: 125
    },
    estatisticasDescendentes: {
      totalDescendentes: 215,
      descendentesAprovados: 168,
      campeoes: 47,
      reprodutoresAtivos: 8,
      paisesComDescendentes: ["Portugal", "Espanha", "França", "México"],
      melhoresFilhos: [
        { nome: "Icaro II", conquista: "Lenda do Toureio" },
        { nome: "Icar", conquista: "Múltiplo Campeão" }
      ]
    },
    influenciaGenetica: 8.5
  },
  {
    id: "4",
    nome: "Oxidado",
    anoNascimento: 1979,
    anoFalecimento: 2004,
    coudelaria: "Coudelaria Veiga",
    pelagem: "Ruço Pombo",
    altura: 163,
    disciplina: "Reprodução / Dressage",
    linhagem: "Veiga",
    conquistas: [
      "Reprodutor de exceção com mais de 300 descendentes",
      "Pai de múltiplos campeões nacionais e internacionais",
      "Linha genética presente em 5 continentes",
      "Considerado um dos 'Grandes Reprodutores' do século XX"
    ],
    descricao: "Oxidado foi um dos reprodutores mais influentes da história moderna do Lusitano. Os seus descendentes espalharam-se pelo mundo, elevando o padrão da raça em múltiplas disciplinas.",
    curiosidades: [
      "O seu sémen foi exportado para mais de 20 países",
      "Produziu campeões em dressage, toureio e trabalho"
    ],
    destaque: true,
    legado: "Um dos reprodutores mais influentes da história do Lusitano",
    pedigree: {
      pai: { nome: "Nilo", ano: 1970, coudelaria: "Coudelaria Veiga", destaque: true },
      mae: { nome: "Oculta", ano: 1972, coudelaria: "Coudelaria Veiga" },
      avoPaterno: { nome: "Hostil", ano: 1962 },
      avoMaterno: { nome: "Novilho", ano: 1964, destaque: true }
    },
    indiceReproducao: {
      scorePrepotencia: 96,
      consistenciaTipo: 91,
      taxaAprovacao: 82,
      caracteristicasDominantes: ["Morfologia clássica", "Pelagem ruça", "Temperamento dócil", "Andamentos elevados"],
      blupEstimado: 132
    },
    estatisticasDescendentes: {
      totalDescendentes: 347,
      descendentesAprovados: 284,
      campeoes: 78,
      reprodutoresAtivos: 34,
      paisesComDescendentes: ["Portugal", "Espanha", "Brasil", "EUA", "França", "Alemanha", "México", "Austrália"],
      melhoresFilhos: [
        { nome: "Oxalá", conquista: "Campeão do Mundo" },
        { nome: "Opus", conquista: "Grande Reprodutor" },
        { nome: "Ofensor", conquista: "Pai de Opus 72" }
      ]
    },
    historicoPerformance: [
      { ano: 1983, evento: "Aprovação APSL", resultado: "Excelente", pontuacao: 78, destaque: true },
      { ano: 1985, evento: "Campeonato Morfológico", resultado: "Campeão", destaque: true },
      { ano: 1990, evento: "1000 Descendentes", resultado: "Marco Histórico", destaque: true },
      { ano: 2000, evento: "Reconhecimento APSL", resultado: "Grande Reprodutor", destaque: true }
    ],
    influenciaGenetica: 12.4
  },
  {
    id: "5",
    nome: "Rubi AR",
    anoNascimento: 2004,
    coudelaria: "Coudelaria Artur Ramos",
    pelagem: "Castanho",
    altura: 167,
    disciplina: "Dressage",
    cavaleiro: "Rafael Soto (ESP)",
    linhagem: "Alter Real / Veiga",
    conquistas: [
      "Finalista nos Jogos Olímpicos de Tóquio 2020",
      "Grand Prix vencedor internacional",
      "Um dos Lusitanos mais pontuados da história",
      "Múltiplo vencedor de CDI5*",
      "Recordista de pontuação em Freestyle"
    ],
    descricao: "Rubi AR representa o auge moderno do Lusitano na dressage internacional. Sob a sela de Rafael Soto, alcançou pontuações históricas e competiu ao mais alto nível mundial.",
    curiosidades: [
      "Atingiu 80%+ em Grand Prix Freestyle",
      "Primeiro Lusitano espanhol em finais olímpicas"
    ],
    destaque: true,
    legado: "Estrela contemporânea que mantém vivo o legado do Lusitano",
    pedigree: {
      pai: { nome: "Rico AR", ano: 1996, coudelaria: "Coudelaria Artur Ramos", destaque: true },
      mae: { nome: "Verbena AR", ano: 1998, coudelaria: "Coudelaria Artur Ramos" },
      avoPaterno: { nome: "Ofensor", ano: 1990, destaque: true },
      avoMaterno: { nome: "Xaquiro", ano: 1986 }
    },
    historicoPerformance: [
      { ano: 2012, evento: "Debut Internacional", resultado: "Vencedor", pontuacao: 70.2, destaque: true },
      { ano: 2014, evento: "CDI4* Jerez", resultado: "Vencedor", pontuacao: 73.5 },
      { ano: 2016, evento: "CDI5* Madrid", resultado: "2º Lugar", pontuacao: 74.8 },
      { ano: 2018, evento: "WEG Tryon", resultado: "Top 20", pontuacao: 72.1, destaque: true },
      { ano: 2019, evento: "CDI5* Salzburg", resultado: "Vencedor", pontuacao: 77.4, destaque: true },
      { ano: 2021, evento: "Jogos Olímpicos Tóquio", resultado: "Finalista", pontuacao: 75.6, destaque: true },
      { ano: 2023, evento: "Última Competição", resultado: "Homenagem", destaque: true }
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
    id: "6",
    nome: "Quo Vadis",
    anoNascimento: 1983,
    anoFalecimento: 2008,
    coudelaria: "Coudelaria Nacional",
    pelagem: "Ruço",
    altura: 164,
    disciplina: "Dressage",
    cavaleiro: "Miguel Ralão Duarte",
    linhagem: "Andrade",
    conquistas: [
      "Campeão Nacional de Dressage múltiplas vezes",
      "Medalhas em competições ibéricas",
      "Inspiração para cavaleiros portugueses",
      "Reprodutor de qualidade"
    ],
    descricao: "Quo Vadis foi um dos cavalos mais carismáticos da dressage portuguesa dos anos 90. A sua elegância e movimentos expressivos encantaram públicos e juízes.",
    destaque: false,
    legado: "Símbolo da elegância lusitana na dressage nacional",
    pedigree: {
      pai: { nome: "Qualificado", ano: 1975, coudelaria: "Coudelaria Nacional" },
      mae: { nome: "Verbena", ano: 1977, coudelaria: "Coudelaria Nacional" },
      avoPaterno: { nome: "Firme", ano: 1967 },
      avoMaterno: { nome: "Navio", ano: 1967, destaque: true }
    },
    indiceReproducao: {
      scorePrepotencia: 74,
      consistenciaTipo: 79,
      taxaAprovacao: 68,
      caracteristicasDominantes: ["Elegância", "Expressão", "Carisma"],
      blupEstimado: 108
    },
    estatisticasDescendentes: {
      totalDescendentes: 89,
      descendentesAprovados: 61,
      campeoes: 14,
      reprodutoresAtivos: 3,
      paisesComDescendentes: ["Portugal", "Espanha", "Brasil"],
      melhoresFilhos: [
        { nome: "Quimera", conquista: "Campeã Nacional" }
      ]
    },
    influenciaGenetica: 3.1
  },
  {
    id: "7",
    nome: "Hábil",
    anoNascimento: 1950,
    anoFalecimento: 1975,
    coudelaria: "Coudelaria Veiga",
    pelagem: "Castanho Escuro",
    altura: 159,
    disciplina: "Toureio / Reprodução",
    linhagem: "Veiga",
    conquistas: [
      "Fundador da linha Veiga moderna",
      "Pai de Icaro e outros campeões",
      "Considerado o 'Patriarca' da linhagem",
      "Mais de 200 descendentes aprovados"
    ],
    descricao: "Hábil é considerado o fundador da linha Veiga tal como a conhecemos hoje. A sua influência genética estende-se por praticamente todos os cavalos de sangue Veiga atuais.",
    destaque: true,
    legado: "O Patriarca - fundador da linhagem Veiga moderna",
    pedigree: {
      pai: { nome: "Cartujano", ano: 1942, coudelaria: "Coudelaria Veiga", destaque: true },
      mae: { nome: "Destinada", ano: 1944, coudelaria: "Coudelaria Veiga" }
    },
    indiceReproducao: {
      scorePrepotencia: 98,
      consistenciaTipo: 94,
      taxaAprovacao: 85,
      caracteristicasDominantes: ["Tipo clássico", "Força", "Temperamento equilibrado", "Funcionalidade"],
      blupEstimado: 145
    },
    estatisticasDescendentes: {
      totalDescendentes: 456,
      descendentesAprovados: 387,
      campeoes: 124,
      reprodutoresAtivos: 0,
      paisesComDescendentes: ["Portugal", "Espanha", "Brasil", "EUA", "França", "Alemanha", "México", "Argentina"],
      melhoresFilhos: [
        { nome: "Icaro", conquista: "Lenda do Toureio" },
        { nome: "Hostil", conquista: "Grande Reprodutor" },
        { nome: "Himalaia", conquista: "Campeão Morfológico" }
      ]
    },
    influenciaGenetica: 18.7
  },
  {
    id: "8",
    nome: "Euclides",
    anoNascimento: 1987,
    anoFalecimento: 2015,
    coudelaria: "Coudelaria Manuel Tavares Veiga",
    pelagem: "Ruço",
    altura: 162,
    disciplina: "Dressage / Reprodução",
    linhagem: "Veiga",
    conquistas: [
      "Grande Campeão APSL 1992",
      "Reprodutor de Elite",
      "Pai de cavalos olímpicos",
      "Linhagem presente em todo o mundo"
    ],
    descricao: "Euclides combinou a tradição Veiga com modernidade, produzindo descendentes que se destacaram tanto em competição quanto em reprodução.",
    curiosidades: [
      "Sémen exportado para mais de 15 países",
      "Pai de 3 cavalos que competiram em Jogos Olímpicos"
    ],
    destaque: false,
    legado: "Ponte entre a tradição Veiga e a dressage moderna",
    pedigree: {
      pai: { nome: "Destinado II", ano: 1978, coudelaria: "Coudelaria Veiga", destaque: true },
      mae: { nome: "Elegante", ano: 1980, coudelaria: "Coudelaria MTV" },
      avoPaterno: { nome: "Nilo", ano: 1970, destaque: true }
    },
    indiceReproducao: {
      scorePrepotencia: 88,
      consistenciaTipo: 84,
      taxaAprovacao: 76,
      caracteristicasDominantes: ["Andamentos", "Tipo", "Caráter", "Elevação"],
      blupEstimado: 128
    },
    estatisticasDescendentes: {
      totalDescendentes: 234,
      descendentesAprovados: 178,
      campeoes: 52,
      reprodutoresAtivos: 18,
      paisesComDescendentes: ["Portugal", "Espanha", "Brasil", "EUA", "França", "Holanda"],
      melhoresFilhos: [
        { nome: "Escorial", conquista: "Campeão Europeu" },
        { nome: "Elegido", conquista: "Grande Reprodutor" }
      ]
    },
    influenciaGenetica: 7.2
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

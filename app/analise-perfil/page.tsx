"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Image from "next/image";

import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  RotateCcw,
  MapPin,
  Star,
  Award,
  Target,
  Heart,
  Compass,
  Users,
  Clock,
  Sparkles,
  Trophy,
  TrendingUp,
  Shield,
  Zap,
  BookOpen,
  DollarSign,
  Check,
  Activity,
  Feather,
  Crown,
  TreeDeciduous,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Medal,
  Share2,
  Save,
  Building,
  UserCheck,
  ClipboardCheck,
  Download,
  MessageCircle,
  Facebook,
  Instagram,
  Link as LinkIcon,
  FileDown,
  Calendar,
  HelpCircle,
  Quote,
  BarChart3,
  ChevronUp,
  Play,
  Percent,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Question {
  id: number;
  category: string;
  question: string;
  description?: string;
  icon: React.ReactNode;
  weight: number;
  options: {
    text: string;
    description?: string;
    value: string;
    traits: string[];
    points: Record<string, number>;
  }[];
}

interface FamousHorse {
  name: string;
  achievement: string;
}

interface QuoteItem {
  author: string;
  role: string;
  quote: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface TimelineItem {
  month: string;
  title: string;
  description: string;
}

interface Result {
  profile: string;
  title: string;
  subtitle: string;
  description: string;
  characteristics: string[];
  idealHorse: {
    age: string;
    height: string;
    training: string;
    temperament: string;
    priceRange: string;
  };
  annualCosts: {
    min: number;
    max: number;
    includes: string[];
  };
  recommendedRegions: string[];
  linhagens: { name: string; reason: string }[];
  disciplinas: string[];
  famousHorses: FamousHorse[];
  tips: string[];
  nextSteps: string[];
  icon: React.ReactNode;
  color: string;
  quotes: QuoteItem[];
  faq: FAQItem[];
  timeline: TimelineItem[];
}

const questions: Question[] = [
  {
    id: 1,
    category: "Objectivo",
    question: "Qual e o seu principal objectivo com o cavalo Lusitano?",
    description: "Esta e a pergunta mais importante para definir o seu perfil.",
    icon: <Target className="text-[#C5A059]" size={28} />,
    weight: 2,
    options: [
      { text: "Alta Competicao de Dressage", description: "Participacao em provas FEI, CDI, ou campeonatos nacionais/internacionais", value: "dressage_comp", traits: ["competicao", "elegancia", "treino_avancado"], points: { competidor: 10, tradicional: 2, criador: 4, amador: 1 } },
      { text: "Equitacao de Trabalho", description: "Provas de equitacao de trabalho, tenta, campo, ou toureio", value: "trabalho", traits: ["tradicao", "versatilidade", "robustez"], points: { competidor: 3, tradicional: 10, criador: 3, amador: 2 } },
      { text: "Dressage de Lazer / Escola", description: "Aprendizagem, evolucao tecnica, ou dressage recreativo", value: "escola", traits: ["aprendizagem", "progressao", "escola"], points: { competidor: 4, tradicional: 3, criador: 2, amador: 8 } },
      { text: "Reproducao e Criacao", description: "Programa de criacao, melhoramento genetico, ou preservacao de linhagens", value: "criacao", traits: ["genetica", "linhagem", "morfologia"], points: { competidor: 2, tradicional: 3, criador: 10, amador: 1 } },
    ],
  },
  {
    id: 2,
    category: "Experiencia",
    question: "Qual e o seu nivel de experiencia equestre?",
    description: "Avaliamos a sua capacidade tecnica para adequar a escolha do cavalo.",
    icon: <GraduationCap className="text-[#C5A059]" size={28} />,
    weight: 1.5,
    options: [
      { text: "Iniciante (ate 2 anos)", description: "A dar os primeiros passos na equitacao", value: "iniciante", traits: ["calmo", "seguro", "docil"], points: { competidor: 0, tradicional: 3, criador: 1, amador: 10 } },
      { text: "Intermedio (2-5 anos)", description: "Domina os basicos, esta a evoluir tecnicamente", value: "intermedio", traits: ["versatil", "equilibrado"], points: { competidor: 4, tradicional: 6, criador: 3, amador: 7 } },
      { text: "Avancado (5-10 anos)", description: "Cavaleiro experiente com tecnica consolidada", value: "avancado", traits: ["desafiante", "sensivel"], points: { competidor: 8, tradicional: 7, criador: 5, amador: 4 } },
      { text: "Profissional / Competidor", description: "Trabalha profissionalmente ou compete a nivel nacional/internacional", value: "profissional", traits: ["competicao", "alto_nivel", "elite"], points: { competidor: 10, tradicional: 5, criador: 6, amador: 1 } },
    ],
  },
  {
    id: 3,
    category: "Temperamento",
    question: "Que tipo de temperamento prefere num cavalo?",
    description: "O temperamento e crucial para a harmonia cavaleiro-cavalo.",
    icon: <Heart className="text-[#C5A059]" size={28} />,
    weight: 1.5,
    options: [
      { text: "Muito calmo e previsivel", description: "Ideal para quem valoriza seguranca e confianca", value: "muito_calmo", traits: ["calmo", "docil", "seguro"], points: { competidor: 1, tradicional: 5, criador: 2, amador: 10 } },
      { text: "Equilibrado e cooperativo", description: "Cavalo sensato, trabalhador, com boa predisposicao", value: "equilibrado", traits: ["equilibrado", "cooperativo"], points: { competidor: 6, tradicional: 8, criador: 5, amador: 7 } },
      { text: "Sensivel e reactivo", description: "Responde rapidamente as ajudas, requer mao experiente", value: "sensivel", traits: ["sensivel", "reactivo", "expressivo"], points: { competidor: 9, tradicional: 4, criador: 6, amador: 2 } },
      { text: "Sangue quente, muita energia", description: "Cavalo com presenca, brio, e vontade de trabalhar", value: "quente", traits: ["quente", "brio", "presenca"], points: { competidor: 10, tradicional: 3, criador: 4, amador: 1 } },
    ],
  },
  {
    id: 4,
    category: "Morfologia",
    question: "Que caracteristicas fisicas mais valoriza?",
    description: "A morfologia do Lusitano reflecte a sua aptidao funcional.",
    icon: <Activity className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      { text: "Movimentos elevados e expressivos", description: "Cadencia, suspensao, elasticidade - para dressage de alto nivel", value: "movimentos", traits: ["movimentos", "elegancia", "dressage"], points: { competidor: 10, tradicional: 2, criador: 6, amador: 3 } },
      { text: "Estrutura forte e compacta", description: "Robustez, ossatura solida - para trabalho de campo", value: "robusto", traits: ["robusto", "forte", "resistente"], points: { competidor: 3, tradicional: 10, criador: 5, amador: 4 } },
      { text: "Beleza e tipicidade da raca", description: "Cabeca expressiva, pescoco arqueado, proporcoes harmoniosas", value: "beleza", traits: ["beleza", "tipicidade", "morfologia"], points: { competidor: 5, tradicional: 5, criador: 10, amador: 5 } },
      { text: "Conforto e facilidade", description: "Andamentos comodos, facil de montar", value: "conforto", traits: ["confortavel", "facil", "lazer"], points: { competidor: 2, tradicional: 4, criador: 2, amador: 10 } },
    ],
  },
  {
    id: 5,
    category: "Genetica",
    question: "Qual a importancia da linhagem e genetica para si?",
    description: "O Puro Sangue Lusitano possui linhagens historicas distintas.",
    icon: <TreeDeciduous className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      { text: "Fundamental - so com pedigree de elite", description: "Linhagem comprovada com ancestrais de merito reconhecido", value: "elite", traits: ["linhagem_elite", "pedigree"], points: { competidor: 6, tradicional: 4, criador: 10, amador: 1 } },
      { text: "Importante - valorizo boas origens", description: "Prefiro cavalos com pedigree interessante", value: "importante", traits: ["linhagem", "origens"], points: { competidor: 7, tradicional: 6, criador: 8, amador: 3 } },
      { text: "Relevante mas nao decisivo", description: "Considero o pedigree mas o cavalo individual e mais importante", value: "relevante", traits: ["individuo"], points: { competidor: 5, tradicional: 7, criador: 4, amador: 5 } },
      { text: "Pouco importante", description: "O que importa e o cavalo que esta a minha frente", value: "pouco", traits: ["pratico", "funcional"], points: { competidor: 3, tradicional: 5, criador: 1, amador: 8 } },
    ],
  },
  {
    id: 6,
    category: "Treino",
    question: "Que nivel de treino prefere no cavalo?",
    description: "Cavalos treinados custam mais mas oferecem resultados imediatos.",
    icon: <TrendingUp className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      { text: "Desbravado / Inicio de trabalho", description: "Cavalo jovem para desenvolver e treinar do zero", value: "desbravado", traits: ["jovem", "potencial"], points: { competidor: 7, tradicional: 5, criador: 8, amador: 2 } },
      { text: "Trabalho basico (nivel E/F)", description: "Ja sabe os basicos, pronto para evoluir", value: "basico", traits: ["basico", "progressao"], points: { competidor: 5, tradicional: 6, criador: 4, amador: 7 } },
      { text: "Trabalho medio (nivel M/S)", description: "Domina exercicios intermedios, trabalho lateral", value: "medio", traits: ["treinado", "medio"], points: { competidor: 8, tradicional: 4, criador: 3, amador: 5 } },
      { text: "Alta Escola / GP", description: "Cavalo de competicao feito, domina exercicios de Grand Prix", value: "gp", traits: ["gp", "alta_escola", "elite"], points: { competidor: 10, tradicional: 2, criador: 2, amador: 1 } },
    ],
  },
  {
    id: 7,
    category: "Investimento",
    question: "Qual e o seu orcamento para aquisicao?",
    description: "O preco reflecte treino, linhagem, idade e potencial.",
    icon: <DollarSign className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      { text: "Ate 15.000 euros", description: "Poldros, cavalos jovens, ou cavalos de lazer", value: "economico", traits: ["acessivel", "entrada"], points: { competidor: 1, tradicional: 5, criador: 6, amador: 10 } },
      { text: "15.000 - 35.000 euros", description: "Cavalos com treino basico a medio, bom potencial", value: "medio", traits: ["qualidade", "treinado"], points: { competidor: 4, tradicional: 8, criador: 5, amador: 7 } },
      { text: "35.000 - 75.000 euros", description: "Cavalos de competicao, reprodutores, qualidade superior", value: "alto", traits: ["premium", "competicao"], points: { competidor: 8, tradicional: 5, criador: 8, amador: 3 } },
      { text: "Acima de 75.000 euros", description: "Cavalos de elite, GP, reprodutores de topo", value: "premium", traits: ["elite", "excepcional", "topo"], points: { competidor: 10, tradicional: 3, criador: 10, amador: 1 } },
    ],
  },
  {
    id: 8,
    category: "Dedicacao",
    question: "Quanto tempo pode dedicar ao cavalo semanalmente?",
    description: "A disponibilidade influencia o tipo de cavalo ideal.",
    icon: <Clock className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      { text: "Diariamente (5-7 dias/semana)", description: "Dedicacao total, regime de treino intensivo", value: "diario", traits: ["competicao", "dedicado", "atleta"], points: { competidor: 10, tradicional: 6, criador: 5, amador: 3 } },
      { text: "Frequente (3-4 dias/semana)", description: "Treino regular com progressao consistente", value: "frequente", traits: ["ativo", "progresso"], points: { competidor: 7, tradicional: 8, criador: 4, amador: 6 } },
      { text: "Fins de semana (1-2 dias)", description: "Equitacao recreativa nos tempos livres", value: "weekend", traits: ["lazer", "familiar"], points: { competidor: 2, tradicional: 5, criador: 3, amador: 10 } },
      { text: "Proprietario ausente", description: "O cavalo ficara ao cuidado de profissionais", value: "ausente", traits: ["profissional", "delegado"], points: { competidor: 5, tradicional: 3, criador: 8, amador: 4 } },
    ],
  },
  {
    id: 9,
    category: "Regiao",
    question: "Em que regiao de Portugal procura o cavalo?",
    description: "Cada regiao tem tradicoes e especialidades distintas.",
    icon: <Compass className="text-[#C5A059]" size={28} />,
    weight: 0.5,
    options: [
      { text: "Ribatejo", description: "Coracao equestre de Portugal, tradicao secular", value: "ribatejo", traits: ["ribatejo", "tradicao"], points: { competidor: 7, tradicional: 10, criador: 8, amador: 5 } },
      { text: "Alentejo", description: "Grandes coudelarias, tradicao de campo", value: "alentejo", traits: ["alentejo", "coudelaria"], points: { competidor: 6, tradicional: 9, criador: 9, amador: 4 } },
      { text: "Lisboa / Centro", description: "Proximidade urbana, facilidade de acesso", value: "lisboa", traits: ["lisboa", "acessivel"], points: { competidor: 5, tradicional: 4, criador: 4, amador: 8 } },
      { text: "Qualquer regiao / Internacional", description: "O importante e a qualidade, nao a localizacao", value: "qualquer", traits: ["flexivel", "internacional"], points: { competidor: 8, tradicional: 5, criador: 7, amador: 6 } },
    ],
  },
  {
    id: 10,
    category: "Visao",
    question: "Onde se ve daqui a 5 anos com este cavalo?",
    description: "Visionar o futuro ajuda a fazer a escolha certa hoje.",
    icon: <Sparkles className="text-[#C5A059]" size={28} />,
    weight: 1.5,
    options: [
      { text: "A competir a nivel internacional", description: "CDI, Campeonatos da Europa, Jogos Olimpicos", value: "internacional", traits: ["internacional", "elite"], points: { competidor: 10, tradicional: 2, criador: 3, amador: 0 } },
      { text: "A competir a nivel nacional", description: "Campeonatos nacionais, provas FEP, rankings", value: "nacional", traits: ["nacional", "competicao"], points: { competidor: 8, tradicional: 6, criador: 4, amador: 2 } },
      { text: "A evoluir nas licoes e progredir", description: "Melhorar tecnicamente, talvez competir a nivel regional", value: "evolucao", traits: ["evolucao", "escola"], points: { competidor: 4, tradicional: 5, criador: 3, amador: 8 } },
      { text: "A criar uma familia de cavalos", description: "Programa de criacao, eguas de ventre, potros", value: "criacao", traits: ["criacao", "reproducao"], points: { competidor: 2, tradicional: 4, criador: 10, amador: 3 } },
    ],
  },
  {
    id: 11,
    category: "Infraestrutura",
    question: "Que infraestrutura tem disponivel para o cavalo?",
    description: "As instalacoes influenciam o tipo de cavalo adequado.",
    icon: <Building className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      { text: "Centro hipico completo", description: "Picadeiro coberto, pista exterior, paddocks, boxes de luxo", value: "completo", traits: ["profissional", "premium"], points: { competidor: 10, tradicional: 5, criador: 7, amador: 4 } },
      { text: "Pensao em centro hipico", description: "Box em centro hipico com servicos basicos", value: "pensao", traits: ["acessivel", "conveniente"], points: { competidor: 6, tradicional: 6, criador: 3, amador: 8 } },
      { text: "Instalacoes proprias basicas", description: "Box e paddock proprios, sem picadeiro", value: "proprio_basico", traits: ["independente", "tradicional"], points: { competidor: 3, tradicional: 9, criador: 6, amador: 5 } },
      { text: "Coudelaria / Propriedade rural", description: "Grande propriedade com multiplas instalacoes", value: "coudelaria", traits: ["criador", "extensivo"], points: { competidor: 5, tradicional: 7, criador: 10, amador: 2 } },
    ],
  },
  {
    id: 12,
    category: "Experiencia Proprietario",
    question: "Qual e a sua experiencia como proprietario de cavalos?",
    description: "Ser proprietario implica responsabilidades alem da equitacao.",
    icon: <UserCheck className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      { text: "Primeiro cavalo", description: "Nunca fui proprietario, sera a minha primeira experiencia", value: "primeiro", traits: ["novato", "aprendizagem"], points: { competidor: 2, tradicional: 4, criador: 1, amador: 10 } },
      { text: "Ja tive 1-2 cavalos", description: "Tenho alguma experiencia como proprietario", value: "alguma", traits: ["experiencia", "autonomo"], points: { competidor: 5, tradicional: 7, criador: 4, amador: 7 } },
      { text: "Proprietario experiente", description: "Ja tive varios cavalos ao longo dos anos", value: "experiente", traits: ["experiente", "conhecedor"], points: { competidor: 8, tradicional: 8, criador: 6, amador: 4 } },
      { text: "Criador / Multiplos cavalos", description: "Tenho ou ja tive multiplos cavalos, possivelmente criacao", value: "criador", traits: ["profissional", "criador"], points: { competidor: 6, tradicional: 6, criador: 10, amador: 2 } },
    ],
  },
  {
    id: 13,
    category: "Apoio Profissional",
    question: "Que acompanhamento profissional tera disponivel?",
    description: "O suporte tecnico e essencial para o sucesso.",
    icon: <Users className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      { text: "Treinador de alta competicao", description: "Acompanhamento regular com treinador de nivel internacional", value: "treinador_top", traits: ["elite", "competicao"], points: { competidor: 10, tradicional: 3, criador: 4, amador: 2 } },
      { text: "Instrutor / Treinador regular", description: "Licoes semanais com instrutor qualificado", value: "instrutor", traits: ["apoio", "progressao"], points: { competidor: 6, tradicional: 6, criador: 4, amador: 8 } },
      { text: "Apoio pontual", description: "Consulto profissionais quando necessario", value: "pontual", traits: ["autonomo", "independente"], points: { competidor: 4, tradicional: 8, criador: 5, amador: 5 } },
      { text: "Rede completa", description: "Treinador, veterinario, ferrador, nutricionista equino", value: "completo", traits: ["profissional", "dedicado"], points: { competidor: 9, tradicional: 5, criador: 8, amador: 3 } },
    ],
  },
  {
    id: 14,
    category: "Ambicoes Competitivas",
    question: "Se compete ou pretende competir, a que nivel aspira?",
    description: "Os objectivos competitivos definem o tipo de cavalo necessario.",
    icon: <Medal className="text-[#C5A059]" size={28} />,
    weight: 1.5,
    options: [
      { text: "Nao pretendo competir", description: "O meu foco e lazer, aprendizagem, ou criacao", value: "sem_competicao", traits: ["lazer", "recreativo"], points: { competidor: 0, tradicional: 5, criador: 6, amador: 10 } },
      { text: "Provas regionais / Ensino social", description: "Competir a nivel local para ganhar experiencia", value: "regional", traits: ["entrada", "local"], points: { competidor: 4, tradicional: 7, criador: 3, amador: 6 } },
      { text: "Campeonatos nacionais", description: "Objectivo de ranking nacional, provas FEP", value: "nacional", traits: ["nacional", "ranking"], points: { competidor: 8, tradicional: 5, criador: 4, amador: 2 } },
      { text: "Competicao internacional (CDI/CDIO)", description: "Provas FEI, CDI, potencial seleccao nacional", value: "internacional", traits: ["internacional", "elite"], points: { competidor: 10, tradicional: 2, criador: 3, amador: 0 } },
    ],
  },
  {
    id: 15,
    category: "Saude e Garantias",
    question: "Que exigencias tem em termos de saude e garantias?",
    description: "Os requisitos veterinarios protegem o seu investimento.",
    icon: <Stethoscope className="text-[#C5A059]" size={28} />,
    weight: 1,
    options: [
      { text: "Exame veterinario completo", description: "RX a todos os membros, analises, exame clinico detalhado", value: "completo", traits: ["rigoroso", "investimento"], points: { competidor: 10, tradicional: 5, criador: 7, amador: 4 } },
      { text: "Exame basico + RX principais", description: "Exame clinico e RX as areas mais criticas", value: "basico", traits: ["prudente", "equilibrado"], points: { competidor: 7, tradicional: 7, criador: 6, amador: 6 } },
      { text: "Confio no historico e vendedor", description: "Se a coudelaria e de confianca, basta exame basico", value: "confianca", traits: ["confiante", "relacional"], points: { competidor: 3, tradicional: 8, criador: 5, amador: 7 } },
      { text: "Testes geneticos obrigatorios", description: "WFFS, CA, outros defeitos geneticos testados", value: "genetico", traits: ["genetica", "rigoroso"], points: { competidor: 5, tradicional: 4, criador: 10, amador: 3 } },
    ],
  },
];

const results: Record<string, Result> = {
  competidor: {
    profile: "competidor",
    title: "Competidor de Elite",
    subtitle: "Foco em Alta Performance",
    description: "O seu perfil indica um cavaleiro orientado para resultados, com ambicao de competir ao mais alto nivel. Procura um cavalo atleta, com movimentos expressivos, presenca em pista, e capacidade de brilhar sob pressao.",
    characteristics: ["Movimentos expressivos e elasticos", "Sangue competitivo e presenca", "Alta trainabilidade", "Capacidade para Grand Prix", "Genetica de performance comprovada", "Conformacao atletica"],
    idealHorse: { age: "6-12 anos (feito) ou 3-5 anos (projecto)", height: "1.62m - 1.72m", training: "Nivel S/GP ou potencial comprovado", temperament: "Sensivel, reactivo, com brio controlado", priceRange: "45.000 - 250.000+ euros" },
    annualCosts: { min: 20000, max: 50000, includes: ["Pensao em centro de alta competicao", "Treinador de nivel internacional", "Veterinario desportivo regular", "Ferracao especializada", "Inscricoes em provas CDI/CDN", "Transporte para competicoes", "Seguro de valor elevado", "Suplementacao premium"] },
    recommendedRegions: ["Ribatejo", "Alentejo", "Internacional"],
    linhagens: [{ name: "Veiga", reason: "Reconhecida pelos movimentos expressivos e elegancia" }, { name: "Alter Real", reason: "Tradicao real, seleccao para funcionalidade de elite" }, { name: "Coudelaria Nacional", reason: "Genetica testada em competicao internacional" }],
    disciplinas: ["Dressage FEI", "Grand Prix", "Grand Prix Special", "Freestyle/Kur", "CDI Internacional"],
    famousHorses: [{ name: "Rubi AR", achievement: "Jogos Olimpicos Londres 2012 com Gonçalo Carvalho" }, { name: "Oxidado", achievement: "Campeonatos da Europa com Daniel Pinto" }, { name: "Fogoso", achievement: "Lenda do Dressage Portugues" }, { name: "Euclides MOR", achievement: "Top mundial com Rodrigo Torres" }],
    tips: ["Invista num exame veterinario completo com RX", "Veja o cavalo trabalhar varias vezes", "Considere o custo total anual", "Procure referencias da coudelaria", "Avalie o potencial de evolucao", "Considere um periodo de experiencia"],
    nextSteps: ["Consultar coudelarias especializadas em competicao", "Contactar cavaleiros profissionais", "Visitar Golega na Feira Nacional do Cavalo", "Assistir a provas CDI", "Definir orcamento total"],
    icon: <Trophy className="text-[#C5A059]" size={48} />,
    color: "from-amber-500/20",
    quotes: [
      { author: "Nuno Oliveira", role: "Mestre de Equitacao", quote: "A arte equestre e um dialogo silencioso entre cavalo e cavaleiro, onde a harmonia e o objectivo supremo." },
      { author: "Rodrigo Torres", role: "Cavaleiro Olimpico", quote: "O Lusitano tem uma capacidade unica de se entregar ao trabalho com coracao e inteligencia." },
      { author: "Miguel Ralao Duarte", role: "Cavaleiro Internacional", quote: "Na alta competicao, cada detalhe conta. O cavalo certo faz toda a diferenca." },
    ],
    faq: [
      { question: "Quanto tempo leva a formar um cavalo de GP?", answer: "Um cavalo bem formado demora 6-8 anos desde o desbaste ate ao Grand Prix. Alguns talentos excepcionais podem chegar mais cedo, mas a paciencia e fundamental." },
      { question: "Vale a pena comprar um cavalo jovem ou feito?", answer: "Depende da sua experiencia e objectivos. Um cavalo feito da resultados imediatos mas custa mais. Um jovem e um projecto com risco mas potencial de valorizacao." },
      { question: "Qual a idade ideal para competir em CDI?", answer: "Cavalos entre 8-14 anos estao tipicamente no auge. Alguns mantem alto nivel ate aos 18 anos com gestao adequada." },
      { question: "Preciso de treinador desde o inicio?", answer: "Absolutamente. Na alta competicao, o acompanhamento profissional e essencial para evoluir e corrigir problemas antes que se instalem." },
      { question: "Quanto custa manter um cavalo de competicao?", answer: "Entre 20.000 e 50.000 euros anuais, incluindo pensao premium, treinador, veterinario desportivo, competicoes e transporte." },
    ],
    timeline: [
      { month: "Mes 1-2", title: "Pesquisa e Definicao", description: "Definir orcamento total, visitar coudelarias, estabelecer criterios de seleccao e contactar profissionais." },
      { month: "Mes 3-4", title: "Seleccao e Testes", description: "Experimentar cavalos pre-seleccionados, ver videos, solicitar historicos veterinarios e de competicao." },
      { month: "Mes 5-6", title: "Decisao e Exames", description: "Escolher o cavalo, realizar exame veterinario completo, negociar e finalizar a compra." },
      { month: "Mes 7-9", title: "Adaptacao", description: "Periodo de adaptacao ao novo ambiente, conhecer o cavalo, estabelecer rotinas com o treinador." },
      { month: "Mes 10-12", title: "Inicio Competitivo", description: "Primeiras provas de nivel adequado, avaliar pontos fortes e areas a desenvolver." },
    ],
  },
  tradicional: {
    profile: "tradicional",
    title: "Cavaleiro Tradicional",
    subtitle: "Tradicao e Versatilidade",
    description: "O seu perfil reflecte um profundo apreco pela tradicao equestre portuguesa. Valoriza a versatilidade, a robustez e o temperamento equilibrado tipico do Lusitano de trabalho.",
    characteristics: ["Versatilidade funcional", "Temperamento equilibrado e fiavel", "Robustez e resistencia", "Bom manuseamento no campo", "Aptidao para trabalho de gado", "Caracter cooperativo"],
    idealHorse: { age: "5-12 anos (experiencia)", height: "1.58m - 1.65m", training: "Desbravado a trabalho medio", temperament: "Calmo, cooperativo, sensato", priceRange: "12.000 - 40.000 euros" },
    annualCosts: { min: 8000, max: 15000, includes: ["Pensao ou manutencao propria", "Veterinario regular", "Ferracao standard", "Instrutor ocasional", "Equipamento e manutencao", "Seguro basico", "Alimentacao de qualidade"] },
    recommendedRegions: ["Ribatejo", "Alentejo", "Norte"],
    linhagens: [{ name: "Andrade", reason: "Conhecida pela funcionalidade e robustez" }, { name: "Infante da Camara", reason: "Tradicao de trabalho de campo" }, { name: "Coudelaria Nacional", reason: "Seleccao para versatilidade" }],
    disciplinas: ["Equitacao de Trabalho", "Passeio de campo", "Tenta", "Ensino classico", "Turismo equestre"],
    famousHorses: [{ name: "Novilheiro", achievement: "Lenda da versatilidade" }, { name: "Opus 72", achievement: "Reprodutor influente" }, { name: "Habil", achievement: "Campeao de Equitacao de Trabalho" }, { name: "Invasor", achievement: "Referencia do Lusitano tradicional" }],
    tips: ["Prefira cavalos com experiencia em campo", "Teste em situacoes reais de trabalho", "Verifique o historico de saude", "A idade nao e problema", "Considere coudelarias tradicionais", "Um bom caracter vale muito"],
    nextSteps: ["Visitar coudelarias do Ribatejo e Alentejo", "Assistir a provas de Equitacao de Trabalho", "Contactar associacoes de criadores", "Participar em jornadas de campo", "Falar com campinos e cavaleiros de tradicao"],
    icon: <Shield className="text-[#C5A059]" size={48} />,
    color: "from-emerald-500/20",
    quotes: [
      { author: "Mestre Joao Oliveira", role: "Campino do Ribatejo", quote: "O verdadeiro Lusitano e aquele que trabalha connosco no campo, que entende o gado e responde a mao do cavaleiro." },
      { author: "Antonio Borba Monteiro", role: "Cavaleiro Tauromaquico", quote: "Na arena, o cavalo e uma extensao do nosso corpo. A confianca mutua e tudo." },
      { author: "Dr. Guilherme Borba", role: "Criador Tradicional", quote: "Preservar a tradicao e honrar geracoes de criadores que nos legaram esta raca extraordinaria." },
    ],
    faq: [
      { question: "O Lusitano de trabalho e diferente do de desporto?", answer: "Historicamente sim, mas hoje muitos cavalos sao versateis. O de trabalho tende a ser mais compacto, robusto e com temperamento mais frio." },
      { question: "Posso usar um cavalo tradicional em provas?", answer: "Sim, existem provas de Equitacao de Trabalho muito competitivas. E uma disciplina em crescimento que valoriza a versatilidade." },
      { question: "Que idade e ideal para um cavalo de trabalho?", answer: "Entre 6-12 anos, com experiencia de campo. Cavalos mais velhos sao excelentes se bem mantidos - a experiencia e muito valiosa." },
      { question: "Preciso de instalacoes especiais?", answer: "Idealmente paddock ou pasto, mas muitos cavalos tradicionais adaptam-se bem a pensao. O importante e exercicio regular e contacto com o exterior." },
      { question: "Como encontrar um bom cavalo de trabalho?", answer: "Atraves de contactos no Ribatejo e Alentejo, feiras tradicionais, e referencias de campinos e cavaleiros de confianca." },
    ],
    timeline: [
      { month: "Mes 1-2", title: "Imersao na Tradicao", description: "Visitar coudelarias tradicionais, assistir a tentas e jornadas de campo, conhecer a cultura equestre." },
      { month: "Mes 3-4", title: "Contactos e Pesquisa", description: "Estabelecer relacoes com criadores, campinos, e cavaleiros tradicionais. Ver cavalos em trabalho real." },
      { month: "Mes 5-6", title: "Seleccao", description: "Experimentar cavalos no campo, testar em diferentes situacoes, verificar versatilidade e temperamento." },
      { month: "Mes 7-8", title: "Aquisicao", description: "Exame veterinario, negociacao, e transporte para as suas instalacoes." },
      { month: "Mes 9-12", title: "Integracao", description: "Conhecer o cavalo, participar em jornadas de campo, desenvolver a parceria." },
    ],
  },
  criador: {
    profile: "criador",
    title: "Criador & Investidor Genetico",
    subtitle: "Preservacao e Melhoramento",
    description: "O seu perfil indica interesse serio na criacao e preservacao do Puro Sangue Lusitano. Valoriza a genetica, a morfologia tipica da raca, e o potencial reprodutivo.",
    characteristics: ["Morfologia tipica excelente", "Genetica comprovada (APSL)", "Linhagem pura e reconhecida", "Potencial reprodutivo verificado", "Conformacao para transmissao", "Merito funcional demonstrado"],
    idealHorse: { age: "3-8 anos (reproducao activa)", height: "Minimo 1.60m (garanhoes)", training: "Funcionalidade demonstrada", temperament: "Equilibrado, bom caracter hereditario", priceRange: "25.000 - 150.000+ euros" },
    annualCosts: { min: 15000, max: 40000, includes: ["Manutencao em coudelaria", "Registos APSL", "Exames de reproducao", "Cobricoes ou IA", "Veterinario reprodutivo", "Testes geneticos", "Concursos de modelo", "Marketing dos produtos"] },
    recommendedRegions: ["Alentejo", "Ribatejo", "Internacional"],
    linhagens: [{ name: "Veiga", reason: "Linhagem historica com genetica excepcional" }, { name: "Alter Real", reason: "Pureza e seleccao secular da Casa Real" }, { name: "Andrade", reason: "Fundacional, transmite funcionalidade" }],
    disciplinas: ["Reproducao selectiva", "Concursos de Modelo", "Apresentacoes de raca", "Dressage (prova de funcionalidade)"],
    famousHorses: [{ name: "Novilheiro", achievement: "Pai de nacao, influenciou geracoes" }, { name: "Opus 72", achievement: "Reprodutor de merito excepcional" }, { name: "Icaro", achievement: "Top reprodutor" }, { name: "Quo Vadis", achievement: "Garanhao de elite" }],
    tips: ["Analise o pedigree (3-4 geracoes)", "Solicite indices BLUP", "Verifique COI - ideal <6%", "Exija teste WFFS negativo", "Avalie descendencia", "Considere complementaridade", "Visite a coudelaria"],
    nextSteps: ["Estudar catalogos APSL", "Visitar Coudelaria de Alter", "Contactar criadores de referencia", "Participar em concursos de modelo", "Definir objectivos de criacao"],
    icon: <Crown className="text-[#C5A059]" size={48} />,
    color: "from-purple-500/20",
    quotes: [
      { author: "Dr. Arsenio Raposo Cordeiro", role: "Presidente APSL", quote: "Criar Lusitanos e contribuir para a preservacao de um patrimonio vivo da cultura portuguesa." },
      { author: "Fernando Sommer d'Andrade", role: "Criador Historico", quote: "Cada potro que nasce e uma nova esperanca para a raca. A seleccao rigorosa e o nosso dever." },
      { author: "Eng. Jose Luis Mira", role: "Geneticista Equino", quote: "Os indices BLUP revolucionaram a criacao, permitindo decisoes baseadas em dados objectivos." },
    ],
    faq: [
      { question: "O que e o indice BLUP?", answer: "Best Linear Unbiased Prediction - uma ferramenta estatistica que estima o valor genetico de um cavalo com base na sua performance e dos seus parentes." },
      { question: "Qual o COI ideal?", answer: "Coeficiente de Consanguinidade idealmente abaixo de 6%. Valores mais altos aumentam risco de problemas geneticos e perda de vigor." },
      { question: "Preciso de registar os potros na APSL?", answer: "Sim, o registo e obrigatorio para cavalos PSL. Inclui microchip, resenho, e teste de ADN para confirmacao de paternidade." },
      { question: "Quanto custa iniciar um programa de criacao?", answer: "Investimento inicial de 30.000-100.000 euros (eguas base), mais 15.000-40.000 euros anuais de manutencao por cavalo." },
      { question: "Devo testar para WFFS?", answer: "Absolutamente. O Warmblood Fragile Foal Syndrome e fatal. Nunca cruzar dois portadores. O teste e obrigatorio para reprodutores responsaveis." },
    ],
    timeline: [
      { month: "Mes 1-3", title: "Formacao e Pesquisa", description: "Estudar genetica equina, indices BLUP, catalogos APSL, e visitar coudelarias de referencia." },
      { month: "Mes 4-6", title: "Definir Programa", description: "Estabelecer objectivos de criacao, seleccionar linhagens de interesse, definir orcamento a 5 anos." },
      { month: "Mes 7-9", title: "Aquisicao de Base", description: "Adquirir eguas fundadoras ou garanhao, garantir testes geneticos, registos APSL, e instalacoes adequadas." },
      { month: "Mes 10-12", title: "Inicio do Programa", description: "Planear cobricoes, estabelecer parcerias com veterinarios reprodutivos, iniciar marketing." },
      { month: "Ano 2+", title: "Consolidacao", description: "Primeiros nascimentos, participacao em concursos de modelo, construcao de reputacao no mercado." },
    ],
  },
  amador: {
    profile: "amador",
    title: "Cavaleiro de Lazer",
    subtitle: "Paixao e Descoberta",
    description: "O seu perfil indica alguem que ama cavalos e procura um companheiro para desfrutar de momentos de lazer e crescimento pessoal. Valoriza a seguranca, o temperamento docil e a facilidade de manuseamento.",
    characteristics: ["Temperamento calmo e previsivel", "Facil de montar e manusear", "Seguro para menos experientes", "Perdoador de erros", "Amigavel e carinhoso", "Boa saude e manutencao facil"],
    idealHorse: { age: "8-16 anos (maturidade)", height: "1.55m - 1.65m (confortavel)", training: "Basico a medio (bem confirmado)", temperament: "Muito calmo, docil, paciente", priceRange: "8.000 - 25.000 euros" },
    annualCosts: { min: 6000, max: 10000, includes: ["Pensao em centro hipico", "Veterinario basico", "Ferracao regular", "Aulas ocasionais", "Equipamento basico", "Seguro RC", "Alimentacao standard"] },
    recommendedRegions: ["Lisboa", "Centro", "Norte", "Qualquer regiao acessivel"],
    linhagens: [{ name: "Qualquer linhagem", reason: "Temperamento individual e mais importante" }, { name: "Andrade", reason: "Tendencia para cavalos sensatos" }, { name: "Cavalos de escola", reason: "Temperamentos excepcionais" }],
    disciplinas: ["Passeio recreativo", "Escola basica", "Terapia equestre", "Lazer familiar", "Hipismo adaptado"],
    famousHorses: [{ name: "Cavalos de escola", achievement: "Formaram geracoes de cavaleiros" }, { name: "Cavalos de terapia", achievement: "Ajudam pessoas especiais" }, { name: "Companheiros de vida", achievement: "O valor esta na relacao" }],
    tips: ["Procure cavalos mais velhos", "Experimente varias vezes", "Monte em diferentes situacoes", "Verifique facilidade de manuseamento", "Considere cavalos de escola", "Preco baixo nao e pior qualidade", "Peca opiniao ao instrutor"],
    nextSteps: ["Falar com o seu instrutor", "Visitar centros hipicos", "Considerar cavalos de escola reformados", "Nao ter pressa", "Fazer varias visitas"],
    icon: <Heart className="text-[#C5A059]" size={48} />,
    color: "from-rose-500/20",
    quotes: [
      { author: "Dra. Maria Helena Pires", role: "Psicologa Equestre", quote: "A relacao com o cavalo e terapeutica. Nao e preciso competir para experimentar a magia da equitacao." },
      { author: "Instrutor Jose Carlos", role: "Professor de Equitacao", quote: "O melhor cavalo para um iniciante e aquele que perdoa erros e ensina com paciencia." },
      { author: "Sofia Mendes", role: "Cavaleira Amadora", quote: "O meu Lusitano e o meu escape do stress. Cada passeio e uma sessao de terapia." },
    ],
    faq: [
      { question: "Cavalos mais velhos sao bons para iniciantes?", answer: "Excelente escolha! Cavalos entre 10-16 anos sao tipicamente mais calmos, experientes, e perdoadores. A idade traz sabedoria." },
      { question: "Posso ter um cavalo sem experiencia previa?", answer: "Sim, desde que tenha apoio de um instrutor e o cavalo seja adequado. Comece com aulas regulares e va ganhando autonomia gradualmente." },
      { question: "Quanto tempo devo dedicar ao cavalo?", answer: "Minimo 2-3 visitas semanais e ideal. Cavalos em pensao sao cuidados diariamente, mas beneficiam do contacto regular consigo." },
      { question: "Cavalos de escola reformados sao boa opcao?", answer: "Frequentemente sao otimos! Estao habituados a diferentes cavaleiros, sao pacientes, e tem temperamentos de ouro. Preco tambem e mais acessivel." },
      { question: "Preciso de equipamento proprio?", answer: "No inicio pode usar equipamento da escola. Gradualmente invista em capacete (obrigatorio), botas, e eventualmente sela propria se o cavalo for seu." },
    ],
    timeline: [
      { month: "Mes 1-2", title: "Preparacao", description: "Continuar licoes, falar com instrutor sobre perfil ideal, visitar centros hipicos da zona." },
      { month: "Mes 3-4", title: "Pesquisa Activa", description: "Ver cavalos disponiveis, experimentar diferentes temperamentos, definir orcamento realista." },
      { month: "Mes 5-6", title: "Seleccao Cuidadosa", description: "Experimentar o cavalo varias vezes, em diferentes dias e situacoes. Pedir opiniao ao instrutor." },
      { month: "Mes 7", title: "Decisao", description: "Exame veterinario basico, negociacao, preparar local de pensao." },
      { month: "Mes 8-12", title: "Lua de Mel", description: "Conhecer o cavalo, estabelecer rotinas, desfrutar da nova parceria sem pressas." },
    ],
  },
};

interface RadarChartProps {
  data: { competicao: number; tradicao: number; criacao: number; lazer: number; investimento: number; dedicacao: number };
}

function RadarChart({ data }: RadarChartProps) {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 300); return () => clearTimeout(t); }, []);
  const labels = [{ key: 'competicao', label: 'Competicao' }, { key: 'tradicao', label: 'Tradicao' }, { key: 'criacao', label: 'Criacao' }, { key: 'lazer', label: 'Lazer' }, { key: 'investimento', label: 'Investimento' }, { key: 'dedicacao', label: 'Dedicacao' }];
  const cX = 150, cY = 150, mR = 100;
  const pts = labels.map((item, i) => { const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2; const v = data[item.key as keyof typeof data] / 100; const r = animate ? v * mR : 0; return { x: cX + r * Math.cos(a), y: cY + r * Math.sin(a), lX: cX + (mR + 25) * Math.cos(a), lY: cY + (mR + 25) * Math.sin(a), label: item.label }; });
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  return (
    <div className="relative w-full max-w-[320px] mx-auto">
      <svg viewBox="0 0 300 300" className="w-full h-auto">
        {[0.25, 0.5, 0.75, 1].map(l => <polygon key={l} points={labels.map((_, i) => { const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2; return `${cX + l * mR * Math.cos(a)},${cY + l * mR * Math.sin(a)}`; }).join(' ')} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />)}
        {labels.map((_, i) => { const a = (Math.PI * 2 * i) / labels.length - Math.PI / 2; return <line key={i} x1={cX} y1={cY} x2={cX + mR * Math.cos(a)} y2={cY + mR * Math.sin(a)} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />; })}
        <path d={path} fill="rgba(197, 160, 89, 0.2)" stroke="#C5A059" strokeWidth="2" style={{ opacity: 0, animation: "fadeSlideIn 0.8s ease-out forwards" }} />
        {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="5" fill="#C5A059" style={{ opacity: 0, animation: "scaleIn 0.3s ease-out forwards", animationDelay: `${0.5 + i * 0.1}s`, transformOrigin: "center" }} />)}
        {pts.map((p, i) => <text key={i} x={p.lX} y={p.lY} textAnchor="middle" dominantBaseline="middle" className="fill-zinc-400 text-[10px]">{p.label}</text>)}
      </svg>
    </div>
  );
}

interface AnswerDetail {
  questionId: number;
  questionText: string;
  answerText: string;
  points: Record<string, number>;
  weight: number;
}

function AnalisePerfilContent() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answerDetails, setAnswerDetails] = useState<AnswerDetail[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({ competidor: 0, tradicional: 0, criador: 0, amador: 0 });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [selectedTab, setSelectedTab] = useState<'perfil' | 'cavalo' | 'custos' | 'cronograma' | 'analise' | 'proximos'>('perfil');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const quizRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Check for shared result in URL
  useEffect(() => {
    const sharedResult = searchParams.get('r');
    if (sharedResult) {
      try {
        const decoded = JSON.parse(atob(sharedResult));
        if (decoded.profile && results[decoded.profile]) {
          setScores(decoded.scores || { competidor: 0, tradicional: 0, criador: 0, amador: 0 });
          setResult(results[decoded.profile]);
          setShowIntro(false);
          setShowResult(true);
        }
      } catch (e) { console.error('Invalid shared result'); }
    }
  }, [searchParams]);

  const startQuiz = () => { setShowIntro(false); setTimeout(() => quizRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); };

  const handleAnswer = (option: { value: string; text: string; points: Record<string, number> }) => {
    const q = questions[currentQuestion];
    const w = q.weight;
    const newAnswers = [...answers, option.value];
    const newScores = { ...scores };
    Object.entries(option.points).forEach(([p, pts]) => { newScores[p] = (newScores[p] || 0) + pts * w; });

    const newDetail: AnswerDetail = {
      questionId: q.id,
      questionText: q.question,
      answerText: option.text,
      points: option.points,
      weight: w,
    };
    const newDetails = [...answerDetails, newDetail];

    setAnswers(newAnswers);
    setAnswerDetails(newDetails);
    setScores(newScores);
    if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
    else { let mp = "amador", ms = 0; Object.entries(newScores).forEach(([p, s]) => { if (s > ms) { ms = s; mp = p; } }); setResult(results[mp]); setShowResult(true); }
  };

  // Calculate confidence index (how consistent were the answers)
  const calculateConfidence = (): number => {
    if (answerDetails.length === 0 || !result) return 0;
    let alignedPoints = 0;
    let totalPoints = 0;
    answerDetails.forEach(detail => {
      const maxProfile = Object.entries(detail.points).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0]);
      totalPoints += maxProfile[1] * detail.weight;
      if (maxProfile[0] === result.profile) alignedPoints += detail.points[result.profile] * detail.weight;
    });
    return totalPoints > 0 ? Math.round((alignedPoints / totalPoints) * 100) : 0;
  };

  const saveResult = () => { if (result) { localStorage.setItem('analise-perfil-result', JSON.stringify({ profile: result.profile, scores, date: new Date().toISOString() })); setSaved(true); setTimeout(() => setSaved(false), 3000); } };

  const getShareUrl = (): string => {
    if (!result) return '';
    const data = { profile: result.profile, scores };
    const encoded = btoa(JSON.stringify(data));
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/analise-perfil?r=${encoded}`;
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareWhatsApp = () => {
    if (!result) return;
    const t = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
    const p = Math.round((scores[result.profile] / t) * 100);
    const text = encodeURIComponent(`Fiz a Analise de Perfil do Cavaleiro!\n\nO meu perfil: ${result.title} (${p}%)\n"${result.subtitle}"\n\nDescobre o teu: ${getShareUrl()}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareInstagram = () => {
    if (!result) return;
    const t = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
    const p = Math.round((scores[result.profile] / t) * 100);
    const text = `🐴 Fiz a Análise de Perfil do Cavaleiro!\n\n✨ O meu perfil: ${result.title} (${p}%)\n"${result.subtitle}"\n\n🔗 Descobre o teu perfil em:\nportallusitano.pt/analise-perfil\n\n#Lusitano #CavaloLusitano #Equitacao #PortalLusitano`;
    navigator.clipboard.writeText(text);
    alert('Texto copiado! Cole no Instagram Stories ou publicação.');
  };

  const downloadPDF = async () => {
    if (!result) return;
    const jsPDF = (await import('jspdf')).default;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const t = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
    const p = Math.round((scores[result.profile] / t) * 100);

    // Header
    doc.setFillColor(5, 5, 5);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(10);
    doc.text('PORTAL LUSITANO', 105, 20, { align: 'center' });
    doc.setFontSize(8);
    doc.text('ANALISE DE PERFIL DO CAVALEIRO', 105, 27, { align: 'center' });

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text(result.title, 105, 50, { align: 'center' });
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(14);
    doc.text(result.subtitle, 105, 60, { align: 'center' });

    // Percentage
    doc.setFontSize(36);
    doc.text(`${p}%`, 105, 80, { align: 'center' });

    // Description
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(result.description, 170);
    doc.text(descLines, 20, 95);

    // Ideal Horse Section
    let yPos = 95 + descLines.length * 5 + 10;
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(12);
    doc.text('CAVALO IDEAL', 20, yPos);
    yPos += 8;
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(9);
    doc.text(`Idade: ${result.idealHorse.age}`, 20, yPos);
    doc.text(`Altura: ${result.idealHorse.height}`, 105, yPos);
    yPos += 6;
    doc.text(`Treino: ${result.idealHorse.training}`, 20, yPos);
    yPos += 6;
    doc.text(`Temperamento: ${result.idealHorse.temperament}`, 20, yPos);
    yPos += 6;
    doc.text(`Preco: ${result.idealHorse.priceRange}`, 20, yPos);

    // Costs Section
    yPos += 15;
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(12);
    doc.text('CUSTOS ANUAIS ESTIMADOS', 20, yPos);
    yPos += 8;
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text(`${result.annualCosts.min.toLocaleString()} - ${result.annualCosts.max.toLocaleString()} euros/ano`, 20, yPos);

    // Tips Section
    yPos += 15;
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(12);
    doc.text('DICAS', 20, yPos);
    yPos += 8;
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(9);
    result.tips.slice(0, 5).forEach((tip, i) => {
      doc.text(`${i + 1}. ${tip}`, 20, yPos);
      yPos += 5;
    });

    // Next Steps Section
    yPos += 10;
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(12);
    doc.text('PROXIMOS PASSOS', 20, yPos);
    yPos += 8;
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(9);
    result.nextSteps.slice(0, 4).forEach((step, i) => {
      doc.text(`${i + 1}. ${step}`, 20, yPos);
      yPos += 5;
    });

    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('portallusitano.pt/analise-perfil', 105, 285, { align: 'center' });
    doc.text(`Gerado em ${new Date().toLocaleDateString('pt-PT')}`, 105, 290, { align: 'center' });

    doc.save(`analise-perfil-${result.profile}.pdf`);
  };

  const downloadBadge = async () => {
    if (!badgeRef.current || !result) return;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(badgeRef.current, {
        backgroundColor: '#050505',
        scale: 2,
        useCORS: true,
        logging: false,
        removeContainer: true,
      });
      const link = document.createElement('a');
      link.download = `perfil-${result.profile}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      // Fallback: generate SVG badge instead
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="540" viewBox="0 0 540 540">
        <rect width="540" height="540" fill="#050505"/>
        <rect x="20" y="20" width="500" height="500" fill="none" stroke="#C5A059" stroke-width="4"/>
        <text x="270" y="100" text-anchor="middle" fill="#C5A059" font-size="14" letter-spacing="3">PORTAL LUSITANO</text>
        <text x="270" y="200" text-anchor="middle" fill="#888" font-size="12" letter-spacing="2">O MEU PERFIL EQUESTRE</text>
        <text x="270" y="270" text-anchor="middle" fill="#fff" font-size="32" font-family="serif">${result.title}</text>
        <text x="270" y="310" text-anchor="middle" fill="#C5A059" font-size="18" font-style="italic">${result.subtitle}</text>
        <rect x="220" y="350" width="100" height="50" fill="#C5A059"/>
        <text x="270" y="385" text-anchor="middle" fill="#000" font-size="28" font-weight="bold">${scorePercentages[0]?.percentage || 0}%</text>
        <text x="270" y="480" text-anchor="middle" fill="#444" font-size="11">portallusitano.pt/analise-perfil</text>
      </svg>`;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `perfil-${result.profile}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const copyShareText = () => { if (!result) return; const t = Object.values(scores).reduce((a, b) => a + b, 0) || 1; const p = Math.round((scores[result.profile] / t) * 100); navigator.clipboard.writeText(`Fiz a Analise de Perfil do Cavaleiro!\n\nO meu perfil: ${result.title} (${p}%)\n"${result.subtitle}"\n\nDescobre o teu: portallusitano.pt/analise-perfil`); setCopied(true); setTimeout(() => setCopied(false), 3000); };
  const resetQuiz = () => { setShowIntro(true); setCurrentQuestion(0); setAnswers([]); setAnswerDetails([]); setScores({ competidor: 0, tradicional: 0, criador: 0, amador: 0 }); setShowResult(false); setResult(null); setSelectedTab('perfil'); setSaved(false); setCopied(false); };
  const goBack = () => { if (currentQuestion > 0) { setCurrentQuestion(currentQuestion - 1); setAnswers(answers.slice(0, -1)); setAnswerDetails(answerDetails.slice(0, -1)); } };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const scorePercentages = Object.entries(scores).map(([p, s]) => ({ profile: p, percentage: Math.round((s / totalScore) * 100), label: results[p]?.title || p })).sort((a, b) => b.percentage - a.percentage);
  const radarData = { competicao: (scores.competidor / totalScore) * 100, tradicao: (scores.tradicional / totalScore) * 100, criacao: (scores.criador / totalScore) * 100, lazer: (scores.amador / totalScore) * 100, investimento: scorePercentages[0]?.percentage || 0, dedicacao: Math.min(100, answers.filter(a => ['diario', 'frequente', 'completo', 'treinador_top'].includes(a)).length * 25) };

  return (
    <main className="min-h-screen bg-[#050505]">

        {showIntro ? (
          <div key="intro" className="min-h-screen animate-[fadeSlideIn_0.4s_ease-out_forwards]">
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0">
                <Image src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1920&auto=format&fit=crop" alt="Cavalo Lusitano" fill className="object-cover opacity-40" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]/40" />
              </div>
              <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <div className="opacity-0 animate-[fadeSlideIn_0.6s_ease-out_forwards]">
                  <span className="inline-flex items-center gap-2 text-[#C5A059] text-xs uppercase tracking-[0.3em] mb-6"><ClipboardCheck size={14} />Analise Personalizada<ClipboardCheck size={14} /></span>
                  <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">Analise de Perfil<span className="block text-[#C5A059] italic">do Cavaleiro</span></h1>
                  <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-8 leading-relaxed">Uma analise desenvolvida por especialistas para identificar o perfil de cavalo Puro Sangue Lusitano que melhor se adequa aos seus objectivos.</p>
                  <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-400 mb-12">
                    <div className="flex items-center gap-2"><Clock size={16} className="text-[#C5A059]" /><span>8-10 minutos</span></div>
                    <div className="flex items-center gap-2"><BookOpen size={16} className="text-[#C5A059]" /><span>15 perguntas</span></div>
                    <div className="flex items-center gap-2"><Target size={16} className="text-[#C5A059]" /><span>Resultado detalhado</span></div>
                  </div>
                  <button onClick={startQuiz} className="group inline-flex items-center gap-3 bg-[#C5A059] text-black px-10 py-5 text-sm uppercase tracking-[0.2em] font-bold hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98] transition-transform">Iniciar Analise<ChevronRight className="group-hover:translate-x-1 transition-transform" /></button>
                </div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-[gentle-bounce_2s_ease-in-out_infinite]"><ChevronDown className="text-white/30" size={32} /></div>
              </div>
            </section>
            <section className="py-20 border-t border-white/5">
              <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-center text-2xl font-serif text-white mb-12">O que vai descobrir</h2>
                <div className="grid md:grid-cols-4 gap-8">
                  {[{ icon: Target, title: "Perfil Equestre", desc: "Competidor, Tradicional, Criador ou Lazer" }, { icon: Feather, title: "Cavalo Ideal", desc: "Idade, altura, treino e temperamento" }, { icon: DollarSign, title: "Custos Estimados", desc: "Investimento anual por perfil" }, { icon: Trophy, title: "Referencias", desc: "Cavalos famosos do seu perfil" }].map((f, i) => (
                    <div key={f.title} className="text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="w-14 h-14 mx-auto bg-[#C5A059]/10 rounded-full flex items-center justify-center mb-4"><f.icon className="text-[#C5A059]" size={24} /></div>
                      <h3 className="text-white font-medium mb-2">{f.title}</h3>
                      <p className="text-sm text-zinc-500">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : !showResult ? (
          <div key="quiz" ref={quizRef} className="min-h-screen pt-24 pb-20 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
            <div className="max-w-3xl mx-auto px-6">
              <div className="text-center mb-8">
                <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] block mb-2">{questions[currentQuestion].category}</span>
                <h2 className="text-2xl font-serif text-white">Analise de Perfil do Cavaleiro</h2>
              </div>
              <div className="mb-10">
                <div className="flex justify-between text-sm text-zinc-500 mb-3"><span>Pergunta {currentQuestion + 1} de {questions.length}</span><span>{Math.round(progress)}%</span></div>
                <div className="h-1.5 bg-zinc-800/50 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#C5A059] to-[#E8D5A3] transition-all duration-500" style={{ width: `${progress}%` }} /></div>
                <div className="flex justify-between mt-3">{questions.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < currentQuestion ? "bg-[#C5A059]" : i === currentQuestion ? "bg-[#C5A059]/50 ring-2 ring-[#C5A059]/30" : "bg-zinc-800"}`} />)}</div>
              </div>

                <div key={currentQuestion} className="animate-[fadeSlideIn_0.3s_ease-out_forwards]">
                  <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-900/40 border border-white/10 p-8 md:p-10 mb-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center flex-shrink-0">{questions[currentQuestion].icon}</div>
                      <div><h3 className="text-xl md:text-2xl font-serif text-white leading-tight">{questions[currentQuestion].question}</h3>{questions[currentQuestion].description && <p className="text-sm text-zinc-500 mt-2">{questions[currentQuestion].description}</p>}</div>
                    </div>
                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((opt, idx) => (
                        <button key={opt.value} onClick={() => handleAnswer(opt)} className="w-full text-left p-5 bg-zinc-800/30 border border-white/5 hover:border-[#C5A059]/50 hover:bg-[#C5A059]/5 transition-all group hover:translate-x-1 transition-transform opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${idx * 0.08}s` }}>
                          <div className="flex items-center justify-between">
                            <div><span className="text-white group-hover:text-[#C5A059] transition-colors font-medium">{opt.text}</span>{opt.description && <p className="text-sm text-zinc-500 mt-1">{opt.description}</p>}</div>
                            <ChevronRight className="text-zinc-600 group-hover:text-[#C5A059] group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {currentQuestion > 0 ? <button onClick={goBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"><ChevronLeft size={18} />Anterior</button> : <div />}
                    <button onClick={resetQuiz} className="text-zinc-600 hover:text-zinc-400 text-sm">Reiniciar</button>
                  </div>
                </div>

            </div>
          </div>
        ) : (
          <div key="result" className="min-h-screen animate-[fadeSlideIn_0.4s_ease-out_forwards]">
            {result && (
              <>
                <section className={`relative pt-32 pb-16 bg-gradient-to-b ${result.color} to-transparent`}>
                  <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="opacity-0 animate-[scaleIn_0.5s_ease-out_forwards]">
                      <div className="w-24 h-24 mx-auto bg-zinc-900/50 border border-[#C5A059]/30 rounded-full flex items-center justify-center mb-6">{result.icon}</div>
                      <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] block mb-3">O seu perfil equestre e</span>
                      <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">{result.title}</h1>
                      <p className="text-lg text-[#C5A059] italic mb-6">{result.subtitle}</p>
                      <p className="text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-8">{result.description}</p>
                      {/* Share Buttons */}
                      <div className="flex flex-wrap justify-center gap-2 mb-6">
                        <button onClick={saveResult} className={`inline-flex items-center gap-2 px-3 py-2 text-sm border transition-colors ${saved ? "border-green-500 text-green-500" : "border-white/20 text-zinc-400 hover:text-white"}`}>{saved ? <Check size={16} /> : <Save size={16} />}{saved ? "Guardado!" : "Guardar"}</button>
                        <button onClick={downloadPDF} className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-[#C5A059]/50 text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-colors"><FileDown size={16} />PDF</button>
                        <button onClick={downloadBadge} className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-white/20 text-zinc-400 hover:text-white transition-colors"><Download size={16} />Badge</button>
                        <button onClick={shareWhatsApp} className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-green-600/50 text-green-500 hover:bg-green-600 hover:text-white transition-colors"><MessageCircle size={16} />WhatsApp</button>
                        <button onClick={shareFacebook} className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-blue-600/50 text-blue-500 hover:bg-blue-600 hover:text-white transition-colors"><Facebook size={16} />Facebook</button>
                        <button onClick={shareInstagram} className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-pink-500/50 text-pink-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-colors"><Instagram size={16} />Instagram</button>
                        <button onClick={copyShareLink} className={`inline-flex items-center gap-2 px-3 py-2 text-sm border transition-colors ${copied ? "border-green-500 text-green-500" : "border-white/20 text-zinc-400 hover:text-white"}`}>{copied ? <Check size={16} /> : <LinkIcon size={16} />}{copied ? "Copiado!" : "Link"}</button>
                      </div>
                      {/* Downloadable Badge (hidden, used for export) */}
                      <div className="hidden">
                        <div ref={badgeRef} className="w-[540px] h-[540px] bg-[#050505] p-8 flex flex-col items-center justify-center">
                          <div className="w-full h-full border-4 border-[#C5A059] p-8 flex flex-col items-center justify-center">
                            <p className="text-[#C5A059] text-sm uppercase tracking-[0.3em] mb-4">Portal Lusitano</p>
                            <div className="w-20 h-20 bg-zinc-900 border-2 border-[#C5A059]/50 rounded-full flex items-center justify-center mb-4">{result.icon}</div>
                            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">O meu perfil equestre</p>
                            <h2 className="text-3xl font-serif text-white mb-2 text-center">{result.title}</h2>
                            <p className="text-[#C5A059] italic mb-6">{result.subtitle}</p>
                            <div className="bg-[#C5A059] text-black px-6 py-2 text-2xl font-bold">{scorePercentages[0]?.percentage || 0}%</div>
                            <p className="text-zinc-600 text-xs mt-6">portallusitano.pt/analise-perfil</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="py-12 border-b border-white/5">
                  <div className="max-w-5xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                      <div><h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-6 text-center">Mapa de Perfil</h3><RadarChart data={radarData} /></div>
                      <div>
                        <h3 className="text-sm uppercase tracking-wider text-zinc-500 mb-6">Distribuicao do Perfil</h3>
                        <div className="space-y-4">
                          {scorePercentages.map((item, i) => (
                            <div key={item.profile} className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 0.1}s` }}>
                              <div className="flex justify-between text-sm mb-1"><span className={i === 0 ? "text-[#C5A059] font-medium" : "text-zinc-400"}>{item.label}</span><span className={i === 0 ? "text-[#C5A059] font-bold" : "text-zinc-500"}>{item.percentage}%</span></div>
                              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden"><div className={`h-full rounded-full ${i === 0 ? "bg-[#C5A059]" : "bg-zinc-600"} transition-all duration-500`} style={{ width: `${item.percentage}%` }} /></div>
                            </div>
                          ))}
                        </div>
                        {scorePercentages[1]?.percentage > 20 && <p className="text-sm text-zinc-500 mt-4"><span className="text-[#C5A059]">Nota:</span> Perfil secundario: <span className="text-white">{scorePercentages[1].label}</span> ({scorePercentages[1].percentage}%)</p>}
                      </div>
                    </div>
                  </div>
                </section>
                <section className="sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-sm border-b border-white/5">
                  <div className="max-w-5xl mx-auto px-6">
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                      {[{ id: 'perfil', label: 'Perfil', icon: Users }, { id: 'cavalo', label: 'Cavalo Ideal', icon: Feather }, { id: 'custos', label: 'Custos', icon: DollarSign }, { id: 'cronograma', label: 'Cronograma', icon: Calendar }, { id: 'analise', label: 'Analise', icon: BarChart3 }, { id: 'proximos', label: 'Proximos Passos', icon: Compass }].map(tab => (
                        <button key={tab.id} onClick={() => setSelectedTab(tab.id as typeof selectedTab)} className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap ${selectedTab === tab.id ? "text-[#C5A059] border-b-2 border-[#C5A059]" : "text-zinc-500 hover:text-zinc-300"}`}><tab.icon size={16} />{tab.label}</button>
                      ))}
                    </div>
                  </div>
                </section>
                <section className="py-12">
                  <div className="max-w-5xl mx-auto px-6">

                      {selectedTab === 'perfil' && (
                        <div key="perfil" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
                          <div className="bg-zinc-900/30 border border-white/5 p-8"><h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6"><Star className="text-[#C5A059]" size={20} />Caracteristicas que Valoriza</h3><div className="grid md:grid-cols-2 gap-3">{result.characteristics.map((c, i) => <div key={c} className="flex items-center gap-3 text-zinc-300 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 0.05}s` }}><div className="w-6 h-6 bg-[#C5A059]/10 rounded-full flex items-center justify-center"><Check className="text-[#C5A059]" size={14} /></div>{c}</div>)}</div></div>
                          <div className="bg-zinc-900/30 border border-white/5 p-8"><h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6"><Trophy className="text-[#C5A059]" size={20} />Disciplinas Recomendadas</h3><div className="flex flex-wrap gap-2">{result.disciplinas.map(d => <span key={d} className="bg-[#C5A059]/10 text-[#C5A059] px-4 py-2 text-sm">{d}</span>)}</div></div>
                          <div className="bg-zinc-900/30 border border-white/5 p-8"><h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6"><Award className="text-[#C5A059]" size={20} />Cavalos de Referencia</h3><div className="grid md:grid-cols-2 gap-4">{result.famousHorses.map((h, i) => <div key={h.name} className="flex items-start gap-3 p-4 bg-zinc-800/30 border border-white/5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 0.1}s` }}><div className="w-10 h-10 bg-[#C5A059]/10 rounded-full flex items-center justify-center flex-shrink-0"><Medal className="text-[#C5A059]" size={18} /></div><div><h4 className="text-white font-medium">{h.name}</h4><p className="text-sm text-zinc-500">{h.achievement}</p></div></div>)}</div></div>
                          <div className="bg-zinc-900/30 border border-white/5 p-8"><h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6"><TreeDeciduous className="text-[#C5A059]" size={20} />Linhagens Sugeridas</h3><div className="space-y-4">{result.linhagens.map((l, i) => <div key={l.name} className="flex items-start gap-4 p-4 bg-zinc-800/30 border border-white/5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 0.1}s` }}><div className="w-10 h-10 bg-[#C5A059]/10 rounded-full flex items-center justify-center flex-shrink-0"><Crown className="text-[#C5A059]" size={18} /></div><div><h4 className="text-white font-medium">{l.name}</h4><p className="text-sm text-zinc-500">{l.reason}</p></div></div>)}</div></div>
                        </div>
                      )}
                      {selectedTab === 'cavalo' && (
                        <div key="cavalo" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
                          <div className="bg-gradient-to-b from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 p-8">
                            <h3 className="flex items-center gap-2 text-xl font-serif text-white mb-8"><Feather className="text-[#C5A059]" size={24} />O Seu Lusitano Ideal</h3>
                            <div className="grid md:grid-cols-2 gap-6">{[{ label: "Idade Ideal", value: result.idealHorse.age, icon: Clock }, { label: "Altura", value: result.idealHorse.height, icon: Activity }, { label: "Nivel de Treino", value: result.idealHorse.training, icon: TrendingUp }, { label: "Temperamento", value: result.idealHorse.temperament, icon: Heart }].map(it => <div key={it.label} className="bg-zinc-900/50 p-5 border border-white/5"><div className="flex items-center gap-2 text-[#C5A059] mb-2"><it.icon size={16} /><span className="text-xs uppercase tracking-wider">{it.label}</span></div><p className="text-white">{it.value}</p></div>)}</div>
                            <div className="mt-6 p-5 bg-[#C5A059]/10 border border-[#C5A059]/30"><div className="flex items-center gap-2 text-[#C5A059] mb-2"><DollarSign size={16} /><span className="text-xs uppercase tracking-wider">Faixa de Preco</span></div><p className="text-2xl font-serif text-white">{result.idealHorse.priceRange}</p><p className="text-sm text-zinc-500 mt-2">*Valores indicativos</p></div>
                          </div>
                          <div className="bg-zinc-900/30 border border-white/5 p-8"><h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6"><MapPin className="text-[#C5A059]" size={20} />Regioes Recomendadas</h3><div className="flex flex-wrap gap-3">{result.recommendedRegions.map(r => <span key={r} className="bg-zinc-800 text-zinc-300 px-4 py-2 text-sm">{r}</span>)}</div></div>
                          <div className="bg-zinc-900/30 border border-white/5 p-8"><h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6"><Zap className="text-[#C5A059]" size={20} />Dicas para a Aquisicao</h3><div className="space-y-3">{result.tips.map((t, i) => <div key={i} className="flex items-start gap-3 text-zinc-300 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 0.05}s` }}><span className="text-[#C5A059] font-bold flex-shrink-0">{i + 1}.</span><span>{t}</span></div>)}</div></div>
                        </div>
                      )}
                      {selectedTab === 'custos' && (
                        <div key="custos" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
                          <div className="bg-gradient-to-b from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 p-8">
                            <h3 className="flex items-center gap-2 text-xl font-serif text-white mb-6"><DollarSign className="text-[#C5A059]" size={24} />Custos Anuais Estimados</h3>
                            <div className="text-center mb-8"><p className="text-sm text-zinc-500 mb-2">Intervalo estimado por ano</p><p className="text-4xl font-serif text-white">{result.annualCosts.min.toLocaleString()} - {result.annualCosts.max.toLocaleString()} euros</p></div>
                            <div className="bg-zinc-900/50 p-6 border border-white/5"><h4 className="text-sm uppercase tracking-wider text-[#C5A059] mb-4">O que esta incluido:</h4><div className="grid md:grid-cols-2 gap-3">{result.annualCosts.includes.map((it, i) => <div key={i} className="flex items-center gap-2 text-zinc-300 text-sm"><Check className="text-[#C5A059] flex-shrink-0" size={14} />{it}</div>)}</div></div>
                            <p className="text-sm text-zinc-500 mt-6 text-center">*Valores aproximados para Portugal continental</p>
                          </div>
                          <div className="bg-zinc-900/30 border border-white/5 p-8"><h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6"><Activity className="text-[#C5A059]" size={20} />Comparacao entre Perfis</h3><div className="space-y-4">{Object.entries(results).map(([k, r]) => <div key={k} className="flex items-center gap-4"><div className={`w-32 text-sm ${k === result.profile ? 'text-[#C5A059] font-medium' : 'text-zinc-500'}`}>{r.title.split(' ')[0]}</div><div className="flex-1"><div className="h-3 bg-zinc-800 rounded-full overflow-hidden"><div className={`h-full rounded-full ${k === result.profile ? 'bg-[#C5A059]' : 'bg-zinc-600'}`} style={{ width: `${(r.annualCosts.max / 50000) * 100}%` }} /></div></div><div className={`w-48 text-right text-sm ${k === result.profile ? 'text-[#C5A059]' : 'text-zinc-500'}`}>{r.annualCosts.min.toLocaleString()} - {r.annualCosts.max.toLocaleString()}</div></div>)}</div></div>
                        </div>
                      )}
                      {selectedTab === 'cronograma' && (
                        <div key="cronograma" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
                          {/* Timeline */}
                          <div className="bg-zinc-900/30 border border-white/5 p-8">
                            <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6"><Calendar className="text-[#C5A059]" size={20} />Cronograma Recomendado</h3>
                            <div className="relative">
                              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#C5A059]/20" />
                              <div className="space-y-6">
                                {result.timeline.map((item, i) => (
                                  <div key={i} className="relative pl-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 0.1}s` }}>
                                    <div className="absolute left-0 w-8 h-8 bg-[#C5A059] text-black rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</div>
                                    <div className="bg-zinc-800/30 border border-white/5 p-4">
                                      <div className="text-[#C5A059] text-xs uppercase tracking-wider mb-1">{item.month}</div>
                                      <h4 className="text-white font-medium mb-2">{item.title}</h4>
                                      <p className="text-sm text-zinc-400">{item.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {/* Quotes */}
                          <div className="bg-zinc-900/30 border border-white/5 p-8">
                            <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6"><Quote className="text-[#C5A059]" size={20} />Palavras de Especialistas</h3>
                            <div className="space-y-4">
                              {result.quotes.map((q, i) => (
                                <div key={i} className="bg-zinc-800/30 border-l-2 border-[#C5A059] p-5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 0.1}s` }}>
                                  <p className="text-zinc-300 italic mb-3">"{q.quote}"</p>
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#C5A059]/10 rounded-full flex items-center justify-center"><Quote className="text-[#C5A059]" size={14} /></div>
                                    <div><p className="text-white text-sm font-medium">{q.author}</p><p className="text-zinc-500 text-xs">{q.role}</p></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* FAQ */}
                          <div className="bg-zinc-900/30 border border-white/5 p-8">
                            <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6"><HelpCircle className="text-[#C5A059]" size={20} />Perguntas Frequentes</h3>
                            <div className="space-y-3">
                              {result.faq.map((item, i) => (
                                <div key={i} className="border border-white/5 overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 0.05}s` }}>
                                  <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors text-left">
                                    <span className="text-white font-medium pr-4">{item.question}</span>
                                    <ChevronDown className={`text-[#C5A059] flex-shrink-0 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} size={18} />
                                  </button>
                                  {expandedFaq === i && (
                                    <div className="animate-[fadeSlideIn_0.2s_ease-out_forwards]">
                                      <div className="p-4 bg-zinc-900/50 text-zinc-400 text-sm">{item.answer}</div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedTab === 'analise' && (
                        <div key="analise" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
                          {/* Confidence Index */}
                          <div className="bg-gradient-to-b from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 p-8">
                            <h3 className="flex items-center gap-2 text-xl font-serif text-white mb-6"><Percent className="text-[#C5A059]" size={24} />Indice de Confianca</h3>
                            <div className="text-center mb-6">
                              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-[#C5A059] relative">
                                <span className="text-4xl font-bold text-white">{calculateConfidence()}%</span>
                              </div>
                              <p className="text-zinc-400 mt-4 max-w-md mx-auto text-sm">Este valor indica a consistencia das suas respostas. Quanto maior, mais alinhadas estavam as suas escolhas com o perfil identificado.</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="bg-zinc-900/50 p-4 border border-white/5">
                                <p className="text-2xl font-bold text-white">{answerDetails.length}</p>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Perguntas</p>
                              </div>
                              <div className="bg-zinc-900/50 p-4 border border-white/5">
                                <p className="text-2xl font-bold text-[#C5A059]">{scorePercentages[0]?.percentage || 0}%</p>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Perfil Principal</p>
                              </div>
                              <div className="bg-zinc-900/50 p-4 border border-white/5">
                                <p className="text-2xl font-bold text-zinc-400">{scorePercentages[1]?.percentage || 0}%</p>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Perfil Secundario</p>
                              </div>
                            </div>
                          </div>
                          {/* Breakdown by Question */}
                          <div className="bg-zinc-900/30 border border-white/5 p-8">
                            <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6"><BarChart3 className="text-[#C5A059]" size={20} />Analise por Pergunta</h3>
                            <div className="space-y-4">
                              {answerDetails.map((detail, i) => {
                                const maxProfile = Object.entries(detail.points).reduce((a, b) => b[1] > a[1] ? b : a, ['', 0]);
                                const profileColors: Record<string, string> = { competidor: 'bg-amber-500', tradicional: 'bg-emerald-500', criador: 'bg-purple-500', amador: 'bg-rose-500' };
                                return (
                                  <div key={i} className="bg-zinc-800/30 border border-white/5 p-4 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 0.03}s` }}>
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                      <div className="flex-1">
                                        <p className="text-xs text-zinc-500 mb-1">Pergunta {detail.questionId}</p>
                                        <p className="text-white text-sm font-medium">{detail.answerText}</p>
                                      </div>
                                      <div className={`px-2 py-1 text-xs font-medium text-white rounded ${profileColors[maxProfile[0]] || 'bg-zinc-600'}`}>
                                        {maxProfile[0].charAt(0).toUpperCase() + maxProfile[0].slice(1)}
                                      </div>
                                    </div>
                                    <div className="flex gap-1 h-2">
                                      {Object.entries(detail.points).map(([profile, pts]) => (
                                        <div key={profile} className={`${profileColors[profile]} opacity-${Math.min(100, pts * 10)}`} style={{ width: `${(pts / 10) * 100}%`, opacity: pts / 10 }} title={`${profile}: ${pts}`} />
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          {/* Profile Comparison */}
                          <div className="bg-zinc-900/30 border border-white/5 p-8">
                            <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6"><Activity className="text-[#C5A059]" size={20} />Comparacao com Outros Perfis</h3>
                            <div className="space-y-6">
                              {Object.entries(results).filter(([k]) => k !== result.profile).map(([key, r]) => (
                                <div key={key} className="bg-zinc-800/30 border border-white/5 p-4">
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-zinc-700/50 rounded-full flex items-center justify-center">{r.icon}</div>
                                    <div>
                                      <h4 className="text-white font-medium">{r.title}</h4>
                                      <p className="text-xs text-zinc-500">{r.subtitle}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-zinc-500">Custos:</span> <span className="text-zinc-300">{r.annualCosts.min.toLocaleString()}-{r.annualCosts.max.toLocaleString()}€/ano</span></div>
                                    <div><span className="text-zinc-500">Preco:</span> <span className="text-zinc-300">{r.idealHorse.priceRange}</span></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {selectedTab === 'proximos' && (
                        <div key="proximos" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
                          <div className="bg-zinc-900/30 border border-white/5 p-8"><h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6"><Compass className="text-[#C5A059]" size={20} />Proximos Passos Recomendados</h3><div className="space-y-4">{result.nextSteps.map((s, i) => <div key={i} className="flex items-start gap-4 p-4 bg-zinc-800/30 border border-white/5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 0.1}s` }}><div className="w-8 h-8 bg-[#C5A059] text-black rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">{i + 1}</div><p className="text-zinc-300 pt-1">{s}</p></div>)}</div></div>
                          <div className="bg-gradient-to-r from-[#C5A059]/20 to-transparent border border-[#C5A059]/30 p-8 text-center">
                            <h3 className="text-xl font-serif text-white mb-4">Pronto para Encontrar o Seu Lusitano?</h3>
                            <p className="text-zinc-400 mb-8 max-w-md mx-auto">Explore o nosso directorio de coudelarias ou utilize as nossas ferramentas de analise.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                              <Link href="/directorio" className="inline-flex items-center justify-center gap-2 bg-[#C5A059] text-black px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-white transition-colors"><Briefcase size={18} />Explorar Coudelarias</Link>
                              <Link href={`/calculadora-valor?perfil=${result.profile}&min=${result.idealHorse.priceRange.split(' ')[0].replace('.', '').replace(',', '')}`} className="inline-flex items-center justify-center gap-2 border border-[#C5A059] text-[#C5A059] px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-[#C5A059] hover:text-black transition-colors">Calculadora de Valor<ChevronRight size={18} /></Link>
                            </div>
                          </div>
                        </div>
                      )}

                  </div>
                </section>
                <section className="py-12 border-t border-white/5"><div className="max-w-5xl mx-auto px-6 text-center"><button onClick={resetQuiz} className="inline-flex items-center justify-center gap-2 border border-white/20 text-zinc-400 px-6 py-3 hover:text-white transition-colors"><RotateCcw size={18} />Repetir Analise</button></div></section>
              </>
            )}
          </div>
        )}

    </main>
  );
}

export default function AnalisePerfil() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="text-[#C5A059]">A carregar...</div></div>}>
      <AnalisePerfilContent />
    </Suspense>
  );
}

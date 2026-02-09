"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  MapPin,
  Phone,
  Mail,
  Star,
  Filter,
  Stethoscope,
  Hammer,
  GraduationCap,
  Camera,
  Scissors,
  Briefcase,
  Shield,
  ShieldCheck,
  Award,
  Crown,
  Clock,
  CheckCircle,
  Users,
  Calendar,
  Globe,
  MessageCircle,
  ThumbsUp,
  TrendingUp,
  X,
  ChevronRight,
  Heart,
  Bone,
  Baby,
  Zap,
  Footprints,
  Target,
  Truck,
  Scale,
  BookOpen,
  Mic,
  Video,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  AlertTriangle,
  Trophy,
  Sparkles,
  FileText,
  PlayCircle,
  CalendarDays,
  GraduationCap as Graduation,
  Building,
  Siren,
  Activity,
  PieChart,
  BarChart3,
  MapPinned,
  Languages,
  Verified,
  BadgeCheck,
  Dumbbell,
  Thermometer,
  Microscope,
  Pill,
  Scan,
  Wrench,
  PaintBucket,
  Lightbulb,
  HandHeart,
  UserCheck,
} from "lucide-react";

// =============================================================================
// TIPOS E INTERFACES EXPANDIDAS
// =============================================================================

type NivelVerificacao = "basico" | "verificado" | "certificado" | "expert";
type NivelExpertise = "iniciante" | "intermedio" | "avancado" | "especialista";
type CategoriaProf =
  | "veterinario"
  | "ferrador"
  | "treinador"
  | "fotografo"
  | "tosquiador"
  | "dentista"
  | "quiropratico"
  | "nutricionista"
  | "transportador"
  | "juiz"
  | "inseminador"
  | "instrutor"
  | "seleiro"
  | "massagista";

interface Especializacao {
  nome: string;
  nivel: NivelExpertise;
  certificado?: string;
  anoObtencao?: number;
  instituicao?: string;
}

interface Testemunho {
  cliente: string;
  texto: string;
  data: string;
  avaliacao: number;
  verificado?: boolean;
  cavalo?: string;
}

interface CasoSucesso {
  titulo: string;
  descricao: string;
  resultado: string;
  data: string;
  imagens?: number;
  destaque?: boolean;
}

interface Formacao {
  titulo: string;
  instituicao: string;
  ano: number;
  tipo: "licenciatura" | "mestrado" | "doutoramento" | "certificacao" | "workshop" | "curso";
}

interface Publicacao {
  titulo: string;
  revista?: string;
  ano: number;
  tipo: "artigo" | "livro" | "video" | "podcast";
  link?: string;
}

interface Premio {
  titulo: string;
  ano: number;
  entidade: string;
}

interface MetricasPerformance {
  tempoResposta: string;
  taxaSatisfacao: number;
  casosConcluidosAno: number;
  clientesRecorrentes: number;
  recomendacoes: number;
  anosAtivo: number;
  cavalosAtendidos: number;
  emergenciasAtendidas?: number;
}

interface Disponibilidade {
  diasSemana: string[];
  horaInicio: string;
  horaFim: string;
  emergencias24h: boolean;
  raioServico: number;
  deslocacaoIncluida?: boolean;
  consultaOnline?: boolean;
  listaEspera?: string;
}

interface RedesSociais {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  website?: string;
}

interface Equipamento {
  nome: string;
  descricao: string;
}

interface CursoOferecido {
  titulo: string;
  duracao: string;
  preco: string;
  proximaData?: string;
  vagas?: number;
}

interface Profissional {
  id: string;
  nome: string;
  titulo: string;
  especialidade: string;
  categoria: CategoriaProf;
  localizacao: string;
  distrito: string;
  telefone: string;
  email: string;
  descricao: string;
  avaliacao: number;
  numAvaliacoes: number;
  servicos: string[];
  nivelVerificacao: NivelVerificacao;
  experienciaAnos: number;
  especializacoes: Especializacao[];
  credenciais: string[];
  testemunhos?: Testemunho[];
  casosSucesso?: CasoSucesso[];
  metricas: MetricasPerformance;
  disponibilidade: Disponibilidade;
  precoMedio?: string;
  idiomas: string[];
  associacoes: string[];
  formacao?: Formacao[];
  publicacoes?: Publicacao[];
  premios?: Premio[];
  redesSociais?: RedesSociais;
  equipamento?: Equipamento[];
  cursosOferecidos?: CursoOferecido[];
  seguroProfissional?: boolean;
  nif?: string;
  destaque?: boolean;
  disponivel?: boolean;
  ultimaAtividade?: string;
  fotoUrl?: string;
}

interface Evento {
  id: string;
  titulo: string;
  tipo: "clinica" | "workshop" | "conferencia" | "curso" | "webinar";
  data: string;
  local: string;
  organizador: string;
  preco?: string;
  vagas?: number;
  descricao: string;
}

interface ArtigoEducativo {
  id: string;
  titulo: string;
  autor: string;
  categoria: string;
  resumo: string;
  data: string;
  leituras: number;
}

interface EstatisticasComunidade {
  totalProfissionais: number;
  profissionaisVerificados: number;
  avaliacoesTotal: number;
  mediaAvaliacoes: number;
  casosResolvidos: number;
  clientesSatisfeitos: number;
  anunciosAtivos: number;
  eventosProximos: number;
}

// =============================================================================
// CONSTANTES EXPANDIDAS
// =============================================================================

const categorias: {
  id: CategoriaProf | "todos";
  label: string;
  icon: typeof Briefcase;
  descricao: string;
}[] = [
  { id: "todos", label: "Todos", icon: Briefcase, descricao: "Ver todos os profissionais" },
  {
    id: "veterinario",
    label: "Veterinários",
    icon: Stethoscope,
    descricao: "Medicina equina geral e especializada",
  },
  {
    id: "ferrador",
    label: "Ferradores",
    icon: Hammer,
    descricao: "Ferração normal, ortopédica e correctiva",
  },
  {
    id: "treinador",
    label: "Treinadores",
    icon: GraduationCap,
    descricao: "Dressage, Working Equitation, Salto",
  },
  {
    id: "dentista",
    label: "Dentistas Equinos",
    icon: Scan,
    descricao: "Odontologia equina especializada",
  },
  {
    id: "quiropratico",
    label: "Quiropráticos",
    icon: Activity,
    descricao: "Quiroprática e osteopatia equina",
  },
  {
    id: "nutricionista",
    label: "Nutricionistas",
    icon: Pill,
    descricao: "Nutrição e suplementação equina",
  },
  {
    id: "inseminador",
    label: "Inseminadores",
    icon: Microscope,
    descricao: "Reprodução assistida e IA",
  },
  { id: "fotografo", label: "Fotógrafos", icon: Camera, descricao: "Fotografia e vídeo equestre" },
  {
    id: "transportador",
    label: "Transportadores",
    icon: Truck,
    descricao: "Transporte nacional e internacional",
  },
  { id: "juiz", label: "Juízes", icon: Scale, descricao: "Juízes de concurso e morfologia" },
  { id: "instrutor", label: "Instrutores", icon: BookOpen, descricao: "Ensino de equitação" },
  { id: "seleiro", label: "Seleiros", icon: Wrench, descricao: "Selaria e equipamento equestre" },
  { id: "tosquiador", label: "Tosquiadores", icon: Scissors, descricao: "Tosquia profissional" },
  {
    id: "massagista",
    label: "Massagistas",
    icon: HandHeart,
    descricao: "Massagem e fisioterapia equina",
  },
];

const distritos = [
  "Todos",
  "Aveiro",
  "Beja",
  "Braga",
  "Bragança",
  "Castelo Branco",
  "Coimbra",
  "Évora",
  "Faro",
  "Guarda",
  "Leiria",
  "Lisboa",
  "Portalegre",
  "Porto",
  "Santarém",
  "Setúbal",
  "Viana do Castelo",
  "Vila Real",
  "Viseu",
  "Açores",
  "Madeira",
];

const VERIFICACAO_CONFIG = {
  basico: {
    cor: "text-zinc-400",
    bg: "bg-zinc-800",
    icon: Shield,
    label: "Perfil Básico",
    descricao: "Perfil registado",
  },
  verificado: {
    cor: "text-blue-400",
    bg: "bg-blue-500/20",
    icon: ShieldCheck,
    label: "Verificado",
    descricao: "Identidade confirmada",
  },
  certificado: {
    cor: "text-[#C5A059]",
    bg: "bg-[#C5A059]/20",
    icon: Award,
    label: "Certificado",
    descricao: "Credenciais validadas",
  },
  expert: {
    cor: "text-purple-400",
    bg: "bg-purple-500/20",
    icon: Crown,
    label: "Expert",
    descricao: "Top profissional",
  },
};

const EXPERTISE_CONFIG = {
  iniciante: { cor: "bg-zinc-600", label: "Iniciante", percent: 25 },
  intermedio: { cor: "bg-blue-500", label: "Intermédio", percent: 50 },
  avancado: { cor: "bg-[#C5A059]", label: "Avançado", percent: 75 },
  especialista: { cor: "bg-purple-500", label: "Especialista", percent: 100 },
};

// =============================================================================
// BASE DE DADOS MEGA EXPANDIDA - 20 PROFISSIONAIS
// =============================================================================

const profissionaisDB: Profissional[] = [
  {
    id: "1",
    nome: "Dr. António Silva",
    titulo: "Médico Veterinário Especialista",
    especialidade: "Veterinário Equino - Ortopedia e Medicina Desportiva",
    categoria: "veterinario",
    localizacao: "Lisboa",
    distrito: "Lisboa",
    telefone: "+351 912 345 678",
    email: "dr.antonio@vetequino.pt",
    descricao:
      "Especialista em medicina equina com foco em ortopedia e medicina desportiva. Mais de 20 anos de experiência com cavalos Lusitanos de alta competição. Veterinário oficial em múltiplos campeonatos nacionais e internacionais.",
    avaliacao: 4.9,
    numAvaliacoes: 234,
    servicos: [
      "Consultas gerais",
      "Cirurgia ortopédica",
      "Medicina desportiva",
      "Exames pré-compra completos",
      "Emergências 24h",
      "Radiologia digital",
      "Ecografia musculoesquelética",
      "Artroscopia",
      "PRP/Células estaminais",
      "Shockwave therapy",
      "Mesoterapia",
    ],
    nivelVerificacao: "expert",
    experienciaAnos: 22,
    especializacoes: [
      {
        nome: "Ortopedia Equina",
        nivel: "especialista",
        certificado: "ECVS Diplomate",
        anoObtencao: 2008,
        instituicao: "European College of Veterinary Surgeons",
      },
      {
        nome: "Medicina Desportiva",
        nivel: "especialista",
        certificado: "FEI Official Veterinarian",
        anoObtencao: 2010,
        instituicao: "FEI",
      },
      {
        nome: "Imagiologia Avançada",
        nivel: "avancado",
        certificado: "Diplomate ACVR",
        anoObtencao: 2012,
        instituicao: "American College of Veterinary Radiology",
      },
      {
        nome: "Cirurgia Artroscópica",
        nivel: "especialista",
        certificado: "Advanced Arthroscopy",
        anoObtencao: 2015,
        instituicao: "Colorado State University",
      },
      { nome: "Terapias Regenerativas", nivel: "avancado" },
    ],
    credenciais: [
      "Ordem dos Médicos Veterinários - Cédula 4521",
      "European College of Veterinary Surgeons - Diplomate",
      "FEI Official Veterinarian Level 3",
      "Membro APSL - Veterinários de Referência",
      "American Association of Equine Practitioners",
      "International Society of Equine Locomotor Pathology",
    ],
    testemunhos: [
      {
        cliente: "Coudelaria Real de Alter",
        texto:
          "O Dr. António salvou a carreira desportiva do nosso garanhão principal com uma cirurgia artroscópica impecável. Profissionalismo de nível mundial.",
        data: "2024-01",
        avaliacao: 5,
        verificado: true,
        cavalo: "Altivo II",
      },
      {
        cliente: "João Moura Jr.",
        texto:
          "Acompanha os meus cavalos de toureio há 15 anos. Sempre disponível, mesmo às 3 da manhã. É o melhor.",
        data: "2024-02",
        avaliacao: 5,
        verificado: true,
      },
      {
        cliente: "Coudelaria Veiga",
        texto:
          "Exames pré-compra extremamente detalhados. Encontrou problemas que outros veterinários não viram.",
        data: "2023-11",
        avaliacao: 5,
        verificado: true,
      },
      {
        cliente: "Ana R.",
        texto: "Tratou a tendinite crónica do meu cavalo com PRP. Resultados fantásticos!",
        data: "2024-03",
        avaliacao: 5,
        verificado: false,
      },
    ],
    casosSucesso: [
      {
        titulo: "Recuperação de fratura de boleto em campeão",
        descricao: "Cavalo Grand Prix com fratura por stress complexa do terceiro metacarpo",
        resultado: "Regresso à competição internacional após 14 meses - venceu CDI3* Lisboa",
        data: "2023",
        destaque: true,
        imagens: 8,
      },
      {
        titulo: "Tratamento inovador de OCD bilateral",
        descricao: "Poldro de 2 anos com OCD em ambos os curvilhões, grau III",
        resultado: "Aprovação APSL com pontuação 75/80, exportado para Alemanha",
        data: "2024",
        imagens: 5,
      },
      {
        titulo: "Cirurgia de cólica complicada",
        descricao: "Torção intestinal de 360° em égua prenha",
        resultado: "Égua e poldro salvos, poldro nasceu saudável 4 meses depois",
        data: "2023",
        destaque: true,
        imagens: 3,
      },
    ],
    metricas: {
      tempoResposta: "menos de 30 min",
      taxaSatisfacao: 98,
      casosConcluidosAno: 523,
      clientesRecorrentes: 92,
      recomendacoes: 287,
      anosAtivo: 22,
      cavalosAtendidos: 3500,
      emergenciasAtendidas: 89,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      horaInicio: "07:00",
      horaFim: "20:00",
      emergencias24h: true,
      raioServico: 150,
      deslocacaoIncluida: true,
      consultaOnline: true,
      listaEspera: "1-2 dias",
    },
    precoMedio: "€100-250/consulta",
    idiomas: ["Português", "Inglês", "Espanhol", "Francês"],
    associacoes: ["APSL", "SPMV", "ECVS", "FEI", "AAEP", "ISELP"],
    formacao: [
      {
        titulo: "Licenciatura em Medicina Veterinária",
        instituicao: "Faculdade de Medicina Veterinária - ULisboa",
        ano: 2002,
        tipo: "licenciatura",
      },
      {
        titulo: "Mestrado em Cirurgia Equina",
        instituicao: "Royal Veterinary College - Londres",
        ano: 2005,
        tipo: "mestrado",
      },
      {
        titulo: "Residência ECVS",
        instituicao: "University of Liverpool",
        ano: 2008,
        tipo: "certificacao",
      },
      {
        titulo: "Advanced Equine Arthroscopy",
        instituicao: "Colorado State University",
        ano: 2015,
        tipo: "curso",
      },
    ],
    publicacoes: [
      {
        titulo: "Avanços na cirurgia artroscópica em cavalos Lusitanos",
        revista: "Equine Veterinary Journal",
        ano: 2022,
        tipo: "artigo",
      },
      { titulo: "Manual de Ortopedia Equina Prática", ano: 2020, tipo: "livro" },
      {
        titulo: "Série: Exame Ortopédico Completo",
        ano: 2023,
        tipo: "video",
        link: "youtube.com/@drsilvavet",
      },
    ],
    premios: [
      {
        titulo: "Veterinário do Ano - APSL",
        ano: 2023,
        entidade: "Associação Portuguesa de criadores do cavalo Puro Sangue Lusitano",
      },
      {
        titulo: "Prémio Excelência em Cirurgia Equina",
        ano: 2021,
        entidade: "Sociedade Portuguesa de Medicina Veterinária",
      },
      { titulo: "Best Research Paper", ano: 2022, entidade: "ECVS Annual Congress" },
    ],
    redesSociais: {
      instagram: "@drsilvaequine",
      youtube: "DrSilvaVetEquino",
      linkedin: "dr-antonio-silva-vet",
      website: "www.vetequino.pt",
    },
    equipamento: [
      {
        nome: "Raio-X Digital Portátil",
        descricao: "Sound Eklin - alta resolução para diagnóstico em campo",
      },
      {
        nome: "Ecógrafo Esaote MyLab",
        descricao: "Ecografia musculoesquelética de alta frequência",
      },
      { nome: "Endoscópio Karl Storz", descricao: "Para diagnóstico de vias respiratórias" },
      {
        nome: "Equipamento Shockwave",
        descricao: "Swiss DolorClast para terapia por ondas de choque",
      },
    ],
    cursosOferecidos: [
      {
        titulo: "Exame Ortopédico para Criadores",
        duracao: "2 dias",
        preco: "€350",
        proximaData: "2024-05-15",
        vagas: 12,
      },
      {
        titulo: "Primeiros Socorros Equinos",
        duracao: "1 dia",
        preco: "€150",
        proximaData: "2024-04-20",
        vagas: 20,
      },
    ],
    seguroProfissional: true,
    destaque: true,
    disponivel: true,
    ultimaAtividade: "há 2 horas",
  },
  {
    id: "2",
    nome: "Manuel Ferreira",
    titulo: "Mestre Ferrador Internacional",
    especialidade: "Ferração Ortopédica, Desportiva e Terapêutica",
    categoria: "ferrador",
    localizacao: "Golegã",
    distrito: "Santarém",
    telefone: "+351 923 456 789",
    email: "manuel.ferrador@email.pt",
    descricao:
      "Mestre ferrador com certificação internacional EFFA Level 4 e AFA Certified Journeyman Farrier. Especializado em correção de aprumos, ferradura ortopédica e casos complexos. Formador certificado com alunos em Portugal, Espanha e Brasil.",
    avaliacao: 4.9,
    numAvaliacoes: 189,
    servicos: [
      "Ferração normal",
      "Ferração ortopédica",
      "Correção de aprumos",
      "Cascos descalços (barefoot)",
      "Ferração terapêutica",
      "Palmilhas ortopédicas",
      "Ferração para cavalos de desporto",
      "Tratamento de laminite",
      "Correção de defeitos de casco",
      "Ferração para navicular",
      "Consultoria a distância",
    ],
    nivelVerificacao: "expert",
    experienciaAnos: 25,
    especializacoes: [
      {
        nome: "Ferração Ortopédica",
        nivel: "especialista",
        certificado: "EFFA Level 4",
        anoObtencao: 2010,
        instituicao: "European Federation of Farriers Associations",
      },
      {
        nome: "Correção de Aprumos",
        nivel: "especialista",
        certificado: "AFA Certified Journeyman",
        anoObtencao: 2012,
        instituicao: "American Farrier Association",
      },
      {
        nome: "Tratamento de Laminite",
        nivel: "especialista",
        certificado: "Certified in Equine Podiatry",
        anoObtencao: 2015,
        instituicao: "IAEP",
      },
      { nome: "Barefoot Trimming", nivel: "avancado", certificado: "AANHCP", anoObtencao: 2018 },
      { nome: "Ferração Desportiva", nivel: "especialista" },
    ],
    credenciais: [
      "European Federation of Farriers Associations - Level 4 Master",
      "American Farrier Association - Certified Journeyman Farrier",
      "International Association of Equine Podiatrists",
      "Associação Portuguesa de Ferradores - Membro Fundador",
      "World Championship Blacksmiths - Medalha de Bronze 2019",
    ],
    testemunhos: [
      {
        cliente: "Coudelaria Vale do Tejo",
        texto:
          "Trabalho impecável. Transformou completamente os cascos de um cavalo que dávamos como perdido por laminite crónica.",
        data: "2024-01",
        avaliacao: 5,
        verificado: true,
      },
      {
        cliente: "Centro Hípico Nacional",
        texto:
          "O Manuel ferra todos os nossos cavalos de competição. Nunca tivemos um problema de casco desde que trabalha connosco.",
        data: "2024-02",
        avaliacao: 5,
        verificado: true,
      },
      {
        cliente: "Dr. António Silva",
        texto:
          "Recomendo o Manuel para todos os casos ortopédicos complexos. Colaboramos há 15 anos com excelentes resultados.",
        data: "2023-12",
        avaliacao: 5,
        verificado: true,
      },
    ],
    casosSucesso: [
      {
        titulo: "Recuperação de laminite grau IV",
        descricao: "Cavalo com rotação de P3 de 18 graus, prognóstico reservado",
        resultado:
          "Após 18 meses de trabalho intensivo, cavalo voltou ao trabalho leve - passeios de 1 hora",
        data: "2023",
        destaque: true,
        imagens: 12,
      },
      {
        titulo: "Correção de aprumos em poldro",
        descricao: "Poldro com deformação angular severa (valgus) aos 6 meses",
        resultado: "Aprumos corrigidos aos 18 meses sem necessidade de cirurgia",
        data: "2024",
        imagens: 8,
      },
    ],
    metricas: {
      tempoResposta: "menos de 2 horas",
      taxaSatisfacao: 97,
      casosConcluidosAno: 412,
      clientesRecorrentes: 96,
      recomendacoes: 156,
      anosAtivo: 25,
      cavalosAtendidos: 2800,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      horaInicio: "06:30",
      horaFim: "19:00",
      emergencias24h: true,
      raioServico: 120,
      deslocacaoIncluida: true,
      listaEspera: "2-3 dias",
    },
    precoMedio: "€70-180/ferração",
    idiomas: ["Português", "Espanhol", "Inglês"],
    associacoes: ["EFFA", "AFA", "APF", "IAEP"],
    formacao: [
      {
        titulo: "Curso de Ferrador",
        instituicao: "Escola de Artes e Ofícios",
        ano: 1999,
        tipo: "curso",
      },
      {
        titulo: "EFFA Level 4 Certification",
        instituicao: "EFFA",
        ano: 2010,
        tipo: "certificacao",
      },
      {
        titulo: "Equine Podiatry Certification",
        instituicao: "IAEP",
        ano: 2015,
        tipo: "certificacao",
      },
      {
        titulo: "Advanced Laminitis Treatment",
        instituicao: "Rood & Riddle Equine Hospital",
        ano: 2018,
        tipo: "curso",
      },
    ],
    equipamento: [
      {
        nome: "Forja Portátil NC Tool",
        descricao: "Forja a gás de alta temperatura para trabalho em campo",
      },
      { nome: "Raio-X Portátil", descricao: "Para avaliação de casos ortopédicos" },
      {
        nome: "Kit de Palmilhas Impressão 3D",
        descricao: "Sistema de scan e impressão para palmilhas personalizadas",
      },
    ],
    cursosOferecidos: [
      {
        titulo: "Introdução à Ferração Ortopédica",
        duracao: "3 dias",
        preco: "€600",
        proximaData: "2024-06-01",
        vagas: 8,
      },
      {
        titulo: "Tratamento de Laminite para Veterinários e Ferradores",
        duracao: "2 dias",
        preco: "€450",
        proximaData: "2024-07-15",
        vagas: 10,
      },
    ],
    redesSociais: {
      instagram: "@manuel_ferrador",
      facebook: "ManuelFerreiraFerrador",
      youtube: "MestreFerrador",
    },
    seguroProfissional: true,
    destaque: true,
    disponivel: true,
    ultimaAtividade: "há 5 horas",
  },
  {
    id: "3",
    nome: "Maria Santos",
    titulo: "Cavaleira Internacional FEI",
    especialidade: "Treinadora de Dressage - Grand Prix",
    categoria: "treinador",
    localizacao: "Cascais",
    distrito: "Lisboa",
    telefone: "+351 934 567 890",
    email: "maria.dressage@email.pt",
    descricao:
      "Cavaleira internacional de Dressage com múltiplas participações em campeonatos europeus e mundiais. Formação de cavalos jovens desde o desbaste até Grand Prix. Ex-membro da Seleção Nacional. Especialista em biomecânica e correção de cavaleiros.",
    avaliacao: 5.0,
    numAvaliacoes: 156,
    servicos: [
      "Treino de cavalos jovens",
      "Preparação Grand Prix",
      "Aulas particulares",
      "Clínicas e workshops",
      "Desbaste",
      "Consultoria técnica",
      "Preparação para concursos",
      "Correção de cavaleiros",
      "Treino de freestyle",
      "Análise de vídeo",
      "Programa de competição",
    ],
    nivelVerificacao: "expert",
    experienciaAnos: 28,
    especializacoes: [
      {
        nome: "Dressage - Grand Prix",
        nivel: "especialista",
        certificado: "FEI Level 3 Coach",
        anoObtencao: 2008,
        instituicao: "FEI",
      },
      {
        nome: "Formação de Jovens Cavalos",
        nivel: "especialista",
        certificado: "German FN Trainer A",
        anoObtencao: 2005,
        instituicao: "Deutsche Reiterliche Vereinigung",
      },
      {
        nome: "Biomecânica Equina",
        nivel: "especialista",
        certificado: "Certified Equine Biomechanics",
        anoObtencao: 2012,
      },
      {
        nome: "Equitação Clássica",
        nivel: "especialista",
        certificado: "Spanish Riding School",
        anoObtencao: 2010,
        instituicao: "Escola Espanhola de Viena",
      },
    ],
    credenciais: [
      "FEI Level 3 Dressage Coach",
      "Federação Equestre Portuguesa - Treinadora Nível III",
      "Cavaleira Internacional (CDI-W)",
      "Ex-membro da Seleção Nacional de Dressage (2010-2020)",
      "Medalha de Bronze - Campeonato Europeu 2016",
      "German FN Bereiter/Trainer A",
    ],
    testemunhos: [
      {
        cliente: "Sofia M.",
        texto:
          "A Maria transformou-me e ao meu cavalo. Fomos de São Jorge a Grand Prix em 4 anos com uma metodologia incrível.",
        data: "2024-02",
        avaliacao: 5,
        verificado: true,
      },
      {
        cliente: "Centro Equestre da Marinha",
        texto:
          "Os nossos cavalos jovens treinados pela Maria vendem-se em dias. Metodologia de desbaste exemplar.",
        data: "2024-01",
        avaliacao: 5,
        verificado: true,
      },
      {
        cliente: "Pedro L.",
        texto:
          "Metodologia clara e resultados visíveis. Conseguiu corrigir problemas de postura que tinha há 10 anos.",
        data: "2023-12",
        avaliacao: 5,
        verificado: true,
      },
    ],
    casosSucesso: [
      {
        titulo: "Formação completa Grand Prix",
        descricao: "Lusitano iniciou desbaste aos 4 anos, treino exclusivo",
        resultado: "Campeão Nacional Grand Prix aos 10 anos, 8º no CDI-W Lisboa",
        data: "2023",
        destaque: true,
      },
      {
        titulo: "Recuperação de cavalo problemático",
        descricao: "Cavalo de 8 anos com problemas graves de confiança após acidentes",
        resultado: "Hoje compete a nível Small Tour com proprietária amadora",
        data: "2024",
      },
    ],
    metricas: {
      tempoResposta: "menos de 24 horas",
      taxaSatisfacao: 100,
      casosConcluidosAno: 52,
      clientesRecorrentes: 94,
      recomendacoes: 134,
      anosAtivo: 28,
      cavalosAtendidos: 450,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      horaInicio: "07:00",
      horaFim: "19:00",
      emergencias24h: false,
      raioServico: 60,
      consultaOnline: true,
      listaEspera: "2-4 semanas",
    },
    precoMedio: "€60-100/aula",
    idiomas: ["Português", "Inglês", "Francês", "Alemão"],
    associacoes: ["FEP", "FEI", "APSL", "IDTC"],
    formacao: [
      {
        titulo: "German FN Bereiter",
        instituicao: "Westfälische Reit- und Fahrschule",
        ano: 2000,
        tipo: "certificacao",
      },
      {
        titulo: "German FN Trainer A",
        instituicao: "Deutsche Reiterliche Vereinigung",
        ano: 2005,
        tipo: "certificacao",
      },
      {
        titulo: "Stage na Escola Espanhola de Viena",
        instituicao: "Spanish Riding School",
        ano: 2010,
        tipo: "curso",
      },
      { titulo: "FEI Level 3 Coach", instituicao: "FEI", ano: 2008, tipo: "certificacao" },
    ],
    publicacoes: [
      { titulo: "O Lusitano no Dressage Moderno", ano: 2021, tipo: "livro" },
      {
        titulo: "Série: Do Desbaste ao Grand Prix",
        ano: 2023,
        tipo: "video",
        link: "youtube.com/@mariasantosdressage",
      },
    ],
    premios: [
      { titulo: "Medalha de Bronze - Campeonato Europeu", ano: 2016, entidade: "FEI" },
      { titulo: "Campeã Nacional de Dressage", ano: 2018, entidade: "FEP" },
      { titulo: "Melhor Treinadora do Ano", ano: 2022, entidade: "FEP" },
    ],
    redesSociais: {
      instagram: "@mariasantos_dressage",
      youtube: "MariaSantosDressage",
      facebook: "MariaSantosDressageOfficial",
      website: "www.mariadressage.pt",
    },
    cursosOferecidos: [
      {
        titulo: "Clínica de Dressage - Todos os níveis",
        duracao: "2 dias",
        preco: "€300",
        proximaData: "2024-05-20",
        vagas: 10,
      },
      {
        titulo: "Curso Intensivo - Preparação para concurso",
        duracao: "5 dias",
        preco: "€800",
        proximaData: "2024-06-10",
        vagas: 6,
      },
    ],
    seguroProfissional: true,
    destaque: true,
    disponivel: true,
    ultimaAtividade: "há 1 hora",
  },
  {
    id: "4",
    nome: "Dra. Carla Mendes",
    titulo: "Médica Veterinária - Reprodução",
    especialidade: "Reprodução Equina e Neonatologia",
    categoria: "veterinario",
    localizacao: "Golegã",
    distrito: "Santarém",
    telefone: "+351 956 789 012",
    email: "carla.repro@email.pt",
    descricao:
      "Especialista em reprodução equina com formação internacional nos EUA e Europa. Pioneira em Portugal em transferência de embriões e ICSI. Acompanhamento completo desde a inseminação até ao nascimento do poldro.",
    avaliacao: 4.9,
    numAvaliacoes: 178,
    servicos: [
      "Inseminação artificial fresco/refrigerado/congelado",
      "Transferência de embriões",
      "ICSI (injeção intracitoplasmática)",
      "Ecografia reprodutiva",
      "Acompanhamento de gestação",
      "Neonatologia",
      "Congelação de sémen",
      "Avaliação de sémen",
      "Tratamento de infertilidade",
      "Sincronização de cios",
      "Parto assistido",
    ],
    nivelVerificacao: "expert",
    experienciaAnos: 15,
    especializacoes: [
      {
        nome: "Reprodução Assistida",
        nivel: "especialista",
        certificado: "ACT Diplomate",
        anoObtencao: 2014,
        instituicao: "American College of Theriogenologists",
      },
      {
        nome: "Transferência de Embriões",
        nivel: "especialista",
        certificado: "IETS Certified",
        anoObtencao: 2016,
        instituicao: "International Embryo Technology Society",
      },
      {
        nome: "Neonatologia Equina",
        nivel: "especialista",
        certificado: "Neonatal Intensive Care",
        anoObtencao: 2018,
        instituicao: "University of Pennsylvania",
      },
      {
        nome: "ICSI Equino",
        nivel: "especialista",
        certificado: "Advanced ART",
        anoObtencao: 2020,
        instituicao: "Texas A&M University",
      },
    ],
    credenciais: [
      "Ordem dos Médicos Veterinários - Cédula 6234",
      "American College of Theriogenologists - Diplomate",
      "European College of Animal Reproduction - Resident",
      "Especialista em Reprodução Equina ECAR",
      "International Embryo Technology Society",
    ],
    testemunhos: [
      {
        cliente: "Coudelaria Veiga",
        texto:
          "A Dra. Carla conseguiu 5 gestações de uma égua velha que nunca tinha conseguido emprenhar. Trabalho extraordinário.",
        data: "2024-01",
        avaliacao: 5,
        verificado: true,
      },
      {
        cliente: "Stud Interagro Brasil",
        texto:
          "Trouxemos a Dra. Carla ao Brasil para um programa de ICSI. Taxa de sucesso acima de qualquer expectativa.",
        data: "2023-10",
        avaliacao: 5,
        verificado: true,
      },
    ],
    casosSucesso: [
      {
        titulo: "Programa ICSI com sucesso recorde",
        descricao: "12 éguas doadoras, garanhão falecido (sémen congelado)",
        resultado: "9 gestações confirmadas, 8 poldros nascidos saudáveis",
        data: "2024",
        destaque: true,
      },
      {
        titulo: "Salvamento de poldro prematuro",
        descricao: "Poldro nascido aos 300 dias, 28kg",
        resultado: "Após 45 dias de cuidados intensivos, poldro saudável hoje com 2 anos",
        data: "2022",
        destaque: true,
      },
    ],
    metricas: {
      tempoResposta: "menos de 1 hora",
      taxaSatisfacao: 98,
      casosConcluidosAno: 342,
      clientesRecorrentes: 91,
      recomendacoes: 145,
      anosAtivo: 15,
      cavalosAtendidos: 2100,
      emergenciasAtendidas: 67,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
      horaInicio: "05:00",
      horaFim: "22:00",
      emergencias24h: true,
      raioServico: 200,
      consultaOnline: true,
      listaEspera: "1-2 semanas (época reprodutiva)",
    },
    precoMedio: "€150-500/procedimento",
    idiomas: ["Português", "Inglês", "Espanhol", "Francês"],
    associacoes: ["OMV", "ACT", "ECAR", "IETS", "APSL"],
    equipamento: [
      { nome: "Ecógrafo Esaote MyLab X8", descricao: "Ecografia reprodutiva de alta resolução" },
      {
        nome: "Laboratório ICSI Completo",
        descricao: "Equipamento Eppendorf para micromanipulação",
      },
      { nome: "Tanques de Azoto Líquido", descricao: "Para armazenamento de embriões e sémen" },
    ],
    seguroProfissional: true,
    destaque: true,
    disponivel: true,
    ultimaAtividade: "há 3 horas",
  },
  {
    id: "5",
    nome: "Dr. Rui Monteiro",
    titulo: "Dentista Equino Certificado",
    especialidade: "Odontologia Equina Avançada",
    categoria: "dentista",
    localizacao: "Coimbra",
    distrito: "Coimbra",
    telefone: "+351 918 234 567",
    email: "rui.dentista@equinedent.pt",
    descricao:
      "Dentista equino certificado pela BEVA e IAED com foco em odontologia preventiva e tratamento de patologias complexas. Equipamento de última geração incluindo radiografia digital oral.",
    avaliacao: 4.8,
    numAvaliacoes: 145,
    servicos: [
      "Exame oral completo",
      "Nivelamento dentário",
      "Extração de dentes de lobo",
      "Tratamento de diastemas",
      "Radiografia oral digital",
      "Tratamento de cáries",
      "Remoção de pontas de esmalte",
      "Tratamento de EOTRH",
      "Odontologia geriátrica",
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 12,
    especializacoes: [
      {
        nome: "Odontologia Equina",
        nivel: "especialista",
        certificado: "BEVA Dental Technician",
        anoObtencao: 2014,
        instituicao: "British Equine Veterinary Association",
      },
      {
        nome: "Radiografia Oral",
        nivel: "avancado",
        certificado: "IAED Certified",
        anoObtencao: 2016,
        instituicao: "International Association of Equine Dentistry",
      },
      { nome: "Cirurgia Oral", nivel: "avancado" },
    ],
    credenciais: [
      "BEVA Certified Equine Dental Technician",
      "International Association of Equine Dentistry",
      "Associação Portuguesa de Medicina Veterinária Equina",
    ],
    metricas: {
      tempoResposta: "menos de 4 horas",
      taxaSatisfacao: 96,
      casosConcluidosAno: 289,
      clientesRecorrentes: 88,
      recomendacoes: 98,
      anosAtivo: 12,
      cavalosAtendidos: 1800,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
      horaInicio: "08:00",
      horaFim: "18:00",
      emergencias24h: false,
      raioServico: 100,
      deslocacaoIncluida: true,
    },
    precoMedio: "€80-200/tratamento",
    idiomas: ["Português", "Inglês", "Espanhol"],
    associacoes: ["BEVA", "IAED", "APMVE"],
    seguroProfissional: true,
    disponivel: true,
    ultimaAtividade: "há 8 horas",
  },
  {
    id: "6",
    nome: "Pedro Almeida",
    titulo: "Cavaleiro Profissional",
    especialidade: "Equitação de Trabalho e Toureio",
    categoria: "treinador",
    localizacao: "Évora",
    distrito: "Évora",
    telefone: "+351 967 890 123",
    email: "pedro.trabalho@email.pt",
    descricao:
      "Cavaleiro profissional de Equitação de Trabalho com múltiplos títulos nacionais e internacionais. Especialista em desbaste tradicional à portuguesa e preparação de cavalos para toureio a cavalo.",
    avaliacao: 4.9,
    numAvaliacoes: 112,
    servicos: [
      "Treino específico Working Equitation",
      "Preparação para competição",
      "Clínicas e workshops",
      "Desbaste tradicional",
      "Treino de gado",
      "Preparação para toureio",
      "Treino de conjuntos amadores",
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 22,
    especializacoes: [
      {
        nome: "Equitação de Trabalho",
        nivel: "especialista",
        certificado: "WAWE International Judge",
        anoObtencao: 2015,
        instituicao: "WAWE",
      },
      { nome: "Desbaste Tradicional", nivel: "especialista" },
      { nome: "Treino de Gado", nivel: "especialista" },
      { nome: "Preparação Toureio", nivel: "avancado" },
    ],
    credenciais: [
      "FEP - Treinador Nível III Working Equitation",
      "WAWE International Judge",
      "Campeão Nacional de Working Equitation (2019, 2021, 2023)",
      "Medalha de Prata - Campeonato do Mundo WE 2022",
    ],
    testemunhos: [
      {
        cliente: "Francisco T.",
        texto:
          "O Pedro preparou o meu cavalo para o campeonato nacional. Resultado: medalha de bronze na primeira participação!",
        data: "2024-01",
        avaliacao: 5,
        verificado: true,
      },
    ],
    metricas: {
      tempoResposta: "menos de 6 horas",
      taxaSatisfacao: 97,
      casosConcluidosAno: 78,
      clientesRecorrentes: 91,
      recomendacoes: 67,
      anosAtivo: 22,
      cavalosAtendidos: 320,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
      horaInicio: "07:00",
      horaFim: "18:00",
      emergencias24h: false,
      raioServico: 100,
    },
    precoMedio: "€45-80/aula",
    idiomas: ["Português", "Espanhol", "Inglês"],
    associacoes: ["FEP", "WAWE", "APSL"],
    seguroProfissional: true,
    disponivel: true,
    ultimaAtividade: "há 12 horas",
  },
  {
    id: "7",
    nome: "João Costa",
    titulo: "Fotógrafo Equestre Profissional",
    especialidade: "Fotografia e Vídeo Equestre Premium",
    categoria: "fotografo",
    localizacao: "Santarém",
    distrito: "Santarém",
    telefone: "+351 945 678 901",
    email: "joao.foto@email.pt",
    descricao:
      "Fotógrafo equestre premiado com publicações em revistas internacionais. Especializado em retratos artísticos de cavalos Lusitanos, cobertura de eventos e produção de vídeo promocional de alta qualidade.",
    avaliacao: 4.9,
    numAvaliacoes: 89,
    servicos: [
      "Sessões em coudelaria",
      "Cobertura de competições",
      "Retratos artísticos",
      "Vídeo promocional 4K",
      "Catálogos de venda",
      "Fotos para stud books",
      "Fotos aéreas com drone",
      "Edição profissional",
      "Impressão fine art",
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 15,
    especializacoes: [
      { nome: "Fotografia Equestre", nivel: "especialista" },
      { nome: "Vídeo 4K/Cinema", nivel: "avancado" },
      {
        nome: "Fotografia Aérea",
        nivel: "avancado",
        certificado: "Piloto Drone A2",
        anoObtencao: 2021,
      },
      { nome: "Pós-produção", nivel: "especialista" },
    ],
    credenciais: [
      "Membro da Associação Portuguesa de Fotógrafos",
      "Fotógrafo Oficial APSL 2020-2024",
      "Publicações: Horse International, Lusitano Magazine, Cavalo Magazine",
      "Prémio Melhor Fotografia Equestre 2022",
    ],
    premios: [
      { titulo: "Melhor Fotografia Equestre", ano: 2022, entidade: "APF" },
      { titulo: "1º Lugar - Concurso APSL", ano: 2023, entidade: "APSL" },
    ],
    metricas: {
      tempoResposta: "menos de 12 horas",
      taxaSatisfacao: 98,
      casosConcluidosAno: 134,
      clientesRecorrentes: 85,
      recomendacoes: 78,
      anosAtivo: 15,
      cavalosAtendidos: 1200,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
      horaInicio: "05:00",
      horaFim: "21:00",
      emergencias24h: false,
      raioServico: 300,
    },
    precoMedio: "€400-1500/sessão",
    idiomas: ["Português", "Inglês", "Francês"],
    associacoes: ["APF", "APSL"],
    equipamento: [
      { nome: "Canon R5 + R3", descricao: "Câmaras profissionais full-frame" },
      { nome: "Lentes Canon L Series", descricao: "70-200 f/2.8, 24-70 f/2.8, 85 f/1.2" },
      { nome: "DJI Mavic 3 Pro", descricao: "Drone profissional para fotos aéreas" },
      { nome: "Iluminação Profoto", descricao: "Kit de iluminação para sessões em estúdio" },
    ],
    redesSociais: {
      instagram: "@joaocostaphoto",
      facebook: "JoaoCostaEquinePhotography",
      website: "www.joaocostaphoto.pt",
    },
    seguroProfissional: true,
    destaque: true,
    disponivel: true,
    ultimaAtividade: "há 4 horas",
  },
  {
    id: "8",
    nome: "Dra. Sofia Rodrigues",
    titulo: "Quiroprática Equina Certificada",
    especialidade: "Quiroprática e Osteopatia Equina",
    categoria: "quiropratico",
    localizacao: "Porto",
    distrito: "Porto",
    telefone: "+351 929 345 678",
    email: "sofia.quiro@equinewellness.pt",
    descricao:
      "Quiroprática equina certificada com formação na IVCA. Especializada em diagnóstico e tratamento de disfunções biomecânicas, com foco em cavalos de desporto e recuperação de lesões.",
    avaliacao: 4.8,
    numAvaliacoes: 98,
    servicos: [
      "Avaliação quiropráctica completa",
      "Ajustes quiropráticos",
      "Osteopatia equina",
      "Mobilização articular",
      "Tratamento de dor lombar",
      "Avaliação de performance",
      "Reabilitação pós-lesão",
      "Manutenção preventiva",
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 10,
    especializacoes: [
      {
        nome: "Quiroprática Equina",
        nivel: "especialista",
        certificado: "IVCA Certified",
        anoObtencao: 2016,
        instituicao: "International Veterinary Chiropractic Association",
      },
      {
        nome: "Osteopatia Animal",
        nivel: "avancado",
        certificado: "AOA Certified",
        anoObtencao: 2018,
      },
      { nome: "Reabilitação Equina", nivel: "avancado" },
    ],
    credenciais: [
      "International Veterinary Chiropractic Association - Certified",
      "American Osteopathic Association - Animal Osteopathy",
      "Médica Veterinária - OMV 7234",
    ],
    testemunhos: [
      {
        cliente: "Maria Santos (Treinadora)",
        texto:
          "A Sofia é essencial na minha equipa. Os cavalos movem-se muito melhor após os tratamentos. Recomendo a 100%.",
        data: "2024-02",
        avaliacao: 5,
        verificado: true,
      },
    ],
    metricas: {
      tempoResposta: "menos de 8 horas",
      taxaSatisfacao: 96,
      casosConcluidosAno: 245,
      clientesRecorrentes: 89,
      recomendacoes: 76,
      anosAtivo: 10,
      cavalosAtendidos: 890,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
      horaInicio: "09:00",
      horaFim: "18:00",
      emergencias24h: false,
      raioServico: 80,
      consultaOnline: true,
    },
    precoMedio: "€100-180/sessão",
    idiomas: ["Português", "Inglês", "Espanhol"],
    associacoes: ["IVCA", "AOA", "OMV"],
    seguroProfissional: true,
    disponivel: true,
    ultimaAtividade: "há 6 horas",
  },
  {
    id: "9",
    nome: "Dr. Miguel Fernandes",
    titulo: "Nutricionista Equino",
    especialidade: "Nutrição e Dietética Equina",
    categoria: "nutricionista",
    localizacao: "Lisboa",
    distrito: "Lisboa",
    telefone: "+351 913 456 789",
    email: "miguel.nutri@equinenutrition.pt",
    descricao:
      "Especialista em nutrição equina com doutoramento em fisiologia digestiva equina. Desenvolve planos nutricionais personalizados para cavalos de desporto, reprodução e recuperação.",
    avaliacao: 4.7,
    numAvaliacoes: 67,
    servicos: [
      "Avaliação nutricional completa",
      "Planos alimentares personalizados",
      "Suplementação desportiva",
      "Nutrição reprodutiva",
      "Controlo de peso",
      "Tratamento de úlceras gástricas",
      "Análise de feno e rações",
      "Consultoria a coudelarias",
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 8,
    especializacoes: [
      {
        nome: "Nutrição Desportiva",
        nivel: "especialista",
        certificado: "Equine Nutritionist",
        anoObtencao: 2018,
        instituicao: "University of Edinburgh",
      },
      {
        nome: "Fisiologia Digestiva",
        nivel: "especialista",
        certificado: "PhD",
        anoObtencao: 2020,
        instituicao: "FMV-ULisboa",
      },
      { nome: "Nutrição Reprodutiva", nivel: "avancado" },
    ],
    credenciais: [
      "Doutoramento em Fisiologia Digestiva Equina - FMV-ULisboa",
      "Certified Equine Nutritionist - University of Edinburgh",
      "Membro da Equine Science Society",
    ],
    metricas: {
      tempoResposta: "menos de 24 horas",
      taxaSatisfacao: 94,
      casosConcluidosAno: 156,
      clientesRecorrentes: 82,
      recomendacoes: 45,
      anosAtivo: 8,
      cavalosAtendidos: 420,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
      horaInicio: "09:00",
      horaFim: "18:00",
      emergencias24h: false,
      raioServico: 150,
      consultaOnline: true,
    },
    precoMedio: "€80-150/consulta",
    idiomas: ["Português", "Inglês"],
    associacoes: ["ESS", "OMV", "APSL"],
    publicacoes: [
      { titulo: "Nutrição do Cavalo Lusitano de Desporto", ano: 2022, tipo: "livro" },
      {
        titulo: "Impact of Diet on Gastric Ulcers in Performance Horses",
        revista: "Equine Veterinary Journal",
        ano: 2021,
        tipo: "artigo",
      },
    ],
    seguroProfissional: true,
    disponivel: true,
    ultimaAtividade: "há 10 horas",
  },
  {
    id: "10",
    nome: "António Marques",
    titulo: "Transportador Equino Certificado",
    especialidade: "Transporte Nacional e Internacional de Equinos",
    categoria: "transportador",
    localizacao: "Santarém",
    distrito: "Santarém",
    telefone: "+351 965 432 109",
    email: "antonio.transport@equinetrans.pt",
    descricao:
      "Empresa de transporte equino com 20 anos de experiência. Frota moderna com veículos climatizados e sistemas de monitorização GPS. Transporte para toda a Europa com documentação incluída.",
    avaliacao: 4.8,
    numAvaliacoes: 234,
    servicos: [
      "Transporte nacional",
      "Transporte internacional",
      "Transporte urgente",
      "Transporte de competição",
      "Transporte de garanhões",
      "Quarentena incluída",
      "Documentação completa",
      "Seguro de transporte",
      "Paragens programadas",
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 20,
    especializacoes: [
      {
        nome: "Transporte Internacional",
        nivel: "especialista",
        certificado: "TRACES Certified",
        anoObtencao: 2010,
      },
      { nome: "Transporte de Competição", nivel: "especialista" },
      { nome: "Logística Equina", nivel: "avancado" },
    ],
    credenciais: [
      "Licença de Transporte de Animais Vivos - DGAV",
      "TRACES Certified Operator",
      "Certificação ATP para veículos",
      "Seguro de carga €500.000",
    ],
    metricas: {
      tempoResposta: "menos de 2 horas",
      taxaSatisfacao: 97,
      casosConcluidosAno: 456,
      clientesRecorrentes: 88,
      recomendacoes: 123,
      anosAtivo: 20,
      cavalosAtendidos: 4500,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
      horaInicio: "00:00",
      horaFim: "23:59",
      emergencias24h: true,
      raioServico: 3000,
    },
    precoMedio: "€200-2000/transporte",
    idiomas: ["Português", "Espanhol", "Inglês", "Francês"],
    associacoes: ["APAT", "DGAV"],
    equipamento: [
      { nome: "Camião Mercedes Actros", descricao: "6 cavalos, climatizado, suspensão pneumática" },
      { nome: "Van Böckmann", descricao: "2 cavalos, ideal para deslocações curtas" },
      { nome: "Sistema GPS", descricao: "Monitorização em tempo real" },
    ],
    seguroProfissional: true,
    destaque: true,
    disponivel: true,
    ultimaAtividade: "há 1 hora",
  },
  {
    id: "11",
    nome: "Dr. Carlos Moreira",
    titulo: "Juiz Internacional FEI",
    especialidade: "Juiz de Dressage e Morfologia",
    categoria: "juiz",
    localizacao: "Lisboa",
    distrito: "Lisboa",
    telefone: "+351 917 654 321",
    email: "carlos.juiz@fei.pt",
    descricao:
      "Juiz internacional FEI 4* de Dressage e juiz oficial da APSL para concursos morfológicos. Vasta experiência em campeonatos europeus e mundiais. Disponível para clínicas de formação de juízes.",
    avaliacao: 5.0,
    numAvaliacoes: 45,
    servicos: [
      "Juiz de dressage FEI",
      "Juiz de morfologia APSL",
      "Clínicas de formação",
      "Avaliação técnica de cavalos",
      "Consultoria de criação",
      "Workshops para cavaleiros",
    ],
    nivelVerificacao: "expert",
    experienciaAnos: 30,
    especializacoes: [
      {
        nome: "Juiz de Dressage",
        nivel: "especialista",
        certificado: "FEI 4*",
        anoObtencao: 2010,
        instituicao: "FEI",
      },
      {
        nome: "Juiz de Morfologia",
        nivel: "especialista",
        certificado: "APSL Official",
        anoObtencao: 2005,
        instituicao: "APSL",
      },
    ],
    credenciais: [
      "FEI 4* Dressage Judge",
      "APSL Official Morphology Judge",
      "Juiz em 3 Campeonatos Europeus",
      "Juiz em 2 Campeonatos do Mundo",
    ],
    metricas: {
      tempoResposta: "menos de 48 horas",
      taxaSatisfacao: 100,
      casosConcluidosAno: 34,
      clientesRecorrentes: 95,
      recomendacoes: 89,
      anosAtivo: 30,
      cavalosAtendidos: 5000,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Quarta", "Sexta"],
      horaInicio: "10:00",
      horaFim: "17:00",
      emergencias24h: false,
      raioServico: 500,
      consultaOnline: true,
    },
    precoMedio: "€300-1000/evento",
    idiomas: ["Português", "Inglês", "Francês", "Alemão", "Espanhol"],
    associacoes: ["FEI", "FEP", "APSL"],
    seguroProfissional: true,
    destaque: true,
    disponivel: true,
    ultimaAtividade: "há 2 dias",
  },
  {
    id: "12",
    nome: "Ricardo Sousa",
    titulo: "Técnico de Inseminação",
    especialidade: "Reprodução Assistida e Inseminação Artificial",
    categoria: "inseminador",
    localizacao: "Golegã",
    distrito: "Santarém",
    telefone: "+351 926 789 012",
    email: "ricardo.ia@reprolusi.pt",
    descricao:
      "Técnico de inseminação artificial certificado com mais de 15 anos de experiência. Trabalho em colaboração com os principais veterinários reprodutores. Especializado em sémen congelado.",
    avaliacao: 4.7,
    numAvaliacoes: 123,
    servicos: [
      "Inseminação artificial fresco",
      "Inseminação refrigerado",
      "Inseminação congelado",
      "Colheita de sémen",
      "Avaliação de sémen",
      "Sincronização de cios",
      "Detecção de ovulação",
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 15,
    especializacoes: [
      {
        nome: "Inseminação Artificial",
        nivel: "especialista",
        certificado: "AETE Certified",
        anoObtencao: 2012,
        instituicao: "Association of Embryo Technology in Europe",
      },
      { nome: "Avaliação de Sémen", nivel: "avancado" },
      { nome: "Criopreservação", nivel: "avancado" },
    ],
    credenciais: [
      "AETE Certified Technician",
      "Certificação DGAV para IA",
      "Colaborador de múltiplas coudelarias APSL",
    ],
    metricas: {
      tempoResposta: "menos de 2 horas",
      taxaSatisfacao: 94,
      casosConcluidosAno: 312,
      clientesRecorrentes: 86,
      recomendacoes: 67,
      anosAtivo: 15,
      cavalosAtendidos: 2200,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
      horaInicio: "05:00",
      horaFim: "22:00",
      emergencias24h: true,
      raioServico: 100,
    },
    precoMedio: "€80-200/inseminação",
    idiomas: ["Português", "Espanhol"],
    associacoes: ["AETE", "APSL"],
    seguroProfissional: true,
    disponivel: true,
    ultimaAtividade: "há 3 horas",
  },
  {
    id: "13",
    nome: "Catarina Lima",
    titulo: "Instrutora de Equitação",
    especialidade: "Ensino de Equitação - Iniciação a Avançado",
    categoria: "instrutor",
    localizacao: "Setúbal",
    distrito: "Setúbal",
    telefone: "+351 938 765 432",
    email: "catarina.equita@centroequestre.pt",
    descricao:
      "Instrutora certificada pela FEP com especialização em equitação terapêutica e ensino infantil. Metodologia gentil baseada em comunicação e confiança. Centro hípico próprio com 15 cavalos de escola.",
    avaliacao: 4.9,
    numAvaliacoes: 178,
    servicos: [
      "Aulas de iniciação",
      "Aulas avançadas",
      "Equitação terapêutica",
      "Aulas para crianças",
      "Preparação para exames FEP",
      "Passeios a cavalo",
      "Festas de aniversário",
      "Campos de férias",
    ],
    nivelVerificacao: "verificado",
    experienciaAnos: 12,
    especializacoes: [
      {
        nome: "Ensino de Equitação",
        nivel: "avancado",
        certificado: "FEP Nível II",
        anoObtencao: 2015,
        instituicao: "Federação Equestre Portuguesa",
      },
      {
        nome: "Equitação Terapêutica",
        nivel: "especialista",
        certificado: "ANDE-Brasil",
        anoObtencao: 2018,
      },
      { nome: "Pedagogia Infantil", nivel: "avancado" },
    ],
    credenciais: [
      "Instrutora FEP Nível II",
      "Certificação em Equitação Terapêutica - ANDE-Brasil",
      "Formação em Primeiros Socorros",
    ],
    testemunhos: [
      {
        cliente: "Mãe da Beatriz (8 anos)",
        texto: "A Catarina é incrível com crianças. A minha filha adora as aulas e evolui imenso!",
        data: "2024-02",
        avaliacao: 5,
        verificado: true,
      },
    ],
    metricas: {
      tempoResposta: "menos de 6 horas",
      taxaSatisfacao: 98,
      casosConcluidosAno: 420,
      clientesRecorrentes: 92,
      recomendacoes: 134,
      anosAtivo: 12,
      cavalosAtendidos: 15,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      horaInicio: "09:00",
      horaFim: "19:00",
      emergencias24h: false,
      raioServico: 30,
    },
    precoMedio: "€25-50/aula",
    idiomas: ["Português", "Inglês"],
    associacoes: ["FEP", "ANDE"],
    seguroProfissional: true,
    disponivel: true,
    ultimaAtividade: "há 4 horas",
  },
  {
    id: "14",
    nome: "Mestre José Ribeiro",
    titulo: "Seleiro Artesanal",
    especialidade: "Selaria Tradicional Portuguesa",
    categoria: "seleiro",
    localizacao: "Golegã",
    distrito: "Santarém",
    telefone: "+351 919 876 543",
    email: "jose.seleiro@artesanaria.pt",
    descricao:
      "Seleiro artesanal de 3ª geração, especializado em selaria portuguesa tradicional. Trabalho 100% artesanal com couro de primeira qualidade. Fornecedor de coudelarias reais e cavaleiros profissionais.",
    avaliacao: 5.0,
    numAvaliacoes: 67,
    servicos: [
      "Selas portuguesas por medida",
      "Arreios completos",
      "Reparação de equipamento",
      "Bridões artesanais",
      "Acessórios em couro",
      "Gravações personalizadas",
      "Restauro de peças antigas",
    ],
    nivelVerificacao: "expert",
    experienciaAnos: 35,
    especializacoes: [
      { nome: "Selaria Portuguesa", nivel: "especialista" },
      { nome: "Trabalho em Couro", nivel: "especialista" },
      { nome: "Restauro", nivel: "avancado" },
    ],
    credenciais: [
      "Mestre Artesão Certificado - IEFP",
      "Fornecedor Oficial da Coudelaria de Alter",
      "Prémio Nacional de Artesanato 2019",
    ],
    metricas: {
      tempoResposta: "menos de 24 horas",
      taxaSatisfacao: 100,
      casosConcluidosAno: 45,
      clientesRecorrentes: 95,
      recomendacoes: 89,
      anosAtivo: 35,
      cavalosAtendidos: 800,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
      horaInicio: "08:00",
      horaFim: "18:00",
      emergencias24h: false,
      raioServico: 50,
    },
    precoMedio: "€800-5000/sela",
    idiomas: ["Português", "Espanhol"],
    associacoes: ["AARN", "APSL"],
    premios: [{ titulo: "Prémio Nacional de Artesanato", ano: 2019, entidade: "IEFP" }],
    seguroProfissional: true,
    destaque: true,
    disponivel: true,
    ultimaAtividade: "há 8 horas",
  },
  {
    id: "15",
    nome: "Ana Beatriz Carvalho",
    titulo: "Tosquiadora Profissional",
    especialidade: "Tosquia Artística e de Competição",
    categoria: "tosquiador",
    localizacao: "Cascais",
    distrito: "Lisboa",
    telefone: "+351 927 654 321",
    email: "ana.tosquia@equinegrooming.pt",
    descricao:
      "Tosquiadora profissional certificada com especialização em tosquia de competição e artística. Técnicas gentis que minimizam stress. Equipamento silencioso de última geração.",
    avaliacao: 4.8,
    numAvaliacoes: 112,
    servicos: [
      "Tosquia completa",
      "Tosquia de competição",
      "Tosquia artística",
      "Trace clip",
      "Blanket clip",
      "Hunter clip",
      "Aparar crinas e caudas",
      "Preparação para concursos",
    ],
    nivelVerificacao: "verificado",
    experienciaAnos: 8,
    especializacoes: [
      { nome: "Tosquia de Competição", nivel: "especialista" },
      { nome: "Tosquia Artística", nivel: "avancado" },
      { nome: "Grooming Geral", nivel: "especialista" },
    ],
    credenciais: ["Certificação em Grooming Equino - UK", "Formação em Handling Gentil"],
    metricas: {
      tempoResposta: "menos de 4 horas",
      taxaSatisfacao: 96,
      casosConcluidosAno: 234,
      clientesRecorrentes: 88,
      recomendacoes: 67,
      anosAtivo: 8,
      cavalosAtendidos: 1200,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      horaInicio: "07:00",
      horaFim: "18:00",
      emergencias24h: false,
      raioServico: 60,
      deslocacaoIncluida: true,
    },
    precoMedio: "€60-150/tosquia",
    idiomas: ["Português", "Inglês"],
    associacoes: ["BEGA"],
    equipamento: [
      { nome: "Máquinas Heiniger", descricao: "Equipamento profissional suíço, silencioso" },
      { nome: "Kit completo de lâminas", descricao: "Para todos os tipos de tosquia" },
    ],
    seguroProfissional: true,
    disponivel: true,
    ultimaAtividade: "há 6 horas",
  },
  {
    id: "16",
    nome: "Dra. Helena Martins",
    titulo: "Fisioterapeuta Equina",
    especialidade: "Fisioterapia e Massagem Equina",
    categoria: "massagista",
    localizacao: "Braga",
    distrito: "Braga",
    telefone: "+351 934 567 890",
    email: "helena.fisio@equinephysio.pt",
    descricao:
      "Fisioterapeuta equina certificada com formação no Reino Unido. Tratamento de lesões musculoesqueléticas, reabilitação pós-cirúrgica e manutenção de cavalos de desporto.",
    avaliacao: 4.9,
    numAvaliacoes: 87,
    servicos: [
      "Fisioterapia manual",
      "Massagem desportiva",
      "Reabilitação pós-lesão",
      "Eletroterapia",
      "Laser terapia",
      "Kinesiotaping equino",
      "Hidroterapia",
      "Programa de exercícios",
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 9,
    especializacoes: [
      {
        nome: "Fisioterapia Equina",
        nivel: "especialista",
        certificado: "ACPAT Registered",
        anoObtencao: 2017,
        instituicao: "Association of Chartered Physiotherapists in Animal Therapy",
      },
      { nome: "Massagem Desportiva", nivel: "especialista" },
      { nome: "Reabilitação", nivel: "avancado" },
    ],
    credenciais: [
      "ACPAT Registered Physiotherapist",
      "Licenciatura em Fisioterapia - UP",
      "Pós-graduação em Fisioterapia Animal - RVC",
    ],
    metricas: {
      tempoResposta: "menos de 6 horas",
      taxaSatisfacao: 97,
      casosConcluidosAno: 198,
      clientesRecorrentes: 91,
      recomendacoes: 78,
      anosAtivo: 9,
      cavalosAtendidos: 650,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
      horaInicio: "09:00",
      horaFim: "18:00",
      emergencias24h: false,
      raioServico: 70,
      consultaOnline: true,
    },
    precoMedio: "€80-150/sessão",
    idiomas: ["Português", "Inglês"],
    associacoes: ["ACPAT", "AAEPT"],
    equipamento: [
      { nome: "Laser Terapêutico K-Laser", descricao: "Para tratamento de lesões profundas" },
      { nome: "TENS/EMS", descricao: "Eletroestimulação muscular" },
    ],
    seguroProfissional: true,
    disponivel: true,
    ultimaAtividade: "há 5 horas",
  },
  {
    id: "17",
    nome: "Dr. Tiago Oliveira",
    titulo: "Veterinário Desportivo",
    especialidade: "Medicina Desportiva e Performance",
    categoria: "veterinario",
    localizacao: "Cascais",
    distrito: "Lisboa",
    telefone: "+351 916 543 210",
    email: "tiago.sport@equinesport.pt",
    descricao:
      "Veterinário especializado em medicina desportiva equina com foco em otimização de performance. Testes de esforço, análise de lactato, monitorização cardíaca. Veterinário oficial de eventos FEI.",
    avaliacao: 4.8,
    numAvaliacoes: 134,
    servicos: [
      "Testes de performance",
      "Análise de lactato",
      "Monitorização cardíaca",
      "Avaliação pré-competição",
      "Tratamento de lesões desportivas",
      "Consultoria de treino",
      "Recuperação pós-competição",
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 14,
    especializacoes: [
      {
        nome: "Medicina Desportiva",
        nivel: "especialista",
        certificado: "FEI Official Veterinarian",
        anoObtencao: 2015,
      },
      { nome: "Cardiologia Equina", nivel: "avancado" },
      { nome: "Fisiologia do Exercício", nivel: "especialista" },
    ],
    credenciais: [
      "FEI Official Veterinarian",
      "OMV - Cédula 5678",
      "Diplomado em Medicina Desportiva Equina - UC Davis",
    ],
    metricas: {
      tempoResposta: "menos de 2 horas",
      taxaSatisfacao: 96,
      casosConcluidosAno: 267,
      clientesRecorrentes: 87,
      recomendacoes: 98,
      anosAtivo: 14,
      cavalosAtendidos: 1800,
      emergenciasAtendidas: 45,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      horaInicio: "07:00",
      horaFim: "19:00",
      emergencias24h: true,
      raioServico: 100,
    },
    precoMedio: "€120-300/avaliação",
    idiomas: ["Português", "Inglês", "Espanhol"],
    associacoes: ["FEI", "OMV", "AAEP"],
    seguroProfissional: true,
    disponivel: true,
    ultimaAtividade: "há 4 horas",
  },
  {
    id: "18",
    nome: "Bruno Henriques",
    titulo: "Treinador de Salto",
    especialidade: "Salto de Obstáculos - Nacional e Internacional",
    categoria: "treinador",
    localizacao: "Vila Franca de Xira",
    distrito: "Lisboa",
    telefone: "+351 925 678 901",
    email: "bruno.salto@jumpingpt.pt",
    descricao:
      "Ex-cavaleiro internacional de saltos com participações em Taças das Nações. Formador de jovens talentos com múltiplos alunos na seleção nacional. Especialista em formação de cavalos jovens para salto.",
    avaliacao: 4.8,
    numAvaliacoes: 98,
    servicos: [
      "Treino de salto",
      "Formação de cavalos jovens",
      "Preparação para competição",
      "Clínicas de salto",
      "Avaliação de potencial",
      "Consultoria de compra",
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 20,
    especializacoes: [
      {
        nome: "Salto de Obstáculos",
        nivel: "especialista",
        certificado: "FEP Nível III",
        anoObtencao: 2010,
      },
      { nome: "Formação de Jovens Cavalos", nivel: "especialista" },
      { nome: "Preparação de Competição", nivel: "especialista" },
    ],
    credenciais: [
      "FEP Treinador Nível III Salto",
      "Ex-cavaleiro Internacional CSI",
      "4 participações em Taças das Nações",
    ],
    metricas: {
      tempoResposta: "menos de 8 horas",
      taxaSatisfacao: 95,
      casosConcluidosAno: 67,
      clientesRecorrentes: 89,
      recomendacoes: 56,
      anosAtivo: 20,
      cavalosAtendidos: 280,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      horaInicio: "08:00",
      horaFim: "18:00",
      emergencias24h: false,
      raioServico: 80,
    },
    precoMedio: "€50-90/aula",
    idiomas: ["Português", "Inglês", "Francês"],
    associacoes: ["FEP", "APSL"],
    seguroProfissional: true,
    disponivel: true,
    ultimaAtividade: "há 10 horas",
  },
  {
    id: "19",
    nome: "Dra. Inês Ferreira",
    titulo: "Veterinária - Medicina Interna",
    especialidade: "Medicina Interna e Gastroenterologia Equina",
    categoria: "veterinario",
    localizacao: "Coimbra",
    distrito: "Coimbra",
    telefone: "+351 914 321 098",
    email: "ines.interna@vetinterna.pt",
    descricao:
      "Especialista em medicina interna equina com foco em gastroenterologia e doenças metabólicas. Referência nacional no tratamento de cólicas e síndrome metabólica equina.",
    avaliacao: 4.9,
    numAvaliacoes: 156,
    servicos: [
      "Medicina interna",
      "Diagnóstico de cólica",
      "Tratamento de úlceras",
      "Síndrome metabólica",
      "Endocrinologia",
      "Doenças hepáticas",
      "Gastroscopia",
      "Segunda opinião",
    ],
    nivelVerificacao: "expert",
    experienciaAnos: 16,
    especializacoes: [
      {
        nome: "Medicina Interna",
        nivel: "especialista",
        certificado: "ECEIM Diplomate",
        anoObtencao: 2014,
        instituicao: "European College of Equine Internal Medicine",
      },
      { nome: "Gastroenterologia", nivel: "especialista" },
      { nome: "Endocrinologia", nivel: "avancado" },
    ],
    credenciais: ["ECEIM Diplomate", "OMV - Cédula 6789", "Professora Convidada FMV-UC"],
    metricas: {
      tempoResposta: "menos de 1 hora",
      taxaSatisfacao: 98,
      casosConcluidosAno: 312,
      clientesRecorrentes: 88,
      recomendacoes: 123,
      anosAtivo: 16,
      cavalosAtendidos: 2400,
      emergenciasAtendidas: 78,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
      horaInicio: "08:00",
      horaFim: "18:00",
      emergencias24h: true,
      raioServico: 120,
      consultaOnline: true,
    },
    precoMedio: "€100-250/consulta",
    idiomas: ["Português", "Inglês", "Espanhol"],
    associacoes: ["ECEIM", "OMV", "AAEP"],
    publicacoes: [
      { titulo: "Manual de Cólica Equina", ano: 2021, tipo: "livro" },
      {
        titulo: "Equine Metabolic Syndrome in Lusitano Horses",
        revista: "Equine Veterinary Journal",
        ano: 2023,
        tipo: "artigo",
      },
    ],
    seguroProfissional: true,
    destaque: true,
    disponivel: true,
    ultimaAtividade: "há 2 horas",
  },
  {
    id: "20",
    nome: "Filipe Monteiro",
    titulo: "Treinador de Atrelagem",
    especialidade: "Atrelagem Desportiva e Tradicional",
    categoria: "treinador",
    localizacao: "Évora",
    distrito: "Évora",
    telefone: "+351 936 789 012",
    email: "filipe.atrelagem@lusitanodriving.pt",
    descricao:
      "Treinador especializado em atrelagem com participações em campeonatos mundiais. Formação de cavalos e cocheiros desde iniciação até competição internacional. Preservação da atrelagem tradicional portuguesa.",
    avaliacao: 4.9,
    numAvaliacoes: 45,
    servicos: [
      "Treino de atrelagem",
      "Formação de cavalos",
      "Preparação para competição",
      "Atrelagem tradicional",
      "Clínicas especializadas",
      "Consultoria de equipamento",
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 25,
    especializacoes: [
      {
        nome: "Atrelagem Desportiva",
        nivel: "especialista",
        certificado: "FEI Level 2",
        anoObtencao: 2012,
      },
      { nome: "Atrelagem Tradicional", nivel: "especialista" },
      { nome: "Formação de Cavalos", nivel: "avancado" },
    ],
    credenciais: [
      "FEI Driving Level 2 Coach",
      "Medalha de Bronze - Campeonato Mundial de Atrelagem 2018",
      "Treinador FEP Nível III",
    ],
    metricas: {
      tempoResposta: "menos de 12 horas",
      taxaSatisfacao: 98,
      casosConcluidosAno: 34,
      clientesRecorrentes: 94,
      recomendacoes: 45,
      anosAtivo: 25,
      cavalosAtendidos: 180,
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
      horaInicio: "08:00",
      horaFim: "18:00",
      emergencias24h: false,
      raioServico: 100,
    },
    precoMedio: "€60-100/aula",
    idiomas: ["Português", "Inglês", "Francês", "Alemão"],
    associacoes: ["FEI", "FEP", "APSL"],
    premios: [{ titulo: "Medalha de Bronze - Campeonato Mundial", ano: 2018, entidade: "FEI" }],
    seguroProfissional: true,
    disponivel: true,
    ultimaAtividade: "há 1 dia",
  },
];

// =============================================================================
// EVENTOS E ARTIGOS DA COMUNIDADE
// =============================================================================

const eventosDB: Evento[] = [
  {
    id: "1",
    titulo: "Clínica de Dressage com Maria Santos",
    tipo: "clinica",
    data: "2024-05-20",
    local: "Cascais",
    organizador: "Maria Santos",
    preco: "€300",
    vagas: 8,
    descricao: "Clínica intensiva de 2 dias para cavaleiros de todos os níveis",
  },
  {
    id: "2",
    titulo: "Workshop de Ferração Ortopédica",
    tipo: "workshop",
    data: "2024-06-01",
    local: "Golegã",
    organizador: "Manuel Ferreira",
    preco: "€600",
    vagas: 6,
    descricao: "Formação prática em ferração ortopédica e casos complexos",
  },
  {
    id: "3",
    titulo: "Conferência Anual APSL 2024",
    tipo: "conferencia",
    data: "2024-07-15",
    local: "Golegã",
    organizador: "APSL",
    preco: "€50",
    vagas: 200,
    descricao: "Encontro anual de criadores com palestras e apresentações",
  },
  {
    id: "4",
    titulo: "Webinar: Nutrição do Cavalo de Desporto",
    tipo: "webinar",
    data: "2024-05-10",
    local: "Online",
    organizador: "Dr. Miguel Fernandes",
    preco: "Gratuito",
    vagas: 100,
    descricao: "Webinar sobre nutrição optimizada para cavalos de competição",
  },
  {
    id: "5",
    titulo: "Curso de Primeiros Socorros Equinos",
    tipo: "curso",
    data: "2024-04-20",
    local: "Lisboa",
    organizador: "Dr. António Silva",
    preco: "€150",
    vagas: 20,
    descricao: "Aprenda a lidar com emergências equinas enquanto espera pelo veterinário",
  },
];

const artigosDB: ArtigoEducativo[] = [
  {
    id: "1",
    titulo: "Guia Completo de Exame Pré-Compra",
    autor: "Dr. António Silva",
    categoria: "Veterinária",
    resumo: "O que esperar e exigir num exame pré-compra profissional",
    data: "2024-03",
    leituras: 3456,
  },
  {
    id: "2",
    titulo: "A Importância da Ferração Correcta",
    autor: "Manuel Ferreira",
    categoria: "Ferração",
    resumo: "Como uma boa ferração impacta a performance e longevidade do cavalo",
    data: "2024-02",
    leituras: 2134,
  },
  {
    id: "3",
    titulo: "Do Desbaste ao Grand Prix: Uma Jornada",
    autor: "Maria Santos",
    categoria: "Treino",
    resumo: "A metodologia de formação de cavalos jovens para o dressage de alta competição",
    data: "2024-01",
    leituras: 4521,
  },
  {
    id: "4",
    titulo: "Reprodução Equina Moderna",
    autor: "Dra. Carla Mendes",
    categoria: "Reprodução",
    resumo: "Avanços em ICSI e transferência de embriões no cavalo Lusitano",
    data: "2024-03",
    leituras: 1876,
  },
];

// =============================================================================
// ESTATÍSTICAS DA COMUNIDADE
// =============================================================================

const calcularEstatisticas = (): EstatisticasComunidade => {
  const total = profissionaisDB.length;
  const verificados = profissionaisDB.filter((p) => p.nivelVerificacao !== "basico").length;
  const totalAvaliacoes = profissionaisDB.reduce((acc, p) => acc + p.numAvaliacoes, 0);
  const mediaAval = profissionaisDB.reduce((acc, p) => acc + p.avaliacao, 0) / total;
  const casosTotal = profissionaisDB.reduce((acc, p) => acc + p.metricas.casosConcluidosAno, 0);

  return {
    totalProfissionais: total,
    profissionaisVerificados: verificados,
    avaliacoesTotal: totalAvaliacoes,
    mediaAvaliacoes: Math.round(mediaAval * 10) / 10,
    casosResolvidos: casosTotal,
    clientesSatisfeitos: 96,
    anunciosAtivos: 45,
    eventosProximos: eventosDB.length,
  };
};

// =============================================================================
// COMPONENTES AUXILIARES
// =============================================================================

function BadgeVerificacao({ nivel }: { nivel: NivelVerificacao }) {
  const config = VERIFICACAO_CONFIG[nivel];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 ${config.bg} rounded-full`}>
      <Icon size={12} className={config.cor} />
      <span className={`text-xs font-medium ${config.cor}`}>{config.label}</span>
    </span>
  );
}

function BarraExpertise({ nivel }: { nivel: NivelExpertise }) {
  const config = EXPERTISE_CONFIG[nivel];
  const niveis = ["iniciante", "intermedio", "avancado", "especialista"];
  const index = niveis.indexOf(nivel);
  return (
    <div className="flex gap-1">
      {niveis.map((n, i) => (
        <div
          key={n}
          className={`h-1.5 w-4 rounded-full ${i <= index ? config.cor : "bg-zinc-700"}`}
        />
      ))}
    </div>
  );
}

function EstatisticasCard({ stats }: { stats: EstatisticasComunidade }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-gradient-to-br from-[#C5A059]/20 to-zinc-900 border border-[#C5A059]/20 rounded-xl p-4 text-center">
        <Users className="w-6 h-6 text-[#C5A059] mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{stats.totalProfissionais}</div>
        <div className="text-xs text-zinc-400">Profissionais</div>
      </div>
      <div className="bg-gradient-to-br from-purple-500/20 to-zinc-900 border border-purple-500/20 rounded-xl p-4 text-center">
        <BadgeCheck className="w-6 h-6 text-purple-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{stats.profissionaisVerificados}</div>
        <div className="text-xs text-zinc-400">Verificados</div>
      </div>
      <div className="bg-gradient-to-br from-blue-500/20 to-zinc-900 border border-blue-500/20 rounded-xl p-4 text-center">
        <Star className="w-6 h-6 text-blue-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">{stats.mediaAvaliacoes}</div>
        <div className="text-xs text-zinc-400">Avaliação Média</div>
      </div>
      <div className="bg-gradient-to-br from-green-500/20 to-zinc-900 border border-green-500/20 rounded-xl p-4 text-center">
        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
        <div className="text-2xl font-bold text-white">
          {stats.casosResolvidos.toLocaleString()}
        </div>
        <div className="text-xs text-zinc-400">Casos/Ano</div>
      </div>
    </div>
  );
}

function MetricasPanel({ metricas }: { metricas: MetricasPerformance }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
        <Clock size={16} className="text-[#C5A059] mx-auto mb-1" />
        <div className="text-sm font-medium text-white">{metricas.tempoResposta}</div>
        <div className="text-xs text-zinc-500">Resposta</div>
      </div>
      <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
        <ThumbsUp size={16} className="text-green-400 mx-auto mb-1" />
        <div className="text-sm font-medium text-white">{metricas.taxaSatisfacao}%</div>
        <div className="text-xs text-zinc-500">Satisfação</div>
      </div>
      <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
        <CheckCircle size={16} className="text-blue-400 mx-auto mb-1" />
        <div className="text-sm font-medium text-white">{metricas.casosConcluidosAno}</div>
        <div className="text-xs text-zinc-500">Casos/Ano</div>
      </div>
      <div className="bg-zinc-800/50 rounded-lg p-3 text-center">
        <Users size={16} className="text-purple-400 mx-auto mb-1" />
        <div className="text-sm font-medium text-white">{metricas.clientesRecorrentes}%</div>
        <div className="text-xs text-zinc-500">Recorrentes</div>
      </div>
    </div>
  );
}

function CardProfissional({ prof, onClick }: { prof: Profissional; onClick: () => void }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#C5A059]/30 transition-all group">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-[#C5A059]/30 to-zinc-800 rounded-xl flex items-center justify-center text-xl font-serif text-[#C5A059]">
              {prof.nome.charAt(0)}
            </div>
            {prof.disponivel && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-white truncate text-sm">{prof.nome}</h3>
              {prof.destaque && <Sparkles size={12} className="text-[#C5A059]" />}
            </div>
            <p className="text-xs text-[#C5A059] truncate">{prof.especialidade}</p>
            <div className="flex items-center gap-2 mt-1">
              <MapPin size={10} className="text-zinc-500" />
              <span className="text-xs text-zinc-400">{prof.localizacao}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <BadgeVerificacao nivel={prof.nivelVerificacao} />
          <div className="flex items-center gap-1">
            <Star size={12} className="text-[#C5A059] fill-[#C5A059]" />
            <span className="text-xs font-medium text-white">{prof.avaliacao}</span>
            <span className="text-xs text-zinc-500">({prof.numAvaliacoes})</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-zinc-800/30 rounded px-2 py-1.5 text-center">
            <div className="text-xs text-[#C5A059] font-medium">
              {prof.metricas.taxaSatisfacao}%
            </div>
            <div className="text-[10px] text-zinc-500">Satisfação</div>
          </div>
          <div className="bg-zinc-800/30 rounded px-2 py-1.5 text-center">
            <div className="text-xs text-zinc-300 font-medium">{prof.experienciaAnos} anos</div>
            <div className="text-[10px] text-zinc-500">Experiência</div>
          </div>
        </div>

        {prof.disponibilidade.emergencias24h && (
          <div className="mt-2 flex items-center gap-1 text-xs text-red-400">
            <Siren size={10} />
            <span>Emergências 24h</span>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-800 p-3 flex gap-2">
        <button
          onClick={onClick}
          className="flex-1 py-2 bg-[#C5A059] rounded-lg text-xs text-black font-medium hover:bg-[#D4AF6A] transition-colors flex items-center justify-center gap-1"
        >
          Ver Perfil <ChevronRight size={14} />
        </button>
        <a
          href={`tel:${prof.telefone}`}
          className="p-2 bg-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors"
        >
          <Phone size={14} />
        </a>
      </div>
    </div>
  );
}

function ModalProfissional({
  profissional,
  onClose,
}: {
  profissional: Profissional;
  onClose: () => void;
}) {
  const [aba, setAba] = useState<
    "info" | "especializacoes" | "testemunhos" | "disponibilidade" | "formacao"
  >("info");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#C5A059]/20 to-zinc-900 p-6 border-b border-zinc-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-[#C5A059]/40 to-zinc-800 rounded-xl flex items-center justify-center text-3xl font-serif text-[#C5A059]">
              {profissional.nome.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold text-white">{profissional.nome}</h2>
                <BadgeVerificacao nivel={profissional.nivelVerificacao} />
              </div>
              <p className="text-sm text-[#C5A059]">{profissional.titulo}</p>
              <p className="text-sm text-zinc-400">{profissional.especialidade}</p>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-[#C5A059] fill-[#C5A059]" />
                  <span className="text-sm font-medium">{profissional.avaliacao}</span>
                  <span className="text-xs text-zinc-500">
                    ({profissional.numAvaliacoes} avaliações)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <MapPin size={12} />
                  {profissional.localizacao}
                </div>
                <div className="text-xs text-zinc-500">
                  {profissional.experienciaAnos} anos exp.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-zinc-800 px-6 overflow-x-auto">
          <div className="flex gap-1 -mb-px">
            {[
              { id: "info", label: "Informação" },
              { id: "especializacoes", label: "Especializações" },
              { id: "testemunhos", label: "Testemunhos" },
              { id: "disponibilidade", label: "Disponibilidade" },
              { id: "formacao", label: "Formação" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setAba(t.id as typeof aba)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${aba === t.id ? "border-[#C5A059] text-[#C5A059]" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {aba === "info" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-2">Sobre</h3>
                <p className="text-zinc-300 text-sm">{profissional.descricao}</p>
              </div>
              <MetricasPanel metricas={profissional.metricas} />
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-2">Serviços</h3>
                <div className="flex flex-wrap gap-2">
                  {profissional.servicos.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-2">Credenciais</h3>
                <ul className="space-y-2">
                  {profissional.credenciais.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                      <CheckCircle size={14} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-3">
                {profissional.idiomas && (
                  <div className="bg-zinc-800/50 rounded-lg px-3 py-2">
                    <span className="text-xs text-zinc-500 block">Idiomas</span>
                    <span className="text-sm text-white">{profissional.idiomas.join(", ")}</span>
                  </div>
                )}
                {profissional.precoMedio && (
                  <div className="bg-zinc-800/50 rounded-lg px-3 py-2">
                    <span className="text-xs text-zinc-500 block">Preço Médio</span>
                    <span className="text-sm text-[#C5A059]">{profissional.precoMedio}</span>
                  </div>
                )}
              </div>
              {profissional.redesSociais && (
                <div className="flex gap-2">
                  {profissional.redesSociais.instagram && (
                    <a
                      href={profissional.redesSociais.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-pink-400"
                    >
                      <Instagram size={16} />
                    </a>
                  )}
                  {profissional.redesSociais.facebook && (
                    <a
                      href={profissional.redesSociais.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-blue-400"
                    >
                      <Facebook size={16} />
                    </a>
                  )}
                  {profissional.redesSociais.youtube && (
                    <a
                      href={profissional.redesSociais.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="YouTube"
                      className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-400"
                    >
                      <Youtube size={16} />
                    </a>
                  )}
                  {profissional.redesSociais.linkedin && (
                    <a
                      href={profissional.redesSociais.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-blue-500"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {aba === "especializacoes" && (
            <div className="space-y-4">
              {profissional.especializacoes.map((esp, i) => (
                <div key={i} className="bg-zinc-800/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white text-sm">{esp.nome}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${EXPERTISE_CONFIG[esp.nivel].cor} text-white`}
                    >
                      {EXPERTISE_CONFIG[esp.nivel].label}
                    </span>
                  </div>
                  <BarraExpertise nivel={esp.nivel} />
                  {esp.certificado && (
                    <div className="mt-2 text-xs text-zinc-400">
                      <span className="text-[#C5A059]">{esp.certificado}</span>
                      {esp.instituicao && <span> • {esp.instituicao}</span>}
                      {esp.anoObtencao && <span> • {esp.anoObtencao}</span>}
                    </div>
                  )}
                </div>
              ))}
              {profissional.premios && profissional.premios.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-[#C5A059] mb-3 flex items-center gap-2">
                    <Trophy size={16} />
                    Prémios
                  </h3>
                  {profissional.premios.map((p, i) => (
                    <div
                      key={i}
                      className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-3 mb-2"
                    >
                      <div className="font-medium text-white text-sm">{p.titulo}</div>
                      <div className="text-xs text-zinc-400">
                        {p.entidade} • {p.ano}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {aba === "testemunhos" && (
            <div className="space-y-4">
              {profissional.testemunhos && profissional.testemunhos.length > 0 ? (
                <>
                  {profissional.testemunhos.map((t, i) => (
                    <div key={i} className="bg-zinc-800/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              size={12}
                              className={
                                j < t.avaliacao ? "text-[#C5A059] fill-[#C5A059]" : "text-zinc-600"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-white">{t.cliente}</span>
                        {t.verificado && <BadgeCheck size={12} className="text-blue-400" />}
                        <span className="text-xs text-zinc-500 ml-auto">{t.data}</span>
                      </div>
                      <p className="text-sm text-zinc-400 italic">&ldquo;{t.texto}&rdquo;</p>
                      {t.cavalo && (
                        <div className="text-xs text-[#C5A059] mt-1">Cavalo: {t.cavalo}</div>
                      )}
                    </div>
                  ))}
                  {profissional.casosSucesso && profissional.casosSucesso.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-[#C5A059] mb-3 flex items-center gap-2">
                        <TrendingUp size={16} />
                        Casos de Sucesso
                      </h3>
                      {profissional.casosSucesso.map((c, i) => (
                        <div
                          key={i}
                          className={`rounded-lg p-4 mb-3 ${c.destaque ? "bg-[#C5A059]/10 border border-[#C5A059]/20" : "bg-zinc-800/30"}`}
                        >
                          <h4 className="font-medium text-white text-sm mb-1">{c.titulo}</h4>
                          <p className="text-xs text-zinc-400">{c.descricao}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <CheckCircle size={14} className="text-green-400" />
                            <span className="text-xs text-green-400">{c.resultado}</span>
                          </div>
                          <span className="text-xs text-zinc-500 mt-1 block">{c.data}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Ainda sem testemunhos públicos</p>
                </div>
              )}
            </div>
          )}

          {aba === "disponibilidade" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-3">
                  Horário de Funcionamento
                </h3>
                <div className="bg-zinc-800/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white">
                      {profissional.disponibilidade.horaInicio} -{" "}
                      {profissional.disponibilidade.horaFim}
                    </span>
                    {profissional.disponibilidade.emergencias24h && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs flex items-center gap-1">
                        <Siren size={10} />
                        Emergências 24h
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map(
                      (d) => (
                        <span
                          key={d}
                          className={`px-3 py-1 rounded text-xs ${profissional.disponibilidade.diasSemana.includes(d) ? "bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30" : "bg-zinc-800 text-zinc-500"}`}
                        >
                          {d.substring(0, 3)}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-3">Área de Cobertura</h3>
                <div className="bg-zinc-800/30 rounded-lg p-4 flex items-center gap-4">
                  <Globe size={24} className="text-[#C5A059]" />
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {profissional.disponibilidade.raioServico} km
                    </div>
                    <div className="text-xs text-zinc-500">
                      a partir de {profissional.localizacao}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {profissional.disponibilidade.deslocacaoIncluida && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center gap-2">
                    <Truck size={16} className="text-green-400" />
                    <span className="text-xs text-green-400">Deslocação incluída</span>
                  </div>
                )}
                {profissional.disponibilidade.consultaOnline && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-2">
                    <Video size={16} className="text-blue-400" />
                    <span className="text-xs text-blue-400">Consulta online</span>
                  </div>
                )}
              </div>
              <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-[#C5A059] mb-2">Contactar</h3>
                <div className="flex gap-2">
                  <a
                    href={`tel:${profissional.telefone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#C5A059] rounded-lg text-black font-medium hover:bg-[#D4AF6A] transition-colors"
                  >
                    <Phone size={16} />
                    Ligar
                  </a>
                  <a
                    href={`mailto:${profissional.email}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors"
                  >
                    <Mail size={16} />
                    Email
                  </a>
                </div>
              </div>
            </div>
          )}

          {aba === "formacao" && (
            <div className="space-y-4">
              {profissional.formacao && profissional.formacao.length > 0 ? (
                <>
                  <h3 className="text-sm font-semibold text-zinc-400 mb-3">Formação Académica</h3>
                  {profissional.formacao.map((f, i) => (
                    <div key={i} className="bg-zinc-800/30 rounded-lg p-4 flex items-start gap-3">
                      <div className="p-2 bg-[#C5A059]/20 rounded-lg">
                        <GraduationCap size={16} className="text-[#C5A059]" />
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{f.titulo}</div>
                        <div className="text-xs text-zinc-400">{f.instituicao}</div>
                        <div className="text-xs text-zinc-500 mt-1">{f.ano}</div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-zinc-500 text-sm">Informação de formação não disponível</p>
              )}
              {profissional.publicacoes && profissional.publicacoes.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-zinc-400 mb-3">Publicações</h3>
                  {profissional.publicacoes.map((p, i) => (
                    <div key={i} className="bg-zinc-800/30 rounded-lg p-4 flex items-start gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        {p.tipo === "video" ? (
                          <PlayCircle size={16} className="text-blue-400" />
                        ) : (
                          <FileText size={16} className="text-blue-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{p.titulo}</div>
                        {p.revista && <div className="text-xs text-[#C5A059]">{p.revista}</div>}
                        <div className="text-xs text-zinc-500">{p.ano}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {profissional.cursosOferecidos && profissional.cursosOferecidos.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-[#C5A059] mb-3 flex items-center gap-2">
                    <BookOpen size={16} />
                    Cursos Oferecidos
                  </h3>
                  {profissional.cursosOferecidos.map((c, i) => (
                    <div
                      key={i}
                      className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-4 mb-2"
                    >
                      <div className="font-medium text-white text-sm">{c.titulo}</div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
                        <span>{c.duracao}</span>
                        <span className="text-[#C5A059] font-medium">{c.preco}</span>
                        {c.proximaData && <span>Próxima: {c.proximaData}</span>}
                        {c.vagas && <span>{c.vagas} vagas</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventosSection({ eventos }: { eventos: Evento[] }) {
  const tipoConfig = {
    clinica: { cor: "text-purple-400", bg: "bg-purple-500/20" },
    workshop: { cor: "text-blue-400", bg: "bg-blue-500/20" },
    conferencia: { cor: "text-[#C5A059]", bg: "bg-[#C5A059]/20" },
    curso: { cor: "text-green-400", bg: "bg-green-500/20" },
    webinar: { cor: "text-pink-400", bg: "bg-pink-500/20" },
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {eventos.slice(0, 3).map((e) => (
        <div
          key={e.id}
          className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-[#C5A059]/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className={`px-2 py-1 rounded text-xs ${tipoConfig[e.tipo].bg} ${tipoConfig[e.tipo].cor}`}
            >
              {e.tipo}
            </span>
            <span className="text-xs text-zinc-500">{e.data}</span>
          </div>
          <h3 className="font-medium text-white text-sm mb-1">{e.titulo}</h3>
          <p className="text-xs text-zinc-400 mb-3">{e.descricao}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <MapPin size={10} />
              {e.local}
            </div>
            <span className="text-xs text-[#C5A059] font-medium">{e.preco}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function ProfissionaisPage() {
  const [pesquisa, setPesquisa] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<CategoriaProf | "todos">("todos");
  const [distritoAtivo, setDistritoAtivo] = useState("Todos");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null);
  const [filtroVerificacao, setFiltroVerificacao] = useState<NivelVerificacao | "todos">("todos");
  const [abaAtiva, setAbaAtiva] = useState<"profissionais" | "eventos" | "artigos">(
    "profissionais"
  );

  const stats = useMemo(() => calcularEstatisticas(), []);

  const profissionaisFiltrados = useMemo(() => {
    return profissionaisDB
      .filter((p) => {
        const matchPesquisa =
          p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
          p.especialidade.toLowerCase().includes(pesquisa.toLowerCase()) ||
          p.servicos.some((s) => s.toLowerCase().includes(pesquisa.toLowerCase()));
        const matchCategoria = categoriaAtiva === "todos" || p.categoria === categoriaAtiva;
        const matchDistrito = distritoAtivo === "Todos" || p.distrito === distritoAtivo;
        const matchVerificacao =
          filtroVerificacao === "todos" || p.nivelVerificacao === filtroVerificacao;
        return matchPesquisa && matchCategoria && matchDistrito && matchVerificacao;
      })
      .sort((a, b) => {
        const nivelOrder = { expert: 4, certificado: 3, verificado: 2, basico: 1 };
        const nivelDiff = nivelOrder[b.nivelVerificacao] - nivelOrder[a.nivelVerificacao];
        if (nivelDiff !== 0) return nivelDiff;
        return b.avaliacao - a.avaliacao;
      });
  }, [pesquisa, categoriaAtiva, distritoAtivo, filtroVerificacao]);

  return (
    <main className="min-h-screen bg-black text-white pt-20 pb-32 px-4 sm:px-6 md:px-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Voltar</span>
        </Link>
        <div className="text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[9px] font-bold block mb-2">
            Comunidade Lusitana
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif italic mb-4">Rede Profissional</h1>
          <p className="text-zinc-400 text-sm max-w-2xl mx-auto">
            A maior rede de profissionais especializados em cavalos Lusitanos em Portugal.
            Veterinários, ferradores, treinadores e mais.
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="max-w-7xl mx-auto mb-8">
        <EstatisticasCard stats={stats} />
      </div>

      {/* Tabs principais */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 border-b border-zinc-800 pb-3">
          {[
            { id: "profissionais", label: "Profissionais", icon: Users },
            { id: "eventos", label: "Eventos", icon: CalendarDays },
            { id: "artigos", label: "Artigos", icon: FileText },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setAbaAtiva(t.id as typeof abaAtiva)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${abaAtiva === t.id ? "bg-[#C5A059] text-black font-medium" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {abaAtiva === "profissionais" && (
        <>
          {/* Categorias */}
          <div className="max-w-7xl mx-auto mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoriaAtiva(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${categoriaAtiva === cat.id ? "bg-[#C5A059] text-black font-medium" : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"}`}
                >
                  <cat.icon size={14} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filtros e Pesquisa */}
          <div className="max-w-7xl mx-auto mb-6">
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  type="text"
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  placeholder="Pesquisar profissional..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#C5A059]/50"
                />
              </div>
              <select
                value={distritoAtivo}
                onChange={(e) => setDistritoAtivo(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A059]/50"
              >
                {distritos.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <select
                value={filtroVerificacao}
                onChange={(e) => setFiltroVerificacao(e.target.value as typeof filtroVerificacao)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A059]/50"
              >
                <option value="todos">Todos os níveis</option>
                <option value="expert">Expert</option>
                <option value="certificado">Certificado</option>
                <option value="verificado">Verificado</option>
              </select>
            </div>
            <div className="mt-3 text-xs text-zinc-500">
              {profissionaisFiltrados.length} profissionais encontrados
            </div>
          </div>

          {/* Grid de Profissionais */}
          <div className="max-w-7xl mx-auto">
            {profissionaisFiltrados.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {profissionaisFiltrados.map((prof) => (
                  <CardProfissional
                    key={prof.id}
                    prof={prof}
                    onClick={() => setProfissionalSelecionado(prof)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Search size={32} className="mx-auto mb-4 text-zinc-600" />
                <h3 className="text-lg font-medium mb-2">Nenhum profissional encontrado</h3>
                <p className="text-sm text-zinc-500">Tente ajustar os filtros</p>
              </div>
            )}
          </div>
        </>
      )}

      {abaAtiva === "eventos" && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Próximos Eventos</h2>
          <EventosSection eventos={eventosDB} />
        </div>
      )}

      {abaAtiva === "artigos" && (
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">Artigos Educativos</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {artigosDB.map((a) => (
              <div
                key={a.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-[#C5A059]/30 transition-colors"
              >
                <span className="text-xs text-[#C5A059]">{a.categoria}</span>
                <h3 className="font-medium text-white mt-1">{a.titulo}</h3>
                <p className="text-sm text-zinc-400 mt-2">{a.resumo}</p>
                <div className="flex items-center justify-between mt-3 text-xs text-zinc-500">
                  <span>{a.autor}</span>
                  <span>{a.leituras.toLocaleString()} leituras</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-7xl mx-auto mt-12">
        <div className="bg-gradient-to-r from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 rounded-xl p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">É profissional do sector equestre?</h3>
              <p className="text-sm text-zinc-400">
                Junte-se à nossa rede verificada e alcance milhares de criadores e proprietários.
              </p>
            </div>
            <button className="mt-4 sm:mt-0 px-6 py-3 bg-[#C5A059] text-black font-medium rounded-lg hover:bg-[#D4AF6A] transition-colors flex items-center gap-2">
              <ShieldCheck size={18} />
              Registar-se
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {profissionalSelecionado && (
        <ModalProfissional
          profissional={profissionalSelecionado}
          onClose={() => setProfissionalSelecionado(null)}
        />
      )}
    </main>
  );
}

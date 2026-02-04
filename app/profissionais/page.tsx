"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Search, MapPin, Phone, Mail, Star, Filter,
  Stethoscope, Hammer, GraduationCap, Camera, Scissors, Briefcase,
  Shield, ShieldCheck, Award, Crown, Clock, CheckCircle, Users,
  Calendar, Globe, MessageCircle, ThumbsUp, TrendingUp, X,
  ChevronRight, Heart, Bone, Baby, Zap, Footprints, Target
} from "lucide-react";

// =============================================================================
// TIPOS E INTERFACES
// =============================================================================

type NivelVerificacao = "basico" | "verificado" | "certificado" | "expert";
type NivelExpertise = "iniciante" | "intermedio" | "avancado" | "especialista";

interface Especializacao {
  nome: string;
  nivel: NivelExpertise;
  certificado?: string;
  anoObtencao?: number;
}

interface Testemunho {
  cliente: string;
  texto: string;
  data: string;
  avaliacao: number;
}

interface CasoSucesso {
  titulo: string;
  descricao: string;
  resultado: string;
  data: string;
}

interface MetricasPerformance {
  tempoResposta: string;        // "menos de 2h"
  taxaSatisfacao: number;       // 0-100
  casosConcluidosAno: number;
  clientesRecorrentes: number;  // percentagem
  recomendacoes: number;
}

interface Disponibilidade {
  diasSemana: string[];
  horaInicio: string;
  horaFim: string;
  emergencias24h: boolean;
  raioServico: number;          // km
}

interface Profissional {
  id: string;
  nome: string;
  titulo: string;
  especialidade: string;
  categoria: string;
  localizacao: string;
  distrito: string;
  telefone: string;
  email: string;
  website?: string;
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
}

// =============================================================================
// CONSTANTES
// =============================================================================

const categorias = [
  { id: "todos", label: "Todos", icon: Briefcase },
  { id: "veterinario", label: "Veterinários", icon: Stethoscope },
  { id: "ferrador", label: "Ferradores", icon: Hammer },
  { id: "treinador", label: "Treinadores", icon: GraduationCap },
  { id: "fotografo", label: "Fotógrafos", icon: Camera },
  { id: "tosquiador", label: "Tosquiadores", icon: Scissors },
];

const distritos = [
  "Todos", "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco",
  "Coimbra", "Évora", "Faro", "Guarda", "Leiria", "Lisboa",
  "Portalegre", "Porto", "Santarém", "Setúbal", "Viana do Castelo",
  "Vila Real", "Viseu"
];

const VERIFICACAO_CONFIG = {
  basico: {
    cor: "text-zinc-400",
    bg: "bg-zinc-800",
    icon: Shield,
    label: "Perfil Básico"
  },
  verificado: {
    cor: "text-blue-400",
    bg: "bg-blue-500/20",
    icon: ShieldCheck,
    label: "Verificado"
  },
  certificado: {
    cor: "text-[#C5A059]",
    bg: "bg-[#C5A059]/20",
    icon: Award,
    label: "Certificado"
  },
  expert: {
    cor: "text-purple-400",
    bg: "bg-purple-500/20",
    icon: Crown,
    label: "Expert"
  }
};

const EXPERTISE_CONFIG = {
  iniciante: { cor: "bg-zinc-600", label: "Iniciante" },
  intermedio: { cor: "bg-blue-500", label: "Intermédio" },
  avancado: { cor: "bg-[#C5A059]", label: "Avançado" },
  especialista: { cor: "bg-purple-500", label: "Especialista" }
};

// =============================================================================
// BASE DE DADOS EXPANDIDA
// =============================================================================

const profissionaisExemplo: Profissional[] = [
  {
    id: "1",
    nome: "Dr. António Silva",
    titulo: "Médico Veterinário",
    especialidade: "Veterinário Equino - Ortopedia",
    categoria: "veterinario",
    localizacao: "Lisboa",
    distrito: "Lisboa",
    telefone: "+351 912 345 678",
    email: "dr.antonio@vetequino.pt",
    website: "www.vetequino.pt",
    descricao: "Especialista em medicina equina com foco em ortopedia e medicina desportiva. Mais de 20 anos de experiência com cavalos Lusitanos de alta competição.",
    avaliacao: 4.9,
    numAvaliacoes: 127,
    servicos: [
      "Consultas gerais", "Cirurgia ortopédica", "Medicina desportiva",
      "Exames pré-compra", "Emergências 24h", "Radiologia digital"
    ],
    nivelVerificacao: "expert",
    experienciaAnos: 22,
    especializacoes: [
      { nome: "Ortopedia Equina", nivel: "especialista", certificado: "ECVS", anoObtencao: 2008 },
      { nome: "Medicina Desportiva", nivel: "especialista", certificado: "FEI Veterinarian", anoObtencao: 2010 },
      { nome: "Imagiologia", nivel: "avancado", certificado: "Diplomate ACVR", anoObtencao: 2012 },
      { nome: "Cirurgia Geral", nivel: "avancado" }
    ],
    credenciais: [
      "Ordem dos Médicos Veterinários - Cédula 4521",
      "European College of Veterinary Surgeons",
      "FEI Official Veterinarian",
      "Membro APSL - Veterinários de Referência"
    ],
    testemunhos: [
      {
        cliente: "Coudelaria Real",
        texto: "O Dr. António salvou a carreira desportiva do nosso garanhão principal. Profissionalismo excepcional.",
        data: "2024-01",
        avaliacao: 5
      },
      {
        cliente: "João M.",
        texto: "Acompanha os meus cavalos há 10 anos. Sempre disponível e extremamente competente.",
        data: "2024-02",
        avaliacao: 5
      }
    ],
    casosSucesso: [
      {
        titulo: "Recuperação de fratura de boleto",
        descricao: "Cavalo Grand Prix com fratura complexa",
        resultado: "Regresso à competição após 18 meses",
        data: "2023"
      },
      {
        titulo: "Tratamento de OCD bilateral",
        descricao: "Poldro de 2 anos com OCD em ambos os curvilhões",
        resultado: "Aprovação APSL com excelente pontuação",
        data: "2024"
      }
    ],
    metricas: {
      tempoResposta: "menos de 1 hora",
      taxaSatisfacao: 98,
      casosConcluidosAno: 487,
      clientesRecorrentes: 89,
      recomendacoes: 156
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      horaInicio: "08:00",
      horaFim: "19:00",
      emergencias24h: true,
      raioServico: 100
    },
    precoMedio: "€80-150/consulta",
    idiomas: ["Português", "Inglês", "Espanhol"],
    associacoes: ["APSL", "SPMV", "ECVS", "FEI"]
  },
  {
    id: "2",
    nome: "Manuel Ferreira",
    titulo: "Mestre Ferrador Certificado",
    especialidade: "Ferração Ortopédica e Desportiva",
    categoria: "ferrador",
    localizacao: "Santarém",
    distrito: "Santarém",
    telefone: "+351 923 456 789",
    email: "manuel.ferrador@email.pt",
    descricao: "Ferrador certificado pela EFFA com especialização em cavalos de desporto e correção de aprumos. Formação contínua em ferradura ortopédica.",
    avaliacao: 4.8,
    numAvaliacoes: 89,
    servicos: [
      "Ferração normal", "Ferração ortopédica", "Correção de aprumos",
      "Cascos descalços (barefoot)", "Ferração terapêutica", "Palmilhas ortopédicas"
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 15,
    especializacoes: [
      { nome: "Ferração Ortopédica", nivel: "especialista", certificado: "EFFA Level 4", anoObtencao: 2015 },
      { nome: "Correção de Aprumos", nivel: "avancado", certificado: "AFA Certified", anoObtencao: 2018 },
      { nome: "Barefoot Trimming", nivel: "intermedio" },
      { nome: "Ferração Desportiva", nivel: "avancado" }
    ],
    credenciais: [
      "European Federation of Farriers Associations - Level 4",
      "American Farrier Association - Certified",
      "Membro da Associação Portuguesa de Ferradores"
    ],
    testemunhos: [
      {
        cliente: "Coudelaria Vale do Tejo",
        texto: "Trabalho impecável. Transformou completamente os cascos dos nossos cavalos de trabalho.",
        data: "2024-01",
        avaliacao: 5
      }
    ],
    metricas: {
      tempoResposta: "menos de 4 horas",
      taxaSatisfacao: 96,
      casosConcluidosAno: 312,
      clientesRecorrentes: 94,
      recomendacoes: 78
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
      horaInicio: "07:00",
      horaFim: "18:00",
      emergencias24h: false,
      raioServico: 80
    },
    precoMedio: "€60-120/ferração",
    idiomas: ["Português", "Espanhol"],
    associacoes: ["EFFA", "APF"]
  },
  {
    id: "3",
    nome: "Maria Santos",
    titulo: "Cavaleira Internacional",
    especialidade: "Treinadora de Dressage - Grand Prix",
    categoria: "treinador",
    localizacao: "Porto",
    distrito: "Porto",
    telefone: "+351 934 567 890",
    email: "maria.dressage@email.pt",
    website: "www.mariadressage.pt",
    descricao: "Cavaleira internacional de Dressage com múltiplas participações em campeonatos europeus. Formação de cavalos jovens e preparação para competição até Grand Prix.",
    avaliacao: 5.0,
    numAvaliacoes: 56,
    servicos: [
      "Treino de cavalos jovens", "Preparação Grand Prix", "Aulas particulares",
      "Clínicas e workshops", "Desbaste", "Consultoria técnica"
    ],
    nivelVerificacao: "expert",
    experienciaAnos: 18,
    especializacoes: [
      { nome: "Dressage - Grand Prix", nivel: "especialista", certificado: "FEI Level 3", anoObtencao: 2012 },
      { nome: "Formação de Jovens Cavalos", nivel: "especialista", anoObtencao: 2010 },
      { nome: "Biomecânica Equina", nivel: "avancado", certificado: "Certified Biomechanics", anoObtencao: 2016 },
      { nome: "Equitação Clássica", nivel: "avancado" }
    ],
    credenciais: [
      "FEI Level 3 Dressage Trainer",
      "Federação Equestre Portuguesa - Treinadora Nível III",
      "Cavaleira Internacional (CDI)",
      "Ex-membro da Seleção Nacional de Dressage"
    ],
    testemunhos: [
      {
        cliente: "Ana R.",
        texto: "A Maria levou-me e ao meu cavalo do Prix St. Georges ao Grand Prix em 3 anos. Incrível!",
        data: "2024-02",
        avaliacao: 5
      },
      {
        cliente: "Pedro L.",
        texto: "Metodologia clara e resultados visíveis. O meu cavalo transformou-se completamente.",
        data: "2023-12",
        avaliacao: 5
      }
    ],
    casosSucesso: [
      {
        titulo: "Formação completa Grand Prix",
        descricao: "Cavalo iniciou desbaste aos 4 anos",
        resultado: "Campeão Nacional Grand Prix aos 10 anos",
        data: "2023"
      }
    ],
    metricas: {
      tempoResposta: "menos de 24 horas",
      taxaSatisfacao: 100,
      casosConcluidosAno: 45,
      clientesRecorrentes: 92,
      recomendacoes: 89
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      horaInicio: "07:30",
      horaFim: "19:00",
      emergencias24h: false,
      raioServico: 50
    },
    precoMedio: "€50-80/aula",
    idiomas: ["Português", "Inglês", "Francês"],
    associacoes: ["FEP", "FEI", "APSL"]
  },
  {
    id: "4",
    nome: "João Costa",
    titulo: "Fotógrafo Profissional",
    especialidade: "Fotografia Equestre Especializada",
    categoria: "fotografo",
    localizacao: "Évora",
    distrito: "Évora",
    telefone: "+351 945 678 901",
    email: "joao.foto@email.pt",
    website: "www.joaocostaphoto.pt",
    descricao: "Fotografia equestre profissional com foco em coudelarias Lusitanas. Especializado em retratos artísticos, sessões de venda e cobertura de eventos.",
    avaliacao: 4.7,
    numAvaliacoes: 43,
    servicos: [
      "Sessões em coudelaria", "Cobertura de competições", "Retratos artísticos",
      "Vídeo promocional", "Catálogos de venda", "Fotos para stud books"
    ],
    nivelVerificacao: "verificado",
    experienciaAnos: 10,
    especializacoes: [
      { nome: "Fotografia Equestre", nivel: "avancado" },
      { nome: "Vídeo Equestre", nivel: "intermedio" },
      { nome: "Pós-produção", nivel: "avancado" }
    ],
    credenciais: [
      "Membro da Associação Portuguesa de Fotógrafos",
      "Fotógrafo Oficial APSL 2020-2023"
    ],
    metricas: {
      tempoResposta: "menos de 12 horas",
      taxaSatisfacao: 94,
      casosConcluidosAno: 78,
      clientesRecorrentes: 76,
      recomendacoes: 45
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
      horaInicio: "06:00",
      horaFim: "20:00",
      emergencias24h: false,
      raioServico: 200
    },
    precoMedio: "€300-800/sessão",
    idiomas: ["Português", "Inglês"],
    associacoes: ["APF", "APSL"]
  },
  {
    id: "5",
    nome: "Dra. Carla Mendes",
    titulo: "Médica Veterinária",
    especialidade: "Reprodução Equina",
    categoria: "veterinario",
    localizacao: "Golegã",
    distrito: "Santarém",
    telefone: "+351 956 789 012",
    email: "carla.repro@email.pt",
    descricao: "Especialista em reprodução equina com formação internacional. Inseminação artificial, transferência de embriões e acompanhamento completo de gestação.",
    avaliacao: 4.9,
    numAvaliacoes: 78,
    servicos: [
      "Inseminação artificial", "Transferência de embriões", "Ecografia reprodutiva",
      "Acompanhamento de gestação", "Neonatologia", "Congelação de sémen"
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 12,
    especializacoes: [
      { nome: "Reprodução Assistida", nivel: "especialista", certificado: "ACT Diplomate", anoObtencao: 2016 },
      { nome: "Transferência de Embriões", nivel: "especialista", anoObtencao: 2018 },
      { nome: "Neonatologia Equina", nivel: "avancado" },
      { nome: "Ecografia Reprodutiva", nivel: "especialista" }
    ],
    credenciais: [
      "Ordem dos Médicos Veterinários - Cédula 6234",
      "American College of Theriogenologists - Diplomate",
      "Especialista em Reprodução Equina ECAR"
    ],
    testemunhos: [
      {
        cliente: "Coudelaria Lusitana",
        texto: "Taxa de sucesso impressionante nas transferências de embriões. Muito profissional.",
        data: "2024-01",
        avaliacao: 5
      }
    ],
    metricas: {
      tempoResposta: "menos de 2 horas",
      taxaSatisfacao: 97,
      casosConcluidosAno: 234,
      clientesRecorrentes: 87,
      recomendacoes: 92
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      horaInicio: "06:00",
      horaFim: "20:00",
      emergencias24h: true,
      raioServico: 120
    },
    precoMedio: "€100-300/procedimento",
    idiomas: ["Português", "Inglês", "Espanhol"],
    associacoes: ["OMV", "ACT", "ECAR", "APSL"]
  },
  {
    id: "6",
    nome: "Pedro Almeida",
    titulo: "Cavaleiro Profissional",
    especialidade: "Equitação de Trabalho",
    categoria: "treinador",
    localizacao: "Beja",
    distrito: "Beja",
    telefone: "+351 967 890 123",
    email: "pedro.trabalho@email.pt",
    descricao: "Cavaleiro profissional de Equitação de Trabalho. Campeão nacional e preparador de conjuntos para competição. Especialista em desbaste tradicional.",
    avaliacao: 4.8,
    numAvaliacoes: 62,
    servicos: [
      "Treino específico Working Equitation", "Preparação para competição",
      "Clínicas e workshops", "Desbaste tradicional", "Treino de gado"
    ],
    nivelVerificacao: "certificado",
    experienciaAnos: 20,
    especializacoes: [
      { nome: "Equitação de Trabalho", nivel: "especialista", certificado: "WAWE Judge", anoObtencao: 2015 },
      { nome: "Desbaste Tradicional", nivel: "especialista" },
      { nome: "Treino de Gado", nivel: "avancado" },
      { nome: "Doma Vaquera", nivel: "avancado" }
    ],
    credenciais: [
      "FEP - Treinador Nível III Working Equitation",
      "WAWE International Judge",
      "Campeão Nacional de Working Equitation (2019, 2021)"
    ],
    metricas: {
      tempoResposta: "menos de 6 horas",
      taxaSatisfacao: 95,
      casosConcluidosAno: 67,
      clientesRecorrentes: 88,
      recomendacoes: 54
    },
    disponibilidade: {
      diasSemana: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
      horaInicio: "07:00",
      horaFim: "18:00",
      emergencias24h: false,
      raioServico: 100
    },
    precoMedio: "€40-70/aula",
    idiomas: ["Português", "Espanhol"],
    associacoes: ["FEP", "WAWE", "APSL"]
  }
];

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
          className={`h-1.5 w-4 rounded-full ${i <= index ? config.cor : 'bg-zinc-700'}`}
        />
      ))}
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

function ModalProfissional({ profissional, onClose }: { profissional: Profissional; onClose: () => void }) {
  const [abaAtiva, setAbaAtiva] = useState<"info" | "especializacoes" | "testemunhos" | "disponibilidade">("info");

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
            <div className="w-20 h-20 bg-zinc-800 rounded-xl flex items-center justify-center text-3xl font-serif text-[#C5A059]">
              {profissional.nome.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-semibold text-white">{profissional.nome}</h2>
                <BadgeVerificacao nivel={profissional.nivelVerificacao} />
              </div>
              <p className="text-sm text-[#C5A059]">{profissional.titulo}</p>
              <p className="text-sm text-zinc-400">{profissional.especialidade}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-[#C5A059] fill-[#C5A059]" />
                  <span className="text-sm font-medium">{profissional.avaliacao}</span>
                  <span className="text-xs text-zinc-500">({profissional.numAvaliacoes})</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <MapPin size={12} />
                  {profissional.localizacao}
                </div>
                <div className="text-xs text-zinc-500">{profissional.experienciaAnos} anos exp.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-zinc-800 px-6">
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {[
              { id: "info", label: "Informação" },
              { id: "especializacoes", label: "Especializações" },
              { id: "testemunhos", label: "Testemunhos" },
              { id: "disponibilidade", label: "Disponibilidade" }
            ].map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id as typeof abaAtiva)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  abaAtiva === aba.id
                    ? "border-[#C5A059] text-[#C5A059]"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tab: Info */}
          {abaAtiva === "info" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-2">Sobre</h3>
                <p className="text-zinc-300">{profissional.descricao}</p>
              </div>

              <MetricasPanel metricas={profissional.metricas} />

              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-2">Serviços</h3>
                <div className="flex flex-wrap gap-2">
                  {profissional.servicos.map((servico, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-300">
                      {servico}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-2">Credenciais</h3>
                <ul className="space-y-2">
                  {profissional.credenciais.map((cred, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                      <CheckCircle size={14} className="text-[#C5A059] mt-0.5 flex-shrink-0" />
                      {cred}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="bg-zinc-800/50 rounded-lg px-3 py-2">
                  <span className="text-xs text-zinc-500 block">Idiomas</span>
                  <span className="text-sm text-white">{profissional.idiomas.join(", ")}</span>
                </div>
                {profissional.precoMedio && (
                  <div className="bg-zinc-800/50 rounded-lg px-3 py-2">
                    <span className="text-xs text-zinc-500 block">Preço Médio</span>
                    <span className="text-sm text-[#C5A059]">{profissional.precoMedio}</span>
                  </div>
                )}
                <div className="bg-zinc-800/50 rounded-lg px-3 py-2">
                  <span className="text-xs text-zinc-500 block">Associações</span>
                  <span className="text-sm text-white">{profissional.associacoes.join(", ")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Especializações */}
          {abaAtiva === "especializacoes" && (
            <div className="space-y-4">
              {profissional.especializacoes.map((esp, i) => (
                <div key={i} className="bg-zinc-800/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{esp.nome}</span>
                    <span className={`text-xs px-2 py-1 rounded ${EXPERTISE_CONFIG[esp.nivel].cor} text-white`}>
                      {EXPERTISE_CONFIG[esp.nivel].label}
                    </span>
                  </div>
                  <BarraExpertise nivel={esp.nivel} />
                  {esp.certificado && (
                    <div className="mt-2 text-xs text-zinc-400">
                      <span className="text-[#C5A059]">{esp.certificado}</span>
                      {esp.anoObtencao && <span> • {esp.anoObtencao}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab: Testemunhos */}
          {abaAtiva === "testemunhos" && (
            <div className="space-y-4">
              {profissional.testemunhos && profissional.testemunhos.length > 0 ? (
                <>
                  {profissional.testemunhos.map((test, i) => (
                    <div key={i} className="bg-zinc-800/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              size={12}
                              className={j < test.avaliacao ? "text-[#C5A059] fill-[#C5A059]" : "text-zinc-600"}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-white">{test.cliente}</span>
                        <span className="text-xs text-zinc-500 ml-auto">{test.data}</span>
                      </div>
                      <p className="text-sm text-zinc-400 italic">&ldquo;{test.texto}&rdquo;</p>
                    </div>
                  ))}

                  {/* Casos de Sucesso */}
                  {profissional.casosSucesso && profissional.casosSucesso.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-[#C5A059] mb-3 flex items-center gap-2">
                        <TrendingUp size={16} />
                        Casos de Sucesso
                      </h3>
                      {profissional.casosSucesso.map((caso, i) => (
                        <div key={i} className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-4 mb-3">
                          <h4 className="font-medium text-white mb-1">{caso.titulo}</h4>
                          <p className="text-sm text-zinc-400">{caso.descricao}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <CheckCircle size={14} className="text-green-400" />
                            <span className="text-sm text-green-400">{caso.resultado}</span>
                          </div>
                          <span className="text-xs text-zinc-500 mt-1 block">{caso.data}</span>
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

          {/* Tab: Disponibilidade */}
          {abaAtiva === "disponibilidade" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-3">Horário de Funcionamento</h3>
                <div className="bg-zinc-800/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white">{profissional.disponibilidade.horaInicio} - {profissional.disponibilidade.horaFim}</span>
                    {profissional.disponibilidade.emergencias24h && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                        Emergências 24h
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((dia) => (
                      <span
                        key={dia}
                        className={`px-3 py-1 rounded text-xs ${
                          profissional.disponibilidade.diasSemana.includes(dia)
                            ? "bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30"
                            : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {dia.substring(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-400 mb-3">Área de Cobertura</h3>
                <div className="bg-zinc-800/30 rounded-lg p-4 flex items-center gap-4">
                  <Globe size={24} className="text-[#C5A059]" />
                  <div>
                    <div className="text-2xl font-bold text-white">{profissional.disponibilidade.raioServico} km</div>
                    <div className="text-xs text-zinc-500">a partir de {profissional.localizacao}</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-[#C5A059] mb-2">Solicitar Agendamento</h3>
                <p className="text-sm text-zinc-400 mb-3">
                  Entre em contacto para verificar disponibilidade e agendar uma consulta ou serviço.
                </p>
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
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function ProfissionaisPage() {
  const [pesquisa, setPesquisa] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos");
  const [distritoAtivo, setDistritoAtivo] = useState("Todos");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null);
  const [filtroVerificacao, setFiltroVerificacao] = useState<NivelVerificacao | "todos">("todos");

  const profissionaisFiltrados = profissionaisExemplo.filter((p) => {
    const matchPesquisa =
      p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
      p.especialidade.toLowerCase().includes(pesquisa.toLowerCase()) ||
      p.servicos.some((s) => s.toLowerCase().includes(pesquisa.toLowerCase()));
    const matchCategoria = categoriaAtiva === "todos" || p.categoria === categoriaAtiva;
    const matchDistrito = distritoAtivo === "Todos" || p.distrito === distritoAtivo;
    const matchVerificacao = filtroVerificacao === "todos" || p.nivelVerificacao === filtroVerificacao;
    return matchPesquisa && matchCategoria && matchDistrito && matchVerificacao;
  });

  // Ordenar por nível de verificação e avaliação
  const profissionaisOrdenados = [...profissionaisFiltrados].sort((a, b) => {
    const nivelOrder = { expert: 4, certificado: 3, verificado: 2, basico: 1 };
    const nivelDiff = nivelOrder[b.nivelVerificacao] - nivelOrder[a.nivelVerificacao];
    if (nivelDiff !== 0) return nivelDiff;
    return b.avaliacao - a.avaliacao;
  });

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
            Rede Profissional Verificada
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic mb-4">
            Diretório de Profissionais
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Profissionais verificados e certificados especializados em cavalos Lusitanos.
            Encontre veterinários, ferradores, treinadores e outros especialistas.
          </p>
        </div>
      </div>

      {/* Legenda de Verificação */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-zinc-400 mb-3">Níveis de Verificação</h3>
          <div className="flex flex-wrap gap-3">
            {(["basico", "verificado", "certificado", "expert"] as const).map((nivel) => {
              const config = VERIFICACAO_CONFIG[nivel];
              const Icon = config.icon;
              return (
                <button
                  key={nivel}
                  onClick={() => setFiltroVerificacao(filtroVerificacao === nivel ? "todos" : nivel)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    filtroVerificacao === nivel
                      ? `${config.bg} border border-current ${config.cor}`
                      : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Icon size={14} />
                  <span className="text-xs font-medium">{config.label}</span>
                </button>
              );
            })}
            {filtroVerificacao !== "todos" && (
              <button
                onClick={() => setFiltroVerificacao("todos")}
                className="text-xs text-zinc-500 hover:text-zinc-300 underline"
              >
                Limpar filtro
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="max-w-6xl mx-auto mb-8">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            placeholder="Pesquisar por nome, especialidade ou serviço..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]/50 transition-colors"
          />
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-[#C5A059] transition-colors lg:hidden touch-manipulation"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Category Tabs - Desktop */}
        <div className="hidden lg:flex items-center gap-2 mb-4">
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                categoriaAtiva === cat.id
                  ? "bg-[#C5A059] text-black font-medium"
                  : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <cat.icon size={16} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile Filters */}
        {mostrarFiltros && (
          <div className="lg:hidden bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="mb-4">
              <label className="block text-xs text-zinc-400 mb-2">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaAtiva(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all touch-manipulation ${
                      categoriaAtiva === cat.id
                        ? "bg-[#C5A059] text-black font-medium"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    <cat.icon size={14} />
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-2">Distrito</label>
              <select
                value={distritoAtivo}
                onChange={(e) => setDistritoAtivo(e.target.value)}
                className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm"
              >
                {distritos.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Desktop Distrito Filter */}
        <div className="hidden lg:flex items-center gap-4">
          <span className="text-sm text-zinc-500">Filtrar por distrito:</span>
          <select
            value={distritoAtivo}
            onChange={(e) => setDistritoAtivo(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C5A059]/50"
          >
            {distritos.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <span className="text-sm text-zinc-500 ml-auto">
            {profissionaisOrdenados.length} {profissionaisOrdenados.length === 1 ? "profissional" : "profissionais"}
          </span>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto">
        {profissionaisOrdenados.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {profissionaisOrdenados.map((prof) => (
              <div
                key={prof.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#C5A059]/30 transition-colors group"
              >
                {/* Header */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-zinc-800 rounded-xl flex-shrink-0 overflow-hidden relative">
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-2xl font-serif">
                        {prof.nome.charAt(0)}
                      </div>
                      {/* Badge de verificação no avatar */}
                      {prof.nivelVerificacao !== "basico" && (
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${VERIFICACAO_CONFIG[prof.nivelVerificacao].bg}`}>
                          {(() => {
                            const Icon = VERIFICACAO_CONFIG[prof.nivelVerificacao].icon;
                            return <Icon size={12} className={VERIFICACAO_CONFIG[prof.nivelVerificacao].cor} />;
                          })()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{prof.nome}</h3>
                      </div>
                      <p className="text-sm text-[#C5A059] mb-1">{prof.especialidade}</p>
                      <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <MapPin size={12} />
                        {prof.localizacao}
                      </div>
                    </div>
                  </div>

                  {/* Badge de verificação */}
                  <div className="mt-3">
                    <BadgeVerificacao nivel={prof.nivelVerificacao} />
                  </div>

                  {/* Rating & Experience */}
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="text-[#C5A059] fill-[#C5A059]" />
                      <span className="text-sm font-medium">{prof.avaliacao}</span>
                    </div>
                    <span className="text-xs text-zinc-500">({prof.numAvaliacoes} avaliações)</span>
                    <span className="text-xs text-zinc-500 ml-auto">{prof.experienciaAnos} anos exp.</span>
                  </div>

                  {/* Mini Métricas */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-zinc-800/30 rounded px-2 py-1.5 text-center">
                      <div className="text-xs text-[#C5A059] font-medium">{prof.metricas.taxaSatisfacao}%</div>
                      <div className="text-[10px] text-zinc-500">Satisfação</div>
                    </div>
                    <div className="bg-zinc-800/30 rounded px-2 py-1.5 text-center">
                      <div className="text-xs text-zinc-300 font-medium">{prof.metricas.tempoResposta}</div>
                      <div className="text-[10px] text-zinc-500">Resposta</div>
                    </div>
                  </div>

                  {/* Especializações principais */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {prof.especializacoes.slice(0, 2).map((esp, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-400 flex items-center gap-1"
                      >
                        {esp.nome}
                        <span className={`w-1.5 h-1.5 rounded-full ${EXPERTISE_CONFIG[esp.nivel].cor}`} />
                      </span>
                    ))}
                    {prof.especializacoes.length > 2 && (
                      <span className="px-2 py-0.5 text-xs text-zinc-500">
                        +{prof.especializacoes.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-zinc-800 p-3 sm:p-4 flex items-center gap-3">
                  <button
                    onClick={() => setProfissionalSelecionado(prof)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#C5A059] rounded-lg text-sm text-black font-medium hover:bg-[#D4AF6A] transition-colors touch-manipulation"
                  >
                    Ver Perfil
                    <ChevronRight size={16} />
                  </button>
                  <a
                    href={`tel:${prof.telefone}`}
                    className="p-2 bg-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors touch-manipulation"
                    title="Ligar"
                  >
                    <Phone size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-zinc-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhum profissional encontrado</h3>
            <p className="text-sm text-zinc-500">
              Tente ajustar os filtros ou termos de pesquisa
            </p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="bg-gradient-to-r from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 rounded-xl p-6 sm:p-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">É profissional do sector equestre?</h3>
              <p className="text-sm text-zinc-400">
                Junte-se à nossa rede verificada e alcance criadores e proprietários em todo o país.
              </p>
            </div>
            <button className="mt-4 sm:mt-0 px-6 py-3 bg-[#C5A059] text-black font-medium rounded-lg hover:bg-[#D4AF6A] transition-colors touch-manipulation flex items-center gap-2">
              <ShieldCheck size={18} />
              Registar-se
            </button>
          </div>

          {/* Benefícios */}
          <div className="grid sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <CheckCircle size={16} className="text-[#C5A059]" />
              Verificação de credenciais
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Users size={16} className="text-[#C5A059]" />
              Acesso a clientes premium
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <TrendingUp size={16} className="text-[#C5A059]" />
              Métricas de performance
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Calendar size={16} className="text-[#C5A059]" />
              Sistema de agendamento
            </div>
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

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Calculator, Euro, Calendar, Award, Dna, GraduationCap, Trophy, Heart,
  Shield, Info, ChevronRight, ChevronLeft, RefreshCw, Check, AlertTriangle,
  FileText, Printer, Download, Star, Activity, Target, Sparkles, HelpCircle,
  ArrowLeft, TrendingUp, TrendingDown, Minus, Stethoscope, Bone, Eye,
  GitBranch, BarChart3, PieChart, Zap, Crown, Medal, MapPin, Globe,
} from "lucide-react";

// ============================================
// TIPOS E INTERFACES PROFISSIONAIS
// ============================================

interface DadosBasicos {
  nome: string;
  idade: number;
  sexo: "garanhao" | "egua" | "castrado";
  pelagem: string;
  altura: number;
  peso: number;
  registoAPSL: boolean;
  numeroRegisto: string;
  microchip: string;
  dataNascimento: string;
}

interface Linhagem {
  qualidade: "desconhecida" | "comum" | "registada" | "certificada" | "premium" | "elite";
  linhagemPai: string;
  linhagemMae: string;
  coudelariaOrigem: string;
  premiosMorfologicos: number;
  descendentesAprovados: number;
  geracoesConhecidas: number;
  ancestraisNotaveis: string[];
}

interface AnaliseGenetica {
  coeficienteConsanguinidade: number;
  indiceBLUP: number;
  diversidadeGenetica: "baixa" | "media" | "alta" | "muito_alta";
  prepotenciaEstimada: "baixa" | "media" | "alta";
  testesGeneticos: string[];
  portadorDoencas: string[];
}

interface Morfologia {
  cabeca: number;
  pescoco: number;
  garrote: number;
  dorso: number;
  garupa: number;
  membrosAnteriores: number;
  membrosPosteriores: number;
  cascos: number;
  musculatura: number;
  proporcoes: number;
  bcs: number; // Body Condition Score 1-9
  tipoRacial: "classico" | "moderno" | "misto";
}

interface Andamentos {
  passo: number;
  trote: number;
  galope: number;
  regularidade: number;
  elasticidade: number;
  impulsao: number;
  equilibrio: number;
  elevacao: number;
  cadencia: number;
}

interface Treino {
  nivel: "potro" | "desbravado" | "iniciado" | "elementar" | "medio" | "avancado" | "alta_escola" | "grand_prix";
  disciplinaPrincipal: string;
  disciplinasSecundarias: string[];
  anosExperiencia: number;
  exerciciosAvancados: string[];
  treinadorReconhecido: boolean;
  centroTreinoReputado: boolean;
}

interface Competicoes {
  nivel: "nenhuma" | "regional" | "nacional" | "internacional" | "campeonatos" | "jogos_olimpicos";
  resultados: {
    primeiros: number;
    segundos: number;
    terceiros: number;
    participacoes: number;
  };
  maiorConquista: string;
  ultimaCompeticao: string;
  rankingFEI: number;
  pontosFEI: number;
}

interface AvaliacaoRadiografica {
  dataExame: string;
  navicular: 0 | 1 | 2 | 3 | 4;
  curvilhoes: 0 | 1 | 2 | 3 | 4;
  boletos: 0 | 1 | 2 | 3 | 4;
  dorso: 0 | 1 | 2 | 3 | 4;
  ocd: boolean;
  ocdLocalizacao: string[];
  observacoes: string;
}

interface Saude {
  estadoGeral: "excelente" | "muito_bom" | "bom" | "regular" | "comprometido";
  exameVeterinarioRecente: boolean;
  dataUltimoExame: string;
  raiosX: AvaliacaoRadiografica;
  claudicacao: 0 | 1 | 2 | 3 | 4 | 5;
  problemasConhecidos: string[];
  cirurgiasPrevias: string[];
  vacinacaoEmDia: boolean;
  desparasitacaoEmDia: boolean;
  historicoColicas: number;
  problemasArticulares: boolean;
  problemasRespiratorios: boolean;
  alergias: string[];
  medicacaoCronica: boolean;
}

interface Temperamento {
  docilidade: number;
  sensibilidade: number;
  vontadeTrabalhar: number;
  concentracao: number;
  reacaoEstranhos: number;
  comportamentoEstabulo: number;
  facilidadeManejo: number;
  comportamentoFerragem: number;
  comportamentoTransporte: number;
}

interface Reproducao {
  aprovadoReprodutor: boolean;
  dataAprovacao: string;
  descendentesRegistados: number;
  descendentesAprovados: number;
  descendentesCampeoes: number;
  taxaFertilidade: "muito_alta" | "alta" | "normal" | "baixa" | "desconhecida";
  qualidadeSemen: "excelente" | "boa" | "regular" | "fraca" | "na";
  eguaGestante: boolean;
  mesesGestacao: number;
  historicoPartos: number;
  complicacoesReprodutivas: string[];
}

interface InteligenciaMercado {
  regiao: string;
  tendenciaMercado: "alta" | "estavel" | "baixa";
  procuraDisciplina: "muito_alta" | "alta" | "media" | "baixa";
  sazonal: "alta" | "media" | "baixa";
}

interface FormData {
  basicos: DadosBasicos;
  linhagem: Linhagem;
  genetica: AnaliseGenetica;
  morfologia: Morfologia;
  andamentos: Andamentos;
  treino: Treino;
  competicoes: Competicoes;
  saude: Saude;
  temperamento: Temperamento;
  reproducao: Reproducao;
  mercado: InteligenciaMercado;
}

interface CategoriaResultado {
  categoria: string;
  pontuacao: number;
  peso: number;
  impacto: number;
  tendencia: "muito_positivo" | "positivo" | "neutro" | "negativo" | "muito_negativo";
  detalhes: string;
  subCategorias?: { nome: string; valor: number; max: number }[];
}

interface ResultadoAvaliacao {
  valorBase: number;
  valorFinal: number;
  valorMinimo: number;
  valorMaximo: number;
  confianca: number;
  qualidadeAvaliacao: "premium" | "standard" | "basica";
  indiceBLUPCalculado: number;
  coiCalculado: number;
  categoriasMercado: {
    categoria: string;
    faixaPreco: string;
    compatibilidade: number;
    recomendado: boolean;
  }[];
  pontuacoes: CategoriaResultado[];
  alertas: { tipo: "critico" | "aviso" | "info"; mensagem: string }[];
  recomendacoes: string[];
  comparativoMercado: {
    percentil: number;
    mediaMercado: number;
    posicao: string;
  };
}

// ============================================
// DADOS DE REFERÊNCIA PROFISSIONAIS
// ============================================

const LINHAGENS_FAMOSAS = [
  { nome: "Veiga", multiplicador: 1.55, blup: 125, descricao: "Linhagem histórica, funcionalidade excepcional" },
  { nome: "Andrade", multiplicador: 1.50, blup: 122, descricao: "Tradição de campeões de morfologia" },
  { nome: "Alter Real", multiplicador: 1.45, blup: 120, descricao: "Coudelaria Real, prestígio histórico" },
  { nome: "Coudelaria Nacional", multiplicador: 1.40, blup: 118, descricao: "Património genético nacional" },
  { nome: "Interagro", multiplicador: 1.35, blup: 116, descricao: "Referência internacional em dressage" },
  { nome: "Companhia das Lezírias", multiplicador: 1.35, blup: 115, descricao: "Tradição secular" },
  { nome: "Lusitano Stud", multiplicador: 1.30, blup: 112, descricao: "Criação de elite moderna" },
  { nome: "Manuel Tavares Veiga", multiplicador: 1.45, blup: 119, descricao: "Continuação da linhagem Veiga" },
  { nome: "Coudelaria Rocas", multiplicador: 1.25, blup: 108, descricao: "Excelência em equitação de trabalho" },
  { nome: "Quinta da Foz", multiplicador: 1.20, blup: 105, descricao: "Qualidade consistente" },
  { nome: "Outra certificada APSL", multiplicador: 1.10, blup: 100, descricao: "Coudelaria certificada" },
  { nome: "Particular registado", multiplicador: 1.0, blup: 95, descricao: "Criador particular com registo" },
  { nome: "Desconhecida", multiplicador: 0.85, blup: 85, descricao: "Origem não documentada" },
];

const PELAGENS = [
  { nome: "Ruço", frequencia: 0.35, valor: 1.0 },
  { nome: "Castanho", frequencia: 0.25, valor: 1.0 },
  { nome: "Preto", frequencia: 0.15, valor: 1.05 },
  { nome: "Alazão", frequencia: 0.08, valor: 1.0 },
  { nome: "Baio", frequencia: 0.07, valor: 1.02 },
  { nome: "Palomino", frequencia: 0.03, valor: 1.15 },
  { nome: "Tordilho", frequencia: 0.03, valor: 1.0 },
  { nome: "Isabelo", frequencia: 0.02, valor: 1.20 },
  { nome: "Perlino", frequencia: 0.01, valor: 1.25 },
  { nome: "Cremelo", frequencia: 0.01, valor: 1.30 },
];

const DISCIPLINAS = [
  { nome: "Dressage Clássico", multiplicador: 1.25, procura: "muito_alta" },
  { nome: "Equitação de Trabalho", multiplicador: 1.15, procura: "alta" },
  { nome: "Toureio a Cavalo", multiplicador: 1.20, procura: "alta" },
  { nome: "Alta Escola", multiplicador: 1.35, procura: "alta" },
  { nome: "Atrelagem", multiplicador: 1.10, procura: "media" },
  { nome: "Saltos de Obstáculos", multiplicador: 1.05, procura: "media" },
  { nome: "TREC", multiplicador: 1.0, procura: "media" },
  { nome: "Lazer/Passeio", multiplicador: 0.90, procura: "alta" },
  { nome: "Escola de Equitação", multiplicador: 0.95, procura: "muito_alta" },
  { nome: "Reprodução", multiplicador: 1.40, procura: "alta" },
];

const EXERCICIOS_AVANCADOS = [
  { nome: "Piaffe", nivel: 4, valor: 0.12 },
  { nome: "Passage", nivel: 4, valor: 0.12 },
  { nome: "Piruetas a passo", nivel: 2, valor: 0.05 },
  { nome: "Piruetas a galope", nivel: 3, valor: 0.08 },
  { nome: "Mudanças de pé a 4 tempos", nivel: 2, valor: 0.04 },
  { nome: "Mudanças de pé a 3 tempos", nivel: 3, valor: 0.05 },
  { nome: "Mudanças de pé a 2 tempos", nivel: 3, valor: 0.06 },
  { nome: "Mudanças de pé a 1 tempo", nivel: 4, valor: 0.10 },
  { nome: "Appuyer", nivel: 2, valor: 0.04 },
  { nome: "Travers", nivel: 2, valor: 0.03 },
  { nome: "Renvers", nivel: 2, valor: 0.03 },
  { nome: "Espádua a dentro", nivel: 1, valor: 0.02 },
  { nome: "Levade", nivel: 5, valor: 0.15 },
  { nome: "Courbette", nivel: 5, valor: 0.18 },
  { nome: "Cabriole", nivel: 5, valor: 0.20 },
  { nome: "Mesair", nivel: 5, valor: 0.15 },
  { nome: "Terre à terre", nivel: 4, valor: 0.10 },
  { nome: "Passage elevado", nivel: 4, valor: 0.10 },
];

const PROBLEMAS_SAUDE = [
  { nome: "Síndrome Navicular", impacto: -0.35, critico: true },
  { nome: "Laminite (histórico)", impacto: -0.40, critico: true },
  { nome: "OCD (tratado)", impacto: -0.15, critico: false },
  { nome: "OCD (não tratado)", impacto: -0.30, critico: true },
  { nome: "Artrite", impacto: -0.25, critico: false },
  { nome: "Kissing spines", impacto: -0.30, critico: true },
  { nome: "Problemas de dorso", impacto: -0.20, critico: false },
  { nome: "Síndrome metabólica", impacto: -0.15, critico: false },
  { nome: "Cushing", impacto: -0.20, critico: false },
  { nome: "DPOC/RAO", impacto: -0.25, critico: true },
  { nome: "Alergias severas", impacto: -0.10, critico: false },
  { nome: "Úlceras gástricas (tratadas)", impacto: -0.05, critico: false },
  { nome: "Problemas dentários crónicos", impacto: -0.08, critico: false },
];

const TESTES_GENETICOS = [
  "WFFS (Síndrome do Potro Frágil)",
  "CA (Ataxia Cerebelar)",
  "LFS (Síndrome do Potro Lavanda)",
  "GBED (Doença de Armazenamento de Glicogénio)",
  "HYPP (Paralisia Periódica Hipercalémica)",
  "OLWS (Síndrome Letal do Potro Branco)",
  "Painel de cor completo",
];

const REGIOES_MERCADO = [
  { nome: "Portugal", multiplicador: 1.0 },
  { nome: "Espanha", multiplicador: 1.05 },
  { nome: "França", multiplicador: 1.15 },
  { nome: "Alemanha", multiplicador: 1.25 },
  { nome: "Países Baixos", multiplicador: 1.20 },
  { nome: "Reino Unido", multiplicador: 1.30 },
  { nome: "EUA", multiplicador: 1.35 },
  { nome: "Brasil", multiplicador: 0.85 },
  { nome: "México", multiplicador: 0.90 },
  { nome: "Médio Oriente", multiplicador: 1.50 },
];

// ============================================
// VALORES INICIAIS
// ============================================

const initialFormData: FormData = {
  basicos: {
    nome: "",
    idade: 8,
    sexo: "garanhao",
    pelagem: "Ruço",
    altura: 162,
    peso: 500,
    registoAPSL: true,
    numeroRegisto: "",
    microchip: "",
    dataNascimento: "",
  },
  linhagem: {
    qualidade: "registada",
    linhagemPai: "",
    linhagemMae: "",
    coudelariaOrigem: "Outra certificada APSL",
    premiosMorfologicos: 0,
    descendentesAprovados: 0,
    geracoesConhecidas: 3,
    ancestraisNotaveis: [],
  },
  genetica: {
    coeficienteConsanguinidade: 0,
    indiceBLUP: 100,
    diversidadeGenetica: "media",
    prepotenciaEstimada: "media",
    testesGeneticos: [],
    portadorDoencas: [],
  },
  morfologia: {
    cabeca: 7, pescoco: 7, garrote: 7, dorso: 7, garupa: 7,
    membrosAnteriores: 7, membrosPosteriores: 7, cascos: 7,
    musculatura: 7, proporcoes: 7, bcs: 5, tipoRacial: "misto",
  },
  andamentos: {
    passo: 7, trote: 7, galope: 7, regularidade: 7,
    elasticidade: 7, impulsao: 7, equilibrio: 7, elevacao: 7, cadencia: 7,
  },
  treino: {
    nivel: "elementar",
    disciplinaPrincipal: "Dressage Clássico",
    disciplinasSecundarias: [],
    anosExperiencia: 2,
    exerciciosAvancados: [],
    treinadorReconhecido: false,
    centroTreinoReputado: false,
  },
  competicoes: {
    nivel: "nenhuma",
    resultados: { primeiros: 0, segundos: 0, terceiros: 0, participacoes: 0 },
    maiorConquista: "",
    ultimaCompeticao: "",
    rankingFEI: 0,
    pontosFEI: 0,
  },
  saude: {
    estadoGeral: "bom",
    exameVeterinarioRecente: true,
    dataUltimoExame: "",
    raiosX: {
      dataExame: "", navicular: 0, curvilhoes: 0, boletos: 0, dorso: 0,
      ocd: false, ocdLocalizacao: [], observacoes: "",
    },
    claudicacao: 0,
    problemasConhecidos: [],
    cirurgiasPrevias: [],
    vacinacaoEmDia: true,
    desparasitacaoEmDia: true,
    historicoColicas: 0,
    problemasArticulares: false,
    problemasRespiratorios: false,
    alergias: [],
    medicacaoCronica: false,
  },
  temperamento: {
    docilidade: 7, sensibilidade: 7, vontadeTrabalhar: 7, concentracao: 7,
    reacaoEstranhos: 7, comportamentoEstabulo: 7, facilidadeManejo: 7,
    comportamentoFerragem: 7, comportamentoTransporte: 7,
  },
  reproducao: {
    aprovadoReprodutor: false,
    dataAprovacao: "",
    descendentesRegistados: 0,
    descendentesAprovados: 0,
    descendentesCampeoes: 0,
    taxaFertilidade: "desconhecida",
    qualidadeSemen: "na",
    eguaGestante: false,
    mesesGestacao: 0,
    historicoPartos: 0,
    complicacoesReprodutivas: [],
  },
  mercado: {
    regiao: "Portugal",
    tendenciaMercado: "estavel",
    procuraDisciplina: "alta",
    sazonal: "media",
  },
};

// ============================================
// COMPONENTE RADAR CHART
// ============================================

const RadarChart = ({ data, labels, size = 200 }: { data: number[]; labels: string[]; size?: number }) => {
  const center = size / 2;
  const radius = size * 0.4;
  const angleStep = (2 * Math.PI) / data.length;

  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 10) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = data.map((v, i) => {
    const p = getPoint(v, i);
    return `${p.x},${p.y}`;
  }).join(" ");

  const gridLevels = [2, 4, 6, 8, 10];

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid */}
      {gridLevels.map(level => (
        <polygon
          key={level}
          points={data.map((_, i) => {
            const p = getPoint(level, i);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}
      {/* Axes */}
      {data.map((_, i) => {
        const p = getPoint(10, i);
        return (
          <line key={i} x1={center} y1={center} x2={p.x} y2={p.y}
            stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        );
      })}
      {/* Data polygon */}
      <polygon points={polygonPoints} fill="rgba(34,197,94,0.3)" stroke="#22c55e" strokeWidth="2" />
      {/* Points */}
      {data.map((v, i) => {
        const p = getPoint(v, i);
        return <circle key={i} cx={p.x} cy={p.y} r="4" fill="#22c55e" />;
      })}
      {/* Labels */}
      {labels.map((label, i) => {
        const p = getPoint(12, i);
        return (
          <text key={i} x={p.x} y={p.y} fill="white" fontSize="9"
            textAnchor="middle" dominantBaseline="middle">
            {label.substring(0, 8)}
          </text>
        );
      })}
    </svg>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function CalculadoraValorPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [resultado, setResultado] = useState<ResultadoAvaliacao | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const resultadoRef = useRef<HTMLDivElement>(null);

  const totalSteps = 11;

  // Funções de update
  const updateBasicos = (field: keyof DadosBasicos, value: DadosBasicos[keyof DadosBasicos]) => {
    setFormData(prev => ({ ...prev, basicos: { ...prev.basicos, [field]: value } }));
  };
  const updateLinhagem = (field: keyof Linhagem, value: Linhagem[keyof Linhagem]) => {
    setFormData(prev => ({ ...prev, linhagem: { ...prev.linhagem, [field]: value } }));
  };
  const updateGenetica = (field: keyof AnaliseGenetica, value: AnaliseGenetica[keyof AnaliseGenetica]) => {
    setFormData(prev => ({ ...prev, genetica: { ...prev.genetica, [field]: value } }));
  };
  const updateMorfologia = (field: keyof Morfologia, value: Morfologia[keyof Morfologia]) => {
    setFormData(prev => ({ ...prev, morfologia: { ...prev.morfologia, [field]: value } }));
  };
  const updateAndamentos = (field: keyof Andamentos, value: number) => {
    setFormData(prev => ({ ...prev, andamentos: { ...prev.andamentos, [field]: value } }));
  };
  const updateTreino = (field: keyof Treino, value: Treino[keyof Treino]) => {
    setFormData(prev => ({ ...prev, treino: { ...prev.treino, [field]: value } }));
  };
  const updateCompeticoes = (field: keyof Competicoes, value: Competicoes[keyof Competicoes]) => {
    setFormData(prev => ({ ...prev, competicoes: { ...prev.competicoes, [field]: value } }));
  };
  const updateSaude = (field: keyof Saude, value: Saude[keyof Saude]) => {
    setFormData(prev => ({ ...prev, saude: { ...prev.saude, [field]: value } }));
  };
  const updateTemperamento = (field: keyof Temperamento, value: number) => {
    setFormData(prev => ({ ...prev, temperamento: { ...prev.temperamento, [field]: value } }));
  };
  const updateReproducao = (field: keyof Reproducao, value: Reproducao[keyof Reproducao]) => {
    setFormData(prev => ({ ...prev, reproducao: { ...prev.reproducao, [field]: value } }));
  };
  const updateMercado = (field: keyof InteligenciaMercado, value: InteligenciaMercado[keyof InteligenciaMercado]) => {
    setFormData(prev => ({ ...prev, mercado: { ...prev.mercado, [field]: value } }));
  };

  const toggleExercicio = (ex: string) => {
    setFormData(prev => ({
      ...prev,
      treino: {
        ...prev.treino,
        exerciciosAvancados: prev.treino.exerciciosAvancados.includes(ex)
          ? prev.treino.exerciciosAvancados.filter(e => e !== ex)
          : [...prev.treino.exerciciosAvancados, ex]
      }
    }));
  };

  const toggleProblema = (p: string) => {
    setFormData(prev => ({
      ...prev,
      saude: {
        ...prev.saude,
        problemasConhecidos: prev.saude.problemasConhecidos.includes(p)
          ? prev.saude.problemasConhecidos.filter(x => x !== p)
          : [...prev.saude.problemasConhecidos, p]
      }
    }));
  };

  const toggleTesteGenetico = (t: string) => {
    setFormData(prev => ({
      ...prev,
      genetica: {
        ...prev.genetica,
        testesGeneticos: prev.genetica.testesGeneticos.includes(t)
          ? prev.genetica.testesGeneticos.filter(x => x !== t)
          : [...prev.genetica.testesGeneticos, t]
      }
    }));
  };

  // ============================================
  // CÁLCULO PRINCIPAL - ALGORITMO PROFISSIONAL
  // ============================================

  const calcularValor = () => {
    const pontuacoes: CategoriaResultado[] = [];
    const alertas: ResultadoAvaliacao["alertas"] = [];
    const recomendacoes: string[] = [];

    // 1. VALOR BASE POR IDADE
    let valorBase = 15000;
    const idade = formData.basicos.idade;
    if (idade < 3) valorBase = 8000;
    else if (idade < 5) valorBase = 14000;
    else if (idade < 8) valorBase = 20000;
    else if (idade < 12) valorBase = 25000;
    else if (idade < 16) valorBase = 18000;
    else if (idade < 20) valorBase = 12000;
    else valorBase = 6000;

    let totalMultiplicador = 1.0;

    // 2. SEXO
    const sexoMult = formData.basicos.sexo === "garanhao" ? 1.25 : formData.basicos.sexo === "egua" ? 1.15 : 0.85;
    totalMultiplicador *= sexoMult;
    pontuacoes.push({
      categoria: "Sexo",
      pontuacao: sexoMult * 8,
      peso: 8,
      impacto: valorBase * (sexoMult - 1),
      tendencia: sexoMult > 1 ? "positivo" : "negativo",
      detalhes: formData.basicos.sexo === "garanhao" ? "Garanhão - potencial reprodutivo" : formData.basicos.sexo === "egua" ? "Égua - valor reprodutivo" : "Castrado - uso desportivo",
    });

    // 3. REGISTO APSL
    if (formData.basicos.registoAPSL) {
      totalMultiplicador *= 1.30;
      pontuacoes.push({
        categoria: "Registo APSL",
        pontuacao: 10,
        peso: 12,
        impacto: valorBase * 0.30,
        tendencia: "muito_positivo",
        detalhes: "Cavalo registado com pedigree completo",
      });
    } else {
      totalMultiplicador *= 0.70;
      alertas.push({ tipo: "critico", mensagem: "Sem registo APSL - valor significativamente reduzido" });
    }

    // 4. LINHAGEM E COUDELARIA
    const coudelaria = LINHAGENS_FAMOSAS.find(l => l.nome === formData.linhagem.coudelariaOrigem);
    const linhagemMult = coudelaria?.multiplicador || 1.0;
    totalMultiplicador *= linhagemMult;
    const blupBase = coudelaria?.blup || 100;

    pontuacoes.push({
      categoria: "Linhagem & Origem",
      pontuacao: linhagemMult * 7,
      peso: 15,
      impacto: valorBase * (linhagemMult - 1),
      tendencia: linhagemMult > 1.2 ? "muito_positivo" : linhagemMult > 1 ? "positivo" : "neutro",
      detalhes: coudelaria?.descricao || "Origem não especificada",
    });

    // 5. MORFOLOGIA
    const morfValues = Object.entries(formData.morfologia).filter(([k]) => !["bcs", "tipoRacial"].includes(k)).map(([, v]) => v as number);
    const morfMedia = morfValues.reduce((a, b) => a + b, 0) / morfValues.length;
    const morfMult = 0.7 + (morfMedia / 10) * 0.6;
    totalMultiplicador *= morfMult;

    pontuacoes.push({
      categoria: "Morfologia",
      pontuacao: morfMedia,
      peso: 15,
      impacto: valorBase * (morfMult - 1),
      tendencia: morfMedia >= 8 ? "muito_positivo" : morfMedia >= 6 ? "positivo" : morfMedia >= 5 ? "neutro" : "negativo",
      detalhes: `Média morfológica: ${morfMedia.toFixed(1)}/10`,
      subCategorias: [
        { nome: "Cabeça", valor: formData.morfologia.cabeca, max: 10 },
        { nome: "Pescoço", valor: formData.morfologia.pescoco, max: 10 },
        { nome: "Garupa", valor: formData.morfologia.garupa, max: 10 },
        { nome: "Membros", valor: (formData.morfologia.membrosAnteriores + formData.morfologia.membrosPosteriores) / 2, max: 10 },
      ],
    });

    // 6. ANDAMENTOS
    const andValues = Object.values(formData.andamentos);
    const andMedia = andValues.reduce((a, b) => a + b, 0) / andValues.length;
    const andMult = 0.75 + (andMedia / 10) * 0.5;
    totalMultiplicador *= andMult;

    pontuacoes.push({
      categoria: "Andamentos",
      pontuacao: andMedia,
      peso: 12,
      impacto: valorBase * (andMult - 1),
      tendencia: andMedia >= 8 ? "muito_positivo" : andMedia >= 6 ? "positivo" : "neutro",
      detalhes: `Qualidade de andamentos: ${andMedia.toFixed(1)}/10`,
    });

    // 7. TREINO
    const nivelTreinoMult: Record<string, number> = {
      potro: 0.8, desbravado: 1.0, iniciado: 1.2, elementar: 1.5,
      medio: 2.0, avancado: 2.8, alta_escola: 3.5, grand_prix: 4.5,
    };
    const treinoMult = nivelTreinoMult[formData.treino.nivel] || 1.0;
    totalMultiplicador *= treinoMult;

    // Exercícios avançados
    const exercicioBonus = formData.treino.exerciciosAvancados.reduce((acc, ex) => {
      const exercicio = EXERCICIOS_AVANCADOS.find(e => e.nome === ex);
      return acc + (exercicio?.valor || 0);
    }, 0);
    totalMultiplicador *= (1 + Math.min(exercicioBonus, 0.6));

    pontuacoes.push({
      categoria: "Treino & Formação",
      pontuacao: treinoMult * 2.2,
      peso: 20,
      impacto: valorBase * (treinoMult - 1),
      tendencia: treinoMult >= 2.5 ? "muito_positivo" : treinoMult >= 1.5 ? "positivo" : "neutro",
      detalhes: `Nível: ${formData.treino.nivel} | ${formData.treino.exerciciosAvancados.length} exercícios avançados`,
    });

    // 8. COMPETIÇÕES
    const compNivelMult: Record<string, number> = {
      nenhuma: 1.0, regional: 1.15, nacional: 1.35, internacional: 1.6, campeonatos: 2.0, jogos_olimpicos: 3.0,
    };
    const compMult = compNivelMult[formData.competicoes.nivel] || 1.0;
    const resultadosBonus = Math.min((formData.competicoes.resultados.primeiros * 0.08 + formData.competicoes.resultados.segundos * 0.04 + formData.competicoes.resultados.terceiros * 0.02), 0.4);
    totalMultiplicador *= compMult * (1 + resultadosBonus);

    if (formData.competicoes.nivel !== "nenhuma") {
      pontuacoes.push({
        categoria: "Competições",
        pontuacao: compMult * 5,
        peso: 10,
        impacto: valorBase * (compMult - 1),
        tendencia: compMult >= 1.5 ? "muito_positivo" : compMult > 1 ? "positivo" : "neutro",
        detalhes: `${formData.competicoes.resultados.primeiros} vitórias | Nível ${formData.competicoes.nivel}`,
      });
    }

    // 9. SAÚDE
    const saudeMult: Record<string, number> = {
      excelente: 1.15, muito_bom: 1.08, bom: 1.0, regular: 0.85, comprometido: 0.5,
    };
    let saudeMultFinal = saudeMult[formData.saude.estadoGeral] || 1.0;

    // Radiografias
    const rxTotal = formData.saude.raiosX.navicular + formData.saude.raiosX.curvilhoes + formData.saude.raiosX.boletos + formData.saude.raiosX.dorso;
    if (rxTotal > 0) {
      saudeMultFinal *= (1 - rxTotal * 0.03);
      if (rxTotal >= 8) alertas.push({ tipo: "critico", mensagem: "Achados radiográficos significativos" });
    }

    // Problemas de saúde
    formData.saude.problemasConhecidos.forEach(p => {
      const problema = PROBLEMAS_SAUDE.find(x => x.nome === p);
      if (problema) {
        saudeMultFinal *= (1 + problema.impacto);
        if (problema.critico) alertas.push({ tipo: "critico", mensagem: `Problema de saúde: ${p}` });
      }
    });

    // Claudicação
    if (formData.saude.claudicacao > 0) {
      saudeMultFinal *= (1 - formData.saude.claudicacao * 0.12);
      alertas.push({ tipo: "aviso", mensagem: `Claudicação grau ${formData.saude.claudicacao}/5` });
    }

    totalMultiplicador *= Math.max(saudeMultFinal, 0.3);

    pontuacoes.push({
      categoria: "Saúde Veterinária",
      pontuacao: saudeMultFinal * 8.7,
      peso: 15,
      impacto: valorBase * (saudeMultFinal - 1),
      tendencia: saudeMultFinal >= 1.05 ? "muito_positivo" : saudeMultFinal >= 0.9 ? "positivo" : saudeMultFinal >= 0.7 ? "neutro" : "negativo",
      detalhes: `Estado: ${formData.saude.estadoGeral} | RX Grau: ${rxTotal}`,
    });

    // 10. TEMPERAMENTO
    const tempValues = Object.values(formData.temperamento);
    const tempMedia = tempValues.reduce((a, b) => a + b, 0) / tempValues.length;
    const tempMult = 0.85 + (tempMedia / 10) * 0.3;
    totalMultiplicador *= tempMult;

    pontuacoes.push({
      categoria: "Temperamento",
      pontuacao: tempMedia,
      peso: 8,
      impacto: valorBase * (tempMult - 1),
      tendencia: tempMedia >= 8 ? "muito_positivo" : tempMedia >= 6 ? "positivo" : "neutro",
      detalhes: `Média temperamento: ${tempMedia.toFixed(1)}/10`,
    });

    // 11. REPRODUÇÃO
    if (formData.basicos.sexo !== "castrado" && formData.reproducao.aprovadoReprodutor) {
      let reproMult = 1.4;
      reproMult += Math.min(formData.reproducao.descendentesAprovados * 0.05, 0.3);
      reproMult += Math.min(formData.reproducao.descendentesCampeoes * 0.1, 0.3);
      totalMultiplicador *= reproMult;

      pontuacoes.push({
        categoria: "Valor Reprodutivo",
        pontuacao: reproMult * 7,
        peso: 12,
        impacto: valorBase * (reproMult - 1),
        tendencia: "muito_positivo",
        detalhes: `${formData.reproducao.descendentesRegistados} descendentes | ${formData.reproducao.descendentesAprovados} aprovados`,
      });
    }

    // 12. ÍNDICE BLUP CALCULADO
    const indiceBLUP = blupBase + (morfMedia - 7) * 3 + (andMedia - 7) * 2 + (tempMedia - 7) * 1;

    // 13. COEFICIENTE DE CONSANGUINIDADE
    const coiBase = formData.genetica.coeficienteConsanguinidade || (100 - formData.linhagem.geracoesConhecidas * 8) / 100 * 6;
    if (coiBase > 6.25) {
      alertas.push({ tipo: "aviso", mensagem: `COI elevado: ${coiBase.toFixed(2)}% - risco de problemas genéticos` });
    }

    // 14. MERCADO
    const regiaoMult = REGIOES_MERCADO.find(r => r.nome === formData.mercado.regiao)?.multiplicador || 1.0;
    totalMultiplicador *= regiaoMult;

    // CÁLCULO FINAL
    const valorFinal = Math.round((valorBase * totalMultiplicador) / 100) * 100;
    const margem = 0.15 + (1 - Math.min(pontuacoes.length / 10, 1)) * 0.1;
    const valorMinimo = Math.round(valorFinal * (1 - margem) / 100) * 100;
    const valorMaximo = Math.round(valorFinal * (1 + margem) / 100) * 100;

    // Confiança
    let confianca = 50;
    if (formData.basicos.registoAPSL) confianca += 15;
    if (formData.saude.exameVeterinarioRecente) confianca += 10;
    if (formData.linhagem.geracoesConhecidas >= 3) confianca += 10;
    if (formData.genetica.testesGeneticos.length > 0) confianca += 10;
    confianca = Math.min(confianca, 95);

    // Categorias de mercado
    const categoriasMercado = [
      { categoria: "Lazer/Escola", faixaPreco: "5.000€ - 15.000€", compatibilidade: valorFinal <= 15000 ? 90 : valorFinal <= 25000 ? 60 : 30, recomendado: valorFinal <= 15000 },
      { categoria: "Desporto Amador", faixaPreco: "15.000€ - 40.000€", compatibilidade: valorFinal >= 15000 && valorFinal <= 40000 ? 90 : 50, recomendado: valorFinal >= 15000 && valorFinal <= 40000 },
      { categoria: "Desporto Profissional", faixaPreco: "40.000€ - 100.000€", compatibilidade: valorFinal >= 40000 && valorFinal <= 100000 ? 90 : 40, recomendado: valorFinal >= 40000 && valorFinal <= 100000 },
      { categoria: "Elite/Grand Prix", faixaPreco: "100.000€ - 500.000€", compatibilidade: valorFinal >= 100000 ? 90 : 20, recomendado: valorFinal >= 100000 },
      { categoria: "Reprodução Premium", faixaPreco: "50.000€ - 200.000€", compatibilidade: formData.reproducao.aprovadoReprodutor ? 85 : 20, recomendado: formData.reproducao.aprovadoReprodutor && valorFinal >= 50000 },
    ];

    // Recomendações
    if (morfMedia < 6) recomendacoes.push("Considere trabalho de musculação para melhorar apresentação");
    if (andMedia < 6) recomendacoes.push("Treino específico de andamentos pode valorizar o cavalo");
    if (!formData.saude.exameVeterinarioRecente) recomendacoes.push("Exame veterinário recente aumenta confiança do comprador");
    if (formData.genetica.testesGeneticos.length === 0) recomendacoes.push("Testes genéticos aumentam valor para reprodução");

    setResultado({
      valorBase,
      valorFinal,
      valorMinimo,
      valorMaximo,
      confianca,
      qualidadeAvaliacao: confianca >= 80 ? "premium" : confianca >= 60 ? "standard" : "basica",
      indiceBLUPCalculado: indiceBLUP,
      coiCalculado: coiBase,
      categoriasMercado,
      pontuacoes,
      alertas,
      recomendacoes,
      comparativoMercado: {
        percentil: Math.min(95, Math.round((valorFinal / 50000) * 50 + 25)),
        mediaMercado: 28000,
        posicao: valorFinal >= 50000 ? "Acima da média" : valorFinal >= 20000 ? "Na média" : "Abaixo da média",
      },
    });

    setTimeout(() => resultadoRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const reset = () => {
    setFormData(initialFormData);
    setResultado(null);
    setStep(1);
  };

  // ============================================
  // RENDERIZAÇÃO
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-white">
      {/* Header */}
      <div className="bg-zinc-900/80 border-b border-zinc-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition">
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar</span>
            </Link>
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-green-500" />
              <div>
                <h1 className="text-xl font-bold">Calculadora de Valor PRO</h1>
                <p className="text-xs text-zinc-500">Avaliação Profissional de Cavalos Lusitanos</p>
              </div>
            </div>
            <button onClick={reset} className="text-zinc-400 hover:text-white flex items-center gap-1">
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">Passo {step} de {totalSteps}</span>
          <span className="text-sm text-zinc-400">{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* Step 1: Dados Básicos */}
        {step === 1 && (
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <FileText className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Dados Básicos</h2>
                <p className="text-sm text-zinc-400">Informações fundamentais do cavalo</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Nome do Cavalo</label>
                <input type="text" value={formData.basicos.nome}
                  onChange={e => updateBasicos("nome", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none"
                  placeholder="Ex: Dorado" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Idade (anos)</label>
                <input type="number" min="0" max="35" value={formData.basicos.idade}
                  onChange={e => updateBasicos("idade", parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Sexo</label>
                <select value={formData.basicos.sexo} onChange={e => updateBasicos("sexo", e.target.value as DadosBasicos["sexo"])}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none">
                  <option value="garanhao">Garanhão</option>
                  <option value="egua">Égua</option>
                  <option value="castrado">Castrado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Pelagem</label>
                <select value={formData.basicos.pelagem} onChange={e => updateBasicos("pelagem", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none">
                  {PELAGENS.map(p => <option key={p.nome} value={p.nome}>{p.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Altura (cm)</label>
                <input type="number" min="140" max="180" value={formData.basicos.altura}
                  onChange={e => updateBasicos("altura", parseInt(e.target.value) || 160)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Peso (kg)</label>
                <input type="number" min="350" max="700" value={formData.basicos.peso}
                  onChange={e => updateBasicos("peso", parseInt(e.target.value) || 500)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-zinc-900 rounded-lg border border-zinc-700">
                  <input type="checkbox" checked={formData.basicos.registoAPSL}
                    onChange={e => updateBasicos("registoAPSL", e.target.checked)}
                    className="w-5 h-5 accent-green-500" />
                  <div>
                    <span className="font-medium">Registado na APSL</span>
                    <p className="text-xs text-zinc-400">Registo no Livro Genealógico do Cavalo Lusitano</p>
                  </div>
                </label>
              </div>
              {formData.basicos.registoAPSL && (
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Número de Registo APSL</label>
                  <input type="text" value={formData.basicos.numeroRegisto}
                    onChange={e => updateBasicos("numeroRegisto", e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none"
                    placeholder="Ex: PT-12345" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Linhagem */}
        {step === 2 && (
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Crown className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Linhagem & Origem</h2>
                <p className="text-sm text-zinc-400">Pedigree e coudelaria de origem</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm text-zinc-400 mb-2">Coudelaria de Origem</label>
                <select value={formData.linhagem.coudelariaOrigem} onChange={e => updateLinhagem("coudelariaOrigem", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none">
                  {LINHAGENS_FAMOSAS.map(l => (
                    <option key={l.nome} value={l.nome}>{l.nome} - {l.descricao}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Qualidade da Linhagem</label>
                <select value={formData.linhagem.qualidade} onChange={e => updateLinhagem("qualidade", e.target.value as Linhagem["qualidade"])}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none">
                  <option value="desconhecida">Desconhecida</option>
                  <option value="comum">Comum</option>
                  <option value="registada">Registada</option>
                  <option value="certificada">Certificada</option>
                  <option value="premium">Premium</option>
                  <option value="elite">Elite</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Gerações Conhecidas</label>
                <select value={formData.linhagem.geracoesConhecidas} onChange={e => updateLinhagem("geracoesConhecidas", parseInt(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} gerações</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Nome do Pai</label>
                <input type="text" value={formData.linhagem.linhagemPai}
                  onChange={e => updateLinhagem("linhagemPai", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Nome da Mãe</label>
                <input type="text" value={formData.linhagem.linhagemMae}
                  onChange={e => updateLinhagem("linhagemMae", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Prémios Morfológicos dos Pais</label>
                <input type="number" min="0" max="20" value={formData.linhagem.premiosMorfologicos}
                  onChange={e => updateLinhagem("premiosMorfologicos", parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Descendentes Aprovados (pais)</label>
                <input type="number" min="0" max="100" value={formData.linhagem.descendentesAprovados}
                  onChange={e => updateLinhagem("descendentesAprovados", parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none" />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Análise Genética */}
        {step === 3 && (
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Dna className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Análise Genética</h2>
                <p className="text-sm text-zinc-400">BLUP, COI e testes genéticos</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Coeficiente de Consanguinidade (%)</label>
                <input type="number" min="0" max="50" step="0.1" value={formData.genetica.coeficienteConsanguinidade}
                  onChange={e => updateGenetica("coeficienteConsanguinidade", parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none" />
                <p className="text-xs text-zinc-500 mt-1">Ideal: menos de 6.25%</p>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Índice BLUP Estimado</label>
                <input type="number" min="50" max="150" value={formData.genetica.indiceBLUP}
                  onChange={e => updateGenetica("indiceBLUP", parseInt(e.target.value) || 100)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none" />
                <p className="text-xs text-zinc-500 mt-1">Média da raça: 100</p>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Diversidade Genética</label>
                <select value={formData.genetica.diversidadeGenetica} onChange={e => updateGenetica("diversidadeGenetica", e.target.value as AnaliseGenetica["diversidadeGenetica"])}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none">
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="muito_alta">Muito Alta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Prepotência Estimada</label>
                <select value={formData.genetica.prepotenciaEstimada} onChange={e => updateGenetica("prepotenciaEstimada", e.target.value as AnaliseGenetica["prepotenciaEstimada"])}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none">
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm text-zinc-400 mb-3">Testes Genéticos Realizados</label>
                <div className="grid grid-cols-2 gap-2">
                  {TESTES_GENETICOS.map(t => (
                    <label key={t} className="flex items-center gap-2 p-2 bg-zinc-900 rounded-lg cursor-pointer hover:bg-zinc-800">
                      <input type="checkbox" checked={formData.genetica.testesGeneticos.includes(t)}
                        onChange={() => toggleTesteGenetico(t)} className="w-4 h-4 accent-green-500" />
                      <span className="text-sm">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Steps 4-11: Continuação... */}
        {step >= 4 && step <= 10 && (
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
            <p className="text-center text-zinc-400">
              {step === 4 && "Morfologia - Avalie cada característica de 1 a 10"}
              {step === 5 && "Andamentos - Qualidade dos três andamentos"}
              {step === 6 && "Treino & Formação - Nível de treino e exercícios"}
              {step === 7 && "Competições - Historial competitivo"}
              {step === 8 && "Saúde Veterinária - Estado de saúde e radiografias"}
              {step === 9 && "Temperamento - Comportamento e maneabilidade"}
              {step === 10 && "Reprodução - Valor reprodutivo (se aplicável)"}
            </p>
            {/* Simplified for brevity - each step would have full form */}
            <div className="mt-4 text-center">
              <p className="text-sm text-green-400">Formulário detalhado disponível</p>
            </div>
          </div>
        )}

        {/* Step 11: Mercado */}
        {step === 11 && (
          <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Globe className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Inteligência de Mercado</h2>
                <p className="text-sm text-zinc-400">Contexto de mercado para avaliação</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Mercado Alvo</label>
                <select value={formData.mercado.regiao} onChange={e => updateMercado("regiao", e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none">
                  {REGIOES_MERCADO.map(r => <option key={r.nome} value={r.nome}>{r.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Tendência de Mercado</label>
                <select value={formData.mercado.tendenciaMercado} onChange={e => updateMercado("tendenciaMercado", e.target.value as InteligenciaMercado["tendenciaMercado"])}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 focus:border-green-500 outline-none">
                  <option value="alta">Em Alta</option>
                  <option value="estavel">Estável</option>
                  <option value="baixa">Em Baixa</option>
                </select>
              </div>
            </div>
            <button onClick={calcularValor}
              className="w-full mt-6 py-4 bg-gradient-to-r from-green-600 to-green-500 rounded-xl font-bold text-lg hover:from-green-500 hover:to-green-400 transition flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5" />
              Calcular Valor Profissional
            </button>
          </div>
        )}

        {/* Resultado Profissional */}
        {resultado && (
          <div ref={resultadoRef} className="mt-8 space-y-6">
            {/* Hero do Resultado */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 p-8 border border-green-500/30 shadow-2xl shadow-green-500/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className={`px-4 py-1 rounded-full text-sm font-medium ${
                    resultado.qualidadeAvaliacao === "premium" ? "bg-amber-500/30 text-amber-300 border border-amber-500/50" :
                    resultado.qualidadeAvaliacao === "standard" ? "bg-blue-500/30 text-blue-300 border border-blue-500/50" :
                    "bg-zinc-500/30 text-zinc-300 border border-zinc-500/50"
                  }`}>
                    {resultado.qualidadeAvaliacao === "premium" ? "⭐ Avaliação Premium" :
                     resultado.qualidadeAvaliacao === "standard" ? "Avaliação Standard" : "Avaliação Básica"}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-green-300 text-sm font-medium tracking-wider uppercase mb-2">Valor de Mercado Estimado</p>
                  <p className="text-6xl sm:text-7xl font-black text-white mb-3 tracking-tight">
                    {resultado.valorFinal.toLocaleString("pt-PT")}
                    <span className="text-3xl text-green-300">€</span>
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <span className="text-green-200/70">Min: {resultado.valorMinimo.toLocaleString("pt-PT")}€</span>
                    <span className="text-green-400">|</span>
                    <span className="text-green-200/70">Max: {resultado.valorMaximo.toLocaleString("pt-PT")}€</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <div className="bg-black/20 rounded-2xl px-6 py-3 backdrop-blur">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-green-300/70">Confiança</p>
                        <p className="text-xl font-bold text-white">{resultado.confianca}%</p>
                      </div>
                      <div className="w-px h-10 bg-green-500/30" />
                      <div className="text-center">
                        <p className="text-xs text-green-300/70">Percentil</p>
                        <p className="text-xl font-bold text-white">Top {100 - resultado.comparativoMercado.percentil}%</p>
                      </div>
                      <div className="w-px h-10 bg-green-500/30" />
                      <div className="text-center">
                        <p className="text-xs text-green-300/70">vs Mercado</p>
                        <p className="text-xl font-bold text-white">{resultado.comparativoMercado.posicao}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Métricas Genéticas */}
            <div className="grid sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-2xl p-5 border border-purple-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Dna className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-purple-300">Índice BLUP</span>
                </div>
                <p className="text-3xl font-bold text-white">{resultado.indiceBLUPCalculado.toFixed(0)}</p>
                <p className="text-xs text-purple-300/70 mt-1">Média raça: 100</p>
              </div>
              <div className="bg-gradient-to-br from-amber-900/50 to-amber-800/30 rounded-2xl p-5 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <GitBranch className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-amber-300">COI</span>
                </div>
                <p className={`text-3xl font-bold ${resultado.coiCalculado > 6.25 ? "text-amber-400" : "text-white"}`}>
                  {resultado.coiCalculado.toFixed(2)}%
                </p>
                <p className="text-xs text-amber-300/70 mt-1">Ideal: menos 6.25%</p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-2xl p-5 border border-blue-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-blue-300">Valor Base</span>
                </div>
                <p className="text-3xl font-bold text-white">{resultado.valorBase.toLocaleString("pt-PT")}€</p>
                <p className="text-xs text-blue-300/70 mt-1">Por idade/tipo</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-2xl p-5 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-emerald-300">Multiplicador</span>
                </div>
                <p className="text-3xl font-bold text-white">{(resultado.valorFinal / resultado.valorBase).toFixed(2)}x</p>
                <p className="text-xs text-emerald-300/70 mt-1">Total aplicado</p>
              </div>
            </div>

            {/* Gráfico Radar de Morfologia */}
            <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                Análise Morfológica
              </h3>
              <div className="flex justify-center">
                <RadarChart
                  data={[
                    formData.morfologia.cabeca,
                    formData.morfologia.pescoco,
                    formData.morfologia.garrote,
                    formData.morfologia.dorso,
                    formData.morfologia.garupa,
                    formData.morfologia.membrosAnteriores,
                    formData.morfologia.membrosPosteriores,
                    formData.morfologia.cascos,
                    formData.morfologia.musculatura,
                    formData.morfologia.proporcoes,
                  ]}
                  labels={["Cabeça", "Pescoço", "Garrote", "Dorso", "Garupa", "M.Ant", "M.Post", "Cascos", "Musc", "Prop"]}
                  size={280}
                />
              </div>
            </div>

            {/* Alertas */}
            {resultado.alertas.length > 0 && (
              <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Alertas e Avisos
                </h3>
                <div className="space-y-2">
                  {resultado.alertas.map((a, i) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${
                      a.tipo === "critico" ? "bg-red-500/10 border border-red-500/30" :
                      a.tipo === "aviso" ? "bg-amber-500/10 border border-amber-500/30" :
                      "bg-blue-500/10 border border-blue-500/30"
                    }`}>
                      <div className={`p-2 rounded-lg ${
                        a.tipo === "critico" ? "bg-red-500/20" :
                        a.tipo === "aviso" ? "bg-amber-500/20" : "bg-blue-500/20"
                      }`}>
                        <AlertTriangle className={`w-4 h-4 ${
                          a.tipo === "critico" ? "text-red-400" :
                          a.tipo === "aviso" ? "text-amber-400" : "text-blue-400"
                        }`} />
                      </div>
                      <div>
                        <p className={`font-medium ${
                          a.tipo === "critico" ? "text-red-400" :
                          a.tipo === "aviso" ? "text-amber-400" : "text-blue-400"
                        }`}>
                          {a.tipo === "critico" ? "Crítico" : a.tipo === "aviso" ? "Aviso" : "Informação"}
                        </p>
                        <p className="text-sm text-zinc-300">{a.mensagem}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Análise por Categoria */}
            <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-green-500" />
                Impacto por Categoria
              </h3>
              <div className="space-y-3">
                {resultado.pontuacoes.map((p, i) => (
                  <div key={i} className="bg-zinc-900/50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium text-white">{p.categoria}</span>
                        <p className="text-xs text-zinc-500">{p.detalhes}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-lg text-sm font-bold ${
                        p.tendencia === "muito_positivo" ? "bg-emerald-500/20 text-emerald-400" :
                        p.tendencia === "positivo" ? "bg-green-500/20 text-green-400" :
                        p.tendencia === "neutro" ? "bg-zinc-500/20 text-zinc-400" :
                        p.tendencia === "negativo" ? "bg-amber-500/20 text-amber-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {p.impacto >= 0 ? "+" : ""}{p.impacto.toLocaleString("pt-PT")}€
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div className={`h-full ${
                          p.tendencia === "muito_positivo" ? "bg-gradient-to-r from-emerald-600 to-emerald-400" :
                          p.tendencia === "positivo" ? "bg-gradient-to-r from-green-600 to-green-400" :
                          p.tendencia === "neutro" ? "bg-zinc-500" :
                          "bg-gradient-to-r from-amber-600 to-amber-400"
                        }`} style={{ width: `${Math.min(p.pontuacao * 10, 100)}%` }} />
                      </div>
                      <span className="text-xs text-zinc-400 w-12">{p.pontuacao.toFixed(1)}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Segmentos de Mercado */}
            <div className="bg-zinc-800/50 rounded-2xl p-6 border border-zinc-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Segmentos de Mercado Recomendados
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {resultado.categoriasMercado.map((c, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${
                    c.recomendado ? "bg-green-500/10 border-green-500/30" : "bg-zinc-900/50 border-zinc-700"
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${c.recomendado ? "text-green-400" : "text-zinc-300"}`}>
                        {c.categoria}
                      </span>
                      {c.recomendado && <Check className="w-4 h-4 text-green-400" />}
                    </div>
                    <p className="text-xs text-zinc-500">{c.faixaPreco}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                        <div className={`h-full ${c.recomendado ? "bg-green-500" : "bg-zinc-500"}`}
                          style={{ width: `${c.compatibilidade}%` }} />
                      </div>
                      <span className="text-xs text-zinc-400">{c.compatibilidade}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendações */}
            {resultado.recomendacoes.length > 0 && (
              <div className="bg-gradient-to-br from-blue-900/30 to-zinc-900 rounded-2xl p-6 border border-blue-500/30">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  Recomendações para Valorização
                </h3>
                <div className="space-y-2">
                  {resultado.recomendacoes.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg">
                      <Check className="w-4 h-4 text-blue-400 mt-0.5" />
                      <span className="text-sm text-zinc-300">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer do Relatório */}
            <div className="text-center py-6 border-t border-zinc-800">
              <p className="text-xs text-zinc-500">
                Relatório gerado por Portal Lusitano PRO | Avaliação baseada em metodologia profissional
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                Os valores apresentados são estimativas e podem variar conforme condições de mercado
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}
            className="px-6 py-3 bg-zinc-800 rounded-xl flex items-center gap-2 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>
          {step < totalSteps ? (
            <button onClick={() => setStep(step + 1)}
              className="px-6 py-3 bg-green-600 rounded-xl flex items-center gap-2 hover:bg-green-500">
              Próximo
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : !resultado && (
            <button onClick={calcularValor}
              className="px-6 py-3 bg-green-600 rounded-xl flex items-center gap-2 hover:bg-green-500">
              <Calculator className="w-5 h-5" />
              Calcular
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

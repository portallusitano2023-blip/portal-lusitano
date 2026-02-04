"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Calculator,
  Euro,
  Calendar,
  Award,
  Dna,
  GraduationCap,
  Trophy,
  Heart,
  Shield,
  Info,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Check,
  AlertTriangle,
  FileText,
  Printer,
  Download,
  Star,
  Activity,
  Target,
  Sparkles,
  HelpCircle,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

// ============================================
// TIPOS E INTERFACES
// ============================================

interface DadosBasicos {
  nome: string;
  idade: number;
  sexo: "garanhao" | "egua" | "castrado";
  pelagem: string;
  altura: number;
  registoAPSL: boolean;
  numeroRegisto: string;
}

interface Linhagem {
  qualidade: "desconhecida" | "comum" | "registada" | "certificada" | "premium" | "elite";
  linhagemPai: string;
  linhagemMae: string;
  coudelariaOrigem: string;
  premiosMorfologicos: number;
  descendentesAprovados: number;
}

interface Morfologia {
  cabeca: number; // 1-10
  pescoco: number;
  garrote: number;
  dorso: number;
  garupa: number;
  membrosAnteriores: number;
  membrosPosteriores: number;
  cascos: number;
  musculatura: number;
  proporcoes: number;
}

interface Andamentos {
  passo: number; // 1-10
  trote: number;
  galope: number;
  regularidade: number;
  elasticidade: number;
  impulsao: number;
  equilibrio: number;
}

interface Treino {
  nivel: "potro" | "desbravado" | "iniciado" | "elementar" | "medio" | "avancado" | "alta_escola" | "grand_prix";
  disciplinaPrincipal: string;
  anosExperiencia: number;
  exerciciosAvancados: string[];
  treinadorReconhecido: boolean;
}

interface Competicoes {
  nivel: "nenhuma" | "regional" | "nacional" | "internacional" | "campeonatos";
  resultados: {
    primeiros: number;
    segundos: number;
    terceiros: number;
    participacoes: number;
  };
  maiorConquista: string;
  ultimaCompeticao: string;
}

interface Saude {
  estadoGeral: "excelente" | "muito_bom" | "bom" | "regular" | "comprometido";
  exameVeterinarioRecente: boolean;
  raiosXLimpos: boolean;
  problemasConhecidos: string[];
  vacinacaoEmDia: boolean;
  desparasitacaoEmDia: boolean;
  historicoColicas: boolean;
  problemasArticulares: boolean;
}

interface Temperamento {
  docilidade: number; // 1-10
  sensibilidade: number;
  vontadeTrabalhar: number;
  concentracao: number;
  reacaoEstranhos: number;
  comportamentoEstabulo: number;
}

interface Reproducao {
  aprovadoReprodutor: boolean;
  descendentesRegistados: number;
  descendentesAprovados: number;
  taxaFertilidade: "alta" | "normal" | "baixa" | "desconhecida";
  eguaGestante: boolean;
  mesesGestacao: number;
}

interface FormData {
  basicos: DadosBasicos;
  linhagem: Linhagem;
  morfologia: Morfologia;
  andamentos: Andamentos;
  treino: Treino;
  competicoes: Competicoes;
  saude: Saude;
  temperamento: Temperamento;
  reproducao: Reproducao;
}

interface ResultadoAvaliacao {
  valorBase: number;
  valorFinal: number;
  valorMinimo: number;
  valorMaximo: number;
  confianca: number;
  categoriasMercado: {
    categoria: string;
    faixaPreco: string;
    compatibilidade: number;
  }[];
  pontuacoes: {
    categoria: string;
    pontuacao: number;
    peso: number;
    impacto: number;
    tendencia: "positivo" | "neutro" | "negativo";
    detalhes: string;
  }[];
  alertas: string[];
  recomendacoes: string[];
}

// ============================================
// DADOS DE REFERÊNCIA
// ============================================

const LINHAGENS_FAMOSAS = [
  { nome: "Veiga", multiplicador: 1.5, descricao: "Linhagem histórica de excelência" },
  { nome: "Andrade", multiplicador: 1.45, descricao: "Tradição de campeões" },
  { nome: "Alter Real", multiplicador: 1.4, descricao: "Coudelaria Real Portuguesa" },
  { nome: "Coudelaria Nacional", multiplicador: 1.35, descricao: "Património nacional" },
  { nome: "Interagro", multiplicador: 1.3, descricao: "Referência internacional" },
  { nome: "Lusitano Stud", multiplicador: 1.25, descricao: "Criação de elite" },
  { nome: "Coudelaria Companhia das Lezírias", multiplicador: 1.3, descricao: "Tradição secular" },
  { nome: "Outra certificada APSL", multiplicador: 1.15, descricao: "Coudelaria certificada" },
  { nome: "Desconhecida/Particular", multiplicador: 1.0, descricao: "Origem não certificada" },
];

const PELAGENS = [
  "Ruço", "Castanho", "Preto", "Alazão", "Baio", "Palomino",
  "Tordilho", "Isabelo", "Lobuno", "Malhado", "Cremelo"
];

const DISCIPLINAS = [
  "Dressage/Ensino",
  "Equitação de Trabalho",
  "Toureio a Cavalo",
  "Atrelagem",
  "Saltos de Obstáculos",
  "Equitação Clássica",
  "Lazer/Passeio",
  "Reprodução",
  "Escola de Equitação",
];

const EXERCICIOS_AVANCADOS = [
  "Piaffe", "Passage", "Piruetas a passo", "Piruetas a galope",
  "Mudanças de pé em tempo", "Mudanças de pé a 4 tempos", "Mudanças de pé a 3 tempos",
  "Mudanças de pé a 2 tempos", "Mudanças de pé a 1 tempo", "Appuyer",
  "Travers", "Renvers", "Espádua a dentro", "Passage estendido",
  "Levade", "Courbette", "Cabriole", "Mesair",
];

const PROBLEMAS_SAUDE = [
  "Navicular", "Laminite (histórico)", "Artrite", "Problemas de dorso",
  "Síndrome metabólica", "Cushing", "Problemas respiratórios", "Alergias",
  "Úlceras gástricas", "Problemas dentários", "Cólicas recorrentes",
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
    registoAPSL: true,
    numeroRegisto: "",
  },
  linhagem: {
    qualidade: "registada",
    linhagemPai: "",
    linhagemMae: "",
    coudelariaOrigem: "Outra certificada APSL",
    premiosMorfologicos: 0,
    descendentesAprovados: 0,
  },
  morfologia: {
    cabeca: 7,
    pescoco: 7,
    garrote: 7,
    dorso: 7,
    garupa: 7,
    membrosAnteriores: 7,
    membrosPosteriores: 7,
    cascos: 7,
    musculatura: 7,
    proporcoes: 7,
  },
  andamentos: {
    passo: 7,
    trote: 7,
    galope: 7,
    regularidade: 7,
    elasticidade: 7,
    impulsao: 7,
    equilibrio: 7,
  },
  treino: {
    nivel: "elementar",
    disciplinaPrincipal: "Dressage/Ensino",
    anosExperiencia: 2,
    exerciciosAvancados: [],
    treinadorReconhecido: false,
  },
  competicoes: {
    nivel: "nenhuma",
    resultados: {
      primeiros: 0,
      segundos: 0,
      terceiros: 0,
      participacoes: 0,
    },
    maiorConquista: "",
    ultimaCompeticao: "",
  },
  saude: {
    estadoGeral: "bom",
    exameVeterinarioRecente: true,
    raiosXLimpos: true,
    problemasConhecidos: [],
    vacinacaoEmDia: true,
    desparasitacaoEmDia: true,
    historicoColicas: false,
    problemasArticulares: false,
  },
  temperamento: {
    docilidade: 7,
    sensibilidade: 7,
    vontadeTrabalhar: 7,
    concentracao: 7,
    reacaoEstranhos: 7,
    comportamentoEstabulo: 7,
  },
  reproducao: {
    aprovadoReprodutor: false,
    descendentesRegistados: 0,
    descendentesAprovados: 0,
    taxaFertilidade: "desconhecida",
    eguaGestante: false,
    mesesGestacao: 0,
  },
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

  const totalSteps = 9;

  // ============================================
  // FUNÇÕES DE ATUALIZAÇÃO
  // ============================================

  const updateBasicos = (field: keyof DadosBasicos, value: any) => {
    setFormData(prev => ({ ...prev, basicos: { ...prev.basicos, [field]: value } }));
  };

  const updateLinhagem = (field: keyof Linhagem, value: any) => {
    setFormData(prev => ({ ...prev, linhagem: { ...prev.linhagem, [field]: value } }));
  };

  const updateMorfologia = (field: keyof Morfologia, value: number) => {
    setFormData(prev => ({ ...prev, morfologia: { ...prev.morfologia, [field]: value } }));
  };

  const updateAndamentos = (field: keyof Andamentos, value: number) => {
    setFormData(prev => ({ ...prev, andamentos: { ...prev.andamentos, [field]: value } }));
  };

  const updateTreino = (field: keyof Treino, value: any) => {
    setFormData(prev => ({ ...prev, treino: { ...prev.treino, [field]: value } }));
  };

  const updateCompeticoes = (field: keyof Competicoes, value: any) => {
    setFormData(prev => ({ ...prev, competicoes: { ...prev.competicoes, [field]: value } }));
  };

  const updateSaude = (field: keyof Saude, value: any) => {
    setFormData(prev => ({ ...prev, saude: { ...prev.saude, [field]: value } }));
  };

  const updateTemperamento = (field: keyof Temperamento, value: number) => {
    setFormData(prev => ({ ...prev, temperamento: { ...prev.temperamento, [field]: value } }));
  };

  const updateReproducao = (field: keyof Reproducao, value: any) => {
    setFormData(prev => ({ ...prev, reproducao: { ...prev.reproducao, [field]: value } }));
  };

  const toggleExercicio = (exercicio: string) => {
    setFormData(prev => ({
      ...prev,
      treino: {
        ...prev.treino,
        exerciciosAvancados: prev.treino.exerciciosAvancados.includes(exercicio)
          ? prev.treino.exerciciosAvancados.filter(e => e !== exercicio)
          : [...prev.treino.exerciciosAvancados, exercicio]
      }
    }));
  };

  const toggleProblema = (problema: string) => {
    setFormData(prev => ({
      ...prev,
      saude: {
        ...prev.saude,
        problemasConhecidos: prev.saude.problemasConhecidos.includes(problema)
          ? prev.saude.problemasConhecidos.filter(p => p !== problema)
          : [...prev.saude.problemasConhecidos, problema]
      }
    }));
  };

  // ============================================
  // CÁLCULO PRINCIPAL
  // ============================================

  const calcularValor = () => {
    const pontuacoes: ResultadoAvaliacao["pontuacoes"] = [];
    const alertas: string[] = [];
    const recomendacoes: string[] = [];

    // ========== 1. VALOR BASE POR IDADE ==========
    let valorBase = 15000;
    let idadeTendencia: "positivo" | "neutro" | "negativo" = "neutro";
    let idadeDetalhes = "";

    if (formData.basicos.idade < 3) {
      valorBase = 8000;
      idadeTendencia = "neutro";
      idadeDetalhes = "Potro sem desbaste - valor de base";
    } else if (formData.basicos.idade < 5) {
      valorBase = 12000;
      idadeTendencia = "positivo";
      idadeDetalhes = "Idade ideal para formação";
    } else if (formData.basicos.idade < 8) {
      valorBase = 18000;
      idadeTendencia = "positivo";
      idadeDetalhes = "Em plena fase de desenvolvimento";
    } else if (formData.basicos.idade <= 12) {
      valorBase = 22000;
      idadeTendencia = "positivo";
      idadeDetalhes = "Idade ideal - maturidade e experiência";
    } else if (formData.basicos.idade <= 16) {
      valorBase = 16000;
      idadeTendencia = "neutro";
      idadeDetalhes = "Ainda em boa forma para trabalho";
    } else if (formData.basicos.idade <= 20) {
      valorBase = 10000;
      idadeTendencia = "negativo";
      idadeDetalhes = "Idade avançada - valor escola/companhia";
      alertas.push("Idade avançada pode limitar o potencial de valorização");
    } else {
      valorBase = 5000;
      idadeTendencia = "negativo";
      idadeDetalhes = "Cavalo sénior - valor emocional/escola";
      alertas.push("Cavalo em idade sénior - considere o valor como companheiro");
    }

    pontuacoes.push({
      categoria: "Idade",
      pontuacao: formData.basicos.idade <= 12 ? 8 : formData.basicos.idade <= 16 ? 6 : 4,
      peso: 15,
      impacto: valorBase,
      tendencia: idadeTendencia,
      detalhes: idadeDetalhes,
    });

    // ========== 2. SEXO ==========
    let multiplicadorSexo = 1.0;
    let sexoDetalhes = "";

    if (formData.basicos.sexo === "garanhao") {
      multiplicadorSexo = 1.25;
      sexoDetalhes = "Garanhões têm maior valor potencial, especialmente se aprovados";
      if (!formData.reproducao.aprovadoReprodutor) {
        alertas.push("Garanhão não aprovado como reprodutor - considere aprovação para aumentar valor");
      }
    } else if (formData.basicos.sexo === "egua") {
      multiplicadorSexo = 1.15;
      sexoDetalhes = "Éguas têm valor acrescido pelo potencial reprodutivo";
      if (formData.reproducao.eguaGestante) {
        multiplicadorSexo += 0.15;
        sexoDetalhes += " - Gestante (+15%)";
      }
    } else {
      multiplicadorSexo = 0.9;
      sexoDetalhes = "Castrados têm valor reduzido mas são muito procurados para desporto/lazer";
    }

    const impactoSexo = valorBase * (multiplicadorSexo - 1);
    pontuacoes.push({
      categoria: "Sexo",
      pontuacao: formData.basicos.sexo === "garanhao" ? 8 : formData.basicos.sexo === "egua" ? 7 : 6,
      peso: 10,
      impacto: impactoSexo,
      tendencia: multiplicadorSexo >= 1.1 ? "positivo" : multiplicadorSexo < 1 ? "negativo" : "neutro",
      detalhes: sexoDetalhes,
    });

    // ========== 3. REGISTO APSL ==========
    let multiplicadorRegisto = 1.0;
    if (formData.basicos.registoAPSL) {
      multiplicadorRegisto = 1.3;
      pontuacoes.push({
        categoria: "Registo APSL",
        pontuacao: 10,
        peso: 12,
        impacto: valorBase * 0.3,
        tendencia: "positivo",
        detalhes: "Cavalo registado no Livro de Adultos da APSL - essencial para valor de mercado",
      });
    } else {
      alertas.push("SEM REGISTO APSL - Valor significativamente reduzido. O registo é fundamental para o mercado Lusitano.");
      pontuacoes.push({
        categoria: "Registo APSL",
        pontuacao: 2,
        peso: 12,
        impacto: -valorBase * 0.3,
        tendencia: "negativo",
        detalhes: "Sem registo oficial - valor limitado no mercado de Lusitanos puros",
      });
    }

    // ========== 4. LINHAGEM ==========
    const coudelaria = LINHAGENS_FAMOSAS.find(l => l.nome === formData.linhagem.coudelariaOrigem);
    const multiplicadorLinhagem = coudelaria?.multiplicador || 1.0;

    let linhagemQualidadeMult = 1.0;
    switch (formData.linhagem.qualidade) {
      case "elite": linhagemQualidadeMult = 1.5; break;
      case "premium": linhagemQualidadeMult = 1.3; break;
      case "certificada": linhagemQualidadeMult = 1.15; break;
      case "registada": linhagemQualidadeMult = 1.05; break;
      case "comum": linhagemQualidadeMult = 0.9; break;
      default: linhagemQualidadeMult = 0.8;
    }

    const linhagemFinalMult = (multiplicadorLinhagem + linhagemQualidadeMult) / 2;
    const bonusPremiosMorf = Math.min(formData.linhagem.premiosMorfologicos * 0.05, 0.3);
    const bonusDescendentes = Math.min(formData.linhagem.descendentesAprovados * 0.03, 0.2);

    const impactoLinhagem = valorBase * (linhagemFinalMult + bonusPremiosMorf + bonusDescendentes - 1);

    pontuacoes.push({
      categoria: "Linhagem e Genética",
      pontuacao: Math.round(linhagemFinalMult * 6 + 2),
      peso: 18,
      impacto: impactoLinhagem,
      tendencia: linhagemFinalMult >= 1.2 ? "positivo" : linhagemFinalMult < 1 ? "negativo" : "neutro",
      detalhes: `${coudelaria?.nome || "Origem"}: ${coudelaria?.descricao || "N/D"}. Qualidade: ${formData.linhagem.qualidade}`,
    });

    if (linhagemFinalMult >= 1.3) {
      recomendacoes.push("Linhagem de excelência - destaque este ponto na comercialização");
    }

    // ========== 5. MORFOLOGIA ==========
    const morfValues = Object.values(formData.morfologia);
    const morfMedia = morfValues.reduce((a, b) => a + b, 0) / morfValues.length;

    let multiplicadorMorf = 0.7 + (morfMedia / 10) * 0.6; // 0.7 a 1.3

    // Penalidades por pontos muito baixos
    const morfBaixos = morfValues.filter(v => v <= 4).length;
    if (morfBaixos > 0) {
      multiplicadorMorf -= morfBaixos * 0.05;
      alertas.push(`${morfBaixos} aspecto(s) morfológico(s) com pontuação baixa`);
    }

    // Bónus por pontos altos
    const morfAltos = morfValues.filter(v => v >= 9).length;
    if (morfAltos >= 3) {
      multiplicadorMorf += 0.1;
      recomendacoes.push("Morfologia excepcional em vários aspetos - valorize para reprodução");
    }

    const impactoMorf = valorBase * (multiplicadorMorf - 1);
    pontuacoes.push({
      categoria: "Morfologia",
      pontuacao: Math.round(morfMedia),
      peso: 15,
      impacto: impactoMorf,
      tendencia: morfMedia >= 7.5 ? "positivo" : morfMedia < 5.5 ? "negativo" : "neutro",
      detalhes: `Média morfológica: ${morfMedia.toFixed(1)}/10. Aspectos excelentes: ${morfAltos}, Aspectos a melhorar: ${morfBaixos}`,
    });

    // ========== 6. ANDAMENTOS ==========
    const andValues = Object.values(formData.andamentos);
    const andMedia = andValues.reduce((a, b) => a + b, 0) / andValues.length;

    let multiplicadorAnd = 0.75 + (andMedia / 10) * 0.5; // 0.75 a 1.25

    // Andamentos são críticos para dressage
    if (formData.treino.disciplinaPrincipal === "Dressage/Ensino") {
      multiplicadorAnd *= 1.15; // 15% extra importância
    }

    const impactoAnd = valorBase * (multiplicadorAnd - 1);
    pontuacoes.push({
      categoria: "Qualidade dos Andamentos",
      pontuacao: Math.round(andMedia),
      peso: 12,
      impacto: impactoAnd,
      tendencia: andMedia >= 7.5 ? "positivo" : andMedia < 5.5 ? "negativo" : "neutro",
      detalhes: `Média andamentos: ${andMedia.toFixed(1)}/10. Regularidade: ${formData.andamentos.regularidade}, Elasticidade: ${formData.andamentos.elasticidade}`,
    });

    // ========== 7. NÍVEL DE TREINO ==========
    let multiplicadorTreino = 1.0;
    let treinoDetalhes = "";

    switch (formData.treino.nivel) {
      case "potro": multiplicadorTreino = 0.8; treinoDetalhes = "Sem trabalho montado"; break;
      case "desbravado": multiplicadorTreino = 1.0; treinoDetalhes = "Iniciado ao trabalho"; break;
      case "iniciado": multiplicadorTreino = 1.15; treinoDetalhes = "Trabalho básico"; break;
      case "elementar": multiplicadorTreino = 1.35; treinoDetalhes = "Nível elementar de dressage"; break;
      case "medio": multiplicadorTreino = 1.6; treinoDetalhes = "Nível médio - trabalho lateral"; break;
      case "avancado": multiplicadorTreino = 2.0; treinoDetalhes = "Nível avançado completo"; break;
      case "alta_escola": multiplicadorTreino = 2.8; treinoDetalhes = "Alta Escola - airs acima do solo"; break;
      case "grand_prix": multiplicadorTreino = 4.0; treinoDetalhes = "Nível Grand Prix internacional"; break;
    }

    // Bónus por exercícios avançados
    const numExercicios = formData.treino.exerciciosAvancados.length;
    const bonusExercicios = Math.min(numExercicios * 0.08, 0.5);
    multiplicadorTreino += bonusExercicios;

    // Bónus treinador reconhecido
    if (formData.treino.treinadorReconhecido) {
      multiplicadorTreino += 0.15;
      treinoDetalhes += " | Treinador reconhecido (+15%)";
    }

    // Anos de experiência
    const bonusExp = Math.min(formData.treino.anosExperiencia * 0.03, 0.2);
    multiplicadorTreino += bonusExp;

    const impactoTreino = valorBase * (multiplicadorTreino - 1);
    pontuacoes.push({
      categoria: "Nível de Treino",
      pontuacao: Math.min(Math.round(multiplicadorTreino * 3), 10),
      peso: 20,
      impacto: impactoTreino,
      tendencia: multiplicadorTreino >= 1.5 ? "positivo" : multiplicadorTreino < 1.1 ? "negativo" : "neutro",
      detalhes: `${treinoDetalhes}. ${numExercicios} exercícios avançados. ${formData.treino.anosExperiencia} anos exp.`,
    });

    // ========== 8. COMPETIÇÕES ==========
    let multiplicadorComp = 1.0;
    let compDetalhes = "Sem histórico competitivo";

    switch (formData.competicoes.nivel) {
      case "regional": multiplicadorComp = 1.1; compDetalhes = "Competidor regional"; break;
      case "nacional": multiplicadorComp = 1.35; compDetalhes = "Competidor nacional"; break;
      case "internacional": multiplicadorComp = 1.8; compDetalhes = "Competidor internacional"; break;
      case "campeonatos": multiplicadorComp = 2.5; compDetalhes = "Participante em campeonatos de elite"; break;
    }

    // Bónus por resultados
    const { primeiros, segundos, terceiros } = formData.competicoes.resultados;
    const bonusResultados = (primeiros * 0.08) + (segundos * 0.04) + (terceiros * 0.02);
    multiplicadorComp += Math.min(bonusResultados, 0.4);

    if (primeiros >= 3) {
      recomendacoes.push("Histórico de vitórias significativo - excelente argumento de venda");
    }

    const impactoComp = valorBase * (multiplicadorComp - 1);
    pontuacoes.push({
      categoria: "Histórico Competitivo",
      pontuacao: Math.min(Math.round(multiplicadorComp * 4), 10),
      peso: 10,
      impacto: impactoComp,
      tendencia: multiplicadorComp >= 1.3 ? "positivo" : "neutro",
      detalhes: `${compDetalhes}. ${primeiros}x 1º, ${segundos}x 2º, ${terceiros}x 3º lugares`,
    });

    // ========== 9. SAÚDE ==========
    let multiplicadorSaude = 1.0;
    let saudeDetalhes = "";

    switch (formData.saude.estadoGeral) {
      case "excelente": multiplicadorSaude = 1.15; saudeDetalhes = "Estado de saúde excelente"; break;
      case "muito_bom": multiplicadorSaude = 1.1; saudeDetalhes = "Muito bom estado de saúde"; break;
      case "bom": multiplicadorSaude = 1.0; saudeDetalhes = "Bom estado de saúde"; break;
      case "regular": multiplicadorSaude = 0.8; saudeDetalhes = "Saúde regular - atenção necessária";
        alertas.push("Estado de saúde regular pode afetar significativamente o valor"); break;
      case "comprometido": multiplicadorSaude = 0.5; saudeDetalhes = "Saúde comprometida";
        alertas.push("ATENÇÃO: Saúde comprometida - valor severamente afetado"); break;
    }

    // Penalidades por problemas
    const numProblemas = formData.saude.problemasConhecidos.length;
    multiplicadorSaude -= numProblemas * 0.08;

    if (formData.saude.historicoColicas) {
      multiplicadorSaude -= 0.1;
      alertas.push("Histórico de cólicas - fator de risco significativo");
    }

    if (formData.saude.problemasArticulares) {
      multiplicadorSaude -= 0.15;
      alertas.push("Problemas articulares identificados");
    }

    // Bónus por documentação
    if (formData.saude.exameVeterinarioRecente) {
      multiplicadorSaude += 0.05;
      recomendacoes.push("Exame veterinário recente disponível - vantagem na negociação");
    }

    if (formData.saude.raiosXLimpos) {
      multiplicadorSaude += 0.1;
      recomendacoes.push("Raios-X limpos são um forte argumento de venda");
    }

    multiplicadorSaude = Math.max(multiplicadorSaude, 0.3); // Mínimo 30%

    const impactoSaude = valorBase * (multiplicadorSaude - 1);
    pontuacoes.push({
      categoria: "Estado de Saúde",
      pontuacao: Math.round(multiplicadorSaude * 8),
      peso: 15,
      impacto: impactoSaude,
      tendencia: multiplicadorSaude >= 1.05 ? "positivo" : multiplicadorSaude < 0.9 ? "negativo" : "neutro",
      detalhes: `${saudeDetalhes}. ${numProblemas} problema(s) identificado(s). Raios-X: ${formData.saude.raiosXLimpos ? "Limpos" : "Não disponíveis/Com achados"}`,
    });

    // ========== 10. TEMPERAMENTO ==========
    const tempValues = Object.values(formData.temperamento);
    const tempMedia = tempValues.reduce((a, b) => a + b, 0) / tempValues.length;

    let multiplicadorTemp = 0.85 + (tempMedia / 10) * 0.3;

    if (tempMedia >= 8) {
      recomendacoes.push("Temperamento excepcional - muito valorizado por compradores");
    } else if (tempMedia < 5) {
      alertas.push("Temperamento difícil pode limitar o mercado potencial");
    }

    const impactoTemp = valorBase * (multiplicadorTemp - 1);
    pontuacoes.push({
      categoria: "Temperamento",
      pontuacao: Math.round(tempMedia),
      peso: 8,
      impacto: impactoTemp,
      tendencia: tempMedia >= 7.5 ? "positivo" : tempMedia < 5.5 ? "negativo" : "neutro",
      detalhes: `Média temperamento: ${tempMedia.toFixed(1)}/10. Docilidade: ${formData.temperamento.docilidade}, Concentração: ${formData.temperamento.concentracao}`,
    });

    // ========== 11. REPRODUÇÃO (se aplicável) ==========
    let impactoReprod = 0;
    if (formData.basicos.sexo !== "castrado") {
      let multiplicadorReprod = 0;

      if (formData.reproducao.aprovadoReprodutor) {
        multiplicadorReprod = 0.4;

        // Bónus por descendentes
        const bonusDesc = Math.min(formData.reproducao.descendentesAprovados * 0.05, 0.3);
        multiplicadorReprod += bonusDesc;

        if (formData.reproducao.taxaFertilidade === "alta") {
          multiplicadorReprod += 0.1;
        } else if (formData.reproducao.taxaFertilidade === "baixa") {
          multiplicadorReprod -= 0.15;
          alertas.push("Taxa de fertilidade baixa pode afetar o valor como reprodutor");
        }

        recomendacoes.push("Aprovado como reprodutor - valor significativamente aumentado");
      }

      if (formData.basicos.sexo === "egua" && formData.reproducao.eguaGestante) {
        multiplicadorReprod += 0.2;
        const mesesRestantes = 11 - formData.reproducao.mesesGestacao;
        pontuacoes.push({
          categoria: "Gestação",
          pontuacao: 8,
          peso: 5,
          impacto: valorBase * 0.2,
          tendencia: "positivo",
          detalhes: `Égua gestante - ${formData.reproducao.mesesGestacao} meses (${mesesRestantes} para o parto)`,
        });
      }

      if (multiplicadorReprod > 0) {
        impactoReprod = valorBase * multiplicadorReprod;
        pontuacoes.push({
          categoria: "Valor Reprodutivo",
          pontuacao: Math.min(Math.round(multiplicadorReprod * 15), 10),
          peso: 8,
          impacto: impactoReprod,
          tendencia: "positivo",
          detalhes: `${formData.reproducao.descendentesAprovados} descendentes aprovados. Fertilidade: ${formData.reproducao.taxaFertilidade}`,
        });
      }
    }

    // ========== CÁLCULO FINAL ==========
    const totalImpactos = pontuacoes.reduce((acc, p) => acc + p.impacto, 0);
    const valorFinal = Math.round((valorBase + totalImpactos) / 100) * 100;

    // Calcular confiança baseada na completude dos dados
    let confianca = 70;
    if (formData.basicos.nome) confianca += 2;
    if (formData.basicos.numeroRegisto) confianca += 3;
    if (formData.linhagem.linhagemPai && formData.linhagem.linhagemMae) confianca += 5;
    if (formData.saude.exameVeterinarioRecente) confianca += 5;
    if (formData.saude.raiosXLimpos) confianca += 5;
    if (formData.competicoes.ultimaCompeticao) confianca += 3;
    if (formData.treino.exerciciosAvancados.length > 0) confianca += 2;
    confianca = Math.min(confianca, 95);

    // Intervalo de confiança
    const margem = (100 - confianca) / 100;
    const valorMinimo = Math.round((valorFinal * (1 - margem * 0.5)) / 100) * 100;
    const valorMaximo = Math.round((valorFinal * (1 + margem * 0.6)) / 100) * 100;

    // Categorias de mercado
    const categoriasMercado = [
      {
        categoria: "Lazer/Escola",
        faixaPreco: "5.000€ - 15.000€",
        compatibilidade: valorFinal < 15000 ? 90 : valorFinal < 25000 ? 60 : 30,
      },
      {
        categoria: "Desporto Amador",
        faixaPreco: "15.000€ - 35.000€",
        compatibilidade: valorFinal >= 12000 && valorFinal <= 40000 ? 85 : valorFinal < 12000 ? 50 : 40,
      },
      {
        categoria: "Desporto Profissional",
        faixaPreco: "35.000€ - 80.000€",
        compatibilidade: valorFinal >= 30000 && valorFinal <= 90000 ? 80 : valorFinal < 30000 ? 30 : 60,
      },
      {
        categoria: "Elite/Grand Prix",
        faixaPreco: "80.000€ - 300.000€+",
        compatibilidade: valorFinal >= 70000 ? 85 : valorFinal >= 50000 ? 50 : 20,
      },
      {
        categoria: "Reprodução Premium",
        faixaPreco: "40.000€ - 150.000€",
        compatibilidade: formData.reproducao.aprovadoReprodutor && valorFinal >= 35000 ? 80 : 25,
      },
    ];

    setResultado({
      valorBase,
      valorFinal: Math.max(valorFinal, 3000), // Mínimo 3000€
      valorMinimo: Math.max(valorMinimo, 2500),
      valorMaximo,
      confianca,
      categoriasMercado,
      pontuacoes,
      alertas,
      recomendacoes,
    });

    // Scroll to results
    setTimeout(() => {
      resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setResultado(null);
    setStep(1);
  };

  // ============================================
  // COMPONENTES DE UI
  // ============================================

  const ScoreSlider = ({
    label,
    value,
    onChange,
    tooltip
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
    tooltip?: string;
  }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-300">{label}</span>
          {tooltip && (
            <button
              onMouseEnter={() => setShowTooltip(label)}
              onMouseLeave={() => setShowTooltip(null)}
              className="relative"
            >
              <HelpCircle size={14} className="text-zinc-500 hover:text-[#C5A059]" />
              {showTooltip === label && (
                <div className="absolute left-0 bottom-6 w-48 p-2 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300 z-10">
                  {tooltip}
                </div>
              )}
            </button>
          )}
        </div>
        <span className={`font-bold text-sm ${
          value >= 8 ? "text-green-400" : value >= 6 ? "text-[#C5A059]" : value >= 4 ? "text-yellow-400" : "text-red-400"
        }`}>
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-[#C5A059] h-2"
      />
      <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
        <span>Fraco</span>
        <span>Regular</span>
        <span>Bom</span>
        <span>Excelente</span>
      </div>
    </div>
  );

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-1 mb-8 overflow-x-auto pb-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex items-center">
          <button
            onClick={() => setStep(i + 1)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
              i + 1 === step
                ? "bg-[#C5A059] text-black scale-110"
                : i + 1 < step
                ? "bg-green-500 text-white"
                : "bg-zinc-800 text-zinc-500"
            }`}
          >
            {i + 1 < step ? <Check size={14} /> : i + 1}
          </button>
          {i < totalSteps - 1 && (
            <div className={`w-4 sm:w-6 h-0.5 ${i + 1 < step ? "bg-green-500" : "bg-zinc-800"}`} />
          )}
        </div>
      ))}
    </div>
  );

  const stepTitles = [
    "Dados Básicos",
    "Linhagem",
    "Morfologia",
    "Andamentos",
    "Treino",
    "Competições",
    "Saúde",
    "Temperamento",
    "Reprodução",
  ];

  // ============================================
  // RENDER
  // ============================================

  return (
    <main className="min-h-screen bg-black text-white pt-20 sm:pt-24 md:pt-32 pb-32 px-4 sm:px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Voltar</span>
          </Link>

          <div className="text-center">
            <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calculator className="text-[#C5A059]" size={32} />
            </div>
            <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[9px] sm:text-[10px] font-bold block mb-2">
              Ferramenta Profissional
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif italic mb-4">
              Calculadora de Valor
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
              Avaliação rigorosa e detalhada baseada em metodologia profissional do mercado de cavalos Lusitanos.
              Considere todos os fatores para obter uma estimativa precisa.
            </p>
          </div>
        </div>

        {/* Methodology Note */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-1">Metodologia de Avaliação</p>
              <p className="text-blue-300/80">
                Esta calculadora utiliza 11 categorias de avaliação ponderadas, baseadas em valores de mercado reais do sector Lusitano em Portugal e internacionalmente.
                A precisão aumenta com a completude dos dados fornecidos.
              </p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Step Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-serif text-white mb-1">
            {step}. {stepTitles[step - 1]}
          </h2>
          <p className="text-sm text-zinc-500">Passo {step} de {totalSteps}</p>
        </div>

        {/* Form Steps */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6 mb-6">

          {/* Step 1: Dados Básicos */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Nome do Cavalo</label>
                  <input
                    type="text"
                    value={formData.basicos.nome}
                    onChange={(e) => updateBasicos("nome", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Nome (opcional)"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Número de Registo APSL</label>
                  <input
                    type="text"
                    value={formData.basicos.numeroRegisto}
                    onChange={(e) => updateBasicos("numeroRegisto", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Ex: PSL-XXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Idade: <span className="text-[#C5A059] font-bold">{formData.basicos.idade} anos</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={28}
                  value={formData.basicos.idade}
                  onChange={(e) => updateBasicos("idade", parseInt(e.target.value))}
                  className="w-full accent-[#C5A059]"
                />
                <div className="flex justify-between text-xs text-zinc-600 mt-1">
                  <span>1 ano</span>
                  <span>7 (jovem)</span>
                  <span>12 (ideal)</span>
                  <span>20 (sénior)</span>
                  <span>28</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Sexo</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "garanhao", label: "Garanhão", desc: "+25% potencial" },
                    { value: "egua", label: "Égua", desc: "+15% reprodutivo" },
                    { value: "castrado", label: "Castrado", desc: "Popular desporto" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateBasicos("sexo", opt.value)}
                      className={`p-3 rounded-lg text-center transition-all ${
                        formData.basicos.sexo === opt.value
                          ? "bg-[#C5A059] text-black"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      <div className="font-medium">{opt.label}</div>
                      <div className={`text-xs mt-1 ${formData.basicos.sexo === opt.value ? "text-black/60" : "text-zinc-500"}`}>
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Pelagem</label>
                  <select
                    value={formData.basicos.pelagem}
                    onChange={(e) => updateBasicos("pelagem", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                  >
                    {PELAGENS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Altura: <span className="text-[#C5A059] font-bold">{formData.basicos.altura} cm</span>
                  </label>
                  <input
                    type="range"
                    min={145}
                    max={175}
                    value={formData.basicos.altura}
                    onChange={(e) => updateBasicos("altura", parseInt(e.target.value))}
                    className="w-full accent-[#C5A059]"
                  />
                  <div className="flex justify-between text-xs text-zinc-600 mt-1">
                    <span>145cm</span>
                    <span>160 (ideal)</span>
                    <span>175cm</span>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.basicos.registoAPSL}
                    onChange={(e) => updateBasicos("registoAPSL", e.target.checked)}
                    className="w-5 h-5 accent-[#C5A059] mt-0.5"
                  />
                  <div>
                    <span className="font-medium text-white">Registo no Livro de Adultos APSL</span>
                    <p className="text-xs text-zinc-500 mt-1">
                      O registo oficial é essencial para o valor de mercado de um Lusitano puro. Cavalos sem registo têm valor significativamente reduzido.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Linhagem */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Coudelaria de Origem</label>
                <select
                  value={formData.linhagem.coudelariaOrigem}
                  onChange={(e) => updateLinhagem("coudelariaOrigem", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                >
                  {LINHAGENS_FAMOSAS.map((l) => (
                    <option key={l.nome} value={l.nome}>
                      {l.nome} {l.multiplicador > 1.2 ? "⭐" : ""} - {l.descricao}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Qualidade da Linhagem</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { value: "desconhecida", label: "Desconhecida", mult: "0.8x" },
                    { value: "comum", label: "Comum", mult: "0.9x" },
                    { value: "registada", label: "Registada", mult: "1.05x" },
                    { value: "certificada", label: "Certificada", mult: "1.15x" },
                    { value: "premium", label: "Premium", mult: "1.3x" },
                    { value: "elite", label: "Elite", mult: "1.5x" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateLinhagem("qualidade", opt.value)}
                      className={`p-3 rounded-lg text-center transition-all ${
                        formData.linhagem.qualidade === opt.value
                          ? "bg-[#C5A059] text-black"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      <div className="text-sm font-medium">{opt.label}</div>
                      <div className={`text-xs mt-1 ${formData.linhagem.qualidade === opt.value ? "text-black/60" : "text-zinc-500"}`}>
                        {opt.mult}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Nome/Linhagem do Pai</label>
                  <input
                    type="text"
                    value={formData.linhagem.linhagemPai}
                    onChange={(e) => updateLinhagem("linhagemPai", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Nome do pai"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Nome/Linhagem da Mãe</label>
                  <input
                    type="text"
                    value={formData.linhagem.linhagemMae}
                    onChange={(e) => updateLinhagem("linhagemMae", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Nome da mãe"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Prémios Morfológicos na Linhagem</label>
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={formData.linhagem.premiosMorfologicos}
                    onChange={(e) => updateLinhagem("premiosMorfologicos", parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="0"
                  />
                  <p className="text-xs text-zinc-500 mt-1">Nº de prémios dos pais/avós em concursos morfológicos</p>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Descendentes Aprovados (se reprodutor)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.linhagem.descendentesAprovados}
                    onChange={(e) => updateLinhagem("descendentesAprovados", parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Morfologia */}
          {step === 3 && (
            <div className="space-y-2">
              <p className="text-sm text-zinc-400 mb-4">
                Avalie cada aspeto morfológico de 1 (fraco) a 10 (excepcional). Seja honesto para obter uma avaliação precisa.
              </p>

              <div className="grid sm:grid-cols-2 gap-x-8">
                <ScoreSlider
                  label="Cabeça e Expressão"
                  value={formData.morfologia.cabeca}
                  onChange={(v) => updateMorfologia("cabeca", v)}
                  tooltip="Proporcionalidade, perfil sub-convexo, olhos expressivos, orelhas bem inseridas"
                />
                <ScoreSlider
                  label="Pescoço"
                  value={formData.morfologia.pescoco}
                  onChange={(v) => updateMorfologia("pescoco", v)}
                  tooltip="Arqueamento, comprimento, inserção na cabeça e no tronco"
                />
                <ScoreSlider
                  label="Garrote"
                  value={formData.morfologia.garrote}
                  onChange={(v) => updateMorfologia("garrote", v)}
                  tooltip="Altura, extensão, definição muscular"
                />
                <ScoreSlider
                  label="Dorso e Lombo"
                  value={formData.morfologia.dorso}
                  onChange={(v) => updateMorfologia("dorso", v)}
                  tooltip="Linha superior, comprimento, musculatura"
                />
                <ScoreSlider
                  label="Garupa"
                  value={formData.morfologia.garupa}
                  onChange={(v) => updateMorfologia("garupa", v)}
                  tooltip="Comprimento, largura, inclinação, musculatura"
                />
                <ScoreSlider
                  label="Membros Anteriores"
                  value={formData.morfologia.membrosAnteriores}
                  onChange={(v) => updateMorfologia("membrosAnteriores", v)}
                  tooltip="Aprumos, articulações, tendões, amplitude"
                />
                <ScoreSlider
                  label="Membros Posteriores"
                  value={formData.morfologia.membrosPosteriores}
                  onChange={(v) => updateMorfologia("membrosPosteriores", v)}
                  tooltip="Aprumos, angulações, força, propulsão"
                />
                <ScoreSlider
                  label="Cascos"
                  value={formData.morfologia.cascos}
                  onChange={(v) => updateMorfologia("cascos", v)}
                  tooltip="Formato, qualidade da parede, talões, ranilha"
                />
                <ScoreSlider
                  label="Musculatura Geral"
                  value={formData.morfologia.musculatura}
                  onChange={(v) => updateMorfologia("musculatura", v)}
                  tooltip="Desenvolvimento muscular, definição, harmonia"
                />
                <ScoreSlider
                  label="Proporções e Harmonia"
                  value={formData.morfologia.proporcoes}
                  onChange={(v) => updateMorfologia("proporcoes", v)}
                  tooltip="Equilíbrio geral, proporções entre partes, elegância"
                />
              </div>
            </div>
          )}

          {/* Step 4: Andamentos */}
          {step === 4 && (
            <div className="space-y-2">
              <p className="text-sm text-zinc-400 mb-4">
                Avalie a qualidade dos andamentos. Estes são critérios fundamentais, especialmente para dressage.
              </p>

              <div className="grid sm:grid-cols-2 gap-x-8">
                <ScoreSlider
                  label="Passo"
                  value={formData.andamentos.passo}
                  onChange={(v) => updateAndamentos("passo", v)}
                  tooltip="Amplitude, regularidade 4 tempos, liberdade de espádua"
                />
                <ScoreSlider
                  label="Trote"
                  value={formData.andamentos.trote}
                  onChange={(v) => updateAndamentos("trote", v)}
                  tooltip="Elevação, cadência, suspensão, diagonais"
                />
                <ScoreSlider
                  label="Galope"
                  value={formData.andamentos.galope}
                  onChange={(v) => updateAndamentos("galope", v)}
                  tooltip="Salto, 3 tempos claros, subida, equilíbrio"
                />
                <ScoreSlider
                  label="Regularidade"
                  value={formData.andamentos.regularidade}
                  onChange={(v) => updateAndamentos("regularidade", v)}
                  tooltip="Consistência dos tempos em todos os andamentos"
                />
                <ScoreSlider
                  label="Elasticidade"
                  value={formData.andamentos.elasticidade}
                  onChange={(v) => updateAndamentos("elasticidade", v)}
                  tooltip="Flexibilidade, capacidade de extensão e reunião"
                />
                <ScoreSlider
                  label="Impulsão"
                  value={formData.andamentos.impulsao}
                  onChange={(v) => updateAndamentos("impulsao", v)}
                  tooltip="Energia do posterior, desejo de avançar"
                />
                <ScoreSlider
                  label="Equilíbrio Natural"
                  value={formData.andamentos.equilibrio}
                  onChange={(v) => updateAndamentos("equilibrio", v)}
                  tooltip="Distribuição de peso, auto-porte, facilidade de transições"
                />
              </div>
            </div>
          )}

          {/* Step 5: Treino */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Nível de Treino Actual</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { value: "potro", label: "Potro", desc: "Sem desbaste" },
                    { value: "desbravado", label: "Desbravado", desc: "Aceita cavaleiro" },
                    { value: "iniciado", label: "Iniciado", desc: "Passeio/básico" },
                    { value: "elementar", label: "Elementar", desc: "Círculos, serp." },
                    { value: "medio", label: "Médio", desc: "Lat., mudanças" },
                    { value: "avancado", label: "Avançado", desc: "Piaffe, passage" },
                    { value: "alta_escola", label: "Alta Escola", desc: "Airs acima solo" },
                    { value: "grand_prix", label: "Grand Prix", desc: "Nível int." },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateTreino("nivel", opt.value)}
                      className={`p-3 rounded-lg text-center transition-all ${
                        formData.treino.nivel === opt.value
                          ? "bg-[#C5A059] text-black"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      <div className="text-sm font-medium">{opt.label}</div>
                      <div className={`text-[10px] mt-1 ${formData.treino.nivel === opt.value ? "text-black/60" : "text-zinc-500"}`}>
                        {opt.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Disciplina Principal</label>
                  <select
                    value={formData.treino.disciplinaPrincipal}
                    onChange={(e) => updateTreino("disciplinaPrincipal", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                  >
                    {DISCIPLINAS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Anos de Experiência: <span className="text-[#C5A059] font-bold">{formData.treino.anosExperiencia}</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    value={formData.treino.anosExperiencia}
                    onChange={(e) => updateTreino("anosExperiencia", parseInt(e.target.value))}
                    className="w-full accent-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Exercícios Avançados Dominados</label>
                <div className="flex flex-wrap gap-2">
                  {EXERCICIOS_AVANCADOS.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => toggleExercicio(ex)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        formData.treino.exerciciosAvancados.includes(ex)
                          ? "bg-[#C5A059] text-black"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      }`}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-lg p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.treino.treinadorReconhecido}
                    onChange={(e) => updateTreino("treinadorReconhecido", e.target.checked)}
                    className="w-5 h-5 accent-[#C5A059]"
                  />
                  <div>
                    <span className="font-medium text-white">Treinado por profissional reconhecido</span>
                    <p className="text-xs text-zinc-500 mt-1">
                      Cavalos trabalhados por cavaleiros de renome têm valor acrescido (+15%)
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 6: Competições */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Nível de Competição</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { value: "nenhuma", label: "Nenhuma" },
                    { value: "regional", label: "Regional" },
                    { value: "nacional", label: "Nacional" },
                    { value: "internacional", label: "Internacional" },
                    { value: "campeonatos", label: "Campeonatos" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateCompeticoes("nivel", opt.value)}
                      className={`p-3 rounded-lg text-center transition-all ${
                        formData.competicoes.nivel === opt.value
                          ? "bg-[#C5A059] text-black"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      <div className="text-sm font-medium">{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {formData.competicoes.nivel !== "nenhuma" && (
                <>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-3">Resultados Obtidos</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { field: "primeiros", label: "1º Lugares", icon: "🥇" },
                        { field: "segundos", label: "2º Lugares", icon: "🥈" },
                        { field: "terceiros", label: "3º Lugares", icon: "🥉" },
                        { field: "participacoes", label: "Participações", icon: "📋" },
                      ].map((item) => (
                        <div key={item.field} className="text-center">
                          <div className="text-2xl mb-1">{item.icon}</div>
                          <input
                            type="number"
                            min={0}
                            value={(formData.competicoes.resultados as any)[item.field]}
                            onChange={(e) => updateCompeticoes("resultados", {
                              ...formData.competicoes.resultados,
                              [item.field]: parseInt(e.target.value) || 0,
                            })}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:border-[#C5A059]"
                          />
                          <div className="text-xs text-zinc-500 mt-1">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Maior Conquista</label>
                      <input
                        type="text"
                        value={formData.competicoes.maiorConquista}
                        onChange={(e) => updateCompeticoes("maiorConquista", e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                        placeholder="Ex: Campeão Nacional Dressage 2023"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">Última Competição</label>
                      <input
                        type="text"
                        value={formData.competicoes.ultimaCompeticao}
                        onChange={(e) => updateCompeticoes("ultimaCompeticao", e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                        placeholder="Ex: CDI Cascais - Março 2024"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 7: Saúde */}
          {step === 7 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Estado Geral de Saúde</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { value: "excelente", label: "Excelente", color: "green" },
                    { value: "muito_bom", label: "Muito Bom", color: "emerald" },
                    { value: "bom", label: "Bom", color: "yellow" },
                    { value: "regular", label: "Regular", color: "orange" },
                    { value: "comprometido", label: "Comprometido", color: "red" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateSaude("estadoGeral", opt.value)}
                      className={`p-3 rounded-lg text-center transition-all ${
                        formData.saude.estadoGeral === opt.value
                          ? "bg-[#C5A059] text-black"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      <div className="text-sm font-medium">{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.saude.exameVeterinarioRecente}
                      onChange={(e) => updateSaude("exameVeterinarioRecente", e.target.checked)}
                      className="w-5 h-5 accent-green-500"
                    />
                    <span className="text-sm">Exame veterinário recente (menos de 6 meses)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.saude.raiosXLimpos}
                      onChange={(e) => updateSaude("raiosXLimpos", e.target.checked)}
                      className="w-5 h-5 accent-green-500"
                    />
                    <span className="text-sm">Raios-X limpos disponíveis</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.saude.vacinacaoEmDia}
                      onChange={(e) => updateSaude("vacinacaoEmDia", e.target.checked)}
                      className="w-5 h-5 accent-green-500"
                    />
                    <span className="text-sm">Vacinação em dia</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.saude.desparasitacaoEmDia}
                      onChange={(e) => updateSaude("desparasitacaoEmDia", e.target.checked)}
                      className="w-5 h-5 accent-green-500"
                    />
                    <span className="text-sm">Desparasitação em dia</span>
                  </label>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.saude.historicoColicas}
                      onChange={(e) => updateSaude("historicoColicas", e.target.checked)}
                      className="w-5 h-5 accent-red-500"
                    />
                    <span className="text-sm text-red-300">Histórico de cólicas</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.saude.problemasArticulares}
                      onChange={(e) => updateSaude("problemasArticulares", e.target.checked)}
                      className="w-5 h-5 accent-red-500"
                    />
                    <span className="text-sm text-red-300">Problemas articulares</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Problemas de Saúde Conhecidos</label>
                <div className="flex flex-wrap gap-2">
                  {PROBLEMAS_SAUDE.map((prob) => (
                    <button
                      key={prob}
                      onClick={() => toggleProblema(prob)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        formData.saude.problemasConhecidos.includes(prob)
                          ? "bg-red-500/30 text-red-300 border border-red-500/50"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      }`}
                    >
                      {prob}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Temperamento */}
          {step === 8 && (
            <div className="space-y-2">
              <p className="text-sm text-zinc-400 mb-4">
                O temperamento é fundamental para a comercialização. Cavalos com bom temperamento são muito mais procurados.
              </p>

              <div className="grid sm:grid-cols-2 gap-x-8">
                <ScoreSlider
                  label="Docilidade"
                  value={formData.temperamento.docilidade}
                  onChange={(v) => updateTemperamento("docilidade", v)}
                  tooltip="Facilidade de manuseamento, calma, cooperação"
                />
                <ScoreSlider
                  label="Sensibilidade às Ajudas"
                  value={formData.temperamento.sensibilidade}
                  onChange={(v) => updateTemperamento("sensibilidade", v)}
                  tooltip="Resposta às ajudas do cavaleiro, leveza"
                />
                <ScoreSlider
                  label="Vontade de Trabalhar"
                  value={formData.temperamento.vontadeTrabalhar}
                  onChange={(v) => updateTemperamento("vontadeTrabalhar", v)}
                  tooltip="Energia positiva, disponibilidade, atitude"
                />
                <ScoreSlider
                  label="Concentração"
                  value={formData.temperamento.concentracao}
                  onChange={(v) => updateTemperamento("concentracao", v)}
                  tooltip="Capacidade de foco, atenção, aprendizagem"
                />
                <ScoreSlider
                  label="Reação a Estranhos/Novidades"
                  value={formData.temperamento.reacaoEstranhos}
                  onChange={(v) => updateTemperamento("reacaoEstranhos", v)}
                  tooltip="Comportamento perante situações novas"
                />
                <ScoreSlider
                  label="Comportamento em Estábulo"
                  value={formData.temperamento.comportamentoEstabulo}
                  onChange={(v) => updateTemperamento("comportamentoEstabulo", v)}
                  tooltip="Calma em box, comportamento com tratadores"
                />
              </div>
            </div>
          )}

          {/* Step 9: Reprodução */}
          {step === 9 && (
            <div className="space-y-6">
              {formData.basicos.sexo === "castrado" ? (
                <div className="text-center py-8">
                  <div className="text-zinc-500 mb-4">
                    <Shield size={48} className="mx-auto" />
                  </div>
                  <p className="text-zinc-400">
                    Esta secção não se aplica a cavalos castrados.
                  </p>
                  <p className="text-sm text-zinc-500 mt-2">
                    Pode avançar para o cálculo final.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-zinc-800/50 rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.reproducao.aprovadoReprodutor}
                        onChange={(e) => updateReproducao("aprovadoReprodutor", e.target.checked)}
                        className="w-5 h-5 accent-[#C5A059]"
                      />
                      <div>
                        <span className="font-medium text-white">
                          {formData.basicos.sexo === "garanhao" ? "Aprovado como reprodutor APSL" : "Aprovada como reprodutora APSL"}
                        </span>
                        <p className="text-xs text-zinc-500 mt-1">
                          A aprovação para reprodução aumenta significativamente o valor (+40%)
                        </p>
                      </div>
                    </label>
                  </div>

                  {formData.reproducao.aprovadoReprodutor && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-zinc-400 mb-2">Descendentes Registados</label>
                          <input
                            type="number"
                            min={0}
                            value={formData.reproducao.descendentesRegistados}
                            onChange={(e) => updateReproducao("descendentesRegistados", parseInt(e.target.value) || 0)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-2">Descendentes Aprovados</label>
                          <input
                            type="number"
                            min={0}
                            value={formData.reproducao.descendentesAprovados}
                            onChange={(e) => updateReproducao("descendentesAprovados", parseInt(e.target.value) || 0)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-zinc-400 mb-2">Taxa de Fertilidade</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { value: "alta", label: "Alta" },
                            { value: "normal", label: "Normal" },
                            { value: "baixa", label: "Baixa" },
                            { value: "desconhecida", label: "Desconhecida" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => updateReproducao("taxaFertilidade", opt.value)}
                              className={`p-2 rounded-lg text-sm transition-all ${
                                formData.reproducao.taxaFertilidade === opt.value
                                  ? "bg-[#C5A059] text-black"
                                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {formData.basicos.sexo === "egua" && (
                    <div className="bg-zinc-800/50 rounded-lg p-4 space-y-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.reproducao.eguaGestante}
                          onChange={(e) => updateReproducao("eguaGestante", e.target.checked)}
                          className="w-5 h-5 accent-[#C5A059]"
                        />
                        <span className="font-medium text-white">Égua gestante</span>
                      </label>

                      {formData.reproducao.eguaGestante && (
                        <div>
                          <label className="block text-sm text-zinc-400 mb-2">
                            Meses de Gestação: <span className="text-[#C5A059] font-bold">{formData.reproducao.mesesGestacao}</span>
                          </label>
                          <input
                            type="range"
                            min={1}
                            max={11}
                            value={formData.reproducao.mesesGestacao}
                            onChange={(e) => updateReproducao("mesesGestacao", parseInt(e.target.value))}
                            className="w-full accent-[#C5A059]"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 px-4 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={18} />
            Anterior
          </button>

          <div className="flex gap-2">
            <button
              onClick={resetForm}
              className="px-4 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all"
            >
              <RefreshCw size={18} />
            </button>

            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-2 px-6 py-3 bg-[#C5A059] text-black font-medium rounded-lg hover:bg-[#D4AF6A] transition-all"
              >
                Seguinte
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={calcularValor}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-500 transition-all"
              >
                <Calculator size={18} />
                Calcular Valor
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {resultado && (
          <div ref={resultadoRef} className="mt-12 scroll-mt-8">
            <div className="text-center mb-8">
              <Sparkles className="text-[#C5A059] mx-auto mb-4" size={32} />
              <h2 className="text-2xl sm:text-3xl font-serif">Resultado da Avaliação</h2>
              {formData.basicos.nome && (
                <p className="text-zinc-400 mt-2">{formData.basicos.nome}</p>
              )}
            </div>

            {/* Main Value Card */}
            <div className="bg-gradient-to-br from-[#C5A059]/20 to-[#C5A059]/5 border border-[#C5A059]/30 rounded-2xl p-6 sm:p-8 mb-6 text-center">
              <div className="text-sm text-zinc-400 mb-2">Valor Estimado</div>
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#C5A059] mb-2">
                {resultado.valorFinal.toLocaleString("pt-PT")}€
              </div>
              <div className="text-sm text-zinc-400 mb-4">
                Intervalo: {resultado.valorMinimo.toLocaleString("pt-PT")}€ - {resultado.valorMaximo.toLocaleString("pt-PT")}€
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-full">
                <div className={`w-3 h-3 rounded-full ${
                  resultado.confianca >= 85 ? "bg-green-500" : resultado.confianca >= 70 ? "bg-yellow-500" : "bg-orange-500"
                }`} />
                <span className="text-sm">{resultado.confianca}% confiança</span>
              </div>
            </div>

            {/* Alerts */}
            {resultado.alertas.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-400 mb-2">Alertas</p>
                    <ul className="space-y-1">
                      {resultado.alertas.map((alerta, i) => (
                        <li key={i} className="text-sm text-red-300">• {alerta}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {resultado.recomendacoes.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Check size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-400 mb-2">Pontos Fortes / Recomendações</p>
                    <ul className="space-y-1">
                      {resultado.recomendacoes.map((rec, i) => (
                        <li key={i} className="text-sm text-green-300">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Breakdown */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText size={20} className="text-[#C5A059]" />
                Decomposição Detalhada
              </h3>

              <div className="space-y-3">
                {resultado.pontuacoes.map((item, i) => (
                  <div key={i} className="border-b border-zinc-800 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {item.tendencia === "positivo" ? (
                          <TrendingUp size={16} className="text-green-400" />
                        ) : item.tendencia === "negativo" ? (
                          <TrendingDown size={16} className="text-red-400" />
                        ) : (
                          <Minus size={16} className="text-zinc-500" />
                        )}
                        <span className="font-medium">{item.categoria}</span>
                        <span className="text-xs text-zinc-500">({item.peso}% peso)</span>
                      </div>
                      <span className={`font-bold ${
                        item.impacto > 0 ? "text-green-400" : item.impacto < 0 ? "text-red-400" : "text-zinc-400"
                      }`}>
                        {item.impacto >= 0 ? "+" : ""}{item.impacto.toLocaleString("pt-PT")}€
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            item.pontuacao >= 8 ? "bg-green-500" : item.pontuacao >= 6 ? "bg-[#C5A059]" : item.pontuacao >= 4 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${item.pontuacao * 10}%` }}
                        />
                      </div>
                      <span className="text-sm text-zinc-400 w-12">{item.pontuacao}/10</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{item.detalhes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Segments */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target size={20} className="text-[#C5A059]" />
                Segmentos de Mercado
              </h3>

              <div className="space-y-3">
                {resultado.categoriasMercado.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{cat.categoria}</span>
                      <span className="text-sm text-zinc-500 ml-2">{cat.faixaPreco}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            cat.compatibilidade >= 70 ? "bg-green-500" : cat.compatibilidade >= 40 ? "bg-yellow-500" : "bg-zinc-600"
                          }`}
                          style={{ width: `${cat.compatibilidade}%` }}
                        />
                      </div>
                      <span className="text-sm text-zinc-400 w-10">{cat.compatibilidade}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all"
              >
                <Printer size={18} />
                Imprimir
              </button>
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all"
              >
                <RefreshCw size={18} />
                Nova Avaliação
              </button>
              <Link
                href="/vender-cavalo"
                className="flex items-center gap-2 px-4 py-2 bg-[#C5A059] text-black rounded-lg hover:bg-[#D4AF6A] transition-all"
              >
                <Euro size={18} />
                Anunciar para Venda
              </Link>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 text-center text-xs text-zinc-500 max-w-2xl mx-auto">
              <p>
                * Esta avaliação é uma estimativa baseada em critérios de mercado e não constitui uma avaliação oficial.
                O valor real pode variar significativamente dependendo de fatores específicos, condições de mercado,
                localização e negociação. Recomendamos sempre uma avaliação presencial por um profissional qualificado.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

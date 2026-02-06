"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Calculator, Dna, ChevronRight, ChevronLeft, Check, Activity,
  ArrowLeft, TrendingUp, TrendingDown, GitBranch, Crown, Sparkles,
  Download, Share2, RefreshCw, Award, Shield, BookOpen, Star,
  Info, Target, Zap, BarChart3, Medal, Heart, Globe
} from "lucide-react";

// ============================================
// TIPOS
// ============================================

interface FormData {
  nome: string;
  idade: number;
  sexo: "garanhao" | "egua" | "castrado";
  pelagem: string;
  altura: number;
  registoAPSL: boolean;
  livroAPSL: "definitivo" | "provisorio" | "auxiliar" | "nenhum";
  linhagem: "desconhecida" | "comum" | "registada" | "certificada" | "premium" | "elite";
  linhagemPrincipal: string;
  morfologia: number;
  garupa: number;
  espádua: number;
  cabeca: number;
  membros: number;
  andamentos: number;
  elevacao: number;
  suspensao: number;
  regularidade: number;
  treino: "potro" | "desbravado" | "iniciado" | "elementar" | "medio" | "avancado" | "alta_escola" | "grand_prix";
  competicoes: "nenhuma" | "regional" | "nacional" | "internacional" | "campeonato_mundo";
  disciplina: string;
  saude: "excelente" | "muito_bom" | "bom" | "regular";
  raioX: boolean;
  exameVeterinario: boolean;
  temperamento: number;
  sensibilidade: number;
  vontadeTrabalho: number;
  reproducao: boolean;
  descendentes: number;
  descendentesAprovados: number;
  mercado: string;
  tendencia: "alta" | "estavel" | "baixa";
}

interface Resultado {
  valorFinal: number;
  valorMin: number;
  valorMax: number;
  confianca: number;
  blup: number;
  percentil: number;
  multiplicador: number;
  categorias: { nome: string; impacto: number; score: number; descricao: string }[];
  recomendacoes: string[];
  comparacao: { tipo: string; valorMedio: number; diferenca: number }[];
  pontosForteseFracos: { fortes: string[]; fracos: string[] };
}

// ============================================
// DADOS PROFISSIONAIS
// ============================================

const PELAGENS = [
  { value: "Ruço", label: "Ruço", desc: "Pelagem mais valorizada" },
  { value: "Castanho", label: "Castanho", desc: "Clássica e tradicional" },
  { value: "Preto", label: "Preto", desc: "Elegante e rara" },
  { value: "Baio", label: "Baio", desc: "Tonalidade dourada" },
  { value: "Tordilho", label: "Tordilho", desc: "Progressiva para branco" },
  { value: "Isabela", label: "Isabela", desc: "Rara e distinta" },
  { value: "Palomino", label: "Palomino", desc: "Dourado excepcional" }
];

const LINHAGENS_FAMOSAS = [
  { value: "veiga", label: "Veiga", desc: "Alta Escola, piaffé natural" },
  { value: "andrade", label: "Andrade", desc: "Força e trabalho de campo" },
  { value: "alter_real", label: "Alter Real", desc: "Tradição Real portuguesa" },
  { value: "coudelaria_nacional", label: "Coudelaria Nacional", desc: "Versatilidade e equilíbrio" },
  { value: "infante_da_camara", label: "Infante da Câmara", desc: "Refinamento e elegância" },
  { value: "outra", label: "Outra / Mista", desc: "Linhagem não listada" }
];

const DISCIPLINAS = [
  "Dressage Clássica",
  "Equitação de Trabalho",
  "Alta Escola",
  "Ensino / Equitação",
  "Atrelagem",
  "Toureio a Cavalo",
  "Lazer / Passeio"
];

const MERCADOS = [
  { value: "Portugal", label: "Portugal", mult: 1.0 },
  { value: "Espanha", label: "Espanha", mult: 1.05 },
  { value: "França", label: "França", mult: 1.15 },
  { value: "Alemanha", label: "Alemanha", mult: 1.25 },
  { value: "Holanda", label: "Holanda", mult: 1.20 },
  { value: "Bélgica", label: "Bélgica", mult: 1.15 },
  { value: "Suíça", label: "Suíça", mult: 1.30 },
  { value: "Reino Unido", label: "Reino Unido", mult: 1.20 },
  { value: "Brasil", label: "Brasil", mult: 0.85 },
  { value: "EUA", label: "EUA", mult: 1.35 },
  { value: "México", label: "México", mult: 0.90 }
];

const VALORES_BASE: Record<string, number> = {
  potro: 8000,
  desbravado: 15000,
  iniciado: 25000,
  elementar: 40000,
  medio: 65000,
  avancado: 100000,
  alta_escola: 150000,
  grand_prix: 250000
};

const MULT_LINHAGEM: Record<string, number> = {
  desconhecida: 0.7,
  comum: 0.85,
  registada: 1.0,
  certificada: 1.25,
  premium: 1.6,
  elite: 2.2
};

const MULT_SAUDE: Record<string, number> = {
  excelente: 1.20,
  muito_bom: 1.08,
  bom: 1.0,
  regular: 0.70
};

const MULT_COMP: Record<string, number> = {
  nenhuma: 1.0,
  regional: 1.12,
  nacional: 1.30,
  internacional: 1.55,
  campeonato_mundo: 2.0
};

const MULT_LIVRO: Record<string, number> = {
  definitivo: 1.20,
  provisorio: 1.05,
  auxiliar: 0.90,
  nenhum: 0.70
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function CalculadoraValorPage() {
  const [step, setStep] = useState(0); // 0 = intro
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormData>({
    nome: "",
    idade: 6,
    sexo: "garanhao",
    pelagem: "Ruço",
    altura: 162,
    registoAPSL: true,
    livroAPSL: "definitivo",
    linhagem: "certificada",
    linhagemPrincipal: "veiga",
    morfologia: 7,
    garupa: 7,
    espádua: 7,
    cabeca: 7,
    membros: 7,
    andamentos: 7,
    elevacao: 7,
    suspensao: 7,
    regularidade: 7,
    treino: "elementar",
    competicoes: "nenhuma",
    disciplina: "Dressage Clássica",
    saude: "muito_bom",
    raioX: true,
    exameVeterinario: true,
    temperamento: 8,
    sensibilidade: 7,
    vontadeTrabalho: 8,
    reproducao: false,
    descendentes: 0,
    descendentesAprovados: 0,
    mercado: "Portugal",
    tendencia: "estavel"
  });

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const calcular = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const base = VALORES_BASE[form.treino];
      const mercadoData = MERCADOS.find(m => m.value === form.mercado);
      const multMercado = mercadoData?.mult || 1.0;

      // Multiplicadores detalhados
      const multLinhagem = MULT_LINHAGEM[form.linhagem];
      const multSaude = MULT_SAUDE[form.saude];
      const multComp = MULT_COMP[form.competicoes];
      const multLivro = MULT_LIVRO[form.livroAPSL];

      // Idade ideal: 7-12 anos
      const multIdade = form.idade >= 7 && form.idade <= 12 ? 1.15 :
                        form.idade >= 5 && form.idade <= 6 ? 1.05 :
                        form.idade > 15 ? 0.75 :
                        form.idade > 12 ? 0.90 : 1.0;

      // Morfologia detalhada
      const morfMedia = (form.morfologia + form.garupa + form.espádua + form.cabeca + form.membros) / 5;
      const multMorfo = 0.65 + (morfMedia / 10) * 0.7;

      // Andamentos detalhados
      const andMedia = (form.andamentos + form.elevacao + form.suspensao + form.regularidade) / 4;
      const multAnd = 0.65 + (andMedia / 10) * 0.7;

      // Temperamento
      const tempMedia = (form.temperamento + form.sensibilidade + form.vontadeTrabalho) / 3;
      const multTemp = 0.75 + (tempMedia / 10) * 0.5;

      // Bónus documentação
      const multDoc = (form.raioX ? 1.05 : 1.0) * (form.exameVeterinario ? 1.05 : 1.0);

      // Reprodução
      const multRepro = form.reproducao ?
        (1.15 + (form.descendentes * 0.02) + (form.descendentesAprovados * 0.05)) : 1.0;

      // Tendência mercado
      const multTend = form.tendencia === "alta" ? 1.12 : form.tendencia === "baixa" ? 0.88 : 1.0;

      // Sexo
      const multSexo = form.sexo === "garanhao" && form.reproducao ? 1.4 :
                       form.sexo === "egua" && form.reproducao ? 1.2 :
                       form.sexo === "egua" ? 1.05 : 1.0;

      // Altura (ideal 160-168cm)
      const multAltura = form.altura >= 160 && form.altura <= 168 ? 1.05 :
                         form.altura < 155 || form.altura > 172 ? 0.92 : 1.0;

      const totalMult = multLinhagem * multSaude * multComp * multIdade * multMorfo *
                        multAnd * multTemp * multLivro * multDoc * multRepro *
                        multTend * multSexo * multAltura * multMercado;

      const valorFinal = Math.round(base * totalMult);
      const variance = form.registoAPSL ? 0.12 : 0.20;

      const categorias = [
        {
          nome: "Genética & Linhagem",
          impacto: Math.round((multLinhagem - 1) * base),
          score: multLinhagem * 4.5,
          descricao: "Qualidade do pedigree e historial genético"
        },
        {
          nome: "Conformação Morfológica",
          impacto: Math.round((multMorfo - 1) * base),
          score: morfMedia,
          descricao: "Estrutura física segundo padrões APSL"
        },
        {
          nome: "Qualidade dos Andamentos",
          impacto: Math.round((multAnd - 1) * base),
          score: andMedia,
          descricao: "Elevação, suspensão e regularidade"
        },
        {
          nome: "Nível de Treino",
          impacto: Math.round(base * 0.4),
          score: Object.keys(VALORES_BASE).indexOf(form.treino) + 3,
          descricao: "Formação e preparação técnica"
        },
        {
          nome: "Saúde & Veterinária",
          impacto: Math.round((multSaude * multDoc - 1) * base),
          score: multSaude * 8,
          descricao: "Condição física e documentação"
        },
        {
          nome: "Carácter & Temperamento",
          impacto: Math.round((multTemp - 1) * base),
          score: tempMedia,
          descricao: "Sensibilidade e vontade de trabalho"
        },
        {
          nome: "Palmarés Desportivo",
          impacto: Math.round((multComp - 1) * base),
          score: multComp * 6,
          descricao: "Resultados em competição oficial"
        },
        {
          nome: "Valor Reprodutivo",
          impacto: Math.round((multRepro - 1) * base),
          score: form.reproducao ? 8 : 4,
          descricao: "Potencial e historial reprodutivo"
        }
      ].sort((a, b) => b.impacto - a.impacto);

      // Pontos fortes e fracos
      const fortes: string[] = [];
      const fracos: string[] = [];

      if (multLinhagem >= 1.5) fortes.push("Linhagem de prestígio reconhecido");
      if (multLinhagem < 1.0) fracos.push("Pedigree pouco documentado");
      if (morfMedia >= 8) fortes.push("Conformação morfológica excepcional");
      if (morfMedia < 6) fracos.push("Morfologia abaixo do padrão ideal");
      if (andMedia >= 8) fortes.push("Andamentos de qualidade superior");
      if (andMedia < 6) fracos.push("Andamentos precisam de desenvolvimento");
      if (form.competicoes !== "nenhuma") fortes.push("Experiência comprovada em competição");
      if (form.registoAPSL && form.livroAPSL === "definitivo") fortes.push("Registo APSL Livro Definitivo");
      if (!form.registoAPSL) fracos.push("Sem registo no Stud Book APSL");
      if (form.raioX && form.exameVeterinario) fortes.push("Documentação veterinária completa");
      if (tempMedia >= 8) fortes.push("Temperamento equilibrado e cooperativo");
      if (form.idade >= 7 && form.idade <= 12) fortes.push("Idade ideal para performance");
      if (form.idade > 15) fracos.push("Idade avançada limita valorização");

      // Comparações de mercado
      const comparacao = [
        {
          tipo: "Média do mercado (mesmo nível)",
          valorMedio: Math.round(base * 1.1),
          diferenca: Math.round(((valorFinal / (base * 1.1)) - 1) * 100)
        },
        {
          tipo: "Cavalos de linhagem similar",
          valorMedio: Math.round(base * multLinhagem),
          diferenca: Math.round(((valorFinal / (base * multLinhagem)) - 1) * 100)
        },
        {
          tipo: "Top 10% da raça",
          valorMedio: Math.round(base * 2.0),
          diferenca: Math.round(((valorFinal / (base * 2.0)) - 1) * 100)
        }
      ];

      // Recomendações personalizadas
      const recomendacoes: string[] = [];
      if (form.morfologia < 7) recomendacoes.push("Investir em trabalho de ginástica funcional pode melhorar a apresentação e valorizar 10-15%");
      if (!form.registoAPSL) recomendacoes.push("O registo APSL é fundamental - valoriza automaticamente 15-20% no mercado internacional");
      if (form.competicoes === "nenhuma" && form.treino !== "potro" && form.treino !== "desbravado") {
        recomendacoes.push("Participação em provas regionais aumenta credibilidade e pode valorizar 10-12%");
      }
      if (form.saude !== "excelente" && !form.raioX) {
        recomendacoes.push("Exame veterinário completo com radiografias é essencial para compradores exigentes");
      }
      if (form.treino === "elementar" || form.treino === "iniciado") {
        recomendacoes.push("Progressão para nível Médio pode aumentar o valor em 40-60%");
      }
      if (form.sexo === "garanhao" && !form.reproducao && form.morfologia >= 7 && form.andamentos >= 7) {
        recomendacoes.push("Considerar aprovação como reprodutor - garanhões aprovados têm valorização significativa");
      }
      if (!form.exameVeterinario) {
        recomendacoes.push("Relatório veterinário atualizado transmite segurança e facilita negociação");
      }
      if (form.mercado === "Portugal" && multMorfo > 1.1) {
        recomendacoes.push("Com esta qualidade, mercados como Alemanha ou EUA podem oferecer valores 25-35% superiores");
      }

      setResultado({
        valorFinal,
        valorMin: Math.round(valorFinal * (1 - variance)),
        valorMax: Math.round(valorFinal * (1 + variance)),
        confianca: Math.min(95, 65 + (form.registoAPSL ? 10 : 0) + (form.raioX ? 5 : 0) + (form.exameVeterinario ? 5 : 0) + Math.round(morfMedia) + Math.round(andMedia / 2)),
        blup: Math.round(100 + (multLinhagem - 1) * 60 + (morfMedia - 5) * 8 + (andMedia - 5) * 6),
        percentil: Math.min(99, Math.round(totalMult * 45)),
        multiplicador: Math.round(totalMult * 100) / 100,
        categorias,
        recomendacoes,
        comparacao,
        pontosForteseFracos: { fortes, fracos }
      });

      setIsCalculating(false);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 2000);
  };

  const resetar = () => {
    setResultado(null);
    setStep(0);
  };

  const totalSteps = 5;
  const progress = step === 0 ? 0 : (step / totalSteps) * 100;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium hidden sm:block">Portal Lusitano</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C5A059] to-[#8B7355] flex items-center justify-center">
              <Calculator size={18} className="text-black" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-white block leading-tight">Calculadora de Valor</span>
              <span className="text-xs text-zinc-500">Avaliação Profissional PSL</span>
            </div>
          </div>

          {resultado ? (
            <button onClick={resetar} className="text-sm text-[#C5A059] hover:text-[#D4AF6A] transition-colors flex items-center gap-2">
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Nova avaliação</span>
            </button>
          ) : step > 0 ? (
            <div className="text-xs text-zinc-500 flex items-center gap-2">
              <span className="text-[#C5A059]">{step}</span>
              <span>/</span>
              <span>{totalSteps}</span>
            </div>
          ) : (
            <div className="w-20" />
          )}
        </div>

        {/* Progress bar */}
        {step > 0 && !resultado && (
          <div className="h-0.5 bg-zinc-900">
            <div
              className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF6A] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </header>

      <div className="pt-16">
        {/* ==================== INTRO ==================== */}
        {/* Step transitions */}
          {step === 0 && !resultado && (
            <div className="animate-[fadeSlideIn_0.4s_ease-out_forwards]">
              {/* Hero Section */}
              <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1920&auto=format&fit=crop')",
                      backgroundPosition: "center 30%"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-black/50" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/50 via-transparent to-[#050505]/50" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                  <span
                    className="inline-block px-4 py-1.5 bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] text-xs font-medium uppercase tracking-[0.2em] rounded-full mb-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Ferramenta Profissional
                  </span>

                  <h1
                    className="text-4xl sm:text-5xl md:text-6xl font-serif text-white mb-6 leading-tight opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: "0.3s" }}
                  >
                    Calculadora de Valor
                    <span className="block text-[#C5A059] mt-2">Puro Sangue Lusitano</span>
                  </h1>

                  <p
                    className="text-lg text-zinc-300 max-w-2xl mx-auto mb-4 font-serif italic opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: "0.4s" }}
                  >
                    "Uma ferramenta desenvolvida para criadores, compradores e profissionais
                    do sector equestre que procuram uma avaliação fundamentada."
                  </p>

                  <p
                    className="text-sm text-zinc-500 max-w-xl mx-auto mb-10 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: "0.5s" }}
                  >
                    Baseada nos critérios de avaliação APSL, índices BLUP,
                    análise de mercado europeu e padrões internacionais de dressage.
                  </p>

                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all shadow-lg shadow-[#C5A059]/20 hover:shadow-[#C5A059]/30 hover:scale-[1.02] active:scale-[0.98] transition-transform opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: "0.6s" }}
                  >
                    <Calculator size={20} />
                    Iniciar Avaliação
                    <ChevronRight size={18} />
                  </button>
                </div>
              </section>

              {/* Features */}
              <section className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                  <div
                    className="grid md:grid-cols-3 gap-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: "0.7s" }}
                  >
                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                      <div className="w-12 h-12 bg-[#C5A059]/10 rounded-lg flex items-center justify-center mb-4">
                        <Dna className="text-[#C5A059]" size={24} />
                      </div>
                      <h3 className="text-lg font-serif text-white mb-2">Análise Genética</h3>
                      <p className="text-sm text-zinc-400">
                        Avaliação baseada nas principais linhagens portuguesas: Veiga, Andrade,
                        Alter Real e Coudelaria Nacional.
                      </p>
                    </div>

                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                      <div className="w-12 h-12 bg-[#C5A059]/10 rounded-lg flex items-center justify-center mb-4">
                        <BarChart3 className="text-[#C5A059]" size={24} />
                      </div>
                      <h3 className="text-lg font-serif text-white mb-2">Índices BLUP</h3>
                      <p className="text-sm text-zinc-400">
                        Cálculo aproximado do índice genético com base em morfologia,
                        andamentos e historial reprodutivo.
                      </p>
                    </div>

                    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                      <div className="w-12 h-12 bg-[#C5A059]/10 rounded-lg flex items-center justify-center mb-4">
                        <Globe className="text-[#C5A059]" size={24} />
                      </div>
                      <h3 className="text-lg font-serif text-white mb-2">Mercado Internacional</h3>
                      <p className="text-sm text-zinc-400">
                        Ajustes de valor para diferentes mercados: Portugal, Europa Central,
                        Reino Unido e Américas.
                      </p>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div
                    className="mt-12 p-6 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-xl opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: "0.8s" }}
                  >
                    <div className="flex items-start gap-4">
                      <Info className="text-[#C5A059] flex-shrink-0 mt-1" size={20} />
                      <div>
                        <h4 className="text-white font-medium mb-2">Metodologia de Avaliação</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          Esta calculadora considera mais de 20 parâmetros incluindo conformação segundo
                          padrões APSL, qualidade de andamentos (elevação, suspensão, regularidade),
                          nível de treino conforme escalas FEI, temperamento, historial de competição,
                          documentação veterinária e dinâmicas de mercado. Os valores são indicativos
                          e devem ser complementados por avaliação presencial.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

        {/* ==================== FORMULÁRIO ==================== */}
        <div className="pb-24 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Form steps */}
              {step > 0 && !resultado && (
                <div
                  key={`step-${step}`}
                  className="space-y-8 pt-8 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                >
                  {/* Step 1: Identificação */}
                  {step === 1 && (
                    <section className="space-y-6">
                      <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-xs font-medium rounded-full mb-3">
                          <Shield size={12} />
                          Identificação
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif">
                          Dados do Cavalo
                        </h2>
                        <p className="text-zinc-500 text-sm mt-2">Informação básica e registo</p>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                            Nome do Cavalo <span className="text-zinc-600">(opcional)</span>
                          </label>
                          <input
                            type="text"
                            value={form.nome}
                            onChange={e => update("nome", e.target.value)}
                            placeholder="Ex: Ícaro III, Novilheiro, Opus"
                            className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg focus:border-[#C5A059] outline-none transition-colors placeholder:text-zinc-700"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Idade</label>
                            <div className="relative">
                              <input
                                type="number"
                                value={form.idade}
                                onChange={e => update("idade", Math.max(0, Math.min(30, Number(e.target.value))))}
                                min={0}
                                max={30}
                                className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg focus:border-[#C5A059] outline-none transition-colors"
                              />
                              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">anos</span>
                            </div>
                            <span className="text-xs text-zinc-600 mt-1 block">Ideal: 7-12 anos</span>
                          </div>

                          <div>
                            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">Altura (Garrote)</label>
                            <div className="relative">
                              <input
                                type="number"
                                value={form.altura}
                                onChange={e => update("altura", Number(e.target.value))}
                                min={140}
                                max={180}
                                className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg focus:border-[#C5A059] outline-none transition-colors"
                              />
                              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">cm</span>
                            </div>
                            <span className="text-xs text-zinc-600 mt-1 block">Padrão: 155-170cm</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">Sexo</label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: "garanhao", label: "Garanhão", icon: Crown },
                              { value: "egua", label: "Égua", icon: Heart },
                              { value: "castrado", label: "Castrado", icon: Shield }
                            ].map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => update("sexo", opt.value as FormData["sexo"])}
                                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                                  form.sexo === opt.value
                                    ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                }`}
                              >
                                <opt.icon size={18} />
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">Pelagem</label>
                          <div className="grid grid-cols-2 gap-2">
                            {PELAGENS.map(p => (
                              <button
                                key={p.value}
                                onClick={() => update("pelagem", p.value)}
                                className={`py-3 px-4 rounded-lg border text-left transition-all ${
                                  form.pelagem === p.value
                                    ? "border-[#C5A059] bg-[#C5A059]/10"
                                    : "border-zinc-800 hover:border-zinc-700"
                                }`}
                              >
                                <span className={`block text-sm font-medium ${form.pelagem === p.value ? "text-[#C5A059]" : "text-zinc-300"}`}>
                                  {p.label}
                                </span>
                                <span className="text-xs text-zinc-500">{p.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-900">
                          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                            Registo APSL (Stud Book)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => update("registoAPSL", true)}
                              className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                form.registoAPSL
                                  ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                              }`}
                            >
                              {form.registoAPSL && <Check size={16} />}
                              Registado APSL
                            </button>
                            <button
                              onClick={() => update("registoAPSL", false)}
                              className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all ${
                                !form.registoAPSL
                                  ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                              }`}
                            >
                              Sem registo
                            </button>
                          </div>

                          {form.registoAPSL && (
                            <div
                              className="mt-4 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                            >
                              <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                                Tipo de Livro
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { value: "definitivo", label: "Definitivo" },
                                  { value: "provisorio", label: "Provisório" },
                                  { value: "auxiliar", label: "Auxiliar" }
                                ].map(opt => (
                                  <button
                                    key={opt.value}
                                    onClick={() => update("livroAPSL", opt.value as FormData["livroAPSL"])}
                                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                                      form.livroAPSL === opt.value
                                        ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                        : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Step 2: Genética e Morfologia */}
                  {step === 2 && (
                    <section className="space-y-6">
                      <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-xs font-medium rounded-full mb-3">
                          <Dna size={12} />
                          Genética & Conformação
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif">
                          Linhagem e Morfologia
                        </h2>
                        <p className="text-zinc-500 text-sm mt-2">Qualidade genética e conformação física</p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                            Qualidade da Linhagem
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                              { value: "desconhecida", label: "Desconhecida", desc: "Sem informação" },
                              { value: "comum", label: "Comum", desc: "Pedigree básico" },
                              { value: "registada", label: "Registada", desc: "3 gerações" },
                              { value: "certificada", label: "Certificada", desc: "Genealogia completa" },
                              { value: "premium", label: "Premium", desc: "Linhas reconhecidas" },
                              { value: "elite", label: "Elite", desc: "Top genético" }
                            ].map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => update("linhagem", opt.value as FormData["linhagem"])}
                                className={`py-3 px-3 rounded-lg border text-left transition-all ${
                                  form.linhagem === opt.value
                                    ? "border-[#C5A059] bg-[#C5A059]/10"
                                    : "border-zinc-800 hover:border-zinc-700"
                                }`}
                              >
                                <span className={`block text-sm font-medium ${form.linhagem === opt.value ? "text-[#C5A059]" : "text-zinc-300"}`}>
                                  {opt.label}
                                </span>
                                <span className="text-xs text-zinc-600">{opt.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {(form.linhagem === "premium" || form.linhagem === "elite") && (
                          <div
                            className="animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                          >
                            <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                              Linhagem Principal
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {LINHAGENS_FAMOSAS.map(lin => (
                                <button
                                  key={lin.value}
                                  onClick={() => update("linhagemPrincipal", lin.value)}
                                  className={`py-3 px-4 rounded-lg border text-left transition-all ${
                                    form.linhagemPrincipal === lin.value
                                      ? "border-[#C5A059] bg-[#C5A059]/10"
                                      : "border-zinc-800 hover:border-zinc-700"
                                  }`}
                                >
                                  <span className={`block text-sm font-medium ${form.linhagemPrincipal === lin.value ? "text-[#C5A059]" : "text-zinc-300"}`}>
                                    {lin.label}
                                  </span>
                                  <span className="text-xs text-zinc-500">{lin.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t border-zinc-900">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-zinc-300">Conformação Morfológica</h3>
                            <span className="text-xs text-zinc-500">Segundo padrões APSL</span>
                          </div>

                          {[
                            { key: "morfologia", label: "Impressão Geral", desc: "Harmonia e proporção" },
                            { key: "cabeca", label: "Cabeça & Pescoço", desc: "Expressão e inserção" },
                            { key: "espádua", label: "Espádua & Peito", desc: "Inclinação e amplitude" },
                            { key: "garupa", label: "Garupa & Dorso", desc: "Linha superior" },
                            { key: "membros", label: "Membros & Aprumos", desc: "Correção e solidez" }
                          ].map(item => (
                            <div key={item.key} className="mb-5">
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <label className="text-sm text-zinc-300">{item.label}</label>
                                  <span className="text-xs text-zinc-600 ml-2">{item.desc}</span>
                                </div>
                                <span className="text-[#C5A059] font-medium text-lg">{form[item.key as keyof FormData] as number}/10</span>
                              </div>
                              <input
                                type="range"
                                min={1}
                                max={10}
                                value={form[item.key as keyof FormData] as number}
                                onChange={e => update(item.key as keyof FormData, Number(e.target.value) as never)}
                                className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[#C5A059]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Step 3: Andamentos e Temperamento */}
                  {step === 3 && (
                    <section className="space-y-6">
                      <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-xs font-medium rounded-full mb-3">
                          <Zap size={12} />
                          Funcionalidade
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif">
                          Andamentos e Carácter
                        </h2>
                        <p className="text-zinc-500 text-sm mt-2">Qualidade de movimento e temperamento</p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-zinc-300">Qualidade dos Andamentos</h3>
                            <span className="text-xs text-zinc-500">Avaliação funcional</span>
                          </div>

                          {[
                            { key: "andamentos", label: "Qualidade Geral", desc: "Impulsão e cadência" },
                            { key: "elevacao", label: "Elevação", desc: "Altura do movimento" },
                            { key: "suspensao", label: "Suspensão", desc: "Tempo no ar" },
                            { key: "regularidade", label: "Regularidade", desc: "Ritmo e equilíbrio" }
                          ].map(item => (
                            <div key={item.key} className="mb-5">
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <label className="text-sm text-zinc-300">{item.label}</label>
                                  <span className="text-xs text-zinc-600 ml-2">{item.desc}</span>
                                </div>
                                <span className="text-[#C5A059] font-medium text-lg">{form[item.key as keyof FormData] as number}/10</span>
                              </div>
                              <input
                                type="range"
                                min={1}
                                max={10}
                                value={form[item.key as keyof FormData] as number}
                                onChange={e => update(item.key as keyof FormData, Number(e.target.value) as never)}
                                className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[#C5A059]"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-zinc-900">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-zinc-300">Temperamento</h3>
                            <span className="text-xs text-zinc-500">Carácter e atitude</span>
                          </div>

                          {[
                            { key: "temperamento", label: "Equilíbrio Mental", desc: "Calma e confiança" },
                            { key: "sensibilidade", label: "Sensibilidade", desc: "Resposta às ajudas" },
                            { key: "vontadeTrabalho", label: "Vontade de Trabalho", desc: "Cooperação e energia" }
                          ].map(item => (
                            <div key={item.key} className="mb-5">
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <label className="text-sm text-zinc-300">{item.label}</label>
                                  <span className="text-xs text-zinc-600 ml-2">{item.desc}</span>
                                </div>
                                <span className="text-[#C5A059] font-medium text-lg">{form[item.key as keyof FormData] as number}/10</span>
                              </div>
                              <input
                                type="range"
                                min={1}
                                max={10}
                                value={form[item.key as keyof FormData] as number}
                                onChange={e => update(item.key as keyof FormData, Number(e.target.value) as never)}
                                className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-[#C5A059]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Step 4: Treino e Saúde */}
                  {step === 4 && (
                    <section className="space-y-6">
                      <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-xs font-medium rounded-full mb-3">
                          <Target size={12} />
                          Formação & Condição
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif">
                          Treino e Saúde
                        </h2>
                        <p className="text-zinc-500 text-sm mt-2">Nível técnico e estado veterinário</p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                            Nível de Treino <span className="text-zinc-600">(Escala FEI)</span>
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: "potro", label: "Potro", desc: "Sem desbaste", price: "8.000€+" },
                              { value: "desbravado", label: "Desbravado", desc: "Aceita cavaleiro", price: "15.000€+" },
                              { value: "iniciado", label: "Iniciado", desc: "Trabalho básico", price: "25.000€+" },
                              { value: "elementar", label: "Elementar", desc: "Figuras básicas", price: "40.000€+" },
                              { value: "medio", label: "Médio (M)", desc: "Cambios, piruetas", price: "65.000€+" },
                              { value: "avancado", label: "Avançado (S)", desc: "Movimentos avançados", price: "100.000€+" },
                              { value: "alta_escola", label: "Alta Escola", desc: "Ares de cima", price: "150.000€+" },
                              { value: "grand_prix", label: "Grand Prix", desc: "Competição GP", price: "250.000€+" }
                            ].map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => update("treino", opt.value as FormData["treino"])}
                                className={`py-3 px-4 rounded-lg border text-left transition-all ${
                                  form.treino === opt.value
                                    ? "border-[#C5A059] bg-[#C5A059]/10"
                                    : "border-zinc-800 hover:border-zinc-700"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <span className={`text-sm font-medium ${form.treino === opt.value ? "text-[#C5A059]" : "text-zinc-300"}`}>
                                    {opt.label}
                                  </span>
                                  <span className="text-xs text-zinc-600">{opt.price}</span>
                                </div>
                                <span className="text-xs text-zinc-500">{opt.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                            Disciplina Principal
                          </label>
                          <select
                            value={form.disciplina}
                            onChange={e => update("disciplina", e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 text-zinc-300 focus:border-[#C5A059] outline-none transition-colors"
                          >
                            {DISCIPLINAS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                            Historial de Competição
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: "nenhuma", label: "Sem competição", icon: null },
                              { value: "regional", label: "Regional", icon: Medal },
                              { value: "nacional", label: "Nacional", icon: Award },
                              { value: "internacional", label: "Internacional", icon: Globe },
                              { value: "campeonato_mundo", label: "Campeonato Mundo", icon: Crown }
                            ].map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => update("competicoes", opt.value as FormData["competicoes"])}
                                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                                  form.competicoes === opt.value
                                    ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                } ${opt.value === "campeonato_mundo" ? "col-span-2" : ""}`}
                              >
                                {opt.icon && <opt.icon size={16} />}
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-900">
                          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                            Estado de Saúde
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: "excelente", label: "Excelente", desc: "Sem problemas", color: "text-green-400" },
                              { value: "muito_bom", label: "Muito Bom", desc: "Histórico limpo", color: "text-emerald-400" },
                              { value: "bom", label: "Bom", desc: "Questões menores", color: "text-yellow-400" },
                              { value: "regular", label: "Regular", desc: "Limitações", color: "text-orange-400" }
                            ].map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => update("saude", opt.value as FormData["saude"])}
                                className={`py-3 px-4 rounded-lg border text-left transition-all ${
                                  form.saude === opt.value
                                    ? "border-[#C5A059] bg-[#C5A059]/10"
                                    : "border-zinc-800 hover:border-zinc-700"
                                }`}
                              >
                                <span className={`block text-sm font-medium ${form.saude === opt.value ? "text-[#C5A059]" : "text-zinc-300"}`}>
                                  {opt.label}
                                </span>
                                <span className="text-xs text-zinc-500">{opt.desc}</span>
                              </button>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-4">
                            <button
                              onClick={() => update("raioX", !form.raioX)}
                              className={`py-3 px-4 rounded-lg border text-sm transition-all flex items-center justify-center gap-2 ${
                                form.raioX
                                  ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                              }`}
                            >
                              {form.raioX && <Check size={16} />}
                              Raio-X disponível
                            </button>
                            <button
                              onClick={() => update("exameVeterinario", !form.exameVeterinario)}
                              className={`py-3 px-4 rounded-lg border text-sm transition-all flex items-center justify-center gap-2 ${
                                form.exameVeterinario
                                  ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                              }`}
                            >
                              {form.exameVeterinario && <Check size={16} />}
                              Exame veterinário
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Step 5: Reprodução e Mercado */}
                  {step === 5 && (
                    <section className="space-y-6">
                      <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059]/10 text-[#C5A059] text-xs font-medium rounded-full mb-3">
                          <Star size={12} />
                          Finalização
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif">
                          Reprodução e Mercado
                        </h2>
                        <p className="text-zinc-500 text-sm mt-2">Informações finais para cálculo</p>
                      </div>

                      <div className="space-y-6">
                        {form.sexo !== "castrado" && (
                          <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                              <GitBranch className="text-[#C5A059]" size={20} />
                              <h3 className="text-sm font-medium text-zinc-300">Valor Reprodutivo</h3>
                            </div>

                            <button
                              onClick={() => update("reproducao", !form.reproducao)}
                              className={`w-full py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 mb-4 ${
                                form.reproducao
                                  ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                  : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                              }`}
                            >
                              {form.reproducao && <Check size={16} />}
                              {form.sexo === "garanhao" ? "Aprovado como Reprodutor" : "Reprodutora Aprovada"}
                            </button>

                            {form.reproducao && (
                              <div
                                className="grid grid-cols-2 gap-4 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                              >
                                <div>
                                  <label className="block text-xs text-zinc-500 mb-2">
                                    Descendentes Registados
                                  </label>
                                  <input
                                    type="number"
                                    value={form.descendentes}
                                    onChange={e => update("descendentes", Math.max(0, Number(e.target.value)))}
                                    min={0}
                                    className="w-full bg-transparent border border-zinc-800 rounded-lg py-2 px-3 focus:border-[#C5A059] outline-none transition-colors"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-zinc-500 mb-2">
                                    Desc. Aprovados (se garanhão)
                                  </label>
                                  <input
                                    type="number"
                                    value={form.descendentesAprovados}
                                    onChange={e => update("descendentesAprovados", Math.max(0, Number(e.target.value)))}
                                    min={0}
                                    className="w-full bg-transparent border border-zinc-800 rounded-lg py-2 px-3 focus:border-[#C5A059] outline-none transition-colors"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div>
                          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                            Mercado Alvo
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {MERCADOS.map(m => (
                              <button
                                key={m.value}
                                onClick={() => update("mercado", m.value)}
                                className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                                  form.mercado === m.value
                                    ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                }`}
                              >
                                {m.label}
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-zinc-600 mt-2">
                            O mercado influencia o valor: mercados como EUA e Alemanha têm maior poder de compra.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                            Tendência de Mercado <span className="text-zinc-600">(2024)</span>
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { value: "alta", label: "Em Alta", icon: TrendingUp, desc: "+12%" },
                              { value: "estavel", label: "Estável", icon: Activity, desc: "±0%" },
                              { value: "baixa", label: "Em Baixa", icon: TrendingDown, desc: "-12%" }
                            ].map(opt => (
                              <button
                                key={opt.value}
                                onClick={() => update("tendencia", opt.value as FormData["tendencia"])}
                                className={`py-4 px-4 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                                  form.tendencia === opt.value
                                    ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059]"
                                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                                }`}
                              >
                                <opt.icon size={20} />
                                <span>{opt.label}</span>
                                <span className="text-xs text-zinc-500">{opt.desc}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Navegação */}
                  <div className="flex gap-3 pt-6">
                    {step > 1 && (
                      <button
                        onClick={() => setStep(s => s - 1)}
                        className="flex-1 py-4 rounded-xl border border-zinc-800 text-zinc-400 font-medium hover:border-zinc-700 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <ChevronLeft size={18} />
                        Anterior
                      </button>
                    )}

                    {step < totalSteps ? (
                      <button
                        onClick={() => setStep(s => s + 1)}
                        className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-semibold hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all flex items-center justify-center gap-2"
                      >
                        Continuar
                        <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={calcular}
                        disabled={isCalculating}
                        className="flex-1 py-4 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-bold hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isCalculating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            A processar dados...
                          </>
                        ) : (
                          <>
                            <Calculator size={18} />
                            Calcular Valor
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}

            {/* ==================== RESULTADO ==================== */}
            {resultado && (
              <div
                ref={resultRef}
                className="space-y-6 pt-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              >
                {/* Hero do Valor */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-8 border border-zinc-800">
                  {/* Decorações */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C5A059]/5 rounded-full blur-3xl" />
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059]/10 rounded-full border border-[#C5A059]/30">
                      <Crown size={12} className="text-[#C5A059]" />
                      <span className="text-xs text-[#C5A059] font-medium">Avaliação Premium</span>
                    </div>
                  </div>

                  <div className="relative z-10 text-center">
                    {form.nome && (
                      <p className="text-zinc-400 text-sm mb-1 font-serif italic">"{form.nome}"</p>
                    )}
                    <p className="text-[#C5A059] text-xs font-medium uppercase tracking-[0.2em] mb-6">
                      Valor de Mercado Estimado
                    </p>

                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl sm:text-7xl font-light tracking-tight text-white">
                        {resultado.valorFinal.toLocaleString("pt-PT")}
                      </span>
                      <span className="text-2xl text-[#C5A059]">€</span>
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-4 text-sm text-zinc-500">
                      <span>Min: {resultado.valorMin.toLocaleString("pt-PT")}€</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span>Max: {resultado.valorMax.toLocaleString("pt-PT")}€</span>
                    </div>

                    {/* Métricas Principais */}
                    <div className="flex justify-center gap-8 mt-8">
                      <div className="text-center">
                        <div className="text-2xl font-medium text-white">{resultado.confianca}%</div>
                        <div className="text-xs text-zinc-500">Confiança</div>
                      </div>
                      <div className="w-px bg-zinc-800" />
                      <div className="text-center">
                        <div className="text-2xl font-medium text-white">Top {Math.max(1, 100 - resultado.percentil)}%</div>
                        <div className="text-xs text-zinc-500">Mercado PSL</div>
                      </div>
                      <div className="w-px bg-zinc-800" />
                      <div className="text-center">
                        <div className="text-2xl font-medium text-white">{resultado.multiplicador}x</div>
                        <div className="text-xs text-zinc-500">Multiplicador</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Indicadores Genéticos */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                      <Dna size={16} className="text-purple-400" />
                      <span>Índice BLUP Estimado</span>
                    </div>
                    <div className="text-3xl font-light text-white">{resultado.blup}</div>
                    <div className="text-xs text-zinc-500 mt-1">
                      Média da raça: 100 | Top: &gt;120
                    </div>
                    <div className="mt-3 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                        style={{ width: `${Math.min((resultado.blup / 150) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                      <BarChart3 size={16} className="text-amber-400" />
                      <span>Percentil de Mercado</span>
                    </div>
                    <div className="text-3xl font-light text-white">{resultado.percentil}%</div>
                    <div className="text-xs text-zinc-500 mt-1">
                      Acima de {resultado.percentil}% dos PSL
                    </div>
                    <div className="mt-3 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                        style={{ width: `${resultado.percentil}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Pontos Fortes e Fracos */}
                {(resultado.pontosForteseFracos.fortes.length > 0 || resultado.pontosForteseFracos.fracos.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {resultado.pontosForteseFracos.fortes.length > 0 && (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                        <h3 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                          <TrendingUp size={16} />
                          Pontos Fortes
                        </h3>
                        <ul className="space-y-2">
                          {resultado.pontosForteseFracos.fortes.map((ponto, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                              <Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                              {ponto}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {resultado.pontosForteseFracos.fracos.length > 0 && (
                      <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
                        <h3 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                          <Info size={16} />
                          Áreas de Atenção
                        </h3>
                        <ul className="space-y-2">
                          {resultado.pontosForteseFracos.fracos.map((ponto, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                              <ChevronRight size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                              {ponto}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Comparação de Mercado */}
                <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <BarChart3 size={16} className="text-[#C5A059]" />
                    Comparação de Mercado
                  </h3>
                  <div className="space-y-4">
                    {resultado.comparacao.map((comp, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-zinc-300">{comp.tipo}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-zinc-500">{comp.valorMedio.toLocaleString("pt-PT")}€</span>
                          <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                            comp.diferenca >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                          }`}>
                            {comp.diferenca >= 0 ? "+" : ""}{comp.diferenca}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Análise por Categoria */}
                <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
                  <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
                    Impacto por Categoria
                  </h3>
                  <div className="space-y-4">
                    {resultado.categorias.slice(0, 6).map((cat, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-sm text-zinc-300">{cat.nome}</span>
                            <span className="text-xs text-zinc-600 ml-2 hidden sm:inline">{cat.descricao}</span>
                          </div>
                          <span className={`text-sm font-medium ${cat.impacto >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {cat.impacto >= 0 ? "+" : ""}{cat.impacto.toLocaleString("pt-PT")}€
                          </span>
                        </div>
                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF6A] transition-all duration-500"
                            style={{ width: `${Math.min(cat.score * 10, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recomendações */}
                {resultado.recomendacoes.length > 0 && (
                  <div className="bg-[#C5A059]/5 rounded-xl p-6 border border-[#C5A059]/20">
                    <h3 className="text-sm font-medium text-[#C5A059] uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Sparkles size={16} />
                      Recomendações para Valorização
                    </h3>
                    <ul className="space-y-3">
                      {resultado.recomendacoes.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                          <ChevronRight size={16} className="text-[#C5A059] flex-shrink-0 mt-0.5" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Informações do Cavalo */}
                <div className="bg-zinc-900/30 rounded-xl p-6 border border-zinc-800/50">
                  <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">
                    Resumo da Avaliação
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-zinc-600 block">Idade</span>
                      <span className="text-zinc-300">{form.idade} anos</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block">Sexo</span>
                      <span className="text-zinc-300">{form.sexo === "garanhao" ? "Garanhão" : form.sexo === "egua" ? "Égua" : "Castrado"}</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block">Nível</span>
                      <span className="text-zinc-300 capitalize">{form.treino.replace("_", " ")}</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block">Mercado</span>
                      <span className="text-zinc-300">{form.mercado}</span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-3">
                  <button className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-medium hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center gap-2">
                    <Download size={16} />
                    Exportar Relatório
                  </button>
                  <button className="flex-1 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-medium hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center gap-2">
                    <Share2 size={16} />
                    Partilhar
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    <strong className="text-zinc-400">Aviso:</strong> Esta avaliação é uma estimativa baseada nos dados fornecidos
                    e não substitui uma avaliação presencial por um profissional qualificado. O valor real pode variar
                    significativamente consoante as condições de mercado, negociação, localização geográfica e características
                    individuais do cavalo. Recomendamos sempre uma inspeção veterinária completa e avaliação por especialistas
                    antes de qualquer transação.
                  </p>
                </div>

                {/* CTA Final */}
                <div className="text-center pt-4">
                  <p className="text-sm text-zinc-500 mb-4">
                    Precisa de uma avaliação profissional presencial?
                  </p>
                  <Link
                    href="/profissionais"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-[#C5A059]/50 text-[#C5A059] rounded-lg hover:bg-[#C5A059]/10 transition-colors"
                  >
                    <BookOpen size={16} />
                    Encontrar Avaliadores Certificados
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

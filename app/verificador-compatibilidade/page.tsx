"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Dna,
  AlertTriangle,
  CheckCircle,
  Crown,
  Baby,
  Palette,
  Activity,
  ChevronRight,
  Info,
  TrendingUp,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import AnimatedCounter from "@/components/tools/AnimatedCounter";
import ResultActions from "@/components/tools/ResultActions";
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";
import Paywall from "@/components/tools/Paywall";
import { useToolAccess } from "@/hooks/useToolAccess";
import { generateCompatibilidadePDF } from "@/lib/tools/pdf/compatibilidade-pdf";
import { shareNative, copyToClipboard } from "@/lib/tools/share-utils";

// ============================================
// TIPOS
// ============================================

interface GeneticaPelagem {
  extension: "EE" | "Ee" | "ee";
  agouti: "AA" | "Aa" | "aa";
  grey: "GG" | "Gg" | "gg";
  cream: "CrCr" | "CrN" | "NN";
  dun: "DD" | "Dd" | "dd";
}

interface Cavalo {
  nome: string;
  sexo: "Garanhão" | "Égua";
  idade: number;
  altura: number;
  pelagem: string;
  genetica: GeneticaPelagem;
  linhagem: string;
  linhagemFamosa: string;
  coudelaria: string;
  conformacao: number;
  andamentos: number;
  temperamento: string;
  saude: number;
  fertilidade: string;
  blup: number;
  coi: number;
  defeitos: string[];
  aprovado: boolean;
}

interface ResultadoCompatibilidade {
  score: number;
  nivel: string;
  coi: number;
  blup: number;
  altura: { min: number; max: number };
  pelagens: { cor: string; prob: number; genetica: string }[];
  riscos: { texto: string; severidade: "alto" | "medio" | "baixo" }[];
  factores: { nome: string; score: number; max: number; tipo: string; descricao: string }[];
  recomendacoes: string[];
  pontosForteseFracos: { fortes: string[]; fracos: string[] };
}

// ============================================
// DADOS PROFISSIONAIS
// ============================================

const criarCavalo = (sexo: "Garanhão" | "Égua"): Cavalo => ({
  nome: "",
  sexo,
  idade: sexo === "Garanhão" ? 8 : 7,
  altura: sexo === "Garanhão" ? 163 : 158,
  pelagem: "Ruço",
  genetica: { extension: "Ee", agouti: "Aa", grey: "Gg", cream: "NN", dun: "dd" },
  linhagem: "Certificada",
  linhagemFamosa: "veiga",
  coudelaria: "Particular",
  conformacao: 7,
  andamentos: 7,
  temperamento: "Equilibrado",
  saude: 8,
  fertilidade: "Normal",
  blup: 100,
  coi: 4,
  defeitos: [],
  aprovado: true,
});

const COUDELARIAS = [
  { value: "Veiga", label: "Coudelaria Veiga", familia: "veiga" },
  { value: "Andrade", label: "Coudelaria Andrade", familia: "andrade" },
  { value: "Alter Real", label: "Alter Real", familia: "alter" },
  { value: "Interagro", label: "Interagro", familia: "interagro" },
  { value: "Lezírias", label: "Companhia das Lezírias", familia: "lezirias" },
  { value: "Particular", label: "Criador Particular", familia: "particular" },
];

const LINHAGENS = [
  { value: "Desconhecida", label: "Desconhecida", mult: 0.6 },
  { value: "Comum", label: "Comum", mult: 0.8 },
  { value: "Registada", label: "Registada APSL", mult: 1.0 },
  { value: "Certificada", label: "Certificada", mult: 1.2 },
  { value: "Premium", label: "Premium", mult: 1.5 },
  { value: "Elite", label: "Elite", mult: 2.0 },
];

const LINHAGENS_FAMOSAS = [
  { value: "veiga", label: "Veiga", desc: "Alta Escola, piaffé natural" },
  { value: "andrade", label: "Andrade", desc: "Força e trabalho" },
  { value: "alter", label: "Alter Real", desc: "Tradição Real" },
  { value: "coudelaria_nacional", label: "Coudelaria Nacional", desc: "Versatilidade" },
  { value: "infante_camara", label: "Infante da Câmara", desc: "Refinamento" },
  { value: "outra", label: "Outra / Mista", desc: "Linhagem diversa" },
];

const TEMPERAMENTOS = [
  { value: "Calmo", label: "Calmo", desc: "Muito dócil" },
  { value: "Equilibrado", label: "Equilibrado", desc: "Ideal para reprodução" },
  { value: "Energético", label: "Energético", desc: "Vivo mas cooperativo" },
  { value: "Nervoso", label: "Nervoso", desc: "Sensível, requer experiência" },
];

const FERTILIDADES = [
  { value: "Muito Alta", label: "Muito Alta", mult: 1.3 },
  { value: "Alta", label: "Alta", mult: 1.15 },
  { value: "Normal", label: "Normal", mult: 1.0 },
  { value: "Baixa", label: "Baixa", mult: 0.7 },
];

const DEFEITOS_GENETICOS = [
  { value: "WFFS", label: "WFFS Portador", desc: "Síndrome do Potro Frágil", risco: "alto" },
  { value: "Lordose", label: "Lordose", desc: "Curvatura anormal da coluna", risco: "medio" },
  { value: "OCD", label: "OCD", desc: "Osteocondrite Dissecante", risco: "medio" },
  { value: "Navicular", label: "Síndrome Navicular", desc: "Problema podal", risco: "medio" },
  { value: "DPOC", label: "DPOC/RAO", desc: "Doença respiratória", risco: "baixo" },
  { value: "Melanoma", label: "Predisposição Melanoma", desc: "Em ruços", risco: "baixo" },
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function VerificadorCompatibilidadePage() {
  const [garanhao, setGaranhao] = useState<Cavalo>(criarCavalo("Garanhão"));
  const [egua, setEgua] = useState<Cavalo>(criarCavalo("Égua"));
  const [tab, setTab] = useState<"garanhao" | "egua">("garanhao");
  const [step, setStep] = useState(0); // 0 = intro
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultado, setResultado] = useState<ResultadoCompatibilidade | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { canUse, isSubscribed, freeUsesLeft, requiresAuth, recordUsage } =
    useToolAccess("compatibilidade");

  const handleExportPDF = async () => {
    if (!resultado) return;
    setIsExporting(true);
    try {
      await generateCompatibilidadePDF(garanhao, egua, resultado);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = "Verificador de Compatibilidade Equina";
    const text = `Compatibilidade: ${garanhao.nome || "Garanhao"} x ${egua.nome || "Egua"} - Portal Lusitano`;
    const shared = await shareNative(title, text, url);
    if (!shared) await copyToClipboard(url);
  };

  const cavalo = tab === "garanhao" ? garanhao : egua;
  const setCavalo = tab === "garanhao" ? setGaranhao : setEgua;

  const update = (field: keyof Cavalo, value: Cavalo[keyof Cavalo]) => {
    setCavalo((prev) => ({ ...prev, [field]: value }));
  };

  const updateGen = (gene: keyof GeneticaPelagem, value: string) => {
    setCavalo((prev) => ({ ...prev, genetica: { ...prev.genetica, [gene]: value } }));
  };

  const toggleDefeito = (d: string) => {
    const lista = cavalo.defeitos.includes(d)
      ? cavalo.defeitos.filter((x) => x !== d)
      : [...cavalo.defeitos, d];
    update("defeitos", lista);
  };

  const calcular = () => {
    if (!canUse) return;
    setIsCalculating(true);

    setTimeout(() => {
      const factores: ResultadoCompatibilidade["factores"] = [];
      const riscos: ResultadoCompatibilidade["riscos"] = [];
      const fortes: string[] = [];
      const fracos: string[] = [];
      let total = 0;

      // 1. Idade Reprodutiva (15pts)
      const idadeGaranhaoOk = garanhao.idade >= 4 && garanhao.idade <= 20;
      const idadeEguaOk = egua.idade >= 4 && egua.idade <= 18;
      const idadeScore =
        idadeGaranhaoOk && idadeEguaOk ? 15 : idadeGaranhaoOk || idadeEguaOk ? 10 : 5;
      factores.push({
        nome: "Idade Reprodutiva",
        score: idadeScore,
        max: 15,
        tipo: idadeScore >= 12 ? "excelente" : idadeScore >= 8 ? "bom" : "aviso",
        descricao: "Idade ideal: Garanhão 4-20, Égua 4-18 anos",
      });
      if (egua.idade > 16)
        riscos.push({ texto: "Égua com idade avançada para reprodução", severidade: "medio" });
      if (egua.idade < 4) riscos.push({ texto: "Égua demasiado jovem", severidade: "alto" });
      if (garanhao.idade > 18)
        riscos.push({ texto: "Garanhão com idade avançada", severidade: "baixo" });
      total += idadeScore;

      // 2. Compatibilidade Física (10pts)
      const difAltura = Math.abs(garanhao.altura - egua.altura);
      const tamanhoScore = difAltura <= 5 ? 10 : difAltura <= 8 ? 8 : difAltura <= 12 ? 5 : 3;
      factores.push({
        nome: "Compatibilidade Física",
        score: tamanhoScore,
        max: 10,
        tipo: tamanhoScore >= 8 ? "excelente" : tamanhoScore >= 5 ? "bom" : "aviso",
        descricao: `Diferença de altura: ${difAltura}cm`,
      });
      if (difAltura > 10)
        riscos.push({
          texto: `Diferença de altura significativa (${difAltura}cm)`,
          severidade: "baixo",
        });
      total += tamanhoScore;

      // 3. Qualidade Genética / Linhagem (20pts)
      const linNiveis: Record<string, number> = {
        Desconhecida: 0,
        Comum: 1,
        Registada: 2,
        Certificada: 3,
        Premium: 4,
        Elite: 5,
      };
      const linMedia = (linNiveis[garanhao.linhagem] + linNiveis[egua.linhagem]) / 2;
      const linScore = Math.round(linMedia * 4);
      factores.push({
        nome: "Qualidade Genética",
        score: linScore,
        max: 20,
        tipo: linScore >= 16 ? "excelente" : linScore >= 10 ? "bom" : "neutro",
        descricao: "Média da qualidade das linhagens dos progenitores",
      });
      if (linScore >= 16) fortes.push("Ambos progenitores com linhagem de prestígio");
      if (linScore < 8) fracos.push("Linhagem pouco documentada");
      total += linScore;

      // 4. Conformação (15pts)
      const confMedia = (garanhao.conformacao + egua.conformacao) / 2;
      const confScore = Math.round(confMedia * 1.5);
      factores.push({
        nome: "Conformação Morfológica",
        score: confScore,
        max: 15,
        tipo: confScore >= 12 ? "excelente" : confScore >= 9 ? "bom" : "neutro",
        descricao: "Qualidade morfológica média dos progenitores",
      });
      if (confMedia >= 8) fortes.push("Excelente conformação em ambos progenitores");
      total += confScore;

      // 5. Andamentos (10pts)
      const andMedia = (garanhao.andamentos + egua.andamentos) / 2;
      const andScore = Math.round(andMedia);
      factores.push({
        nome: "Qualidade dos Andamentos",
        score: andScore,
        max: 10,
        tipo: andScore >= 8 ? "excelente" : andScore >= 6 ? "bom" : "neutro",
        descricao: "Funcionalidade e expressão de movimentos",
      });
      if (andMedia >= 8) fortes.push("Andamentos de qualidade superior em ambos");
      total += andScore;

      // 6. Temperamento (10pts)
      const tempCompat: Record<string, Record<string, number>> = {
        Calmo: { Calmo: 10, Equilibrado: 9, Energético: 7, Nervoso: 5 },
        Equilibrado: { Calmo: 9, Equilibrado: 10, Energético: 8, Nervoso: 6 },
        Energético: { Calmo: 7, Equilibrado: 8, Energético: 7, Nervoso: 4 },
        Nervoso: { Calmo: 6, Equilibrado: 6, Energético: 4, Nervoso: 3 },
      };
      const tempScore = tempCompat[garanhao.temperamento]?.[egua.temperamento] || 5;
      factores.push({
        nome: "Compatibilidade Temperamento",
        score: tempScore,
        max: 10,
        tipo:
          tempScore >= 8
            ? "excelente"
            : tempScore >= 6
              ? "bom"
              : tempScore >= 4
                ? "aviso"
                : "risco",
        descricao: "Combinação dos temperamentos dos progenitores",
      });
      if (tempScore <= 4)
        riscos.push({ texto: "Temperamentos potencialmente incompatíveis", severidade: "medio" });
      if (tempScore >= 9) fortes.push("Temperamentos complementares");
      total += tempScore;

      // 7. Estado de Saúde (10pts)
      const saudeMedia = (garanhao.saude + egua.saude) / 2;
      const saudeScore = Math.round(saudeMedia);
      factores.push({
        nome: "Estado de Saúde",
        score: saudeScore,
        max: 10,
        tipo: saudeScore >= 8 ? "excelente" : saudeScore >= 6 ? "bom" : "aviso",
        descricao: "Condição veterinária geral dos progenitores",
      });
      if (saudeMedia < 6)
        riscos.push({ texto: "Estado de saúde requer atenção", severidade: "medio" });
      total += saudeScore;

      // 8. Fertilidade (5pts)
      const fertNiveis: Record<string, number> = { "Muito Alta": 5, Alta: 4, Normal: 3, Baixa: 1 };
      const fertScore = Math.round(
        (fertNiveis[garanhao.fertilidade] + fertNiveis[egua.fertilidade]) / 2
      );
      factores.push({
        nome: "Índice de Fertilidade",
        score: fertScore,
        max: 5,
        tipo: fertScore >= 4 ? "excelente" : fertScore >= 3 ? "bom" : "aviso",
        descricao: "Historial reprodutivo dos progenitores",
      });
      if (fertScore <= 2)
        riscos.push({ texto: "Fertilidade baixa pode dificultar concepção", severidade: "medio" });
      total += fertScore;

      // 9. Aprovação como reprodutores (5pts bónus)
      if (garanhao.aprovado && egua.aprovado) {
        total += 5;
        fortes.push("Ambos aprovados oficialmente como reprodutores");
      } else if (!garanhao.aprovado) {
        fracos.push("Garanhão não aprovado como reprodutor");
      }

      // COI e BLUP previstos
      const mesmaCoude =
        garanhao.coudelaria === egua.coudelaria && garanhao.coudelaria !== "Particular";
      const mesmaLinhagem =
        garanhao.linhagemFamosa === egua.linhagemFamosa && garanhao.linhagemFamosa !== "outra";
      let coiPrevisto = (garanhao.coi + egua.coi) / 2;
      if (mesmaCoude) coiPrevisto += 3.125;
      if (mesmaLinhagem) coiPrevisto += 1.5;
      const blupPrevisto = Math.round((garanhao.blup + egua.blup) / 2);

      if (coiPrevisto > 6.25) {
        riscos.push({
          texto: `COI elevado previsto: ${coiPrevisto.toFixed(1)}%`,
          severidade: "alto",
        });
        fracos.push("Consanguinidade elevada pode causar problemas genéticos");
      } else if (coiPrevisto < 3) {
        fortes.push("Baixa consanguinidade - excelente diversidade genética");
      }

      if (blupPrevisto > 110) fortes.push(`BLUP previsto elevado: ${blupPrevisto}`);

      // Defeitos genéticos comuns
      const defeitosComuns = garanhao.defeitos.filter((d) => egua.defeitos.includes(d));
      if (defeitosComuns.length > 0) {
        defeitosComuns.forEach((d) => {
          const defeito = DEFEITOS_GENETICOS.find((def) => def.value === d);
          riscos.push({
            texto: `Ambos portadores de ${defeito?.label || d} - risco para descendência`,
            severidade: "alto",
          });
        });
        total -= defeitosComuns.length * 10;
        fracos.push(`Defeitos genéticos em comum: ${defeitosComuns.join(", ")}`);
      }

      // WFFS específico
      if (garanhao.defeitos.includes("WFFS") && egua.defeitos.includes("WFFS")) {
        riscos.push({
          texto: "RISCO CRÍTICO: 25% dos potros podem ter WFFS fatal",
          severidade: "alto",
        });
      }

      // Previsão de pelagem (simplificada mas mais completa)
      const greyG = garanhao.genetica.grey;
      const greyE = egua.genetica.grey;
      const hasGrey = greyG.includes("G") || greyE.includes("G");

      let probGrey = 0;
      if (greyG === "GG" || greyE === "GG") probGrey = hasGrey ? 100 : 0;
      else if (greyG === "Gg" && greyE === "Gg") probGrey = 75;
      else if (greyG === "Gg" || greyE === "Gg") probGrey = 50;

      const pelagens: ResultadoCompatibilidade["pelagens"] = [];
      if (probGrey > 0) {
        pelagens.push({ cor: "Ruço", prob: probGrey, genetica: "G_" });
      }
      if (probGrey < 100) {
        const restante = 100 - probGrey;
        // Simplificado - em realidade depende de Extension e Agouti
        pelagens.push({ cor: "Castanho", prob: Math.round(restante * 0.5), genetica: "E_A_" });
        pelagens.push({ cor: "Preto", prob: Math.round(restante * 0.3), genetica: "E_aa" });
        pelagens.push({ cor: "Alazão", prob: Math.round(restante * 0.2), genetica: "ee" });
      }

      // Altura prevista do potro
      const alturaMedia = (garanhao.altura + egua.altura) / 2;
      const alturaMin = Math.round(alturaMedia - 4);
      const alturaMax = Math.round(alturaMedia + 4);

      // Nível de compatibilidade
      const nivel =
        total >= 85
          ? "Excelente"
          : total >= 70
            ? "Muito Boa"
            : total >= 55
              ? "Boa"
              : total >= 40
                ? "Razoável"
                : "Problemática";

      // Recomendações
      const recomendacoes: string[] = [];
      if (coiPrevisto > 5) {
        recomendacoes.push(
          "Considere um reprodutor de linhagem diferente para aumentar diversidade genética"
        );
      }
      if (defeitosComuns.length > 0) {
        recomendacoes.push(
          "Recomenda-se teste genético completo antes de prosseguir com cruzamento"
        );
      }
      if (egua.idade > 14) {
        recomendacoes.push("Acompanhamento veterinário intensivo recomendado durante gestação");
      }
      if (tempScore < 7) {
        recomendacoes.push(
          "Potros podem herdar temperamento mais desafiante - preparar para trabalho de doma adequado"
        );
      }
      if (total >= 80) {
        recomendacoes.push(
          "Cruzamento promissor - considere registar potro no Livro de Nascimentos APSL"
        );
      }
      if (andMedia >= 8 && confMedia >= 8) {
        recomendacoes.push(
          "Potencial para potro de competição - considere plano de treino desde jovem"
        );
      }

      const resultadoFinal: ResultadoCompatibilidade = {
        score: Math.max(total, 0),
        nivel,
        coi: coiPrevisto,
        blup: blupPrevisto,
        altura: { min: alturaMin, max: alturaMax },
        pelagens: pelagens.filter((p) => p.prob > 0).sort((a, b) => b.prob - a.prob),
        riscos,
        factores: factores.sort((a, b) => b.score - a.score),
        recomendacoes,
        pontosForteseFracos: { fortes, fracos },
      };

      setResultado(resultadoFinal);
      recordUsage(
        { garanhao: garanhao.nome, egua: egua.nome },
        { score: resultadoFinal.score, nivel: resultadoFinal.nivel }
      );

      setIsCalculating(false);
    }, 2000);
  };

  const resetar = () => {
    setResultado(null);
    setStep(0);
    setGaranhao(criarCavalo("Garanhão"));
    setEgua(criarCavalo("Égua"));
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium hidden sm:block">Portal Lusitano</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Heart size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-white block leading-tight">
                Verificador de Compatibilidade
              </span>
              <span className="text-xs text-zinc-500">Análise Genética para Reprodução</span>
            </div>
          </div>

          {resultado && (
            <button
              onClick={resetar}
              className="text-sm text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Nova análise</span>
            </button>
          )}
        </div>
      </header>

      <div className="pt-16">
        {/* Subscription Banner */}
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <SubscriptionBanner
            isSubscribed={isSubscribed}
            freeUsesLeft={freeUsesLeft}
            requiresAuth={requiresAuth}
          />
        </div>

        {/* ==================== INTRO ==================== */}
        {/* Step transitions */}
        {step === 0 && !resultado && (
          <div className="animate-[fadeSlideIn_0.4s_ease-out_forwards]">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1920')",
                    backgroundPosition: "center 40%",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-black/60" />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <span
                  className="inline-block px-4 py-1.5 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-medium uppercase tracking-[0.2em] rounded-full mb-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.2s" }}
                >
                  Ferramenta de Criação
                </span>

                <h1
                  className="text-4xl sm:text-5xl md:text-6xl font-serif text-white mb-6 leading-tight opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.3s" }}
                >
                  Verificador de
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mt-2">
                    Compatibilidade Genética
                  </span>
                </h1>

                <p
                  className="text-lg text-zinc-300 max-w-2xl mx-auto mb-4 font-serif italic opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.4s" }}
                >
                  &ldquo;Analise a compatibilidade entre garanhão e égua antes do cruzamento.
                  Previsão de COI, BLUP, pelagens e riscos genéticos.&rdquo;
                </p>

                <p
                  className="text-sm text-zinc-500 max-w-xl mx-auto mb-10 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.5s" }}
                >
                  Baseado em princípios de genética equina, índices BLUP e padrões de seleção do
                  Stud Book Lusitano (APSL).
                </p>

                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-400 hover:to-purple-500 transition-all shadow-lg shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.6s" }}
                >
                  <Dna size={20} />
                  Iniciar Análise
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
                    <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Dna className="text-pink-400" size={24} />
                    </div>
                    <h3 className="text-lg font-serif text-white mb-2">Análise de COI</h3>
                    <p className="text-sm text-zinc-400">
                      Cálculo do Coeficiente de Consanguinidade previsto para ajudar a evitar
                      problemas genéticos na descendência.
                    </p>
                  </div>

                  <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Palette className="text-purple-400" size={24} />
                    </div>
                    <h3 className="text-lg font-serif text-white mb-2">Previsão de Pelagem</h3>
                    <p className="text-sm text-zinc-400">
                      Probabilidades de pelagem do potro baseadas nos genótipos Extension, Agouti,
                      Grey e Cream dos progenitores.
                    </p>
                  </div>

                  <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                      <AlertTriangle className="text-amber-400" size={24} />
                    </div>
                    <h3 className="text-lg font-serif text-white mb-2">Riscos Genéticos</h3>
                    <p className="text-sm text-zinc-400">
                      Identificação de defeitos genéticos comuns como WFFS, OCD e outros problemas
                      hereditários a evitar.
                    </p>
                  </div>
                </div>

                <div
                  className="mt-12 p-6 bg-pink-500/5 border border-pink-500/20 rounded-xl opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.8s" }}
                >
                  <div className="flex items-start gap-4">
                    <Info className="text-pink-400 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="text-white font-medium mb-2">Sobre a Análise</h4>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Esta ferramenta analisa mais de 10 parâmetros incluindo idade reprodutiva,
                        compatibilidade física, qualidade genética, conformação, andamentos,
                        temperamento, estado de saúde, fertilidade e defeitos genéticos conhecidos.
                        O resultado inclui previsões de BLUP, COI e pelagem do potro, bem como
                        recomendações personalizadas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================== FORMULÁRIO ==================== */}
        {/* Form step */}
        {step === 1 && !resultado && (
          <div className="max-w-4xl mx-auto px-4 py-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
            {/* Tabs */}
            <div className="flex gap-2 mb-8">
              <button
                onClick={() => setTab("garanhao")}
                className={`flex-1 py-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-all ${
                  tab === "garanhao"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Crown size={20} />
                <div className="text-left">
                  <span className="block font-semibold">Garanhão</span>
                  <span className="text-xs opacity-70">{garanhao.nome || "Não definido"}</span>
                </div>
              </button>
              <button
                onClick={() => setTab("egua")}
                className={`flex-1 py-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-all ${
                  tab === "egua"
                    ? "bg-gradient-to-r from-pink-600 to-pink-500 text-white shadow-lg shadow-pink-500/20"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Heart size={20} />
                <div className="text-left">
                  <span className="block font-semibold">Égua</span>
                  <span className="text-xs opacity-70">{egua.nome || "Não definida"}</span>
                </div>
              </button>
            </div>

            {/* Formulário do Cavalo */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                {tab === "garanhao" ? (
                  <Crown className="text-blue-400" size={24} />
                ) : (
                  <Heart className="text-pink-400" size={24} />
                )}
                <div>
                  <h2 className="text-xl font-serif text-white">Dados do {cavalo.sexo}</h2>
                  <p className="text-sm text-zinc-500">
                    Informações para análise de compatibilidade
                  </p>
                </div>
              </div>

              {/* Identificação */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={cavalo.nome}
                    onChange={(e) => update("nome", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-pink-500 outline-none transition-colors"
                    placeholder={`Nome do ${cavalo.sexo}`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    Idade
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={cavalo.idade}
                      onChange={(e) => update("idade", +e.target.value || 1)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-pink-500 outline-none transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                      anos
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    Altura
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="140"
                      max="180"
                      value={cavalo.altura}
                      onChange={(e) => update("altura", +e.target.value || 160)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-pink-500 outline-none transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                      cm
                    </span>
                  </div>
                </div>
              </div>

              {/* Origem e Linhagem */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    Coudelaria / Origem
                  </label>
                  <select
                    value={cavalo.coudelaria}
                    onChange={(e) => update("coudelaria", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-pink-500 outline-none transition-colors"
                  >
                    {COUDELARIAS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    Qualidade da Linhagem
                  </label>
                  <select
                    value={cavalo.linhagem}
                    onChange={(e) => update("linhagem", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-pink-500 outline-none transition-colors"
                  >
                    {LINHAGENS.map((l) => (
                      <option key={l.value} value={l.value}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Linhagem Famosa */}
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                  Linhagem Principal
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {LINHAGENS_FAMOSAS.map((lin) => (
                    <button
                      key={lin.value}
                      onClick={() => update("linhagemFamosa", lin.value)}
                      className={`py-2 px-3 rounded-lg border text-left transition-all ${
                        cavalo.linhagemFamosa === lin.value
                          ? "border-pink-500 bg-pink-500/10"
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <span
                        className={`block text-sm font-medium ${cavalo.linhagemFamosa === lin.value ? "text-pink-400" : "text-zinc-300"}`}
                      >
                        {lin.label}
                      </span>
                      <span className="text-xs text-zinc-500">{lin.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Genética de Pelagem */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="text-purple-400" size={18} />
                  <label className="text-sm font-medium text-zinc-300">Genética de Pelagem</label>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { gene: "extension" as const, label: "Extension", options: ["EE", "Ee", "ee"] },
                    { gene: "agouti" as const, label: "Agouti", options: ["AA", "Aa", "aa"] },
                    { gene: "grey" as const, label: "Grey", options: ["GG", "Gg", "gg"] },
                    { gene: "cream" as const, label: "Cream", options: ["CrCr", "CrN", "NN"] },
                    { gene: "dun" as const, label: "Dun", options: ["DD", "Dd", "dd"] },
                  ].map(({ gene, label, options }) => (
                    <div key={gene}>
                      <label className="block text-xs text-zinc-500 mb-1">{label}</label>
                      <select
                        value={cavalo.genetica[gene]}
                        onChange={(e) => updateGen(gene, e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-2 text-sm focus:border-purple-500 outline-none"
                      >
                        {options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-600 mt-2">
                  Se desconhecer, mantenha os valores padrão (Ee, Aa, Gg, NN, dd)
                </p>
              </div>

              {/* Avaliações */}
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { field: "conformacao" as const, label: "Conformação", desc: "Morfologia geral" },
                  {
                    field: "andamentos" as const,
                    label: "Andamentos",
                    desc: "Qualidade de movimento",
                  },
                  { field: "saude" as const, label: "Saúde", desc: "Estado veterinário" },
                ].map(({ field, label, desc }) => (
                  <div key={field}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <label className="text-sm text-zinc-300">{label}</label>
                        <span className="text-xs text-zinc-500 ml-2">{desc}</span>
                      </div>
                      <span className="text-pink-400 font-medium">{cavalo[field]}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={cavalo[field]}
                      onChange={(e) => update(field, +e.target.value)}
                      className="w-full h-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    BLUP Index
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="150"
                    value={cavalo.blup}
                    onChange={(e) => update("blup", +e.target.value || 100)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-pink-500 outline-none"
                  />
                  <p className="text-xs text-zinc-600 mt-1">Média da raça: 100</p>
                </div>
              </div>

              {/* Temperamento e Fertilidade */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    Temperamento
                  </label>
                  <select
                    value={cavalo.temperamento}
                    onChange={(e) => update("temperamento", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-pink-500 outline-none"
                  >
                    {TEMPERAMENTOS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label} - {t.desc}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    Fertilidade
                  </label>
                  <select
                    value={cavalo.fertilidade}
                    onChange={(e) => update("fertilidade", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-pink-500 outline-none"
                  >
                    {FERTILIDADES.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    COI Conhecido (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    step="0.5"
                    value={cavalo.coi}
                    onChange={(e) => update("coi", +e.target.value || 0)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:border-pink-500 outline-none"
                  />
                </div>
              </div>

              {/* Aprovação */}
              <div>
                <button
                  onClick={() => update("aprovado", !cavalo.aprovado)}
                  className={`w-full py-3 px-4 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    cavalo.aprovado
                      ? "border-green-500 bg-green-500/10 text-green-400"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {cavalo.aprovado && <CheckCircle size={16} />}
                  {cavalo.aprovado ? "Aprovado como Reprodutor" : "Não Aprovado / Desconhecido"}
                </button>
              </div>

              {/* Defeitos Genéticos */}
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-3">
                  Defeitos Genéticos Conhecidos
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DEFEITOS_GENETICOS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => toggleDefeito(d.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        cavalo.defeitos.includes(d.value)
                          ? d.risco === "alto"
                            ? "border-red-500 bg-red-500/10"
                            : d.risco === "medio"
                              ? "border-amber-500 bg-amber-500/10"
                              : "border-yellow-500 bg-yellow-500/10"
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <span
                        className={`block text-sm font-medium ${
                          cavalo.defeitos.includes(d.value)
                            ? d.risco === "alto"
                              ? "text-red-400"
                              : d.risco === "medio"
                                ? "text-amber-400"
                                : "text-yellow-400"
                            : "text-zinc-300"
                        }`}
                      >
                        {d.label}
                      </span>
                      <span className="text-xs text-zinc-500">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Paywall */}
            {!canUse && (
              <div className="mt-8">
                <Paywall toolName="Verificador de Compatibilidade" requiresAuth={requiresAuth} />
              </div>
            )}

            {/* Botão Analisar */}
            {canUse && (
              <button
                onClick={calcular}
                disabled={isCalculating}
                className="w-full mt-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-pink-500 hover:to-purple-500 transition-all disabled:opacity-50"
              >
                {isCalculating ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    A analisar compatibilidade...
                  </>
                ) : (
                  <>
                    <Dna size={22} />
                    Analisar Compatibilidade
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* ==================== RESULTADO ==================== */}
        {resultado && (
          <div className="max-w-4xl mx-auto px-4 py-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            {/* Score Principal */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-8 border border-zinc-800 mb-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />

              <div className="relative z-10 text-center">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                    resultado.score >= 70
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : resultado.score >= 50
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  {resultado.score >= 70 ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                  <span className="font-semibold">Compatibilidade {resultado.nivel}</span>
                </div>

                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <AnimatedCounter
                    value={resultado.score}
                    duration={2000}
                    className="text-6xl sm:text-7xl font-light text-white"
                  />
                  <span className="text-2xl text-zinc-500">/ 100</span>
                </div>

                <p className="text-zinc-400 text-sm">
                  {garanhao.nome || "Garanhão"} × {egua.nome || "Égua"}
                </p>
              </div>
            </div>

            {/* Result Actions */}
            <div className="mb-6">
              <ResultActions
                onExportPDF={handleExportPDF}
                onShare={handleShare}
                onPrint={() => window.print()}
                isExporting={isExporting}
              />
            </div>

            {/* Métricas Genéticas */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <Dna size={16} className="text-purple-400" />
                  COI Previsto
                </div>
                <div
                  className={`text-3xl font-light ${resultado.coi > 6.25 ? "text-amber-400" : "text-emerald-400"}`}
                >
                  {resultado.coi.toFixed(1)}%
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  {resultado.coi <= 3
                    ? "Excelente"
                    : resultado.coi <= 6.25
                      ? "Aceitável"
                      : "Elevado"}
                </div>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <Activity size={16} className="text-blue-400" />
                  BLUP Previsto
                </div>
                <div className="text-3xl font-light text-blue-400">{resultado.blup}</div>
                <div className="text-xs text-zinc-500 mt-1">Média da raça: 100</div>
              </div>

              <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-400 text-sm mb-2">
                  <Baby size={16} className="text-pink-400" />
                  Altura Estimada
                </div>
                <div className="text-3xl font-light text-pink-400">
                  {resultado.altura.min}-{resultado.altura.max}
                  <span className="text-lg">cm</span>
                </div>
                <div className="text-xs text-zinc-500 mt-1">Do potro adulto</div>
              </div>
            </div>

            {/* Pontos Fortes e Fracos */}
            {(resultado.pontosForteseFracos.fortes.length > 0 ||
              resultado.pontosForteseFracos.fracos.length > 0) && (
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {resultado.pontosForteseFracos.fortes.length > 0 && (
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                      <TrendingUp size={16} />
                      Pontos Fortes
                    </h3>
                    <ul className="space-y-2">
                      {resultado.pontosForteseFracos.fortes.map((ponto, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                          <CheckCircle
                            size={14}
                            className="text-emerald-400 mt-0.5 flex-shrink-0"
                          />
                          {ponto}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {resultado.pontosForteseFracos.fracos.length > 0 && (
                  <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                      <AlertTriangle size={16} />
                      Pontos de Atenção
                    </h3>
                    <ul className="space-y-2">
                      {resultado.pontosForteseFracos.fracos.map((ponto, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                          <Info size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                          {ponto}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Previsão de Pelagem */}
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 mb-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Palette className="text-purple-400" size={18} />
                Previsão de Pelagem do Potro
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {resultado.pelagens.map((p, i) => (
                  <div key={i} className="bg-zinc-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-zinc-300 font-medium">{p.cor}</span>
                      <span className="text-purple-400 font-bold">{p.prob}%</span>
                    </div>
                    <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${p.prob}%` }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500 mt-1 block">{p.genetica}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Riscos */}
            {resultado.riscos.length > 0 && (
              <div className="mb-6 space-y-2">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="text-amber-400" size={18} />
                  Alertas e Riscos
                </h3>
                {resultado.riscos.map((r, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg flex items-center gap-3 ${
                      r.severidade === "alto"
                        ? "bg-red-500/10 border border-red-500/30"
                        : r.severidade === "medio"
                          ? "bg-amber-500/10 border border-amber-500/30"
                          : "bg-yellow-500/10 border border-yellow-500/30"
                    }`}
                  >
                    <AlertTriangle
                      size={18}
                      className={
                        r.severidade === "alto"
                          ? "text-red-400"
                          : r.severidade === "medio"
                            ? "text-amber-400"
                            : "text-yellow-400"
                      }
                    />
                    <span className="text-sm text-zinc-300">{r.texto}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Factores Detalhados */}
            <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 mb-6">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
                Análise Detalhada por Factor
              </h3>
              <div className="space-y-4">
                {resultado.factores.map((f, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-sm text-zinc-300">{f.nome}</span>
                        <span className="text-xs text-zinc-600 ml-2 hidden sm:inline">
                          {f.descricao}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          f.tipo === "excelente"
                            ? "text-emerald-400"
                            : f.tipo === "bom"
                              ? "text-blue-400"
                              : f.tipo === "aviso"
                                ? "text-amber-400"
                                : f.tipo === "risco"
                                  ? "text-red-400"
                                  : "text-zinc-400"
                        }`}
                      >
                        {f.score}/{f.max}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          f.tipo === "excelente"
                            ? "bg-emerald-500"
                            : f.tipo === "bom"
                              ? "bg-blue-500"
                              : f.tipo === "aviso"
                                ? "bg-amber-500"
                                : f.tipo === "risco"
                                  ? "bg-red-500"
                                  : "bg-zinc-500"
                        }`}
                        style={{ width: `${(f.score / f.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendações */}
            {resultado.recomendacoes.length > 0 && (
              <div className="bg-pink-500/5 rounded-xl p-6 border border-pink-500/20 mb-6">
                <h3 className="text-sm font-medium text-pink-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles size={16} />
                  Recomendações
                </h3>
                <ul className="space-y-3">
                  {resultado.recomendacoes.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                      <ChevronRight size={16} className="text-pink-400 flex-shrink-0 mt-0.5" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
              <p className="text-xs text-zinc-500 leading-relaxed">
                <strong className="text-zinc-400">Aviso:</strong> Esta análise é uma ferramenta de
                apoio à decisão e não substitui a consulta de um veterinário especializado em
                reprodução equina ou geneticista. Os resultados são estimativas baseadas nos dados
                fornecidos. Recomendamos sempre realizar testes genéticos completos antes de
                qualquer cruzamento.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

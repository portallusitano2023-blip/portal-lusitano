"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  X,
  Scale,
  Trophy,
  Euro,
  Crown,
  Activity,
  TrendingUp,
  BarChart3,
  ChevronRight,
  RefreshCw,
  Check,
} from "lucide-react";
import ResultActions from "@/components/tools/ResultActions";
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";
import ProUpgradeCard from "@/components/tools/ProUpgradeCard";
import Confetti from "@/components/tools/Confetti";
import BlurredProSection from "@/components/tools/BlurredProSection";
import HorseVerdictCard from "@/components/tools/HorseVerdictCard";
import CostProjectionTable from "@/components/tools/CostProjectionTable";
import Paywall from "@/components/tools/Paywall";
import CategoryRanking from "@/components/tools/CategoryRanking";
import SuitabilityProfile from "@/components/tools/SuitabilityProfile";
import GapAnalysis from "@/components/tools/GapAnalysis";
import PurchaseConfidence from "@/components/tools/PurchaseConfidence";
import { useToolAccess } from "@/hooks/useToolAccess";
import { shareNative, copyToClipboard } from "@/lib/tools/share-utils";
import { useLanguage } from "@/context/LanguageContext";
import Tooltip from "@/components/tools/Tooltip";
import SourceBadge from "@/components/tools/SourceBadge";
import MethodologyPanel from "@/components/tools/MethodologyPanel";
import ScoreBreakdown from "@/components/tools/ScoreBreakdown";

// ============================================
// TIPOS
// ============================================

interface Cavalo {
  id: string;
  nome: string;
  idade: number;
  sexo: string;
  altura: number;
  pelagem: string;
  linhagem: string;
  linhagemFamosa: string;
  treino: string;
  temperamento: number;
  saude: number;
  conformacao: number;
  andamentos: number;
  elevacao: number;
  regularidade: number;
  competicoes: string;
  premios: number;
  preco: number;
  blup: number;
  registoAPSL: boolean;
}

// ============================================
// DADOS PROFISSIONAIS
// ============================================

const criarCavalo = (id: string, nome: string): Cavalo => ({
  id,
  nome,
  idade: 8,
  sexo: "Garanhão",
  altura: 162,
  pelagem: "Ruço",
  linhagem: "Certificada",
  linhagemFamosa: "veiga",
  treino: "Elementar",
  temperamento: 7,
  saude: 8,
  conformacao: 7,
  andamentos: 7,
  elevacao: 7,
  regularidade: 7,
  competicoes: "Nenhuma",
  premios: 0,
  preco: 25000,
  blup: 100,
  registoAPSL: true,
});

const PELAGENS = [
  { value: "Ruço", label: "Ruço" },
  { value: "Castanho", label: "Castanho" },
  { value: "Preto", label: "Preto" },
  { value: "Alazão", label: "Alazão" },
  { value: "Baio", label: "Baio" },
  { value: "Palomino", label: "Palomino" },
  { value: "Isabelo", label: "Isabelo" },
];

const LINHAGENS = [
  { value: "Desconhecida", label: "Desconhecida", mult: 0.7 },
  { value: "Registada", label: "Registada APSL", mult: 1.0 },
  { value: "Certificada", label: "Certificada", mult: 1.2 },
  { value: "Premium", label: "Premium", mult: 1.5 },
  { value: "Elite", label: "Elite", mult: 2.0 },
];

const TREINOS = [
  { value: "Potro", label: "Potro", nivel: 1 },
  { value: "Desbravado", label: "Desbravado", nivel: 2 },
  { value: "Iniciado", label: "Iniciado", nivel: 3 },
  { value: "Elementar", label: "Elementar", nivel: 4 },
  { value: "Médio", label: "Médio (M)", nivel: 5 },
  { value: "Avançado", label: "Avançado (S)", nivel: 6 },
  { value: "Alta Escola", label: "Alta Escola", nivel: 7 },
  { value: "Grand Prix", label: "Grand Prix", nivel: 8 },
];

const SEXOS = [
  { value: "Garanhão", label: "Garanhão" },
  { value: "Égua", label: "Égua" },
  { value: "Castrado", label: "Castrado" },
];

const COMPETICOES = [
  { value: "Nenhuma", label: "Nenhuma", mult: 1.0 },
  { value: "Regional", label: "Regional", mult: 1.1 },
  { value: "Nacional", label: "Nacional", mult: 1.25 },
  { value: "Internacional", label: "Internacional", mult: 1.5 },
];

// ============================================
// COMPONENTE RADAR CHART
// ============================================

const RadarChart = ({
  cavalos,
  labels,
}: {
  cavalos: { nome: string; valores: number[]; cor: string }[];
  labels: string[];
}) => {
  const size = 280;
  const center = size / 2;
  const radius = size * 0.38;
  const angleStep = (2 * Math.PI) / labels.length;

  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 10) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="mx-auto w-full max-w-[280px]"
      style={{ height: "auto" }}
    >
      {/* Grid circles */}
      {[2, 4, 6, 8, 10].map((level) => (
        <polygon
          key={level}
          points={labels
            .map((_, i) => {
              const p = getPoint(level, i);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {/* Axes */}
      {labels.map((_, i) => {
        const p = getPoint(10, i);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        );
      })}
      {/* Data polygons */}
      {cavalos.map((cavalo, ci) => (
        <polygon
          key={ci}
          points={cavalo.valores
            .map((v, i) => {
              const p = getPoint(v, i);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill={`${cavalo.cor}20`}
          stroke={cavalo.cor}
          strokeWidth="2"
          style={{ opacity: 0, animation: `fadeSlideIn 0.5s ease-out ${ci * 0.2}s forwards` }}
        />
      ))}
      {/* Labels */}
      {labels.map((label, i) => {
        const p = getPoint(12, i);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            fill="rgba(255,255,255,0.6)"
            fontSize="10"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

// ============================================
// CHAVE DE AUTO-SAVE E TOOL CHAIN
// ============================================

const DRAFT_KEY = "comparador_draft_v1";
const CHAIN_KEY = "tool_chain_horse";

// ============================================
// UTILITÁRIO CSV
// ============================================

function exportarCSV(cavalos: Cavalo[], calcularScore: (c: Cavalo) => number) {
  const headers = [
    "Nome",
    "Idade",
    "Sexo",
    "Altura (cm)",
    "Pelagem",
    "Linhagem",
    "Treino",
    "Conformação",
    "Andamentos",
    "Elevação",
    "Regularidade",
    "Temperamento",
    "Saúde",
    "Competições",
    "Prémios",
    "Preço (€)",
    "BLUP",
    "Registo APSL",
    "Score Global",
    "Valor por Ponto (€)",
  ];

  const rows = cavalos.map((c) => {
    const score = calcularScore(c);
    const valorPorPonto = score > 0 ? Math.round(c.preco / score) : 0;
    return [
      c.nome,
      c.idade,
      c.sexo,
      c.altura,
      c.pelagem,
      c.linhagem,
      c.treino,
      c.conformacao,
      c.andamentos,
      c.elevacao,
      c.regularidade,
      c.temperamento,
      c.saude,
      c.competicoes,
      c.premios,
      c.preco,
      c.blup,
      c.registoAPSL ? "Sim" : "Não",
      score,
      valorPorPonto,
    ];
  });

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell);
          // Escapar aspas e envolver em aspas se contiver vírgula ou aspas
          return str.includes(",") || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
        })
        .join(",")
    )
    .join("\n");

  // BOM para compatibilidade com Excel (caracteres portugueses)
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `comparacao-cavalos-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ComparadorCavalosPage() {
  const { t } = useLanguage();
  const [cavalos, setCavalos] = useState<Cavalo[]>([
    criarCavalo("1", "Cavalo A"),
    criarCavalo("2", "Cavalo B"),
  ]);
  const [step, setStep] = useState(0); // 0 = intro
  const [showAnalise, setShowAnalise] = useState(false);
  const [calculando, setCalculando] = useState(false);
  const [calculandoStep, setCalculandoStep] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftDate, setDraftDate] = useState<string>("");
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const {
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    recordUsage,
    isLoading: accessLoading,
  } = useToolAccess("comparador");

  // ============================================
  // AUTO-SAVE + TOOL CHAIN (on mount)
  // ============================================

  useEffect(() => {
    try {
      // Verificar tool chain (vindo de outra ferramenta)
      const chain = sessionStorage.getItem(CHAIN_KEY);
      if (chain) {
        const { source, horse } = JSON.parse(chain) as { source: string; horse: Partial<Cavalo> };
        if (source === "calculadora" && horse) {
          const novo = { ...criarCavalo("1", horse.nome || "Cavalo A"), ...horse, id: "1" };
          setCavalos([novo, criarCavalo("2", "Cavalo B"), criarCavalo("3", "Cavalo C")]);
          sessionStorage.removeItem(CHAIN_KEY);
          setStep(1);
          return; // Não restaurar draft se há chain
        }
      }

      // Verificar draft guardado
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const { savedAt } = JSON.parse(saved) as { savedAt: string };
        const age = Date.now() - new Date(savedAt).getTime();
        if (age < 7 * 24 * 60 * 60 * 1000) {
          setHasDraft(true);
          setDraftDate(
            new Date(savedAt).toLocaleDateString("pt-PT", {
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        } else {
          localStorage.removeItem(DRAFT_KEY);
        }
      }
    } catch {}
  }, []);

  // Auto-save com debounce de 800ms
  useEffect(() => {
    if (step === 0 || showAnalise) return; // Não guardar no intro nem depois de analisar
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ cavalos, savedAt: new Date().toISOString() })
        );
      } catch {}
    }, 800);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [cavalos, step, showAnalise]);

  const restaurarDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const { cavalos: savedCavalos } = JSON.parse(saved) as { cavalos: Cavalo[] };
        setCavalos(savedCavalos);
        setStep(1);
        setHasDraft(false);
      }
    } catch {}
  };

  const descartarDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setHasDraft(false);
  };

  const handleExportCSV = () => {
    exportarCSV(cavalos, calcularScore);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const scores = cavalos.map((c) => calcularScore(c));
      const vencedorNome = cavalos.reduce((a, b) =>
        calcularScore(a) > calcularScore(b) ? a : b
      ).nome;
      const melhorValorNome = cavalos.reduce((a, b) =>
        calcularValorPorPonto(a) < calcularValorPorPonto(b) ? a : b
      ).nome;
      const { generateComparadorPDF } = await import("@/lib/tools/pdf/comparador-pdf");
      generateComparadorPDF(cavalos, scores, vencedorNome, melhorValorNome);
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("[Comparador]", error);
      alert("Erro ao exportar PDF. Tente novamente.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${t.comparador.tool_name} - Portal Lusitano`;
    const shared = await shareNative(t.comparador.tool_name, text, url);
    if (!shared) await copyToClipboard(url);
  };

  const cores = ["#C5A059", "#3b82f6", "#ec4899", "#22c55e"];

  const adicionar = () => {
    if (cavalos.length >= 4) return;
    const id = String(Date.now());
    setCavalos([...cavalos, criarCavalo(id, `Cavalo ${String.fromCharCode(65 + cavalos.length)}`)]);
  };

  const remover = (id: string) => {
    if (cavalos.length <= 2) return;
    setCavalos(cavalos.filter((c) => c.id !== id));
  };

  const update = (id: string, campo: keyof Cavalo, valor: Cavalo[keyof Cavalo]) => {
    setCavalos(cavalos.map((c) => (c.id === id ? { ...c, [campo]: valor } : c)));
  };

  const calcularScore = (c: Cavalo): number => {
    let score = 0;

    // Idade (ideal 6-12) - 10pts
    score += c.idade >= 6 && c.idade <= 12 ? 10 : c.idade >= 4 && c.idade <= 15 ? 7 : 4;

    // Altura (ideal 158-168) - 8pts
    score += c.altura >= 158 && c.altura <= 168 ? 8 : c.altura >= 155 && c.altura <= 170 ? 6 : 4;

    // Linhagem - 15pts
    const linPoints: Record<string, number> = {
      Desconhecida: 3,
      Registada: 8,
      Certificada: 11,
      Premium: 13,
      Elite: 15,
    };
    score += linPoints[c.linhagem] || 8;

    // Treino - 15pts
    const treino = TREINOS.find((t) => t.value === c.treino);
    score += treino ? Math.round(treino.nivel * 1.9) : 5;

    // Conformação - 10pts
    score += c.conformacao;

    // Andamentos - 10pts
    score += c.andamentos;

    // Elevação e Regularidade - 5pts cada
    score += Math.round(c.elevacao / 2);
    score += Math.round(c.regularidade / 2);

    // Temperamento - 7pts
    score += Math.round(c.temperamento * 0.7);

    // Saúde - 7pts
    score += Math.round(c.saude * 0.7);

    // Competições - 8pts
    const comp = COMPETICOES.find((co) => co.value === c.competicoes);
    score += comp ? Math.round((comp.mult - 1) * 20 + 5) : 5;

    // BLUP bónus - 5pts
    score += c.blup > 110 ? 5 : c.blup > 100 ? 3 : 1;

    // Registo APSL bónus
    if (c.registoAPSL) score += 3;

    return Math.min(score, 100);
  };

  const calcularValorPorPonto = (c: Cavalo): number => {
    const score = calcularScore(c);
    return score > 0 ? Math.round(c.preco / score) : 0;
  };

  const getScoreFactors = (
    c: Cavalo
  ): { name: string; weight: string; score: number; max: number }[] => {
    // Idade (ideal 6-12) - 10pts
    const idadeScore = c.idade >= 6 && c.idade <= 12 ? 10 : c.idade >= 4 && c.idade <= 15 ? 7 : 4;

    // Altura (ideal 158-168) - 8pts
    const alturaScore =
      c.altura >= 158 && c.altura <= 168 ? 8 : c.altura >= 155 && c.altura <= 170 ? 6 : 4;

    // Linhagem - 15pts
    const linPoints: Record<string, number> = {
      Desconhecida: 3,
      Registada: 8,
      Certificada: 11,
      Premium: 13,
      Elite: 15,
    };
    const linhagemScore = linPoints[c.linhagem] || 8;

    // Treino - 15pts
    const treinoObj = TREINOS.find((tr) => tr.value === c.treino);
    const treinoScore = treinoObj ? Math.round(treinoObj.nivel * 1.9) : 5;

    // Elevacao - 5pts
    const elevacaoScore = Math.round(c.elevacao / 2);

    // Regularidade - 5pts
    const regularidadeScore = Math.round(c.regularidade / 2);

    // Temperamento - 7pts
    const temperamentoScore = Math.round(c.temperamento * 0.7);

    // Saude - 7pts
    const saudeScore = Math.round(c.saude * 0.7);

    // Competicoes - 8pts
    const comp = COMPETICOES.find((co) => co.value === c.competicoes);
    const compScore = comp ? Math.round((comp.mult - 1) * 20 + 5) : 5;

    // BLUP - 5pts
    const blupScore = c.blup > 110 ? 5 : c.blup > 100 ? 3 : 1;

    // APSL - 3pts
    const apslScore = c.registoAPSL ? 3 : 0;

    return [
      { name: "Linhagem", weight: "15%", score: linhagemScore, max: 15 },
      { name: "Treino", weight: "15%", score: treinoScore, max: 15 },
      { name: "Conformacao", weight: "10%", score: c.conformacao, max: 10 },
      { name: "Andamentos", weight: "10%", score: c.andamentos, max: 10 },
      { name: "Idade", weight: "10%", score: idadeScore, max: 10 },
      { name: "Competicoes", weight: "8%", score: compScore, max: 8 },
      { name: "Altura", weight: "8%", score: alturaScore, max: 8 },
      { name: "Temperamento", weight: "7%", score: temperamentoScore, max: 7 },
      { name: "Saude", weight: "7%", score: saudeScore, max: 7 },
      { name: "BLUP", weight: "5%", score: blupScore, max: 5 },
      { name: "Elevacao", weight: "5%", score: elevacaoScore, max: 5 },
      { name: "Regularidade", weight: "5%", score: regularidadeScore, max: 5 },
      { name: "Registo APSL", weight: "3%", score: apslScore, max: 3 },
    ];
  };

  const getMelhor = (campo: keyof Cavalo, maior = true) => {
    const vals = cavalos.map((c) => c[campo] as number);
    return maior ? Math.max(...vals) : Math.min(...vals);
  };

  const getClasseCor = (val: number, melhor: number, maior = true) => {
    if (maior) {
      return val === melhor
        ? "text-emerald-400 font-semibold"
        : val < melhor * 0.8
          ? "text-red-400"
          : "text-[var(--foreground-secondary)]";
    }
    return val === melhor
      ? "text-emerald-400 font-semibold"
      : val > melhor * 1.2
        ? "text-red-400"
        : "text-[var(--foreground-secondary)]";
  };

  const vencedor = cavalos.reduce((a, b) => (calcularScore(a) > calcularScore(b) ? a : b));
  const melhorValor = cavalos.reduce((a, b) =>
    calcularValorPorPonto(a) < calcularValorPorPonto(b) ? a : b
  );

  // ============================================
  // PRO: Verdict generation
  // ============================================
  const gerarVeredicto = (c: Cavalo) => {
    const score = calcularScore(c);
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    if (c.conformacao >= 8) strengths.push("Conformação excelente");
    else if (c.conformacao <= 5) weaknesses.push("Conformação abaixo da média");
    if (c.andamentos >= 8) strengths.push("Andamentos de alta qualidade");
    else if (c.andamentos <= 5) weaknesses.push("Andamentos precisam de trabalho");
    if (c.temperamento >= 8) strengths.push("Temperamento exemplar");
    else if (c.temperamento <= 5) weaknesses.push("Temperamento pode ser desafiante");
    if (c.saude >= 8) strengths.push("Excelente estado de saúde");
    else if (c.saude <= 5) weaknesses.push("Saúde requer atenção");
    if (c.blup > 110) strengths.push("BLUP acima da média da raça");
    else if (c.blup < 90) weaknesses.push("BLUP abaixo da média");
    if (c.registoAPSL) strengths.push("Registo APSL confirmado");
    else weaknesses.push("Sem registo APSL");
    if (c.idade >= 6 && c.idade <= 12) strengths.push("Idade ideal de performance");
    else if (c.idade > 16) weaknesses.push("Idade avançada");
    if (c.competicoes === "Internacional") strengths.push("Experiência internacional");
    if (c.competicoes === "Nacional") strengths.push("Experiência em competição nacional");

    const bestUse =
      c.competicoes !== "Nenhuma"
        ? "Competição"
        : c.sexo === "Égua" && c.conformacao >= 7
          ? "Criação"
          : score >= 60
            ? "Investimento"
            : "Lazer";

    const riskLevel: "Baixo" | "Medio" | "Alto" =
      c.idade > 16 || c.saude <= 5 ? "Alto" : c.idade > 14 || c.saude <= 6 ? "Medio" : "Baixo";

    const recommendation =
      score >= 75
        ? `${c.nome} é um cavalo excepcional com elevado potencial. A combinação de ${c.treino.toLowerCase()} com ${c.linhagem.toLowerCase()} torna-o uma escolha sólida para ${bestUse.toLowerCase()}.`
        : score >= 50
          ? `${c.nome} apresenta qualidades interessantes para ${bestUse.toLowerCase()}. Recomenda-se investir em treino para maximizar o potencial demonstrado.`
          : `${c.nome} necessita de desenvolvimento em várias áreas. Considere uma avaliação veterinária detalhada antes de avançar.`;

    return {
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      bestUse,
      riskLevel,
      recommendation,
    };
  };

  // ============================================
  // PRO: Cost projections
  // ============================================
  const gerarCustos = (c: Cavalo) => {
    const treino = TREINOS.find((t) => t.value === c.treino);
    const nivel = treino?.nivel ?? 4;
    const baseTraining = 200 + nivel * 100;

    return {
      nome: c.nome,
      purchasePrice: c.preco,
      annualCosts: {
        pensao: 400 * 12,
        alimentacao: 150 * 12,
        veterinario: 80 * 12,
        ferrador: 60 * 12,
        treino: baseTraining * 12,
        seguro: Math.round(c.preco * 0.04),
      },
      estimatedValue5yr: Math.round(
        c.preco * (c.idade >= 4 && c.idade <= 10 ? 1.1 : c.idade > 14 ? 0.6 : 0.85)
      ),
    };
  };

  const resetar = () => {
    setStep(0);
    setShowAnalise(false);
    setCavalos([criarCavalo("1", "Cavalo A"), criarCavalo("2", "Cavalo B")]);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setHasDraft(false);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium hidden sm:block">Portal Lusitano</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Scale size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-[var(--foreground)] block leading-tight">
                {t.comparador.tool_name}
              </span>
              <span className="text-xs text-[var(--foreground-muted)]">
                {t.comparador.tool_subtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={adicionar}
                disabled={cavalos.length >= 4}
                className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">{t.comparador.btn_add}</span>
              </button>
            )}
            {showAnalise && (
              <button
                onClick={resetar}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={14} />
                <span className="hidden sm:inline">{t.comparador.new_comparison}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="pt-16">
        {/* ==================== INTRO ==================== */}
        {step === 0 && (
          <div className="animate-[fadeSlideIn_0.4s_ease-out_forwards]">
            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?q=80&w=1920')",
                    backgroundPosition: "center 40%",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-black/60" />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <span
                  className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium uppercase tracking-[0.2em] rounded-full mb-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.2s" }}
                >
                  {t.comparador.badge}
                </span>

                <h1
                  className="text-4xl sm:text-5xl md:text-6xl font-serif text-[var(--foreground)] mb-6 leading-tight opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.3s" }}
                >
                  {t.comparador.title_prefix}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-2">
                    {t.comparador.title_accent}
                  </span>
                </h1>

                <p
                  className="text-lg text-[var(--foreground-secondary)] max-w-2xl mx-auto mb-4 font-serif italic opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.4s" }}
                >
                  &ldquo;{t.comparador.intro_quote}&rdquo;
                </p>

                <p
                  className="text-sm text-[var(--foreground-muted)] max-w-xl mx-auto mb-10 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.5s" }}
                >
                  {t.comparador.intro_desc}
                </p>

                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-400 hover:to-blue-500 transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.6s" }}
                >
                  <Scale size={20} />
                  {t.comparador.start_btn}
                  <ChevronRight size={18} />
                </button>

                {/* Banner draft guardado */}
                {hasDraft && (
                  <div
                    className="mt-6 flex flex-col sm:flex-row items-center gap-3 px-5 py-4 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl max-w-sm mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                    style={{ animationDelay: "0.7s" }}
                  >
                    <p className="text-xs text-[var(--gold)] flex-1 text-center sm:text-left">
                      Tem uma comparação guardada de {draftDate}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={restaurarDraft}
                        className="px-3 py-1.5 bg-[var(--gold)] text-black text-xs font-bold rounded-lg hover:bg-[#D4B068] transition-colors"
                      >
                        Continuar
                      </button>
                      <button
                        onClick={descartarDraft}
                        className="px-3 py-1.5 bg-transparent border border-[var(--gold)]/40 text-[var(--gold)] text-xs rounded-lg hover:bg-[var(--gold)]/10 transition-colors"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Features */}
            <section className="py-16 px-6">
              <div className="max-w-6xl mx-auto">
                <div
                  className="grid md:grid-cols-3 gap-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.7s" }}
                >
                  <div className="p-6 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-lg font-serif text-[var(--foreground)] mb-2">
                      {t.comparador.feat_radar}
                    </h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                      {t.comparador.feat_radar_desc}
                    </p>
                  </div>

                  <div className="p-6 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Scale className="text-emerald-400" size={24} />
                    </div>
                    <h3 className="text-lg font-serif text-[var(--foreground)] mb-2">
                      {t.comparador.feat_table}
                    </h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                      {t.comparador.feat_table_desc}
                    </p>
                  </div>

                  <div className="p-6 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Euro className="text-amber-400" size={24} />
                    </div>
                    <h3 className="text-lg font-serif text-[var(--foreground)] mb-2">
                      {t.comparador.feat_value}
                    </h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                      {t.comparador.feat_value_desc}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================== COMPARAÇÃO ==================== */}
        {step === 1 && (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
            {/* Cards dos Cavalos */}
            <div
              className={`grid gap-4 mb-8 ${
                cavalos.length === 2
                  ? "md:grid-cols-2"
                  : cavalos.length === 3
                    ? "md:grid-cols-3"
                    : "md:grid-cols-4"
              }`}
            >
              {cavalos.map((c, i) => (
                <div
                  key={c.id}
                  className="bg-[var(--background-secondary)]/50 rounded-2xl border border-[var(--border)] overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Header do Card */}
                  <div
                    className="p-4 border-b border-[var(--border)]"
                    style={{ borderTopWidth: 3, borderTopColor: cores[i] }}
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={c.nome}
                        onChange={(e) => update(c.id, "nome", e.target.value)}
                        className="bg-transparent text-lg font-semibold outline-none flex-1 text-[var(--foreground)]"
                        placeholder={t.comparador.placeholder_horse_name}
                      />
                      {cavalos.length > 2 && (
                        <button
                          onClick={() => remover(c.id)}
                          className="text-[var(--foreground-muted)] hover:text-red-400 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                    {showAnalise && (
                      <div className="mt-2 flex gap-2">
                        {c.id === vencedor.id && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded text-amber-400 text-xs">
                            <Crown size={12} />
                            {t.comparador.best_score}
                          </span>
                        )}
                        {c.id === melhorValor.id && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded text-emerald-400 text-xs">
                            <Euro size={12} />
                            {t.comparador.best_value}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Campos */}
                  <div className="p-4 space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[var(--foreground-muted)] block mb-1">
                          {t.comparador.label_age}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={c.idade}
                          onChange={(e) => update(c.id, "idade", +e.target.value || 1)}
                          className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[var(--foreground-muted)] block mb-1">
                          {t.comparador.label_height}
                        </label>
                        <input
                          type="number"
                          min="140"
                          max="180"
                          value={c.altura}
                          onChange={(e) => update(c.id, "altura", +e.target.value || 160)}
                          className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-[var(--foreground-muted)] block mb-1">
                        {t.comparador.label_sex}
                      </label>
                      <select
                        value={c.sexo}
                        onChange={(e) => update(c.id, "sexo", e.target.value)}
                        className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                      >
                        {SEXOS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[var(--foreground-muted)] block mb-1">
                          {t.comparador.label_coat}
                        </label>
                        <select
                          value={c.pelagem}
                          onChange={(e) => update(c.id, "pelagem", e.target.value)}
                          className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                        >
                          {PELAGENS.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-[var(--foreground-muted)] block mb-1">
                          {t.comparador.label_lineage}
                        </label>
                        <select
                          value={c.linhagem}
                          onChange={(e) => update(c.id, "linhagem", e.target.value)}
                          className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                        >
                          {LINHAGENS.map((l) => (
                            <option key={l.value} value={l.value}>
                              {l.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-[var(--foreground-muted)] block mb-1">
                        {t.comparador.label_training}
                      </label>
                      <select
                        value={c.treino}
                        onChange={(e) => update(c.id, "treino", e.target.value)}
                        className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                      >
                        {TREINOS.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sliders */}
                    {[
                      { field: "conformacao" as const, label: t.comparador.label_conformation },
                      { field: "andamentos" as const, label: t.comparador.label_gaits },
                      { field: "temperamento" as const, label: t.comparador.label_temperament },
                      { field: "saude" as const, label: t.comparador.label_health },
                    ].map(({ field, label }) => (
                      <div key={field}>
                        <div className="flex justify-between mb-1">
                          <label className="text-xs text-[var(--foreground-muted)]">{label}</label>
                          <span className="text-xs font-medium" style={{ color: cores[i] }}>
                            {c[field]}/10
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={c[field]}
                          onChange={(e) => update(c.id, field, +e.target.value)}
                          className="w-full h-1.5 bg-[var(--background-card)] rounded-full appearance-none cursor-pointer"
                          style={{ accentColor: cores[i] }}
                        />
                      </div>
                    ))}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[var(--foreground-muted)] block mb-1">
                          {t.comparador.label_competitions}
                        </label>
                        <select
                          value={c.competicoes}
                          onChange={(e) => update(c.id, "competicoes", e.target.value)}
                          className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                        >
                          {COMPETICOES.map((co) => (
                            <option key={co.value} value={co.value}>
                              {co.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-[var(--foreground-muted)] block mb-1">
                          BLUP
                        </label>
                        <input
                          type="number"
                          min="50"
                          max="150"
                          value={c.blup}
                          onChange={(e) => update(c.id, "blup", +e.target.value || 100)}
                          className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-[var(--foreground-muted)] block mb-1">
                        {t.comparador.label_price}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={c.preco}
                        onChange={(e) => update(c.id, "preco", +e.target.value || 0)}
                        className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <button
                      onClick={() => update(c.id, "registoAPSL", !c.registoAPSL)}
                      className={`w-full py-2 px-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        c.registoAPSL
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                          : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
                      }`}
                    >
                      {c.registoAPSL && <Check size={14} />}
                      {t.comparador.label_apsl_reg}
                    </button>
                  </div>

                  {/* Score Preview */}
                  {showAnalise && (
                    <div className="p-4 bg-[var(--background-card)]/50 border-t border-[var(--border)]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--foreground-secondary)] flex items-center gap-1.5">
                          {t.comparador.score_total}
                          <Tooltip
                            text={
                              (t.comparador as Record<string, string>).tooltip_score ??
                              "Score composto (0-100) que pondera: Linhagem (15%), Treino (15%), Conformacao (10%), Andamentos (10%), Idade (10%), Altura (8%), Temperamento (7%), Saude (7%), BLUP (5%), Competicoes (8%), APSL (3%), Elevacao+Regularidade (5%)."
                            }
                          />
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="text-2xl font-bold" style={{ color: cores[i] }}>
                            {calcularScore(c)}
                          </span>
                          <SourceBadge source="modelo" />
                        </span>
                      </div>
                      <div className="text-xs text-[var(--foreground-muted)] flex items-center gap-1.5">
                        {t.comparador.value_per_point}{" "}
                        <span className="text-[var(--foreground-secondary)]">
                          {calcularValorPorPonto(c).toLocaleString("pt-PT")}€
                        </span>
                        <Tooltip
                          text={
                            (t.comparador as Record<string, string>).tooltip_valor_ponto ??
                            "Preco dividido pelo score total. Quanto menor, melhor a relacao custo-beneficio."
                          }
                        />
                      </div>
                      <div className="mt-3">
                        <ScoreBreakdown factors={getScoreFactors(c)} total={calcularScore(c)} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* PRO Status Bar */}
            {!accessLoading && isSubscribed && (
              <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg p-3 flex items-center gap-2 mb-6 text-sm">
                <Crown size={14} className="text-[#C5A059] shrink-0" aria-hidden="true" />
                <span className="text-[#C5A059] font-semibold">PRO Activo</span>
                <span className="text-[#C5A059]/50">•</span>
                <span className="text-[#C5A059]/80">Utilizações ilimitadas</span>
                <span className="text-[#C5A059]/50">•</span>
                <span className="text-[#C5A059]/80">Comparador desbloqueado</span>
                <a
                  href="/ferramentas/historico"
                  className="ml-auto text-[#C5A059]/70 hover:text-[#C5A059] transition-colors whitespace-nowrap"
                >
                  Ver histórico →
                </a>
              </div>
            )}
            {/* Free uses counter */}
            {!accessLoading && !isSubscribed && freeUsesLeft > 0 && (
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 flex items-center gap-2 mb-6 text-sm">
                <span className="text-amber-400/90">
                  {freeUsesLeft} uso{freeUsesLeft !== 1 ? "s" : ""} gratuito
                  {freeUsesLeft !== 1 ? "s" : ""} disponível{freeUsesLeft !== 1 ? "is" : ""} —
                  Subscreva PRO para utilizações ilimitadas
                </span>
                <a
                  href="/ferramentas"
                  className="ml-auto text-amber-400 hover:text-amber-300 transition-colors font-medium whitespace-nowrap"
                >
                  Subscrever
                </a>
              </div>
            )}
            {/* Subscription Banner */}
            {accessLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-5 h-5 border-2 border-[#C5A059]/30 border-t-[#C5A059] rounded-full animate-spin" />
              </div>
            ) : (
              <SubscriptionBanner
                isSubscribed={isSubscribed}
                freeUsesLeft={freeUsesLeft}
                requiresAuth={requiresAuth}
              />
            )}
            <ProUpgradeCard isSubscribed={isSubscribed} />

            {/* Botão Analisar */}
            {!showAnalise && (
              <>
                <button
                  onClick={() => {
                    if (!canUse) return;
                    setCalculando(true);
                    setCalculandoStep(0);
                    recordUsage({
                      cavalos: cavalos.map((c) => ({
                        nome: c.nome,
                        idade: c.idade,
                        pelagem: c.pelagem,
                      })),
                    });
                    setTimeout(() => setCalculandoStep(1), 600);
                    setTimeout(() => setCalculandoStep(2), 1200);
                    setTimeout(() => {
                      setCalculando(false);
                      setShowAnalise(true);
                    }, 2000);
                  }}
                  disabled={!canUse || calculando}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BarChart3 size={22} />
                  {t.comparador.btn_analyse}
                </button>
                {!canUse && (
                  <Paywall toolName={t.comparador.tool_name} requiresAuth={requiresAuth} />
                )}
              </>
            )}

            {/* Loading state */}
            {calculando && (
              <div className="flex flex-col items-center justify-center py-16 gap-8 animate-[fadeSlideIn_0.3s_ease-out_forwards]">
                {/* Spinner */}
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-[#C5A059]/15" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C5A059] animate-spin" />
                  <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#C5A059]/50 animate-[spin_1.5s_linear_infinite_reverse]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BarChart3 size={22} className="text-[#C5A059]" />
                  </div>
                </div>

                {/* Main text */}
                <div className="text-center">
                  <p className="text-lg font-semibold text-[var(--foreground)] mb-1">
                    A comparar os seus cavalos
                    <span className="inline-flex gap-0.5 ml-0.5" aria-hidden="true">
                      <span className="inline-block animate-[pulse-opacity_1.2s_ease-in-out_0s_infinite]">
                        .
                      </span>
                      <span className="inline-block animate-[pulse-opacity_1.2s_ease-in-out_0.4s_infinite]">
                        .
                      </span>
                      <span className="inline-block animate-[pulse-opacity_1.2s_ease-in-out_0.8s_infinite]">
                        .
                      </span>
                    </span>
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)]">
                    Isto demora apenas um momento
                  </p>
                </div>

                {/* Animated steps */}
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  {[
                    "Analisando pontuações...",
                    "Calculando diferenças...",
                    "Gerando relatório...",
                  ].map((label, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                        calculandoStep > idx
                          ? "border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059]"
                          : calculandoStep === idx
                            ? "border-[#C5A059]/30 bg-[#C5A059]/5 text-[var(--foreground-secondary)]"
                            : "border-[var(--border)]/40 bg-transparent text-[var(--foreground-muted)]"
                      }`}
                    >
                      <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        {calculandoStep > idx ? (
                          <Check size={14} className="text-[#C5A059]" />
                        ) : calculandoStep === idx ? (
                          <div className="w-3 h-3 rounded-full border-2 border-[#C5A059]/60 border-t-[#C5A059] animate-spin" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-[var(--border)]" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Análise */}
            {showAnalise && (
              <div className="space-y-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
                {/* Confetti celebration */}
                <div className="relative">
                  <Confetti trigger={true} particleCount={50} duration={2800} />
                </div>

                {/* Acções: PDF, CSV, Partilhar, Imprimir */}
                <div className="space-y-2">
                  <ResultActions
                    onExportPDF={handleExportPDF}
                    onShare={handleShare}
                    onPrint={() => window.print()}
                    isExporting={isExporting}
                  />
                  <button
                    onClick={handleExportCSV}
                    className="w-full py-3 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground-secondary)] text-sm font-medium hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)] transition-all flex items-center justify-center gap-2"
                  >
                    <TrendingUp size={16} />
                    Exportar CSV (Excel)
                  </button>
                </div>

                {/* Gráfico Radar */}
                <div className="bg-[var(--background-secondary)]/50 rounded-2xl p-6 border border-[var(--border)]">
                  <h3 className="text-lg font-serif mb-6 flex items-center gap-3">
                    <Activity className="text-blue-400" size={20} />
                    {t.comparador.visual_comparison}
                    <Tooltip
                      text={
                        (t.comparador as Record<string, string>).tooltip_radar ??
                        "Cada eixo representa uma dimensao avaliada de 0 a 10. A area total reflecte o perfil global do cavalo."
                      }
                    />
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-[280px] overflow-hidden">
                      <RadarChart
                        cavalos={cavalos.map((c, i) => ({
                          nome: c.nome,
                          valores: [
                            c.conformacao,
                            c.andamentos,
                            c.temperamento,
                            c.saude,
                            Math.min(c.blup / 12, 10),
                            TREINOS.find((t) => t.value === c.treino)?.nivel || 4,
                          ],
                          cor: cores[i],
                        }))}
                        labels={["Conform.", "Andam.", "Temper.", "Saúde", "BLUP", "Treino"]}
                      />
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                      {cavalos.map((c, i) => (
                        <div key={c.id} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cores[i] }}
                          />
                          <span className="text-sm text-[var(--foreground-secondary)]">
                            {c.nome}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category Ranking */}
                <CategoryRanking cavalos={cavalos} cores={cores} />

                {/* Suitability Profile */}
                <SuitabilityProfile cavalos={cavalos} cores={cores} />

                {/* Tabela Comparativa - PRO only */}
                <BlurredProSection
                  isSubscribed={isSubscribed}
                  title={t.comparador.comparative_table}
                >
                  <div className="bg-[var(--background-secondary)]/50 rounded-2xl p-4 sm:p-6 border border-[var(--border)]">
                    <h3 className="text-lg font-serif mb-6 flex items-center gap-3">
                      <Scale className="text-blue-400" size={20} />
                      {t.comparador.comparative_table}
                    </h3>
                    {/* overflow-x-auto enables horizontal scroll on narrow screens */}
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                      <table className="w-full text-sm" style={{ minWidth: "480px" }}>
                        <thead>
                          <tr className="text-[var(--foreground-secondary)] border-b border-[var(--border)]">
                            <th className="text-left py-3 px-3 min-w-[110px] sticky left-0 bg-[var(--background-secondary)]">
                              {t.comparador.param_header}
                            </th>
                            {cavalos.map((c, i) => (
                              <th
                                key={c.id}
                                className="text-center py-3 px-3 min-w-[90px]"
                                style={{ color: cores[i] }}
                              >
                                {c.nome}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              label: t.comparador.param_age,
                              campo: "idade" as const,
                              maior: false,
                              suffix: " anos",
                            },
                            {
                              label: t.comparador.param_height,
                              campo: "altura" as const,
                              maior: false,
                              suffix: " cm",
                            },
                            {
                              label: t.comparador.param_conformation,
                              campo: "conformacao" as const,
                              maior: true,
                              suffix: "/10",
                            },
                            {
                              label: t.comparador.param_gaits,
                              campo: "andamentos" as const,
                              maior: true,
                              suffix: "/10",
                            },
                            {
                              label: t.comparador.param_temperament,
                              campo: "temperamento" as const,
                              maior: true,
                              suffix: "/10",
                            },
                            {
                              label: t.comparador.param_health,
                              campo: "saude" as const,
                              maior: true,
                              suffix: "/10",
                            },
                            { label: "BLUP", campo: "blup" as const, maior: true, suffix: "" },
                            {
                              label: t.comparador.param_price,
                              campo: "preco" as const,
                              maior: false,
                              suffix: "€",
                            },
                          ].map(({ label, campo, maior, suffix }) => (
                            <tr key={campo} className="border-b border-[var(--border)]/50">
                              <td className="py-3 px-3 text-[var(--foreground-secondary)] sticky left-0 bg-[var(--background-secondary)]">
                                {label}
                              </td>
                              {cavalos.map((c) => (
                                <td
                                  key={c.id}
                                  className={`text-center py-3 px-3 ${getClasseCor(c[campo] as number, getMelhor(campo, maior), maior)}`}
                                >
                                  {campo === "preco"
                                    ? `${(c[campo] as number).toLocaleString("pt-PT")}${suffix}`
                                    : `${c[campo]}${suffix}`}
                                </td>
                              ))}
                            </tr>
                          ))}
                          <tr className="border-t-2 border-[var(--border)]">
                            <td className="py-4 px-3 font-semibold text-[var(--foreground)] sticky left-0 bg-[var(--background-secondary)]">
                              {t.comparador.total_score}
                            </td>
                            {cavalos.map((c, i) => (
                              <td key={c.id} className="text-center py-4 px-3">
                                <div className="flex items-center justify-center gap-2">
                                  <span className="text-2xl font-bold" style={{ color: cores[i] }}>
                                    {calcularScore(c)}
                                  </span>
                                  <SourceBadge source="modelo" />
                                  {c.id === vencedor.id && (
                                    <Crown className="inline text-amber-400" size={16} />
                                  )}
                                </div>
                                <div className="mt-2 text-left">
                                  <ScoreBreakdown
                                    factors={getScoreFactors(c)}
                                    total={calcularScore(c)}
                                  />
                                </div>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-t border-[var(--border)]">
                            <td className="py-3 px-3 text-[var(--foreground-secondary)] sticky left-0 bg-[var(--background-secondary)]">
                              {t.comparador.value_per_pt}
                            </td>
                            {cavalos.map((c) => (
                              <td
                                key={c.id}
                                className={`text-center py-3 px-3 ${
                                  c.id === melhorValor.id
                                    ? "text-emerald-400 font-semibold"
                                    : "text-[var(--foreground-secondary)]"
                                }`}
                              >
                                {calcularValorPorPonto(c).toLocaleString("pt-PT")}€
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </BlurredProSection>

                {/* Recomendação */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-amber-900/30 to-[var(--background-secondary)] rounded-2xl p-6 border border-amber-500/30">
                    <h3 className="text-lg font-serif mb-4 flex items-center gap-3">
                      <Trophy className="text-amber-400" size={20} />
                      {t.comparador.best_quality}
                      <Tooltip
                        text={
                          (t.comparador as Record<string, string>).tooltip_melhor_score ??
                          "O cavalo com maior score total no conjunto de factores avaliados."
                        }
                      />
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-amber-500/20 rounded-xl">
                        <Crown className="text-amber-400" size={28} />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-amber-400">{vencedor.nome}</p>
                        <p className="text-sm text-[var(--foreground-secondary)]">
                          Score: {calcularScore(vencedor)} {t.comparador.points}
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)] mt-1">
                          {vencedor.treino} • {vencedor.linhagem}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-900/30 to-[var(--background-secondary)] rounded-2xl p-6 border border-emerald-500/30">
                    <h3 className="text-lg font-serif mb-4 flex items-center gap-3">
                      <Euro className="text-emerald-400" size={20} />
                      {t.comparador.best_cost_benefit}
                      <Tooltip
                        text={
                          (t.comparador as Record<string, string>).tooltip_melhor_valor ??
                          "O cavalo com menor custo por ponto de score."
                        }
                      />
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-emerald-500/20 rounded-xl">
                        <TrendingUp className="text-emerald-400" size={28} />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-emerald-400">{melhorValor.nome}</p>
                        <p className="text-sm text-[var(--foreground-secondary)]">
                          {calcularValorPorPonto(melhorValor).toLocaleString("pt-PT")}€{" "}
                          {t.comparador.per_point}
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)] mt-1">
                          {melhorValor.preco.toLocaleString("pt-PT")}€ • Score{" "}
                          {calcularScore(melhorValor)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PRO: Veredicto por Cavalo */}
                <BlurredProSection isSubscribed={isSubscribed} title={t.comparador.verdict_title}>
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-2">
                      {t.comparador.verdict_title}
                    </h3>
                    <p className="text-xs text-[var(--foreground-muted)] mb-4">
                      {t.comparador.verdict_desc}
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {cavalos.map((c) => {
                        const v = gerarVeredicto(c);
                        return (
                          <HorseVerdictCard
                            key={c.id}
                            nome={c.nome}
                            score={calcularScore(c)}
                            strengths={v.strengths}
                            weaknesses={v.weaknesses}
                            bestUse={v.bestUse}
                            riskLevel={v.riskLevel}
                            recommendation={v.recommendation}
                          />
                        );
                      })}
                    </div>
                  </div>
                </BlurredProSection>

                {/* PRO: Projecção de Custo 5 Anos */}
                <BlurredProSection
                  isSubscribed={isSubscribed}
                  title={t.comparador.cost_projection_title}
                >
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-2">
                      {t.comparador.cost_projection_title}
                    </h3>
                    <p className="text-xs text-[var(--foreground-muted)] mb-4">
                      {t.comparador.cost_projection_desc}
                    </p>
                    <CostProjectionTable horses={cavalos.map(gerarCustos)} />
                    <p className="text-[11px] text-[var(--foreground-muted)]/60 leading-relaxed mt-3">
                      {t.comparador.cost_disclaimer}
                    </p>
                  </div>
                </BlurredProSection>

                {/* PRO: Gap Analysis */}
                <BlurredProSection
                  isSubscribed={isSubscribed}
                  title={(t.comparador as Record<string, string>).gap_title ?? "Analise de Gap"}
                >
                  <GapAnalysis cavalos={cavalos} cores={cores} calcularScore={calcularScore} />
                </BlurredProSection>

                {/* PRO: Purchase Confidence */}
                <BlurredProSection
                  isSubscribed={isSubscribed}
                  title={
                    (t.comparador as Record<string, string>).confidence_title ??
                    "Indice de Confianca na Compra"
                  }
                >
                  <PurchaseConfidence
                    cavalos={cavalos}
                    vencedorId={vencedor.id}
                    calcularScore={calcularScore}
                  />
                </BlurredProSection>

                {/* Methodology Panel */}
                <MethodologyPanel
                  title={
                    (t.comparador as Record<string, string>).methodology_panel_title ??
                    "Metodologia de Comparacao"
                  }
                  factors={[
                    {
                      name: "Linhagem",
                      weight: "15pts",
                      description: "Qualidade do pedigree: Desconhecida a Elite",
                      standard: "APSL",
                    },
                    {
                      name: "Treino",
                      weight: "15pts",
                      description: "Nivel de treino conforme escalas FEI",
                      standard: "FEI",
                    },
                    {
                      name: "Conformacao",
                      weight: "10pts",
                      description: "Avaliacao morfologica segundo padroes APSL",
                      standard: "APSL",
                    },
                    {
                      name: "Andamentos",
                      weight: "10pts",
                      description: "Qualidade dos tres andamentos basicos",
                    },
                    {
                      name: "Idade",
                      weight: "10pts",
                      description: "Faixa ideal: 6-12 anos (maximo); 4-15 (bom)",
                    },
                    {
                      name: "Competicoes",
                      weight: "8pts",
                      description: "Historial competitivo e classificacoes",
                    },
                    { name: "Altura", weight: "8pts", description: "Faixa ideal: 158-168cm" },
                    {
                      name: "Temperamento",
                      weight: "7pts",
                      description: "Docilidade e capacidade de trabalho",
                    },
                    {
                      name: "Saude",
                      weight: "7pts",
                      description: "Historial clinico e condicao geral",
                      standard: "veterinário",
                    },
                    {
                      name: "BLUP",
                      weight: "5pts",
                      description: "Estimativa de merito genetico",
                      standard: "modelo",
                    },
                    {
                      name: "Elev.+Reg.",
                      weight: "5pts",
                      description: "Elevacao e regularidade dos andamentos",
                    },
                    {
                      name: "Registo APSL",
                      weight: "3pts",
                      description: "Bonus para cavalos com registo oficial",
                      standard: "APSL",
                    },
                  ]}
                  limitations={[
                    (t.comparador as Record<string, string>).limitation_1 ??
                      "Comparacao limitada aos dados declarados pelo utilizador",
                    (t.comparador as Record<string, string>).limitation_2 ??
                      "O score nao captura a quimica cavaleiro-cavalo",
                    (t.comparador as Record<string, string>).limitation_3 ??
                      "Precos declarados pelo utilizador, nao verificados",
                  ]}
                  version={
                    (t.comparador as Record<string, string>).methodology_version ??
                    "v2.1 — Fev 2026"
                  }
                  references={["Padroes APSL", "Escalas FEI"]}
                />

                {/* Disclaimer */}
                <div className="p-4 bg-[var(--background-secondary)]/30 rounded-xl border border-[var(--border)]/50">
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    <strong className="text-[var(--foreground-secondary)]">
                      {t.comparador.disclaimer_title}
                    </strong>{" "}
                    {t.comparador.disclaimer_text}
                    <span className="block mt-1 text-[10px] text-[var(--foreground-muted)]/40 font-mono">
                      {(t.comparador as Record<string, string>).methodology_version ??
                        "v2.1 — Fev 2026"}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

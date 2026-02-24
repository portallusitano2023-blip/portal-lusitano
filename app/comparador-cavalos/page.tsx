"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
  Sparkles,
  Dna,
  Target,
  Award,
  History,
} from "lucide-react";
import dynamic from "next/dynamic";
import ResultActions from "@/components/tools/ResultActions";
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";
import ProUpgradeCard from "@/components/tools/ProUpgradeCard";
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
import { createTranslator } from "@/lib/tr";
import { useToast } from "@/context/ToastContext";
import Tooltip from "@/components/tools/Tooltip";
import SourceBadge from "@/components/tools/SourceBadge";
import MethodologyPanel from "@/components/tools/MethodologyPanel";
import ScoreBreakdown from "@/components/tools/ScoreBreakdown";

const Confetti = dynamic(() => import("@/components/tools/Confetti"), {
  ssr: false,
});

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
      width="100%"
      className="mx-auto w-full"
      style={{ height: "auto", maxWidth: `${size}px` }}
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
// MATRIZ DE APTIDÃO POR DISCIPLINA
// ============================================

const DISCIPLINE_MATRIX = [
  {
    label: "Alta Escola",
    weights: {
      elevacao: 0.3,
      andamentos: 0.25,
      treino: 0.25,
      conformacao: 0.15,
      temperamento: 0.05,
    },
  },
  {
    label: "Dressage Clássica",
    weights: { andamentos: 0.3, elevacao: 0.2, regularidade: 0.2, conformacao: 0.15, treino: 0.15 },
  },
  {
    label: "Equitação de Trabalho",
    weights: { temperamento: 0.3, andamentos: 0.25, treino: 0.2, saude: 0.15, conformacao: 0.1 },
  },
  {
    label: "Atrelagem",
    weights: { temperamento: 0.3, saude: 0.25, conformacao: 0.2, andamentos: 0.15, treino: 0.1 },
  },
  {
    label: "Lazer / Trail",
    weights: { temperamento: 0.4, saude: 0.3, andamentos: 0.2, conformacao: 0.1 },
  },
  {
    label: "Criação / Reprodução",
    weights: { conformacao: 0.3, blup: 0.3, saude: 0.2, andamentos: 0.2 },
  },
] as const;

function calcDisciplineScore(c: Cavalo, weights: Record<string, number>): number {
  const treinoNorm = ((TREINOS.find((t) => t.value === c.treino)?.nivel ?? 4) / 7) * 10;
  const blupNorm = Math.min(c.blup / 15, 10);
  const fieldMap: Record<string, number> = {
    elevacao: c.elevacao,
    andamentos: c.andamentos,
    regularidade: c.regularidade,
    conformacao: c.conformacao,
    temperamento: c.temperamento,
    saude: c.saude,
    treino: treinoNorm,
    blup: blupNorm,
  };
  const total = Object.entries(weights).reduce(
    (sum, [field, w]) => sum + (fieldMap[field] ?? 5) * w,
    0
  );
  return Math.min(100, Math.round(total * 10));
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

// ============================================
// CHAVE DE AUTO-SAVE E TOOL CHAIN
// ============================================

const DRAFT_KEY = "comparador_draft_v1";
const CHAIN_KEY = "tool_chain_horse";
const BREEDING_CHAIN_KEY = "tool_chain_breeding";
const PROFILE_CONTEXT_KEY = "tool_context_profile";
const HISTORY_KEY = "comparador_history";

interface HistoryEntry {
  timestamp: number;
  cavalos: { nome: string; score: number }[];
  vencedor: string;
}

const PROFILE_LABELS: Record<string, string> = {
  competidor: "Competidor",
  criador: "Criador",
  amador: "Apreciador Amador",
  investidor: "Investidor",
};

const SUBPROFILE_LABELS: Record<string, string> = {
  competidor_elite: "Alta Competição FEI",
  competidor_nacional: "Competição Nacional",
  competidor_trabalho: "Equitação de Trabalho",
  amador_projeto: "Projeto em Desenvolvimento",
};

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
    const valorPorPonto = score > 0 ? Math.round(c.preco / score) : "N/A";
    return [
      c.nome || "—",
      c.idade,
      c.sexo || "—",
      c.altura,
      c.pelagem || "—",
      c.linhagem || "—",
      c.treino || "—",
      c.conformacao,
      c.andamentos,
      c.elevacao,
      c.regularidade,
      c.temperamento,
      c.saude,
      c.competicoes || "—",
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
  const { t, language } = useLanguage();
  const tr = createTranslator(language);
  const { showToast } = useToast();
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
  const [profileContext, setProfileContext] = useState<{
    profile: string;
    subProfile: string | null;
    priceRange: string;
  } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [filtroDisciplina, setFiltroDisciplina] = useState<string>("geral");
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
        const parsed = JSON.parse(chain) as {
          source: string;
          horse?: Partial<Cavalo>;
          horses?: Partial<Cavalo>[];
        };
        const { source } = parsed;

        if (source === "calculadora" && parsed.horse) {
          const novo = {
            ...criarCavalo("1", parsed.horse.nome || "Cavalo A"),
            ...parsed.horse,
            id: "1",
          };
          setCavalos([novo, criarCavalo("2", "Cavalo B"), criarCavalo("3", "Cavalo C")]);
          sessionStorage.removeItem(CHAIN_KEY);
          setStep(1);
          return;
        }

        if (
          source === "verificador_pair" &&
          Array.isArray(parsed.horses) &&
          parsed.horses.length >= 2
        ) {
          const [h1, h2] = parsed.horses;
          const cavalo1 = { ...criarCavalo("1", h1.nome || "Garanhão"), ...h1, id: "1" };
          const cavalo2 = { ...criarCavalo("2", h2.nome || "Égua"), ...h2, id: "2" };
          setCavalos([cavalo1, cavalo2]);
          sessionStorage.removeItem(CHAIN_KEY);
          setStep(1);
          return;
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

      // Contexto da Análise de Perfil
      try {
        const ctx = sessionStorage.getItem(PROFILE_CONTEXT_KEY);
        if (ctx) {
          const parsed = JSON.parse(ctx) as {
            source: string;
            profile: string;
            subProfile: string | null;
            priceRange: string;
          };
          if (parsed.source === "analise_perfil") {
            setProfileContext(parsed);
            sessionStorage.removeItem(PROFILE_CONTEXT_KEY);
          }
        }
      } catch {}
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

  // Carrega histórico do localStorage ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as HistoryEntry[];
        if (Array.isArray(parsed)) setHistory(parsed);
      }
    } catch {}
  }, []);

  // Guarda uma nova entrada no histórico quando showAnalise muda para true
  useEffect(() => {
    if (!showAnalise) return;
    try {
      const sorted = [...cavalos]
        .map((c) => ({ c, score: calcularScore(c) }))
        .sort((a, b) => b.score - a.score);
      const entry: HistoryEntry = {
        timestamp: Date.now(),
        cavalos: sorted.map((s) => ({ nome: s.c.nome, score: s.score })),
        vencedor: sorted[0].c.nome,
      };
      setHistory((prev) => {
        const updated = [entry, ...prev].slice(0, 5);
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } catch {}
    // calcularScore is stable (defined inside component without deps), so it's safe here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAnalise]);

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
      showToast("error", t.errors.error_export_pdf);
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

  // Score de potencial: score máximo atingível dado idade e treino atual
  const calcularPotencial = (c: Cavalo): number => {
    const scoreAtual = calcularScore(c);
    const treino = TREINOS.find((t) => t.value === c.treino);
    const nivel = treino?.nivel ?? 4;
    const nivelMax = 8; // Grand Prix

    // Cavalos mais jovens têm mais margem de progressão
    const ageFactor = c.idade <= 5 ? 1.0 : c.idade <= 8 ? 0.75 : c.idade <= 11 ? 0.45 : 0.15;

    // Margem de treino: cada nível vale ~1.9 pts no scoring
    const treinoHeadroom = (nivelMax - nivel) * 1.9;

    // Margem de competição: máximo (Internacional) = ~15pts
    const comp = COMPETICOES.find((co) => co.value === c.competicoes);
    const compScore = comp ? Math.round((comp.mult - 1) * 20 + 5) : 5;
    const compMax = 13;
    const compHeadroom = Math.max(0, compMax - compScore);

    const potencialBonus = Math.round((treinoHeadroom + compHeadroom) * ageFactor);
    return Math.min(100, scoreAtual + potencialBonus);
  };

  // ROI estimado a 5 anos
  const calcularROI = (c: Cavalo): { roi5yr: number; breakEven: number; horizonte: string } => {
    const treino = TREINOS.find((t) => t.value === c.treino);
    const nivel = treino?.nivel ?? 4;

    // Apreciação anual estimada com base em idade e potencial de treino
    let annualRate = 0.02; // estável por defeito
    if (c.idade <= 5 && nivel <= 3)
      annualRate = 0.16; // potro/jovem em desenvolvimento
    else if (c.idade <= 7 && nivel <= 4)
      annualRate = 0.1; // jovem promissor
    else if (c.idade >= 8 && c.idade <= 12 && nivel >= 5)
      annualRate = 0.05; // pico de carreira
    else if (c.idade > 14) annualRate = -0.04; // depreciação lenta

    const estimatedValue5yr = Math.round(c.preco * Math.pow(1 + annualRate, 5));
    const roi5yr = Math.round(((estimatedValue5yr - c.preco) / c.preco) * 100);

    // Custo anual total estimado
    const baseTraining = 200 + nivel * 100;
    const annualCost =
      400 * 12 + 150 * 12 + 80 * 12 + 60 * 12 + baseTraining * 12 + Math.round(c.preco * 0.04);
    const monthlyAppreciation = (c.preco * Math.max(annualRate, 0)) / 12;
    const monthlyCost = annualCost / 12;
    const breakEven =
      monthlyAppreciation > monthlyCost
        ? Math.round(c.preco / (monthlyAppreciation - monthlyCost))
        : 120;

    const horizonte =
      c.idade <= 5
        ? "5-10 anos"
        : c.idade <= 8
          ? "3-5 anos"
          : c.idade <= 12
            ? "2-3 anos"
            : "Curto prazo";

    return { roi5yr, breakEven: Math.min(breakEven, 120), horizonte };
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
      { name: "Conformação", weight: "10%", score: c.conformacao, max: 10 },
      { name: "Andamentos", weight: "10%", score: c.andamentos, max: 10 },
      { name: "Idade", weight: "10%", score: idadeScore, max: 10 },
      { name: "Competições", weight: "8%", score: compScore, max: 8 },
      { name: "Altura", weight: "8%", score: alturaScore, max: 8 },
      { name: "Temperamento", weight: "7%", score: temperamentoScore, max: 7 },
      { name: "Saúde", weight: "7%", score: saudeScore, max: 7 },
      { name: "BLUP", weight: "5%", score: blupScore, max: 5 },
      { name: "Elevação", weight: "5%", score: elevacaoScore, max: 5 },
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

    const riskLevel: "Baixo" | "Médio" | "Alto" =
      c.idade > 16 || c.saude <= 5 ? "Alto" : c.idade > 14 || c.saude <= 6 ? "Médio" : "Baixo";

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
                className="px-4 py-2 min-h-[44px] bg-blue-600 rounded-lg flex items-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">{t.comparador.btn_add}</span>
              </button>
            )}
            {showAnalise && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAnalise(false)}
                  className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5"
                >
                  <Scale size={13} />
                  <span className="hidden sm:inline">Editar</span>
                </button>
                {history.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowHistory((v) => !v)}
                      className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg border border-[var(--border)] hover:border-[var(--foreground-muted)]"
                    >
                      <History size={13} />
                      <span className="hidden sm:inline">Histórico ({history.length})</span>
                    </button>
                    {showHistory && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-[var(--background-card)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                          <span className="text-xs font-semibold text-[var(--foreground-secondary)] uppercase tracking-wider">
                            Últimas Comparações
                          </span>
                          <button
                            onClick={() => setShowHistory(false)}
                            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                            aria-label="Fechar histórico"
                          >
                            <X size={13} />
                          </button>
                        </div>
                        <div className="divide-y divide-[var(--border)]/50">
                          {history.map((entry, i) => (
                            <div key={i} className="px-4 py-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-[#C5A059] font-semibold truncate">
                                  Vencedor: {entry.vencedor}
                                </span>
                                <span className="text-[10px] text-[var(--foreground-muted)] shrink-0 ml-2">
                                  {new Date(entry.timestamp).toLocaleDateString("pt-PT", {
                                    day: "numeric",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {entry.cavalos.map((cv, j) => (
                                  <span
                                    key={j}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--background-secondary)] text-[var(--foreground-secondary)]"
                                  >
                                    {cv.nome}:{" "}
                                    <strong className="text-[var(--foreground)]">{cv.score}</strong>
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={resetar}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={14} />
                  <span className="hidden sm:inline">{t.comparador.new_comparison}</span>
                </button>
              </div>
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
                <Image
                  src="https://images.unsplash.com/photo-1534307671554-9a6d81f4d629?q=80&w=1920"
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover opacity-30"
                  style={{ objectPosition: "center 40%" }}
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
                  style={{ animationDelay: "0.2s" }}
                >
                  &ldquo;{t.comparador.intro_quote}&rdquo;
                </p>

                <p
                  className="text-sm text-[var(--foreground-muted)] max-w-xl mx-auto mb-10 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: "0.25s" }}
                >
                  {t.comparador.intro_desc}
                </p>

                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-400 hover:to-blue-500 transition-all shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Scale size={20} />
                  {t.comparador.start_btn}
                  <ChevronRight size={18} />
                </button>

                {/* Banner draft guardado */}
                {hasDraft && (
                  <div
                    className="mt-6 flex flex-col sm:flex-row items-center gap-3 px-5 py-4 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl max-w-sm mx-auto opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                    style={{ animationDelay: "0.35s" }}
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
                {/* Banner de boas-vindas — vindo da Análise de Perfil */}
                {profileContext && (
                  <div
                    className="mt-4 flex items-start gap-3 px-5 py-4 bg-gradient-to-r from-[var(--gold)]/15 to-[var(--gold)]/5 border border-[var(--gold)]/40 rounded-xl max-w-sm mx-auto opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <Sparkles size={16} className="text-[var(--gold)] shrink-0 mt-0.5" />
                    <p className="text-xs text-[var(--gold)] flex-1 leading-relaxed text-left">
                      <strong>
                        Bem-vindo,{" "}
                        {PROFILE_LABELS[profileContext.profile] ?? profileContext.profile}
                        {profileContext.subProfile
                          ? ` — ${SUBPROFILE_LABELS[profileContext.subProfile] ?? profileContext.subProfile}`
                          : ""}
                      </strong>
                      <span className="text-[var(--gold)]/70">
                        {" "}
                        · Orçamento sugerido: <strong>{profileContext.priceRange}</strong>
                      </span>
                    </p>
                    <button
                      onClick={() => setProfileContext(null)}
                      className="text-[var(--gold)]/50 hover:text-[var(--gold)] transition-colors shrink-0"
                      aria-label="Fechar"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Features */}
            <section className="py-16 px-6">
              <div className="max-w-6xl mx-auto">
                <div
                  className="grid md:grid-cols-3 gap-6 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
                  style={{ animationDelay: "0.35s" }}
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
            {/* Hint inicial — desaparece quando os nomes são personalizados */}
            {!showAnalise && cavalos.every((c) => c.nome.startsWith("Cavalo")) && (
              <div className="flex items-start gap-3 p-4 bg-blue-500/8 border border-blue-500/20 rounded-xl mb-4">
                <span className="text-blue-400 text-lg leading-none mt-0.5" aria-hidden="true">
                  💡
                </span>
                <div>
                  <p className="text-sm font-medium text-blue-300">Como usar o Comparador</p>
                  <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                    Preenche os dados de cada cavalo nos campos abaixo. Podes comparar até 4 cavalos
                    simultaneamente. Todos os campos têm valores por defeito — edita apenas os que
                    conheces.
                  </p>
                </div>
              </div>
            )}

            {/* Cards dos Cavalos */}
            <div
              className={`grid gap-4 mb-8 ${
                cavalos.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : cavalos.length === 3
                    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
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
                    className="p-4 border-b border-[var(--border)] relative"
                    style={{ borderTopWidth: 3, borderTopColor: cores[i] }}
                  >
                    {/* Live score badge — actualiza em tempo real enquanto o utilizador preenche */}
                    {(() => {
                      const liveScore = calcularScore(c);
                      const badgeColor =
                        liveScore >= 70 ? "#22c55e" : liveScore >= 50 ? "#f59e0b" : "#ef4444";
                      return (
                        <div
                          className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg transition-all duration-300 select-none"
                          style={{
                            backgroundColor: badgeColor,
                            boxShadow: `0 0 8px ${badgeColor}55`,
                          }}
                          title={`Pontuação estimada: ${liveScore}/100`}
                          aria-label={`Pontuação estimada ${liveScore} de 100`}
                        >
                          {liveScore}
                        </div>
                      );
                    })()}
                    <div className="flex items-center justify-between pr-12">
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
                    {/* Preset rápido */}
                    <select
                      className="mt-2 w-full text-xs bg-[var(--background-card)]/40 border border-[var(--border)] text-[var(--foreground-muted)] rounded px-2 py-1 cursor-pointer hover:border-[var(--gold)]/40 transition-colors"
                      value=""
                      onChange={(e) => {
                        const v = e.target.value;
                        if (!v) return;
                        const presets: Record<string, Partial<Cavalo>> = {
                          potro: {
                            idade: 3,
                            treino: "Desbravado",
                            linhagem: "Certificada",
                            conformacao: 7,
                            andamentos: 6,
                            elevacao: 5,
                            regularidade: 6,
                            temperamento: 7,
                            saude: 8,
                            blup: 95,
                            competicoes: "Nenhuma",
                          },
                          competicao: {
                            idade: 8,
                            treino: "Avançado",
                            linhagem: "Elite",
                            conformacao: 9,
                            andamentos: 9,
                            elevacao: 8,
                            regularidade: 8,
                            temperamento: 8,
                            saude: 9,
                            blup: 115,
                            competicoes: "Nacional",
                          },
                          lazer: {
                            idade: 10,
                            treino: "Elementar",
                            linhagem: "Registada",
                            conformacao: 7,
                            andamentos: 7,
                            elevacao: 6,
                            regularidade: 7,
                            temperamento: 9,
                            saude: 8,
                            blup: 100,
                            competicoes: "Nenhuma",
                          },
                        };
                        const preset = presets[v];
                        if (preset) {
                          setCavalos((prev) =>
                            prev.map((horse) =>
                              horse.id === c.id ? { ...horse, ...preset } : horse
                            )
                          );
                        }
                      }}
                    >
                      <option value="">— Modelo rápido —</option>
                      <option value="potro">Potro em Desenvolvimento</option>
                      <option value="competicao">Cavalo de Competição</option>
                      <option value="lazer">Cavalo de Lazer</option>
                    </select>
                    {showAnalise && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {c.id === vencedor.id && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400 text-xs font-semibold shadow-sm shadow-amber-500/10">
                            <Crown size={11} />
                            {t.comparador.best_score}
                          </span>
                        )}
                        {c.id === melhorValor.id && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-400 text-xs font-semibold shadow-sm shadow-emerald-500/10">
                            <Euro size={11} />
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
                          className="w-full h-2 bg-[var(--background-card)] rounded-full appearance-none cursor-pointer touch-pan-x"
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
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs text-[var(--foreground-muted)]">
                          {t.comparador.label_price}
                        </label>
                        {c.preco > 0 &&
                          (() => {
                            const s = calcularScore(c);
                            const vpp = s > 0 ? c.preco / s : 0;
                            if (vpp > 700)
                              return (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-medium">
                                  Preço Elevado
                                </span>
                              );
                            if (vpp > 0 && vpp < 200)
                              return (
                                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">
                                  Excelente Valor
                                </span>
                              );
                            return null;
                          })()}
                      </div>
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
                              "Score composto (0-100) que pondera: Linhagem (15%), Treino (15%), Conformação (10%), Andamentos (10%), Idade (10%), Altura (8%), Temperamento (7%), Saúde (7%), BLUP (5%), Competições (8%), APSL (3%), Elevação+Regularidade (5%)."
                            }
                          />
                        </span>
                        <span className="flex items-center gap-2 flex-wrap justify-end">
                          <span className="text-2xl font-bold" style={{ color: cores[i] }}>
                            {calcularScore(c)}
                          </span>
                          <span className="text-xs text-[var(--foreground-muted)] flex items-center gap-0.5">
                            <TrendingUp size={11} className="text-emerald-400" />
                            <span className="text-emerald-400 font-medium">
                              {calcularPotencial(c)} pts
                            </span>
                          </span>
                          {calcularPotencial(c) > calcularScore(c) + 10 && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-semibold rounded-full">
                              Alto Potencial
                            </span>
                          )}
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
                            "Preço dividido pelo score total. Quanto menor, melhor a relação custo-benefício."
                          }
                        />
                      </div>
                      {filtroDisciplina !== "geral" &&
                        (() => {
                          const PESOS_DISC: Record<string, Record<string, number>> = {
                            dressage: {
                              conformacao: 0.2,
                              andamentos: 0.3,
                              elevacao: 0.25,
                              temperamento: 0.15,
                              saude: 0.1,
                            },
                            trabalho: {
                              conformacao: 0.25,
                              andamentos: 0.2,
                              temperamento: 0.3,
                              saude: 0.15,
                              blupNorm: 0.1,
                            },
                            reproducao: {
                              blupNorm: 0.35,
                              conformacao: 0.25,
                              saude: 0.25,
                              andamentos: 0.15,
                            },
                            lazer: {
                              temperamento: 0.4,
                              saude: 0.35,
                              conformacao: 0.15,
                              andamentos: 0.1,
                            },
                          };
                          const DISC_LABELS: Record<string, string> = {
                            dressage: "Dressage FEI",
                            trabalho: "Equit. Trabalho",
                            reproducao: "Reprodução",
                            lazer: "Lazer",
                          };
                          const pesos = PESOS_DISC[filtroDisciplina] ?? {};
                          let discScore = 0;
                          if (pesos.conformacao)
                            discScore += (c.conformacao / 10) * 100 * pesos.conformacao;
                          if (pesos.andamentos)
                            discScore += (c.andamentos / 10) * 100 * pesos.andamentos;
                          if (pesos.elevacao)
                            discScore += (c.elevacao / 10) * 100 * (pesos.elevacao ?? 0);
                          if (pesos.temperamento)
                            discScore += (c.temperamento / 10) * 100 * pesos.temperamento;
                          if (pesos.saude) discScore += (c.saude / 10) * 100 * pesos.saude;
                          if (pesos.blupNorm)
                            discScore += Math.min((c.blup / 130) * 100, 100) * pesos.blupNorm;
                          return (
                            <div className="mt-1.5 text-xs text-[var(--foreground-muted)]">
                              <span className="text-[#C5A059]/70">{Math.round(discScore)} pts</span>{" "}
                              para {DISC_LABELS[filtroDisciplina] ?? filtroDisciplina}
                            </div>
                          );
                        })()}
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

            {/* Banner de boas-vindas — perfil vindo da Análise de Perfil (step > 0) */}
            {profileContext && step > 0 && (
              <div className="flex items-start gap-3 px-4 py-3 bg-gradient-to-r from-[var(--gold)]/15 to-[var(--gold)]/5 border border-[var(--gold)]/40 rounded-xl mb-4 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
                <Sparkles size={14} className="text-[var(--gold)] shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--gold)] flex-1 leading-relaxed">
                  <strong>
                    {PROFILE_LABELS[profileContext.profile] ?? profileContext.profile}
                    {profileContext.subProfile
                      ? ` · ${SUBPROFILE_LABELS[profileContext.subProfile] ?? profileContext.subProfile}`
                      : ""}
                  </strong>
                  <span className="text-[var(--gold)]/70">
                    {" "}
                    — orçamento recomendado: <strong>{profileContext.priceRange}</strong>
                  </span>
                </p>
                <button
                  onClick={() => setProfileContext(null)}
                  className="text-[var(--gold)]/40 hover:text-[var(--gold)] transition-colors shrink-0"
                  aria-label="Fechar"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Botão Analisar */}
            {!showAnalise && (
              <>
                <button
                  onClick={() => {
                    if (!canUse) return;
                    const cavalosValidos = cavalos.filter(
                      (c) => c.nome.trim() && !c.nome.startsWith("Cavalo")
                    );
                    if (cavalosValidos.length < 2) {
                      showToast(
                        "error",
                        tr(
                          "Preenche o nome de pelo menos 2 cavalos para iniciar a comparação.",
                          "Fill in the name of at least 2 horses to start the comparison.",
                          "Rellena el nombre de al menos 2 caballos para iniciar la comparación."
                        )
                      );
                      return;
                    }
                    setCalculando(true);
                    setCalculandoStep(0);
                    const vencedorNome =
                      cavalos.length > 0
                        ? cavalos.reduce((a, b) => (calcularScore(a) > calcularScore(b) ? a : b))
                            .nome
                        : "";
                    const vencedorScore =
                      cavalos.length > 0
                        ? calcularScore(
                            cavalos.reduce((a, b) => (calcularScore(a) > calcularScore(b) ? a : b))
                          )
                        : 0;
                    recordUsage(
                      { count: cavalos.length },
                      {
                        vencedor: vencedorNome,
                        vencedorScore,
                        count: cavalos.length,
                        disciplinas: [
                          ...new Set(
                            cavalos.flatMap((c) =>
                              c.competicoes !== "Nenhuma" ? [c.competicoes] : []
                            )
                          ),
                        ],
                      }
                    );
                    setTimeout(() => setCalculandoStep(1), 600);
                    setTimeout(() => setCalculandoStep(2), 1200);
                    setTimeout(() => {
                      setCalculando(false);
                      setShowAnalise(true);
                    }, 2000);
                  }}
                  disabled={!canUse || calculando}
                  className="w-full py-4 min-h-[52px] bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BarChart3 size={22} />
                  {t.comparador.btn_analyse}
                </button>
                {!canUse && (
                  <Paywall
                    toolName={t.comparador.tool_name}
                    requiresAuth={requiresAuth}
                    proFeatures={[
                      "Comparação ilimitada de até 4 cavalos em simultâneo",
                      "Score de potencial e ROI a 5 anos",
                      "Radar comparativo com 8 dimensões",
                      "Exportação PDF e CSV para Excel",
                      "Análise de aptidão por disciplina desportiva",
                    ]}
                  />
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
                {/* Botão de regresso à edição */}
                <button
                  onClick={() => setShowAnalise(false)}
                  className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors mb-4"
                >
                  <ArrowLeft size={16} />
                  Editar dados dos cavalos
                </button>

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

                {/* Filtro por Disciplina */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="text-xs text-[var(--foreground-muted)] self-center mr-1">
                    Contexto:
                  </span>
                  {[
                    { id: "geral", label: "Geral" },
                    { id: "dressage", label: "Dressage FEI" },
                    { id: "trabalho", label: "Equit. Trabalho" },
                    { id: "reproducao", label: "Reprodução" },
                    { id: "lazer", label: "Lazer" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setFiltroDisciplina(d.id)}
                      className={`text-xs px-3 py-2 min-h-[36px] rounded-full border transition-all ${
                        filtroDisciplina === d.id
                          ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] font-semibold"
                          : "border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--border)]/70"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                {/* Banner de aptidão para disciplina seleccionada */}
                {filtroDisciplina !== "geral" &&
                  (() => {
                    const PESOS_DISC: Record<string, Record<string, number>> = {
                      dressage: {
                        conformacao: 0.2,
                        andamentos: 0.3,
                        elevacao: 0.25,
                        temperamento: 0.15,
                        saude: 0.1,
                      },
                      trabalho: {
                        conformacao: 0.25,
                        andamentos: 0.2,
                        temperamento: 0.3,
                        saude: 0.15,
                        blupNorm: 0.1,
                      },
                      reproducao: {
                        blupNorm: 0.35,
                        conformacao: 0.25,
                        saude: 0.25,
                        andamentos: 0.15,
                      },
                      lazer: { temperamento: 0.4, saude: 0.35, conformacao: 0.15, andamentos: 0.1 },
                    };
                    const pesos = PESOS_DISC[filtroDisciplina] ?? {};
                    const DISC_LABELS: Record<string, string> = {
                      dressage: "Dressage FEI",
                      trabalho: "Equit. Trabalho",
                      reproducao: "Reprodução",
                      lazer: "Lazer",
                    };

                    const aptidoes = cavalos.map((c) => {
                      let score = 0;
                      if (pesos.conformacao)
                        score += (c.conformacao / 10) * 100 * pesos.conformacao;
                      if (pesos.andamentos) score += (c.andamentos / 10) * 100 * pesos.andamentos;
                      if (pesos.elevacao) score += (c.elevacao / 10) * 100 * (pesos.elevacao ?? 0);
                      if (pesos.temperamento)
                        score += (c.temperamento / 10) * 100 * pesos.temperamento;
                      if (pesos.saude) score += (c.saude / 10) * 100 * pesos.saude;
                      if (pesos.blupNorm)
                        score += Math.min((c.blup / 130) * 100, 100) * pesos.blupNorm;
                      return { nome: c.nome, score: Math.round(score) };
                    });
                    const melhor = [...aptidoes].sort((a, b) => b.score - a.score)[0];

                    return (
                      <div className="flex items-center gap-3 p-3 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl mb-4">
                        <Target size={16} className="text-[#C5A059] shrink-0" />
                        <p className="text-sm text-[var(--foreground-secondary)]">
                          Para{" "}
                          <strong className="text-[var(--foreground)]">
                            {DISC_LABELS[filtroDisciplina]}
                          </strong>
                          : <strong className="text-[#C5A059]">{melhor?.nome || "Cavalo A"}</strong>{" "}
                          tem melhor aptidão ({melhor?.score ?? 0} pts)
                        </p>
                      </div>
                    );
                  })()}

                {/* Recomendação — card hero no topo dos resultados */}
                {(() => {
                  const vencedorScore = calcularScore(vencedor);
                  const fatores = getScoreFactors(vencedor);
                  const melhorFator = fatores.reduce((a, b) =>
                    a.score / a.max > b.score / b.max ? a : b
                  );
                  const melhorFatorLabel: Record<string, string> = {
                    Linhagem: "Linhagem",
                    Treino: "Treino",
                    Conformação: "Conformação",
                    Andamentos: "Andamentos",
                    Idade: "Idade",
                    Competições: "Competições",
                    Altura: "Altura",
                    Temperamento: "Temperamento",
                    Saúde: "Saúde",
                    BLUP: "BLUP",
                    Elevação: "Elevação",
                    Regularidade: "Regularidade",
                    "Registo APSL": "Registo APSL",
                  };
                  const vencedorIndex = cavalos.findIndex((cv) => cv.id === vencedor.id);
                  const corVencedor = cores[vencedorIndex] || "#C5A059";
                  return (
                    <div className="bg-gradient-to-r from-[#C5A059]/10 to-transparent border border-[#C5A059]/30 rounded-2xl p-6 mb-2">
                      {/* Título */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg bg-[#C5A059]/15 flex items-center justify-center shrink-0">
                          <Crown size={18} className="text-[#C5A059]" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#C5A059]/70 uppercase tracking-[0.15em]">
                            Recomendação
                          </p>
                          <h3 className="text-lg font-serif text-[var(--foreground)] leading-tight">
                            <span style={{ color: corVencedor }}>{vencedor.nome}</span> é o mais
                            equilibrado para a sua decisão
                          </h3>
                        </div>
                      </div>

                      {/* Três estatísticas rápidas do vencedor */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                        <div className="bg-[var(--background-secondary)]/60 rounded-xl p-3 text-center">
                          <p className="text-2xl font-bold" style={{ color: corVencedor }}>
                            {vencedorScore}
                          </p>
                          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                            Score global
                          </p>
                        </div>
                        <div className="bg-[var(--background-secondary)]/60 rounded-xl p-3 text-center">
                          <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                            {melhorFatorLabel[melhorFator.name] ?? melhorFator.name}
                          </p>
                          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                            Melhor categoria
                          </p>
                        </div>
                        <div className="bg-[var(--background-secondary)]/60 rounded-xl p-3 text-center">
                          <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                            {vencedor.preco > 0
                              ? `${vencedor.preco.toLocaleString("pt-PT")} €`
                              : "—"}
                          </p>
                          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Preço</p>
                        </div>
                      </div>

                      {/* Melhor custo-benefício (se diferente do vencedor) */}
                      {melhorValor.id !== vencedor.id && (
                        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-500/8 border border-emerald-500/20 rounded-lg">
                          <Euro
                            size={14}
                            className="text-emerald-400 shrink-0"
                            aria-hidden="true"
                          />
                          <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">
                            <span className="text-emerald-400 font-medium">
                              Melhor custo-benefício:
                            </span>{" "}
                            <span className="font-medium text-[var(--foreground)]">
                              {melhorValor.nome}
                            </span>{" "}
                            <span className="text-[var(--foreground-muted)]">
                              ({calcularValorPorPonto(melhorValor).toLocaleString("pt-PT")} €/pt vs.{" "}
                              {calcularValorPorPonto(vencedor).toLocaleString("pt-PT")} €/pt)
                            </span>
                          </p>
                        </div>
                      )}

                      {/* CTA */}
                      <p className="text-xs text-[#C5A059]/60 text-center">
                        Consulte a análise completa abaixo ↓
                      </p>
                    </div>
                  );
                })()}

                {/* Escolha Óbvia — banner quando a margem de score é > 20 pts */}
                {(() => {
                  const scores = cavalos.map((c) => calcularScore(c)).sort((a, b) => b - a);
                  const gap = scores.length >= 2 ? scores[0] - scores[1] : 0;
                  const vencedorIdx = cavalos.findIndex((c) => c.id === vencedor.id);
                  const cor = cores[vencedorIdx] || "#C5A059";
                  if (gap < 20) return null;
                  return (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-900/10 p-4 flex items-center gap-3 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <Trophy size={18} className="text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-emerald-400 mb-0.5">
                          Escolha clara: <span style={{ color: cor }}>{vencedor.nome}</span>
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)] leading-snug">
                          Margem de {gap} pontos em relação ao segundo — diferença significativa e
                          consistente entre os cavalos comparados.
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Veredicto Profissional */}
                {cavalos.length >= 2 &&
                  (() => {
                    const sorted = [...cavalos]
                      .map((c) => ({ c, score: calcularScore(c) }))
                      .sort((a, b) => b.score - a.score);
                    const best = sorted[0];
                    const second = sorted[1];
                    const gap = best.score - second.score;
                    const bestC = best.c;
                    const secondC = second.c;

                    // Pontos fortes do vencedor
                    const pontosFortesVencedor: string[] = [];
                    if (bestC.conformacao >= 8)
                      pontosFortesVencedor.push("conformação morfológica excepcional");
                    if (bestC.andamentos >= 8)
                      pontosFortesVencedor.push("andamentos de qualidade superior");
                    if (bestC.blup >= 115)
                      pontosFortesVencedor.push("elevado mérito genético (BLUP)");
                    if (bestC.saude >= 8) pontosFortesVencedor.push("saúde excelente");
                    if (bestC.competicoes !== "Nenhuma" && bestC.competicoes !== "nenhuma")
                      pontosFortesVencedor.push("palmarés desportivo comprovado");
                    if (bestC.idade >= 7 && bestC.idade <= 12)
                      pontosFortesVencedor.push("idade ideal de performance");

                    // Onde o segundo é superior
                    const pontosFortesSeg: string[] = [];
                    if (secondC.conformacao > bestC.conformacao)
                      pontosFortesSeg.push("conformação");
                    if (secondC.andamentos > bestC.andamentos) pontosFortesSeg.push("andamentos");
                    if (secondC.blup > bestC.blup) pontosFortesSeg.push("mérito genético");
                    if ((secondC.saude ?? 0) > (bestC.saude ?? 0)) pontosFortesSeg.push("saúde");

                    // Texto de introdução baseado na margem
                    const introText =
                      gap >= 25
                        ? `Com uma margem expressiva de ${gap} pontos, **${bestC.nome || "Cavalo A"}** é a escolha clara e inequívoca.`
                        : gap >= 15
                          ? `**${bestC.nome || "Cavalo A"}** destaca-se com ${gap} pontos de vantagem numa comparação competitiva.`
                          : gap >= 5
                            ? `**${bestC.nome || "Cavalo A"}** lidera com uma vantagem de ${gap} pontos num confronto equilibrado.`
                            : `Numa comparação muito próxima (margem de ${gap} pontos), **${bestC.nome || "Cavalo A"}** obtém uma ligeira vantagem.`;

                    const pontosStr =
                      pontosFortesVencedor.length > 0
                        ? `Os seus principais trunfos são: ${pontosFortesVencedor.slice(0, 3).join(", ")}.`
                        : "";

                    const segStr =
                      pontosFortesSeg.length > 0
                        ? `${secondC.nome || "Cavalo B"} mantém vantagem em ${pontosFortesSeg.join(" e ")}.`
                        : "";

                    const recomStr = (() => {
                      const jovem = bestC.idade < 7;
                      const garanhao = bestC.sexo === "Garanhão";
                      if (jovem && best.score >= 65)
                        return `Com ${bestC.idade} anos e este score, ${bestC.nome || "este cavalo"} tem elevado potencial de valorização nos próximos anos.`;
                      if (garanhao && best.score >= 70)
                        return `Como garanhão de qualidade, ${bestC.nome || "este cavalo"} combina valor desportivo com potencial reprodutivo.`;
                      if (best.score >= 80)
                        return `Um score acima de 80 pontos posiciona ${bestC.nome || "este cavalo"} no quartil superior da raça Lusitana.`;
                      return `Recomendamos avaliação presencial antes de qualquer decisão de compra.`;
                    })();

                    const linhas = [introText, pontosStr, segStr, recomStr].filter(Boolean);

                    return (
                      <div className="bg-gradient-to-br from-[var(--background-secondary)] to-[var(--background-card)] rounded-xl p-5 border border-[var(--gold)]/20 mb-2">
                        <h3 className="text-sm font-semibold text-[#C5A059] mb-3 flex items-center gap-2 uppercase tracking-wider">
                          <Award size={15} />
                          Veredicto Profissional
                        </h3>
                        <div className="space-y-2 text-sm text-[var(--foreground-secondary)] leading-relaxed">
                          {linhas.map((linha, i) => (
                            <p
                              key={i}
                              dangerouslySetInnerHTML={{
                                __html: linha.replace(
                                  /\*\*([^*]+)\*\*/g,
                                  '<strong class="text-[var(--foreground)]">$1</strong>'
                                ),
                              }}
                            />
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-[var(--border)]/40 flex flex-wrap items-center gap-3 text-xs text-[var(--foreground-muted)]">
                          <span>
                            Score: <strong className="text-[#C5A059]">{best.score}</strong> / 100
                          </span>
                          <span>
                            vs. {secondC.nome || "Cavalo B"}: <strong>{second.score}</strong>
                          </span>
                          {gap >= 15 && (
                            <span className="ml-auto px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full font-medium">
                              Escolha Clara
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                {/* CTA → Verificador de Compatibilidade (garanhão + égua) */}
                {cavalos.length === 2 &&
                  cavalos.some((c) => c.sexo === "Garanhão") &&
                  cavalos.some((c) => c.sexo === "Égua") && (
                    <div className="bg-pink-900/15 border border-pink-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Dna size={18} className="text-pink-400 shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--foreground)]">
                            Verificar Compatibilidade Reprodutiva
                          </p>
                          <p className="text-xs text-[var(--foreground-muted)]">
                            {cavalos.find((c) => c.sexo === "Garanhão")?.nome || "Garanhão"} ×{" "}
                            {cavalos.find((c) => c.sexo === "Égua")?.nome || "Égua"} — analisar
                            compatibilidade genética
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          try {
                            const g = cavalos.find((c) => c.sexo === "Garanhão")!;
                            const e = cavalos.find((c) => c.sexo === "Égua")!;
                            sessionStorage.setItem(
                              BREEDING_CHAIN_KEY,
                              JSON.stringify({ garanhao: g, egua: e, source: "comparador" })
                            );
                          } catch {}
                          window.location.href = "/verificador-compatibilidade";
                        }}
                        className="flex items-center justify-center gap-1.5 px-4 py-3 min-h-[44px] bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-semibold rounded-lg hover:bg-pink-500/30 transition-all whitespace-nowrap w-full sm:w-auto"
                      >
                        Verificar <ChevronRight size={13} />
                      </button>
                    </div>
                  )}

                {/* Gráfico Radar */}
                <div className="bg-[var(--background-secondary)]/50 rounded-2xl p-6 border border-[var(--border)]">
                  <h3 className="text-lg font-serif mb-6 flex items-center gap-3">
                    <Activity className="text-blue-400" size={20} />
                    {t.comparador.visual_comparison}
                    <Tooltip
                      text={
                        (t.comparador as Record<string, string>).tooltip_radar ??
                        "Cada eixo representa uma dimensão avaliada de 0 a 10. A área total reflecte o perfil global do cavalo."
                      }
                    />
                  </h3>
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-[320px] sm:max-w-[280px] overflow-hidden">
                      <RadarChart
                        cavalos={cavalos.map((c, i) => ({
                          nome: c.nome,
                          valores: [
                            c.conformacao,
                            c.andamentos,
                            c.elevacao,
                            c.regularidade,
                            c.temperamento,
                            c.saude,
                            Math.min(c.blup / 13, 10),
                            TREINOS.find((t) => t.value === c.treino)?.nivel || 4,
                          ],
                          cor: cores[i],
                        }))}
                        labels={[
                          "Conform.",
                          "Andam.",
                          "Elevação",
                          "Regular.",
                          "Temper.",
                          "Saúde",
                          "Pedigree",
                          "Treino",
                        ]}
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

                {/* Categorias Vencidas — mini scorecard */}
                {cavalos.length >= 2 &&
                  (() => {
                    const CAMPOS: (keyof Cavalo)[] = [
                      "conformacao",
                      "andamentos",
                      "elevacao",
                      "regularidade",
                      "temperamento",
                      "saude",
                      "blup",
                    ];
                    const vitórias = cavalos.map((c) => {
                      let v = 0;
                      CAMPOS.forEach((campo) => {
                        const melhor = Math.max(...cavalos.map((x) => x[campo] as number));
                        if ((c[campo] as number) === melhor) v++;
                      });
                      // Score global
                      const maxScore = Math.max(...cavalos.map(calcularScore));
                      if (calcularScore(c) === maxScore) v++;
                      return { id: c.id, nome: c.nome, vitórias: v };
                    });
                    const total = CAMPOS.length + 1;
                    return (
                      <div className="bg-[var(--background-secondary)]/50 rounded-2xl p-5 border border-[var(--border)]">
                        <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] uppercase tracking-wider mb-4">
                          Categorias Vencidas ({total} categorias)
                        </h3>
                        <div
                          className={`grid gap-3 ${
                            cavalos.length === 2
                              ? "grid-cols-2"
                              : cavalos.length === 3
                                ? "grid-cols-2 sm:grid-cols-3"
                                : "grid-cols-2 sm:grid-cols-4"
                          }`}
                        >
                          {vitórias.map((v, i) => (
                            <div
                              key={v.id}
                              className="text-center p-4 rounded-xl bg-[var(--background-card)]/40 border border-[var(--border)]"
                            >
                              <p className="text-3xl font-bold mb-1" style={{ color: cores[i] }}>
                                {v.vitórias}
                              </p>
                              <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider mb-1">
                                de {total}
                              </p>
                              <p className="text-xs font-medium text-[var(--foreground-secondary)] truncate">
                                {v.nome}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                {/* Suitability Profile */}
                <SuitabilityProfile cavalos={cavalos} cores={cores} />

                {/* Matriz de Aptidão por Disciplina — Free (simplificada) */}
                {(() => {
                  const disciplinasAptidao: { nome: string; pesos: Record<string, number> }[] = [
                    {
                      nome: "Alta Escola",
                      pesos: {
                        conformacao: 0.2,
                        andamentos: 0.25,
                        elevacao: 0.25,
                        temperamento: 0.15,
                        saude: 0.15,
                      },
                    },
                    {
                      nome: "Dressage FEI",
                      pesos: {
                        conformacao: 0.15,
                        andamentos: 0.25,
                        elevacao: 0.2,
                        regularidade: 0.2,
                        temperamento: 0.1,
                        saude: 0.1,
                      },
                    },
                    {
                      nome: "Equit. Trabalho",
                      pesos: {
                        conformacao: 0.25,
                        andamentos: 0.2,
                        temperamento: 0.25,
                        saude: 0.2,
                        blupNorm: 0.1,
                      },
                    },
                    {
                      nome: "Lazer/Turismo",
                      pesos: { temperamento: 0.35, saude: 0.3, conformacao: 0.2, andamentos: 0.15 },
                    },
                    {
                      nome: "Reprodução",
                      pesos: { blupNorm: 0.35, conformacao: 0.25, saude: 0.25, andamentos: 0.15 },
                    },
                  ];

                  const calcAptidao = (c: Cavalo, pesos: Record<string, number>): number => {
                    let total = 0;
                    let totalPeso = 0;
                    if (pesos.conformacao) {
                      total += (c.conformacao / 10) * 100 * pesos.conformacao;
                      totalPeso += pesos.conformacao;
                    }
                    if (pesos.andamentos) {
                      total += (c.andamentos / 10) * 100 * pesos.andamentos;
                      totalPeso += pesos.andamentos;
                    }
                    if (pesos.elevacao) {
                      total += (c.elevacao / 10) * 100 * pesos.elevacao;
                      totalPeso += pesos.elevacao;
                    }
                    if (pesos.regularidade) {
                      total += (c.regularidade / 10) * 100 * pesos.regularidade;
                      totalPeso += pesos.regularidade;
                    }
                    if (pesos.temperamento) {
                      total += (c.temperamento / 10) * 100 * pesos.temperamento;
                      totalPeso += pesos.temperamento;
                    }
                    if (pesos.saude) {
                      total += (c.saude / 10) * 100 * pesos.saude;
                      totalPeso += pesos.saude;
                    }
                    if (pesos.blupNorm) {
                      total += Math.min((c.blup / 130) * 100, 100) * pesos.blupNorm;
                      totalPeso += pesos.blupNorm;
                    }
                    return totalPeso > 0 ? Math.round(total / totalPeso) : 0;
                  };

                  const CAVALO_COLORS = ["#C5A059", "#60a5fa", "#34d399", "#f472b6"];

                  return (
                    <div className="bg-[var(--background-secondary)]/50 rounded-xl p-4 sm:p-6 border border-[var(--border)] mb-6">
                      <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] uppercase tracking-wider mb-5 flex items-center gap-2">
                        <Target size={16} className="text-[#C5A059]" />
                        Aptidão por Disciplina
                      </h3>
                      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                        <table className="w-full text-sm" style={{ minWidth: "320px" }}>
                          <thead>
                            <tr className="border-b border-[var(--border)]">
                              <th className="text-left text-xs text-[var(--foreground-muted)] pb-3 pr-4 min-w-[100px]">
                                Disciplina
                              </th>
                              {cavalos.map((c, i) => (
                                <th
                                  key={i}
                                  className="text-center text-xs pb-3 px-2 min-w-[60px]"
                                  style={{ color: CAVALO_COLORS[i] }}
                                >
                                  {c.nome || `Cavalo ${i + 1}`}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border)]/30">
                            {disciplinasAptidao.map((disc) => {
                              const scores = cavalos.map((c) => calcAptidao(c, disc.pesos));
                              const maxScore = Math.max(...scores);
                              return (
                                <tr key={disc.nome}>
                                  <td className="py-3 pr-4 text-xs text-[var(--foreground-secondary)] whitespace-nowrap">
                                    {disc.nome}
                                  </td>
                                  {scores.map((score, i) => (
                                    <td key={i} className="py-3 px-2 text-center">
                                      <span
                                        className={`text-sm font-bold ${score === maxScore && cavalos.length > 1 ? "" : "text-[var(--foreground-muted)]"}`}
                                        style={
                                          score === maxScore && cavalos.length > 1
                                            ? { color: CAVALO_COLORS[i] }
                                            : {}
                                        }
                                      >
                                        {score}
                                        {score === maxScore && cavalos.length > 1 && (
                                          <span className="ml-1 text-[10px]">★</span>
                                        )}
                                      </span>
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <p className="text-[10px] text-[var(--foreground-muted)]/60 mt-3">
                        ★ Melhor cavalo por disciplina. Scores de 0-100 baseados em pesos
                        específicos de cada disciplina.
                      </p>
                    </div>
                  );
                })()}

                {/* Matriz de Aptidão por Disciplina — PRO (detalhada) */}
                <BlurredProSection isSubscribed={isSubscribed} title="Aptidão por Disciplina">
                  <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                    <table className="w-full text-sm" style={{ minWidth: "360px" }}>
                      <thead>
                        <tr>
                          <th className="text-left text-xs text-[var(--foreground-muted)] font-medium pb-3 pr-4 min-w-[160px]">
                            Disciplina
                          </th>
                          {cavalos.map((c, i) => (
                            <th
                              key={c.id}
                              className="text-center text-xs font-semibold pb-3 px-2 min-w-[80px]"
                              style={{ color: cores[i] }}
                            >
                              {c.nome || `Cavalo ${String.fromCharCode(65 + i)}`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]/40">
                        {DISCIPLINE_MATRIX.map((disc) => {
                          const scores = cavalos.map((c) =>
                            calcDisciplineScore(c, disc.weights as Record<string, number>)
                          );
                          const maxScore = Math.max(...scores);
                          return (
                            <tr key={disc.label}>
                              <td className="py-3 pr-4 text-[var(--foreground-secondary)] font-medium text-xs">
                                {disc.label}
                              </td>
                              {scores.map((score, i) => {
                                const isBest = score === maxScore && cavalos.length > 1;
                                const bg =
                                  score >= 70
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : score >= 50
                                      ? "bg-amber-500/15 text-amber-400"
                                      : "bg-red-500/10 text-red-400";
                                return (
                                  <td key={i} className="py-3 px-2 text-center">
                                    <span
                                      className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold tabular-nums ${bg} ${isBest ? "ring-1 ring-current" : ""}`}
                                    >
                                      {score}
                                    </span>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <p className="text-xs text-[var(--foreground-muted)] mt-3 text-right">
                      Verde ≥70 · Âmbar 50-69 · Vermelho &lt;50 · Destaque = melhor nessa disciplina
                    </p>
                  </div>
                </BlurredProSection>

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
                                <div className="flex items-center justify-center gap-1 mt-1">
                                  <TrendingUp size={11} className="text-emerald-400" />
                                  <span className="text-xs text-emerald-400 font-medium">
                                    Potencial: {calcularPotencial(c)}
                                  </span>
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

                    {/* ROI 5 anos por cavalo */}
                    <div
                      className={`mt-4 grid gap-3 ${
                        cavalos.length === 2
                          ? "grid-cols-2"
                          : cavalos.length === 3
                            ? "grid-cols-2 sm:grid-cols-3"
                            : "grid-cols-2 sm:grid-cols-4"
                      }`}
                    >
                      {cavalos.map((c, i) => {
                        const roi = calcularROI(c);
                        return (
                          <div
                            key={c.id}
                            className="p-3 rounded-lg bg-[var(--background-card)] border border-[var(--border)]"
                          >
                            <p
                              className="text-xs text-[var(--foreground-muted)] mb-1"
                              style={{ color: cores[i] }}
                            >
                              {c.nome}
                            </p>
                            <p
                              className="text-lg font-bold"
                              style={{ color: roi.roi5yr >= 0 ? "#22c55e" : "#ef4444" }}
                            >
                              {roi.roi5yr >= 0 ? "+" : ""}
                              {roi.roi5yr}%
                            </p>
                            <p className="text-[10px] text-[var(--foreground-muted)]">ROI 5 anos</p>
                            <p className="text-[10px] text-[var(--foreground-muted)] mt-1">
                              Horizonte:{" "}
                              <span className="text-[var(--foreground-secondary)]">
                                {roi.horizonte}
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[11px] text-[var(--foreground-muted)]/60 leading-relaxed mt-3">
                      {t.comparador.cost_disclaimer}
                    </p>
                  </div>
                </BlurredProSection>

                {/* PRO: Gap Analysis */}
                <BlurredProSection
                  isSubscribed={isSubscribed}
                  title={(t.comparador as Record<string, string>).gap_title ?? "Análise de Gap"}
                >
                  <GapAnalysis
                    cavalos={cavalos}
                    cores={cores}
                    calcularScore={(c) => calcularScore(c as Cavalo)}
                  />
                </BlurredProSection>

                {/* PRO: Purchase Confidence */}
                <BlurredProSection
                  isSubscribed={isSubscribed}
                  title={
                    (t.comparador as Record<string, string>).confidence_title ??
                    "Índice de Confiança na Compra"
                  }
                >
                  <PurchaseConfidence
                    cavalos={cavalos}
                    vencedorId={vencedor.id}
                    calcularScore={(c) => calcularScore(c as Cavalo)}
                  />
                </BlurredProSection>

                {/* Methodology Panel */}
                <MethodologyPanel
                  title={
                    (t.comparador as Record<string, string>).methodology_panel_title ??
                    "Metodologia de Comparação"
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
                      description: "Nível de treino conforme escalas FEI",
                      standard: "FEI",
                    },
                    {
                      name: "Conformação",
                      weight: "10pts",
                      description: "Avaliação morfológica segundo padrões APSL",
                      standard: "APSL",
                    },
                    {
                      name: "Andamentos",
                      weight: "10pts",
                      description: "Qualidade dos três andamentos básicos",
                    },
                    {
                      name: "Idade",
                      weight: "10pts",
                      description: "Faixa ideal: 6-12 anos (máximo); 4-15 (bom)",
                    },
                    {
                      name: "Competições",
                      weight: "8pts",
                      description: "Historial competitivo e classificações",
                    },
                    { name: "Altura", weight: "8pts", description: "Faixa ideal: 158-168cm" },
                    {
                      name: "Temperamento",
                      weight: "7pts",
                      description: "Docilidade e capacidade de trabalho",
                    },
                    {
                      name: "Saúde",
                      weight: "7pts",
                      description: "Historial clínico e condição geral",
                      standard: "veterinário",
                    },
                    {
                      name: "BLUP",
                      weight: "5pts",
                      description: "Estimativa de mérito genético",
                      standard: "modelo",
                    },
                    {
                      name: "Elev.+Reg.",
                      weight: "5pts",
                      description: "Elevação e regularidade dos andamentos",
                    },
                    {
                      name: "Registo APSL",
                      weight: "3pts",
                      description: "Bónus para cavalos com registo oficial",
                      standard: "APSL",
                    },
                  ]}
                  limitations={[
                    (t.comparador as Record<string, string>).limitation_1 ??
                      "Comparação limitada aos dados declarados pelo utilizador",
                    (t.comparador as Record<string, string>).limitation_2 ??
                      "O score não captura a química cavaleiro-cavalo",
                    (t.comparador as Record<string, string>).limitation_3 ??
                      "Preços declarados pelo utilizador, não verificados",
                  ]}
                  version={
                    (t.comparador as Record<string, string>).methodology_version ??
                    "v2.1 — Fev 2026"
                  }
                  references={["Padrões APSL", "Escalas FEI"]}
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

                {/* Cross-links — próximos passos */}
                <div className="pt-4">
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--foreground-muted)] mb-4">
                    <ChevronRight size={13} className="text-[var(--gold)]" aria-hidden="true" />
                    Continua a tua jornada
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <Link
                      href="/verificador-compatibilidade"
                      className="group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl hover:border-pink-500/40 transition-all"
                    >
                      <Dna
                        size={18}
                        className="text-pink-400 shrink-0 group-hover:scale-110 transition-transform"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          Verificador Genético
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)] truncate">
                          Testa o par mais promissor
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-[var(--foreground-muted)] ml-auto shrink-0 group-hover:text-pink-400 transition-colors"
                      />
                    </Link>
                    <Link
                      href="/calculadora-valor"
                      className="group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/40 transition-all"
                    >
                      <Euro
                        size={18}
                        className="text-[var(--gold)] shrink-0 group-hover:scale-110 transition-transform"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          Calculadora de Valor
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)] truncate">
                          Estima o valor do vencedor
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-[var(--foreground-muted)] ml-auto shrink-0 group-hover:text-[var(--gold)] transition-colors"
                      />
                    </Link>
                    <Link
                      href="/analise-perfil"
                      className="group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/40 transition-all"
                    >
                      <Target
                        size={18}
                        className="text-purple-400 shrink-0 group-hover:scale-110 transition-transform"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          Análise de Perfil
                        </p>
                        <p className="text-xs text-[var(--foreground-muted)] truncate">
                          Confirma o teu tipo de comprador
                        </p>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-[var(--foreground-muted)] ml-auto shrink-0 group-hover:text-purple-400 transition-colors"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

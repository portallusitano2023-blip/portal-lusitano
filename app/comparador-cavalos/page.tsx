"use client";

import { useState } from "react";
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
import Paywall from "@/components/tools/Paywall";
import { useToolAccess } from "@/hooks/useToolAccess";
import { shareNative, copyToClipboard } from "@/lib/tools/share-utils";
import { useLanguage } from "@/context/LanguageContext";

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
    <svg width={size} height={size} className="mx-auto">
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

export default function ComparadorCavalosPage() {
  const { t } = useLanguage();
  const [cavalos, setCavalos] = useState<Cavalo[]>([
    criarCavalo("1", "Cavalo A"),
    criarCavalo("2", "Cavalo B"),
  ]);
  const [step, setStep] = useState(0); // 0 = intro
  const [showAnalise, setShowAnalise] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const {
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    recordUsage,
    isLoading: accessLoading,
  } = useToolAccess("comparador");

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
          : "text-zinc-300";
    }
    return val === melhor
      ? "text-emerald-400 font-semibold"
      : val > melhor * 1.2
        ? "text-red-400"
        : "text-zinc-300";
  };

  const vencedor = cavalos.reduce((a, b) => (calcularScore(a) > calcularScore(b) ? a : b));
  const melhorValor = cavalos.reduce((a, b) =>
    calcularValorPorPonto(a) < calcularValorPorPonto(b) ? a : b
  );

  const resetar = () => {
    setStep(0);
    setShowAnalise(false);
    setCavalos([criarCavalo("1", "Cavalo A"), criarCavalo("2", "Cavalo B")]);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium hidden sm:block">Portal Lusitano</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Scale size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-white block leading-tight">
                {t.comparador.tool_name}
              </span>
              <span className="text-xs text-zinc-500">{t.comparador.tool_subtitle}</span>
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-black/60" />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <span
                  className="inline-block px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium uppercase tracking-[0.2em] rounded-full mb-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.2s" }}
                >
                  {t.comparador.badge}
                </span>

                <h1
                  className="text-4xl sm:text-5xl md:text-6xl font-serif text-white mb-6 leading-tight opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.3s" }}
                >
                  {t.comparador.title_prefix}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-2">
                    {t.comparador.title_accent}
                  </span>
                </h1>

                <p
                  className="text-lg text-zinc-300 max-w-2xl mx-auto mb-4 font-serif italic opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: "0.4s" }}
                >
                  &ldquo;{t.comparador.intro_quote}&rdquo;
                </p>

                <p
                  className="text-sm text-zinc-500 max-w-xl mx-auto mb-10 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
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
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                      <BarChart3 className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-lg font-serif text-white mb-2">
                      {t.comparador.feat_radar}
                    </h3>
                    <p className="text-sm text-zinc-400">{t.comparador.feat_radar_desc}</p>
                  </div>

                  <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Scale className="text-emerald-400" size={24} />
                    </div>
                    <h3 className="text-lg font-serif text-white mb-2">
                      {t.comparador.feat_table}
                    </h3>
                    <p className="text-sm text-zinc-400">{t.comparador.feat_table_desc}</p>
                  </div>

                  <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                      <Euro className="text-amber-400" size={24} />
                    </div>
                    <h3 className="text-lg font-serif text-white mb-2">
                      {t.comparador.feat_value}
                    </h3>
                    <p className="text-sm text-zinc-400">{t.comparador.feat_value_desc}</p>
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
                  className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Header do Card */}
                  <div
                    className="p-4 border-b border-zinc-800"
                    style={{ borderTopWidth: 3, borderTopColor: cores[i] }}
                  >
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={c.nome}
                        onChange={(e) => update(c.id, "nome", e.target.value)}
                        className="bg-transparent text-lg font-semibold outline-none flex-1 text-white"
                        placeholder={t.comparador.placeholder_horse_name}
                      />
                      {cavalos.length > 2 && (
                        <button
                          onClick={() => remover(c.id)}
                          className="text-zinc-500 hover:text-red-400 transition-colors"
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
                        <label className="text-xs text-zinc-500 block mb-1">
                          {t.comparador.label_age}
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={c.idade}
                          onChange={(e) => update(c.id, "idade", +e.target.value || 1)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 block mb-1">
                          {t.comparador.label_height}
                        </label>
                        <input
                          type="number"
                          min="140"
                          max="180"
                          value={c.altura}
                          onChange={(e) => update(c.id, "altura", +e.target.value || 160)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">
                        {t.comparador.label_sex}
                      </label>
                      <select
                        value={c.sexo}
                        onChange={(e) => update(c.id, "sexo", e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
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
                        <label className="text-xs text-zinc-500 block mb-1">
                          {t.comparador.label_coat}
                        </label>
                        <select
                          value={c.pelagem}
                          onChange={(e) => update(c.id, "pelagem", e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                        >
                          {PELAGENS.map((p) => (
                            <option key={p.value} value={p.value}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 block mb-1">
                          {t.comparador.label_lineage}
                        </label>
                        <select
                          value={c.linhagem}
                          onChange={(e) => update(c.id, "linhagem", e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
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
                      <label className="text-xs text-zinc-500 block mb-1">
                        {t.comparador.label_training}
                      </label>
                      <select
                        value={c.treino}
                        onChange={(e) => update(c.id, "treino", e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
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
                          <label className="text-xs text-zinc-500">{label}</label>
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
                          className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                          style={{ accentColor: cores[i] }}
                        />
                      </div>
                    ))}

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-500 block mb-1">
                          {t.comparador.label_competitions}
                        </label>
                        <select
                          value={c.competicoes}
                          onChange={(e) => update(c.id, "competicoes", e.target.value)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                        >
                          {COMPETICOES.map((co) => (
                            <option key={co.value} value={co.value}>
                              {co.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 block mb-1">BLUP</label>
                        <input
                          type="number"
                          min="50"
                          max="150"
                          value={c.blup}
                          onChange={(e) => update(c.id, "blup", +e.target.value || 100)}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">
                        {t.comparador.label_price}
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={c.preco}
                        onChange={(e) => update(c.id, "preco", +e.target.value || 0)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <button
                      onClick={() => update(c.id, "registoAPSL", !c.registoAPSL)}
                      className={`w-full py-2 px-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        c.registoAPSL
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                          : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
                      }`}
                    >
                      {c.registoAPSL && <Check size={14} />}
                      {t.comparador.label_apsl_reg}
                    </button>
                  </div>

                  {/* Score Preview */}
                  {showAnalise && (
                    <div className="p-4 bg-zinc-800/50 border-t border-zinc-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-400">{t.comparador.score_total}</span>
                        <span className="text-2xl font-bold" style={{ color: cores[i] }}>
                          {calcularScore(c)}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500">
                        {t.comparador.value_per_point}{" "}
                        <span className="text-zinc-300">
                          {calcularValorPorPonto(c).toLocaleString("pt-PT")}€
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

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

            {/* Botão Analisar */}
            {!showAnalise && (
              <>
                <button
                  onClick={() => {
                    if (!canUse) return;
                    setShowAnalise(true);
                    recordUsage({
                      cavalos: cavalos.map((c) => ({
                        nome: c.nome,
                        idade: c.idade,
                        pelagem: c.pelagem,
                      })),
                    });
                  }}
                  disabled={!canUse}
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

            {/* Análise */}
            {showAnalise && (
              <div className="space-y-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
                {/* Acções: PDF, Partilhar, Imprimir */}
                <ResultActions
                  onExportPDF={handleExportPDF}
                  onShare={handleShare}
                  onPrint={() => window.print()}
                  isExporting={isExporting}
                />

                {/* Gráfico Radar */}
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
                  <h3 className="text-lg font-serif mb-6 flex items-center gap-3">
                    <Activity className="text-blue-400" size={20} />
                    {t.comparador.visual_comparison}
                  </h3>
                  <div className="flex flex-col items-center">
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
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                      {cavalos.map((c, i) => (
                        <div key={c.id} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: cores[i] }}
                          />
                          <span className="text-sm text-zinc-300">{c.nome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tabela Comparativa */}
                <div className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 overflow-x-auto">
                  <h3 className="text-lg font-serif mb-6 flex items-center gap-3">
                    <Scale className="text-blue-400" size={20} />
                    {t.comparador.comparative_table}
                  </h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-zinc-400 border-b border-zinc-800">
                        <th className="text-left py-3 px-2">{t.comparador.param_header}</th>
                        {cavalos.map((c, i) => (
                          <th
                            key={c.id}
                            className="text-center py-3 px-2"
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
                        <tr key={campo} className="border-b border-zinc-800/50">
                          <td className="py-3 px-2 text-zinc-400">{label}</td>
                          {cavalos.map((c) => (
                            <td
                              key={c.id}
                              className={`text-center py-3 px-2 ${getClasseCor(c[campo] as number, getMelhor(campo, maior), maior)}`}
                            >
                              {campo === "preco"
                                ? `${(c[campo] as number).toLocaleString("pt-PT")}${suffix}`
                                : `${c[campo]}${suffix}`}
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="border-t-2 border-zinc-700">
                        <td className="py-4 px-2 font-semibold text-white">
                          {t.comparador.total_score}
                        </td>
                        {cavalos.map((c, i) => (
                          <td key={c.id} className="text-center py-4 px-2">
                            <span className="text-2xl font-bold" style={{ color: cores[i] }}>
                              {calcularScore(c)}
                            </span>
                            {c.id === vencedor.id && (
                              <Crown className="inline ml-2 text-amber-400" size={16} />
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-t border-zinc-800">
                        <td className="py-3 px-2 text-zinc-400">{t.comparador.value_per_pt}</td>
                        {cavalos.map((c) => (
                          <td
                            key={c.id}
                            className={`text-center py-3 px-2 ${
                              c.id === melhorValor.id
                                ? "text-emerald-400 font-semibold"
                                : "text-zinc-300"
                            }`}
                          >
                            {calcularValorPorPonto(c).toLocaleString("pt-PT")}€
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Recomendação */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-amber-900/30 to-zinc-900 rounded-2xl p-6 border border-amber-500/30">
                    <h3 className="text-lg font-serif mb-4 flex items-center gap-3">
                      <Trophy className="text-amber-400" size={20} />
                      {t.comparador.best_quality}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-amber-500/20 rounded-xl">
                        <Crown className="text-amber-400" size={28} />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-amber-400">{vencedor.nome}</p>
                        <p className="text-sm text-zinc-400">
                          Score: {calcularScore(vencedor)} {t.comparador.points}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {vencedor.treino} • {vencedor.linhagem}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-900/30 to-zinc-900 rounded-2xl p-6 border border-emerald-500/30">
                    <h3 className="text-lg font-serif mb-4 flex items-center gap-3">
                      <Euro className="text-emerald-400" size={20} />
                      {t.comparador.best_cost_benefit}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-emerald-500/20 rounded-xl">
                        <TrendingUp className="text-emerald-400" size={28} />
                      </div>
                      <div>
                        <p className="text-xl font-bold text-emerald-400">{melhorValor.nome}</p>
                        <p className="text-sm text-zinc-400">
                          {calcularValorPorPonto(melhorValor).toLocaleString("pt-PT")}€{" "}
                          {t.comparador.per_point}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">
                          {melhorValor.preco.toLocaleString("pt-PT")}€ • Score{" "}
                          {calcularScore(melhorValor)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    <strong className="text-zinc-400">{t.comparador.disclaimer_title}</strong>{" "}
                    {t.comparador.disclaimer_text}
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

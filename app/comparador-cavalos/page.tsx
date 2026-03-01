"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Scale, Crown, BarChart3, RefreshCw, History, X, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import ToolNavBar from "@/components/tools/ToolNavBar";
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";
import Paywall from "@/components/tools/Paywall";
import { useToolAccess } from "@/hooks/useToolAccess";
import { shareNative, copyToClipboard } from "@/lib/tools/share-utils";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { useToast } from "@/context/ToastContext";

import type { Cavalo, HistoryEntry } from "@/components/comparador-cavalos/types";
import {
  criarCavalo,
  DRAFT_KEY,
  CHAIN_KEY,
  PROFILE_CONTEXT_KEY,
  HISTORY_KEY,
  PROFILE_LABELS,
  SUBPROFILE_LABELS,
} from "@/components/comparador-cavalos/data";
import {
  calcularScore,
  calcularValorPorPonto,
  exportarCSV,
} from "@/components/comparador-cavalos/calcular";
import IntroSection from "@/components/comparador-cavalos/IntroSection";
import HorseForm from "@/components/comparador-cavalos/HorseForm";
import ProcessingOverlay from "@/components/comparador-cavalos/ProcessingOverlay";

const ResultsSection = dynamic(() => import("@/components/comparador-cavalos/ResultsSection"));
const ProUpgradeCard = dynamic(() => import("@/components/tools/ProUpgradeCard"));

export default function ComparadorCavalosPage() {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);
  const { showToast } = useToast();

  const [cavalos, setCavalos] = useState<Cavalo[]>([
    criarCavalo("1", "Cavalo A"),
    criarCavalo("2", "Cavalo B"),
  ]);
  const [step, setStep] = useState(0);
  const [showAnalise, setShowAnalise] = useState(false);
  const [calculando, setCalculando] = useState(false);
  const [calculandoStep, setCalculandoStep] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftDate, setDraftDate] = useState("");
  const [profileContext, setProfileContext] = useState<{
    profile: string;
    subProfile: string | null;
    priceRange: string;
  } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [filtroDisciplina, setFiltroDisciplina] = useState("geral");
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
  // EFFECTS
  // ============================================

  // Tool chain + draft restore + profile context (on mount)
  useEffect(() => {
    try {
      const chain = sessionStorage.getItem(CHAIN_KEY);
      if (chain) {
        const parsed = JSON.parse(chain) as {
          source: string;
          horse?: Partial<Cavalo>;
          horses?: Partial<Cavalo>[];
        };

        if (parsed.source === "calculadora" && parsed.horse) {
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
          parsed.source === "verificador_pair" &&
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

  // Auto-save (800ms debounce)
  useEffect(() => {
    if (step === 0 || showAnalise) return;
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

  // Load history
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as HistoryEntry[];
        if (Array.isArray(parsed)) setHistory(parsed);
      }
    } catch {}
  }, []);

  // Save history entry on analysis
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAnalise]);

  // ============================================
  // HANDLERS
  // ============================================

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

  const applyPreset = (id: string, preset: Partial<Cavalo>) => {
    setCavalos((prev) => prev.map((horse) => (horse.id === id ? { ...horse, ...preset } : horse)));
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

  const handleExportCSV = () => exportarCSV(cavalos);

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

  const handleAnalyse = () => {
    if (!canUse) return;
    const cavalosValidos = cavalos.filter((c) => c.nome.trim() && !c.nome.startsWith("Cavalo"));
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
        ? cavalos.reduce((a, b) => (calcularScore(a) > calcularScore(b) ? a : b)).nome
        : "";
    const vencedorScore =
      cavalos.length > 0
        ? calcularScore(cavalos.reduce((a, b) => (calcularScore(a) > calcularScore(b) ? a : b)))
        : 0;
    recordUsage(
      { count: cavalos.length },
      {
        vencedor: vencedorNome,
        vencedorScore,
        count: cavalos.length,
        disciplinas: [
          ...new Set(cavalos.flatMap((c) => (c.competicoes !== "Nenhuma" ? [c.competicoes] : []))),
        ],
      }
    );
    setTimeout(() => setCalculandoStep(1), 600);
    setTimeout(() => setCalculandoStep(2), 1200);
    setTimeout(() => {
      setCalculando(false);
      setShowAnalise(true);
    }, 2000);
  };

  // ============================================
  // DERIVED
  // ============================================

  const vencedor = cavalos.reduce((a, b) => (calcularScore(a) > calcularScore(b) ? a : b));
  const melhorValor = cavalos.reduce((a, b) =>
    calcularValorPorPonto(a) < calcularValorPorPonto(b) ? a : b
  );

  // ============================================
  // RENDER
  // ============================================

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <ToolNavBar
        currentTool="comparador-cavalos"
        hasResult={!!showAnalise}
        rightSlot={
          <>
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
          </>
        }
      />

      <div id="main-content" className="pt-16">
        {/* Intro */}
        {step === 0 && (
          <IntroSection
            t={t}
            hasDraft={hasDraft}
            draftDate={draftDate}
            profileContext={profileContext}
            onStart={() => setStep(1)}
            onRestoreDraft={restaurarDraft}
            onDiscardDraft={descartarDraft}
            onDismissProfile={() => setProfileContext(null)}
          />
        )}

        {/* Comparison form + analysis */}
        {step === 1 && (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
            {/* Hint for new users */}
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

            {/* Horse cards grid */}
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
                <HorseForm
                  key={c.id}
                  cavalo={c}
                  index={i}
                  totalCavalos={cavalos.length}
                  showAnalise={showAnalise}
                  vencedorId={vencedor.id}
                  melhorValorId={melhorValor.id}
                  filtroDisciplina={filtroDisciplina}
                  t={t}
                  onUpdate={update}
                  onRemove={remover}
                  onApplyPreset={applyPreset}
                />
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

            {/* Profile context banner */}
            {profileContext && (
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

            {/* Analyse button */}
            {!showAnalise && (
              <>
                <button
                  onClick={handleAnalyse}
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
            {calculando && <ProcessingOverlay step={calculandoStep} />}

            {/* Results */}
            {showAnalise && (
              <ResultsSection
                cavalos={cavalos}
                isSubscribed={isSubscribed}
                isExporting={isExporting}
                filtroDisciplina={filtroDisciplina}
                t={t}
                onSetFiltroDisciplina={setFiltroDisciplina}
                onExportPDF={handleExportPDF}
                onExportCSV={handleExportCSV}
                onShare={handleShare}
                onGoBack={() => setShowAnalise(false)}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}

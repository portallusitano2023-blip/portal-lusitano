"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Heart, RefreshCw, Trophy, Dna, Leaf, Star } from "lucide-react";
import ToolNavBar from "@/components/tools/ToolNavBar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";
import ProUpgradeCard from "@/components/tools/ProUpgradeCard";
import { useToolAccess } from "@/hooks/useToolAccess";
import { shareNative, copyToClipboard } from "@/lib/tools/share-utils";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import {
  IntroHero,
  HorseForm,
  CompatibilityResults,
  calcularCompatibilidade,
  criarCavalo,
} from "@/components/verificador-compatibilidade";
import type { Cavalo, ResultadoCompatibilidade } from "@/components/verificador-compatibilidade";

const DRAFT_KEY = "verificador_draft_v1";
const BREEDING_CHAIN_KEY = "tool_chain_breeding";

// FIX A: extracted from inside the useEffect to module scope
function mapTemperamentScore(t: number): string {
  if (t >= 8) return "Calmo";
  if (t >= 6) return "Equilibrado";
  if (t >= 4) return "Energético";
  return "Difícil";
}

interface ChainHorse {
  nome: string;
  sexo: string;
  idade: number;
  altura: number;
  pelagem: string;
  linhagem: string;
  linhagemFamosa: string;
  conformacao: number;
  andamentos: number;
  temperamento: number;
  saude: number;
  blup: number;
}

export default function VerificadorCompatibilidadePage() {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);
  const [garanhao, setGaranhao] = useState<Cavalo>(criarCavalo("Garanhão"));
  const [egua, setEgua] = useState<Cavalo>(criarCavalo("Égua"));
  const [tab, setTab] = useState<"garanhao" | "egua">("garanhao");
  const [step, setStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultado, setResultado] = useState<ResultadoCompatibilidade | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [objetivo, setObjetivo] = useState<"competicao" | "reproducao" | "lazer" | "show">(
    "competicao"
  );
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftDate, setDraftDate] = useState<string>("");
  const [chainBanner, setChainBanner] = useState<string | null>(null);
  const [chainImported, setChainImported] = useState(false);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const {
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    recordUsage,
    isLoading: accessLoading,
  } = useToolAccess("compatibilidade");

  // ============================================
  // AUTO-SAVE + DRAFT RESTORE
  // ============================================

  useEffect(() => {
    try {
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

  // ============================================
  // TOOL CHAIN: ler par do Comparador de Cavalos
  // ============================================

  useEffect(() => {
    try {
      const chain = sessionStorage.getItem(BREEDING_CHAIN_KEY);
      if (!chain) return;
      sessionStorage.removeItem(BREEDING_CHAIN_KEY);
      const parsed = JSON.parse(chain) as {
        source?: string;
        garanhao: ChainHorse | Record<string, never>;
        egua: ChainHorse | Record<string, never>;
      };
      const g = parsed.garanhao as ChainHorse;
      const e = parsed.egua as ChainHorse;

      // From Calculadora: only one horse is populated
      const hasGaranhao = g && g.nome;
      const hasEgua = e && e.nome;

      if (hasGaranhao) {
        setGaranhao((prev) => ({
          ...prev,
          nome: g.nome || prev.nome,
          idade: g.idade ?? prev.idade,
          altura: g.altura ?? prev.altura,
          pelagem: g.pelagem || prev.pelagem,
          linhagem: g.linhagem || prev.linhagem,
          linhagemFamosa: g.linhagemFamosa || prev.linhagemFamosa,
          conformacao: g.conformacao ?? prev.conformacao,
          andamentos: g.andamentos ?? prev.andamentos,
          temperamento: g.temperamento ? mapTemperamentScore(g.temperamento) : prev.temperamento,
          saude: g.saude ?? prev.saude,
          blup: g.blup ?? prev.blup,
        }));
      }
      if (hasEgua) {
        setEgua((prev) => ({
          ...prev,
          nome: e.nome || prev.nome,
          idade: e.idade ?? prev.idade,
          altura: e.altura ?? prev.altura,
          pelagem: e.pelagem || prev.pelagem,
          linhagem: e.linhagem || prev.linhagem,
          linhagemFamosa: e.linhagemFamosa || prev.linhagemFamosa,
          conformacao: e.conformacao ?? prev.conformacao,
          andamentos: e.andamentos ?? prev.andamentos,
          temperamento: e.temperamento ? mapTemperamentScore(e.temperamento) : prev.temperamento,
          saude: e.saude ?? prev.saude,
          blup: e.blup ?? prev.blup,
        }));
      }
      setStep(1);
      // Set the correct tab to the side that needs filling
      if (hasGaranhao && !hasEgua) setTab("egua");
      if (hasEgua && !hasGaranhao) setTab("garanhao");
      const bannerText =
        hasGaranhao && hasEgua
          ? `${g.nome || "Garanhão"} × ${e.nome || "Égua"}`
          : hasGaranhao
            ? `${g.nome} — preencha a égua`
            : `${e.nome} — preencha o garanhão`;
      setChainBanner(bannerText);
      setChainImported(true);
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[Tool Chain] Erro ao importar dados:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (step === 0 || resultado) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ garanhao, egua, savedAt: new Date().toISOString() })
        );
      } catch {}
    }, 800);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [garanhao, egua, step, resultado]);

  const restaurarDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const { garanhao: g, egua: e } = JSON.parse(saved) as { garanhao: Cavalo; egua: Cavalo };
        setGaranhao(g);
        setEgua(e);
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

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  const handleExportPDF = async () => {
    if (!resultado) return;
    setIsExporting(true);
    try {
      const { generateCompatibilidadePDF } = await import("@/lib/tools/pdf/compatibilidade-pdf");
      await generateCompatibilidadePDF(garanhao, egua, resultado);
    } catch {
      showError(
        tr(
          "Erro ao gerar PDF. Tenta novamente.",
          "Error generating PDF. Please try again.",
          "Error al generar PDF. Inténtalo de nuevo."
        )
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      const title = t.verificador.tool_name;
      const text = `${t.verificador.compatibility}: ${garanhao.nome || t.verificador.tab_stallion} x ${egua.nome || t.verificador.tab_mare} - Portal Lusitano`;
      const shared = await shareNative(title, text, url);
      if (!shared) await copyToClipboard(url);
    } catch {
      showError(
        tr(
          "Erro ao partilhar. Copia o link manualmente.",
          "Error sharing. Please copy the link manually.",
          "Error al compartir. Copia el enlace manualmente."
        )
      );
    }
  };

  const calcular = () => {
    // FIX C: guard against double-click while a calculation is already in progress
    if (isCalculating) return;
    if (!canUse) return;
    setIsCalculating(true);

    setTimeout(() => {
      try {
        const resultadoFinal = calcularCompatibilidade(garanhao, egua);
        setResultado(resultadoFinal);
        recordUsage(
          { garanhao: garanhao.nome, egua: egua.nome },
          {
            score: resultadoFinal.score,
            nivel: resultadoFinal.nivel,
            coi: resultadoFinal.coi,
            riscosAltos: resultadoFinal.riscos.filter((r) => r.severidade === "alto").length,
            pelagens: resultadoFinal.pelagens.slice(0, 2).map((p) => p.cor),
          }
        );
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : tr("Erro desconhecido", "Unknown error", "Error desconocido");
        if (msg.includes("network") || msg.includes("fetch")) {
          showError(
            tr(
              "Erro de ligação. Verifica a tua ligação à internet e tenta novamente.",
              "Connection error. Check your internet connection and try again.",
              "Error de conexión. Verifica tu conexión a internet e inténtalo de nuevo."
            )
          );
        } else if (msg.includes("timeout")) {
          showError(
            tr(
              "O cálculo demorou demasiado. Tenta com menos variáveis.",
              "The calculation took too long. Try with fewer variables.",
              "El cálculo tardó demasiado. Intenta con menos variables."
            )
          );
        } else {
          showError(
            tr(
              "Não foi possível calcular a compatibilidade. Verifica os dados introduzidos.",
              "Could not calculate compatibility. Check the entered data.",
              "No fue posible calcular la compatibilidad. Verifica los datos introducidos."
            )
          );
        }
      } finally {
        setIsCalculating(false);
      }
    }, 2000);
  };

  const resetar = () => {
    setResultado(null);
    setStep(0);
    setGaranhao(criarCavalo("Garanhão"));
    setEgua(criarCavalo("Égua"));
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setHasDraft(false);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <ToolNavBar
        currentTool="verificador-compatibilidade"
        hasResult={!!resultado}
        rightSlot={
          resultado ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-sm text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">{t.verificador.new_analysis}</span>
            </button>
          ) : undefined
        }
      />

      <div id="main-content" className="pt-16">
        {/* Error Toast */}
        {error && (
          <div className="fixed bottom-4 right-4 z-50 bg-red-900/90 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3 max-w-sm">
            <span className="text-red-400">&#9888;</span>
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-200"
            >
              &#10005;
            </button>
          </div>
        )}

        {/* Subscription Banner */}
        <div className="max-w-4xl mx-auto px-4 pt-6">
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
          {/* PRO Status Bar */}
          {!accessLoading && (step > 0 || !!resultado) && isSubscribed && (
            <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg p-3 flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-sm mt-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-[#C5A059] shrink-0"
                aria-hidden="true"
              >
                <path d="M2 19l2-8 5 4 3-9 3 9 5-4 2 8H2z" />
              </svg>
              <span className="text-[#C5A059] font-semibold">PRO Activo</span>
              <span className="text-[#C5A059]/50 hidden sm:inline">•</span>
              <span className="text-[#C5A059]/80 hidden sm:inline">Utilizações ilimitadas</span>
              <span className="text-[#C5A059]/50 hidden sm:inline">•</span>
              <span className="text-[#C5A059]/80 hidden sm:inline">Verificador desbloqueado</span>
              <a
                href="/ferramentas/historico"
                className="ml-auto text-[#C5A059]/70 hover:text-[#C5A059] transition-colors whitespace-nowrap text-xs sm:text-sm"
              >
                Ver histórico →
              </a>
            </div>
          )}
          {/* Free uses counter */}
          {!accessLoading && (step > 0 || !!resultado) && !isSubscribed && freeUsesLeft > 0 && (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 flex flex-wrap items-center gap-x-2 gap-y-1 mb-6 text-sm mt-2">
              <span className="text-amber-400/90 flex-1 min-w-0">
                {freeUsesLeft} uso{freeUsesLeft !== 1 ? "s" : ""} gratuito
                {freeUsesLeft !== 1 ? "s" : ""} disponível{freeUsesLeft !== 1 ? "is" : ""} —
                Subscreva PRO para utilizações ilimitadas
              </span>
              <a
                href="/ferramentas"
                className="text-amber-400 hover:text-amber-300 transition-colors font-medium whitespace-nowrap"
              >
                Subscrever
              </a>
            </div>
          )}
        </div>

        {/* Intro */}
        {step === 0 && !resultado && (
          <>
            <IntroHero onStart={() => setStep(1)} />
            {hasDraft && (
              <div className="max-w-4xl mx-auto px-4 -mt-8 mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-3 px-5 py-4 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl">
                  <p className="text-xs text-[var(--gold)] flex-1 text-center sm:text-left">
                    Tem uma análise guardada de {draftDate}
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
              </div>
            )}
          </>
        )}

        {/* Chain banner — par importado do Comparador (pink variant) */}
        {step === 1 && !resultado && chainBanner && (
          <div className="max-w-4xl mx-auto px-4 mb-2">
            <div className="bg-pink-900/20 border border-pink-500/30 rounded-xl p-4 flex items-center gap-3">
              <Heart size={15} className="text-pink-400 shrink-0" />
              <p className="text-sm text-pink-300 flex-1">
                Par importado do Comparador: <span className="font-semibold">{chainBanner}</span> —
                revê os dados e clica em Calcular.
              </p>
              <button
                onClick={() => setChainBanner(null)}
                className="text-pink-400/60 hover:text-pink-400 text-lg leading-none"
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Chain imported banner — blue info variant */}
        {chainImported && (
          <div className="max-w-4xl mx-auto px-4 mb-4 mt-4">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-900/20 border border-blue-500/30 rounded-xl text-sm text-blue-300">
              <ArrowRight size={15} className="shrink-0" />
              Dados importados do Comparador — reveja os campos e clique em &quot;Verificar
              Compatibilidade&quot;
            </div>
          </div>
        )}

        {/* Form */}
        {step === 1 && !resultado && (
          <HorseForm
            garanhao={garanhao}
            egua={egua}
            setGaranhao={setGaranhao}
            setEgua={setEgua}
            tab={tab}
            setTab={setTab}
            canUse={canUse}
            requiresAuth={requiresAuth}
            isCalculating={isCalculating}
            onCalcular={calcular}
          />
        )}

        {/* Selector de Objectivo */}
        {resultado && (
          <div className="max-w-4xl mx-auto px-4 mb-4">
            <div className="bg-[var(--background-secondary)]/50 rounded-2xl p-5 border border-[var(--border)]">
              <p className="text-xs text-[var(--foreground-muted)] mb-4 uppercase tracking-[0.15em] font-semibold">
                {tr("Objetivo do Cruzamento", "Breeding Objective", "Objetivo del Cruzamiento")}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: "competicao" as const,
                    label: tr("Alta Competição", "High Competition", "Alta Competición"),
                    Icon: Trophy,
                    desc: "FEI / CDI",
                    color: "text-amber-400",
                    bg: "bg-amber-500/10",
                    border: "border-amber-500/40",
                  },
                  {
                    id: "reproducao" as const,
                    label: tr("Programa de Cria", "Breeding Programme", "Programa de Cría"),
                    Icon: Dna,
                    desc: tr(
                      "Melhoramento genético",
                      "Genetic improvement",
                      "Mejoramiento genético"
                    ),
                    color: "text-purple-400",
                    bg: "bg-purple-500/10",
                    border: "border-purple-500/40",
                  },
                  {
                    id: "lazer" as const,
                    label: tr("Lazer & Turismo", "Leisure & Tourism", "Ocio & Turismo"),
                    Icon: Leaf,
                    desc: tr(
                      "Temperamento & saúde",
                      "Temperament & health",
                      "Temperamento & salud"
                    ),
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-500/40",
                  },
                  {
                    id: "show" as const,
                    label: tr("Exposição / Show", "Exhibition / Show", "Exposición / Show"),
                    Icon: Star,
                    desc: tr("Morfologia & pelagem", "Morphology & coat", "Morfología & pelaje"),
                    color: "text-pink-400",
                    bg: "bg-pink-500/10",
                    border: "border-pink-500/40",
                  },
                ].map((obj) => {
                  const isActive = objetivo === obj.id;
                  return (
                    <button
                      key={obj.id}
                      onClick={() => setObjetivo(obj.id)}
                      className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200 text-center ${
                        isActive
                          ? `${obj.border} ${obj.bg}`
                          : "border-[var(--border)] hover:border-[var(--foreground-muted)]/40 hover:bg-[var(--background-card)]/40"
                      }`}
                      aria-pressed={isActive}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${isActive ? obj.bg : "bg-[var(--background-card)]"}`}
                      >
                        <obj.Icon
                          size={18}
                          className={
                            isActive
                              ? obj.color
                              : "text-[var(--foreground-muted)] group-hover:text-[var(--foreground-secondary)]"
                          }
                        />
                      </div>
                      <span
                        className={`text-xs font-semibold leading-tight transition-colors ${isActive ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]"}`}
                      >
                        {obj.label}
                      </span>
                      <span className="text-[10px] text-[var(--foreground-muted)] leading-tight">
                        {obj.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {resultado && (
          <CompatibilityResults
            resultado={resultado}
            garanhao={garanhao}
            egua={egua}
            garanhaoNome={garanhao.nome}
            eguaNome={egua.nome}
            onExportPDF={handleExportPDF}
            onShare={handleShare}
            isExporting={isExporting}
            isSubscribed={isSubscribed}
            objetivo={objetivo}
          />
        )}
      </div>

      <ConfirmDialog
        open={showResetConfirm}
        title={tr("Nova análise?", "New analysis?", "¿Nuevo análisis?")}
        message={tr(
          "Os dados actuais do garanhão e da égua serão perdidos. Tens a certeza?",
          "Current stallion and mare data will be lost. Are you sure?",
          "Los datos actuales del semental y la yegua se perderán. ¿Estás seguro?"
        )}
        confirmLabel={tr("Recomeçar", "Start over", "Reiniciar")}
        cancelLabel={tr("Cancelar", "Cancel", "Cancelar")}
        variant="warning"
        onConfirm={() => {
          setShowResetConfirm(false);
          resetar();
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </main>
  );
}

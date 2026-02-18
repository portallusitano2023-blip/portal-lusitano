"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, RefreshCw } from "lucide-react";
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";
import ProUpgradeCard from "@/components/tools/ProUpgradeCard";
import { useToolAccess } from "@/hooks/useToolAccess";
import { shareNative, copyToClipboard } from "@/lib/tools/share-utils";
import { useLanguage } from "@/context/LanguageContext";
import {
  IntroHero,
  HorseForm,
  CompatibilityResults,
  calcularCompatibilidade,
  criarCavalo,
} from "@/components/verificador-compatibilidade";
import type { Cavalo, ResultadoCompatibilidade } from "@/components/verificador-compatibilidade";

const DRAFT_KEY = "verificador_draft_v1";

export default function VerificadorCompatibilidadePage() {
  const { t } = useLanguage();
  const [garanhao, setGaranhao] = useState<Cavalo>(criarCavalo("Garanhão"));
  const [egua, setEgua] = useState<Cavalo>(criarCavalo("Égua"));
  const [tab, setTab] = useState<"garanhao" | "egua">("garanhao");
  const [step, setStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultado, setResultado] = useState<ResultadoCompatibilidade | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      showError("Erro ao gerar PDF. Tenta novamente.");
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
      showError("Erro ao partilhar. Copia o link manualmente.");
    }
  };

  const calcular = () => {
    if (!canUse) return;
    setIsCalculating(true);

    setTimeout(() => {
      try {
        const resultadoFinal = calcularCompatibilidade(garanhao, egua);
        setResultado(resultadoFinal);
        recordUsage(
          { garanhao: garanhao.nome, egua: egua.nome },
          { score: resultadoFinal.score, nivel: resultadoFinal.nivel }
        );
      } catch {
        showError("Erro no cálculo. Tenta novamente.");
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium hidden sm:block">Portal Lusitano</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Heart size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-[var(--foreground)] block leading-tight">
                {t.verificador.tool_name}
              </span>
              <span className="text-xs text-[var(--foreground-muted)]">
                {t.verificador.tool_subtitle}
              </span>
            </div>
          </div>

          {resultado && (
            <button
              onClick={resetar}
              className="text-sm text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">{t.verificador.new_analysis}</span>
            </button>
          )}
        </div>
      </header>

      <div className="pt-16">
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
            <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg p-3 flex items-center gap-2 mb-6 text-sm mt-2">
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
              <span className="text-[#C5A059]/50">•</span>
              <span className="text-[#C5A059]/80">Utilizações ilimitadas</span>
              <span className="text-[#C5A059]/50">•</span>
              <span className="text-[#C5A059]/80">Verificador desbloqueado</span>
              <a
                href="/ferramentas/historico"
                className="ml-auto text-[#C5A059]/70 hover:text-[#C5A059] transition-colors whitespace-nowrap"
              >
                Ver histórico →
              </a>
            </div>
          )}
          {/* Free uses counter */}
          {!accessLoading && (step > 0 || !!resultado) && !isSubscribed && freeUsesLeft > 0 && (
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3 flex items-center gap-2 mb-6 text-sm mt-2">
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
          />
        )}
      </div>
    </main>
  );
}

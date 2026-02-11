"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, RefreshCw } from "lucide-react";
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";
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

export default function VerificadorCompatibilidadePage() {
  const { t } = useLanguage();
  const [garanhao, setGaranhao] = useState<Cavalo>(criarCavalo("Garanhão"));
  const [egua, setEgua] = useState<Cavalo>(criarCavalo("Égua"));
  const [tab, setTab] = useState<"garanhao" | "egua">("garanhao");
  const [step, setStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultado, setResultado] = useState<ResultadoCompatibilidade | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const {
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    recordUsage,
    isLoading: accessLoading,
  } = useToolAccess("compatibilidade");

  const handleExportPDF = async () => {
    if (!resultado) return;
    setIsExporting(true);
    try {
      const { generateCompatibilidadePDF } = await import("@/lib/tools/pdf/compatibilidade-pdf");
      await generateCompatibilidadePDF(garanhao, egua, resultado);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = t.verificador.tool_name;
    const text = `${t.verificador.compatibility}: ${garanhao.nome || t.verificador.tab_stallion} x ${egua.nome || t.verificador.tab_mare} - Portal Lusitano`;
    const shared = await shareNative(title, text, url);
    if (!shared) await copyToClipboard(url);
  };

  const calcular = () => {
    if (!canUse) return;
    setIsCalculating(true);

    setTimeout(() => {
      const resultadoFinal = calcularCompatibilidade(garanhao, egua);
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
                {t.verificador.tool_name}
              </span>
              <span className="text-xs text-zinc-500">{t.verificador.tool_subtitle}</span>
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
        </div>

        {/* Intro */}
        {step === 0 && !resultado && <IntroHero onStart={() => setStep(1)} />}

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
            garanhaoNome={garanhao.nome}
            eguaNome={egua.nome}
            onExportPDF={handleExportPDF}
            onShare={handleShare}
            isExporting={isExporting}
          />
        )}
      </div>
    </main>
  );
}

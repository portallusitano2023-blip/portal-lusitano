"use client";

import { useState, useRef } from "react";
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";
import Paywall from "@/components/tools/Paywall";
import { useToolAccess } from "@/hooks/useToolAccess";
import { shareNative, copyToClipboard } from "@/lib/tools/share-utils";
import { useLanguage } from "@/context/LanguageContext";
import {
  CalculadoraHeader,
  IntroSection,
  StepIdentificacao,
  StepGeneticaMorfologia,
  StepAndamentosTemperamento,
  StepTreinoSaude,
  StepReproducaoMercado,
  StepNavigation,
  ResultadoDisplay,
  calcularValor,
} from "@/components/calculadora-valor";
import type { FormData, Resultado } from "@/components/calculadora-valor";

// ============================================
// DEFAULT FORM STATE
// ============================================

const INITIAL_FORM: FormData = {
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
  tendencia: "estavel",
};

const TOTAL_STEPS = 5;

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function CalculadoraValorPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const {
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    recordUsage,
    isLoading: accessLoading,
  } = useToolAccess("calculadora");

  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const calcular = () => {
    if (!canUse) return;
    setIsCalculating(true);

    setTimeout(() => {
      const result = calcularValor(form);
      setResultado(result);
      setIsCalculating(false);
      recordUsage(form as unknown as Record<string, unknown>);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }, 2000);
  };

  const resetar = () => {
    setResultado(null);
    setStep(0);
  };

  const handleExportPDF = async () => {
    if (!resultado) return;
    setIsExporting(true);
    try {
      const { generateCalculadoraPDF } = await import("@/lib/tools/pdf/calculadora-pdf");
      await generateCalculadoraPDF(form, resultado);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${t.calculadora.tool_name} - Portal Lusitano`;
    const shared = await shareNative(t.calculadora.tool_name, text, url);
    if (!shared) await copyToClipboard(url);
  };

  const progress = step === 0 ? 0 : (step / TOTAL_STEPS) * 100;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <CalculadoraHeader
        step={step}
        totalSteps={TOTAL_STEPS}
        progress={progress}
        hasResultado={!!resultado}
        onReset={resetar}
      />

      <div className="pt-16">
        {/* Intro */}
        {step === 0 && !resultado && <IntroSection onStart={() => setStep(1)} />}

        {/* Form area */}
        <div className="pb-24 px-4">
          <div className="max-w-2xl mx-auto">
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

            {/* Form steps */}
            {step > 0 && !resultado && (
              <div
                key={`step-${step}`}
                className="space-y-8 pt-8 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
              >
                {step === 1 && <StepIdentificacao form={form} update={update} />}
                {step === 2 && <StepGeneticaMorfologia form={form} update={update} />}
                {step === 3 && <StepAndamentosTemperamento form={form} update={update} />}
                {step === 4 && <StepTreinoSaude form={form} update={update} />}
                {step === 5 && <StepReproducaoMercado form={form} update={update} />}

                {!canUse && (
                  <Paywall toolName={t.calculadora.tool_name} requiresAuth={requiresAuth} />
                )}

                <StepNavigation
                  step={step}
                  totalSteps={TOTAL_STEPS}
                  isCalculating={isCalculating}
                  onPrevious={() => setStep((s) => s - 1)}
                  onNext={() => setStep((s) => s + 1)}
                  onCalculate={calcular}
                />
              </div>
            )}

            {/* Result */}
            {resultado && (
              <ResultadoDisplay
                ref={resultRef}
                resultado={resultado}
                form={form}
                onExportPDF={handleExportPDF}
                onShare={handleShare}
                isExporting={isExporting}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

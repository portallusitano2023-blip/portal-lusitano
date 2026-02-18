"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import SubscriptionBanner from "@/components/tools/SubscriptionBanner";
import ProUpgradeCard from "@/components/tools/ProUpgradeCard";
import Paywall from "@/components/tools/Paywall";
import { useToolAccess } from "@/hooks/useToolAccess";
import { useAuth } from "@/components/auth/AuthProvider";
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
  estimarValorParcial,
} from "@/components/calculadora-valor";
import type { FormData, Resultado } from "@/components/calculadora-valor";

// ============================================
// CONSTANTES AUTO-SAVE + TOOL CHAIN
// ============================================

const DRAFT_KEY = "calculadora_draft_v1";
const CHAIN_KEY = "tool_chain_horse";

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
  const { session } = useAuth();
  const [step, setStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
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
  } = useToolAccess("calculadora");

  const [form, setForm] = useState<FormData>(INITIAL_FORM);

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
          JSON.stringify({ form, step, savedAt: new Date().toISOString() })
        );
      } catch {}
    }, 800);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [form, step, resultado]);

  const restaurarDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const { form: savedForm, step: savedStep } = JSON.parse(saved) as {
          form: FormData;
          step: number;
        };
        setForm(savedForm);
        setStep(savedStep || 1);
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

  // ============================================
  // ESTIMATIVA PARCIAL (tempo real)
  // ============================================

  const estimativaParcial = useMemo(() => {
    if (step < 2 || resultado) return null;
    return estimarValorParcial(form);
  }, [form, step, resultado]);

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
    setForm(INITIAL_FORM);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setHasDraft(false);
  };

  const handleExportPDF = async () => {
    if (!resultado) return;
    setIsExporting(true);
    try {
      const { generateCalculadoraPDF } = await import("@/lib/tools/pdf/calculadora-pdf");
      await generateCalculadoraPDF(form, resultado);
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("[Calculadora]", error);
      alert("Erro ao exportar PDF. Tente novamente.");
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

  // Enviar resultados por email (PRO)
  const handleSendEmail = async () => {
    if (!resultado || !session?.access_token) return;
    const summary: Record<string, string> = {
      Cavalo: form.nome || "—",
      "Valor estimado": `€${resultado.valorFinal.toLocaleString("pt-PT")}`,
      Intervalo: `€${resultado.valorMin.toLocaleString("pt-PT")} – €${resultado.valorMax.toLocaleString("pt-PT")}`,
      Confiança: `${resultado.confianca}%`,
      "Percentil de mercado": `Top ${100 - resultado.percentil}%`,
      "Nível de treino": form.treino,
      Mercado: form.mercado,
    };
    const res = await fetch("/api/tools/send-results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ toolName: "calculadora", resultSummary: summary }),
    });
    if (!res.ok) throw new Error("Erro ao enviar email");
  };

  // Tool Chain → Comparador
  const handleComparar = () => {
    if (!resultado) return;
    const treinoMap: Record<string, string> = {
      potro: "Potro",
      desbravado: "Desbravado",
      iniciado: "Iniciado",
      elementar: "Elementar",
      medio: "Médio",
      avancado: "Avançado",
      alta_escola: "Alta Escola",
      grand_prix: "Grand Prix",
    };
    const saudeMap: Record<string, number> = {
      muito_bom: 8,
      excelente: 10,
      bom: 6,
      razoavel: 4,
    };
    const compMap: Record<string, string> = {
      nenhuma: "Nenhuma",
      regional: "Regional",
      nacional: "Nacional",
      internacional: "Internacional",
    };
    const linhagemMap: Record<string, string> = {
      sem_registo: "Desconhecida",
      registada: "Registada",
      certificada: "Certificada",
      premium: "Premium",
      elite: "Elite",
    };
    const horse = {
      nome: form.nome || "Cavalo A",
      idade: form.idade,
      sexo: form.sexo === "garanhao" ? "Garanhão" : form.sexo === "egua" ? "Égua" : "Castrado",
      altura: form.altura,
      pelagem: form.pelagem,
      linhagem: linhagemMap[form.linhagem] || "Certificada",
      linhagemFamosa: form.linhagemPrincipal || "veiga",
      treino: treinoMap[form.treino] || "Elementar",
      temperamento: form.temperamento,
      saude: saudeMap[form.saude] || 7,
      conformacao: form.morfologia,
      andamentos: form.andamentos,
      elevacao: form.elevacao,
      regularidade: form.regularidade,
      competicoes: compMap[form.competicoes] || "Nenhuma",
      premios: 0,
      preco: resultado.valorFinal,
      blup: resultado.blup,
      registoAPSL: form.registoAPSL,
    };
    try {
      sessionStorage.setItem(CHAIN_KEY, JSON.stringify({ source: "calculadora", horse }));
    } catch {}
    window.location.href = "/comparador-cavalos";
  };

  const progress = step === 0 ? 0 : (step / TOTAL_STEPS) * 100;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <CalculadoraHeader
        step={step}
        totalSteps={TOTAL_STEPS}
        progress={progress}
        hasResultado={!!resultado}
        onReset={resetar}
        estimativaParcial={estimativaParcial}
      />

      <div className="pt-16">
        {/* Intro */}
        {step === 0 && !resultado && (
          <>
            <IntroSection onStart={() => setStep(1)} />
            {/* Banner de draft guardado */}
            {hasDraft && (
              <div className="max-w-2xl mx-auto px-4 -mt-12 mb-8">
                <div className="flex flex-col sm:flex-row items-center gap-3 px-5 py-4 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl">
                  <p className="text-xs text-[var(--gold)] flex-1 text-center sm:text-left">
                    Tem uma avaliação guardada de {draftDate}
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

        {/* Form area */}
        <div className="pb-24 px-4">
          <div className="max-w-2xl mx-auto">
            {/* PRO Status Bar */}
            {!accessLoading && (step > 0 || !!resultado) && isSubscribed && (
              <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg p-3 flex items-center gap-2 mb-6 text-sm">
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
                <span className="text-[#C5A059]/80">Calculadora desbloqueada</span>
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

            {/* Loading overlay — shown during the 2-second calculation delay */}
            {isCalculating && (
              <div
                role="status"
                aria-label="A calcular o valor do seu cavalo"
                className="flex flex-col items-center justify-center py-24 gap-8"
              >
                {/* Spinner ring */}
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-[#C5A059]/15" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#C5A059] animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#C5A059]/40 animate-spin [animation-duration:1.5s]" />
                </div>

                {/* Title */}
                <div className="text-center space-y-2">
                  <p className="text-[#C5A059] font-semibold text-lg tracking-wide">
                    A calcular o valor do seu cavalo...
                  </p>
                  <p className="text-white/40 text-sm">Aguarde um momento</p>
                </div>

                {/* Animated steps */}
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <div className="flex items-center gap-3 animate-[fadeSlideIn_0.3s_ease-out_0.1s_both]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
                    <span className="text-white/60 text-sm">
                      Analisando genealogia e linhagem...
                    </span>
                  </div>
                  <div className="flex items-center gap-3 animate-[fadeSlideIn_0.3s_ease-out_0.5s_both]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse [animation-delay:0.4s]" />
                    <span className="text-white/60 text-sm">
                      Avaliando formação e andamentos...
                    </span>
                  </div>
                  <div className="flex items-center gap-3 animate-[fadeSlideIn_0.3s_ease-out_0.9s_both]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse [animation-delay:0.8s]" />
                    <span className="text-white/60 text-sm">Calculando valor de mercado...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Form steps */}
            {step > 0 && !resultado && !isCalculating && (
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
            <div aria-live="polite">
              {resultado && (
                <ResultadoDisplay
                  ref={resultRef}
                  resultado={resultado}
                  form={form}
                  onExportPDF={handleExportPDF}
                  onShare={handleShare}
                  isExporting={isExporting}
                  isSubscribed={isSubscribed}
                  onComparar={handleComparar}
                  onSendEmail={isSubscribed ? handleSendEmail : undefined}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

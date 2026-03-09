"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useFormStep } from "@/hooks/useFormStep";
import { useToolAccess } from "@/hooks/useToolAccess";
import { useAuth } from "@/components/auth/AuthProvider";
import { shareNative, copyToClipboard } from "@/lib/tools/share-utils";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { useToast } from "@/context/ToastContext";
import { calcularValor, estimarValorParcial } from "./utils";
import { PROFILE_LABELS, SUBPROFILE_LABELS, PROFILE_CONTEXT_KEY } from "@/lib/tools/shared-data";
import type { FormData, Resultado } from "./types";
import { chainCalcToVerificador } from "@/lib/tools/tool-chain";
import type { CalcHistoryEntry } from "./HistoryPanel";

// ============================================
// CONSTANTES
// ============================================

const DRAFT_KEY = "calculadora_draft_v1";
const CHAIN_KEY = "tool_chain_horse";
const CALC_HISTORY_KEY = "calculadora_history";

export const TOTAL_STEPS = 5;

export const INITIAL_FORM: FormData = {
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
  certificadoExportacao: false,
  proprietariosAnteriores: 0,
};

// ============================================
// HOOK
// ============================================

export function useCalculadoraState() {
  const { t, language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);
  const { showToast } = useToast();
  const { session } = useAuth();

  // ── Core form step state ───────────────────────────
  const formStep = useFormStep({
    totalSteps: TOTAL_STEPS,
    initialData: INITIAL_FORM,
    persistKey: DRAFT_KEY,
    allowGoBack: true,
  });

  // ── Additional state ───────────────────────────────
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [profileContext, setProfileContext] = useState<{
    profile: string;
    subProfile: string | null;
    priceRange: string;
    training: string;
  } | null>(null);
  const [calcHistory, setCalcHistory] = useState<CalcHistoryEntry[]>([]);
  const [showCalcHistory, setShowCalcHistory] = useState(false);

  // ── Refs ───────────────────────────────────────────
  const resultRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  // ── Tool access ────────────────────────────────────
  const {
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    validateAndRecord,
    isLoading: accessLoading,
  } = useToolAccess("calculadora");

  // ── Effects ────────────────────────────────────────

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Profile context initialization
  useEffect(() => {
    try {
      const ctx = sessionStorage.getItem(PROFILE_CONTEXT_KEY);
      const urlParams = new URLSearchParams(window.location.search);
      const urlPerfil = urlParams.get("perfil");

      let parsed: {
        source: string;
        profile: string;
        subProfile: string | null;
        priceRange: string;
        training: string;
      } | null = null;

      if (ctx) {
        const p = JSON.parse(ctx) as {
          source?: string;
          profile?: string;
          subProfile?: string | null;
          priceRange?: string;
          training?: string;
        } | null;
        if (p?.source === "analise_perfil" && p.profile) {
          parsed = {
            source: p.source,
            profile: p.profile,
            subProfile: p.subProfile ?? null,
            priceRange: p.priceRange ?? "",
            training: p.training ?? "",
          };
          sessionStorage.removeItem(PROFILE_CONTEXT_KEY);
        }
      } else if (
        urlPerfil &&
        ["competidor", "criador", "amador", "investidor"].includes(urlPerfil)
      ) {
        parsed = {
          source: "analise_perfil",
          profile: urlPerfil,
          subProfile: urlParams.get("sub"),
          priceRange: "",
          training: "",
        };
      }

      if (parsed) {
        setProfileContext(parsed);
        const profilePresets: Record<string, Partial<FormData>> = {
          competidor_elite: { disciplina: "Alta Escola", competicoes: "cdi3" },
          competidor_nacional: { disciplina: "Dressage Clássica", competicoes: "nacional" },
          competidor_trabalho: { disciplina: "Equitação de Trabalho", competicoes: "regional" },
          amador_projeto: { disciplina: "Lazer", competicoes: "nenhuma" },
          criador: { reproducao: true },
          amador: { disciplina: "Lazer", competicoes: "nenhuma" },
          investidor: { disciplina: "Dressage Clássica" },
        };
        const key = parsed.subProfile ?? parsed.profile;
        const preset = profilePresets[key];
        if (preset) {
          Object.entries(preset).forEach(([k, v]) => {
            formStep.updateData(k, v);
          });
        }
      }
    } catch {}
  }, []);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CALC_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CalcHistoryEntry[];
        if (Array.isArray(parsed)) setCalcHistory(parsed);
      }
    } catch {}
  }, []);

  // Save history entry when resultado changes
  useEffect(() => {
    if (!resultado) return;
    try {
      const entry: CalcHistoryEntry = {
        timestamp: Date.now(),
        nome: (formStep.data as FormData).nome || tr("Sem nome", "Unnamed", "Sin nombre"),
        valorFinal: resultado.valorFinal,
        confianca: resultado.confianca,
        treino: (formStep.data as FormData).treino,
      };
      setCalcHistory((prev) => {
        const updated = [entry, ...prev].slice(0, 5);
        try {
          localStorage.setItem(CALC_HISTORY_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } catch {}
  }, [resultado]);

  // ESC key for PDF preview
  useEffect(() => {
    if (!pdfPreviewUrl) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
        setPdfPreviewUrl(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pdfPreviewUrl]);

  // ── Derived ────────────────────────────────────────

  const estimativaParcial = useMemo(() => {
    if (formStep.currentStep < 2 || resultado) return null;
    return estimarValorParcial(formStep.data as FormData);
  }, [formStep.data, formStep.currentStep, resultado]);

  const progress = formStep.currentStep === 0 ? 0 : (formStep.currentStep / TOTAL_STEPS) * 100;

  // ── Handlers ───────────────────────────────────────

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    formStep.updateData(key, value);
  };

  const calcular = async () => {
    if (!canUse) return;

    const formMeta = {
      treino: (formStep.data as FormData).treino,
      mercado: (formStep.data as FormData).mercado,
      disciplina: (formStep.data as FormData).disciplina,
      sexo: (formStep.data as FormData).sexo,
    };

    try {
      const result = calcularValor(formStep.data as FormData, tr);
      const resultMeta = {
        valorFinal: result.valorFinal,
        confianca: result.confianca,
        percentil: result.percentil,
        disciplina: (formStep.data as FormData).disciplina ?? null,
        liquidezScore: result.liquidez?.score ?? null,
      };

      const allowed = await validateAndRecord(formMeta, resultMeta);
      if (!allowed) {
        if (isMountedRef.current) {
          showToast("error", "Limite de uso gratuito atingido. Subscreva PRO para continuar.");
        }
        return;
      }

      if (!isMountedRef.current) return;
      setResultado(result);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      if (isMountedRef.current) {
        if (process.env.NODE_ENV === "development") {
          console.error("[Calculadora] Erro no cálculo:", err);
        }
        showToast("error", "Erro ao calcular o valor. Verifique os dados e tente novamente.");
      }
    }
  };

  const resetar = useCallback(() => {
    setShowResetConfirm(false);
    setResultado(null);
    formStep.reset();
  }, [formStep]);

  const editarResultado = () => {
    setResultado(null);
  };

  const restaurarDraft = () => {
    formStep.restoreDraft();
  };

  const descartarDraft = () => {
    formStep.clearDraft();
  };

  const handleExportPDF = async () => {
    if (!resultado) return;
    setIsExporting(true);
    try {
      const { generateCalculadoraPDF } = await import("@/lib/tools/pdf/calculadora-pdf");
      const blobUrl = await generateCalculadoraPDF(formStep.data as FormData, resultado, language);
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(blobUrl);
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("[Calculadora PDF erro]", error);
      showToast("error", t.errors.error_export_pdf);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClosePdfPreview = () => {
    if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
    setPdfPreviewUrl(null);
  };

  const handleDownloadPdf = () => {
    if (!pdfPreviewUrl) return;
    const a = document.createElement("a");
    a.href = pdfPreviewUrl;
    a.download = `avaliacao-lusitano-${Date.now()}.pdf`;
    a.click();
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${t.calculadora.tool_name} - Portal Lusitano`;
    const shared = await shareNative(t.calculadora.tool_name, text, url);
    if (!shared) await copyToClipboard(url);
  };

  const handleSendEmail = async () => {
    if (!resultado || !session?.access_token) return;
    const summary: Record<string, string> = {
      Cavalo: (formStep.data as FormData).nome || "—",
      "Valor estimado": `€${resultado.valorFinal.toLocaleString("pt-PT")}`,
      Intervalo: `€${resultado.valorMin.toLocaleString("pt-PT")} – €${resultado.valorMax.toLocaleString("pt-PT")}`,
      Confiança: `${resultado.confianca}%`,
      "Percentil de mercado": `Top ${100 - resultado.percentil}%`,
      "Nível de treino": (formStep.data as FormData).treino,
      Mercado: (formStep.data as FormData).mercado,
    };
    try {
      const res = await fetch("/api/tools/send-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ toolName: "calculadora", resultSummary: summary }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      // silent fail - user can retry
    }
  };

  const handleComparar = () => {
    if (!resultado) return;
    const form = formStep.data as FormData;
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
      regular: 4,
    };
    const compMap: Record<string, string> = {
      nenhuma: "Nenhuma",
      regional: "Regional",
      nacional: "Nacional",
      cdi1: "Internacional",
      cdi3: "Internacional",
      cdi5: "Internacional",
      campeonato_mundo: "Internacional",
    };
    const linhagemMap: Record<string, string> = {
      desconhecida: "Desconhecida",
      comum: "Registada",
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
    // Full page reload is intentional here: the target page reads horse data from
    // sessionStorage on mount, so the data must persist across navigation.
    // Using router.push() would work but sessionStorage is already populated above,
    // and a full reload guarantees a clean mount of the comparador page.
    window.location.href = "/comparador-cavalos";
  };

  const handleVerificarCompat = () => {
    if (!resultado) return;
    const form = formStep.data as FormData;
    const saudeMap: Record<string, number> = {
      muito_bom: 8,
      excelente: 10,
      bom: 6,
      regular: 4,
    };
    chainCalcToVerificador(
      {
        nome: form.nome || "Cavalo",
        sexo: form.sexo === "garanhao" ? "Garanhão" : form.sexo === "egua" ? "Égua" : "Castrado",
        idade: form.idade,
        altura: form.altura,
        pelagem: form.pelagem,
        linhagem: form.linhagem,
        linhagemFamosa: form.linhagemPrincipal || "veiga",
        conformacao: form.morfologia,
        andamentos: form.andamentos,
        temperamento: form.temperamento,
        saude: saudeMap[form.saude] || 7,
        blup: resultado.blup,
      },
      form.sexo
    );
  };

  // ── Return ─────────────────────────────────────────

  return {
    // Context
    t,
    showToast,
    session,

    // Form
    form: formStep.data as FormData,
    update,
    step: formStep.currentStep,
    setStep: formStep.goToStep,

    // Calculation
    isCalculating: formStep.isCalculating,
    resultado,
    estimativaParcial,
    calcular,
    resetar,
    editarResultado,
    showResetConfirm,
    setShowResetConfirm,

    // Tool access
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    accessLoading,

    // PDF
    isExporting,
    pdfPreviewUrl,
    handleExportPDF,
    handleClosePdfPreview,
    handleDownloadPdf,

    // Sharing
    handleShare,
    handleSendEmail,

    // Tool chains
    handleComparar,
    handleVerificarCompat,

    // Draft
    hasDraft: formStep.hasDraft,
    draftDate: formStep.draftDate,
    restaurarDraft,
    descartarDraft,

    // Profile context
    profileContext,
    setProfileContext,

    // History
    calcHistory,
    showCalcHistory,
    setShowCalcHistory,

    // Derived
    progress,
    resultRef,

    // Constants (re-exported for JSX)
    PROFILE_LABELS,
    SUBPROFILE_LABELS,
    TOTAL_STEPS,
  };
}

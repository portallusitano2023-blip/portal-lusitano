"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useToolAccess } from "@/hooks/useToolAccess";
import { useAuth } from "@/components/auth/AuthProvider";
import { shareNative, copyToClipboard } from "@/lib/tools/share-utils";
import { useLanguage } from "@/context/LanguageContext";
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
  const { t } = useLanguage();
  const { showToast } = useToast();
  const { session } = useAuth();

  // ── State ──────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftDate, setDraftDate] = useState<string>("");
  const [profileContext, setProfileContext] = useState<{
    profile: string;
    subProfile: string | null;
    priceRange: string;
    training: string;
  } | null>(null);
  const [calcHistory, setCalcHistory] = useState<CalcHistoryEntry[]>([]);
  const [showCalcHistory, setShowCalcHistory] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  // ── Refs ───────────────────────────────────────────
  const resultRef = useRef<HTMLDivElement>(null);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // ── Tool access ────────────────────────────────────
  const {
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    recordUsage,
    isLoading: accessLoading,
  } = useToolAccess("calculadora");

  // ── Effects ────────────────────────────────────────

  // Mounted ref — must set true on mount for React Strict Mode (double mount/unmount)
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Draft restore + profile context init
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

    // Contexto da Análise de Perfil — sessionStorage ou URL param ?perfil=
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
          setForm((prev) => ({ ...prev, ...preset }));
        }
      }
    } catch {}
  }, []);

  // Auto-save draft
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
        nome: form.nome || "Sem nome",
        valorFinal: resultado.valorFinal,
        confianca: resultado.confianca,
        treino: form.treino,
      };
      setCalcHistory((prev) => {
        const updated = [entry, ...prev].slice(0, 5);
        try {
          localStorage.setItem(CALC_HISTORY_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (step < 2 || resultado) return null;
    return estimarValorParcial(form);
  }, [form, step, resultado]);

  const progress = step === 0 ? 0 : (step / TOTAL_STEPS) * 100;

  // ── Handlers ───────────────────────────────────────

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const calcular = () => {
    if (!canUse) return;
    setIsCalculating(true);

    setTimeout(() => {
      if (!isMountedRef.current) return;
      try {
        const result = calcularValor(form);
        setResultado(result);
        setIsCalculating(false);
        recordUsage(
          {
            treino: form.treino,
            mercado: form.mercado,
            disciplina: form.disciplina,
            sexo: form.sexo,
          },
          {
            valorFinal: result.valorFinal,
            confianca: result.confianca,
            percentil: result.percentil,
            disciplina: form.disciplina ?? null,
            liquidezScore: result.liquidez?.score ?? null,
          }
        );

        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } catch (err) {
        setIsCalculating(false);
        if (process.env.NODE_ENV === "development") {
          console.error("[Calculadora] Erro no cálculo:", err);
        }
        showToast("error", "Erro ao calcular o valor. Verifique os dados e tente novamente.");
      }
    }, 2000);
  };

  const resetar = useCallback(() => {
    setShowResetConfirm(false);
    setResultado(null);
    setStep(0);
    setForm(INITIAL_FORM);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setHasDraft(false);
  }, []);

  const editarResultado = () => {
    setResultado(null);
  };

  const restaurarDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const { form: savedForm, step: savedStep } = JSON.parse(saved) as {
          form: FormData;
          step: number;
        };
        // Merge with INITIAL_FORM to fill any missing fields from older drafts
        setForm({ ...INITIAL_FORM, ...savedForm });
        setStep(savedStep || 1);
        setHasDraft(false);
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
      }
    } catch {
      setHasDraft(false);
    }
  };

  const descartarDraft = () => {
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
      const blobUrl = await generateCalculadoraPDF(form, resultado);
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
      Cavalo: form.nome || "—",
      "Valor estimado": `€${resultado.valorFinal.toLocaleString("pt-PT")}`,
      Intervalo: `€${resultado.valorMin.toLocaleString("pt-PT")} – €${resultado.valorMax.toLocaleString("pt-PT")}`,
      Confiança: `${resultado.confianca}%`,
      "Percentil de mercado": `Top ${100 - resultado.percentil}%`,
      "Nível de treino": form.treino,
      Mercado: form.mercado,
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

  // Tool Chain → Verificador Compatibilidade
  const handleVerificarCompat = () => {
    if (!resultado) return;
    const saudeMap: Record<string, number> = {
      muito_bom: 8,
      excelente: 10,
      bom: 6,
      razoavel: 4,
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
    form,
    update,
    step,
    setStep,

    // Calculation
    isCalculating,
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
    hasDraft,
    draftDate,
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

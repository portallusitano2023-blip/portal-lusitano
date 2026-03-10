"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useFormStep } from "@/hooks/useFormStep";
import { useToolAccess } from "@/hooks/useToolAccess";
import { useAuth } from "@/components/auth/AuthProvider";
import { shareNative, copyToClipboard } from "@/lib/tools/share-utils";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { useToast } from "@/context/ToastContext";
import { calcularValor, estimarValorParcial, validateFormLogic } from "./utils";
import { PROFILE_LABELS, SUBPROFILE_LABELS, PROFILE_CONTEXT_KEY, TREINO_LABELS, getSharedLabel } from "@/lib/tools/shared-data";
import type { FormData, Resultado } from "./types";
import { chainCalcToVerificador } from "@/lib/tools/tool-chain";
import { chainCalcToComparador } from "@/lib/tools/tool-chain";
import type { CalcHistoryEntry } from "./HistoryPanel";

// ============================================
// CONSTANTES
// ============================================

const DRAFT_KEY = "calculadora_draft_v1";
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
  morfologia: 5,
  garupa: 5,
  espádua: 5,
  cabeca: 5,
  membros: 5,
  andamentos: 5,
  elevacao: 5,
  suspensao: 5,
  regularidade: 5,
  treino: "elementar",
  competicoes: "nenhuma",
  disciplina: "Dressage Clássica",
  saude: "muito_bom",
  raioX: true,
  exameVeterinario: true,
  temperamento: 5,
  sensibilidade: 5,
  vontadeTrabalho: 5,
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
  const locale = language === "en" ? "en-GB" : language === "es" ? "es-ES" : "pt-PT";
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
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcHistory, setCalcHistory] = useState<CalcHistoryEntry[]>([]);
  const [showCalcHistory, setShowCalcHistory] = useState(false);
  // C-05: Track which fields the user explicitly changed from defaults
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  // H-05: Live validation warnings shown inline during form editing
  const [warnings, setWarnings] = useState<import("./types").ValidationWarning[]>([]);

  // ── Refs ───────────────────────────────────────────
  const resultRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  // Fix #11: Keep a stable ref for tr to avoid re-triggering history effect on language change
  const trRef = useRef(tr);
  trRef.current = tr;

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
          amador_projeto: { disciplina: "Lazer / Passeio", competicoes: "nenhuma" },
          criador: { reproducao: true },
          amador: { disciplina: "Lazer / Passeio", competicoes: "nenhuma" },
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
    } catch (e) { if (process.env.NODE_ENV === "development") console.warn("Storage error:", e); }
  }, []);

  // Load history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CALC_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CalcHistoryEntry[];
        if (Array.isArray(parsed)) setCalcHistory(parsed);
      }
    } catch (e) { if (process.env.NODE_ENV === "development") console.warn("Storage error:", e); }
  }, []);

  // Save history entry when resultado changes
  useEffect(() => {
    if (!resultado) return;
    try {
      const entry: CalcHistoryEntry = {
        timestamp: Date.now(),
        nome: (formStep.data as FormData).nome || trRef.current("Sem nome", "Unnamed", "Sin nombre"),
        valorFinal: resultado.valorFinal,
        confianca: resultado.confianca,
        treino: (formStep.data as FormData).treino,
      };
      setCalcHistory((prev) => {
        const updated = [entry, ...prev].slice(0, 20);
        try {
          localStorage.setItem(CALC_HISTORY_KEY, JSON.stringify(updated));
        } catch (e) { if (process.env.NODE_ENV === "development") console.warn("Storage error:", e); }
        return updated;
      });
    } catch (e) { if (process.env.NODE_ENV === "development") console.warn("Storage error:", e); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultado, formStep.data]);

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
    if (key === "sexo" && value === "castrado") {
      formStep.updateData("reproducao", false);
      formStep.updateData("descendentes", 0);
      formStep.updateData("descendentesAprovados", 0);
    }
    if (key === "descendentes") {
      const newDesc = value as number;
      if ((formStep.data as any).descendentesAprovados > newDesc) {
        formStep.updateData("descendentesAprovados", newDesc);
      }
    }
    // C-05: Track fields the user explicitly modified
    setTouchedFields((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    // H-05: Update live validation warnings on form change
    let updatedForm = { ...(formStep.data as FormData), [key]: value };
    if (key === "sexo" && value === "castrado") {
      updatedForm = { ...updatedForm, reproducao: false, descendentes: 0, descendentesAprovados: 0 };
    }
    if (key === "descendentes") {
      const newDesc = value as number;
      if (updatedForm.descendentesAprovados > newDesc) {
        updatedForm = { ...updatedForm, descendentesAprovados: newDesc };
      }
    }
    setWarnings(validateFormLogic(updatedForm, tr));
  };

  const calcular = async () => {
    if (!canUse || isCalculating) return;

    // C-05: Warn if fewer than 3 key fields were explicitly changed from defaults
    const keyFields = ["treino", "idade", "sexo", "linhagem", "saude"];
    const touchedKeyFields = keyFields.filter((f) => touchedFields.has(f));
    if (touchedKeyFields.length < 3) {
      showToast("warning", tr(
        "Poucos campos alterados — os resultados podem não reflectir o cavalo real. Reveja treino, idade, sexo, linhagem e saúde.",
        "Few fields changed — results may not reflect the actual horse. Review training, age, sex, lineage and health.",
        "Pocos campos modificados — los resultados pueden no reflejar el caballo real. Revise entrenamiento, edad, sexo, linaje y salud."
      ));
    }

    // Check for validation errors (severity: "error") before proceeding
    const validationWarnings = validateFormLogic(formStep.data as FormData, tr);
    const validationErrors = validationWarnings.filter((w) => w.severity === "error");
    if (validationErrors.length > 0) {
      setWarnings(validationWarnings);
      showToast("error", validationErrors[0].message);
      return;
    }

    const formMeta = {
      treino: (formStep.data as FormData).treino,
      mercado: (formStep.data as FormData).mercado,
      disciplina: (formStep.data as FormData).disciplina,
      sexo: (formStep.data as FormData).sexo,
    };

    setIsCalculating(true);
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
          showToast("error", tr("Limite de uso gratuito atingido. Subscreva PRO para continuar.", "Free usage limit reached. Subscribe to PRO to continue.", "Límite de uso gratuito alcanzado. Suscríbase a PRO para continuar."));
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
        showToast("error", tr("Erro ao calcular o valor. Verifique os dados e tente novamente.", "Error calculating value. Please check the data and try again.", "Error al calcular el valor. Verifique los datos e inténtelo de nuevo."));
      }
    } finally {
      if (isMountedRef.current) setIsCalculating(false);
    }
  };

  const resetar = () => {
    setShowResetConfirm(false);
    setResultado(null);
    setTouchedFields(new Set());
    setWarnings([]);
    formStep.reset();
  };

  const editarResultado = () => {
    setResultado(null);
    setWarnings([]);
    formStep.goToStep(1);
  };

  const restaurarDraft = () => {
    // Read draft data directly from localStorage before restoring,
    // because formStep.data is stale until the next render after restoreDraft().
    let draftData: FormData | null = null;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.data) draftData = parsed.data as FormData;
      }
    } catch { /* ignore */ }

    formStep.restoreDraft();

    // Populate touchedFields from the draft data (not from stale formStep.data)
    const restored = draftData ?? (formStep.data as FormData);
    const touched = new Set<string>();
    for (const key of Object.keys(INITIAL_FORM) as (keyof FormData)[]) {
      if (restored[key] !== INITIAL_FORM[key]) {
        touched.add(key);
      }
    }
    setTouchedFields(touched);
  };

  const descartarDraft = () => {
    formStep.clearDraft();
  };

  const handleExportPDF = async () => {
    if (!resultado || isExporting) return;
    setIsExporting(true);
    try {
      const { generateCalculadoraPDF } = await import("@/lib/tools/pdf/calculadora-pdf");
      const blobUrl = await generateCalculadoraPDF(formStep.data as FormData, resultado, language, isSubscribed);
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
    a.download = `${tr("avaliacao-lusitano", "lusitano-valuation", "evaluacion-lusitano")}-${Date.now()}.pdf`;
    a.click();
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      const text = `${t.calculadora.tool_name} - Portal Lusitano`;
      const shared = await shareNative(t.calculadora.tool_name, text, url);
      if (!shared) await copyToClipboard(url);
    } catch {
      showToast("error", tr("Erro ao partilhar. Copia o link manualmente.", "Error sharing. Copy the link manually.", "Error al compartir. Copia el enlace manualmente."));
    }
  };

  const handleSendEmail = async () => {
    if (!resultado || !session?.access_token) return;
    const summary: Record<string, string> = {
      [tr("Cavalo", "Horse", "Caballo")]: (formStep.data as FormData).nome || "—",
      [tr("Valor estimado", "Estimated value", "Valor estimado")]: `€${resultado.valorFinal.toLocaleString(locale)}`,
      [tr("Intervalo", "Range", "Intervalo")]: `€${resultado.valorMin.toLocaleString(locale)} – €${resultado.valorMax.toLocaleString(locale)}`,
      [tr("Confiança", "Confidence", "Confianza")]: `${resultado.confianca}%`,
      [tr("Percentil de mercado", "Market percentile", "Percentil de mercado")]: `Top ${100 - resultado.percentil}%`,
      [tr("Nível de treino", "Training level", "Nivel de entrenamiento")]: getSharedLabel(TREINO_LABELS, (formStep.data as FormData).treino, language),
      [tr("Mercado", "Market", "Mercado")]: (formStep.data as FormData).mercado,
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
      showToast("success", tr("Email enviado com sucesso!", "Email sent successfully!", "¡Email enviado con éxito!"));
    } catch (e) {
      if (process.env.NODE_ENV === "development") console.warn("Send email error:", e);
      showToast("error", tr("Erro ao enviar email. Tente novamente.", "Error sending email. Please try again.", "Error al enviar email. Inténtelo de nuevo."));
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
      comum: "Comum",
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
    chainCalcToComparador(horse, form.linhagem === "comum");
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
    const linhagemMapVerif: Record<string, string> = {
      desconhecida: "Desconhecida",
      comum: "Comum",
      registada: "Registada",
      certificada: "Certificada",
      premium: "Premium",
      elite: "Elite",
    };
    chainCalcToVerificador(
      {
        nome: form.nome || "Cavalo",
        sexo: form.sexo === "garanhao" ? "Garanhão" : form.sexo === "egua" ? "Égua" : "Castrado",
        idade: form.idade,
        altura: form.altura,
        pelagem: form.pelagem,
        linhagem: linhagemMapVerif[form.linhagem] ?? "Certificada",
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
    warnings,
    touchedFields,

    // Constants (re-exported for JSX)
    PROFILE_LABELS,
    SUBPROFILE_LABELS,
    TOTAL_STEPS,
  };
}

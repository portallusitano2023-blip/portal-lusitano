"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useToolAccess } from "@/hooks/useToolAccess";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";
import { createTranslator } from "@/lib/tr";
import { getQuestions } from "@/components/analise-perfil/data/questions";
import { getResults } from "@/components/analise-perfil/data/results";
import {
  getShareUrl as buildShareUrl,
  shareWhatsApp as doShareWhatsApp,
  shareFacebook as doShareFacebook,
  shareInstagram as doShareInstagram,
} from "./quiz-sharing";
import { generateProfilePDF } from "./quiz-pdf";
import { generateBadge, generateBadgeSVGFallback } from "./quiz-badge";
import type {
  Result,
  AnswerDetail,
  QuestionOption,
  RadarChartData,
  ScorePercentage,
  ResultTab,
} from "@/components/analise-perfil/types";

// ---------------------------------------------------------------------------
// Cross-validation: detecta combinações de respostas educativamente relevantes
// answers[0] = Q1 Objectivo, answers[1] = Q2 Experiência, answers[7] = Q8 Dedicação
// ---------------------------------------------------------------------------
export interface CrossValidationWarning {
  message: string;
  severity: "info" | "warning";
}

type TranslatorFn = (pt: string, en: string, es?: string) => string;

function getCrossValidationWarning(
  answers: string[],
  tr: TranslatorFn
): CrossValidationWarning | null {
  const objectivo = answers[0];
  const experiencia = answers[1];
  const dedicacao = answers[7];

  // Ambas as perguntas fundamentais têm de estar respondidas para validação cruzada
  if (!objectivo || !experiencia) return null;

  // Iniciante + Alta Competição de Dressage
  if (objectivo === "dressage_comp" && experiencia === "iniciante") {
    return {
      message: tr(
        "Dressage de competição requer normalmente 5 ou mais anos de experiência equestre consolidada. Considera começar com Alta Escola Clássica e progredir gradualmente — o PSL responde excepcionalmente bem a cavaleiros que crescem com ele.",
        "Competition dressage typically requires 5 or more years of consolidated equestrian experience. Consider starting with Classical High School and progressing gradually — the PSL responds exceptionally well to riders who grow with it.",
        "El dressage de competición normalmente requiere 5 o más años de experiencia ecuestre consolidada. Considera empezar con Alta Escuela Clásica y progresar gradualmente — el PSL responde excepcionalmente bien a jinetes que crecen con él."
      ),
      severity: "warning",
    };
  }

  // Pouca dedicação + Alta Competição de Dressage (só avalia quando Q8 foi respondida)
  if (objectivo === "dressage_comp" && dedicacao === "weekend") {
    return {
      message: tr(
        "Cavalos de competição de dressage requerem treino regular de 5 a 7 dias por semana para manter a forma de prova. Com disponibilidade apenas ao fim de semana, um PSL de Alta Escola Clássica ou lazer será mais adequado e mais justo para o cavalo.",
        "Competition dressage horses require regular training of 5 to 7 days per week to stay in show form. With only weekend availability, a Classical High School or leisure PSL would be more suitable and fairer to the horse.",
        "Los caballos de dressage de competición requieren entrenamiento regular de 5 a 7 días por semana para mantenerse en forma de concurso. Con disponibilidad solo los fines de semana, un PSL de Alta Escuela Clásica o de ocio sería más adecuado y más justo para el caballo."
      ),
      severity: "warning",
    };
  }

  // Equitação de Trabalho + Iniciante
  if (objectivo === "trabalho" && experiencia === "iniciante") {
    return {
      message: tr(
        "A Equitação de Trabalho e o Toureio a cavalo exigem controlo preciso de ajudas e muito equilíbrio em situações imprevisíveis. Para iniciantes, recomenda-se uma base sólida em dressage clássico antes de iniciar esta disciplina.",
        "Working Equitation and mounted bullfighting demand precise aid control and strong balance in unpredictable situations. For beginners, a solid foundation in classical dressage is recommended before starting this discipline.",
        "La Equitación de Trabajo y el toreo a caballo exigen un control preciso de las ayudas y mucho equilibrio en situaciones imprevisibles. Para principiantes, se recomienda una base sólida en dressage clásico antes de iniciar esta disciplina."
      ),
      severity: "warning",
    };
  }

  // Criação + Iniciante
  if (objectivo === "criacao" && experiencia === "iniciante") {
    return {
      message: tr(
        "Criação equina envolve conhecimentos avançados de genética, reprodução, cuidados neonatais e selecção por índice BLUP. Recomenda-se experiência prévia com equinos ou apoio próximo de um criador ou veterinário especializado.",
        "Horse breeding involves advanced knowledge of genetics, reproduction, neonatal care and BLUP index selection. Prior experience with horses or close support from a breeder or specialist veterinarian is recommended.",
        "La cría equina implica conocimientos avanzados de genética, reproducción, cuidados neonatales y selección por índice BLUP. Se recomienda experiencia previa con equinos o apoyo cercano de un criador o veterinario especializado."
      ),
      severity: "info",
    };
  }

  // Criação + pouca dedicação semanal (só avalia quando Q8 foi respondida)
  if (objectivo === "criacao" && dedicacao === "weekend") {
    return {
      message: tr(
        "Um programa de criação activo requer presença diária ou quasi-diária, especialmente em períodos de cobrição, gestação e cuidados ao poldro recém-nascido. Confirma que tens disponibilidade suficiente ou uma equipa de apoio.",
        "An active breeding programme requires daily or near-daily presence, especially during covering, gestation and newborn foal care. Confirm that you have sufficient availability or a support team.",
        "Un programa de cría activo requiere presencia diaria o casi diaria, especialmente en períodos de cubrición, gestación y cuidados del potro recién nacido. Confirma que tienes disponibilidad suficiente o un equipo de apoyo."
      ),
      severity: "info",
    };
  }

  // Issues 10/11: Cross-validation for aprendiz — iniciante with high budget
  const orcamento = answers[6];
  if (experiencia === "iniciante" && orcamento && (orcamento === "alto" || orcamento === "premium")) {
    return {
      message: tr(
        "Como cavaleiro iniciante, ter um bom orçamento é positivo, mas o mais importante é investir em aulas de qualidade e num cavalo schoolmaster bem treinado. Um cavalo caro não substitui a experiência — comece gradualmente.",
        "As a beginner rider, having a good budget is positive, but the most important thing is to invest in quality lessons and a well-trained schoolmaster. An expensive horse doesn't replace experience — start gradually.",
        "Como jinete principiante, tener un buen presupuesto es positivo, pero lo más importante es invertir en clases de calidad y en un caballo schoolmaster bien entrenado. Un caballo caro no sustituye la experiencia — empiece gradualmente."
      ),
      severity: "info",
    };
  }

  // Issues 10/11: experienced rider with weekend-only dedication
  if (
    (experiencia === "avancado" || experiencia === "profissional") &&
    dedicacao === "weekend"
  ) {
    return {
      message: tr(
        "Com a sua experiência avançada, dedicação apenas ao fim de semana pode limitar o progresso e o bem-estar do cavalo. Considere se consegue aumentar a frequência de trabalho ou opte por um regime de pensão completa com treino incluído.",
        "With your advanced experience, weekend-only dedication may limit progress and the horse's welfare. Consider whether you can increase your training frequency or opt for a full-board regime with training included.",
        "Con su experiencia avanzada, dedicación solo los fines de semana puede limitar el progreso y el bienestar del caballo. Considere si puede aumentar la frecuencia de trabajo u opte por un régimen de pensión completa con entrenamiento incluido."
      ),
      severity: "info",
    };
  }

  return null;
}

const QUIZ_PROGRESS_KEY = "portal-lusitano-quiz-progress";
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export function useQuizLogic() {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const tr = useMemo(() => createTranslator(language), [language]);
  const results = useMemo(() => getResults(tr), [tr]);
  const questions = useMemo(() => getQuestions(tr), [tr]);
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answerDetails, setAnswerDetails] = useState<AnswerDetail[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({
    competidor: 0,
    tradicional: 0,
    criador: 0,
    amador: 0,
    aprendiz: 0,
  });
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [subProfile, setSubProfile] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<ResultTab>("perfil");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crossWarningDismissed, setCrossWarningDismissed] = useState(false);
  const [chainContext, setChainContext] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isBadgeLoading, setIsBadgeLoading] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [sharedConfidence, setSharedConfidence] = useState<number | null>(null);
  const quizRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const {
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    validateAndRecord,
    isLoading: accessLoading,
  } = useToolAccess("perfil");

  const showError = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  }, []);

  // Check for chain context from Verificador de Compatibilidade
  useEffect(() => {
    try {
      const ctx = sessionStorage.getItem("tool_context_profile");
      if (!ctx) return;
      const parsed = JSON.parse(ctx) as { source?: string; context?: string };
      if (parsed.source === "verificador") {
        sessionStorage.removeItem("tool_context_profile");
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage initialization on mount
        setChainContext(parsed.context || "Verificador de Compatibilidade");
      }
    } catch {}
  }, []);

  // Check for saved quiz progress in localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(QUIZ_PROGRESS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        answers: Record<number, number>;
        currentStep: number;
        timestamp: number;
      };
      if (
        saved &&
        typeof saved.timestamp === "number" &&
        Date.now() - saved.timestamp < TWENTY_FOUR_HOURS_MS &&
        saved.currentStep > 0
      ) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage initialization on mount
        setHasSavedProgress(true);
      } else {
        // Expired or invalid — clean up
        localStorage.removeItem(QUIZ_PROGRESS_KEY);
      }
    } catch {
      // Corrupted data — clean up silently
      try { localStorage.removeItem(QUIZ_PROGRESS_KEY); } catch {}
    }
  }, []);

  // Check for shared result in URL
  useEffect(() => {
    const sharedResult = searchParams.get("r");
    if (sharedResult) {
      try {
        const decoded = JSON.parse(atob(decodeURIComponent(sharedResult)));
        if (decoded.profile && results[decoded.profile]) {
          const PROFILE_KEYS = ["competidor", "tradicional", "criador", "amador", "aprendiz"] as const;
          const raw = decoded.scores;
          const safeScores =
            raw && typeof raw === "object" && !Array.isArray(raw)
              ? Object.fromEntries(
                  PROFILE_KEYS.map((k) => [k, typeof raw[k] === "number" ? (raw[k] as number) : 0])
                )
              : { competidor: 0, tradicional: 0, criador: 0, amador: 0, aprendiz: 0 };
          // eslint-disable-next-line react-hooks/set-state-in-effect -- URL param initialization on mount
          setScores(safeScores as Record<string, number>);
          setResult(results[decoded.profile]);
          setShowIntro(false);
          setShowResult(true);
          // Restore sub-profile and confidence from shared URL if present
          if (typeof decoded.subProfile === "string") {
            setSubProfile(decoded.subProfile);
          }
          if (typeof decoded.confidence === "number") {
            setSharedConfidence(decoded.confidence);
          }
        }
      } catch {
        // Invalid shared result - silenced
      }
    }
  }, [searchParams, results]);

  const startQuiz = useCallback(() => {
    setShowIntro(false);
    setTimeout(() => quizRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  // ---------------------------------------------------------------------------
  // localStorage persistence helpers
  // ---------------------------------------------------------------------------
  const saveProgressToStorage = useCallback(
    (newAnswers: string[], nextStep: number) => {
      try {
        const data: Record<string, unknown> = {
          answers: Object.fromEntries(newAnswers.map((v, i) => [i, v])),
          currentStep: nextStep,
          timestamp: Date.now(),
        };
        localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(data));
      } catch {
        // Storage full or unavailable — silently ignore
      }
    },
    []
  );

  const clearSavedProgress = useCallback(() => {
    try {
      localStorage.removeItem(QUIZ_PROGRESS_KEY);
    } catch {}
    setHasSavedProgress(false);
  }, []);

  const resumeQuiz = useCallback(() => {
    try {
      const raw = localStorage.getItem(QUIZ_PROGRESS_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        answers: Record<number, number | string>;
        currentStep: number;
        timestamp: number;
      };
      if (!saved || Date.now() - saved.timestamp >= TWENTY_FOUR_HOURS_MS) {
        clearSavedProgress();
        return;
      }
      // Reconstruct answers array from the saved Record<number, value>
      const restoredAnswers: string[] = [];
      for (let i = 0; i < saved.currentStep; i++) {
        const val = saved.answers[i];
        restoredAnswers.push(val != null ? String(val) : "__skip__");
      }
      // Recalculate scores from restored answers
      const restoredScores: Record<string, number> = {
        competidor: 0,
        tradicional: 0,
        criador: 0,
        amador: 0,
        aprendiz: 0,
      };
      restoredAnswers.forEach((answerValue, qIdx) => {
        if (answerValue === "__skip__" || !questions[qIdx]) return;
        const question = questions[qIdx];
        const option = question.options.find((o) => o.value === answerValue);
        if (option) {
          const w = question.weight;
          Object.entries(option.points).forEach(([p, pts]) => {
            restoredScores[p] = (restoredScores[p] || 0) + pts * w;
          });
        }
      });
      // Reconstruct answer details
      const restoredDetails: AnswerDetail[] = restoredAnswers
        .map((answerValue, qIdx) => {
          if (answerValue === "__skip__" || !questions[qIdx]) return null;
          const question = questions[qIdx];
          const option = question.options.find((o) => o.value === answerValue);
          if (!option) return null;
          return {
            questionId: question.id,
            questionText: question.question,
            answerText: option.text,
            points: option.points,
            weight: question.weight,
          } as AnswerDetail;
        })
        .filter((d): d is AnswerDetail => d !== null);

      setAnswers(restoredAnswers);
      setAnswerDetails(restoredDetails);
      setScores(restoredScores);
      setCurrentQuestion(saved.currentStep);
      setShowIntro(false);
      setHasSavedProgress(false);
      setTimeout(() => quizRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch {
      clearSavedProgress();
    }
  }, [questions, clearSavedProgress]);

  // ---------------------------------------------------------------------------
  // Shared finalization logic (Issue 8: single source of truth)
  // ---------------------------------------------------------------------------
  const finalizeQuiz = useCallback(
    async (
      finalScores: Record<string, number>,
      finalAnswers: string[],
      finalDetails: AnswerDetail[]
    ) => {
      // Issue 3: Require at least 3 answered questions
      const answeredCount = finalAnswers.filter((a) => a !== "__skip__").length;
      if (answeredCount < 3) {
        showError(
          tr(
            "Responda a pelo menos 3 perguntas para obter um resultado fiável.",
            "Answer at least 3 questions to get a reliable result.",
            "Responda al menos 3 preguntas para obtener un resultado fiable."
          )
        );
        return;
      }

      if (!canUse) {
        showError(
          tr(
            "Limite de uso gratuito atingido. Subscreva PRO para continuar.",
            "Free usage limit reached. Subscribe to PRO to continue.",
            "Límite de uso gratuito alcanzado. Suscríbase a PRO para continuar."
          )
        );
        return;
      }

      // Issue 2: Determine main profile with tiebreaker
      let mp = "amador";
      let ms = 0;

      // Find the maximum score
      Object.values(finalScores).forEach((s) => {
        if (s > ms) ms = s;
      });

      // Collect all profiles with the max score
      const tiedProfiles = Object.entries(finalScores)
        .filter(([, s]) => s === ms && ms > 0)
        .map(([p]) => p);

      if (tiedProfiles.length === 1) {
        mp = tiedProfiles[0];
      } else if (tiedProfiles.length > 1) {
        // Tiebreaker 1: profile with highest single-question weighted score
        const maxSingleScore: Record<string, number> = {};
        tiedProfiles.forEach((p) => {
          maxSingleScore[p] = 0;
        });

        finalDetails.forEach((detail) => {
          tiedProfiles.forEach((profile) => {
            const pts = (detail.points[profile] || 0) * detail.weight;
            if (pts > (maxSingleScore[profile] || 0)) {
              maxSingleScore[profile] = pts;
            }
          });
        });

        let bestSingle = 0;
        tiedProfiles.forEach((p) => {
          if ((maxSingleScore[p] || 0) > bestSingle)
            bestSingle = maxSingleScore[p] || 0;
        });

        const singleWinners = tiedProfiles.filter(
          (p) => (maxSingleScore[p] || 0) === bestSingle
        );

        if (singleWinners.length === 1) {
          mp = singleWinners[0];
        } else {
          // Tiebreaker 2: alphabetical order
          mp = singleWinners.sort()[0];
        }
      }

      // Determine sub-profile (Issue 5: includes aprendiz sub-profiles)
      const q1 = finalAnswers[0]; // Objectivo (Q1)
      const q2 = finalAnswers[1]; // Experiência (Q2)
      const q5 = finalAnswers[4]; // Genética (Q5)
      const q6 = finalAnswers[5]; // Nível de treino desejado (Q6)
      const q7 = finalAnswers[6]; // Orçamento (Q7)
      let sp: string | null = null;
      if (mp === "competidor") {
        if (q1 === "trabalho") sp = "competidor_trabalho";
        else if (q7 === "premium" || q7 === "alto") sp = "competidor_elite";
        else sp = "competidor_nacional";
      } else if (mp === "amador") {
        if (q6 === "desbravado" || q6 === "basico") sp = "amador_projeto";
      } else if (mp === "aprendiz") {
        if (q2 === "iniciante") sp = "aprendiz_iniciante";
        else sp = "aprendiz_transicao";
      } else if (mp === "tradicional") {
        // q1 = primary discipline answer
        if (q1 === "trabalho") sp = "tradicional_campeiro";
        else sp = "tradicional_classico";
      } else if (mp === "criador") {
        // q5 = genetics importance
        if (q5 === "elite") sp = "criador_selecao";
        else sp = "criador_conservacao";
      }

      // Issue 4: Confidence adjusted for skipped questions
      const sortedScores = Object.values(finalScores).sort(
        (a: number, b: number) => b - a
      );
      const rawConfidence =
        sortedScores.length >= 2 && sortedScores[0] + sortedScores[1] > 0
          ? Math.round(
              (sortedScores[0] / (sortedScores[0] + sortedScores[1])) * 100
            )
          : 100;
      const answeredRatio = answeredCount / finalAnswers.length;
      const inlineConfidence = Math.round(rawConfidence * answeredRatio);

      // Compute score percentages for rich metadata
      const totalScoreForMeta =
        Object.values(finalScores).reduce(
          (a: number, b: number) => a + b,
          0
        ) || 1;
      const scorePercentagesMeta = Object.entries(finalScores).map(
        ([p, s]) => ({
          profile: p,
          percentage: Math.round((s / totalScoreForMeta) * 100),
        })
      );

      setIsPending(true);
      let allowed = false;
      try {
        allowed = await validateAndRecord(finalScores, {
          profile: mp,
          subProfile: sp ?? null,
          confidence: inlineConfidence,
          scorePercentages: scorePercentagesMeta,
        });
      } catch {
        showError(
          tr(
            "Erro de ligação. Verifica a tua ligação à internet.",
            "Connection error. Please check your internet connection.",
            "Error de conexión. Verifica tu conexión a internet."
          )
        );
        return;
      } finally {
        setIsPending(false);
      }

      if (!allowed) {
        setError(
          tr(
            "Limite de uso gratuito atingido. Subscreva PRO para continuar.",
            "Free usage limit reached. Subscribe to PRO to continue.",
            "Límite de uso gratuito alcanzado. Suscríbase a PRO para continuar."
          )
        );
        return;
      }

      setResult(results[mp]);
      setShowResult(true);
      setSubProfile(sp);
      clearSavedProgress();
      setTimeout(
        () => window.scrollTo({ top: 0, behavior: "smooth" }),
        100
      );
    },
    [
      canUse,
      validateAndRecord,
      setError,
      showError,
      tr,
      results,
      clearSavedProgress,
    ]
  );

  const handleAnswer = useCallback(
    async (option: QuestionOption) => {
      if (isPending || showResult) return;
      const q = questions[currentQuestion];
      const w = q.weight;
      const newAnswers = [...answers, option.value];
      const newScores = { ...scores };
      Object.entries(option.points).forEach(([p, pts]) => {
        newScores[p] = (newScores[p] || 0) + pts * w;
      });

      const newDetail: AnswerDetail = {
        questionId: q.id,
        questionText: q.question,
        answerText: option.text,
        points: option.points,
        weight: w,
      };
      const newDetails = [...answerDetails, newDetail];

      setAnswers(newAnswers);
      setAnswerDetails(newDetails);
      setScores(newScores);
      // Reset dismissal so a newly-triggered warning becomes visible
      setCrossWarningDismissed(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        // Save progress to localStorage
        saveProgressToStorage(newAnswers, currentQuestion + 1);
        // Scroll to quiz top so the next question is visible
        setTimeout(() => quizRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      } else {
        // Finalization handled by shared function (Issue 8)
        finalizeQuiz(newScores, newAnswers, newDetails);
      }
    },
    [isPending, showResult, currentQuestion, answers, scores, answerDetails, questions, finalizeQuiz, saveProgressToStorage]
  );

  const calculateConfidence = useCallback((): number => {
    if (answerDetails.length === 0 || !result) return 0;
    let alignedPoints = 0;
    let totalPoints = 0;
    answerDetails.forEach((detail) => {
      const maxProfile = Object.entries(detail.points).reduce(
        (a, b) => (b[1] > a[1] ? b : a),
        ["", 0]
      );
      totalPoints += (maxProfile[1] as number) * detail.weight;
      if (maxProfile[0] === result.profile)
        alignedPoints += detail.points[result.profile] * detail.weight;
    });
    const rawConfidence = totalPoints > 0 ? Math.round((alignedPoints / totalPoints) * 100) : 0;
    // Issue 4: Lower confidence when questions were skipped
    const skippedCount = answers.filter((a) => a === "__skip__").length;
    const totalQuestions = answers.length;
    if (skippedCount > 0 && totalQuestions > 0) {
      const answeredRatio = (totalQuestions - skippedCount) / totalQuestions;
      return Math.round(rawConfidence * answeredRatio);
    }
    return rawConfidence;
  }, [answerDetails, result, answers]);

  const saveResult = useCallback(() => {
    if (result) {
      try {
        localStorage.setItem(
          "analise-perfil-result",
          JSON.stringify({ profile: result.profile, scores, date: new Date().toISOString() })
        );
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch {
        showError(
          tr(
            "Não foi possível guardar o resultado localmente.",
            "Could not save result locally.",
            "No se pudo guardar el resultado localmente."
          )
        );
      }
    }
  }, [result, scores, showError, tr]);

  const getShareUrl = useCallback(
    (): string => buildShareUrl(result, scores, subProfile, calculateConfidence()),
    [result, scores, subProfile, calculateConfidence]
  );

  const copyShareLink = useCallback(() => {
    navigator.clipboard
      .writeText(getShareUrl())
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        showError(
          tr(
            "Não foi possível copiar. Usa o link acima.",
            "Could not copy. Use the link above.",
            "No se pudo copiar. Usa el enlace de arriba."
          )
        );
      });
  }, [getShareUrl, showError, tr]);

  const shareWhatsApp = useCallback(
    () => doShareWhatsApp(result, scores, subProfile, tr),
    [result, scores, subProfile, tr]
  );

  const shareFacebook = useCallback(() => doShareFacebook(getShareUrl()), [getShareUrl]);

  const shareInstagram = useCallback(
    () =>
      doShareInstagram(result, scores, t.analise_perfil.instagram_copied, tr, (text) =>
        showToast("success", text)
      ),
    [result, scores, t, tr, showToast]
  );

  const downloadPDF = useCallback(async () => {
    if (!result || isPdfLoading) return;
    setIsPdfLoading(true);
    try {
      await generateProfilePDF(result, scores, language, isSubscribed);
    } catch {
      showError(
        tr(
          "Erro ao gerar PDF. Tenta novamente.",
          "Error generating PDF. Please try again.",
          "Error al generar PDF. Inténtalo de nuevo."
        )
      );
    } finally {
      setIsPdfLoading(false);
    }
  }, [result, scores, isPdfLoading, showError, tr, language, isSubscribed]);

  const downloadBadge = useCallback(async () => {
    if (!badgeRef.current || !result || isBadgeLoading) return;
    setIsBadgeLoading(true);
    try {
      await generateBadge(badgeRef.current, result, scores);
    } catch {
      showError(
        tr(
          "Erro ao gerar imagem. A tentar formato alternativo...",
          "Error generating image. Trying alternative format...",
          "Error al generar imagen. Intentando formato alternativo..."
        )
      );
      generateBadgeSVGFallback(result, scores, tr);
    } finally {
      setIsBadgeLoading(false);
    }
  }, [result, scores, isBadgeLoading, showError, tr]);

  const resetQuiz = useCallback(() => {
    setShowIntro(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setAnswerDetails([]);
    setScores({ competidor: 0, tradicional: 0, criador: 0, amador: 0, aprendiz: 0 });
    setShowResult(false);
    setResult(null);
    setSubProfile(null);
    setSelectedTab("perfil");
    setSaved(false);
    setCopied(false);
    setCrossWarningDismissed(false);
    clearSavedProgress();
  }, [clearSavedProgress]);

  const skipQuestion = useCallback(() => {
    if (isPending) return;
    const newAnswers = [...answers, "__skip__"];
    // No points added for a skip
    setAnswers(newAnswers);
    setCrossWarningDismissed(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      saveProgressToStorage(newAnswers, currentQuestion + 1);
      setTimeout(() => quizRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } else {
      // Finalization handled by shared function (Issue 8)
      finalizeQuiz(scores, newAnswers, answerDetails);
    }
  }, [isPending, currentQuestion, answers, scores, answerDetails, questions.length, finalizeQuiz, saveProgressToStorage]);

  const goBack = useCallback(() => {
    if (currentQuestion > 0) {
      const newAnswers = answers.slice(0, -1);
      const newDetails = answerDetails.slice(0, -1);

      // Recalculate scores from scratch to avoid stale accumulated points
      const freshScores: Record<string, number> = {
        competidor: 0,
        tradicional: 0,
        criador: 0,
        amador: 0,
        aprendiz: 0,
      };
      newAnswers.forEach((answerValue, qIdx) => {
        if (answerValue === "__skip__") return; // Skip doesn't contribute points
        const question = questions[qIdx];
        const option = question.options.find((o) => o.value === answerValue);
        if (option) {
          const w = question.weight;
          Object.entries(option.points).forEach(([p, pts]) => {
            freshScores[p] = (freshScores[p] || 0) + pts * w;
          });
        }
      });

      setScores(freshScores);
      setAnswers(newAnswers);
      setAnswerDetails(newDetails);
      setCurrentQuestion(currentQuestion - 1);
      setTimeout(() => quizRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      setCrossWarningDismissed(false);
    }
  }, [currentQuestion, answers, answerDetails, questions]);

  const dismissCrossWarning = useCallback(() => {
    setCrossWarningDismissed(true);
  }, []);

  // Derived data
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const scorePercentages: ScorePercentage[] = useMemo(
    () =>
      Object.entries(scores)
        .map(([p, s]) => ({
          profile: p,
          percentage: Math.round((s / totalScore) * 100),
          label: results[p]?.title || p,
        }))
        .sort((a, b) => b.percentage - a.percentage),
    [scores, totalScore, results]
  );

  // Real-time dominant profile for quiz preview
  const PROFILE_LABELS: Record<string, string> = useMemo(
    () => ({
      competidor: tr("Competidor", "Competitor", "Competidor"),
      criador: tr("Criador", "Breeder", "Criador"),
      amador: tr("Apreciador Amador", "Amateur Enthusiast", "Aficionado Amateur"),
      tradicional: tr("Tradicionalista", "Traditionalist", "Tradicionalista"),
      aprendiz: tr("Aprendiz", "Learning Rider", "Aprendiz"),
    }),
    [tr]
  );
  const maxScore = Math.max(...Object.values(scores));
  const currentDominant = maxScore > 0 ? Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null : null;
  const dominantProfile = currentDominant;
  const calculatingLabel = tr("A calcular...", "Calculating...", "Calculando...");
  const dominantProfileLabel = currentDominant
    ? (PROFILE_LABELS[currentDominant] ?? calculatingLabel)
    : calculatingLabel;

  const radarData: RadarChartData = useMemo(
    () => ({
      competicao: (scores.competidor / totalScore) * 100,
      tradicao: (scores.tradicional / totalScore) * 100,
      criacao: (scores.criador / totalScore) * 100,
      lazer: (scores.amador / totalScore) * 100,
      investimento: (() => {
        // Issue 20: Use Q7 budget data for investment axis
        const q7 = answers[6];
        const INVESTIMENTO_SCORES: Record<string, number> = {
          economico: 25,
          medio: 50,
          alto: 75,
          premium: 100,
        };
        return INVESTIMENTO_SCORES[q7] ?? 0;
      })(),
      dedicacao: (() => {
        // Q8 (answers[7]) — "Quanto tempo pode dedicar ao cavalo semanalmente?"
        const q8 = answers[7];
        const DEDICACAO_SCORES: Record<string, number> = {
          diario: 100,
          frequente: 75,
          weekend: 30,
          ausente: 50,
        };
        return DEDICACAO_SCORES[q8] ?? 0;
      })(),
    }),
    [scores, totalScore, answers]
  );

  // Computed cross-validation warning (null when both key questions not yet answered or dismissed)
  const rawCrossWarning = getCrossValidationWarning(answers, tr);
  const crossValidationWarning = crossWarningDismissed ? null : rawCrossWarning;

  return {
    // State
    showIntro,
    showResult,
    currentQuestion,
    result,
    subProfile,
    selectedTab,
    saved,
    copied,
    error,
    setError,
    answerDetails,
    answers,
    // Cross-validation
    crossValidationWarning,
    dismissCrossWarning,
    // Refs
    quizRef,
    badgeRef,
    // Access control
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    accessLoading,
    isPending,
    isPdfLoading,
    isBadgeLoading,
    // Persistence
    hasSavedProgress,
    resumeQuiz,
    clearSavedProgress,
    // Actions
    startQuiz,
    handleAnswer,
    skipQuestion,
    goBack,
    resetQuiz,
    saveResult,
    copyShareLink,
    shareWhatsApp,
    shareFacebook,
    shareInstagram,
    downloadPDF,
    downloadBadge,
    setSelectedTab,
    calculateConfidence,
    // Derived data
    questions,
    scorePercentages,
    radarData,
    dominantProfile,
    dominantProfileLabel,
    // Chain context
    chainContext,
    setChainContext,
  };
}

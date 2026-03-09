"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useToolAccess } from "@/hooks/useToolAccess";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { questions } from "@/components/analise-perfil/data/questions";
import { results } from "@/components/analise-perfil/data/results";
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

  return null;
}

export function useQuizLogic() {
  const { t, language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);
  const [showIntro, setShowIntro] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [answerDetails, setAnswerDetails] = useState<AnswerDetail[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({
    competidor: 0,
    tradicional: 0,
    criador: 0,
    amador: 0,
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

  // Check for shared result in URL
  useEffect(() => {
    const sharedResult = searchParams.get("r");
    if (sharedResult) {
      try {
        const decoded = JSON.parse(atob(sharedResult));
        if (decoded.profile && results[decoded.profile]) {
          // eslint-disable-next-line react-hooks/set-state-in-effect -- URL param initialization on mount
          setScores(decoded.scores || { competidor: 0, tradicional: 0, criador: 0, amador: 0 });
          setResult(results[decoded.profile]);
          setShowIntro(false);
          setShowResult(true);
        }
      } catch {
        // Invalid shared result - silenced
      }
    }
  }, [searchParams]);

  const startQuiz = useCallback(() => {
    setShowIntro(false);
    setTimeout(() => quizRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  const handleAnswer = useCallback(
    async (option: QuestionOption) => {
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
        // Scroll to quiz top so the next question is visible
        setTimeout(() => quizRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
      } else {
        if (!canUse) return;

        let mp = "amador";
        let ms = 0;
        Object.entries(newScores).forEach(([p, s]) => {
          if (s > ms) {
            ms = s;
            mp = p;
          }
        });
        // Determinar sub-perfil
        const q1 = newAnswers[0]; // Objectivo (Q1)
        const q6 = newAnswers[5]; // Nível de treino desejado (Q6)
        const q7 = newAnswers[6]; // Orçamento (Q7)
        let sp: string | null = null;
        if (mp === "competidor") {
          if (q1 === "trabalho") sp = "competidor_trabalho";
          else if (q7 === "premium" || q7 === "alto") sp = "competidor_elite";
          else sp = "competidor_nacional";
        } else if (mp === "amador") {
          if (q6 === "desbravado" || q6 === "basico") sp = "amador_projeto";
        }
        // Confidence inline: ratio of top score vs 2nd score
        const sortedScores = Object.values(newScores).sort((a: number, b: number) => b - a);
        const inlineConfidence =
          sortedScores.length >= 2 && sortedScores[0] + sortedScores[1] > 0
            ? Math.round((sortedScores[0] / (sortedScores[0] + sortedScores[1])) * 100)
            : 100;
        // Compute score percentages for rich metadata
        const totalScoreForMeta =
          Object.values(newScores).reduce((a: number, b: number) => a + b, 0) || 1;
        const scorePercentagesMeta = Object.entries(newScores).map(([p, s]) => ({
          profile: p,
          percentage: Math.round((s / totalScoreForMeta) * 100),
        }));

        // Server-side validation + recording BEFORE showing results
        const allowed = await validateAndRecord(newScores, {
          profile: mp,
          subProfile: sp ?? null,
          confidence: inlineConfidence,
          scorePercentages: scorePercentagesMeta,
        });

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
        // Scroll to top so the user sees the result
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
      }
    },
    [currentQuestion, answers, scores, answerDetails, canUse, validateAndRecord, setError, tr]
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
    return totalPoints > 0 ? Math.round((alignedPoints / totalPoints) * 100) : 0;
  }, [answerDetails, result]);

  const saveResult = useCallback(() => {
    if (result) {
      localStorage.setItem(
        "analise-perfil-result",
        JSON.stringify({ profile: result.profile, scores, date: new Date().toISOString() })
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }, [result, scores]);

  const getShareUrl = useCallback((): string => buildShareUrl(result, scores), [result, scores]);

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
            "Erro de ligação. Verifica a tua internet.",
            "Connection error. Check your internet.",
            "Error de conexión. Verifica tu internet."
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
    () => doShareInstagram(result, scores, t.analise_perfil.instagram_copied, tr),
    [result, scores, t, tr]
  );

  const downloadPDF = useCallback(async () => {
    if (!result) return;
    try {
      await generateProfilePDF(result, scores);
    } catch {
      showError(
        tr(
          "Erro ao gerar PDF. Tenta novamente.",
          "Error generating PDF. Please try again.",
          "Error al generar PDF. Inténtalo de nuevo."
        )
      );
    }
  }, [result, scores, showError, tr]);

  const downloadBadge = useCallback(async () => {
    if (!badgeRef.current || !result) return;
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
    }
  }, [result, scores, showError, tr]);

  const resetQuiz = useCallback(() => {
    setShowIntro(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setAnswerDetails([]);
    setScores({ competidor: 0, tradicional: 0, criador: 0, amador: 0 });
    setShowResult(false);
    setResult(null);
    setSubProfile(null);
    setSelectedTab("perfil");
    setSaved(false);
    setCopied(false);
    setCrossWarningDismissed(false);
  }, []);

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
      };
      newAnswers.forEach((answerValue, qIdx) => {
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
  }, [currentQuestion, answers, answerDetails]);

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
    [scores, totalScore]
  );

  // Real-time dominant profile for quiz preview
  const PROFILE_LABELS: Record<string, string> = useMemo(
    () => ({
      competidor: tr("Competidor", "Competitor", "Competidor"),
      criador: tr("Criador", "Breeder", "Criador"),
      amador: tr("Apreciador Amador", "Amateur Enthusiast", "Aficionado Amateur"),
      tradicional: tr("Tradicionalista", "Traditionalist", "Tradicionalista"),
    }),
    [tr]
  );
  const currentDominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
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
      investimento: scorePercentages[0]?.percentage || 0,
      dedicacao: Math.min(
        100,
        answers.filter((a) => ["diario", "frequente", "completo", "treinador_top"].includes(a))
          .length * 25
      ),
    }),
    [scores, totalScore, scorePercentages, answers]
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
    // Actions
    startQuiz,
    handleAnswer,
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

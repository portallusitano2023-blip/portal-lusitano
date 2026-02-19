"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useToolAccess } from "@/hooks/useToolAccess";
import { useLanguage } from "@/context/LanguageContext";
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

export function useQuizLogic() {
  const { t } = useLanguage();
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
  const quizRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const {
    canUse,
    isSubscribed,
    freeUsesLeft,
    requiresAuth,
    recordUsage,
    isLoading: accessLoading,
  } = useToolAccess("perfil");

  const showError = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
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
    (option: QuestionOption) => {
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
      if (currentQuestion < questions.length - 1) setCurrentQuestion(currentQuestion + 1);
      else {
        if (!canUse) return;

        // Q16 (treinador) — index 15 — bonus score adjustments (weight 1.2 already applied above)
        const treinadorAnswer = newAnswers[15];
        if (treinadorAnswer === "dedicado") {
          newScores.competidor = (newScores.competidor || 0) + 8;
        } else if (treinadorAnswer === "regular") {
          newScores.competidor = (newScores.competidor || 0) + 4;
        } else if (treinadorAnswer === "autonomo") {
          newScores.amador = (newScores.amador || 0) + 3;
        }
        // Q17 (transporte) — index 16 — minimal impact (weight 0.5 already applied above)
        // Used primarily for recommendations; no additional score boost needed

        let mp = "amador";
        let ms = 0;
        Object.entries(newScores).forEach(([p, s]) => {
          if (s > ms) {
            ms = s;
            mp = p;
          }
        });
        // Determinar sub-perfil (antes de recordUsage para incluir nos metadados)
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

        setResult(results[mp]);
        setShowResult(true);
        recordUsage(newScores, {
          profile: mp,
          subProfile: sp ?? null,
          confidence: inlineConfidence,
          scorePercentages: scorePercentagesMeta,
        });
        setSubProfile(sp);
      }
    },
    [currentQuestion, answers, scores, answerDetails, canUse, recordUsage]
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
        showError("Erro de ligação. Verifica a tua internet.");
      });
  }, [getShareUrl, showError]);

  const shareWhatsApp = useCallback(
    () => doShareWhatsApp(result, scores, subProfile),
    [result, scores, subProfile]
  );

  const shareFacebook = useCallback(() => doShareFacebook(getShareUrl()), [getShareUrl]);

  const shareInstagram = useCallback(
    () => doShareInstagram(result, scores, t.analise_perfil.instagram_copied),
    [result, scores, t]
  );

  const downloadPDF = useCallback(async () => {
    if (!result) return;
    try {
      await generateProfilePDF(result, scores);
    } catch {
      showError("Erro ao gerar PDF. Tenta novamente.");
    }
  }, [result, scores, showError]);

  const downloadBadge = useCallback(async () => {
    if (!badgeRef.current || !result) return;
    try {
      await generateBadge(badgeRef.current, result, scores);
    } catch {
      showError("Erro ao gerar imagem. A tentar formato alternativo...");
      generateBadgeSVGFallback(result, scores);
    }
  }, [result, scores, showError]);

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
  }, []);

  const goBack = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
      setAnswerDetails(answerDetails.slice(0, -1));
    }
  }, [currentQuestion, answers, answerDetails]);

  // Derived data
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const scorePercentages: ScorePercentage[] = Object.entries(scores)
    .map(([p, s]) => ({
      profile: p,
      percentage: Math.round((s / totalScore) * 100),
      label: results[p]?.title || p,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Real-time dominant profile for quiz preview
  const PROFILE_LABELS: Record<string, string> = {
    competidor: "Competidor",
    criador: "Criador",
    amador: "Apreciador Amador",
    tradicional: "Tradicionalista",
  };
  const currentDominant = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const dominantProfile = currentDominant;
  const dominantProfileLabel = currentDominant
    ? (PROFILE_LABELS[currentDominant] ?? "A calcular...")
    : "A calcular...";

  const radarData: RadarChartData = {
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
  };

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
  };
}

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useToolAccess } from "@/hooks/useToolAccess";
import { useLanguage } from "@/context/LanguageContext";
import { questions } from "@/components/analise-perfil/data/questions";
import { results } from "@/components/analise-perfil/data/results";
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
  const [selectedTab, setSelectedTab] = useState<ResultTab>("perfil");
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
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

  // Check for shared result in URL
  useEffect(() => {
    const sharedResult = searchParams.get("r");
    if (sharedResult) {
      try {
        const decoded = JSON.parse(atob(sharedResult));
        if (decoded.profile && results[decoded.profile]) {
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
        let mp = "amador";
        let ms = 0;
        Object.entries(newScores).forEach(([p, s]) => {
          if (s > ms) {
            ms = s;
            mp = p;
          }
        });
        setResult(results[mp]);
        setShowResult(true);
        recordUsage(newScores);
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

  const getShareUrl = useCallback((): string => {
    if (!result) return "";
    const data = { profile: result.profile, scores };
    const encoded = btoa(JSON.stringify(data));
    return `${typeof window !== "undefined" ? window.location.origin : ""}/analise-perfil?r=${encoded}`;
  }, [result, scores]);

  const copyShareLink = useCallback(() => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }, [getShareUrl]);

  const shareWhatsApp = useCallback(() => {
    if (!result) return;
    const totalS = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
    const p = Math.round((scores[result.profile] / totalS) * 100);
    const text = encodeURIComponent(
      `Fiz a Analise de Perfil do Cavaleiro!\n\nO meu perfil: ${result.title} (${p}%)\n"${result.subtitle}"\n\nDescobre o teu: ${getShareUrl()}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }, [result, scores, getShareUrl]);

  const shareFacebook = useCallback(() => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  }, [getShareUrl]);

  const shareInstagram = useCallback(() => {
    if (!result) return;
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
    const p = Math.round((scores[result.profile] / totalScore) * 100);
    const text = `Fiz a Analise de Perfil do Cavaleiro!\n\nO meu perfil: ${result.title} (${p}%)\n"${result.subtitle}"\n\nDescobre o teu perfil em:\nportallusitano.pt/analise-perfil\n\n#Lusitano #CavaloLusitano #Equitacao #PortalLusitano`;
    navigator.clipboard.writeText(text);
    alert(t.analise_perfil.instagram_copied);
  }, [result, scores, t]);

  const downloadPDF = useCallback(async () => {
    if (!result) return;
    const jsPDF = (await import("jspdf")).default;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
    const p = Math.round((scores[result.profile] / totalScore) * 100);

    // Header
    doc.setFillColor(5, 5, 5);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(10);
    doc.text("PORTAL LUSITANO", 105, 20, { align: "center" });
    doc.setFontSize(8);
    doc.text("ANALISE DE PERFIL DO CAVALEIRO", 105, 27, { align: "center" });

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.text(result.title, 105, 50, { align: "center" });
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(14);
    doc.text(result.subtitle, 105, 60, { align: "center" });

    // Percentage
    doc.setFontSize(36);
    doc.text(`${p}%`, 105, 80, { align: "center" });

    // Description
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(result.description, 170);
    doc.text(descLines, 20, 95);

    // Ideal Horse Section
    let yPos = 95 + descLines.length * 5 + 10;
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(12);
    doc.text("CAVALO IDEAL", 20, yPos);
    yPos += 8;
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(9);
    doc.text(`Idade: ${result.idealHorse.age}`, 20, yPos);
    doc.text(`Altura: ${result.idealHorse.height}`, 105, yPos);
    yPos += 6;
    doc.text(`Treino: ${result.idealHorse.training}`, 20, yPos);
    yPos += 6;
    doc.text(`Temperamento: ${result.idealHorse.temperament}`, 20, yPos);
    yPos += 6;
    doc.text(`Preco: ${result.idealHorse.priceRange}`, 20, yPos);

    // Costs Section
    yPos += 15;
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(12);
    doc.text("CUSTOS ANUAIS ESTIMADOS", 20, yPos);
    yPos += 8;
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(10);
    doc.text(
      `${result.annualCosts.min.toLocaleString()} - ${result.annualCosts.max.toLocaleString()} euros/ano`,
      20,
      yPos
    );

    // Tips Section
    yPos += 15;
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(12);
    doc.text("DICAS", 20, yPos);
    yPos += 8;
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(9);
    result.tips.slice(0, 5).forEach((tip, i) => {
      doc.text(`${i + 1}. ${tip}`, 20, yPos);
      yPos += 5;
    });

    // Next Steps Section
    yPos += 10;
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(12);
    doc.text("PROXIMOS PASSOS", 20, yPos);
    yPos += 8;
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(9);
    result.nextSteps.slice(0, 4).forEach((step, i) => {
      doc.text(`${i + 1}. ${step}`, 20, yPos);
      yPos += 5;
    });

    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text("portallusitano.pt/analise-perfil", 105, 285, { align: "center" });
    doc.text(`Gerado em ${new Date().toLocaleDateString("pt-PT")}`, 105, 290, { align: "center" });

    doc.save(`analise-perfil-${result.profile}.pdf`);
  }, [result, scores]);

  const downloadBadge = useCallback(async () => {
    if (!badgeRef.current || !result) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(badgeRef.current, {
        backgroundColor: "#050505",
        scale: 2,
        useCORS: true,
        logging: false,
        removeContainer: true,
      });
      const link = document.createElement("a");
      link.download = `perfil-${result.profile}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // Fallback: generate SVG badge instead
      const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
      const percentage = Math.round((scores[result.profile] / totalScore) * 100);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="540" viewBox="0 0 540 540">
        <rect width="540" height="540" fill="#050505"/>
        <rect x="20" y="20" width="500" height="500" fill="none" stroke="#C5A059" stroke-width="4"/>
        <text x="270" y="100" text-anchor="middle" fill="#C5A059" font-size="14" letter-spacing="3">PORTAL LUSITANO</text>
        <text x="270" y="200" text-anchor="middle" fill="#888" font-size="12" letter-spacing="2">O MEU PERFIL EQUESTRE</text>
        <text x="270" y="270" text-anchor="middle" fill="#fff" font-size="32" font-family="serif">${result.title}</text>
        <text x="270" y="310" text-anchor="middle" fill="#C5A059" font-size="18" font-style="italic">${result.subtitle}</text>
        <rect x="220" y="350" width="100" height="50" fill="#C5A059"/>
        <text x="270" y="385" text-anchor="middle" fill="#000" font-size="28" font-weight="bold">${percentage}%</text>
        <text x="270" y="480" text-anchor="middle" fill="#444" font-size="11">portallusitano.pt/analise-perfil</text>
      </svg>`;
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `perfil-${result.profile}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, [result, scores]);

  const resetQuiz = useCallback(() => {
    setShowIntro(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setAnswerDetails([]);
    setScores({ competidor: 0, tradicional: 0, criador: 0, amador: 0 });
    setShowResult(false);
    setResult(null);
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
    selectedTab,
    saved,
    copied,
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
  };
}

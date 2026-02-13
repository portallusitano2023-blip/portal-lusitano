"use client";

import { useMemo } from "react";
import { Gauge, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Result, AnswerDetail } from "@/components/analise-perfil/types";

interface ReadinessTabProps {
  result: Result;
  answerDetails: AnswerDetail[];
  confidence: number;
}

interface SubScore {
  label: string;
  value: number;
  color: string;
}

export default function ReadinessTab({
  result,
  answerDetails: _answerDetails,
  confidence,
}: ReadinessTabProps) {
  const { t } = useLanguage();

  // Sub-scores
  const experienceScore = confidence;

  const budgetScore = 60;

  const timeDemand: Record<string, number> = {
    competidor: 70,
    criador: 65,
    tradicional: 55,
    amador: 80,
    investidor: 50,
  };
  const timeScore = timeDemand[result.profile] || 60;

  const infraScore = 55;

  const globalScore = useMemo(
    () =>
      Math.round(
        experienceScore * 0.35 + budgetScore * 0.25 + timeScore * 0.25 + infraScore * 0.15
      ),
    [experienceScore, timeScore]
  );

  const subScores: SubScore[] = [
    { label: "Experiencia", value: experienceScore, color: "#3b82f6" },
    { label: "Orcamento", value: budgetScore, color: "#22c55e" },
    { label: "Disponibilidade", value: timeScore, color: "#f59e0b" },
    { label: "Infraestrutura", value: infraScore, color: "#8b5cf6" },
  ];

  // Prerequisites
  const prerequisites = useMemo(() => {
    const items: { text: string; met: boolean }[] = [];

    if (experienceScore < 50) {
      items.push({
        text: "Considere aulas de equitacao antes de adquirir um cavalo",
        met: false,
      });
    } else {
      items.push({
        text: "Nivel de experiencia adequado ao perfil",
        met: true,
      });
    }

    if (budgetScore < 50) {
      items.push({
        text: "Reveja o orcamento para garantir sustentabilidade",
        met: false,
      });
    } else {
      items.push({
        text: "Orcamento dentro do intervalo recomendado",
        met: true,
      });
    }

    if (result.profile === "competidor" && confidence < 60) {
      items.push({
        text: "Ganhe experiencia em competicao antes de investir num cavalo de topo",
        met: false,
      });
    }

    if (result.profile === "criador") {
      items.push({
        text: "Estude genetica equina e visite coudelarias de referencia",
        met: false,
      });
    }

    items.push({
      text: "Visite pelo menos 3 cavalos antes de decidir",
      met: false,
    });

    return items;
  }, [experienceScore, budgetScore, result.profile, confidence]);

  // Gauge arc calculations
  const gaugeSize = 200;
  const strokeW = 14;
  const radius = (gaugeSize - strokeW) / 2;
  const centerX = gaugeSize / 2;
  const centerY = gaugeSize / 2 + 10;

  // Semicircle from 180 to 0 degrees (left to right arc)
  const startAngle = Math.PI; // 180 degrees
  const endAngle = 0;
  const totalArc = Math.PI; // 180 degrees

  const scoreAngle = startAngle - (globalScore / 100) * totalArc;

  const arcStartX = centerX + radius * Math.cos(startAngle);
  const arcStartY = centerY - radius * Math.sin(startAngle);
  const arcEndX = centerX + radius * Math.cos(scoreAngle);
  const arcEndY = centerY - radius * Math.sin(scoreAngle);

  const largeArc = globalScore > 50 ? 1 : 0;

  const bgArcEndX = centerX + radius * Math.cos(endAngle);
  const bgArcEndY = centerY - radius * Math.sin(endAngle);

  const scoreColor = globalScore >= 70 ? "#22c55e" : globalScore >= 45 ? "#f59e0b" : "#ef4444";

  return (
    <div className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      {/* Main gauge */}
      <div className="bg-gradient-to-b from-[var(--gold)]/10 to-transparent border border-[var(--gold)]/20 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-6">
          <Gauge className="text-[var(--gold)]" size={20} />
          {t.analise_perfil.readiness_title}
        </h3>

        {/* SVG semicircular gauge */}
        <div className="flex justify-center mb-6">
          <svg
            width={gaugeSize}
            height={gaugeSize / 2 + 30}
            viewBox={`0 0 ${gaugeSize} ${gaugeSize / 2 + 30}`}
            role="img"
            aria-label={`Indice de prontidao: ${globalScore} porcento`}
          >
            {/* Background arc */}
            <path
              d={`M ${arcStartX} ${arcStartY} A ${radius} ${radius} 0 1 1 ${bgArcEndX} ${bgArcEndY}`}
              fill="none"
              stroke="var(--border)"
              strokeWidth={strokeW}
              strokeLinecap="round"
              opacity={0.3}
            />

            {/* Score arc */}
            {globalScore > 0 && (
              <path
                d={`M ${arcStartX} ${arcStartY} A ${radius} ${radius} 0 ${largeArc} 1 ${arcEndX} ${arcEndY}`}
                fill="none"
                stroke={scoreColor}
                strokeWidth={strokeW}
                strokeLinecap="round"
              />
            )}

            {/* Center score text */}
            <text
              x={centerX}
              y={centerY - 8}
              textAnchor="middle"
              className="text-[36px] font-bold"
              fill="var(--foreground)"
            >
              {globalScore}
            </text>
            <text
              x={centerX}
              y={centerY + 14}
              textAnchor="middle"
              className="text-[11px]"
              fill="var(--foreground-muted)"
            >
              prontidao
            </text>

            {/* Scale labels */}
            <text
              x={arcStartX - 2}
              y={arcStartY + 18}
              textAnchor="middle"
              className="text-[10px]"
              fill="var(--foreground-muted)"
            >
              0
            </text>
            <text
              x={bgArcEndX + 2}
              y={bgArcEndY + 18}
              textAnchor="middle"
              className="text-[10px]"
              fill="var(--foreground-muted)"
            >
              100
            </text>
          </svg>
        </div>

        {/* Score interpretation */}
        <p className="text-sm text-center text-[var(--foreground-secondary)] max-w-md mx-auto">
          {globalScore >= 70
            ? "Bom nivel de prontidao para adquirir um Lusitano. Avance com confianca."
            : globalScore >= 45
              ? "Nivel moderado. Considere reforcar as areas com pontuacao mais baixa."
              : "Recomenda-se preparacao adicional antes de avançar com a aquisicao."}
        </p>
      </div>

      {/* Sub-score bars */}
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="text-sm font-medium text-[var(--foreground)] mb-6">
          Pontuacao por Dimensao
        </h3>

        <div className="space-y-5">
          {subScores.map((sub, i) => (
            <div
              key={sub.label}
              className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-[var(--foreground-secondary)]">{sub.label}</span>
                <span
                  className="text-sm font-serif font-bold tabular-nums"
                  style={{ color: sub.color }}
                >
                  {sub.value}%
                </span>
              </div>
              <div className="h-2.5 bg-[var(--background-card)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${sub.value}%`,
                    backgroundColor: sub.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="text-sm font-medium text-[var(--foreground)] mb-6">Pre-requisitos</h3>

        <div className="space-y-3">
          {prerequisites.map((prereq, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 border opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{
                animationDelay: `${i * 0.08}s`,
                borderColor: prereq.met ? "rgba(34, 197, 94, 0.2)" : "var(--border)",
                backgroundColor: prereq.met ? "rgba(34, 197, 94, 0.05)" : "var(--background-card)",
              }}
            >
              {prereq.met ? (
                <CheckCircle
                  size={18}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: "#22c55e" }}
                />
              ) : (
                <XCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#f59e0b" }} />
              )}
              <span
                className="text-sm"
                style={{
                  color: prereq.met ? "var(--foreground-secondary)" : "var(--foreground)",
                }}
              >
                {prereq.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-[var(--foreground-muted)]/60 leading-relaxed text-center">
        A pontuacao de prontidao e baseada nas respostas ao questionario e nas caracteristicas do
        perfil. Serve como indicador geral e nao substitui aconselhamento profissional.
      </p>
    </div>
  );
}

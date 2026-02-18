"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface LiquidityScoreProps {
  form: {
    idade: number;
    treino: string;
    registoAPSL: boolean;
    competicoes: string;
    saude: string;
    tendencia: string;
  };
  percentil: number;
  liquidez?: { score: number; tempoDias: number; label: string };
}

function computeScore(form: LiquidityScoreProps["form"]): number {
  let score = 0;

  // Age: peak 6-12
  if (form.idade >= 6 && form.idade <= 12) score += 25;
  else if (form.idade >= 4 && form.idade <= 15) score += 15;
  else score += 5;

  // Training level
  const trainingScores: Record<string, number> = {
    potro: 5,
    desbravado: 8,
    iniciado: 12,
    elementar: 18,
    medio: 22,
    avancado: 25,
    alta_escola: 25,
    grand_prix: 25,
  };
  score += trainingScores[form.treino] || 10;

  // APSL registration
  if (form.registoAPSL) score += 20;

  // Competitions
  const compScores: Record<string, number> = {
    nenhuma: 0,
    regional: 5,
    nacional: 10,
    cdi1: 13,
    cdi3: 15,
    cdi5: 15,
    campeonato_mundo: 15,
  };
  score += compScores[form.competicoes] || 0;

  // Health
  const healthScores: Record<string, number> = {
    excelente: 10,
    muito_bom: 8,
    bom: 5,
    regular: 2,
  };
  score += healthScores[form.saude] || 5;

  // Market trend
  if (form.tendencia === "alta") score += 5;
  else if (form.tendencia === "estavel") score += 3;

  return Math.min(score, 100);
}

export default function LiquidityScore({ form, percentil, liquidez }: LiquidityScoreProps) {
  const { t } = useLanguage();
  // Use pre-computed score from Resultado if available (more accurate), else compute locally
  const score = liquidez?.score ?? computeScore(form);
  const [animatedScore, setAnimatedScore] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const hasAnimated = useRef(false);
  // Determine classification
  const getClassification = (val: number) => {
    if (val <= 33) return { label: t.calculadora.liquidity_difficult, color: "#ef4444" };
    if (val <= 66) return { label: t.calculadora.liquidity_moderate, color: "#eab308" };
    return { label: t.calculadora.liquidity_easy, color: "#22c55e" };
  };

  const classification = getClassification(score);

  useEffect(() => {
    if (hasAnimated.current) return;
    const el = svgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const duration = 1600;

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedScore(Math.round(eased * score));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [score]);

  // Semicircular gauge geometry
  const cx = 120;
  const cy = 110;
  const radius = 85;
  const strokeWidth = 12;

  // Arc from 180deg to 0deg (semicircle, left to right)
  const polarToCartesian = (angleDeg: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad),
    };
  };

  const describeArc = (startDeg: number, endDeg: number) => {
    const s = polarToCartesian(startDeg);
    const e = polarToCartesian(endDeg);
    const sweep = startDeg - endDeg;
    const largeArc = Math.abs(sweep) > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  // Zone arcs: Red 180-120, Yellow 120-60, Green 60-0
  const zoneRed = describeArc(180, 120);
  const zoneYellow = describeArc(120, 60);
  const zoneGreen = describeArc(60, 0);

  // Needle angle: score 0 = 180deg, score 100 = 0deg
  const needleAngle = 180 - (animatedScore / 100) * 180;
  const needlePos = polarToCartesian(needleAngle);

  const currentClassification = getClassification(animatedScore);

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)]">
      <h3 className="text-sm font-serif font-semibold text-[var(--foreground)] mb-1">
        {t.calculadora.liquidity_title}
      </h3>
      <p className="text-xs text-[var(--foreground-muted)] mb-4">
        {t.calculadora.liquidity_subtitle}
      </p>

      <div className="flex flex-col items-center">
        <svg
          ref={svgRef}
          viewBox="0 0 240 140"
          width="240"
          height="140"
          className="overflow-visible"
          role="img"
          aria-label={`${t.calculadora.liquidity_title}: ${score}/100 - ${classification.label}`}
        >
          {/* Background track */}
          <path
            d={describeArc(180, 0)}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
          />

          {/* Red zone */}
          <path
            d={zoneRed}
            fill="none"
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            opacity={0.35}
          />
          {/* Yellow zone */}
          <path
            d={zoneYellow}
            fill="none"
            stroke="#eab308"
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            opacity={0.35}
          />
          {/* Green zone */}
          <path
            d={zoneGreen}
            fill="none"
            stroke="#22c55e"
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            opacity={0.35}
          />

          {/* Zone labels */}
          <text x="28" y="118" textAnchor="middle" fill="#ef4444" fontSize="8" opacity={0.7}>
            0
          </text>
          <text x="212" y="118" textAnchor="middle" fill="#22c55e" fontSize="8" opacity={0.7}>
            100
          </text>

          {/* Needle dot */}
          <circle
            cx={needlePos.x}
            cy={needlePos.y}
            r={7}
            fill={currentClassification.color}
            style={{
              filter: `drop-shadow(0 0 6px ${currentClassification.color}80)`,
            }}
          />

          {/* Inner needle line from center to dot */}
          <line
            x1={cx}
            y1={cy}
            x2={needlePos.x}
            y2={needlePos.y}
            stroke={currentClassification.color}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.6}
          />

          {/* Center pivot */}
          <circle cx={cx} cy={cy} r={4} fill="var(--foreground, white)" opacity={0.3} />

          {/* Score value */}
          <text
            x={cx}
            y={cy - 18}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize="28"
            fontWeight="700"
            fontFamily="serif"
          >
            {animatedScore}
          </text>

          {/* "/ 100" below score */}
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(255,255,255,0.4)"
            fontSize="10"
          >
            / 100
          </text>
        </svg>

        {/* Classification label */}
        <div
          className="mt-2 px-4 py-1.5 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: `${classification.color}15`,
            color: classification.color,
          }}
        >
          {classification.label}
        </div>

        {/* Percentile context */}
        <p className="text-[10px] text-[var(--foreground-muted)] mt-2 text-center">
          {t.calculadora.liquidity_percentile_prefix} {percentil}%{" "}
          {t.calculadora.liquidity_percentile_suffix}
        </p>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [style*="transition"] {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}

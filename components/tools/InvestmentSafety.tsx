"use client";

import { useState, useEffect, useRef } from "react";
import { Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { FormData, Resultado } from "@/components/calculadora-valor/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InvestmentSafetyProps {
  form: FormData;
  resultado: Resultado;
}

// ---------------------------------------------------------------------------
// Calculation helpers
// ---------------------------------------------------------------------------

function calcAgeRisk(age: number): number {
  if (age <= 5) return 20;
  if (age <= 12) return 10;
  if (age <= 16) return 40;
  if (age <= 20) return 70;
  return 90;
}

function calcMarketRisk(tendencia: FormData["tendencia"]): number {
  if (tendencia === "baixa") return 70;
  if (tendencia === "estavel") return 40;
  return 15;
}

const TRAINING_PROTECTION: Record<string, number> = {
  potro: 10,
  desbravado: 25,
  iniciado: 40,
  elementar: 55,
  medio: 70,
  avancado: 80,
  alta_escola: 90,
  grand_prix: 95,
};

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// ---------------------------------------------------------------------------
// Mini-gauge sub-component (semicircular arc)
// ---------------------------------------------------------------------------

function MiniGauge({
  value,
  label,
  accent,
  animated,
}: {
  value: number;
  label: string;
  accent?: boolean;
  animated: boolean;
}) {
  const size = accent ? 120 : 100;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.36;
  const strokeW = size * 0.06;

  // Arc geometry: 180-degree semicircle, from 180 deg to 0 deg
  const startAngle = 180;
  const totalSweep = 180;

  const toCart = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy - radius * Math.sin(rad) };
  };

  const arcPath = (fromA: number, toA: number) => {
    const s = toCart(fromA);
    const e = toCart(toA);
    const sweep = fromA - toA;
    const large = sweep > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const displayVal = animated ? value : 0;
  const endAngle = startAngle - (displayVal / 100) * totalSweep;

  // Color coding: <30 red, 30-60 amber, >60 green
  const getColor = (v: number) => {
    if (accent) return "#C5A059";
    if (v > 60) return "#22c55e";
    if (v >= 30) return "#f59e0b";
    return "#ef4444";
  };
  const color = getColor(displayVal);

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={size}
        height={size * 0.58}
        viewBox={`0 0 ${size} ${size * 0.58}`}
        aria-hidden="true"
      >
        {/* Background track */}
        <path
          d={arcPath(startAngle, 0)}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={arcPath(startAngle, endAngle)}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 4px ${color}40)`,
            transition: "d 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        {/* Center value */}
        <text
          x={cx}
          y={cy - size * 0.02}
          textAnchor="middle"
          dominantBaseline="central"
          fill={accent ? "#C5A059" : "white"}
          fontSize={accent ? size * 0.22 : size * 0.2}
          fontWeight="700"
          fontFamily="serif"
        >
          {displayVal}
        </text>
      </svg>
      <span
        className={`text-[10px] font-medium text-center leading-tight ${
          accent ? "text-[var(--gold,#C5A059)]" : "text-[var(--foreground-muted,#71717a)]"
        }`}
        style={{ maxWidth: size }}
      >
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function InvestmentSafety({ form, resultado: _resultado }: InvestmentSafetyProps) {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTimeout(() => setAnimated(true), 200);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // --- Calculations ---
  const ageRisk = calcAgeRisk(form.idade);
  const marketRisk = calcMarketRisk(form.tendencia);
  const trainingProtection = TRAINING_PROTECTION[form.treino] ?? 10;
  const globalScore = clamp(
    Math.round(100 - (ageRisk * 0.3 + marketRisk * 0.3) + trainingProtection * 0.4),
    0,
    100
  );

  // Recommendation text
  const calc = t.calculadora as Record<string, string>;
  let recommendation: string;
  if (globalScore >= 70) {
    recommendation =
      calc.safety_low_risk ??
      "Investimento de baixo risco. Este cavalo apresenta um perfil seguro com boa proteccao de valor a medio prazo.";
  } else if (globalScore >= 40) {
    recommendation =
      calc.safety_moderate_risk ??
      "Risco moderado. Existem factores que podem afectar o valor a medio prazo. Considere estrategias de valorizacao como treino adicional.";
  } else {
    recommendation =
      calc.safety_high_risk ??
      "Risco elevado. Varios factores podem contribuir para depreciacao. Recomenda-se uma avaliacao veterinaria detalhada e plano de treino.";
  }

  return (
    <div
      ref={containerRef}
      className="rounded-xl border border-[var(--border,rgba(255,255,255,0.1))] bg-[var(--background-card,#111)] overflow-hidden"
      role="region"
      aria-label={calc.safety_title ?? "Analise de Seguranca do Investimento"}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border,rgba(255,255,255,0.1))]">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[var(--gold,#C5A059)]/10 flex items-center justify-center">
          <Shield size={18} className="text-[var(--gold,#C5A059)]" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-serif font-semibold text-[var(--foreground,#ededed)]">
            {calc.safety_title ?? "Seguranca do Investimento"}
          </h3>
          <p className="text-xs text-[var(--foreground-muted,#71717a)]">
            {calc.safety_subtitle ?? "Analise de risco e proteccao de valor"}
          </p>
        </div>
      </div>

      {/* 2x2 gauge grid */}
      <div className="grid grid-cols-2 gap-4 px-5 py-6">
        <MiniGauge
          value={animated ? 100 - ageRisk : 0}
          label={calc.safety_age_risk ?? "Risco de Idade"}
          animated={animated}
        />
        <MiniGauge
          value={animated ? 100 - marketRisk : 0}
          label={calc.safety_market_risk ?? "Risco de Mercado"}
          animated={animated}
        />
        <MiniGauge
          value={animated ? trainingProtection : 0}
          label={calc.safety_training ?? "Proteccao de Treino"}
          animated={animated}
        />
        <MiniGauge
          value={animated ? globalScore : 0}
          label={calc.safety_global ?? "Score Global"}
          accent
          animated={animated}
        />
      </div>

      {/* Recommendation text */}
      <div
        className="px-5 pb-5"
        style={{
          opacity: animated ? 1 : 0,
          transform: animated ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.6s ease-out 0.8s, transform 0.6s ease-out 0.8s",
        }}
      >
        <div
          className={`rounded-lg p-3 text-xs leading-relaxed ${
            globalScore >= 70
              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              : globalScore >= 40
                ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                : "bg-red-500/10 text-red-300 border border-red-500/20"
          }`}
        >
          {recommendation}
        </div>
      </div>
    </div>
  );
}

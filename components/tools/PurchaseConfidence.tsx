"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

// ============================================
// TIPOS
// ============================================

interface PurchaseConfidenceCavalo {
  id: string;
  nome: string;
  conformacao: number;
  andamentos: number;
  temperamento: number;
  saude: number;
  blup: number;
  preco: number;
  idade: number;
  registoAPSL: boolean;
}

interface PurchaseConfidenceProps {
  cavalos: PurchaseConfidenceCavalo[];
  vencedorId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  calcularScore: (c: any) => number;
}

// ============================================
// HELPERS
// ============================================

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function getConfidenceColor(v: number): string {
  if (v >= 75) return "#22c55e";
  if (v >= 50) return "#C5A059";
  if (v >= 25) return "#f59e0b";
  return "#ef4444";
}

function getRecommendation(confidence: number): string {
  if (confidence >= 80) {
    return "Elevada confianca na decisao. Os dados indicam uma escolha clara e bem fundamentada. Recomenda-se prosseguir com avaliacao presencial e exame veterinario.";
  }
  if (confidence >= 60) {
    return "Confianca moderada. A analise favorece um candidato, mas existem factores a considerar. Sugere-se uma avaliacao mais aprofundada antes da decisao final.";
  }
  if (confidence >= 40) {
    return "Confianca limitada. Os cavalos apresentam perfis semelhantes ou existem comprometimentos significativos. Considere recolher mais informacao.";
  }
  return "Confianca baixa na decisao. Os dados sao insuficientes ou os candidatos apresentam limitacoes relevantes. Recomenda-se cautela e analise adicional.";
}

// ============================================
// GAUGE SVG (semicircular)
// ============================================

function ConfidenceGauge({ value, size = 200 }: { value: number; size?: number }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const ref = useRef<SVGSVGElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const duration = 1800;

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedValue(Math.round(eased * value));
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
  }, [value]);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const strokeWidth = size * 0.05;

  const startAngle = 225;
  const endAngle = -45;
  const totalSweep = 270;

  const polarToCartesian = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad),
    };
  };

  const describeArc = (startA: number, endA: number) => {
    const start = polarToCartesian(startA);
    const end = polarToCartesian(endA);
    const sweep = startA - endA;
    const largeArc = sweep > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  };

  const valueAngle = startAngle - (animatedValue / 100) * totalSweep;
  const color = getConfidenceColor(animatedValue);

  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={ref}
        width={size}
        height={size * 0.72}
        viewBox={`0 0 ${size} ${size * 0.72}`}
        role="img"
        aria-label={`Confianca de compra: ${value} por cento`}
      >
        {/* Background track */}
        <path
          d={describeArc(startAngle, endAngle)}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Value arc */}
        {animatedValue > 0 && (
          <path
            d={describeArc(startAngle, valueAngle)}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 ${size * 0.03}px ${color}40)` }}
          />
        )}

        {/* Tick marks */}
        {ticks.map((tick) => {
          const angle = startAngle - (tick / 100) * totalSweep;
          const innerR = radius - strokeWidth * 1.2;
          const outerR = radius + strokeWidth * 1.2;
          const inner = {
            x: cx + innerR * Math.cos((angle * Math.PI) / 180),
            y: cy - innerR * Math.sin((angle * Math.PI) / 180),
          };
          const outer = {
            x: cx + outerR * Math.cos((angle * Math.PI) / 180),
            y: cy - outerR * Math.sin((angle * Math.PI) / 180),
          };
          return (
            <line
              key={tick}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Needle dot */}
        {animatedValue > 0 &&
          (() => {
            const needlePos = polarToCartesian(valueAngle);
            return (
              <circle
                cx={needlePos.x}
                cy={needlePos.y}
                r={strokeWidth * 0.8}
                fill={color}
                style={{ filter: `drop-shadow(0 0 ${size * 0.02}px ${color}80)` }}
              />
            );
          })()}

        {/* Center value */}
        <text
          x={cx}
          y={cy - size * 0.04}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={size * 0.18}
          fontWeight="700"
          fontFamily="serif"
        >
          {animatedValue}
        </text>

        {/* Label */}
        <text
          x={cx}
          y={cy + size * 0.1}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.5)"
          fontSize={size * 0.055}
          fontWeight="500"
          letterSpacing="0.1em"
          style={{ textTransform: "uppercase" } as React.CSSProperties}
        >
          CONFIANCA
        </text>
      </svg>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function PurchaseConfidence({
  cavalos,
  vencedorId,
  calcularScore,
}: PurchaseConfidenceProps) {
  const { t } = useLanguage();

  const { confidence, clarity, safety, value } = useMemo(() => {
    const scores = cavalos.map((c) => calcularScore(c));
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    // Decision clarity
    const clarityRaw = maxScore > 0 ? ((maxScore - minScore) / maxScore) * 200 : 0;
    const clarityVal = clamp(Math.round(clarityRaw), 0, 100);

    // Safety based on winner
    const winner = cavalos.find((c) => c.id === vencedorId);
    let safetyVal = 50;
    if (winner) {
      const ageBonus = winner.idade >= 4 && winner.idade <= 14 ? 30 : 10;
      const apslBonus = winner.registoAPSL ? 20 : 0;
      safetyVal = clamp(Math.round(winner.saude * 5 + ageBonus + apslBonus), 0, 100);
    }

    // Value: cost-benefit
    const valueScores = cavalos.map((c) => {
      const s = calcularScore(c);
      return s > 0 ? c.preco / s : Infinity;
    });
    const bestValue = Math.min(...valueScores);
    const winnerScore = winner ? calcularScore(winner) : 0;
    const winnerValueRatio = winner && winnerScore > 0 ? winner.preco / winnerScore : Infinity;
    const valueVal =
      winnerValueRatio > 0 && winnerValueRatio !== Infinity
        ? clamp(Math.round((bestValue / winnerValueRatio) * 100), 0, 100)
        : 50;

    // Global confidence
    const confidenceVal = Math.round(clarityVal * 0.35 + safetyVal * 0.35 + valueVal * 0.3);

    return {
      confidence: clamp(confidenceVal, 0, 100),
      clarity: clarityVal,
      safety: safetyVal,
      value: valueVal,
    };
  }, [cavalos, vencedorId, calcularScore]);

  const title = (t.comparador as Record<string, string>).confidence_title ?? "Confianca de Compra";

  const subIndicators = [
    { label: "Clareza da Decisao", value: clarity, color: "#3b82f6" },
    { label: "Seguranca", value: safety, color: "#22c55e" },
    { label: "Valor", value: value, color: "#f59e0b" },
  ];

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-2xl p-6 border border-[var(--border)]">
      <h3 className="text-lg font-serif mb-6 text-[var(--foreground)]">{title}</h3>

      {/* Main gauge */}
      <ConfidenceGauge value={confidence} size={200} />

      {/* Sub-indicators */}
      <div className="space-y-3 mt-6">
        {subIndicators.map(({ label, value: val, color }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[var(--foreground-secondary)]">{label}</span>
              <span className="text-xs font-semibold tabular-nums" style={{ color }}>
                {val}%
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${val}%`,
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}40`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation text */}
      <div className="mt-6 p-4 bg-[var(--background-card)] rounded-xl border border-[var(--border)]">
        <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
          {getRecommendation(confidence)}
        </p>
      </div>
    </div>
  );
}

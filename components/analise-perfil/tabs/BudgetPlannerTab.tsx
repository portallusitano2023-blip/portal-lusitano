"use client";

import { useEffect, useRef, useState, useId, useMemo, useCallback } from "react";
import {
  Home,
  Apple,
  Stethoscope,
  Hammer,
  GraduationCap,
  Shield,
  Trophy,
  Wrench,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

// ============================================
// TYPES
// ============================================

interface BudgetCategory {
  label: string;
  monthly: number;
  color: string;
  icon: string;
}

interface BudgetPlannerTabProps {
  categories: BudgetCategory[];
  profileName: string;
}

// ============================================
// ICON MAP
// ============================================

type LucideIcon = React.ComponentType<{
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}>;

const ICON_MAP: Record<string, LucideIcon> = {
  Home,
  Apple,
  Stethoscope,
  Hammer,
  GraduationCap,
  Shield,
  Trophy,
  Wrench,
};

// ============================================
// CURRENCY FORMATTER
// ============================================

function formatEUR(value: number): string {
  return value.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// ============================================
// DONUT CHART (pure SVG)
// ============================================

interface DonutChartProps {
  categories: BudgetCategory[];
  total: number;
  visible: boolean;
  idPrefix: string;
}

function DonutChart({ categories, total, visible, idPrefix }: DonutChartProps) {
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const size = 220;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Precompute cumulative offsets to avoid mutable variable in render
  const offsets = categories.reduce<number[]>((acc, cat, i) => {
    const prev =
      i === 0
        ? 0
        : acc[i - 1] + (total > 0 ? categories[i - 1].monthly / total : 0) * circumference;
    acc.push(prev);
    return acc;
  }, []);

  return (
    <div
      className="relative flex items-center justify-center"
      role="img"
      aria-label={tr(
        "Distribuição de custos mensais",
        "Monthly cost distribution",
        "Distribución de costes mensuales"
      )}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
          opacity={0.3}
        />

        {/* Category segments */}
        {categories.map((cat, i) => {
          const percentage = total > 0 ? cat.monthly / total : 0;
          const segmentLength = percentage * circumference;
          const gap = categories.length > 1 ? 3 : 0;
          const adjustedLength = Math.max(0, segmentLength - gap);
          const offset = offsets[i];

          return (
            <circle
              key={`${idPrefix}-segment-${i}`}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={cat.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${adjustedLength} ${circumference - adjustedLength}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity 0.6s ease-out ${i * 100}ms, stroke-dasharray 0.8s ease-out ${i * 100}ms`,
              }}
            />
          );
        })}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs uppercase tracking-wider text-[var(--foreground-muted)]">
          {tr("Mensal", "Monthly", "Mensual")}
        </span>
        <span
          className="text-2xl font-serif font-bold text-[var(--foreground)] mt-1"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.8)",
            transition: "opacity 0.5s ease-out 0.3s, transform 0.5s ease-out 0.3s",
          }}
        >
          {formatEUR(total)}
        </span>
      </div>
    </div>
  );
}

// ============================================
// ANNUAL PROJECTION BAR CHART (pure SVG)
// ============================================

interface AnnualProjectionProps {
  categories: BudgetCategory[];
  totalMonthly: number;
  visible: boolean;
  idPrefix: string;
}

function AnnualProjection({ totalMonthly, visible, idPrefix }: AnnualProjectionProps) {
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const months = tr(
    ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  );

  const annualTotal = totalMonthly * 12;
  const chartWidth = 600;
  const chartHeight = 200;
  const paddingLeft = 55;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 30;
  const usableWidth = chartWidth - paddingLeft - paddingRight;
  const usableHeight = chartHeight - paddingTop - paddingBottom;
  const barWidth = usableWidth / 12;

  // Y-axis scale: max is annual total with some headroom
  const yMax = annualTotal * 1.1;

  // Cumulative line points
  const cumulativePoints = months.map((_, i) => {
    const cumulative = totalMonthly * (i + 1);
    const x = paddingLeft + barWidth * i + barWidth / 2;
    const y = paddingTop + usableHeight - (cumulative / yMax) * usableHeight;
    return { x, y, cumulative };
  });

  const polylinePoints = cumulativePoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Y-axis gridlines
  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
    const value = (yMax / gridCount) * i;
    const y = paddingTop + usableHeight - (value / yMax) * usableHeight;
    return { value, y };
  });

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full min-w-[400px]"
        role="img"
        aria-label={tr(
          "Projeção anual de custos",
          "Annual cost projection",
          "Proyección anual de costes"
        )}
      >
        <defs>
          <linearGradient id={`${idPrefix}-bar-grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-line-grad`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <g key={`${idPrefix}-grid-${i}`}>
            <line
              x1={paddingLeft}
              y1={line.y}
              x2={chartWidth - paddingRight}
              y2={line.y}
              stroke="var(--border)"
              strokeWidth={0.5}
              opacity={0.4}
            />
            <text
              x={paddingLeft - 8}
              y={line.y + 4}
              textAnchor="end"
              className="text-[9px]"
              fill="var(--foreground-muted)"
            >
              {line.value >= 1000
                ? `${(line.value / 1000).toLocaleString("pt-PT", { maximumFractionDigits: 1 })}k`
                : Math.round(line.value).toString()}
            </text>
          </g>
        ))}

        {/* Monthly bars */}
        {months.map((month, i) => {
          const barHeight = (totalMonthly / yMax) * usableHeight;
          const x = paddingLeft + barWidth * i + barWidth * 0.15;
          const y = paddingTop + usableHeight - barHeight;
          const w = barWidth * 0.7;

          return (
            <g key={`${idPrefix}-bar-${i}`}>
              <rect
                x={x}
                y={visible ? y : paddingTop + usableHeight}
                width={w}
                height={visible ? barHeight : 0}
                rx={3}
                fill={`url(#${idPrefix}-bar-grad)`}
                style={{
                  transition: `y 0.6s ease-out ${i * 50}ms, height 0.6s ease-out ${i * 50}ms`,
                }}
              />
              <text
                x={paddingLeft + barWidth * i + barWidth / 2}
                y={chartHeight - 8}
                textAnchor="middle"
                className="text-[9px]"
                fill="var(--foreground-muted)"
              >
                {month}
              </text>
            </g>
          );
        })}

        {/* Cumulative line */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={`url(#${idPrefix}-line-grad)`}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease-out 0.6s",
          }}
        />

        {/* Cumulative dots */}
        {cumulativePoints.map((point, i) => (
          <circle
            key={`${idPrefix}-dot-${i}`}
            cx={point.x}
            cy={point.y}
            r={3}
            fill="var(--gold)"
            style={{
              opacity: visible ? 1 : 0,
              transition: `opacity 0.4s ease-out ${0.6 + i * 0.05}s`,
            }}
          />
        ))}

        {/* End label for cumulative */}
        {cumulativePoints.length > 0 && (
          <text
            x={cumulativePoints[cumulativePoints.length - 1].x + 4}
            y={cumulativePoints[cumulativePoints.length - 1].y - 8}
            className="text-[10px] font-semibold"
            fill="var(--gold)"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease-out 1.2s",
            }}
          >
            {formatEUR(annualTotal)}
          </text>
        )}
      </svg>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function BudgetPlannerTab({ categories, profileName }: BudgetPlannerTabProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [barsAnimated, setBarsAnimated] = useState(false);
  const uniqueId = useId();
  const idPrefix = uniqueId.replace(/:/g, "");

  // IntersectionObserver for animated reveal
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Stagger the bar animations slightly after the initial reveal
          const timer = setTimeout(() => setBarsAnimated(true), 300);
          observer.disconnect();
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Computed values
  const totalMonthly = useMemo(
    () => categories.reduce((sum, cat) => sum + cat.monthly, 0),
    [categories]
  );

  const totalAnnual = totalMonthly * 12;

  const maxMonthly = useMemo(() => Math.max(...categories.map((c) => c.monthly), 1), [categories]);

  const getIcon = useCallback((iconName: string) => {
    return ICON_MAP[iconName] || Home;
  }, []);

  return (
    <div ref={containerRef} className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      {/* ---- SUMMARY HEADER ---- */}
      <div className="bg-gradient-to-b from-[var(--gold)]/10 to-transparent border border-[var(--gold)]/20 p-8">
        <div className="text-center mb-2">
          <span className="text-xs uppercase tracking-widest text-[var(--foreground-muted)]">
            Planeamento de Custos &mdash; Perfil {profileName}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          {/* Total Mensal */}
          <div
            className="text-center p-6 bg-[var(--background-secondary)]/50 border border-[var(--border)]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            <Calendar className="mx-auto text-[var(--gold)] mb-3" size={24} />
            <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-2">
              Total Mensal
            </p>
            <p className="text-4xl font-serif font-bold text-[var(--foreground)]">
              {formatEUR(totalMonthly)}
            </p>
          </div>

          {/* Total Anual */}
          <div
            className="text-center p-6 bg-[var(--background-secondary)]/50 border border-[var(--border)]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s ease-out 0.15s, transform 0.5s ease-out 0.15s",
            }}
          >
            <TrendingUp className="mx-auto text-[var(--gold)] mb-3" size={24} />
            <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-2">
              Total Anual
            </p>
            <p className="text-4xl font-serif font-bold text-[var(--gold)]">
              {formatEUR(totalAnnual)}
            </p>
          </div>
        </div>
      </div>

      {/* ---- DONUT CHART + CATEGORY BREAKDOWN ---- */}
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-8">
          <span className="w-2 h-2 rounded-full bg-[var(--gold)]" aria-hidden="true" />
          Distribuicao de Custos
        </h3>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
          {/* Donut chart */}
          <div className="flex-shrink-0">
            <DonutChart
              categories={categories}
              total={totalMonthly}
              visible={visible}
              idPrefix={idPrefix}
            />
            {/* Legend below donut on mobile, beside on desktop handled by flex */}
            <div className="flex flex-wrap justify-center gap-3 mt-6 lg:max-w-[220px]">
              {categories.map((cat, i) => (
                <div
                  key={`${idPrefix}-legend-${i}`}
                  className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                    aria-hidden="true"
                  />
                  {cat.label}
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown list */}
          <div className="flex-1 w-full space-y-3">
            {categories.map((cat, i) => {
              const IconComponent = getIcon(cat.icon);
              const percentage =
                totalMonthly > 0 ? ((cat.monthly / totalMonthly) * 100).toFixed(1) : "0.0";
              const barWidth = totalMonthly > 0 ? (cat.monthly / maxMonthly) * 100 : 0;

              return (
                <div
                  key={`${idPrefix}-cat-${i}`}
                  className="group"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateX(0)" : "translateX(-12px)",
                    transition: `opacity 0.4s ease-out ${i * 80}ms, transform 0.4s ease-out ${i * 80}ms`,
                  }}
                >
                  {/* Row: icon, label, value, percentage */}
                  <div className="flex items-center gap-3 mb-1.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <IconComponent size={16} style={{ color: cat.color }} />
                    </div>
                    <span className="text-sm font-medium text-[var(--foreground)] flex-1 min-w-0 truncate">
                      {cat.label}
                    </span>
                    <span className="text-sm font-serif font-bold text-[var(--foreground)] tabular-nums whitespace-nowrap">
                      {formatEUR(cat.monthly)}
                    </span>
                    <span className="text-xs text-[var(--foreground-muted)] tabular-nums w-12 text-right whitespace-nowrap">
                      {percentage}%
                    </span>
                  </div>

                  {/* Animated horizontal bar */}
                  <div className="ml-11 h-1.5 bg-[var(--background-card)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: cat.color,
                        width: barsAnimated ? `${barWidth}%` : "0%",
                        transition: `width 0.8s ease-out ${i * 80}ms`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---- ANNUAL PROJECTION ---- */}
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-2">
          <TrendingUp className="text-[var(--gold)]" size={20} />
          Projecao Anual
        </h3>
        <p className="text-xs text-[var(--foreground-muted)] mb-6">
          Custo mensal fixo de {formatEUR(totalMonthly)} com linha cumulativa ao longo do ano
        </p>

        <AnnualProjection
          categories={categories}
          totalMonthly={totalMonthly}
          visible={visible}
          idPrefix={idPrefix}
        />

        {/* Summary row beneath chart */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[var(--border)]">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
              Custo/Dia
            </p>
            <p className="text-lg font-serif font-bold text-[var(--foreground)]">
              {formatEUR(Math.round(totalAnnual / 365))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
              Custo/Semana
            </p>
            <p className="text-lg font-serif font-bold text-[var(--foreground)]">
              {formatEUR(Math.round(totalAnnual / 52))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-[var(--foreground-muted)] mb-1">
              Custo/Trimestre
            </p>
            <p className="text-lg font-serif font-bold text-[var(--foreground)]">
              {formatEUR(Math.round(totalAnnual / 4))}
            </p>
          </div>
        </div>
      </div>

      {/* ---- FOOTER NOTE ---- */}
      <p className="text-[11px] text-[var(--foreground-muted)]/60 leading-relaxed text-center">
        Valores estimados para o perfil {profileName}. Os custos reais podem variar conforme a
        regiao, prestador de servicos e necessidades especificas do cavalo.
      </p>
    </div>
  );
}

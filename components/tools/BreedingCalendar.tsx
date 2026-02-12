"use client";

import { useState, useEffect, useRef, useId, useCallback } from "react";

interface BreedingCalendarProps {
  currentMonth?: number; // 1-12, defaults to current month
}

// ── Milestone definitions ──────────────────────────────────────────────
// Each milestone is defined relative to a breeding event in March (month 3).
// offsets are in months from the breeding month.
interface Milestone {
  key: string;
  label: string;
  sublabel: string;
  offsetMonths: number; // months after breeding start
  durationMonths?: number; // span length (if range)
  icon: "heart" | "clock" | "star" | "leaf" | "hand" | "horse";
}

const MILESTONES: Milestone[] = [
  {
    key: "cobricao",
    label: "Epoca de Cobricao",
    sublabel: "Marco a Junho",
    offsetMonths: 0,
    durationMonths: 4,
    icon: "heart",
  },
  {
    key: "gestacao",
    label: "Gestacao",
    sublabel: "11 meses",
    offsetMonths: 0,
    durationMonths: 11,
    icon: "clock",
  },
  {
    key: "nascimento",
    label: "Nascimento Estimado",
    sublabel: "Fev do ano seguinte",
    offsetMonths: 11,
    icon: "star",
  },
  {
    key: "desmame",
    label: "Desmame",
    sublabel: "6 meses apos nascimento",
    offsetMonths: 17,
    icon: "leaf",
  },
  {
    key: "manipulacao",
    label: "Primeira Manipulacao",
    sublabel: "12 meses apos nascimento",
    offsetMonths: 23,
    icon: "hand",
  },
  {
    key: "desbaste",
    label: "Inicio Desbaste",
    sublabel: "3 anos apos nascimento",
    offsetMonths: 47,
    icon: "horse",
  },
];

// ── Month helpers ──────────────────────────────────────────────────────

const MONTH_NAMES_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function getMonthLabel(breedingMonth: number, offsetMonths: number): string {
  const m = ((breedingMonth - 1 + offsetMonths) % 12) + 1;
  return MONTH_NAMES_PT[m - 1];
}

function getYearOffset(breedingMonth: number, offsetMonths: number): number {
  return Math.floor((breedingMonth - 1 + offsetMonths) / 12);
}

// ── SVG Icon components (simple shapes, no lucide) ─────────────────────

function MilestoneIcon({
  type,
  x,
  y,
  size,
  color,
}: {
  type: Milestone["icon"];
  x: number;
  y: number;
  size: number;
  color: string;
}) {
  const r = size / 2;

  switch (type) {
    case "heart":
      return (
        <g transform={`translate(${x - r}, ${y - r}) scale(${size / 24})`}>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill={color}
            opacity={0.9}
          />
        </g>
      );
    case "clock":
      return (
        <g transform={`translate(${x}, ${y})`}>
          <circle cx={0} cy={0} r={r * 0.85} fill="none" stroke={color} strokeWidth={1.5} />
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={-r * 0.5}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <line
            x1={0}
            y1={0}
            x2={r * 0.35}
            y2={0}
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <circle cx={0} cy={0} r={1} fill={color} />
        </g>
      );
    case "star":
      return (
        <g transform={`translate(${x}, ${y})`}>
          <polygon
            points={Array.from({ length: 5 }, (_, i) => {
              const angle = (i * 72 - 90) * (Math.PI / 180);
              const outerR = r * 0.9;
              return `${Math.cos(angle) * outerR},${Math.sin(angle) * outerR}`;
            })
              .flatMap((outer, i) => {
                const innerAngle = (i * 72 + 36 - 90) * (Math.PI / 180);
                const innerR = r * 0.4;
                return [outer, `${Math.cos(innerAngle) * innerR},${Math.sin(innerAngle) * innerR}`];
              })
              .join(" ")}
            fill={color}
            opacity={0.9}
          />
        </g>
      );
    case "leaf":
      return (
        <g transform={`translate(${x - r}, ${y - r}) scale(${size / 24})`}>
          <path
            d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"
            fill="none"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    case "hand":
      return (
        <g transform={`translate(${x}, ${y})`}>
          <circle cx={0} cy={r * 0.1} r={r * 0.85} fill="none" stroke={color} strokeWidth={1.5} />
          <line
            x1={-r * 0.3}
            y1={r * 0.35}
            x2={-r * 0.3}
            y2={-r * 0.15}
            stroke={color}
            strokeWidth={1.2}
            strokeLinecap="round"
          />
          <line
            x1={0}
            y1={r * 0.35}
            x2={0}
            y2={-r * 0.3}
            stroke={color}
            strokeWidth={1.2}
            strokeLinecap="round"
          />
          <line
            x1={r * 0.3}
            y1={r * 0.35}
            x2={r * 0.3}
            y2={-r * 0.15}
            stroke={color}
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        </g>
      );
    case "horse":
      return (
        <g transform={`translate(${x - r}, ${y - r}) scale(${size / 24})`}>
          <path
            d="M22 3s-3 1-5 1c-2.5 0-4 1.5-5 3L9 10l-2 1-3 3v3h2l2-2 1 1v4h2v-4l3-1 2-3c1.5-.5 3-2 4-3.5L22 3z"
            fill="none"
            stroke={color}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      );
    default:
      return <circle cx={x} cy={y} r={r * 0.6} fill={color} />;
  }
}

// ── Determine current phase ────────────────────────────────────────────

interface PhaseInfo {
  label: string;
  description: string;
  activeKeys: string[];
}

function getCurrentPhase(month: number): PhaseInfo {
  // Breeding season: Mar(3) - Jun(6)
  if (month >= 1 && month <= 2) {
    return {
      label: "Preparacao",
      description: "Preparacao para a epoca de cobricao",
      activeKeys: [],
    };
  }
  if (month >= 3 && month <= 6) {
    return {
      label: "Epoca de Cobricao - Em Curso",
      description: `${MONTH_NAMES_PT[month - 1]} - periodo ativo de cobricao`,
      activeKeys: ["cobricao", "gestacao"],
    };
  }
  if (month >= 7 && month <= 12) {
    return {
      label: "Gestacao em Curso",
      description: "Eguas em gestacao (11 meses)",
      activeKeys: ["gestacao"],
    };
  }
  return { label: "", description: "", activeKeys: [] };
}

// ── Main Component ─────────────────────────────────────────────────────

export default function BreedingCalendar({ currentMonth }: BreedingCalendarProps) {
  const resolvedMonth = currentMonth ?? new Date().getMonth() + 1;
  const [animated, setAnimated] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const uid = useId();

  // IntersectionObserver for scroll-triggered reveal
  useEffect(() => {
    if (hasAnimated.current) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTimeout(() => setAnimated(true), 150);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const phase = getCurrentPhase(resolvedMonth);

  // ── SVG Layout constants ─────────────────────────────────────────────
  // The timeline spans 48 months (4 years) to accommodate all milestones.
  const totalMonths = 48;
  const viewW = 900;
  const viewH = 380;
  const padLeft = 30;
  const padRight = 30;
  const padTop = 70;
  const timelineY = padTop + 40;
  const chartW = viewW - padLeft - padRight;

  // Convert month offset to x position
  const monthToX = useCallback(
    (offset: number) => padLeft + (offset / totalMonths) * chartW,
    [padLeft, chartW]
  );

  // Gradient + filter IDs
  const gradBg = `bg-grad-${uid}`;
  const gradGold = `gold-grad-${uid}`;
  const glowFilter = `glow-${uid}`;
  const pulseGlow = `pulse-glow-${uid}`;

  // ── Milestone layout: place them on alternating rows ─────────────────
  const rowHeight = 52;
  const milestonePositions = MILESTONES.map((m, i) => {
    const x = monthToX(m.offsetMonths + (m.durationMonths ? m.durationMonths / 2 : 0));
    const rowIndex = i % 2 === 0 ? 0 : 1;
    const y = timelineY + 36 + rowIndex * rowHeight;
    return { ...m, x, y, rowIndex };
  });

  // ── Year markers ─────────────────────────────────────────────────────
  const breedingYear = new Date().getFullYear();
  const yearMarkers: { label: string; x: number }[] = [];
  for (let yr = 0; yr <= 3; yr++) {
    const monthOffset = yr * 12 - (3 - 1); // Relative to March start (month 3 = offset 0)
    // We just mark each 12-month boundary from breeding start
    if (yr * 12 <= totalMonths) {
      yearMarkers.push({
        label: `${breedingYear + yr}`,
        x: monthToX(yr * 12),
      });
    }
  }

  // ── Current month marker ─────────────────────────────────────────────
  // Where the current month falls relative to the breeding start (March)
  const monthsFromBreeding = resolvedMonth >= 3 ? resolvedMonth - 3 : resolvedMonth + 9;
  const currentX = monthToX(monthsFromBreeding);
  const showCurrentMarker = monthsFromBreeding >= 0 && monthsFromBreeding <= totalMonths;

  // ── Range bars for milestones with duration ──────────────────────────
  const rangeBars = MILESTONES.filter((m) => m.durationMonths).map((m) => ({
    key: m.key,
    x1: monthToX(m.offsetMonths),
    x2: monthToX(m.offsetMonths + (m.durationMonths ?? 0)),
    y: timelineY,
  }));

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{
        background: "var(--background-card, #111111)",
        border: "1px solid var(--border, rgba(255,255,255,0.1))",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px 0",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--foreground, #ffffff)",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          Calendario de Criacao
        </h3>

        {/* Phase badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(6px)",
            transition: "all 0.5s ease 0.3s",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background:
                phase.activeKeys.length > 0
                  ? "var(--gold, #C5A059)"
                  : "var(--foreground-muted, #71717a)",
              boxShadow: phase.activeKeys.length > 0 ? "0 0 8px rgba(197,160,89,0.4)" : "none",
            }}
          />
          <span
            style={{
              fontSize: "13px",
              color: "var(--foreground-secondary, #a1a1aa)",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {phase.label || `Mes atual: ${MONTH_NAMES_PT[resolvedMonth - 1]}`}
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "var(--foreground-muted, #71717a)",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {phase.description}
          </span>
        </div>
      </div>

      {/* SVG Timeline */}
      <div style={{ padding: "8px 0 16px", overflowX: "auto", overflowY: "hidden" }}>
        <svg
          viewBox={`0 0 ${viewW} ${viewH}`}
          width="100%"
          height="auto"
          style={{ minWidth: "600px", display: "block" }}
          role="img"
          aria-label="Calendario de criacao de cavalos Lusitanos mostrando marcos desde a cobricao ate ao desbaste"
        >
          <defs>
            {/* Background gradient for range bars */}
            <linearGradient id={gradBg} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--gold, #C5A059)" stopOpacity={0.08} />
              <stop offset="50%" stopColor="var(--gold, #C5A059)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--gold, #C5A059)" stopOpacity={0.08} />
            </linearGradient>

            {/* Gold accent gradient */}
            <linearGradient id={gradGold} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--gold, #C5A059)" stopOpacity={0.6} />
              <stop offset="100%" stopColor="var(--gold, #C5A059)" stopOpacity={1} />
            </linearGradient>

            {/* Glow filter for active elements */}
            <filter id={glowFilter} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Pulse glow for current marker */}
            <filter id={pulseGlow} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Month ticks along timeline ─────────────────────────── */}
          {Array.from({ length: Math.min(totalMonths + 1, 49) }, (_, i) => {
            const x = monthToX(i);
            const isYearBoundary = i % 12 === 0;
            const monthIndex = (3 - 1 + i) % 12; // Starting from March
            const showLabel = i % 3 === 0 && i <= totalMonths;
            return (
              <g key={`tick-${i}`}>
                <line
                  x1={x}
                  y1={timelineY - (isYearBoundary ? 8 : 4)}
                  x2={x}
                  y2={timelineY + (isYearBoundary ? 8 : 4)}
                  stroke={
                    isYearBoundary
                      ? "var(--foreground-muted, #71717a)"
                      : "var(--border, rgba(255,255,255,0.1))"
                  }
                  strokeWidth={isYearBoundary ? 1 : 0.5}
                  opacity={animated ? 1 : 0}
                  style={{
                    transition: `opacity 0.3s ease ${0.05 * i}s`,
                  }}
                />
                {showLabel && (
                  <text
                    x={x}
                    y={timelineY - 14}
                    textAnchor="middle"
                    fill="var(--foreground-muted, #71717a)"
                    fontSize={9}
                    fontFamily="system-ui, sans-serif"
                    opacity={animated ? 0.7 : 0}
                    style={{
                      transition: `opacity 0.4s ease ${0.05 * i + 0.2}s`,
                    }}
                  >
                    {MONTH_NAMES_PT[monthIndex]}
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Year labels ────────────────────────────────────────── */}
          {yearMarkers.map((ym, i) => (
            <text
              key={`year-${i}`}
              x={ym.x}
              y={timelineY - 28}
              textAnchor="middle"
              fill="var(--foreground-secondary, #a1a1aa)"
              fontSize={10}
              fontWeight={600}
              fontFamily="system-ui, sans-serif"
              opacity={animated ? 1 : 0}
              style={{
                transition: `opacity 0.5s ease ${0.3 + i * 0.15}s`,
              }}
            >
              {ym.label}
            </text>
          ))}

          {/* ── Main timeline axis ─────────────────────────────────── */}
          <line
            x1={padLeft}
            y1={timelineY}
            x2={animated ? viewW - padRight : padLeft}
            y2={timelineY}
            stroke="var(--border, rgba(255,255,255,0.1))"
            strokeWidth={1}
            style={{
              transition: "x2 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />

          {/* ── Range bars (breeding season & gestation) ───────────── */}
          {rangeBars.map((bar, i) => {
            const isHovered = hoveredKey === bar.key;
            const isActive = phase.activeKeys.includes(bar.key);
            const barY = timelineY - 3 + i * 10;
            return (
              <g key={`bar-${bar.key}`}>
                <rect
                  x={bar.x1}
                  y={barY}
                  width={animated ? bar.x2 - bar.x1 : 0}
                  height={6}
                  rx={3}
                  fill={`url(#${gradBg})`}
                  stroke={
                    isActive || isHovered
                      ? "var(--gold, #C5A059)"
                      : "var(--border, rgba(255,255,255,0.1))"
                  }
                  strokeWidth={0.5}
                  opacity={animated ? (isActive ? 1 : 0.6) : 0}
                  style={{
                    transition: `width 1s cubic-bezier(0.22, 1, 0.36, 1) ${0.4 + i * 0.15}s, opacity 0.5s ease ${0.4 + i * 0.15}s, stroke 0.3s ease`,
                  }}
                />
                {/* Gold fill inside bar showing progress for active */}
                {isActive && (
                  <rect
                    x={bar.x1}
                    y={barY}
                    width={animated ? Math.min(currentX - bar.x1, bar.x2 - bar.x1) : 0}
                    height={6}
                    rx={3}
                    fill="var(--gold, #C5A059)"
                    opacity={0.3}
                    style={{
                      transition: `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${0.6 + i * 0.15}s`,
                    }}
                  />
                )}
              </g>
            );
          })}

          {/* ── Current month indicator ─────────────────────────────── */}
          {showCurrentMarker && (
            <g opacity={animated ? 1 : 0} style={{ transition: "opacity 0.6s ease 1s" }}>
              {/* Vertical dashed line */}
              <line
                x1={currentX}
                y1={timelineY - 8}
                x2={currentX}
                y2={timelineY + 16 + 2 * rowHeight}
                stroke="var(--gold, #C5A059)"
                strokeWidth={1}
                strokeDasharray="4 3"
                opacity={0.4}
              />
              {/* Pulsing dot on timeline */}
              <circle
                cx={currentX}
                cy={timelineY}
                r={5}
                fill="var(--gold, #C5A059)"
                filter={`url(#${pulseGlow})`}
              >
                <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
                <animate
                  attributeName="opacity"
                  values="1;0.6;1"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* "Hoje" label */}
              <text
                x={currentX}
                y={timelineY + 16 + 2 * rowHeight + 14}
                textAnchor="middle"
                fill="var(--gold, #C5A059)"
                fontSize={10}
                fontWeight={600}
                fontFamily="system-ui, sans-serif"
                letterSpacing="0.05em"
              >
                Hoje
              </text>
            </g>
          )}

          {/* ── Milestone nodes ─────────────────────────────────────── */}
          {milestonePositions.map((m, i) => {
            const isActive = phase.activeKeys.includes(m.key);
            const isHovered = hoveredKey === m.key;
            const nodeX = monthToX(m.offsetMonths);
            const iconSize = 16;

            // Connector line from timeline to node
            const connectorTopY = timelineY + 8;
            const connectorBottomY = m.y - 18;

            return (
              <g
                key={m.key}
                opacity={animated ? 1 : 0}
                style={{
                  transition: `opacity 0.5s ease ${0.5 + i * 0.12}s`,
                  cursor: "default",
                }}
                onMouseEnter={() => setHoveredKey(m.key)}
                onMouseLeave={() => setHoveredKey(null)}
                role="group"
                aria-label={`${m.label}: ${m.sublabel}`}
              >
                {/* Connector line from axis to milestone */}
                <line
                  x1={nodeX}
                  y1={connectorTopY}
                  x2={nodeX}
                  y2={connectorBottomY}
                  stroke={
                    isActive || isHovered
                      ? "var(--gold, #C5A059)"
                      : "var(--border, rgba(255,255,255,0.1))"
                  }
                  strokeWidth={isActive ? 1.5 : 1}
                  strokeDasharray={isActive ? "none" : "3 3"}
                  opacity={isActive || isHovered ? 0.8 : 0.4}
                  style={{ transition: "all 0.3s ease" }}
                />

                {/* Dot on timeline axis */}
                <circle
                  cx={nodeX}
                  cy={timelineY}
                  r={isActive || isHovered ? 4 : 3}
                  fill={isActive ? "var(--gold, #C5A059)" : "var(--background-card, #111111)"}
                  stroke={
                    isActive || isHovered
                      ? "var(--gold, #C5A059)"
                      : "var(--foreground-muted, #71717a)"
                  }
                  strokeWidth={1.5}
                  style={{ transition: "all 0.3s ease" }}
                />

                {/* Icon */}
                <MilestoneIcon
                  type={m.icon}
                  x={nodeX}
                  y={m.y - 6}
                  size={iconSize}
                  color={
                    isActive || isHovered
                      ? "var(--gold, #C5A059)"
                      : "var(--foreground-muted, #71717a)"
                  }
                />

                {/* Label */}
                <text
                  x={nodeX}
                  y={m.y + 12}
                  textAnchor="middle"
                  fill={
                    isActive || isHovered
                      ? "var(--gold, #C5A059)"
                      : "var(--foreground-secondary, #a1a1aa)"
                  }
                  fontSize={10.5}
                  fontWeight={isActive ? 600 : 500}
                  fontFamily="system-ui, sans-serif"
                  style={{ transition: "fill 0.3s ease" }}
                >
                  {m.label}
                </text>

                {/* Sublabel */}
                <text
                  x={nodeX}
                  y={m.y + 25}
                  textAnchor="middle"
                  fill="var(--foreground-muted, #71717a)"
                  fontSize={9}
                  fontFamily="system-ui, sans-serif"
                >
                  {m.sublabel}
                </text>

                {/* Date estimate */}
                <text
                  x={nodeX}
                  y={m.y + 37}
                  textAnchor="middle"
                  fill={isActive ? "var(--gold, #C5A059)" : "var(--foreground-muted, #71717a)"}
                  fontSize={9}
                  fontWeight={isActive ? 600 : 400}
                  fontFamily="system-ui, sans-serif"
                  opacity={0.7}
                >
                  {m.durationMonths
                    ? `${getMonthLabel(3, m.offsetMonths)} - ${getMonthLabel(3, m.offsetMonths + m.durationMonths)}`
                    : `${getMonthLabel(3, m.offsetMonths)} ${breedingYear + getYearOffset(3, m.offsetMonths)}`}
                </text>

                {/* Active badge glow */}
                {isActive && (
                  <circle
                    cx={nodeX}
                    cy={m.y - 6}
                    r={14}
                    fill="none"
                    stroke="var(--gold, #C5A059)"
                    strokeWidth={1}
                    opacity={0.2}
                    filter={`url(#${glowFilter})`}
                  >
                    <animate
                      attributeName="r"
                      values="12;16;12"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.2;0.08;0.2"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Legend / Mobile-friendly milestone list ────────────────── */}
      <div
        style={{
          padding: "0 24px 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "10px",
        }}
      >
        {MILESTONES.map((m, i) => {
          const isActive = phase.activeKeys.includes(m.key);
          const isHovered = hoveredKey === m.key;
          return (
            <div
              key={m.key}
              onMouseEnter={() => setHoveredKey(m.key)}
              onMouseLeave={() => setHoveredKey(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                border: `1px solid ${
                  isActive
                    ? "var(--gold, #C5A059)"
                    : isHovered
                      ? "var(--border-hover, rgba(255,255,255,0.2))"
                      : "var(--border, rgba(255,255,255,0.1))"
                }`,
                background: isActive
                  ? "rgba(197,160,89,0.06)"
                  : "var(--background-secondary, #0a0a0a)",
                opacity: animated ? 1 : 0,
                transform: animated ? "translateY(0)" : "translateY(8px)",
                transition: `all 0.4s ease ${0.6 + i * 0.08}s, border-color 0.3s ease, background 0.3s ease`,
                cursor: "default",
              }}
            >
              {/* Step number */}
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "system-ui, sans-serif",
                  color: isActive ? "#000" : "var(--foreground-muted, #71717a)",
                  background: isActive
                    ? "var(--gold, #C5A059)"
                    : "var(--border, rgba(255,255,255,0.1))",
                  flexShrink: 0,
                  transition: "all 0.3s ease",
                }}
              >
                {i + 1}
              </div>

              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: isActive
                      ? "var(--gold, #C5A059)"
                      : "var(--foreground-secondary, #a1a1aa)",
                    fontFamily: "system-ui, sans-serif",
                    lineHeight: 1.3,
                    transition: "color 0.3s ease",
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--foreground-muted, #71717a)",
                    fontFamily: "system-ui, sans-serif",
                    lineHeight: 1.3,
                    marginTop: "2px",
                  }}
                >
                  {m.sublabel}
                </div>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div
                  style={{
                    marginLeft: "auto",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "var(--gold, #C5A059)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase" as const,
                    fontFamily: "system-ui, sans-serif",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  ATIVO
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

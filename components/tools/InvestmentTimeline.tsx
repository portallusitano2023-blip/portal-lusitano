"use client";

import { useState, useEffect, useRef, useCallback, useId } from "react";

interface InvestmentTimelineProps {
  projections: { year: number; label: string; value: number }[];
  currentValue: number;
}

export default function InvestmentTimeline({ projections, currentValue }: InvestmentTimelineProps) {
  const [animated, setAnimated] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    const el = svgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTimeout(() => setAnimated(true), 200);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // --- Layout constants ---
  const viewW = 600;
  const viewH = 220;
  const padLeft = 70;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 40;
  const chartW = viewW - padLeft - padRight;
  const chartH = viewH - padTop - padBottom;

  // --- Data ---
  const allValues = projections.map((p) => p.value);
  const minVal = Math.min(...allValues) * 0.9;
  const maxVal = Math.max(...allValues) * 1.1;
  const range = maxVal - minVal || 1;

  const toX = useCallback(
    (i: number) => padLeft + (i / Math.max(projections.length - 1, 1)) * chartW,
    [projections.length, padLeft, chartW]
  );

  const toY = useCallback(
    (val: number) => padTop + chartH - ((val - minVal) / range) * chartH,
    [padTop, chartH, minVal, range]
  );

  // Build polyline points
  const points = projections.map((p, i) => ({ x: toX(i), y: toY(p.value) }));

  // SVG line path
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  // Area path (closed polygon for gradient fill)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`;

  // Line length for stroke-dasharray animation
  const lineLength = points.reduce((acc, pt, i) => {
    if (i === 0) return 0;
    const prev = points[i - 1];
    return acc + Math.sqrt((pt.x - prev.x) ** 2 + (pt.y - prev.y) ** 2);
  }, 0);

  // Y-axis ticks (4 evenly spaced)
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount }, (_, i) => {
    const val = minVal + (range / (tickCount - 1)) * i;
    return { val, y: toY(val) };
  });

  const formatValue = (val: number) =>
    val.toLocaleString("pt-PT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

  const formatShort = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1).replace(".", ",")}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
    return val.toLocaleString("pt-PT");
  };

  // Find the index of the "current value" point (year 0)
  const currentIndex = projections.findIndex((p) => p.value === currentValue);

  // Handle click / hover on data points
  const handlePointInteraction = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  // Unique gradient ID to avoid collisions when multiple instances render
  const uid = useId();
  const gradientId = `area-grad-${uid}`;
  const clipId = `area-clip-${uid}`;

  return (
    <div className="w-full select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewW} ${viewH}`}
        width="100%"
        height="auto"
        className="overflow-visible"
        role="img"
        aria-label="Projecao de valor do cavalo ao longo do tempo"
      >
        <defs>
          {/* Gold area gradient */}
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold, #C5A059)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--gold, #C5A059)" stopOpacity="0" />
          </linearGradient>

          {/* Clip path for animated area reveal */}
          <clipPath id={clipId}>
            <rect
              x={padLeft}
              y={0}
              width={animated ? chartW + padRight : 0}
              height={viewH}
              style={{
                transition: "width 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </clipPath>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={padLeft}
              y1={tick.y}
              x2={viewW - padRight}
              y2={tick.y}
              stroke="var(--border, rgba(255,255,255,0.1))"
              strokeWidth={0.5}
              strokeDasharray="4 4"
            />
            <text
              x={padLeft - 10}
              y={tick.y}
              textAnchor="end"
              dominantBaseline="central"
              fill="var(--foreground-muted, #71717a)"
              fontSize={10}
              fontFamily="system-ui, sans-serif"
            >
              {formatShort(tick.val)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {projections.map((p, i) => (
          <text
            key={i}
            x={toX(i)}
            y={viewH - 8}
            textAnchor="middle"
            fill="var(--foreground-muted, #71717a)"
            fontSize={10}
            fontFamily="system-ui, sans-serif"
          >
            {p.label}
          </text>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} clipPath={`url(#${clipId})`} />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="var(--gold, #C5A059)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: lineLength,
            strokeDashoffset: animated ? 0 : lineLength,
            transition: "stroke-dashoffset 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />

        {/* Data points */}
        {points.map((pt, i) => {
          const isCurrent = i === currentIndex;
          const isActive = activeIndex === i;
          const dotR = isCurrent ? 5 : 3.5;

          return (
            <g key={i}>
              {/* Invisible larger hit area for interaction */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={18}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => handlePointInteraction(i)}
                role="button"
                tabIndex={0}
                aria-label={`${projections[i].label}: ${formatValue(projections[i].value)}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePointInteraction(i);
                  }
                }}
              />

              {/* Outer glow ring on current point */}
              {isCurrent && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={9}
                  fill="none"
                  stroke="var(--gold, #C5A059)"
                  strokeWidth={1}
                  opacity={animated ? 0.3 : 0}
                  style={{
                    transition: "opacity 0.6s ease 1.6s",
                  }}
                />
              )}

              {/* Dot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isActive ? dotR + 1.5 : dotR}
                fill="var(--gold, #C5A059)"
                stroke="var(--background-secondary, #0a0a0a)"
                strokeWidth={2}
                opacity={animated ? 1 : 0}
                style={{
                  transition: `opacity 0.4s ease ${0.8 + i * 0.15}s, r 0.2s ease`,
                  filter: isActive ? "drop-shadow(0 0 6px rgba(197, 160, 89, 0.5))" : "none",
                }}
              />

              {/* Tooltip on hover/active */}
              {isActive && animated && (
                <g
                  style={{
                    opacity: 1,
                    animation: "fadeIn 0.15s ease-out",
                  }}
                >
                  {/* Tooltip background */}
                  <rect
                    x={pt.x - 50}
                    y={pt.y - 38}
                    width={100}
                    height={24}
                    rx={6}
                    fill="var(--background-secondary, #0a0a0a)"
                    stroke="var(--border, rgba(255,255,255,0.1))"
                    strokeWidth={0.5}
                  />
                  {/* Tooltip text */}
                  <text
                    x={pt.x}
                    y={pt.y - 26}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="var(--gold, #C5A059)"
                    fontSize={11}
                    fontWeight={600}
                    fontFamily="system-ui, sans-serif"
                  >
                    {formatValue(projections[i].value)}
                  </text>
                  {/* Tooltip arrow */}
                  <polygon
                    points={`${pt.x - 4},${pt.y - 14} ${pt.x + 4},${pt.y - 14} ${pt.x},${pt.y - 9}`}
                    fill="var(--background-secondary, #0a0a0a)"
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* Baseline */}
        <line
          x1={padLeft}
          y1={padTop + chartH}
          x2={viewW - padRight}
          y2={padTop + chartH}
          stroke="var(--border, rgba(255,255,255,0.1))"
          strokeWidth={0.5}
        />
      </svg>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

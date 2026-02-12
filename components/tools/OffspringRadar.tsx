"use client";

import { useState, useEffect, useRef, useCallback, useId } from "react";

interface OffspringRadarAxis {
  label: string;
  stallionScore: number; // 0-100
  mareScore: number; // 0-100
  offspringScore: number; // 0-100 (pre-calculated weighted average)
}

interface OffspringRadarProps {
  axes: OffspringRadarAxis[];
}

interface TooltipData {
  label: string;
  stallion: number;
  mare: number;
  offspring: number;
  screenX: number;
  screenY: number;
}

// Geometric helpers
const DEG_TO_RAD = Math.PI / 180;

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = angleDeg * DEG_TO_RAD;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function buildPolygonPoints(
  cx: number,
  cy: number,
  radius: number,
  scores: number[],
  maxRadius: number,
  animationProgress: number
): string {
  return scores
    .map((score, i) => {
      const angleDeg = (360 / scores.length) * i - 90;
      const r = (score / 100) * maxRadius * animationProgress;
      const pt = polarToCartesian(cx, cy, r, angleDeg);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");
}

export default function OffspringRadar({ axes }: OffspringRadarProps) {
  const uniqueId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const [progress, setProgress] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Chart dimensions (viewBox-relative)
  const viewBoxSize = 460;
  const cx = viewBoxSize / 2;
  const cy = 200; // offset upward to leave room for legend
  const maxRadius = 140;
  const labelOffset = 28;
  const vertexHitRadius = 18;

  const numAxes = axes.length;
  const ringLevels = [0.25, 0.5, 0.75, 1.0];

  // Precompute vertex positions at full radius
  const vertexAngles = axes.map((_, i) => (360 / numAxes) * i - 90);

  // IntersectionObserver scroll-triggered animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const duration = 1200;

          const animate = (now: number) => {
            const elapsed = now - start;
            const t = Math.min(elapsed / duration, 1);
            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - t, 3);
            setProgress(eased);
            if (t < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Tooltip handler via pointer events on the SVG
  const handleVertexInteraction = useCallback(
    (index: number, event: React.MouseEvent | React.FocusEvent) => {
      const axis = axes[index];
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Calculate tooltip position relative to the container
      const svgEl = svgRef.current;
      if (!svgEl) return;

      const angleDeg = vertexAngles[index];
      const pt = polarToCartesian(cx, cy, maxRadius + 6, angleDeg);

      // Convert SVG coordinates to screen coordinates
      const svgRect = svgEl.getBoundingClientRect();
      const scaleX = svgRect.width / viewBoxSize;
      const scaleY = svgRect.height / viewBoxSize;
      const screenX = pt.x * scaleX;
      const screenY = pt.y * scaleY;

      setTooltip({
        label: axis.label,
        stallion: axis.stallionScore,
        mare: axis.mareScore,
        offspring: axis.offspringScore,
        screenX,
        screenY,
      });
      setActiveIndex(index);
    },
    [axes, vertexAngles, cx, cy, maxRadius, viewBoxSize]
  );

  const clearTooltip = useCallback(() => {
    setTooltip(null);
    setActiveIndex(null);
  }, []);

  // Build polygon point strings
  const stallionPoints = buildPolygonPoints(
    cx,
    cy,
    maxRadius,
    axes.map((a) => a.stallionScore),
    maxRadius,
    progress
  );
  const marePoints = buildPolygonPoints(
    cx,
    cy,
    maxRadius,
    axes.map((a) => a.mareScore),
    maxRadius,
    progress
  );
  const offspringPoints = buildPolygonPoints(
    cx,
    cy,
    maxRadius,
    axes.map((a) => a.offspringScore),
    maxRadius,
    progress
  );

  // SVG filter IDs (unique per instance)
  const glowFilterId = `${uniqueId}-glow`;
  const goldGlowId = `${uniqueId}-gold-glow`;

  return (
    <div ref={containerRef} className="w-full relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Radar de aptidoes do potro estimado com ${numAxes} eixos: ${axes.map((a) => `${a.label} (Garanhao ${a.stallionScore}, Egua ${a.mareScore}, Potro ${a.offspringScore})`).join("; ")}`}
      >
        <defs>
          {/* Subtle glow for the offspring polygon */}
          <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={goldGlowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Concentric grid rings */}
        {ringLevels.map((level) => {
          const ringPoints = vertexAngles
            .map((angle) => {
              const pt = polarToCartesian(cx, cy, maxRadius * level, angle);
              return `${pt.x},${pt.y}`;
            })
            .join(" ");
          return (
            <polygon
              key={level}
              points={ringPoints}
              fill="none"
              stroke="var(--border, rgba(255,255,255,0.1))"
              strokeWidth={level === 1 ? 1.2 : 0.7}
              opacity={level === 1 ? 0.6 : 0.35}
            />
          );
        })}

        {/* Axis lines from center to vertices */}
        {vertexAngles.map((angle, i) => {
          const outer = polarToCartesian(cx, cy, maxRadius, angle);
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="var(--border, rgba(255,255,255,0.1))"
              strokeWidth={0.7}
              opacity={0.35}
            />
          );
        })}

        {/* Percentage labels on first axis */}
        {ringLevels.map((level) => {
          const pt = polarToCartesian(cx, cy, maxRadius * level, vertexAngles[0]);
          // Slightly offset to the left for readability
          return (
            <text
              key={`pct-${level}`}
              x={pt.x - 10}
              y={pt.y - 4}
              fill="var(--foreground-muted, #71717a)"
              fontSize="9"
              textAnchor="end"
              dominantBaseline="middle"
              opacity={0.5}
            >
              {Math.round(level * 100)}
            </text>
          );
        })}

        {/* Stallion polygon */}
        <polygon
          points={stallionPoints}
          fill="rgba(96, 165, 250, 0.15)"
          stroke="rgba(96, 165, 250, 0.6)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          style={{
            transition: "opacity 0.3s ease",
            opacity: activeIndex !== null ? 0.5 : 1,
          }}
        />

        {/* Mare polygon */}
        <polygon
          points={marePoints}
          fill="rgba(244, 114, 182, 0.15)"
          stroke="rgba(244, 114, 182, 0.6)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          style={{
            transition: "opacity 0.3s ease",
            opacity: activeIndex !== null ? 0.5 : 1,
          }}
        />

        {/* Offspring predicted polygon (prominent, gold) */}
        <polygon
          points={offspringPoints}
          fill="var(--gold, #C5A059)"
          fillOpacity="0.2"
          stroke="var(--gold, #C5A059)"
          strokeWidth="2.2"
          strokeLinejoin="round"
          filter={`url(#${glowFilterId})`}
          style={{
            transition: "opacity 0.3s ease",
            opacity: activeIndex !== null ? 0.7 : 1,
          }}
        />

        {/* Vertex dots for offspring (gold) */}
        {axes.map((axis, i) => {
          const angleDeg = vertexAngles[i];
          const r = (axis.offspringScore / 100) * maxRadius * progress;
          const pt = polarToCartesian(cx, cy, r, angleDeg);
          const isActive = activeIndex === i;
          return (
            <circle
              key={`offspring-dot-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={isActive ? 5 : 3.5}
              fill="var(--gold, #C5A059)"
              stroke="var(--background-secondary, #0a0a0a)"
              strokeWidth="1.5"
              filter={isActive ? `url(#${goldGlowId})` : undefined}
              style={{ transition: "r 0.2s ease" }}
            />
          );
        })}

        {/* Axis labels at vertices */}
        {axes.map((axis, i) => {
          const angleDeg = vertexAngles[i];
          const pt = polarToCartesian(cx, cy, maxRadius + labelOffset, angleDeg);

          // Determine text-anchor based on position
          let textAnchor: "start" | "middle" | "end" = "middle";
          if (angleDeg > -80 && angleDeg < 80) {
            // roughly top: center
            textAnchor = "middle";
          }
          const normalizedAngle = ((angleDeg % 360) + 360) % 360;
          if (normalizedAngle > 10 && normalizedAngle < 170) {
            textAnchor = "start";
          } else if (normalizedAngle > 190 && normalizedAngle < 350) {
            textAnchor = "end";
          }

          // Adjust dominant baseline based on vertical position
          let dominantBaseline: "auto" | "middle" | "hanging" = "middle";
          if (normalizedAngle > 250 && normalizedAngle < 290) {
            dominantBaseline = "auto"; // top labels
          } else if (normalizedAngle > 70 && normalizedAngle < 110) {
            dominantBaseline = "hanging"; // bottom labels
          }

          return (
            <text
              key={`label-${i}`}
              x={pt.x}
              y={pt.y}
              textAnchor={textAnchor}
              dominantBaseline={dominantBaseline}
              fill="var(--foreground-secondary, #a1a1aa)"
              fontSize="12"
              fontWeight="500"
              letterSpacing="0.02em"
            >
              {axis.label}
            </text>
          );
        })}

        {/* Invisible hit areas for interaction (larger targets for accessibility) */}
        {axes.map((axis, i) => {
          const angleDeg = vertexAngles[i];
          const pt = polarToCartesian(cx, cy, maxRadius, angleDeg);
          return (
            <circle
              key={`hit-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={vertexHitRadius}
              fill="transparent"
              cursor="pointer"
              tabIndex={0}
              role="button"
              aria-label={`${axis.label}: Garanhao ${axis.stallionScore}, Egua ${axis.mareScore}, Potro estimado ${axis.offspringScore}`}
              onMouseEnter={(e) => handleVertexInteraction(i, e)}
              onMouseLeave={clearTooltip}
              onFocus={(e) => handleVertexInteraction(i, e)}
              onBlur={clearTooltip}
              onClick={(e) => {
                if (activeIndex === i) {
                  clearTooltip();
                } else {
                  handleVertexInteraction(i, e);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (activeIndex === i) {
                    clearTooltip();
                  } else {
                    handleVertexInteraction(i, e as unknown as React.MouseEvent);
                  }
                }
              }}
            />
          );
        })}
      </svg>

      {/* Tooltip overlay */}
      {tooltip && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: tooltip.screenX,
            top: tooltip.screenY,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            className="rounded-lg px-3.5 py-2.5 shadow-xl text-xs leading-relaxed min-w-[160px]"
            style={{
              background: "var(--background-card, #111111)",
              border: "1px solid var(--border, rgba(255,255,255,0.1))",
            }}
          >
            <div
              className="font-semibold mb-1.5 text-[11px] uppercase tracking-wider"
              style={{ color: "var(--foreground, #ededed)" }}
            >
              {tooltip.label}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: "rgb(96, 165, 250)" }}
                  />
                  <span style={{ color: "var(--foreground-muted, #71717a)" }}>Garanhao</span>
                </span>
                <span className="font-semibold tabular-nums" style={{ color: "rgb(96, 165, 250)" }}>
                  {tooltip.stallion}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: "rgb(244, 114, 182)" }}
                  />
                  <span style={{ color: "var(--foreground-muted, #71717a)" }}>Egua</span>
                </span>
                <span
                  className="font-semibold tabular-nums"
                  style={{ color: "rgb(244, 114, 182)" }}
                >
                  {tooltip.mare}
                </span>
              </div>
              <div
                className="pt-1 mt-1"
                style={{
                  borderTop: "1px solid var(--border, rgba(255,255,255,0.1))",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ background: "var(--gold, #C5A059)" }}
                    />
                    <span style={{ color: "var(--foreground-muted, #71717a)" }}>Potro Est.</span>
                  </span>
                  <span
                    className="font-bold tabular-nums"
                    style={{ color: "var(--gold, #C5A059)" }}
                  >
                    {tooltip.offspring}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Tooltip arrow */}
          <div
            className="w-2.5 h-2.5 rotate-45 mx-auto -mt-[5px]"
            style={{
              background: "var(--background-card, #111111)",
              borderRight: "1px solid var(--border, rgba(255,255,255,0.1))",
              borderBottom: "1px solid var(--border, rgba(255,255,255,0.1))",
            }}
          />
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 px-2">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-[3px] rounded-full"
            style={{ background: "rgb(96, 165, 250)", opacity: 0.8 }}
          />
          <span className="text-xs" style={{ color: "var(--foreground-muted, #71717a)" }}>
            Garanhao
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-[3px] rounded-full"
            style={{ background: "rgb(244, 114, 182)", opacity: 0.8 }}
          />
          <span className="text-xs" style={{ color: "var(--foreground-muted, #71717a)" }}>
            Egua
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-[3px] rounded-full"
            style={{ background: "var(--gold, #C5A059)" }}
          />
          <span className="text-xs font-medium" style={{ color: "var(--gold, #C5A059)" }}>
            Potro Estimado
          </span>
        </div>
      </div>
    </div>
  );
}

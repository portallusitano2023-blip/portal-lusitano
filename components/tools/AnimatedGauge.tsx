"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface AnimatedGaugeProps {
  value: number; // 0-100
  label?: string;
  sublabel?: string;
  size?: number;
  accentColor?: string;
}

export default function AnimatedGauge({
  value,
  label,
  sublabel,
  size = 220,
  accentColor = "#C5A059",
}: AnimatedGaugeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const hasAnimated = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const strokeWidth = size * 0.045;

  const startAngle = 225;
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

  const getColor = (v: number) => {
    if (v >= 75) return "#22c55e";
    if (v >= 50) return accentColor;
    if (v >= 25) return "#f59e0b";
    return "#ef4444";
  };

  const endAngle = -45;
  const ticks = [0, 25, 50, 75, 100];

  useEffect(() => {
    if (hasAnimated.current) return;

    // Reduced motion: set final state immediately
    if (reducedMotion) {
      hasAnimated.current = true;
      const finalColor = getColor(value);
      const valueAngle = startAngle - (value / 100) * totalSweep;
      if (arcRef.current) {
        arcRef.current.setAttribute("d", describeArc(startAngle, valueAngle));
        arcRef.current.setAttribute("stroke", finalColor);
      }
      if (dotRef.current && value > 0) {
        const pos = polarToCartesian(valueAngle);
        dotRef.current.setAttribute("cx", String(pos.x));
        dotRef.current.setAttribute("cy", String(pos.y));
        dotRef.current.setAttribute("fill", finalColor);
      }
      if (textRef.current) textRef.current.textContent = String(value);
      return;
    }

    const el = svgRef.current;
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
            const current = Math.round(eased * value);
            const currentColor = getColor(current);
            const valueAngle = startAngle - (current / 100) * totalSweep;

            // Direct DOM updates — no React re-renders
            if (arcRef.current) {
              arcRef.current.setAttribute("d", describeArc(startAngle, valueAngle));
              arcRef.current.setAttribute("stroke", currentColor);
              arcRef.current.style.filter = `drop-shadow(0 0 ${size * 0.03}px ${currentColor}40)`;
            }

            if (dotRef.current && current > 0) {
              const needlePos = polarToCartesian(valueAngle);
              dotRef.current.setAttribute("cx", String(needlePos.x));
              dotRef.current.setAttribute("cy", String(needlePos.y));
              dotRef.current.setAttribute("fill", currentColor);
              dotRef.current.style.filter = `drop-shadow(0 0 ${size * 0.02}px ${currentColor}80)`;
            }

            if (textRef.current) {
              textRef.current.textContent = String(current);
            }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reducedMotion]);

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={svgRef}
        width={size}
        height={size * 0.72}
        viewBox={`0 0 ${size} ${size * 0.72}`}
        role="img"
        aria-label={`${label || "Score"}: ${value}`}
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
        <path
          ref={arcRef}
          d={describeArc(startAngle, startAngle)}
          fill="none"
          stroke={getColor(0)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

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
        <circle ref={dotRef} cx={cx} cy={cy} r={strokeWidth * 0.8} fill="transparent" />

        {/* Center value */}
        <text
          ref={textRef}
          x={cx}
          y={cy - size * 0.04}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          fontSize={size * 0.18}
          fontWeight="700"
          fontFamily="serif"
        >
          0
        </text>

        {/* Label below value */}
        {label && (
          <text
            x={cx}
            y={cy + size * 0.1}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(255,255,255,0.5)"
            fontSize={size * 0.055}
            fontWeight="500"
            letterSpacing="0.1em"
            style={{ textTransform: "uppercase" }}
          >
            {label}
          </text>
        )}
      </svg>
      {sublabel && (
        <p className="text-xs text-[var(--foreground-muted)] mt-1 text-center">{sublabel}</p>
      )}
    </div>
  );
}

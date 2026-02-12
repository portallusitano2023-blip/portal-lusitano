"use client";

import { useState, useEffect, useRef } from "react";

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
            // Ease-out cubic
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
  const strokeWidth = size * 0.045;

  // Arc from 225° to -45° (270° sweep = full gauge)
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

  // Color based on value
  const getColor = (v: number) => {
    if (v >= 75) return "#22c55e";
    if (v >= 50) return accentColor;
    if (v >= 25) return "#f59e0b";
    return "#ef4444";
  };

  const color = getColor(animatedValue);

  // Tick marks
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center">
      <svg ref={ref} width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`}>
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
          d={describeArc(startAngle, valueAngle)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 ${size * 0.03}px ${color}40)`,
          }}
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
        {animatedValue > 0 &&
          (() => {
            const needlePos = polarToCartesian(valueAngle);
            return (
              <circle
                cx={needlePos.x}
                cy={needlePos.y}
                r={strokeWidth * 0.8}
                fill={color}
                style={{
                  filter: `drop-shadow(0 0 ${size * 0.02}px ${color}80)`,
                }}
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

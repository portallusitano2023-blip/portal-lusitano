"use client";

import { useState, useEffect, useRef } from "react";

interface AnimatedRingProps {
  value: number; // 0-100
  label?: string;
  sublabel?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export default function AnimatedRing({
  value,
  label,
  sublabel,
  size = 200,
  strokeWidth = 10,
  color,
}: AnimatedRingProps) {
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
          const duration = 1600;

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedValue(eased * value);
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
  const radius = (size - strokeWidth) / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - animatedValue / 100);

  const getColor = (v: number) => {
    if (color) return color;
    if (v >= 70) return "#22c55e";
    if (v >= 50) return "#C5A059";
    if (v >= 30) return "#f59e0b";
    return "#ef4444";
  };

  const ringColor = getColor(animatedValue);
  const displayValue = Math.round(animatedValue);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg ref={ref} width={size} height={size}>
          {/* Background ring */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />

          {/* Animated ring */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{
              filter: `drop-shadow(0 0 8px ${ringColor}30)`,
              transition: "stroke 0.3s ease",
            }}
          />

          {/* Subtle glow at the tip */}
          {animatedValue > 2 &&
            (() => {
              const angle = ((animatedValue / 100) * 360 - 90) * (Math.PI / 180);
              const tipX = cx + radius * Math.cos(angle);
              const tipY = cy + radius * Math.sin(angle);
              return (
                <circle
                  cx={tipX}
                  cy={tipY}
                  r={strokeWidth * 0.6}
                  fill={ringColor}
                  opacity={0.4}
                  style={{ filter: `blur(${strokeWidth * 0.4}px)` }}
                />
              );
            })()}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif font-bold text-white" style={{ fontSize: size * 0.22 }}>
            {displayValue}
          </span>
          {label && (
            <span
              className="text-[var(--foreground-muted)] uppercase tracking-[0.15em] font-medium"
              style={{ fontSize: size * 0.055 }}
            >
              {label}
            </span>
          )}
        </div>
      </div>
      {sublabel && (
        <p className="text-xs text-[var(--foreground-muted)] mt-2 text-center">{sublabel}</p>
      )}
    </div>
  );
}

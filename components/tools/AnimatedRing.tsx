"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

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
  const svgRef = useRef<SVGSVGElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const reducedMotion = usePrefersReducedMotion();

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - strokeWidth) / 2 - 4;
  const circumference = 2 * Math.PI * radius;

  const getColor = (v: number) => {
    if (color) return color;
    if (v >= 70) return "#22c55e";
    if (v >= 50) return "#C5A059";
    if (v >= 30) return "#f59e0b";
    return "#ef4444";
  };

  useEffect(() => {
    if (hasAnimated.current) return;

    // Reduced motion: set final state immediately
    if (reducedMotion) {
      hasAnimated.current = true;
      const finalColor = getColor(value);
      if (ringRef.current) {
        ringRef.current.setAttribute(
          "stroke-dashoffset",
          String(circumference * (1 - value / 100))
        );
        ringRef.current.setAttribute("stroke", finalColor);
      }
      if (glowRef.current && value > 2) {
        const angle = ((value / 100) * 360 - 90) * (Math.PI / 180);
        glowRef.current.setAttribute("cx", String(cx + radius * Math.cos(angle)));
        glowRef.current.setAttribute("cy", String(cy + radius * Math.sin(angle)));
        glowRef.current.setAttribute("fill", finalColor);
        glowRef.current.setAttribute("opacity", "0.4");
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
          const duration = 1600;

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * value;
            const currentColor = getColor(current);

            // Direct DOM updates — no React re-renders
            if (ringRef.current) {
              ringRef.current.setAttribute(
                "stroke-dashoffset",
                String(circumference * (1 - current / 100))
              );
              ringRef.current.setAttribute("stroke", currentColor);
              ringRef.current.style.filter = `drop-shadow(0 0 8px ${currentColor}30)`;
            }

            if (glowRef.current && current > 2) {
              const angle = ((current / 100) * 360 - 90) * (Math.PI / 180);
              glowRef.current.setAttribute("cx", String(cx + radius * Math.cos(angle)));
              glowRef.current.setAttribute("cy", String(cy + radius * Math.sin(angle)));
              glowRef.current.setAttribute("fill", currentColor);
              glowRef.current.setAttribute("opacity", "0.4");
            }

            if (textRef.current) {
              textRef.current.textContent = String(Math.round(current));
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
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          ref={svgRef}
          width={size}
          height={size}
          role="img"
          aria-label={`${label || "Score"}: ${value}`}
        >
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
            ref={ringRef}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={getColor(0)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke 0.3s ease" }}
          />

          {/* Subtle glow at the tip */}
          <circle
            ref={glowRef}
            cx={cx}
            cy={cy - radius}
            r={strokeWidth * 0.6}
            fill="transparent"
            opacity={0}
            style={{ filter: `blur(${strokeWidth * 0.4}px)` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            ref={textRef}
            className="font-serif font-bold text-white"
            style={{ fontSize: size * 0.22 }}
          >
            0
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

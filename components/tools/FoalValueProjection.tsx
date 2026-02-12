"use client";

import { useState, useEffect, useRef, useId } from "react";
import { Baby, TrendingUp, Award } from "lucide-react";

interface FoalValueStage {
  stage: string;
  value: number;
  description: string;
}

interface FoalValueProjectionProps {
  foalValues: FoalValueStage[];
  parentQuality: number; // 0-100
}

const STAGE_ICONS = [Baby, TrendingUp, Award];

export default function FoalValueProjection({
  foalValues,
  parentQuality,
}: FoalValueProjectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qualityBarRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [qualityAnimated, setQualityAnimated] = useState(false);
  const [animatedQuality, setAnimatedQuality] = useState(0);
  const hasAnimatedQuality = useRef(false);
  const uid = useId();

  // Animate the quality bar when it enters the viewport
  useEffect(() => {
    if (hasAnimatedQuality.current) return;
    const el = qualityBarRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedQuality.current) {
          hasAnimatedQuality.current = true;
          setTimeout(() => setQualityAnimated(true), 200);

          // Animate the number counting up
          const start = performance.now();
          const duration = 1400;
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedQuality(Math.round(eased * parentQuality));
            if (progress < 1) requestAnimationFrame(animate);
          };
          // Delay the counter to sync with the bar fill
          setTimeout(() => requestAnimationFrame(animate), 200);

          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [parentQuality]);

  // Staggered card reveal via IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>("[data-foal-card]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.foalCard);
            setTimeout(() => {
              setVisibleCards((prev) => new Set(prev).add(index));
            }, index * 200);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [foalValues.length]);

  const formatValue = (val: number) =>
    val.toLocaleString("pt-PT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    });

  const birthValue = foalValues.length > 0 ? foalValues[0].value : 0;

  const getGrowthPercent = (val: number) => {
    if (birthValue <= 0) return 0;
    return Math.round(((val - birthValue) / birthValue) * 100);
  };

  // Quality bar colour based on score
  const getQualityColor = (score: number) => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "var(--gold, #C5A059)";
    if (score >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const qualityColor = getQualityColor(parentQuality);

  return (
    <div className="w-full space-y-6">
      {/* Qualidade Genetica bar */}
      <div ref={qualityBarRef} className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-widest text-[var(--foreground-muted,#71717a)]">
            Qualidade Genetica
          </span>
          <span className="text-sm font-bold tabular-nums" style={{ color: qualityColor }}>
            {animatedQuality}
            <span className="text-[var(--foreground-muted,#71717a)] font-normal">/100</span>
          </span>
        </div>

        {/* Bar track */}
        <div className="relative h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-[1.4s] ease-out"
            style={{
              width: qualityAnimated ? `${parentQuality}%` : "0%",
              background: `linear-gradient(90deg, ${qualityColor}99, ${qualityColor})`,
              boxShadow: qualityAnimated ? `0 0 12px ${qualityColor}40` : "none",
            }}
          />
          {/* Glow dot at the end of the bar */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-[1.4s] ease-out"
            style={{
              left: qualityAnimated ? `${parentQuality}%` : "0%",
              marginLeft: "-6px",
              background: qualityColor,
              boxShadow: `0 0 8px ${qualityColor}80`,
              opacity: qualityAnimated ? 1 : 0,
            }}
          />
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-[10px] text-[var(--foreground-muted,#71717a)] opacity-60">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      {/* Cards grid with connecting arrows */}
      <div ref={containerRef} className="relative">
        {/* Grid layout: 1 col on mobile, 3 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 relative">
          {foalValues.map((stage, i) => {
            const isVisible = visibleCards.has(i);
            const Icon = STAGE_ICONS[i] || TrendingUp;
            const growth = getGrowthPercent(stage.value);
            const isFirst = i === 0;
            const isLast = i === foalValues.length - 1;

            return (
              <div key={`${uid}-stage-${i}`} className="flex flex-col items-center relative">
                {/* Connecting arrow BEFORE the card (not on first card) */}
                {!isFirst && (
                  <>
                    {/* Desktop: horizontal arrow (left of card) */}
                    <div
                      className="hidden md:flex absolute top-1/2 -translate-y-1/2 items-center"
                      style={{
                        left: "-2px",
                        zIndex: 10,
                      }}
                      aria-hidden="true"
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{
                          opacity: isVisible ? 0.5 : 0,
                          transition: "opacity 0.5s ease-out",
                          transitionDelay: `${i * 200 + 100}ms`,
                        }}
                      >
                        <path
                          d="M8 4l8 8-8 8"
                          stroke="var(--gold, #C5A059)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* Mobile: vertical arrow (above card) */}
                    <div className="flex md:hidden justify-center -mt-2 mb-2" aria-hidden="true">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{
                          opacity: isVisible ? 0.5 : 0,
                          transition: "opacity 0.5s ease-out",
                          transitionDelay: `${i * 200 + 100}ms`,
                        }}
                      >
                        <path
                          d="M4 8l8 8 8-8"
                          stroke="var(--gold, #C5A059)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </>
                )}

                {/* Card */}
                <div
                  data-foal-card={i}
                  className="w-full rounded-xl border border-[var(--border,rgba(255,255,255,0.1))] bg-[var(--background-card,#111)] overflow-hidden transition-colors duration-300 hover:border-[color:var(--gold,#C5A059)] hover:border-opacity-30 mx-1"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.6s ease-out, transform 0.6s ease-out, border-color 0.3s",
                  }}
                >
                  {/* Card header with icon */}
                  <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-[color:var(--gold,#C5A059)] bg-opacity-10">
                      <Icon size={16} className="text-[var(--gold,#C5A059)]" aria-hidden="true" />
                    </div>
                    <h4 className="text-sm font-serif font-semibold text-[var(--foreground,#fff)] leading-tight">
                      {stage.stage}
                    </h4>
                  </div>

                  {/* Value - prominent with gold-to-white gradient */}
                  <div className="px-4 py-3">
                    <span
                      className="text-2xl font-serif font-bold tabular-nums"
                      style={{
                        background: "linear-gradient(135deg, var(--gold, #C5A059) 0%, #fff 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {formatValue(stage.value)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="px-4 pb-3 text-xs leading-relaxed text-[var(--foreground-muted,#71717a)]">
                    {stage.description}
                  </p>

                  {/* Growth indicator footer */}
                  <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border,rgba(255,255,255,0.1))] bg-[var(--background-secondary,#0a0a0a)]">
                    {isFirst ? (
                      <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted,#71717a)]">
                        Valor base
                      </span>
                    ) : (
                      <>
                        <span className="text-[10px] uppercase tracking-widest text-[var(--foreground-muted,#71717a)]">
                          Crescimento
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold tabular-nums">
                          +{growth}%
                        </span>
                      </>
                    )}

                    {/* Mini progress bar for growth */}
                    {!isFirst && (
                      <div className="flex-1 mx-3 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500/60 transition-all duration-[1.2s] ease-out"
                          style={{
                            width: isVisible ? `${Math.min(growth, 100)}%` : "0%",
                            transitionDelay: `${i * 200 + 400}ms`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Desktop connecting lines between cards (drawn behind the cards) */}
          {foalValues.length > 1 && (
            <div
              className="hidden md:block absolute top-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${100 / (foalValues.length * 2)}%`,
                right: `${100 / (foalValues.length * 2)}%`,
                zIndex: 0,
              }}
              aria-hidden="true"
            >
              <div className="w-full h-px border-t border-dashed border-[var(--border,rgba(255,255,255,0.1))]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, TrendingUp, Clock, Coins } from "lucide-react";

interface TrainingLevel {
  level: string;
  label: string;
  estimatedValue: number;
  roi: number;
  costRange: string;
  duration: string;
}

interface TrainingROIProps {
  currentLevel: string;
  currentValue: number;
  levels: TrainingLevel[];
}

export default function TrainingROI({ currentLevel, currentValue, levels }: TrainingROIProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>("[data-roi-card]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.roiCard);
            // Stagger based on card position
            setTimeout(() => {
              setVisibleCards((prev) => new Set(prev).add(index));
            }, index * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [levels.length]);

  const formatValue = (val: number) => `${val.toLocaleString("pt-PT")}\u00A0\u20AC`;

  return (
    <div ref={containerRef} className="relative">
      {/* Vertical connecting line */}
      <div
        className="absolute left-5 top-0 bottom-0 w-px border-l-2 border-dashed border-[var(--border)]"
        aria-hidden="true"
      />

      {/* Current level card (always visible) */}
      <div data-roi-card="-1" className="relative pl-12 pb-8">
        {/* Node dot */}
        <div
          className="absolute left-[13px] top-2 w-[15px] h-[15px] rounded-full border-2 border-[var(--gold)] bg-[var(--background-card)]"
          aria-hidden="true"
        />

        <div className="rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--foreground-muted)]">
                Nivel Atual
              </span>
              <h4 className="text-sm font-serif font-semibold text-[var(--foreground)] mt-0.5">
                {currentLevel}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-lg font-serif font-bold text-[var(--foreground)]">
                {formatValue(currentValue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Training level cards */}
      {levels.map((lvl, i) => {
        const isVisible = visibleCards.has(i);

        return (
          <div
            key={lvl.level}
            data-roi-card={i}
            className="relative pl-12 pb-6 last:pb-0"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            {/* Node dot with upward pulse */}
            <div
              className="absolute left-[13px] top-3 w-[15px] h-[15px] rounded-full bg-[var(--gold)] shadow-[0_0_12px_rgba(197,160,89,0.35)]"
              aria-hidden="true"
            >
              <ArrowUp size={9} className="absolute inset-0 m-auto text-black" strokeWidth={3} />
            </div>

            {/* Card */}
            <div className="group rounded-xl border border-[var(--border)] bg-[var(--background-card)] hover:border-[var(--gold)]/30 transition-colors duration-300 overflow-hidden">
              {/* Top section: Level + Value + ROI */}
              <div className="flex items-center justify-between gap-4 p-4">
                {/* Left: Level name */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center">
                    <TrendingUp size={14} className="text-[var(--gold)]" />
                  </div>
                  <h4 className="text-sm font-serif font-semibold text-[var(--foreground)] truncate">
                    {lvl.label}
                  </h4>
                </div>

                {/* Center: Estimated value */}
                <span className="text-base font-serif font-bold text-[var(--foreground)] whitespace-nowrap">
                  {formatValue(lvl.estimatedValue)}
                </span>

                {/* Right: ROI badge */}
                <span className="flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold tabular-nums">
                  +{lvl.roi}%
                </span>
              </div>

              {/* Bottom section: Cost + Duration */}
              <div className="flex items-center gap-6 px-4 py-2.5 border-t border-[var(--border)] bg-[var(--background-secondary)]">
                <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                  <Coins size={12} className="text-[var(--foreground-muted)] opacity-60" />
                  <span>{lvl.costRange}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
                  <Clock size={12} className="text-[var(--foreground-muted)] opacity-60" />
                  <span>{lvl.duration}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

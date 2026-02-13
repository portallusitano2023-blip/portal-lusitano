"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ValueWaterfallProps {
  categorias: { nome: string; impacto: number; score: number; descricao: string }[];
  valorBase: number;
  valorFinal: number;
}

export default function ValueWaterfall({ categorias, valorBase, valorFinal }: ValueWaterfallProps) {
  const { t } = useLanguage();
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTimeout(() => setAnimated(true), 200);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const formatValue = (val: number) =>
    `${val >= 0 ? "+" : ""}${val.toLocaleString("pt-PT")}\u00A0\u20AC`;

  const formatAbsolute = (val: number) => `${val.toLocaleString("pt-PT")}\u00A0\u20AC`;

  // Build cumulative positions for waterfall bars
  const maxValue = Math.max(
    valorBase,
    valorFinal,
    ...categorias.reduce<number[]>((acc, cat) => {
      const prev = acc.length > 0 ? acc[acc.length - 1] : valorBase;
      acc.push(prev + cat.impacto);
      return acc;
    }, [])
  );
  const scale = maxValue > 0 ? 100 / (maxValue * 1.1) : 1;

  // Cumulative running total for positioning each bar segment
  const segments = categorias.reduce<
    Array<(typeof categorias)[number] & { start: number; end: number }>
  >((acc, cat) => {
    const prev = acc.length > 0 ? acc[acc.length - 1].end : valorBase;
    acc.push({ ...cat, start: prev, end: prev + cat.impacto });
    return acc;
  }, []);

  return (
    <div
      ref={ref}
      className="bg-[var(--background-secondary)]/50 rounded-xl p-6 border border-[var(--border)]"
    >
      <h3 className="text-sm font-serif font-semibold text-[var(--foreground)] mb-1">
        {t.calculadora.waterfall_title}
      </h3>
      <p className="text-xs text-[var(--foreground-muted)] mb-5">
        {t.calculadora.waterfall_subtitle}
      </p>

      <div className="space-y-2.5" role="list" aria-label={t.calculadora.waterfall_title}>
        {/* Base bar */}
        <div className="flex items-center gap-3" role="listitem">
          <span className="w-24 flex-shrink-0 text-xs font-medium text-[var(--foreground-secondary)] text-right truncate">
            {t.calculadora.waterfall_base}
          </span>
          <div className="flex-1 h-7 bg-white/[0.03] rounded overflow-hidden relative">
            <div
              className="h-full rounded bg-[var(--foreground-secondary)]/20"
              style={{
                width: animated ? `${valorBase * scale}%` : "0%",
                transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          </div>
          <span className="w-24 flex-shrink-0 text-xs font-medium text-[var(--foreground-secondary)] tabular-nums">
            {formatAbsolute(valorBase)}
          </span>
        </div>

        {/* Category bars */}
        {segments.map((seg, i) => {
          const isPositive = seg.impacto >= 0;
          const barLeft = Math.min(seg.start, seg.end) * scale;
          const barWidth = Math.abs(seg.impacto) * scale;

          return (
            <div
              key={seg.nome}
              className="flex items-center gap-3"
              role="listitem"
              style={{
                opacity: animated ? 1 : 0,
                transform: animated ? "translateX(0)" : "translateX(-8px)",
                transition: `opacity 0.4s ease ${0.3 + i * 0.1}s, transform 0.4s ease ${0.3 + i * 0.1}s`,
              }}
            >
              <span className="w-24 flex-shrink-0 text-xs text-[var(--foreground-muted)] text-right truncate">
                {seg.nome}
              </span>
              <div className="flex-1 h-7 bg-white/[0.03] rounded overflow-hidden relative">
                <div
                  className="absolute top-0 h-full rounded"
                  style={{
                    left: animated ? `${barLeft}%` : "0%",
                    width: animated ? `${Math.max(barWidth, 0.5)}%` : "0%",
                    backgroundColor: isPositive
                      ? "rgba(34, 197, 94, 0.5)"
                      : "rgba(239, 68, 68, 0.5)",
                    borderLeft: isPositive ? "2px solid #22c55e" : "2px solid #ef4444",
                    transition: `left 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${0.3 + i * 0.1}s, width 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${0.3 + i * 0.1}s`,
                  }}
                />
              </div>
              <span
                className={`w-24 flex-shrink-0 text-xs font-semibold tabular-nums ${
                  isPositive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {formatValue(seg.impacto)}
              </span>
            </div>
          );
        })}

        {/* Final bar */}
        <div
          className="flex items-center gap-3 pt-2 mt-1 border-t border-[var(--border)]"
          role="listitem"
          style={{
            opacity: animated ? 1 : 0,
            transition: `opacity 0.5s ease ${0.4 + categorias.length * 0.1}s`,
          }}
        >
          <span className="w-24 flex-shrink-0 text-xs font-bold text-[var(--gold,#C5A059)] text-right truncate">
            {t.calculadora.waterfall_total}
          </span>
          <div className="flex-1 h-7 bg-white/[0.03] rounded overflow-hidden relative">
            <div
              className="h-full rounded"
              style={{
                width: animated ? `${valorFinal * scale}%` : "0%",
                backgroundColor: "rgba(197, 160, 89, 0.35)",
                borderLeft: "2px solid var(--gold, #C5A059)",
                transition: `width 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${0.3 + categorias.length * 0.1}s`,
              }}
            />
          </div>
          <span className="w-24 flex-shrink-0 text-xs font-bold text-[var(--gold,#C5A059)] tabular-nums">
            {formatAbsolute(valorFinal)}
          </span>
        </div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [style*="transition"] {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}

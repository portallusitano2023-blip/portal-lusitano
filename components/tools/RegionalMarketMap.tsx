"use client";

import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";

// ============================================
// TYPES
// ============================================

interface Market {
  value: string;
  label: string;
  mult: number;
}

interface RegionalMarketMapProps {
  baseValue: number;
  currentMarket: string;
  markets: Market[];
}

// ============================================
// COUNTRY FLAG EMOJI MAPPING
// ============================================

const FLAG_MAP: Record<string, string> = {
  Portugal: "\u{1F1F5}\u{1F1F9}",
  Espanha: "\u{1F1EA}\u{1F1F8}",
  "Fran\u00E7a": "\u{1F1EB}\u{1F1F7}",
  Alemanha: "\u{1F1E9}\u{1F1EA}",
  Holanda: "\u{1F1F3}\u{1F1F1}",
  "B\u00E9lgica": "\u{1F1E7}\u{1F1EA}",
  "Su\u00ED\u00E7a": "\u{1F1E8}\u{1F1ED}",
  "Reino Unido": "\u{1F1EC}\u{1F1E7}",
  Brasil: "\u{1F1E7}\u{1F1F7}",
  EUA: "\u{1F1FA}\u{1F1F8}",
  "M\u00E9xico": "\u{1F1F2}\u{1F1FD}",
  // Aliases with French-style names
  France: "\u{1F1EB}\u{1F1F7}",
  Belgique: "\u{1F1E7}\u{1F1EA}",
  Suisse: "\u{1F1E8}\u{1F1ED}",
};

function getFlag(marketName: string): string {
  return FLAG_MAP[marketName] ?? "\u{1F3F3}\u{FE0F}";
}

// ============================================
// COMPONENT
// ============================================

export default function RegionalMarketMap({
  baseValue,
  currentMarket,
  markets,
}: RegionalMarketMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // IntersectionObserver for fade-in animation
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Find the multiplier for the user's current market
  const currentMarketData = markets.find((m) => m.value === currentMarket);
  const currentMult = currentMarketData?.mult ?? 1.0;

  // Compute estimated values per market
  const marketEstimates = markets.map((market) => {
    const estimatedValue = baseValue * (market.mult / currentMult);
    const percentDiff = (market.mult / currentMult - 1) * 100;
    const isCurrent = market.value === currentMarket;

    return {
      ...market,
      estimatedValue,
      percentDiff,
      isCurrent,
      flag: getFlag(market.value),
    };
  });

  const formatValue = (val: number) =>
    val.toLocaleString("pt-PT", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-2">
        <Globe size={16} className="text-[var(--gold)]" />
        <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider">
          Valor Estimado por Mercado
        </h3>
      </div>

      <p className="text-xs text-[var(--foreground-muted)] -mt-2 mb-4">
        Estimativa comparativa do valor em diferentes mercados internacionais
      </p>

      {/* Market cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {marketEstimates.map((market, index) => {
          const isPositive = market.percentDiff > 0;
          const isNegative = market.percentDiff < 0;
          const isNeutral = market.percentDiff === 0;

          return (
            <div
              key={market.value}
              className={`
                relative group rounded-xl p-4 transition-all duration-500 ease-out
                border bg-[var(--background-secondary)]/50
                ${
                  market.isCurrent
                    ? "border-[var(--gold)]/60 shadow-[0_0_20px_rgba(197,160,89,0.08)]"
                    : "border-[var(--border)] hover:border-[var(--border)]"
                }
              `}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transitionDelay: `${index * 70}ms`,
              }}
            >
              {/* Current market indicator */}
              {market.isCurrent && (
                <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />
              )}

              {/* Flag and country name */}
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-xl leading-none" role="img" aria-label={market.label}>
                  {market.flag}
                </span>
                <div className="min-w-0">
                  <span
                    className={`text-sm font-medium block truncate ${
                      market.isCurrent ? "text-[var(--gold)]" : "text-[var(--foreground)]"
                    }`}
                  >
                    {market.label}
                  </span>
                  {market.isCurrent && (
                    <span className="text-[10px] uppercase tracking-widest text-[var(--gold)]/70 font-medium">
                      Atual
                    </span>
                  )}
                </div>
              </div>

              {/* Estimated value */}
              <div className="mb-2">
                <span className="text-lg font-light tracking-tight text-[var(--foreground)]">
                  {formatValue(market.estimatedValue)}
                </span>
                <span
                  className={`text-sm ml-1 ${
                    market.isCurrent ? "text-[var(--gold)]" : "text-[var(--foreground-muted)]"
                  }`}
                >
                  &euro;
                </span>
              </div>

              {/* Percentage difference */}
              <div>
                {isNeutral ? (
                  <span className="inline-flex items-center text-xs text-[var(--foreground-muted)] font-medium">
                    Base
                  </span>
                ) : (
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isPositive ? "bg-emerald-500/10 text-emerald-400" : ""
                    } ${isNegative ? "bg-red-500/10 text-red-400" : ""}`}
                  >
                    {isPositive ? "+" : ""}
                    {market.percentDiff.toFixed(0)}%
                  </span>
                )}
              </div>

              {/* Subtle bottom glow for current market */}
              {market.isCurrent && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[var(--gold)]/5 blur-xl rounded-full pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-[11px] text-[var(--foreground-muted)]/60 leading-relaxed mt-2">
        {
          "Valores estimados com base nos multiplicadores regionais. Os pre\u00E7os reais podem variar conforme procura local e condi\u00E7\u00F5es de mercado."
        }
      </p>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useId, useMemo } from "react";
import { Wallet, Calculator } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HorseCostEntry {
  nome: string;
  purchasePrice: number;
  annualCosts: {
    pensao: number;
    alimentacao: number;
    veterinario: number;
    ferrador: number;
    treino: number;
    seguro: number;
  };
  estimatedValue5yr: number;
}

interface CostProjectionTableProps {
  horses: HorseCostEntry[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const COST_LABELS: Record<keyof HorseCostEntry["annualCosts"], string> = {
  pensao: "Pensao",
  alimentacao: "Alimentacao",
  veterinario: "Veterinario",
  ferrador: "Ferrador",
  treino: "Treino",
  seguro: "Seguro",
};

const COST_ORDER: (keyof HorseCostEntry["annualCosts"])[] = [
  "pensao",
  "alimentacao",
  "veterinario",
  "ferrador",
  "treino",
  "seguro",
];

/**
 * Some costs are stored as monthly values while seguro is annual.
 * Convert everything to annual for the projection.
 */
function annualTotal(costs: HorseCostEntry["annualCosts"]): number {
  const monthly =
    costs.pensao + costs.alimentacao + costs.veterinario + costs.ferrador + costs.treino;
  return monthly * 12 + costs.seguro;
}

function annualValueForKey(key: keyof HorseCostEntry["annualCosts"], value: number): number {
  // seguro is already annual; everything else is monthly
  return key === "seguro" ? value : value * 12;
}

function formatEUR(value: number): string {
  return value.toLocaleString("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CostProjectionTable({ horses }: CostProjectionTableProps) {
  const uid = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());

  // --------------------------------------------------
  // IntersectionObserver for staggered row animation
  // --------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rows = container.querySelectorAll<HTMLElement>("[data-cost-row]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rowId = (entry.target as HTMLElement).dataset.costRow ?? "";
            const delay = Number((entry.target as HTMLElement).dataset.costDelay ?? 0);
            setTimeout(() => {
              setVisibleRows((prev) => new Set(prev).add(rowId));
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [horses.length]);

  // --------------------------------------------------
  // Pre-compute derived values
  // --------------------------------------------------
  const computed = useMemo(
    () =>
      horses.map((horse) => {
        const annual = annualTotal(horse.annualCosts);
        const totalCost5yr = horse.purchasePrice + annual * 5;
        const roi =
          totalCost5yr > 0 ? ((horse.estimatedValue5yr - totalCost5yr) / totalCost5yr) * 100 : 0;
        return { annual, totalCost5yr, roi };
      }),
    [horses]
  );

  // Find the largest single annual cost across all horses (for progress bars)
  const maxAnnualCost = useMemo(() => {
    let max = 0;
    for (const horse of horses) {
      for (const key of COST_ORDER) {
        const val = annualValueForKey(key, horse.annualCosts[key]);
        if (val > max) max = val;
      }
    }
    return max || 1;
  }, [horses]);

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  if (horses.length === 0) return null;

  return (
    <div ref={containerRef} className="w-full space-y-4">
      {/* ---- Header ---- */}
      <div
        data-cost-row={`${uid}-header`}
        data-cost-delay="0"
        className="flex items-center gap-3 transition-all duration-500"
        style={{
          opacity: visibleRows.has(`${uid}-header`) ? 1 : 0,
          transform: visibleRows.has(`${uid}-header`) ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[var(--gold,#C5A059)]/10 flex items-center justify-center">
          <Calculator size={18} className="text-[var(--gold,#C5A059)]" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-serif font-semibold text-[var(--foreground,#ededed)]">
            Projecao de Custos a 5 Anos
          </h3>
          <p className="text-xs text-[var(--foreground-muted,#71717a)]">
            Custo total de propriedade e retorno estimado
          </p>
        </div>
      </div>

      {/* ---- Cards grid ---- */}
      <div
        className={`grid gap-4 ${
          horses.length === 1
            ? "grid-cols-1"
            : horses.length === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {horses.map((horse, horseIdx) => {
          const { annual, totalCost5yr, roi } = computed[horseIdx];
          const cardId = `${uid}-card-${horseIdx}`;
          const isCardVisible = visibleRows.has(cardId);

          return (
            <div
              key={cardId}
              data-cost-row={cardId}
              data-cost-delay={horseIdx * 120}
              className="rounded-xl border border-[var(--border,rgba(255,255,255,0.1))] bg-[var(--background-card,#111)] overflow-hidden transition-all duration-600"
              style={{
                opacity: isCardVisible ? 1 : 0,
                transform: isCardVisible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.6s ease-out, transform 0.6s ease-out, border-color 0.3s",
              }}
              role="region"
              aria-label={`Projecao de custos para ${horse.nome}`}
            >
              {/* ---- Card header ---- */}
              <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--border,rgba(255,255,255,0.1))]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--gold,#C5A059)]/10 flex items-center justify-center">
                    <Wallet size={15} className="text-[var(--gold,#C5A059)]" aria-hidden="true" />
                  </div>
                  <h4 className="text-sm font-serif font-semibold text-[var(--foreground,#ededed)] truncate">
                    {horse.nome}
                  </h4>
                </div>
              </div>

              {/* ---- Purchase price ---- */}
              <PurchaseRow
                uid={uid}
                horseIdx={horseIdx}
                value={horse.purchasePrice}
                isVisible={visibleRows.has(`${uid}-purchase-${horseIdx}`)}
              />

              {/* ---- Annual breakdown ---- */}
              <div className="px-5 pt-3 pb-1">
                <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--foreground-muted,#71717a)]">
                  Custos Anuais
                </span>
              </div>

              {COST_ORDER.map((key, rowIdx) => {
                const monthlyValue = horse.annualCosts[key];
                const annualValue = annualValueForKey(key, monthlyValue);
                const rowId = `${uid}-row-${horseIdx}-${key}`;
                const isRowVisible = visibleRows.has(rowId);
                const barPercent = (annualValue / maxAnnualCost) * 100;

                return (
                  <div
                    key={rowId}
                    data-cost-row={rowId}
                    data-cost-delay={horseIdx * 120 + (rowIdx + 1) * 80}
                    className="px-5 py-1.5"
                    style={{
                      opacity: isRowVisible ? 1 : 0,
                      transform: isRowVisible ? "translateX(0)" : "translateX(-12px)",
                      transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[var(--foreground-secondary,#a1a1aa)]">
                        {COST_LABELS[key]}
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        {key !== "seguro" && (
                          <span className="text-[10px] text-[var(--foreground-muted,#71717a)]">
                            {formatEUR(monthlyValue)}/mes
                          </span>
                        )}
                        <span className="text-xs font-semibold tabular-nums text-[var(--foreground,#ededed)]">
                          {formatEUR(annualValue)}/ano
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-[1s] ease-out"
                        style={{
                          width: isRowVisible ? `${barPercent}%` : "0%",
                          background:
                            "linear-gradient(90deg, var(--gold, #C5A059)66, var(--gold, #C5A059))",
                          transitionDelay: "200ms",
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* ---- Annual total ---- */}
              <SummaryRow
                uid={uid}
                horseIdx={horseIdx}
                label="Total Anual"
                value={annual}
                rowKey="annual"
                isVisible={visibleRows.has(`${uid}-summary-annual-${horseIdx}`)}
                accent={false}
              />

              {/* ---- 5-Year total ---- */}
              <SummaryRow
                uid={uid}
                horseIdx={horseIdx}
                label="Custo Total 5 Anos"
                value={totalCost5yr}
                rowKey="total5"
                isVisible={visibleRows.has(`${uid}-summary-total5-${horseIdx}`)}
                accent
                subtitle="Compra + Anuais x 5"
              />

              {/* ---- Estimated value at 5 years ---- */}
              <SummaryRow
                uid={uid}
                horseIdx={horseIdx}
                label="Valor Estimado (5 anos)"
                value={horse.estimatedValue5yr}
                rowKey="value5"
                isVisible={visibleRows.has(`${uid}-summary-value5-${horseIdx}`)}
                accent={false}
              />

              {/* ---- ROI footer ---- */}
              <ROIFooter
                uid={uid}
                horseIdx={horseIdx}
                roi={roi}
                isVisible={visibleRows.has(`${uid}-roi-${horseIdx}`)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function PurchaseRow({
  uid,
  horseIdx,
  value,
  isVisible,
}: {
  uid: string;
  horseIdx: number;
  value: number;
  isVisible: boolean;
}) {
  const rowId = `${uid}-purchase-${horseIdx}`;
  return (
    <div
      data-cost-row={rowId}
      data-cost-delay={horseIdx * 120 + 60}
      className="flex items-center justify-between px-5 py-3 border-b border-[var(--border,rgba(255,255,255,0.1))] bg-[var(--background-secondary,#0a0a0a)]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      <span className="text-[11px] font-medium uppercase tracking-widest text-[var(--foreground-muted,#71717a)]">
        Preco de Compra
      </span>
      <span
        className="text-lg font-serif font-bold tabular-nums"
        style={{
          background: "linear-gradient(135deg, var(--gold, #C5A059) 0%, #fff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {formatEUR(value)}
      </span>
    </div>
  );
}

function SummaryRow({
  uid,
  horseIdx,
  label,
  value,
  rowKey,
  isVisible,
  accent,
  subtitle,
}: {
  uid: string;
  horseIdx: number;
  label: string;
  value: number;
  rowKey: string;
  isVisible: boolean;
  accent: boolean;
  subtitle?: string;
}) {
  const rowId = `${uid}-summary-${rowKey}-${horseIdx}`;
  const delayMap: Record<string, number> = {
    annual: 700,
    total5: 800,
    value5: 900,
  };
  return (
    <div
      data-cost-row={rowId}
      data-cost-delay={horseIdx * 120 + (delayMap[rowKey] ?? 700)}
      className={`flex items-center justify-between px-5 py-3 ${
        accent
          ? "border-y border-[var(--gold,#C5A059)]/20 bg-[var(--gold,#C5A059)]/[0.04]"
          : "border-t border-[var(--border,rgba(255,255,255,0.1))]"
      }`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      <div className="flex flex-col">
        <span
          className={`text-xs font-semibold ${
            accent ? "text-[var(--gold,#C5A059)]" : "text-[var(--foreground-secondary,#a1a1aa)]"
          }`}
        >
          {label}
        </span>
        {subtitle && (
          <span className="text-[10px] text-[var(--foreground-muted,#71717a)]">{subtitle}</span>
        )}
      </div>
      <span
        className={`text-base font-serif font-bold tabular-nums ${
          accent ? "text-[var(--gold,#C5A059)]" : "text-[var(--foreground,#ededed)]"
        }`}
      >
        {formatEUR(value)}
      </span>
    </div>
  );
}

function ROIFooter({
  uid,
  horseIdx,
  roi,
  isVisible,
}: {
  uid: string;
  horseIdx: number;
  roi: number;
  isVisible: boolean;
}) {
  const rowId = `${uid}-roi-${horseIdx}`;
  const isPositive = roi >= 0;
  const roiColor = isPositive ? "#22c55e" : "#ef4444";
  const roiBg = isPositive ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)";

  return (
    <div
      data-cost-row={rowId}
      data-cost-delay={horseIdx * 120 + 1000}
      className="flex items-center justify-between px-5 py-4 bg-[var(--background-secondary,#0a0a0a)]"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-secondary,#a1a1aa)]">
        ROI Liquido
      </span>
      <span
        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold tabular-nums"
        style={{
          color: roiColor,
          backgroundColor: roiBg,
        }}
      >
        {isPositive ? "+" : ""}
        {roi.toFixed(1)}%
      </span>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ScoreFactor {
  name: string;
  weight: string;
  score: number;
  max: number;
}

interface ScoreBreakdownProps {
  factors: ScoreFactor[];
  total: number;
  buttonLabel?: string;
}

export default function ScoreBreakdown({ factors, total, buttonLabel }: ScoreBreakdownProps) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const comp = t.comparador as Record<string, string>;
  const label = buttonLabel ?? comp?.score_breakdown_btn ?? "Ver detalhe";

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-[10px] text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors"
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="pt-3 space-y-1.5">
            {factors.map((f) => {
              const pct = f.max > 0 ? (f.score / f.max) * 100 : 0;
              return (
                <div key={f.name} className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--foreground-muted)] w-[90px] truncate">
                    {f.name}
                  </span>
                  <span className="text-[9px] text-[var(--foreground-muted)]/60 w-[30px] text-right tabular-nums">
                    {f.weight}
                  </span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--gold)]/60 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[var(--foreground-secondary)] tabular-nums w-[32px] text-right">
                    {f.score}/{f.max}
                  </span>
                </div>
              );
            })}

            {/* Total */}
            <div className="flex items-center gap-2 pt-1.5 border-t border-[var(--border)]/30">
              <span className="text-[10px] font-medium text-[var(--foreground)] w-[90px]">
                Total
              </span>
              <span className="text-[9px] w-[30px]" />
              <div className="flex-1" />
              <span className="text-xs font-semibold text-[var(--gold)] tabular-nums">
                {total}/100
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

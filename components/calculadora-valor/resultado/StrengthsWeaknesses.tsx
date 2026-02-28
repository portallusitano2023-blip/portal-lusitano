"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { TrendingUp, Check, Info, ChevronRight } from "lucide-react";

interface StrengthsWeaknessesProps {
  fortes: string[];
  fracos: string[];
  t: Record<string, any>;
}

export default function StrengthsWeaknesses({ fortes, fracos, t }: StrengthsWeaknessesProps) {
  if (fortes.length === 0 && fracos.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {fortes.length > 0 && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
          <h3 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
            <TrendingUp size={16} />
            {t.calculadora.strengths}
          </h3>
          <ul className="space-y-2">
            {fortes.map((ponto, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]"
              >
                <Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                {ponto}
              </li>
            ))}
          </ul>
        </div>
      )}
      {fracos.length > 0 && (
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
          <h3 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
            <Info size={16} />
            {t.calculadora.attention_areas}
          </h3>
          <ul className="space-y-2">
            {fracos.map((ponto, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]"
              >
                <ChevronRight size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                {ponto}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

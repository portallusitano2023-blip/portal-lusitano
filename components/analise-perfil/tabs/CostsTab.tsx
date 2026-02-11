"use client";

import { DollarSign, Check, Activity } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { results } from "@/components/analise-perfil/data/results";
import type { Result } from "@/components/analise-perfil/types";

interface CostsTabProps {
  result: Result;
}

export default function CostsTab({ result }: CostsTabProps) {
  const { t } = useLanguage();

  return (
    <div key="custos" className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      <div className="bg-gradient-to-b from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 p-8">
        <h3 className="flex items-center gap-2 text-xl font-serif text-white mb-6">
          <DollarSign className="text-[#C5A059]" size={24} />
          {t.analise_perfil.annual_costs}
        </h3>
        <div className="text-center mb-8">
          <p className="text-sm text-zinc-500 mb-2">{t.analise_perfil.estimated_range}</p>
          <p className="text-4xl font-serif text-white">
            {result.annualCosts.min.toLocaleString()} - {result.annualCosts.max.toLocaleString()}{" "}
            {t.analise_perfil.euros}
          </p>
        </div>
        <div className="bg-zinc-900/50 p-6 border border-white/5">
          <h4 className="text-sm uppercase tracking-wider text-[#C5A059] mb-4">
            {t.analise_perfil.whats_included}
          </h4>
          <div className="grid md:grid-cols-2 gap-3">
            {result.annualCosts.includes.map((it, i) => (
              <div key={i} className="flex items-center gap-2 text-zinc-300 text-sm">
                <Check className="text-[#C5A059] flex-shrink-0" size={14} />
                {it}
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-zinc-500 mt-6 text-center">{t.analise_perfil.approx_values}</p>
      </div>
      <div className="bg-zinc-900/30 border border-white/5 p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-white mb-6">
          <Activity className="text-[#C5A059]" size={20} />
          {t.analise_perfil.profile_comparison}
        </h3>
        <div className="space-y-4">
          {Object.entries(results).map(([k, r]) => (
            <div key={k} className="flex items-center gap-4">
              <div
                className={`w-32 text-sm ${k === result.profile ? "text-[#C5A059] font-medium" : "text-zinc-500"}`}
              >
                {r.title.split(" ")[0]}
              </div>
              <div className="flex-1">
                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${k === result.profile ? "bg-[#C5A059]" : "bg-zinc-600"}`}
                    style={{ width: `${(r.annualCosts.max / 50000) * 100}%` }}
                  />
                </div>
              </div>
              <div
                className={`w-48 text-right text-sm ${k === result.profile ? "text-[#C5A059]" : "text-zinc-500"}`}
              >
                {r.annualCosts.min.toLocaleString()} - {r.annualCosts.max.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

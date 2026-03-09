"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import type { FormData, Resultado } from "../types";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

interface ImprovementActionsProps {
  resultado: Resultado;
  form: FormData;
  t: Record<string, any>;
}

export default function ImprovementActions({
  resultado,
  form,
  t: _t,
}: ImprovementActionsProps) {
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);
  const locale = language === "en" ? "en-GB" : language === "es" ? "es-ES" : "pt-PT";

  interface Acao {
    titulo: string;
    descricao: string;
    ganhoEstimado: number;
    prazoMeses: number;
    badge: string;
    badgeColor: string;
  }

  const acoes: Acao[] = [];

  const r = resultado;

  if (!(form.raioX && form.exameVeterinario)) {
    acoes.push({
      titulo: tr("Exame Veterinário + Raio-X", "Veterinary Exam + X-Ray", "Examen Veterinario + Rayos-X"),
      descricao: tr("Documentação completa transmite segurança ao comprador", "Complete documentation conveys confidence to the buyer", "Documentación completa transmite seguridad al comprador"),
      ganhoEstimado: Math.round(r.valorFinal * 0.08),
      prazoMeses: 1,
      badge: tr("Rápido", "Quick", "Rápido"),
      badgeColor: "text-emerald-400 bg-emerald-500/15",
    });
  }
  if (!(form.registoAPSL && form.livroAPSL === "definitivo")) {
    acoes.push({
      titulo: tr("Registo APSL Livro Definitivo", "APSL Definitive Book Registration", "Registro APSL Libro Definitivo"),
      descricao: tr("Valoriza automaticamente no mercado internacional", "Automatically adds value in the international market", "Valoriza automáticamente en el mercado internacional"),
      ganhoEstimado: Math.round(r.valorFinal * 0.18),
      prazoMeses: 3,
      badge: tr("Alto impacto", "High impact", "Alto impacto"),
      badgeColor: "text-[#C5A059] bg-[#C5A059]/15",
    });
  }
  if (form.competicoes === "nenhuma") {
    acoes.push({
      titulo: tr("Participar em Provas Regionais", "Participate in Regional Competitions", "Participar en Pruebas Regionales"),
      descricao: tr("Palmarés aumenta credibilidade e confiança do comprador", "Competition record increases credibility and buyer confidence", "Palmarés aumenta credibilidad y confianza del comprador"),
      ganhoEstimado: Math.round(r.valorFinal * 0.11),
      prazoMeses: 6,
      badge: tr("6 meses", "6 months", "6 meses"),
      badgeColor: "text-blue-400 bg-blue-500/15",
    });
  }
  if (r.percentil < 50) {
    acoes.push({
      titulo: tr("Progressão de Treino (1 nível)", "Training Progression (1 level)", "Progresión de Entrenamiento (1 nivel)"),
      descricao: tr("Subir um nível de treino pode valorizar 40-60%", "Moving up one training level can increase value by 40-60%", "Subir un nivel de entrenamiento puede valorizar 40-60%"),
      ganhoEstimado: Math.round(r.valorFinal * 0.45),
      prazoMeses: 18,
      badge: tr("Longo prazo", "Long term", "Largo plazo"),
      badgeColor: "text-purple-400 bg-purple-500/15",
    });
  }
  if (r.liquidez.score < 65) {
    acoes.push({
      titulo: tr("Certificado de Exportação", "Export Certificate", "Certificado de Exportación"),
      descricao: tr("Abre mercados internacionais com valorização automática", "Opens international markets with automatic valuation", "Abre mercados internacionales con valorización automática"),
      ganhoEstimado: Math.round(r.valorFinal * 0.06),
      prazoMeses: 2,
      badge: tr("Mercado", "Market", "Mercado"),
      badgeColor: "text-amber-400 bg-amber-500/15",
    });
  }

  const top3 = acoes.sort((a, b) => b.ganhoEstimado - a.ganhoEstimado).slice(0, 3);

  if (top3.length === 0) return null;

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)] mb-6">
      <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-4 flex items-center gap-2">
        <Sparkles size={15} className="text-[#C5A059]" />
        Top {top3.length} {tr("Ações de Valorização", "Valuation Actions", "Acciones de Valorización")}
      </h3>
      <div className="space-y-3">
        {top3.map((acao, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 bg-[var(--background-card)]/50 rounded-lg border border-[var(--border)]/60"
          >
            <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[10px] font-bold text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="text-sm font-semibold text-[var(--foreground)]">{acao.titulo}</p>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${acao.badgeColor}`}
                >
                  {acao.badge}
                </span>
              </div>
              <p className="text-xs text-[var(--foreground-muted)] leading-snug">
                {acao.descricao}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-emerald-400">
                +{acao.ganhoEstimado.toLocaleString(locale)}€
              </p>
              <p className="text-[10px] text-[var(--foreground-muted)]">
                {acao.prazoMeses === 1 ? tr("1 mês", "1 month", "1 mes") : `${acao.prazoMeses} ${tr("meses", "months", "meses")}`}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-[var(--foreground-muted)]/50 mt-3">
        {tr(
          "Estimativas baseadas no modelo de valorização — não constituem garantia de mercado.",
          "Estimates based on the valuation model — do not constitute a market guarantee.",
          "Estimaciones basadas en el modelo de valorización — no constituyen garantía de mercado."
        )}
      </p>
    </div>
  );
}

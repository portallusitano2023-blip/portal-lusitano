"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Sparkles } from "lucide-react";
import type { FormData, Resultado } from "../types";

interface ImprovementActionsProps {
  resultado: Resultado;
  form: FormData;
  t: Record<string, any>;
}

export default function ImprovementActions({
  resultado,
  form: _form,
  t: _t,
}: ImprovementActionsProps) {
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

  if (!r.pontosForteseFracos.fortes.includes("Documentação veterinária completa")) {
    acoes.push({
      titulo: "Exame Veterinário + Raio-X",
      descricao: "Documentação completa transmite segurança ao comprador",
      ganhoEstimado: Math.round(r.valorFinal * 0.08),
      prazoMeses: 1,
      badge: "Rápido",
      badgeColor: "text-emerald-400 bg-emerald-500/15",
    });
  }
  if (!r.pontosForteseFracos.fortes.includes("Registo APSL Livro Definitivo")) {
    acoes.push({
      titulo: "Registo APSL Livro Definitivo",
      descricao: "Valoriza automaticamente no mercado internacional",
      ganhoEstimado: Math.round(r.valorFinal * 0.18),
      prazoMeses: 3,
      badge: "Alto impacto",
      badgeColor: "text-[#C5A059] bg-[#C5A059]/15",
    });
  }
  if (r.pontosForteseFracos.fracos.some((f) => f.includes("competição"))) {
    acoes.push({
      titulo: "Participar em Provas Regionais",
      descricao: "Palmarés aumenta credibilidade e confiança do comprador",
      ganhoEstimado: Math.round(r.valorFinal * 0.11),
      prazoMeses: 6,
      badge: "6 meses",
      badgeColor: "text-blue-400 bg-blue-500/15",
    });
  }
  if (r.percentil < 50) {
    acoes.push({
      titulo: "Progressão de Treino (1 nível)",
      descricao: "Subir um nível de treino pode valorizar 40-60%",
      ganhoEstimado: Math.round(r.valorFinal * 0.45),
      prazoMeses: 18,
      badge: "Longo prazo",
      badgeColor: "text-purple-400 bg-purple-500/15",
    });
  }
  if (r.liquidez.score < 65) {
    acoes.push({
      titulo: "Certificado de Exportação",
      descricao: "Abre mercados internacionais com valorização automática",
      ganhoEstimado: Math.round(r.valorFinal * 0.06),
      prazoMeses: 2,
      badge: "Mercado",
      badgeColor: "text-amber-400 bg-amber-500/15",
    });
  }

  const top3 = acoes.sort((a, b) => b.ganhoEstimado - a.ganhoEstimado).slice(0, 3);

  if (top3.length === 0) return null;

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)] mb-6">
      <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-4 flex items-center gap-2">
        <Sparkles size={15} className="text-[#C5A059]" />
        Top {top3.length} Ações de Valorização
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
                +{acao.ganhoEstimado.toLocaleString("pt-PT")}€
              </p>
              <p className="text-[10px] text-[var(--foreground-muted)]">
                {acao.prazoMeses === 1 ? "1 mês" : `${acao.prazoMeses} meses`}
              </p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-[var(--foreground-muted)]/50 mt-3">
        Estimativas baseadas no modelo de valorização — não constituem garantia de mercado.
      </p>
    </div>
  );
}

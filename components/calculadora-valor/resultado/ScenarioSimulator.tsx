"use client";

import { useMemo } from "react";
import { Zap } from "lucide-react";
import { calcularValor } from "../utils";
import type { FormData, Resultado } from "../types";
import { TREINO_LABELS, COMP_LABELS } from "@/lib/tools/shared-data";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

interface ScenarioSimulatorProps {
  form: FormData;
  resultado: Resultado;
}

export default function ScenarioSimulator({ form, resultado }: ScenarioSimulatorProps) {
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);
  const locale = language === "en" ? "en-GB" : language === "es" ? "es-ES" : "pt-PT";

  const TREINO_PROGRESSAO: Record<string, string> = {
    potro: "desbravado",
    desbravado: "iniciado",
    iniciado: "elementar",
    elementar: "medio",
    medio: "avancado",
    avancado: "alta_escola",
    alta_escola: "grand_prix",
  };

  type Cenario = {
    titulo: string;
    descricao: string;
    valorNovo: number;
    delta: number;
    deltaPercent: number;
    emoji: string;
  };

  const top = useMemo(() => {
    try {
      const cenarios: Cenario[] = [];

  // Cenário 1: Subir nível de treino (se não for já o máximo)
  if (TREINO_PROGRESSAO[form.treino]) {
    const novoTreino = TREINO_PROGRESSAO[form.treino];
    const novoForm = { ...form, treino: novoTreino as FormData["treino"] };
    const novoResultado = calcularValor(novoForm, tr);
    cenarios.push({
      titulo: `${tr("Treino", "Training", "Entrenamiento")} → ${TREINO_LABELS[novoTreino] ?? novoTreino}`,
      descricao: tr("Progressão de nível de treino", "Training level progression", "Progresión de nivel de entrenamiento"),
      valorNovo: novoResultado.valorFinal,
      delta: novoResultado.valorFinal - resultado.valorFinal,
      deltaPercent: Math.round(
        ((novoResultado.valorFinal - resultado.valorFinal) / resultado.valorFinal) * 100
      ),
      emoji: "📈",
    });
  }

  // Cenário 2: Documentação Veterinária Completa
  if (!form.raioX || !form.exameVeterinario) {
    const novoForm = { ...form, raioX: true, exameVeterinario: true };
    const novoResultado = calcularValor(novoForm, tr);
    cenarios.push({
      titulo: tr("Documentação Veterinária Completa", "Complete Veterinary Documentation", "Documentación Veterinaria Completa"),
      descricao: tr("Raio-X + Exame veterinário", "X-ray + Veterinary examination", "Rayos-X + Examen veterinario"),
      valorNovo: novoResultado.valorFinal,
      delta: novoResultado.valorFinal - resultado.valorFinal,
      deltaPercent: Math.round(
        ((novoResultado.valorFinal - resultado.valorFinal) / resultado.valorFinal) * 100
      ),
      emoji: "🩺",
    });
  }

  // Cenário 3: Mudar mercado para Alemanha (se estiver em PT)
  if (form.mercado === "Portugal") {
    const novoForm = { ...form, mercado: "Alemanha" };
    const novoResultado = calcularValor(novoForm, tr);
    cenarios.push({
      titulo: tr("Venda para Mercado Alemão", "Sale to German Market", "Venta al Mercado Alemán"),
      descricao: tr("Reorientar para mercado internacional", "Redirect to international market", "Reorientar al mercado internacional"),
      valorNovo: novoResultado.valorFinal,
      delta: novoResultado.valorFinal - resultado.valorFinal,
      deltaPercent: Math.round(
        ((novoResultado.valorFinal - resultado.valorFinal) / resultado.valorFinal) * 100
      ),
      emoji: "🌍",
    });
  }

  // Cenário 4: Subir competições
  const COMP_UPGRADE: Record<string, string> = {
    nenhuma: "regional",
    regional: "nacional",
    nacional: "cdi1",
    cdi1: "cdi3",
  };
  if (COMP_UPGRADE[form.competicoes]) {
    const novoComp = COMP_UPGRADE[form.competicoes];
    const novoForm = { ...form, competicoes: novoComp as FormData["competicoes"] };
    const novoResultado = calcularValor(novoForm, tr);
    cenarios.push({
      titulo: `${tr("Competir em", "Compete at", "Competir en")} ${COMP_LABELS[novoComp] ?? novoComp}`,
      descricao: tr("Progressão no palmarés desportivo", "Progression in competition record", "Progresión en el palmarés deportivo"),
      valorNovo: novoResultado.valorFinal,
      delta: novoResultado.valorFinal - resultado.valorFinal,
      deltaPercent: Math.round(
        ((novoResultado.valorFinal - resultado.valorFinal) / resultado.valorFinal) * 100
      ),
      emoji: "🏆",
    });
  }

  // Cenário 5: Certificado de exportação
  if (!(form.certificadoExportacao ?? false) && form.mercado !== "Portugal") {
    const novoForm = { ...form, certificadoExportacao: true };
    const novoResultado = calcularValor(novoForm, tr);
    cenarios.push({
      titulo: tr("Certificado de Exportação", "Export Certificate", "Certificado de Exportación"),
      descricao: tr("Documentação para venda internacional", "Documentation for international sale", "Documentación para venta internacional"),
      valorNovo: novoResultado.valorFinal,
      delta: novoResultado.valorFinal - resultado.valorFinal,
      deltaPercent: Math.round(
        ((novoResultado.valorFinal - resultado.valorFinal) / resultado.valorFinal) * 100
      ),
      emoji: "📜",
    });
  }

      return cenarios.sort((a, b) => b.delta - a.delta).slice(0, 4);
    } catch {
      return [];
    }
  }, [form, resultado, tr]);

  if (top.length === 0) return null;

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-xl p-5 border border-[var(--border)] mb-6">
      <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] mb-1 flex items-center gap-2">
        <Zap size={15} className="text-[#C5A059]" />
        {tr("Simulador de Cenários", "Scenario Simulator", "Simulador de Escenarios")}
      </h3>
      <p className="text-xs text-[var(--foreground-muted)] mb-4">
        {tr(
          "Impacto estimado de cada melhoria no valor actual de",
          "Estimated impact of each improvement on the current value of",
          "Impacto estimado de cada mejora en el valor actual de"
        )}{" "}
        {resultado.valorFinal.toLocaleString(locale)}€
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {top.map((c, i) => (
          <div
            key={i}
            className="bg-[var(--background-card)]/50 rounded-lg p-3 border border-[var(--border)]/60 flex items-center gap-3"
          >
            <span className="text-xl shrink-0">{c.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)] truncate">{c.titulo}</p>
              <p className="text-[10px] text-[var(--foreground-muted)]">{c.descricao}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-emerald-400">
                +{c.delta.toLocaleString(locale)}€
              </p>
              <p className="text-[10px] text-emerald-500/70">+{c.deltaPercent}%</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-[var(--foreground-muted)]/40 mt-3">
        {tr(
          "Simulações baseadas no modelo interno — valores ilustrativos, não constituem garantia.",
          "Simulations based on internal model — illustrative values, not a guarantee.",
          "Simulaciones basadas en el modelo interno — valores ilustrativos, no constituyen garantía."
        )}
      </p>
    </div>
  );
}

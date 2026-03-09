"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo } from "react";
import LocalizedLink from "@/components/LocalizedLink";
import { ChevronRight, BookOpen } from "lucide-react";
import ResultActions from "@/components/tools/ResultActions";
import SourceBadge from "@/components/tools/SourceBadge";
import MethodologyPanel from "@/components/tools/MethodologyPanel";
import ToolCrossCTA from "@/components/tools/ToolCrossCTA";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type { FormData, Resultado } from "../types";

interface MethodologyFooterProps {
  form: FormData;
  resultado: Resultado;
  isSubscribed: boolean;
  isExporting: boolean;
  onExportPDF: () => void;
  onShare: () => void;
  onSendEmail?: () => Promise<void>;
  onComparar?: () => void;
  onVerificarCompat?: () => void;
  t: Record<string, any>;
}

export default function MethodologyFooter({
  form,
  resultado: _resultado,
  isSubscribed,
  isExporting,
  onExportPDF,
  onShare,
  onSendEmail,
  onComparar,
  onVerificarCompat,
  t,
}: MethodologyFooterProps) {
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);

  return (
    <>
      {/* Informacoes do Cavalo */}
      <div className="bg-[var(--background-secondary)]/30 rounded-xl p-6 border border-[var(--border)]">
        <h3 className="text-sm font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
          {t.calculadora.eval_summary}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-[var(--foreground-muted)] block">{t.calculadora.result_age}</span>
            <span className="text-[var(--foreground-secondary)]">
              {form.idade} {t.calculadora.label_years}
            </span>
          </div>
          <div>
            <span className="text-[var(--foreground-muted)] block">{t.calculadora.result_sex}</span>
            <span className="text-[var(--foreground-secondary)]">
              {form.sexo === "garanhao"
                ? t.calculadora.sex_stallion
                : form.sexo === "egua"
                  ? t.calculadora.sex_mare
                  : t.calculadora.sex_gelding}
            </span>
          </div>
          <div>
            <span className="text-[var(--foreground-muted)] flex items-center gap-1">
              {t.calculadora.result_level}
              <SourceBadge
                source="FEI"
                tooltip={
                  (t.calculadora as Record<string, string>).source_treino ??
                  tr("Níveis de treino referenciados às escalas da FEI", "Training levels referenced to FEI scales", "Niveles de entrenamiento referenciados a las escalas de la FEI")
                }
              />
            </span>
            <span className="text-[var(--foreground-secondary)] capitalize">
              {form.treino.replace("_", " ")}
            </span>
          </div>
          <div>
            <span className="text-[var(--foreground-muted)] block">
              {t.calculadora.result_market}
            </span>
            <span className="text-[var(--foreground-secondary)]">{form.mercado}</span>
          </div>
        </div>
      </div>

      <ResultActions
        onExportPDF={onExportPDF}
        onShare={onShare}
        onPrint={() => window.print()}
        onSendEmail={onSendEmail}
        isPremium={isSubscribed}
        isExporting={isExporting}
      />

      <div className="mt-6 mb-4">
        <ToolCrossCTA currentTool="calculadora-valor" />
      </div>

      <MethodologyPanel
        title={
          (t.calculadora as Record<string, string>).methodology_panel_title ??
          tr("Metodologia de Avaliação", "Valuation Methodology", "Metodología de Evaluación")
        }
        factors={[
          {
            name: (t.calculadora as Record<string, string>).factor_conformacao ?? tr("Conformação", "Conformation", "Conformación"),
            weight: "15%",
            description:
              (t.calculadora as Record<string, string>).factor_conformacao_desc ??
              tr("Avaliação segundo padrões APSL", "Evaluation per APSL standards", "Evaluación según estándares APSL"),
            standard: "APSL",
          },
          {
            name: (t.calculadora as Record<string, string>).factor_andamentos ?? tr("Andamentos", "Gaits", "Movimientos"),
            weight: "15%",
            description:
              (t.calculadora as Record<string, string>).factor_andamentos_desc ??
              tr("Elevação, suspensão, regularidade", "Elevation, suspension, regularity", "Elevación, suspensión, regularidad"),
            standard: "FEI",
          },
          {
            name: (t.calculadora as Record<string, string>).factor_treino ?? tr("Treino", "Training", "Entrenamiento"),
            weight: "15%",
            description:
              (t.calculadora as Record<string, string>).factor_treino_desc ??
              tr("Nível conforme escalas FEI", "Level per FEI scales", "Nivel según escalas FEI"),
            standard: "FEI",
          },
          {
            name: (t.calculadora as Record<string, string>).factor_linhagem ?? tr("Linhagem", "Lineage", "Linaje"),
            weight: "12%",
            description:
              (t.calculadora as Record<string, string>).factor_linhagem_desc ??
              tr("Qualidade do pedigree e registo", "Pedigree quality and registration", "Calidad del pedigrí y registro"),
          },
          {
            name: (t.calculadora as Record<string, string>).factor_competicoes ?? tr("Competições", "Competitions", "Competiciones"),
            weight: "10%",
            description:
              (t.calculadora as Record<string, string>).factor_competicoes_desc ??
              tr("Historial competitivo e resultados", "Competition history and results", "Historial competitivo y resultados"),
          },
          {
            name: (t.calculadora as Record<string, string>).factor_blup ?? "BLUP",
            weight: "8%",
            description:
              (t.calculadora as Record<string, string>).factor_blup_desc ??
              tr("Estimativa de mérito genético", "Genetic merit estimate", "Estimación de mérito genético"),
            standard: tr("modelo", "model", "modelo"),
          },
          {
            name: (t.calculadora as Record<string, string>).factor_temperamento ?? tr("Temperamento", "Temperament", "Temperamento"),
            weight: "8%",
            description:
              (t.calculadora as Record<string, string>).factor_temperamento_desc ??
              tr("Docilidade e predisposição para trabalho", "Docility and work predisposition", "Docilidad y predisposición para el trabajo"),
          },
          {
            name: (t.calculadora as Record<string, string>).factor_saude ?? tr("Saúde", "Health", "Salud"),
            weight: "7%",
            description:
              (t.calculadora as Record<string, string>).factor_saude_desc ??
              tr("Historial clínico e documentação veterinária", "Clinical history and veterinary documentation", "Historial clínico y documentación veterinaria"),
            standard: tr("veterinário", "veterinary", "veterinario"),
          },
          {
            name: (t.calculadora as Record<string, string>).factor_idade ?? tr("Idade", "Age", "Edad"),
            weight: "5%",
            description:
              (t.calculadora as Record<string, string>).factor_idade_desc ??
              tr("Faixa etária ideal: 6-12 anos", "Ideal age range: 6-12 years", "Rango de edad ideal: 6-12 años"),
          },
          {
            name: (t.calculadora as Record<string, string>).factor_mercado ?? tr("Mercado", "Market", "Mercado"),
            weight: "5%",
            description:
              (t.calculadora as Record<string, string>).factor_mercado_desc ??
              tr("Dinâmicas regionais de oferta e procura", "Regional supply and demand dynamics", "Dinámicas regionales de oferta y demanda"),
            standard: tr("mercado", "market", "mercado"),
          },
        ]}
        limitations={[
          (t.calculadora as Record<string, string>).limitation_1 ??
            tr("Não considera condição física actual do cavalo", "Does not consider the horse's current physical condition", "No considera la condición física actual del caballo"),
          (t.calculadora as Record<string, string>).limitation_2 ??
            tr("BLUP é uma estimativa simplificada, não oficial APSL", "BLUP is a simplified estimate, not official APSL", "BLUP es una estimación simplificada, no oficial APSL"),
          (t.calculadora as Record<string, string>).limitation_3 ??
            tr("Valores de mercado baseados em médias sectoriais", "Market values based on sector averages", "Valores de mercado basados en promedios sectoriales"),
          (t.calculadora as Record<string, string>).limitation_4 ??
            tr("Não substitui avaliação presencial por profissional qualificado", "Does not replace in-person evaluation by a qualified professional", "No sustituye la evaluación presencial por un profesional cualificado"),
        ]}
        version={(t.calculadora as Record<string, string>).methodology_version ?? tr("v2.1 — Fev 2026", "v2.1 — Feb 2026", "v2.1 — Feb 2026")}
        references={[
          (t.calculadora as Record<string, string>).ref_apsl ?? tr("Padrões de conformação APSL", "APSL conformation standards", "Estándares de conformación APSL"),
          (t.calculadora as Record<string, string>).ref_fei ?? tr("Escalas de treino FEI", "FEI training scales", "Escalas de entrenamiento FEI"),
          (t.calculadora as Record<string, string>).ref_mercado ??
            tr("Médias mercado equestre PT (2024-2025)", "PT equestrian market averages (2024-2025)", "Promedios del mercado ecuestre PT (2024-2025)"),
        ]}
      />

      <div className="p-4 bg-[var(--background-secondary)]/30 rounded-xl border border-[var(--border)]">
        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
          <strong className="text-[var(--foreground-secondary)]">
            {t.calculadora.disclaimer_title}
          </strong>{" "}
          {t.calculadora.disclaimer_text}
          <span className="block mt-1 text-[10px] text-[var(--foreground-muted)]/40 font-mono">
            {(t.calculadora as Record<string, string>).methodology_version ?? tr("v2.1 — Fev 2026", "v2.1 — Feb 2026", "v2.1 — Feb 2026")}
          </span>
        </p>
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-[var(--foreground-muted)] mb-4">
          {t.calculadora.need_professional}
        </p>
        <LocalizedLink
          href="/profissionais"
          className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--gold)]/50 text-[var(--gold)] rounded-lg hover:bg-[var(--gold)]/10 transition-colors"
        >
          <BookOpen size={16} />
          {t.calculadora.find_evaluators}
          <ChevronRight size={16} />
        </LocalizedLink>
      </div>
    </>
  );
}

"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { BarChart3, ChevronRight, BookOpen, Scale, User, Dna } from "lucide-react";
import ResultActions from "@/components/tools/ResultActions";
import SourceBadge from "@/components/tools/SourceBadge";
import MethodologyPanel from "@/components/tools/MethodologyPanel";
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
                  "Níveis de treino referenciados às escalas da FEI"
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

      {/* Cross-links — próximos passos */}
      <div className="grid sm:grid-cols-3 gap-3 mt-6 mb-4">
        <Link
          href="/comparador-cavalos"
          className="group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/40 transition-all"
        >
          <Scale
            size={18}
            className="text-[var(--gold)] shrink-0 group-hover:scale-110 transition-transform"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Comparar com outros cavalos
            </p>
            <p className="text-xs text-[var(--foreground-muted)]">
              Compara até 4 candidatos lado a lado
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-[var(--foreground-muted)] ml-auto group-hover:text-[var(--gold)] transition-colors"
          />
        </Link>
        <Link
          href="/analise-perfil"
          className="group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/40 transition-all"
        >
          <User
            size={18}
            className="text-purple-400 shrink-0 group-hover:scale-110 transition-transform"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Analisar o teu perfil</p>
            <p className="text-xs text-[var(--foreground-muted)]">
              Descobre que tipo de comprador és
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-[var(--foreground-muted)] ml-auto group-hover:text-purple-400 transition-colors"
          />
        </Link>
        {onVerificarCompat && (
          <button
            onClick={onVerificarCompat}
            className="group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl hover:border-purple-500/40 transition-all text-left"
          >
            <Dna
              size={18}
              className="text-purple-500 shrink-0 group-hover:scale-110 transition-transform"
            />
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Verificar Compatibilidade
              </p>
              <p className="text-xs text-[var(--foreground-muted)]">
                Avaliar cruzamento deste cavalo
              </p>
            </div>
            <ChevronRight
              size={16}
              className="text-[var(--foreground-muted)] ml-auto group-hover:text-purple-500 transition-colors"
            />
          </button>
        )}
      </div>

      {/* Tool Chain: Comparar com outros cavalos */}
      {onComparar && (
        <button
          onClick={onComparar}
          className="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium hover:bg-blue-500/20 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2"
        >
          <BarChart3 size={16} />
          Comparar com outros cavalos
          <ChevronRight size={16} />
        </button>
      )}

      <MethodologyPanel
        title={
          (t.calculadora as Record<string, string>).methodology_panel_title ??
          "Metodologia de Avaliação"
        }
        factors={[
          {
            name: (t.calculadora as Record<string, string>).factor_conformacao ?? "Conformação",
            weight: "15%",
            description:
              (t.calculadora as Record<string, string>).factor_conformacao_desc ??
              "Avaliação segundo padrões APSL",
            standard: "APSL",
          },
          {
            name: (t.calculadora as Record<string, string>).factor_andamentos ?? "Andamentos",
            weight: "15%",
            description:
              (t.calculadora as Record<string, string>).factor_andamentos_desc ??
              "Elevação, suspensão, regularidade",
            standard: "FEI",
          },
          {
            name: (t.calculadora as Record<string, string>).factor_treino ?? "Treino",
            weight: "15%",
            description:
              (t.calculadora as Record<string, string>).factor_treino_desc ??
              "Nível conforme escalas FEI",
            standard: "FEI",
          },
          {
            name: (t.calculadora as Record<string, string>).factor_linhagem ?? "Linhagem",
            weight: "12%",
            description:
              (t.calculadora as Record<string, string>).factor_linhagem_desc ??
              "Qualidade do pedigree e registo",
          },
          {
            name: (t.calculadora as Record<string, string>).factor_competicoes ?? "Competições",
            weight: "10%",
            description:
              (t.calculadora as Record<string, string>).factor_competicoes_desc ??
              "Historial competitivo e resultados",
          },
          {
            name: (t.calculadora as Record<string, string>).factor_blup ?? "BLUP",
            weight: "8%",
            description:
              (t.calculadora as Record<string, string>).factor_blup_desc ??
              "Estimativa de mérito genético",
            standard: "modelo",
          },
          {
            name: (t.calculadora as Record<string, string>).factor_temperamento ?? "Temperamento",
            weight: "8%",
            description:
              (t.calculadora as Record<string, string>).factor_temperamento_desc ??
              "Docilidade e predisposição para trabalho",
          },
          {
            name: (t.calculadora as Record<string, string>).factor_saude ?? "Saúde",
            weight: "7%",
            description:
              (t.calculadora as Record<string, string>).factor_saude_desc ??
              "Historial clínico e documentação veterinária",
            standard: "veterinário",
          },
          {
            name: (t.calculadora as Record<string, string>).factor_idade ?? "Idade",
            weight: "5%",
            description:
              (t.calculadora as Record<string, string>).factor_idade_desc ??
              "Faixa etária ideal: 6-12 anos",
          },
          {
            name: (t.calculadora as Record<string, string>).factor_mercado ?? "Mercado",
            weight: "5%",
            description:
              (t.calculadora as Record<string, string>).factor_mercado_desc ??
              "Dinâmicas regionais de oferta e procura",
            standard: "mercado",
          },
        ]}
        limitations={[
          (t.calculadora as Record<string, string>).limitation_1 ??
            "Não considera condição física actual do cavalo",
          (t.calculadora as Record<string, string>).limitation_2 ??
            "BLUP é uma estimativa simplificada, não oficial APSL",
          (t.calculadora as Record<string, string>).limitation_3 ??
            "Valores de mercado baseados em médias sectoriais",
          (t.calculadora as Record<string, string>).limitation_4 ??
            "Não substitui avaliação presencial por profissional qualificado",
        ]}
        version={(t.calculadora as Record<string, string>).methodology_version ?? "v2.1 — Fev 2026"}
        references={[
          (t.calculadora as Record<string, string>).ref_apsl ?? "Padrões de conformação APSL",
          (t.calculadora as Record<string, string>).ref_fei ?? "Escalas de treino FEI",
          (t.calculadora as Record<string, string>).ref_mercado ??
            "Médias mercado equestre PT (2024-2025)",
        ]}
      />

      <div className="p-4 bg-[var(--background-secondary)]/30 rounded-xl border border-[var(--border)]">
        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
          <strong className="text-[var(--foreground-secondary)]">
            {t.calculadora.disclaimer_title}
          </strong>{" "}
          {t.calculadora.disclaimer_text}
          <span className="block mt-1 text-[10px] text-[var(--foreground-muted)]/40 font-mono">
            {(t.calculadora as Record<string, string>).methodology_version ?? "v2.1 — Fev 2026"}
          </span>
        </p>
      </div>

      <div className="text-center pt-4">
        <p className="text-sm text-[var(--foreground-muted)] mb-4">
          {t.calculadora.need_professional}
        </p>
        <Link
          href="/profissionais"
          className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--gold)]/50 text-[var(--gold)] rounded-lg hover:bg-[var(--gold)]/10 transition-colors"
        >
          <BookOpen size={16} />
          {t.calculadora.find_evaluators}
          <ChevronRight size={16} />
        </Link>
      </div>
    </>
  );
}

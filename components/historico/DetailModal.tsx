"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import {
  type ToolUsageRecord,
  type ToolConfigItem,
  getToolConfig,
  FALLBACK_CONFIG,
  formatDate,
  formatTime,
  langToLocale,
} from "./types";

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-white/5 last:border-0">
      <span className="text-xs text-white/40 flex-shrink-0">{label}</span>
      <span className="text-xs text-white/80 text-right font-medium">{value}</span>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] uppercase tracking-widest text-[#C5A059]/60 mb-2">{title}</p>
      <div className="bg-white/3 rounded-xl px-4 py-1 border border-white/5">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-tool detail renderers
// ---------------------------------------------------------------------------

function CalculadoraDetails({
  record,
  tr,
  locale,
}: {
  record: ToolUsageRecord;
  tr: ReturnType<typeof createTranslator>;
  locale: string;
}) {
  const r = (record.result_data ?? {}) as Record<string, unknown>;
  const f = (record.form_data ?? {}) as Record<string, unknown>;

  const valorFinal = r.valorFinal ?? r.estimatedValue;
  const valorMin = r.valorMin ?? (r.range as Record<string, unknown>)?.min;
  const valorMax = r.valorMax ?? (r.range as Record<string, unknown>)?.max;
  const multiplicador = r.multiplicador;

  return (
    <>
      {!!(f.nome || f.idade || f.sexo) && (
        <DetailSection title={tr("Cavalo Avaliado", "Horse Evaluated", "Caballo Evaluado")}>
          {!!f.nome && <DetailRow label={tr("Nome", "Name", "Nombre")} value={String(f.nome)} />}
          {!!f.idade && (
            <DetailRow
              label={tr("Idade", "Age", "Edad")}
              value={`${f.idade} ${tr("anos", "years", "años")}`}
            />
          )}
          {!!f.sexo && <DetailRow label={tr("Sexo", "Sex", "Sexo")} value={String(f.sexo)} />}
          {!!f.pelagem && (
            <DetailRow label={tr("Pelagem", "Coat", "Capa")} value={String(f.pelagem)} />
          )}
        </DetailSection>
      )}
      <DetailSection
        title={tr("Resultado da Avaliação", "Evaluation Result", "Resultado de la Evaluación")}
      >
        {!!valorFinal && (
          <DetailRow
            label={tr("Valor estimado", "Estimated value", "Valor estimado")}
            value={`${Number(valorFinal).toLocaleString(locale)} \u20AC`}
          />
        )}
        {!!(valorMin && valorMax) && (
          <DetailRow
            label={tr("Intervalo de confiança", "Confidence interval", "Intervalo de confianza")}
            value={`${Number(valorMin).toLocaleString(locale)} \u20AC \u2014 ${Number(valorMax).toLocaleString(locale)} \u20AC`}
          />
        )}
        {!!multiplicador && (
          <DetailRow
            label={tr("Multiplicador de mercado", "Market multiplier", "Multiplicador de mercado")}
            value={`\u00D7${multiplicador}`}
          />
        )}
      </DetailSection>
    </>
  );
}

function VerificadorDetails({
  record,
  tr,
}: {
  record: ToolUsageRecord;
  tr: ReturnType<typeof createTranslator>;
}) {
  const r = (record.result_data ?? {}) as Record<string, unknown>;
  const f = (record.form_data ?? {}) as Record<string, unknown>;

  const score = r.compatibilityScore ?? r.score;
  const garanhaoNome = (f.garanhao as Record<string, unknown>)?.nome ?? f.garanhaoNome;
  const eguaNome = (f.egua as Record<string, unknown>)?.nome ?? f.eguaNome;
  const coi = r.coi ?? r.consanguinidade;

  const getScoreLabel = (s: number) => {
    if (s >= 80)
      return tr("Excelente compatibilidade", "Excellent compatibility", "Excelente compatibilidad");
    if (s >= 65) return tr("Boa compatibilidade", "Good compatibility", "Buena compatibilidad");
    if (s >= 50)
      return tr("Compatibilidade moderada", "Moderate compatibility", "Compatibilidad moderada");
    return tr("Compatibilidade baixa", "Low compatibility", "Compatibilidad baja");
  };

  return (
    <>
      {!!(garanhaoNome || eguaNome) && (
        <DetailSection title={tr("Par Analisado", "Analyzed Pair", "Par Analizado")}>
          {!!garanhaoNome && (
            <DetailRow
              label={tr("Garanhão", "Stallion", "Semental")}
              value={String(garanhaoNome)}
            />
          )}
          {!!eguaNome && <DetailRow label={tr("Égua", "Mare", "Yegua")} value={String(eguaNome)} />}
        </DetailSection>
      )}
      <DetailSection
        title={tr(
          "Resultado de Compatibilidade",
          "Compatibility Result",
          "Resultado de Compatibilidad"
        )}
      >
        {score !== undefined && score !== null && (
          <>
            <DetailRow
              label={tr(
                "Score de compatibilidade",
                "Compatibility score",
                "Score de compatibilidad"
              )}
              value={`${Math.round(Number(score))}%`}
            />
            <DetailRow
              label={tr("Classificação", "Classification", "Clasificación")}
              value={getScoreLabel(Number(score))}
            />
          </>
        )}
        {coi !== undefined && coi !== null && (
          <DetailRow
            label={tr(
              "Coeficiente de consanguinidade",
              "Inbreeding coefficient",
              "Coeficiente de consanguinidad"
            )}
            value={`${Number(coi).toFixed(2)}%`}
          />
        )}
      </DetailSection>
    </>
  );
}

function ComparadorDetails({
  record,
  tr,
}: {
  record: ToolUsageRecord;
  tr: ReturnType<typeof createTranslator>;
}) {
  const r = record.result_data ?? {};
  const winner = r.winner;
  const scores = r.scores as Record<string, number> | undefined;

  return (
    <>
      {winner && (
        <DetailSection title={tr("Resultado", "Result", "Resultado")}>
          <DetailRow
            label={tr("Cavalo vencedor", "Winning horse", "Caballo ganador")}
            value={String(winner)}
          />
        </DetailSection>
      )}
      {scores && Object.keys(scores).length > 0 && (
        <DetailSection title={tr("Pontuações", "Scores", "Puntuaciones")}>
          {Object.entries(scores).map(([nome, score]) => (
            <DetailRow key={nome} label={nome} value={String(Math.round(score))} />
          ))}
        </DetailSection>
      )}
    </>
  );
}

function PerfilDetails({
  record,
  tr,
}: {
  record: ToolUsageRecord;
  tr: ReturnType<typeof createTranslator>;
}) {
  const r = record.result_data ?? {};
  const profileType = r.profileType ?? r.profile;

  const profileLabels: Record<string, string> = {
    competidor: tr("Competidor de Elite", "Elite Competitor", "Competidor de Elite"),
    tradicional: tr("Cavaleiro Tradicional", "Traditional Rider", "Jinete Tradicional"),
    criador: tr(
      "Criador & Investidor Genético",
      "Breeder & Genetic Investor",
      "Criador e Inversor Genético"
    ),
    amador: tr("Cavaleiro de Lazer", "Leisure Rider", "Jinete de Ocio"),
  };

  const profileLabel = profileType
    ? (profileLabels[String(profileType).toLowerCase()] ?? String(profileType))
    : null;

  return (
    <>
      {profileLabel && (
        <DetailSection
          title={tr("Perfil Identificado", "Identified Profile", "Perfil Identificado")}
        >
          <DetailRow
            label={tr("Tipo de perfil", "Profile type", "Tipo de perfil")}
            value={profileLabel}
          />
        </DetailSection>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Detail Modal
// ---------------------------------------------------------------------------

interface DetailModalProps {
  record: ToolUsageRecord;
  onClose: () => void;
}

export default function DetailModal({ record, onClose }: DetailModalProps) {
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const locale = langToLocale(language);
  const toolConfig = getToolConfig(tr);

  const config: ToolConfigItem = toolConfig[record.tool_name] ?? {
    label: record.tool_name,
    ...FALLBACK_CONFIG,
  };

  const { Icon } = config;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const renderDetails = () => {
    const tool = record.tool_name;
    if (tool === "calculadora")
      return <CalculadoraDetails record={record} tr={tr} locale={locale} />;
    if (tool === "verificador" || tool === "compatibilidade")
      return <VerificadorDetails record={record} tr={tr} />;
    if (tool === "comparador") return <ComparadorDetails record={record} tr={tr} />;
    if (tool === "perfil") return <PerfilDetails record={record} tr={tr} />;

    // Generic fallback
    const r = record.result_data;
    if (!r || Object.keys(r).length === 0)
      return (
        <p className="text-xs text-white/30 italic text-center py-4">
          {tr(
            "Sem dados de resultado disponíveis para esta análise.",
            "No result data available for this analysis.",
            "Sin datos de resultado disponibles para este análisis."
          )}
        </p>
      );
    return (
      <DetailSection title={tr("Dados do Resultado", "Result Data", "Datos del Resultado")}>
        {Object.entries(r)
          .slice(0, 8)
          .map(([key, val]) => (
            <DetailRow key={key} label={key} value={String(val)} />
          ))}
      </DetailSection>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${tr("Detalhes", "Details", "Detalles")}: ${config.label}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-[#111111] border border-[#C5A059]/20 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <div
            className={`flex-shrink-0 h-9 w-9 rounded-full ${config.iconBg} flex items-center justify-center`}
          >
            <Icon className={`h-4 w-4 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{config.label}</p>
            <p className="text-xs text-white/40">
              {formatDate(record.created_at, locale)} {tr("às", "at", "a las")}{" "}
              {formatTime(record.created_at, locale)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/50"
            aria-label={tr("Fechar", "Close", "Cerrar")}
          >
            <X className="h-4 w-4 text-white/50" />
          </button>
        </div>

        {/* Modal body */}
        <div className="px-5 pt-5 pb-2 max-h-[60vh] overflow-y-auto">{renderDetails()}</div>

        {/* Modal footer */}
        <div className="px-5 py-4 border-t border-white/5 flex gap-3">
          <Link
            href={config.href}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl
                       bg-gradient-to-r from-[#C5A059] to-[#D4B068]
                       px-4 py-2.5 text-sm font-bold text-black
                       hover:opacity-90 transition-opacity"
            onClick={onClose}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {tr("Repetir análise", "Repeat analysis", "Repetir análisis")}
          </Link>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/50
                       hover:bg-white/5 hover:text-white/70 transition-colors"
          >
            {tr("Fechar", "Close", "Cerrar")}
          </button>
        </div>
      </div>
    </div>
  );
}

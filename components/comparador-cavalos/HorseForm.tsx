"use client";

import { useMemo } from "react";
import { X, Check, Crown, Euro, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";
import Tooltip from "@/components/tools/Tooltip";
import SourceBadge from "@/components/tools/SourceBadge";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type { Cavalo } from "./types";
import { CORES, PELAGENS, LINHAGENS, TREINOS, SEXOS, COMPETICOES, PRESETS, PESOS_DISC, DISC_LABELS, LINHAGENS_FAMOSAS, localizedLabel } from "./data";
import {
  calcularScore,
  calcularPotencial,
  calcularValorPorPonto,
  getScoreFactors,
} from "./calcular";

const ScoreBreakdown = dynamic(() => import("@/components/tools/ScoreBreakdown"));

interface HorseFormProps {
  cavalo: Cavalo;
  index: number;
  totalCavalos: number;
  showAnalise: boolean;
  vencedorId: string;
  melhorValorId: string;
  filtroDisciplina: string;
  duplicateName?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Record<string, any>;
  onUpdate: (id: string, campo: keyof Cavalo, valor: Cavalo[keyof Cavalo]) => void;
  onRemove: (id: string) => void;
  onApplyPreset: (id: string, preset: Partial<Cavalo>) => void;
}

export default function HorseForm({
  cavalo: c,
  index: i,
  totalCavalos,
  showAnalise,
  vencedorId,
  melhorValorId,
  filtroDisciplina,
  duplicateName,
  t,
  onUpdate,
  onRemove,
  onApplyPreset,
}: HorseFormProps) {
  const comp = t.comparador as Record<string, string>;
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);
  const locale = language === "en" ? "en-GB" : language === "es" ? "es-ES" : "pt-PT";

  return (
    <div
      className="bg-[var(--background-secondary)]/50 rounded-2xl border border-[var(--border)] overflow-hidden opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      style={{ animationDelay: `${i * 0.1}s` }}
    >
      {/* Header */}
      <div
        className="p-4 border-b border-[var(--border)] relative"
        style={{ borderTopWidth: 3, borderTopColor: CORES[i] }}
      >
        {/* Live score badge */}
        {(() => {
          const liveScore = calcularScore(c);
          const badgeColor = liveScore >= 70 ? "#22c55e" : liveScore >= 50 ? "#f59e0b" : "#ef4444";
          return (
            <div
              className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg transition-all duration-300 select-none"
              style={{ backgroundColor: badgeColor, boxShadow: `0 0 8px ${badgeColor}55` }}
              title={tr(`Pontuação estimada: ${liveScore}/100`, `Estimated score: ${liveScore}/100`, `Puntuación estimada: ${liveScore}/100`)}
              aria-label={tr(`Pontuação estimada ${liveScore} de 100`, `Estimated score ${liveScore} out of 100`, `Puntuación estimada ${liveScore} de 100`)}
            >
              {liveScore}
            </div>
          );
        })()}
        <div className="flex items-center justify-between pr-12">
          <input
            type="text"
            value={c.nome}
            onChange={(e) => onUpdate(c.id, "nome", e.target.value)}
            className="bg-transparent text-lg font-semibold outline-none flex-1 text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded px-1"
            placeholder={comp.placeholder_horse_name}
            aria-label={tr("Nome do cavalo", "Horse name", "Nombre del caballo")}
          />
          {totalCavalos > 2 && (
            <button
              onClick={() => onRemove(c.id)}
              className="text-[var(--foreground-muted)] hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50 rounded p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={tr("Remover cavalo", "Remove horse", "Eliminar caballo")}
            >
              <X size={18} />
            </button>
          )}
        </div>
        {/* Duplicate name warning (Issue 22) */}
        {duplicateName && c.nome.trim() !== "" && (
          <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1" role="alert">
            {tr(
              "Aviso: outro cavalo tem o mesmo nome",
              "Warning: another horse has the same name",
              "Aviso: otro caballo tiene el mismo nombre"
            )}
          </p>
        )}
        {/* Preset */}
        <select
          className="mt-2 w-full text-xs bg-[var(--background-card)]/40 border border-[var(--border)] text-[var(--foreground-muted)] rounded px-2 py-1 min-h-[44px] cursor-pointer hover:border-[var(--gold)]/40 transition-colors"
          value=""
          onChange={(e) => {
            if (e.target.value && PRESETS[e.target.value])
              onApplyPreset(c.id, PRESETS[e.target.value]);
          }}
        >
          <option value="">
            {tr("— Modelo rápido —", "— Quick preset —", "— Modelo rápido —")}
          </option>
          <option value="potro">
            {tr("Potro em Desenvolvimento", "Developing Foal", "Potro en Desarrollo")}
          </option>
          <option value="competicao">
            {tr("Cavalo de Competição", "Competition Horse", "Caballo de Competición")}
          </option>
          <option value="lazer">{tr("Cavalo de Lazer", "Leisure Horse", "Caballo de Ocio")}</option>
        </select>
        {showAnalise && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {c.id === vencedorId && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-400 text-xs font-semibold shadow-sm shadow-amber-500/10">
                <Crown size={11} /> {comp.best_score}
              </span>
            )}
            {c.id === melhorValorId && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-400 text-xs font-semibold shadow-sm shadow-emerald-500/10">
                <Euro size={11} /> {comp.best_value}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="p-4 space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--foreground-muted)] block mb-1">
              {comp.label_age}
            </label>
            <input
              type="number"
              min="0"
              max="35"
              value={c.idade}
              onChange={(e) => onUpdate(c.id, "idade", Math.max(0, Math.min(35, +e.target.value || 0)))}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
              aria-label={comp.label_age}
            />
          </div>
          <div>
            <label className="text-xs text-[var(--foreground-muted)] block mb-1">
              {comp.label_height}
            </label>
            <input
              type="number"
              min="100"
              max="200"
              value={c.altura}
              onChange={(e) => onUpdate(c.id, "altura", Math.max(100, Math.min(200, +e.target.value || 160)))}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
              aria-label={comp.label_height}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[var(--foreground-muted)] block mb-1">
            {comp.label_sex}
          </label>
          <select
            value={c.sexo}
            onChange={(e) => onUpdate(c.id, "sexo", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
          >
            {SEXOS.map((s) => (
              <option key={s.value} value={s.value}>
                {localizedLabel(s, language)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--foreground-muted)] block mb-1">
              {comp.label_coat}
            </label>
            <select
              value={c.pelagem}
              onChange={(e) => onUpdate(c.id, "pelagem", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            >
              {PELAGENS.map((p) => (
                <option key={p.value} value={p.value}>
                  {localizedLabel(p, language)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--foreground-muted)] block mb-1">
              {comp.label_lineage}
            </label>
            <select
              value={c.linhagem}
              onChange={(e) => onUpdate(c.id, "linhagem", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            >
              {LINHAGENS.map((l) => (
                <option key={l.value} value={l.value}>
                  {localizedLabel(l, language)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-[var(--foreground-muted)] block mb-1">
            {comp.label_training}
          </label>
          <select
            value={c.treino}
            onChange={(e) => onUpdate(c.id, "treino", e.target.value)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
          >
            {TREINOS.map((tItem) => (
              <option key={tItem.value} value={tItem.value}>
                {localizedLabel(tItem, language)}
              </option>
            ))}
          </select>
        </div>

        {/* Sliders */}
        {[
          { field: "conformacao" as const, label: comp.label_conformation },
          { field: "andamentos" as const, label: comp.label_gaits },
          { field: "elevacao" as const, label: tr("Elevação", "Elevation", "Elevación") },
          { field: "regularidade" as const, label: tr("Regularidade", "Regularity", "Regularidad") },
          { field: "temperamento" as const, label: comp.label_temperament },
          { field: "saude" as const, label: comp.label_health },
        ].map(({ field, label }) => (
          <div key={field}>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-[var(--foreground-muted)]">{label}</label>
              <span className="text-xs font-medium" style={{ color: CORES[i] }}>
                {c[field]}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={c[field]}
              onChange={(e) => onUpdate(c.id, field, +e.target.value)}
              aria-label={label}
              aria-valuenow={c[field]}
              aria-valuemin={1}
              aria-valuemax={10}
              aria-valuetext={tr(`${c[field]} de 10`, `${c[field]} out of 10`, `${c[field]} de 10`)}
              className="w-full h-2 bg-[var(--background-card)] rounded-full appearance-none cursor-pointer touch-pan-x"
              style={{ accentColor: CORES[i] }}
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--foreground-muted)] block mb-1">
              {comp.label_competitions}
            </label>
            <select
              value={c.competicoes}
              onChange={(e) => onUpdate(c.id, "competicoes", e.target.value)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            >
              {COMPETICOES.map((co) => (
                <option key={co.value} value={co.value}>
                  {localizedLabel(co, language)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--foreground-muted)] block mb-1">BLUP</label>
            <input
              type="number"
              min="70"
              max="160"
              value={c.blup}
              onChange={(e) => onUpdate(c.id, "blup", Math.max(70, Math.min(160, +e.target.value || 100)))}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
              aria-label="BLUP"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-[var(--foreground-muted)] block mb-1">
              {tr("Prémios", "Awards", "Premios")}
            </label>
            <input
              type="number"
              min="0"
              max="10"
              value={c.premios}
              onChange={(e) => onUpdate(c.id, "premios", Math.max(0, Math.min(10, +e.target.value || 0)))}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
              aria-label={tr("Prémios", "Awards", "Premios")}
            />
          </div>
          <div className="flex items-end">
            <span className="text-[10px] text-[var(--foreground-muted)] pb-2.5">
              {tr("0-10 prémios", "0-10 awards", "0-10 premios")}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-[var(--foreground-muted)]">{comp.label_price}</label>
            {c.preco > 0 &&
              (() => {
                const s = calcularScore(c);
                const vpp = s > 0 ? c.preco / s : 0;
                if (vpp > 700)
                  return (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 font-medium">
                      {tr("Preço Elevado", "High Price", "Precio Elevado")}
                    </span>
                  );
                if (vpp > 0 && vpp < 200)
                  return (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">
                      {tr("Excelente Valor", "Excellent Value", "Excelente Valor")}
                    </span>
                  );
                return null;
              })()}
          </div>
          <input
            type="number"
            min="0"
            step="1000"
            value={c.preco}
            onChange={(e) => onUpdate(c.id, "preco", Math.max(0, +e.target.value || 0))}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            aria-label={comp.label_price}
          />
        </div>

        <button
          onClick={() => onUpdate(c.id, "registoAPSL", !c.registoAPSL)}
          aria-pressed={c.registoAPSL}
          className={`w-full py-2 px-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 ${
            c.registoAPSL
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
              : "border-[var(--border)] text-[var(--foreground-secondary)] hover:border-[var(--border)]"
          }`}
        >
          {c.registoAPSL && <Check size={14} />}
          {comp.label_apsl_reg}
        </button>
      </div>

      {/* Score Preview */}
      {showAnalise && (
        <div className="p-4 bg-[var(--background-card)]/50 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--foreground-secondary)] flex items-center gap-1.5">
              {comp.score_total}
              <Tooltip
                text={
                  comp.tooltip_score ??
                  tr(
                    "Score composto (0-100) que pondera: Linhagem (15%), Treino (15%), Conformação (10%), Andamentos (10%), Idade (10%), Altura (8%), Temperamento (7%), Saúde (7%), BLUP (5%), Competições (8%), APSL (3%), Elevação+Regularidade (5%).",
                    "Composite score (0-100) weighing: Lineage (15%), Training (15%), Conformation (10%), Gaits (10%), Age (10%), Height (8%), Temperament (7%), Health (7%), BLUP (5%), Competitions (8%), APSL (3%), Elevation+Regularity (5%).",
                    "Puntuación compuesta (0-100) que pondera: Linaje (15%), Entrenamiento (15%), Conformación (10%), Aires (10%), Edad (10%), Altura (8%), Temperamento (7%), Salud (7%), BLUP (5%), Competiciones (8%), APSL (3%), Elevación+Regularidad (5%)."
                  )
                }
              />
            </span>
            <span className="flex items-center gap-2 flex-wrap justify-end">
              <span className="text-2xl font-bold" style={{ color: CORES[i] }}>
                {calcularScore(c)}
              </span>
              <span className="text-xs text-[var(--foreground-muted)] flex items-center gap-0.5">
                <TrendingUp size={11} className="text-emerald-400" />
                <span className="text-emerald-400 font-medium">{calcularPotencial(c)} pts</span>
              </span>
              {calcularPotencial(c) > calcularScore(c) + 10 && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-semibold rounded-full">
                  {tr("Alto Potencial", "High Potential", "Alto Potencial")}
                </span>
              )}
              <SourceBadge source="modelo" />
            </span>
          </div>
          <div className="text-xs text-[var(--foreground-muted)] flex items-center gap-1.5">
            {comp.value_per_point}{" "}
            <span className="text-[var(--foreground-secondary)]">
              {calcularValorPorPonto(c).toLocaleString(locale)}€
            </span>
            <Tooltip
              text={
                comp.tooltip_valor_ponto ??
                tr(
                  "Preço dividido pelo score total. Quanto menor, melhor a relação custo-benefício.",
                  "Price divided by total score. The lower, the better the cost-benefit ratio.",
                  "Precio dividido por la puntuación total. Cuanto menor, mejor la relación costo-beneficio."
                )
              }
            />
          </div>
          {filtroDisciplina !== "geral" &&
            (() => {
              const pesos = PESOS_DISC[filtroDisciplina] ?? {};
              let discScore = 0;
              if (pesos.conformacao) discScore += (c.conformacao / 10) * 100 * pesos.conformacao;
              if (pesos.andamentos) discScore += (c.andamentos / 10) * 100 * pesos.andamentos;
              if (pesos.elevacao) discScore += (c.elevacao / 10) * 100 * (pesos.elevacao ?? 0);
              if (pesos.temperamento) discScore += (c.temperamento / 10) * 100 * pesos.temperamento;
              if (pesos.saude) discScore += (c.saude / 10) * 100 * pesos.saude;
              if (pesos.blupNorm) discScore += Math.min((c.blup / 130) * 100, 100) * pesos.blupNorm;
              return (
                <div className="mt-1.5 text-xs text-[var(--foreground-muted)]">
                  <span className="text-[#C5A059]/70">{Math.round(discScore)} pts</span> {tr("para", "for", "para")}{" "}
                  {DISC_LABELS[filtroDisciplina] ? localizedLabel(DISC_LABELS[filtroDisciplina], language) : filtroDisciplina}
                </div>
              );
            })()}
          <div className="mt-3">
            <ScoreBreakdown factors={getScoreFactors(c, tr)} total={calcularScore(c)} />
          </div>
        </div>
      )}
    </div>
  );
}

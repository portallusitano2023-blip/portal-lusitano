"use client";

import { X, Check, Crown, Euro, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";
import Tooltip from "@/components/tools/Tooltip";
import SourceBadge from "@/components/tools/SourceBadge";
import type { Cavalo } from "./types";
import { CORES, PELAGENS, LINHAGENS, TREINOS, SEXOS, COMPETICOES, PRESETS } from "./data";
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
  t,
  onUpdate,
  onRemove,
  onApplyPreset,
}: HorseFormProps) {
  const comp = t.comparador as Record<string, string>;

  const PESOS_DISC: Record<string, Record<string, number>> = {
    dressage: { conformacao: 0.2, andamentos: 0.3, elevacao: 0.25, temperamento: 0.15, saude: 0.1 },
    trabalho: { conformacao: 0.25, andamentos: 0.2, temperamento: 0.3, saude: 0.15, blupNorm: 0.1 },
    reproducao: { blupNorm: 0.35, conformacao: 0.25, saude: 0.25, andamentos: 0.15 },
    lazer: { temperamento: 0.4, saude: 0.35, conformacao: 0.15, andamentos: 0.1 },
  };
  const DISC_LABELS: Record<string, string> = {
    dressage: "Dressage FEI",
    trabalho: "Equit. Trabalho",
    reproducao: "Reprodução",
    lazer: "Lazer",
  };

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
              title={`Pontuação estimada: ${liveScore}/100`}
              aria-label={`Pontuação estimada ${liveScore} de 100`}
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
            className="bg-transparent text-lg font-semibold outline-none flex-1 text-[var(--foreground)]"
            placeholder={comp.placeholder_horse_name}
          />
          {totalCavalos > 2 && (
            <button
              onClick={() => onRemove(c.id)}
              className="text-[var(--foreground-muted)] hover:text-red-400 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
        {/* Preset */}
        <select
          className="mt-2 w-full text-xs bg-[var(--background-card)]/40 border border-[var(--border)] text-[var(--foreground-muted)] rounded px-2 py-1 cursor-pointer hover:border-[var(--gold)]/40 transition-colors"
          value=""
          onChange={(e) => {
            if (e.target.value && PRESETS[e.target.value])
              onApplyPreset(c.id, PRESETS[e.target.value]);
          }}
        >
          <option value="">— Modelo rápido —</option>
          <option value="potro">Potro em Desenvolvimento</option>
          <option value="competicao">Cavalo de Competição</option>
          <option value="lazer">Cavalo de Lazer</option>
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
              min="1"
              max="30"
              value={c.idade}
              onChange={(e) => onUpdate(c.id, "idade", +e.target.value || 1)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--foreground-muted)] block mb-1">
              {comp.label_height}
            </label>
            <input
              type="number"
              min="140"
              max="180"
              value={c.altura}
              onChange={(e) => onUpdate(c.id, "altura", +e.target.value || 160)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
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
                {s.label}
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
                  {p.label}
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
                  {l.label}
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
            {TREINOS.map((tr) => (
              <option key={tr.value} value={tr.value}>
                {tr.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sliders */}
        {[
          { field: "conformacao" as const, label: comp.label_conformation },
          { field: "andamentos" as const, label: comp.label_gaits },
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
                  {co.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--foreground-muted)] block mb-1">BLUP</label>
            <input
              type="number"
              min="50"
              max="150"
              value={c.blup}
              onChange={(e) => onUpdate(c.id, "blup", +e.target.value || 100)}
              className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
            />
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
                      Preço Elevado
                    </span>
                  );
                if (vpp > 0 && vpp < 200)
                  return (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">
                      Excelente Valor
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
            onChange={(e) => onUpdate(c.id, "preco", +e.target.value || 0)}
            className="w-full bg-[var(--background-card)] border border-[var(--border)] rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
          />
        </div>

        <button
          onClick={() => onUpdate(c.id, "registoAPSL", !c.registoAPSL)}
          className={`w-full py-2 px-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-2 ${
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
                  "Score composto (0-100) que pondera: Linhagem (15%), Treino (15%), Conformação (10%), Andamentos (10%), Idade (10%), Altura (8%), Temperamento (7%), Saúde (7%), BLUP (5%), Competições (8%), APSL (3%), Elevação+Regularidade (5%)."
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
                  Alto Potencial
                </span>
              )}
              <SourceBadge source="modelo" />
            </span>
          </div>
          <div className="text-xs text-[var(--foreground-muted)] flex items-center gap-1.5">
            {comp.value_per_point}{" "}
            <span className="text-[var(--foreground-secondary)]">
              {calcularValorPorPonto(c).toLocaleString("pt-PT")}€
            </span>
            <Tooltip
              text={
                comp.tooltip_valor_ponto ??
                "Preço dividido pelo score total. Quanto menor, melhor a relação custo-benefício."
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
                  <span className="text-[#C5A059]/70">{Math.round(discScore)} pts</span> para{" "}
                  {DISC_LABELS[filtroDisciplina] ?? filtroDisciplina}
                </div>
              );
            })()}
          <div className="mt-3">
            <ScoreBreakdown factors={getScoreFactors(c)} total={calcularScore(c)} />
          </div>
        </div>
      )}
    </div>
  );
}

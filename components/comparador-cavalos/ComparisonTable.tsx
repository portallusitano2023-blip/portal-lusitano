"use client";

import React, { useMemo } from "react";
import { Table2, Check, X as XIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type { Cavalo } from "./types";
import {
  CORES,
  PELAGENS,
  LINHAGENS,
  TREINOS,
  SEXOS,
  COMPETICOES,
  localizedLabel,
} from "./data";

// ============================================
// ROW DEFINITIONS
// ============================================

type CompareMode = "higher" | "lower" | "range" | "tier" | "boolean" | "none";

interface RowDef {
  label: string;
  getValue: (c: Cavalo, lang: string) => string;
  getRaw?: (c: Cavalo) => number;
  mode: CompareMode;
  idealMin?: number;
  idealMax?: number;
  tierMap?: Record<string, number>;
}

interface CategoryDef {
  title: string;
  rows: RowDef[];
}

function buildCategories(
  tr: (pt: string, en: string, es: string) => string
): CategoryDef[] {
  return [
    {
      title: tr("Identificação", "Identification", "Identificación"),
      rows: [
        {
          label: tr("Nome", "Name", "Nombre"),
          getValue: (c) => c.nome || "---",
          mode: "none",
        },
        {
          label: tr("Idade", "Age", "Edad"),
          getValue: (c) =>
            `${c.idade} ${tr("anos", "years", "anos")}`,
          getRaw: (c) => c.idade,
          mode: "range",
          idealMin: 6,
          idealMax: 12,
        },
        {
          label: tr("Sexo", "Sex", "Sexo"),
          getValue: (c, lang) => {
            const s = SEXOS.find((x) => x.value === c.sexo);
            return s ? localizedLabel(s, lang) : c.sexo;
          },
          mode: "none",
        },
        {
          label: tr("Pelagem", "Coat", "Capa"),
          getValue: (c, lang) => {
            const p = PELAGENS.find((x) => x.value === c.pelagem);
            return p ? localizedLabel(p, lang) : c.pelagem;
          },
          mode: "none",
        },
        {
          label: tr("Altura (cm)", "Height (cm)", "Altura (cm)"),
          getValue: (c) => `${c.altura} cm`,
          getRaw: (c) => c.altura,
          mode: "range",
          idealMin: 158,
          idealMax: 168,
        },
        {
          label: tr("Registo APSL", "APSL Registration", "Registro APSL"),
          getValue: (c) =>
            c.registoAPSL
              ? tr("Sim", "Yes", "Sí")
              : tr("Não", "No", "No"),
          getRaw: (c) => (c.registoAPSL ? 1 : 0),
          mode: "boolean",
        },
      ],
    },
    {
      title: tr("Genética", "Genetics", "Genética"),
      rows: [
        {
          label: tr("Linhagem", "Lineage", "Linaje"),
          getValue: (c, lang) => {
            const l = LINHAGENS.find((x) => x.value === c.linhagem);
            return l ? localizedLabel(l, lang) : c.linhagem;
          },
          getRaw: (c) => {
            const map: Record<string, number> = {
              Desconhecida: 1,
              Registada: 2,
              Certificada: 3,
              Premium: 4,
              Elite: 5,
            };
            return map[c.linhagem] ?? 0;
          },
          mode: "tier",
        },
        {
          label: tr("Linhagem Famosa", "Famous Bloodline", "Linaje Famoso"),
          getValue: (c) => c.linhagemFamosa || "---",
          mode: "none",
        },
        {
          label: "BLUP",
          getValue: (c) => String(c.blup),
          getRaw: (c) => c.blup,
          mode: "higher",
        },
      ],
    },
    {
      title: tr("Morfologia", "Morphology", "Morfologia"),
      rows: [
        {
          label: tr("Conformação Geral", "Overall Conformation", "Conformación General"),
          getValue: (c) => `${c.conformacao}/10`,
          getRaw: (c) => c.conformacao,
          mode: "higher",
        },
      ],
    },
    {
      title: tr("Andamentos", "Gaits", "Aires"),
      rows: [
        {
          label: tr("Qualidade Geral", "Overall Quality", "Calidad General"),
          getValue: (c) => `${c.andamentos}/10`,
          getRaw: (c) => c.andamentos,
          mode: "higher",
        },
        {
          label: tr("Elevação", "Elevation", "Elevación"),
          getValue: (c) => `${c.elevacao}/10`,
          getRaw: (c) => c.elevacao,
          mode: "higher",
        },
        {
          label: tr("Regularidade", "Regularity", "Regularidad"),
          getValue: (c) => `${c.regularidade}/10`,
          getRaw: (c) => c.regularidade,
          mode: "higher",
        },
      ],
    },
    {
      title: tr("Temperamento", "Temperament", "Temperamento"),
      rows: [
        {
          label: tr("Avaliação Geral", "Overall Rating", "Evaluación General"),
          getValue: (c) => `${c.temperamento}/10`,
          getRaw: (c) => c.temperamento,
          mode: "higher",
        },
      ],
    },
    {
      title: tr("Treino e Competição", "Training & Competition", "Entrenamiento y Competición"),
      rows: [
        {
          label: tr("Nivel de Treino", "Training Level", "Nivel de Entrenamiento"),
          getValue: (c, lang) => {
            const t = TREINOS.find((x) => x.value === c.treino);
            return t ? localizedLabel(t, lang) : c.treino;
          },
          getRaw: (c) => {
            const t = TREINOS.find((x) => x.value === c.treino);
            return t?.nivel ?? 0;
          },
          mode: "tier",
        },
        {
          label: tr("Competições", "Competitions", "Competiciones"),
          getValue: (c, lang) => {
            const co = COMPETICOES.find((x) => x.value === c.competicoes);
            return co ? localizedLabel(co, lang) : c.competicoes;
          },
          getRaw: (c) => {
            const map: Record<string, number> = {
              Nenhuma: 0,
              Regional: 1,
              Nacional: 2,
              Internacional: 3,
            };
            return map[c.competicoes] ?? 0;
          },
          mode: "tier",
        },
        {
          label: tr("Prémios", "Awards", "Premios"),
          getValue: (c) => String(c.premios),
          getRaw: (c) => c.premios,
          mode: "higher",
        },
      ],
    },
    {
      title: tr("Saúde", "Health", "Salud"),
      rows: [
        {
          label: tr("Estado Geral", "Overall Status", "Estado General"),
          getValue: (c) => `${c.saude}/10`,
          getRaw: (c) => c.saude,
          mode: "higher",
        },
      ],
    },
    {
      title: tr("Mercado", "Market", "Mercado"),
      rows: [
        {
          label: tr("Preço", "Price", "Precio"),
          getValue: (c) => `${c.preco.toLocaleString()} \u20AC`,
          getRaw: (c) => c.preco,
          mode: "lower",
        },
      ],
    },
  ];
}

// ============================================
// COMPARISON LOGIC
// ============================================

function getWinnerIndices(
  cavalos: Cavalo[],
  row: RowDef
): Set<number> {
  if (row.mode === "none" || !row.getRaw) return new Set();

  const values = cavalos.map((c) => row.getRaw!(c));

  if (row.mode === "higher" || row.mode === "tier" || row.mode === "boolean") {
    const max = Math.max(...values);
    const winners = new Set<number>();
    values.forEach((v, i) => {
      if (v === max) winners.add(i);
    });
    // All equal = no winner
    if (winners.size === values.length) return new Set();
    return winners;
  }

  if (row.mode === "lower") {
    const min = Math.min(...values);
    const winners = new Set<number>();
    values.forEach((v, i) => {
      if (v === min) winners.add(i);
    });
    if (winners.size === values.length) return new Set();
    return winners;
  }

  if (row.mode === "range" && row.idealMin != null && row.idealMax != null) {
    const mid = (row.idealMin + row.idealMax) / 2;
    const distances = values.map((v) => {
      if (v >= row.idealMin! && v <= row.idealMax!) return 0;
      return Math.min(Math.abs(v - row.idealMin!), Math.abs(v - row.idealMax!));
    });
    const minDist = Math.min(...distances);
    const winners = new Set<number>();
    distances.forEach((d, i) => {
      if (d === minDist) winners.add(i);
    });
    if (winners.size === values.length) return new Set();
    return winners;
  }

  return new Set();
}

function getCellClass(
  index: number,
  winners: Set<number>
): string {
  if (winners.size === 0) return "text-[var(--foreground)]";
  if (winners.has(index)) return "text-emerald-400 font-semibold";
  return "text-red-400";
}

// ============================================
// COMPONENT
// ============================================

interface ComparisonTableProps {
  cavalos: Cavalo[];
}

export default function ComparisonTable({ cavalos }: ComparisonTableProps) {
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);
  const categories = useMemo(() => buildCategories(tr), [tr]);

  return (
    <div className="bg-[var(--background-secondary)]/50 rounded-2xl border border-[var(--border)] overflow-hidden">
      <div className="p-5 pb-3 border-b border-[var(--border)]/50">
        <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] uppercase tracking-wider flex items-center gap-2">
          <Table2 size={16} className="text-blue-400" />
          {tr(
            "Comparação Detalhada",
            "Detailed Comparison",
            "Comparación Detallada"
          )}
        </h3>
        <p className="text-xs text-[var(--foreground-muted)] mt-1">
          {tr(
            "Todas as especificações lado a lado. Verde = melhor, vermelho = inferior.",
            "All specs side by side. Green = better, red = worse.",
            "Todas las especificaciones lado a lado. Verde = mejor, rojo = inferior."
          )}
        </p>
      </div>

      {/* ======== DESKTOP TABLE (md+) ======== */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: "540px" }}>
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="text-left py-3 px-4 text-xs text-[var(--foreground-muted)] font-medium uppercase tracking-wider min-w-[180px] sticky left-0 bg-[var(--background-secondary)]" scope="col">
                {tr("Parâmetro", "Parameter", "Parámetro")}
              </th>
              {cavalos.map((c, i) => (
                <th
                  key={c.id}
                  scope="col"
                  className="text-center py-3 px-3 text-xs font-semibold min-w-[110px]"
                  style={{ color: CORES[i] }}
                >
                  {c.nome || `${tr("Cavalo", "Horse", "Caballo")} ${String.fromCharCode(65 + i)}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <React.Fragment key={`cat-group-${cat.title}`}>
                {/* Category header row */}
                <tr>
                  <td
                    colSpan={cavalos.length + 1}
                    className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]/80 bg-[#C5A059]/5 border-t border-[var(--border)]/30"
                  >
                    {cat.title}
                  </td>
                </tr>
                {/* Data rows */}
                {cat.rows.map((row) => {
                  const winners = getWinnerIndices(cavalos, row);
                  return (
                    <tr
                      key={`${cat.title}-${row.label}`}
                      className="border-b border-[var(--border)]/20 hover:bg-[var(--background-card)]/20 transition-colors"
                    >
                      <td className="py-2.5 px-4 text-xs text-[var(--foreground-secondary)] sticky left-0 bg-[var(--background-secondary)]">
                        {row.label}
                      </td>
                      {cavalos.map((c, i) => (
                        <td
                          key={c.id}
                          className={`text-center py-2.5 px-3 text-sm ${getCellClass(i, winners)}`}
                        >
                          <span className="inline-flex items-center gap-1.5 justify-center">
                            {row.getValue(c, language)}
                            {row.mode === "boolean" && row.getRaw && (
                              row.getRaw(c) === 1
                                ? <Check size={13} className="text-emerald-400" />
                                : <XIcon size={13} className="text-red-400/60" />
                            )}
                          </span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* ======== MOBILE CARD LAYOUT (<md) ======== */}
      <div className="md:hidden divide-y divide-[var(--border)]/30">
        {categories.map((cat) => (
          <div key={`mob-${cat.title}`}>
            {/* Category header */}
            <div className="py-2.5 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A059]/80 bg-[#C5A059]/5">
              {cat.title}
            </div>
            {/* Row cards */}
            {cat.rows.map((row) => {
              const winners = getWinnerIndices(cavalos, row);
              return (
                <div
                  key={`mob-${cat.title}-${row.label}`}
                  className="px-4 py-3 border-b border-[var(--border)]/15"
                >
                  <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">
                    {row.label}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {cavalos.map((c, i) => (
                      <div
                        key={c.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--background-card)]/30 ${
                          winners.has(i) ? "ring-1 ring-emerald-500/40" : ""
                        }`}
                      >
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: CORES[i] }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-[var(--foreground-muted)] truncate">
                            {c.nome || String.fromCharCode(65 + i)}
                          </p>
                          <p
                            className={`text-sm font-medium truncate ${getCellClass(i, winners)}`}
                          >
                            {row.getValue(c, language)}
                            {row.mode === "boolean" && row.getRaw && (
                              <span className="ml-1 inline-flex">
                                {row.getRaw(c) === 1
                                  ? <Check size={12} className="text-emerald-400" />
                                  : <XIcon size={12} className="text-red-400/60" />}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="px-4 py-3 border-t border-[var(--border)]/30 flex flex-wrap items-center gap-4 text-[10px] text-[var(--foreground-muted)]">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {tr("Melhor valor", "Better value", "Mejor valor")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-400" />
          {tr("Valor inferior", "Lower value", "Valor inferior")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--foreground-muted)]" />
          {tr("Sem comparação", "Not comparable", "Sin comparación")}
        </span>
      </div>
    </div>
  );
}

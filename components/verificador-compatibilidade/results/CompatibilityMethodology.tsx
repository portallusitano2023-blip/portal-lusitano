"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo } from "react";
import { ChevronRight, TrendingUp, BarChart3, Target } from "lucide-react";
import { chainVerificadorToPerfil } from "@/lib/tools/tool-chain";
import MethodologyPanel from "@/components/tools/MethodologyPanel";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

interface CompatibilityMethodologyProps {
  resultado: any;
  garanhao: any;
  egua: any;
  isSubscribed: boolean;
  t: Record<string, any>;
}

export default function CompatibilityMethodology({
  resultado,
  garanhao,
  egua,
  isSubscribed: _isSubscribed,
  t,
}: CompatibilityMethodologyProps) {
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);

  return (
    <>
      {/* Methodology Panel */}
      <div className="mb-6">
        <MethodologyPanel
          title={
            (t.verificador as Record<string, string>).methodology_panel_title ??
            tr("Metodologia de Compatibilidade", "Compatibility Methodology", "Metodología de Compatibilidad")
          }
          factors={[
            {
              name: tr("Qualidade Genética / Linhagem", "Genetic Quality / Lineage", "Calidad Genética / Línea"),
              weight: "20pts",
              description:
                (t.verificador as Record<string, string>).method_linhagem ??
                tr("Média da qualidade das linhagens dos progenitores", "Average quality of the parents' lineages", "Promedio de la calidad de las líneas de los progenitores"),
              standard: "APSL",
            },
            {
              name: tr("Idade Reprodutiva", "Reproductive Age", "Edad Reproductiva"),
              weight: "15pts",
              description:
                (t.verificador as Record<string, string>).method_idade ??
                tr("Idade ideal: Garanhão 4-20, Égua 4-18 anos", "Ideal age: Stallion 4-20, Mare 4-18 years", "Edad ideal: Semental 4-20, Yegua 4-18 años"),
            },
            {
              name: tr("Conformação Morfológica", "Morphological Conformation", "Conformación Morfológica"),
              weight: "15pts",
              description:
                (t.verificador as Record<string, string>).method_conformacao ??
                tr("Qualidade morfológica média dos progenitores", "Average morphological quality of the parents", "Calidad morfológica promedio de los progenitores"),
              standard: "APSL",
            },
            {
              name: tr("Compatibilidade Física", "Physical Compatibility", "Compatibilidad Física"),
              weight: "10pts",
              description:
                (t.verificador as Record<string, string>).method_fisica ??
                tr("Diferença de altura entre os progenitores", "Height difference between parents", "Diferencia de altura entre los progenitores"),
            },
            {
              name: tr("Qualidade dos Andamentos", "Gait Quality", "Calidad de los Movimientos"),
              weight: "10pts",
              description:
                (t.verificador as Record<string, string>).method_andamentos ??
                tr("Funcionalidade e expressão de movimentos", "Functionality and expression of movements", "Funcionalidad y expresión de movimientos"),
            },
            {
              name: tr("Compatibilidade Temperamento", "Temperament Compatibility", "Compatibilidad de Temperamento"),
              weight: "10pts",
              description:
                (t.verificador as Record<string, string>).method_temperamento ??
                tr("Combinação dos temperamentos dos progenitores", "Combination of the parents' temperaments", "Combinación de los temperamentos de los progenitores"),
            },
            {
              name: tr("Estado de Saúde", "Health Status", "Estado de Salud"),
              weight: "10pts",
              description:
                (t.verificador as Record<string, string>).method_saude ??
                tr("Condição veterinária geral dos progenitores", "General veterinary condition of the parents", "Condición veterinaria general de los progenitores"),
            },
            {
              name: tr("Índice de Fertilidade", "Fertility Index", "Índice de Fertilidad"),
              weight: "5pts",
              description:
                (t.verificador as Record<string, string>).method_repro ??
                tr("Historial de fertilidade dos progenitores", "Fertility history of the parents", "Historial de fertilidad de los progenitores"),
            },
            {
              name: tr("Aprovação como Reprodutores", "Approval as Breeders", "Aprobación como Reproductores"),
              weight: tr("5pts (bónus)", "5pts (bonus)", "5pts (bono)"),
              description:
                (t.verificador as Record<string, string>).method_apsl ??
                tr("Bónus para ambos aprovados oficialmente como reprodutores", "Bonus for both officially approved as breeders", "Bonificación para ambos aprobados oficialmente como reproductores"),
              standard: "APSL",
            },
            {
              name: tr("Historial Reprodutivo", "Reproductive History", "Historial Reproductivo"),
              weight: "5pts",
              description:
                (t.verificador as Record<string, string>).method_historial ??
                tr("Coberturas realizadas e potros nascidos vivos", "Breedings performed and live foals born", "Cubriciones realizadas y potros nacidos vivos"),
            },
          ]}
          limitations={[
            (t.verificador as Record<string, string>).limitation_1 ??
              tr("Não considera doenças genéticas específicas", "Does not consider specific genetic diseases", "No considera enfermedades genéticas específicas"),
            (t.verificador as Record<string, string>).limitation_2 ??
              tr("COI baseado em pedigree declarado, não em análise DNA", "COI based on declared pedigree, not DNA analysis", "COI basado en pedigrí declarado, no en análisis de ADN"),
            (t.verificador as Record<string, string>).limitation_3 ??
              tr("BLUP estimado, não oficial APSL", "Estimated BLUP, not official APSL", "BLUP estimado, no oficial APSL"),
            (t.verificador as Record<string, string>).limitation_4 ??
              tr("Não substitui consulta veterinária reprodutiva", "Does not replace reproductive veterinary consultation", "No sustituye consulta veterinaria reproductiva"),
          ]}
          version={
            (t.verificador as Record<string, string>).methodology_version ?? "v2.1 — Fev 2026"
          }
          references={[
            tr("Genética quantitativa equina", "Equine quantitative genetics", "Genética cuantitativa equina"),
            tr("Padrões APSL", "APSL standards", "Estándares APSL"),
            "Wright (1922) — COI",
          ]}
        />
      </div>

      {/* D3: Tool chain CTA — Comparador + Calculadora + Perfil */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => {
            try {
              sessionStorage.setItem(
                "tool_chain_horse",
                JSON.stringify({
                  source: "verificador_pair",
                  horses: [
                    {
                      nome: garanhao.nome,
                      sexo: "Garanhão",
                      idade: garanhao.idade,
                      altura: garanhao.altura,
                      pelagem: garanhao.pelagem,
                      linhagem: garanhao.linhagem,
                      linhagemFamosa: garanhao.linhagemFamosa,
                      conformacao: garanhao.conformacao,
                      andamentos: garanhao.andamentos,
                      temperamento:
                        typeof garanhao.temperamento === "string" ? 7 : garanhao.temperamento,
                      saude: garanhao.saude,
                      blup: garanhao.blup,
                      registoAPSL: garanhao.aprovado,
                    },
                    {
                      nome: egua.nome,
                      sexo: "Égua",
                      idade: egua.idade,
                      altura: egua.altura,
                      pelagem: egua.pelagem,
                      linhagem: egua.linhagem,
                      linhagemFamosa: egua.linhagemFamosa,
                      conformacao: egua.conformacao,
                      andamentos: egua.andamentos,
                      temperamento: typeof egua.temperamento === "string" ? 7 : egua.temperamento,
                      saude: egua.saude,
                      blup: egua.blup,
                      registoAPSL: egua.aprovado,
                    },
                  ],
                })
              );
            } catch {}
            window.location.href = "/comparador-cavalos";
          }}
          className="group flex items-center gap-3 p-4 bg-blue-900/15 border border-blue-500/30 rounded-xl hover:border-blue-500/60 transition-all text-left"
        >
          <BarChart3
            size={18}
            className="text-blue-400 shrink-0 group-hover:scale-110 transition-transform"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              {tr("Abrir ambos no Comparador", "Open both in Comparator", "Abrir ambos en el Comparador")}
            </p>
            <p className="text-xs text-[var(--foreground-muted)]">
              {garanhao.nome || tr("Garanhão", "Stallion", "Semental")} × {egua.nome || tr("Égua", "Mare", "Yegua")} {tr("lado a lado", "side by side", "lado a lado")}
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-[var(--foreground-muted)] ml-auto group-hover:text-blue-400 transition-colors"
          />
        </button>

        <button
          onClick={() => {
            window.location.href = "/calculadora-valor";
          }}
          className="group flex items-center gap-3 p-4 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl hover:border-[var(--gold)]/60 transition-all text-left"
        >
          <TrendingUp
            size={18}
            className="text-[var(--gold)] shrink-0 group-hover:scale-110 transition-transform"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{tr("Estimar Valor do Potro", "Estimate Foal Value", "Estimar Valor del Potro")}</p>
            <p className="text-xs text-[var(--foreground-muted)]">
              {tr("Calculadora de Valor para o descendente", "Value calculator for the offspring", "Calculadora de Valor para el descendiente")}
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-[var(--foreground-muted)] ml-auto group-hover:text-[var(--gold)] transition-colors"
          />
        </button>

        <button
          onClick={() =>
            chainVerificadorToPerfil(
              resultado.score,
              garanhao.nome || tr("Garanhão", "Stallion", "Semental"),
              egua.nome || tr("Égua", "Mare", "Yegua")
            )
          }
          className="group flex items-center gap-3 p-4 bg-emerald-900/15 border border-emerald-500/30 rounded-xl hover:border-emerald-500/60 transition-all text-left"
        >
          <Target
            size={18}
            className="text-emerald-400 shrink-0 group-hover:scale-110 transition-transform"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">{tr("Perfil de Comprador", "Buyer Profile", "Perfil de Comprador")}</p>
            <p className="text-xs text-[var(--foreground-muted)]">
              {tr("Descobre o perfil ideal para este potro", "Discover the ideal profile for this foal", "Descubre el perfil ideal para este potro")}
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-[var(--foreground-muted)] ml-auto group-hover:text-emerald-400 transition-colors"
          />
        </button>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-[var(--background-secondary)]/30 rounded-xl border border-[var(--border)]">
        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
          <strong className="text-[var(--foreground-secondary)]">
            {t.verificador.disclaimer_title}
          </strong>{" "}
          {t.verificador.disclaimer_text}
          <span className="block mt-1 text-[10px] text-[var(--foreground-muted)]/40 font-mono">
            {(t.verificador as Record<string, string>).methodology_version ?? "v2.1 — Fev 2026"}
          </span>
        </p>
      </div>
    </>
  );
}

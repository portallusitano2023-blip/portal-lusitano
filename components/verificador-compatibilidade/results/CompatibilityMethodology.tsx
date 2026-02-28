"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChevronRight, TrendingUp, BarChart3, Target } from "lucide-react";
import { chainVerificadorToPerfil } from "@/lib/tools/tool-chain";
import MethodologyPanel from "@/components/tools/MethodologyPanel";

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
  return (
    <>
      {/* Methodology Panel */}
      <div className="mb-6">
        <MethodologyPanel
          title={
            (t.verificador as Record<string, string>).methodology_panel_title ??
            "Metodologia de Compatibilidade"
          }
          factors={[
            {
              name: "COI",
              weight: "25%",
              description:
                (t.verificador as Record<string, string>).method_coi ??
                "Coeficiente de consanguinidade estimado",
              standard: "modelo",
            },
            {
              name: "BLUP Parental",
              weight: "20%",
              description:
                (t.verificador as Record<string, string>).method_blup ??
                "Média ponderada do mérito genético dos progenitores",
              standard: "modelo",
            },
            {
              name: "Conformação",
              weight: "15%",
              description:
                (t.verificador as Record<string, string>).method_conformacao ??
                "Complementaridade morfológica do par",
              standard: "APSL",
            },
            {
              name: "Andamentos",
              weight: "15%",
              description:
                (t.verificador as Record<string, string>).method_andamentos ??
                "Compatibilidade da qualidade de andamentos",
            },
            {
              name: "Hist. Reprodutivo",
              weight: "10%",
              description:
                (t.verificador as Record<string, string>).method_repro ??
                "Historial de fertilidade e partos",
            },
            {
              name: "Registo APSL",
              weight: "10%",
              description:
                (t.verificador as Record<string, string>).method_apsl ??
                "Bónus para ambos com registo oficial",
              standard: "APSL",
            },
            {
              name: "Linhagem",
              weight: "5%",
              description:
                (t.verificador as Record<string, string>).method_linhagem ??
                "Diversidade e qualidade do pedigree",
            },
          ]}
          limitations={[
            (t.verificador as Record<string, string>).limitation_1 ??
              "Não considera doenças genéticas específicas",
            (t.verificador as Record<string, string>).limitation_2 ??
              "COI baseado em pedigree declarado, não em análise DNA",
            (t.verificador as Record<string, string>).limitation_3 ??
              "BLUP estimado, não oficial APSL",
            (t.verificador as Record<string, string>).limitation_4 ??
              "Não substitui consulta veterinária reprodutiva",
          ]}
          version={
            (t.verificador as Record<string, string>).methodology_version ?? "v2.1 — Fev 2026"
          }
          references={["Genética quantitativa equina", "Padrões APSL", "Wright (1922) — COI"]}
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
              Abrir ambos no Comparador
            </p>
            <p className="text-xs text-[var(--foreground-muted)]">
              {garanhao.nome || "Garanhão"} × {egua.nome || "Égua"} lado a lado
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
            <p className="text-sm font-semibold text-[var(--foreground)]">Estimar Valor do Potro</p>
            <p className="text-xs text-[var(--foreground-muted)]">
              Calculadora de Valor para o descendente
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
              garanhao.nome || "Garanhão",
              egua.nome || "Égua"
            )
          }
          className="group flex items-center gap-3 p-4 bg-emerald-900/15 border border-emerald-500/30 rounded-xl hover:border-emerald-500/60 transition-all text-left"
        >
          <Target
            size={18}
            className="text-emerald-400 shrink-0 group-hover:scale-110 transition-transform"
          />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">Perfil de Comprador</p>
            <p className="text-xs text-[var(--foreground-muted)]">
              Descobre o perfil ideal para este potro
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

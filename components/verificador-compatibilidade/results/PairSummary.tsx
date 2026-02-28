"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Info } from "lucide-react";
import GeneticSummary from "@/components/tools/GeneticSummary";
import ResultActions from "@/components/tools/ResultActions";

interface PairSummaryProps {
  resultado: any;
  garanhao: any;
  egua: any;
  isExporting: boolean;
  onExportPDF: () => void;
  onShare: () => void;
  t: Record<string, any>;
}

export default function PairSummary({
  resultado,
  garanhao,
  egua,
  isExporting,
  onExportPDF,
  onShare,
  t: _t,
}: PairSummaryProps) {
  return (
    <>
      {/* O que significa este score? */}
      {(() => {
        const s = resultado.score;
        const interpretation =
          s >= 80
            ? {
                text: "Excelente compatibilidade genética. Esta combinação tem alto potencial para produzir descendentes de qualidade superior. Recomendado para programa de cruzamento seletivo.",
                border: "border-l-emerald-500",
                bg: "bg-emerald-500/5",
                iconColor: "text-emerald-400",
                titleColor: "text-emerald-400",
              }
            : s >= 65
              ? {
                  text: "Boa compatibilidade genética. Esta combinação é adequada para cruzamento com expectativas de descendentes competitivos. Considere os fatores específicos abaixo.",
                  border: "border-l-blue-500",
                  bg: "bg-blue-500/5",
                  iconColor: "text-blue-400",
                  titleColor: "text-blue-400",
                }
              : s >= 50
                ? {
                    text: "Compatibilidade moderada. Esta combinação pode ser viável, mas requer atenção aos pontos de risco identificados. Consulte um veterinário especializado.",
                    border: "border-l-amber-500",
                    bg: "bg-amber-500/5",
                    iconColor: "text-amber-400",
                    titleColor: "text-amber-400",
                  }
                : {
                    text: "Compatibilidade limitada. Existem fatores de risco significativos nesta combinação. Recomendamos consultar um especialista em genética equina antes de prosseguir.",
                    border: "border-l-red-500",
                    bg: "bg-red-500/5",
                    iconColor: "text-red-400",
                    titleColor: "text-red-400",
                  };

        return (
          <div
            className={`rounded-xl p-4 mb-6 border-l-4 border border-[var(--border)] ${interpretation.border} ${interpretation.bg}`}
          >
            <h3
              className={`text-sm font-semibold mb-2 flex items-center gap-2 ${interpretation.titleColor}`}
            >
              <Info size={15} className={interpretation.iconColor} />O que significa este score?
            </h3>
            <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
              {interpretation.text}
            </p>
          </div>
        );
      })()}

      {/* Resumo Executivo do Par */}
      {(() => {
        const alturaMedia = Math.round((garanhao.altura + egua.altura) / 2);
        const blupMedio = Math.round((garanhao.blup + egua.blup) / 2);
        const saudeMed = Math.round((garanhao.saude + egua.saude) / 2);
        const conformMed = Math.round((garanhao.conformacao + egua.conformacao) / 2);

        return (
          <div className="bg-[var(--background-secondary)]/30 rounded-xl p-4 border border-[var(--border)]/60 mb-6">
            <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
              Resumo do Par
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Altura estimada",
                  value: `${alturaMedia - 2}–${alturaMedia + 2}cm`,
                  sub: "do potro adulto",
                },
                {
                  label: "BLUP médio",
                  value: blupMedio,
                  sub: blupMedio >= 110 ? "acima da média" : "dentro da média",
                },
                {
                  label: "Saúde combinada",
                  value: `${saudeMed}/10`,
                  sub: saudeMed >= 8 ? "excelente" : saudeMed >= 6 ? "boa" : "a melhorar",
                },
                {
                  label: "Conformação",
                  value: `${conformMed}/10`,
                  sub: conformMed >= 8 ? "excepcional" : "adequada",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-[var(--background-card)]/50 rounded-lg p-3 text-center"
                >
                  <p className="text-lg font-bold text-[#C5A059]">{item.value}</p>
                  <p className="text-[10px] text-[var(--foreground-muted)] mt-0.5">{item.label}</p>
                  <p className="text-[9px] text-[var(--foreground-muted)]/60">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Genetic Summary */}
      <div className="mb-6">
        <GeneticSummary garanhao={garanhao} egua={egua} resultado={resultado} />
      </div>

      {/* Result Actions */}
      <div className="mb-6">
        <ResultActions
          onExportPDF={onExportPDF}
          onShare={onShare}
          onPrint={() => window.print()}
          isExporting={isExporting}
        />
      </div>
    </>
  );
}

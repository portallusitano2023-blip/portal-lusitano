"use client";

import { useMemo } from "react";
import { Info } from "lucide-react";
import GeneticSummary from "@/components/tools/GeneticSummary";
import ResultActions from "@/components/tools/ResultActions";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type { Cavalo, ResultadoCompatibilidade } from "../types";
import type { Translations } from "@/context/LanguageContext";

interface PairSummaryProps {
  resultado: ResultadoCompatibilidade;
  garanhao: Cavalo;
  egua: Cavalo;
  isExporting: boolean;
  onExportPDF: () => void;
  onShare: () => void;
  t: Translations;
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
  const { language } = useLanguage();
  const tr = useMemo(() => createTranslator(language), [language]);

  return (
    <>
      {/* O que significa este score? */}
      {(() => {
        const s = resultado.score;
        const interpretation =
          s >= 85
            ? {
                text: tr(
                  "Excelente compatibilidade genética. Esta combinação tem alto potencial para produzir descendentes de qualidade superior. Recomendado para programa de cruzamento seletivo.",
                  "Excellent genetic compatibility. This combination has high potential to produce superior quality offspring. Recommended for selective breeding programme.",
                  "Excelente compatibilidad genética. Esta combinación tiene alto potencial para producir descendientes de calidad superior. Recomendado para programa de cruzamiento selectivo."
                ),
                border: "border-l-emerald-500",
                bg: "bg-emerald-500/5",
                iconColor: "text-emerald-400",
                titleColor: "text-emerald-400",
              }
            : s >= 70
              ? {
                  text: tr(
                    "Boa compatibilidade genética. Esta combinação é adequada para cruzamento com expectativas de descendentes competitivos. Considere os fatores específicos abaixo.",
                    "Good genetic compatibility. This combination is suitable for breeding with competitive offspring expectations. Consider the specific factors below.",
                    "Buena compatibilidad genética. Esta combinación es adecuada para cruzamiento con expectativas de descendientes competitivos. Considere los factores específicos abajo."
                  ),
                  border: "border-l-blue-500",
                  bg: "bg-blue-500/5",
                  iconColor: "text-blue-400",
                  titleColor: "text-blue-400",
                }
              : s >= 55
                ? {
                    text: tr(
                      "Compatibilidade moderada. Esta combinação pode ser viável, mas requer atenção aos pontos de risco identificados. Consulte um veterinário especializado.",
                      "Moderate compatibility. This combination may be viable, but requires attention to the identified risk points. Consult a specialised veterinarian.",
                      "Compatibilidad moderada. Esta combinación puede ser viable, pero requiere atención a los puntos de riesgo identificados. Consulte a un veterinario especializado."
                    ),
                    border: "border-l-amber-500",
                    bg: "bg-amber-500/5",
                    iconColor: "text-amber-400",
                    titleColor: "text-amber-400",
                  }
                : s >= 40
                  ? {
                      text: tr(
                        "Compatibilidade limitada. Existem fatores de risco significativos nesta combinação. Recomendamos consultar um especialista em genética equina antes de prosseguir.",
                        "Limited compatibility. There are significant risk factors in this combination. We recommend consulting an equine genetics specialist before proceeding.",
                        "Compatibilidad limitada. Existen factores de riesgo significativos en esta combinación. Recomendamos consultar a un especialista en genética equina antes de proceder."
                      ),
                      border: "border-l-orange-500",
                      bg: "bg-orange-500/5",
                      iconColor: "text-orange-400",
                      titleColor: "text-orange-400",
                    }
                  : {
                      text: tr(
                        "Compatibilidade não recomendada. Os riscos genéticos e reprodutivos desta combinação são elevados. Consulte um especialista antes de considerar este cruzamento.",
                        "Compatibility not recommended. The genetic and reproductive risks of this combination are high. Consult a specialist before considering this cross.",
                        "Compatibilidad no recomendada. Los riesgos genéticos y reproductivos de esta combinación son elevados. Consulte a un especialista antes de considerar este cruzamiento."
                      ),
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
              <Info size={15} className={interpretation.iconColor} />{tr("O que significa este score?", "What does this score mean?", "¿Qué significa esta puntuación?")}
            </h3>
            <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">
              {interpretation.text}
            </p>
          </div>
        );
      })()}

      {/* Resumo Executivo do Par */}
      {(() => {
        const blupMedio = Math.round((garanhao.blup + egua.blup) / 2);
        const saudeMed = Math.round((garanhao.saude + egua.saude) / 2);
        const conformMed = Math.round((garanhao.conformacao + egua.conformacao) / 2);

        return (
          <div className="bg-[var(--background-secondary)]/30 rounded-xl p-4 border border-[var(--border)]/60 mb-6">
            <h3 className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
              {tr("Resumo do Par", "Pair Summary", "Resumen del Par")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: tr("Altura estimada", "Estimated height", "Altura estimada"),
                  value: `${resultado.altura.min}–${resultado.altura.max}cm`,
                  sub: tr("do potro adulto", "of adult foal", "del potro adulto"),
                },
                {
                  label: tr("BLUP médio", "Average BLUP", "BLUP medio"),
                  value: blupMedio,
                  sub: blupMedio >= 110 ? tr("acima da média", "above average", "por encima de la media") : tr("dentro da média", "within average", "dentro de la media"),
                },
                {
                  label: tr("Saúde combinada", "Combined health", "Salud combinada"),
                  value: `${saudeMed}/10`,
                  sub: saudeMed >= 8 ? tr("excelente", "excellent", "excelente") : saudeMed >= 6 ? tr("boa", "good", "buena") : tr("a melhorar", "needs improvement", "a mejorar"),
                },
                {
                  label: tr("Conformação", "Conformation", "Conformación"),
                  value: `${conformMed}/10`,
                  sub: conformMed >= 8 ? tr("excepcional", "exceptional", "excepcional") : tr("adequada", "adequate", "adecuada"),
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

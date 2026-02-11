"use client";

import { forwardRef } from "react";
import Link from "next/link";
import {
  Crown,
  Dna,
  BarChart3,
  TrendingUp,
  Check,
  Info,
  ChevronRight,
  Sparkles,
  BookOpen,
} from "lucide-react";
import AnimatedCounter from "@/components/tools/AnimatedCounter";
import ResultActions from "@/components/tools/ResultActions";
import { useLanguage } from "@/context/LanguageContext";
import type { FormData, Resultado } from "./types";

interface ResultadoDisplayProps {
  resultado: Resultado;
  form: FormData;
  onExportPDF: () => void;
  onShare: () => void;
  isExporting: boolean;
}

const ResultadoDisplay = forwardRef<HTMLDivElement, ResultadoDisplayProps>(
  function ResultadoDisplay({ resultado, form, onExportPDF, onShare, isExporting }, ref) {
    const { t } = useLanguage();

    return (
      <div
        ref={ref}
        className="space-y-6 pt-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
      >
        {/* Hero do Valor */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-8 border border-zinc-800">
          {/* Decoracoes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C5A059]/5 rounded-full blur-3xl" />
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C5A059]/10 rounded-full border border-[#C5A059]/30">
              <Crown size={12} className="text-[#C5A059]" />
              <span className="text-xs text-[#C5A059] font-medium">
                {t.calculadora.premium_eval}
              </span>
            </div>
          </div>

          <div className="relative z-10 text-center">
            {form.nome && (
              <p className="text-zinc-400 text-sm mb-1 font-serif italic">
                &ldquo;{form.nome}&rdquo;
              </p>
            )}
            <p className="text-[#C5A059] text-xs font-medium uppercase tracking-[0.2em] mb-6">
              {t.calculadora.market_value}
            </p>

            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl sm:text-7xl font-light tracking-tight text-white">
                <AnimatedCounter value={resultado.valorFinal} duration={2000} />
              </span>
              <span className="text-2xl text-[#C5A059]">&euro;</span>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-zinc-500">
              <span>Min: {resultado.valorMin.toLocaleString("pt-PT")}&euro;</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700" />
              <span>Max: {resultado.valorMax.toLocaleString("pt-PT")}&euro;</span>
            </div>

            {/* Metricas Principais */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-medium text-white">{resultado.confianca}%</div>
                <div className="text-xs text-zinc-500">{t.calculadora.confidence}</div>
              </div>
              <div className="w-px bg-zinc-800" />
              <div className="text-center">
                <div className="text-2xl font-medium text-white">
                  Top {Math.max(1, 100 - resultado.percentil)}%
                </div>
                <div className="text-xs text-zinc-500">{t.calculadora.market_psl}</div>
              </div>
              <div className="w-px bg-zinc-800" />
              <div className="text-center">
                <div className="text-2xl font-medium text-white">{resultado.multiplicador}x</div>
                <div className="text-xs text-zinc-500">{t.calculadora.multiplier}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicadores Geneticos */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
              <Dna size={16} className="text-purple-400" />
              <span>{t.calculadora.blup_estimated}</span>
            </div>
            <div className="text-3xl font-light text-white">{resultado.blup}</div>
            <div className="text-xs text-zinc-500 mt-1">{t.calculadora.blup_avg}</div>
            <div className="mt-3 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                style={{ width: `${Math.min((resultado.blup / 150) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
              <BarChart3 size={16} className="text-amber-400" />
              <span>{t.calculadora.market_percentile}</span>
            </div>
            <div className="text-3xl font-light text-white">{resultado.percentil}%</div>
            <div className="text-xs text-zinc-500 mt-1">
              {t.calculadora.above_percentile} {resultado.percentil}% {t.calculadora.of_psl}
            </div>
            <div className="mt-3 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
                style={{ width: `${resultado.percentil}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pontos Fortes e Fracos */}
        {(resultado.pontosForteseFracos.fortes.length > 0 ||
          resultado.pontosForteseFracos.fracos.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4">
            {resultado.pontosForteseFracos.fortes.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                <h3 className="text-sm font-medium text-emerald-400 mb-3 flex items-center gap-2">
                  <TrendingUp size={16} />
                  {t.calculadora.strengths}
                </h3>
                <ul className="space-y-2">
                  {resultado.pontosForteseFracos.fortes.map((ponto, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                      <Check size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      {ponto}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {resultado.pontosForteseFracos.fracos.length > 0 && (
              <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
                <h3 className="text-sm font-medium text-orange-400 mb-3 flex items-center gap-2">
                  <Info size={16} />
                  {t.calculadora.attention_areas}
                </h3>
                <ul className="space-y-2">
                  {resultado.pontosForteseFracos.fracos.map((ponto, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                      <ChevronRight size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                      {ponto}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Comparacao de Mercado */}
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-[#C5A059]" />
            {t.calculadora.market_comparison}
          </h3>
          <div className="space-y-4">
            {resultado.comparacao.map((comp, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">{comp.tipo}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-zinc-500">
                    {comp.valorMedio.toLocaleString("pt-PT")}&euro;
                  </span>
                  <span
                    className={`text-sm font-medium px-2 py-0.5 rounded ${
                      comp.diferenca >= 0
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {comp.diferenca >= 0 ? "+" : ""}
                    {comp.diferenca}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Analise por Categoria */}
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">
            {t.calculadora.category_impact}
          </h3>
          <div className="space-y-4">
            {resultado.categorias.slice(0, 6).map((cat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm text-zinc-300">{cat.nome}</span>
                    <span className="text-xs text-zinc-600 ml-2 hidden sm:inline">
                      {cat.descricao}
                    </span>
                  </div>
                  <span
                    className={`text-sm font-medium ${cat.impacto >= 0 ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {cat.impacto >= 0 ? "+" : ""}
                    {cat.impacto.toLocaleString("pt-PT")}&euro;
                  </span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C5A059] to-[#D4AF6A] transition-all duration-500"
                    style={{ width: `${Math.min(cat.score * 10, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recomendacoes */}
        {resultado.recomendacoes.length > 0 && (
          <div className="bg-[#C5A059]/5 rounded-xl p-6 border border-[#C5A059]/20">
            <h3 className="text-sm font-medium text-[#C5A059] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles size={16} />
              {t.calculadora.recommendations}
            </h3>
            <ul className="space-y-3">
              {resultado.recomendacoes.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                  <ChevronRight size={16} className="text-[#C5A059] flex-shrink-0 mt-0.5" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Informacoes do Cavalo */}
        <div className="bg-zinc-900/30 rounded-xl p-6 border border-zinc-800/50">
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">
            {t.calculadora.eval_summary}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-zinc-600 block">{t.calculadora.result_age}</span>
              <span className="text-zinc-300">
                {form.idade} {t.calculadora.label_years}
              </span>
            </div>
            <div>
              <span className="text-zinc-600 block">{t.calculadora.result_sex}</span>
              <span className="text-zinc-300">
                {form.sexo === "garanhao"
                  ? t.calculadora.sex_stallion
                  : form.sexo === "egua"
                    ? t.calculadora.sex_mare
                    : t.calculadora.sex_gelding}
              </span>
            </div>
            <div>
              <span className="text-zinc-600 block">{t.calculadora.result_level}</span>
              <span className="text-zinc-300 capitalize">{form.treino.replace("_", " ")}</span>
            </div>
            <div>
              <span className="text-zinc-600 block">{t.calculadora.result_market}</span>
              <span className="text-zinc-300">{form.mercado}</span>
            </div>
          </div>
        </div>

        {/* Acoes */}
        <ResultActions
          onExportPDF={onExportPDF}
          onShare={onShare}
          onPrint={() => window.print()}
          isExporting={isExporting}
        />

        {/* Disclaimer */}
        <div className="p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
          <p className="text-xs text-zinc-500 leading-relaxed">
            <strong className="text-zinc-400">{t.calculadora.disclaimer_title}</strong>{" "}
            {t.calculadora.disclaimer_text}
          </p>
        </div>

        {/* CTA Final */}
        <div className="text-center pt-4">
          <p className="text-sm text-zinc-500 mb-4">{t.calculadora.need_professional}</p>
          <Link
            href="/profissionais"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#C5A059]/50 text-[#C5A059] rounded-lg hover:bg-[#C5A059]/10 transition-colors"
          >
            <BookOpen size={16} />
            {t.calculadora.find_evaluators}
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }
);

export default ResultadoDisplay;

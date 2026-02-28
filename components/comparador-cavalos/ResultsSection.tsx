"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Crown,
  Euro,
  Activity,
  TrendingUp,
  Trophy,
  Target,
  Award,
  Dna,
  ChevronRight,
} from "lucide-react";
import Tooltip from "@/components/tools/Tooltip";
import SourceBadge from "@/components/tools/SourceBadge";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import RadarChart from "./RadarChart";
import type { Cavalo } from "./types";
import { CORES, TREINOS, COMPETICOES, DISCIPLINE_MATRIX, BREEDING_CHAIN_KEY } from "./data";
import {
  calcularScore,
  calcularPotencial,
  calcularValorPorPonto,
  calcularROI,
  calcDisciplineScore,
  getScoreFactors,
  getMelhor,
  getClasseCor,
  gerarVeredicto,
  gerarCustos,
} from "./calcular";

// Lazy-load heavy PRO components
const ResultActions = dynamic(() => import("@/components/tools/ResultActions"));
const BlurredProSection = dynamic(() => import("@/components/tools/BlurredProSection"));
const HorseVerdictCard = dynamic(() => import("@/components/tools/HorseVerdictCard"));
const CostProjectionTable = dynamic(() => import("@/components/tools/CostProjectionTable"));
const CategoryRanking = dynamic(() => import("@/components/tools/CategoryRanking"));
const SuitabilityProfile = dynamic(() => import("@/components/tools/SuitabilityProfile"));
const GapAnalysis = dynamic(() => import("@/components/tools/GapAnalysis"));
const PurchaseConfidence = dynamic(() => import("@/components/tools/PurchaseConfidence"));
const MethodologyPanel = dynamic(() => import("@/components/tools/MethodologyPanel"));
const ScoreBreakdown = dynamic(() => import("@/components/tools/ScoreBreakdown"));
const Confetti = dynamic(() => import("@/components/tools/Confetti"), { ssr: false });

interface ResultsSectionProps {
  cavalos: Cavalo[];
  isSubscribed: boolean;
  isExporting: boolean;
  filtroDisciplina: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Record<string, any>;
  onSetFiltroDisciplina: (d: string) => void;
  onExportPDF: () => void;
  onExportCSV: () => void;
  onShare: () => void;
  onGoBack: () => void;
}

export default function ResultsSection({
  cavalos,
  isSubscribed,
  isExporting,
  filtroDisciplina,
  t,
  onSetFiltroDisciplina,
  onExportPDF,
  onExportCSV,
  onShare,
  onGoBack,
}: ResultsSectionProps) {
  const comp = t.comparador as Record<string, string>;
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const vencedor = cavalos.reduce((a, b) => (calcularScore(a) > calcularScore(b) ? a : b));
  const melhorValor = cavalos.reduce((a, b) =>
    calcularValorPorPonto(a) < calcularValorPorPonto(b) ? a : b
  );

  // ============================================
  // INLINE HELPERS
  // ============================================

  const calcAptidao = (c: Cavalo, pesos: Record<string, number>): number => {
    let total = 0;
    let totalPeso = 0;
    if (pesos.conformacao) {
      total += (c.conformacao / 10) * 100 * pesos.conformacao;
      totalPeso += pesos.conformacao;
    }
    if (pesos.andamentos) {
      total += (c.andamentos / 10) * 100 * pesos.andamentos;
      totalPeso += pesos.andamentos;
    }
    if (pesos.elevacao) {
      total += (c.elevacao / 10) * 100 * pesos.elevacao;
      totalPeso += pesos.elevacao;
    }
    if (pesos.regularidade) {
      total += (c.regularidade / 10) * 100 * pesos.regularidade;
      totalPeso += pesos.regularidade;
    }
    if (pesos.temperamento) {
      total += (c.temperamento / 10) * 100 * pesos.temperamento;
      totalPeso += pesos.temperamento;
    }
    if (pesos.saude) {
      total += (c.saude / 10) * 100 * pesos.saude;
      totalPeso += pesos.saude;
    }
    if (pesos.blupNorm) {
      total += Math.min((c.blup / 130) * 100, 100) * pesos.blupNorm;
      totalPeso += pesos.blupNorm;
    }
    return totalPeso > 0 ? Math.round(total / totalPeso) : 0;
  };

  const PESOS_DISC: Record<string, Record<string, number>> = {
    dressage: { conformacao: 0.2, andamentos: 0.3, elevacao: 0.25, temperamento: 0.15, saude: 0.1 },
    trabalho: { conformacao: 0.25, andamentos: 0.2, temperamento: 0.3, saude: 0.15, blupNorm: 0.1 },
    reproducao: { blupNorm: 0.35, conformacao: 0.25, saude: 0.25, andamentos: 0.15 },
    lazer: { temperamento: 0.4, saude: 0.35, conformacao: 0.15, andamentos: 0.1 },
  };

  const DISC_LABELS: Record<string, string> = {
    dressage: "Dressage FEI",
    trabalho: tr("Equit. Trabalho", "Working Equit.", "Equit. Trabajo"),
    reproducao: tr("Reprodução", "Breeding", "Reproducción"),
    lazer: tr("Lazer", "Leisure", "Ocio"),
  };

  const disciplinasAptidao: { nome: string; pesos: Record<string, number> }[] = [
    {
      nome: "Alta Escola",
      pesos: {
        conformacao: 0.2,
        andamentos: 0.25,
        elevacao: 0.25,
        temperamento: 0.15,
        saude: 0.15,
      },
    },
    {
      nome: "Dressage FEI",
      pesos: {
        conformacao: 0.15,
        andamentos: 0.25,
        elevacao: 0.2,
        regularidade: 0.2,
        temperamento: 0.1,
        saude: 0.1,
      },
    },
    {
      nome: "Equit. Trabalho",
      pesos: { conformacao: 0.25, andamentos: 0.2, temperamento: 0.25, saude: 0.2, blupNorm: 0.1 },
    },
    {
      nome: "Lazer/Turismo",
      pesos: { temperamento: 0.35, saude: 0.3, conformacao: 0.2, andamentos: 0.15 },
    },
    {
      nome: "Reprodução",
      pesos: { blupNorm: 0.35, conformacao: 0.25, saude: 0.25, andamentos: 0.15 },
    },
  ];

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
      <button
        onClick={onGoBack}
        className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        {tr("Editar dados dos cavalos", "Edit horse data", "Editar datos de los caballos")}
      </button>

      <div className="relative">
        <Confetti trigger={true} particleCount={50} duration={2800} />
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <ResultActions
          onExportPDF={onExportPDF}
          onShare={onShare}
          onPrint={() => window.print()}
          isExporting={isExporting}
        />
        <button
          onClick={onExportCSV}
          className="w-full py-3 rounded-xl bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground-secondary)] text-sm font-medium hover:text-[var(--foreground)] hover:border-[var(--foreground-muted)] transition-all flex items-center justify-center gap-2"
        >
          <TrendingUp size={16} />
          {tr("Exportar CSV (Excel)", "Export CSV (Excel)", "Exportar CSV (Excel)")}
        </button>
      </div>

      {/* Filtro por Disciplina */}
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="text-xs text-[var(--foreground-muted)] self-center mr-1">
          {tr("Contexto", "Context", "Contexto")}:
        </span>
        {[
          { id: "geral", label: tr("Geral", "General", "General") },
          { id: "dressage", label: "Dressage FEI" },
          { id: "trabalho", label: tr("Equit. Trabalho", "Working Equit.", "Equit. Trabajo") },
          { id: "reproducao", label: tr("Reprodução", "Breeding", "Reproducción") },
          { id: "lazer", label: tr("Lazer", "Leisure", "Ocio") },
        ].map((d) => (
          <button
            key={d.id}
            onClick={() => onSetFiltroDisciplina(d.id)}
            className={`text-xs px-3 py-2 min-h-[36px] rounded-full border transition-all ${
              filtroDisciplina === d.id
                ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] font-semibold"
                : "border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--border)]/70"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Discipline aptitude banner */}
      {filtroDisciplina !== "geral" &&
        (() => {
          const pesos = PESOS_DISC[filtroDisciplina] ?? {};
          const aptidoes = cavalos.map((c) => ({ nome: c.nome, score: calcAptidao(c, pesos) }));
          const melhor = [...aptidoes].sort((a, b) => b.score - a.score)[0];
          return (
            <div className="flex items-center gap-3 p-3 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-xl mb-4">
              <Target size={16} className="text-[#C5A059] shrink-0" />
              <p className="text-sm text-[var(--foreground-secondary)]">
                Para{" "}
                <strong className="text-[var(--foreground)]">
                  {DISC_LABELS[filtroDisciplina]}
                </strong>
                : <strong className="text-[#C5A059]">{melhor?.nome || "Cavalo A"}</strong> tem
                melhor aptidão ({melhor?.score ?? 0} pts)
              </p>
            </div>
          );
        })()}

      {/* Recomendação hero card */}
      {(() => {
        const vencedorScore = calcularScore(vencedor);
        const fatores = getScoreFactors(vencedor);
        const melhorFator = fatores.reduce((a, b) => (a.score / a.max > b.score / b.max ? a : b));
        const vencedorIndex = cavalos.findIndex((cv) => cv.id === vencedor.id);
        const corVencedor = CORES[vencedorIndex] || "#C5A059";
        return (
          <div className="bg-gradient-to-r from-[#C5A059]/10 to-transparent border border-[#C5A059]/30 rounded-2xl p-6 mb-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#C5A059]/15 flex items-center justify-center shrink-0">
                <Crown size={18} className="text-[#C5A059]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#C5A059]/70 uppercase tracking-[0.15em]">
                  Recomendação
                </p>
                <h3 className="text-lg font-serif text-[var(--foreground)] leading-tight">
                  <span style={{ color: corVencedor }}>{vencedor.nome}</span> é o mais equilibrado
                  para a sua decisão
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
              <div className="bg-[var(--background-secondary)]/60 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold" style={{ color: corVencedor }}>
                  {vencedorScore}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Score global</p>
              </div>
              <div className="bg-[var(--background-secondary)]/60 rounded-xl p-3 text-center">
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                  {melhorFator.name}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Melhor categoria</p>
              </div>
              <div className="bg-[var(--background-secondary)]/60 rounded-xl p-3 text-center">
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">
                  {vencedor.preco > 0 ? `${vencedor.preco.toLocaleString("pt-PT")} €` : "—"}
                </p>
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5">Preço</p>
              </div>
            </div>
            {melhorValor.id !== vencedor.id && (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-500/8 border border-emerald-500/20 rounded-lg">
                <Euro size={14} className="text-emerald-400 shrink-0" aria-hidden="true" />
                <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">
                  <span className="text-emerald-400 font-medium">Melhor custo-benefício:</span>{" "}
                  <span className="font-medium text-[var(--foreground)]">{melhorValor.nome}</span>{" "}
                  <span className="text-[var(--foreground-muted)]">
                    ({calcularValorPorPonto(melhorValor).toLocaleString("pt-PT")} €/pt vs.{" "}
                    {calcularValorPorPonto(vencedor).toLocaleString("pt-PT")} €/pt)
                  </span>
                </p>
              </div>
            )}
            <p className="text-xs text-[#C5A059]/60 text-center">
              Consulte a análise completa abaixo ↓
            </p>
          </div>
        );
      })()}

      {/* Escolha Óbvia banner */}
      {(() => {
        const scores = cavalos.map((c) => calcularScore(c)).sort((a, b) => b - a);
        const gap = scores.length >= 2 ? scores[0] - scores[1] : 0;
        const vencedorIdx = cavalos.findIndex((c) => c.id === vencedor.id);
        const cor = CORES[vencedorIdx] || "#C5A059";
        if (gap < 20) return null;
        return (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-900/10 p-4 flex items-center gap-3 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
              <Trophy size={18} className="text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-400 mb-0.5">
                Escolha clara: <span style={{ color: cor }}>{vencedor.nome}</span>
              </p>
              <p className="text-xs text-[var(--foreground-muted)] leading-snug">
                Margem de {gap} pontos em relação ao segundo — diferença significativa e consistente
                entre os cavalos comparados.
              </p>
            </div>
          </div>
        );
      })()}

      {/* Veredicto Profissional */}
      {cavalos.length >= 2 &&
        (() => {
          const sorted = [...cavalos]
            .map((c) => ({ c, score: calcularScore(c) }))
            .sort((a, b) => b.score - a.score);
          const best = sorted[0];
          const second = sorted[1];
          const gap = best.score - second.score;
          const bestC = best.c;
          const secondC = second.c;

          const pontosFortesVencedor: string[] = [];
          if (bestC.conformacao >= 8)
            pontosFortesVencedor.push("conformação morfológica excepcional");
          if (bestC.andamentos >= 8) pontosFortesVencedor.push("andamentos de qualidade superior");
          if (bestC.blup >= 115) pontosFortesVencedor.push("elevado mérito genético (BLUP)");
          if (bestC.saude >= 8) pontosFortesVencedor.push("saúde excelente");
          if (bestC.competicoes !== "Nenhuma" && bestC.competicoes !== "nenhuma")
            pontosFortesVencedor.push("palmarés desportivo comprovado");
          if (bestC.idade >= 7 && bestC.idade <= 12)
            pontosFortesVencedor.push("idade ideal de performance");

          const pontosFortesSeg: string[] = [];
          if (secondC.conformacao > bestC.conformacao) pontosFortesSeg.push("conformação");
          if (secondC.andamentos > bestC.andamentos) pontosFortesSeg.push("andamentos");
          if (secondC.blup > bestC.blup) pontosFortesSeg.push("mérito genético");
          if ((secondC.saude ?? 0) > (bestC.saude ?? 0)) pontosFortesSeg.push("saúde");

          const introText =
            gap >= 25
              ? `Com uma margem expressiva de ${gap} pontos, **${bestC.nome || "Cavalo A"}** é a escolha clara e inequívoca.`
              : gap >= 15
                ? `**${bestC.nome || "Cavalo A"}** destaca-se com ${gap} pontos de vantagem numa comparação competitiva.`
                : gap >= 5
                  ? `**${bestC.nome || "Cavalo A"}** lidera com uma vantagem de ${gap} pontos num confronto equilibrado.`
                  : `Numa comparação muito próxima (margem de ${gap} pontos), **${bestC.nome || "Cavalo A"}** obtém uma ligeira vantagem.`;

          const pontosStr =
            pontosFortesVencedor.length > 0
              ? `Os seus principais trunfos são: ${pontosFortesVencedor.slice(0, 3).join(", ")}.`
              : "";
          const segStr =
            pontosFortesSeg.length > 0
              ? `${secondC.nome || "Cavalo B"} mantém vantagem em ${pontosFortesSeg.join(" e ")}.`
              : "";
          const recomStr = (() => {
            if (bestC.idade < 7 && best.score >= 65)
              return `Com ${bestC.idade} anos e este score, ${bestC.nome || "este cavalo"} tem elevado potencial de valorização nos próximos anos.`;
            if (bestC.sexo === "Garanhão" && best.score >= 70)
              return `Como garanhão de qualidade, ${bestC.nome || "este cavalo"} combina valor desportivo com potencial reprodutivo.`;
            if (best.score >= 80)
              return `Um score acima de 80 pontos posiciona ${bestC.nome || "este cavalo"} no quartil superior da raça Lusitana.`;
            return `Recomendamos avaliação presencial antes de qualquer decisão de compra.`;
          })();

          const linhas = [introText, pontosStr, segStr, recomStr].filter(Boolean);

          return (
            <div className="bg-gradient-to-br from-[var(--background-secondary)] to-[var(--background-card)] rounded-xl p-5 border border-[var(--gold)]/20 mb-2">
              <h3 className="text-sm font-semibold text-[#C5A059] mb-3 flex items-center gap-2 uppercase tracking-wider">
                <Award size={15} /> Veredicto Profissional
              </h3>
              <div className="space-y-2 text-sm text-[var(--foreground-secondary)] leading-relaxed">
                {linhas.map((linha, i) => (
                  <p key={i}>
                    {linha.split(/\*\*([^*]+)\*\*/).map((part, j) =>
                      j % 2 === 1 ? (
                        <strong key={j} className="text-[var(--foreground)]">
                          {part}
                        </strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-[var(--border)]/40 flex flex-wrap items-center gap-3 text-xs text-[var(--foreground-muted)]">
                <span>
                  Score: <strong className="text-[#C5A059]">{best.score}</strong> / 100
                </span>
                <span>
                  vs. {secondC.nome || "Cavalo B"}: <strong>{second.score}</strong>
                </span>
                {gap >= 15 && (
                  <span className="ml-auto px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full font-medium">
                    Escolha Clara
                  </span>
                )}
              </div>
            </div>
          );
        })()}

      {/* CTA → Verificador */}
      {cavalos.length === 2 &&
        cavalos.some((c) => c.sexo === "Garanhão") &&
        cavalos.some((c) => c.sexo === "Égua") && (
          <div className="bg-pink-900/15 border border-pink-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Dna size={18} className="text-pink-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Verificar Compatibilidade Reprodutiva
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {cavalos.find((c) => c.sexo === "Garanhão")?.nome || "Garanhão"} ×{" "}
                  {cavalos.find((c) => c.sexo === "Égua")?.nome || "Égua"} — analisar
                  compatibilidade genética
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                try {
                  const g = cavalos.find((c) => c.sexo === "Garanhão")!;
                  const e = cavalos.find((c) => c.sexo === "Égua")!;
                  sessionStorage.setItem(
                    BREEDING_CHAIN_KEY,
                    JSON.stringify({ garanhao: g, egua: e, source: "comparador" })
                  );
                } catch {}
                window.location.href = "/verificador-compatibilidade";
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-3 min-h-[44px] bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-semibold rounded-lg hover:bg-pink-500/30 transition-all whitespace-nowrap w-full sm:w-auto"
            >
              Verificar <ChevronRight size={13} />
            </button>
          </div>
        )}

      {/* Radar Chart */}
      <div className="bg-[var(--background-secondary)]/50 rounded-2xl p-6 border border-[var(--border)]">
        <h3 className="text-lg font-serif mb-6 flex items-center gap-3">
          <Activity className="text-blue-400" size={20} />
          {comp.visual_comparison}
          <Tooltip
            text={
              comp.tooltip_radar ??
              tr(
                "Cada eixo representa uma dimensão avaliada de 0 a 10. A área total reflecte o perfil global do cavalo.",
                "Each axis represents a dimension scored from 0 to 10. The total area reflects the horse's overall profile.",
                "Cada eje representa una dimensión evaluada de 0 a 10. El área total refleja el perfil global del caballo."
              )
            }
          />
        </h3>
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[320px] sm:max-w-[280px] overflow-hidden">
            <RadarChart
              cavalos={cavalos.map((c, i) => ({
                nome: c.nome,
                valores: [
                  c.conformacao,
                  c.andamentos,
                  c.elevacao,
                  c.regularidade,
                  c.temperamento,
                  c.saude,
                  Math.min(c.blup / 13, 10),
                  TREINOS.find((t) => t.value === c.treino)?.nivel || 4,
                ],
                cor: CORES[i],
              }))}
              labels={[
                "Conform.",
                "Andam.",
                "Elevação",
                "Regular.",
                "Temper.",
                "Saúde",
                "Pedigree",
                "Treino",
              ]}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {cavalos.map((c, i) => (
              <div key={c.id} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CORES[i] }} />
                <span className="text-sm text-[var(--foreground-secondary)]">{c.nome}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Ranking */}
      <CategoryRanking cavalos={cavalos} cores={CORES} />

      {/* Categorias Vencidas */}
      {cavalos.length >= 2 &&
        (() => {
          const CAMPOS: (keyof Cavalo)[] = [
            "conformacao",
            "andamentos",
            "elevacao",
            "regularidade",
            "temperamento",
            "saude",
            "blup",
          ];
          const vitorias = cavalos.map((c) => {
            let v = 0;
            CAMPOS.forEach((campo) => {
              const melhor = Math.max(...cavalos.map((x) => x[campo] as number));
              if ((c[campo] as number) === melhor) v++;
            });
            const maxScore = Math.max(...cavalos.map(calcularScore));
            if (calcularScore(c) === maxScore) v++;
            return { id: c.id, nome: c.nome, vitorias: v };
          });
          const total = CAMPOS.length + 1;
          return (
            <div className="bg-[var(--background-secondary)]/50 rounded-2xl p-5 border border-[var(--border)]">
              <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] uppercase tracking-wider mb-4">
                Categorias Vencidas ({total} categorias)
              </h3>
              <div
                className={`grid gap-3 ${cavalos.length === 2 ? "grid-cols-2" : cavalos.length === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}
              >
                {vitorias.map((v, i) => (
                  <div
                    key={v.id}
                    className="text-center p-4 rounded-xl bg-[var(--background-card)]/40 border border-[var(--border)]"
                  >
                    <p className="text-3xl font-bold mb-1" style={{ color: CORES[i] }}>
                      {v.vitorias}
                    </p>
                    <p className="text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider mb-1">
                      de {total}
                    </p>
                    <p className="text-xs font-medium text-[var(--foreground-secondary)] truncate">
                      {v.nome}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

      {/* Suitability Profile */}
      <SuitabilityProfile cavalos={cavalos} cores={CORES} />

      {/* Discipline Matrix (Free) */}
      <div className="bg-[var(--background-secondary)]/50 rounded-xl p-4 sm:p-6 border border-[var(--border)] mb-6">
        <h3 className="text-sm font-semibold text-[var(--foreground-secondary)] uppercase tracking-wider mb-5 flex items-center gap-2">
          <Target size={16} className="text-[#C5A059]" /> Aptidão por Disciplina
        </h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-sm" style={{ minWidth: "320px" }}>
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left text-xs text-[var(--foreground-muted)] pb-3 pr-4 min-w-[100px]">
                  Disciplina
                </th>
                {cavalos.map((c, i) => (
                  <th
                    key={i}
                    className="text-center text-xs pb-3 px-2 min-w-[60px]"
                    style={{ color: CORES[i] }}
                  >
                    {c.nome || `Cavalo ${i + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/30">
              {disciplinasAptidao.map((disc) => {
                const scores = cavalos.map((c) => calcAptidao(c, disc.pesos));
                const maxScore = Math.max(...scores);
                return (
                  <tr key={disc.nome}>
                    <td className="py-3 pr-4 text-xs text-[var(--foreground-secondary)] whitespace-nowrap">
                      {disc.nome}
                    </td>
                    {scores.map((score, i) => (
                      <td key={i} className="py-3 px-2 text-center">
                        <span
                          className={`text-sm font-bold ${score === maxScore && cavalos.length > 1 ? "" : "text-[var(--foreground-muted)]"}`}
                          style={
                            score === maxScore && cavalos.length > 1 ? { color: CORES[i] } : {}
                          }
                        >
                          {score}
                          {score === maxScore && cavalos.length > 1 && (
                            <span className="ml-1 text-[10px]">★</span>
                          )}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-[var(--foreground-muted)]/60 mt-3">
          ★ Melhor cavalo por disciplina. Scores de 0-100 baseados em pesos específicos de cada
          disciplina.
        </p>
      </div>

      {/* Discipline Matrix PRO */}
      <BlurredProSection
        isSubscribed={isSubscribed}
        title={tr("Aptidão por Disciplina", "Discipline Suitability", "Aptitud por Disciplina")}
      >
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-sm" style={{ minWidth: "360px" }}>
            <thead>
              <tr>
                <th className="text-left text-xs text-[var(--foreground-muted)] font-medium pb-3 pr-4 min-w-[160px]">
                  Disciplina
                </th>
                {cavalos.map((c, i) => (
                  <th
                    key={c.id}
                    className="text-center text-xs font-semibold pb-3 px-2 min-w-[80px]"
                    style={{ color: CORES[i] }}
                  >
                    {c.nome || `Cavalo ${String.fromCharCode(65 + i)}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/40">
              {DISCIPLINE_MATRIX.map((disc) => {
                const scores = cavalos.map((c) =>
                  calcDisciplineScore(c, disc.weights as Record<string, number>)
                );
                const maxScore = Math.max(...scores);
                return (
                  <tr key={disc.label}>
                    <td className="py-3 pr-4 text-[var(--foreground-secondary)] font-medium text-xs">
                      {disc.label}
                    </td>
                    {scores.map((score, i) => {
                      const isBest = score === maxScore && cavalos.length > 1;
                      const bg =
                        score >= 70
                          ? "bg-emerald-500/15 text-emerald-400"
                          : score >= 50
                            ? "bg-amber-500/15 text-amber-400"
                            : "bg-red-500/10 text-red-400";
                      return (
                        <td key={i} className="py-3 px-2 text-center">
                          <span
                            className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold tabular-nums ${bg} ${isBest ? "ring-1 ring-current" : ""}`}
                          >
                            {score}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-[var(--foreground-muted)] mt-3 text-right">
            Verde ≥70 · Âmbar 50-69 · Vermelho &lt;50 · Destaque = melhor nessa disciplina
          </p>
        </div>
      </BlurredProSection>

      {/* PRO: Comparative Table */}
      <BlurredProSection isSubscribed={isSubscribed} title={comp.comparative_table}>
        <div className="bg-[var(--background-secondary)]/50 rounded-2xl p-4 sm:p-6 border border-[var(--border)]">
          <h3 className="text-lg font-serif mb-6 flex items-center gap-3">
            <Activity className="text-blue-400" size={20} /> {comp.comparative_table}
          </h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm" style={{ minWidth: "480px" }}>
              <thead>
                <tr className="text-[var(--foreground-secondary)] border-b border-[var(--border)]">
                  <th className="text-left py-3 px-3 min-w-[110px] sticky left-0 bg-[var(--background-secondary)]">
                    {comp.param_header}
                  </th>
                  {cavalos.map((c, i) => (
                    <th
                      key={c.id}
                      className="text-center py-3 px-3 min-w-[90px]"
                      style={{ color: CORES[i] }}
                    >
                      {c.nome}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: comp.param_age, campo: "idade" as const, maior: false, suffix: " anos" },
                  {
                    label: comp.param_height,
                    campo: "altura" as const,
                    maior: false,
                    suffix: " cm",
                  },
                  {
                    label: comp.param_conformation,
                    campo: "conformacao" as const,
                    maior: true,
                    suffix: "/10",
                  },
                  {
                    label: comp.param_gaits,
                    campo: "andamentos" as const,
                    maior: true,
                    suffix: "/10",
                  },
                  {
                    label: comp.param_temperament,
                    campo: "temperamento" as const,
                    maior: true,
                    suffix: "/10",
                  },
                  { label: comp.param_health, campo: "saude" as const, maior: true, suffix: "/10" },
                  { label: "BLUP", campo: "blup" as const, maior: true, suffix: "" },
                  { label: comp.param_price, campo: "preco" as const, maior: false, suffix: "€" },
                ].map(({ label, campo, maior, suffix }) => (
                  <tr key={campo} className="border-b border-[var(--border)]/50">
                    <td className="py-3 px-3 text-[var(--foreground-secondary)] sticky left-0 bg-[var(--background-secondary)]">
                      {label}
                    </td>
                    {cavalos.map((c) => (
                      <td
                        key={c.id}
                        className={`text-center py-3 px-3 ${getClasseCor(c[campo] as number, getMelhor(cavalos, campo, maior), maior)}`}
                      >
                        {campo === "preco"
                          ? `${(c[campo] as number).toLocaleString("pt-PT")}${suffix}`
                          : `${c[campo]}${suffix}`}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t-2 border-[var(--border)]">
                  <td className="py-4 px-3 font-semibold text-[var(--foreground)] sticky left-0 bg-[var(--background-secondary)]">
                    {comp.total_score}
                  </td>
                  {cavalos.map((c, i) => (
                    <td key={c.id} className="text-center py-4 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-bold" style={{ color: CORES[i] }}>
                          {calcularScore(c)}
                        </span>
                        <SourceBadge source="modelo" />
                        {c.id === vencedor.id && (
                          <Crown className="inline text-amber-400" size={16} />
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <TrendingUp size={11} className="text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">
                          Potencial: {calcularPotencial(c)}
                        </span>
                      </div>
                      <div className="mt-2 text-left">
                        <ScoreBreakdown factors={getScoreFactors(c)} total={calcularScore(c)} />
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-[var(--border)]">
                  <td className="py-3 px-3 text-[var(--foreground-secondary)] sticky left-0 bg-[var(--background-secondary)]">
                    {comp.value_per_pt}
                  </td>
                  {cavalos.map((c) => (
                    <td
                      key={c.id}
                      className={`text-center py-3 px-3 ${c.id === melhorValor.id ? "text-emerald-400 font-semibold" : "text-[var(--foreground-secondary)]"}`}
                    >
                      {calcularValorPorPonto(c).toLocaleString("pt-PT")}€
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </BlurredProSection>

      {/* Best Score + Best Value cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-900/30 to-[var(--background-secondary)] rounded-2xl p-6 border border-amber-500/30">
          <h3 className="text-lg font-serif mb-4 flex items-center gap-3">
            <Trophy className="text-amber-400" size={20} />
            {comp.best_quality}
            <Tooltip
              text={
                comp.tooltip_melhor_score ??
                "O cavalo com maior score total no conjunto de factores avaliados."
              }
            />
          </h3>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-500/20 rounded-xl">
              <Crown className="text-amber-400" size={28} />
            </div>
            <div>
              <p className="text-xl font-bold text-amber-400">{vencedor.nome}</p>
              <p className="text-sm text-[var(--foreground-secondary)]">
                Score: {calcularScore(vencedor)} {comp.points}
              </p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                {vencedor.treino} • {vencedor.linhagem}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-900/30 to-[var(--background-secondary)] rounded-2xl p-6 border border-emerald-500/30">
          <h3 className="text-lg font-serif mb-4 flex items-center gap-3">
            <Euro className="text-emerald-400" size={20} />
            {comp.best_cost_benefit}
            <Tooltip
              text={comp.tooltip_melhor_valor ?? "O cavalo com menor custo por ponto de score."}
            />
          </h3>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-500/20 rounded-xl">
              <TrendingUp className="text-emerald-400" size={28} />
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-400">{melhorValor.nome}</p>
              <p className="text-sm text-[var(--foreground-secondary)]">
                {calcularValorPorPonto(melhorValor).toLocaleString("pt-PT")}€ {comp.per_point}
              </p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                {melhorValor.preco.toLocaleString("pt-PT")}€ • Score {calcularScore(melhorValor)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PRO: Verdict per horse */}
      <BlurredProSection isSubscribed={isSubscribed} title={comp.verdict_title}>
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-2">
            {comp.verdict_title}
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-4">{comp.verdict_desc}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {cavalos.map((c) => {
              const v = gerarVeredicto(c);
              return (
                <HorseVerdictCard
                  key={c.id}
                  nome={c.nome}
                  score={calcularScore(c)}
                  strengths={v.strengths}
                  weaknesses={v.weaknesses}
                  bestUse={v.bestUse}
                  riskLevel={v.riskLevel}
                  recommendation={v.recommendation}
                />
              );
            })}
          </div>
        </div>
      </BlurredProSection>

      {/* PRO: Cost projection */}
      <BlurredProSection isSubscribed={isSubscribed} title={comp.cost_projection_title}>
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[var(--foreground-secondary)] uppercase tracking-wider mb-2">
            {comp.cost_projection_title}
          </h3>
          <p className="text-xs text-[var(--foreground-muted)] mb-4">{comp.cost_projection_desc}</p>
          <CostProjectionTable horses={cavalos.map(gerarCustos)} />
          <div
            className={`mt-4 grid gap-3 ${cavalos.length === 2 ? "grid-cols-2" : cavalos.length === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}
          >
            {cavalos.map((c, i) => {
              const roi = calcularROI(c);
              return (
                <div
                  key={c.id}
                  className="p-3 rounded-lg bg-[var(--background-card)] border border-[var(--border)]"
                >
                  <p
                    className="text-xs text-[var(--foreground-muted)] mb-1"
                    style={{ color: CORES[i] }}
                  >
                    {c.nome}
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: roi.roi5yr >= 0 ? "#22c55e" : "#ef4444" }}
                  >
                    {roi.roi5yr >= 0 ? "+" : ""}
                    {roi.roi5yr}%
                  </p>
                  <p className="text-[10px] text-[var(--foreground-muted)]">ROI 5 anos</p>
                  <p className="text-[10px] text-[var(--foreground-muted)] mt-1">
                    Horizonte:{" "}
                    <span className="text-[var(--foreground-secondary)]">{roi.horizonte}</span>
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-[var(--foreground-muted)]/60 leading-relaxed mt-3">
            {comp.cost_disclaimer}
          </p>
        </div>
      </BlurredProSection>

      {/* PRO: Gap Analysis */}
      <BlurredProSection
        isSubscribed={isSubscribed}
        title={comp.gap_title ?? tr("Análise de Gap", "Gap Analysis", "Análisis de Gap")}
      >
        <GapAnalysis
          cavalos={cavalos}
          cores={CORES}
          calcularScore={(c) => calcularScore(c as Cavalo)}
        />
      </BlurredProSection>

      {/* PRO: Purchase Confidence */}
      <BlurredProSection
        isSubscribed={isSubscribed}
        title={
          comp.confidence_title ??
          tr(
            "Índice de Confiança na Compra",
            "Purchase Confidence Index",
            "Índice de Confianza en la Compra"
          )
        }
      >
        <PurchaseConfidence
          cavalos={cavalos}
          vencedorId={vencedor.id}
          calcularScore={(c) => calcularScore(c as Cavalo)}
        />
      </BlurredProSection>

      {/* Methodology */}
      <MethodologyPanel
        title={
          comp.methodology_panel_title ??
          tr("Metodologia de Comparação", "Comparison Methodology", "Metodología de Comparación")
        }
        factors={[
          {
            name: tr("Linhagem", "Lineage", "Linaje"),
            weight: "15pts",
            description: tr(
              "Qualidade do pedigree: Desconhecida a Elite",
              "Pedigree quality: Unknown to Elite",
              "Calidad del pedigrí: Desconocido a Élite"
            ),
            standard: "APSL",
          },
          {
            name: tr("Treino", "Training", "Entrenamiento"),
            weight: "15pts",
            description: tr(
              "Nível de treino conforme escalas FEI",
              "Training level according to FEI scales",
              "Nivel de entrenamiento según escalas FEI"
            ),
            standard: "FEI",
          },
          {
            name: tr("Conformação", "Conformation", "Conformación"),
            weight: "10pts",
            description: tr(
              "Avaliação morfológica segundo padrões APSL",
              "Morphological assessment according to APSL standards",
              "Evaluación morfológica según estándares APSL"
            ),
            standard: "APSL",
          },
          {
            name: tr("Andamentos", "Gaits", "Aires"),
            weight: "10pts",
            description: tr(
              "Qualidade dos três andamentos básicos",
              "Quality of the three basic gaits",
              "Calidad de los tres aires básicos"
            ),
          },
          {
            name: tr("Idade", "Age", "Edad"),
            weight: "10pts",
            description: tr(
              "Faixa ideal: 6-12 anos (máximo); 4-15 (bom)",
              "Ideal range: 6-12 years (maximum); 4-15 (good)",
              "Rango ideal: 6-12 años (máximo); 4-15 (bueno)"
            ),
          },
          {
            name: tr("Competições", "Competitions", "Competiciones"),
            weight: "8pts",
            description: tr(
              "Historial competitivo e classificações",
              "Competition history and classifications",
              "Historial competitivo y clasificaciones"
            ),
          },
          {
            name: tr("Altura", "Height", "Altura"),
            weight: "8pts",
            description: tr(
              "Faixa ideal: 158-168cm",
              "Ideal range: 158-168cm",
              "Rango ideal: 158-168cm"
            ),
          },
          {
            name: tr("Temperamento", "Temperament", "Temperamento"),
            weight: "7pts",
            description: tr(
              "Docilidade e capacidade de trabalho",
              "Docility and work capacity",
              "Docilidad y capacidad de trabajo"
            ),
          },
          {
            name: tr("Saúde", "Health", "Salud"),
            weight: "7pts",
            description: tr(
              "Historial clínico e condição geral",
              "Clinical history and general condition",
              "Historial clínico y condición general"
            ),
            standard: tr("veterinário", "veterinary", "veterinario"),
          },
          {
            name: "BLUP",
            weight: "5pts",
            description: tr(
              "Estimativa de mérito genético",
              "Genetic merit estimate",
              "Estimación de mérito genético"
            ),
            standard: tr("modelo", "model", "modelo"),
          },
          {
            name: tr("Elev.+Reg.", "Elev.+Reg.", "Elev.+Reg."),
            weight: "5pts",
            description: tr(
              "Elevação e regularidade dos andamentos",
              "Gait elevation and regularity",
              "Elevación y regularidad de los aires"
            ),
          },
          {
            name: tr("Registo APSL", "APSL Registration", "Registro APSL"),
            weight: "3pts",
            description: tr(
              "Bónus para cavalos com registo oficial",
              "Bonus for horses with official registration",
              "Bonificación para caballos con registro oficial"
            ),
            standard: "APSL",
          },
        ]}
        limitations={[
          comp.limitation_1 ??
            tr(
              "Comparação limitada aos dados declarados pelo utilizador",
              "Comparison limited to user-declared data",
              "Comparación limitada a los datos declarados por el usuario"
            ),
          comp.limitation_2 ??
            tr(
              "O score não captura a química cavaleiro-cavalo",
              "The score doesn't capture rider-horse chemistry",
              "La puntuación no captura la química jinete-caballo"
            ),
          comp.limitation_3 ??
            tr(
              "Preços declarados pelo utilizador, não verificados",
              "User-declared prices, not verified",
              "Precios declarados por el usuario, no verificados"
            ),
        ]}
        version={comp.methodology_version ?? "v2.1 — Fev 2026"}
        references={[
          tr("Padrões APSL", "APSL Standards", "Estándares APSL"),
          tr("Escalas FEI", "FEI Scales", "Escalas FEI"),
        ]}
      />

      {/* Disclaimer */}
      <div className="p-4 bg-[var(--background-secondary)]/30 rounded-xl border border-[var(--border)]/50">
        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
          <strong className="text-[var(--foreground-secondary)]">{comp.disclaimer_title}</strong>{" "}
          {comp.disclaimer_text}
          <span className="block mt-1 text-[10px] text-[var(--foreground-muted)]/40 font-mono">
            {comp.methodology_version ?? "v2.1 — Fev 2026"}
          </span>
        </p>
      </div>

      {/* Cross-links */}
      <div className="pt-4">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--foreground-muted)] mb-4">
          <ChevronRight size={13} className="text-[var(--gold)]" aria-hidden="true" />{" "}
          {tr("Continua a tua jornada", "Continue your journey", "Continúa tu camino")}
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <Link
            href="/verificador-compatibilidade"
            className="group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl hover:border-pink-500/40 transition-all"
          >
            <Dna
              size={18}
              className="text-pink-400 shrink-0 group-hover:scale-110 transition-transform"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {tr("Verificador Genético", "Genetic Checker", "Verificador Genético")}
              </p>
              <p className="text-xs text-[var(--foreground-muted)] truncate">
                {tr(
                  "Testa o par mais promissor",
                  "Test the most promising pair",
                  "Prueba el par más prometedor"
                )}
              </p>
            </div>
            <ChevronRight
              size={16}
              className="text-[var(--foreground-muted)] ml-auto shrink-0 group-hover:text-pink-400 transition-colors"
            />
          </Link>
          <Link
            href="/calculadora-valor"
            className="group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/40 transition-all"
          >
            <Euro
              size={18}
              className="text-[var(--gold)] shrink-0 group-hover:scale-110 transition-transform"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {tr("Calculadora de Valor", "Value Calculator", "Calculadora de Valor")}
              </p>
              <p className="text-xs text-[var(--foreground-muted)] truncate">
                {tr(
                  "Estima o valor do vencedor",
                  "Estimate the winner's value",
                  "Estima el valor del ganador"
                )}
              </p>
            </div>
            <ChevronRight
              size={16}
              className="text-[var(--foreground-muted)] ml-auto shrink-0 group-hover:text-[var(--gold)] transition-colors"
            />
          </Link>
          <Link
            href="/analise-perfil"
            className="group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/40 transition-all"
          >
            <Target
              size={18}
              className="text-purple-400 shrink-0 group-hover:scale-110 transition-transform"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {tr("Análise de Perfil", "Profile Analysis", "Análisis de Perfil")}
              </p>
              <p className="text-xs text-[var(--foreground-muted)] truncate">
                {tr(
                  "Confirma o teu tipo de comprador",
                  "Confirm your buyer type",
                  "Confirma tu tipo de comprador"
                )}
              </p>
            </div>
            <ChevronRight
              size={16}
              className="text-[var(--foreground-muted)] ml-auto shrink-0 group-hover:text-purple-400 transition-colors"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

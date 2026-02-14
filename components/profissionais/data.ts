import type { Profissional, Evento, ArtigoEducativo, EstatisticasComunidade } from "./types";

// =============================================================================
// BASE DE DADOS - Profissionais, Eventos, Artigos
// =============================================================================

// Dados reais vêm da API (/api/profissionais) — sem dados placeholder
export const profissionaisDB: Profissional[] = [];

// =============================================================================
// EVENTOS E ARTIGOS DA COMUNIDADE
// =============================================================================

export const eventosDB: Evento[] = [];

export const artigosDB: ArtigoEducativo[] = [];

// =============================================================================
// ESTATÍSTICAS DA COMUNIDADE
// =============================================================================

export const calcularEstatisticas = (
  profissionaisReais?: Profissional[]
): EstatisticasComunidade => {
  const lista =
    profissionaisReais && profissionaisReais.length > 0 ? profissionaisReais : profissionaisDB;
  const total = lista.length;
  const verificados = lista.filter((p) => p.nivelVerificacao !== "basico").length;
  const totalAvaliacoes = lista.reduce((acc, p) => acc + p.numAvaliacoes, 0);
  const mediaAval = total > 0 ? lista.reduce((acc, p) => acc + p.avaliacao, 0) / total : 0;
  const casosTotal = lista.reduce((acc, p) => acc + p.metricas.casosConcluidosAno, 0);

  return {
    totalProfissionais: total,
    profissionaisVerificados: verificados,
    avaliacoesTotal: totalAvaliacoes,
    mediaAvaliacoes: Math.round(mediaAval * 10) / 10,
    casosResolvidos: casosTotal,
    clientesSatisfeitos: total > 0 ? 96 : 0,
    anunciosAtivos: total,
    eventosProximos: eventosDB.length,
  };
};

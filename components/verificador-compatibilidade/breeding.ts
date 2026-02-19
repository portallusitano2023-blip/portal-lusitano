// ============================================
// CÁLCULOS DE CRIAÇÃO — Verificador de Compatibilidade
// ============================================

import type { Cavalo, ResultadoCompatibilidade } from "./types";

// ============================================
// Calendário de Criação — Milestones
// ============================================

export interface BreedingMilestone {
  label: string;
  startMonth: number; // 1-12
  durationMonths: number;
  description: string;
}

export function calcularCalendarioCriacao(_mesActual: number): BreedingMilestone[] {
  return [
    {
      label: "Época de Cobrição",
      startMonth: 3,
      durationMonths: 4,
      description: "Março a Junho — período ideal para cobrição natural ou IA",
    },
    {
      label: "Gestação",
      startMonth: 4,
      durationMonths: 11,
      description: "Aproximadamente 340 dias de gestação",
    },
    {
      label: "Nascimento Estimado",
      startMonth: ((4 + 11 - 1) % 12) + 1, // ~March next year
      durationMonths: 1,
      description: "Nascimento previsto na primavera seguinte",
    },
    {
      label: "Desmame",
      startMonth: ((4 + 11 + 6 - 1) % 12) + 1,
      durationMonths: 1,
      description: "Desmame aos 6 meses de idade",
    },
    {
      label: "Primeira Manipulação",
      startMonth: ((4 + 11 + 12 - 1) % 12) + 1,
      durationMonths: 2,
      description: "Início do maneio e habituação ao contacto humano",
    },
    {
      label: "Início do Desbaste",
      startMonth: ((4 + 11 - 1) % 12) + 1, // same month, 3 years later
      durationMonths: 6,
      description: "Desbaste aos 3 anos — início do trabalho montado",
    },
  ];
}

// ============================================
// Radar de Aptidão do Potro
// ============================================

export interface OffspringAxis {
  label: string;
  stallionScore: number;
  mareScore: number;
  offspringScore: number;
}

export function calcularAptidoesPotro(garanhao: Cavalo, egua: Cavalo): OffspringAxis[] {
  // Pesos diferenciados:
  // Conformação: garanhão 55%, égua 45%
  // Andamentos: garanhão 50%, égua 50%
  // Temperamento: garanhão 45%, égua 55%
  // Aptidão Desportiva: garanhão 55%, égua 45%
  // Potencial Reprodutivo: garanhão 40%, égua 60%
  // Valor Genético: baseado no BLUP médio

  const stallionConf = garanhao.conformacao * 10;
  const mareConf = egua.conformacao * 10;

  const stallionAnd = garanhao.andamentos * 10;
  const mareAnd = egua.andamentos * 10;

  const stallionTemp =
    garanhao.temperamento === "excelente"
      ? 90
      : garanhao.temperamento === "bom"
        ? 70
        : garanhao.temperamento === "regular"
          ? 50
          : 30;
  const mareTemp =
    egua.temperamento === "excelente"
      ? 90
      : egua.temperamento === "bom"
        ? 70
        : egua.temperamento === "regular"
          ? 50
          : 30;

  const stallionSport = Math.min(
    100,
    (garanhao.conformacao + garanhao.andamentos) * 5 + (garanhao.blup > 100 ? 10 : 0)
  );
  const mareSport = Math.min(
    100,
    (egua.conformacao + egua.andamentos) * 5 + (egua.blup > 100 ? 10 : 0)
  );

  const stallionRepro =
    garanhao.fertilidade === "comprovada"
      ? 90
      : garanhao.fertilidade === "boa"
        ? 75
        : garanhao.fertilidade === "desconhecida"
          ? 50
          : 30;
  const mareRepro =
    egua.fertilidade === "comprovada"
      ? 90
      : egua.fertilidade === "boa"
        ? 75
        : egua.fertilidade === "desconhecida"
          ? 50
          : 30;

  const stallionGen = Math.min(100, (garanhao.blup / 150) * 100);
  const mareGen = Math.min(100, (egua.blup / 150) * 100);

  return [
    {
      label: "Conformação",
      stallionScore: stallionConf,
      mareScore: mareConf,
      offspringScore: Math.round(stallionConf * 0.55 + mareConf * 0.45),
    },
    {
      label: "Andamentos",
      stallionScore: stallionAnd,
      mareScore: mareAnd,
      offspringScore: Math.round(stallionAnd * 0.5 + mareAnd * 0.5),
    },
    {
      label: "Temperamento",
      stallionScore: stallionTemp,
      mareScore: mareTemp,
      offspringScore: Math.round(stallionTemp * 0.45 + mareTemp * 0.55),
    },
    {
      label: "Aptidão Desportiva",
      stallionScore: stallionSport,
      mareScore: mareSport,
      offspringScore: Math.round(stallionSport * 0.55 + mareSport * 0.45),
    },
    {
      label: "Potencial Reprodutivo",
      stallionScore: stallionRepro,
      mareScore: mareRepro,
      offspringScore: Math.round(stallionRepro * 0.4 + mareRepro * 0.6),
    },
    {
      label: "Valor Genético",
      stallionScore: Math.round(stallionGen),
      mareScore: Math.round(mareGen),
      offspringScore: Math.round(stallionGen * 0.5 + mareGen * 0.5),
    },
  ];
}

// ============================================
// Estimativa de Valor do Potro
// ============================================

export interface FoalValueStage {
  stage: string;
  value: number;
  description: string;
}

export function calcularValorPotro(
  resultado: ResultadoCompatibilidade,
  garanhao: Cavalo,
  egua: Cavalo
): FoalValueStage[] {
  // Qualidade da linhagem baseada na compatibilidade
  const qualidadeLinhagem = resultado.score / 100; // 0-1

  // BLUP médio dos pais
  const mediaBLUP = (garanhao.blup + egua.blup) / 2;

  // Valor base ao desmame
  // Modelo: base + (qualidade * factor) + (BLUP acima da média * peso)
  const valorDesmame = 5000 + qualidadeLinhagem * 2000 + Math.max(0, mediaBLUP - 100) * 80;

  // Valores nas fases seguintes (multiplicadores de mercado)
  const valor3anos = valorDesmame * 2.5;
  const valor5anos = valorDesmame * 4.5;

  return [
    {
      stage: "Desmame (6 meses)",
      value: Math.round(valorDesmame),
      description: "Valor ao desmame, baseado na qualidade genética e linhagem dos pais",
    },
    {
      stage: "Desbravado (3 anos)",
      value: Math.round(valor3anos),
      description: "Valor após desbaste inicial, com maneio básico e primeiros trabalhos montados",
    },
    {
      stage: "Treinado (5 anos)",
      value: Math.round(valor5anos),
      description: "Valor com treino elementar a médio, pronto para competição ou trabalho",
    },
  ];
}

// Parent quality score for the UI indicator
export function calcularQualidadePais(garanhao: Cavalo, egua: Cavalo): number {
  const confMedia = (garanhao.conformacao + egua.conformacao) / 2;
  const andMedia = (garanhao.andamentos + egua.andamentos) / 2;
  const blupMedia = (garanhao.blup + egua.blup) / 2;

  // Score 0-100
  return Math.min(
    100,
    Math.round(
      (confMedia / 10) * 30 + // 30% peso conformação
        (andMedia / 10) * 30 + // 30% peso andamentos
        ((blupMedia / 150) * 40 * 100) / 100 // 40% peso BLUP
    )
  );
}

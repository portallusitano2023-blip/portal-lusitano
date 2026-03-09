// ============================================
// CÁLCULOS DE CRIAÇÃO — Verificador de Compatibilidade
// ============================================

import type { Cavalo, ResultadoCompatibilidade } from "./types";

type TranslatorFn = (pt: string, en: string, es?: string) => string;
const defaultTr: TranslatorFn = (pt) => pt;

// ============================================
// Calendário de Criação — Milestones
// ============================================

export interface BreedingMilestone {
  label: string;
  startMonth: number; // 1-12
  durationMonths: number;
  description: string;
}

export function calcularCalendarioCriacao(_mesActual: number, tr: TranslatorFn = defaultTr): BreedingMilestone[] {
  return [
    {
      label: tr("Época de Cobrição", "Breeding Season", "Época de Cubrición"),
      startMonth: 3,
      durationMonths: 4,
      description: tr("Março a Junho — período ideal para cobrição natural ou IA", "March to June — ideal period for natural breeding or AI", "Marzo a Junio — período ideal para cubrición natural o IA"),
    },
    {
      label: tr("Gestação", "Gestation", "Gestación"),
      startMonth: 4,
      durationMonths: 11,
      description: tr("Aproximadamente 340 dias de gestação", "Approximately 340 days of gestation", "Aproximadamente 340 días de gestación"),
    },
    {
      label: tr("Nascimento Estimado", "Estimated Birth", "Nacimiento Estimado"),
      startMonth: ((4 + 11 - 1) % 12) + 1, // ~March next year
      durationMonths: 1,
      description: tr("Nascimento previsto na primavera seguinte", "Expected birth in the following spring", "Nacimiento previsto en la primavera siguiente"),
    },
    {
      label: tr("Desmame", "Weaning", "Destete"),
      startMonth: ((4 + 11 + 6 - 1) % 12) + 1,
      durationMonths: 1,
      description: tr("Desmame aos 6 meses de idade", "Weaning at 6 months of age", "Destete a los 6 meses de edad"),
    },
    {
      label: tr("Primeira Manipulação", "First Handling", "Primera Manipulación"),
      startMonth: ((4 + 11 + 12 - 1) % 12) + 1,
      durationMonths: 2,
      description: tr("Início do maneio e habituação ao contacto humano", "Start of handling and habituation to human contact", "Inicio del manejo y habituación al contacto humano"),
    },
    {
      label: tr("Início do Desbaste", "Start of Breaking", "Inicio de la Doma"),
      startMonth: ((4 + 11 - 1) % 12) + 1, // same month, 3 years later
      durationMonths: 6,
      description: tr("Desbaste aos 3 anos — início do trabalho montado", "Breaking at 3 years — start of ridden work", "Doma a los 3 años — inicio del trabajo montado"),
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

export function calcularAptidoesPotro(garanhao: Cavalo, egua: Cavalo, tr: TranslatorFn = defaultTr): OffspringAxis[] {
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

  // Temperament values match TEMPERAMENTOS in data.ts: "Calmo" | "Equilibrado" | "Energético" | "Nervoso"
  const stallionTemp =
    garanhao.temperamento === "Calmo"
      ? 90
      : garanhao.temperamento === "Equilibrado"
        ? 70
        : garanhao.temperamento === "Energético"
          ? 50
          : 30; // "Nervoso" or unknown
  const mareTemp =
    egua.temperamento === "Calmo"
      ? 90
      : egua.temperamento === "Equilibrado"
        ? 70
        : egua.temperamento === "Energético"
          ? 50
          : 30; // "Nervoso" or unknown

  const stallionSport = Math.min(
    100,
    (garanhao.conformacao + garanhao.andamentos) * 5 + (garanhao.blup > 100 ? 10 : 0)
  );
  const mareSport = Math.min(
    100,
    (egua.conformacao + egua.andamentos) * 5 + (egua.blup > 100 ? 10 : 0)
  );

  // Fertility values match FERTILIDADES in data.ts: "Muito Alta" | "Alta" | "Normal" | "Baixa"
  const stallionRepro =
    garanhao.fertilidade === "Muito Alta"
      ? 95
      : garanhao.fertilidade === "Alta"
        ? 80
        : garanhao.fertilidade === "Normal"
          ? 60
          : 30; // "Baixa" or unknown
  const mareRepro =
    egua.fertilidade === "Muito Alta"
      ? 95
      : egua.fertilidade === "Alta"
        ? 80
        : egua.fertilidade === "Normal"
          ? 60
          : 30; // "Baixa" or unknown

  const stallionGen = Math.min(100, (garanhao.blup / 150) * 100);
  const mareGen = Math.min(100, (egua.blup / 150) * 100);

  return [
    {
      label: tr("Conformação", "Conformation", "Conformación"),
      stallionScore: stallionConf,
      mareScore: mareConf,
      offspringScore: Math.round(stallionConf * 0.55 + mareConf * 0.45),
    },
    {
      label: tr("Andamentos", "Gaits", "Movimientos"),
      stallionScore: stallionAnd,
      mareScore: mareAnd,
      offspringScore: Math.round(stallionAnd * 0.5 + mareAnd * 0.5),
    },
    {
      label: tr("Temperamento", "Temperament", "Temperamento"),
      stallionScore: stallionTemp,
      mareScore: mareTemp,
      offspringScore: Math.round(stallionTemp * 0.45 + mareTemp * 0.55),
    },
    {
      label: tr("Aptidão Desportiva", "Sport Aptitude", "Aptitud Deportiva"),
      stallionScore: stallionSport,
      mareScore: mareSport,
      offspringScore: Math.round(stallionSport * 0.55 + mareSport * 0.45),
    },
    {
      label: tr("Potencial Reprodutivo", "Reproductive Potential", "Potencial Reproductivo"),
      stallionScore: stallionRepro,
      mareScore: mareRepro,
      offspringScore: Math.round(stallionRepro * 0.4 + mareRepro * 0.6),
    },
    {
      label: tr("Valor Genético", "Genetic Value", "Valor Genético"),
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
  egua: Cavalo,
  tr: TranslatorFn = defaultTr
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
      stage: tr("Desmame (6 meses)", "Weaning (6 months)", "Destete (6 meses)"),
      value: Math.round(valorDesmame),
      description: tr("Valor ao desmame, baseado na qualidade genética e linhagem dos pais", "Value at weaning, based on genetic quality and parents' lineage", "Valor al destete, basado en la calidad genética y línea de los padres"),
    },
    {
      stage: tr("Desbravado (3 anos)", "Broken in (3 years)", "Domado (3 años)"),
      value: Math.round(valor3anos),
      description: tr("Valor após desbaste inicial, com maneio básico e primeiros trabalhos montados", "Value after initial breaking, with basic handling and first ridden work", "Valor tras doma inicial, con manejo básico y primeros trabajos montados"),
    },
    {
      stage: tr("Treinado (5 anos)", "Trained (5 years)", "Entrenado (5 años)"),
      value: Math.round(valor5anos),
      description: tr("Valor com treino elementar a médio, pronto para competição ou trabalho", "Value with elementary to medium training, ready for competition or work", "Valor con entrenamiento elemental a medio, listo para competición o trabajo"),
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

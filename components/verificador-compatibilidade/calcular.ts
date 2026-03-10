import type { Cavalo, Cavaleiro, RedFlag, ResultadoCompatibilidade } from "./types";
import { DEFEITOS_GENETICOS } from "./data";

// ============================================
// SHARED COI ESTIMATION (H-10)
// ============================================

/** COI estimation matrix by lineage pair — shared between form preview and final calc */
export const COI_ESTIMADOS: Record<string, Record<string, number>> = {
  veiga: {
    veiga: 6.25, andrade: 1.5, alter: 1.5, coudelaria_nacional: 2.0,
    infante_camara: 1.5, interagro: 1.0, outra: 1.0,
  },
  andrade: {
    veiga: 1.5, andrade: 4.0, alter: 1.5, coudelaria_nacional: 2.0,
    infante_camara: 1.5, interagro: 1.0, outra: 1.0,
  },
  alter: {
    veiga: 1.5, andrade: 1.5, alter: 5.0, coudelaria_nacional: 2.5,
    infante_camara: 2.0, interagro: 1.0, outra: 1.0,
  },
  coudelaria_nacional: {
    veiga: 2.0, andrade: 2.0, alter: 2.5, coudelaria_nacional: 5.0,
    infante_camara: 2.0, interagro: 1.5, outra: 1.0,
  },
  infante_camara: {
    veiga: 1.5, andrade: 1.5, alter: 2.0, coudelaria_nacional: 2.0,
    infante_camara: 4.5, interagro: 1.0, outra: 1.0,
  },
  interagro: {
    veiga: 1.0, andrade: 1.0, alter: 1.0, coudelaria_nacional: 1.5,
    infante_camara: 1.0, interagro: 3.0, outra: 0.8,
  },
  outra: {
    veiga: 1.0, andrade: 1.0, alter: 1.0, coudelaria_nacional: 1.0,
    infante_camara: 1.0, interagro: 0.8, outra: 2.0,
  },
};

/** Estimate COI from lineage pair — used in both HorseForm preview and final calculation */
export function estimarCOI(linhagemGaranhao: string, linhagemEgua: string): number {
  return COI_ESTIMADOS[linhagemGaranhao]?.[linhagemEgua] ?? 2.0;
}

// ============================================
// LÓGICA DE CÁLCULO - Verificador de Compatibilidade
// ============================================

type TranslatorFn = (pt: string, en: string, es?: string) => string;
const defaultTr: TranslatorFn = (pt) => pt;

/** Detects dangerous rider-horse combinations and returns red flags */
function detectRedFlags(
  cavaleiro: Cavaleiro,
  garanhao: Cavalo,
  egua: Cavalo,
  objetivo: string,
  tr: TranslatorFn
): RedFlag[] {
  const flags: RedFlag[] = [];
  const isHighEnergy = (t: string) => t === "Energético" || t === "Nervoso";
  const minHorseHeight = Math.min(garanhao.altura, egua.altura);

  // 0. WARNING: Beginner rider + stallion (inherently harder to handle)
  if (
    (cavaleiro.experiencia === "iniciante" || cavaleiro.nivelFitness === "sedentario") &&
    !isHighEnergy(garanhao.temperamento)
  ) {
    const isBeginner = cavaleiro.experiencia === "iniciante";
    flags.push({
      title: isBeginner
        ? tr(
            "Cavaleiro iniciante com garanhão",
            "Beginner rider with stallion",
            "Jinete principiante con semental"
          )
        : tr(
            "Cavaleiro sedentário com garanhão",
            "Sedentary rider with stallion",
            "Jinete sedentario con semental"
          ),
      description: isBeginner
        ? tr(
            "Garanhões são naturalmente mais difíceis de manejar do que éguas ou cavalos castrados. Cavaleiros com pouca experiência devem iniciar com cavalos mais dóceis.",
            "Stallions are naturally harder to handle than mares or geldings. Riders with little experience should start with more docile horses.",
            "Los sementales son naturalmente más difíciles de manejar que las yeguas o los caballos castrados. Jinetes con poca experiencia deben empezar con caballos más dóciles."
          )
        : tr(
            "Garanhões são naturalmente mais difíceis de manejar do que éguas ou cavalos castrados. Cavaleiros com baixa condição física devem iniciar com cavalos mais dóceis.",
            "Stallions are naturally harder to handle than mares or geldings. Riders with low physical condition should start with more docile horses.",
            "Los sementales son naturalmente más difíciles de manejar que las yeguas o los caballos castrados. Jinetes con baja condición física deben empezar con caballos más dóciles."
          ),
      severity: "warning",
    });
  }

  // 0b. CRITICAL: Beginner rider + moderate fitness + nervous stallion (safety gap)
  if (
    cavaleiro.experiencia === "iniciante" &&
    cavaleiro.nivelFitness === "moderado" &&
    garanhao.temperamento === "Nervoso"
  ) {
    flags.push({
      title: tr(
        "Cavaleiro iniciante com garanhão nervoso",
        "Beginner rider with nervous stallion",
        "Jinete principiante con semental nervioso"
      ),
      description: tr(
        "Garanhões nervosos são extremamente exigentes e imprevisíveis. Cavaleiros iniciantes, mesmo com fitness moderado, não têm a experiência necessária para manejar este tipo de cavalo em segurança. Risco elevado de acidentes.",
        "Nervous stallions are extremely demanding and unpredictable. Beginner riders, even with moderate fitness, lack the experience needed to handle this type of horse safely. High risk of accidents.",
        "Los sementales nerviosos son extremadamente exigentes e impredecibles. Jinetes principiantes, incluso con fitness moderado, carecen de la experiencia necesaria para manejar este tipo de caballo con seguridad. Riesgo elevado de accidentes."
      ),
      severity: "critical",
    });
  }

  // 1. CRITICAL: Beginner/sedentary rider + Stallion + energetic temperament
  // Skip if already covered by flag #0b above (iniciante + moderado + Nervoso)
  if (
    (cavaleiro.experiencia === "iniciante" || cavaleiro.nivelFitness === "sedentario") &&
    isHighEnergy(garanhao.temperamento) &&
    !(cavaleiro.experiencia === "iniciante" && cavaleiro.nivelFitness === "moderado" && garanhao.temperamento === "Nervoso")
  ) {
    const isBeginner = cavaleiro.experiencia === "iniciante";
    flags.push({
      title: isBeginner
        ? tr(
            "Cavaleiro iniciante com garanhão enérgico",
            "Beginner rider with energetic stallion",
            "Jinete principiante con semental enérgico"
          )
        : tr(
            "Cavaleiro sedentário com garanhão enérgico",
            "Sedentary rider with energetic stallion",
            "Jinete sedentario con semental enérgico"
          ),
      description: isBeginner
        ? tr(
            "Cavaleiros iniciantes não devem manejar garanhões com temperamento energético ou nervoso. Risco elevado de acidentes.",
            "Beginner riders should not handle stallions with energetic or nervous temperament. High risk of accidents.",
            "Jinetes principiantes no deben manejar sementales con temperamento enérgico o nervioso. Riesgo elevado de accidentes."
          )
        : tr(
            "Cavaleiros com baixa condição física não devem manejar garanhões com temperamento energético ou nervoso. Risco elevado de acidentes.",
            "Riders with low physical condition should not handle stallions with energetic or nervous temperament. High risk of accidents.",
            "Jinetes con baja condición física no deben manejar sementales con temperamento enérgico o nervioso. Riesgo elevado de accidentes."
          ),
      severity: "critical",
    });
  }

  // 2. CRITICAL: Sedentary rider + young horse (< 5 years)
  if (
    cavaleiro.nivelFitness === "sedentario" &&
    (garanhao.idade < 5 || egua.idade < 5)
  ) {
    flags.push({
      title: tr(
        "Cavaleiro sedentário com cavalo jovem (< 5 anos)",
        "Sedentary rider with young horse (< 5 years)",
        "Jinete sedentario con caballo joven (< 5 años)"
      ),
      description: tr(
        "Cavalos com menos de 5 anos ainda estão em formação e requerem cavaleiros experientes e fisicamente preparados.",
        "Horses under 5 years are still in training and require experienced, physically prepared riders.",
        "Caballos con menos de 5 años aún están en formación y requieren jinetes experimentados y físicamente preparados."
      ),
      severity: "critical",
    });
  }

  // 3. CRITICAL: Rider weight > 100kg + horse height < 155cm
  if (cavaleiro.pesoCavaleiro > 100 && minHorseHeight < 155) {
    flags.push({
      title: tr(
        "Peso excessivo para cavalo de pequeno porte",
        "Excessive weight for small horse",
        "Peso excesivo para caballo de pequeño porte"
      ),
      description: tr(
        `Cavaleiro com ${cavaleiro.pesoCavaleiro}kg em cavalo(s) com menos de 155cm. Risco de lesões nas costas e articulações do cavalo.`,
        `Rider at ${cavaleiro.pesoCavaleiro}kg on horse(s) under 155cm. Risk of back and joint injuries to the horse.`,
        `Jinete con ${cavaleiro.pesoCavaleiro}kg en caballo(s) con menos de 155cm. Riesgo de lesiones en la espalda y articulaciones del caballo.`
      ),
      severity: "critical",
    });
  }

  // 4. WARNING: Moderate fitness + high-energy horse
  if (
    cavaleiro.nivelFitness === "moderado" &&
    (isHighEnergy(garanhao.temperamento) || isHighEnergy(egua.temperamento))
  ) {
    flags.push({
      title: tr(
        "Fitness moderado com cavalo de alta energia",
        "Moderate fitness with high-energy horse",
        "Fitness moderado con caballo de alta energía"
      ),
      description: tr(
        "Cavalos energéticos ou nervosos exigem maior preparação física. Considere aumentar o nível de fitness antes de trabalhar com estes cavalos.",
        "Energetic or nervous horses require greater physical preparation. Consider increasing fitness level before working with these horses.",
        "Caballos enérgicos o nerviosos exigen mayor preparación física. Considere aumentar el nivel de fitness antes de trabajar con estos caballos."
      ),
      severity: "warning",
    });
  }

  // 5. WARNING: Sedentary rider + competition goals
  if (cavaleiro.nivelFitness === "sedentario" && objetivo === "competicao") {
    flags.push({
      title: tr(
        "Fitness sedentário com objectivos de competição",
        "Sedentary fitness with competition goals",
        "Fitness sedentario con objetivos de competición"
      ),
      description: tr(
        "Alta competição (Dressage CDI, etc.) exige excelente condição física do cavaleiro. Recomenda-se programa de preparação física.",
        "High competition (Dressage CDI, etc.) requires excellent rider fitness. A physical preparation programme is recommended.",
        "Alta competición (Dressage CDI, etc.) exige excelente condición física del jinete. Se recomienda un programa de preparación física."
      ),
      severity: "warning",
    });
  }

  // 6. WARNING: Sedentary fitness + demanding discipline (energetic horses or non-leisure goal)
  if (
    cavaleiro.nivelFitness === "sedentario" &&
    objetivo !== "lazer" &&
    (isHighEnergy(garanhao.temperamento) || isHighEnergy(egua.temperamento))
  ) {
    flags.push({
      title: tr(
        "Fitness sedentário com disciplina exigente",
        "Sedentary fitness with demanding discipline",
        "Fitness sedentario con disciplina exigente"
      ),
      description: tr(
        "A combinação de baixo fitness com cavalos energéticos em disciplinas exigentes aumenta significativamente o risco de fadiga e lesão.",
        "The combination of low fitness with energetic horses in demanding disciplines significantly increases the risk of fatigue and injury.",
        "La combinación de bajo fitness con caballos enérgicos en disciplinas exigentes aumenta significativamente el riesgo de fatiga y lesión."
      ),
      severity: "warning",
    });
  }

  return flags;
}

export function calcularCompatibilidade(
  garanhao: Cavalo,
  egua: Cavalo,
  tr: TranslatorFn = defaultTr,
  cavaleiro?: Cavaleiro,
  objetivo?: string
): ResultadoCompatibilidade {
  const factores: ResultadoCompatibilidade["factores"] = [];
  const riscos: ResultadoCompatibilidade["riscos"] = [];
  const fortes: string[] = [];
  const fracos: string[] = [];
  let total = 0;

  // 1. Idade Reprodutiva (15pts) — graduated scoring (M-15)
  const graduatedAge = (idade: number, min: number, max: number): number => {
    if (idade >= min && idade <= max) return 15; // within range
    const dist = idade < min ? min - idade : idade - max;
    if (dist <= 2) return 12; // 1-2 years outside
    if (dist <= 5) return 8;  // 3-5 years outside
    return 3;                  // 5+ years outside
  };
  const idadeScoreGar = graduatedAge(garanhao.idade, 4, 20);
  const idadeScoreEgu = graduatedAge(egua.idade, 4, 18);
  const idadeScore = Math.round((idadeScoreGar + idadeScoreEgu) / 2);
  factores.push({
    nome: tr("Idade Reprodutiva", "Reproductive Age", "Edad Reproductiva"),
    score: idadeScore,
    max: 15,
    tipo: idadeScore >= 12 ? "excelente" : idadeScore >= 8 ? "bom" : "aviso",
    descricao: tr("Idade ideal: Garanhão 4-20, Égua 4-18 anos", "Ideal age: Stallion 4-20, Mare 4-18 years", "Edad ideal: Semental 4-20, Yegua 4-18 años"),
  });
  if (egua.idade > 16)
    riscos.push({ texto: tr("Égua com idade avançada para reprodução", "Mare with advanced age for reproduction", "Yegua con edad avanzada para reproducción"), severidade: "medio" });
  if (egua.idade < 4) riscos.push({ texto: tr("Égua demasiado jovem", "Mare too young", "Yegua demasiado joven"), severidade: "alto" });
  if (garanhao.idade > 18)
    riscos.push({ texto: tr("Garanhão com idade avançada", "Stallion with advanced age", "Semental con edad avanzada"), severidade: "baixo" });
  total += idadeScore;

  // 2. Compatibilidade Física (10pts)
  const difAltura = Math.abs(garanhao.altura - egua.altura);
  let tamanhoScore = difAltura <= 5 ? 10 : difAltura <= 8 ? 8 : difAltura <= 12 ? 5 : 3;

  // Rider weight/height adjustments on physical compatibility
  if (cavaleiro) {
    const minHorseHeight = Math.min(garanhao.altura, egua.altura);
    if (cavaleiro.pesoCavaleiro > 100 && minHorseHeight < 162) {
      tamanhoScore = Math.max(0, tamanhoScore - 15);
      riscos.push({
        texto: tr(
          `Peso do cavaleiro (${cavaleiro.pesoCavaleiro}kg) excessivo para cavalos < 162cm`,
          `Rider weight (${cavaleiro.pesoCavaleiro}kg) excessive for horses < 162cm`,
          `Peso del jinete (${cavaleiro.pesoCavaleiro}kg) excesivo para caballos < 162cm`
        ),
        severidade: "alto",
      });
    } else if (cavaleiro.pesoCavaleiro > 90 && minHorseHeight < 158) {
      tamanhoScore = Math.max(0, tamanhoScore - 10);
      riscos.push({
        texto: tr(
          `Peso do cavaleiro (${cavaleiro.pesoCavaleiro}kg) elevado para cavalos < 158cm`,
          `Rider weight (${cavaleiro.pesoCavaleiro}kg) high for horses < 158cm`,
          `Peso del jinete (${cavaleiro.pesoCavaleiro}kg) elevado para caballos < 158cm`
        ),
        severidade: "medio",
      });
    }

    // C-01: Rider-horse height ratio check
    if (cavaleiro.alturaCavaleiro) {
      const avgHorseHeight = (garanhao.altura + egua.altura) / 2;
      const ratio = cavaleiro.alturaCavaleiro / avgHorseHeight;
      if (ratio > 1.15) {
        tamanhoScore = Math.max(0, tamanhoScore - 3);
        riscos.push({
          texto: tr(
            `Cavaleiro demasiado alto (${cavaleiro.alturaCavaleiro}cm) para a média dos cavalos (${Math.round(avgHorseHeight)}cm) — ratio ${ratio.toFixed(2)}`,
            `Rider too tall (${cavaleiro.alturaCavaleiro}cm) for the average horse height (${Math.round(avgHorseHeight)}cm) — ratio ${ratio.toFixed(2)}`,
            `Jinete demasiado alto (${cavaleiro.alturaCavaleiro}cm) para la media de los caballos (${Math.round(avgHorseHeight)}cm) — ratio ${ratio.toFixed(2)}`
          ),
          severidade: "baixo",
        });
      } else if (ratio < 0.85) {
        riscos.push({
          texto: tr(
            `Cavaleiro baixo (${cavaleiro.alturaCavaleiro}cm) relativamente à média dos cavalos (${Math.round(avgHorseHeight)}cm) — ratio ${ratio.toFixed(2)}`,
            `Rider short (${cavaleiro.alturaCavaleiro}cm) relative to average horse height (${Math.round(avgHorseHeight)}cm) — ratio ${ratio.toFixed(2)}`,
            `Jinete bajo (${cavaleiro.alturaCavaleiro}cm) en relación a la media de los caballos (${Math.round(avgHorseHeight)}cm) — ratio ${ratio.toFixed(2)}`
          ),
          severidade: "baixo",
        });
      }
    }
  }

  factores.push({
    nome: tr("Compatibilidade Física", "Physical Compatibility", "Compatibilidad Física"),
    score: tamanhoScore,
    max: 10,
    tipo: tamanhoScore >= 8 ? "excelente" : tamanhoScore >= 5 ? "bom" : "aviso",
    descricao: cavaleiro && cavaleiro.pesoCavaleiro > 90
      ? tr(
          `Diferença de altura: ${difAltura}cm | Peso cavaleiro: ${cavaleiro.pesoCavaleiro}kg`,
          `Height difference: ${difAltura}cm | Rider weight: ${cavaleiro.pesoCavaleiro}kg`,
          `Diferencia de altura: ${difAltura}cm | Peso jinete: ${cavaleiro.pesoCavaleiro}kg`
        )
      : tr(`Diferença de altura: ${difAltura}cm`, `Height difference: ${difAltura}cm`, `Diferencia de altura: ${difAltura}cm`),
  });
  if (difAltura > 10)
    riscos.push({
      texto: tr(`Diferença de altura significativa (${difAltura}cm)`, `Significant height difference (${difAltura}cm)`, `Diferencia de altura significativa (${difAltura}cm)`),
      severidade: "baixo",
    });
  total += tamanhoScore;

  // 3. Qualidade Genética / Linhagem (20pts)
  const linNiveis: Record<string, number> = {
    Desconhecida: 0,
    Comum: 1,
    Registada: 2,
    Certificada: 3,
    Premium: 4,
    Elite: 5,
  };
  const linMedia = ((linNiveis[garanhao.linhagem] ?? 0) + (linNiveis[egua.linhagem] ?? 0)) / 2;
  const linScore = Math.round(linMedia * 4);
  factores.push({
    nome: tr("Qualidade Genética", "Genetic Quality", "Calidad Genética"),
    score: linScore,
    max: 20,
    tipo: linScore >= 16 ? "excelente" : linScore >= 10 ? "bom" : "neutro",
    descricao: tr("Média da qualidade das linhagens dos progenitores", "Average quality of the parents' lineages", "Promedio de la calidad de las líneas de los progenitores"),
  });
  if (linScore >= 16) fortes.push(tr("Ambos progenitores com linhagem de prestígio", "Both parents with prestigious lineage", "Ambos progenitores con línea de prestigio"));
  if (linScore < 8) fracos.push(tr("Linhagem pouco documentada", "Poorly documented lineage", "Línea poco documentada"));
  total += linScore;

  // 4. Conformação (15pts)
  const confMedia = (garanhao.conformacao + egua.conformacao) / 2;
  const confScore = Math.round(confMedia * 1.5);
  factores.push({
    nome: tr("Conformação Morfológica", "Morphological Conformation", "Conformación Morfológica"),
    score: confScore,
    max: 15,
    tipo: confScore >= 12 ? "excelente" : confScore >= 9 ? "bom" : "neutro",
    descricao: tr("Qualidade morfológica média dos progenitores", "Average morphological quality of the parents", "Calidad morfológica promedio de los progenitores"),
  });
  if (confMedia >= 8) fortes.push(tr("Excelente conformação em ambos progenitores", "Excellent conformation in both parents", "Excelente conformación en ambos progenitores"));
  total += confScore;

  // 5. Andamentos (10pts)
  const andMedia = (garanhao.andamentos + egua.andamentos) / 2;
  const andScore = Math.round(andMedia);
  factores.push({
    nome: tr("Qualidade dos Andamentos", "Gait Quality", "Calidad de los Movimientos"),
    score: andScore,
    max: 10,
    tipo: andScore >= 8 ? "excelente" : andScore >= 6 ? "bom" : "neutro",
    descricao: tr("Funcionalidade e expressão de movimentos", "Functionality and expression of movements", "Funcionalidad y expresión de movimientos"),
  });
  if (andMedia >= 8) fortes.push(tr("Andamentos de qualidade superior em ambos", "Superior quality gaits in both", "Movimientos de calidad superior en ambos"));
  total += andScore;

  // 6. Temperamento (10pts) — H-05: verified symmetric matrix
  const tempCompat: Record<string, Record<string, number>> = {
    Calmo: { Calmo: 10, Equilibrado: 9, Energético: 7, Nervoso: 6 },
    Equilibrado: { Calmo: 9, Equilibrado: 10, Energético: 8, Nervoso: 6 },
    Energético: { Calmo: 7, Equilibrado: 8, Energético: 7, Nervoso: 4 },
    Nervoso: { Calmo: 6, Equilibrado: 6, Energético: 4, Nervoso: 3 },
  };
  let tempScore = tempCompat[garanhao.temperamento]?.[egua.temperamento] ?? 5;

  // Rider fitness adjustments on temperament compatibility
  if (cavaleiro) {
    const isHighEnergy = (t: string) => t === "Energético" || t === "Nervoso";
    if (
      cavaleiro.nivelFitness === "sedentario" &&
      (isHighEnergy(garanhao.temperamento) || isHighEnergy(egua.temperamento))
    ) {
      tempScore = Math.max(0, tempScore - 3);
      fracos.push(tr(
        "Fitness sedentário incompatível com cavalos energéticos",
        "Sedentary fitness incompatible with energetic horses",
        "Fitness sedentario incompatible con caballos enérgicos"
      ));
    }
    if (
      cavaleiro.nivelFitness === "atleta" &&
      (garanhao.temperamento === "Calmo" || egua.temperamento === "Calmo")
    ) {
      tempScore = Math.min(10, tempScore + 3);
      fortes.push(tr(
        "Cavaleiro atleta complementa bem cavalo calmo",
        "Athlete rider complements calm horse well",
        "Jinete atleta complementa bien caballo calmado"
      ));
    }
  }

  factores.push({
    nome: tr("Compatibilidade Temperamento", "Temperament Compatibility", "Compatibilidad de Temperamento"),
    score: tempScore,
    max: 10,
    tipo:
      tempScore >= 8 ? "excelente" : tempScore >= 6 ? "bom" : tempScore >= 4 ? "aviso" : "risco",
    descricao: cavaleiro
      ? tr(
          "Combinação dos temperamentos (ajustado ao fitness do cavaleiro)",
          "Temperament combination (adjusted for rider fitness)",
          "Combinación de temperamentos (ajustado al fitness del jinete)"
        )
      : tr("Combinação dos temperamentos dos progenitores", "Combination of the parents' temperaments", "Combinación de los temperamentos de los progenitores"),
  });
  if (tempScore <= 4)
    riscos.push({ texto: tr("Temperamentos potencialmente incompatíveis", "Potentially incompatible temperaments", "Temperamentos potencialmente incompatibles"), severidade: "medio" });
  if (tempScore >= 9) fortes.push(tr("Temperamentos complementares", "Complementary temperaments", "Temperamentos complementarios"));
  total += tempScore;

  // 7. Estado de Saúde (10pts)
  const saudeMedia = (garanhao.saude + egua.saude) / 2;
  const saudeScore = Math.round(saudeMedia);
  factores.push({
    nome: tr("Estado de Saúde", "Health Status", "Estado de Salud"),
    score: saudeScore,
    max: 10,
    tipo: saudeScore >= 8 ? "excelente" : saudeScore >= 6 ? "bom" : "aviso",
    descricao: tr("Condição veterinária geral dos progenitores", "General veterinary condition of the parents", "Condición veterinaria general de los progenitores"),
  });
  if (saudeMedia < 6) riscos.push({ texto: tr("Estado de saúde requer atenção", "Health status requires attention", "Estado de salud requiere atención"), severidade: "medio" });
  total += saudeScore;

  // 8. Fertilidade (5pts)
  const fertNiveis: Record<string, number> = { "Muito Alta": 5, Alta: 4, Normal: 3, Baixa: 1 };
  const fertScore = Math.round(
    ((fertNiveis[garanhao.fertilidade] ?? 3) + (fertNiveis[egua.fertilidade] ?? 3)) / 2
  );
  factores.push({
    nome: tr("Índice de Fertilidade", "Fertility Index", "Índice de Fertilidad"),
    score: fertScore,
    max: 5,
    tipo: fertScore >= 4 ? "excelente" : fertScore >= 3 ? "bom" : "aviso",
    descricao: tr("Historial reprodutivo dos progenitores", "Reproductive history of the parents", "Historial reproductivo de los progenitores"),
  });
  if (fertScore <= 2)
    riscos.push({ texto: tr("Fertilidade baixa pode dificultar concepção", "Low fertility may hinder conception", "Fertilidad baja puede dificultar la concepción"), severidade: "medio" });
  total += fertScore;

  // 9. Aprovação como reprodutores (5pts bónus)
  const aprovacaoScore = garanhao.aprovado && egua.aprovado ? 5 : (garanhao.aprovado || egua.aprovado) ? 3 : 0;
  if (aprovacaoScore === 5) {
    fortes.push(tr("Ambos aprovados oficialmente como reprodutores", "Both officially approved as breeders", "Ambos aprobados oficialmente como reproductores"));
  } else {
    if (!garanhao.aprovado) fracos.push(tr("Garanhão não aprovado como reprodutor", "Stallion not approved as breeder", "Semental no aprobado como reproductor"));
    if (!egua.aprovado) fracos.push(tr("Égua não aprovada como reprodutora", "Mare not approved as breeding stock", "Yegua no aprobada como reproductora"));
  }
  factores.push({
    nome: tr("Aprovação APSL", "APSL Approval", "Aprobación APSL"),
    score: aprovacaoScore,
    max: 5,
    tipo: aprovacaoScore >= 5 ? "excelente" : aprovacaoScore >= 3 ? "bom" : "neutro",
    descricao: aprovacaoScore >= 5
      ? tr("Ambos aprovados como reprodutores", "Both approved as breeders", "Ambos aprobados como reproductores")
      : aprovacaoScore >= 3
        ? tr("Um dos progenitores aprovado como reprodutor", "One parent approved as breeder", "Uno de los progenitores aprobado como reproductor")
        : tr("Bónus requer aprovação de ambos os progenitores", "Bonus requires approval of both parents", "Bonificación requiere aprobación de ambos progenitores"),
  });
  total += aprovacaoScore;

  // 10. Historial Reprodutivo (0-5 pts)
  const matGar = garanhao.matingsRealizados ?? 0;
  const potGar = garanhao.potradasNascidos ?? 0;
  const matEgu = egua.matingsRealizados ?? 0;
  const potEgu = egua.potradasNascidos ?? 0;
  let historialScore = 0;
  if (matGar > 0 || matEgu > 0) historialScore += 2;
  if (potGar > 3 || potEgu > 2) historialScore += 2;
  if (potGar > 10 || potEgu > 5) historialScore += 1;

  // L-38: Reproductive success rate bonus/penalty
  if (matGar > 0) {
    const successRateGar = potGar / matGar;
    if (successRateGar > 1.0) {
      riscos.push({
        texto: tr(
          `Garanhão: potros nascidos (${potGar}) superior a coberturas (${matGar}) — dados inconsistentes`,
          `Stallion: live foals (${potGar}) exceeds breedings (${matGar}) — inconsistent data`,
          `Semental: potros nacidos (${potGar}) superior a cubriciones (${matGar}) — datos inconsistentes`
        ),
        severidade: "baixo",
      });
    }
    if (successRateGar >= 0.7) historialScore = Math.min(5, historialScore + 1);
    else if (successRateGar < 0.3 && matGar >= 3) historialScore = Math.max(0, historialScore - 1);
  }
  if (matEgu > 0) {
    const successRateEgu = potEgu / matEgu;
    if (successRateEgu > 1.0) {
      riscos.push({
        texto: tr(
          `Égua: potros nascidos (${potEgu}) superior a coberturas (${matEgu}) — dados inconsistentes`,
          `Mare: live foals (${potEgu}) exceeds breedings (${matEgu}) — inconsistent data`,
          `Yegua: potros nacidos (${potEgu}) superior a cubriciones (${matEgu}) — datos inconsistentes`
        ),
        severidade: "baixo",
      });
    }
    if (successRateEgu >= 0.7) historialScore = Math.min(5, historialScore + 1);
    else if (successRateEgu < 0.3 && matEgu >= 3) historialScore = Math.max(0, historialScore - 1);
  }
  factores.push({
    nome: tr("Historial Reprodutivo", "Reproductive History", "Historial Reproductivo"),
    score: historialScore,
    max: 5,
    tipo: historialScore >= 4 ? "excelente" : historialScore >= 2 ? "bom" : "neutro",
    descricao: tr(
      `Garanhão: ${matGar} coberturas, ${potGar} potros — Égua: ${matEgu} coberturas, ${potEgu} potros`,
      `Stallion: ${matGar} breedings, ${potGar} foals — Mare: ${matEgu} breedings, ${potEgu} foals`,
      `Semental: ${matGar} cubriciones, ${potGar} potros — Yegua: ${matEgu} cubriciones, ${potEgu} potros`
    ),
  });
  if (historialScore >= 4) fortes.push(tr("Historial reprodutivo comprovado", "Proven reproductive history", "Historial reproductivo comprobado"));
  total += historialScore;

  // COI e BLUP previstos
  const mesmaCoude =
    garanhao.coudelaria === egua.coudelaria && garanhao.coudelaria !== "Particular";
  const mesmaLinhagem =
    garanhao.linhagemFamosa === egua.linhagemFamosa && garanhao.linhagemFamosa !== "outra";
  // Penalidades COI por linhagem fechada (consanguinidade típica de linhas estabelecidas)
  const COI_LINHAGEM_PENALTY: Record<string, number> = {
    veiga: 2.5,
    andrade: 2.0,
    alter: 2.2,
    coudelaria_nacional: 1.8,
    infante_camara: 2.0,
    interagro: 1.5,
  };

  let coiPrevisto = (garanhao.coi + egua.coi) / 2;
  if (mesmaCoude) coiPrevisto += 3.125;
  if (mesmaLinhagem && garanhao.linhagemFamosa !== "outra") {
    coiPrevisto += COI_LINHAGEM_PENALTY[garanhao.linhagemFamosa] ?? 1.5;
  }
  const blupPrevisto = Math.round((garanhao.blup + egua.blup) / 2);

  // BLUP min/max prediction based on parent average
  const parentBlupAvg = (garanhao.blup + egua.blup) / 2;
  const blupMin = Math.min(blupPrevisto, Math.max(50, Math.round(parentBlupAvg - 15)));
  let blupMax = Math.min(150, Math.round(parentBlupAvg + 15));
  blupMax = Math.max(blupMin, blupMax);

  if (coiPrevisto > 6.25) {
    riscos.push({
      texto: tr(`COI elevado previsto: ${coiPrevisto.toFixed(1)}%`, `High predicted COI: ${coiPrevisto.toFixed(1)}%`, `COI elevado previsto: ${coiPrevisto.toFixed(1)}%`),
      severidade: "alto",
    });
    fracos.push(tr("Consanguinidade elevada pode causar problemas genéticos", "High inbreeding may cause genetic problems", "Consanguinidad elevada puede causar problemas genéticos"));
  } else if (coiPrevisto < 3) {
    fortes.push(tr("Baixa consanguinidade - excelente diversidade genética", "Low inbreeding - excellent genetic diversity", "Baja consanguinidad - excelente diversidad genética"));
  }

  if (blupPrevisto > 110) fortes.push(tr(`BLUP previsto elevado: ${blupPrevisto}`, `High predicted BLUP: ${blupPrevisto}`, `BLUP previsto elevado: ${blupPrevisto}`));

  // Defeitos genéticos comuns — severity-based penalty (H-11)
  const defeitosComuns = garanhao.defeitos.filter((d) => egua.defeitos.includes(d));
  if (defeitosComuns.length > 0) {
    const RISCO_PENALTY: Record<string, number> = { alto: 15, medio: 10, baixo: 5 };
    let totalDefectPenalty = 0;
    defeitosComuns.forEach((d) => {
      const defeito = DEFEITOS_GENETICOS.find((def) => def.value === d);
      const penalty = RISCO_PENALTY[defeito?.risco ?? "medio"] ?? 10;
      totalDefectPenalty += penalty;
      riscos.push({
        texto: tr(
          `Ambos portadores de ${defeito?.label || d} - risco para descendência`,
          `Both carriers of ${defeito?.label || d} - risk for offspring`,
          `Ambos portadores de ${defeito?.label || d} - riesgo para la descendencia`
        ),
        severidade: "alto",
      });
    });
    total -= totalDefectPenalty;
    factores.push({
      nome: tr("Saúde Genética", "Genetic Health", "Salud Genética"),
      score: 0,
      max: totalDefectPenalty,
      tipo: "aviso",
      descricao: tr(
        `Penalização: defeitos genéticos em comum (${defeitosComuns.join(", ")})`,
        `Penalty: common genetic defects (${defeitosComuns.join(", ")})`,
        `Penalización: defectos genéticos en común (${defeitosComuns.join(", ")})`
      ),
    });
    fracos.push(tr(`Defeitos genéticos em comum: ${defeitosComuns.join(", ")}`, `Common genetic defects: ${defeitosComuns.join(", ")}`, `Defectos genéticos en común: ${defeitosComuns.join(", ")}`));
  }

  // WFFS específico
  if (garanhao.defeitos.includes("WFFS") && egua.defeitos.includes("WFFS")) {
    riscos.push({
      texto: tr("RISCO CRÍTICO: 25% dos potros podem ter WFFS fatal", "CRITICAL RISK: 25% of foals may have fatal WFFS", "RIESGO CRÍTICO: 25% de los potros pueden tener WFFS fatal"),
      severidade: "alto",
    });
  }

  // Previsão de pelagem — Genética Mendeliana completa (5 loci)
  // Frequência do alelo recessivo de cada progenitor (probabilidades)
  const pE_e = (g: "EE" | "Ee" | "ee") => (g === "EE" ? 0 : g === "Ee" ? 0.5 : 1.0);
  const pA_a = (g: "AA" | "Aa" | "aa") => (g === "AA" ? 0 : g === "Aa" ? 0.5 : 1.0);
  const pG_g = (g: "GG" | "Gg" | "gg") => (g === "GG" ? 0 : g === "Gg" ? 0.5 : 1.0);
  const pCrA = (g: "CrCr" | "CrN" | "NN") => (g === "CrCr" ? 1.0 : g === "CrN" ? 0.5 : 0);
  const pD_D = (g: "DD" | "Dd" | "dd") => (g === "DD" ? 1.0 : g === "Dd" ? 0.5 : 0);

  // Probs de genotipo offspring
  const p_ee = pE_e(garanhao.genetica.extension) * pE_e(egua.genetica.extension);
  const p_E_ = 1 - p_ee;
  const p_aa = pA_a(garanhao.genetica.agouti) * pA_a(egua.genetica.agouti);
  const p_A_ = 1 - p_aa;
  const p_grey = 1 - pG_g(garanhao.genetica.grey) * pG_g(egua.genetica.grey);
  const ng = 1 - p_grey; // fator não-ruço

  const pCr_gar = pCrA(garanhao.genetica.cream);
  const pCr_egu = pCrA(egua.genetica.cream);
  const p_CrCr = pCr_gar * pCr_egu;
  const p_CrN = pCr_gar * (1 - pCr_egu) + (1 - pCr_gar) * pCr_egu;
  const p_NN = (1 - pCr_gar) * (1 - pCr_egu);

  const p_dun = 1 - (1 - pD_D(garanhao.genetica.dun)) * (1 - pD_D(egua.genetica.dun));
  const p_nodun = 1 - p_dun;

  // Calcular probabilidades de cada pelagem (somam exatamente 100%)
  const rawPelagens: { cor: string; prob: number; genetica: string }[] = [];

  if (p_grey > 0.01) rawPelagens.push({ cor: tr("Ruço", "Grey", "Tordo"), prob: p_grey, genetica: "G_" });

  if (ng > 0.01) {
    // Base Alazão (ee)
    const p_al = ng * p_ee * p_NN * p_nodun;
    if (p_al > 0.01) rawPelagens.push({ cor: tr("Alazão", "Chestnut", "Alazán"), prob: p_al, genetica: "ee" });

    const p_palomino = ng * p_ee * p_CrN * p_nodun;
    if (p_palomino > 0.01)
      rawPelagens.push({ cor: "Palomino", prob: p_palomino, genetica: "ee CrN" });

    const p_cremello = ng * p_ee * p_CrCr * p_nodun;
    if (p_cremello > 0.01)
      rawPelagens.push({ cor: "Cremello", prob: p_cremello, genetica: "ee CrCr" });

    const p_redDun = ng * p_ee * p_NN * p_dun;
    if (p_redDun > 0.01) rawPelagens.push({ cor: tr("Alazão Dun", "Red Dun", "Alazán Dun"), prob: p_redDun, genetica: "ee D_" });

    const p_dunalino = ng * p_ee * p_CrN * p_dun;
    if (p_dunalino > 0.01) rawPelagens.push({ cor: "Dunalino", prob: p_dunalino, genetica: "ee CrN D_" });

    const p_cremelloDun = ng * p_ee * p_CrCr * p_dun;
    if (p_cremelloDun > 0.01) rawPelagens.push({ cor: "Cremello Dun", prob: p_cremelloDun, genetica: "ee CrCr D_" });

    // Base Castanho/Baio (E_A_)
    const p_cast = ng * p_E_ * p_A_ * p_NN * p_nodun;
    if (p_cast > 0.01) rawPelagens.push({ cor: tr("Castanho/Baio", "Bay", "Castaño/Bayo"), prob: p_cast, genetica: "E_A_" });

    const p_buckskin = ng * p_E_ * p_A_ * p_CrN * p_nodun;
    if (p_buckskin > 0.01)
      rawPelagens.push({ cor: "Buckskin", prob: p_buckskin, genetica: "E_A_ CrN" });

    const p_perlino = ng * p_E_ * p_A_ * p_CrCr * p_nodun;
    if (p_perlino > 0.01)
      rawPelagens.push({ cor: "Perlino", prob: p_perlino, genetica: "E_A_ CrCr" });

    const p_bayDun = ng * p_E_ * p_A_ * p_NN * p_dun;
    if (p_bayDun > 0.01) rawPelagens.push({ cor: tr("Baio Dun", "Bay Dun", "Bayo Dun"), prob: p_bayDun, genetica: "E_A_ D_" });

    const p_dunskin = ng * p_E_ * p_A_ * p_CrN * p_dun;
    if (p_dunskin > 0.01) rawPelagens.push({ cor: "Dunskin", prob: p_dunskin, genetica: "E_A_ CrN D_" });

    const p_perlinoDun = ng * p_E_ * p_A_ * p_CrCr * p_dun;
    if (p_perlinoDun > 0.01) rawPelagens.push({ cor: "Perlino Dun", prob: p_perlinoDun, genetica: "E_A_ CrCr D_" });

    // Base Preto (E_aa)
    const p_preto = ng * p_E_ * p_aa * p_NN * p_nodun;
    if (p_preto > 0.01) rawPelagens.push({ cor: tr("Preto", "Black", "Negro"), prob: p_preto, genetica: "E_aa" });

    const p_smoky = ng * p_E_ * p_aa * p_CrN * p_nodun;
    if (p_smoky > 0.01)
      rawPelagens.push({ cor: "Smoky Black", prob: p_smoky, genetica: "E_aa CrN" });

    const p_smokyCream = ng * p_E_ * p_aa * p_CrCr * p_nodun;
    if (p_smokyCream > 0.01)
      rawPelagens.push({ cor: "Smoky Cream", prob: p_smokyCream, genetica: "E_aa CrCr" });

    const p_grullo = ng * p_E_ * p_aa * p_NN * p_dun;
    if (p_grullo > 0.01) rawPelagens.push({ cor: "Grullo", prob: p_grullo, genetica: "E_aa D_" });

    const p_smokyGrullo = ng * p_E_ * p_aa * p_CrN * p_dun;
    if (p_smokyGrullo > 0.01) rawPelagens.push({ cor: "Smoky Grullo", prob: p_smokyGrullo, genetica: "E_aa CrN D_" });

    const p_smokyCreamDun = ng * p_E_ * p_aa * p_CrCr * p_dun;
    if (p_smokyCreamDun > 0.01) rawPelagens.push({ cor: "Smoky Cream Dun", prob: p_smokyCreamDun, genetica: "E_aa CrCr D_" });
  }

  // Normalizar para somar 100% e filtrar pelagens < 2%
  const totalProb = rawPelagens.reduce((s, p) => s + p.prob, 0);
  const pelagens: ResultadoCompatibilidade["pelagens"] = totalProb > 0
    ? rawPelagens
        .map((p) => ({ ...p, prob: Math.round((p.prob / totalProb) * 100) }))
        .filter((p) => p.prob >= 2)
        .sort((a, b) => b.prob - a.prob)
    : [];

  // Largest-remainder adjustment so percentages sum to 100
  const roundedSum = pelagens.reduce((s, c) => s + c.prob, 0);
  if (roundedSum !== 100 && pelagens.length > 0) {
    const diff = 100 - roundedSum;
    const maxIdx = pelagens.reduce((mi, c, i, arr) => c.prob > arr[mi].prob ? i : mi, 0);
    pelagens[maxIdx].prob += diff;
  }

  // Altura prevista do potro — Galton regression to mean (M-16)
  const parentMean = (garanhao.altura + egua.altura) / 2;
  const alturaMedia = Math.round(160 + 0.5 * (parentMean - 160));
  const alturaMin = alturaMedia - 4;
  const alturaMax = alturaMedia + 4;

  // Nível de compatibilidade
  const nivel =
    total >= 85
      ? tr("Excelente", "Excellent", "Excelente")
      : total >= 70
        ? tr("Muito Boa", "Very Good", "Muy Buena")
        : total >= 55
          ? tr("Boa", "Good", "Buena")
          : total >= 40
            ? tr("Razoável", "Fair", "Razonable")
            : tr("Problemática", "Problematic", "Problemática");

  // Recomendações
  const recomendacoes: string[] = [];
  if (coiPrevisto > 5) {
    recomendacoes.push(
      tr("Considere um reprodutor de linhagem diferente para aumentar diversidade genética", "Consider a breeder from a different lineage to increase genetic diversity", "Considere un reproductor de línea diferente para aumentar la diversidad genética")
    );
  }
  if (defeitosComuns.length > 0) {
    recomendacoes.push(tr("Recomenda-se teste genético completo antes de prosseguir com cruzamento", "Complete genetic testing is recommended before proceeding with breeding", "Se recomienda prueba genética completa antes de proceder con el cruzamiento"));
  }
  if (egua.idade > 14) {
    recomendacoes.push(tr("Acompanhamento veterinário intensivo recomendado durante gestação", "Intensive veterinary monitoring recommended during pregnancy", "Seguimiento veterinario intensivo recomendado durante la gestación"));
  }
  if (tempScore < 7) {
    recomendacoes.push(
      tr("Potros podem herdar temperamento mais desafiante - preparar para trabalho de doma adequado", "Foals may inherit a more challenging temperament - prepare for appropriate training", "Los potros pueden heredar un temperamento más desafiante - preparar para trabajo de doma adecuado")
    );
  }
  if (total >= 80) {
    recomendacoes.push(
      tr("Cruzamento promissor - considere registar potro no Livro de Nascimentos APSL", "Promising cross - consider registering the foal in the APSL Birth Book", "Cruzamiento prometedor - considere registrar el potro en el Libro de Nacimientos APSL")
    );
  }
  if (andMedia >= 8 && confMedia >= 8) {
    recomendacoes.push(
      tr("Potencial para potro de competição - considere plano de treino desde jovem", "Potential for competition foal - consider a training plan from a young age", "Potencial para potro de competición - considere un plan de entrenamiento desde joven")
    );
  }

  // Rider-specific recommendations
  if (cavaleiro) {
    if (cavaleiro.nivelFitness === "sedentario") {
      recomendacoes.push(
        tr(
          "Recomenda-se programa de preparação física antes de montar regularmente",
          "A physical preparation programme is recommended before riding regularly",
          "Se recomienda un programa de preparación física antes de montar regularmente"
        )
      );
    }
    if (cavaleiro.pesoCavaleiro > 90) {
      recomendacoes.push(
        tr(
          "Considere cavalos com altura mínima de 160cm para o peso do cavaleiro",
          "Consider horses with a minimum height of 160cm for the rider's weight",
          "Considere caballos con altura mínima de 160cm para el peso del jinete"
        )
      );
    }
  }

  // Detect red flags
  const redFlags = cavaleiro
    ? detectRedFlags(cavaleiro, garanhao, egua, objetivo || "lazer", tr)
    : [];

  return {
    score: Math.min(100, Math.max(total, 0)),
    nivel,
    coi: coiPrevisto,
    blup: blupPrevisto,
    blupMin,
    blupMax,
    altura: { min: alturaMin, max: alturaMax },
    pelagens,
    riscos,
    factores: factores.sort((a, b) => b.score - a.score),
    recomendacoes,
    pontosForteseFracos: { fortes, fracos },
    redFlags,
  };
}

import type { Cavalo, ResultadoCompatibilidade } from "./types";
import { DEFEITOS_GENETICOS } from "./data";

// ============================================
// LÓGICA DE CÁLCULO - Verificador de Compatibilidade
// ============================================

type TranslatorFn = (pt: string, en: string, es?: string) => string;
const defaultTr: TranslatorFn = (pt) => pt;

export function calcularCompatibilidade(garanhao: Cavalo, egua: Cavalo, tr: TranslatorFn = defaultTr): ResultadoCompatibilidade {
  const factores: ResultadoCompatibilidade["factores"] = [];
  const riscos: ResultadoCompatibilidade["riscos"] = [];
  const fortes: string[] = [];
  const fracos: string[] = [];
  let total = 0;

  // 1. Idade Reprodutiva (15pts)
  const idadeGaranhaoOk = garanhao.idade >= 4 && garanhao.idade <= 20;
  const idadeEguaOk = egua.idade >= 4 && egua.idade <= 18;
  const idadeScore = idadeGaranhaoOk && idadeEguaOk ? 15 : idadeGaranhaoOk || idadeEguaOk ? 10 : 5;
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
  const tamanhoScore = difAltura <= 5 ? 10 : difAltura <= 8 ? 8 : difAltura <= 12 ? 5 : 3;
  factores.push({
    nome: tr("Compatibilidade Física", "Physical Compatibility", "Compatibilidad Física"),
    score: tamanhoScore,
    max: 10,
    tipo: tamanhoScore >= 8 ? "excelente" : tamanhoScore >= 5 ? "bom" : "aviso",
    descricao: tr(`Diferença de altura: ${difAltura}cm`, `Height difference: ${difAltura}cm`, `Diferencia de altura: ${difAltura}cm`),
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

  // 6. Temperamento (10pts)
  const tempCompat: Record<string, Record<string, number>> = {
    Calmo: { Calmo: 10, Equilibrado: 9, Energético: 7, Nervoso: 5 },
    Equilibrado: { Calmo: 9, Equilibrado: 10, Energético: 8, Nervoso: 6 },
    Energético: { Calmo: 7, Equilibrado: 8, Energético: 7, Nervoso: 4 },
    Nervoso: { Calmo: 6, Equilibrado: 6, Energético: 4, Nervoso: 3 },
  };
  const tempScore = tempCompat[garanhao.temperamento]?.[egua.temperamento] || 5;
  factores.push({
    nome: tr("Compatibilidade Temperamento", "Temperament Compatibility", "Compatibilidad de Temperamento"),
    score: tempScore,
    max: 10,
    tipo:
      tempScore >= 8 ? "excelente" : tempScore >= 6 ? "bom" : tempScore >= 4 ? "aviso" : "risco",
    descricao: tr("Combinação dos temperamentos dos progenitores", "Combination of the parents' temperaments", "Combinación de los temperamentos de los progenitores"),
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
  if (garanhao.aprovado && egua.aprovado) {
    total += 5;
    fortes.push(tr("Ambos aprovados oficialmente como reprodutores", "Both officially approved as breeders", "Ambos aprobados oficialmente como reproductores"));
  } else if (!garanhao.aprovado) {
    fracos.push(tr("Garanhão não aprovado como reprodutor", "Stallion not approved as breeder", "Semental no aprobado como reproductor"));
  }

  // 10. Historial Reprodutivo (0-5 pts)
  const matGar = garanhao.matingsRealizados ?? 0;
  const potGar = garanhao.potradasNascidos ?? 0;
  const matEgu = egua.matingsRealizados ?? 0;
  const potEgu = egua.potradasNascidos ?? 0;
  let historialScore = 0;
  if (matGar > 0 || matEgu > 0) historialScore += 2;
  if (potGar > 3 || potEgu > 2) historialScore += 2;
  if (potGar > 10 || potEgu > 5) historialScore += 1;
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

  // Defeitos genéticos comuns
  const defeitosComuns = garanhao.defeitos.filter((d) => egua.defeitos.includes(d));
  if (defeitosComuns.length > 0) {
    defeitosComuns.forEach((d) => {
      const defeito = DEFEITOS_GENETICOS.find((def) => def.value === d);
      riscos.push({
        texto: tr(
          `Ambos portadores de ${defeito?.label || d} - risco para descendência`,
          `Both carriers of ${defeito?.label || d} - risk for offspring`,
          `Ambos portadores de ${defeito?.label || d} - riesgo para la descendencia`
        ),
        severidade: "alto",
      });
    });
    total -= defeitosComuns.length * 10;
    factores.push({
      nome: tr("Saúde Genética", "Genetic Health", "Salud Genética"),
      score: 0,
      max: defeitosComuns.length * 10,
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

    const p_palomino = ng * p_ee * p_CrN;
    if (p_palomino > 0.01)
      rawPelagens.push({ cor: "Palomino", prob: p_palomino, genetica: "ee CrN" });

    const p_cremello = ng * p_ee * p_CrCr;
    if (p_cremello > 0.01)
      rawPelagens.push({ cor: "Cremello", prob: p_cremello, genetica: "ee CrCr" });

    const p_redDun = ng * p_ee * p_NN * p_dun;
    if (p_redDun > 0.01) rawPelagens.push({ cor: tr("Alazão Dun", "Red Dun", "Alazán Dun"), prob: p_redDun, genetica: "ee D_" });

    // Base Castanho/Baio (E_A_)
    const p_cast = ng * p_E_ * p_A_ * p_NN * p_nodun;
    if (p_cast > 0.01) rawPelagens.push({ cor: tr("Castanho/Baio", "Bay", "Castaño/Bayo"), prob: p_cast, genetica: "E_A_" });

    const p_buckskin = ng * p_E_ * p_A_ * p_CrN;
    if (p_buckskin > 0.01)
      rawPelagens.push({ cor: "Buckskin", prob: p_buckskin, genetica: "E_A_ CrN" });

    const p_perlino = ng * p_E_ * p_A_ * p_CrCr;
    if (p_perlino > 0.01)
      rawPelagens.push({ cor: "Perlino", prob: p_perlino, genetica: "E_A_ CrCr" });

    const p_bayDun = ng * p_E_ * p_A_ * p_NN * p_dun;
    if (p_bayDun > 0.01) rawPelagens.push({ cor: tr("Baio Dun", "Bay Dun", "Bayo Dun"), prob: p_bayDun, genetica: "E_A_ D_" });

    // Base Preto (E_aa)
    const p_preto = ng * p_E_ * p_aa * p_NN * p_nodun;
    if (p_preto > 0.01) rawPelagens.push({ cor: tr("Preto", "Black", "Negro"), prob: p_preto, genetica: "E_aa" });

    const p_smoky = ng * p_E_ * p_aa * p_CrN;
    if (p_smoky > 0.01)
      rawPelagens.push({ cor: "Smoky Black", prob: p_smoky, genetica: "E_aa CrN" });

    const p_smokyCream = ng * p_E_ * p_aa * p_CrCr;
    if (p_smokyCream > 0.01)
      rawPelagens.push({ cor: "Smoky Cream", prob: p_smokyCream, genetica: "E_aa CrCr" });

    const p_grullo = ng * p_E_ * p_aa * p_NN * p_dun;
    if (p_grullo > 0.01) rawPelagens.push({ cor: "Grullo", prob: p_grullo, genetica: "E_aa D_" });
  }

  // Normalizar para somar 100% e filtrar pelagens < 2%
  const totalProb = rawPelagens.reduce((s, p) => s + p.prob, 0);
  const pelagens: ResultadoCompatibilidade["pelagens"] = totalProb > 0
    ? rawPelagens
        .map((p) => ({ ...p, prob: Math.round((p.prob / totalProb) * 100) }))
        .filter((p) => p.prob >= 2)
        .sort((a, b) => b.prob - a.prob)
    : [];

  // Altura prevista do potro
  const alturaMedia = (garanhao.altura + egua.altura) / 2;
  const alturaMin = Math.round(alturaMedia - 4);
  const alturaMax = Math.round(alturaMedia + 4);

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

  return {
    score: Math.min(100, Math.max(total, 0)),
    nivel,
    coi: coiPrevisto,
    blup: blupPrevisto,
    altura: { min: alturaMin, max: alturaMax },
    pelagens: pelagens.filter((p) => p.prob > 0).sort((a, b) => b.prob - a.prob),
    riscos,
    factores: factores.sort((a, b) => b.score - a.score),
    recomendacoes,
    pontosForteseFracos: { fortes, fracos },
  };
}

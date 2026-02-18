import type { Cavalo, ResultadoCompatibilidade } from "./types";
import { DEFEITOS_GENETICOS } from "./data";

// ============================================
// LOGICA DE CALCULO - Verificador de Compatibilidade
// ============================================

export function calcularCompatibilidade(garanhao: Cavalo, egua: Cavalo): ResultadoCompatibilidade {
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
    nome: "Idade Reprodutiva",
    score: idadeScore,
    max: 15,
    tipo: idadeScore >= 12 ? "excelente" : idadeScore >= 8 ? "bom" : "aviso",
    descricao: "Idade ideal: Garanhão 4-20, Égua 4-18 anos",
  });
  if (egua.idade > 16)
    riscos.push({ texto: "Égua com idade avançada para reprodução", severidade: "medio" });
  if (egua.idade < 4) riscos.push({ texto: "Égua demasiado jovem", severidade: "alto" });
  if (garanhao.idade > 18)
    riscos.push({ texto: "Garanhão com idade avançada", severidade: "baixo" });
  total += idadeScore;

  // 2. Compatibilidade Física (10pts)
  const difAltura = Math.abs(garanhao.altura - egua.altura);
  const tamanhoScore = difAltura <= 5 ? 10 : difAltura <= 8 ? 8 : difAltura <= 12 ? 5 : 3;
  factores.push({
    nome: "Compatibilidade Física",
    score: tamanhoScore,
    max: 10,
    tipo: tamanhoScore >= 8 ? "excelente" : tamanhoScore >= 5 ? "bom" : "aviso",
    descricao: `Diferença de altura: ${difAltura}cm`,
  });
  if (difAltura > 10)
    riscos.push({
      texto: `Diferença de altura significativa (${difAltura}cm)`,
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
  const linMedia = (linNiveis[garanhao.linhagem] + linNiveis[egua.linhagem]) / 2;
  const linScore = Math.round(linMedia * 4);
  factores.push({
    nome: "Qualidade Genética",
    score: linScore,
    max: 20,
    tipo: linScore >= 16 ? "excelente" : linScore >= 10 ? "bom" : "neutro",
    descricao: "Média da qualidade das linhagens dos progenitores",
  });
  if (linScore >= 16) fortes.push("Ambos progenitores com linhagem de prestígio");
  if (linScore < 8) fracos.push("Linhagem pouco documentada");
  total += linScore;

  // 4. Conformação (15pts)
  const confMedia = (garanhao.conformacao + egua.conformacao) / 2;
  const confScore = Math.round(confMedia * 1.5);
  factores.push({
    nome: "Conformação Morfológica",
    score: confScore,
    max: 15,
    tipo: confScore >= 12 ? "excelente" : confScore >= 9 ? "bom" : "neutro",
    descricao: "Qualidade morfológica média dos progenitores",
  });
  if (confMedia >= 8) fortes.push("Excelente conformação em ambos progenitores");
  total += confScore;

  // 5. Andamentos (10pts)
  const andMedia = (garanhao.andamentos + egua.andamentos) / 2;
  const andScore = Math.round(andMedia);
  factores.push({
    nome: "Qualidade dos Andamentos",
    score: andScore,
    max: 10,
    tipo: andScore >= 8 ? "excelente" : andScore >= 6 ? "bom" : "neutro",
    descricao: "Funcionalidade e expressão de movimentos",
  });
  if (andMedia >= 8) fortes.push("Andamentos de qualidade superior em ambos");
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
    nome: "Compatibilidade Temperamento",
    score: tempScore,
    max: 10,
    tipo:
      tempScore >= 8 ? "excelente" : tempScore >= 6 ? "bom" : tempScore >= 4 ? "aviso" : "risco",
    descricao: "Combinação dos temperamentos dos progenitores",
  });
  if (tempScore <= 4)
    riscos.push({ texto: "Temperamentos potencialmente incompatíveis", severidade: "medio" });
  if (tempScore >= 9) fortes.push("Temperamentos complementares");
  total += tempScore;

  // 7. Estado de Saúde (10pts)
  const saudeMedia = (garanhao.saude + egua.saude) / 2;
  const saudeScore = Math.round(saudeMedia);
  factores.push({
    nome: "Estado de Saúde",
    score: saudeScore,
    max: 10,
    tipo: saudeScore >= 8 ? "excelente" : saudeScore >= 6 ? "bom" : "aviso",
    descricao: "Condição veterinária geral dos progenitores",
  });
  if (saudeMedia < 6) riscos.push({ texto: "Estado de saúde requer atenção", severidade: "medio" });
  total += saudeScore;

  // 8. Fertilidade (5pts)
  const fertNiveis: Record<string, number> = { "Muito Alta": 5, Alta: 4, Normal: 3, Baixa: 1 };
  const fertScore = Math.round(
    (fertNiveis[garanhao.fertilidade] + fertNiveis[egua.fertilidade]) / 2
  );
  factores.push({
    nome: "Índice de Fertilidade",
    score: fertScore,
    max: 5,
    tipo: fertScore >= 4 ? "excelente" : fertScore >= 3 ? "bom" : "aviso",
    descricao: "Historial reprodutivo dos progenitores",
  });
  if (fertScore <= 2)
    riscos.push({ texto: "Fertilidade baixa pode dificultar concepção", severidade: "medio" });
  total += fertScore;

  // 9. Aprovação como reprodutores (5pts bónus)
  if (garanhao.aprovado && egua.aprovado) {
    total += 5;
    fortes.push("Ambos aprovados oficialmente como reprodutores");
  } else if (!garanhao.aprovado) {
    fracos.push("Garanhão não aprovado como reprodutor");
  }

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
      texto: `COI elevado previsto: ${coiPrevisto.toFixed(1)}%`,
      severidade: "alto",
    });
    fracos.push("Consanguinidade elevada pode causar problemas genéticos");
  } else if (coiPrevisto < 3) {
    fortes.push("Baixa consanguinidade - excelente diversidade genética");
  }

  if (blupPrevisto > 110) fortes.push(`BLUP previsto elevado: ${blupPrevisto}`);

  // Defeitos genéticos comuns
  const defeitosComuns = garanhao.defeitos.filter((d) => egua.defeitos.includes(d));
  if (defeitosComuns.length > 0) {
    defeitosComuns.forEach((d) => {
      const defeito = DEFEITOS_GENETICOS.find((def) => def.value === d);
      riscos.push({
        texto: `Ambos portadores de ${defeito?.label || d} - risco para descendência`,
        severidade: "alto",
      });
    });
    total -= defeitosComuns.length * 10;
    fracos.push(`Defeitos genéticos em comum: ${defeitosComuns.join(", ")}`);
  }

  // WFFS específico
  if (garanhao.defeitos.includes("WFFS") && egua.defeitos.includes("WFFS")) {
    riscos.push({
      texto: "RISCO CRÍTICO: 25% dos potros podem ter WFFS fatal",
      severidade: "alto",
    });
  }

  // Previsão de pelagem — Genética Mendeliana completa (5 loci)
  // Frequência do alelo recessivo de cada progenitor
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

  if (p_grey > 0.01) rawPelagens.push({ cor: "Ruço", prob: p_grey, genetica: "G_" });

  if (ng > 0.01) {
    // Base Alazão (ee)
    const p_al = ng * p_ee * p_NN * p_nodun;
    if (p_al > 0.01) rawPelagens.push({ cor: "Alazão", prob: p_al, genetica: "ee" });

    const p_palomino = ng * p_ee * p_CrN;
    if (p_palomino > 0.01)
      rawPelagens.push({ cor: "Palomino", prob: p_palomino, genetica: "ee CrN" });

    const p_cremello = ng * p_ee * p_CrCr;
    if (p_cremello > 0.01)
      rawPelagens.push({ cor: "Cremello", prob: p_cremello, genetica: "ee CrCr" });

    const p_redDun = ng * p_ee * p_NN * p_dun;
    if (p_redDun > 0.01) rawPelagens.push({ cor: "Alazão Dun", prob: p_redDun, genetica: "ee D_" });

    // Base Castanho/Baio (E_A_)
    const p_cast = ng * p_E_ * p_A_ * p_NN * p_nodun;
    if (p_cast > 0.01) rawPelagens.push({ cor: "Castanho/Baio", prob: p_cast, genetica: "E_A_" });

    const p_buckskin = ng * p_E_ * p_A_ * p_CrN;
    if (p_buckskin > 0.01)
      rawPelagens.push({ cor: "Buckskin", prob: p_buckskin, genetica: "E_A_ CrN" });

    const p_perlino = ng * p_E_ * p_A_ * p_CrCr;
    if (p_perlino > 0.01)
      rawPelagens.push({ cor: "Perlino", prob: p_perlino, genetica: "E_A_ CrCr" });

    const p_bayDun = ng * p_E_ * p_A_ * p_NN * p_dun;
    if (p_bayDun > 0.01) rawPelagens.push({ cor: "Baio Dun", prob: p_bayDun, genetica: "E_A_ D_" });

    // Base Preto (E_aa)
    const p_preto = ng * p_E_ * p_aa * p_NN * p_nodun;
    if (p_preto > 0.01) rawPelagens.push({ cor: "Preto", prob: p_preto, genetica: "E_aa" });

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
  const pelagens: ResultadoCompatibilidade["pelagens"] = rawPelagens
    .map((p) => ({ ...p, prob: Math.round((p.prob / totalProb) * 100) }))
    .filter((p) => p.prob >= 2)
    .sort((a, b) => b.prob - a.prob);

  // Altura prevista do potro
  const alturaMedia = (garanhao.altura + egua.altura) / 2;
  const alturaMin = Math.round(alturaMedia - 4);
  const alturaMax = Math.round(alturaMedia + 4);

  // Nível de compatibilidade
  const nivel =
    total >= 85
      ? "Excelente"
      : total >= 70
        ? "Muito Boa"
        : total >= 55
          ? "Boa"
          : total >= 40
            ? "Razoável"
            : "Problemática";

  // Recomendações
  const recomendacoes: string[] = [];
  if (coiPrevisto > 5) {
    recomendacoes.push(
      "Considere um reprodutor de linhagem diferente para aumentar diversidade genética"
    );
  }
  if (defeitosComuns.length > 0) {
    recomendacoes.push("Recomenda-se teste genético completo antes de prosseguir com cruzamento");
  }
  if (egua.idade > 14) {
    recomendacoes.push("Acompanhamento veterinário intensivo recomendado durante gestação");
  }
  if (tempScore < 7) {
    recomendacoes.push(
      "Potros podem herdar temperamento mais desafiante - preparar para trabalho de doma adequado"
    );
  }
  if (total >= 80) {
    recomendacoes.push(
      "Cruzamento promissor - considere registar potro no Livro de Nascimentos APSL"
    );
  }
  if (andMedia >= 8 && confMedia >= 8) {
    recomendacoes.push(
      "Potencial para potro de competição - considere plano de treino desde jovem"
    );
  }

  return {
    score: Math.max(total, 0),
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

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
  let coiPrevisto = (garanhao.coi + egua.coi) / 2;
  if (mesmaCoude) coiPrevisto += 3.125;
  if (mesmaLinhagem) coiPrevisto += 1.5;
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

  // Previsão de pelagem (simplificada mas mais completa)
  const greyG = garanhao.genetica.grey;
  const greyE = egua.genetica.grey;
  const hasGrey = greyG.includes("G") || greyE.includes("G");

  let probGrey = 0;
  if (greyG === "GG" || greyE === "GG") probGrey = hasGrey ? 100 : 0;
  else if (greyG === "Gg" && greyE === "Gg") probGrey = 75;
  else if (greyG === "Gg" || greyE === "Gg") probGrey = 50;

  const pelagens: ResultadoCompatibilidade["pelagens"] = [];
  if (probGrey > 0) {
    pelagens.push({ cor: "Ruço", prob: probGrey, genetica: "G_" });
  }
  if (probGrey < 100) {
    const restante = 100 - probGrey;
    // Simplificado - em realidade depende de Extension e Agouti
    pelagens.push({ cor: "Castanho", prob: Math.round(restante * 0.5), genetica: "E_A_" });
    pelagens.push({ cor: "Preto", prob: Math.round(restante * 0.3), genetica: "E_aa" });
    pelagens.push({ cor: "Alazão", prob: Math.round(restante * 0.2), genetica: "ee" });
  }

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

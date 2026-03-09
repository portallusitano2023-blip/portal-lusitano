// ============================================
// CALCULATION LOGIC - Calculadora de Valor
// ============================================

import type { FormData, Resultado } from "./types";
import {
  VALORES_BASE,
  MERCADOS,
  MULT_LINHAGEM,
  MULT_SAUDE,
  MULT_COMP,
  MULT_LIVRO,
  DISCIPLINA_PREMIUMS,
} from "./data";

// Helper: age multiplier — shared between calcularValor and estimarValorParcial
function calcMultIdade(idade: number): number {
  if (idade >= 7 && idade <= 12) return 1.15; // Ideal age window
  if (idade >= 5 && idade <= 6) return 1.05; // Young adult, developing
  if (idade > 15) return 0.75; // Senior
  if (idade > 12) return 0.9; // Mature
  return 1.0; // Under 5 — potro
}

export function calcularValor(form: FormData, tr?: (pt: string, en: string, es: string) => string): Resultado {
  const t = tr || ((pt: string) => pt); // fallback to Portuguese
  const base = VALORES_BASE[form.treino];
  const mercadoData = MERCADOS.find((m) => m.value === form.mercado);
  const multMercado = mercadoData?.mult || 1.0;

  // Multiplicadores detalhados — fallback to 1.0 prevents NaN propagation on unknown keys
  const multLinhagem = MULT_LINHAGEM[form.linhagem] ?? 1.0;
  const multSaude = MULT_SAUDE[form.saude] ?? 1.0;
  const multComp = MULT_COMP[form.competicoes] ?? 1.0;
  const multLivro = MULT_LIVRO[form.livroAPSL] ?? 1.0;

  // Linhagem famosa — bonus when a recognised lineage is paired with premium/elite quality
  let multLinhagemFamosa = 1.0;
  if (
    form.linhagemPrincipal &&
    form.linhagemPrincipal !== "outra" &&
    (form.linhagem === "premium" || form.linhagem === "elite")
  ) {
    const LINEAGE_BONUSES: Record<string, number> = {
      veiga: 1.08,
      andrade: 1.06,
      alter_real: 1.05,
      coudelaria_nacional: 1.04,
      infante_da_camara: 1.04,
    };
    multLinhagemFamosa = LINEAGE_BONUSES[form.linhagemPrincipal] ?? 1.0;
  }

  // Idade ideal: 7-12 anos
  const multIdade = calcMultIdade(form.idade);

  // Morfologia detalhada
  const morfMedia = (form.morfologia + form.garupa + form.espádua + form.cabeca + form.membros) / 5;
  const multMorfo = 0.65 + (morfMedia / 10) * 0.7;

  // Andamentos detalhados
  const andMedia = (form.andamentos + form.elevacao + form.suspensao + form.regularidade) / 4;
  const multAnd = 0.65 + (andMedia / 10) * 0.7;

  // Temperamento
  const tempMedia = (form.temperamento + form.sensibilidade + form.vontadeTrabalho) / 3;
  const multTemp = 0.75 + (tempMedia / 10) * 0.5;

  // Disciplina premium
  const multDisciplina = DISCIPLINA_PREMIUMS[form.disciplina] ?? 1.0;

  // Pelagem × Mercado (preferências regionais)
  let multPelagemMercado = 1.0;
  if (form.pelagem === "Ruço" && (form.mercado === "Brasil" || form.mercado === "EUA"))
    multPelagemMercado = 1.08;
  else if (form.pelagem === "Preto" && form.mercado !== "Portugal") multPelagemMercado = 1.06;
  else if (form.pelagem === "Palomino") multPelagemMercado = 1.05;
  else if (form.pelagem === "Isabela") multPelagemMercado = 1.04;

  // Certificado de exportação
  const multExport = (form.certificadoExportacao ?? false) ? 1.06 : 1.0;

  // Proprietários anteriores: histórico simplifica venda
  const numProp = form.proprietariosAnteriores ?? 0;
  const multPropAnter = numProp === 0 ? 1.05 : numProp === 1 ? 1.0 : numProp === 2 ? 0.95 : 0.88;

  // Bonus documentacao
  const multDoc = (form.raioX ? 1.05 : 1.0) * (form.exameVeterinario ? 1.05 : 1.0);

  // Reproducao — capped at 2.5x to prevent absurd values with high offspring counts
  const multRepro = form.reproducao
    ? Math.min(2.5, 1.15 + form.descendentes * 0.02 + form.descendentesAprovados * 0.05)
    : 1.0;

  // Tendencia mercado
  const multTend = form.tendencia === "alta" ? 1.12 : form.tendencia === "baixa" ? 0.88 : 1.0;

  // Sexo
  const multSexo =
    form.sexo === "garanhao" && form.reproducao
      ? 1.4
      : form.sexo === "egua" && form.reproducao
        ? 1.2
        : form.sexo === "egua"
          ? 1.05
          : 1.0;

  // Altura (ideal 160-168cm)
  const multAltura =
    form.altura >= 160 && form.altura <= 168
      ? 1.05
      : form.altura < 155 || form.altura > 172
        ? 0.92
        : 1.0;

  const totalMult =
    multLinhagem *
    multLinhagemFamosa *
    multSaude *
    multComp *
    multIdade *
    multMorfo *
    multAnd *
    multTemp *
    multLivro *
    multDoc *
    multRepro *
    multTend *
    multSexo *
    multAltura *
    multMercado *
    multDisciplina *
    multPelagemMercado *
    multExport *
    multPropAnter;

  const rawValor = base * totalMult;
  if (!isFinite(rawValor)) {
    throw new Error("Cálculo resultou em valor inválido — verifique os dados de entrada");
  }
  const valorFinal = Math.round(rawValor);
  const variance = form.registoAPSL ? 0.12 : 0.2;

  const categorias = [
    {
      nome: t("Genética & Linhagem", "Genetics & Lineage", "Genética y Linaje"),
      impacto: Math.round((multLinhagem - 1) * base),
      score: multLinhagem * 4.5,
      descricao: t("Qualidade do pedigree e historial genético", "Pedigree quality and genetic history", "Calidad del pedigrí e historial genético"),
    },
    {
      nome: t("Conformação Morfológica", "Morphological Conformation", "Conformación Morfológica"),
      impacto: Math.round((multMorfo - 1) * base),
      score: morfMedia,
      descricao: t("Estrutura física segundo padrões APSL", "Physical structure per APSL standards", "Estructura física según estándares APSL"),
    },
    {
      nome: t("Qualidade dos Andamentos", "Gait Quality", "Calidad de los Movimientos"),
      impacto: Math.round((multAnd - 1) * base),
      score: andMedia,
      descricao: t("Elevação, suspensão e regularidade", "Elevation, suspension and regularity", "Elevación, suspensión y regularidad"),
    },
    {
      nome: t("Nível de Treino", "Training Level", "Nivel de Entrenamiento"),
      impacto: Math.round(base - VALORES_BASE["potro"]),
      score: Object.keys(VALORES_BASE).indexOf(form.treino) + 3,
      descricao: t("Formação e preparação técnica", "Education and technical preparation", "Formación y preparación técnica"),
    },
    {
      nome: t("Estado de Saúde", "Health Status", "Estado de Salud"),
      impacto: Math.round((multSaude * multDoc - 1) * base),
      score: multSaude * 8,
      descricao: t("Condição física e documentação", "Physical condition and documentation", "Condición física y documentación"),
    },
    {
      nome: t("Carácter & Temperamento", "Character & Temperament", "Carácter y Temperamento"),
      impacto: Math.round((multTemp - 1) * base),
      score: tempMedia,
      descricao: t("Sensibilidade e vontade de trabalho", "Sensitivity and willingness to work", "Sensibilidad y voluntad de trabajo"),
    },
    {
      nome: t("Palmarés Desportivo", "Competition Record", "Palmarés Deportivo"),
      impacto: Math.round((multComp - 1) * base),
      score: Math.min(10, multComp * 6),
      descricao: t("Resultados em competição oficial", "Results in official competition", "Resultados en competición oficial"),
    },
    {
      nome: t("Potencial Reprodutivo", "Reproductive Potential", "Potencial Reproductivo"),
      impacto: Math.round((multRepro - 1) * base),
      score: form.reproducao ? 8 : 4,
      descricao: t("Potencial e historial reprodutivo", "Reproductive potential and history", "Potencial e historial reproductivo"),
    },
    {
      nome: t("Disciplina & Especialização", "Discipline & Specialization", "Disciplina y Especialización"),
      impacto: Math.round((multDisciplina - 1) * base),
      score: multDisciplina * 7,
      descricao: t("Adequação à disciplina e mercado-alvo", "Suitability for discipline and target market", "Adecuación a la disciplina y mercado objetivo"),
    },
  ].sort((a, b) => b.impacto - a.impacto);

  // Pontos fortes e fracos
  const fortes: string[] = [];
  const fracos: string[] = [];

  if (multLinhagem >= 1.5) fortes.push(t("Linhagem de prestígio reconhecido", "Recognised prestigious lineage", "Linaje de prestigio reconocido"));
  if (multLinhagem < 1.0) fracos.push(t("Pedigree pouco documentado", "Poorly documented pedigree", "Pedigrí poco documentado"));
  if (morfMedia >= 8) fortes.push(t("Conformação morfológica excepcional", "Exceptional morphological conformation", "Conformación morfológica excepcional"));
  if (morfMedia < 6) fracos.push(t("Morfologia abaixo do padrão ideal", "Morphology below ideal standard", "Morfología por debajo del estándar ideal"));
  if (andMedia >= 8) fortes.push(t("Andamentos de qualidade superior", "Superior quality gaits", "Movimientos de calidad superior"));
  if (andMedia < 6) fracos.push(t("Andamentos precisam de desenvolvimento", "Gaits need development", "Movimientos necesitan desarrollo"));
  if (form.competicoes !== "nenhuma") fortes.push(t("Experiência comprovada em competição", "Proven competition experience", "Experiencia comprobada en competición"));
  if (form.registoAPSL && form.livroAPSL === "definitivo")
    fortes.push(t("Registo APSL Livro Definitivo", "APSL Definitive Book registration", "Registro APSL Libro Definitivo"));
  if (!form.registoAPSL) fracos.push(t("Sem registo no Stud Book APSL", "No APSL Stud Book registration", "Sin registro en el Stud Book APSL"));
  if (form.raioX && form.exameVeterinario) fortes.push(t("Documentação veterinária completa", "Complete veterinary documentation", "Documentación veterinaria completa"));
  if (tempMedia >= 8) fortes.push(t("Temperamento equilibrado e cooperativo", "Balanced and cooperative temperament", "Temperamento equilibrado y cooperativo"));
  if (form.idade >= 7 && form.idade <= 12) fortes.push(t("Idade ideal para performance", "Ideal age for performance", "Edad ideal para rendimiento"));
  if (form.idade > 15) fracos.push(t("Idade avançada limita valorização", "Advanced age limits appreciation", "Edad avanzada limita la valorización"));

  // Comparacoes de mercado
  const comparacao = [
    {
      tipo: t("Média do mercado (mesmo nível)", "Market average (same level)", "Media del mercado (mismo nivel)"),
      valorMedio: Math.round(base * 1.1),
      diferenca: Math.round((valorFinal / (base * 1.1) - 1) * 100),
    },
    {
      tipo: t("Cavalos de linhagem similar", "Horses of similar lineage", "Caballos de linaje similar"),
      valorMedio: Math.round(base * multLinhagem),
      diferenca: Math.round((valorFinal / (base * multLinhagem) - 1) * 100),
    },
    {
      tipo: t("Top 10% da raça", "Top 10% of the breed", "Top 10% de la raza"),
      valorMedio: Math.round(base * 2.0),
      diferenca: Math.round((valorFinal / (base * 2.0) - 1) * 100),
    },
  ];

  // Recomendacoes personalizadas
  const recomendacoes: string[] = [];
  if (form.morfologia < 7)
    recomendacoes.push(
      t(
        "Investir em trabalho de ginástica funcional pode melhorar a apresentação e valorizar 10-15%",
        "Investing in functional gymnastic work can improve presentation and add 10-15% value",
        "Invertir en trabajo de gimnasia funcional puede mejorar la presentación y valorizar 10-15%"
      )
    );
  if (!form.registoAPSL)
    recomendacoes.push(
      t(
        "O registo APSL é fundamental - valoriza automaticamente 15-20% no mercado internacional",
        "APSL registration is essential - automatically adds 15-20% value in the international market",
        "El registro APSL es fundamental - valoriza automáticamente 15-20% en el mercado internacional"
      )
    );
  if (form.competicoes === "nenhuma" && form.treino !== "potro" && form.treino !== "desbravado") {
    recomendacoes.push(
      t(
        "Participação em provas regionais aumenta credibilidade e pode valorizar 10-12%",
        "Participation in regional competitions increases credibility and can add 10-12% value",
        "Participación en pruebas regionales aumenta credibilidad y puede valorizar 10-12%"
      )
    );
  }
  if (form.saude !== "excelente" && !form.raioX) {
    recomendacoes.push(
      t(
        "Exame veterinário completo com radiografias é essencial para compradores exigentes",
        "Complete veterinary examination with X-rays is essential for demanding buyers",
        "Examen veterinario completo con radiografías es esencial para compradores exigentes"
      )
    );
  }
  if (form.treino === "elementar" || form.treino === "iniciado") {
    recomendacoes.push(
      t(
        "Progressão para nível Médio pode aumentar o valor em 40-60%",
        "Progression to Medium level can increase value by 40-60%",
        "Progresión al nivel Medio puede aumentar el valor en 40-60%"
      )
    );
  }
  if (
    form.sexo === "garanhao" &&
    !form.reproducao &&
    form.morfologia >= 7 &&
    form.andamentos >= 7
  ) {
    recomendacoes.push(
      t(
        "Considerar aprovação como reprodutor - garanhões aprovados têm valorização significativa",
        "Consider approval as breeding stallion - approved stallions have significant value increase",
        "Considerar aprobación como reproductor - sementales aprobados tienen valorización significativa"
      )
    );
  }
  if (!form.exameVeterinario) {
    recomendacoes.push(
      t(
        "Relatório veterinário atualizado transmite segurança e facilita negociação",
        "Updated veterinary report conveys confidence and facilitates negotiation",
        "Informe veterinario actualizado transmite seguridad y facilita la negociación"
      )
    );
  }
  if (form.mercado === "Portugal" && multMorfo > 1.1) {
    recomendacoes.push(
      t(
        "Com esta qualidade, mercados como Alemanha ou EUA podem oferecer valores 25-35% superiores",
        "With this quality, markets like Germany or USA can offer 25-35% higher values",
        "Con esta calidad, mercados como Alemania o EE.UU. pueden ofrecer valores 25-35% superiores"
      )
    );
  }

  // Score de liquidez: velocidade estimada de venda (0-100)
  let liquidezScore = 40;
  if (form.registoAPSL) liquidezScore += 15;
  if (form.raioX) liquidezScore += 8;
  if (form.exameVeterinario) liquidezScore += 5;
  if (form.certificadoExportacao ?? false) liquidezScore += 10;
  if (form.mercado !== "Portugal") liquidezScore += 5;
  if (form.idade >= 5 && form.idade <= 12) liquidezScore += 8;
  if (form.competicoes !== "nenhuma") liquidezScore += 7;
  if (form.disciplina === "Alta Escola" || form.disciplina === "Equitação de Trabalho")
    liquidezScore += 5;
  if (form.livroAPSL === "definitivo") liquidezScore += 5;
  if (morfMedia >= 8) liquidezScore += 5;
  liquidezScore = Math.min(100, liquidezScore);

  const liquidezTempoDias =
    liquidezScore >= 80 ? 30 : liquidezScore >= 65 ? 60 : liquidezScore >= 50 ? 90 : 180;
  const liquidezLabel =
    liquidezScore >= 80
      ? t("Alta Liquidez", "High Liquidity", "Alta Liquidez")
      : liquidezScore >= 65
        ? t("Boa Liquidez", "Good Liquidity", "Buena Liquidez")
        : liquidezScore >= 50
          ? t("Liquidez Moderada", "Moderate Liquidity", "Liquidez Moderada")
          : t("Liquidez Baixa", "Low Liquidity", "Liquidez Baja");

  return {
    valorFinal,
    valorMin: Math.round(valorFinal * (1 - variance)),
    valorMax: Math.round(valorFinal * (1 + variance)),
    confianca: Math.min(
      95,
      45 +
        (form.registoAPSL ? 15 : 0) +
        (form.raioX ? 8 : 0) +
        (form.exameVeterinario ? 8 : 0) +
        Math.round(morfMedia * 1.2) +
        Math.round(andMedia * 0.8)
    ),
    blup: Math.max(
      50,
      Math.round(100 + (multLinhagem - 1) * 60 + (morfMedia - 5) * 8 + (andMedia - 5) * 6)
    ),
    percentil: Math.min(99, Math.round(totalMult * 45)),
    multiplicador: Math.round(totalMult * 100) / 100,
    categorias,
    recomendacoes,
    comparacao,
    pontosForteseFracos: { fortes, fracos },
    liquidez: {
      score: liquidezScore,
      tempoDias: liquidezTempoDias,
      label: liquidezLabel,
    },
  };
}

// ============================================
// ESTIMATIVA PARCIAL (para mostrar em tempo real durante o preenchimento)
// Usa apenas os dados já disponíveis — menos precisa mas imediata
// ============================================

export function estimarValorParcial(form: Partial<FormData>): { min: number; max: number } | null {
  // Só estimar quando o treino está definido (passo 1+)
  if (!form.treino || !VALORES_BASE[form.treino]) return null;

  const base = VALORES_BASE[form.treino];

  // Multiplicadores básicos com os dados disponíveis
  const multIdade = form.idade ? calcMultIdade(form.idade) : 1.0;

  const multLinhagem = form.linhagem ? MULT_LINHAGEM[form.linhagem] || 1.0 : 1.0;
  const multSaude = form.saude ? MULT_SAUDE[form.saude] || 1.0 : 1.0;
  const multComp = form.competicoes ? MULT_COMP[form.competicoes] || 1.0 : 1.0;

  const estimate = base * multIdade * multLinhagem * multSaude * multComp;

  // Margem ampla para indicar que são dados parciais
  return {
    min: Math.round(estimate * 0.72),
    max: Math.round(estimate * 1.38),
  };
}

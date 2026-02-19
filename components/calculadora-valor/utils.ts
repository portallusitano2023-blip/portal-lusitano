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

export function calcularValor(form: FormData): Resultado {
  const base = VALORES_BASE[form.treino];
  const mercadoData = MERCADOS.find((m) => m.value === form.mercado);
  const multMercado = mercadoData?.mult || 1.0;

  // Multiplicadores detalhados — fallback to 1.0 prevents NaN propagation on unknown keys
  const multLinhagem = MULT_LINHAGEM[form.linhagem] ?? 1.0;
  const multSaude = MULT_SAUDE[form.saude] ?? 1.0;
  const multComp = MULT_COMP[form.competicoes] ?? 1.0;
  const multLivro = MULT_LIVRO[form.livroAPSL] ?? 1.0;

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
      nome: "Genética & Linhagem",
      impacto: Math.round((multLinhagem - 1) * base),
      score: multLinhagem * 4.5,
      descricao: "Qualidade do pedigree e historial genético",
    },
    {
      nome: "Conformação Morfológica",
      impacto: Math.round((multMorfo - 1) * base),
      score: morfMedia,
      descricao: "Estrutura física segundo padrões APSL",
    },
    {
      nome: "Qualidade dos Andamentos",
      impacto: Math.round((multAnd - 1) * base),
      score: andMedia,
      descricao: "Elevação, suspensão e regularidade",
    },
    {
      nome: "Nível de Treino",
      impacto: Math.round(base * 0.4),
      score: Object.keys(VALORES_BASE).indexOf(form.treino) + 3,
      descricao: "Formação e preparação técnica",
    },
    {
      nome: "Saúde & Veterinária",
      impacto: Math.round((multSaude * multDoc - 1) * base),
      score: multSaude * 8,
      descricao: "Condição física e documentação",
    },
    {
      nome: "Carácter & Temperamento",
      impacto: Math.round((multTemp - 1) * base),
      score: tempMedia,
      descricao: "Sensibilidade e vontade de trabalho",
    },
    {
      nome: "Palmarés Desportivo",
      impacto: Math.round((multComp - 1) * base),
      score: multComp * 6,
      descricao: "Resultados em competição oficial",
    },
    {
      nome: "Valor Reprodutivo",
      impacto: Math.round((multRepro - 1) * base),
      score: form.reproducao ? 8 : 4,
      descricao: "Potencial e historial reprodutivo",
    },
    {
      nome: "Disciplina & Vocação",
      impacto: Math.round((multDisciplina - 1) * base),
      score: multDisciplina * 7,
      descricao: "Adequação à disciplina e mercado-alvo",
    },
  ].sort((a, b) => b.impacto - a.impacto);

  // Pontos fortes e fracos
  const fortes: string[] = [];
  const fracos: string[] = [];

  if (multLinhagem >= 1.5) fortes.push("Linhagem de prestígio reconhecido");
  if (multLinhagem < 1.0) fracos.push("Pedigree pouco documentado");
  if (morfMedia >= 8) fortes.push("Conformação morfológica excepcional");
  if (morfMedia < 6) fracos.push("Morfologia abaixo do padrão ideal");
  if (andMedia >= 8) fortes.push("Andamentos de qualidade superior");
  if (andMedia < 6) fracos.push("Andamentos precisam de desenvolvimento");
  if (form.competicoes !== "nenhuma") fortes.push("Experiência comprovada em competição");
  if (form.registoAPSL && form.livroAPSL === "definitivo")
    fortes.push("Registo APSL Livro Definitivo");
  if (!form.registoAPSL) fracos.push("Sem registo no Stud Book APSL");
  if (form.raioX && form.exameVeterinario) fortes.push("Documentação veterinária completa");
  if (tempMedia >= 8) fortes.push("Temperamento equilibrado e cooperativo");
  if (form.idade >= 7 && form.idade <= 12) fortes.push("Idade ideal para performance");
  if (form.idade > 15) fracos.push("Idade avançada limita valorização");

  // Comparacoes de mercado
  const comparacao = [
    {
      tipo: "Média do mercado (mesmo nível)",
      valorMedio: Math.round(base * 1.1),
      diferenca: Math.round((valorFinal / (base * 1.1) - 1) * 100),
    },
    {
      tipo: "Cavalos de linhagem similar",
      valorMedio: Math.round(base * multLinhagem),
      diferenca: Math.round((valorFinal / (base * multLinhagem) - 1) * 100),
    },
    {
      tipo: "Top 10% da raça",
      valorMedio: Math.round(base * 2.0),
      diferenca: Math.round((valorFinal / (base * 2.0) - 1) * 100),
    },
  ];

  // Recomendacoes personalizadas
  const recomendacoes: string[] = [];
  if (form.morfologia < 7)
    recomendacoes.push(
      "Investir em trabalho de ginástica funcional pode melhorar a apresentação e valorizar 10-15%"
    );
  if (!form.registoAPSL)
    recomendacoes.push(
      "O registo APSL é fundamental - valoriza automaticamente 15-20% no mercado internacional"
    );
  if (form.competicoes === "nenhuma" && form.treino !== "potro" && form.treino !== "desbravado") {
    recomendacoes.push(
      "Participação em provas regionais aumenta credibilidade e pode valorizar 10-12%"
    );
  }
  if (form.saude !== "excelente" && !form.raioX) {
    recomendacoes.push(
      "Exame veterinário completo com radiografias é essencial para compradores exigentes"
    );
  }
  if (form.treino === "elementar" || form.treino === "iniciado") {
    recomendacoes.push("Progressão para nível Médio pode aumentar o valor em 40-60%");
  }
  if (
    form.sexo === "garanhao" &&
    !form.reproducao &&
    form.morfologia >= 7 &&
    form.andamentos >= 7
  ) {
    recomendacoes.push(
      "Considerar aprovação como reprodutor - garanhões aprovados têm valorização significativa"
    );
  }
  if (!form.exameVeterinario) {
    recomendacoes.push(
      "Relatório veterinário atualizado transmite segurança e facilita negociação"
    );
  }
  if (form.mercado === "Portugal" && multMorfo > 1.1) {
    recomendacoes.push(
      "Com esta qualidade, mercados como Alemanha ou EUA podem oferecer valores 25-35% superiores"
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
      ? "Alta Liquidez"
      : liquidezScore >= 65
        ? "Boa Liquidez"
        : liquidezScore >= 50
          ? "Liquidez Moderada"
          : "Liquidez Baixa";

  return {
    valorFinal,
    valorMin: Math.round(valorFinal * (1 - variance)),
    valorMax: Math.round(valorFinal * (1 + variance)),
    confianca: Math.min(
      95,
      65 +
        (form.registoAPSL ? 10 : 0) +
        (form.raioX ? 5 : 0) +
        (form.exameVeterinario ? 5 : 0) +
        Math.round(morfMedia) +
        Math.round(andMedia / 2)
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

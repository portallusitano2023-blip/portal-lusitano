import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  createBasePDF,
  addSection,
  addKeyValue,
  addProgressBar,
  addFooter,
  addText,
  GOLD,
  MARGIN,
} from "./base";

interface CavaloCompat {
  nome: string;
  sexo: string;
  idade: number;
  altura: number;
  pelagem: string;
  linhagem: string;
  conformacao: number;
  andamentos: number;
  temperamento: string;
  saude: number;
  blup: number;
  coi: number;
}

interface ResultadoCompat {
  score: number;
  nivel: string;
  coi: number;
  blup: number;
  altura: { min: number; max: number };
  pelagens: { cor: string; prob: number; genetica: string }[];
  riscos: { texto: string; severidade: "alto" | "medio" | "baixo" }[];
  factores: { nome: string; score: number; max: number; tipo: string; descricao: string }[];
  recomendacoes: string[];
  pontosForteseFracos: { fortes: string[]; fracos: string[] };
}

export function generateCompatibilidadePDF(
  garanhao: CavaloCompat,
  egua: CavaloCompat,
  resultado: ResultadoCompat
): void {
  const doc = createBasePDF(
    "Analise de Compatibilidade",
    `${garanhao.nome || "Garanhao"} x ${egua.nome || "Egua"}`
  );

  let y = 50;

  // Main score
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(`${resultado.score}/100 - ${resultado.nivel}`, MARGIN, y);
  y += 12;

  // Genetic metrics
  y = addSection(doc, "Metricas Geneticas", y);
  y = addKeyValue(doc, "COI Previsto", `${resultado.coi.toFixed(1)}%`, y);
  y = addKeyValue(doc, "BLUP Previsto", `${resultado.blup}`, y);
  y = addKeyValue(doc, "Altura Estimada", `${resultado.altura.min}-${resultado.altura.max} cm`, y);
  y += 4;

  // Horse details side by side
  y = addSection(doc, "Progenitores", y);

  const headers = ["Parametro", "Garanhao", "Egua"];
  const rows = [
    ["Nome", garanhao.nome || "-", egua.nome || "-"],
    ["Idade", `${garanhao.idade} anos`, `${egua.idade} anos`],
    ["Altura", `${garanhao.altura} cm`, `${egua.altura} cm`],
    ["Pelagem", garanhao.pelagem, egua.pelagem],
    ["Linhagem", garanhao.linhagem, egua.linhagem],
    ["Conformacao", `${garanhao.conformacao}/10`, `${egua.conformacao}/10`],
    ["Andamentos", `${garanhao.andamentos}/10`, `${egua.andamentos}/10`],
    ["Temperamento", garanhao.temperamento, egua.temperamento],
    ["Saude", `${garanhao.saude}/10`, `${egua.saude}/10`],
    ["BLUP", `${garanhao.blup}`, `${egua.blup}`],
    ["COI", `${garanhao.coi}%`, `${egua.coi}%`],
  ];

  (doc as jsPDF & { autoTable: (opts: Record<string, unknown>) => void }).autoTable({
    startY: y,
    head: [headers],
    body: rows,
    theme: "grid",
    styles: {
      fillColor: [20, 20, 20],
      textColor: [200, 200, 200],
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [GOLD[0], GOLD[1], GOLD[2]],
      textColor: [0, 0, 0],
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [30, 30, 30] },
    margin: { left: MARGIN, right: MARGIN },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable?.finalY + 10 || y + 70;

  // Coat prediction
  if (resultado.pelagens.length > 0) {
    y = addSection(doc, "Previsao de Pelagem", y);
    for (const p of resultado.pelagens) {
      y = addKeyValue(doc, p.cor, `${p.prob}% (${p.genetica})`, y);
    }
    y += 4;
  }

  // Risks
  if (resultado.riscos.length > 0) {
    y = addSection(doc, "Alertas e Riscos", y);
    for (const r of resultado.riscos) {
      const color =
        r.severidade === "alto"
          ? ([239, 68, 68] as const)
          : r.severidade === "medio"
            ? ([245, 158, 11] as const)
            : ([234, 179, 8] as const);
      y = addText(doc, `[${r.severidade.toUpperCase()}] ${r.texto}`, y, { color });
    }
    y += 4;
  }

  // Factor analysis
  y = addSection(doc, "Analise por Factor", y);
  for (const f of resultado.factores) {
    y = addProgressBar(doc, f.nome, f.score, f.max, y);
  }
  y += 4;

  // Strengths & Weaknesses
  if (resultado.pontosForteseFracos.fortes.length > 0) {
    y = addSection(doc, "Pontos Fortes", y);
    for (const p of resultado.pontosForteseFracos.fortes) {
      y = addText(doc, `+ ${p}`, y, { color: [34, 197, 94] as const });
    }
  }

  if (resultado.pontosForteseFracos.fracos.length > 0) {
    y = addSection(doc, "Pontos Fracos", y);
    for (const p of resultado.pontosForteseFracos.fracos) {
      y = addText(doc, `- ${p}`, y, { color: [251, 146, 60] as const });
    }
  }

  // Recommendations
  if (resultado.recomendacoes.length > 0) {
    y = addSection(doc, "Recomendacoes", y);
    for (const rec of resultado.recomendacoes) {
      y = addText(doc, `> ${rec}`, y, { color: GOLD });
    }
  }

  addFooter(doc);
  doc.save(
    `compatibilidade-${garanhao.nome || "garanhao"}-${egua.nome || "egua"}-${Date.now()}.pdf`
  );
}

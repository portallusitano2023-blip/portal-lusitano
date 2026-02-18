import type jsPDF from "jspdf";
import { createBasePDF, addSection, addFooter, addText, GOLD, MARGIN, ZINC400 } from "./base";

interface CavaloComp {
  nome: string;
  idade: number;
  sexo: string;
  altura: number;
  pelagem: string;
  linhagem: string;
  treino: string;
  conformacao: number;
  andamentos: number;
  temperamento: number;
  saude: number;
  blup: number;
  preco: number;
  registoAPSL: boolean;
}

export async function generateComparadorPDF(
  cavalos: CavaloComp[],
  scores: number[],
  vencedorNome: string,
  melhorValorNome: string
): Promise<void> {
  const doc = await createBasePDF("Comparacao de Cavalos", `${cavalos.length} cavalos analisados`);

  let y = 50;

  // Winners summary
  y = addSection(doc, "Resultado da Comparacao", y);
  y = addText(doc, `Melhor Qualidade: ${vencedorNome}`, y, {
    bold: true,
    color: GOLD,
  });
  y = addText(doc, `Melhor Custo-Beneficio: ${melhorValorNome}`, y, {
    bold: true,
    color: [34, 197, 94] as const,
  });
  y += 6;

  // Comparison table
  y = addSection(doc, "Tabela Comparativa", y);

  const headers = ["Parametro", ...cavalos.map((c) => c.nome || "Cavalo")];
  const rows = [
    ["Idade", ...cavalos.map((c) => `${c.idade} anos`)],
    ["Altura", ...cavalos.map((c) => `${c.altura} cm`)],
    ["Sexo", ...cavalos.map((c) => c.sexo)],
    ["Pelagem", ...cavalos.map((c) => c.pelagem)],
    ["Linhagem", ...cavalos.map((c) => c.linhagem)],
    ["Treino", ...cavalos.map((c) => c.treino)],
    ["Conformacao", ...cavalos.map((c) => `${c.conformacao}/10`)],
    ["Andamentos", ...cavalos.map((c) => `${c.andamentos}/10`)],
    ["Temperamento", ...cavalos.map((c) => `${c.temperamento}/10`)],
    ["Saude", ...cavalos.map((c) => `${c.saude}/10`)],
    ["BLUP", ...cavalos.map((c) => `${c.blup}`)],
    ["APSL", ...cavalos.map((c) => (c.registoAPSL ? "Sim" : "Nao"))],
    ["Preco", ...cavalos.map((c) => `${c.preco.toLocaleString("pt-PT")} EUR`)],
    ["SCORE", ...scores.map((s) => `${s} pts`)],
    [
      "Valor/Ponto",
      ...cavalos.map((c, i) =>
        scores[i] > 0 ? `${Math.round(c.preco / scores[i]).toLocaleString("pt-PT")} EUR` : "N/A"
      ),
    ],
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
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [30, 30, 30],
    },
    margin: { left: MARGIN, right: MARGIN },
  });

  y = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY
    ? (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
    : y + 80;

  // Disclaimer
  y = addText(
    doc,
    "Os scores sao calculados com base nos dados fornecidos e nao substituem avaliacao presencial.",
    y,
    { color: ZINC400, size: 8 }
  );

  addFooter(doc);
  doc.save(`comparacao-cavalos-${Date.now()}.pdf`);
}

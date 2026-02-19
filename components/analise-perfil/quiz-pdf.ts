import type { Result } from "./types";

export async function generateProfilePDF(
  result: Result,
  scores: Record<string, number>
): Promise<void> {
  const jsPDF = (await import("jspdf")).default;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const p = Math.round((scores[result.profile] / totalScore) * 100);

  // Header
  doc.setFillColor(5, 5, 5);
  doc.rect(0, 0, 210, 297, "F");
  doc.setTextColor(197, 160, 89);
  doc.setFontSize(10);
  doc.text("PORTAL LUSITANO", 105, 20, { align: "center" });
  doc.setFontSize(8);
  doc.text("ANALISE DE PERFIL DO CAVALEIRO", 105, 27, { align: "center" });

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.text(result.title, 105, 50, { align: "center" });
  doc.setTextColor(197, 160, 89);
  doc.setFontSize(14);
  doc.text(result.subtitle, 105, 60, { align: "center" });

  // Percentage
  doc.setFontSize(36);
  doc.text(`${p}%`, 105, 80, { align: "center" });

  // Description
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);
  const descLines = doc.splitTextToSize(result.description, 170);
  doc.text(descLines, 20, 95);

  // Ideal Horse Section
  let yPos = 95 + descLines.length * 5 + 10;
  doc.setTextColor(197, 160, 89);
  doc.setFontSize(12);
  doc.text("CAVALO IDEAL", 20, yPos);
  yPos += 8;
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.text(`Idade: ${result.idealHorse.age}`, 20, yPos);
  doc.text(`Altura: ${result.idealHorse.height}`, 105, yPos);
  yPos += 6;
  doc.text(`Treino: ${result.idealHorse.training}`, 20, yPos);
  yPos += 6;
  doc.text(`Temperamento: ${result.idealHorse.temperament}`, 20, yPos);
  yPos += 6;
  doc.text(`Preco: ${result.idealHorse.priceRange}`, 20, yPos);

  // Costs Section
  yPos += 15;
  doc.setTextColor(197, 160, 89);
  doc.setFontSize(12);
  doc.text("CUSTOS ANUAIS ESTIMADOS", 20, yPos);
  yPos += 8;
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);
  doc.text(
    `${result.annualCosts.min.toLocaleString()} - ${result.annualCosts.max.toLocaleString()} euros/ano`,
    20,
    yPos
  );

  // Tips Section
  yPos += 15;
  doc.setTextColor(197, 160, 89);
  doc.setFontSize(12);
  doc.text("DICAS", 20, yPos);
  yPos += 8;
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  result.tips.slice(0, 5).forEach((tip, i) => {
    doc.text(`${i + 1}. ${tip}`, 20, yPos);
    yPos += 5;
  });

  // Next Steps Section
  yPos += 10;
  doc.setTextColor(197, 160, 89);
  doc.setFontSize(12);
  doc.text("PROXIMOS PASSOS", 20, yPos);
  yPos += 8;
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  result.nextSteps.slice(0, 4).forEach((step, i) => {
    doc.text(`${i + 1}. ${step}`, 20, yPos);
    yPos += 5;
  });

  // Footer
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text("portallusitano.pt/analise-perfil", 105, 285, { align: "center" });
  doc.text(`Gerado em ${new Date().toLocaleDateString("pt-PT")}`, 105, 290, {
    align: "center",
  });

  doc.save(`analise-perfil-${result.profile}.pdf`);
}

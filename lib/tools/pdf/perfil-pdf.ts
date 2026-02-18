import {
  createBasePDF,
  addSection,
  addKeyValue,
  addFooter,
  addText,
  GOLD,
  ZINC400,
  MARGIN,
} from "./base";

interface PerfilData {
  profile: string;
  title: string;
  subtitle: string;
  description: string;
  characteristics: string[];
  idealHorse: {
    age: string;
    height: string;
    training: string;
    temperament: string;
    priceRange: string;
  };
  annualCosts: {
    min: number;
    max: number;
    includes: string[];
  };
  recommendedRegions: string[];
  linhagens: { name: string; reason: string }[];
  disciplinas: string[];
  tips: string[];
  nextSteps: string[];
}

export async function generatePerfilPDF(profileData: PerfilData): Promise<void> {
  const doc = await createBasePDF("Analise de Perfil Equestre", profileData.title);

  let y = 50;

  // Profile title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(profileData.title, MARGIN, y);
  y += 6;
  y = addText(doc, profileData.subtitle, y, { color: GOLD });
  y += 4;
  y = addText(doc, profileData.description, y, { color: ZINC400 });
  y += 6;

  // Characteristics
  y = addSection(doc, "Caracteristicas do Perfil", y);
  for (const c of profileData.characteristics) {
    y = addText(doc, `• ${c}`, y);
  }
  y += 4;

  // Ideal horse
  y = addSection(doc, "Cavalo Ideal", y);
  y = addKeyValue(doc, "Idade", profileData.idealHorse.age, y);
  y = addKeyValue(doc, "Altura", profileData.idealHorse.height, y);
  y = addKeyValue(doc, "Treino", profileData.idealHorse.training, y);
  y = addKeyValue(doc, "Temperamento", profileData.idealHorse.temperament, y);
  y = addKeyValue(doc, "Faixa de Preco", profileData.idealHorse.priceRange, y);
  y += 4;

  // Annual costs
  y = addSection(doc, "Custos Anuais Estimados", y);
  y = addKeyValue(
    doc,
    "Intervalo",
    `${profileData.annualCosts.min.toLocaleString("pt-PT")} - ${profileData.annualCosts.max.toLocaleString("pt-PT")} EUR`,
    y
  );
  for (const item of profileData.annualCosts.includes) {
    y = addText(doc, `• ${item}`, y, { color: ZINC400, size: 8 });
  }
  y += 4;

  // Recommended regions
  y = addSection(doc, "Regioes Recomendadas", y);
  y = addText(doc, profileData.recommendedRegions.join(", "), y);
  y += 4;

  // Lineages
  if (profileData.linhagens.length > 0) {
    y = addSection(doc, "Linhagens Recomendadas", y);
    for (const lin of profileData.linhagens) {
      y = addKeyValue(doc, lin.name, lin.reason, y);
    }
    y += 4;
  }

  // Disciplines
  y = addSection(doc, "Disciplinas", y);
  y = addText(doc, profileData.disciplinas.join(", "), y);
  y += 4;

  // Tips
  if (profileData.tips.length > 0) {
    y = addSection(doc, "Dicas", y);
    for (const tip of profileData.tips) {
      y = addText(doc, `> ${tip}`, y, { color: GOLD });
    }
    y += 4;
  }

  // Next steps
  if (profileData.nextSteps.length > 0) {
    y = addSection(doc, "Proximos Passos", y);
    for (let i = 0; i < profileData.nextSteps.length; i++) {
      y = addText(doc, `${i + 1}. ${profileData.nextSteps[i]}`, y);
    }
  }

  addFooter(doc);
  doc.save(`perfil-equestre-${profileData.profile}-${Date.now()}.pdf`);
}

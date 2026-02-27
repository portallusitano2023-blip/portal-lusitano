import { Calculator, BarChart3, Heart, UserCheck } from "lucide-react";
import { createTranslator } from "@/lib/tr";

export const toolSlugs = [
  "calculadora-valor",
  "comparador-cavalos",
  "verificador-compatibilidade",
  "analise-perfil",
];

export function getTools(tr: ReturnType<typeof createTranslator>) {
  return [
    {
      title: tr("Calculadora de Valor", "Value Calculator", "Calculadora de Valor"),
      href: "/calculadora-valor",
      icon: Calculator,
      description: tr(
        "Estimativa profissional do valor de mercado do seu Lusitano, com intervalo de confiança e recomendações de valorização.",
        "Professional market value estimate for your Lusitano, with confidence interval and enhancement recommendations.",
        "Estimación profesional del valor de mercado de su Lusitano, con intervalo de confianza y recomendaciones de valorización."
      ),
      features: [
        tr(
          "Algoritmo com 20+ variáveis (linhagem, morfologia, treino)",
          "Algorithm with 20+ variables (bloodline, morphology, training)",
          "Algoritmo con 20+ variables (linaje, morfología, entrenamiento)"
        ),
        tr(
          "Análise de mercado por região (PT, BR, EUA, EU)",
          "Market analysis by region (PT, BR, USA, EU)",
          "Análisis de mercado por región (PT, BR, EE.UU., UE)"
        ),
        tr(
          "Relatório detalhado com intervalo de confiança",
          "Detailed report with confidence interval",
          "Informe detallado con intervalo de confianza"
        ),
      ],
      color: "from-amber-500/20 to-amber-600/5",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      badge: tr("Mais popular", "Most popular", "Más popular"),
      badgeColor: "bg-gradient-to-r from-[var(--gold)] to-[#D4B068] text-black",
      freeUses: 1,
      estimatedTime: tr("~3 min", "~3 min", "~3 min"),
    },
    {
      title: tr("Comparador de Cavalos", "Horse Comparator", "Comparador de Caballos"),
      href: "/comparador-cavalos",
      icon: BarChart3,
      description: tr(
        "Compare até 4 cavalos lado a lado com gráficos radar, scores e análise de pontos fortes e fracos.",
        "Compare up to 4 horses side by side with radar charts, scores and strengths/weaknesses analysis.",
        "Compare hasta 4 caballos con gráficos radar, puntuaciones y análisis de fortalezas y debilidades."
      ),
      features: [
        tr(
          "Comparação visual com gráfico radar de 6 eixos",
          "Visual comparison with 6-axis radar chart",
          "Comparación visual con gráfico radar de 6 ejes"
        ),
        tr(
          "Score global e ranking por categoria",
          "Overall score and ranking by category",
          "Puntuación global y ranking por categoría"
        ),
        tr(
          "Ideal para decisões de compra ou cruzamento",
          "Ideal for purchase or breeding decisions",
          "Ideal para decisiones de compra o cruzamiento"
        ),
      ],
      color: "from-blue-500/20 to-blue-600/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      badge: null,
      badgeColor: null,
      freeUses: 1,
      estimatedTime: tr("~4 min", "~4 min", "~4 min"),
    },
    {
      title: tr(
        "Verificador de Compatibilidade",
        "Compatibility Checker",
        "Verificador de Compatibilidad"
      ),
      href: "/verificador-compatibilidade",
      icon: Heart,
      description: tr(
        "Análise genética de cruzamentos com previsão de pelagem, alerta de consanguinidade e score de compatibilidade.",
        "Genetic crossing analysis with coat colour prediction, inbreeding alert and compatibility score.",
        "Análisis genético de cruzamientos con previsión de capa, alerta de consanguinidad y puntuación de compatibilidad."
      ),
      features: [
        tr(
          "Score de compatibilidade genética (0–100)",
          "Genetic compatibility score (0–100)",
          "Puntuación de compatibilidad genética (0–100)"
        ),
        tr(
          "Previsão de pelagem dos potros",
          "Foal coat colour prediction",
          "Previsión de capa de los potros"
        ),
        tr(
          "Coeficiente de consanguinidade (COI)",
          "Inbreeding coefficient (COI)",
          "Coeficiente de consanguinidad (COI)"
        ),
      ],
      color: "from-rose-500/20 to-rose-600/5",
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-400",
      badge: null,
      badgeColor: null,
      freeUses: 1,
      estimatedTime: tr("~3 min", "~3 min", "~3 min"),
    },
    {
      title: tr("Análise de Perfil", "Profile Analysis", "Análisis de Perfil"),
      href: "/analise-perfil",
      icon: UserCheck,
      description: tr(
        "Questionário personalizado que revela o seu perfil de cavaleiro e recomenda raças, disciplinas e cavalos ideais.",
        "Personalised questionnaire that reveals your rider profile and recommends ideal breeds, disciplines and horses.",
        "Cuestionario personalizado que revela su perfil de jinete y recomienda razas, disciplinas y caballos ideales."
      ),
      features: [
        tr(
          "4 perfis: Criador, Competidor, Amador, Investidor",
          "4 profiles: Breeder, Competitor, Amateur, Investor",
          "4 perfiles: Criador, Competidor, Amateur, Inversor"
        ),
        tr(
          "Recomendação de raças e disciplinas",
          "Breed and discipline recommendations",
          "Recomendación de razas y disciplinas"
        ),
        tr(
          "Resultado partilhável nas redes sociais",
          "Shareable result on social networks",
          "Resultado compartible en redes sociales"
        ),
      ],
      color: "from-emerald-500/20 to-emerald-600/5",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      badge: tr("Recomendado", "Recommended", "Recomendado"),
      badgeColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      freeUses: 1,
      estimatedTime: tr("~2 min", "~2 min", "~2 min"),
    },
  ];
}

export function getToolSlugToName(tr: ReturnType<typeof createTranslator>) {
  return {
    "calculadora-valor": tr("Calculadora de Valor", "Value Calculator", "Calculadora de Valor"),
    "comparador-cavalos": tr("Comparador de Cavalos", "Horse Comparator", "Comparador de Caballos"),
    "verificador-compatibilidade": tr(
      "Verificador de Compatibilidade",
      "Compatibility Checker",
      "Verificador de Compatibilidad"
    ),
    "analise-perfil": tr("Análise de Perfil", "Profile Analysis", "Análisis de Perfil"),
  } as Record<string, string>;
}

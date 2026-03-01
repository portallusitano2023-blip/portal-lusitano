export interface FAQItem {
  question: string;
  answer: string;
  category: "geral" | "precos" | "tecnico";
}

const faqItemsByLang: Record<string, FAQItem[]> = {
  pt: [
    // === GERAL ===
    {
      question: "As ferramentas são gratuitas?",
      answer:
        "Sim, cada ferramenta oferece 1 utilização gratuita para que possa experimentar sem compromisso. Para utilizações ilimitadas, exportação de PDF e funcionalidades avançadas, pode subscrever o plano PRO por apenas 9,99€/mês ou 79€/ano.",
      category: "geral",
    },
    {
      question: "As ferramentas funcionam para cavalos de outras raças?",
      answer:
        "As nossas ferramentas foram concebidas e optimizadas especificamente para o Cavalo Lusitano, com dados, parâmetros e referências ajustados à raça. Embora possam ser usadas com outras raças ibéricas, os resultados serão mais precisos para Lusitanos registados na APSL.",
      category: "geral",
    },
    {
      question: "Os meus dados e resultados ficam guardados?",
      answer:
        "No plano gratuito, os resultados são apresentados apenas durante a sessão. No plano PRO, todo o seu histórico de análises fica guardado na sua conta, podendo consultá-lo, exportá-lo em PDF ou partilhá-lo com um link directo a qualquer momento.",
      category: "geral",
    },
    {
      question: "Os meus dados estão seguros?",
      answer:
        "Absolutamente. Todos os dados são encriptados em trânsito e em repouso. Não partilhamos informações dos seus cavalos com terceiros. Os dados são usados exclusivamente para gerar os seus relatórios e, no plano PRO, para manter o seu histórico pessoal.",
      category: "geral",
    },
    // === PREÇOS ===
    {
      question: "Posso cancelar a subscrição PRO a qualquer momento?",
      answer:
        "Sim, pode cancelar a sua subscrição PRO a qualquer momento, sem compromissos ou taxas adicionais. Continuará a ter acesso às funcionalidades PRO até ao final do período de facturação em curso.",
      category: "precos",
    },
    {
      question: "Qual a diferença entre o plano Gratuito e o PRO?",
      answer:
        "O plano Gratuito permite 1 utilização por ferramenta com resultados básicos. O PRO desbloqueia utilizações ilimitadas, resultados detalhados com recomendações avançadas, exportação de relatórios em PDF, histórico completo de análises, partilha com link e suporte prioritário.",
      category: "precos",
    },
    {
      question: "Existe um plano anual com desconto?",
      answer:
        "Sim. O plano anual custa 79€/ano (equivalente a 6,58€/mês), o que representa uma poupança de 34% face ao plano mensal de 9,99€. Ambos os planos incluem exactamente as mesmas funcionalidades.",
      category: "precos",
    },
    // === TÉCNICO ===
    {
      question: "Como funciona a Calculadora de Valor?",
      answer:
        "A Calculadora utiliza um algoritmo com mais de 20 variáveis: linhagem (pai, mãe, avós), morfologia, andamentos, pelagem, nível de treino, resultados em competição, certificações (raio-X, APSL), e tendências de mercado por região. O resultado é uma estimativa fundamentada com intervalo de confiança e recomendações para valorização.",
      category: "tecnico",
    },
    {
      question: "Qual a precisão dos resultados da Calculadora?",
      answer:
        "A Calculadora fornece uma estimativa baseada em dados de mercado e nas características do cavalo. Os valores são indicativos e reflectem tendências reais do mercado Lusitano. Para transacções concretas, recomendamos complementar com uma avaliação presencial por um profissional certificado.",
      category: "tecnico",
    },
    {
      question: "O Verificador de Compatibilidade substitui a opinião de um veterinário?",
      answer:
        "Não. O Verificador é uma ferramenta de apoio à decisão que analisa dados genéticos (linhagem, coeficiente de consanguinidade, probabilidades de pelagem) e morfológicos para sugerir cruzamentos promissores. Recomendamos sempre consultar um veterinário especializado em reprodução equina antes de tomar decisões definitivas.",
      category: "tecnico",
    },
    {
      question: "Como funciona o Comparador de Cavalos?",
      answer:
        "O Comparador permite analisar até 4 cavalos lado a lado, gerando gráficos radar de aptidões, comparação de pontos fortes e fracos, e um score global por cavalo. É ideal para quem está a decidir entre vários cavalos para compra, cruzamento ou orientação de treino.",
      category: "tecnico",
    },
    {
      question: "O que é a Análise de Perfil de Cavaleiro?",
      answer:
        "A Análise de Perfil utiliza um questionário personalizado sobre a sua experiência, objectivos, orçamento e preferências para determinar o seu perfil de cavaleiro (Criador, Competidor, Amador ou Investidor) e recomendar raças, disciplinas e tipos de cavalo mais adequados ao seu perfil.",
      category: "tecnico",
    },
  ],
  en: [
    // === GENERAL ===
    {
      question: "Are the tools free?",
      answer:
        "Yes, each tool offers 1 free use so you can try without commitment. For unlimited uses, PDF export and advanced features, you can subscribe to the PRO plan for just €9.99/month or €79/year.",
      category: "geral",
    },
    {
      question: "Do the tools work for other horse breeds?",
      answer:
        "Our tools were designed and optimised specifically for the Lusitano Horse, with data, parameters and references adjusted to the breed. While they may be used with other Iberian breeds, results will be most accurate for Lusitanos registered with the APSL.",
      category: "geral",
    },
    {
      question: "Are my data and results saved?",
      answer:
        "In the free plan, results are only shown during the session. In the PRO plan, your entire analysis history is saved in your account, and you can consult, export as PDF or share it with a direct link at any time.",
      category: "geral",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. All data is encrypted in transit and at rest. We do not share your horse information with third parties. Data is used exclusively to generate your reports and, on the PRO plan, to maintain your personal history.",
      category: "geral",
    },
    // === PRICING ===
    {
      question: "Can I cancel my PRO subscription at any time?",
      answer:
        "Yes, you can cancel your PRO subscription at any time, with no commitments or additional fees. You will continue to have access to PRO features until the end of the current billing period.",
      category: "precos",
    },
    {
      question: "What's the difference between the Free and PRO plans?",
      answer:
        "The Free plan allows 1 use per tool with basic results. PRO unlocks unlimited uses, detailed results with advanced recommendations, PDF report export, complete analysis history, link sharing and priority support.",
      category: "precos",
    },
    {
      question: "Is there an annual plan with a discount?",
      answer:
        "Yes. The annual plan costs €79/year (equivalent to €6.58/month), which represents a 34% saving compared to the monthly plan at €9.99. Both plans include exactly the same features.",
      category: "precos",
    },
    // === TECHNICAL ===
    {
      question: "How does the Value Calculator work?",
      answer:
        "The Calculator uses an algorithm with over 20 variables: bloodline (sire, dam, grandparents), morphology, gaits, coat colour, training level, competition results, certifications (X-ray, APSL), and market trends by region. The result is a well-founded estimate with a confidence interval and recommendations for value enhancement.",
      category: "tecnico",
    },
    {
      question: "How accurate are the Calculator results?",
      answer:
        "The Calculator provides an estimate based on market data and horse characteristics. Values are indicative and reflect real trends in the Lusitano market. For actual transactions, we recommend complementing with an in-person assessment by a certified professional.",
      category: "tecnico",
    },
    {
      question: "Does the Compatibility Checker replace a vet's opinion?",
      answer:
        "No. The Checker is a decision support tool that analyses genetic data (bloodline, inbreeding coefficient, coat colour probabilities) and morphological data to suggest promising crosses. We always recommend consulting a veterinarian specialised in equine reproduction before making definitive decisions.",
      category: "tecnico",
    },
    {
      question: "How does the Horse Comparator work?",
      answer:
        "The Comparator lets you analyse up to 4 horses side by side, generating aptitude radar charts, strengths and weaknesses comparison, and an overall score per horse. It's ideal for those deciding between several horses for purchase, breeding or training orientation.",
      category: "tecnico",
    },
    {
      question: "What is the Rider Profile Analysis?",
      answer:
        "The Profile Analysis uses a personalised questionnaire about your experience, goals, budget and preferences to determine your rider profile (Breeder, Competitor, Amateur or Investor) and recommend breeds, disciplines and horse types best suited to your profile.",
      category: "tecnico",
    },
  ],
  es: [
    // === GENERAL ===
    {
      question: "¿Las herramientas son gratuitas?",
      answer:
        "Sí, cada herramienta ofrece 1 uso gratuito para que pueda probar sin compromiso. Para usos ilimitados, exportación de PDF y funciones avanzadas, puede suscribirse al plan PRO por solo 9,99€/mes o 79€/año.",
      category: "geral",
    },
    {
      question: "¿Las herramientas funcionan para caballos de otras razas?",
      answer:
        "Nuestras herramientas fueron diseñadas y optimizadas específicamente para el Caballo Lusitano, con datos, parámetros y referencias ajustados a la raza. Aunque pueden usarse con otras razas ibéricas, los resultados serán más precisos para Lusitanos registrados en la APSL.",
      category: "geral",
    },
    {
      question: "¿Mis datos y resultados quedan guardados?",
      answer:
        "En el plan gratuito, los resultados solo se muestran durante la sesión. En el plan PRO, todo su historial de análisis queda guardado en su cuenta, pudiendo consultarlo, exportarlo en PDF o compartirlo con un enlace directo en cualquier momento.",
      category: "geral",
    },
    {
      question: "¿Mis datos están seguros?",
      answer:
        "Absolutamente. Todos los datos están encriptados en tránsito y en reposo. No compartimos información de sus caballos con terceros. Los datos se utilizan exclusivamente para generar sus informes y, en el plan PRO, para mantener su historial personal.",
      category: "geral",
    },
    // === PRECIOS ===
    {
      question: "¿Puedo cancelar la suscripción PRO en cualquier momento?",
      answer:
        "Sí, puede cancelar su suscripción PRO en cualquier momento, sin compromisos ni cargos adicionales. Continuará teniendo acceso a las funciones PRO hasta el final del período de facturación en curso.",
      category: "precos",
    },
    {
      question: "¿Cuál es la diferencia entre el plan Gratuito y el PRO?",
      answer:
        "El plan Gratuito permite 1 uso por herramienta con resultados básicos. El PRO desbloquea usos ilimitados, resultados detallados con recomendaciones avanzadas, exportación de informes en PDF, historial completo de análisis, compartir con enlace y soporte prioritario.",
      category: "precos",
    },
    {
      question: "¿Existe un plan anual con descuento?",
      answer:
        "Sí. El plan anual cuesta 79€/año (equivalente a 6,58€/mes), lo que representa un ahorro del 34% frente al plan mensual de 9,99€. Ambos planes incluyen exactamente las mismas funcionalidades.",
      category: "precos",
    },
    // === TÉCNICO ===
    {
      question: "¿Cómo funciona la Calculadora de Valor?",
      answer:
        "La Calculadora utiliza un algoritmo con más de 20 variables: linaje (padre, madre, abuelos), morfología, movimientos, capa, nivel de entrenamiento, resultados en competición, certificaciones (radiografías, APSL) y tendencias de mercado por región. El resultado es una estimación fundamentada con intervalo de confianza y recomendaciones para valorización.",
      category: "tecnico",
    },
    {
      question: "¿Cuál es la precisión de los resultados de la Calculadora?",
      answer:
        "La Calculadora proporciona una estimación basada en datos de mercado y las características del caballo. Los valores son indicativos y reflejan tendencias reales del mercado Lusitano. Para transacciones concretas, recomendamos complementar con una evaluación presencial por un profesional certificado.",
      category: "tecnico",
    },
    {
      question: "¿El Verificador de Compatibilidad sustituye la opinión de un veterinario?",
      answer:
        "No. El Verificador es una herramienta de apoyo a la decisión que analiza datos genéticos (linaje, coeficiente de consanguinidad, probabilidades de capa) y morfológicos para sugerir cruzamientos prometedores. Siempre recomendamos consultar a un veterinario especializado en reproducción equina antes de tomar decisiones definitivas.",
      category: "tecnico",
    },
    {
      question: "¿Cómo funciona el Comparador de Caballos?",
      answer:
        "El Comparador permite analizar hasta 4 caballos lado a lado, generando gráficos radar de aptitudes, comparación de fortalezas y debilidades, y una puntuación global por caballo. Es ideal para quienes están decidiendo entre varios caballos para compra, cría u orientación de entrenamiento.",
      category: "tecnico",
    },
    {
      question: "¿Qué es el Análisis de Perfil de Jinete?",
      answer:
        "El Análisis de Perfil utiliza un cuestionario personalizado sobre su experiencia, objetivos, presupuesto y preferencias para determinar su perfil de jinete (Criador, Competidor, Amateur o Inversor) y recomendar razas, disciplinas y tipos de caballo más adecuados a su perfil.",
      category: "tecnico",
    },
  ],
};

export function getFaqItems(language: string) {
  return faqItemsByLang[language as keyof typeof faqItemsByLang] ?? faqItemsByLang.pt;
}

export function getFaqCategories(language: string) {
  const labels: Record<string, Record<string, string>> = {
    pt: { todos: "Todas", geral: "Geral", precos: "Preços", tecnico: "Técnico" },
    en: { todos: "All", geral: "General", precos: "Pricing", tecnico: "Technical" },
    es: { todos: "Todas", geral: "General", precos: "Precios", tecnico: "Técnico" },
  };
  return labels[language] ?? labels.pt;
}

// Backward compatibility
export const faqItems = faqItemsByLang.pt;

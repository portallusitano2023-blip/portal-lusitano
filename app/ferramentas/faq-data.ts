const faqItemsByLang: Record<string, { question: string; answer: string }[]> = {
  pt: [
    {
      question: "As ferramentas são gratuitas?",
      answer:
        "Sim, cada ferramenta oferece 1 utilização gratuita para que possa experimentar sem compromisso. Para utilizações ilimitadas, exportação de PDF e funcionalidades avançadas, pode subscrever o plano PRO por apenas 4,99 euros por mês.",
    },
    {
      question: "Como funciona a Calculadora de Valor?",
      answer:
        "A nossa calculadora utiliza um algoritmo proprietário com mais de 20 variáveis, incluindo linhagem, morfologia, andamentos, treino, resultados em competição e tendências de mercado. O resultado é uma estimativa fundamentada que reflecte o valor real do seu Lusitano no mercado actual.",
    },
    {
      question: "O Verificador de Compatibilidade substitui a opinião de um veterinário?",
      answer:
        "Não. O Verificador de Compatibilidade é uma ferramenta de apoio à decisão que analisa dados genéticos e morfológicos para sugerir cruzamentos promissores. Recomendamos sempre consultar um veterinário especializado em reprodução equina antes de tomar decisões definitivas.",
    },
    {
      question: "Posso cancelar a subscrição PRO a qualquer momento?",
      answer:
        "Sim, pode cancelar a sua subscrição PRO a qualquer momento, sem compromissos ou taxas adicionais. Continuará a ter acesso às funcionalidades PRO até ao final do período de facturação em curso.",
    },
    {
      question: "Os meus dados e resultados ficam guardados?",
      answer:
        "No plano gratuito, os resultados são apresentados apenas durante a sessão. No plano PRO, todo o seu histórico de análises fica guardado na sua conta, podendo consultá-lo, exportá-lo ou partilhá-lo a qualquer momento.",
    },
    {
      question: "As ferramentas funcionam para cavalos de outras raças?",
      answer:
        "As nossas ferramentas foram concebidas e optimizadas especificamente para o Cavalo Lusitano, com dados, parâmetros e referências ajustados à raça. Embora possam ser usadas com outras raças ibéricas, os resultados serão mais precisos para Lusitanos registados na APSL.",
    },
  ],
  en: [
    {
      question: "Are the tools free?",
      answer:
        "Yes, each tool offers 1 free use so you can try without commitment. For unlimited uses, PDF export and advanced features, you can subscribe to the PRO plan for just €4.99 per month.",
    },
    {
      question: "How does the Value Calculator work?",
      answer:
        "Our calculator uses a proprietary algorithm with over 20 variables, including bloodline, morphology, gaits, training, competition results and market trends. The result is a well-founded estimate reflecting the real market value of your Lusitano.",
    },
    {
      question: "Does the Compatibility Checker replace a vet's opinion?",
      answer:
        "No. The Compatibility Checker is a decision support tool that analyses genetic and morphological data to suggest promising crosses. We always recommend consulting a veterinarian specialised in equine reproduction before making definitive decisions.",
    },
    {
      question: "Can I cancel my PRO subscription at any time?",
      answer:
        "Yes, you can cancel your PRO subscription at any time, with no commitments or additional fees. You will continue to have access to PRO features until the end of the current billing period.",
    },
    {
      question: "Are my data and results saved?",
      answer:
        "In the free plan, results are only shown during the session. In the PRO plan, your entire analysis history is saved in your account, and you can consult, export or share it at any time.",
    },
    {
      question: "Do the tools work for other horse breeds?",
      answer:
        "Our tools were designed and optimised specifically for the Lusitano Horse, with data, parameters and references adjusted to the breed. While they may be used with other Iberian breeds, results will be most accurate for Lusitanos registered with the APSL.",
    },
  ],
  es: [
    {
      question: "¿Las herramientas son gratuitas?",
      answer:
        "Sí, cada herramienta ofrece 1 uso gratuito para que pueda probar sin compromiso. Para usos ilimitados, exportación de PDF y funciones avanzadas, puede suscribirse al plan PRO por solo 4,99 euros al mes.",
    },
    {
      question: "¿Cómo funciona la Calculadora de Valor?",
      answer:
        "Nuestra calculadora utiliza un algoritmo propio con más de 20 variables, incluyendo linaje, morfología, movimientos, entrenamiento, resultados en competición y tendencias de mercado. El resultado es una estimación fundamentada que refleja el valor real de su Lusitano en el mercado actual.",
    },
    {
      question: "¿El Verificador de Compatibilidad sustituye la opinión de un veterinario?",
      answer:
        "No. El Verificador de Compatibilidad es una herramienta de apoyo a la decisión que analiza datos genéticos y morfológicos para sugerir cruzamientos prometedores. Siempre recomendamos consultar a un veterinario especializado en reproducción equina antes de tomar decisiones definitivas.",
    },
    {
      question: "¿Puedo cancelar la suscripción PRO en cualquier momento?",
      answer:
        "Sí, puede cancelar su suscripción PRO en cualquier momento, sin compromisos ni cargos adicionales. Continuará teniendo acceso a las funciones PRO hasta el final del período de facturación en curso.",
    },
    {
      question: "¿Mis datos y resultados quedan guardados?",
      answer:
        "En el plan gratuito, los resultados solo se muestran durante la sesión. En el plan PRO, todo su historial de análisis queda guardado en su cuenta, pudiendo consultarlo, exportarlo o compartirlo en cualquier momento.",
    },
    {
      question: "¿Las herramientas funcionan para caballos de otras razas?",
      answer:
        "Nuestras herramientas fueron diseñadas y optimizadas específicamente para el Caballo Lusitano, con datos, parámetros y referencias ajustados a la raza. Aunque pueden usarse con otras razas ibéricas, los resultados serán más precisos para Lusitanos registrados en la APSL.",
    },
  ],
};

export function getFaqItems(language: string) {
  return faqItemsByLang[language as keyof typeof faqItemsByLang] ?? faqItemsByLang.pt;
}

// Backward compatibility
export const faqItems = faqItemsByLang.pt;

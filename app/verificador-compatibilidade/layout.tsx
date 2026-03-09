import type { Metadata } from "next";
import { BreadcrumbSchema, WebApplicationSchema, FAQSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Verificador de Compatibilidade",
  description:
    "Verifique a compatibilidade genética entre garanhão e égua Lusitana. Análise de COI, linhagem, conformação, temperamento e previsão de pelagens para cruzamento.",
  keywords: [
    "compatibilidade genética lusitano",
    "cruzamento cavalo lusitano",
    "verificador reprodução equina",
    "COI consanguinidade lusitano",
    "compatibilidade garanhão égua",
  ],
  alternates: {
    canonical: `${SITE_URL}/verificador-compatibilidade`,
    languages: {
      "pt-PT": `${SITE_URL}/verificador-compatibilidade`,
      "en-US": `${SITE_URL}/en/verificador-compatibilidade`,
      "es-ES": `${SITE_URL}/es/verificador-compatibilidade`,
      "x-default": `${SITE_URL}/verificador-compatibilidade`,
    },
  },
  openGraph: {
    title: "Verificador de Compatibilidade | Portal Lusitano",
    description:
      "Verifique a compatibilidade genética entre garanhão e égua Lusitana. Análise de COI, linhagem, conformação, temperamento e previsão de pelagens para cruzamento.",
    url: `${SITE_URL}/verificador-compatibilidade`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Verificador de Compatibilidade - Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verificador de Compatibilidade | Portal Lusitano",
    description:
      "Verifique a compatibilidade genética entre garanhão e égua Lusitana. Análise de COI, linhagem, conformação, temperamento e previsão de pelagens para cruzamento.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const faqItems = [
    {
      question: "Como saber se um cavalo é compatível comigo?",
      answer:
        "A compatibilidade depende do seu nível equestre, objectivos (competição, lazer, trabalho), experiência, e o temperamento do cavalo. O verificador analisa a combinação garanhão-égua e recomenda perfis de cavaleiro ideais para os descendentes.",
    },
    {
      question: "O que é o verificador de compatibilidade genética?",
      answer:
        "É uma ferramenta que analisa a compatibilidade genética entre um garanhão e uma égua Lusitana. Calcula o Coeficiente de Consanguinidade (COI), riscos hereditários, pelagens esperadas e recomenda perfis de cavaleiro para a descendência.",
    },
    {
      question: "Como é calculado o COI (Coeficiente de Inbreeding)?",
      answer:
        "O COI mede o grau de consanguinidade na linhagem. Um COI elevado indica maior risco de problemas genéticos. O verificador utiliza a genealogia completa e recomenda acasalamentos mais seguros para melhoramento genético.",
    },
    {
      question: "Quais são os riscos de um COI elevado?",
      answer:
        "Um COI elevado (>10%) aumenta o risco de problemas hereditários como fragilidade óssea, imunidade reduzida e defeitos congénitos. Recomendamos preferir acasalamentos com COI mais baixo para garantir descendência mais saudável.",
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          {
            name: "Verificador de Compatibilidade",
            url: `${SITE_URL}/verificador-compatibilidade`,
          },
        ]}
      />
      <WebApplicationSchema
        name="Verificador de Compatibilidade"
        description="Verifique a compatibilidade genética entre garanhão e égua Lusitana. Análise de COI, linhagem, conformação, temperamento e previsão de pelagens para cruzamento."
        url={`${SITE_URL}/verificador-compatibilidade`}
      />
      <FAQSchema items={faqItems} />
      {children}
    </>
  );
}

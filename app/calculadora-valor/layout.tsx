import type { Metadata } from "next";
import { BreadcrumbSchema, WebApplicationSchema, FAQSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Calculadora de Valor",
  description:
    "Calcule o valor estimado de um cavalo Lusitano com base em idade, linhagem, nível de treino, palmarés e conformação. Ferramenta gratuita.",
  keywords: [
    "calculadora valor cavalo",
    "quanto custa cavalo lusitano",
    "preço cavalos portugal",
    "avaliação cavalo lusitano",
    "valor PSL",
  ],
  alternates: {
    canonical: `${SITE_URL}/calculadora-valor`,
    languages: {
      "pt-PT": `${SITE_URL}/calculadora-valor`,
      "en-US": `${SITE_URL}/en/calculadora-valor`,
      "es-ES": `${SITE_URL}/es/calculadora-valor`,
      "x-default": `${SITE_URL}/calculadora-valor`,
    },
  },
  openGraph: {
    title: "Calculadora de Valor | Portal Lusitano",
    description:
      "Calcule o valor estimado de um cavalo Lusitano com base em idade, linhagem, nível de treino, palmarés e conformação. Ferramenta gratuita.",
    url: `${SITE_URL}/calculadora-valor`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Calculadora de Valor - Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Valor | Portal Lusitano",
    description:
      "Calcule o valor estimado de um cavalo Lusitano com base em idade, linhagem, nível de treino, palmarés e conformação. Ferramenta gratuita.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const faqItems = [
    {
      question: "Como é calculado o valor de um cavalo Lusitano?",
      answer:
        "O valor é estimado considerando múltiplos factores: idade, linhagem, nível de treino, palmarés desportivo, conformação, temperamento, saúde documentada e mercado geográfico. A ferramenta analisa mais de 15 critérios de valorização.",
    },
    {
      question: "Que factores influenciam o preço de um cavalo Lusitano?",
      answer:
        "Os principais factores são: genealogia e linhagem (especialmente Veiga ou outras famílias elite), nível de treino (CDI, Dressage, Trabalho), palmarés (competições e prémios), conformação e aprumos, temperamento, saúde, registo APSL, e mercado (Portugal vs. Brasil vs. Resto do Mundo).",
    },
    {
      question: "Posso confiar na estimativa da calculadora?",
      answer:
        "A calculadora fornece um intervalo aproximado baseado em dados de mercado. Para uma avaliação precisa, recomendamos uma análise veterinária completa, teste montado profissional e consulta com especialistas em genealogia Lusitana.",
    },
    {
      question: "Como afecta o registo APSL o valor do cavalo?",
      answer:
        "Um cavalo com registo APSL (Associação Portuguesa de Stud-Book Lusitano) válido tem maior valor de mercado, especialmente se tiver genealogia documentada. Sem registo, o valor é significativamente reduzido.",
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Calculadora de Valor", url: `${SITE_URL}/calculadora-valor` },
        ]}
      />
      <WebApplicationSchema
        name="Calculadora de Valor"
        description="Calcule o valor estimado de um cavalo Lusitano com base em idade, linhagem, nível de treino, palmarés e conformação. Ferramenta gratuita."
        url={`${SITE_URL}/calculadora-valor`}
      />
      <FAQSchema items={faqItems} />
      {children}
    </>
  );
}

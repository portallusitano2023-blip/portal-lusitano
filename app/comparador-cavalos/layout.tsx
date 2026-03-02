import type { Metadata } from "next";
import { BreadcrumbSchema, WebApplicationSchema, FAQSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Comparador de Cavalos",
  description:
    "Compare cavalos Lusitanos lado a lado. Analise linhagem, morfologia, aptidões e preço para encontrar o exemplar ideal.",
  keywords: [
    "comparar cavalos lusitanos",
    "comparador equino",
    "cavalos lado a lado",
    "escolher cavalo lusitano",
  ],
  alternates: {
    canonical: `${SITE_URL}/comparador-cavalos`,
    languages: {
      "pt-PT": `${SITE_URL}/comparador-cavalos`,
      "en-US": `${SITE_URL}/en/comparador-cavalos`,
      "es-ES": `${SITE_URL}/es/comparador-cavalos`,
      "x-default": `${SITE_URL}/comparador-cavalos`,
    },
  },
  openGraph: {
    title: "Comparador de Cavalos | Portal Lusitano",
    description:
      "Compare cavalos Lusitanos lado a lado. Analise linhagem, morfologia, aptidões e preço para encontrar o exemplar ideal.",
    url: `${SITE_URL}/comparador-cavalos`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Comparador de Cavalos - Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comparador de Cavalos | Portal Lusitano",
    description:
      "Compare cavalos Lusitanos lado a lado. Analise linhagem, morfologia, aptidões e preço para encontrar o exemplar ideal.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const faqItems = [
    {
      question: "Como funciona o comparador de cavalos Lusitanos?",
      answer:
        "Preencha os dados de cada cavalo (nome, idade, linhagem, conformação, andamentos, temperamento, etc.). O comparador analisa até 8 dimensões diferentes e gera um score comparativo, ajudando a identificar o melhor candidato.",
    },
    {
      question: "Quais são os critérios mais importantes na comparação?",
      answer:
        "Os critérios variam conforme o objectivo. Para competição: nível de treino e palmarés. Para reprodução: genealogia e BLUP. Para lazer: temperamento e conformação. A ferramenta ajusta os pesos conforme a disciplina selecionada.",
    },
    {
      question: "Posso comparar cavalos de diferentes idades?",
      answer:
        "Sim, a ferramenta compara cavalos de qualquer idade. Tenha em atenção que um cavalo jovem com potencial pode ter um score menor actualmente, mas maior potencial futuro. Recomendamos considerar o potencial de maturação.",
    },
    {
      question: "Como é calculado o score de compatibilidade?",
      answer:
        "O score considera mais de 8 dimensões: conformação, andamentos, temperamento, linhagem, nível de treino, palmarés, saúde e documentação. Cada dimensão tem um peso configurável conforme a disciplina escolhida.",
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Comparador de Cavalos", url: `${SITE_URL}/comparador-cavalos` },
        ]}
      />
      <WebApplicationSchema
        name="Comparador de Cavalos"
        description="Compare cavalos Lusitanos lado a lado. Analise linhagem, morfologia, aptidões e preço para encontrar o exemplar ideal."
        url={`${SITE_URL}/comparador-cavalos`}
      />
      <FAQSchema items={faqItems} />
      {children}
    </>
  );
}

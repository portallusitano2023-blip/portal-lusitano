import type { Metadata } from "next";
import { BreadcrumbSchema, WebApplicationSchema, FAQSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Análise de Perfil Equestre",
  description:
    "Descubra o seu perfil como cavaleiro. Análise completa do seu estilo, experiência e objectivos com cavalos Lusitanos.",
  keywords: [
    "perfil cavaleiro",
    "análise equestre",
    "tipo de cavaleiro",
    "teste equestre online",
    "perfil equitação",
  ],
  alternates: {
    canonical: `${SITE_URL}/analise-perfil`,
    languages: {
      "pt-PT": `${SITE_URL}/analise-perfil`,
      "en-US": `${SITE_URL}/en/analise-perfil`,
      "es-ES": `${SITE_URL}/es/analise-perfil`,
      "x-default": `${SITE_URL}/analise-perfil`,
    },
  },
  openGraph: {
    title: "Análise de Perfil Equestre | Portal Lusitano",
    description:
      "Descubra o seu perfil como cavaleiro. Análise completa do seu estilo, experiência e objectivos com cavalos Lusitanos.",
    url: `${SITE_URL}/analise-perfil`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Análise de Perfil Equestre - Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Análise de Perfil Equestre | Portal Lusitano",
    description:
      "Descubra o seu perfil como cavaleiro. Análise completa do seu estilo, experiência e objectivos com cavalos Lusitanos.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const faqItems = [
    {
      question: "O que é a análise de perfil equestre?",
      answer:
        "É um questionário avançado que identifica o seu perfil como cavaleiro com base em experiência, objectivos, orçamento, disponibilidade e infra-estrutura. Fornece recomendações personalizadas sobre o tipo ideal de cavalo Lusitano para si.",
    },
    {
      question: "Como funciona a análise de perfil?",
      answer:
        "Responda a questões sobre sua experiência, objectivos (competição, lazer, trabalho), nível financeiro, tempo disponível e infra-estruturas. A análise calcula afinidades com 5 perfis principais e fornece recomendações de compra e orçamentação.",
    },
    {
      question: "Quais são os diferentes perfis de cavaleiro?",
      answer:
        "Os perfis principais são: Competidor (alta competição), Criador (programa genético), Amador (lazer seguro), Aprendiz (iniciante) e Tradicional (trabalho clássico). Pode ter características de vários perfis simultaneamente.",
    },
    {
      question: "Como posso usar o resultado da análise?",
      answer:
        "Use o resultado para orientar a compra, definir orçamento mensal, planear formação, e integrar com outras ferramentas (Calculadora de Valor, Comparador, Verificador de Compatibilidade). Inclui checklist de preparação e simulador de custos de 1º ano.",
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Análise de Perfil Equestre", url: `${SITE_URL}/analise-perfil` },
        ]}
      />
      <WebApplicationSchema
        name="Análise de Perfil Equestre"
        description="Descubra o seu perfil como cavaleiro. Análise completa do seu estilo, experiência e objectivos com cavalos Lusitanos."
        url={`${SITE_URL}/analise-perfil`}
      />
      <FAQSchema items={faqItems} />
      {children}
    </>
  );
}

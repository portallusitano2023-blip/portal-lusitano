import type { Metadata } from "next";
import { BreadcrumbSchema, FAQSchema, MedicalWebPageSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Piroplasmose Equina — Guia Completo",
  description:
    "Guia completo sobre piroplasmose equina: prevalência em Portugal, impacto na exportação de cavalos, diagnóstico, tratamento e prevenção. Informação veterinária actualizada.",
  keywords: [
    "piroplasmose equina",
    "babesiose equina",
    "theileria equi",
    "babesia caballi",
    "doença cavalos portugal",
    "carraças cavalos",
    "exportação cavalos",
    "tratamento piroplasmose",
  ],
  alternates: {
    canonical: `${SITE_URL}/piroplasmose`,
    languages: {
      "pt-PT": `${SITE_URL}/piroplasmose`,
      "en-US": `${SITE_URL}/en/piroplasmose`,
      "es-ES": `${SITE_URL}/es/piroplasmose`,
      "x-default": `${SITE_URL}/piroplasmose`,
    },
  },
  openGraph: {
    title: "Piroplasmose Equina — Guia Completo | Portal Lusitano",
    description:
      "Guia completo sobre piroplasmose equina: prevalência em Portugal, impacto na exportação de cavalos, diagnóstico, tratamento e prevenção. Informação veterinária actualizada.",
    url: `${SITE_URL}/piroplasmose`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "article",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Piroplasmose Equina — Guia Completo | Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Piroplasmose Equina — Guia Completo | Portal Lusitano",
    description:
      "Guia completo sobre piroplasmose equina: prevalência em Portugal, impacto na exportação de cavalos, diagnóstico, tratamento e prevenção. Informação veterinária actualizada.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Piroplasmose Equina", url: `${SITE_URL}/piroplasmose` },
        ]}
      />
      <MedicalWebPageSchema />
      <FAQSchema
        items={[
          {
            question: "O que é a piroplasmose equina?",
            answer:
              "A piroplasmose equina é uma doença parasitária transmitida por carraças, causada pelos protozoários Theileria equi e Babesia caballi. Afecta os glóbulos vermelhos do cavalo, podendo causar anemia, febre e fraqueza.",
          },
          {
            question: "Como se diagnostica a piroplasmose em cavalos?",
            answer:
              "O diagnóstico é feito por análises serológicas (ELISA, IFAT) ou testes de PCR que detectam o ADN do parasita. Em Portugal, o diagnóstico é obrigatório para cavalos destinados à exportação para países como os EUA.",
          },
          {
            question: "A piroplasmose tem tratamento?",
            answer:
              "Sim, o tratamento com imidocarb dipropionato é eficaz em reduzir os sintomas, mas raramente elimina completamente o parasita. Cavalos tratados podem continuar portadores, sendo necessário acompanhamento veterinário regular.",
          },
          {
            question: "A piroplasmose impede a exportação de cavalos?",
            answer:
              "Sim. Países como os EUA, Canadá e Austrália exigem que os cavalos importados sejam seronegativos para piroplasmose. Um cavalo seropositivo não pode ser exportado para estes países, o que afecta significativamente o seu valor comercial.",
          },
          {
            question: "Como prevenir a piroplasmose equina em Portugal?",
            answer:
              "A prevenção baseia-se no controlo de carraças com acaricidas aprovados, inspeção regular do cavalo após saídas ao campo, e vacinação quando disponível. Em Portugal, a prevalência é elevada, especialmente no Sul.",
          },
        ]}
      />
      {children}
    </>
  );
}

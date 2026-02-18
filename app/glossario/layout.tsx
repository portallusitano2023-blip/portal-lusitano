import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema, DefinedTermSetSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Glossario Equestre",
  description:
    "Glossario completo de termos equestres em portugues e ingles. Terminologia oficial de dressage, alta escola, anatomia e maneio do cavalo Lusitano.",
  keywords: [
    "glossario equestre",
    "termos equestres portugues",
    "vocabulario dressage",
    "terminologia cavalo lusitano",
    "dicionario equestre",
    "termos alta escola",
    "glossary equestrian portuguese",
  ],
  alternates: {
    canonical: `${siteUrl}/glossario`,
  },
  openGraph: {
    title: "Glossario Equestre | Portal Lusitano",
    description:
      "Glossario completo de termos equestres em portugues e ingles. Terminologia oficial de dressage, alta escola, anatomia e maneio.",
    url: `${siteUrl}/glossario`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Glossario Equestre — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glossario Equestre | Portal Lusitano",
    description: "Glossario completo de termos equestres em portugues e ingles.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Glossario Equestre", url: `${siteUrl}/glossario` },
        ]}
      />
      <CollectionPageSchema
        name="Glossario Equestre — Portal Lusitano"
        description="Glossario completo de termos equestres em portugues e ingles. Terminologia oficial de dressage, alta escola, anatomia e maneio do cavalo Lusitano."
        url={`${siteUrl}/glossario`}
      />
      <DefinedTermSetSchema
        name="Glossário Equestre — Portal Lusitano"
        description="Terminologia oficial de equitação, dressage e maneio do cavalo Lusitano em português e inglês."
        url={`${siteUrl}/glossario`}
        terms={[
          {
            name: "Adestramento",
            alternateName: "Dressage",
            description:
              "Disciplina equestre de treino metódico do cavalo, visando o desenvolvimento harmonioso das suas capacidades naturais.",
          },
          {
            name: "Lusitano",
            alternateName: "PSL",
            description:
              "Raça equestre portuguesa de origem ibérica, reconhecida pela APSL. Distingue-se pela inteligência, agilidade e aptidão para a alta escola.",
          },
          {
            name: "Alta Escola",
            alternateName: "Haute École",
            description:
              "Nível máximo da equitação académica, com exercícios como a levade, a courbette e a croupade.",
          },
          {
            name: "Andamento",
            alternateName: "Gait",
            description:
              "Forma de locomoção do cavalo. Os três andamentos naturais são o passo, o trote e o galope.",
          },
          {
            name: "Garanhão",
            alternateName: "Stallion",
            description:
              "Equino macho inteiro, utilizado na reprodução. Em lusitanos, os garanhões de elite transmitem características da raça PSL.",
          },
          {
            name: "Linhagem",
            alternateName: "Bloodline",
            description:
              "Linha genealógica de um cavalo. As principais linhagens lusitanas são Veiga, Andrade e Alter Real.",
          },
          {
            name: "Coudelaria",
            alternateName: "Stud Farm",
            description:
              "Estabelecimento dedicado à criação e reprodução de cavalos, com instalações para éguas, poldros e garanhões.",
          },
          {
            name: "APSL",
            description:
              "Associação Portuguesa de Criadores do Cavalo Puro Sangue Lusitano. Entidade responsável pelo registo genealógico oficial da raça.",
          },
          {
            name: "Working Equitation",
            description:
              "Modalidade equestre que combina dressage, obstáculos e trabalho de campo, popular entre cavalos lusitanos.",
          },
          {
            name: "Piaffe",
            description:
              "Exercício de alta escola em que o cavalo trota no lugar, com movimentos cadenciados e elevação máxima dos membros.",
          },
        ]}
      />
      {children}
    </>
  );
}

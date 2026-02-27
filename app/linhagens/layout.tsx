import type { Metadata } from "next";
import {
  BreadcrumbSchema,
  CollectionPageSchema,
  EducationalArticleSchema,
} from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Linhagens do Lusitano",
  description:
    "Explore as principais linhagens do cavalo Lusitano. Genealogia, características e legado dos grandes garanhões que definiram a raça PSL.",
  keywords: [
    "linhagens lusitano",
    "genealogia PSL",
    "garanhões lusitanos",
    "linhas sangue cavalos",
    "andrade",
    "veiga",
    "alter real",
    "coudelaria nacional",
  ],
  alternates: {
    canonical: `${SITE_URL}/linhagens`,
  },
  openGraph: {
    title: "Linhagens do Lusitano | Portal Lusitano",
    description:
      "Explore as principais linhagens do cavalo Lusitano. Genealogia, características e legado dos grandes garanhões que definiram a raça PSL.",
    url: `${SITE_URL}/linhagens`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "article",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Linhagens do Lusitano | Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Linhagens do Lusitano | Portal Lusitano",
    description:
      "Explore as principais linhagens do cavalo Lusitano. Genealogia, características e legado dos grandes garanhões que definiram a raça PSL.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Linhagens do Lusitano", url: `${SITE_URL}/linhagens` },
        ]}
      />
      <CollectionPageSchema
        name="Linhagens do Lusitano"
        description="Explore as principais linhagens do cavalo Lusitano. Genealogia, características e legado dos grandes garanhões que definiram a raça PSL."
        url={`${SITE_URL}/linhagens`}
      />
      <EducationalArticleSchema
        name="Linhagens do Cavalo Lusitano"
        description="Guia especializado sobre genealogia e linhagens do cavalo Puro Sangue Lusitano (PSL). Andrade, Veiga, Alter Real e Coudelaria Nacional."
        url={`${SITE_URL}/linhagens`}
        keywords={[
          "linhagens lusitano",
          "genealogia PSL",
          "linha Andrade",
          "linha Veiga",
          "Alter Real",
          "Coudelaria Nacional",
          "garanhões fundadores",
          "pedigree cavalo lusitano",
        ]}
        educationalLevel="Advanced"
      />
      {children}
    </>
  );
}

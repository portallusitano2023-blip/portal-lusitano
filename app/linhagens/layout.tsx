import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

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
    canonical: `${siteUrl}/linhagens`,
  },
  openGraph: {
    title: "Linhagens do Lusitano | Portal Lusitano",
    description:
      "Explore as principais linhagens do cavalo Lusitano. Genealogia, características e legado dos grandes garanhões que definiram a raça PSL.",
    url: `${siteUrl}/linhagens`,
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
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Linhagens do Lusitano", url: `${siteUrl}/linhagens` },
        ]}
      />
      <CollectionPageSchema
        name="Linhagens do Lusitano"
        description="Explore as principais linhagens do cavalo Lusitano. Genealogia, características e legado dos grandes garanhões que definiram a raça PSL."
        url={`${siteUrl}/linhagens`}
      />
      {children}
    </>
  );
}

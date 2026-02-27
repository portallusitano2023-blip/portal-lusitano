import type { Metadata } from "next";
import { BreadcrumbSchema, WebApplicationSchema } from "@/components/JsonLd";
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
      {children}
    </>
  );
}

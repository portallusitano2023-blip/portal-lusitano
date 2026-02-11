import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/JsonLd";

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
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
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
      {children}
    </>
  );
}

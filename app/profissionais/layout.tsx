import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Profissionais Equestres",
  description:
    "Directório de profissionais equestres em Portugal: veterinários, ferradores, treinadores, nutricionistas e dentistas equinos. Contactos verificados.",
  keywords: [
    "veterinário cavalos portugal",
    "ferrador equino",
    "treinador cavalos",
    "profissionais equestres",
    "dentista equino",
  ],
  alternates: {
    canonical: `${siteUrl}/profissionais`,
  },
  openGraph: {
    title: "Profissionais Equestres | Portal Lusitano",
    description:
      "Directório de profissionais equestres em Portugal: veterinários, ferradores, treinadores, nutricionistas e dentistas equinos. Contactos verificados.",
    url: `${siteUrl}/profissionais`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Profissionais Equestres — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Profissionais Equestres | Portal Lusitano",
    description:
      "Directório de profissionais equestres em Portugal: veterinários, ferradores, treinadores, nutricionistas e dentistas equinos. Contactos verificados.",
    images: ["/og-image.jpg"],
  },
};

export default function ProfissionaisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          {
            name: "Profissionais Equestres",
            url: `${siteUrl}/profissionais`,
          },
        ]}
      />
      <CollectionPageSchema
        name="Profissionais Equestres"
        description="Directório de profissionais equestres em Portugal: veterinários, ferradores, treinadores, nutricionistas e dentistas equinos. Contactos verificados."
        url={`${siteUrl}/profissionais`}
      />
      {children}
    </>
  );
}

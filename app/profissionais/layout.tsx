import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

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
    canonical: `${SITE_URL}/profissionais`,
  },
  openGraph: {
    title: "Profissionais Equestres | Portal Lusitano",
    description:
      "Directório de profissionais equestres em Portugal: veterinários, ferradores, treinadores, nutricionistas e dentistas equinos. Contactos verificados.",
    url: `${SITE_URL}/profissionais`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
  },
};

export default function ProfissionaisLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          {
            name: "Profissionais Equestres",
            url: `${SITE_URL}/profissionais`,
          },
        ]}
      />
      <CollectionPageSchema
        name="Profissionais Equestres"
        description="Directório de profissionais equestres em Portugal: veterinários, ferradores, treinadores, nutricionistas e dentistas equinos. Contactos verificados."
        url={`${SITE_URL}/profissionais`}
      />
      {children}
    </>
  );
}

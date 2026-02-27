import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

// ISR: Revalidate events every hour
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Eventos Equestres",
  description:
    "Calendário de eventos equestres em Portugal: feiras, concursos, leilões, exposições e workshops. Agenda completa e actualizada.",
  keywords: [
    "eventos equestres portugal",
    "feiras cavalos",
    "concursos hipicos",
    "leilões cavalos portugal",
    "agenda equestre",
  ],
  alternates: {
    canonical: `${SITE_URL}/eventos`,
  },
  openGraph: {
    title: "Eventos Equestres | Portal Lusitano",
    description:
      "Calendário de eventos equestres em Portugal: feiras, concursos, leilões, exposições e workshops. Agenda completa e actualizada.",
    url: `${SITE_URL}/eventos`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Eventos Equestres — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventos Equestres | Portal Lusitano",
    description:
      "Calendário de eventos equestres em Portugal: feiras, concursos, leilões, exposições e workshops. Agenda completa e actualizada.",
    images: ["/opengraph-image"],
  },
};

export default function EventosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Eventos Equestres", url: `${SITE_URL}/eventos` },
        ]}
      />
      <CollectionPageSchema
        name="Eventos Equestres"
        description="Calendário de eventos equestres em Portugal: feiras, concursos, leilões, exposições e workshops. Agenda completa e actualizada."
        url={`${SITE_URL}/eventos`}
      />
      {children}
    </>
  );
}

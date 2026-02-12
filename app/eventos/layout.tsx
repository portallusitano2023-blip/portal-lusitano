import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/JsonLd";

// ISR: Revalidate events every hour
export const revalidate = 3600;

const siteUrl = "https://portal-lusitano.pt";

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
    canonical: `${siteUrl}/eventos`,
  },
  openGraph: {
    title: "Eventos Equestres | Portal Lusitano",
    description:
      "Calendário de eventos equestres em Portugal: feiras, concursos, leilões, exposições e workshops. Agenda completa e actualizada.",
    url: `${siteUrl}/eventos`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
  },
};

export default function EventosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Eventos Equestres", url: `${siteUrl}/eventos` },
        ]}
      />
      <CollectionPageSchema
        name="Eventos Equestres"
        description="Calendário de eventos equestres em Portugal: feiras, concursos, leilões, exposições e workshops. Agenda completa e actualizada."
        url={`${siteUrl}/eventos`}
      />
      {children}
    </>
  );
}

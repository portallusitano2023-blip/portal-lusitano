import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Publicidade",
  description:
    "Anuncie no Portal Lusitano e alcance milhares de entusiastas do cavalo Lusitano. Pacotes de publicidade para coudelarias, marcas equestres e profissionais.",
  keywords: [
    "publicidade equestre",
    "anunciar cavalos",
    "marketing equestre portugal",
    "publicidade coudelarias",
    "anúncios cavalos lusitanos",
  ],
  alternates: {
    canonical: `${SITE_URL}/publicidade`,
  },
  openGraph: {
    title: "Publicidade | Portal Lusitano",
    description: "Anuncie no Portal Lusitano e alcance milhares de entusiastas do cavalo Lusitano.",
    url: `${SITE_URL}/publicidade`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Publicidade — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Publicidade | Portal Lusitano",
    description: "Anuncie no Portal Lusitano e alcance milhares de entusiastas do cavalo Lusitano.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Publicidade", url: `${SITE_URL}/publicidade` },
        ]}
      />
      {children}
    </>
  );
}

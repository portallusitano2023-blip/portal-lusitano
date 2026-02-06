import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

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
    canonical: `${siteUrl}/publicidade`,
  },
  openGraph: {
    title: "Publicidade | Portal Lusitano",
    description:
      "Anuncie no Portal Lusitano e alcance milhares de entusiastas do cavalo Lusitano.",
    url: `${siteUrl}/publicidade`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Publicidade — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Publicidade | Portal Lusitano",
    description:
      "Anuncie no Portal Lusitano e alcance milhares de entusiastas do cavalo Lusitano.",
    images: ["/og-image.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Publicidade", url: `${siteUrl}/publicidade` },
        ]}
      />
      {children}
    </>
  );
}

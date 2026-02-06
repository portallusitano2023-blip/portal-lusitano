import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Marketplace Equestre",
  description:
    "Marketplace de cavalos Lusitanos com filtros avançados. Pesquise por linhagem, disciplina, idade, preço e região em todo o território português.",
  keywords: [
    "marketplace cavalos",
    "comprar cavalos online",
    "mercado equestre portugal",
    "cavalos lusitanos marketplace",
  ],
  alternates: {
    canonical: `${siteUrl}/marketplace`,
  },
  openGraph: {
    title: "Marketplace Equestre | Portal Lusitano",
    description:
      "Marketplace de cavalos Lusitanos com filtros avançados. Pesquise por linhagem, disciplina, idade, preço e região em todo o território português.",
    url: `${siteUrl}/marketplace`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Marketplace Equestre — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketplace Equestre | Portal Lusitano",
    description:
      "Marketplace de cavalos Lusitanos com filtros avançados. Pesquise por linhagem, disciplina, idade, preço e região em todo o território português.",
    images: ["/og-image.jpg"],
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Marketplace Equestre", url: `${siteUrl}/marketplace` },
        ]}
      />
      <CollectionPageSchema
        name="Marketplace Equestre"
        description="Marketplace de cavalos Lusitanos com filtros avançados. Pesquise por linhagem, disciplina, idade, preço e região em todo o território português."
        url={`${siteUrl}/marketplace`}
      />
      {children}
    </>
  );
}

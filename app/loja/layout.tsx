import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Loja Equestre",
  description:
    "Loja online do Portal Lusitano. Produtos equestres premium, artigos de equitação, merchandising e acessórios para cavaleiros.",
  keywords: [
    "loja equestre online",
    "produtos cavalos",
    "artigos equitação portugal",
    "merchandising equestre",
    "acessórios cavaleiro",
  ],
  alternates: {
    canonical: `${siteUrl}/loja`,
  },
  openGraph: {
    title: "Loja Equestre | Portal Lusitano",
    description:
      "Loja online do Portal Lusitano. Produtos equestres premium, artigos de equitação, merchandising e acessórios para cavaleiros.",
    url: `${siteUrl}/loja`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Loja Equestre — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loja Equestre | Portal Lusitano",
    description:
      "Loja online do Portal Lusitano. Produtos equestres premium, artigos de equitação, merchandising e acessórios para cavaleiros.",
    images: ["/opengraph-image"],
  },
};

export default function LojaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Shopify preconnect — only needed for loja pages */}
      <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Loja Equestre", url: `${siteUrl}/loja` },
        ]}
      />
      <CollectionPageSchema
        name="Loja Equestre"
        description="Loja online do Portal Lusitano. Produtos equestres premium, artigos de equitação, merchandising e acessórios para cavaleiros."
        url={`${siteUrl}/loja`}
      />
      {children}
    </>
  );
}

import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Vender",
  description:
    "Publique o seu anúncio de venda de cavalo Lusitano. Plataforma segura com alcance nacional e suporte dedicado.",
  keywords: ["vender cavalo", "publicar anúncio cavalo", "venda equinos portugal"],
  alternates: {
    canonical: `${siteUrl}/vender`,
  },
  openGraph: {
    title: "Vender | Portal Lusitano",
    description:
      "Publique o seu anúncio de venda de cavalo Lusitano. Plataforma segura com alcance nacional e suporte dedicado.",
    url: `${siteUrl}/vender`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Vender — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vender | Portal Lusitano",
    description:
      "Publique o seu anúncio de venda de cavalo Lusitano. Plataforma segura com alcance nacional e suporte dedicado.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Vender", url: `${siteUrl}/vender` },
        ]}
      />
      {children}
    </>
  );
}

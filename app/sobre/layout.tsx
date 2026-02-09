import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description:
    "O Portal Lusitano é a plataforma mais completa dedicada ao Cavalo Lusitano. Conheça a nossa missão, valores e a equipa por trás do projecto.",
  keywords: [
    "portal lusitano",
    "sobre nós",
    "cavalo lusitano plataforma",
    "missão portal lusitano",
    "equipa portal lusitano",
  ],
  alternates: {
    canonical: `${siteUrl}/sobre`,
  },
  openGraph: {
    title: "Sobre Nós | Portal Lusitano",
    description: "O Portal Lusitano é a plataforma mais completa dedicada ao Cavalo Lusitano.",
    url: `${siteUrl}/sobre`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sobre — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre Nós | Portal Lusitano",
    description: "O Portal Lusitano é a plataforma mais completa dedicada ao Cavalo Lusitano.",
    images: ["/og-image.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Sobre Nós", url: `${siteUrl}/sobre` },
        ]}
      />
      {children}
    </>
  );
}

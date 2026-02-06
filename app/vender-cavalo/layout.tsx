import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Vender Cavalo",
  description:
    "Venda o seu cavalo Lusitano no Portal Lusitano. Alcance milhares de compradores qualificados com anúncio premium e fotografia profissional.",
  keywords: [
    "vender cavalo lusitano",
    "anunciar cavalo",
    "venda cavalos portugal",
    "marketplace cavalos",
  ],
  alternates: {
    canonical: `${siteUrl}/vender-cavalo`,
  },
  openGraph: {
    title: "Vender Cavalo | Portal Lusitano",
    description:
      "Venda o seu cavalo Lusitano no Portal Lusitano. Alcance milhares de compradores qualificados com anúncio premium e fotografia profissional.",
    url: `${siteUrl}/vender-cavalo`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vender Cavalo — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vender Cavalo | Portal Lusitano",
    description:
      "Venda o seu cavalo Lusitano no Portal Lusitano. Alcance milhares de compradores qualificados com anúncio premium e fotografia profissional.",
    images: ["/og-image.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Vender Cavalo", url: `${siteUrl}/vender-cavalo` },
        ]}
      />
      {children}
    </>
  );
}

import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

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
    canonical: `${SITE_URL}/vender-cavalo`,
  },
  openGraph: {
    title: "Vender Cavalo | Portal Lusitano",
    description:
      "Venda o seu cavalo Lusitano no Portal Lusitano. Alcance milhares de compradores qualificados com anúncio premium e fotografia profissional.",
    url: `${SITE_URL}/vender-cavalo`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Vender Cavalo", url: `${SITE_URL}/vender-cavalo` },
        ]}
      />
      {children}
    </>
  );
}

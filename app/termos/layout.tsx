import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Termos e Condições",
  description:
    "Termos e condições de utilização do Portal Lusitano. Regras do marketplace, política de privacidade e direitos do utilizador.",
  keywords: [
    "termos condições portal lusitano",
    "regras marketplace cavalos",
  ],
  alternates: {
    canonical: `${siteUrl}/termos`,
  },
  openGraph: {
    title: "Termos e Condições | Portal Lusitano",
    description:
      "Termos e condições de utilização do Portal Lusitano. Regras do marketplace, política de privacidade e direitos do utilizador.",
    url: `${siteUrl}/termos`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Termos e Condições — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Termos e Condições | Portal Lusitano",
    description:
      "Termos e condições de utilização do Portal Lusitano. Regras do marketplace, política de privacidade e direitos do utilizador.",
    images: ["/og-image.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Termos e Condições", url: `${siteUrl}/termos` },
        ]}
      />
      {children}
    </>
  );
}

import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de privacidade do Portal Lusitano. Como protegemos os seus dados pessoais e informação de navegação.",
  keywords: [
    "privacidade portal lusitano",
    "protecção dados",
    "RGPD cavalos",
  ],
  alternates: {
    canonical: `${siteUrl}/privacidade`,
  },
  openGraph: {
    title: "Política de Privacidade | Portal Lusitano",
    description:
      "Política de privacidade do Portal Lusitano. Como protegemos os seus dados pessoais e informação de navegação.",
    url: `${siteUrl}/privacidade`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Política de Privacidade — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Política de Privacidade | Portal Lusitano",
    description:
      "Política de privacidade do Portal Lusitano. Como protegemos os seus dados pessoais e informação de navegação.",
    images: ["/og-image.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Política de Privacidade", url: `${siteUrl}/privacidade` },
        ]}
      />
      {children}
    </>
  );
}

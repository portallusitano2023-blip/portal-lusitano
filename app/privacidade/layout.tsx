import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

// Static content — revalidate once per day
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Política de privacidade do Portal Lusitano. Como protegemos os seus dados pessoais e informação de navegação.",
  keywords: ["privacidade portal lusitano", "protecção dados", "RGPD cavalos"],
  alternates: {
    canonical: `${SITE_URL}/privacidade`,
  },
  openGraph: {
    title: "Política de Privacidade | Portal Lusitano",
    description:
      "Política de privacidade do Portal Lusitano. Como protegemos os seus dados pessoais e informação de navegação.",
    url: `${SITE_URL}/privacidade`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Política de Privacidade", url: `${SITE_URL}/privacidade` },
        ]}
      />
      {children}
    </>
  );
}

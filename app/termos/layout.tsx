import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

// Static content — revalidate once per day
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Termos e Condições",
  description:
    "Termos e condições de utilização do Portal Lusitano. Regras do marketplace, política de privacidade e direitos do utilizador.",
  keywords: ["termos condições portal lusitano", "regras marketplace cavalos"],
  alternates: {
    canonical: `${SITE_URL}/termos`,
  },
  openGraph: {
    title: "Termos e Condições | Portal Lusitano",
    description:
      "Termos e condições de utilização do Portal Lusitano. Regras do marketplace, política de privacidade e direitos do utilizador.",
    url: `${SITE_URL}/termos`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Termos e Condições", url: `${SITE_URL}/termos` },
        ]}
      />
      {children}
    </>
  );
}

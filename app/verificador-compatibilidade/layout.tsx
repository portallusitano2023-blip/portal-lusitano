import type { Metadata } from "next";
import { BreadcrumbSchema, WebApplicationSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Verificador de Compatibilidade",
  description:
    "Verifique a compatibilidade entre cavaleiro e cavalo Lusitano. Análise personalizada de nível, objectivos e perfil equestre.",
  keywords: [
    "compatibilidade cavaleiro cavalo",
    "verificador equestre",
    "cavalo ideal para mim",
    "perfil cavaleiro lusitano",
  ],
  alternates: {
    canonical: `${SITE_URL}/verificador-compatibilidade`,
  },
  openGraph: {
    title: "Verificador de Compatibilidade | Portal Lusitano",
    description:
      "Verifique a compatibilidade entre cavaleiro e cavalo Lusitano. Análise personalizada de nível, objectivos e perfil equestre.",
    url: `${SITE_URL}/verificador-compatibilidade`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Verificador de Compatibilidade - Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Verificador de Compatibilidade | Portal Lusitano",
    description:
      "Verifique a compatibilidade entre cavaleiro e cavalo Lusitano. Análise personalizada de nível, objectivos e perfil equestre.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          {
            name: "Verificador de Compatibilidade",
            url: `${SITE_URL}/verificador-compatibilidade`,
          },
        ]}
      />
      <WebApplicationSchema
        name="Verificador de Compatibilidade"
        description="Verifique a compatibilidade entre cavaleiro e cavalo Lusitano. Análise personalizada de nível, objectivos e perfil equestre."
        url={`${SITE_URL}/verificador-compatibilidade`}
      />
      {children}
    </>
  );
}

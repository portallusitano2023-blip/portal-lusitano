import type { Metadata } from "next";
import { BreadcrumbSchema, WebApplicationSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Análise de Perfil Equestre",
  description:
    "Descubra o seu perfil como cavaleiro. Análise completa do seu estilo, experiência e objectivos com cavalos Lusitanos.",
  keywords: [
    "perfil cavaleiro",
    "análise equestre",
    "tipo de cavaleiro",
    "teste equestre online",
    "perfil equitação",
  ],
  alternates: {
    canonical: `${SITE_URL}/analise-perfil`,
  },
  openGraph: {
    title: "Análise de Perfil Equestre | Portal Lusitano",
    description:
      "Descubra o seu perfil como cavaleiro. Análise completa do seu estilo, experiência e objectivos com cavalos Lusitanos.",
    url: `${SITE_URL}/analise-perfil`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Análise de Perfil Equestre - Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Análise de Perfil Equestre | Portal Lusitano",
    description:
      "Descubra o seu perfil como cavaleiro. Análise completa do seu estilo, experiência e objectivos com cavalos Lusitanos.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Análise de Perfil Equestre", url: `${SITE_URL}/analise-perfil` },
        ]}
      />
      <WebApplicationSchema
        name="Análise de Perfil Equestre"
        description="Descubra o seu perfil como cavaleiro. Análise completa do seu estilo, experiência e objectivos com cavalos Lusitanos."
        url={`${SITE_URL}/analise-perfil`}
      />
      {children}
    </>
  );
}

import type { Metadata } from "next";
import { BreadcrumbSchema, WebApplicationSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

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
    canonical: `${siteUrl}/analise-perfil`,
  },
  openGraph: {
    title: "Análise de Perfil Equestre | Portal Lusitano",
    description:
      "Descubra o seu perfil como cavaleiro. Análise completa do seu estilo, experiência e objectivos com cavalos Lusitanos.",
    url: `${siteUrl}/analise-perfil`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Análise de Perfil Equestre", url: `${siteUrl}/analise-perfil` },
        ]}
      />
      <WebApplicationSchema
        name="Análise de Perfil Equestre"
        description="Descubra o seu perfil como cavaleiro. Análise completa do seu estilo, experiência e objectivos com cavalos Lusitanos."
        url={`${siteUrl}/analise-perfil`}
      />
      {children}
    </>
  );
}

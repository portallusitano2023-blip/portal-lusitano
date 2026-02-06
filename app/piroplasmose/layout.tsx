import type { Metadata } from "next";
import { BreadcrumbSchema, MedicalWebPageSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Piroplasmose Equina — Guia Completo",
  description:
    "Guia completo sobre piroplasmose equina: prevalência em Portugal, impacto na exportação de cavalos, diagnóstico, tratamento e prevenção. Informação veterinária actualizada.",
  keywords: [
    "piroplasmose equina",
    "babesiose equina",
    "theileria equi",
    "babesia caballi",
    "doença cavalos portugal",
    "carraças cavalos",
    "exportação cavalos",
    "tratamento piroplasmose",
  ],
  alternates: {
    canonical: `${siteUrl}/piroplasmose`,
  },
  openGraph: {
    title: "Piroplasmose Equina — Guia Completo | Portal Lusitano",
    description:
      "Guia completo sobre piroplasmose equina: prevalência em Portugal, impacto na exportação de cavalos, diagnóstico, tratamento e prevenção. Informação veterinária actualizada.",
    url: `${siteUrl}/piroplasmose`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "article",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Piroplasmose Equina — Guia Completo | Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Piroplasmose Equina — Guia Completo | Portal Lusitano",
    description:
      "Guia completo sobre piroplasmose equina: prevalência em Portugal, impacto na exportação de cavalos, diagnóstico, tratamento e prevenção. Informação veterinária actualizada.",
    images: ["/og-image.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Piroplasmose Equina", url: `${siteUrl}/piroplasmose` },
        ]}
      />
      <MedicalWebPageSchema />
      {children}
    </>
  );
}

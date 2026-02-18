import type { Metadata } from "next";
import { BreadcrumbSchema, WebApplicationSchema, FAQSchema } from "@/components/JsonLd";
import { faqItems } from "./faq-data";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Ferramentas Equestres",
  description:
    "Ferramentas gratuitas para o mundo equestre: calculadora de valor, comparador de cavalos, verificador de compatibilidade e análise de perfil. Optimizadas para cavalos Lusitanos.",
  keywords: [
    "ferramentas cavalos lusitanos",
    "calculadora valor cavalo",
    "comparador cavalos",
    "compatibilidade equina",
    "análise perfil equestre",
    "ferramentas equestres gratuitas",
  ],
  alternates: {
    canonical: `${siteUrl}/ferramentas`,
  },
  openGraph: {
    title: "Ferramentas Equestres | Portal Lusitano",
    description:
      "Ferramentas gratuitas para cavaleiros: calculadora de valor, comparador, compatibilidade e análise de perfil.",
    url: `${siteUrl}/ferramentas`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Ferramentas Equestres — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ferramentas Equestres | Portal Lusitano",
    description:
      "Ferramentas gratuitas para cavaleiros: calculadora de valor, comparador e análise de perfil.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Ferramentas Equestres", url: `${siteUrl}/ferramentas` },
        ]}
      />
      <WebApplicationSchema
        name="Ferramentas Equestres — Portal Lusitano"
        description="Suite de ferramentas gratuitas para proprietários, criadores e apaixonados pelo Cavalo Lusitano: calculadora de valor, comparador, compatibilidade genética e análise de perfil."
        url={`${siteUrl}/ferramentas`}
      />
      <FAQSchema items={faqItems} />
      {children}
    </>
  );
}

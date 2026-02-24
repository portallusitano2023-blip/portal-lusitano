import type { Metadata } from "next";
import { BreadcrumbSchema, FAQSchema } from "@/components/JsonLd";
import { faqData } from "@/data/faqData";

// Static content — revalidate once per day
export const revalidate = 86400;

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description:
    "Respostas às perguntas mais frequentes sobre cavalos Lusitanos: compra, venda, criação, saúde, documentação e transporte. Tudo o que precisa de saber.",
  keywords: [
    "perguntas cavalos lusitanos",
    "FAQ lusitano",
    "dúvidas comprar cavalo",
    "documentação cavalo portugal",
    "transporte cavalos",
    "comprar cavalo lusitano FAQ",
  ],
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: "Perguntas Frequentes | Portal Lusitano",
    description:
      "Respostas às perguntas mais frequentes sobre cavalos Lusitanos: compra, venda, criação, saúde e documentação.",
    url: `${siteUrl}/faq`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Perguntas Frequentes — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perguntas Frequentes | Portal Lusitano",
    description: "Respostas às perguntas mais frequentes sobre cavalos Lusitanos.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Perguntas Frequentes", url: `${siteUrl}/faq` },
        ]}
      />
      <FAQSchema items={faqData.pt} />
      {children}
    </>
  );
}

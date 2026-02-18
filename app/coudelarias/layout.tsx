import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Coudelarias",
  description:
    "Conheça as melhores coudelarias de cavalos Lusitanos em Portugal. Criadores de excelência, tradição e linhagens puras.",
  keywords: [
    "coudelarias portugal",
    "criadores lusitanos",
    "melhores coudelarias PSL",
    "coudelarias cavalos portugueses",
  ],
  alternates: {
    canonical: `${siteUrl}/coudelarias`,
  },
  openGraph: {
    title: "Coudelarias | Portal Lusitano",
    description:
      "Conheça as melhores coudelarias de cavalos Lusitanos em Portugal. Criadores de excelência, tradição e linhagens puras.",
    url: `${siteUrl}/coudelarias`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Coudelarias — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coudelarias | Portal Lusitano",
    description:
      "Conheça as melhores coudelarias de cavalos Lusitanos em Portugal. Criadores de excelência, tradição e linhagens puras.",
    images: ["/opengraph-image"],
  },
};

export default function CoudelariasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Coudelarias", url: `${siteUrl}/coudelarias` },
        ]}
      />
      <CollectionPageSchema
        name="Coudelarias"
        description="Conheça as melhores coudelarias de cavalos Lusitanos em Portugal. Criadores de excelência, tradição e linhagens puras."
        url={`${siteUrl}/coudelarias`}
      />
      {children}
    </>
  );
}

import type { Metadata } from "next";
import { BreadcrumbSchema, BookSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Ebook Grátis",
  description:
    "Descarregue gratuitamente o nosso ebook sobre o cavalo Lusitano. Guia completo com história, linhagens, cuidados e dicas para compradores.",
  keywords: [
    "ebook cavalo lusitano",
    "guia lusitano grátis",
    "livro cavalos portugueses",
    "ebook equestre gratuito",
    "guia comprar cavalo lusitano",
    "livro PSL grátis",
  ],
  alternates: {
    canonical: `${siteUrl}/ebook-gratis`,
  },
  openGraph: {
    title: "Ebook Grátis | Portal Lusitano",
    description:
      "Descarregue gratuitamente o nosso guia completo sobre o cavalo Lusitano.",
    url: `${siteUrl}/ebook-gratis`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ebook Grátis — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ebook Grátis | Portal Lusitano",
    description:
      "Descarregue gratuitamente o nosso guia completo sobre o cavalo Lusitano.",
    images: ["/og-image.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Ebook Grátis", url: `${siteUrl}/ebook-gratis` },
        ]}
      />
      <BookSchema />
      {children}
    </>
  );
}

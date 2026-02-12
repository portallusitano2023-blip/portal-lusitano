import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/JsonLd";

// ISR: Revalidate journal daily
export const revalidate = 86400;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Jornal Lusitano | Portal Lusitano",
  description:
    "Jornal do Portal Lusitano — artigos, crónicas e investigação aprofundada sobre história, criação, treino e saúde do cavalo Lusitano. Jornalismo equestre de qualidade.",
  keywords: [
    "jornal cavalos",
    "artigos lusitanos",
    "jornalismo equestre",
    "notícias cavalos portugal",
    "história lusitano",
    "crónicas equestres",
    "cavalo lusitano",
  ],
  alternates: {
    canonical: `${siteUrl}/jornal`,
  },
  openGraph: {
    title: "Jornal Lusitano | Portal Lusitano",
    description:
      "Jornal do Portal Lusitano — artigos, crónicas e investigação aprofundada sobre história, criação, treino e saúde do cavalo Lusitano.",
    url: `${siteUrl}/jornal`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jornal Lusitano — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jornal Lusitano | Portal Lusitano",
    description:
      "Jornal do Portal Lusitano — artigos, crónicas e investigação aprofundada sobre história, criação, treino e saúde do cavalo Lusitano.",
    images: ["/og-image.jpg"],
  },
};

export default function JornalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Jornal Lusitano", url: `${siteUrl}/jornal` },
        ]}
      />
      <CollectionPageSchema
        name="Jornal Lusitano"
        description="Jornal do Portal Lusitano — artigos, crónicas e investigação aprofundada sobre história, criação, treino e saúde do cavalo Lusitano."
        url={`${siteUrl}/jornal`}
      />
      {children}
    </>
  );
}

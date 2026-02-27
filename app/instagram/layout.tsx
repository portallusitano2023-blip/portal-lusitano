import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Instagram",
  description:
    "Siga o Portal Lusitano no Instagram. Fotografias e vídeos dos mais belos cavalos Lusitanos, eventos equestres e conteúdo exclusivo.",
  keywords: [
    "portal lusitano instagram",
    "cavalos lusitanos instagram",
    "fotos cavalos",
    "conteúdo equestre",
  ],
  alternates: {
    canonical: `${SITE_URL}/instagram`,
  },
  openGraph: {
    title: "Instagram | Portal Lusitano",
    description:
      "Siga o Portal Lusitano no Instagram. Fotografias e vídeos dos mais belos cavalos Lusitanos, eventos equestres e conteúdo exclusivo.",
    url: `${SITE_URL}/instagram`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Instagram — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram | Portal Lusitano",
    description:
      "Siga o Portal Lusitano no Instagram. Fotografias e vídeos dos mais belos cavalos Lusitanos, eventos equestres e conteúdo exclusivo.",
    images: ["/opengraph-image"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: SITE_URL },
          { name: "Instagram", url: `${SITE_URL}/instagram` },
        ]}
      />
      {children}
    </>
  );
}

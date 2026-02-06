import type { Metadata } from "next";
import { BreadcrumbSchema, CollectionPageSchema } from "@/components/JsonLd";

const siteUrl = "https://portal-lusitano.pt";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Blog do Portal Lusitano. Artigos, novidades e conteúdo exclusivo sobre o mundo do cavalo Lusitano e a equitação em Portugal.",
  keywords: [
    "blog cavalos lusitanos",
    "artigos equestres",
    "novidades lusitano",
    "blog equitação portugal",
  ],
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "Blog | Portal Lusitano",
    description:
      "Blog do Portal Lusitano. Artigos, novidades e conteúdo exclusivo sobre o mundo do cavalo Lusitano e a equitação em Portugal.",
    url: `${siteUrl}/blog`,
    siteName: "Portal Lusitano",
    locale: "pt_PT",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Blog — Portal Lusitano",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Portal Lusitano",
    description:
      "Blog do Portal Lusitano. Artigos, novidades e conteúdo exclusivo sobre o mundo do cavalo Lusitano e a equitação em Portugal.",
    images: ["/og-image.jpg"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Blog", url: `${siteUrl}/blog` },
        ]}
      />
      <CollectionPageSchema
        name="Blog"
        description="Blog do Portal Lusitano. Artigos, novidades e conteúdo exclusivo sobre o mundo do cavalo Lusitano e a equitação em Portugal."
        url={`${siteUrl}/blog`}
      />
      {children}
    </>
  );
}

import { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  keywords?: string[];
}

export function generateMetadata({
  title,
  description,
  image = "/images/og-image.jpg",
  url = "https://portal-lusitano.pt",
  type = "website",
  publishedTime,
  author,
  keywords = [],
}: SEOProps): Metadata {
  const siteName = "Portal Lusitano";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      "cavalo lusitano",
      "cavalos portugueses",
      "equitação",
      "coudelarias",
      "cavalo puro sangue lusitano",
      ...keywords,
    ],
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "pt_PT",
      type,
      publishedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: url,
    },
  };
}

export const defaultSEO: SEOProps = {
  title: "Portal Lusitano - O Mundo do Cavalo Lusitano",
  description:
    "Descubra o fascinante mundo do Cavalo Lusitano. Coudelarias, eventos, história e muito mais sobre a raça mais nobre de Portugal.",
  url: "https://portal-lusitano.pt",
  type: "website",
  keywords: [
    "cavalos lusitanos",
    "coudelarias portugal",
    "PSL",
    "equitação portuguesa",
    "cavalos de alta escola",
  ],
};

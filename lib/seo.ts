/**
 * SEO Helper — Gera metadata consistente para todas as páginas
 *
 * Uso:
 *   import { generatePageMetadata } from "@/lib/seo";
 *   export const metadata = generatePageMetadata({ title: "...", description: "...", path: "/..." });
 *
 * Para páginas dinâmicas:
 *   export async function generateMetadata({ params }) {
 *     return generatePageMetadata({ ... });
 *   }
 */

import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

interface PageSEO {
  /** Page title (without suffix — template adds " | Portal Lusitano") */
  title: string;
  /** Meta description — 150-160 chars ideal */
  description: string;
  /** URL path, e.g. "/comprar" or "/jornal/meu-artigo" */
  path: string;
  /** Absolute URL or path to OG image */
  image?: string;
  /** OpenGraph type */
  type?: "website" | "article";
  /** Set true to noindex (e.g. auth pages, success pages) */
  noIndex?: boolean;
  /** Article-specific: date published (ISO string) */
  publishedTime?: string;
  /** Article-specific: date modified (ISO string) */
  modifiedTime?: string;
  /** Keywords array */
  keywords?: string[];
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  keywords,
}: PageSEO): Metadata {
  const url = `${siteUrl}${path}`;
  const cleanPath = path === "/" ? "" : path;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: url,
      languages: {
        "pt-PT": `${siteUrl}${path}`,
        "en-US": `${siteUrl}/en${cleanPath}`,
        "es-ES": `${siteUrl}/es${cleanPath}`,
        "x-default": `${siteUrl}${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type,
      locale: "pt_PT",
      alternateLocale: ["en_GB", "es_ES"],
      siteName: "Portal Lusitano",
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export { siteUrl };

import type { Metadata } from "next";
import { fetchArticlesList } from "@/lib/sanity-queries";
import { articlesListPT, articlesListEN, articlesListES } from "@/data/articlesList";
import { legacyIdToSlug } from "@/lib/journal-utils";
import { findLocalCover } from "@/lib/journal-server-utils";
import { ItemListSchema } from "@/components/JsonLd";
import JornalListClient from "./JornalListClient";
import { generatePageMetadata } from "@/lib/seo";

// ISR: Revalidar jornal diariamente (novos artigos via Sanity)
export const revalidate = 86400;

export const metadata: Metadata = generatePageMetadata({
  title: "Jornal Lusitano — Artigos & Crónicas Equestres",
  description:
    "Artigos, crónicas e reportagens sobre o cavalo Lusitano. História, genética, biomecânica, treino de dressage e actualidades do mundo equestre em Portugal.",
  path: "/jornal",
  keywords: [
    "artigos cavalos lusitanos",
    "notícias equestres portugal",
    "crónicas lusitano",
    "genética cavalo lusitano",
    "treino dressage artigos",
    "jornal equestre",
  ],
});

/**
 * Converter dados locais para formato compatível com Sanity.
 * Usa as datas reais dos artigos em vez de datas artificialmente geradas.
 */
function localToSanityFormat(articles: typeof articlesListPT) {
  return articles.map((a, i) => {
    const slug = legacyIdToSlug[a.id] || a.id;
    const localCover = findLocalCover(slug);

    // Converter a data formatada (ex: "25 JAN 2026") para ISO — usa a data real do artigo
    const parseLocalDate = (dateStr: string): string => {
      try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) return d.toISOString();
      } catch { /* */ }
      // Fallback se a data não for parseable directamente
      return new Date(2026, 0, 25 - i * 5).toISOString();
    };

    return {
      _id: `local-${a.id}`,
      title: a.title,
      slug: { current: slug },
      contentType: "article" as const,
      featured: i === 0,
      subtitle: a.subtitle,
      publishedAt: parseLocalDate(a.date),
      estimatedReadTime: parseInt(a.readTime) || 30,
      category: a.category,
      image: {
        asset: { _ref: "", url: localCover || a.image },
        alt: a.title,
      },
    };
  });
}

export default async function JornalPage() {
  let articles;
  try {
    const sanityArticles = await fetchArticlesList();
    if (sanityArticles && sanityArticles.length > 0) {
      articles = sanityArticles;
    } else {
      articles = localToSanityFormat(articlesListPT);
    }
  } catch {
    articles = localToSanityFormat(articlesListPT);
  }

  // Dados EN/ES para fallback de idioma
  const articlesEN = localToSanityFormat(articlesListEN);
  const articlesES = localToSanityFormat(articlesListES);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

  return (
    <>
      <ItemListSchema
        name="Jornal Lusitano"
        description="Artigos e crónicas sobre o cavalo Lusitano — história, genética, biomecânica e desporto."
        items={articles.map((a) => ({
          name: a.title,
          description: a.subtitle,
          url: `${siteUrl}/jornal/${a.slug.current}`,
          image: a.image?.asset?.url,
        }))}
      />
      <JornalListClient articles={articles} articlesEN={articlesEN} articlesES={articlesES} />
    </>
  );
}

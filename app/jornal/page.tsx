import fs from "fs";
import path from "path";
import { fetchArticlesList } from "@/lib/sanity-queries";
import { articlesListPT, articlesListEN, articlesListES } from "@/data/articlesList";
import { legacyIdToSlug } from "@/lib/journal-utils";
import { ItemListSchema } from "@/components/JsonLd";
import JornalListClient from "./JornalListClient";

// ISR: Revalidar jornal diariamente (novos artigos via Sanity)
export const revalidate = 86400;

// Extensões de imagem aceites (qualquer ficheiro de imagem)
const imageExts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".bmp", ".tiff"]);

// Detecta qualquer imagem na pasta public/images/jornal/{slug}/
function findLocalCover(slug: string): string | null {
  const dir = path.join(process.cwd(), "public", "images", "jornal", slug);
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  const img = files.find((f) => imageExts.has(path.extname(f).toLowerCase()));
  return img ? `/images/jornal/${slug}/${img}` : null;
}

// Fallback: converter dados locais para formato compatível com Sanity
function localToSanityFormat(articles: typeof articlesListPT) {
  return articles.map((a, i) => {
    const slug = legacyIdToSlug[a.id] || a.id;
    const localCover = findLocalCover(slug);

    return {
      _id: `local-${a.id}`,
      title: a.title,
      slug: { current: slug },
      contentType: "article" as const,
      featured: i === 0,
      subtitle: a.subtitle,
      publishedAt: new Date(2026, 0, 25 - i * 5).toISOString(),
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
      // Fallback para dados locais se Sanity estiver vazio
      articles = localToSanityFormat(articlesListPT);
    }
  } catch {
    // Fallback se Sanity não estiver disponível
    articles = localToSanityFormat(articlesListPT);
  }

  // Dados EN/ES para fallback
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

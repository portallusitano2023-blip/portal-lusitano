import { fetchArticlesList } from "@/lib/sanity-queries";
import { articlesListPT, articlesListEN } from "@/data/articlesList";
import JornalListClient from "./JornalListClient";

// Fallback: converter dados locais para formato compatível com Sanity
function localToSanityFormat(articles: typeof articlesListPT) {
  const slugMap: Record<string, string> = {
    "1": "genese-cavalo-iberico",
    "2": "biomecanica-reuniao",
    "3": "standard-apsl",
    "4": "genetica-pelagens",
    "5": "toricidade-selecao-combate",
    "6": "novilheiro-rubi-revolucao-olimpica",
  };

  return articles.map((a, i) => ({
    _id: `local-${a.id}`,
    title: a.title,
    slug: { current: slugMap[a.id] || a.id },
    contentType: "article" as const,
    featured: i === 0,
    subtitle: a.subtitle,
    publishedAt: new Date(2026, 0, 25 - (i * 5)).toISOString(),
    estimatedReadTime: parseInt(a.readTime) || 30,
    category: a.category,
    image: {
      asset: { _ref: "", url: a.image },
      alt: a.title,
    },
  }));
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

  // Dados EN para fallback
  const articlesEN = localToSanityFormat(articlesListEN);

  return <JornalListClient articles={articles} articlesEN={articlesEN} />;
}

import fs from "fs";
import path from "path";
import { fetchArticlesList } from "@/lib/sanity-queries";
import { articlesListPT, articlesListEN } from "@/data/articlesList";
import JornalListClient from "./JornalListClient";

// ISR: Revalidar jornal diariamente (novos artigos via Sanity)
export const revalidate = 86400;

const slugMap: Record<string, string> = {
  "1": "genese-cavalo-iberico",
  "2": "biomecanica-reuniao",
  "3": "standard-apsl",
  "4": "genetica-pelagens",
  "5": "toricidade-selecao-combate",
  "6": "novilheiro-rubi-revolucao-olimpica",
};

// Extensões de imagem suportadas (por ordem de prioridade)
const imageExts = [".jpg", ".jpeg", ".png", ".webp"];

// Detecta imagem local em public/images/jornal/{slug}/capa.*
function findLocalCover(slug: string): string | null {
  const dir = path.join(process.cwd(), "public", "images", "jornal", slug);
  for (const ext of imageExts) {
    const filePath = path.join(dir, `capa${ext}`);
    if (fs.existsSync(filePath)) {
      return `/images/jornal/${slug}/capa${ext}`;
    }
  }
  return null;
}

// Fallback: converter dados locais para formato compatível com Sanity
function localToSanityFormat(articles: typeof articlesListPT) {
  return articles.map((a, i) => {
    const slug = slugMap[a.id] || a.id;
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

  // Dados EN para fallback
  const articlesEN = localToSanityFormat(articlesListEN);

  return <JornalListClient articles={articles} articlesEN={articlesEN} />;
}

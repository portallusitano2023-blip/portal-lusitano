import type { Metadata } from "next";
import { articlesDataPT, articlesDataEN } from "@/data/articlesData";
import ArticlePageClient from "./ArticlePageClient";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Usa PT como padrão para SEO (idioma principal do site)
  const article = articlesDataPT[id] || articlesDataEN[id];

  if (!article) {
    return {
      title: "Artigo não encontrado | Portal Lusitano",
    };
  }

  return {
    title: `${article.title} | Portal Lusitano`,
    description: article.description || article.subtitle,
    keywords: article.keywords?.join(", "),
    openGraph: {
      title: article.title,
      description: article.description || article.subtitle,
      images: [{ url: article.image, alt: article.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description || article.subtitle,
    },
  };
}

export default function ArticlePage({ params }: Props) {
  return <ArticlePageClient />;
}

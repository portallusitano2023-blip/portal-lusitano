import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchRelatedArticles, fetchArticleSlugs } from "@/lib/sanity-queries";
import { ArticleSchema, BreadcrumbSchema } from "@/components/JsonLd";
import ArticlePageClient from "./ArticlePageClient";

// Fallback: dados locais para quando Sanity está vazio
import { articlesDataPT } from "@/data/articlesData";

// Detecta imagem de capa local em public/images/jornal/{slug}/capa.*
const imageExts = [".jpg", ".jpeg", ".png", ".webp"];
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

// ISR: artigos do jornal revalidam a cada 6 horas
export const revalidate = 21600;

// Mapa de slugs para IDs legados
const slugToLegacyId: Record<string, string> = {
  "genese-cavalo-iberico": "1",
  "biomecanica-reuniao": "2",
  "standard-apsl": "3",
  "genetica-pelagens": "4",
  "toricidade-selecao-combate": "5",
  "novilheiro-rubi-revolucao-olimpica": "6",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await fetchArticleSlugs();
    if (slugs && slugs.length > 0) {
      return slugs.map((s) => ({ slug: s.slug }));
    }
  } catch {
    // Fallback
  }
  // Retornar slugs dos artigos locais
  return Object.keys(slugToLegacyId).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let title = "Artigo não encontrado";
  let description = "";
  let imageUrl = "/opengraph-image";

  try {
    const article = await fetchArticleBySlug(slug);
    if (article) {
      title = article.title;
      description = article.description || article.subtitle || "";
      if (article.image?.asset?.url) imageUrl = article.image.asset.url;
    } else {
      // Fallback para dados locais
      const legacyId = slugToLegacyId[slug];
      if (legacyId && articlesDataPT[legacyId]) {
        const local = articlesDataPT[legacyId];
        title = local.title;
        description = local.description || local.subtitle;
        imageUrl = findLocalCover(slug) || local.image;
      }
    }
  } catch {
    const legacyId = slugToLegacyId[slug];
    if (legacyId && articlesDataPT[legacyId]) {
      const local = articlesDataPT[legacyId];
      title = local.title;
      description = local.description || local.subtitle;
      imageUrl = findLocalCover(slug) || local.image;
    }
  }

  return {
    title: `${title} | Portal Lusitano`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
      type: "article",
      url: `${siteUrl}/jornal/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${siteUrl}/jornal/${slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article = null;
  let relatedArticles: Awaited<ReturnType<typeof fetchRelatedArticles>> = [];

  try {
    article = await fetchArticleBySlug(slug);
    if (article?.category) {
      relatedArticles = await fetchRelatedArticles(slug, article.category);
    }
  } catch {
    // Will fallback in client
  }

  // Fallback para dados locais se Sanity não tem o artigo
  if (!article) {
    const legacyId = slugToLegacyId[slug];
    if (!legacyId || !articlesDataPT[legacyId]) {
      notFound();
    }
    // Passar slug e legacyId para o client component resolver o fallback
    return (
      <>
        <BreadcrumbSchema
          items={[
            { name: "Portal Lusitano", url: siteUrl },
            { name: "Jornal Lusitano", url: `${siteUrl}/jornal` },
            { name: articlesDataPT[legacyId].title, url: `${siteUrl}/jornal/${slug}` },
          ]}
        />
        <ArticlePageClient slug={slug} legacyId={legacyId} article={null} relatedArticles={[]} />
      </>
    );
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Jornal Lusitano", url: `${siteUrl}/jornal` },
          { name: article.title, url: `${siteUrl}/jornal/${slug}` },
        ]}
      />
      <ArticleSchema
        title={article.title}
        description={article.description || article.subtitle || ""}
        image={article.image?.asset?.url || "/opengraph-image"}
        datePublished={article.publishedAt}
        author={article.author?.name || "Portal Lusitano"}
        newsArticle={true}
        estimatedReadTime={article.estimatedReadTime}
      />
      <ArticlePageClient slug={slug} article={article} relatedArticles={relatedArticles} />
    </>
  );
}

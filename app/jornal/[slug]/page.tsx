import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchRelatedArticles, fetchArticleSlugs } from "@/lib/sanity-queries";
import { BreadcrumbSchema, EducationalArticleSchema } from "@/components/JsonLd";
import ArticlePageClient from "./ArticlePageClient";

// Fallback: dados locais para quando Sanity está vazio
import { articlesDataPT } from "@/data/articlesData";
import { articlesListPT } from "@/data/articlesList";
import { slugToLegacyId } from "@/lib/journal-utils";
import { findLocalCover } from "@/lib/journal-server-utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

// ISR: artigos do jornal revalidam a cada 6 horas
export const revalidate = 21600;

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
    // Fallback silencioso — sem logging para não quebrar build
  }
  return Object.keys(slugToLegacyId).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let title = "Artigo não encontrado";
  let description = "";
  let imageUrl = "/opengraph-image";
  let publishedAt: string | undefined;

  try {
    const article = await fetchArticleBySlug(slug);
    if (article) {
      title = article.title;
      description = article.description || article.subtitle || "";
      if (article.image?.asset?.url) imageUrl = article.image.asset.url;
      publishedAt = article.publishedAt;
    } else {
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
      siteName: "Portal Lusitano",
      locale: "pt_PT",
      ...(publishedAt ? { publishedTime: publishedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
    alternates: {
      canonical: `${siteUrl}/jornal/${slug}`,
      languages: {
        "pt-PT": `${siteUrl}/jornal/${slug}`,
        "en-US": `${siteUrl}/en/jornal/${slug}`,
        "es-ES": `${siteUrl}/es/jornal/${slug}`,
      },
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  let article = null;
  let relatedArticles: Awaited<ReturnType<typeof fetchRelatedArticles>> = [];
  let prevArticle: { slug: string; title: string; category?: string } | null = null;
  let nextArticle: { slug: string; title: string; category?: string } | null = null;

  try {
    const [fetchedArticle, allSlugs] = await Promise.all([
      fetchArticleBySlug(slug),
      fetchArticleSlugs(),
    ]);
    article = fetchedArticle;

    if (article?.category) {
      relatedArticles = await fetchRelatedArticles(slug, article.category);
    }

    // Prev/next navigation for Sanity articles
    if (allSlugs && allSlugs.length > 0) {
      const idx = allSlugs.findIndex((s) => s.slug === slug);
      if (idx > 0) prevArticle = allSlugs[idx - 1] as { slug: string; title: string; category?: string };
      if (idx >= 0 && idx < allSlugs.length - 1) nextArticle = allSlugs[idx + 1] as { slug: string; title: string; category?: string };
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

    const local = articlesDataPT[legacyId];
    const localMeta = articlesListPT.find((a) => a.id === legacyId);
    const localImageUrl = findLocalCover(slug) || local.image;

    return (
      <>
        <BreadcrumbSchema
          items={[
            { name: "Portal Lusitano", url: siteUrl },
            { name: "Jornal Lusitano", url: `${siteUrl}/jornal` },
            { name: local.title, url: `${siteUrl}/jornal/${slug}` },
          ]}
        />
        <EducationalArticleSchema
          name={local.title}
          description={local.description || local.subtitle}
          url={`${siteUrl}/jornal/${slug}`}
          keywords={local.keywords}
          educationalLevel="Advanced"
        />
        <ArticlePageClient
          legacyId={legacyId}
          localImageUrl={localImageUrl}
          article={null}
          relatedArticles={[]}
          prevArticle={prevArticle}
          nextArticle={nextArticle}
        />
      </>
    );
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Portal Lusitano", url: siteUrl },
          { name: "Jornal Lusitano", url: `${siteUrl}/jornal` },
          {
            name: article.titleEn || article.title,
            url: `${siteUrl}/jornal/${slug}`,
          },
        ]}
      />
      <EducationalArticleSchema
        name={article.title}
        description={article.description || article.subtitle || ""}
        url={`${siteUrl}/jornal/${slug}`}
        educationalLevel="Advanced"
      />
      <ArticlePageClient
        article={article}
        relatedArticles={relatedArticles}
        prevArticle={prevArticle}
        nextArticle={nextArticle}
      />
    </>
  );
}

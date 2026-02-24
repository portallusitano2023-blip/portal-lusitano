import { cache } from "react";
import { client } from "./client";

// Portable Text block type (Sanity rich content)
export interface SanityBlock {
  _type: string;
  _key?: string;
  style?: string;
  children?: Array<{
    _type: string;
    _key?: string;
    text?: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _type: string;
    _key: string;
    href?: string;
  }>;
  level?: number;
  listItem?: string;
}

// Tipos para artigos vindos do Sanity
export interface SanityArticle {
  _id: string;
  title: string;
  titleEn?: string;
  slug: { current: string };
  slugLegacy?: string;
  contentType: "article" | "post";
  featured?: boolean;
  subtitle?: string;
  subtitleEn?: string;
  description?: string;
  descriptionEn?: string;
  keywords?: string[];
  publishedAt: string;
  estimatedReadTime?: number;
  category?: string;
  categoryEn?: string;
  image?: {
    asset: { _ref: string; url: string };
    alt?: string;
    hotspot?: { x: number; y: number };
  };
  body?: SanityBlock[];
  bodyEn?: SanityBlock[];
  author?: {
    name: string;
    bio?: string;
    image?: { asset: { url: string } };
  };
  categories?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
  }>;
  sources?: Array<{
    label: string;
    url: string;
  }>;
}

// Query de listagem — sem body (leve)
const ARTICLES_LIST_QUERY = `*[_type == "artigo"] | order(publishedAt desc) {
  _id,
  title,
  titleEn,
  slug,
  slugLegacy,
  contentType,
  featured,
  subtitle,
  subtitleEn,
  description,
  descriptionEn,
  publishedAt,
  estimatedReadTime,
  category,
  categoryEn,
  "image": image {
    asset-> { _ref, url },
    alt,
    hotspot
  },
  "categories": categories[]-> {
    _id,
    title,
    slug
  }
}`;

// Query de detalhe — artigo completo
const ARTICLE_DETAIL_QUERY = `*[_type == "artigo" && slug.current == $slug][0] {
  _id,
  title,
  titleEn,
  slug,
  slugLegacy,
  contentType,
  featured,
  subtitle,
  subtitleEn,
  description,
  descriptionEn,
  keywords,
  publishedAt,
  estimatedReadTime,
  category,
  categoryEn,
  "image": image {
    asset-> { _ref, url },
    alt,
    hotspot
  },
  body,
  bodyEn,
  "author": author-> {
    name,
    bio,
    "image": image { asset-> { url } }
  },
  "categories": categories[]-> {
    _id,
    title,
    slug
  },
  sources
}`;

// Query de artigos relacionados (mesma categoria, excluindo o actual)
const RELATED_ARTICLES_QUERY = `*[_type == "artigo" && slug.current != $slug && category == $category] | order(publishedAt desc) [0...3] {
  _id,
  title,
  titleEn,
  slug,
  subtitle,
  subtitleEn,
  publishedAt,
  estimatedReadTime,
  category,
  categoryEn,
  contentType,
  "image": image {
    asset-> { _ref, url },
    alt,
    hotspot
  }
}`;

// Query para slugs (sitemap / generateStaticParams)
const ARTICLE_SLUGS_QUERY = `*[_type == "artigo"] { "slug": slug.current }`;

// Funções helper — cache() deduplicates calls with the same args within a
// single server request (e.g. generateMetadata + page component both calling
// fetchArticleBySlug with the same slug). This avoids duplicate Sanity HTTP
// requests and shaves ~100-300ms off SSR for article pages.

export const fetchArticlesList = cache(
  async (): Promise<SanityArticle[]> => client.fetch(ARTICLES_LIST_QUERY)
);

export const fetchArticleBySlug = cache(
  async (slug: string): Promise<SanityArticle | null> =>
    client.fetch(ARTICLE_DETAIL_QUERY, { slug })
);

export const fetchRelatedArticles = cache(
  async (slug: string, category: string): Promise<SanityArticle[]> =>
    client.fetch(RELATED_ARTICLES_QUERY, { slug, category })
);

export const fetchArticleSlugs = cache(
  async (): Promise<Array<{ slug: string }>> => client.fetch(ARTICLE_SLUGS_QUERY)
);

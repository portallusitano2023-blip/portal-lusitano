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

// Pagination parameters type
export interface ArticlesPaginationParams {
  /** Number of articles to skip (0-based offset) */
  skip: number;
  /** Maximum number of articles to return */
  limit: number;
}

/** Default page size — safe for OOM and Vercel timeout budgets */
export const ARTICLES_DEFAULT_LIMIT = 20;

// Query de listagem — sem body (leve), sem paginação
// ⚠️  Deprecated for large datasets — use ARTICLES_PAGE_QUERY instead.
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

// Query de listagem paginada — usa GROQ slice para limitar resultados
// $skip → número de artigos a ignorar, $limit → número a retornar
const ARTICLES_PAGE_QUERY = `*[_type == "artigo"] | order(publishedAt desc) [$skip...$to] {
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

// Count query for pagination UI (total number of articles)
const ARTICLES_COUNT_QUERY = `count(*[_type == "artigo"])`;

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

// Query para slugs (sitemap / generateStaticParams / navegação prev-next)
const ARTICLE_SLUGS_QUERY = `*[_type == "artigo"] | order(publishedAt desc) {
  "slug": slug.current,
  title,
  titleEn,
  category,
  categoryEn,
  publishedAt
}`;

// Funções helper — cache() deduplicates calls with the same args within a
// single server request (e.g. generateMetadata + page component both calling
// fetchArticleBySlug with the same slug). This avoids duplicate Sanity HTTP
// requests and shaves ~100-300ms off SSR for article pages.

export const fetchArticlesList = cache(
  async (): Promise<SanityArticle[]> => client.fetch(ARTICLES_LIST_QUERY)
);

/**
 * Paginated article listing.
 *
 * Prefer this over `fetchArticlesList` for any page that may grow large.
 * GROQ slice syntax `[$skip...$to]` is processed on Sanity's side — only
 * the requested window is transferred over the wire.
 *
 * @example
 *   // First page (0–19)
 *   const articles = await fetchArticlesPage({ skip: 0, limit: 20 });
 *   // Second page (20–39)
 *   const articles = await fetchArticlesPage({ skip: 20, limit: 20 });
 */
export const fetchArticlesPage = cache(
  async ({
    skip = 0,
    limit = ARTICLES_DEFAULT_LIMIT,
  }: Partial<ArticlesPaginationParams> = {}): Promise<SanityArticle[]> => {
    const safeSkip = Math.max(0, skip);
    const safeLimit = Math.min(Math.max(1, limit), 100); // cap at 100 per page
    return client.fetch(ARTICLES_PAGE_QUERY, {
      skip: safeSkip,
      to: safeSkip + safeLimit,
    });
  }
);

/**
 * Total article count — use alongside `fetchArticlesPage` to build
 * pagination controls (total pages = Math.ceil(count / limit)).
 */
export const fetchArticlesCount = cache(
  async (): Promise<number> => client.fetch(ARTICLES_COUNT_QUERY)
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
  async (): Promise<Array<{ slug: string; title?: string; titleEn?: string; category?: string; categoryEn?: string; publishedAt?: string }>> =>
    client.fetch(ARTICLE_SLUGS_QUERY)
);

// --- Cavalo queries ---
const CAVALO_DETAIL_QUERY = `*[_type == "cavalo" && slug.current == $slug][0] {
  nome,
  idade,
  ferro,
  genealogia,
  descricao,
  preco,
  "slug": slug.current,
  "imageUrl": fotografiaPrincipal.asset->url
}`;

const CAVALO_SLUGS_QUERY = `*[_type == "cavalo"] { "slug": slug.current }`;

export const fetchCavaloBySlug = cache(async (slug: string) =>
  client.fetch(CAVALO_DETAIL_QUERY, { slug })
);

export const fetchCavaloSlugs = cache(
  async (): Promise<Array<{ slug: string }>> => client.fetch(CAVALO_SLUGS_QUERY)
);

import { urlFor } from "@/lib/sanity-image";
import type { SanityArticle } from "@/lib/sanity-queries";
import { slugToArticleId, articleIdToSlug } from "@/data/articlesList";

// ── Slug ↔ Legacy ID (fonte única: data/articlesList.ts) ──────────────────
export const slugToLegacyId: Record<string, string> = slugToArticleId;
export const legacyIdToSlug: Record<string, string> = articleIdToSlug;

/**
 * Normaliza o texto de um heading para um ID de âncora HTML válido.
 * Remove diacríticos e caracteres especiais; substitui espaços por hífens.
 * Fonte única — importar em FloatingTOC, PortableTextComponents e ArticleComponents.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacríticos
    .replace(/[^\w\s-]/g, "")         // remove pontuação especial
    .replace(/\s+/g, "-")             // espaços → hífens
    .trim();
}

/** URL da imagem de um artigo Sanity, com fallback gracioso. */
export function getArticleImageUrl(article: SanityArticle, width = 1200): string {
  if (article.image?.asset?.url) return article.image.asset.url;
  if (article.image?.asset?._ref) {
    try {
      return urlFor(article.image).width(width).quality(85).url();
    } catch {
      return "";
    }
  }
  return "";
}

/** Formata data de artigo para o locale adequado. */
export function formatArticleDate(
  dateStr: string,
  lang: string,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const date = new Date(dateStr);
    const locale = lang === "pt" ? "pt-PT" : lang === "es" ? "es-ES" : "en-GB";
    return date.toLocaleDateString(
      locale,
      options ?? { day: "numeric", month: "long", year: "numeric" }
    );
  } catch {
    return dateStr;
  }
}

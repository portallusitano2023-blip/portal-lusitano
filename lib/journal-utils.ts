import { urlFor } from "@/lib/sanity-image";
import type { SanityArticle } from "@/lib/sanity-queries";

// Mapeamento slug ↔ legacy ID (fonte única de verdade — reutilizado em page.tsx, OG, etc.)
export const slugToLegacyId: Record<string, string> = {
  "genese-cavalo-iberico": "1",
  "biomecanica-reuniao": "2",
  "standard-apsl": "3",
  "genetica-pelagens": "4",
  "toricidade-selecao-combate": "5",
  "novilheiro-rubi-revolucao-olimpica": "6",
};

export const legacyIdToSlug: Record<string, string> = Object.fromEntries(
  Object.entries(slugToLegacyId).map(([k, v]) => [v, k])
);

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

/**
 * Server-side i18n utilities
 *
 * Permite usar traduções em Server Components e gerar
 * metadata SEO na língua correcta.
 */

export const locales = ["pt", "en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";

/**
 * Dicionários de SEO metadata para cada locale.
 * Usados em generateMetadata() dos Server Components.
 */
const seoMetadata: Record<
  Locale,
  {
    siteName: string;
    siteDescription: string;
    ogLocale: string;
    keywords: string[];
  }
> = {
  pt: {
    siteName: "Portal Lusitano | Cavalos Lusitanos de Elite",
    siteDescription:
      "Marketplace premium de cavalos Lusitanos. Loja equestre, coudelarias certificadas e o maior arquivo editorial sobre o cavalo Português.",
    ogLocale: "pt_PT",
    keywords: [
      "cavalo lusitano",
      "cavalos portugueses",
      "equitação",
      "dressage",
      "coudelaria",
      "PRE",
      "cavalo ibérico",
      "comprar cavalo",
      "equestre portugal",
    ],
  },
  en: {
    siteName: "Portal Lusitano | Elite Lusitano Horses",
    siteDescription:
      "Premium Lusitano horse marketplace. Equestrian shop, certified stud farms and the largest editorial archive about the Portuguese horse.",
    ogLocale: "en_US",
    keywords: [
      "lusitano horse",
      "portuguese horses",
      "equestrian",
      "dressage",
      "stud farm",
      "PRE",
      "iberian horse",
      "buy horse",
      "equestrian portugal",
    ],
  },
  es: {
    siteName: "Portal Lusitano | Caballos Lusitanos de Elite",
    siteDescription:
      "Marketplace premium de caballos Lusitanos. Tienda ecuestre, yeguadas certificadas y el mayor archivo editorial sobre el caballo portugues.",
    ogLocale: "es_ES",
    keywords: [
      "caballo lusitano",
      "caballos portugueses",
      "ecuestre",
      "doma clasica",
      "yeguada",
      "PRE",
      "caballo iberico",
      "comprar caballo",
      "ecuestre portugal",
    ],
  },
};

export function getSEOMetadata(locale: Locale) {
  return seoMetadata[locale];
}

/**
 * Detectar locale a partir do pathname
 */
export function getLocaleFromPathname(pathname: string): Locale {
  if (pathname.startsWith("/en/") || pathname === "/en") {
    return "en";
  }
  if (pathname.startsWith("/es/") || pathname === "/es") {
    return "es";
  }
  return defaultLocale;
}

/**
 * Gerar hreflang links para SEO
 */
export function getAlternateLinks(pathname: string, siteUrl: string) {
  // Remover prefixo /en/ ou /es/ se existir
  const cleanPath = pathname.replace(/^\/(en|es)/, "") || "/";

  return {
    "pt-PT": `${siteUrl}${cleanPath}`,
    "en-US": `${siteUrl}/en${cleanPath === "/" ? "" : cleanPath}`,
    "es-ES": `${siteUrl}/es${cleanPath === "/" ? "" : cleanPath}`,
    "x-default": `${siteUrl}${cleanPath}`,
  };
}

/**
 * Verificar se um locale é válido
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

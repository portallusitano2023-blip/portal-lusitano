import { cookies } from "next/headers";
import ptTranslations from "@/locales/pt.json";
import enTranslations from "@/locales/en.json";
import esTranslations from "@/locales/es.json";

type Language = "pt" | "en" | "es";
type Translations = typeof ptTranslations;

const translationsMap: Record<Language, Translations> = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations,
};

/**
 * Server-side language detection — reads the `locale` cookie set by LanguageContext.
 * Use this in Server Components instead of useLanguage().
 *
 * Returns { language, t, tr } where:
 * - `language` is the detected locale ("pt" | "en" | "es")
 * - `t` is the full translations object (same as useLanguage().t)
 * - `tr` is the inline translator (same as createTranslator(language))
 */
export async function getServerLanguage(): Promise<{
  language: Language;
  t: Translations;
  tr: (pt: string, en: string, es?: string) => string;
}> {
  const cookieStore = await cookies();
  const raw = cookieStore.get("locale")?.value;
  const language: Language = raw === "en" || raw === "es" ? raw : "pt";
  const t = translationsMap[language];
  const tr = (pt: string, en: string, es: string = en): string => {
    if (language === "pt") return pt;
    if (language === "es") return es;
    return en;
  };
  return { language, t, tr };
}

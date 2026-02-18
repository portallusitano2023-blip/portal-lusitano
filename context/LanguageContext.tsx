"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import pt from "@/locales/pt.json";

type Translations = typeof pt;
type Language = "pt" | "en" | "es";

// Cache loaded translations — pt always available, en/es loaded on demand
const translationsCache: Record<Language, Translations | null> = { pt, en: null, es: null };

const loaders: Record<string, () => Promise<{ default: Translations }>> = {
  en: () => import("@/locales/en.json") as Promise<{ default: Translations }>,
  es: () => import("@/locales/es.json") as Promise<{ default: Translations }>,
};

async function loadTranslations(lang: Language): Promise<Translations> {
  if (translationsCache[lang]) return translationsCache[lang]!;
  const mod = await loaders[lang]();
  translationsCache[lang] = mod.default;
  return mod.default;
}

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({
  children,
  initialLanguage = "pt",
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|; )locale=(pt|en|es)(?:;|$)/);
      if (match) return match[1] as Language;
    }
    return initialLanguage;
  });

  const [t, setT] = useState<Translations>(translationsCache[language] ?? pt);

  // Sync browser state when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.cookie = `locale=${language}; path=/; samesite=lax; max-age=${60 * 60 * 24 * 365}`;

    // Only async-load uncached translations; cached ones handled below via useMemo
    if (!translationsCache[language]) {
      loadTranslations(language).then(setT);
    }
  }, [language]);

  // Derive final translations: use cache if available (instant), else fall back to state
  const resolvedT = translationsCache[language] ?? t;

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next = prev === "pt" ? "en" : prev === "en" ? "es" : "pt";
      // Pre-fetch the NEXT language so toggle feels instant
      const afterNext = next === "pt" ? "en" : next === "en" ? "es" : "pt";
      if (!translationsCache[afterNext]) loadTranslations(afterNext);
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: resolvedT }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage deve ser usado dentro de um LanguageProvider");
  }
  return context;
};

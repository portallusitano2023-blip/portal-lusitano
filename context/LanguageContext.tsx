"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
// Type-only import — erased at compile time, does NOT bundle the 100KB JSON
import type ptType from "@/locales/pt.json";

type Translations = typeof ptType;
type Language = "pt" | "en" | "es";

// All translations loaded on demand. PT starts loading immediately at module
// evaluation so it's typically ready before React mounts.
const translationsCache: Record<Language, Translations | null> = { pt: null, en: null, es: null };

const loaders: Record<Language, () => Promise<{ default: Translations }>> = {
  pt: () => import("@/locales/pt.json") as Promise<{ default: Translations }>,
  en: () => import("@/locales/en.json") as Promise<{ default: Translations }>,
  es: () => import("@/locales/es.json") as Promise<{ default: Translations }>,
};

// Kick off PT load immediately — resolves before first paint in most cases
let ptReady: Translations | null = null;
loaders.pt().then((mod) => {
  ptReady = mod.default;
  translationsCache.pt = mod.default;
});

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
  const [language, setLanguage] = useState<Language>(initialLanguage);

  // ptReady is non-null if the module-level dynamic import resolved before this
  // component mounts (the common case). Otherwise we load on effect.
  const [t, setT] = useState<Translations | null>(translationsCache[language] ?? ptReady);

  // Ensure translations are loaded (handles edge case where PT import hasn't
  // resolved yet when the component first mounts)
  useEffect(() => {
    if (!translationsCache[language]) {
      loadTranslations(language).then((data) => setT(data));
    } else if (!t) {
      setT(translationsCache[language]);
    }
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  // Read locale from cookie on mount — allows root layout to be static (no cookies() call)
  // while still picking up the locale set by middleware for /en/* and /es/* routes.
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)locale=(\w+)/);
    const cookieLocale = match?.[1] as Language | undefined;
    if (cookieLocale && cookieLocale !== language && ["pt", "en", "es"].includes(cookieLocale)) {
      setLanguage(cookieLocale);
      if (!translationsCache[cookieLocale]) {
        loadTranslations(cookieLocale).then(setT);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync browser state when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    document.cookie = `locale=${language}; path=/; samesite=lax; max-age=${60 * 60 * 24 * 365}`;

    // Only async-load uncached translations; cached ones handled below via useMemo
    if (!translationsCache[language]) {
      loadTranslations(language).then(setT);
    }
  }, [language]);

  // Derive final translations: use cache if available (instant), else fall back to state.
  // During the brief window before PT loads, resolvedT may be null — children
  // won't render (see guard below).
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

  // Memoize the context value object so consumers only re-render when
  // language or translations actually change — not on every provider render.
  const contextValue = useMemo(
    () => (resolvedT ? { language, toggleLanguage, t: resolvedT } : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, resolvedT]
    // toggleLanguage is stable (useCallback with no deps), excluded intentionally
  );

  // While translations are loading (typically <50ms), render nothing to avoid
  // hydration mismatches. The module-level preload means this almost never triggers.
  if (!contextValue) return null;

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage deve ser usado dentro de um LanguageProvider");
  }
  return context;
};

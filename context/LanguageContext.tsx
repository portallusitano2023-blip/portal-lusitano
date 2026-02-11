"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import pt from "@/locales/pt.json";
import en from "@/locales/en.json";
import es from "@/locales/es.json";

const translations = { pt, en, es };

type Language = "pt" | "en" | "es";
interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (typeof translations)["pt"];
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

  // Actualizar documento quando idioma muda
  useEffect(() => {
    document.documentElement.lang = language;
    document.cookie = `locale=${language}; path=/; samesite=lax; max-age=${60 * 60 * 24 * 365}`;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      if (prev === "pt") return "en";
      if (prev === "en") return "es";
      return "pt";
    });
  };
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>
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

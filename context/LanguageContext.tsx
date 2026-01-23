"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

const translations = {
  // 🇵🇹 PORTUGUÊS
  pt: {
    nav: { home: "Início", shop: "Loja", about: "Sobre", journal: "Jornal" },
    cart: "Saco",
    home: {
      est: "Est. 2023 — Portugal",
      // VOLTAMOS AO CLÁSSICO
      title_prefix: "The",
      title_main: "NOBREZA LUSITANA",
      hero_text: "A união perfeita entre a tradição equestre secular e o design contemporâneo.",
      cta: "Explorar Coleção",
      curation: "Curadoria",
      featured: "Coleção em Destaque",
      view_all: "Ver Todos",
      manifesto: "Não criamos apenas vestuário. Criamos símbolos de pertença."
    },
    shop: { est: "Est. Portugal MMXXIII", title: "Arquivo & Coleção", subtitle: "Peças de herança.", examine: "Examinar", price_suffix: "EUR" },
    about: {
      title: "A Nossa Missão",
      subtitle: "O Portal Lusitano nasceu para elevar o Cavalo Lusitano ao palco global.",
      story_title: "A Origem",
      story_text: "Fundado por Francisco Gaspar, o Portal Lusitano une a engenharia digital à paixão equestre.",
      values_title: "Os Nossos Valores",
      value1: "Tradição",
      value2: "Inovação",
      value3: "Excelência",
      founder: "Fundador"
    }
  },

  // 🇬🇧 INGLÊS
  en: {
    nav: { home: "Home", shop: "Shop", about: "About", journal: "Journal" },
    cart: "Bag",
    home: {
      est: "Est. 2023 — Portugal",
      // VOLTAMOS AO CLÁSSICO
      title_prefix: "The",
      title_main: "LUSITANO NOBILITY",
      hero_text: "The perfect union between secular equestrian tradition and contemporary design.",
      cta: "Explore Collection",
      curation: "Curation",
      featured: "Featured Collection",
      view_all: "View All",
      manifesto: "We don't just create clothing. We create symbols of belonging."
    },
    shop: { est: "Est. Portugal MMXXIII", title: "Archive & Collection", subtitle: "Heritage pieces.", examine: "Examine", price_suffix: "EUR" },
    about: {
      title: "Our Mission",
      subtitle: "Portal Lusitano was born to elevate the Lusitano Horse to the global stage.",
      story_title: "The Origin",
      story_text: "Founded by Francisco Gaspar, Portal Lusitano unites digital engineering with equestrian passion.",
      values_title: "Our Values",
      value1: "Tradition",
      value2: "Innovation",
      value3: "Excellence",
      founder: "Founder"
    }
  }
};

type Language = "pt" | "en";
interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: typeof translations["pt"];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt");
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "pt" ? "en" : "pt"));
  };
  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Exportação que garante que não dá erro
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage deve ser usado dentro de um LanguageProvider");
  }
  return context;
};
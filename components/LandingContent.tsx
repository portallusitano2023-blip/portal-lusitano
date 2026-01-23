"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

const translations = {
  pt: {
    nav: { home: "Início", shop: "Loja", about: "Sobre", studs: "Coudelarias", journal: "Jornal" },
    cart: "Saco",
    home: {
      est: "Est. 2023 — Portugal",
      title: "NOBREZA LUSITANA",
      subtitle: "A união perfeita entre a tradição equestre secular e o design contemporâneo.",
      cta: "Explorar Coleção",
      curation: "Curadoria",
      featured: "Coleção em Destaque",
      view_all: "Ver Todos os Produtos",
      manifesto: "Não criamos apenas vestuário. Criamos símbolos de pertença para aqueles que compreendem a linguagem silenciosa do cavalo."
    },
    shop: {
      est: "Est. Portugal MMXXIII",
      title: "Arquivo & Coleção",
      subtitle: "Peças de herança desenhadas para a posteridade.",
      examine: "Examinar",
      price_suffix: "EUR"
    },
    // --- NOVO: SOBRE ---
    about: {
      title: "A Nossa Missão",
      subtitle: "O Portal Lusitano nasceu para elevar o Cavalo Lusitano ao palco global.",
      story_title: "A Origem",
      story_text: "Fundado por Francisco Gaspar, o Portal Lusitano une a engenharia digital à paixão equestre. O nosso objetivo é criar uma infraestrutura tecnológica sem precedentes para criadores, cavaleiros e admiradores.",
      values_title: "Os Nossos Valores",
      value1: "Tradição",
      value2: "Inovação",
      value3: "Excelência"
    },
    // --- NOVO: COUDELARIAS ---
    studs: {
      title: "Coudelarias de Elite",
      subtitle: "O diretório exclusivo dos criadores mais prestigiados.",
      coming_soon: "Brevemente",
      description: "Estamos a curar uma seleção das melhores casas de criação do mundo."
    }
  },
  en: {
    nav: { home: "Home", shop: "Shop", about: "About", studs: "Studs", journal: "Journal" },
    cart: "Bag",
    home: {
      est: "Est. 2023 — Portugal",
      title: "LUSITANO NOBILITY",
      subtitle: "The perfect union between secular equestrian tradition and contemporary design.",
      cta: "Explore Collection",
      curation: "Curation",
      featured: "Featured Collection",
      view_all: "View All Products",
      manifesto: "We don't just create clothing. We create symbols of belonging for those who understand the silent language of the horse."
    },
    shop: {
      est: "Est. Portugal MMXXIII",
      title: "Archive & Collection",
      subtitle: "Heritage pieces designed for posterity.",
      examine: "Examine",
      price_suffix: "EUR"
    },
    // --- NOVO: ABOUT (EN) ---
    about: {
      title: "Our Mission",
      subtitle: "Portal Lusitano was born to elevate the Lusitano Horse to the global stage.",
      story_title: "The Origin",
      story_text: "Founded by Francisco Gaspar, Portal Lusitano unites digital engineering with equestrian passion. Our goal is to create unprecedented technological infrastructure for breeders, riders, and admirers.",
      values_title: "Our Values",
      value1: "Tradition",
      value2: "Innovation",
      value3: "Excellence"
    },
    // --- NOVO: STUDS (EN) ---
    studs: {
      title: "Elite Stud Farms",
      subtitle: "The exclusive directory of the most prestigious breeders.",
      coming_soon: "Coming Soon",
      description: "We are currently curating a selection of the world's finest breeding houses."
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

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage deve ser usado dentro de um LanguageProvider");
  }
  return context;
};
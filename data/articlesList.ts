/**
 * Metadata dos artigos - ficheiro leve para listagens
 * O conteúdo completo é carregado dinamicamente em /jornal/[id]
 */

export interface ArticleMeta {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  description?: string;
}

// Mapeamento slug ↔ ID
export const slugToArticleId: Record<string, string> = {
  "genese-cavalo-iberico": "1",
  "biomecanica-reuniao": "2",
  "standard-apsl": "3",
  "genetica-pelagens": "4",
  "toricidade-selecao-combate": "5",
  "novilheiro-rubi-revolucao-olimpica": "6",
};

export const articleIdToSlug: Record<string, string> = {
  "1": "genese-cavalo-iberico",
  "2": "biomecanica-reuniao",
  "3": "standard-apsl",
  "4": "genetica-pelagens",
  "5": "toricidade-selecao-combate",
  "6": "novilheiro-rubi-revolucao-olimpica",
};

// Apenas metadata - sem content (evita carregar ~800 linhas de JSX)
export const articlesListPT: ArticleMeta[] = [
  {
    id: "1",
    title: "Tratado Histórico: A Génese do Cavalo Ibérico",
    subtitle: "5000 anos de seleção contínua: Do Refúgio Glaciar à Gineta de Guerra.",
    date: "25 JAN 2026",
    readTime: "25 min",
    category: "História & Arqueologia",
    image:
      "https://images.unsplash.com/photo-1551884831-bbf3ddd77501?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Biomecânica Avançada: A Física da Reunião",
    subtitle: "Análise vetorial do movimento: Do ângulo lombo-sacral à elasticidade tendinosa.",
    date: "18 JAN 2026",
    readTime: "20 min",
    category: "Zootecnia & Física",
    image:
      "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "O Standard Oficial (APSL): Manual de Julgamento",
    subtitle: "Dissecção ponto por ponto do padrão racial aprovado pela APSL.",
    date: "15 JAN 2026",
    readTime: "20 min",
    category: "Morfologia & Standard",
    image:
      "https://images.unsplash.com/photo-1447993661623-28b9c8a994a5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "A Ciência das Cores: Genética de Pelagens no PSL",
    subtitle: "Locus Extension, Agouti, Diluição Creme, o gene Grey e pelagens raras do PSL.",
    date: "12 JAN 2026",
    readTime: "20 min",
    category: "Genética & Pelagens",
    image:
      "https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Toricidade: A Seleção pelo Combate",
    subtitle: "Como a Tauromaquia moldou a psique do Lusitano.",
    date: "08 JAN 2026",
    readTime: "15 min",
    category: "Funcionalidade & Temperamento",
    image:
      "https://images.unsplash.com/photo-1629814486523-24e54e4215e0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "De Novilheiro a Rubi: A Revolução Internacional",
    subtitle: "Como o Lusitano provou o seu valor ao mais alto nível do desporto equestre.",
    date: "02 JAN 2026",
    readTime: "25 min",
    category: "Desporto & Competição",
    image:
      "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
  },
];

export const articlesListEN: ArticleMeta[] = [
  {
    id: "1",
    title: "Historical Treatise: The Genesis of the Iberian Horse",
    subtitle: "5000 years of continuous selection: From the Glacial Refuge to the Gineta Warfare.",
    date: "25 JAN 2026",
    readTime: "25 min",
    category: "History & Archaeology",
    image:
      "https://images.unsplash.com/photo-1551884831-bbf3ddd77501?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Advanced Biomechanics: The Physics of Collection",
    subtitle: "Vector analysis of movement: From the lumbosacral angle to tendon elasticity.",
    date: "18 JAN 2026",
    readTime: "20 min",
    category: "Zootechnics & Physics",
    image:
      "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "The Official Standard (APSL): Judging Manual",
    subtitle: "Point by point dissection of the breed standard approved by APSL.",
    date: "15 JAN 2026",
    readTime: "20 min",
    category: "Morphology & Standard",
    image:
      "https://images.unsplash.com/photo-1447993661623-28b9c8a994a5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "The Science of Colors: Coat Genetics in PSL",
    subtitle:
      "Extension Locus, Agouti, Cream Dilution, the Grey gene and rare coat colors of the PSL.",
    date: "12 JAN 2026",
    readTime: "20 min",
    category: "Genetics & Coat Colors",
    image:
      "https://images.unsplash.com/photo-1534068590799-09895a701e3e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Bullfighting Aptitude: Selection Through Combat",
    subtitle: "How Tauromachy shaped the Lusitano's psyche.",
    date: "08 JAN 2026",
    readTime: "15 min",
    category: "Functionality & Temperament",
    image:
      "https://images.unsplash.com/photo-1629814486523-24e54e4215e0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "From Novilheiro to Rubi: The International Revolution",
    subtitle: "How the Lusitano proved its worth at the highest level of equestrian sport.",
    date: "02 JAN 2026",
    readTime: "25 min",
    category: "Sport & Competition",
    image:
      "https://images.unsplash.com/photo-1535083252457-6080fe29be45?q=80&w=1200&auto=format&fit=crop",
  },
];

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const translations = {
  // PORTUGUES
  pt: {
    nav: { home: "Inicio", shop: "Loja", about: "Sobre", journal: "Jornal" },
    cart: "Saco",

    // HOME
    home: {
      est: "Est. 2023 - Portugal",
      title_prefix: "The",
      title_main: "NOBREZA LUSITANA",
      hero_text: "A uniao perfeita entre a tradicao equestre secular e o design contemporaneo.",
      cta: "Explorar Colecao",
      curation: "Curadoria",
      featured: "Colecao em Destaque",
      view_all: "Ver Todos",
      manifesto: "Nao criamos apenas vestuario. Criamos simbolos de pertenca.",
      scroll: "Scroll",
    },

    // LOJA
    shop: {
      est: "Est. Portugal MMXXIII",
      title: "Arquivo & Colecao",
      subtitle: "Pecas de heranca.",
      examine: "Examinar",
      price_suffix: "EUR",
      collection: "Colecao 2026",
      legacy: "O Legado Lusitano",
      legacy_subtitle: "Onde a tradicao equestre encontra a elegancia contemporanea",
      discover: "Descobrir",
      not_found: "Peca nao encontrada",
      not_found_text: "O sistema nao encontrou a peca com o handle:",
      back_collection: "Voltar a Colecao",
    },

    // SOBRE
    about: {
      title: "A Nossa Missao",
      subtitle: "O Portal Lusitano nasceu para elevar o Cavalo Lusitano ao palco global.",
      story_title: "A Origem",
      story_text:
        "Fundado por Francisco Gaspar, o Portal Lusitano une a engenharia digital a paixao equestre.",
      values_title: "Os Nossos Valores",
      value1: "Tradicao",
      value2: "Inovacao",
      value3: "Excelencia",
      founder: "Fundador",
    },

    // JORNAL (unificado: artigos + crónicas)
    journal: {
      archive: "Arquivo Editorial",
      title: "Enciclopedia Lusitana",
      subtitle: "Investigacao profunda sobre a historia, ciencia e arte do cavalo portugues.",
      technical_read: "Leitura Tecnica",
      read_study: "Ler Estudo",
      unavailable: "Artigo Indisponivel",
      unavailable_text: "O conteudo que procura nao foi encontrado.",
      back: "Voltar ao Jornal",
      back_archive: "Voltar ao Arquivo Digital",
      peer_reviewed: "Peer-Reviewed",
      scientific_research: "Investigacao Cientifica",
      preservation: "Preservacao do Conhecimento Equestre",
      preservation_text:
        "Este artigo faz parte do projeto de arquivamento digital do conhecimento cientifico sobre o Cavalo Lusitano, a raca equestre mais influente da civilizacao ocidental.",
      support: "Apoiar o Projeto",
      explore_archive: "Explorar Arquivo",
      share: "Partilhar",
      all_categories: "Todas as Categorias",
      search_placeholder: "Pesquisar artigos...",
      no_results: "Nenhum artigo encontrado.",
      related_articles: "Artigos Relacionados",
      table_of_contents: "Indice",
      sources: "Fontes e Referencias",
      min_read: "min de leitura",
      view_grid: "Vista grelha",
      view_list: "Vista lista",
      load_more: "Carregar mais",
      article_type: "Artigo",
      post_type: "Cronica",
      read_chronicle: "Ler Cronica",
      no_cover: "Sem Capa",
      culture: "Cultura Lusitana",
    },

    // BLOG (depreciado - redirects para /jornal)
    blog: {
      editorial: "Editorial",
      title: "Jornal Lusitano",
      subtitle: "Cronicas, cultura e o legado do cavalo mais antigo do mundo.",
      no_cover: "Sem Capa",
      read: "Ler Cronica",
      no_news: "Sem noticias publicadas",
      culture: "Cultura Lusitana",
      not_found: "Artigo nao encontrado.",
    },

    // LOGIN
    login: {
      reserved: "Acesso Reservado",
      title: "Portal ID",
      email: "Email",
      password: "Password",
      recover: "Recuperar",
      logging_in: "A Entrar...",
      enter: "Entrar na Conta",
      no_invite: "Ainda sem convite?",
      create: "Criar Conta",
    },

    // REGISTAR
    register: {
      new_member: "Novo Membro",
      title: "Criar Passaporte",
      name: "Nome",
      surname: "Apelido",
      email: "Email",
      password: "Password",
      creating: "A Criar Conta...",
      confirm: "Confirmar Registo",
      already_member: "Ja e membro?",
      enter: "Entrar",
    },

    // MINHA CONTA
    account: {
      private_area: "Area Privada",
      hello: "Ola",
      logout: "Terminar Sessao",
      profile: "O Meu Perfil",
      name: "Nome",
      surname: "Apelido",
      email: "Email",
      history: "Historico de Aquisicoes",
      order: "Encomenda",
      no_orders: "Ainda nao possui aquisicoes.",
      explore: "Explorar Colecao",
    },

    // COUDELARIAS
    studs: {
      directory: "Diretorio de Prestigio",
      title: "As Grandes Casas",
      subtitle:
        "Uma selecao exclusiva dos criadores que mantem viva a chama da raca Lusitana. Historia, genetica e paixao em cada coudelaria.",
      no_image: "Sem Imagem",
      view_profile: "Ver Perfil",
      breeder: "E criador?",
      join: "Junte-se ao Portal",
    },

    // LEILOES
    auctions: {
      offline: "Live Bidding Offline",
      title: "Sala de Leiloes",
      subtitle:
        "Os leiloes do Portal Lusitano sao eventos exclusivos. O proximo evento esta agendado para Marco de 2026.",
      lot: "Lote",
      lineage: "Linhagem",
      last_bid: "Ultima Licitacao",
      time_left: "Tempo Restante",
      closed: "Fechado",
      auction_closed: "Leilao Encerrado",
      bid_note: "Para licitar, e necessario ter a conta verificada e caucao ativa.",
      back: "Voltar aos Leiloes",
      pure_blood: "Puro Sangue Lusitano",
      reference_value: "Valor de Referencia",
      on_request: "Sob Consulta",
      direct_sale: "Venda Direta",
      whatsapp: "Duvidas por WhatsApp",
      age: "Idade",
      brand: "Ferro",
      years: "anos",
      description: "Descricao Editorial",
      loading: "Carregando exemplar de elite...",
      other_specimens: "Outros Exemplares de Elite",
    },

    // COMPRAR
    buy: {
      marketplace: "Marketplace de Prestigio",
      title: "Comprar Exemplar",
      no_photo: "Sem Foto",
      no_specimens: "Nenhum exemplar aprovado para venda no momento.",
      pure_lineage: "Linhagem Pura",
      reg: "REG",
      age: "Idade",
      years: "Anos",
      location: "Localizacao",
      apsl_score: "Pontuacao APSL",
      pts: "pts",
      technical_opinion: "Parecer Tecnico",
      blood_certificate: "Certificado de Sangue",
      verified_data: "Dados verificados via Stud-Book Digital",
      digital_asset: "Digital Asset",
      blockchain: "Blockchain Verified",
      nft_certificate: "Certificado NFT",
      nft_description: "Este exemplar possui um Gemeo Digital registado na rede Polygon...",
      token_id: "Token ID",
      contract: "Contract",
      standard: "Standard",
      request_dossier: "Solicitar Dossier & Visita",
      members_only: "Exclusivo para membros Portal Lusitano",
      not_found: "Exemplar nao encontrado.",
    },

    // PRIVACIDADE
    privacy: {
      security: "Seguranca",
      title: "Politica de Privacidade",
      data_privacy: "Privacidade dos Dados",
      data_text:
        "No Portal Lusitano, tratamos os seus dados pessoais com o mesmo rigor que tratamos a genetica da nossa raca. Os seus dados de membro (Portal ID) sao utilizados exclusivamente para gerir a sua conta e historico de aquisicoes.",
      collection: "Recolha de Informacao",
      collection_text:
        "Recolhemos informacoes quando se regista no nosso site, faz uma compra ou subscreve a nossa newsletter. Isto inclui o seu nome, e-mail e endereco de faturacao.",
      cookies: "Cookies e Shopify",
      cookies_text:
        "Utilizamos cookies para melhorar a sua experiencia de navegacao e processar os itens no seu saco de compras atraves da infraestrutura segura do Shopify.",
    },

    // TERMOS
    terms: {
      legal: "Juridico",
      title: "Termos & Condicoes",
      scope: "1. Ambito do Servico",
      scope_text:
        "O Portal Lusitano opera como uma plataforma de marketplace e editorial dedicada a raca Lusitana. Ao aceder ao nosso site, o utilizador concorda em cumprir os presentes termos de utilizacao.",
      marketplace: "2. Marketplace de Elite",
      marketplace_text:
        "As transacoes comerciais realizadas atraves da nossa loja sao processadas de forma segura. O Portal Lusitano reserva-se o direito de selecionar criteriosamente as pecas e coudelarias presentes na plataforma para garantir o padrao de qualidade da marca.",
      intellectual: "3. Propriedade Intelectual",
      intellectual_text:
        "Todo o conteudo editorial, design e fotografias presentes no Jornal Lusitano e na loja sao propriedade exclusiva do Portal Lusitano ou dos seus parceiros devidamente identificados.",
      liability: "4. Limitacao de Responsabilidade",
      liability_text:
        "Embora envidemos todos os esforcos para garantir a precisao das informacoes sobre coudelarias e linhagens geneticas, o Portal Lusitano nao se responsabiliza por imprecisoes fornecidas por terceiros.",
    },

    // COMUM
    common: {
      loading: "A carregar...",
      error: "Erro",
      success: "Sucesso",
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      back: "Voltar",
      next: "Proximo",
      previous: "Anterior",
      search: "Pesquisar",
      search_placeholder: "Pesquisar artigos, produtos...",
      filter: "Filtrar",
      sort: "Ordenar",
      all: "Todos",
      none: "Nenhum",
      yes: "Sim",
      no: "Nao",
      close: "Fechar",
      home: "Inicio",
    },

    // FOOTER
    footer: {
      rights: "Todos os direitos reservados",
      privacy: "Privacidade",
      terms: "Termos",
    },
  },

  // INGLES
  en: {
    nav: { home: "Home", shop: "Shop", about: "About", journal: "Journal" },
    cart: "Bag",

    // HOME
    home: {
      est: "Est. 2023 - Portugal",
      title_prefix: "The",
      title_main: "LUSITANO NOBILITY",
      hero_text: "The perfect union between secular equestrian tradition and contemporary design.",
      cta: "Explore Collection",
      curation: "Curation",
      featured: "Featured Collection",
      view_all: "View All",
      manifesto: "We don't just create clothing. We create symbols of belonging.",
      scroll: "Scroll",
    },

    // SHOP
    shop: {
      est: "Est. Portugal MMXXIII",
      title: "Archive & Collection",
      subtitle: "Heritage pieces.",
      examine: "Examine",
      price_suffix: "EUR",
      collection: "Collection 2026",
      legacy: "The Lusitano Legacy",
      legacy_subtitle: "Where equestrian tradition meets contemporary elegance",
      discover: "Discover",
      not_found: "Piece not found",
      not_found_text: "The system could not find the piece with handle:",
      back_collection: "Back to Collection",
    },

    // ABOUT
    about: {
      title: "Our Mission",
      subtitle: "Portal Lusitano was born to elevate the Lusitano Horse to the global stage.",
      story_title: "The Origin",
      story_text:
        "Founded by Francisco Gaspar, Portal Lusitano unites digital engineering with equestrian passion.",
      values_title: "Our Values",
      value1: "Tradition",
      value2: "Innovation",
      value3: "Excellence",
      founder: "Founder",
    },

    // JOURNAL (unified: articles + chronicles)
    journal: {
      archive: "Editorial Archive",
      title: "Lusitano Encyclopedia",
      subtitle: "In-depth research on the history, science and art of the Portuguese horse.",
      technical_read: "Technical Reading",
      read_study: "Read Study",
      unavailable: "Article Unavailable",
      unavailable_text: "The content you are looking for was not found.",
      back: "Back to Journal",
      back_archive: "Back to Digital Archive",
      peer_reviewed: "Peer-Reviewed",
      scientific_research: "Scientific Research",
      preservation: "Equestrian Knowledge Preservation",
      preservation_text:
        "This article is part of the digital archiving project of scientific knowledge about the Lusitano Horse, the most influential equestrian breed of Western civilization.",
      support: "Support the Project",
      explore_archive: "Explore Archive",
      share: "Share",
      all_categories: "All Categories",
      search_placeholder: "Search articles...",
      no_results: "No articles found.",
      related_articles: "Related Articles",
      table_of_contents: "Contents",
      sources: "Sources & References",
      min_read: "min read",
      view_grid: "Grid view",
      view_list: "List view",
      load_more: "Load more",
      article_type: "Article",
      post_type: "Chronicle",
      read_chronicle: "Read Chronicle",
      no_cover: "No Cover",
      culture: "Lusitano Culture",
    },

    // BLOG (deprecated - redirects to /jornal)
    blog: {
      editorial: "Editorial",
      title: "Lusitano Journal",
      subtitle: "Chronicles, culture and the legacy of the world's oldest horse.",
      no_cover: "No Cover",
      read: "Read Chronicle",
      no_news: "No news published",
      culture: "Lusitano Culture",
      not_found: "Article not found.",
    },

    // LOGIN
    login: {
      reserved: "Reserved Access",
      title: "Portal ID",
      email: "Email",
      password: "Password",
      recover: "Recover",
      logging_in: "Logging in...",
      enter: "Enter Account",
      no_invite: "No invite yet?",
      create: "Create Account",
    },

    // REGISTER
    register: {
      new_member: "New Member",
      title: "Create Passport",
      name: "First Name",
      surname: "Last Name",
      email: "Email",
      password: "Password",
      creating: "Creating Account...",
      confirm: "Confirm Registration",
      already_member: "Already a member?",
      enter: "Sign In",
    },

    // MY ACCOUNT
    account: {
      private_area: "Private Area",
      hello: "Hello",
      logout: "Sign Out",
      profile: "My Profile",
      name: "First Name",
      surname: "Last Name",
      email: "Email",
      history: "Purchase History",
      order: "Order",
      no_orders: "You don't have any purchases yet.",
      explore: "Explore Collection",
    },

    // STUD FARMS
    studs: {
      directory: "Prestige Directory",
      title: "The Great Houses",
      subtitle:
        "An exclusive selection of breeders keeping the flame of the Lusitano breed alive. History, genetics and passion in every stud farm.",
      no_image: "No Image",
      view_profile: "View Profile",
      breeder: "Are you a breeder?",
      join: "Join the Portal",
    },

    // AUCTIONS
    auctions: {
      offline: "Live Bidding Offline",
      title: "Auction Room",
      subtitle:
        "Portal Lusitano auctions are exclusive events. The next event is scheduled for March 2026.",
      lot: "Lot",
      lineage: "Lineage",
      last_bid: "Last Bid",
      time_left: "Time Left",
      closed: "Closed",
      auction_closed: "Auction Closed",
      bid_note: "To bid, you need a verified account and active deposit.",
      back: "Back to Auctions",
      pure_blood: "Pure Blood Lusitano",
      reference_value: "Reference Value",
      on_request: "On Request",
      direct_sale: "Direct Sale",
      whatsapp: "Questions via WhatsApp",
      age: "Age",
      brand: "Brand",
      years: "years",
      description: "Editorial Description",
      loading: "Loading elite specimen...",
      other_specimens: "Other Elite Specimens",
    },

    // BUY
    buy: {
      marketplace: "Prestige Marketplace",
      title: "Buy Specimen",
      no_photo: "No Photo",
      no_specimens: "No specimens approved for sale at the moment.",
      pure_lineage: "Pure Lineage",
      reg: "REG",
      age: "Age",
      years: "Years",
      location: "Location",
      apsl_score: "APSL Score",
      pts: "pts",
      technical_opinion: "Technical Opinion",
      blood_certificate: "Blood Certificate",
      verified_data: "Data verified via Digital Stud-Book",
      digital_asset: "Digital Asset",
      blockchain: "Blockchain Verified",
      nft_certificate: "NFT Certificate",
      nft_description: "This specimen has a Digital Twin registered on the Polygon network...",
      token_id: "Token ID",
      contract: "Contract",
      standard: "Standard",
      request_dossier: "Request Dossier & Visit",
      members_only: "Exclusive for Portal Lusitano members",
      not_found: "Specimen not found.",
    },

    // PRIVACY
    privacy: {
      security: "Security",
      title: "Privacy Policy",
      data_privacy: "Data Privacy",
      data_text:
        "At Portal Lusitano, we treat your personal data with the same rigor we treat the genetics of our breed. Your member data (Portal ID) is used exclusively to manage your account and purchase history.",
      collection: "Information Collection",
      collection_text:
        "We collect information when you register on our site, make a purchase or subscribe to our newsletter. This includes your name, email and billing address.",
      cookies: "Cookies and Shopify",
      cookies_text:
        "We use cookies to improve your browsing experience and process items in your shopping bag through Shopify's secure infrastructure.",
    },

    // TERMS
    terms: {
      legal: "Legal",
      title: "Terms & Conditions",
      scope: "1. Scope of Service",
      scope_text:
        "Portal Lusitano operates as a marketplace and editorial platform dedicated to the Lusitano breed. By accessing our site, the user agrees to comply with these terms of use.",
      marketplace: "2. Elite Marketplace",
      marketplace_text:
        "Commercial transactions carried out through our store are processed securely. Portal Lusitano reserves the right to carefully select the pieces and stud farms present on the platform to guarantee the brand's quality standard.",
      intellectual: "3. Intellectual Property",
      intellectual_text:
        "All editorial content, design and photographs present in the Lusitano Journal and store are the exclusive property of Portal Lusitano or its duly identified partners.",
      liability: "4. Limitation of Liability",
      liability_text:
        "Although we make every effort to ensure the accuracy of information about stud farms and genetic lineages, Portal Lusitano is not responsible for inaccuracies provided by third parties.",
    },

    // COMMON
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",
      search_placeholder: "Search articles, products...",
      filter: "Filter",
      sort: "Sort",
      all: "All",
      none: "None",
      yes: "Yes",
      no: "No",
      close: "Close",
      home: "Home",
    },

    // FOOTER
    footer: {
      rights: "All rights reserved",
      privacy: "Privacy",
      terms: "Terms",
    },
  },
};

type Language = "pt" | "en";
interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (typeof translations)["pt"];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function getInitialLanguage(): Language {
  if (typeof document === "undefined") return "pt";
  const cookieLocale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("locale="))
    ?.split("=")[1];
  return cookieLocale === "en" ? "en" : "pt";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  // Actualizar <html lang> e cookie quando o idioma muda
  useEffect(() => {
    document.documentElement.lang = language;
    document.cookie = `locale=${language}; path=/; samesite=lax; max-age=${60 * 60 * 24 * 365}`;
  }, [language]);

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

// Componentes de JSON-LD para SEO estruturado

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

// Schema da Organizacao
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Portal Lusitano",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "Marketplace premium de cavalos Lusitanos. Loja equestre, leiloes exclusivos e arquivo editorial.",
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Portuguese", "English"],
    },
    sameAs: ["https://instagram.com/portal_lusitano", "https://tiktok.com/@portal_lusitano"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema do Website
export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Portal Lusitano",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/pesquisa?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema de Produto
interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  price: string;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  sku?: string;
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency = "EUR",
  availability = "InStock",
  sku,
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    sku,
    brand: {
      "@type": "Brand",
      name: "Portal Lusitano",
    },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      seller: {
        "@type": "Organization",
        name: "Portal Lusitano",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema de Artigo
interface ArticleSchemaProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  author?: string;
}

export function ArticleSchema({
  title,
  description,
  image,
  datePublished,
  author = "Portal Lusitano",
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    author: {
      "@type": "Organization",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Portal Lusitano",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema de Breadcrumb
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema de FAQ
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema de Evento
interface EventSchemaProps {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  address?: string;
  image?: string;
  price?: string;
  organizer?: string;
}

export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  address,
  image,
  price,
  organizer = "Portal Lusitano",
}: EventSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    endDate: endDate || startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: location
      ? "https://schema.org/OfflineEventAttendanceMode"
      : "https://schema.org/OnlineEventAttendanceMode",
    location: location
      ? {
          "@type": "Place",
          name: location,
          address: address || location,
        }
      : {
          "@type": "VirtualLocation",
          url: siteUrl,
        },
    organizer: {
      "@type": "Organization",
      name: organizer,
      url: siteUrl,
    },
    image,
    offers: price
      ? {
          "@type": "Offer",
          price: price === "Gratuito" ? "0" : price.replace(/[^0-9]/g, ""),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema de Local Business (para coudelarias)
interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  address: string;
  telephone?: string;
  email?: string;
  website?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
}

export function LocalBusinessSchema({
  name,
  description,
  address,
  telephone,
  email,
  website,
  image,
  rating,
  reviewCount,
}: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/directorio/${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    description,
    address: {
      "@type": "PostalAddress",
      addressLocality: address,
      addressCountry: "PT",
    },
    telephone,
    email,
    url: website || siteUrl,
    image,
    aggregateRating:
      rating && reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: rating,
            reviewCount: reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
    priceRange: "€€€",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema de Cavalo à Venda
interface HorseSchemaProps {
  name: string;
  description: string;
  image?: string;
  price?: number;
  breed?: string;
  age?: number;
  color?: string;
  seller?: string;
  location?: string;
}

export function HorseSchema({
  name,
  description,
  image,
  price,
  breed = "Lusitano",
  age,
  color,
  seller,
  location,
}: HorseSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: {
      "@type": "Brand",
      name: breed,
    },
    category: "Horses",
    additionalProperty: [
      age ? { "@type": "PropertyValue", name: "Age", value: `${age} years` } : null,
      color ? { "@type": "PropertyValue", name: "Color", value: color } : null,
      { "@type": "PropertyValue", name: "Breed", value: breed },
    ].filter(Boolean),
    offers: {
      "@type": "Offer",
      price: price || undefined,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: seller || "Portal Lusitano",
        address: location,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema de ItemList (para listas de itens - cavalos, ferramentas, etc.)
interface ItemListItem {
  name: string;
  description?: string;
  url?: string;
  image?: string;
}

export function ItemListSchema({
  name,
  description,
  items,
}: {
  name: string;
  description?: string;
  items: ItemListItem[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      description: item.description,
      url: item.url,
      image: item.image,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema de Pagina de Coleccao (para listagens)
interface CollectionPageSchemaProps {
  name: string;
  description: string;
  url: string;
}

export function CollectionPageSchema({ name, description, url }: CollectionPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: "Portal Lusitano",
      url: siteUrl,
    },
    inLanguage: "pt-PT",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema de Aplicacao Web (para ferramentas)
interface WebApplicationSchemaProps {
  name: string;
  description: string;
  url: string;
}

export function WebApplicationSchema({ name, description, url }: WebApplicationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    provider: {
      "@type": "Organization",
      name: "Portal Lusitano",
      url: siteUrl,
    },
    inLanguage: "pt-PT",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema de Pagina Medica (para piroplasmose)
export function MedicalWebPageSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "Piroplasmose Equina — Guia Completo",
    description:
      "Guia completo sobre piroplasmose equina: prevalência em Portugal, impacto na exportação, diagnóstico, tratamento e prevenção.",
    url: `${siteUrl}/piroplasmose`,
    lastReviewed: "2026-02-01",
    about: {
      "@type": "MedicalCondition",
      name: "Piroplasmose Equina",
      alternateName: ["Equine Piroplasmosis", "Babesiose Equina"],
      associatedAnatomy: {
        "@type": "AnatomicalStructure",
        name: "Sangue (eritrócitos)",
      },
      cause: [
        { "@type": "InfectiveAgent", name: "Theileria equi" },
        { "@type": "InfectiveAgent", name: "Babesia caballi" },
      ],
    },
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Veterinários, Proprietários de Cavalos",
    },
    inLanguage: "pt-PT",
    publisher: {
      "@type": "Organization",
      name: "Portal Lusitano",
      url: siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Schema de Livro (para ebook)
export function BookSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: "Introdução ao Cavalo Lusitano",
    description:
      "O guia essencial para quem quer conhecer a raça mais nobre da Península Ibérica. História, linhagens, cuidados e dicas para compradores.",
    author: {
      "@type": "Organization",
      name: "Portal Lusitano",
    },
    publisher: {
      "@type": "Organization",
      name: "Portal Lusitano",
    },
    inLanguage: "pt",
    bookFormat: "https://schema.org/EBook",
    isAccessibleForFree: true,
    numberOfPages: 30,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/ebook-gratis`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

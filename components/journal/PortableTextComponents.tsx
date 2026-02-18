"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/lib/sanity-image";
import {
  ArticleInfoBox,
  ArticleStatCard,
  ArticlePillarCard,
  ArticleSection,
  ArticleWarningBox,
  ArticleImage,
} from "./ArticleComponents";
import {
  BookOpen,
  AlertTriangle,
  Shield,
  Award,
  Heart,
  Dna,
  Target,
  Zap,
  Info,
  type LucideIcon,
} from "lucide-react";

// Mapa de nomes de ícone para componentes Lucide
const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  AlertTriangle,
  Shield,
  Award,
  Heart,
  Dna,
  Target,
  Zap,
  Info,
};

function getIcon(name?: string): LucideIcon {
  if (!name) return Info;
  return iconMap[name] || Info;
}

interface PortableTextRendererProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any[];
  language?: "pt" | "en" | "es";
}

// Componentes custom do Portable Text para o Jornal Lusitano
export const journalComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2
        id={
          typeof children === "string"
            ? children.toString().toLowerCase().replace(/\s+/g, "-")
            : undefined
        }
        className="text-4xl font-serif text-[var(--gold)] mb-6 mt-16 border-b border-[var(--border)] pb-4"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={
          typeof children === "string"
            ? children.toString().toLowerCase().replace(/\s+/g, "-")
            : undefined
        }
        className="text-2xl font-serif text-[var(--foreground)] mb-4 mt-10"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold text-[var(--foreground)] mb-3 mt-8">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[var(--gold)] pl-6 my-8 text-[var(--foreground-secondary)] italic font-serif text-lg">
        {children}
      </blockquote>
    ),
    leadParagraph: ({ children }) => (
      <p className="text-xl text-[var(--foreground-secondary)] leading-relaxed mb-8 first-letter:float-left first-letter:text-7xl first-letter:font-serif first-letter:text-[var(--gold)] first-letter:mr-4 first-letter:leading-none first-letter:mt-2">
        {children}
      </p>
    ),
    normal: ({ children }) => (
      <p className="text-lg text-[var(--foreground-secondary)] leading-relaxed mb-6">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-[var(--foreground-secondary)] text-lg ml-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-[var(--foreground-secondary)] text-lg ml-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-[var(--foreground)] font-bold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--gold)] hover:text-[#d4b06a] underline underline-offset-4 transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imageUrl = urlFor(value.asset).width(1200).quality(85).url();
      return (
        <ArticleImage
          src={imageUrl}
          alt={value.alt || "Imagem do artigo"}
          caption={value.caption}
        />
      );
    },
    infoBox: ({ value }) => {
      const Icon = getIcon(value.icon);
      return (
        <ArticleInfoBox title={value.title} icon={Icon} variant={value.variant || "default"}>
          {value.content && (
            <div className="text-[var(--foreground-secondary)] text-base leading-relaxed">
              <PortableText value={value.content} components={journalComponents} />
            </div>
          )}
        </ArticleInfoBox>
      );
    },
    statCardGroup: ({ value }) => (
      <div className="my-12">
        {value.title && (
          <h4 className="text-2xl font-serif text-[var(--gold)] mb-6 flex items-center gap-3">
            {value.icon &&
              (() => {
                const I = getIcon(value.icon);
                return <I size={24} />;
              })()}
            {value.title}
          </h4>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {value.cards?.map(
            (
              card: {
                value: string;
                title: string;
                subtitle: string;
                description?: string;
                highlight?: boolean;
                _key?: string;
              },
              i: number
            ) => (
              <ArticleStatCard
                key={card._key || i}
                value={card.value}
                title={card.title}
                subtitle={card.subtitle}
                description={card.description ? <span>{card.description}</span> : undefined}
                highlight={card.highlight}
              />
            )
          )}
        </div>
      </div>
    ),
    pillarCardGroup: ({ value }) => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {value.cards?.map((card: any, i: number) => {
          const Icon = getIcon(card.icon);
          return (
            <ArticlePillarCard key={card._key || i} icon={Icon} title={card.title}>
              {card.content && <PortableText value={card.content} components={journalComponents} />}
            </ArticlePillarCard>
          );
        })}
      </div>
    ),
    articleSection: ({ value }) => (
      <ArticleSection title={value.title}>
        <></>
      </ArticleSection>
    ),
    warningBox: ({ value }) => {
      const Icon = getIcon(value.icon);
      return (
        <ArticleWarningBox title={value.title} icon={Icon}>
          {value.content && (
            <div className="text-[var(--foreground-secondary)] text-base leading-relaxed">
              <PortableText value={value.content} components={journalComponents} />
            </div>
          )}
        </ArticleWarningBox>
      );
    },
  },
};

// Wrapper com suporte a idioma
export default function PortableTextRenderer({
  value,
  language: _language = "pt",
}: PortableTextRendererProps) {
  if (!value || value.length === 0) return null;
  return (
    <div className="article-body">
      <PortableText value={value} components={journalComponents} />
    </div>
  );
}

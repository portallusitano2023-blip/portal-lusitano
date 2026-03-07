"use client";

import Image from "next/image";
import React from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ARTICLE_IMAGE_SIZES } from "@/lib/constants";
import { slugifyHeading } from "@/lib/journal-utils";

// Tipos
interface ArticleInfoBoxProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  variant?: "default" | "warning";
}

interface ArticleStatCardProps {
  title: string;
  value: string;
  subtitle: string;
  description?: ReactNode;
  highlight?: boolean;
}

interface ArticleSectionProps {
  title: string;
  children: ReactNode;
}

interface ArticleWarningBoxProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}

interface ArticleImageProps {
  src: string;
  alt: string;
  caption?: string;
}

interface ArticlePillarCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

// Componente para caixas de informação
export function ArticleInfoBox({
  title,
  icon: Icon,
  children,
  variant = "default",
}: ArticleInfoBoxProps) {
  const isWarning = variant === "warning";
  return (
    <section
      className={`my-12 rounded-sm p-10 shadow-2xl ${
        isWarning
          ? "bg-gradient-to-r from-red-950/30 to-transparent border-l-4 border-red-800"
          : "bg-[var(--background-card)] border-l-4 border-[var(--gold)]"
      }`}
      aria-labelledby={`info-${slugifyHeading(title)}`}
    >
      <h4
        id={`info-${slugifyHeading(title)}`}
        className={`font-bold text-2xl mb-6 flex items-center gap-3 ${
          isWarning ? "text-red-400" : "text-[var(--gold)]"
        }`}
      >
        <Icon size={24} /> {title}
      </h4>
      {children}
    </section>
  );
}

// Componente para cartões de estatísticas
export function ArticleStatCard({
  title,
  value,
  subtitle,
  description,
  highlight = false,
}: ArticleStatCardProps) {
  return (
    <div
      className={`bg-[var(--background)]/40 p-6 rounded-sm border-l-4 ${
        highlight ? "border-[var(--gold)]" : "border-[var(--border)]"
      }`}
    >
      <h5
        className={`font-bold mb-2 ${
          highlight ? "text-[var(--gold)]" : "text-[var(--foreground)]"
        }`}
      >
        {title}
      </h5>
      <p className="text-3xl font-bold text-[var(--foreground)] mb-2">{value}</p>
      <p className="text-xs text-[var(--foreground-muted)] uppercase tracking-wider mb-3">
        {subtitle}
      </p>
      {description && <p className="text-sm text-[var(--foreground-secondary)]">{description}</p>}
    </div>
  );
}

// Componente para secções do artigo
export function ArticleSection({ title, children }: ArticleSectionProps) {
  return (
    <section className="mb-8 mt-20" aria-labelledby={`section-${slugifyHeading(title)}`}>
      <h3
        id={`section-${slugifyHeading(title)}`}
        className="text-4xl font-serif text-[var(--gold)] mb-8 border-b border-[var(--border)] pb-4"
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

// Componente para caixas de aviso
export function ArticleWarningBox({ title, icon: Icon, children }: ArticleWarningBoxProps) {
  return (
    <ArticleInfoBox title={title} icon={Icon} variant="warning">
      {children}
    </ArticleInfoBox>
  );
}

// Componente para imagens
export function ArticleImage({ src, alt, caption }: ArticleImageProps) {
  return (
    <figure className="my-12">
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm border border-[var(--border)]">
        <Image src={src} alt={alt} fill className="object-cover" sizes={ARTICLE_IMAGE_SIZES} />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-[var(--foreground-muted)] italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Componente para cartões de pilares (Toricidade, etc.)
export function ArticlePillarCard({ icon: Icon, title, children }: ArticlePillarCardProps) {
  return (
    <div className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-[var(--gold)]">
      <Icon className="text-[var(--gold)] mb-4" size={32} />
      <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">{title}</h4>
      <div className="text-[var(--foreground-secondary)] text-sm leading-relaxed">{children}</div>
    </div>
  );
}

// Componente Timeline vertical editorial
interface ArticleTimelineItem {
  date: string;
  title: string;
  description: string;
  highlight?: boolean;
}
interface ArticleTimelineProps {
  caption: string;
  items: ArticleTimelineItem[];
}
export function ArticleTimeline({ caption, items }: ArticleTimelineProps) {
  return (
    <figure className="my-12" aria-label={caption}>
      <figcaption className="text-[9px] uppercase tracking-[0.35em] text-[var(--gold)] mb-8 flex items-center gap-3">
        <span className="h-[1px] w-6 bg-[var(--gold)]/40" />
        {caption}
        <span className="h-[1px] flex-1 bg-[var(--border)]" />
      </figcaption>
      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-[var(--gold)]/40 via-[var(--gold)]/20 to-transparent" />
        <div className="space-y-6">
          {items.map((item, i) => (
            <div key={i} className="relative flex gap-4">
              {/* Dot */}
              <div
                className={`absolute -left-8 top-1 w-3.5 h-3.5 rounded-full border flex-shrink-0 ${
                  item.highlight
                    ? "bg-[var(--gold)] border-[var(--gold)] shadow-[0_0_8px_rgba(197,160,89,0.5)]"
                    : "bg-[var(--background)] border-[var(--border)]"
                }`}
              />
              <div className={`bg-[var(--background-card)] border p-4 flex-1 ${item.highlight ? "border-[var(--gold)]/40" : "border-[var(--border)]"}`}>
                <span className={`text-[9px] uppercase tracking-widest font-bold block mb-1 ${item.highlight ? "text-[var(--gold)]" : "text-[var(--foreground-muted)]"}`}>
                  {item.date}
                </span>
                <p className="text-sm font-semibold text-[var(--foreground)] mb-1">{item.title}</p>
                <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}

// Componente tabela de dados genéticos / estatísticos
interface ArticleDataTableProps {
  caption: string;
  headers: string[];
  rows: (string | React.ReactNode)[][];
  sourceNote?: string;
}
export function ArticleDataTable({ caption, headers, rows, sourceNote }: ArticleDataTableProps) {
  return (
    <figure className="my-12 overflow-x-auto" aria-label={caption}>
      <figcaption className="text-[9px] uppercase tracking-[0.35em] text-[var(--gold)] mb-4 flex items-center gap-3">
        <span className="h-[1px] w-6 bg-[var(--gold)]/40" />
        {caption}
        <span className="h-[1px] flex-1 bg-[var(--border)]" />
      </figcaption>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[var(--gold)]/8 border border-[var(--gold)]/20">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-[9px] uppercase tracking-widest font-bold text-[var(--gold)] border-r border-[var(--gold)]/10 last:border-r-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className={`border-b border-[var(--border)] ${ri % 2 === 0 ? "bg-[var(--background-secondary)]/10" : "bg-transparent"}`}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-3 text-[var(--foreground-secondary)] text-xs leading-relaxed border-r border-[var(--border)] last:border-r-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {sourceNote && (
        <p className="mt-3 text-[10px] text-[var(--foreground-muted)] italic">{sourceNote}</p>
      )}
    </figure>
  );
}

// Componente pull quote editorial
interface ArticleQuoteProps {
  quote: string;
  author: string;
  source: string;
}
export function ArticleQuote({ quote, author, source }: ArticleQuoteProps) {
  return (
    <blockquote className="my-12 pl-8 border-l-4 border-[var(--gold)] relative">
      <div className="absolute top-0 left-3 text-[var(--gold)]/20 text-6xl font-serif leading-none select-none" aria-hidden="true">"</div>
      <p className="text-2xl font-serif italic text-[var(--foreground)] leading-relaxed mb-4 relative z-10">
        {quote}
      </p>
      <footer>
        <span className="text-[10px] uppercase tracking-[0.35em] text-[var(--gold)] font-semibold">{author}</span>
        <span className="text-[10px] text-[var(--foreground-muted)] ml-3">— {source}</span>
      </footer>
    </blockquote>
  );
}

// Classes de texto reutilizáveis
export const articleTextClasses = {
  lead: "text-xl text-[var(--foreground-secondary)] leading-relaxed mb-8",
  body: "text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8",
  dropCap: "float-left text-7xl font-serif text-[var(--gold)] mr-4 leading-none mt-2",
} as const;

"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ARTICLE_IMAGE_SIZES } from "@/lib/constants";

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
      aria-labelledby={`info-${title.replace(/\s/g, "-")}`}
    >
      <h4
        id={`info-${title.replace(/\s/g, "-")}`}
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
    <article
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
    </article>
  );
}

// Componente para secções do artigo
export function ArticleSection({ title, children }: ArticleSectionProps) {
  return (
    <section className="mb-8 mt-20" aria-labelledby={`section-${title.replace(/\s/g, "-")}`}>
      <h3
        id={`section-${title.replace(/\s/g, "-")}`}
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
      <div className="relative w-full h-[400px] overflow-hidden rounded-sm border border-[var(--border)]">
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
    <article className="bg-[var(--background-secondary)] p-8 rounded-sm border-l-4 border-[var(--gold)]">
      <Icon className="text-[var(--gold)] mb-4" size={32} />
      <h4 className="text-[var(--foreground)] font-bold text-xl mb-4">{title}</h4>
      <div className="text-[var(--foreground-secondary)] text-sm leading-relaxed">{children}</div>
    </article>
  );
}

// Classes de texto reutilizáveis
export const articleTextClasses = {
  lead: "text-xl text-[var(--foreground-secondary)] leading-relaxed mb-8",
  body: "text-lg text-[var(--foreground-secondary)] leading-relaxed mb-8",
  dropCap: "float-left text-7xl font-serif text-[var(--gold)] mr-4 leading-none mt-2",
} as const;

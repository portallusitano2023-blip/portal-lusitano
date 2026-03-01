"use client";

import { ExternalLink, BookOpen } from "lucide-react";

interface Source {
  label: string;
  url: string;
}

interface SourcesListProps {
  sources: Source[];
  language?: "pt" | "en" | "es";
}

export default function SourcesList({ sources, language = "pt" }: SourcesListProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <section
      className="mt-16 pt-8 border-t border-[var(--border)]"
      aria-label={
        language === "pt"
          ? "Fontes e Referências"
          : language === "es"
            ? "Fuentes y Referencias"
            : "Sources and References"
      }
    >
      <h3 className="text-xl font-serif text-[var(--gold)] mb-6 flex items-center gap-3">
        <BookOpen size={20} />
        {language === "pt"
          ? "Fontes e Referências"
          : language === "es"
            ? "Fuentes y Referencias"
            : "Sources & References"}
      </h3>
      <ul className="space-y-3">
        {sources.map((source, i) => (
          <li key={i}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--gold)] transition-colors"
            >
              <ExternalLink
                size={14}
                className="mt-0.5 flex-shrink-0 text-[var(--foreground-muted)] group-hover:text-[var(--gold)]"
              />
              <span className="underline underline-offset-4 decoration-[var(--border)] group-hover:decoration-[var(--gold)]">
                {source.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

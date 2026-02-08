"use client";

import { ExternalLink, BookOpen } from "lucide-react";

interface Source {
  label: string;
  url: string;
}

interface SourcesListProps {
  sources: Source[];
  language?: "pt" | "en";
}

export default function SourcesList({ sources, language = "pt" }: SourcesListProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <section
      className="mt-16 pt-8 border-t border-white/10"
      aria-label={language === "pt" ? "Fontes e Referências" : "Sources and References"}
    >
      <h3 className="text-xl font-serif text-[#C5A059] mb-6 flex items-center gap-3">
        <BookOpen size={20} />
        {language === "pt" ? "Fontes e Referências" : "Sources & References"}
      </h3>
      <ul className="space-y-3">
        {sources.map((source, i) => (
          <li key={i}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 text-sm text-zinc-400 hover:text-[#C5A059] transition-colors"
            >
              <ExternalLink
                size={14}
                className="mt-0.5 flex-shrink-0 text-zinc-600 group-hover:text-[#C5A059]"
              />
              <span className="underline underline-offset-4 decoration-zinc-700 group-hover:decoration-[#C5A059]">
                {source.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

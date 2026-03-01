"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

export default function NotFound() {
  const { language } = useLanguage();
  const tr = createTranslator(language);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-[var(--gold)] text-sm uppercase tracking-[0.3em] mb-4">404</p>
      <h1 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-4">
        {tr("Artigo Não Encontrado", "Article Not Found", "Artículo No Encontrado")}
      </h1>
      <p className="text-[var(--foreground-muted)] mb-8 max-w-md">
        {tr(
          "O artigo que procura não existe ou foi removido. Visite o nosso jornal para ler as últimas notícias.",
          "The article you are looking for does not exist or has been removed. Visit our journal to read the latest news.",
          "El artículo que busca no existe o fue eliminado. Visite nuestro diario para leer las últimas noticias."
        )}
      </p>
      <Link
        href="/jornal"
        className="border border-[var(--gold)]/30 px-8 py-3 text-[10px] uppercase tracking-[0.3em] text-[var(--foreground)] hover:bg-[var(--gold)] hover:text-black transition-all duration-300"
      >
        {tr("Ver Todos os Artigos", "View All Articles", "Ver Todos los Artículos")}
      </Link>
    </div>
  );
}

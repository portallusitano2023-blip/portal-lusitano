"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  type: "product" | "article" | "page";
  title: string;
  description?: string;
  url: string;
  image?: string;
}

export function SearchButton({ onClick }: { onClick: () => void }) {
  const { t } = useLanguage();

  return (
    <button
      onClick={onClick}
      className="p-2 hover:bg-white/5 rounded-full transition-colors"
      aria-label={t.common.search}
    >
      <SearchIcon size={20} className="text-white/70 hover:text-white" />
    </button>
  );
}

export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input quando abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fechar com Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Pesquisa com debounce
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    // Simula pesquisa - pode ser substituido por API real
    // Por agora, pesquisa local em dados estaticos
    const mockResults: SearchResult[] = [];

    // Pesquisa em artigos do jornal
    const journalArticles = [
      { id: "1", title: language === "pt" ? "A Genese do Cavalo Iberico" : "The Genesis of the Iberian Horse", url: "/jornal/1" },
      { id: "2", title: language === "pt" ? "A Fisica da Reuniao" : "The Physics of Collection", url: "/jornal/2" },
      { id: "3", title: language === "pt" ? "O Standard Oficial APSL" : "The Official APSL Standard", url: "/jornal/3" },
      { id: "4", title: language === "pt" ? "Genetica de Pelagens" : "Coat Color Genetics", url: "/jornal/4" },
      { id: "5", title: language === "pt" ? "Toricidade: Selecao pelo Combate" : "Toricity: Selection by Combat", url: "/jornal/5" },
      { id: "6", title: language === "pt" ? "A Revolucao Olimpica" : "The Olympic Revolution", url: "/jornal/6" },
    ];

    journalArticles.forEach((article) => {
      if (article.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        mockResults.push({
          id: `journal-${article.id}`,
          type: "article",
          title: article.title,
          url: article.url,
        });
      }
    });

    // Pesquisa em paginas
    const pages = [
      { title: language === "pt" ? "Loja" : "Shop", url: "/loja" },
      { title: language === "pt" ? "Marketplace" : "Marketplace", url: "/marketplace" },
      { title: language === "pt" ? "Coudelarias" : "Studs", url: "/coudelarias" },
      { title: language === "pt" ? "Eventos" : "Events", url: "/eventos" },
      { title: language === "pt" ? "Blog" : "Blog", url: "/blog" },
      { title: language === "pt" ? "Jornal" : "Journal", url: "/jornal" },
    ];

    pages.forEach((page, index) => {
      if (page.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        mockResults.push({
          id: `page-${index}`,
          type: "page",
          title: page.title,
          url: page.url,
        });
      }
    });

    // Simula delay de API
    await new Promise((resolve) => setTimeout(resolve, 300));

    setResults(mockResults);
    setIsLoading(false);
  }, [language]);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleResultClick = () => {
    setQuery("");
    setResults([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-4 p-4 border-b border-white/10">
                <SearchIcon size={20} className="text-zinc-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.common.search_placeholder || "Pesquisar..."}
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-lg"
                />
                {isLoading && <Loader2 size={20} className="text-[#C5A059] animate-spin" />}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  aria-label={t.common.close}
                >
                  <X size={20} className="text-zinc-500" />
                </button>
              </div>

              {/* Resultados */}
              <div className="max-h-[60vh] overflow-y-auto">
                {results.length > 0 ? (
                  <ul className="py-2">
                    {results.map((result) => (
                      <li key={result.id}>
                        <Link
                          href={result.url}
                          onClick={handleResultClick}
                          className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors"
                        >
                          <div className="w-8 h-8 rounded bg-[#C5A059]/10 flex items-center justify-center">
                            <span className="text-[#C5A059] text-xs uppercase">
                              {result.type === "product" ? "P" : result.type === "article" ? "A" : "Pg"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{result.title}</p>
                            {result.description && (
                              <p className="text-sm text-zinc-500 line-clamp-1">{result.description}</p>
                            )}
                          </div>
                          <span className="text-xs text-zinc-600 uppercase tracking-wider">
                            {result.type === "product"
                              ? (language === "pt" ? "Produto" : "Product")
                              : result.type === "article"
                              ? (language === "pt" ? "Artigo" : "Article")
                              : (language === "pt" ? "Pagina" : "Page")}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : query.length >= 2 && !isLoading ? (
                  <div className="py-12 text-center">
                    <p className="text-zinc-500">
                      {language === "pt" ? "Nenhum resultado encontrado" : "No results found"}
                    </p>
                  </div>
                ) : query.length < 2 ? (
                  <div className="py-12 text-center">
                    <p className="text-zinc-600 text-sm">
                      {language === "pt" ? "Digite pelo menos 2 caracteres" : "Type at least 2 characters"}
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Atalhos */}
              <div className="px-4 py-3 border-t border-white/5 flex items-center gap-4 text-xs text-zinc-600">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-zinc-500">ESC</kbd>
                  {language === "pt" ? "para fechar" : "to close"}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

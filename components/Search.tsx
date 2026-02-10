"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search as SearchIcon, X, Loader2, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface SearchResult {
  id: string;
  type: "horse" | "product" | "article" | "event" | "stud" | "page";
  title: string;
  description?: string;
  url: string;
  image?: string;
}

type FilterType = "all" | "horse" | "event" | "stud" | "page";

const TYPE_LABELS: Record<string, { pt: string; en: string; badge: string }> = {
  horse: { pt: "Cavalo", en: "Horse", badge: "C" },
  product: { pt: "Produto", en: "Product", badge: "P" },
  article: { pt: "Artigo", en: "Article", badge: "A" },
  event: { pt: "Evento", en: "Event", badge: "E" },
  stud: { pt: "Coudelaria", en: "Stud", badge: "S" },
  page: { pt: "Página", en: "Page", badge: "Pg" },
};

const FILTER_TABS: Array<{ key: FilterType; pt: string; en: string }> = [
  { key: "all", pt: "Tudo", en: "All" },
  { key: "horse", pt: "Cavalos", en: "Horses" },
  { key: "event", pt: "Eventos", en: "Events" },
  { key: "stud", pt: "Coudelarias", en: "Studs" },
  { key: "page", pt: "Páginas", en: "Pages" },
];

const HISTORY_KEY = "portal-lusitano-search-history";
const MAX_HISTORY = 5;

function getSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveSearchHistory(term: string) {
  const history = getSearchHistory().filter((h) => h !== term);
  history.unshift(term);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
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
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  // Load history on open
  useEffect(() => {
    if (isOpen) {
      setHistory(getSearchHistory());
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault();
        saveSearchHistory(query);
        window.location.href = results[selectedIndex].url;
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, results, selectedIndex, query]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll("li");
      items[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  // Reset selected index on results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  // Pesquisa com debounce - API real
  const performSearch = useCallback(async (searchQuery: string, filter: FilterType) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const typeParam = filter !== "all" ? `&type=${filter}` : "";
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&limit=15${typeParam}`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query, activeFilter);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeFilter, performSearch]);

  const handleResultClick = () => {
    if (query.length >= 2) saveSearchHistory(query);
    setQuery("");
    setResults([]);
    setActiveFilter("all");
    onClose();
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
  };

  if (!isOpen) return null;

  const showHistory = query.length < 2 && history.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4 opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
        style={{ animationDelay: "0.05s" }}
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

          {/* Filter tabs */}
          {query.length >= 2 && (
            <div className="flex gap-1 px-4 py-2 border-b border-white/5 overflow-x-auto">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors whitespace-nowrap ${
                    activeFilter === tab.key
                      ? "bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30"
                      : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {language === "pt" ? tab.pt : tab.en}
                </button>
              ))}
            </div>
          )}

          {/* Resultados */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Search history */}
            {showHistory && (
              <div className="py-3">
                <p className="px-4 text-xs text-zinc-500 uppercase tracking-wider mb-2">
                  {language === "pt" ? "Pesquisas recentes" : "Recent searches"}
                </p>
                {history.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleHistoryClick(term)}
                    className="flex items-center gap-3 w-full px-4 py-2 hover:bg-white/5 transition-colors text-left"
                  >
                    <Clock size={14} className="text-zinc-600" />
                    <span className="text-sm text-zinc-300">{term}</span>
                    <ChevronRight size={14} className="text-zinc-600 ml-auto" />
                  </button>
                ))}
              </div>
            )}

            {/* Results */}
            {results.length > 0 ? (
              <ul ref={resultsRef} className="py-2">
                {results.map((result, index) => {
                  const typeInfo = TYPE_LABELS[result.type] || TYPE_LABELS.page;
                  return (
                    <li key={result.id}>
                      <Link
                        href={result.url}
                        onClick={handleResultClick}
                        className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                          index === selectedIndex
                            ? "bg-[#C5A059]/10 border-l-2 border-[#C5A059]"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <div className="w-8 h-8 rounded bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#C5A059] text-xs uppercase font-medium">
                            {typeInfo.badge}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{result.title}</p>
                          {result.description && (
                            <p className="text-sm text-zinc-500 line-clamp-1">
                              {result.description}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-zinc-400 uppercase tracking-wider flex-shrink-0">
                          {language === "pt" ? typeInfo.pt : typeInfo.en}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : query.length >= 2 && !isLoading ? (
              <div className="py-12 text-center">
                <p className="text-zinc-500">
                  {language === "pt" ? "Nenhum resultado encontrado" : "No results found"}
                </p>
                {activeFilter !== "all" && (
                  <button
                    onClick={() => setActiveFilter("all")}
                    className="mt-2 text-sm text-[#C5A059] hover:underline"
                  >
                    {language === "pt" ? "Pesquisar em tudo" : "Search in all"}
                  </button>
                )}
              </div>
            ) : !showHistory && query.length < 2 ? (
              <div className="py-12 text-center">
                <p className="text-zinc-400 text-sm">
                  {language === "pt"
                    ? "Digite pelo menos 2 caracteres"
                    : "Type at least 2 characters"}
                </p>
              </div>
            ) : null}
          </div>

          {/* Atalhos */}
          <div className="px-4 py-3 border-t border-white/5 flex items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-zinc-500">ESC</kbd>
              {language === "pt" ? "fechar" : "close"}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-zinc-500">↑↓</kbd>
              {language === "pt" ? "navegar" : "navigate"}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white/5 rounded text-zinc-500">↵</kbd>
              {language === "pt" ? "abrir" : "open"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

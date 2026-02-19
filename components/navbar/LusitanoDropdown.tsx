"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getDbItems, getCommunityItems } from "./navData";

export function LusitanoDropdown() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const dbItems = useMemo(() => getDbItems(t.nav), [t]);
  const communityItems = useMemo(() => getCommunityItems(t.nav), [t]);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={toggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors duration-300 py-2"
      >
        Lusitano
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
          <div className="w-[520px] grid grid-cols-2 gap-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
            {/* Coluna 1 — Base de Dados (primeiros 5) */}
            <div>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--gold)] mb-2 block font-medium">
                {t.nav.database}
              </span>
              {dbItems.slice(0, 5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className="dd-item"
                  onClick={close}
                >
                  <item.icon size={16} className={item.iconClass || "text-[var(--gold)]"} />
                  <div>
                    <div className="text-sm font-medium text-[var(--foreground)]">{item.label}</div>
                    <div className="text-[10px] text-[var(--foreground-muted)]">{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Coluna 2 — Base de Dados (restantes) + Comunidade */}
            <div>
              {dbItems.slice(5).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className="dd-item"
                  onClick={close}
                >
                  <item.icon size={16} className={item.iconClass || "text-[var(--gold)]"} />
                  <div>
                    <div className="text-sm font-medium text-[var(--foreground)]">{item.label}</div>
                    <div className="text-[10px] text-[var(--foreground-muted)]">{item.desc}</div>
                  </div>
                </Link>
              ))}

              <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--gold)] mb-2 mt-4 block font-medium">
                {t.nav.community}
              </span>
              {communityItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className="dd-item"
                  onClick={close}
                >
                  <item.icon size={16} className="text-[var(--gold)]" />
                  <div>
                    <div className="text-sm font-medium text-[var(--foreground)]">{item.label}</div>
                    <div className="text-[10px] text-[var(--foreground-muted)]">{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

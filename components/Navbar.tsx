"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect, useRef, memo } from "react";
import { usePathname } from "next/navigation";
import { DesktopMenu } from "./navbar/DesktopMenu";
import { NavIcons } from "./navbar/NavIcons";
import { MobileMenu } from "./navbar/MobileMenu";

// Lazy load - SearchModal só carrega quando o utilizador abre a pesquisa
const SearchModal = dynamic(
  () => import("./Search").then((mod) => ({ default: mod.SearchModal })),
  { ssr: false }
);

export default memo(function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fechar menu mobile quando a página muda
  useEffect(() => {
    setIsMobileOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
  }, [pathname]);

  // Detect scroll for better mobile UX (RAF-throttled, only updates on change)
  const scrolledRef = useRef(false);
  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const next = window.scrollY > 20;
        if (next !== scrolledRef.current) {
          scrolledRef.current = next;
          setScrolled(next);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <nav
      id="main-navigation"
      role="navigation"
      aria-label="Navegação principal"
      className={`fixed w-full z-50 border-b transition-all duration-300 ${scrolled ? "bg-[var(--nav-bg-scrolled)] border-[var(--border)] shadow-lg" : "bg-[var(--nav-bg)] border-[var(--border)]"}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between gap-4">
        {/* LOGÓTIPO COM IMAGEM */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Portal Lusitano"
            width={44}
            height={44}
            quality={90}
            priority
            className="w-9 h-9 md:w-11 md:h-11 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col justify-center">
            <span className="text-base md:text-lg lg:text-xl font-serif text-[var(--foreground)] tracking-wide group-hover:text-[var(--gold)] transition-colors leading-none whitespace-nowrap">
              PORTAL LUSITANO
            </span>
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[var(--foreground-muted)] mt-0.5 group-hover:text-[var(--gold)]/70 transition-colors leading-none">
              EST. 2023
            </span>
          </div>
        </Link>

        {/* MENU DESKTOP */}
        <DesktopMenu t={t} />

        {/* ICONES E IDIOMA */}
        <NavIcons
          language={language}
          t={t}
          isMobileOpen={isMobileOpen}
          onSearchClick={() => setIsSearchOpen(true)}
          onLanguageToggle={toggleLanguage}
          onMobileToggle={() => setIsMobileOpen(!isMobileOpen)}
        />
      </div>

      {/* Menu Mobile Expandido */}
      <MobileMenu
        isOpen={isMobileOpen}
        language={language}
        t={t}
        onLanguageToggle={toggleLanguage}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Modal de Pesquisa */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
});

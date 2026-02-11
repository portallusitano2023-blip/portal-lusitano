import Link from "next/link";
import { Heart, User, Gift } from "lucide-react";
import {
  MOBILE_DB_ITEMS,
  MOBILE_TOOLS_ITEMS,
  MOBILE_COMMUNITY_ITEMS,
  MOBILE_MAIN_NAV_ITEMS,
} from "./navData";

interface MobileMenuProps {
  isOpen: boolean;
  language: string;
  t: {
    nav: {
      home: string;
      shop: string;
      journal: string;
    };
  };
  wishlistCount: number;
  favoritesCount: number;
  onLanguageToggle: () => void;
  onClose: () => void;
}

export function MobileMenu({
  isOpen,
  language,
  t,
  wishlistCount,
  favoritesCount,
  onLanguageToggle,
  onClose,
}: MobileMenuProps) {
  if (!isOpen) return null;

  const mainNavItems = [
    { name: t.nav.home, href: "/", icon: MOBILE_MAIN_NAV_ITEMS[0].icon },
    { name: t.nav.shop, href: "/loja", icon: MOBILE_MAIN_NAV_ITEMS[1].icon },
    { name: t.nav.journal, href: "/jornal", icon: MOBILE_MAIN_NAV_ITEMS[2].icon },
    {
      name: language === "pt" ? "Sobre Nós" : "About Us",
      href: "/sobre",
      icon: MOBILE_MAIN_NAV_ITEMS[3].icon,
    },
  ];

  return (
    <div className="lg:hidden bg-[var(--background)] border-t border-[var(--border)] max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain">
      <div className="px-4 py-6 space-y-2">
        {/* Main Navigation */}
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 py-4 px-3 text-lg text-[var(--foreground-secondary)] hover:text-[var(--gold)] hover:bg-[var(--surface-hover)] transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
          >
            <item.icon size={20} className="text-[var(--foreground-muted)]" />
            {item.name}
          </Link>
        ))}

        {/* Lusitano Section Mobile - Grid Layout */}
        <div className="border-t border-[var(--border)] pt-4 mt-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)] mb-3 block px-3 font-medium">
            Base de Dados
          </span>
          <div className="grid grid-cols-2 gap-2">
            {MOBILE_DB_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-3 px-3 text-sm transition-colors rounded-lg active:scale-[0.98] touch-manipulation ${
                  item.highlight
                    ? "text-green-400 bg-green-500/10 border border-green-500/30"
                    : "text-[var(--foreground-secondary)] hover:text-[var(--gold)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <item.icon
                  size={18}
                  className={item.highlight ? "text-green-400" : "text-[var(--gold)]/70"}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Ferramentas Mobile */}
        <div className="border-t border-[var(--border)] pt-4 mt-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)] mb-3 block px-3 font-medium">
            Ferramentas
          </span>
          <div className="grid grid-cols-2 gap-2">
            {MOBILE_TOOLS_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 py-3 px-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--gold)] hover:bg-[var(--surface-hover)] transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
              >
                <item.icon size={18} className="text-[var(--gold)]/70" />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Comunidade Mobile */}
        <div className="border-t border-[var(--border)] pt-4 mt-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)] mb-3 block px-3 font-medium">
            Comunidade
          </span>
          <div className="grid grid-cols-2 gap-2">
            {MOBILE_COMMUNITY_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 py-3 px-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--gold)] hover:bg-[var(--surface-hover)] transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
              >
                <item.icon size={18} className="text-[var(--gold)]/70" />
                <span className="truncate">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Favorites Section */}
        <div className="border-t border-[var(--border)] pt-4 mt-4">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/cavalos-favoritos"
              className="flex items-center gap-3 py-3 px-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--gold)] hover:bg-[var(--surface-hover)] transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
            >
              <Heart size={18} className="text-red-400" />
              <span>Cavalos Favoritos</span>
              {favoritesCount > 0 && (
                <span className="ml-auto bg-[var(--gold)] text-black text-xs px-2 py-0.5 rounded-full font-bold">
                  {favoritesCount}
                </span>
              )}
            </Link>
            <Link
              href="/favoritos"
              className="flex items-center gap-3 py-3 px-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--gold)] hover:bg-[var(--surface-hover)] transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
            >
              <Heart size={18} className="text-pink-400" />
              <span>Loja Favoritos</span>
              {wishlistCount > 0 && (
                <span className="ml-auto bg-[var(--gold)] text-black text-xs px-2 py-0.5 rounded-full font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Additional Links */}
        <div className="border-t border-[var(--border)] pt-4 mt-4 space-y-2">
          <Link
            href="/instagram"
            className="flex items-center gap-4 py-3 px-3 text-[var(--foreground-secondary)] hover:text-[var(--gold)] hover:bg-[var(--surface-hover)] transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
          >
            Publicidade / Instagram
          </Link>
          <Link
            href="/minha-conta"
            className="flex items-center gap-4 py-3 px-3 text-[var(--foreground-secondary)] hover:text-[var(--gold)] hover:bg-[var(--surface-hover)] transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
          >
            <User size={18} className="text-[var(--foreground-muted)]" />
            Minha Conta
          </Link>
        </div>

        {/* CTA & Language */}
        <div className="border-t border-white/10 pt-4 mt-4 space-y-3">
          <Link
            href="/ebook-gratis"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black px-4 py-4 text-sm uppercase tracking-widest font-bold w-full rounded-lg active:scale-[0.98] touch-manipulation shadow-[0_0_20px_rgba(197,160,89,0.2)]"
          >
            <Gift size={18} />
            Ebook Grátis
          </Link>
          <button
            onClick={() => {
              onLanguageToggle();
              onClose();
            }}
            className="w-full text-center py-3 px-3 text-zinc-400 hover:text-white transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
          >
            {language === "pt"
              ? "🇬🇧 Switch to English"
              : language === "en"
                ? "🇪🇸 Cambiar a Español"
                : "🇵🇹 Mudar para Português"}
          </button>
        </div>
      </div>
    </div>
  );
}

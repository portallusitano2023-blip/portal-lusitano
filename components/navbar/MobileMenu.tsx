import { useMemo, memo } from "react";
import Link from "next/link";
import { Heart, User, Gift } from "lucide-react";
import { usePathname } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { useHorseFavorites } from "@/context/HorseFavoritesContext";
import {
  getMobileDbItems,
  getMobileToolsItems,
  getMobileCommunityItems,
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
      about: string;
      database: string;
      tools: string;
      community: string;
      horse_favorites: string;
      shop_favorites: string;
      advertising: string;
      my_account: string;
      free_ebook: string;
      buy_horse: string;
      buy_horse_desc: string;
      sell_horse: string;
      sell_horse_desc: string;
      studs: string;
      studs_desc: string;
      map: string;
      map_desc: string;
      events: string;
      events_desc: string;
      lineages: string;
      lineages_desc: string;
      piroplasmosis: string;
      piroplasmosis_desc: string;
      calculator: string;
      calculator_desc: string;
      comparator: string;
      comparator_desc: string;
      compatibility: string;
      compatibility_desc: string;
      professionals: string;
      professionals_desc: string;
      notable_lusitanos: string;
      notable_lusitanos_desc: string;
      profile_analysis: string;
      profile_analysis_desc: string;
    };
  };
  onLanguageToggle: () => void;
  onClose: () => void;
}

export const MobileMenu = memo(function MobileMenu({
  isOpen,
  language,
  t,
  onLanguageToggle,
  onClose,
}: MobileMenuProps) {
  const { wishlist } = useWishlist();
  const { favoritesCount } = useHorseFavorites();
  const wishlistCount = wishlist.length;
  const pathname = usePathname();

  const mobileDbItems = useMemo(() => getMobileDbItems(t.nav), [t]);
  const mobileToolsItems = useMemo(() => getMobileToolsItems(t.nav), [t]);
  const mobileCommunityItems = useMemo(() => getMobileCommunityItems(t.nav), [t]);

  // Memoized to avoid rebuilding a new array reference on every render.
  // Icons are stable module-level references so they are safe to include.
  const mainNavItems = useMemo(
    () => [
      { name: t.nav.home, href: "/", icon: MOBILE_MAIN_NAV_ITEMS[0].icon },
      { name: t.nav.shop, href: "/loja", icon: MOBILE_MAIN_NAV_ITEMS[1].icon },
      { name: t.nav.journal, href: "/jornal", icon: MOBILE_MAIN_NAV_ITEMS[2].icon },
      { name: t.nav.about, href: "/sobre", icon: MOBILE_MAIN_NAV_ITEMS[3].icon },
    ],
    [t.nav.home, t.nav.shop, t.nav.journal, t.nav.about]
  );

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  if (!isOpen) return null;

  return (
    <nav
      id="mobile-menu"
      aria-label="Menu mobile"
      className="lg:hidden bg-[var(--background)] border-t border-[var(--border)] max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain"
    >
      <div className="px-4 py-6 space-y-2">
        {/* Main Navigation */}
        {mainNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-4 py-4 px-3 text-lg transition-colors rounded-lg active:scale-[0.98] touch-manipulation ${
                active
                  ? "text-[var(--gold)] bg-[var(--surface-hover)]"
                  : "text-[var(--foreground-secondary)] hover:text-[var(--gold)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <item.icon size={20} className="text-[var(--foreground-muted)]" />
              {item.name}
            </Link>
          );
        })}

        {/* Lusitano Section Mobile - Grid Layout */}
        <div className="border-t border-[var(--border)] pt-4 mt-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)] mb-3 block px-3 font-medium">
            {t.nav.database}
          </span>
          <div className="grid grid-cols-2 gap-2">
            {mobileDbItems.map((item) => (
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
            {t.nav.tools}
          </span>
          <div className="grid grid-cols-2 gap-2">
            {mobileToolsItems.map((item) => (
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
            {t.nav.community}
          </span>
          <div className="grid grid-cols-2 gap-2">
            {mobileCommunityItems.map((item) => (
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
              <span>{t.nav.horse_favorites}</span>
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
              <span>{t.nav.shop_favorites}</span>
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
            {t.nav.advertising} / Instagram
          </Link>
          <Link
            href="/minha-conta"
            className="flex items-center gap-4 py-3 px-3 text-[var(--foreground-secondary)] hover:text-[var(--gold)] hover:bg-[var(--surface-hover)] transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
          >
            <User size={18} className="text-[var(--foreground-muted)]" />
            {t.nav.my_account}
          </Link>
        </div>

        {/* CTA & Language */}
        <div className="border-t border-[var(--border)] pt-4 mt-4 space-y-3">
          <Link
            href="/ebook-gratis"
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-hover)] text-black px-4 py-4 text-sm uppercase tracking-widest font-bold w-full rounded-lg active:scale-[0.98] touch-manipulation shadow-[0_0_20px_rgba(197,160,89,0.2)]"
          >
            <Gift size={18} />
            {t.nav.free_ebook}
          </Link>
          <button
            onClick={() => {
              onLanguageToggle();
              onClose();
            }}
            className="w-full text-center py-3 px-3 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
          >
            {language === "pt"
              ? "Switch to English"
              : language === "en"
                ? "Cambiar a Español"
                : "Mudar para Português"}
          </button>
        </div>
      </div>
    </nav>
  );
});

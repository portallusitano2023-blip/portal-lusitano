"use client";

import { useState, memo } from "react";
import { usePathname } from "next/navigation";
import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/context/LanguageContext";
import { useHorseFavorites } from "@/context/HorseFavoritesContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  Home,
  ShoppingCart,
  Crown,
  Store,
  MoreHorizontal,
  X,
  BookOpen,
  Calendar,
  MapPin,
  Calculator,
  Users,
  Trophy,
  Heart,
  User,
  Gift,
  Euro,
  Scale,
  Dna,
  HelpCircle,
  Shield,
  Instagram,
} from "lucide-react";

export default memo(function BottomNav() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();
  const { favoritesCount } = useHorseFavorites();
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const mainTabs = [
    {
      href: "/",
      icon: Home,
      label: language === "pt" ? "Início" : language === "es" ? "Inicio" : "Home",
    },
    {
      href: "/comprar",
      icon: ShoppingCart,
      label: language === "pt" ? "Comprar" : language === "es" ? "Comprar" : "Buy",
    },
    {
      href: "/directorio",
      icon: Crown,
      label:
        language === "pt"
          ? "Coudelarias"
          : language === "es"
            ? "Cuadras"
            : "Studs",
    },
    {
      href: "/loja",
      icon: Store,
      label: language === "pt" ? "Loja" : language === "es" ? "Tienda" : "Shop",
    },
  ];

  return (
    <>
      {/* Bottom Tab Bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--nav-bg-scrolled)] border-t border-[var(--border)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Navegação principal"
      >
        <div className="flex items-stretch h-16">
          {mainTabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <LocalizedLink
                key={tab.href}
                href={tab.href}
                className={`relative flex-1 flex flex-col items-center justify-center gap-[3px] transition-colors touch-manipulation active:scale-95 ${
                  active
                    ? "text-[var(--gold)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
                }`}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[var(--gold)] rounded-full" />
                )}
                <tab.icon size={21} strokeWidth={active ? 2 : 1.5} />
                <span className="text-[9px] uppercase tracking-[0.07em] font-medium leading-none">
                  {tab.label}
                </span>
              </LocalizedLink>
            );
          })}

          {/* Mais */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className="relative flex-1 flex flex-col items-center justify-center gap-[3px] text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] transition-colors touch-manipulation active:scale-95"
            aria-label="Mais opções"
            aria-haspopup="dialog"
          >
            <MoreHorizontal size={21} strokeWidth={1.5} />
            <span className="text-[9px] uppercase tracking-[0.07em] font-medium leading-none">
              {language === "pt" ? "Mais" : language === "es" ? "Más" : "More"}
            </span>
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      {isMoreOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMoreOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-up Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--background)] border-t border-[var(--border)] rounded-t-2xl max-h-[82vh] overflow-y-auto overscroll-contain transition-transform duration-300 ${
          isMoreOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Drag handle */}
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[var(--border)] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]/50">
          <span className="text-sm font-medium uppercase tracking-widest text-[var(--foreground-secondary)]">
            Menu
          </span>
          <button
            onClick={() => setIsMoreOpen(false)}
            className="p-2 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors rounded-lg touch-manipulation"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 py-5 space-y-5">
          {/* Explorar */}
          <section>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)] mb-2 px-1 font-medium">
              {language === "pt" ? "Explorar" : language === "es" ? "Explorar" : "Explore"}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { href: "/jornal", icon: BookOpen, label: t.nav.journal },
                { href: "/eventos", icon: Calendar, label: t.nav.events },
                { href: "/mapa", icon: MapPin, label: t.nav.map },
                { href: "/linhagens", icon: BookOpen, label: t.nav.lineages },
                { href: "/vender-cavalo", icon: Euro, label: t.nav.sell_horse, highlight: true },
                { href: "/piroplasmose", icon: Shield, label: t.nav.piroplasmosis },
              ].map((item) => (
                <LocalizedLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMoreOpen(false)}
                  className={`flex items-center gap-3 py-3 px-3 text-sm rounded-xl transition-colors touch-manipulation active:scale-[0.97] ${
                    item.highlight
                      ? "text-green-400 bg-green-500/10 border border-green-500/20"
                      : "text-[var(--foreground-secondary)] hover:text-[var(--gold)] bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  <item.icon
                    size={17}
                    className={item.highlight ? "text-green-400" : "text-[var(--gold)]/70"}
                  />
                  <span className="truncate">{item.label}</span>
                </LocalizedLink>
              ))}
            </div>
          </section>

          {/* Ferramentas */}
          <section>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)] mb-2 px-1 font-medium">
              {t.nav.tools}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { href: "/calculadora-valor", icon: Calculator, label: t.nav.calculator },
                { href: "/comparador-cavalos", icon: Scale, label: t.nav.comparator },
                { href: "/verificador-compatibilidade", icon: Dna, label: t.nav.compatibility },
                { href: "/analise-perfil", icon: HelpCircle, label: t.nav.profile_analysis },
              ].map((item) => (
                <LocalizedLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 py-3 px-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--gold)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl transition-colors touch-manipulation active:scale-[0.97]"
                >
                  <item.icon size={17} className="text-[var(--gold)]/70" />
                  <span className="truncate">{item.label}</span>
                </LocalizedLink>
              ))}
            </div>
          </section>

          {/* Comunidade */}
          <section>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)] mb-2 px-1 font-medium">
              {t.nav.community}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { href: "/profissionais", icon: Users, label: t.nav.professionals },
                { href: "/cavalos-famosos", icon: Trophy, label: t.nav.notable_lusitanos },
              ].map((item) => (
                <LocalizedLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMoreOpen(false)}
                  className="flex items-center gap-3 py-3 px-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--gold)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl transition-colors touch-manipulation active:scale-[0.97]"
                >
                  <item.icon size={17} className="text-[var(--gold)]/70" />
                  <span className="truncate">{item.label}</span>
                </LocalizedLink>
              ))}
            </div>
          </section>

          {/* Conta & Favoritos */}
          <section>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)] mb-2 px-1 font-medium">
              {language === "pt" ? "Conta" : language === "es" ? "Cuenta" : "Account"}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <LocalizedLink
                href="/minha-conta"
                onClick={() => setIsMoreOpen(false)}
                className="flex items-center gap-3 py-3 px-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--gold)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl transition-colors touch-manipulation active:scale-[0.97]"
              >
                <User size={17} className="text-[var(--gold)]/70" />
                <span className="truncate">{t.nav.my_account}</span>
              </LocalizedLink>
              <LocalizedLink
                href="/cavalos-favoritos"
                onClick={() => setIsMoreOpen(false)}
                className="flex items-center gap-3 py-3 px-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--gold)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl transition-colors touch-manipulation active:scale-[0.97]"
              >
                <Heart size={17} className="text-red-400" />
                <span className="truncate">{t.nav.horse_favorites}</span>
                {favoritesCount > 0 && (
                  <span className="ml-auto bg-[var(--gold)] text-black text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                    {favoritesCount}
                  </span>
                )}
              </LocalizedLink>
              <LocalizedLink
                href="/favoritos"
                onClick={() => setIsMoreOpen(false)}
                className="flex items-center gap-3 py-3 px-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--gold)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl transition-colors touch-manipulation active:scale-[0.97]"
              >
                <Heart size={17} className="text-pink-400" />
                <span className="truncate">{t.nav.shop_favorites}</span>
                {wishlistCount > 0 && (
                  <span className="ml-auto bg-[var(--gold)] text-black text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                    {wishlistCount}
                  </span>
                )}
              </LocalizedLink>
              <LocalizedLink
                href="/instagram"
                onClick={() => setIsMoreOpen(false)}
                className="flex items-center gap-3 py-3 px-3 text-sm text-[var(--foreground-secondary)] hover:text-[var(--gold)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl transition-colors touch-manipulation active:scale-[0.97]"
              >
                <Instagram size={17} className="text-[var(--gold)]/70" />
                <span className="truncate">Instagram</span>
              </LocalizedLink>
            </div>
          </section>

          {/* CTA Ebook */}
          <LocalizedLink
            href="/ebook-gratis"
            onClick={() => setIsMoreOpen(false)}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-hover)] text-black px-4 py-4 text-sm uppercase tracking-widest font-bold w-full rounded-xl touch-manipulation shadow-[0_0_20px_rgba(197,160,89,0.2)] active:scale-[0.98]"
          >
            <Gift size={18} />
            {t.nav.free_ebook}
          </LocalizedLink>

          {/* Language */}
          <button
            onClick={() => {
              toggleLanguage();
              setIsMoreOpen(false);
            }}
            className="w-full text-center py-3 px-3 text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] transition-colors rounded-xl touch-manipulation text-sm"
          >
            {language === "pt"
              ? "Switch to English"
              : language === "en"
                ? "Cambiar a Español"
                : "Mudar para Português"}
          </button>
        </div>
      </div>
    </>
  );
});

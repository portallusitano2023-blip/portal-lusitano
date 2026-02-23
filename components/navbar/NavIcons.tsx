import { memo } from "react";
import Link from "next/link";
import { Search, Heart, User, ShoppingBag, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useHorseFavorites } from "@/context/HorseFavoritesContext";

interface NavIconsProps {
  language: string;
  t: { cart: string };
  isMobileOpen: boolean;
  onSearchClick: () => void;
  onLanguageToggle: () => void;
  onMobileToggle: () => void;
}

function tr3(lang: string, pt: string, en: string, es: string) {
  return lang === "pt" ? pt : lang === "es" ? es : en;
}

export const NavIcons = memo(function NavIcons({
  language,
  t,
  isMobileOpen,
  onSearchClick,
  onLanguageToggle,
  onMobileToggle,
}: NavIconsProps) {
  const { theme, toggleTheme } = useTheme();
  const { totalQuantity, openCart } = useCart();
  const { wishlist } = useWishlist();
  const { favoritesCount } = useHorseFavorites();
  const _wishlistCount = wishlist.length;

  return (
    <div className="flex items-center gap-2 md:gap-4">
      {/* Tema */}
      <button
        onClick={toggleTheme}
        className="text-[var(--foreground-secondary)] hover:text-[var(--gold)] transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 touch-manipulation"
        aria-label={
          theme === "dark"
            ? tr3(language, "Mudar para modo claro", "Switch to light mode", "Cambiar a modo claro")
            : tr3(
                language,
                "Mudar para modo escuro",
                "Switch to dark mode",
                "Cambiar a modo oscuro"
              )
        }
      >
        {theme === "dark" ? (
          <Sun size={20} strokeWidth={1.5} />
        ) : (
          <Moon size={20} strokeWidth={1.5} />
        )}
      </button>

      {/* Pesquisa */}
      <button
        onClick={onSearchClick}
        className="text-[var(--foreground-secondary)] hover:text-[var(--gold)] transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 touch-manipulation"
        aria-label={tr3(language, "Pesquisar", "Search", "Buscar")}
      >
        <Search size={20} strokeWidth={1.5} />
      </button>

      {/* Idioma */}
      <button
        onClick={onLanguageToggle}
        className="hidden lg:flex text-xs font-bold tracking-widest text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors border border-transparent hover:border-[var(--border)] px-2 py-1 rounded-sm"
        aria-label={tr3(language, "Mudar idioma", "Change language", "Cambiar idioma")}
      >
        <span className={language === "pt" ? "text-[var(--gold)]" : ""}>PT</span>
        <span className="mx-1 opacity-30 text-[var(--foreground-muted)]">|</span>
        <span className={language === "en" ? "text-[var(--gold)]" : ""}>EN</span>
        <span className="mx-1 opacity-30 text-[var(--foreground-muted)]">|</span>
        <span className={language === "es" ? "text-[var(--gold)]" : ""}>ES</span>
      </button>

      {/* Favoritos - only shows horse favorites count (links to /cavalos-favoritos) */}
      <Link
        href="/cavalos-favoritos"
        className="text-[var(--foreground-secondary)] hover:text-[var(--gold)] transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center relative active:scale-95 touch-manipulation"
        aria-label={
          language === "pt"
            ? "Cavalos Favoritos"
            : language === "es"
              ? "Caballos Favoritos"
              : "Favorite Horses"
        }
      >
        <Heart size={20} strokeWidth={1.5} />
        {favoritesCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-[var(--gold)] rounded-full flex items-center justify-center text-[10px] text-black font-bold">
            {favoritesCount}
          </span>
        )}
      </Link>

      {/* Conta */}
      <Link
        href="/minha-conta"
        className="hidden md:flex text-[var(--foreground-secondary)] hover:text-[var(--gold)] transition-colors p-2 min-w-[44px] min-h-[44px] items-center justify-center active:scale-95 touch-manipulation"
        aria-label={tr3(language, "Minha conta", "My account", "Mi cuenta")}
      >
        <User size={20} strokeWidth={1.5} />
      </Link>

      {/* Carrinho */}
      <button
        onClick={openCart}
        className="flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--gold)] transition-colors group active:scale-95 touch-manipulation"
        aria-label={`${tr3(language, "Carrinho", "Cart", "Carrito")} (${totalQuantity} ${tr3(language, "itens", "items", "artículos")})`}
      >
        <div className="relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ShoppingBag size={20} strokeWidth={1.5} />
          {totalQuantity > 0 && (
            <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-[var(--gold)] rounded-full flex items-center justify-center text-[10px] text-black font-bold">
              {totalQuantity}
            </span>
          )}
        </div>
        <span className="hidden xl:block text-[10px] uppercase tracking-widest group-hover:text-[var(--foreground)] font-medium">
          {t.cart} ({totalQuantity})
        </span>
      </button>

      {/* Menu Mobile */}
      <button
        className="lg:hidden text-[var(--foreground)] p-2 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 touch-manipulation"
        onClick={onMobileToggle}
        aria-label={
          isMobileOpen
            ? tr3(language, "Fechar menu", "Close menu", "Cerrar menú")
            : tr3(language, "Abrir menu", "Open menu", "Abrir menú")
        }
        aria-expanded={isMobileOpen}
        aria-controls="mobile-menu"
      >
        {isMobileOpen ? <X size={26} /> : <Menu size={26} />}
      </button>
    </div>
  );
});

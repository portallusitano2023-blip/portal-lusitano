import Link from "next/link";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";

interface NavIconsProps {
  language: string;
  t: { cart: string };
  wishlistCount: number;
  favoritesCount: number;
  totalQuantity: number;
  isMobileOpen: boolean;
  onSearchClick: () => void;
  onLanguageToggle: () => void;
  onCartClick: () => void;
  onMobileToggle: () => void;
}

export function NavIcons({
  language,
  t,
  wishlistCount,
  favoritesCount,
  totalQuantity,
  isMobileOpen,
  onSearchClick,
  onLanguageToggle,
  onCartClick,
  onMobileToggle,
}: NavIconsProps) {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      {/* Pesquisa */}
      <button
        onClick={onSearchClick}
        className="text-zinc-400 hover:text-[#C5A059] transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 touch-manipulation"
        aria-label={language === "pt" ? "Pesquisar" : "Search"}
      >
        <Search size={20} strokeWidth={1.5} />
      </button>

      {/* Idioma */}
      <button
        onClick={onLanguageToggle}
        className="hidden lg:flex text-xs font-bold tracking-widest text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-zinc-800 px-2 py-1 rounded-sm"
        aria-label={language === "pt" ? "Mudar idioma" : "Change language"}
      >
        <span className={language === "pt" ? "text-[#C5A059]" : ""}>PT</span>
        <span className="mx-1 opacity-30 text-zinc-400">|</span>
        <span className={language === "en" ? "text-[#C5A059]" : ""}>EN</span>
      </button>

      {/* Favoritos - Products + Horses */}
      <Link
        href="/cavalos-favoritos"
        className="text-zinc-400 hover:text-[#C5A059] transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center relative active:scale-95 touch-manipulation"
        aria-label={language === "pt" ? "Cavalos Favoritos" : "Favorite Horses"}
      >
        <Heart size={20} strokeWidth={1.5} />
        {wishlistCount + favoritesCount > 0 && (
          <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-[#C5A059] rounded-full flex items-center justify-center text-[10px] text-black font-bold">
            {wishlistCount + favoritesCount}
          </span>
        )}
      </Link>

      {/* Conta */}
      <Link
        href="/minha-conta"
        className="hidden md:flex text-zinc-400 hover:text-[#C5A059] transition-colors p-2 min-w-[44px] min-h-[44px] items-center justify-center active:scale-95 touch-manipulation"
        aria-label={language === "pt" ? "Minha conta" : "My account"}
      >
        <User size={20} strokeWidth={1.5} />
      </Link>

      {/* Carrinho */}
      <button
        onClick={onCartClick}
        className="flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors group active:scale-95 touch-manipulation"
        aria-label={`${language === "pt" ? "Carrinho" : "Cart"} (${totalQuantity} ${language === "pt" ? "itens" : "items"})`}
      >
        <div className="relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ShoppingBag size={20} strokeWidth={1.5} />
          {totalQuantity > 0 && (
            <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-[#C5A059] rounded-full flex items-center justify-center text-[10px] text-black font-bold">
              {totalQuantity}
            </span>
          )}
        </div>
        <span className="hidden xl:block text-[10px] uppercase tracking-widest group-hover:text-white font-medium">
          {t.cart} ({totalQuantity})
        </span>
      </button>

      {/* Menu Mobile */}
      <button
        className="lg:hidden text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 touch-manipulation"
        onClick={onMobileToggle}
        aria-label={
          isMobileOpen
            ? language === "pt"
              ? "Fechar menu"
              : "Close menu"
            : language === "pt"
              ? "Abrir menu"
              : "Open menu"
        }
        aria-expanded={isMobileOpen}
      >
        {isMobileOpen ? <X size={26} /> : <Menu size={26} />}
      </button>
    </div>
  );
}

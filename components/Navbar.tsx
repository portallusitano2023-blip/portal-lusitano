"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingBag, User, Menu, X, Search, Heart } from "lucide-react";
import { useState } from "react";
import { SearchModal } from "./Search";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
  const { totalQuantity, openCart } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const { wishlist } = useWishlist();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
        
        {/* LOGÓTIPO */}
        <Link href="/" className="flex flex-col justify-center group">
          <span className="text-2xl md:text-3xl font-serif text-white tracking-wide group-hover:text-[#C5A059] transition-colors leading-none">
            PORTAL LUSITANO
          </span>
          <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 mt-2 group-hover:text-[#C5A059]/70 transition-colors leading-none">
            EST. 2023
          </span>
        </Link>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-12">
          {[
            { name: t.nav.home, href: "/" },
            { name: t.nav.shop, href: "/loja" },
            { name: t.nav.journal, href: "/jornal" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[11px] uppercase tracking-[0.2em] text-zinc-300 hover:text-[#C5A059] transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#C5A059] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* ICONES E IDIOMA */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Pesquisa */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-zinc-400 hover:text-[#C5A059] transition-colors p-2"
            aria-label={language === 'pt' ? 'Pesquisar' : 'Search'}
          >
            <Search size={20} strokeWidth={1.5} />
          </button>

          {/* Idioma */}
          <button
            onClick={toggleLanguage}
            className="hidden md:flex text-xs font-bold tracking-widest text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-zinc-800 px-3 py-1 rounded-sm"
            aria-label={language === 'pt' ? 'Mudar idioma' : 'Change language'}
          >
            <span className={language === 'pt' ? "text-[#C5A059]" : ""}>PT</span>
            <span className="mx-2 opacity-30 text-zinc-600">|</span>
            <span className={language === 'en' ? "text-[#C5A059]" : ""}>EN</span>
          </button>

          {/* Favoritos */}
          <Link
            href="/favoritos"
            className="text-zinc-400 hover:text-[#C5A059] transition-colors p-2 relative"
            aria-label={language === 'pt' ? 'Favoritos' : 'Wishlist'}
          >
            <Heart size={20} strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C5A059] rounded-full flex items-center justify-center text-[9px] text-black font-bold">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Conta */}
          <Link
            href="/minha-conta"
            className="text-zinc-400 hover:text-[#C5A059] transition-colors p-2"
            aria-label={language === 'pt' ? 'Minha conta' : 'My account'}
          >
            <User size={20} strokeWidth={1.5} />
          </Link>

          {/* Carrinho */}
          <button
            onClick={openCart}
            className="flex items-center gap-3 text-zinc-400 hover:text-[#C5A059] transition-colors group"
            aria-label={`${language === 'pt' ? 'Carrinho' : 'Cart'} (${totalQuantity} ${language === 'pt' ? 'itens' : 'items'})`}
          >
            <div className="relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#C5A059] rounded-full flex items-center justify-center text-[9px] text-black font-bold">
                  {totalQuantity}
                </span>
              )}
            </div>
            <span className="hidden md:block text-[10px] uppercase tracking-widest group-hover:text-white font-medium">
              {t.cart} ({totalQuantity})
            </span>
          </button>

          {/* Menu Mobile */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? (language === 'pt' ? 'Fechar menu' : 'Close menu') : (language === 'pt' ? 'Abrir menu' : 'Open menu')}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Expandido */}
      {isMobileOpen && (
        <div className="md:hidden bg-[#050505] border-t border-white/5 px-6 py-8">
          <div className="flex flex-col gap-6">
            {[
              { name: t.nav.home, href: "/" },
              { name: t.nav.shop, href: "/loja" },
              { name: t.nav.journal, href: "/jornal" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="text-lg text-zinc-300 hover:text-[#C5A059] transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => {
                toggleLanguage();
                setIsMobileOpen(false);
              }}
              className="text-left text-lg text-zinc-300 hover:text-[#C5A059] transition-colors"
            >
              {language === 'pt' ? 'English' : 'Portugues'}
            </button>
          </div>
        </div>
      )}

      {/* Modal de Pesquisa */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
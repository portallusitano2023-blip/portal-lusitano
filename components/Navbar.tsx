"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingBag, User, Menu, X, Search, Heart, Crown, Gift, ChevronDown, MapPin, Calendar, ShoppingCart, BookOpen, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "@/context/WishlistContext";

// Lazy load - SearchModal só carrega quando o utilizador abre a pesquisa
const SearchModal = dynamic(
  () => import("./Search").then((mod) => ({ default: mod.SearchModal })),
  { ssr: false }
);

export default function Navbar() {
  const { totalQuantity, openCart } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const { wishlist } = useWishlist();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLusitanoOpen, setIsLusitanoOpen] = useState(false);

  return (
    <nav id="main-navigation" role="navigation" aria-label="Navegação principal" className="fixed w-full z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 transition-all duration-300">
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
        <div className="hidden md:flex items-center gap-8">
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

          {/* Lusitano Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsLusitanoOpen(true)}
            onMouseLeave={() => setIsLusitanoOpen(false)}
          >
            <button className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-zinc-300 hover:text-[#C5A059] transition-colors">
              Lusitano
              <ChevronDown size={14} className={`transition-transform ${isLusitanoOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLusitanoOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#0a0a0a] border border-white/10 shadow-xl py-2">
                <Link href="/directorio" className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors">
                  <Crown size={16} className="text-[#C5A059]" />
                  <div>
                    <div className="text-sm font-medium">Coudelarias</div>
                    <div className="text-[10px] text-zinc-500">Diretório completo</div>
                  </div>
                </Link>
                <Link href="/mapa" className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors">
                  <MapPin size={16} className="text-[#C5A059]" />
                  <div>
                    <div className="text-sm font-medium">Mapa</div>
                    <div className="text-[10px] text-zinc-500">Mapa interativo</div>
                  </div>
                </Link>
                <Link href="/marketplace" className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors">
                  <ShoppingCart size={16} className="text-[#C5A059]" />
                  <div>
                    <div className="text-sm font-medium">Marketplace</div>
                    <div className="text-[10px] text-zinc-500">Cavalos à venda</div>
                  </div>
                </Link>
                <Link href="/eventos" className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors">
                  <Calendar size={16} className="text-[#C5A059]" />
                  <div>
                    <div className="text-sm font-medium">Eventos</div>
                    <div className="text-[10px] text-zinc-500">Feiras e competições</div>
                  </div>
                </Link>
                <Link href="/linhagens" className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors">
                  <BookOpen size={16} className="text-[#C5A059]" />
                  <div>
                    <div className="text-sm font-medium">Linhagens</div>
                    <div className="text-[10px] text-zinc-500">Guia das linhagens</div>
                  </div>
                </Link>
                <Link href="/quiz" className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors">
                  <HelpCircle size={16} className="text-[#C5A059]" />
                  <div>
                    <div className="text-sm font-medium">Quiz</div>
                    <div className="text-[10px] text-zinc-500">Encontre o seu Lusitano</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
          {/* Instagram Promo Link */}
          <Link
            href="/instagram"
            className="text-[11px] uppercase tracking-[0.2em] text-zinc-300 hover:text-[#C5A059] transition-colors relative group"
          >
            Publicidade
            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#C5A059] transition-all duration-300 group-hover:w-full"></span>
          </Link>
          {/* Free Ebook Link */}
          <Link
            href="/ebook-gratis"
            className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-400 px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-bold hover:bg-green-600/30 transition-colors"
          >
            <Gift size={14} />
            Ebook Grátis
          </Link>
          {/* PRO Link */}
          <Link
            href="/pro"
            className="flex items-center gap-2 bg-gradient-to-r from-[#C5A059] to-[#E8D5A3] text-black px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-bold hover:opacity-90 transition-opacity"
          >
            <Crown size={14} />
            PRO
          </Link>
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
        <div className="md:hidden bg-[#050505] border-t border-white/5 px-6 py-8 max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col gap-4">
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

            {/* Lusitano Section Mobile */}
            <div className="border-t border-white/10 pt-4 mt-2">
              <span className="text-xs uppercase tracking-widest text-[#C5A059] mb-3 block">Lusitano</span>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/directorio" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2 text-zinc-300 hover:text-[#C5A059] transition-colors">
                  <Crown size={16} /> Coudelarias
                </Link>
                <Link href="/mapa" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2 text-zinc-300 hover:text-[#C5A059] transition-colors">
                  <MapPin size={16} /> Mapa
                </Link>
                <Link href="/marketplace" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2 text-zinc-300 hover:text-[#C5A059] transition-colors">
                  <ShoppingCart size={16} /> Marketplace
                </Link>
                <Link href="/eventos" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2 text-zinc-300 hover:text-[#C5A059] transition-colors">
                  <Calendar size={16} /> Eventos
                </Link>
                <Link href="/linhagens" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2 text-zinc-300 hover:text-[#C5A059] transition-colors">
                  <BookOpen size={16} /> Linhagens
                </Link>
                <Link href="/quiz" onClick={() => setIsMobileOpen(false)} className="flex items-center gap-2 text-zinc-300 hover:text-[#C5A059] transition-colors">
                  <HelpCircle size={16} /> Quiz
                </Link>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 mt-2">
              <Link
                href="/instagram"
                onClick={() => setIsMobileOpen(false)}
                className="text-lg text-zinc-300 hover:text-[#C5A059] transition-colors"
              >
                Publicidade
              </Link>
            </div>
            <Link
              href="/ebook-gratis"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-400 px-4 py-3 text-sm uppercase tracking-widest font-bold w-fit"
            >
              <Gift size={16} />
              Ebook Grátis
            </Link>
            <Link
              href="/pro"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#C5A059] to-[#E8D5A3] text-black px-4 py-3 text-sm uppercase tracking-widest font-bold w-fit"
            >
              <Crown size={16} />
              PRO
            </Link>
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
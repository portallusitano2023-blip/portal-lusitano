"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { ShoppingBag, User, Menu, X, Search, Heart, Crown, Gift, ChevronDown, MapPin, Calendar, ShoppingCart, BookOpen, HelpCircle, Home, Store, Calculator, Scale, Dna, Users, Trophy, Euro } from "lucide-react";
import { useState, useEffect } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useHorseFavorites } from "@/context/HorseFavoritesContext";

// Lazy load - SearchModal só carrega quando o utilizador abre a pesquisa
const SearchModal = dynamic(
  () => import("./Search").then((mod) => ({ default: mod.SearchModal })),
  { ssr: false }
);

export default function Navbar() {
  const { totalQuantity, openCart } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const { wishlist } = useWishlist();
  const { favoritesCount } = useHorseFavorites();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLusitanoOpen, setIsLusitanoOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for better mobile UX
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav id="main-navigation" role="navigation" aria-label="Navegação principal" className={`fixed w-full z-50 backdrop-blur-md border-b transition-all duration-300 ${scrolled ? "bg-[#050505]/98 border-white/10 shadow-lg" : "bg-[#050505]/95 border-white/5"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between gap-4">

        {/* LOGÓTIPO COM IMAGEM */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Portal Lusitano"
            width={44}
            height={44}
            className="w-9 h-9 md:w-11 md:h-11 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col justify-center">
            <span className="text-base md:text-lg lg:text-xl font-serif text-white tracking-wide group-hover:text-[#C5A059] transition-colors leading-none whitespace-nowrap">
              PORTAL LUSITANO
            </span>
            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-500 mt-0.5 group-hover:text-[#C5A059]/70 transition-colors leading-none">
              EST. 2023
            </span>
          </div>
        </Link>

        {/* MENU DESKTOP */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 ml-8 lg:ml-12">
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
            className="relative group"
            onMouseEnter={() => setIsLusitanoOpen(true)}
            onMouseLeave={() => setIsLusitanoOpen(false)}
          >
            <button className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-zinc-300 hover:text-[#C5A059] transition-colors py-2">
              Lusitano
              <ChevronDown size={14} className={`transition-transform ${isLusitanoOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLusitanoOpen && (
              <div className="absolute top-full left-0 pt-2 w-[520px]">
                <div className="bg-[#0a0a0a] border border-white/10 shadow-xl p-4 grid grid-cols-2 gap-4">
                  {/* Coluna 1 - Base de Dados */}
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] mb-2 block font-medium">Base de Dados</span>
                    <Link
                      href="/comprar"
                      onClick={() => setIsLusitanoOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded"
                    >
                      <ShoppingCart size={16} className="text-[#C5A059]" />
                      <div>
                        <div className="text-sm font-medium">Comprar Cavalo</div>
                        <div className="text-[10px] text-zinc-500">Cavalos à venda</div>
                      </div>
                    </Link>
                    <Link
                      href="/vender-cavalo"
                      onClick={() => setIsLusitanoOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded"
                    >
                      <Euro size={16} className="text-green-500" />
                      <div>
                        <div className="text-sm font-medium">Vender Cavalo</div>
                        <div className="text-[10px] text-zinc-500">Anuncie aqui</div>
                      </div>
                    </Link>
                    <Link
                      href="/directorio"
                      onClick={() => setIsLusitanoOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded"
                    >
                      <Crown size={16} className="text-[#C5A059]" />
                      <div>
                        <div className="text-sm font-medium">Coudelarias</div>
                        <div className="text-[10px] text-zinc-500">Diretório completo</div>
                      </div>
                    </Link>
                    <Link
                      href="/mapa"
                      onClick={() => setIsLusitanoOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded"
                    >
                      <MapPin size={16} className="text-[#C5A059]" />
                      <div>
                        <div className="text-sm font-medium">Mapa</div>
                        <div className="text-[10px] text-zinc-500">Mapa interativo</div>
                      </div>
                    </Link>
                    <Link
                      href="/eventos"
                      onClick={() => setIsLusitanoOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded"
                    >
                      <Calendar size={16} className="text-[#C5A059]" />
                      <div>
                        <div className="text-sm font-medium">Eventos</div>
                        <div className="text-[10px] text-zinc-500">Feiras e competições</div>
                      </div>
                    </Link>
                    <Link
                      href="/linhagens"
                      onClick={() => setIsLusitanoOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded"
                    >
                      <BookOpen size={16} className="text-[#C5A059]" />
                      <div>
                        <div className="text-sm font-medium">Linhagens</div>
                        <div className="text-[10px] text-zinc-500">Guia das linhagens</div>
                      </div>
                    </Link>
                  </div>

                  {/* Coluna 2 - Ferramentas e Comunidade */}
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] mb-2 block font-medium">Ferramentas</span>
                    <Link
                      href="/calculadora-valor"
                      onClick={() => setIsLusitanoOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded"
                    >
                      <Calculator size={16} className="text-[#C5A059]" />
                      <div>
                        <div className="text-sm font-medium">Calculadora</div>
                        <div className="text-[10px] text-zinc-500">Estimar valor</div>
                      </div>
                    </Link>
                    <Link
                      href="/comparador-cavalos"
                      onClick={() => setIsLusitanoOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded"
                    >
                      <Scale size={16} className="text-[#C5A059]" />
                      <div>
                        <div className="text-sm font-medium">Comparador</div>
                        <div className="text-[10px] text-zinc-500">Comparar cavalos</div>
                      </div>
                    </Link>
                    <Link
                      href="/verificador-compatibilidade"
                      onClick={() => setIsLusitanoOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded"
                    >
                      <Dna size={16} className="text-[#C5A059]" />
                      <div>
                        <div className="text-sm font-medium">Compatibilidade</div>
                        <div className="text-[10px] text-zinc-500">Para criação</div>
                      </div>
                    </Link>

                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] mb-2 mt-4 block font-medium">Comunidade</span>
                    <Link
                      href="/profissionais"
                      onClick={() => setIsLusitanoOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded"
                    >
                      <Users size={16} className="text-[#C5A059]" />
                      <div>
                        <div className="text-sm font-medium">Profissionais</div>
                        <div className="text-[10px] text-zinc-500">Vets, ferradores, treinadores</div>
                      </div>
                    </Link>
                    <Link
                      href="/cavalos-famosos"
                      onClick={() => setIsLusitanoOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded"
                    >
                      <Trophy size={16} className="text-[#C5A059]" />
                      <div>
                        <div className="text-sm font-medium">Cavalos Famosos</div>
                        <div className="text-[10px] text-zinc-500">Galeria de honra</div>
                      </div>
                    </Link>
                    <Link
                      href="/quiz"
                      onClick={() => setIsLusitanoOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded"
                    >
                      <HelpCircle size={16} className="text-[#C5A059]" />
                      <div>
                        <div className="text-sm font-medium">Quiz</div>
                        <div className="text-[10px] text-zinc-500">Encontre o seu Lusitano</div>
                      </div>
                    </Link>
                  </div>
                </div>
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
        </div>

        {/* ICONES E IDIOMA */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Pesquisa */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-zinc-400 hover:text-[#C5A059] transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-95 touch-manipulation"
            aria-label={language === 'pt' ? 'Pesquisar' : 'Search'}
          >
            <Search size={20} strokeWidth={1.5} />
          </button>

          {/* Idioma */}
          <button
            onClick={toggleLanguage}
            className="hidden lg:flex text-xs font-bold tracking-widest text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-zinc-800 px-2 py-1 rounded-sm"
            aria-label={language === 'pt' ? 'Mudar idioma' : 'Change language'}
          >
            <span className={language === 'pt' ? "text-[#C5A059]" : ""}>PT</span>
            <span className="mx-1 opacity-30 text-zinc-600">|</span>
            <span className={language === 'en' ? "text-[#C5A059]" : ""}>EN</span>
          </button>

          {/* Favoritos - Products + Horses */}
          <Link
            href="/cavalos-favoritos"
            className="text-zinc-400 hover:text-[#C5A059] transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center relative active:scale-95 touch-manipulation"
            aria-label={language === 'pt' ? 'Cavalos Favoritos' : 'Favorite Horses'}
          >
            <Heart size={20} strokeWidth={1.5} />
            {(wishlist.length + favoritesCount) > 0 && (
              <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-[#C5A059] rounded-full flex items-center justify-center text-[10px] text-black font-bold">
                {wishlist.length + favoritesCount}
              </span>
            )}
          </Link>

          {/* Conta */}
          <Link
            href="/minha-conta"
            className="hidden md:flex text-zinc-400 hover:text-[#C5A059] transition-colors p-2 min-w-[44px] min-h-[44px] items-center justify-center active:scale-95 touch-manipulation"
            aria-label={language === 'pt' ? 'Minha conta' : 'My account'}
          >
            <User size={20} strokeWidth={1.5} />
          </Link>

          {/* Carrinho */}
          <button
            onClick={openCart}
            className="flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors group active:scale-95 touch-manipulation"
            aria-label={`${language === 'pt' ? 'Carrinho' : 'Cart'} (${totalQuantity} ${language === 'pt' ? 'itens' : 'items'})`}
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
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? (language === 'pt' ? 'Fechar menu' : 'Close menu') : (language === 'pt' ? 'Abrir menu' : 'Open menu')}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile Expandido - Touch Optimized */}
      {isMobileOpen && (
        <div className="lg:hidden bg-[#050505] border-t border-white/5 max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain">
          <div className="px-4 py-6 space-y-2">
            {/* Main Navigation */}
            {[
              { name: t.nav.home, href: "/", icon: Home },
              { name: t.nav.shop, href: "/loja", icon: Store },
              { name: t.nav.journal, href: "/jornal", icon: BookOpen },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-4 py-4 px-3 text-lg text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
              >
                <item.icon size={20} className="text-zinc-500" />
                {item.name}
              </Link>
            ))}

            {/* Lusitano Section Mobile - Grid Layout */}
            <div className="border-t border-white/10 pt-4 mt-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] mb-3 block px-3 font-medium">
                Base de Dados
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: "/comprar", icon: ShoppingCart, label: "Comprar Cavalo" },
                  { href: "/vender-cavalo", icon: Euro, label: "Vender Cavalo", highlight: true },
                  { href: "/directorio", icon: Crown, label: "Coudelarias" },
                  { href: "/mapa", icon: MapPin, label: "Mapa" },
                  { href: "/eventos", icon: Calendar, label: "Eventos" },
                  { href: "/linhagens", icon: BookOpen, label: "Linhagens" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 py-3 px-3 text-sm transition-colors rounded-lg active:scale-[0.98] touch-manipulation ${
                      (item as any).highlight
                        ? "text-green-400 bg-green-500/10 border border-green-500/30"
                        : "text-zinc-300 hover:text-[#C5A059] hover:bg-white/5"
                    }`}
                  >
                    <item.icon size={18} className={(item as any).highlight ? "text-green-400" : "text-[#C5A059]/70"} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Ferramentas Mobile */}
            <div className="border-t border-white/10 pt-4 mt-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] mb-3 block px-3 font-medium">
                Ferramentas
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: "/calculadora-valor", icon: Calculator, label: "Calculadora" },
                  { href: "/comparador-cavalos", icon: Scale, label: "Comparador" },
                  { href: "/verificador-compatibilidade", icon: Dna, label: "Compatibilidade" },
                  { href: "/quiz", icon: HelpCircle, label: "Quiz" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 text-sm text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
                  >
                    <item.icon size={18} className="text-[#C5A059]/70" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Comunidade Mobile */}
            <div className="border-t border-white/10 pt-4 mt-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] mb-3 block px-3 font-medium">
                Comunidade
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: "/profissionais", icon: Users, label: "Profissionais" },
                  { href: "/cavalos-famosos", icon: Trophy, label: "Cavalos Famosos" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-3 py-3 px-3 text-sm text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
                  >
                    <item.icon size={18} className="text-[#C5A059]/70" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Favorites Section */}
            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cavalos-favoritos"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 py-3 px-3 text-sm text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
                >
                  <Heart size={18} className="text-red-400" />
                  <span>Cavalos Favoritos</span>
                  {favoritesCount > 0 && (
                    <span className="ml-auto bg-[#C5A059] text-black text-xs px-2 py-0.5 rounded-full font-bold">
                      {favoritesCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/favoritos"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 py-3 px-3 text-sm text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
                >
                  <Heart size={18} className="text-pink-400" />
                  <span>Loja Favoritos</span>
                  {wishlist.length > 0 && (
                    <span className="ml-auto bg-[#C5A059] text-black text-xs px-2 py-0.5 rounded-full font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* Additional Links */}
            <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
              <Link
                href="/instagram"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-4 py-3 px-3 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
              >
                Publicidade / Instagram
              </Link>
              <Link
                href="/minha-conta"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center gap-4 py-3 px-3 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
              >
                <User size={18} className="text-zinc-500" />
                Minha Conta
              </Link>
            </div>

            {/* CTA & Language */}
            <div className="border-t border-white/10 pt-4 mt-4 space-y-3">
              <Link
                href="/ebook-gratis"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-center gap-3 bg-green-600/20 border border-green-500/30 text-green-400 px-4 py-4 text-sm uppercase tracking-widest font-bold w-full rounded-lg active:scale-[0.98] touch-manipulation"
              >
                <Gift size={18} />
                Ebook Grátis
              </Link>
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMobileOpen(false);
                }}
                className="w-full text-center py-3 px-3 text-zinc-400 hover:text-white transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
              >
                {language === 'pt' ? '🇬🇧 Switch to English' : '🇵🇹 Mudar para Português'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pesquisa */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
}
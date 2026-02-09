"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  Search,
  Heart,
  Crown,
  Gift,
  ChevronDown,
  MapPin,
  Calendar,
  ShoppingCart,
  BookOpen,
  HelpCircle,
  Home,
  Store,
  Calculator,
  Scale,
  Dna,
  Users,
  Trophy,
  Euro,
  Shield,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import { useHorseFavorites } from "@/context/HorseFavoritesContext";
import type { LucideIcon } from "lucide-react";

// Lazy load - SearchModal só carrega quando o utilizador abre a pesquisa
const SearchModal = dynamic(
  () => import("./Search").then((mod) => ({ default: mod.SearchModal })),
  { ssr: false }
);

// Dados de navegação estáticos - extraídos fora do componente para evitar re-criação a cada render
interface NavDropdownItem {
  href: string;
  icon: LucideIcon;
  label: string;
  desc: string;
  iconClass?: string;
}

interface MobileNavItem {
  href: string;
  icon: LucideIcon;
  label: string;
  highlight?: boolean;
}

const DB_ITEMS: NavDropdownItem[] = [
  { href: "/comprar", icon: ShoppingCart, label: "Comprar Cavalo", desc: "Cavalos à venda" },
  {
    href: "/vender-cavalo",
    icon: Euro,
    label: "Vender Cavalo",
    desc: "Anuncie aqui",
    iconClass: "text-green-500",
  },
  { href: "/directorio", icon: Crown, label: "Coudelarias", desc: "Diretório completo" },
  { href: "/mapa", icon: MapPin, label: "Mapa", desc: "Mapa interativo" },
  { href: "/eventos", icon: Calendar, label: "Eventos", desc: "Feiras e competições" },
  { href: "/linhagens", icon: BookOpen, label: "Linhagens", desc: "Guia das linhagens" },
  { href: "/piroplasmose", icon: Shield, label: "Piroplasmose", desc: "Saúde e exportação" },
];

const TOOLS_ITEMS: NavDropdownItem[] = [
  { href: "/calculadora-valor", icon: Calculator, label: "Calculadora", desc: "Estimar valor" },
  { href: "/comparador-cavalos", icon: Scale, label: "Comparador", desc: "Comparar cavalos" },
  {
    href: "/verificador-compatibilidade",
    icon: Dna,
    label: "Compatibilidade",
    desc: "Para criação",
  },
];

const COMMUNITY_ITEMS: NavDropdownItem[] = [
  {
    href: "/profissionais",
    icon: Users,
    label: "Profissionais",
    desc: "Vets, ferradores, treinadores",
  },
  { href: "/cavalos-famosos", icon: Trophy, label: "Lusitanos Notáveis", desc: "Galeria de honra" },
  {
    href: "/analise-perfil",
    icon: HelpCircle,
    label: "Análise de Perfil",
    desc: "Descubra o seu perfil equestre",
  },
];

const MOBILE_DB_ITEMS: MobileNavItem[] = [
  { href: "/comprar", icon: ShoppingCart, label: "Comprar Cavalo" },
  { href: "/vender-cavalo", icon: Euro, label: "Vender Cavalo", highlight: true },
  { href: "/directorio", icon: Crown, label: "Coudelarias" },
  { href: "/mapa", icon: MapPin, label: "Mapa" },
  { href: "/eventos", icon: Calendar, label: "Eventos" },
  { href: "/linhagens", icon: BookOpen, label: "Linhagens" },
  { href: "/piroplasmose", icon: Shield, label: "Piroplasmose" },
];

const MOBILE_TOOLS_ITEMS: MobileNavItem[] = [
  { href: "/calculadora-valor", icon: Calculator, label: "Calculadora" },
  { href: "/comparador-cavalos", icon: Scale, label: "Comparador" },
  { href: "/verificador-compatibilidade", icon: Dna, label: "Compatibilidade" },
  { href: "/analise-perfil", icon: HelpCircle, label: "Análise" },
];

const MOBILE_COMMUNITY_ITEMS: MobileNavItem[] = [
  { href: "/profissionais", icon: Users, label: "Profissionais" },
  { href: "/cavalos-famosos", icon: Trophy, label: "Lusitanos Notáveis" },
];

export default function Navbar({ dev: _dev }: { dev?: boolean } = {}) {
  const { totalQuantity, openCart } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const { wishlist } = useWishlist();
  const { favoritesCount } = useHorseFavorites();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLusitanoOpen, setIsLusitanoOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lusitanoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openLusitano = useCallback(() => {
    if (lusitanoTimeoutRef.current) {
      clearTimeout(lusitanoTimeoutRef.current);
      lusitanoTimeoutRef.current = null;
    }
    setIsLusitanoOpen(true);
  }, []);

  const closeLusitano = useCallback(() => {
    lusitanoTimeoutRef.current = setTimeout(() => {
      setIsLusitanoOpen(false);
    }, 150);
  }, []);

  // Fechar menu mobile quando a página muda (evita click-through para o carrinho)
  useEffect(() => {
    setIsMobileOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
    setIsLusitanoOpen(false);
  }, [pathname]);

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (lusitanoTimeoutRef.current) clearTimeout(lusitanoTimeoutRef.current);
    };
  }, []);

  // Detect scroll for better mobile UX
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      id="main-navigation"
      role="navigation"
      aria-label="Navegação principal"
      className={`fixed w-full z-50 backdrop-blur-md border-b transition-all duration-300 ${scrolled ? "bg-[#050505]/98 border-white/10 shadow-lg" : "bg-[#050505]/95 border-white/5"}`}
      style={{ overflow: "visible" }}
    >
      <div
        className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between gap-4"
        style={{ overflow: "visible" }}
      >
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
            { name: language === "pt" ? "Sobre" : "About", href: "/sobre" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-300 relative group py-2"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C5A059] transition-all duration-500 ease-out group-hover:w-full"></span>
            </Link>
          ))}

          {/* Lusitano Dropdown */}
          <div className="relative group" onMouseEnter={openLusitano} onMouseLeave={closeLusitano}>
            <button
              onClick={() => setIsLusitanoOpen((prev) => !prev)}
              className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-300 py-2"
            >
              Lusitano
              <ChevronDown
                size={14}
                className={`transition-transform ${isLusitanoOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`absolute top-full left-0 pt-2 w-[520px] z-[100] transition-all duration-200 ${
                isLusitanoOpen
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl shadow-black/60 p-4 grid grid-cols-2 gap-4">
                {/* Coluna 1 - Base de Dados */}
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] mb-2 block font-medium">
                    Base de Dados
                  </span>
                  {DB_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={false}
                      onClick={() => setIsLusitanoOpen(false)}
                      className="dd-item"
                    >
                      <item.icon size={16} className={item.iconClass || "text-[#C5A059]"} />
                      <div>
                        <div className="text-sm font-medium text-zinc-200">{item.label}</div>
                        <div className="text-[10px] text-zinc-500">{item.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Coluna 2 - Ferramentas e Comunidade */}
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] mb-2 block font-medium">
                    Ferramentas
                  </span>
                  {TOOLS_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={false}
                      onClick={() => setIsLusitanoOpen(false)}
                      className="dd-item"
                    >
                      <item.icon size={16} className="text-[#C5A059]" />
                      <div>
                        <div className="text-sm font-medium text-zinc-200">{item.label}</div>
                        <div className="text-[10px] text-zinc-500">{item.desc}</div>
                      </div>
                    </Link>
                  ))}

                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] mb-2 mt-4 block font-medium">
                    Comunidade
                  </span>
                  {COMMUNITY_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={false}
                      onClick={() => setIsLusitanoOpen(false)}
                      className="dd-item"
                    >
                      <item.icon size={16} className="text-[#C5A059]" />
                      <div>
                        <div className="text-sm font-medium text-zinc-200">{item.label}</div>
                        <div className="text-[10px] text-zinc-500">{item.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Instagram Promo Link */}
          <Link
            href="/instagram"
            className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-300 relative group py-2"
          >
            Publicidade
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C5A059] transition-all duration-500 ease-out group-hover:w-full"></span>
          </Link>
          {/* Free Ebook Link */}
          <Link
            href="/ebook-gratis"
            className="relative flex items-center gap-2 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] font-bold hover:from-white hover:to-white transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.15)] hover:shadow-[0_0_25px_rgba(197,160,89,0.3)]"
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
            aria-label={language === "pt" ? "Pesquisar" : "Search"}
          >
            <Search size={20} strokeWidth={1.5} />
          </button>

          {/* Idioma */}
          <button
            onClick={toggleLanguage}
            className="hidden lg:flex text-xs font-bold tracking-widest text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-zinc-800 px-2 py-1 rounded-sm"
            aria-label={language === "pt" ? "Mudar idioma" : "Change language"}
          >
            <span className={language === "pt" ? "text-[#C5A059]" : ""}>PT</span>
            <span className="mx-1 opacity-30 text-zinc-600">|</span>
            <span className={language === "en" ? "text-[#C5A059]" : ""}>EN</span>
          </button>

          {/* Favoritos - Products + Horses */}
          <Link
            href="/cavalos-favoritos"
            className="text-zinc-400 hover:text-[#C5A059] transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center relative active:scale-95 touch-manipulation"
            aria-label={language === "pt" ? "Cavalos Favoritos" : "Favorite Horses"}
          >
            <Heart size={20} strokeWidth={1.5} />
            {wishlist.length + favoritesCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-5 h-5 bg-[#C5A059] rounded-full flex items-center justify-center text-[10px] text-black font-bold">
                {wishlist.length + favoritesCount}
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
            onClick={openCart}
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
            onClick={() => setIsMobileOpen(!isMobileOpen)}
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
              { name: language === "pt" ? "Sobre Nós" : "About Us", href: "/sobre", icon: Users },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
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
                {MOBILE_DB_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 py-3 px-3 text-sm transition-colors rounded-lg active:scale-[0.98] touch-manipulation ${
                      item.highlight
                        ? "text-green-400 bg-green-500/10 border border-green-500/30"
                        : "text-zinc-300 hover:text-[#C5A059] hover:bg-white/5"
                    }`}
                  >
                    <item.icon
                      size={18}
                      className={item.highlight ? "text-green-400" : "text-[#C5A059]/70"}
                    />
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
                {MOBILE_TOOLS_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
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
                {MOBILE_COMMUNITY_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
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
                className="flex items-center gap-4 py-3 px-3 text-zinc-300 hover:text-[#C5A059] hover:bg-white/5 transition-colors rounded-lg active:scale-[0.98] touch-manipulation"
              >
                Publicidade / Instagram
              </Link>
              <Link
                href="/minha-conta"
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
                className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#C5A059] to-[#D4B06A] text-black px-4 py-4 text-sm uppercase tracking-widest font-bold w-full rounded-lg active:scale-[0.98] touch-manipulation shadow-[0_0_20px_rgba(197,160,89,0.2)]"
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
                {language === "pt" ? "🇬🇧 Switch to English" : "🇵🇹 Mudar para Português"}
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

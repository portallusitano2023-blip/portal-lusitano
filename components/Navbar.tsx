// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ dev }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const query = dev ? "?dev=true" : "";

  // Detetar scroll para mudar a cor do fundo
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- A TUA LISTA DE LINKS DEFINITIVA ---
  const navLinks = [
    { name: "Início", path: "/", isExternal: false },
    { name: "Sobre", path: "/sobre", isExternal: false },
    { name: "Comprar", path: "/comprar", isExternal: false },
    { name: "Leilões", path: "/leiloes", badge: true, isExternal: false },
    { name: "Vender", path: "/vender", isExternal: false },
    
    // 👇 IMPORTANTE: Substitui o link abaixo pelo link do teu Shopify
    { name: "Loja", path: "https://tua-loja-shopify.com", isExternal: true },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-white/5
        ${scrolled || mobileMenuOpen ? "bg-black/90 backdrop-blur-md py-4" : "bg-transparent py-6"}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* 1. LOGO */}
          <Link href={`/${query}`} className="group relative z-50 block">
            <div className="font-serif text-xl md:text-2xl tracking-tighter font-bold text-white group-hover:opacity-80 transition-opacity">
              PORTAL <span className="text-[#C5A059]">LUSITANO</span>
            </div>
            <p className="text-[7px] uppercase tracking-[0.4em] text-zinc-500 group-hover:text-[#C5A059] transition-colors">
              Est. 2026
            </p>
          </Link>

          {/* 2. LINKS DESKTOP */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              // Se for Link Externo (Shopify), usa a tag <a> normal
              link.isExternal ? (
                <a 
                  key={link.name}
                  href={link.path}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 hover:text-[#C5A059] transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-px bg-[#C5A059] transition-all duration-300 group-hover:w-full"></span>
                  <span className="ml-1 text-[8px] opacity-50">↗</span>
                </a>
              ) : (
                // Se for Link Interno (Site), usa o <Link> do Next.js
                <Link 
                  key={link.name}
                  href={`${link.path}${query}`}
                  className={`text-[10px] uppercase tracking-[0.2em] font-bold hover:text-[#C5A059] transition-colors relative group
                    ${pathname === link.path ? "text-white" : "text-zinc-500"}
                  `}
                >
                  {link.name}
                  <span className={`absolute -bottom-2 left-0 w-0 h-px bg-[#C5A059] transition-all duration-300 group-hover:w-full ${pathname === link.path ? "w-full" : ""}`}></span>
                  
                  {link.badge && (
                    <span className="absolute -top-2 -right-3 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                    </span>
                  )}
                </Link>
              )
            ))}
          </div>

          {/* 3. AÇÕES (Lado Direito) */}
          <div className="hidden md:flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 border border-zinc-800 rounded-full bg-zinc-900/50">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
               <span className="text-[8px] uppercase tracking-widest text-zinc-400">System Online</span>
            </div>

            <Link 
              href={`/dashboard${query}`}
              className="bg-white text-black px-5 py-2 text-[9px] uppercase font-bold tracking-[0.2em] hover:bg-[#C5A059] transition-all duration-300"
            >
              Entrar
            </Link>

            {/* Ícone Hambúrguer (Aparece se o ecrã for pequeno) */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-end gap-1.5 group ml-4"
            >
              <span className={`h-px bg-white transition-all duration-300 ${mobileMenuOpen ? "w-6 rotate-45 translate-y-2" : "w-8 group-hover:w-10 group-hover:bg-[#C5A059]"}`}></span>
              <span className={`h-px bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "w-6 group-hover:w-10 group-hover:bg-[#C5A059]"}`}></span>
              <span className={`h-px bg-white transition-all duration-300 ${mobileMenuOpen ? "w-6 -rotate-45 -translate-y-2.5" : "w-4 group-hover:w-10 group-hover:bg-[#C5A059]"}`}></span>
            </button>
          </div>
        </div>

        {/* 4. MENU MOBILE (Abre em ecrã inteiro) */}
        <div className={`fixed inset-0 bg-black z-40 flex flex-col justify-center items-center transition-all duration-500 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
           <div className="flex flex-col gap-8 text-center">
             {navLinks.map((link) => (
               link.isExternal ? (
                 <a 
                   key={link.name}
                   href={link.path}
                   target="_blank"
                   className="text-3xl font-serif italic text-white hover:text-[#C5A059] transition-colors flex items-center justify-center gap-2"
                 >
                   {link.name} <span className="text-lg opacity-50">↗</span>
                 </a>
               ) : (
                 <Link 
                   key={link.name}
                   href={`${link.path}${query}`}
                   onClick={() => setMobileMenuOpen(false)}
                   className="text-3xl font-serif italic text-white hover:text-[#C5A059] transition-colors"
                 >
                   {link.name}
                 </Link>
               )
             ))}
             <div className="w-10 h-px bg-zinc-800 mx-auto my-4"></div>
             <Link 
               href={`/dashboard${query}`}
               onClick={() => setMobileMenuOpen(false)}
               className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] border border-[#C5A059] px-8 py-4"
             >
               Aceder à Coudelaria
             </Link>
           </div>
        </div>
      </nav>
    </>
  );
}
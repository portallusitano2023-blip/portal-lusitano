// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ dev }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Parâmetro de query para manter o modo dev entre páginas
  const query = dev ? "?dev=true" : "";

  // Detetar scroll para mudar a cor da navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Coleção", path: "/comprar" },
    { name: "Leilões Live", path: "/leiloes", badge: true }, // Badge 'Live'
    { name: "Vender", path: "/vender" },
    { name: "Manifesto", path: "/sobre" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b border-white/5
        ${scrolled || mobileMenuOpen ? "bg-black/90 backdrop-blur-md py-4" : "bg-transparent py-6"}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* 1. LOGO (TEXTO PURO & ELEGANTE) */}
          <Link href={`/${query}`} className="group relative z-50">
            <div className="font-serif text-xl md:text-2xl tracking-tighter font-bold text-white group-hover:opacity-80 transition-opacity">
              PORTAL <span className="text-[#C5A059]">LUSITANO</span>
            </div>
            <p className="text-[7px] uppercase tracking-[0.4em] text-zinc-500 group-hover:text-[#C5A059] transition-colors">
              Est. 2026
            </p>
          </Link>

          {/* 2. LINKS DESKTOP (CENTER) */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={`${link.path}${query}`}
                className={`text-[10px] uppercase tracking-[0.2em] font-bold hover:text-[#C5A059] transition-colors relative group
                  ${pathname === link.path ? "text-white" : "text-zinc-500"}
                `}
              >
                {link.name}
                {/* Linha dourada no hover */}
                <span className={`absolute -bottom-2 left-0 w-0 h-px bg-[#C5A059] transition-all duration-300 group-hover:w-full ${pathname === link.path ? "w-full" : ""}`}></span>
                
                {/* Badge 'Live' para Leilões */}
                {link.badge && (
                  <span className="absolute -top-3 -right-4 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* 3. AÇÕES (RIGHT) */}
          <div className="hidden md:flex items-center gap-6">
            {/* Botão Web3 / Carteira (Visual) */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 border border-zinc-800 rounded-full bg-zinc-900/50">
               <div className="w-2 h-2 rounded-full bg-green-500"></div>
               <span className="text-[9px] uppercase tracking-widest text-zinc-400">System Online</span>
            </div>

            {/* Link para Dashboard */}
            <Link 
              href={`/dashboard${query}`}
              className="bg-white text-black px-6 py-2 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#C5A059] transition-all duration-300"
            >
              Área Privada
            </Link>
          </div>

          {/* 4. MOBILE MENU BUTTON (HAMBURGUER DE LUXO) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-end gap-1.5 group"
          >
            <span className={`h-px bg-white transition-all duration-300 ${mobileMenuOpen ? "w-6 rotate-45 translate-y-2" : "w-8 group-hover:w-10 group-hover:bg-[#C5A059]"}`}></span>
            <span className={`h-px bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : "w-6 group-hover:w-10 group-hover:bg-[#C5A059]"}`}></span>
            <span className={`h-px bg-white transition-all duration-300 ${mobileMenuOpen ? "w-6 -rotate-45 -translate-y-2.5" : "w-4 group-hover:w-10 group-hover:bg-[#C5A059]"}`}></span>
          </button>
        </div>

        {/* 5. MOBILE MENU OVERLAY (FULL SCREEN) */}
        <div className={`fixed inset-0 bg-black z-40 flex flex-col justify-center items-center transition-all duration-500 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
           <div className="flex flex-col gap-8 text-center">
             {navLinks.map((link) => (
               <Link 
                 key={link.name}
                 href={`${link.path}${query}`}
                 onClick={() => setMobileMenuOpen(false)}
                 className="text-3xl font-serif italic text-white hover:text-[#C5A059] transition-colors"
               >
                 {link.name}
               </Link>
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
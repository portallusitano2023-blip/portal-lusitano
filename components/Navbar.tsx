// @ts-nocheck
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const { setIsCartOpen, totalQuantity } = useContext(CartContext);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Início", href: "/" },
    { name: "Loja", href: "/loja" },
    { name: "Sobre", href: "/sobre" },
    { name: "Coudelarias", href: "/coudelarias" },
    { name: "Jornal", href: "/blog" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "bg-black/90 py-4 border-b border-zinc-800" : "bg-transparent py-8"}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGÓTIPO COM EST. 2023 ABAIXO */}
        <Link href="/" className="group flex flex-col items-center">
          <div className="font-serif text-2xl text-white tracking-tighter group-hover:text-[#C5A059] transition-colors">
            PORTAL <span className="italic font-light">LUSITANO</span>
          </div>
          <span className="text-[8px] text-zinc-500 uppercase tracking-[0.5em] mt-1 font-bold">
            Est. 2023
          </span>
        </Link>

        {/* LINKS CENTRAIS */}
        <div className="hidden md:flex gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`text-[11px] font-bold uppercase tracking-[0.2em] hover:text-[#C5A059] transition-colors ${
                pathname === link.href ? "text-white" : "text-zinc-500"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* ÍCONES DIREITOS */}
        <div className="flex gap-6 items-center">
          <Link href="/minha-conta">
            <svg className="w-5 h-5 text-zinc-400 hover:text-[#C5A059] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </Link>
          <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 group">
            <span className="text-[10px] uppercase font-bold text-zinc-500 group-hover:text-white transition-colors">Saco</span>
            <div className="w-5 h-5 border border-zinc-700 rounded-full flex items-center justify-center text-[9px] text-[#C5A059] group-hover:border-[#C5A059] transition-colors">
              {totalQuantity}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
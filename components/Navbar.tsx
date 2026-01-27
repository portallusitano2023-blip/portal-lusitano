"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Início", href: "/" },
  { name: "Loja", href: "/loja" },
  { name: "Jornal", href: "/jornal" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-full border border-[#C5A059]/30 group-hover:border-[#C5A059] transition-all duration-500">
            <img 
              src="/logo-image.png" // Certifica-te que tens a imagem do cavalo aqui
              alt="Portal Lusitano"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-serif text-lg tracking-wider leading-none group-hover:text-[#C5A059] transition-colors">PORTAL</span>
            <span className="text-[#C5A059] text-[10px] tracking-[0.3em] font-light">LUSITANO</span>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-xs uppercase tracking-[0.15em] transition-all duration-300 relative py-2 ${
                  isActive ? "text-[#C5A059]" : "text-zinc-400 hover:text-white"
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C5A059]"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* CART & MOBILE TOGGLE */}
        <div className="flex items-center gap-6">
          <Link href="/carrinho" className="relative text-zinc-400 hover:text-[#C5A059] transition-colors">
            <ShoppingBag size={20} />
            {/* Opcional: Contador de itens */}
            {/* <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C5A059] rounded-full text-[8px] text-black flex items-center justify-center font-bold">2</span> */}
          </Link>

          <button 
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-[#0a0a0a] border-b border-white/10 md:hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm uppercase tracking-widest py-3 border-b border-white/5 ${
                     pathname === item.href ? "text-[#C5A059]" : "text-zinc-400"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
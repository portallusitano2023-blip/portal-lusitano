"use client"; // <--- OBRIGATÓRIO: Agora este componente tem interatividade

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Para a animação suave

export default function Navbar() {
  // Estado para controlar se o menu está aberto (true) ou fechado (false)
  const [isOpen, setIsOpen] = useState(false);

  // Função para fechar o menu quando clicamos num link
  const fecharMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-zinc-950/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* --- LOGÓTIPO --- */}
        <Link href="/" onClick={fecharMenu} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img 
            src="/logo.png" 
            alt="Logo Portal Lusitano" 
            className="h-10 w-auto object-contain" 
          />
          <span className="text-lg md:text-xl font-serif text-white tracking-widest uppercase">
            Portal <span className="text-yellow-600">Lusitano</span>
          </span>
        </Link>

        {/* --- MENU DESKTOP (Escondido em telemóveis) --- */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            Início
          </Link>
          <Link href="/leiloes" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            Leilões
          </Link>
          <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/vender" className="text-xs font-bold uppercase tracking-widest text-yellow-600 hover:text-white transition-colors">
            Vender Cavalo
          </Link>
        </nav>

        {/* --- BOTÃO SUPORTE (Desktop) --- */}
        <a 
          href="https://wa.me/351910000000" 
          target="_blank"
          className="hidden md:block px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-yellow-600 transition-colors"
        >
          Suporte
        </a>

        {/* --- BOTÃO HAMBÚRGUER (Só aparece em Mobile) --- */}
        <button 
          className="md:hidden text-white p-2 z-50 relative"
          onClick={() => setIsOpen(!isOpen)} // Alterna entre aberto/fechado
        >
          {/* Se estiver aberto mostra um X, se fechado mostra ☰ */}
          <span className="text-2xl">{isOpen ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* --- MENU MOBILE DESLIZANTE --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-0 w-full bg-zinc-950 border-b border-zinc-800 md:hidden flex flex-col items-center py-10 gap-8 shadow-2xl"
          >
            <Link href="/" onClick={fecharMenu} className="text-lg font-bold uppercase tracking-widest text-white hover:text-yellow-600">
              Início
            </Link>
            <Link href="/leiloes" onClick={fecharMenu} className="text-lg font-bold uppercase tracking-widest text-white hover:text-yellow-600">
              Leilões
            </Link>
            <Link href="/blog" onClick={fecharMenu} className="text-lg font-bold uppercase tracking-widest text-white hover:text-yellow-600">
              Blog
            </Link>
            <Link href="/vender" onClick={fecharMenu} className="text-lg font-bold uppercase tracking-widest text-yellow-600">
              Vender Cavalo
            </Link>
            
            <div className="w-20 h-[1px] bg-zinc-800 my-2"></div>

            <a 
              href="https://wa.me/351910000000" 
              onClick={fecharMenu}
              target="_blank"
              className="px-8 py-3 bg-white text-black text-sm font-bold uppercase tracking-widest"
            >
              Suporte WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
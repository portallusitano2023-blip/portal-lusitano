// @ts-nocheck
import Link from "next/link";
import { Instagram, Music2, Mail, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-zinc-900 pt-32 pb-12 px-6 mt-20 relative overflow-hidden">
      {/* Efeito de luz dourada subtil no fundo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#C5A059] opacity-[0.03] blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          
          {/* IDENTIDADE E MANIFESTO */}
          <div className="md:col-span-5 space-y-8">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-4xl text-white tracking-tighter group-hover:text-[#C5A059] transition-all duration-500">
                PORTAL <span className="italic font-light">LUSITANO</span>
              </span>
              <span className="text-[9px] text-zinc-600 uppercase tracking-[0.5em] block mt-3 font-bold group-hover:text-zinc-400 transition-colors">
                The Noble Legacy • Est. 2023
              </span>
            </Link>
            <p className="text-zinc-500 text-base font-light leading-relaxed max-w-md">
              A primeira plataforma digital de elite dedicada à preservação, cultura e comércio do cavalo Lusitano. Criado para unir a tradição secular à inovação global.
            </p>
            
            {/* REDES SOCIAIS COM ICONS */}
            <div className="flex gap-5 pt-4">
              <a href="https://instagram.com/portal_lusitano" target="_blank" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#C5A059] hover:border-[#C5A059] transition-all duration-500 group">
                <Instagram size={18} />
              </a>
              <a href="https://tiktok.com/@portal_lusitano" target="_blank" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#C5A059] hover:border-[#C5A059] transition-all duration-500 group">
                <Music2 size={18} />
              </a>
              <a href="mailto:portal.lusitano2023@gmail.com" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#C5A059] hover:border-[#C5A059] transition-all duration-500 group">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* NAVEGAÇÃO RÁPIDA */}
          <div className="md:col-span-3 space-y-8">
            <h4 className="text-white text-[10px] uppercase tracking-[0.3em] font-bold">Navegação</h4>
            <ul className="space-y-4">
              {['Inicio','Loja', 'Jornal'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-zinc-500 hover:text-white text-sm font-light transition-colors flex items-center gap-2 group">
                    <span className="w-0 group-hover:w-4 h-[1px] bg-[#C5A059] transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACTOS E LOCALIZAÇÃO */}
          <div className="md:col-span-4 space-y-8">
            <h4 className="text-white text-[10px] uppercase tracking-[0.3em] font-bold">Contacto Oficial</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <MapPin className="text-[#C5A059] mt-1" size={16} />
                <div>
                  <p className="text-white text-sm font-medium italic font-serif">Portugal</p>
                  <p className="text-zinc-500 text-xs mt-1 lowercase">portal.lusitano2023@gmail.com</p>
                </div>
              </div>
              <Link href="/minha-conta" className="inline-flex items-center gap-2 text-[#C5A059] text-[10px] uppercase tracking-widest font-bold border-b border-[#C5A059]/30 pb-1 hover:border-[#C5A059] transition-all">
                Aceder ao Portal ID <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* BARRA DE COPYRIGHT */}
        <div className="pt-12 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
            <p className="text-zinc-700 text-[9px] uppercase tracking-[0.2em]">
              © 2026 Portal Lusitano. Created by <span className="text-zinc-500">Portal Lusitano</span>.
            </p>
          </div>
          <div className="flex gap-10">
            <Link href="/privacidade" className="text-zinc-700 hover:text-white text-[9px] uppercase tracking-[0.2em] transition-colors">Privacidade</Link>
            <Link href="/termos" className="text-zinc-700 hover:text-white text-[9px] uppercase tracking-[0.2em] transition-colors">Termos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
// @ts-nocheck
import Link from "next/link";
import Image from "next/image"; // Importamos o componente de imagem do Next.js

export default function Navbar({ dev }: { dev: boolean }) {
  // Mantém o modo de engenharia ativo
  const query = dev ? "?dev=true" : "";

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-[#C5A059]/20 px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-500">
      
      {/* LOGÓTIPO E TÍTULO DE LUXO */}
      <Link href={`/${query}`} className="flex items-center gap-4 group">
        {/* Substitui '/logo.png' pelo caminho do teu logótipo real na pasta 'public' */}
        <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 group-hover:scale-105">
           {/* Exemplo com um placeholder. Coloca o teu logo na pasta public e ajusta o src */}
           {/* <Image src="/logo.png" alt="Portal Lusitano Logo" fill className="object-contain" /> */}
           {/* Placeholder circular dourado enquanto não tens o logo */}
           <div className="w-full h-full rounded-full border-2 border-[#C5A059] bg-black/50 flex items-center justify-center">
             <span className="text-[#C5A059] text-xs font-serif">PL</span>
           </div>
        </div>
        
        <div className="font-serif text-xl md:text-2xl tracking-tighter">
          <span className="text-white">PORTAL</span>
          <span className="text-[#C5A059] ml-2 italic">LUSITANO</span>
        </div>
      </Link>
      
      {/* NAVEGAÇÃO PRINCIPAL */}
      <div className="hidden md:flex gap-12 text-[10px] uppercase tracking-[0.3em] font-bold text-white/80">
        <Link href={`/loja${query}`} className="hover:text-[#C5A059] transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A059] hover:after:w-full after:transition-all after:duration-300">Loja</Link>
        <Link href={`/leiloes${query}`} className="hover:text-[#C5A059] transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A059] hover:after:w-full after:transition-all after:duration-300">Leilões</Link>
        <Link href={`/blog${query}`} className="hover:text-[#C5A059] transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A059] hover:after:w-full after:transition-all after:duration-300">Blog</Link>
      </div>

      {/* INDICADOR DE MODO DE ENGENHARIA */}
      <div className="border border-[#C5A059]/30 px-4 py-2 rounded-full bg-[#C5A059]/5 backdrop-blur-sm">
        <span className="text-[#C5A059] text-[9px] uppercase font-bold italic tracking-widest">
          Workspace Francisco
        </span>
      </div>
    </nav>
  );
}
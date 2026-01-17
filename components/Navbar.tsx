// @ts-nocheck
import Link from "next/link";
import Image from "next/image"; // Importante para usar imagens

export default function Navbar({ dev }: { dev: boolean }) {
  const query = dev ? "?dev=true" : "";

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-[#C5A059]/20 px-6 md:px-12 py-4 flex justify-between items-center transition-all duration-500">
      
      {/* LOGÓTIPO REAL + TÍTULO */}
      <Link href={`/${query}`} className="flex items-center gap-4 group">
        {/* Certifica-te que tens um ficheiro chamado 'logo.png' na tua pasta 'public' */}
        <div className="relative w-12 h-12 transition-transform duration-500 group-hover:scale-105">
           <Image 
             src="/logo.png" 
             alt="Portal Lusitano Logo" 
             fill 
             className="object-contain"
           />
        </div>
        
        <div className="font-serif text-xl md:text-2xl tracking-tighter leading-none">
          <span className="text-white block md:inline">PORTAL</span>
          <span className="text-[#C5A059] md:ml-2 italic">LUSITANO</span>
        </div>
      </Link>
      
      {/* NAVEGAÇÃO */}
      <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.25em] font-bold text-white/80">
        <Link href={`/loja${query}`} className="hover:text-[#C5A059] transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A059] hover:after:w-full after:transition-all after:duration-300">Loja</Link>
        <Link href={`/leiloes${query}`} className="hover:text-[#C5A059] transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A059] hover:after:w-full after:transition-all after:duration-300">Leilões</Link>
        <Link href={`/blog${query}`} className="hover:text-[#C5A059] transition-colors duration-300 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A059] hover:after:w-full after:transition-all after:duration-300">Blog</Link>
      </div>

      {/* WORKSPACE */}
      <div className="border border-[#C5A059]/30 px-4 py-2 rounded-full bg-[#C5A059]/5 backdrop-blur-sm">
        <span className="text-[#C5A059] text-[9px] uppercase font-bold italic tracking-widest">
          Workspace Francisco
        </span>
      </div>
    </nav>
  );
}
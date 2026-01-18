// @ts-nocheck
import Link from "next/link";
import Image from "next/image";

export default function Navbar({ dev }: { dev: boolean }) {
  const query = dev ? "?dev=true" : "";

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-[#C5A059]/10 px-12 py-5 flex justify-between items-center">
      <Link href={`/${query}`} className="flex items-center gap-4 group">
        <div className="relative w-10 h-10 transition-transform duration-500 group-hover:scale-110">
           <Image src="/logo.png" alt="Logo" fill className="object-contain" />
        </div>
        <div className="font-serif text-2xl tracking-tighter uppercase font-bold">
          <span className="text-white">PORTAL</span>
          <span className="text-[#C5A059] ml-2">LUSITANO</span>
        </div>
      </Link>
      
      {/* MENU DE ELITE ATUALIZADO */}
      <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.3em] font-bold text-white/70">
        <Link href={`/${query}`} className="hover:text-[#C5A059] transition-all">Início</Link>
        <Link href={`/comprar${query}`} className="hover:text-[#C5A059] transition-all">Comprar</Link>
        <Link href={`/leiloes${query}`} className="hover:text-[#C5A059] transition-all">Leilões</Link>
        <Link href={`/loja${query}`} className="hover:text-[#C5A059] transition-all">Loja</Link>
        <Link href={`/sobre${query}`} className="text-[#C5A059] border-b border-[#C5A059]/30 pb-1">Sobre</Link>
        <Link href={`/vender${query}`} className="hover:text-[#C5A059] transition-all">Vender</Link>
      </div>

      <div className="hidden lg:block border border-[#C5A059]/20 px-4 py-2 rounded-full">
        <span className="text-[#C5A059] text-[8px] uppercase font-bold tracking-widest italic">Workspace Ativo</span>
      </div>
    </nav>
  );
}
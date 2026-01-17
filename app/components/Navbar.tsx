// @ts-nocheck
import Link from "next/link";

export default function Navbar({ dev }: { dev: boolean }) {
  // Mantemos o acesso secreto enquanto navegas
  const query = dev ? "?dev=true" : "";

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-zinc-900 px-6 md:px-12 py-6 flex justify-between items-center">
      <Link href={`/${query}`} className="text-[#C5A059] font-serif text-2xl italic tracking-tighter">
        PORTAL LUSITANO
      </Link>
      
      <div className="flex gap-8 text-[9px] uppercase tracking-[0.3em] font-bold">
        <Link href={`/loja${query}`} className="hover:text-[#C5A059] transition-colors">Loja</Link>
        <Link href={`/leiloes${query}`} className="hover:text-[#C5A059] transition-colors">Leilões</Link>
        <Link href={`/blog${query}`} className="hover:text-[#C5A059] transition-colors">Blog</Link>
      </div>

      <div className="hidden md:block">
        <span className="text-[8px] text-zinc-500 uppercase tracking-widest border border-zinc-800 px-4 py-2 rounded-full italic">
          Engenharia Ativa
        </span>
      </div>
    </nav>
  );
}
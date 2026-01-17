// @ts-nocheck
import Link from "next/link";

export default function Navbar({ isDev }: { isDev: boolean }) {
  const query = isDev ? "?dev=true" : "";
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-10 py-6 flex justify-between items-center">
      <Link href={`/${query}`} className="text-[#C5A059] font-serif text-2xl italic tracking-tighter">
        PORTAL LUSITANO
      </Link>
      <div className="flex gap-10 text-[10px] uppercase tracking-[0.3em] font-bold text-white">
        <Link href={`/loja${query}`} className="hover:text-[#C5A059] transition-colors">Loja</Link>
        <Link href={`/leiloes${query}`} className="hover:text-[#C5A059] transition-colors">Leilões</Link>
        <Link href={`/blog${query}`} className="hover:text-[#C5A059] transition-colors">Blog</Link>
      </div>
      <div className="bg-[#C5A059]/10 border border-[#C5A059]/20 px-4 py-1 rounded-full">
        <span className="text-[#C5A059] text-[8px] uppercase font-bold italic">Modo Engenharia Ativo</span>
      </div>
    </nav>
  );
}
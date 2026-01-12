import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* LOGÓTIPO + TEXTO (Agora estão juntos lado a lado) */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {/* 1. A Imagem do Logo */}
          <img 
            src="/logo.png" 
            alt="Logo Portal Lusitano" 
            className="h-10 w-auto object-contain" 
          />
          
          {/* 2. O Texto da Marca */}
          <span className="text-lg md:text-xl font-serif text-white tracking-widest uppercase">
            Portal <span className="text-yellow-600">Lusitano</span>
          </span>
        </Link>

        {/* MENU DE NAVEGAÇÃO */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            Início
          </Link>
          <Link href="/leiloes" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            Leilões
          </Link>
          <Link href="/vender" className="text-xs font-bold uppercase tracking-widest text-yellow-600 hover:text-white transition-colors">
            Vender Cavalo
          </Link>
        </nav>

        {/* BOTÃO SUPORTE */}
        <a 
          href="https://wa.me/351910000000" 
          target="_blank"
          className="hidden md:block px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-yellow-600 transition-colors"
        >
          Suporte
        </a>

        {/* MENU MOBILE */}
        <button className="md:hidden text-white p-2">
          <span className="text-2xl">☰</span>
        </button>
      </div>
    </header>
  );
}
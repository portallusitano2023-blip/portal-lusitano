import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference text-white">
      
      {/* Lado Esquerdo: Logo Texto */}
      <Link href="/" className="font-serif italic text-2xl tracking-tighter hover:text-[#C5A059] transition-colors">
        PL <span className="text-[10px] not-italic font-sans tracking-[0.3em] uppercase opacity-50 ml-2">Portal Lusitano</span>
      </Link>

      {/* Lado Direito: Links */}
      <div className="hidden md:flex items-center gap-8 text-[10px] uppercase font-bold tracking-[0.2em]">
        <Link href="/leiloes" className="hover:text-[#C5A059] transition-colors">
          Leilões
        </Link>
        <Link href="/coudelarias" className="hover:text-[#C5A059] transition-colors">
          Coudelarias
        </Link>
        <Link href="/sobre" className="hover:text-[#C5A059] transition-colors">
          Manifesto
        </Link>
        
        {/* Botão Login */}
        <Link href="/login" className="border border-white/30 px-6 py-2 hover:bg-white hover:text-black transition-all">
          Entrar
        </Link>
      </div>
    </nav>
  );
}
import Link from "next/link";
import Image from "next/image"; // <--- Importante para carregar a imagem

export function Navbar() {
  return (
    <nav className="w-full bg-black/90 backdrop-blur-md border-b border-gray-800 fixed top-0 z-50 h-14 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* --- LOGÓTIPO (Imagem) & NOME --- */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              
              {/* AQUI ESTÁ A TUA IMAGEM */}
              {/* Ajusta o width/height se achares pequeno ou grande */}
              <div className="relative w-8 h-8">
                <Image 
                  src="/logo.png"       // <--- TENS DE TER ESTE FICHEIRO NA PASTA PUBLIC
                  alt="Logo Portal Lusitano" 
                  fill
                  className="object-contain group-hover:scale-110 transition duration-300"
                />
              </div>
              
              <div className="flex items-center gap-1 font-serif text-lg tracking-widest">
                <span className="text-white font-medium">PORTAL</span>
                <span className="text-[#C5A059] font-bold">LUSITANO</span>
              </div>
            </Link>
          </div>

          {/* --- LINKS DO MENU (Centrados) --- */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-xs font-bold uppercase tracking-[0.15em] text-gray-300 hover:text-[#C5A059] transition hover:underline underline-offset-4">
              Início
            </Link>
            <Link href="/leiloes" className="text-xs font-bold uppercase tracking-[0.15em] text-gray-300 hover:text-[#C5A059] transition hover:underline underline-offset-4">
              Leilões
            </Link>
            <Link href="/blog" className="text-xs font-bold uppercase tracking-[0.15em] text-gray-300 hover:text-[#C5A059] transition hover:underline underline-offset-4">
              Blog
            </Link>
          </div>

          {/* --- BOTÃO 'VENDER' --- */}
          <div>
            <Link href="/studio">
              <span className="text-[#C5A059] border border-[#C5A059] px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-black transition cursor-pointer">
                Vender
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
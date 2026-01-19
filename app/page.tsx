// @ts-nocheck
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Image from "next/image"; // Otimização de Imagem

export default function Home() {
  return (
    <>
      <Navbar />
      
      <main className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        
        {/* IMAGEM OTIMIZADA */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <Image 
            src="https://images.unsplash.com/photo-1551884831-bbf3ddd77535?q=80&w=2560" 
            alt="Lusitano Hero"
            fill
            priority // Carrega IMEDIATAMENTE (LCP)
            quality={90}
            className="object-cover animate-slow-zoom"
            sizes="100vw"
          />
        </div>

        <div className="relative z-20 text-center px-4 space-y-8">
          <p className="text-[#C5A059] text-[10px] md:text-xs uppercase tracking-[0.6em] font-bold animate-fade-in-up">
            The Golden Horse
          </p>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif italic text-white tracking-tighter leading-none animate-fade-in">
            PORTAL <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#F2D088]">
              LUSITANO
            </span>
          </h1>

          <div className="pt-8 animate-fade-in-up delay-300">
            <Link 
              href="/comprar"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 hover:border-[#C5A059] transition-all duration-500 rounded-sm overflow-hidden"
            >
              <span className="absolute inset-0 bg-[#C5A059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
              <span className="relative text-white text-[10px] uppercase tracking-[0.3em] font-bold group-hover:text-black transition-colors">
                Entrar na Coudelaria
              </span>
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 w-full px-8 flex justify-between items-end text-[9px] text-zinc-400 uppercase tracking-widest font-mono z-20">
          <div className="hidden md:block">Est. 2026 • Portugal</div>
          <div className="flex gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Instagram</span>
            <span className="hover:text-white transition-colors cursor-pointer">TikTok</span>
          </div>
        </div>

      </main>
    </>
  );
}
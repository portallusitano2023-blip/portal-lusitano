import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      
      {/* 1. IMAGEM DE FUNDO (HERO BACKGROUND) CORRIGIDA */}
      <div className="absolute inset-0 z-0">
        {/*
           DICA: Quando tiveres a tua foto final do cavalo da marca, 
           guarda-a na pasta 'public' como 'hero.jpg' e muda o src para '/hero.jpg'
        */}
        <img 
          // Nova imagem: Um retrato nobre de um cavalo escuro
          src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=1920&auto=format&fit=crop" 
          alt="Nobreza Lusitana" 
          className="w-full h-full object-cover opacity-50" // Ajustei a opacidade para o texto brilhar mais
          style={{ objectPosition: "center 30%" }} // Ajuste para focar mais na cabeça do cavalo
        />
        
        {/* Gradiente para garantir que o texto se lê bem */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-black/40"></div>
      </div>

      {/* 2. CONTEÚDO (Texto e Botões) */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        
        <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#C5A059]">
          Est. 2023 — Portugal
        </p>

        <h1 className="text-6xl md:text-8xl font-serif text-white leading-tight drop-shadow-lg">
          <span className="block text-2xl md:text-4xl italic font-light mb-2 text-zinc-300"></span>
          A OBRA <br />
          LUSITANA
        </h1>

        <p className="text-sm md:text-base font-serif italic text-zinc-200 max-w-lg mx-auto leading-relaxed drop-shadow-md">
          "A união perfeita entre a tradição equestre e o design contemporâneo."
        </p>

        <div className="pt-8">
          <Link 
            href="/loja" 
            className="inline-block border border-white/30 bg-black/20 backdrop-blur-md px-10 py-4 text-[10px] uppercase tracking-[0.3em] text-white hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059] transition-all duration-500"
          >
            Explorar Coleção
          </Link>
        </div>

      </div>

      {/* Decoração Rodapé (Scroll Indicator) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/40">
        <span className="text-[10px] tracking-widest uppercase writing-vertical-rl">Scroll</span>
      </div>

    </main>
  );
}
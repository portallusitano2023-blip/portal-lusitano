// @ts-nocheck
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Maintenance from "@/components/Maintenance"; // Importamos a proteção

export default function Home() {
  // --- LÓGICA DE PROTEÇÃO ---
  // Se o site estiver na Vercel (production), mostra o ecrã preto.
  // Se estiver no teu PC (development), mostra o site real.
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    return <Maintenance />;
  }

  // --- O TEU SITE REAL (Visível apenas para ti) ---
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-black text-white">
        
        {/* --- HERO SECTION: O MANIFESTO --- */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2560" 
              alt="Lusitano Eye" 
              fill
              className="object-cover opacity-40 grayscale"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black"></div>
          </div>

          <div className="relative z-10 text-center max-w-4xl px-6">
            <span className="text-[#C5A059] uppercase tracking-[0.5em] text-xs font-bold mb-6 block animate-pulse">
              O Nosso Manifesto
            </span>
            <h1 className="text-5xl md:text-7xl font-serif italic leading-tight mb-8">
              "Não vendemos cavalos. <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#F2D088]">
                Preservamos História.
              </span>"
            </h1>
            <p className="text-xl text-zinc-300 font-light leading-relaxed">
              O Portal Lusitano nasceu para elevar o Cavalo Puro Sangue Lusitano ao estatuto de obra de arte global. Unimos a tradição secular das Coudelarias portuguesas à inovação tecnológica do século XXI.
            </p>
          </div>
        </section>

        {/* --- SECÇÃO DO FUNDADOR --- */}
        <section className="py-32 px-6 bg-zinc-950 border-t border-zinc-900">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
            
            {/* Foto do Fundador */}
            <div className="w-full md:w-1/2 relative aspect-[3/4] border border-zinc-800 p-4">
              <div className="relative w-full h-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                <Image 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800" 
                  alt="Francisco Gaspar" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-black border border-[#C5A059] px-8 py-4 z-20">
                <p className="text-[#C5A059] font-serif italic text-2xl">Francisco Gaspar</p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Fundador & CEO</p>
              </div>
            </div>

            {/* Texto do Fundador */}
            <div className="w-full md:w-1/2 space-y-8">
              <h2 className="text-4xl font-serif text-white">
                Uma visão nascida em <br/> 
                <span className="text-[#C5A059] italic">2026.</span>
              </h2>
              <div className="space-y-6 text-zinc-400 font-light leading-relaxed">
                <p>
                  "O meu nome é Francisco Gaspar. Como estudante de Engenharia Informática e apaixonado pelo mundo equestre, percebi que existia um fosso gigante entre a qualidade dos nossos cavalos e a forma como eram apresentados ao mundo."
                </p>
                <p>
                  "O Portal Lusitano não é apenas um marketplace. É um ecossistema digital que garante segurança, transparência e prestígio a quem compra e a quem vende."
                </p>
                <p>
                  "O nosso objetivo é simples: tornar o Lusitano no cavalo mais desejado do mundo."
                </p>
              </div>
              
              {/* Assinatura (Visual) */}
              <div className="pt-8 opacity-50">
                <span className="font-script text-4xl text-white">Francisco Gaspar</span>
              </div>
            </div>

          </div>
        </section>

        {/* --- OS PILARES --- */}
        <section className="py-32 px-6 bg-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            
            <div className="p-10 border border-zinc-900 hover:border-[#C5A059] transition-colors group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">💎</div>
              <h3 className="text-white uppercase tracking-widest text-sm font-bold mb-4">Seleção Rigorosa</h3>
              <p className="text-zinc-500 text-sm">Apenas aceitamos cavalos com registo no Livro Genealógico (Stud-book) e exames veterinários aprovados.</p>
            </div>

            <div className="p-10 border border-zinc-900 hover:border-[#C5A059] transition-colors group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">🛡️</div>
              <h3 className="text-white uppercase tracking-widest text-sm font-bold mb-4">Segurança Blockchain</h3>
              <p className="text-zinc-500 text-sm">Cada transação é registada digitalmente, garantindo a autenticidade e o histórico de propriedade.</p>
            </div>

            <div className="p-10 border border-zinc-900 hover:border-[#C5A059] transition-colors group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">🌍</div>
              <h3 className="text-white uppercase tracking-widest text-sm font-bold mb-4">Exportação Global</h3>
              <p className="text-zinc-500 text-sm">Tratamos de toda a burocracia, quarentena e transporte aéreo para qualquer parte do mundo.</p>
            </div>

          </div>
        </section>

      </main>
    </>
  );
}
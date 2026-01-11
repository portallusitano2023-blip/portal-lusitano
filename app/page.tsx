import Link from "next/link";

// Dados simulados (mantive os teus cavalos)
const cavalos = [
  { id: 1, nome: "Imperador", raca: "Lusitano", idade: 5, preco: "25.000€", imagem: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071&auto=format&fit=crop", tipo: "Adestramento", altura: "1.65m" },
  { id: 2, nome: "Zitmar", raca: "Lusitano", idade: 8, preco: "Consultar", imagem: "https://images.unsplash.com/photo-1534008749830-47b2dd1765a0?q=80&w=1932&auto=format&fit=crop", tipo: "Salto", altura: "1.72m" },
  { id: 3, nome: "Bucefalo", raca: "Lusitano", idade: 4, preco: "15.000€", imagem: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1887&auto=format&fit=crop", tipo: "Lazer", altura: "1.60m" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200">
      
      {/* --- HERO SECTION (A NOVA CAPA) --- */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Imagem de Fundo com efeito escuro */}
        <div className="absolute inset-0">
          <img 
            src="/hero.jpg" 
            alt="Capa Portal Lusitano" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
        </div>

        {/* Texto Central */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <span className="text-yellow-600 tracking-[0.2em] text-sm uppercase font-bold mb-4 block">
            Excelência & Tradição
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
            O Mercado Premium do <br/>
            <span className="italic text-yellow-600">Cavalo Lusitano</span>
          </h1>
          <p className="text-lg text-zinc-300 mb-10 max-w-2xl mx-auto">
            Descubra uma seleção exclusiva de cavalos de puro sangue, criados para a alta competição e para a arte equestre.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-yellow-600 text-black font-bold uppercase tracking-wider hover:bg-white transition-colors">
              Ver Leilão
            </button>
            <button className="px-8 py-4 border border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
              Vender Cavalo
            </button>
          </div>
        </div>
      </section>

      {/* --- A TUA LISTA DE CAVALOS (JÁ EXISTIA) --- */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex items-end justify-between mb-12 border-b border-zinc-800 pb-6">
          <div>
            <h2 className="text-3xl font-serif text-white">Destaques da Semana</h2>
            <p className="text-zinc-500 mt-2">Animais selecionados pela nossa equipa de especialistas.</p>
          </div>
          <Link href="#" className="text-yellow-600 hover:text-white transition-colors text-sm uppercase tracking-widest hidden md:block">Ver todos &rarr;</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cavalos.map((cavalo) => (
            <div key={cavalo.id} className="group bg-zinc-900 border border-zinc-800 hover:border-yellow-600 transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={cavalo.imagem} 
                  alt={cavalo.nome} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 text-white text-xs font-bold uppercase tracking-wider">
                  {cavalo.tipo}
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-serif text-white mb-1">{cavalo.nome}</h3>
                    <p className="text-sm text-zinc-500 uppercase tracking-wider">Puro Sangue ({cavalo.idade} Anos)</p>
                  </div>
                  <p className="text-yellow-600 font-bold text-lg">{cavalo.preco}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-zinc-400 border-t border-zinc-800 pt-4 mt-6">
                  <div>
                    <span className="block text-zinc-600 mb-1">Altura</span>
                    {cavalo.altura}
                  </div>
                  <div className="text-right">
                    <span className="block text-zinc-600 mb-1">Registo</span>
                    APSL-2024
                  </div>
                </div>

                <Link href={`/cavalos/${cavalo.id}`} className="block w-full text-center mt-6 py-4 bg-zinc-950 border border-zinc-700 text-white text-xs font-bold hover:bg-yellow-600 hover:text-black hover:border-yellow-600 transition-all uppercase tracking-widest">
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
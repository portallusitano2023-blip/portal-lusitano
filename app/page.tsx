import Link from "next/link"; // <--- ISTO É OBRIGATÓRIO NA LINHA 1

export default function Home() {
  // A NOSSA BASE DE DADOS
  const cavalos = [
    {
      id: 1,
      nome: "Imperador II",
      preco: "25.000€",
      imagem: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071&auto=format&fit=crop",
      idade: "5 Anos",
      altura: "1.68m",
      tipo: "Garanhão"
    },
    {
      id: 2,
      nome: "Zarolho",
      preco: "12.500€",
      imagem: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1974&auto=format&fit=crop",
      idade: "8 Anos",
      altura: "1.62m",
      tipo: "Castrado"
    },
    {
      id: 3,
      nome: "Bucefalo Real",
      preco: "45.000€",
      imagem: "https://images.unsplash.com/photo-1545312037-01210202958d?q=80&w=2070&auto=format&fit=crop",
      idade: "4 Anos",
      altura: "1.72m",
      tipo: "Garanhão"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <main className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-6">
        <h1 className="text-5xl md:text-8xl font-serif text-yellow-600 tracking-wider">
          PORTAL LUSITANO
        </h1>
        <p className="text-xl text-zinc-400 font-light tracking-widest uppercase">
          Onde a tradição encontra a tecnologia
        </p>
      </main>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-serif text-white mb-8 border-l-4 border-yellow-600 pl-4">
          Cavalos Disponíveis ({cavalos.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {cavalos.map((cavalo) => (
            <div key={cavalo.id} className="group bg-zinc-900 border border-zinc-800 hover:border-yellow-600 transition-all duration-300 cursor-pointer overflow-hidden rounded-lg">
              
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={cavalo.imagem} 
                  alt={cavalo.nome} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-serif text-white">{cavalo.nome}</h3>
                    <p className="text-sm text-zinc-400">Puro Sangue Lusitano</p>
                  </div>
                  <p className="text-yellow-600 font-bold text-lg">{cavalo.preco}</p>
                </div>

                <div className="flex gap-2 text-xs text-zinc-500 uppercase tracking-wide">
                  <span className="bg-zinc-800 px-2 py-1 rounded">{cavalo.idade}</span>
                  <span className="bg-zinc-800 px-2 py-1 rounded">{cavalo.tipo}</span>
                  <span className="bg-zinc-800 px-2 py-1 rounded">{cavalo.altura}</span>
                </div>

                {/* AQUI ESTÁ O LINK QUE FAZ A MAGIA FUNCIONAR 👇 */}
                <Link href={`/cavalos/${cavalo.id}`} className="block w-full text-center mt-4 py-3 bg-white text-black font-bold text-sm hover:bg-yellow-600 transition-colors uppercase">
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
}
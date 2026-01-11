import Link from "next/link";

// 1. Precisamos da mesma lista de dados aqui para o site saber quem procurar.
// (Num futuro próximo, isto virá de uma Base de Dados real e não precisas de copiar)
const cavalos = [
  {
    id: 1,
    nome: "Imperador II",
    preco: "25.000€",
    imagem: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?q=80&w=2071&auto=format&fit=crop",
    idade: "5 Anos",
    altura: "1.68m",
    tipo: "Garanhão",
    descricao: "Um exemplo clássico da raça Lusitana. O Imperador II demonstra uma elasticidade incrível e um temperamento dócil, ideal para competição de Dressage."
  },
  {
    id: 2,
    nome: "Zarolho",
    preco: "12.500€",
    imagem: "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?q=80&w=1974&auto=format&fit=crop",
    idade: "8 Anos",
    altura: "1.62m",
    tipo: "Castrado",
    descricao: "Cavalo de confiança para qualquer cavaleiro. O Zarolho tem vasta experiência em equitação de trabalho e passeios no campo."
  },
  {
    id: 3,
    nome: "Bucefalo Real",
    preco: "45.000€",
    imagem: "https://images.unsplash.com/photo-1545312037-01210202958d?q=80&w=2070&auto=format&fit=crop",
    idade: "4 Anos",
    altura: "1.72m",
    tipo: "Garanhão",
    descricao: "Filho de campeões. O Bucefalo Real é uma promessa para o futuro, com movimentos elevados e uma morfologia barroca invejável."
  }
];

export default async function DetalheCavalo({ params }: { params: Promise<{ id: string }> }) {
  // O Next.js diz-nos qual é o ID da página através dos "params"
  const { id } = await params;
  
  // Vamos procurar o cavalo que tem este ID
  const cavalo = cavalos.find((c) => c.id === Number(id));

  // Se alguém inventar um ID que não existe (ex: /cavalos/999)
  if (!cavalo) {
    return <div className="text-white text-center mt-20">Cavalo não encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-20">
      
      {/* Botão de Voltar */}
      <div className="p-6">
        <Link href="/" className="text-yellow-600 hover:text-white transition-colors">
          ← Voltar à Lista
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-4">
        
        {/* Lado Esquerdo: Imagem Grande */}
        <div className="rounded-xl overflow-hidden border border-zinc-800 h-[500px]">
          <img 
            src={cavalo.imagem} 
            alt={cavalo.nome} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Lado Direito: Informação */}
        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-serif text-white mb-2">{cavalo.nome}</h1>
            <p className="text-2xl text-yellow-600 font-bold">{cavalo.preco}</p>
          </div>

          {/* Tabela de Características */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
              <span className="text-zinc-500 block">Idade</span>
              <span className="text-white text-lg">{cavalo.idade}</span>
            </div>
            <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
              <span className="text-zinc-500 block">Altura</span>
              <span className="text-white text-lg">{cavalo.altura}</span>
            </div>
            <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
              <span className="text-zinc-500 block">Género</span>
              <span className="text-white text-lg">{cavalo.tipo}</span>
            </div>
            <div className="bg-zinc-900 p-4 rounded border border-zinc-800">
              <span className="text-zinc-500 block">Registo</span>
              <span className="text-white text-lg">APSL (Puro)</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-serif">Sobre este Cavalo</h3>
            <p className="text-zinc-400 leading-relaxed">
              {cavalo.descricao}
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-4">
             <button className="flex-1 py-4 bg-yellow-600 text-black font-bold uppercase tracking-wider hover:bg-white transition-colors">
               Comprar Agora
             </button>
             <button className="flex-1 py-4 border border-zinc-700 text-white uppercase tracking-wider hover:bg-zinc-900 transition-colors">
               Pedir Raio-X
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
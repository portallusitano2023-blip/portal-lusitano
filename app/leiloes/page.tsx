import Link from "next/link";

export default function Leiloes() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        
        <span className="text-yellow-600 tracking-widest uppercase text-sm font-bold mb-4 block">
          Oportunidades Exclusivas
        </span>
        
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-8">
          Leilões Ativos
        </h1>
        
        <p className="text-xl text-zinc-400 mb-16 leading-relaxed">
          Participe nos leilões mais prestigiados do mundo equestre. 
          Licite em tempo real e adquira exemplares únicos da raça Lusitana.
        </p>

        {/* CARTÃO DE LEILÃO EXEMPLO */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 relative overflow-hidden group hover:border-yellow-600 transition-all">
            <div className="absolute top-0 right-0 bg-yellow-600 text-black font-bold px-6 py-2 text-sm uppercase tracking-wider">
                A Decorrer
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center text-left">
                <div className="w-full md:w-1/2 h-64 bg-zinc-800">
                    <img src="https://images.unsplash.com/photo-1612138096277-33a341499577?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Leilão" />
                </div>
                <div className="w-full md:w-1/2">
                    <h3 className="text-2xl font-serif text-white mb-2">Coleção Primavera 2026</h3>
                    <p className="text-zinc-500 mb-6">Uma seleção de 5 poldros de linhas Veiga e Andrade com potencial genético comprovado.</p>
                    
                    <div className="flex justify-between items-center border-t border-zinc-800 pt-6">
                        <div>
                            <span className="block text-xs text-zinc-500 uppercase">Termina em</span>
                            <span className="text-yellow-600 font-bold text-xl">2 Dias : 04h</span>
                        </div>
                        <button className="px-6 py-3 bg-white text-black font-bold uppercase text-xs tracking-widest hover:bg-yellow-600 transition-colors">
                            Entrar no Leilão
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-12">
            <Link href="/" className="text-zinc-500 hover:text-white transition-colors border-b border-zinc-800 hover:border-white pb-1">
                Voltar à Página Inicial
            </Link>
        </div>

      </div>
    </main>
  );
}
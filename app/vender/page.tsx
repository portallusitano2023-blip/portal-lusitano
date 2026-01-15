import Link from "next/link";

export default function VenderPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200 pt-32 pb-20">
      
      {/* --- CABEÇALHO --- */}
      <section className="max-w-4xl mx-auto px-4 text-center mb-20">
        <span className="text-yellow-600 tracking-widest uppercase text-sm font-bold mb-4 block">
          Parceiros Exclusivos
        </span>
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">
          Venda o seu Lusitano para <br />
          <span className="italic text-zinc-500">Todo o Mundo</span>
        </h1>
        <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          O Portal Lusitano conecta criadores de excelência a compradores internacionais. 
          Nós tratamos do marketing, da triagem e da negociação.
        </p>
      </section>

      {/* --- COMO FUNCIONA (3 Passos) --- */}
      <section className="max-w-7xl mx-auto px-4 mb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Passo 1 */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-yellow-600 transition-colors group">
          <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">📸</div>
          <h3 className="text-xl font-serif text-white mb-3">1. Avaliação e Multimédia</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            A nossa equipa valida a qualidade do animal e produzimos fotos e vídeos profissionais para destacar o seu cavalo.
          </p>
        </div>

        {/* Passo 2 */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-yellow-600 transition-colors group">
          <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">🌍</div>
          <h3 className="text-xl font-serif text-white mb-3">2. Alcance Global</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Publicamos o seu cavalo na nossa rede de contactos premium nos EUA, Brasil, Alemanha e França.
          </p>
        </div>

        {/* Passo 3 */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 hover:border-yellow-600 transition-colors group">
          <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">🤝</div>
          <h3 className="text-xl font-serif text-white mb-3">3. Venda Segura</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Acompanhamos todo o processo, desde os exames veterinários até ao transporte internacional.
          </p>
        </div>

      </section>


      {/* --- MUDANÇA AQUI: NOVO FORMULÁRIO DE CONTACTO --- */}
      <section className="bg-white text-black py-20" id="contact-form">
        <div className="max-w-2xl mx-auto px-4">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Inicie o Processo de Venda</h2>
            <p className="text-zinc-600">
              Preencha o formulário abaixo. A nossa equipa entrará em contacto para agendar a avaliação do animal.
            </p>
          </div>

          <form className="space-y-6 bg-zinc-50 p-8 border border-zinc-200 shadow-lg">
            
            {/* Nome e Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">O seu Nome</label>
                <input type="text" className="w-full bg-white border border-zinc-300 p-3 text-sm focus:border-yellow-600 focus:outline-none" placeholder="João Silva" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Email</label>
                <input type="email" className="w-full bg-white border border-zinc-300 p-3 text-sm focus:border-yellow-600 focus:outline-none" placeholder="joao@exemplo.com" />
              </div>
            </div>

            {/* Telemóvel */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Telemóvel</label>
              <input type="tel" className="w-full bg-white border border-zinc-300 p-3 text-sm focus:border-yellow-600 focus:outline-none" placeholder="+351 91..." />
            </div>

            {/* Sobre o Cavalo */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Detalhes do Cavalo</label>
              <textarea rows={4} className="w-full bg-white border border-zinc-300 p-3 text-sm focus:border-yellow-600 focus:outline-none" placeholder="Nome, Idade, Nível de Ensino, Preço pretendido..."></textarea>
            </div>

            <button type="submit" className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-yellow-600 hover:text-black transition-colors">
              Enviar Pedido de Avaliação
            </button>

            <p className="text-center text-xs text-zinc-400 mt-4">
              * Ao enviar, concorda em ser contactado pelo Portal Lusitano.
            </p>
          </form>

        </div>
      </section>

    </main>
  );
}
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

      {/* --- CTA / CONTACTO --- */}
      <section className="bg-white text-black py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-6">Pronto para valorizar a sua criação?</h2>
          <p className="text-zinc-600 mb-10 max-w-lg mx-auto">
            Envie-nos os detalhes do seu cavalo via WhatsApp. A nossa equipa responderá em menos de 24 horas com uma proposta de avaliação.
          </p>
          
          <a 
            href="https://wa.me/351910000000?text=Olá,%20tenho%20um%20cavalo%20para%20vender%20e%20gostaria%20de%20saber%20como%20funciona%20o%20Portal%20Lusitano." 
            target="_blank"
            className="inline-block px-10 py-5 bg-black text-white font-bold uppercase tracking-widest hover:bg-yellow-600 hover:text-black transition-colors"
          >
            Falar com a Equipa
          </a>
        </div>
      </section>

    </main>
  );
}
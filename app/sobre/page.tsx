// @ts-nocheck
import Link from "next/link";

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* HERO SECTION */}
        <section className="text-center mb-24">
          <span className="text-[#C5A059] uppercase tracking-[0.4em] text-xs font-bold mb-4 block">A Nossa Essência</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 italic">Tradição Equestre, <br/> Visão Digital</h1>
          <div className="w-24 h-px bg-[#C5A059] mx-auto opacity-50"></div>
        </section>

        {/* HISTÓRIA E VISÃO */}
        <div className="grid gap-16 text-zinc-400 leading-relaxed text-lg font-serif italic">
          <section className="space-y-6">
            <p>
              O <strong className="text-white not-italic">Portal Lusitano</strong> nasceu da necessidade de elevar a forma como o Puro Sangue Lusitano é apresentado ao mundo. Num mercado onde a linhagem e a morfologia são fundamentais, unimos a tradição das coudelarias portuguesas à inovação tecnológica.
            </p>
            <p>
              Fundado por um entusiasta da raça e estudante de <strong className="text-white not-italic">Engenharia Informática na Nova FCT</strong>, o portal reflete um compromisso duplo: a precisão técnica no desenvolvimento da plataforma e a sensibilidade na seleção de cada exemplar apresentado.
            </p>
          </section>

          {/* PILARES DE CONFIANÇA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="border border-zinc-900 p-8 bg-zinc-900/30">
              <h3 className="text-[#C5A059] font-serif text-xl mb-4">Curadoria de Elite</h3>
              <p className="text-sm">Cada cavalo no nosso portal é selecionado com base em critérios rigorosos de genealogia, funcionalidade e caráter.</p>
            </div>
            <div className="border border-zinc-900 p-8 bg-zinc-900/30">
              <h3 className="text-[#C5A059] font-serif text-xl mb-4">Transparência Total</h3>
              <p className="text-sm">Acreditamos que um negócio de confiança baseia-se em dados claros e comunicação direta entre especialistas e investidores.</p>
            </div>
          </div>

          {/* O FUNDADOR */}
          <section className="border-t border-zinc-900 pt-16">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-3xl font-serif text-white mb-6">O Compromisso do Fundador</h2>
                <p className="mb-6">
                  "O meu objetivo com o Portal Lusitano é criar uma ponte digital segura e digna da nobreza deste cavalo. Cada linha de código e cada parceria é feita a pensar na preservação e valorização do nosso património equestre."
                </p>
                <p className="text-[#C5A059] text-sm font-bold uppercase tracking-widest">— Francisco Gaspar, Fundador</p>
              </div>
            </div>
          </section>

          {/* CONTACTOS E REDES */}
          <section className="bg-zinc-900/50 p-12 text-center border border-[#C5A059]/20">
            <h3 className="text-2xl font-serif text-white mb-6">Entre em Contacto</h3>
            <div className="space-y-2 text-sm uppercase tracking-widest text-zinc-500">
              <p>Email: <span className="text-white">portal.lusitano2023@gmail.com</span></p>
              <p>Instagram: <span className="text-white">@portal_lusitano</span></p>
              <p>TikTok: <span className="text-white">@portal_lusitano</span></p>
            </div>
            <Link href="/leiloes" className="inline-block mt-8 px-8 py-4 bg-[#C5A059] text-black font-bold text-xs uppercase tracking-widest hover:bg-white transition-all">
              Explorar Leilões Ativos
            </Link>
          </section>
        </div>

      </div>
    </main>
  );
}
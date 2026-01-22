import Navbar from "@/components/Navbar";

export default function TermosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-light selection:bg-[#C5A059] selection:text-black">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold block mb-6 text-center">Jurídico</span>
          <h1 className="text-4xl md:text-5xl font-serif italic mb-16 text-center">Termos & Condições</h1>
          
          <div className="space-y-12 text-zinc-400 leading-relaxed text-sm">
            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">1. Âmbito do Serviço</h2>
              <p>O Portal Lusitano opera como uma plataforma de marketplace e editorial dedicada à raça Lusitana. Ao aceder ao nosso site, o utilizador concorda em cumprir os presentes termos de utilização.</p>
            </section>

            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">2. Marketplace de Elite</h2>
              <p>As transações comerciais realizadas através da nossa loja são processadas de forma segura. O Portal Lusitano reserva-se o direito de selecionar criteriosamente as peças e coudelarias presentes na plataforma para garantir o padrão de qualidade da marca.</p>
            </section>

            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">3. Propriedade Intelectual</h2>
              <p>Todo o conteúdo editorial, design e fotografias presentes no "Jornal Lusitano" e na loja são propriedade exclusiva do Portal Lusitano ou dos seus parceiros devidamente identificados.</p>
            </section>

            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">4. Limitação de Responsabilidade</h2>
              <p>Embora envidemos todos os esforços para garantir a precisão das informações sobre coudelarias e linhagens genéticas, o Portal Lusitano não se responsabiliza por imprecisões fornecidas por terceiros.</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
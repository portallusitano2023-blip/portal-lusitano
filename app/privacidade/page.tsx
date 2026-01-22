import Navbar from "@/components/Navbar";

export default function PrivacidadePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 font-light selection:bg-[#C5A059] selection:text-black">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#C5A059] text-[9px] uppercase tracking-[0.4em] font-bold block mb-6 text-center">Segurança</span>
          <h1 className="text-4xl md:text-5xl font-serif italic mb-16 text-center">Política de Privacidade</h1>
          
          <div className="space-y-12 text-zinc-400 leading-relaxed text-sm">
            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">Privacidade dos Dados</h2>
              <p>No Portal Lusitano, tratamos os seus dados pessoais com o mesmo rigor que tratamos a genética da nossa raça. Os seus dados de membro (Portal ID) são utilizados exclusivamente para gerir a sua conta e histórico de aquisições.</p>
            </section>

            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">Recolha de Informação</h2>
              <p>Recolhemos informações quando se regista no nosso site, faz uma compra ou subscreve a nossa newsletter. Isto inclui o seu nome, e-mail e endereço de faturação.</p>
            </section>

            <section>
              <h2 className="text-white font-serif italic text-xl mb-4">Cookies e Shopify</h2>
              <p>Utilizamos cookies para melhorar a sua experiência de navegação e processar os itens no seu saco de compras através da infraestrutura segura do Shopify.</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
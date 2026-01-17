// @ts-nocheck
import { supabase } from "@/lib/supabase";

// Dentro da tua função DetalheCavaloPage, busca os depoimentos:
const { data: depoimentos } = await supabase
  .from('depoimentos_cavalos')
  .select('*')
  .eq('cavalo_id', id)
  .eq('status', 'aprovado');

// No final do ficheiro (antes do fecho do main), adiciona este código:
<section className="max-w-7xl mx-auto px-6 mt-32 border-t border-zinc-900 pt-24">
  <div className="text-center mb-16">
    <span className="text-[#C5A059] uppercase tracking-[0.4em] text-[10px] font-bold block mb-4">Credibilidade</span>
    <h2 className="text-4xl font-serif italic">Depoimentos de Especialistas</h2>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
    {depoimentos?.map((d) => (
      <div key={d.id} className="bg-zinc-950/30 p-10 border-l border-[#C5A059]/30">
        <p className="text-zinc-400 font-serif italic text-lg mb-8 leading-relaxed">"{d.mensagem}"</p>
        <div>
          <p className="text-white font-bold uppercase tracking-widest text-xs">{d.autor_nome}</p>
          <p className="text-[#C5A059] text-[9px] uppercase mt-1 italic">{d.autor_cargo}</p>
        </div>
      </div>
    ))}
  </div>

  {/* FORMULÁRIO DE TESTEMUNHO DISCRETO */}
  <div className="max-w-2xl mx-auto bg-zinc-950/20 p-12 border border-zinc-900">
    <h3 className="text-center font-serif italic text-xl mb-10 text-zinc-300">Deixar Testemunho sobre o Exemplar</h3>
    <form className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <input placeholder="Nome Completo" className="bg-transparent border-b border-zinc-800 p-3 outline-none focus:border-[#C5A059] text-sm transition-all" />
        <input placeholder="Cargo / Relação (Ex: Treinador)" className="bg-transparent border-b border-zinc-800 p-3 outline-none focus:border-[#C5A059] text-sm transition-all" />
      </div>
      <textarea placeholder="A sua análise técnica sobre este cavalo..." rows={4} className="w-full bg-transparent border-b border-zinc-800 p-3 outline-none focus:border-[#C5A059] text-sm transition-all" />
      <button className="w-full border border-[#C5A059]/40 text-[#C5A059] py-4 text-[9px] uppercase font-bold tracking-[0.3em] hover:bg-[#C5A059] hover:text-black transition-all duration-700">
        Submeter para Validação
      </button>
    </form>
  </div>
</section>
// @ts-nocheck
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function VenderPage() {
  const [step, setStep] = useState(1); // 1 = Criar, 2 = Pagar
  const [selectedPlan, setSelectedPlan] = useState<"standard" | "gold" | null>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    linhagem: "Veiga (MV)",
    localizacao: "",
    idade: "",
    imagem: "",
    descricao: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Navbar dev={true} />
      <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
        
        {/* PROGRESS BAR */}
        <div className="max-w-4xl mx-auto mb-16 flex items-center justify-between text-[10px] uppercase tracking-widest text-zinc-500">
           <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#C5A059]' : ''}`}>
             <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold">1</span>
             <span>Dados do Cavalo</span>
           </div>
           <div className="h-px w-20 bg-zinc-800"></div>
           <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#C5A059]' : ''}`}>
             <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold">2</span>
             <span>Plano de Exposição</span>
           </div>
        </div>

        {/* STEP 1: O ESTÚDIO DE CRIAÇÃO (Igual ao anterior, mas com botão 'Continuar') */}
        {step === 1 && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* ... (FORMULÁRIO DE INPUTS IGUAL AO ANTERIOR) ... */}
            <div className="space-y-8">
               <div className="bg-zinc-950 p-8 border border-zinc-900 space-y-6">
                 <h3 className="text-white uppercase tracking-widest text-xs font-bold border-b border-zinc-800 pb-4">Criar Anúncio</h3>
                 <div className="space-y-4">
                    <input name="nome" onChange={handleChange} type="text" className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-[#C5A059] outline-none" placeholder="Nome do Cavalo" value={formData.nome} />
                    <input name="imagem" onChange={handleChange} type="text" className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-[#C5A059] outline-none" placeholder="Link da Imagem (URL)" value={formData.imagem} />
                    <div className="grid grid-cols-2 gap-4">
                       <input name="preco" onChange={handleChange} type="number" className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-[#C5A059] outline-none" placeholder="Preço (€)" value={formData.preco} />
                       <select name="linhagem" onChange={handleChange} className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-[#C5A059] outline-none" value={formData.linhagem}>
                          <option>Veiga (MV)</option>
                          <option>Andrade (SA)</option>
                          <option>Alter-Real (AR)</option>
                          <option>C. Nacional (CN)</option>
                       </select>
                    </div>
                    <textarea name="descricao" onChange={handleChange} className="w-full bg-black border border-zinc-800 p-4 text-white focus:border-[#C5A059] outline-none h-32" placeholder="Descrição curta..." value={formData.descricao}></textarea>
                 </div>
               </div>
               
               <button 
                 onClick={() => setStep(2)}
                 disabled={!formData.nome || !formData.preco}
                 className="w-full bg-zinc-900 border border-zinc-700 text-white py-6 text-[11px] uppercase font-bold tracking-[0.4em] hover:bg-[#C5A059] hover:text-black hover:border-[#C5A059] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed">
                 Continuar para Pagamento
               </button>
            </div>

            {/* PREVIEW DO CARTÃO */}
            <div className="relative hidden lg:block">
               <div className="sticky top-32">
                 <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-4 animate-pulse">● Live Preview</p>
                 <div className="group border border-zinc-800 bg-zinc-950 pb-8">
                    <div className="aspect-[4/5] overflow-hidden mb-6 relative bg-zinc-900">
                       {formData.imagem ? <img src={formData.imagem} className="w-full h-full object-cover grayscale" /> : <div className="flex h-full items-center justify-center text-zinc-700 text-xs">Sem Imagem</div>}
                       <div className="absolute top-4 right-4 bg-black/80 px-4 py-1 text-[#C5A059] text-[8px] uppercase font-bold tracking-widest">{formData.linhagem}</div>
                    </div>
                    <div className="px-8">
                       <h2 className="text-3xl font-serif italic mb-2 text-white">{formData.nome || "Nome..."}</h2>
                       <p className="text-[#C5A059] text-xl font-serif italic">{formData.preco ? `${Number(formData.preco).toLocaleString()} €` : "0 €"}</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* STEP 2: A ESCOLHA DO PLANO (MONETIZAÇÃO) */}
        {step === 2 && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-serif italic mb-6">Escolha o seu <span className="text-[#C5A059]">Palco</span></h2>
              <p className="text-zinc-500 text-lg font-light">Selecione como quer apresentar o seu cavalo ao mercado global.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* PLANO STANDARD */}
              <div 
                onClick={() => setSelectedPlan('standard')}
                className={`p-10 border cursor-pointer transition-all duration-500 relative group
                  ${selectedPlan === 'standard' ? 'border-white bg-zinc-900' : 'border-zinc-800 bg-black hover:border-zinc-600'}
                `}
              >
                <div className="absolute top-0 right-0 p-4">
                  {selectedPlan === 'standard' && <div className="w-4 h-4 bg-white rounded-full"></div>}
                </div>
                <h3 className="text-2xl font-serif italic text-white mb-2">Listing Standard</h3>
                <p className="text-4xl font-bold text-white mb-8">25€ <span className="text-sm font-normal text-zinc-500">/ único</span></p>
                <ul className="space-y-4 text-sm text-zinc-400 mb-10">
                  <li className="flex gap-3"><span className="text-white">✓</span> Presença no Marketplace (30 dias)</li>
                  <li className="flex gap-3"><span className="text-white">✓</span> Ficha Técnica Básica</li>
                  <li className="flex gap-3"><span className="text-white">✓</span> Contacto Direto no WhatsApp</li>
                  <li className="flex gap-3 text-zinc-600 line-through">✗ Destaque na Homepage</li>
                  <li className="flex gap-3 text-zinc-600 line-through">✗ Divulgação no TikTok Portal Lusitano</li>
                </ul>
                <button className={`w-full py-4 text-[10px] uppercase font-bold tracking-[0.2em] border ${selectedPlan === 'standard' ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500'}`}>
                  Selecionar Standard
                </button>
              </div>

              {/* PLANO GOLD (PREMIUM) */}
              <div 
                onClick={() => setSelectedPlan('gold')}
                className={`p-10 border cursor-pointer transition-all duration-500 relative overflow-hidden
                  ${selectedPlan === 'gold' ? 'border-[#C5A059] bg-[#C5A059]/5' : 'border-zinc-800 bg-black hover:border-[#C5A059]/50'}
                `}
              >
                {/* Etiqueta de Recomendado */}
                <div className="absolute top-0 right-0 bg-[#C5A059] text-black text-[9px] uppercase font-bold px-4 py-1 tracking-widest">Recomendado</div>
                
                <h3 className="text-2xl font-serif italic text-[#C5A059] mb-2">Listing Gold</h3>
                <p className="text-4xl font-bold text-white mb-8">75€ <span className="text-sm font-normal text-zinc-500">/ único</span></p>
                <ul className="space-y-4 text-sm text-zinc-300 mb-10">
                  <li className="flex gap-3"><span className="text-[#C5A059]">✓</span> Presença Permanente (Até vender)</li>
                  <li className="flex gap-3"><span className="text-[#C5A059]">✓</span> <strong className="text-white">Destaque na Homepage</strong> (Top 3)</li>
                  <li className="flex gap-3"><span className="text-[#C5A059]">✓</span> Badge "Verificado" Dourado</li>
                  <li className="flex gap-3"><span className="text-[#C5A059]">✓</span> <strong>Post no TikTok & Instagram</strong> (+50k views)</li>
                </ul>
                <button className={`w-full py-4 text-[10px] uppercase font-bold tracking-[0.2em] border ${selectedPlan === 'gold' ? 'bg-[#C5A059] text-black border-[#C5A059]' : 'border-zinc-800 text-zinc-500'}`}>
                  Selecionar Gold
                </button>
              </div>

            </div>

            {/* BOTÃO FINAL DE CHECKOUT */}
            <div className="mt-12 text-center">
               <button 
                 disabled={!selectedPlan}
                 className="bg-white text-black px-12 py-5 text-[11px] uppercase font-bold tracking-[0.4em] hover:bg-[#C5A059] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl">
                 Pagar e Publicar ({selectedPlan === 'gold' ? '75€' : selectedPlan === 'standard' ? '25€' : '0€'})
               </button>
               <p className="mt-6 text-[9px] uppercase tracking-widest text-zinc-600">
                 Pagamento seguro via Stripe • O anúncio fica online imediatamente após confirmação
               </p>
            </div>
            
            <div className="mt-8 text-center">
               <button onClick={() => setStep(1)} className="text-zinc-500 text-xs hover:text-white underline underline-offset-4">
                 Voltar e editar dados
               </button>
            </div>

          </div>
        )}

      </main>
    </>
  );
}
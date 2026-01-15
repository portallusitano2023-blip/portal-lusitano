// @ts-nocheck
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importação necessária para o redirecionamento

export default function BiddingForm({ cavaloNome }) {
  const [status, setStatus] = useState('idle'); // idle, loading
  const router = useRouter(); // Inicializamos o router

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');

    // Correção: Usamos FormData diretamente
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.cavalo = cavaloNome;

    try {
      const res = await fetch('/api/bid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // Em vez de apenas mudar o status, enviamos o investidor para a página de prestígio
        router.push('/sucesso');
      } else {
        throw new Error('Falha no envio');
      }
    } catch (error) {
      console.error("Erro na licitação:", error);
      alert("Ocorreu um erro ao enviar a sua licitação. Por favor, tente novamente.");
      setStatus('idle');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900/50 p-6 border border-[#C5A059]/30">
      <h3 className="text-[#C5A059] uppercase tracking-widest text-xs font-bold mb-4">Efetuar Licitação Oficial</h3>
      
      <input name="nome" placeholder="Nome Completo" required className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-[#C5A059] outline-none" />
      
      <div className="grid grid-cols-2 gap-4">
        <input name="email" type="email" placeholder="E-mail" required className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-[#C5A059] outline-none" />
        <input name="telefone" placeholder="Telefone" required className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-[#C5A059] outline-none" />
      </div>
      
      <input name="valor" type="number" placeholder="Valor da sua licitação (€)" required className="w-full bg-black border border-[#C5A059]/50 p-4 text-xl font-serif text-[#C5A059] focus:border-[#C5A059] outline-none" />
      
      <button 
        disabled={status === 'loading'}
        className="w-full py-4 bg-[#C5A059] text-black font-bold uppercase text-xs tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50"
      >
        {status === 'loading' ? 'A processar proposta...' : 'Confirmar Licitação'}
      </button>

      <p className="text-[9px] text-zinc-500 uppercase tracking-tighter text-center mt-2">
        Ao confirmar, a sua proposta será enviada para validação oficial.
      </p>
    </form>
  );
}
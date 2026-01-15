// @ts-nocheck
'use client';
import { useState } from 'react';

export default function BiddingForm({ cavaloNome }) {
  const [status, setStatus] = useState('idle'); // idle, loading, success

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');

    const formData = new Intl.FormData(e.target);
    const data = Object.fromEntries(formData);
    data.cavalo = cavaloNome;

    const res = await fetch('/api/bid', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (res.ok) setStatus('success');
  }

  if (status === 'success') {
    return (
      <div className="bg-green-900/20 border border-green-500 p-6 text-center text-white">
        <p className="font-serif text-lg">Proposta enviada com sucesso!</p>
        <p className="text-xs mt-2 opacity-70">Francisco Gaspar entrará em contacto em breve.</p>
      </div>
    );
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
        {status === 'loading' ? 'A enviar...' : 'Confirmar Licitação'}
      </button>
    </form>
  );
}
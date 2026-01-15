'use client';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Aqui faremos a ligação com a API que vamos criar a seguir
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (res.ok) setStatus('success');
    else setStatus('error');
  };

  return (
    <section className="bg-[#0a0a0a] border-y border-gray-900 py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-serif text-white mb-4">Inscreva-se na <span className="text-[#C5A059]">Gazeta Lusitana</span></h2>
        <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs">Receba análises de linhagens e oportunidades de investimento por e-mail.</p>
        
        {status === 'success' ? (
          <p className="text-[#C5A059] font-bold">Bem-vindo à elite. A sua subscrição foi confirmada.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="O seu melhor e-mail" 
              className="bg-black border border-gray-800 px-6 py-4 text-white w-full md:w-96 focus:border-[#C5A059] outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="bg-[#C5A059] text-black px-10 py-4 font-bold uppercase text-xs tracking-widest hover:bg-white transition"
            >
              {status === 'loading' ? 'A Processar...' : 'Subscrever'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
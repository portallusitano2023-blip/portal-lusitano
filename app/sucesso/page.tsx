// @ts-nocheck
'use client';

import Link from "next/link";
import { useEffect } from "react";

export default function SucessoPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center pt-20">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Ícone de Sucesso de Luxo */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 border border-[#C5A059] flex items-center justify-center rounded-full">
            <svg className="w-10 h-10 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <span className="text-[#C5A059] uppercase tracking-[0.4em] text-xs font-bold mb-4 block">Proposta Registada</span>
        <h1 className="text-4xl md:text-5xl font-serif italic mb-6">Agradecemos a sua preferência</h1>
        
        <div className="space-y-6 text-zinc-400 font-serif text-lg leading-relaxed mb-12">
          <p>
            A sua intenção de licitação foi recebida com sucesso pelo sistema do <strong className="text-white not-italic">Portal Lusitano</strong>.
          </p>
          <p className="text-sm uppercase tracking-widest text-zinc-500">
            A nossa equipa entrará em contacto consigo através do telefone indicado num prazo máximo de <span className="text-white">12 horas</span> para validar os detalhes.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Link href="/leiloes" className="px-8 py-4 bg-[#C5A059] text-black font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all w-full md:w-auto">
            Explorar Outros Exemplares
          </Link>
          <Link href="/" className="px-8 py-4 border border-zinc-800 text-zinc-500 font-bold text-[10px] uppercase tracking-[0.2em] hover:text-white hover:border-white transition-all w-full md:w-auto">
            Voltar ao Início
          </Link>
        </div>

        <p className="mt-16 text-[10px] text-zinc-600 uppercase tracking-[0.3em]">
          Excelência Equestre & Precisão Tecnológica
        </p>
      </div>
    </main>
  );
}
"use client";

import Link from "next/link";
import { cavalos } from "../data/cavalos";
import { useState } from "react";
// Importamos a biblioteca de animação
import { motion } from "framer-motion"; 

export default function Home() {
  const [busca, setBusca] = useState("");

  const cavalosFiltrados = cavalos.filter((cavalo) => {
    const texto = busca.toLowerCase();
    return (
      cavalo.nome.toLowerCase().includes(texto) ||
      cavalo.raca.toLowerCase().includes(texto) ||
      cavalo.tipo.toLowerCase().includes(texto)
    );
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-200">
      
      {/* --- HERO SECTION ANIMADA --- */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-zinc-900"></div>
          {/* Imagem com ligeiro zoom inicial */}
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5 }}
            src="/hero.jpg" 
            alt="Capa Portal Lusitano" 
            className="w-full h-full object-cover relative z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10"></div>
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
          {/* Texto a subir suavemente */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="text-yellow-600 tracking-[0.2em] text-sm uppercase font-bold mb-4 block">
              Excelência & Tradição
            </span>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
              O Mercado Premium do <br/>
              <span className="italic text-yellow-600">Cavalo Lusitano</span>
            </h1>
            
            <div className="flex gap-4 justify-center mt-10">
              <Link href="/leiloes" className="px-8 py-4 bg-yellow-600 text-black font-bold uppercase tracking-wider hover:bg-white transition-colors">
                Ver Leilões
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- LISTA DE CAVALOS --- */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-zinc-800 pb-6 gap-6">
          <div>
            <h2 className="text-3xl font-serif text-white">Destaques da Semana</h2>
          </div>
          <div className="w-full md:w-1/3 relative">
            <input 
              type="text" 
              placeholder="Pesquisar por nome..." 
              className="w-full bg-zinc-900 border border-zinc-700 text-white px-4 py-3 focus:outline-none focus:border-yellow-600 transition-colors placeholder:text-zinc-600"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cavalosFiltrados.length > 0 ? (
            cavalosFiltrados.map((cavalo, index) => (
              // Cada cartão aparece com um atraso (stagger) dependendo da posição
              <motion.div 
                key={cavalo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group bg-zinc-900 border border-zinc-800 hover:border-yellow-600 transition-all duration-300"
              >
                <div className="relative h-80 overflow-hidden">
                  <img src={cavalo.imagem} alt={cavalo.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-serif text-white mb-1">{cavalo.nome}</h3>
                  <p className="text-yellow-600 font-bold text-lg mb-6">{cavalo.preco}</p>
                  <Link href={`/cavalos/${cavalo.id}`} className="block w-full text-center py-4 bg-zinc-950 border border-zinc-700 text-white hover:bg-yellow-600 hover:text-black uppercase tracking-widest text-xs font-bold transition-all">
                    Ver Detalhes
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-20 text-zinc-500">
              <p>Nenhum cavalo encontrado.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ChevronDown, ChevronUp, ShieldCheck, Truck, Info } from "lucide-react";

export default function ProductDisplay({ product }) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return;
    setIsAdding(true);
    try {
      await addItem(selectedVariant.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  if (!selectedVariant) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
      {/* IMAGEM */}
      <div className="relative group">
        <div className="aspect-[4/5] bg-zinc-900 border border-zinc-800 overflow-hidden">
          <img
            src={selectedVariant?.image?.url || product?.images?.[0]?.url || ""}
            alt={product?.title}
            className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0"
          />
        </div>
      </div>

      {/* INFO */}
      <div className="flex flex-col">
        <h1 className="text-4xl md:text-5xl font-serif italic text-white mb-4 leading-tight">
          {product?.title}
        </h1>
        <p className="text-2xl font-serif text-[#C5A059] mb-10">
          {Number(selectedVariant?.price?.amount || 0).toFixed(2)} €
        </p>

        <div className="space-y-8 border-t border-zinc-900 pt-10">
          {/* SELEÇÃO DE MODELO */}
          {product?.variants?.length > 1 && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4 block">Configuração</label>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-4 text-[9px] uppercase tracking-widest border transition-all ${
                      selectedVariant.id === v.id ? "border-[#C5A059] text-white bg-[#C5A059]/5" : "border-zinc-800 text-zinc-500"
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-black py-6 font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-[#C5A059] transition-all"
          >
            {isAdding ? "A Adicionar..." : "Adicionar ao Saco"}
          </button>

          {/* SECÇÕES EXPANSÍVEIS (ACORDÕES) */}
          <div className="mt-12 space-y-4 border-t border-zinc-900 pt-8">
            
            {/* 1. ESPECIFICAÇÕES TÉCNICAS */}
            <div className="border-b border-zinc-900 pb-4">
              <button onClick={() => toggleSection('specs')} className="w-full flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-300 font-bold">
                <span className="flex items-center gap-3"><Info size={14} className="text-[#C5A059]" /> Especificações Técnicas</span>
                {openSection === 'specs' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSection === 'specs' && (
                <div className="mt-4 text-[11px] text-zinc-500 leading-relaxed font-light space-y-2">
                  <p>• Policarbonato sólido e laterais flexíveis.</p>
                  <p>• Aberturas de portas alinhadas com precisão.</p>
                  <p>• Compatível com carregamento sem fios.</p>
                  <p>• Rebordo elevado de 0.5 mm para proteção do ecrã.</p>
                </div>
              )}
            </div>

            {/* 2. ENVIO E PRODUÇÃO (GPSR & LOGÍSTICA) */}
            <div className="border-b border-zinc-900 pb-4">
              <button onClick={() => toggleSection('shipping')} className="w-full flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-300 font-bold">
                <span className="flex items-center gap-3"><Truck size={14} className="text-[#C5A059]" /> Envio e Produção On-Demand</span>
                {openSection === 'shipping' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSection === 'shipping' && (
                <div className="mt-4 text-[11px] text-zinc-500 leading-relaxed font-light space-y-3">
                  <p>Esta peça é fabricada especialmente para si assim que realiza o pedido. Este modelo de produção on-demand ajuda a reduzir a sobreprodução têxtil.</p>
                  <p className="text-zinc-400 italic">Nota: As séries iPhone 15/16 não podem ser enviadas para a Ásia Oriental (Coreia do Sul, Japão, Hong Kong).</p>
                </div>
              )}
            </div>

            {/* 3. SEGURANÇA E CONFORMIDADE (LEGAL) */}
            <div className="border-b border-zinc-900 pb-4">
              <button onClick={() => toggleSection('safety')} className="w-full flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-300 font-bold">
                <span className="flex items-center gap-3"><ShieldCheck size={14} className="text-[#C5A059]" /> Segurança e Conformidade</span>
                {openSection === 'safety' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSection === 'safety' && (
                <div className="mt-4 text-[11px] text-zinc-500 leading-relaxed font-light space-y-3">
                  <p>Em conformidade com o GPSR da UE, garantimos que todos os produtos cumprem as normas de segurança europeias.</p>
                  <p>Aviso: Este produto pode conter vestígios de BPA (Bisfenol A), conforme as normas da Proposição 65 da Califórnia.</p>
                  <p>Contacto de Segurança: portal.lusitano2023@gmail.com</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
} 
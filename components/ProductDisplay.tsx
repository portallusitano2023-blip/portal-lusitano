// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ChevronDown, ChevronUp, ShieldCheck, Truck, Info, Scissors } from "lucide-react";

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

  // Função para lidar com a mudança no Dropdown
  const handleVariantChange = (e) => {
    const variantId = e.target.value;
    const variant = product.variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
    }
  };

  if (!selectedVariant) return null;

  // --- LÓGICA DE PRODUTO INTELIGENTE ---
  const title = product.title.toLowerCase();
  const isHat = title.includes("hat") || title.includes("boné") || title.includes("corduroy");
  const isCase = title.includes("case") || title.includes("capa") || title.includes("iphone");

  let specsContent, shippingContent, safetyContent;

  if (isHat) {
    specsContent = (
      <>
        <p>• 100% Algodão Corduroy (Bombazina).</p>
        <p>• Estrutura suave e não estruturada.</p>
        <p>• Fivela ajustável para um encaixe perfeito.</p>
        <p>• Proveniência ética: China.</p>
      </>
    );
    shippingContent = <p>Produzido on-demand. Rastreabilidade total.</p>;
    safetyContent = <p>Certificação OEKO-TEX Standard 100. Contacto: portal.lusitano2023@gmail.com</p>;
  } else if (isCase) {
    specsContent = (
      <>
        <p>• Policarbonato sólido e laterais em poliuretano.</p>
        <p>• Compatível com carregamento sem fios.</p>
        <p>• Rebordo elevado para proteção do ecrã.</p>
      </>
    );
    shippingContent = (
      <>
        <p>Produção on-demand.</p>
        <p className="text-zinc-400 italic mt-2">Nota: iPhone 15/16 não enviam para a Ásia Oriental.</p>
      </>
    );
    safetyContent = (
      <>
        <p>Em conformidade com GPSR.</p>
        <p>Aviso Prop 65 (BPA). Contacto: portal.lusitano2023@gmail.com</p>
      </>
    );
  } else {
    specsContent = <p>Ver etiqueta do produto.</p>;
    shippingContent = <p>Envio global on-demand.</p>;
    safetyContent = <p>Conformidade UE.</p>;
  }
  // ------------------------------------

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
      {/* IMAGEM (Agora a cores!) */}
      <div className="relative group mb-10 lg:mb-0">
        <div className="aspect-[4/5] bg-zinc-900 border border-zinc-800 overflow-hidden relative">
          <div className="absolute inset-0 z-10 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] pointer-events-none"></div>
          <img
            src={selectedVariant?.image?.url || product?.images?.[0]?.url || ""}
            alt={product?.title}
            // REMOVIDO: grayscale group-hover:grayscale-0
            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
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
          
          {/* SELEÇÃO DE VARIANTES (Agora é um Dropdown Clean) */}
          {product?.variants?.length > 1 && (
            <div>
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4 block">
                Configuração Escolhida
              </label>
              <div className="relative">
                <select
                  value={selectedVariant.id}
                  onChange={handleVariantChange}
                  className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-none px-6 py-4 text-[10px] uppercase tracking-widest text-zinc-300 focus:border-[#C5A059] focus:outline-none transition-colors cursor-pointer"
                >
                  {product.variants.map((v) => (
                    <option key={v.id} value={v.id} className="bg-zinc-900 text-zinc-300">
                      {v.title}
                    </option>
                  ))}
                </select>
                {/* Ícone da seta personalizado para manter o estilo */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full bg-white text-black py-6 font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-[#C5A059] transition-all"
          >
            {isAdding ? "A Adicionar..." : "Adicionar ao Saco"}
          </button>

          {/* ACORDÕES DINÂMICOS (Mantive igual) */}
          <div className="mt-12 space-y-4 border-t border-zinc-900 pt-8">
            <div className="border-b border-zinc-900 pb-4">
              <button onClick={() => toggleSection('specs')} className="w-full flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-300 font-bold hover:text-[#C5A059] transition-colors">
                <span className="flex items-center gap-3"><Scissors size={14} className="text-[#C5A059]" /> Especificações Técnicas</span>
                {openSection === 'specs' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSection === 'specs' && <div className="mt-4 text-[11px] text-zinc-500 leading-relaxed font-light space-y-2">{specsContent}</div>}
            </div>
            <div className="border-b border-zinc-900 pb-4">
              <button onClick={() => toggleSection('shipping')} className="w-full flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-300 font-bold hover:text-[#C5A059] transition-colors">
                <span className="flex items-center gap-3"><Truck size={14} className="text-[#C5A059]" /> Envio e Produção</span>
                {openSection === 'shipping' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSection === 'shipping' && <div className="mt-4 text-[11px] text-zinc-500 leading-relaxed font-light space-y-3">{shippingContent}</div>}
            </div>
            <div className="border-b border-zinc-900 pb-4">
              <button onClick={() => toggleSection('safety')} className="w-full flex justify-between items-center text-[10px] uppercase tracking-widest text-zinc-300 font-bold hover:text-[#C5A059] transition-colors">
                <span className="flex items-center gap-3"><ShieldCheck size={14} className="text-[#C5A059]" /> Segurança e Conformidade</span>
                {openSection === 'safety' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openSection === 'safety' && <div className="mt-4 text-[11px] text-zinc-500 leading-relaxed font-light space-y-3">{safetyContent}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
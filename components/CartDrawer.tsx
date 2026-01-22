// @ts-nocheck
"use client";

import { useCart } from "@/context/CartContext";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeItem } = useCart();

  return (
    <>
      {/* Overlay Escuro */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeCart}
      />

      {/* Painel Lateral */}
      <aside 
        className={`fixed top-0 right-0 h-screen w-full md:w-[450px] bg-[#050505] z-[101] border-l border-zinc-900 shadow-2xl transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Cabeçalho */}
          <div className="p-8 border-b border-zinc-900 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} className="text-[#C5A059]" />
              <h2 className="text-xl font-serif italic text-white">O Seu Saco</h2>
            </div>
            <button onClick={closeCart} className="text-zinc-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Lista de Itens */}
          <div className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {cart?.lines?.edges?.length > 0 ? (
              cart.lines.edges.map((item: any) => (
                <div key={item.node.id} className="flex gap-6 group">
                  <div className="w-24 h-32 bg-zinc-900 flex-shrink-0 overflow-hidden border border-zinc-800">
                    <img 
                      src={item.node.merchandise.image?.url} 
                      alt={item.node.merchandise.product.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1 flex-grow">
                    <div>
                      <h3 className="text-white font-serif italic text-lg leading-tight">
                        {item.node.merchandise.product.title}
                      </h3>
                      <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">
                        Tamanho/Variante: {item.node.merchandise.title}
                      </p>
                      <p className="text-[#C5A059] font-mono text-sm mt-2">
                        {Number(item.node.merchandise.price.amount).toFixed(2)} €
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600 text-[10px] uppercase tracking-tighter">Qtd: {item.node.quantity}</span>
                      <button 
                        onClick={() => removeItem(item.node.id)}
                        className="text-zinc-700 hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        <span className="text-[9px] uppercase tracking-widest font-bold">Remover</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-800">
                  <ShoppingBag size={24} />
                </div>
                <p className="text-zinc-500 font-light text-sm italic">O seu saco está vazio.</p>
                <button 
                  onClick={closeCart}
                  className="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] font-bold border-b border-[#C5A059]/30 pb-1 hover:border-[#C5A059] transition-all"
                >
                  Continuar a Explorar
                </button>
              </div>
            )}
          </div>

          {/* Rodapé do Carrinho */}
          {cart?.lines?.edges?.length > 0 && (
            <div className="p-8 border-t border-zinc-900 bg-black/50">
              <div className="flex justify-between items-end mb-8">
                <span className="text-zinc-500 text-[10px] uppercase tracking-widest">Subtotal</span>
                <span className="text-2xl font-serif text-white italic">
                  {Number(cart.cost?.totalAmount?.amount || 0).toFixed(2)} €
                </span>
              </div>
              <a 
                href={cart.checkoutUrl}
                className="w-full py-5 bg-[#C5A059] text-black text-center font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-white transition-all duration-500 flex items-center justify-center gap-3"
              >
                Finalizar Compra <ArrowRight size={14} />
              </a>
              <p className="text-center text-zinc-600 text-[8px] uppercase tracking-widest mt-6">
                Taxas e Portes calculados no checkout
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
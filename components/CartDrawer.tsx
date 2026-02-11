"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, checkoutUrl } = useCart();
  const { language } = useLanguage();

  // Fechar com tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };

    document.addEventListener("keydown", handleEscape);

    // Bloquear scroll do body quando aberto
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isCartOpen, closeCart]);

  const cartText = {
    pt: {
      title: "O Seu Saco",
      empty: "O seu saco está vazio.",
      empty_cta: "Explorar a Coleção",
      subtotal: "Subtotal",
      shipping_note: "Envio e impostos calculados no checkout.",
      checkout: "Finalizar Compra",
    },
    en: {
      title: "Your Bag",
      empty: "Your bag is empty.",
      empty_cta: "Explore the Collection",
      subtotal: "Subtotal",
      shipping_note: "Shipping and taxes calculated at checkout.",
      checkout: "Checkout",
    },
    es: {
      title: "Su Bolsa",
      empty: "Su bolsa esta vacia.",
      empty_cta: "Explorar la Coleccion",
      subtotal: "Subtotal",
      shipping_note: "Envio e impuestos calculados en el checkout.",
      checkout: "Finalizar Compra",
    },
  };

  const ct = cartText[language];

  return (
    <div
      className={`fixed inset-0 z-[100] ${isCartOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          isCartOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      <div
        className={`absolute top-0 right-0 h-full w-full md:w-[450px] bg-[var(--background)] border-l border-[var(--border)] shadow-2xl transform transition-transform duration-700 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-4">
              <ShoppingBag size={20} className="text-[var(--gold)]" />
              <h2 className="text-2xl font-serif italic text-[var(--foreground)]">{ct.title}</h2>
            </div>
            <button
              onClick={closeCart}
              className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors p-2"
              aria-label={language === "pt" ? "Fechar carrinho" : "Close cart"}
            >
              <X size={24} strokeWidth={1} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                <ShoppingBag size={48} strokeWidth={1} className="text-[var(--foreground-muted)]" />
                <p className="text-[var(--foreground-secondary)] font-serif text-xl">{ct.empty}</p>
                <Link
                  href="/loja"
                  onClick={closeCart}
                  className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)] border-b border-[var(--gold)] pb-1 hover:text-[var(--foreground)] transition-colors"
                >
                  {ct.empty_cta}
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-6 animate-fade-in">
                    <div className="w-24 h-32 flex-shrink-0 bg-[var(--background-secondary)] border border-[var(--border)] overflow-hidden relative">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-serif text-[var(--foreground)] leading-tight pr-4">
                            {item.title}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[var(--foreground-secondary)] hover:text-red-400 text-xs uppercase"
                          >
                            Remover
                          </button>
                        </div>
                        <p className="text-[var(--gold)] font-serif text-md mt-2">
                          {Number(item.price).toFixed(2)} EUR
                        </p>
                      </div>
                      <div className="flex items-center gap-4 border border-[var(--border)] bg-[var(--surface-hover)] w-fit px-3 py-2 mt-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                          aria-label={
                            language === "pt"
                              ? `Diminuir quantidade de ${item.title}`
                              : `Decrease quantity of ${item.title}`
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-[var(--foreground)] font-serif w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
                          aria-label={
                            language === "pt"
                              ? `Aumentar quantidade de ${item.title}`
                              : `Increase quantity of ${item.title}`
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-[var(--border)] pt-8 mt-8 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--foreground-muted)] mb-2">
                    {ct.subtotal}
                  </p>
                  <p className="text-xs text-[var(--foreground-secondary)] font-serif italic">
                    {ct.shipping_note}
                  </p>
                </div>
                <p className="text-3xl font-serif text-[var(--foreground)]">
                  {cart
                    .reduce((total, item) => total + Number(item.price) * item.quantity, 0)
                    .toFixed(2)}{" "}
                  <span className="text-sm text-[var(--foreground-muted)]">EUR</span>
                </p>
              </div>
              {/* AQUI ESTÁ A CORREÇÃO: USAMOS checkoutUrl DO CONTEXTO */}
              <a
                href={checkoutUrl || "#"}
                className="block w-full bg-[var(--gold)] text-black text-center text-xs uppercase tracking-[0.3em] py-5 font-bold hover:bg-white transition-colors"
              >
                {ct.checkout}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

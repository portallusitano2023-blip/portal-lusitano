"use client";

import { useState, useEffect, useRef } from "react";
import { X, Heart, ShoppingBag, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import Image from "next/image";
import { ProductListing } from "@/types/product";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface QuickViewProps {
  product: ProductListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, isOpen, onClose);
  const { addItemToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();

  const text = {
    pt: {
      addToCart: "Adicionar ao Saco",
      viewDetails: "Ver Detalhes",
      addedToCart: "Adicionado ao saco!",
    },
    en: {
      addToCart: "Add to Bag",
      viewDetails: "View Details",
      addedToCart: "Added to bag!",
    },
    es: {
      addToCart: "Anadir a la Bolsa",
      viewDetails: "Ver Detalles",
      addedToCart: "Anadido a la bolsa!",
    },
  };

  const t = text[language];

  // Reset image when product changes
  useEffect(() => {
    setSelectedImage(0);
  }, [product]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!product) return null;

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const variantId = product.variants?.[0]?.id;
      if (variantId) {
        await addItemToCart(variantId, 1);
        showToast("cart", t.addedToCart);
      }
    } catch (error) {
      // Error adding to cart silenced
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = () => {
    const wishlistItem = {
      id: product.id,
      handle: product.handle || product.id,
      title: product.title,
      price: product.priceRange?.minVariantPrice.amount || "0",
      image: product.images[0]?.url || "",
    };

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(wishlistItem);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9997] animate-[fadeSlideIn_0.3s_ease-out_forwards]"
            onClick={onClose}
          />

          {/* Container */}
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            {/* Inner modal */}
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label="Pré-visualização do produto"
              className="relative bg-[var(--background-secondary)] border border-[var(--border)] max-w-4xl w-full max-h-[90vh] overflow-hidden opacity-0 animate-[scaleIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
              style={{ animationDelay: "0.05s", willChange: "transform, opacity" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botao fechar */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors z-10"
                aria-label="Fechar"
              >
                <X size={24} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Galeria de imagens */}
                <div className="relative aspect-square bg-[var(--background-secondary)]">
                  <Image
                    src={product.images[selectedImage]?.url}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />

                  {/* Navegacao de imagens */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                        aria-label={language === "pt" ? "Imagem anterior" : "Previous image"}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
                        aria-label={language === "pt" ? "Proxima imagem" : "Next image"}
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Indicadores */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {product.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === selectedImage ? "bg-[var(--gold)]" : "bg-white/30"
                            }`}
                            aria-label={
                              language === "pt"
                                ? `Ver imagem ${index + 1}`
                                : `View image ${index + 1}`
                            }
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Detalhes do produto */}
                <div className="p-8 flex flex-col">
                  <h2 className="text-2xl font-serif text-[var(--foreground)] mb-2">
                    {product.title}
                  </h2>
                  <p className="text-2xl text-[var(--gold)] font-serif mb-6">
                    {Number(product.priceRange?.minVariantPrice.amount || 0).toFixed(2)} EUR
                  </p>

                  <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-8 line-clamp-4">
                    {product.description}
                  </p>

                  {/* Acoes */}
                  <div className="mt-auto space-y-4">
                    <div className="flex gap-4">
                      <button
                        onClick={handleAddToCart}
                        disabled={isLoading}
                        className="flex-1 bg-[var(--gold)] text-black py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <>
                            <ShoppingBag size={16} />
                            {t.addToCart}
                          </>
                        )}
                      </button>

                      <button
                        onClick={toggleWishlist}
                        className={`w-14 border ${
                          isInWishlist(product.id)
                            ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]"
                            : "border-[var(--border-hover)] text-[var(--foreground)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
                        } transition-colors flex items-center justify-center`}
                        aria-label={
                          isInWishlist(product.id)
                            ? language === "pt"
                              ? "Remover dos favoritos"
                              : "Remove from wishlist"
                            : language === "pt"
                              ? "Adicionar aos favoritos"
                              : "Add to wishlist"
                        }
                      >
                        <Heart
                          size={18}
                          fill={isInWishlist(product.id) ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    <Link
                      href={`/loja/${product.handle}`}
                      onClick={onClose}
                      className="block text-center border border-[var(--border-hover)] text-[var(--foreground)] py-4 text-xs uppercase tracking-[0.2em] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
                    >
                      {t.viewDetails}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

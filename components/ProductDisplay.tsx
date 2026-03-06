"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { ChevronDown, Star, Lock, Package, Truck, Plus, Minus, ShieldCheck } from "lucide-react";
import { Product } from "@/types/product";

const PLACEHOLDER_IMAGE = "/placeholder-product.svg";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjUiIGZpbGw9IiMxMTExMTEiLz48L3N2Zz4=";

const TRUST_ITEMS = [
  { icon: Lock,    label: "Pagamento Seguro",    sub: "SSL · Stripe" },
  { icon: Package, label: "Embalagem Exclusiva", sub: "Portal Lusitano" },
  { icon: Truck,   label: "Envio Trackeado",     sub: "5–15 dias úteis" },
];

const ACCORDION_ITEMS = [
  {
    label: "Detalhes do Produto",
    content:
      "Produção artesanal sob encomenda. Cada peça é impressa individualmente com a mais alta qualidade, unindo a tradição equestre Lusitana ao design contemporâneo.",
  },
  {
    label: "Materiais & Cuidados",
    content:
      "100% algodão premium de alta gramagem. Lavagem a 30°C. Não utilizar máquina de secar. Engomar a temperatura média.",
  },
  {
    label: "Entrega & Devoluções",
    content:
      "Estimativa de entrega: 5–15 dias úteis após confirmação. Devoluções aceites até 14 dias após receção, em estado original.",
  },
];

export default function ProductDisplay({ product }: { product: Product }) {
  const firstImage = product.images[0]?.url || PLACEHOLDER_IMAGE;
  const firstVariant = product.variants[0];

  const [selectedVariantId, setSelectedVariantId] = useState(firstVariant?.id || "");
  const [manualImage, setManualImage] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

  const activeVariant = product.variants.find((v) => v.id === selectedVariantId) || firstVariant;
  const displayImage = manualImage || activeVariant?.image?.url || firstImage;
  const isAvailable = activeVariant?.availableForSale || false;
  const price = Number(activeVariant?.price?.amount || 0).toFixed(2);

  const handleVariantChange = (newId: string) => {
    setSelectedVariantId(newId);
    setManualImage(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const hasMultipleVariants = product.variants.length > 1;
  const usePills = product.variants.length <= 5;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-20 mt-6">

      {/* ══════════════════════════════════════
          LEFT — GALLERY (sticky on desktop)
      ══════════════════════════════════════ */}
      <div className="lg:sticky lg:top-28 lg:self-start space-y-3">

        {/* Main image */}
        <div
          ref={imageRef}
          className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--background-secondary)] border border-[var(--border)] cursor-crosshair select-none"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <Image
            key={displayImage}
            src={displayImage}
            alt={product.title}
            fill
            sizes="(max-width: 1024px) 100vw, 600px"
            className={`object-cover transition-transform duration-500 ease-out animate-[fadeIn_0.25s_ease-out] ${isZoomed ? "scale-[1.6]" : "scale-100"}`}
            style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
            priority
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />

          {/* Grain overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id="pd-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#pd-noise)" />
          </svg>

          {/* Made to Order badge */}
          <div className="absolute top-3 left-3 bg-[var(--background)]/85 backdrop-blur-sm border border-[var(--gold)]/30 px-3 py-1.5">
            <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--gold)]">
              Made to Order
            </span>
          </div>

          {/* Zoom hint — desktop only, hidden while zoomed */}
          {!isZoomed && (
            <div className="hidden md:block absolute bottom-3 right-3 bg-[var(--background)]/70 backdrop-blur-sm border border-[var(--border)]/50 px-2.5 py-1.5">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                Ampliar imagem
              </span>
            </div>
          )}

          {/* Ornamental corners */}
          <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[var(--gold)]/20 pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[var(--gold)]/20 pointer-events-none" />
        </div>

        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setManualImage(img.url)}
                aria-label={`Ver imagem ${i + 1}`}
                className={`flex-shrink-0 w-[68px] h-[85px] relative overflow-hidden border-2 transition-all duration-200 ${
                  displayImage === img.url
                    ? "border-[var(--gold)] opacity-100"
                    : "border-[var(--border)] opacity-40 hover:opacity-80 hover:border-[var(--gold)]/40"
                }`}
              >
                <Image src={img.url} alt="" fill sizes="68px" className="object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          RIGHT — PRODUCT INFO
      ══════════════════════════════════════ */}
      <div className="flex flex-col">

        {/* Collection label */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--gold)]/60" />
          <svg width="5" height="5" viewBox="0 0 5 5" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="0.5" y="0.5" width="4" height="4" transform="rotate(45 2.5 2.5)" fill="none" stroke="var(--gold)" strokeWidth="0.8" strokeOpacity="0.7" />
          </svg>
          <span className="text-[9px] uppercase tracking-[0.35em] text-[var(--gold)]">
            Coleção Heritage · Série Limitada
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[var(--foreground)] leading-tight mb-4">
          {product.title}
        </h1>

        {/* Stars */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className="fill-[var(--gold)] text-[var(--gold)]" />
            ))}
          </div>
          <span className="text-[var(--foreground-muted)] text-xs">4.9 · 42 avaliações</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-7 pb-7 border-b border-[var(--border)]">
          <span className="text-3xl sm:text-4xl font-serif text-[var(--foreground)]">{price}</span>
          <span className="text-sm text-[var(--foreground-muted)]">EUR</span>
          <div className="ml-auto flex items-center gap-1.5 border border-[var(--gold)]/25 bg-[var(--gold)]/5 px-2.5 py-1">
            <ShieldCheck size={11} className="text-[var(--gold)]" />
            <span className="text-[9px] uppercase tracking-[0.15em] text-[var(--gold)]/80">
              Artesanal
            </span>
          </div>
        </div>

        {/* Variant selector */}
        {hasMultipleVariants && (
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                Modelo
              </span>
              {activeVariant?.title !== "Default Title" && (
                <span className="text-[10px] font-medium text-[var(--foreground)] uppercase tracking-wider">
                  {activeVariant?.title}
                </span>
              )}
            </div>

            {usePills ? (
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleVariantChange(v.id)}
                    className={`px-4 py-2.5 text-[10px] uppercase tracking-[0.15em] border transition-all duration-200 ${
                      v.id === selectedVariantId
                        ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/5"
                        : "border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--gold)]/50 hover:text-[var(--foreground)]"
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedVariantId}
                  onChange={(e) => handleVariantChange(e.target.value)}
                  className="w-full appearance-none bg-transparent border border-[var(--border)] text-[var(--foreground)] py-3.5 pl-4 pr-10 text-sm focus:border-[var(--gold)] focus:outline-none transition-colors cursor-pointer uppercase tracking-wider"
                >
                  {product.variants.map((v) => (
                    <option key={v.id} value={v.id} className="bg-[var(--background-elevated)]">
                      {v.title}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)] pointer-events-none"
                  size={14}
                />
              </div>
            )}
          </div>
        )}

        {/* Editorial quote */}
        <p className="font-serif italic text-[var(--foreground-secondary)] text-sm leading-relaxed mb-8 border-l-2 border-[var(--gold)]/30 pl-4">
          &ldquo;Produção artesanal sob encomenda. Cada peça é impressa individualmente com a mais
          alta qualidade, unindo a tradição equestre Lusitana ao design contemporâneo.&rdquo;
        </p>

        {/* CTA */}
        <div className="mb-5 space-y-3">
          {activeVariant ? (
            <AddToCartButton
              variantId={activeVariant.id}
              available={isAvailable}
              productTitle={product.title}
              productImage={firstImage}
              productPrice={activeVariant.price?.amount || "0"}
              variantTitle={
                activeVariant.title !== "Default Title" ? activeVariant.title : undefined
              }
            />
          ) : (
            <div className="w-full py-5 text-center text-[10px] uppercase tracking-[0.3em] bg-[var(--background-secondary)] text-[var(--foreground-secondary)] border border-[var(--border)]">
              Indisponível
            </div>
          )}

          {/* Availability */}
          <div className="flex items-center justify-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isAvailable ? "bg-green-500 animate-pulse" : "bg-red-500/70"}`} />
            <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
              {isAvailable ? "Disponível para encomenda" : "Esgotado temporariamente"}
            </span>
          </div>
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-3 gap-px bg-[var(--border)] border border-[var(--border)] mb-8">
          {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 py-4 px-2 bg-[var(--background)] text-center"
            >
              <Icon size={15} className="text-[var(--gold)]" />
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.08em] text-[var(--foreground)] leading-snug font-medium">
                {label}
              </span>
              <span className="text-[8px] sm:text-[9px] text-[var(--foreground-muted)]">{sub}</span>
            </div>
          ))}
        </div>

        {/* Accordion */}
        <div className="border-t border-[var(--border)] divide-y divide-[var(--border)]">
          {ACCORDION_ITEMS.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                className="w-full flex items-center justify-between py-4 text-left group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--gold)]"
                aria-expanded={activeAccordion === i}
              >
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors duration-200">
                  {item.label}
                </span>
                {activeAccordion === i ? (
                  <Minus size={13} className="text-[var(--gold)] flex-shrink-0" />
                ) : (
                  <Plus size={13} className="text-[var(--foreground-muted)] flex-shrink-0 group-hover:text-[var(--gold)] transition-colors duration-200" />
                )}
              </button>
              {activeAccordion === i && (
                <div className="pb-5">
                  <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed">
                    {item.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

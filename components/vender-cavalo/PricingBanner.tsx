"use client";

import { PRECO_ANUNCIO } from "@/components/vender-cavalo/data";

export default function PricingBanner() {
  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="bg-gradient-to-r from-[#C5A059]/20 to-[#C5A059]/5 border border-[#C5A059]/30 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Anúncio Premium</h3>
            <p className="text-sm text-zinc-400">
              30 dias de visibilidade + Verificação de documentos
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#C5A059]">{PRECO_ANUNCIO}€</div>
            <div className="text-xs text-zinc-500">pagamento único</div>
          </div>
        </div>
      </div>
    </div>
  );
}

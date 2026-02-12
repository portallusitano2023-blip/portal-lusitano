"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PageHeader() {
  return (
    <div className="max-w-3xl mx-auto mb-8">
      <Link
        href="/comprar"
        className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--gold)] transition-colors mb-6 touch-manipulation"
      >
        <ArrowLeft size={18} />
        <span className="text-sm">Voltar ao Marketplace</span>
      </Link>

      <div className="text-center">
        <span className="text-[var(--gold)] uppercase tracking-[0.3em] text-[9px] sm:text-[10px] font-bold block mb-2">
          Marketplace Lusitano
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif italic mb-4">
          Vender Cavalo Lusitano
        </h1>
        <p className="text-[var(--foreground-secondary)] text-sm max-w-xl mx-auto">
          Anuncie o seu cavalo no maior marketplace de Lusitanos em Portugal. Todos os anúncios
          passam por verificação de documentação.
        </p>
      </div>
    </div>
  );
}

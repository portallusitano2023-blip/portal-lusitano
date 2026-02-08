"use client";

import Link from "next/link";
import { Lock, Crown, ArrowRight } from "lucide-react";

interface PaywallProps {
  toolName: string;
  requiresAuth?: boolean;
}

export default function Paywall({ toolName, requiresAuth = false }: PaywallProps) {
  if (requiresAuth) {
    return (
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <div className="w-16 h-16 bg-[#C5A059]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-[#C5A059]" size={28} />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">Crie uma conta gratuita</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Registe-se para usar a {toolName} gratuitamente. O primeiro uso e gratis!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/registar"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all"
              >
                Criar Conta Gratis
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:border-zinc-600 hover:text-white transition-colors"
              >
                Ja tenho conta
              </Link>
            </div>
          </div>
        </div>
        <div className="blur-sm pointer-events-none select-none opacity-50 min-h-[300px] bg-zinc-900/50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-[#C5A059]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="text-[#C5A059]" size={28} />
          </div>
          <h3 className="text-xl font-serif text-white mb-2">Ferramentas PRO</h3>
          <p className="text-sm text-zinc-400 mb-2">Ja usou o seu uso gratuito da {toolName}.</p>
          <p className="text-sm text-zinc-500 mb-6">
            Subscreva por apenas <span className="text-[#C5A059] font-bold">4,99 EUR/mes</span> para
            acesso ilimitado a todas as ferramentas.
          </p>

          <ul className="text-sm text-zinc-400 space-y-2 mb-6 text-left max-w-xs mx-auto">
            <li className="flex items-center gap-2">
              <span className="text-[#C5A059]">&#10003;</span> Uso ilimitado das 4 ferramentas
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#C5A059]">&#10003;</span> Exportacao PDF profissional
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#C5A059]">&#10003;</span> Guardar e partilhar resultados
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#C5A059]">&#10003;</span> Historico completo de avaliacoes
            </li>
          </ul>

          <Link
            href="/ferramentas"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all shadow-lg shadow-[#C5A059]/20"
          >
            <Crown size={18} />
            Subscrever PRO
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <div className="blur-sm pointer-events-none select-none opacity-50 min-h-[300px] bg-zinc-900/50 rounded-2xl" />
    </div>
  );
}

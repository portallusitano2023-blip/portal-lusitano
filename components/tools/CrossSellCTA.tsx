"use client";

import LocalizedLink from "@/components/LocalizedLink";
import { ArrowRight } from "lucide-react";

interface CrossSellItem {
  title: string;
  description: string;
  href: string;
  icon: string;
}

const TOOL_CROSS_SELLS: Record<string, CrossSellItem[]> = {
  calculadora: [
    { title: "Comparador de Cavalos", description: "Compare este cavalo com outros do mercado", href: "/comparador-cavalos", icon: "⚖️" },
    { title: "Verificar Compatibilidade", description: "Veja se este cavalo é ideal para si", href: "/verificador-compatibilidade", icon: "🎯" },
    { title: "Ver Marketplace", description: "Explore cavalos Lusitanos à venda", href: "/comprar", icon: "🐴" },
  ],
  comparador: [
    { title: "Calculadora de Valor", description: "Obtenha uma avaliação detalhada", href: "/calculadora-valor", icon: "📊" },
    { title: "Análise de Perfil", description: "Descubra o seu perfil equestre", href: "/analise-perfil", icon: "👤" },
    { title: "Ver Marketplace", description: "Explore cavalos Lusitanos à venda", href: "/comprar", icon: "🐴" },
  ],
  compatibilidade: [
    { title: "Calculadora de Valor", description: "Avalie o preço justo de um Lusitano", href: "/calculadora-valor", icon: "📊" },
    { title: "Comparador de Cavalos", description: "Compare características entre cavalos", href: "/comparador-cavalos", icon: "⚖️" },
    { title: "Ver Marketplace", description: "Encontre o seu cavalo ideal", href: "/comprar", icon: "🐴" },
  ],
  perfil: [
    { title: "Verificar Compatibilidade", description: "Encontre o cavalo ideal para o seu perfil", href: "/verificador-compatibilidade", icon: "🎯" },
    { title: "Calculadora de Valor", description: "Avalie cavalos com dados de mercado", href: "/calculadora-valor", icon: "📊" },
    { title: "Ver Marketplace", description: "Explore cavalos à venda", href: "/comprar", icon: "🐴" },
  ],
};

interface CrossSellCTAProps {
  currentTool: keyof typeof TOOL_CROSS_SELLS;
}

export default function CrossSellCTA({ currentTool }: CrossSellCTAProps) {
  const items = TOOL_CROSS_SELLS[currentTool];
  if (!items) return null;

  return (
    <div className="mt-8 pt-8 border-t border-[var(--border)]">
      <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-4">
        Continue a explorar
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <LocalizedLink
            key={item.href}
            href={item.href}
            className="group flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] hover:border-[var(--gold)]/40 hover:bg-[var(--gold)]/5 transition-all"
          >
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--gold)] transition-colors flex items-center gap-1">
                {item.title}
                <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-[var(--foreground-muted)] mt-0.5 line-clamp-2">
                {item.description}
              </p>
            </div>
          </LocalizedLink>
        ))}
      </div>
    </div>
  );
}

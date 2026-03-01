"use client";

import Link from "next/link";
import { ChevronRight, Calculator, BarChart3, Heart, UserCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

type ToolSlug =
  | "calculadora-valor"
  | "comparador-cavalos"
  | "verificador-compatibilidade"
  | "analise-perfil";

interface ToolCrossCTAProps {
  currentTool: ToolSlug;
  chainPayload?: { key: string; data: unknown };
  exclude?: ToolSlug[];
}

const TOOLS: Record<
  ToolSlug,
  {
    icon: typeof Calculator;
    iconColor: string;
    hoverBorder: string;
    href: string;
    name: [string, string, string];
    desc: [string, string, string];
  }
> = {
  "calculadora-valor": {
    icon: Calculator,
    iconColor: "text-[var(--gold)]",
    hoverBorder: "hover:border-[var(--gold)]/40",
    href: "/calculadora-valor",
    name: ["Calculadora de Valor", "Value Calculator", "Calculadora de Valor"],
    desc: [
      "Estima o valor do teu cavalo",
      "Estimate your horse's value",
      "Estima el valor de tu caballo",
    ],
  },
  "comparador-cavalos": {
    icon: BarChart3,
    iconColor: "text-blue-400",
    hoverBorder: "hover:border-blue-400/40",
    href: "/comparador-cavalos",
    name: ["Comparador de Cavalos", "Horse Comparator", "Comparador de Caballos"],
    desc: [
      "Compara até 4 cavalos lado a lado",
      "Compare up to 4 horses side by side",
      "Compara hasta 4 caballos",
    ],
  },
  "verificador-compatibilidade": {
    icon: Heart,
    iconColor: "text-pink-400",
    hoverBorder: "hover:border-pink-400/40",
    href: "/verificador-compatibilidade",
    name: ["Verificador Genético", "Genetic Checker", "Verificador Genético"],
    desc: [
      "Testa a compatibilidade genética",
      "Test genetic compatibility",
      "Prueba la compatibilidad genética",
    ],
  },
  "analise-perfil": {
    icon: UserCheck,
    iconColor: "text-emerald-400",
    hoverBorder: "hover:border-emerald-400/40",
    href: "/analise-perfil",
    name: ["Análise de Perfil", "Profile Analysis", "Análisis de Perfil"],
    desc: [
      "Descobre o teu perfil de cavaleiro",
      "Discover your rider profile",
      "Descubre tu perfil de jinete",
    ],
  },
};

export default function ToolCrossCTA({
  currentTool,
  chainPayload,
  exclude = [],
}: ToolCrossCTAProps) {
  const { language } = useLanguage();
  const tr = createTranslator(language);

  const others = (Object.keys(TOOLS) as ToolSlug[]).filter(
    (slug) => slug !== currentTool && !exclude.includes(slug)
  );

  if (others.length === 0) return null;

  function handleClick(href: string) {
    if (chainPayload) {
      try {
        sessionStorage.setItem(chainPayload.key, JSON.stringify(chainPayload.data));
      } catch {
        // sessionStorage unavailable
      }
    }
    window.location.href = href;
  }

  return (
    <div className="pt-4">
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--foreground-muted)] mb-4">
        <ChevronRight size={13} className="text-[var(--gold)]" aria-hidden="true" />
        {tr("Continua a tua jornada", "Continue your journey", "Continúa tu camino")}
      </p>
      <div className={`grid gap-3 ${others.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {others.map((slug) => {
          const tool = TOOLS[slug];
          const Icon = tool.icon;
          const name = tr(...tool.name);
          const desc = tr(...tool.desc);

          if (chainPayload) {
            return (
              <button
                key={slug}
                onClick={() => handleClick(tool.href)}
                className={`group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl ${tool.hoverBorder} transition-all text-left`}
              >
                <Icon
                  size={18}
                  className={`${tool.iconColor} shrink-0 group-hover:scale-110 transition-transform`}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{name}</p>
                  <p className="text-xs text-[var(--foreground-muted)] truncate">{desc}</p>
                </div>
                <ChevronRight
                  size={16}
                  className={`${tool.iconColor} opacity-0 group-hover:opacity-100 ml-auto shrink-0 transition-opacity`}
                />
              </button>
            );
          }

          return (
            <Link
              key={slug}
              href={tool.href}
              className={`group flex items-center gap-3 p-4 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-xl ${tool.hoverBorder} transition-all`}
            >
              <Icon
                size={18}
                className={`${tool.iconColor} shrink-0 group-hover:scale-110 transition-transform`}
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">{name}</p>
                <p className="text-xs text-[var(--foreground-muted)] truncate">{desc}</p>
              </div>
              <ChevronRight
                size={16}
                className={`${tool.iconColor} opacity-0 group-hover:opacity-100 ml-auto shrink-0 transition-opacity`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

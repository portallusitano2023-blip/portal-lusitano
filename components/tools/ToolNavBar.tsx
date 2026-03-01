"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import { getTools } from "@/app/ferramentas/tools-data";

type ToolSlug =
  | "calculadora-valor"
  | "comparador-cavalos"
  | "verificador-compatibilidade"
  | "analise-perfil";

interface ToolNavBarProps {
  currentTool: ToolSlug;
  internalProgress?: number;
  internalStepLabel?: string;
  hasResult?: boolean;
  rightSlot?: React.ReactNode;
}

const TOOL_ORDER: ToolSlug[] = [
  "analise-perfil",
  "calculadora-valor",
  "comparador-cavalos",
  "verificador-compatibilidade",
];

export default function ToolNavBar({ currentTool, internalProgress, rightSlot }: ToolNavBarProps) {
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const tools = getTools(tr);

  const toolMap = new Map(tools.map((t) => [t.href.replace("/", ""), t]));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--border)]">
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[var(--gold)] focus:text-black focus:rounded-lg focus:text-sm focus:font-medium"
      >
        {tr("Saltar para conteúdo", "Skip to content", "Saltar al contenido")}
      </a>

      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Back to ferramentas */}
        <Link
          href="/ferramentas"
          className="flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors min-w-[44px] min-h-[44px]"
          aria-label={tr("Voltar a Ferramentas", "Back to Tools", "Volver a Herramientas")}
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium hidden sm:block">
            {tr("Ferramentas", "Tools", "Herramientas")}
          </span>
        </Link>

        {/* Center: Journey indicator */}
        <nav
          role="navigation"
          aria-label={tr(
            "Navegação de ferramentas",
            "Tool navigation",
            "Navegación de herramientas"
          )}
          className="flex items-center gap-1 sm:gap-2"
        >
          {TOOL_ORDER.map((slug, i) => {
            const tool = toolMap.get(slug);
            if (!tool) return null;
            const isCurrent = slug === currentTool;
            const Icon = tool.icon;

            return (
              <div key={slug} className="flex items-center">
                {/* Connector line */}
                {i > 0 && (
                  <div
                    className="w-3 sm:w-6 h-px bg-[var(--border)] mx-0.5 sm:mx-1"
                    aria-hidden="true"
                  />
                )}

                {/* Tool dot */}
                <Link
                  href={tool.href}
                  aria-current={isCurrent ? "page" : undefined}
                  aria-label={tool.title}
                  title={tool.title}
                  className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
                    isCurrent
                      ? `w-9 h-9 sm:w-10 sm:h-10 ${tool.iconBg} ring-2 ring-offset-1 ring-offset-[var(--background)] ${tool.iconColor.replace("text-", "ring-")}`
                      : "w-7 h-7 sm:w-8 sm:h-8 bg-[var(--background-secondary)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  <Icon
                    size={isCurrent ? 16 : 13}
                    className={isCurrent ? tool.iconColor : "text-[var(--foreground-muted)]"}
                  />
                  {/* Step number badge */}
                  <span
                    className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center ${
                      isCurrent
                        ? "bg-[var(--gold)] text-black"
                        : "bg-[var(--background-secondary)] text-[var(--foreground-muted)] border border-[var(--border)]"
                    }`}
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Right: Tool-specific actions */}
        <div className="flex items-center gap-3 min-w-[44px] justify-end">{rightSlot}</div>
      </div>

      {/* Progress bar */}
      {typeof internalProgress === "number" && internalProgress > 0 && (
        <div
          className="h-0.5 bg-[var(--background-secondary)]/60"
          role="progressbar"
          aria-valuenow={Math.round(internalProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={tr("Progresso", "Progress", "Progreso")}
        >
          <div
            className="h-full bg-gradient-to-r from-[var(--gold)]/70 to-[var(--gold)] transition-all duration-500 ease-out shadow-sm shadow-[var(--gold)]/30"
            style={{ width: `${internalProgress}%` }}
          />
        </div>
      )}
    </header>
  );
}

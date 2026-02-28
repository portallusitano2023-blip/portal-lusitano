"use client";

import Link from "next/link";
import { Check, Star, ArrowRight, Clock } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

export interface ToolDefinition {
  title: string;
  href: string;
  icon: React.ElementType;
  description: string;
  features: string[];
  color: string;
  iconBg: string;
  iconColor: string;
  badge: string | null;
  badgeColor: string | null;
  freeUses: number;
  estimatedTime?: string;
}

interface ToolCardProps {
  tool: ToolDefinition;
  index: number;
}

function ToolCard({ tool, index }: ToolCardProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);
  const { user, isLoading } = useAuth();
  const Icon = tool.icon;

  return (
    <Link
      href={tool.href}
      className="group relative bg-[var(--background-secondary)]/80 border border-[var(--border)] rounded-2xl p-8 transition-all duration-300 hover:border-[var(--gold)]/50 hover:shadow-2xl hover:shadow-[var(--gold)]/8 hover:-translate-y-2 hover:scale-[1.02] opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards] overflow-hidden"
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
    >
      {/* Gradient background on hover */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Top accent line that slides in on hover */}
      <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full" />

      <div className="relative z-10">
        {/* Badges row */}
        <div className="flex items-center gap-2 mb-5 min-h-[24px]">
          {tool.badge && tool.badgeColor && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${tool.badgeColor}`}
            >
              {tool.badgeColor?.includes("gold") && <Star size={9} fill="currentColor" />}
              {tool.badge}
            </span>
          )}
          {!isLoading && !user && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Check size={9} />
              {tool.freeUses} {tr("uso grátis", "free use", "uso gratis")}
            </span>
          )}
          {tool.estimatedTime && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium text-[var(--foreground-muted)] bg-[var(--background-card)]">
              <Clock size={9} />
              {tool.estimatedTime}
            </span>
          )}
        </div>

        {/* Icon */}
        <div
          className={`w-14 h-14 ${tool.iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}
        >
          <Icon className={tool.iconColor} size={28} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif text-[var(--foreground)] mb-3 group-hover:text-[var(--gold)] transition-colors">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-6">
          {tool.description}
        </p>

        {/* Features */}
        <ul className="space-y-2.5 mb-6">
          {tool.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-[var(--foreground-muted)] text-xs">
              <Check size={13} className="text-[var(--gold)] flex-shrink-0 mt-0.5" />
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--gold)] group-hover:gap-3 transition-all">
            <span>{t.ferramentas.try}</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
          {/* Subtle arrow circle on hover */}
          <div className="w-8 h-8 rounded-full border border-[var(--gold)]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <ArrowRight size={14} className="text-[var(--gold)]" />
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ToolsGridProps {
  tools: ToolDefinition[];
  sectionLabel: string;
}

export default function ToolsGrid({ tools, sectionLabel }: ToolsGridProps) {
  return (
    <section id="ferramentas" className="px-6 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
            {sectionLabel}
          </span>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <ToolCard key={tool.href} tool={tool} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

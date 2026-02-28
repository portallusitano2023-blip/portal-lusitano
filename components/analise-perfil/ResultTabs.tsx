"use client";

import { useState } from "react";
import {
  Users,
  Feather,
  DollarSign,
  Calendar,
  BarChart3,
  Compass,
  ClipboardCheck,
  PiggyBank,
  Heart,
  LayoutGrid,
  Play,
  Gauge,
  Crown,
  ChevronDown,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type { ResultTab } from "@/components/analise-perfil/types";

interface ResultTabsProps {
  selectedTab: ResultTab;
  onSelectTab: (tab: ResultTab) => void;
}

// Tabs that require a PRO subscription (wrapped in BlurredProSection in page.tsx)
const PRO_TABS = new Set<ResultTab>([
  "custos",
  "analise",
  "checklist",
  "budget",
  "simulador",
  "preparacao",
]);

interface TabDef {
  id: ResultTab;
  label: string;
  icon: typeof Users;
}

interface TabGroup {
  label: string;
  tabs: TabDef[];
}

export default function ResultTabs({ selectedTab, onSelectTab }: ResultTabsProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);

  const tabs: TabDef[] = [
    { id: "perfil", label: t.analise_perfil.tab_profile, icon: Users },
    { id: "cavalo", label: t.analise_perfil.tab_ideal_horse, icon: Feather },
    {
      id: "afinidade",
      label:
        (t.analise_perfil as Record<string, string>).tab_affinity ??
        tr("Afinidade", "Affinity", "Afinidad"),
      icon: Heart,
    },
    { id: "custos", label: t.analise_perfil.tab_costs, icon: DollarSign },
    { id: "cronograma", label: t.analise_perfil.tab_timeline, icon: Calendar },
    { id: "analise", label: t.analise_perfil.tab_analysis, icon: BarChart3 },
    { id: "proximos", label: t.analise_perfil.tab_next_steps, icon: Compass },
    {
      id: "prioridades",
      label:
        (t.analise_perfil as Record<string, string>).tab_priorities ??
        tr("Prioridades", "Priorities", "Prioridades"),
      icon: LayoutGrid,
    },
    { id: "checklist", label: t.analise_perfil.tab_checklist, icon: ClipboardCheck },
    { id: "budget", label: t.analise_perfil.tab_budget, icon: PiggyBank },
    {
      id: "simulador",
      label:
        (t.analise_perfil as Record<string, string>).tab_simulator ??
        tr("Simulador", "Simulator", "Simulador"),
      icon: Play,
    },
    {
      id: "preparacao",
      label:
        (t.analise_perfil as Record<string, string>).tab_readiness ??
        tr("Preparação", "Readiness", "Preparación"),
      icon: Gauge,
    },
  ];

  // Mobile groups
  const groups: TabGroup[] = [
    {
      label: tr("Perfil", "Profile", "Perfil"),
      tabs: tabs.filter((t) => ["perfil", "cavalo", "afinidade"].includes(t.id)),
    },
    {
      label: tr("Planeamento", "Planning", "Planificación"),
      tabs: tabs.filter((t) => ["custos", "cronograma", "analise"].includes(t.id)),
    },
    {
      label: tr("Acção", "Action", "Acción"),
      tabs: tabs.filter((t) =>
        ["proximos", "prioridades", "checklist", "budget", "simulador", "preparacao"].includes(t.id)
      ),
    },
  ];

  // Find which group the selected tab belongs to
  const activeGroupIdx = groups.findIndex((g) => g.tabs.some((t) => t.id === selectedTab));
  const [expandedGroup, setExpandedGroup] = useState<number>(
    activeGroupIdx >= 0 ? activeGroupIdx : 0
  );

  const toggleGroup = (idx: number) => {
    setExpandedGroup((prev) => (prev === idx ? -1 : idx));
  };

  // When a tab is selected, auto-expand its group on mobile
  const handleTabSelect = (tab: ResultTab) => {
    onSelectTab(tab);
    const groupIdx = groups.findIndex((g) => g.tabs.some((t) => t.id === tab));
    if (groupIdx >= 0) setExpandedGroup(groupIdx);
  };

  return (
    <section className="sticky top-0 z-20 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-0 sm:px-6">
        {/* Desktop: horizontal scroll (unchanged) */}
        <div className="hidden sm:flex gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const isPro = PRO_TABS.has(tab.id);
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                title={
                  isPro
                    ? `${tab.label} — ${tr("requer PRO", "requires PRO", "requiere PRO")}`
                    : tab.label
                }
                className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3.5 min-h-[44px] text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-[var(--gold)] border-b-2 border-[var(--gold)]"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
                }`}
              >
                <tab.icon size={16} aria-hidden="true" />
                {tab.label}
                {isPro && (
                  <Crown
                    size={11}
                    aria-label="PRO"
                    className={`shrink-0 ${isActive ? "text-[#C5A059]" : "text-[#C5A059]/50"}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile: accordion groups */}
        <div className="flex flex-col sm:hidden">
          {groups.map((group, gi) => {
            const isExpanded = expandedGroup === gi;
            const hasActiveTab = group.tabs.some((t) => t.id === selectedTab);
            return (
              <div key={gi}>
                <button
                  onClick={() => toggleGroup(gi)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-xs uppercase tracking-wider transition-colors ${
                    hasActiveTab ? "text-[var(--gold)]" : "text-[var(--foreground-muted)]"
                  }`}
                >
                  <span className="font-semibold">{group.label}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {isExpanded && (
                  <div className="flex flex-col pb-1">
                    {group.tabs.map((tab) => {
                      const isPro = PRO_TABS.has(tab.id);
                      const isActive = selectedTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabSelect(tab.id)}
                          className={`flex items-center gap-2 px-6 py-2.5 text-sm font-medium transition-colors ${
                            isActive
                              ? "text-[var(--gold)] bg-[var(--gold)]/5"
                              : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
                          }`}
                        >
                          <tab.icon size={15} aria-hidden="true" />
                          {tab.label}
                          {isPro && (
                            <Crown
                              size={11}
                              aria-label="PRO"
                              className={`shrink-0 ${isActive ? "text-[#C5A059]" : "text-[#C5A059]/50"}`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

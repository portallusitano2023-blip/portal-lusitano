"use client";

import { Users, Feather, DollarSign, Calendar, BarChart3, Compass } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { ResultTab } from "@/components/analise-perfil/types";

interface ResultTabsProps {
  selectedTab: ResultTab;
  onSelectTab: (tab: ResultTab) => void;
}

export default function ResultTabs({ selectedTab, onSelectTab }: ResultTabsProps) {
  const { t } = useLanguage();

  const tabs: { id: ResultTab; label: string; icon: typeof Users }[] = [
    { id: "perfil", label: t.analise_perfil.tab_profile, icon: Users },
    { id: "cavalo", label: t.analise_perfil.tab_ideal_horse, icon: Feather },
    { id: "custos", label: t.analise_perfil.tab_costs, icon: DollarSign },
    { id: "cronograma", label: t.analise_perfil.tab_timeline, icon: Calendar },
    { id: "analise", label: t.analise_perfil.tab_analysis, icon: BarChart3 },
    { id: "proximos", label: t.analise_perfil.tab_next_steps, icon: Compass },
  ];

  return (
    <section className="sticky top-0 z-20 bg-[#050505]/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap ${selectedTab === tab.id ? "text-[#C5A059] border-b-2 border-[#C5A059]" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

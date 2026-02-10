"use client";

import { useState, useEffect, ReactNode } from "react";
import { X } from "lucide-react";

export interface Tab {
  id: string;
  title: string;
  icon?: string;
  component: ReactNode;
  closable?: boolean;
}

interface TabSystemProps {
  initialTabs?: Tab[];
  onTabChange?: (tabId: string) => void;
}

export default function TabSystem({ initialTabs = [], onTabChange }: TabSystemProps) {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const savedActiveTab = localStorage.getItem("admin-active-tab");
      if (savedActiveTab && initialTabs.find((t) => t.id === savedActiveTab)) {
        return savedActiveTab;
      }
    }
    return initialTabs[0]?.id || "";
  });

  // Guardar tabs no localStorage quando mudam
  useEffect(() => {
    if (tabs.length > 0) {
      // Guardar apenas os IDs e títulos (não os components)
      const tabsToSave = tabs.map((t) => ({
        id: t.id,
        title: t.title,
        icon: t.icon,
        closable: t.closable,
      }));
      localStorage.setItem("admin-tabs", JSON.stringify(tabsToSave));
    }
  }, [tabs]);

  useEffect(() => {
    if (activeTabId) {
      localStorage.setItem("admin-active-tab", activeTabId);
      onTabChange?.(activeTabId);
    }
  }, [activeTabId, onTabChange]);

  const addTab = (newTab: Tab) => {
    // Se tab já existe, apenas ativar
    const existingTab = tabs.find((t) => t.id === newTab.id);
    if (existingTab) {
      setActiveTabId(newTab.id);
      return;
    }

    // Adicionar nova tab
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const newTabs = tabs.filter((t) => t.id !== tabId);

    setTabs(newTabs);

    // Se fechou a tab ativa, ativar outra
    if (activeTabId === tabId && newTabs.length > 0) {
      // Ativar a tab à esquerda, ou a primeira se não houver
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
      setActiveTabId(newActiveTab.id);
    }
  };

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 bg-[#0A0A0A] border-b border-[#1A1A1A] overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`
              group flex items-center gap-2 px-4 py-3 cursor-pointer
              border-r border-[#1A1A1A] transition-all min-w-[150px] max-w-[250px]
              ${
                activeTabId === tab.id
                  ? "bg-[#050505] text-[#C5A059] border-b-2 border-[#C5A059]"
                  : "bg-[#0A0A0A] text-gray-400 hover:bg-[#0F0F0F] hover:text-gray-300"
              }
            `}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.icon && <span className="text-lg">{tab.icon}</span>}
            <span className="flex-1 truncate text-sm font-medium">{tab.title}</span>
            {tab.closable !== false && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className={`
                  p-1 rounded hover:bg-red-500/20 transition-all
                  ${activeTabId === tab.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                `}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {tabs.length === 0 && (
          <div className="px-4 py-3 text-gray-500 text-sm">Nenhuma tab aberta</div>
        )}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto bg-[#050505]">
        {activeTab ? (
          <div key={activeTab.id} className="h-full">
            {activeTab.component}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Seleciona uma funcionalidade na sidebar
          </div>
        )}
      </div>
    </div>
  );
}

// Hook para usar o tab system
export function useTabSystem() {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");

  const addTab = (newTab: Tab) => {
    // Se tab já existe, apenas ativar
    const existingTab = tabs.find((t) => t.id === newTab.id);
    if (existingTab) {
      setActiveTabId(newTab.id);
      return;
    }

    // Adicionar nova tab
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const newTabs = tabs.filter((t) => t.id !== tabId);

    setTabs(newTabs);

    if (activeTabId === tabId && newTabs.length > 0) {
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
      setActiveTabId(newActiveTab.id);
    }
  };

  return {
    tabs,
    activeTabId,
    addTab,
    closeTab,
    setActiveTabId,
  };
}

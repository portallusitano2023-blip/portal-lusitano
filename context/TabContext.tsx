"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Tab {
  id: string;
  title: string;
  icon?: string;
  component: ReactNode;
  closable?: boolean;
}

interface TabContextType {
  tabs: Tab[];
  activeTabId: string;
  addTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTabId: (tabId: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function TabProvider({ children }: { children: ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>("");

  // Ler tab ativa do localStorage após mount
  useEffect(() => {
    const saved = localStorage.getItem("admin-active-tab");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage on mount
    if (saved) setActiveTabId(saved);
  }, []);

  // Guardar tab ativa no localStorage
  useEffect(() => {
    if (activeTabId) {
      localStorage.setItem("admin-active-tab", activeTabId);
    }
  }, [activeTabId]);

  const addTab = (newTab: Tab) => {
    // Se tab já existe, apenas ativar
    const existingTab = tabs.find((t) => t.id === newTab.id);
    if (existingTab) {
      setActiveTabId(newTab.id);
      return;
    }

    // Adicionar nova tab
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex((t) => t.id === tabId);
    const newTabs = tabs.filter((t) => t.id !== tabId);

    setTabs(newTabs);

    // Se fechou a tab ativa, ativar outra
    if (activeTabId === tabId && newTabs.length > 0) {
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
      setActiveTabId(newActiveTab.id);
    } else if (newTabs.length === 0) {
      setActiveTabId("");
    }
  };

  return (
    <TabContext.Provider
      value={{
        tabs,
        activeTabId,
        addTab,
        closeTab,
        setActiveTabId,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error("useTab deve ser usado dentro de um TabProvider");
  }
  return context;
}

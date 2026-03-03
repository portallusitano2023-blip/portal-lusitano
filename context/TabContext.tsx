"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

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

  const addTab = useCallback((newTab: Tab) => {
    setTabs((prev) => {
      // Se tab já existe, apenas ativar
      if (prev.some((t) => t.id === newTab.id)) {
        setActiveTabId(newTab.id);
        return prev;
      }
      // Adicionar nova tab
      setActiveTabId(newTab.id);
      return [...prev, newTab];
    });
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setTabs((prev) => {
      const tabIndex = prev.findIndex((t) => t.id === tabId);
      const newTabs = prev.filter((t) => t.id !== tabId);

      // Se fechou a tab ativa, ativar outra
      setActiveTabId((currentActive) => {
        if (currentActive === tabId && newTabs.length > 0) {
          return newTabs[Math.max(0, tabIndex - 1)].id;
        }
        if (newTabs.length === 0) return "";
        return currentActive;
      });

      return newTabs;
    });
  }, []);

  const value = useMemo(
    () => ({ tabs, activeTabId, addTab, closeTab, setActiveTabId }),
    [tabs, activeTabId, addTab, closeTab]
  );

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
}

export function useTab() {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error("useTab deve ser usado dentro de um TabProvider");
  }
  return context;
}

"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { useTab } from "@/contexts/TabContext";
import { X, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiStar,
  FiMail,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiTag,
  FiFileText,
  FiAward,
  FiBriefcase,
} from "react-icons/fi";

// Lazy load das páginas para performance
const DashboardContent = lazy(() => import("@/components/admin-app/DashboardContent"));
const CavalosContent = lazy(() => import("@/components/admin-app/CavalosContent"));
const EventosContent = lazy(() => import("@/components/admin-app/EventosContent"));
const CoudelariasContent = lazy(() => import("@/components/admin-app/CoudelariasContent"));
const ProfissionaisContent = lazy(() => import("@/components/admin-app/ProfissionaisContent"));
const MensagensContent = lazy(() => import("@/components/admin-app/MensagensContent"));
const CupoesContent = lazy(() => import("@/components/admin-app/CupoesContent"));
const FinanceiroContent = lazy(() => import("@/components/admin-app/FinanceiroContent"));
const ReviewsContent = lazy(() => import("@/components/admin-app/ReviewsContent"));

interface MenuItem {
  id: string;
  title: string;
  icon: any;
  emoji: string;
  component: any;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: FiHome,
    emoji: "🏠",
    component: DashboardContent,
  },
  {
    id: "cavalos",
    title: "Cavalos",
    icon: FiUsers,
    emoji: "🐴",
    component: CavalosContent,
  },
  {
    id: "eventos",
    title: "Eventos",
    icon: FiCalendar,
    emoji: "📅",
    component: EventosContent,
  },
  {
    id: "coudelarias",
    title: "Coudelarias",
    icon: FiBriefcase,
    emoji: "🏛️",
    component: CoudelariasContent,
  },
  {
    id: "profissionais",
    title: "Profissionais",
    icon: FiAward,
    emoji: "👔",
    component: ProfissionaisContent,
  },
  {
    id: "reviews",
    title: "Reviews",
    icon: FiStar,
    emoji: "⭐",
    component: ReviewsContent,
  },
  {
    id: "mensagens",
    title: "Mensagens",
    icon: FiMail,
    emoji: "📧",
    component: MensagensContent,
  },
  {
    id: "cupoes",
    title: "Cupões",
    icon: FiTag,
    emoji: "💰",
    component: CupoesContent,
  },
  {
    id: "financeiro",
    title: "Financeiro",
    icon: FiDollarSign,
    emoji: "💵",
    component: FinanceiroContent,
  },
];

export default function AdminAppPage() {
  const { tabs, activeTabId, addTab, closeTab, setActiveTabId } = useTab();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="));

    if (!token) {
      router.push("/admin/login");
      return;
    }

    setIsAuthenticated(true);

    // Abrir dashboard por padrão se não houver tabs
    if (tabs.length === 0) {
      handleMenuClick(MENU_ITEMS[0]);
    }
  }, []);

  const handleMenuClick = (item: MenuItem) => {
    const Component = item.component;

    addTab({
      id: item.id,
      title: item.title,
      icon: item.emoji,
      component: (
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059]"></div>
            </div>
          }
        >
          <Component />
        </Suspense>
      ),
      closable: item.id !== "dashboard", // Dashboard não pode fechar
    });
  };

  const handleLogout = () => {
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/admin/login");
  };

  const activeTab = tabs.find((t) => t.id === activeTabId);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={`
          bg-[#0A0A0A] border-r border-[#1A1A1A] transition-all duration-300
          ${sidebarOpen ? "w-64" : "w-0"}
          overflow-hidden flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#1A1A1A]">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#C5A059]">Portal Admin</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-[#1A1A1A] rounded lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTabId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all text-left
                  ${
                    isActive
                      ? "bg-[#C5A059] text-black font-medium"
                      : "text-gray-400 hover:bg-[#1A1A1A] hover:text-white"
                  }
                `}
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="text-sm">{item.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#1A1A1A]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
              text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sair</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar com Tabs */}
        <div className="flex items-center bg-[#0A0A0A] border-b border-[#1A1A1A]">
          {/* Toggle Sidebar Button */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-4 hover:bg-[#1A1A1A] border-r border-[#1A1A1A]"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Tabs */}
          <div className="flex-1 flex items-center overflow-x-auto">
            {tabs.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-sm">
                Seleciona uma funcionalidade na sidebar
              </div>
            ) : (
              tabs.map((tab) => (
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
                  <span className="flex-1 truncate text-sm font-medium">
                    {tab.title}
                  </span>
                  {tab.closable !== false && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                      className={`
                        p-1 rounded hover:bg-red-500/20 transition-all
                        ${
                          activeTabId === tab.id
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }
                      `}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto bg-[#050505]">
          {activeTab ? (
            <div key={activeTab.id} className="h-full">
              {activeTab.component}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-6xl mb-4">🐴</div>
              <h2 className="text-2xl font-bold mb-2">Portal Lusitano Admin</h2>
              <p>Seleciona uma funcionalidade na sidebar para começar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

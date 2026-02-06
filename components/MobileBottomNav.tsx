"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Heart, Search, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useHorseFavorites } from "@/context/HorseFavoritesContext";
import { useState } from "react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openCart, totalQuantity } = useCart();
  const { favoritesCount } = useHorseFavorites();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Don't show on certain pages
  const hiddenPaths = ["/studio", "/admin"];
  if (hiddenPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Início",
      isActive: pathname === "/"
    },
    {
      href: "/comprar",
      icon: ShoppingCart,
      label: "Cavalos",
      isActive: pathname.startsWith("/comprar") || pathname === "/marketplace"
    },
    {
      href: "/cavalos-favoritos",
      icon: Heart,
      label: "Favoritos",
      isActive: pathname === "/cavalos-favoritos" || pathname === "/favoritos",
      badge: favoritesCount > 0 ? favoritesCount : undefined
    },
    {
      href: "/minha-conta",
      icon: User,
      label: "Conta",
      isActive: pathname === "/minha-conta"
    },
  ];

  return (
    <>
      {/* Spacer to prevent content from being hidden behind the nav */}
      <div className="h-[72px] lg:hidden" />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#0a0a0a]/98 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
        <div className="flex items-center justify-around h-[72px] px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[56px] rounded-xl transition-all active:scale-90 touch-manipulation focus-visible:ring-2 focus-visible:ring-[#C5A059] ${
                item.isActive
                  ? "text-[#C5A059]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <div className="relative">
                <item.icon size={24} strokeWidth={item.isActive ? 2 : 1.5} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-[#C5A059] rounded-full flex items-center justify-center text-[10px] text-black font-bold">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${item.isActive ? "text-[#C5A059]" : ""}`}>
                {item.label}
              </span>
            </Link>
          ))}

          {/* Cart Button */}
          <button
            onClick={openCart}
            aria-label="Abrir carrinho de compras"
            className="flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[56px] rounded-xl text-zinc-500 hover:text-zinc-300 transition-all active:scale-90 touch-manipulation focus-visible:ring-2 focus-visible:ring-[#C5A059]"
          >
            <div className="relative">
              <ShoppingCart size={24} strokeWidth={1.5} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-2 w-5 h-5 bg-[#C5A059] rounded-full flex items-center justify-center text-[10px] text-black font-bold">
                  {totalQuantity > 9 ? "9+" : totalQuantity}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Loja</span>
          </button>
        </div>
      </nav>
    </>
  );
}

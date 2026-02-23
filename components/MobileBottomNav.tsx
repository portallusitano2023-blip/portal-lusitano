"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Heart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useHorseFavorites } from "@/context/HorseFavoritesContext";
import { useLanguage } from "@/context/LanguageContext";
export default function MobileBottomNav() {
  const pathname = usePathname();
  const { openCart, totalQuantity } = useCart();
  const { favoritesCount } = useHorseFavorites();
  const { t } = useLanguage();
  // Don't show on certain pages
  const hiddenPaths = ["/studio", "/admin"];
  if (hiddenPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: t.mobile_nav.home,
      isActive: pathname === "/",
    },
    {
      href: "/comprar",
      icon: ShoppingCart,
      label: t.mobile_nav.horses,
      isActive: pathname.startsWith("/comprar") || pathname === "/marketplace",
    },
    {
      href: "/cavalos-favoritos",
      icon: Heart,
      label: t.mobile_nav.favorites,
      isActive: pathname === "/cavalos-favoritos" || pathname === "/favoritos",
      badge: favoritesCount > 0 ? favoritesCount : undefined,
    },
    {
      href: "/minha-conta",
      icon: User,
      label: t.mobile_nav.account,
      isActive: pathname === "/minha-conta",
    },
  ];

  return (
    <>
      {/* Spacer to prevent content from being hidden behind the nav */}
      <div className="h-[72px] lg:hidden" />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[var(--background-secondary)] border-t border-[var(--border)] safe-area-bottom [transform:translateZ(0)]">
        <div className="flex items-center justify-around h-[72px] px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[56px] rounded-xl transition-all active:scale-90 touch-manipulation focus-visible:ring-2 focus-visible:ring-[var(--gold)] ${
                item.isActive
                  ? "text-[var(--gold)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)]"
              }`}
            >
              <div className="relative">
                <item.icon size={24} strokeWidth={item.isActive ? 2 : 1.5} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-[var(--gold)] rounded-full flex items-center justify-center text-[10px] text-black font-bold">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${item.isActive ? "text-[var(--gold)]" : ""}`}
              >
                {item.label}
              </span>
            </Link>
          ))}

          {/* Cart Button */}
          <button
            onClick={openCart}
            aria-label={t.mobile_nav.shop}
            className="flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[56px] rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] transition-all active:scale-90 touch-manipulation focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            <div className="relative">
              <ShoppingCart size={24} strokeWidth={1.5} />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-2 w-5 h-5 bg-[var(--gold)] rounded-full flex items-center justify-center text-[10px] text-black font-bold">
                  {totalQuantity > 9 ? "9+" : totalQuantity}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{t.mobile_nav.shop}</span>
          </button>
        </div>
      </nav>
    </>
  );
}

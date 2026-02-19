import Link from "next/link";
import { Gift } from "lucide-react";
import { usePathname } from "next/navigation";
import { LusitanoDropdown } from "./LusitanoDropdown";

interface DesktopMenuProps {
  t: {
    nav: {
      home: string;
      shop: string;
      journal: string;
      about: string;
      advertising: string;
      free_ebook: string;
    };
  };
}

export function DesktopMenu({ t }: DesktopMenuProps) {
  const pathname = usePathname();

  const navItems = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.shop, href: "/loja" },
    { name: t.nav.journal, href: "/jornal" },
    { name: "Ferramentas", href: "/ferramentas" },
    { name: t.nav.about, href: "/sobre" },
  ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="hidden lg:flex items-center gap-4 xl:gap-6 ml-8 lg:ml-12">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 relative group py-2 ${
              active
                ? "text-[var(--gold)]"
                : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
            }`}
          >
            {item.name}
            <span
              className={`absolute -bottom-1 left-0 h-[1px] bg-[var(--gold)] transition-all duration-500 ease-out ${
                active ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </Link>
        );
      })}

      {/* Lusitano Dropdown */}
      <LusitanoDropdown />

      {/* Instagram Promo Link */}
      <Link
        href="/instagram"
        aria-current={pathname === "/instagram" ? "page" : undefined}
        className={`text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 relative group py-2 ${
          pathname === "/instagram"
            ? "text-[var(--gold)]"
            : "text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
        }`}
      >
        {t.nav.advertising}
        <span
          className={`absolute -bottom-1 left-0 h-[1px] bg-[var(--gold)] transition-all duration-500 ease-out ${
            pathname === "/instagram" ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </Link>

      {/* Free Ebook Link */}
      <Link
        href="/ebook-gratis"
        className="relative flex items-center gap-2 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-hover)] text-black px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] font-bold hover:from-white hover:to-white transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.15)] hover:shadow-[0_0_25px_rgba(197,160,89,0.3)]"
      >
        <Gift size={14} />
        {t.nav.free_ebook}
      </Link>
    </div>
  );
}

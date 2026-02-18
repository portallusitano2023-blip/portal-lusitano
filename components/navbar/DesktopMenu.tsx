import Link from "next/link";
import { Gift } from "lucide-react";
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
  const navItems = [
    { name: t.nav.home, href: "/" },
    { name: t.nav.shop, href: "/loja" },
    { name: t.nav.journal, href: "/jornal" },
    { name: t.nav.about, href: "/sobre" },
  ];

  return (
    <div className="hidden lg:flex items-center gap-4 xl:gap-6 ml-8 lg:ml-12">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-[11px] uppercase tracking-[0.2em] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors duration-300 relative group py-2"
        >
          {item.name}
          <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--gold)] transition-all duration-500 ease-out group-hover:w-full"></span>
        </Link>
      ))}

      {/* Lusitano Dropdown */}
      <LusitanoDropdown />

      {/* Instagram Promo Link */}
      <Link
        href="/instagram"
        className="text-[11px] uppercase tracking-[0.2em] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors duration-300 relative group py-2"
      >
        {t.nav.advertising}
        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--gold)] transition-all duration-500 ease-out group-hover:w-full"></span>
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

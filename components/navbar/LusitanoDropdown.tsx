"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getDbItems, getCommunityItems } from "./navData";

export function LusitanoDropdown() {
  const { t } = useLanguage();

  const dbItems = useMemo(() => getDbItems(t.nav), [t]);
  const communityItems = useMemo(() => getCommunityItems(t.nav), [t]);

  return (
    <div className="group/dd relative">
      <span className="flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors duration-300 py-2 cursor-pointer">
        Lusitano
        <ChevronDown
          size={14}
          className="transition-transform duration-300 group-hover/dd:rotate-180"
        />
      </span>

      {/* Dropdown Panel — abre ao hover via CSS, sem JS */}
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 pt-3 hidden group-hover/dd:block"
        style={{ zIndex: 9999 }}
      >
        <div className="w-[560px] bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
          {/* Secção: Base de Dados */}
          <span className="text-[9px] uppercase tracking-[0.25em] text-[var(--gold)] font-semibold block mb-3 px-3">
            {t.nav.database}
          </span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            {dbItems.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false} className="dd-item">
                <item.icon size={16} className={item.iconClass || "text-[var(--gold)] shrink-0"} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[var(--foreground)]">{item.label}</div>
                  <div className="text-[10px] text-[var(--foreground-muted)] leading-tight">
                    {item.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Separador */}
          <div className="border-t border-[var(--border)] my-4 mx-3 opacity-50" />

          {/* Secção: Comunidade */}
          <span className="text-[9px] uppercase tracking-[0.25em] text-[var(--gold)] font-semibold block mb-3 px-3">
            {t.nav.community}
          </span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
            {communityItems.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false} className="dd-item">
                <item.icon size={16} className="text-[var(--gold)] shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[var(--foreground)]">{item.label}</div>
                  <div className="text-[10px] text-[var(--foreground-muted)] leading-tight">
                    {item.desc}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

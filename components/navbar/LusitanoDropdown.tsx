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
        <div className="w-[520px] grid grid-cols-2 gap-4 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg p-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
          {/* Coluna 1 — Base de Dados (primeiros 5) */}
          <div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--gold)] mb-2 block font-medium">
              {t.nav.database}
            </span>
            {dbItems.slice(0, 5).map((item) => (
              <Link key={item.href} href={item.href} prefetch={false} className="dd-item">
                <item.icon size={16} className={item.iconClass || "text-[var(--gold)]"} />
                <div>
                  <div className="text-sm font-medium text-[var(--foreground)]">{item.label}</div>
                  <div className="text-[10px] text-[var(--foreground-muted)]">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Coluna 2 — Base de Dados (restantes) + Comunidade */}
          <div>
            {dbItems.slice(5).map((item) => (
              <Link key={item.href} href={item.href} prefetch={false} className="dd-item mt-7">
                <item.icon size={16} className={item.iconClass || "text-[var(--gold)]"} />
                <div>
                  <div className="text-sm font-medium text-[var(--foreground)]">{item.label}</div>
                  <div className="text-[10px] text-[var(--foreground-muted)]">{item.desc}</div>
                </div>
              </Link>
            ))}

            <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--gold)] mb-2 mt-4 block font-medium">
              {t.nav.community}
            </span>
            {communityItems.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false} className="dd-item">
                <item.icon size={16} className="text-[var(--gold)]" />
                <div>
                  <div className="text-sm font-medium text-[var(--foreground)]">{item.label}</div>
                  <div className="text-[10px] text-[var(--foreground-muted)]">{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

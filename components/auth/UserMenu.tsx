"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { User, LogOut, Crown, History, Settings, ChevronDown } from "lucide-react";

export default function UserMenu() {
  const { user, isLoading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-[var(--background-card)] animate-pulse" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden md:flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--gold)] transition-colors text-sm"
      >
        <User size={18} />
        <span className="hidden xl:inline">Entrar</span>
      </Link>
    );
  }

  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilizador";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8B7355] flex items-center justify-center text-black text-sm font-bold">
          {initial}
        </div>
        <span className="hidden xl:block text-sm max-w-[100px] truncate">{name}</span>
        <ChevronDown
          size={14}
          className={`hidden xl:block transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-[var(--border)]">
            <p className="text-sm font-medium text-[var(--foreground)] truncate">{name}</p>
            <p className="text-xs text-[var(--foreground-muted)] truncate">{user.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/perfil"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              <Settings size={16} className="text-[var(--foreground-muted)]" />
              Meu Perfil
            </Link>
            <Link
              href="/historico"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              <History size={16} className="text-[var(--foreground-muted)]" />
              Historico
            </Link>
            <Link
              href="/ferramentas"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--gold)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              <Crown size={16} />
              Ferramentas PRO
            </Link>
          </div>

          <div className="border-t border-[var(--border)] py-1">
            <button
              onClick={async () => {
                setOpen(false);
                await signOut();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--foreground-secondary)] hover:text-red-400 hover:bg-[var(--surface-hover)] transition-colors"
            >
              <LogOut size={16} />
              Terminar Sessao
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

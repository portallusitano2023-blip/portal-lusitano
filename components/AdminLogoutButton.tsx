"use client";

import { useTransition } from "react";
import { adminLogout } from "@/app/admin/login/actions";

export default function AdminLogoutButton({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await adminLogout();
    });
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className={className || "text-zinc-400 hover:text-red-400 text-sm transition-colors disabled:opacity-50"}
    >
      {isPending ? "A sair..." : "Sair"}
    </button>
  );
}

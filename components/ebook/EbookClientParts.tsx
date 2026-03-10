"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { trackEbookFunnel } from "@/lib/analytics";

const EbookForm = dynamic(() => import("@/components/ebook/EbookForm"), {
  ssr: false,
  loading: () => (
    <div className="space-y-3 max-w-lg">
      <div className="h-[56px] animate-pulse bg-[var(--surface-hover)] border border-[var(--border)]" />
      <div className="h-[56px] animate-pulse bg-[var(--surface-hover)] border border-[var(--border)]" />
      <div className="h-[56px] animate-pulse bg-[var(--gold)]/20" />
    </div>
  ),
});

export function EbookTracker() {
  useEffect(() => {
    trackEbookFunnel("view_landing");
  }, []);
  return null;
}

export function EbookFormWrapper({ variant }: { variant: "hero" | "cta" }) {
  return <EbookForm variant={variant} />;
}

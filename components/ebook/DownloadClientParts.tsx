"use client";

import { useEffect } from "react";
import { trackEbookFunnel } from "@/lib/analytics";
import { BookOpen } from "lucide-react";

export function DownloadTracker() {
  useEffect(() => {
    trackEbookFunnel("download_pdf");
  }, []);
  return null;
}

export function ViewEbookButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => window.open("/downloads/introducao-lusitano.html", "_blank")}
      className="inline-flex items-center gap-3 bg-[var(--gold)] text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-[var(--gold-hover)] hover:scale-[1.05] active:scale-[0.95] transition-all mb-4"
    >
      <BookOpen size={20} />
      {label}
    </button>
  );
}

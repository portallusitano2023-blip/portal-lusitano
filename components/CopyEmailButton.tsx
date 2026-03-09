"use client";

import { useState } from "react";

export default function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("portal.lusitano2023@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyEmail}
      className="text-[9px] uppercase tracking-[0.2em] text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors"
    >
      {copied ? "Copiado \u2713" : "Copiar email"}
    </button>
  );
}

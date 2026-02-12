"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";

interface BlurredProSectionProps {
  isSubscribed: boolean;
  children: React.ReactNode;
  title?: string;
}

export default function BlurredProSection({
  isSubscribed,
  children,
  title,
}: BlurredProSectionProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      router.push("/registar?redirect=/ferramentas");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tools/create-checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  };

  if (isSubscribed) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* Blurred content - visible but inaccessible */}
      <div className="blur-[6px] pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[var(--background)]/40 backdrop-blur-[2px] flex items-center justify-center z-10">
        <div className="text-center max-w-xs px-4">
          <div className="w-12 h-12 bg-[#C5A059]/15 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="text-[#C5A059]" size={20} />
          </div>

          {title && <h4 className="text-sm font-serif text-[var(--foreground)] mb-1">{title}</h4>}

          <p className="text-xs text-[var(--foreground-muted)] mb-4">
            {t.pro_upgrade_card.benefit_unlimited}
          </p>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black text-xs font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />}
            {t.pro_upgrade_card.subscribe}
          </button>
        </div>
      </div>
    </div>
  );
}

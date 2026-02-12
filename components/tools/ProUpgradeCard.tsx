"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Crown,
  ChevronDown,
  ChevronUp,
  Loader2,
  Infinity,
  FileText,
  Save,
  Clock,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";

interface ProUpgradeCardProps {
  isSubscribed: boolean;
}

const STORAGE_KEY = "pro-upgrade-card-collapsed";

function getInitialCollapsed(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "true";
}

export default function ProUpgradeCard({ isSubscribed }: ProUpgradeCardProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(getInitialCollapsed);
  const [loading, setLoading] = useState(false);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

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
        // Checkout error
        setLoading(false);
      }
    } catch (err) {
      // Checkout error
      setLoading(false);
    }
  };

  if (isSubscribed) return null;

  const txt = t.pro_upgrade_card;

  return (
    <div className="mt-3 border border-[#C5A059]/30 rounded-xl overflow-hidden bg-gradient-to-r from-[#C5A059]/5 to-transparent">
      {/* Header - always visible */}
      <button
        onClick={toggleCollapsed}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#C5A059]/5 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Crown size={16} className="text-[#C5A059]" />
          <span className="text-sm font-semibold text-[#C5A059]">{txt.title}</span>
          <span className="text-xs text-[var(--foreground-muted)] font-normal">
            4,99 {txt.price_suffix}
          </span>
        </div>
        {collapsed ? (
          <ChevronDown size={16} className="text-[#C5A059]/60" />
        ) : (
          <ChevronUp size={16} className="text-[#C5A059]/60" />
        )}
      </button>

      {/* Expandable content */}
      {!collapsed && (
        <div className="px-4 pb-4 animate-[fadeSlideIn_0.2s_ease-out_forwards]">
          {/* Benefits */}
          <ul className="space-y-2 mb-4">
            {[
              { icon: <Infinity size={14} />, text: txt.benefit_unlimited },
              { icon: <FileText size={14} />, text: txt.benefit_pdf },
              { icon: <Save size={14} />, text: txt.benefit_save },
              { icon: <Clock size={14} />, text: txt.benefit_history },
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 text-sm text-[var(--foreground-secondary)]"
              >
                <span className="text-[#C5A059]">{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black text-sm font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />}
              {loading ? txt.processing : txt.subscribe}
            </button>
            <Link
              href="/ferramentas#precos"
              className="text-center text-xs text-[#C5A059]/70 hover:text-[#C5A059] transition-colors py-2"
            >
              {txt.see_plans}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, Users, TrendingUp } from "lucide-react";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

interface ToolStats {
  totalAnalyses: number;
  totalUsers: number;
  avgRating: number;
  reviewCount: number;
}

const FALLBACK_STATS: ToolStats = {
  totalAnalyses: 0,
  totalUsers: 0,
  avgRating: 0,
  reviewCount: 0,
};

function useAnimatedCounter(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) return;
    startRef.current = null;
    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

function StatCounter({
  value,
  label,
  icon: Icon,
}: {
  value: number;
  label: string;
  icon: React.ElementType;
}) {
  const animated = useAnimatedCounter(value);
  return (
    <div className="flex flex-col items-center gap-2 p-4 sm:p-6">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--gold)]/10 rounded-xl flex items-center justify-center mb-1">
        <Icon size={20} className="text-[var(--gold)]" />
      </div>
      <p className="text-2xl sm:text-3xl font-serif text-[var(--foreground)]">
        {animated.toLocaleString("pt-PT")}
      </p>
      <p className="text-xs text-[var(--foreground-muted)] text-center">{label}</p>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto mb-16 px-6">
      <div className="bg-[var(--background-secondary)]/60 border border-[var(--gold)]/15 rounded-2xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 p-4 sm:p-6 animate-pulse">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--background-card)] rounded-xl mb-1" />
            <div className="h-7 w-16 bg-[var(--background-card)] rounded" />
            <div className="h-3 w-24 bg-[var(--background-card)] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState<ToolStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const tr = createTranslator(language);

  useEffect(() => {
    fetch("/api/tools/stats")
      .then((r) => r.json())
      .then((data: ToolStats) => {
        setStats(data.totalAnalyses > 0 ? data : FALLBACK_STATS);
      })
      .catch(() => {
        setStats(FALLBACK_STATS);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <StatsSkeleton />;
  if (!stats || stats.totalAnalyses === 0) return null;

  return (
    <AnimateOnScroll>
      <div className="max-w-3xl mx-auto mb-16 px-6">
        <div className="bg-[var(--background-secondary)]/60 border border-[var(--gold)]/15 rounded-2xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]">
          <StatCounter
            value={stats.totalAnalyses}
            label={tr("análises realizadas", "analyses done", "análisis realizados")}
            icon={Activity}
          />
          <StatCounter
            value={stats.totalUsers}
            label={tr("utilizadores activos", "active users", "usuarios activos")}
            icon={Users}
          />
          <StatCounter
            value={stats.reviewCount}
            label={tr(
              `avaliações (${stats.avgRating}★)`,
              `reviews (${stats.avgRating}★)`,
              `valoraciones (${stats.avgRating}★)`
            )}
            icon={TrendingUp}
          />
        </div>
      </div>
    </AnimateOnScroll>
  );
}

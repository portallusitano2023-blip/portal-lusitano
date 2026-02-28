"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Shield, Download, Zap, Crown, ChevronUp } from "lucide-react";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import ToolsHero from "@/components/ferramentas/ToolsHero";
import ToolsGrid from "@/components/ferramentas/ToolsGrid";
import { CheckoutFeedback, ProBannerSection } from "@/components/ferramentas/PricingSection";
import FAQSection from "@/components/ferramentas/FAQSection";
import { getTools } from "./tools-data";
import { getFaqItems } from "./faq-data";

// Lazy-loaded below-the-fold sections
const StatsSection = dynamic(() => import("@/components/ferramentas/StatsSection"), {
  ssr: false,
});
const ToolJourneySection = dynamic(() => import("@/components/ferramentas/ToolJourneySection"));
const HowItWorksSection = dynamic(() => import("@/components/ferramentas/HowItWorksSection"));
const PricingSection = dynamic(() => import("@/components/ferramentas/PricingSection"));
const ReviewsSection = dynamic(() => import("@/components/ferramentas/ReviewsSection"), {
  ssr: false,
});
const ToolRecommender = dynamic(() => import("@/components/ferramentas/ToolRecommender"));
const ToolComparisonTable = dynamic(() => import("@/components/ferramentas/ToolComparisonTable"));

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-[var(--gold)]/80 text-black flex items-center justify-center shadow-lg hover:bg-[var(--gold)] transition-all opacity-0 animate-[fadeSlideIn_0.3s_ease-out_forwards]"
    >
      <ChevronUp size={18} />
    </button>
  );
}

function SectionSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div className={`${height} mx-6 mb-16`}>
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-5 w-32 bg-[var(--background-card)] rounded mx-auto mb-4" />
        <div className="h-8 w-64 bg-[var(--background-card)] rounded mx-auto mb-3" />
        <div className="h-4 w-48 bg-[var(--background-card)] rounded mx-auto mb-8" />
        <div className="h-40 bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-2xl" />
      </div>
    </div>
  );
}

export default function FerramentasPage() {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);
  const tools = getTools(tr);

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <CheckoutFeedback />
      <ProBannerSection />

      {/* ===== HERO SECTION ===== */}
      <ToolsHero />

      {/* ===== TOOL CARDS SECTION ===== */}
      <ToolsGrid tools={tools} sectionLabel={t.ferramentas.available} />

      {/* ===== TOOL RECOMMENDER ===== */}
      <Suspense fallback={null}>
        <ToolRecommender />
      </Suspense>

      {/* ===== TOOL COMPARISON TABLE ===== */}
      <Suspense fallback={null}>
        <ToolComparisonTable />
      </Suspense>

      {/* ===== STATS COUNTERS ===== */}
      <Suspense fallback={null}>
        <StatsSection />
      </Suspense>

      {/* ===== TOOL JOURNEY (TOOL CHAIN DIAGRAM) ===== */}
      <Suspense fallback={<SectionSkeleton />}>
        <ToolJourneySection />
      </Suspense>

      {/* ===== KEY BENEFITS STRIP ===== */}
      <section id="beneficios" className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                label: t.ferramentas.data_secure,
                text: t.ferramentas.data_secure_desc,
              },
              {
                icon: Zap,
                label: t.ferramentas.instant_results,
                text: t.ferramentas.instant_results_desc,
              },
              {
                icon: Download,
                label: t.ferramentas.export_pdf,
                text: t.ferramentas.export_pdf_desc,
              },
              {
                icon: Crown,
                label: t.ferramentas.for_lusitanos,
                text: t.ferramentas.for_lusitanos_desc,
              },
            ].map((benefit, i) => (
              <AnimateOnScroll key={benefit.label} delay={i * 80}>
                <div className="flex items-center gap-4 p-4 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl hover:border-[var(--gold)]/20 transition-colors">
                  <div className="w-10 h-10 bg-[var(--gold)]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon size={20} className="text-[var(--gold)]" />
                  </div>
                  <div>
                    <p className="text-[var(--foreground)] text-sm font-medium">{benefit.label}</p>
                    <p className="text-[var(--foreground-muted)] text-xs">{benefit.text}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMO FUNCIONA SECTION ===== */}
      <Suspense fallback={<SectionSkeleton />}>
        <HowItWorksSection />
      </Suspense>

      {/* ===== PRICING + PRO FEATURES ===== */}
      <Suspense fallback={<SectionSkeleton height="h-96" />}>
        <PricingSection />
      </Suspense>

      {/* ===== FAQ SECTION ===== */}
      <FAQSection items={getFaqItems(language)} />

      {/* ===== REVIEWS SECTION ===== */}
      <Suspense fallback={<SectionSkeleton />}>
        <ReviewsSection />
      </Suspense>

      <ScrollToTop />
    </main>
  );
}

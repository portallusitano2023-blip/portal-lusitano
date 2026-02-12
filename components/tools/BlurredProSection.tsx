"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Crown, KeyRound, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/context/LanguageContext";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import MagneticButton from "@/components/ui/MagneticButton";

interface BlurredProSectionProps {
  isSubscribed: boolean;
  children: React.ReactNode;
  title?: string;
}

type Phase = "REVEAL" | "TRANSITIONING" | "INTERACTIVE";

export default function BlurredProSection({
  isSubscribed,
  children,
  title,
}: BlurredProSectionProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const storageKey = `pro-reveal-${title ?? "default"}`;

  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem(storageKey)) return "INTERACTIVE";
      } catch {
        /* SSR or storage error */
      }
    }
    return "REVEAL";
  });

  const [spotlightActive, setSpotlightActive] = useState(false);

  // Skip to INTERACTIVE immediately for reduced motion
  useEffect(() => {
    if (reducedMotion && phase === "REVEAL") {
       
      queueMicrotask(() => setPhase("INTERACTIVE"));
    }
  }, [reducedMotion, phase]);

  // ── Cinematic Reveal: IntersectionObserver ──
  useEffect(() => {
    if (isSubscribed || phase !== "REVEAL" || reducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setPhase("TRANSITIONING");
            setTimeout(() => {
              setPhase("INTERACTIVE");
              try {
                sessionStorage.setItem(storageKey, "1");
              } catch {
                /* */
              }
            }, 800);
          }, 3000);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [phase, storageKey, reducedMotion, isSubscribed]);

  // ── Spotlight: mouse/touch tracking via rAF ──
  const updateSpotlight = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      const overlay = overlayRef.current;
      const glow = glowRef.current;
      if (!container || !overlay || !glow) return;

      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const radius = isMobile ? 70 : 100;

      overlay.style.maskImage = `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent 50%, rgba(0,0,0,0.3) 70%, black 100%)`;
      overlay.style.webkitMaskImage = overlay.style.maskImage;

      glow.style.opacity = "1";
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
    },
    [isMobile]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (phase !== "INTERACTIVE") return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateSpotlight(e.clientX, e.clientY);
      });
      if (!spotlightActive) setSpotlightActive(true);
    },
    [phase, updateSpotlight, spotlightActive]
  );

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setSpotlightActive(false);
    const overlay = overlayRef.current;
    const glow = glowRef.current;
    if (overlay) {
      overlay.style.maskImage = "none";
      overlay.style.webkitMaskImage = "none";
    }
    if (glow) {
      glow.style.opacity = "0";
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (phase !== "INTERACTIVE") return;
      const touch = e.touches[0];
      if (!touch) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateSpotlight(touch.clientX, touch.clientY);
      });
      if (!spotlightActive) setSpotlightActive(true);
    },
    [phase, updateSpotlight, spotlightActive]
  );

  const handleTouchEnd = useCallback(() => {
    handleMouseLeave();
  }, [handleMouseLeave]);

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

  // Subscribed: render children directly with no overhead
  if (isSubscribed) {
    return <>{children}</>;
  }

  const isRevealing = phase === "REVEAL";
  const isTransitioning = phase === "TRANSITIONING";
  const isInteractive = phase === "INTERACTIVE";

  const blurValue = isRevealing ? "blur(0px)" : "blur(6px)";
  const ctaVisible = isInteractive;

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden pro-border-active"
      role="region"
      aria-label={title ? `${title} — PRO` : "PRO content"}
      style={{ boxShadow: "0 0 30px rgba(197,160,89,0.08)" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Layer 0: Content — rendered once, backdrop-filter on overlay handles blur */}
      <div className="pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Layer 1: Blur overlay (backdrop-filter + mask-image for spotlight) */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        style={{
          backdropFilter: blurValue,
          WebkitBackdropFilter: blurValue,
          background: isRevealing ? "transparent" : "rgba(5,5,5,0.4)",
          opacity: isRevealing ? 0 : 1,
          transition: reducedMotion
            ? "none"
            : isTransitioning
              ? "backdrop-filter 0.8s cubic-bezier(0.25,0.46,0.45,0.94), background 0.6s ease, opacity 0.6s ease"
              : "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* Layer 2: Floating particles (decorative, CSS-only) */}
      {!reducedMotion && isInteractive && (
        <div
          className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute rounded-full float-gentle"
            style={{
              width: 5,
              height: 5,
              background: "rgba(197,160,89,0.3)",
              top: "20%",
              left: "15%",
              animationDelay: "0s",
            }}
          />
          <div
            className="absolute rounded-full float-gentle"
            style={{
              width: 4,
              height: 4,
              background: "rgba(197,160,89,0.25)",
              top: "60%",
              right: "20%",
              animationDelay: "2s",
            }}
          />
          <div
            className="absolute rounded-full float-gentle"
            style={{
              width: 6,
              height: 6,
              background: "rgba(197,160,89,0.2)",
              bottom: "25%",
              left: "60%",
              animationDelay: "4s",
            }}
          />
        </div>
      )}

      {/* Layer 3: Gold cursor glow */}
      <div
        ref={glowRef}
        className="absolute z-10 pointer-events-none"
        aria-hidden="true"
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(197,160,89,0.12) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Layer 4: CTA overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center z-20"
        style={{
          opacity: ctaVisible ? 1 : 0,
          pointerEvents: ctaVisible ? "auto" : "none",
          transition: reducedMotion ? "none" : "opacity 0.4s ease",
        }}
      >
        <div
          className="text-center max-w-xs px-4"
          style={{
            transform: ctaVisible && !reducedMotion ? "translateY(0)" : "translateY(20px)",
            transition: reducedMotion
              ? "none"
              : "transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease",
          }}
        >
          {/* Animated key icon */}
          <div className="w-12 h-12 bg-[#C5A059]/15 rounded-full flex items-center justify-center mx-auto mb-3">
            <KeyRound
              className="text-[#C5A059]"
              size={20}
              style={!reducedMotion ? { animation: "keyFloat 3s ease-in-out infinite" } : undefined}
            />
          </div>

          {/* Title with gold gradient */}
          {title && <h4 className="text-sm font-serif text-gradient-gold mb-1">{title}</h4>}

          {/* Benefit text + peek hint */}
          <p className="text-xs text-[var(--foreground-muted)] mb-1">
            {t.pro_upgrade_card.benefit_unlimited}
          </p>
          {!reducedMotion && (
            <p className="text-[10px] text-[var(--foreground-muted)]/60 mb-4 italic">
              {isMobile
                ? (t.pro_upgrade_card.peek_hint_mobile ?? "Toque e arraste para pre-visualizar")
                : (t.pro_upgrade_card.peek_hint ?? "Mova o cursor para pre-visualizar")}
            </p>
          )}
          {reducedMotion && <div className="mb-4" />}

          {/* Subscribe button: MagneticButton + shimmer */}
          <MagneticButton strength={0.2}>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="shimmer-gold inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#C5A059] to-[#B8956F] text-black text-xs font-semibold rounded-lg hover:from-[#D4AF6A] hover:to-[#C5A059] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Crown size={14} />}
              {t.pro_upgrade_card.subscribe}
            </button>
          </MagneticButton>

          {/* Subtle "See plans" link */}
          <button
            onClick={() => router.push("/ferramentas#precos")}
            className="block mx-auto mt-2 text-[10px] text-[var(--foreground-muted)]/50 hover:text-[#C5A059] transition-colors cursor-pointer"
          >
            {t.pro_upgrade_card.see_plans}
          </button>
        </div>
      </div>

      {/* Shimmer sweep overlay (decorative) */}
      {!reducedMotion && isInteractive && (
        <div
          className="absolute inset-0 z-[9] pointer-events-none"
          aria-hidden="true"
          style={{ animation: "proShimmerSweep 8s ease-in-out infinite" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(197,160,89,0.04) 50%, transparent 60%)",
            }}
          />
        </div>
      )}
    </div>
  );
}

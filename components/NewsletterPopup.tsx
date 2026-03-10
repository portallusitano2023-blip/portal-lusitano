"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X, ArrowRight, Loader2, CheckCircle, Crown } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const PARTICLES = [
  { top: "15%", left: "8%",  delay: "0s",    dur: "4.2s", size: 2 },
  { top: "72%", left: "12%", delay: "1.1s",  dur: "5.8s", size: 1.5 },
  { top: "38%", left: "5%",  delay: "2.4s",  dur: "3.9s", size: 1 },
  { top: "55%", left: "18%", delay: "0.7s",  dur: "6.1s", size: 2.5 },
  { top: "88%", left: "9%",  delay: "3.2s",  dur: "4.7s", size: 1 },
  { top: "28%", left: "22%", delay: "1.8s",  dur: "5.3s", size: 1.5 },
];

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguage();

  const text = {
    pt: {
      eyebrow: "Portal Lusitano",
      title_1: "Junte-se à",
      title_2: "Elite Lusitana",
      subtitle: "Novidades exclusivas, artigos de fundo e ofertas especiais — directamente para si.",
      placeholder: "O seu endereço de email",
      button: "Subscrever",
      success_title: "Bem-vindo à Elite",
      success_sub: "Irá receber em breve o primeiro email.",
      error: "Ocorreu um erro. Tente novamente.",
      privacy: "Sem spam. Cancele em qualquer momento.",
      stat_1: "5.000+",
      stat_1_label: "Subscritores",
      stat_2: "500",
      stat_2_label: "Anos de história",
    },
    en: {
      eyebrow: "Portal Lusitano",
      title_1: "Join the",
      title_2: "Lusitano Elite",
      subtitle: "Exclusive news, in-depth articles and special offers — delivered straight to you.",
      placeholder: "Your email address",
      button: "Subscribe",
      success_title: "Welcome to the Elite",
      success_sub: "You will receive your first email shortly.",
      error: "An error occurred. Please try again.",
      privacy: "No spam. Unsubscribe at any time.",
      stat_1: "5,000+",
      stat_1_label: "Subscribers",
      stat_2: "500",
      stat_2_label: "Years of history",
    },
    es: {
      eyebrow: "Portal Lusitano",
      title_1: "Únase a la",
      title_2: "Elite Lusitana",
      subtitle: "Novedades exclusivas, artículos de fondo y ofertas especiales — directamente para usted.",
      placeholder: "Su dirección de email",
      button: "Suscribirse",
      success_title: "Bienvenido a la Elite",
      success_sub: "Recibirá en breve el primer email.",
      error: "Ha ocurrido un error. Inténtelo de nuevo.",
      privacy: "Sin spam. Cancele en cualquier momento.",
      stat_1: "5.000+",
      stat_1_label: "Suscriptores",
      stat_2: "500",
      stat_2_label: "Años de historia",
    },
  };

  const t = text[language];

  useEffect(() => {
    const seen = localStorage.getItem("newsletter-popup-seen");
    if (!seen) {
      const timer = setTimeout(() => {
        setIsMounted(true);
        setTimeout(() => setIsVisible(true), 30);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem("newsletter-popup-seen", "true");
    setTimeout(() => setIsMounted(false), 600);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isVisible, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setIsSuccess(true);
        localStorage.setItem("newsletter-popup-seen", "true");
        setTimeout(() => handleClose(), 4000);
      } else {
        setError(t.error);
      }
    } catch {
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <>
      {/* ── BACKDROP ──────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[9997]"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, rgba(197,160,89,0.08) 0%, rgba(0,0,0,0.88) 60%)",
          backdropFilter: "blur(8px)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: isVisible ? "auto" : "none",
        }}
        onClick={handleClose}
      />

      {/* ── MODAL ─────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-[9998] flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={language === "en" ? "Newsletter subscription" : language === "es" ? "Suscripción al boletín" : "Subscrição da newsletter"}
          className="relative w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[720px] pointer-events-auto overflow-hidden"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
            transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
            boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(197,160,89,0.15), inset 0 1px 0 rgba(197,160,89,0.1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-1 sm:grid-cols-[45%_55%] min-h-[420px] sm:min-h-[480px]">

            {/* ── LEFT PANEL — Atmospheric ──────────────────────── */}
            <div className="relative hidden sm:flex flex-col justify-between p-6 sm:p-8 overflow-hidden min-h-[420px] sm:min-h-[480px]">
              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src="/images/home/hero.png"
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="320px"
                  loading="lazy"
                />
                {/* Dark cinematic overlay */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 50%, rgba(197,160,89,0.15) 100%)" }} />
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }} />
              </div>

              {/* Floating gold particles */}
              {PARTICLES.map((p, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-[var(--gold)] pointer-events-none"
                  style={{
                    top: p.top,
                    left: p.left,
                    width: p.size * 3,
                    height: p.size * 3,
                    opacity: 0.45,
                    animation: `pulseGlow ${p.dur} ease-in-out ${p.delay} infinite`,
                  }}
                />
              ))}

              {/* Corner ornament */}
              <div className="absolute top-5 left-5 w-7 h-7 border-t border-l border-[var(--gold)]/40 z-10" />
              <div className="absolute bottom-5 right-5 w-7 h-7 border-b border-r border-[var(--gold)]/40 z-10" />

              {/* Top content */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Crown size={11} className="text-[var(--gold)]" />
                  <span className="text-[9px] uppercase tracking-[0.4em] text-[var(--gold)] font-semibold">
                    {t.eyebrow}
                  </span>
                </div>
              </div>

              {/* Bottom content */}
              <div className="relative z-10">
                {/* Divider */}
                <div className="w-8 h-[1px] bg-gradient-to-r from-[var(--gold)] to-transparent mb-5" />

                {/* Stats */}
                <div className="flex gap-6">
                  <div>
                    <p className="text-xl font-serif text-[var(--gold)] leading-none mb-0.5">{t.stat_1}</p>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-white/50">{t.stat_1_label}</p>
                  </div>
                  <div className="w-[1px] bg-white/10 self-stretch" />
                  <div>
                    <p className="text-xl font-serif text-[var(--gold)] leading-none mb-0.5">{t.stat_2}</p>
                    <p className="text-[9px] uppercase tracking-[0.25em] text-white/50">{t.stat_2_label}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL — Form ────────────────────────────── */}
            <div
              className="relative flex flex-col justify-center p-5 sm:p-7 md:p-10"
              style={{ background: "var(--background)", borderLeft: "1px solid rgba(197,160,89,0.12)" }}
            >
              {/* Top gold line */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: "linear-gradient(90deg, transparent, rgba(197,160,89,0.5), transparent)" }}
              />

              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors group"
                aria-label="Fechar"
              >
                <X size={16} strokeWidth={1.5} />
              </button>

              {!isSuccess ? (
                <>
                  {/* Mobile eyebrow */}
                  <div className="flex items-center gap-2 mb-5 sm:hidden">
                    <Crown size={10} className="text-[var(--gold)]" />
                    <span className="text-[9px] uppercase tracking-[0.4em] text-[var(--gold)]">
                      {t.eyebrow}
                    </span>
                  </div>

                  {/* Heading */}
                  <div className="mb-6">
                    <p
                      className="text-[10px] uppercase tracking-[0.35em] text-[var(--foreground-muted)] mb-3"
                      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.4s ease 0.15s" }}
                    >
                      {t.title_1}
                    </p>
                    <h2
                      className="text-3xl sm:text-4xl font-serif text-[var(--foreground)] leading-tight"
                      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s", transform: isVisible ? "none" : "translateY(8px)" }}
                    >
                      {t.title_2}
                    </h2>
                    {/* Gold underline */}
                    <div
                      className="mt-3 h-[1px]"
                      style={{
                        background: "linear-gradient(90deg, var(--gold), transparent)",
                        width: isVisible ? "60px" : "0px",
                        transition: "width 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s",
                      }}
                    />
                  </div>

                  <p
                    className="text-[var(--foreground-secondary)] text-sm leading-relaxed mb-8"
                    style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.4s ease 0.3s" }}
                  >
                    {t.subtitle}
                  </p>

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                    style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.4s ease 0.35s" }}
                  >
                    {/* Email input */}
                    <div className="relative">
                      <input
                        ref={inputRef}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
                        placeholder={t.placeholder}
                        required
                        aria-label={language === "pt" ? "Endereço de email" : "Email address"}
                        className="w-full bg-transparent text-[var(--foreground)] placeholder-[var(--foreground-muted)] text-sm py-3.5 pr-4 outline-none"
                        style={{ paddingLeft: 0, borderBottom: "1px solid" }}
                      />
                      {/* Animated bottom border */}
                      <div
                        className="absolute bottom-0 left-0 h-[1px] bg-[var(--gold)] pointer-events-none"
                        style={{
                          width: inputFocused ? "100%" : "0%",
                          transition: "width 0.35s cubic-bezier(0.22,1,0.36,1)",
                        }}
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-xs" role="alert">{error}</p>
                    )}

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full group relative overflow-hidden bg-[var(--gold)] text-black py-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 hover:bg-white disabled:opacity-50 flex items-center justify-center gap-2.5 mt-2"
                    >
                      {/* Shimmer */}
                      <span
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
                          transform: "translateX(-100%)",
                          animation: "shimmerPass 2.5s ease-in-out 1.5s infinite",
                        }}
                      />
                      {isLoading
                        ? <Loader2 className="animate-spin" size={16} />
                        : <>
                            <span>{t.button}</span>
                            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                          </>
                      }
                    </button>
                  </form>

                  <p
                    className="text-[10px] text-[var(--foreground-muted)] text-center mt-6 tracking-wide"
                    style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.4s ease 0.45s" }}
                  >
                    {t.privacy}
                  </p>
                </>
              ) : (
                /* ── SUCCESS STATE ────────────────────────────────────── */
                <div className="text-center py-6">
                  <div
                    className="mx-auto mb-6 w-16 h-16 rounded-full border border-[var(--gold)]/30 flex items-center justify-center"
                    style={{ animation: "scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
                  >
                    <CheckCircle size={28} className="text-[var(--gold)]" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-serif text-[var(--foreground)] mb-2">{t.success_title}</h3>
                  <p className="text-sm text-[var(--foreground-muted)]">{t.success_sub}</p>
                  <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent mx-auto mt-6" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── KEYFRAME STYLES ──────────────────────────────────── */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.2; transform: scale(1) translateY(0); }
          50%       { opacity: 0.7; transform: scale(1.6) translateY(-6px); }
        }
        @keyframes shimmerPass {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </>
  );
}

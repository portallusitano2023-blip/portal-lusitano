import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Autenticação",
  description:
    "Aceda à sua conta no Portal Lusitano — o maior portal de cavalos Lusitanos em Portugal.",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col lg:flex-row">
      {/* ── Left branding panel (desktop only) ────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-[40%] flex-col justify-between p-10 xl:p-14 relative overflow-hidden"
        aria-hidden="true"
      >
        {/* Layered background: deep card + subtle radial gold glow */}
        <div className="absolute inset-0 bg-[var(--background-card)]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 30% 50%, #C5A059 0%, transparent 70%)",
          }}
        />
        {/* Decorative diagonal lines */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #C5A059 0px, #C5A059 1px, transparent 1px, transparent 40px)",
          }}
        />

        {/* Logo */}
        <Link href="/" className="relative z-10 inline-flex flex-col gap-1 group w-fit">
          <span className="text-2xl font-serif text-[var(--foreground)] tracking-widest group-hover:text-[var(--gold)] transition-colors duration-300">
            PORTAL LUSITANO
          </span>
          <span className="text-[9px] uppercase tracking-[0.35em] text-[var(--foreground-muted)]">
            EST. 2023
          </span>
        </Link>

        {/* Central visual: horse icon + tagline */}
        <div className="relative z-10 flex-1 flex flex-col items-start justify-center gap-6 py-12">
          {/* Decorative horse silhouette mark */}
          <div className="w-16 h-16 rounded-2xl bg-[var(--gold)]/10 border border-[var(--gold)]/20 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="none"
              stroke="var(--gold)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* Stylised horse head path */}
              <path d="M4 17c0 0 1-5 4-7s6-2 8-4c1-0.8 1.5-2 1-3" />
              <path d="M4 17c1 1 3 2 5 1.5" />
              <path d="M8 18.5V21" />
              <path d="M11 19v2" />
              <path d="M15 6c0.5 1 0.3 2.5-1 3.5" />
              <circle cx="16" cy="4" r="1" fill="var(--gold)" stroke="none" />
            </svg>
          </div>

          <div>
            <h2 className="text-3xl xl:text-4xl font-serif text-[var(--foreground)] leading-snug mb-3">
              A referência do
              <br />
              <span className="text-[var(--gold)]">cavalo Lusitano</span>
              <br />
              em Portugal
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed max-w-xs">
              Ferramentas exclusivas, análise de perfil e o maior mercado de cavalos Lusitanos
              online.
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col gap-2.5 mt-2">
            {[
              "Calculadora de valor de mercado",
              "Verificador de compatibilidade",
              "Análise de perfil personalizada",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <div className="w-1 h-1 rounded-full bg-[var(--gold)]" />
                <span className="text-xs text-[var(--foreground-secondary)]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <blockquote className="relative z-10 border-l-2 border-[var(--gold)]/40 pl-4">
          <p className="text-xs text-[var(--foreground-muted)] italic leading-relaxed">
            &ldquo;A equitação é a arte de esconder a arte.&rdquo;
          </p>
          <footer className="text-[10px] text-[var(--foreground-muted)]/60 mt-1 tracking-wider uppercase">
            Mestre Nuno Oliveira
          </footer>
        </blockquote>
      </div>

      {/* ── Right form panel ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16 min-h-screen lg:min-h-0">
        {/* Mobile-only logo */}
        <Link href="/" className="flex flex-col items-center mb-8 lg:hidden group" tabIndex={0}>
          <span className="text-xl font-serif text-[var(--foreground)] tracking-wide group-hover:text-[var(--gold)] transition-colors">
            PORTAL LUSITANO
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[var(--foreground-muted)] mt-1">
            EST. 2023
          </span>
        </Link>

        {/* Form card */}
        <div className="w-full max-w-md bg-[var(--background-secondary)]/80 border border-[var(--border)] rounded-2xl p-8 shadow-2xl shadow-black/40">
          {children}
        </div>

        <Link
          href="/"
          className="mt-6 text-sm text-[var(--foreground-muted)] hover:text-[var(--gold)] transition-colors"
        >
          Voltar ao Portal
        </Link>
      </div>
    </div>
  );
}

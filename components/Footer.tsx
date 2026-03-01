"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { Instagram, Music2, Mail, MapPin, ArrowUpRight, Gift } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { CONTACT_EMAIL } from "@/lib/constants";

// memo: Footer has no local state and only re-renders when the language/translations
// object changes. Wrapping it prevents spurious re-renders from context siblings.
export default memo(function Footer() {
  const { t } = useLanguage();

  // Memoized so array references stay stable between renders when translations
  // haven't changed, which avoids re-rendering the mapped list items.
  const navItems = useMemo(
    () => [
      { name: t.nav.home, href: "/" },
      { name: t.nav.shop, href: "/loja" },
      { name: t.nav.journal, href: "/jornal" },
      { name: t.footer.about, href: "/sobre" },
    ],
    [t.nav.home, t.nav.shop, t.nav.journal, t.footer.about]
  );

  const lusitanoItems = useMemo(
    () => [
      { name: t.footer.buy_horse, href: "/comprar" },
      { name: t.footer.studs, href: "/directorio" },
      { name: t.footer.events, href: "/eventos" },
      { name: t.footer.lineages, href: "/linhagens" },
      { name: t.footer.notable, href: "/cavalos-famosos" },
    ],
    [t.footer.buy_horse, t.footer.studs, t.footer.events, t.footer.lineages, t.footer.notable]
  );

  const toolItems = useMemo(
    () => [
      { name: t.footer.calculator, href: "/calculadora-valor" },
      { name: t.footer.comparator, href: "/comparador-cavalos" },
      { name: t.footer.compatibility, href: "/verificador-compatibilidade" },
      { name: t.footer.profile_analysis, href: "/analise-perfil" },
    ],
    [t.footer.calculator, t.footer.comparator, t.footer.compatibility, t.footer.profile_analysis]
  );

  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border)] pt-24 sm:pt-32 pb-12 px-4 sm:px-6 mt-20 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[var(--gold)] opacity-[0.03] blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-16 mb-20">
          {/* IDENTIDADE */}
          <div className="col-span-2 md:col-span-4 space-y-6">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-3xl sm:text-4xl text-[var(--foreground)] tracking-tighter group-hover:text-[var(--gold)] transition-all duration-500">
                PORTAL <span className="italic font-light">LUSITANO</span>
              </span>
              <span className="text-[10px] sm:text-[9px] text-[var(--foreground-secondary)] uppercase tracking-[0.5em] block mt-2 font-bold group-hover:text-[var(--foreground-secondary)] transition-colors">
                O Legado Nobre · Est. 2023
              </span>
            </Link>
            <p className="text-[var(--foreground-muted)] text-sm font-light leading-relaxed max-w-sm">
              {t.home.manifesto}
            </p>

            {/* Redes sociais */}
            <div className="flex gap-4 pt-2">
              {[
                {
                  href: "https://instagram.com/portal_lusitano",
                  label: "Instagram",
                  icon: Instagram,
                },
                { href: "https://tiktok.com/@portal_lusitano", label: "TikTok", icon: Music2 },
                { href: `mailto:${CONTACT_EMAIL}`, label: "Email", icon: Mail },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={social.label}
                  className="w-11 h-11 border border-[var(--border)] flex items-center justify-center text-[var(--foreground-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)]/30 transition-all duration-300"
                >
                  <social.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* NAVEGAÇÃO */}
          <nav aria-label="Links principais" className="md:col-span-2 space-y-5">
            <h2 className="text-[var(--foreground)] text-[10px] uppercase tracking-[0.3em] font-bold">
              {t.footer.navigation}
            </h2>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] text-sm font-light transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* LUSITANO */}
          <nav aria-label="Links Lusitano" className="md:col-span-3 space-y-5">
            <h2 className="text-[var(--foreground)] text-[10px] uppercase tracking-[0.3em] font-bold">
              {t.footer.lusitano}
            </h2>
            <ul className="space-y-3">
              {lusitanoItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] text-sm font-light transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* FERRAMENTAS + CONTACTO */}
          <div className="md:col-span-3 space-y-8">
            <div className="space-y-5">
              <h2 className="text-[var(--foreground)] text-[10px] uppercase tracking-[0.3em] font-bold">
                {t.footer.tools}
              </h2>
              <ul className="space-y-3">
                {toolItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] text-sm font-light transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[var(--border)] space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="text-[var(--gold)]" size={14} />
                <span className="text-[var(--foreground-muted)] text-xs">{CONTACT_EMAIL}</span>
              </div>
              <Link
                href="/ebook-gratis"
                className="inline-flex items-center gap-2 text-[var(--gold)] text-[10px] uppercase tracking-widest font-bold hover:text-[var(--foreground)] transition-colors"
              >
                <Gift size={12} />
                {t.footer.ebook}
                <ArrowUpRight size={10} />
              </Link>
            </div>
          </div>
        </div>

        {/* LEGAL — Obrigatório por DL 199/2015 e Regulamento UE 524/2013 */}
        <div className="pt-8 border-t border-[var(--border)] mb-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--foreground-muted)]">
            <a
              href="https://www.livroreclamacoes.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--foreground-secondary)] transition-colors flex items-center gap-1.5"
            >
              {t.footer.complaints_book}
              <ArrowUpRight size={10} />
            </a>
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--foreground-secondary)] transition-colors flex items-center gap-1.5"
            >
              {t.footer.dispute_resolution}
              <ArrowUpRight size={10} />
            </a>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[var(--foreground-muted)] text-xs sm:text-[9px] uppercase tracking-[0.2em]">
            © 2026 Portal Lusitano. {t.footer.rights}.
          </p>
          <div className="flex gap-8">
            <Link
              href="/privacidade"
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] text-xs sm:text-[9px] uppercase tracking-[0.2em] transition-colors"
            >
              {t.footer.privacy}
            </Link>
            <Link
              href="/termos"
              className="text-[var(--foreground-muted)] hover:text-[var(--foreground-secondary)] text-xs sm:text-[9px] uppercase tracking-[0.2em] transition-colors"
            >
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

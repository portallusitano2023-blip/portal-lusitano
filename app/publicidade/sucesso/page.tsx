"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Mail, Megaphone, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

function PublicidadeSucessoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(5);
  const { t } = useLanguage();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20 sm:pt-24 md:pt-32 pb-32 px-4 sm:px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t.success_pages.payment_confirmed}
          </h1>
          <p className="text-[var(--foreground-secondary)] text-lg">
            {t.success_pages.campaign_activated_success}
          </p>
        </div>

        {/* Info Cards */}
        <div className="space-y-4 mb-8">
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{t.success_pages.confirmation_email}</h3>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  {t.success_pages.confirmation_email_campaign_desc}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{t.success_pages.next_steps}</h3>
                <p className="text-sm text-[var(--foreground-secondary)] mb-3">
                  {t.success_pages.next_steps_desc}
                </p>
                <ul className="text-sm text-[var(--foreground-secondary)] space-y-1 ml-4">
                  <li>• {t.success_pages.next_steps_receive_materials}</li>
                  <li>• {t.success_pages.next_steps_define_urls}</li>
                  <li>• {t.success_pages.next_steps_activate_campaign}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{t.success_pages.monthly_reports}</h3>
                <p className="text-sm text-[var(--foreground-secondary)]">
                  {t.success_pages.monthly_reports_desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Session ID (debug - pode ser removido em produção) */}
        {sessionId && (
          <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-lg p-4 mb-8">
            <p className="text-xs text-[var(--foreground-muted)] mb-1">
              {t.success_pages.transaction_id}:
            </p>
            <p className="text-xs text-[var(--foreground-secondary)] font-mono break-all">
              {sessionId}
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="space-y-4">
          <Link
            href="/publicidade"
            className="flex items-center justify-center gap-2 w-full bg-[var(--gold)] hover:bg-[#B39049] text-black font-bold py-4 rounded-xl transition-all"
          >
            <span>{t.success_pages.view_advertising_options}</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-[var(--background-secondary)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] font-bold py-4 rounded-xl transition-all border border-[var(--border)]"
          >
            <span>{t.success_pages.back_home}</span>
          </Link>
        </div>

        {/* Auto redirect info */}
        {countdown > 0 && (
          <p className="text-center text-sm text-[var(--foreground-muted)] mt-6">
            {t.success_pages.redirecting_home} {countdown}{" "}
            {countdown !== 1 ? t.success_pages.seconds_plural : t.success_pages.seconds}...
          </p>
        )}

        {countdown === 0 && (
          <script dangerouslySetInnerHTML={{ __html: `window.location.href = '/';` }} />
        )}
      </div>
    </main>
  );
}

export default function PublicidadeSucessoPage() {
  return (
    <Suspense>
      <PublicidadeSucessoContent />
    </Suspense>
  );
}

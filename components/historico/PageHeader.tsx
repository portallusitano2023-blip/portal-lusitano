"use client";

import Link from "next/link";
import { Crown, ArrowLeft, Lock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

// ---------------------------------------------------------------------------
// Page Header
// ---------------------------------------------------------------------------

export function PageHeader() {
  const { language } = useLanguage();
  const tr = createTranslator(language);

  return (
    <header>
      <Link
        href="/ferramentas"
        className="inline-flex items-center gap-2 text-sm text-white/40
                   hover:text-[#C5A059] transition-colors mb-8
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]/50 rounded"
        aria-label={tr("Voltar para Ferramentas", "Back to Tools", "Volver a Herramientas")}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {tr("Ferramentas", "Tools", "Herramientas")}
      </Link>

      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C5A059]/10"
        >
          <Crown className="h-5 w-5 text-[#C5A059]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">
            {tr("O Meu Histórico PRO", "My PRO History", "Mi Historial PRO")}
          </h1>
          <p className="mt-0.5 text-sm text-white/40">
            {tr(
              "Todas as suas análises e cálculos guardados",
              "All your saved analyses and calculations",
              "Todos sus análisis y cálculos guardados"
            )}
          </p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="mt-6 h-px bg-gradient-to-r from-[#C5A059]/30 via-[#C5A059]/10 to-transparent"
      />
    </header>
  );
}

// ---------------------------------------------------------------------------
// Not Subscribed / Not Authenticated Card
// ---------------------------------------------------------------------------

interface NotSubscribedCardProps {
  reason: "auth" | "not-subscribed";
}

export function NotSubscribedCard({ reason }: NotSubscribedCardProps) {
  const { language } = useLanguage();
  const tr = createTranslator(language);
  const isAuthWall = reason === "auth";

  const benefits = [
    tr(
      "Histórico completo de todas as análises",
      "Complete history of all analyses",
      "Historial completo de todos los análisis"
    ),
    tr(
      "Acesso ilimitado às 4 ferramentas",
      "Unlimited access to all 4 tools",
      "Acceso ilimitado a las 4 herramientas"
    ),
    tr("Relatórios em PDF exportáveis", "Exportable PDF reports", "Informes PDF exportables"),
    tr(
      "Resultados guardados automaticamente",
      "Results saved automatically",
      "Resultados guardados automáticamente"
    ),
  ];

  return (
    <div className="mt-10 rounded-2xl border border-[#C5A059]/20 bg-[#111111] p-8 text-center">
      <div
        aria-hidden="true"
        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#C5A059]/10"
      >
        {isAuthWall ? (
          <Lock className="h-8 w-8 text-[#C5A059]" />
        ) : (
          <Crown className="h-8 w-8 text-[#C5A059]" />
        )}
      </div>

      <h2 className="text-xl font-bold text-white">
        {isAuthWall
          ? tr(
              "Inicie sessão para aceder ao histórico",
              "Sign in to access history",
              "Inicie sesión para acceder al historial"
            )
          : tr("Funcionalidade PRO", "PRO Feature", "Funcionalidad PRO")}
      </h2>

      <p className="mt-3 text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
        {isAuthWall
          ? tr(
              "O histórico de análises está disponível para utilizadores com subscrição PRO activa. Inicie sessão para continuar.",
              "Analysis history is available for users with an active PRO subscription. Sign in to continue.",
              "El historial de análisis está disponible para usuarios con suscripción PRO activa. Inicie sesión para continuar."
            )
          : tr(
              "O histórico de análises e cálculos guardados está disponível exclusivamente para subscritores PRO. Desbloqueie acesso ilimitado a todas as ferramentas.",
              "Analysis history and saved calculations are exclusively available to PRO subscribers. Unlock unlimited access to all tools.",
              "El historial de análisis y cálculos guardados está disponible exclusivamente para suscriptores PRO. Desbloquee acceso ilimitado a todas las herramientas."
            )}
      </p>

      {!isAuthWall && (
        <ul
          aria-label={tr("Benefícios PRO", "PRO Benefits", "Beneficios PRO")}
          className="mt-6 mb-8 space-y-2 text-left inline-block"
        >
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2.5 text-sm text-white/60">
              <span
                aria-hidden="true"
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#C5A059]/15"
              >
                <Crown className="h-2.5 w-2.5 text-[#C5A059]" />
              </span>
              {benefit}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2 flex flex-col sm:flex-row gap-3 justify-center">
        {isAuthWall ? (
          <Link
            href="/ferramentas"
            className="inline-flex items-center justify-center gap-2 rounded-xl
                       bg-gradient-to-r from-[#C5A059] to-[#D4B068]
                       px-6 py-3 text-sm font-bold text-black
                       hover:opacity-90 transition-opacity
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
          >
            <Crown className="h-4 w-4" aria-hidden="true" />
            {tr(
              "Iniciar sessão e subscrever PRO",
              "Sign in and subscribe PRO",
              "Iniciar sesión y suscribir PRO"
            )}
          </Link>
        ) : (
          <>
            <Link
              href="/ferramentas"
              className="inline-flex items-center justify-center gap-2 rounded-xl
                         bg-gradient-to-r from-[#C5A059] to-[#D4B068]
                         px-6 py-3 text-sm font-bold text-black
                         hover:opacity-90 transition-opacity
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059]"
            >
              <Crown className="h-4 w-4" aria-hidden="true" />
              {tr("Subscrever PRO", "Subscribe PRO", "Suscribir PRO")}
            </Link>
            <Link
              href="/ferramentas"
              className="inline-flex items-center justify-center gap-2 rounded-xl
                         border border-white/10 bg-white/5
                         px-6 py-3 text-sm font-medium text-white/60
                         hover:bg-white/10 hover:text-white/80 transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              {tr("Ver ferramentas gratuitas", "See free tools", "Ver herramientas gratuitas")}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

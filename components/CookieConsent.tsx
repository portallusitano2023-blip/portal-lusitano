"use client";

import { useState, useEffect, useCallback } from "react";
import { Cookie, ChevronDown, ChevronUp } from "lucide-react";
import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/context/LanguageContext";

interface CookiePreferences {
  essential: boolean; // Always true, cannot be toggled
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = "cookie-consent";
const COOKIE_PREFS_KEY = "cookie-preferences";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });
  const { language } = useLanguage();

  const text = {
    pt: {
      title: "Utilizamos Cookies",
      description:
        "Utilizamos cookies para garantir o funcionamento do site e melhorar a sua experiência. Pode personalizar as suas preferências ou aceitar todas as categorias.",
      policy: "Política de Privacidade",
      accept_all: "Aceitar Todos",
      accept_selected: "Guardar Preferências",
      decline: "Recusar Opcionais",
      customize: "Personalizar",
      hide_details: "Ocultar detalhes",
      essential: "Essenciais",
      essential_desc:
        "Necessários ao funcionamento do site (sessão, idioma, consentimento). Não podem ser desativados.",
      analytics: "Analíticos",
      analytics_desc:
        "Google Analytics — ajudam-nos a compreender como o site é utilizado, de forma anónima.",
      marketing: "Marketing",
      marketing_desc:
        "Google AdSense e Meta Pixel — exibem anúncios relevantes e medem a eficácia de campanhas.",
    },
    en: {
      title: "We Use Cookies",
      description:
        "We use cookies to ensure the website functions properly and to improve your experience. You can customize your preferences or accept all categories.",
      policy: "Privacy Policy",
      accept_all: "Accept All",
      accept_selected: "Save Preferences",
      decline: "Decline Optional",
      customize: "Customize",
      hide_details: "Hide details",
      essential: "Essential",
      essential_desc:
        "Necessary for the website to function (session, language, consent). Cannot be disabled.",
      analytics: "Analytics",
      analytics_desc: "Google Analytics — helps us understand how the site is used, anonymously.",
      marketing: "Marketing",
      marketing_desc:
        "Google AdSense and Meta Pixel — display relevant ads and measure campaign effectiveness.",
    },
    es: {
      title: "Utilizamos Cookies",
      description:
        "Utilizamos cookies para garantizar el funcionamiento del sitio y mejorar su experiencia. Puede personalizar sus preferencias o aceptar todas las categorías.",
      policy: "Política de Privacidad",
      accept_all: "Aceptar Todas",
      accept_selected: "Guardar Preferencias",
      decline: "Rechazar Opcionales",
      customize: "Personalizar",
      hide_details: "Ocultar detalles",
      essential: "Esenciales",
      essential_desc:
        "Necesarias para el funcionamiento del sitio (sesión, idioma, consentimiento). No se pueden desactivar.",
      analytics: "Analíticas",
      analytics_desc:
        "Google Analytics — nos ayudan a comprender cómo se utiliza el sitio, de forma anónima.",
      marketing: "Marketing",
      marketing_desc:
        "Google AdSense y Meta Pixel — muestran anuncios relevantes y miden la efectividad de campañas.",
    },
  };

  const t = text[language];

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const applyConsent = useCallback((prefs: CookiePreferences) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: prefs.marketing ? "granted" : "denied",
        ad_user_data: prefs.marketing ? "granted" : "denied",
        ad_personalization: prefs.marketing ? "granted" : "denied",
        analytics_storage: prefs.analytics ? "granted" : "denied",
        functionality_storage: "granted",
        personalization_storage: "granted",
      });
    }
    localStorage.setItem(COOKIE_PREFS_KEY, JSON.stringify(prefs));
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = { essential: true, analytics: true, marketing: true };
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    applyConsent(allAccepted);
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "custom");
    applyConsent(preferences);
    setIsVisible(false);
  };

  const handleDecline = () => {
    const declined: CookiePreferences = { essential: true, analytics: false, marketing: false };
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    applyConsent(declined);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label={
        language === "en"
          ? "Cookie consent"
          : language === "es"
            ? "Consentimiento de cookies"
            : "Consentimento de cookies"
      }
      className="fixed bottom-0 left-0 right-0 z-[9998] p-4 pb-[88px] lg:pb-4 md:p-6 md:pb-[88px] lg:pb-6 opacity-0 animate-[slideUp_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="max-w-4xl mx-auto bg-[var(--background-secondary)] border border-[var(--border)] backdrop-blur-xl rounded-sm p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Cookie className="text-[var(--gold)]" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-[var(--foreground)] font-serif text-lg mb-2">{t.title}</h3>
              <p className="text-[var(--foreground-secondary)] text-sm">
                {t.description}{" "}
                <LocalizedLink href="/privacidade" className="text-[var(--gold)] hover:underline">
                  {t.policy}
                </LocalizedLink>
                .
              </p>
            </div>
          </div>

          {/* Customize toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-xs text-[var(--gold)] uppercase tracking-wider font-medium hover:text-[var(--foreground)] transition-colors self-start"
          >
            {showDetails ? t.hide_details : t.customize}
            {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* Category toggles */}
          {showDetails && (
            <div className="space-y-3 border-t border-[var(--border)] pt-4">
              {/* Essential — always on */}
              <div className="flex items-center justify-between gap-4 py-2">
                <div className="flex-1">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {t.essential}
                  </span>
                  <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                    {t.essential_desc}
                  </p>
                </div>
                <div className="w-11 h-6 bg-[var(--gold)] rounded-full relative opacity-60 cursor-not-allowed flex-shrink-0">
                  <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between gap-4 py-2">
                <div className="flex-1">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {t.analytics}
                  </span>
                  <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                    {t.analytics_desc}
                  </p>
                </div>
                <button
                  onClick={() => setPreferences((p) => ({ ...p, analytics: !p.analytics }))}
                  className={`w-11 h-6 rounded-full relative transition-colors flex-shrink-0 ${
                    preferences.analytics ? "bg-[var(--gold)]" : "bg-[var(--border)]"
                  }`}
                  role="switch"
                  aria-checked={preferences.analytics}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.analytics ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between gap-4 py-2">
                <div className="flex-1">
                  <span className="text-sm font-medium text-[var(--foreground)]">
                    {t.marketing}
                  </span>
                  <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                    {t.marketing_desc}
                  </p>
                </div>
                <button
                  onClick={() => setPreferences((p) => ({ ...p, marketing: !p.marketing }))}
                  className={`w-11 h-6 rounded-full relative transition-colors flex-shrink-0 ${
                    preferences.marketing ? "bg-[var(--gold)]" : "bg-[var(--border)]"
                  }`}
                  role="switch"
                  aria-checked={preferences.marketing}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      preferences.marketing ? "right-0.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-[var(--border)]">
            <button
              onClick={handleDecline}
              className="px-5 py-3 text-xs uppercase tracking-widest text-[var(--foreground-secondary)] hover:text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors"
            >
              {t.decline}
            </button>
            {showDetails && (
              <button
                onClick={handleAcceptSelected}
                className="px-5 py-3 text-xs uppercase tracking-widest text-[var(--foreground)] border border-[var(--gold)]/50 hover:border-[var(--gold)] transition-colors"
              >
                {t.accept_selected}
              </button>
            )}
            <button
              onClick={handleAcceptAll}
              className="px-5 py-3 text-xs uppercase tracking-widest bg-[var(--gold)] text-black hover:bg-white transition-colors font-bold sm:ml-auto"
            >
              {t.accept_all}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

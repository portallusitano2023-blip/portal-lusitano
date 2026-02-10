"use client";

import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useLanguage();

  const text = {
    pt: {
      title: "Utilizamos Cookies",
      description:
        "Utilizamos cookies para melhorar a sua experiencia no nosso site. Ao continuar a navegar, concorda com a nossa",
      policy: "Politica de Privacidade",
      accept: "Aceitar",
      decline: "Recusar",
    },
    en: {
      title: "We Use Cookies",
      description:
        "We use cookies to improve your experience on our site. By continuing to browse, you agree to our",
      policy: "Privacy Policy",
      accept: "Accept",
      decline: "Decline",
    },
    es: {
      title: "Utilizamos Cookies",
      description:
        "Utilizamos cookies para mejorar su experiencia en nuestro sitio. Al continuar navegando, acepta nuestra",
      policy: "Politica de Privacidad",
      accept: "Aceptar",
      decline: "Rechazar",
    },
  };

  const t = text[language];

  useEffect(() => {
    // Verificar se ja aceitou cookies
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Mostrar apos 2 segundos
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9998] p-4 md:p-6 opacity-0 animate-[slideUp_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="max-w-4xl mx-auto bg-[#0a0a0a] border border-white/10 backdrop-blur-xl rounded-sm p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Icone */}
          <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Cookie className="text-[#C5A059]" size={24} />
          </div>

          {/* Texto */}
          <div className="flex-1">
            <h3 className="text-white font-serif text-lg mb-2">{t.title}</h3>
            <p className="text-zinc-400 text-sm">
              {t.description}{" "}
              <Link href="/privacidade" className="text-[#C5A059] hover:underline">
                {t.policy}
              </Link>
              .
            </p>
          </div>

          {/* Botoes */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleDecline}
              className="flex-1 md:flex-none px-6 py-3 text-xs uppercase tracking-widest text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors"
            >
              {t.decline}
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 md:flex-none px-6 py-3 text-xs uppercase tracking-widest bg-[#C5A059] text-black hover:bg-white transition-colors font-bold"
            >
              {t.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

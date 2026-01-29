"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const { language } = useLanguage();

  const text = {
    pt: {
      title: "Junte-se a Elite",
      subtitle: "Receba em primeira mao as novidades, artigos exclusivos e ofertas especiais.",
      placeholder: "O seu email",
      button: "Subscrever",
      success: "Obrigado por subscrever!",
      error: "Ocorreu um erro. Tente novamente.",
      privacy: "Respeitamos a sua privacidade. Pode cancelar a qualquer momento.",
    },
    en: {
      title: "Join the Elite",
      subtitle: "Be the first to receive news, exclusive articles and special offers.",
      placeholder: "Your email",
      button: "Subscribe",
      success: "Thank you for subscribing!",
      error: "An error occurred. Please try again.",
      privacy: "We respect your privacy. You can unsubscribe at any time.",
    },
  };

  const t = text[language];

  useEffect(() => {
    // Verificar se ja viu o popup
    const seen = localStorage.getItem("newsletter-popup-seen");
    if (!seen) {
      // Mostrar apos 10 segundos
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("newsletter-popup-seen", "true");
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
        localStorage.setItem("newsletter-popup-seen", "true");
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      } else {
        setError(t.error);
      }
    } catch {
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9997]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-[#0a0a0a] border border-white/10 max-w-lg w-full overflow-hidden"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              style={{ willChange: "transform, opacity" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Botao fechar */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors z-10"
                aria-label="Fechar"
              >
                <X size={24} />
              </button>

              {/* Imagem decorativa */}
              <div className="h-48 bg-gradient-to-br from-[#C5A059]/20 to-transparent relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mail className="text-[#C5A059] opacity-20" size={80} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
              </div>

              {/* Conteudo */}
              <div className="p-8 pt-0 -mt-8 relative">
                {!isSuccess ? (
                  <>
                    <h2 className="text-3xl font-serif text-white text-center mb-3">
                      {t.title}
                    </h2>
                    <p className="text-zinc-400 text-center text-sm mb-8">
                      {t.subtitle}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t.placeholder}
                          required
                          className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none transition-colors"
                        />
                      </div>

                      {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#C5A059] text-black py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          t.button
                        )}
                      </button>
                    </form>

                    <p className="text-[10px] text-zinc-600 text-center mt-6">
                      {t.privacy}
                    </p>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
                    </motion.div>
                    <h3 className="text-2xl font-serif text-white">{t.success}</h3>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

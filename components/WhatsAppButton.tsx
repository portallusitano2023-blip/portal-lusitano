"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({
  phoneNumber = "351939513151",
  message = "Ola! Gostava de saber mais sobre o Portal Lusitano.",
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState(message);

  const handleSend = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMessage)}`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center hover:bg-[#20bd5a] hover:scale-110 active:scale-95 transition-all duration-300 group opacity-0 animate-[fadeSlideIn_0.5s_ease-out_1s_forwards]"
        aria-label={isOpen ? "Fechar WhatsApp" : "Abrir WhatsApp"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}

        {/* Pulse animation */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        )}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-[var(--background-card)] rounded-2xl shadow-2xl overflow-hidden opacity-0 animate-[scaleIn_0.3s_ease-out_forwards] border border-[var(--border)]">
          {/* Header */}
          <div className="bg-[#25D366] p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Portal Lusitano</h3>
                <p className="text-white/80 text-sm">Normalmente responde em minutos</p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="p-4 bg-[var(--background-elevated)]">
            {/* Message bubble */}
            <div className="bg-[var(--background-card)] rounded-lg p-3 shadow-sm mb-4 border border-[var(--border)]">
              <p className="text-[var(--foreground-secondary)] text-sm">
                Ola! Como podemos ajuda-lo? Envie-nos uma mensagem e responderemos o mais breve
                possivel.
              </p>
              <span className="text-[var(--foreground-muted)] text-xs mt-1 block">
                Equipa Portal Lusitano
              </span>
            </div>

            {/* Input */}
            <div className="space-y-3">
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Escreva a sua mensagem..."
                aria-label="Mensagem para WhatsApp"
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm resize-none bg-[var(--background-secondary)] text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
                rows={3}
              />
              <button
                onClick={handleSend}
                aria-label="Enviar mensagem via WhatsApp"
                className="w-full bg-[#25D366] text-white py-3 rounded-lg font-medium hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Iniciar Conversa
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-[var(--background-secondary)] text-center border-t border-[var(--border)]">
            <p className="text-[var(--foreground-muted)] text-xs">Powered by WhatsApp Business</p>
          </div>
        </div>
      )}
    </>
  );
}

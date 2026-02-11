"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const STORAGE_KEY = "push-notification-preference";
const PAGE_COUNT_KEY = "push-notification-page-count";
const MIN_PAGES_BEFORE_PROMPT = 3;

const text = {
  pt: {
    message: "Quer receber notificacoes de novos cavalos e eventos?",
    accept: "Sim",
    dismiss: "Agora nao",
    denied: "Notificacoes bloqueadas no navegador. Pode alterar nas definicoes.",
  },
  en: {
    message: "Want to receive notifications about new horses and events?",
    accept: "Yes",
    dismiss: "Not now",
    denied: "Notifications are blocked in your browser. You can change this in settings.",
  },
  es: {
    message: "Desea recibir notificaciones de nuevos caballos y eventos?",
    accept: "Si",
    dismiss: "Ahora no",
    denied: "Notificaciones bloqueadas en el navegador. Puede cambiar en ajustes.",
  },
};

async function subscribeToPush(registration: ServiceWorkerRegistration) {
  try {
    // In production, VAPID public key should come from an env variable.
    // For now we attempt subscription without applicationServerKey which works
    // for local testing. A real VAPID key will be needed before going live.
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    const subscribeOptions: PushSubscriptionOptionsInit = {
      userVisibleOnly: true,
      ...(vapidPublicKey && {
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      }),
    };

    const subscription = await registration.pushManager.subscribe(subscribeOptions);

    // Send subscription to our API
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });

    return true;
  } catch {
    return false;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDeniedMessage, setShowDeniedMessage] = useState(false);
  const { language } = useLanguage();
  const t = text[language];

  useEffect(() => {
    // Do not show if:
    // - No support for notifications
    // - User already responded
    // - Permission already granted or denied at browser level
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    const preference = localStorage.getItem(STORAGE_KEY);
    if (preference) return;

    if (Notification.permission === "granted" || Notification.permission === "denied") return;

    // Increment page view count in sessionStorage
    const currentCount = parseInt(sessionStorage.getItem(PAGE_COUNT_KEY) || "0", 10) + 1;
    sessionStorage.setItem(PAGE_COUNT_KEY, String(currentCount));

    if (currentCount >= MIN_PAGES_BEFORE_PROMPT) {
      // Small delay so the banner does not appear instantly on page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = useCallback(async () => {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      localStorage.setItem(STORAGE_KEY, "accepted");

      // Attempt to subscribe via the service worker
      const registration = await navigator.serviceWorker.ready;
      await subscribeToPush(registration);

      setIsVisible(false);
    } else if (permission === "denied") {
      localStorage.setItem(STORAGE_KEY, "denied");
      setShowDeniedMessage(true);
      setTimeout(() => setIsVisible(false), 3000);
    } else {
      // "default" means dismissed without choosing -- let it appear again next session
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "dismissed");
    setIsVisible(false);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[9990] animate-[fadeSlideIn_0.3s_ease-out_forwards]"
    >
      <div className="bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl p-4">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors"
          aria-label={language === "pt" ? "Fechar" : language === "es" ? "Cerrar" : "Close"}
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3 pr-6">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#C5A059]/10 flex items-center justify-center">
            <Bell className="text-[#C5A059]" size={18} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {showDeniedMessage ? (
              <p className="text-sm text-zinc-400">{t.denied}</p>
            ) : (
              <>
                <p className="text-sm text-zinc-300 mb-3">{t.message}</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleAccept}
                    className="px-4 py-1.5 bg-[#C5A059] text-black text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors rounded"
                  >
                    {t.accept}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-1.5 bg-white/5 text-zinc-400 text-xs font-medium hover:text-white hover:bg-white/10 transition-colors rounded"
                  >
                    {t.dismiss}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

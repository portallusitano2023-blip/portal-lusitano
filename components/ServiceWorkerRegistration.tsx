"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Registar service worker apenas em producao
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker registado com sucesso:", registration.scope);
          })
          .catch((error) => {
            console.error("Erro ao registar Service Worker:", error);
          });
      }
    }
  }, []);

  return null;
}

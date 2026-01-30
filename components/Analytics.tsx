"use client";

import { useEffect } from "react";
import { initWebVitals } from "@/lib/webVitals";

export default function Analytics() {
  useEffect(() => {
    // Inicializar Web Vitals em producao
    if (process.env.NODE_ENV === "production") {
      initWebVitals();
    }
  }, []);

  return null;
}

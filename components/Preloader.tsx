"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simular progresso de carregamento - mais rapido
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 25; // Incremento maior para ser mais rapido
      });
    }, 50); // Intervalo menor

    // Esconder preloader apos carregamento - reduzido de 2s para 1.2s
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-[#050505] flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Logo animado */}
          <motion.div
            className="relative mb-12"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-serif text-white tracking-wide"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              PORTAL LUSITANO
            </motion.h1>
            <motion.div
              className="absolute -bottom-2 left-0 h-[1px] bg-[#C5A059]"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>

          {/* Barra de progresso */}
          <div className="w-48 h-[1px] bg-zinc-800 overflow-hidden">
            <motion.div
              className="h-full bg-[#C5A059]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Texto de carregamento */}
          <motion.p
            className="mt-6 text-[10px] uppercase tracking-[0.4em] text-zinc-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            A carregar experiencia...
          </motion.p>

          {/* Elemento decorativo */}
          <motion.div
            className="absolute bottom-20 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1 }}
          >
            <div className="w-8 h-[1px] bg-[#C5A059]" />
            <span className="text-[8px] uppercase tracking-widest text-zinc-600">Est. 2023</span>
            <div className="w-8 h-[1px] bg-[#C5A059]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

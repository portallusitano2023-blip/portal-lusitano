"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-[60] group flex flex-col items-center gap-2"
          aria-label="Voltar ao topo"
        >
          {/* O Circulo do Botao */}
          <div className="w-12 h-12 bg-black/80 backdrop-blur-md border border-zinc-800 rounded-full flex items-center justify-center text-white transition-all duration-500 group-hover:border-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-black shadow-2xl">
            <ChevronUp size={20} className="group-hover:-translate-y-1 transition-transform duration-300" />
          </div>

          {/* Texto Lateral/Inferior Subtil */}
          <span className="text-[8px] uppercase tracking-[0.3em] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-bold">
            Topo
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

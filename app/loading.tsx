"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
      {/* Logo Animation */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Outer Ring */}
        <motion.div
          className="w-16 h-16 border border-[#C5A059]/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Inner Ring */}
        <motion.div
          className="absolute inset-2 border border-[#C5A059] rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />

        {/* Center Dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-[#C5A059] rounded-full" />
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.p
        className="mt-8 text-[10px] uppercase tracking-[0.4em] text-zinc-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        A carregar...
      </motion.p>
    </div>
  );
}

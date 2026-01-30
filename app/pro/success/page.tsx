"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Crown,
  BookOpen,
  Users,
  ArrowRight,
  Sparkles,
  Download,
  Play,
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Lançar confetti
    if (!showConfetti) {
      setShowConfetti(true);

      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#C5A059", "#E8D5A3", "#8B6914", "#ffffff"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#C5A059", "#E8D5A3", "#8B6914", "#ffffff"],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [showConfetti]);

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 flex items-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="text-green-500" size={48} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Bem-vindo à <span className="text-[#C5A059]">Elite</span>!
          </h1>
          <p className="text-xl text-zinc-400 mb-8">
            A tua subscrição PRO foi ativada com sucesso.
            Agora tens acesso a todo o conteúdo exclusivo.
          </p>
        </motion.div>

        {/* Member Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#C5A059]/20 to-transparent border border-[#C5A059]/30 rounded-2xl p-8 mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Crown className="text-[#C5A059]" size={32} />
            <div>
              <h3 className="text-2xl font-serif text-white">Membro PRO</h3>
              <p className="text-[#C5A059]">Portal Lusitano</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-zinc-500 text-sm">Ebooks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">∞</div>
              <div className="text-zinc-500 text-sm">Cursos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">24/7</div>
              <div className="text-zinc-500 text-sm">Suporte</div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 mb-12"
        >
          <h3 className="text-lg font-medium text-white mb-6">
            O que fazer agora?
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/pro/biblioteca"
              className="group bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:border-[#C5A059]/30 transition-colors text-left"
            >
              <BookOpen className="text-[#C5A059] mb-4" size={24} />
              <h4 className="text-white font-medium mb-2 group-hover:text-[#C5A059] transition-colors">
                Explorar Biblioteca
              </h4>
              <p className="text-zinc-500 text-sm">
                Acede a todos os ebooks exclusivos
              </p>
            </Link>

            <Link
              href="/pro/dashboard"
              className="group bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:border-[#C5A059]/30 transition-colors text-left"
            >
              <Sparkles className="text-[#C5A059] mb-4" size={24} />
              <h4 className="text-white font-medium mb-2 group-hover:text-[#C5A059] transition-colors">
                Ver Dashboard
              </h4>
              <p className="text-zinc-500 text-sm">
                Acompanha o teu progresso
              </p>
            </Link>

            <Link
              href="/pro/comunidade"
              className="group bg-zinc-900/50 border border-white/5 rounded-xl p-6 hover:border-[#C5A059]/30 transition-colors text-left"
            >
              <Users className="text-[#C5A059] mb-4" size={24} />
              <h4 className="text-white font-medium mb-2 group-hover:text-[#C5A059] transition-colors">
                Entrar na Comunidade
              </h4>
              <p className="text-zinc-500 text-sm">
                Conecta-te com outros membros
              </p>
            </Link>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/pro/dashboard"
            className="inline-flex items-center gap-3 bg-[#C5A059] text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors"
          >
            Ir para o Dashboard
            <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* Email Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-zinc-600 text-sm mt-8"
        >
          Enviámos um email de confirmação com os detalhes da tua subscrição.
        </motion.p>
      </div>
    </main>
  );
}

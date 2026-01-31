"use client";

import { motion } from "framer-motion";
import {
  Download,
  Check,
  Mail,
  BookOpen,
  ArrowRight,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Sparkles,
  Crown,
  Gift,
  FileText,
  Users,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { trackEbookFunnel, trackSocialShare } from "@/lib/analytics";

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);

  // Track download page view
  useEffect(() => {
    trackEbookFunnel("download_pdf");
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    // Download do PDF
    setTimeout(() => {
      window.open("/downloads/introducao-lusitano.pdf", "_blank");
      setDownloading(false);
    }, 500);
  };

  const handleViewOnline = () => {
    window.open("/downloads/introducao-lusitano.html", "_blank");
  };

  const handleSocialShare = (platform: string) => {
    trackSocialShare(platform, "ebook", "introducao-lusitano");
  };

  const nextSteps = [
    {
      icon: Mail,
      title: "Verifica o teu Email",
      description: "Enviámos uma cópia do ebook para o teu email. Verifica também a pasta de spam.",
    },
    {
      icon: BookOpen,
      title: "Lê o Ebook",
      description: "Dedica 20 minutos para ler e absorver o conhecimento essencial sobre Lusitanos.",
    },
    {
      icon: Crown,
      title: "Explora a Biblioteca PRO",
      description: "Se gostaste, temos 50+ ebooks completos na nossa biblioteca premium.",
    },
  ];

  const bonuses = [
    {
      icon: Mail,
      title: "Newsletter Semanal",
      description: "Recebe dicas, artigos e novidades todas as semanas no teu email",
    },
    {
      icon: Gift,
      title: "Desconto Exclusivo",
      description: "20% OFF na primeira subscrição PRO (código no email)",
    },
    {
      icon: Users,
      title: "Comunidade Privada",
      description: "Acesso ao grupo de aficionados (link no próximo email)",
    },
  ];

  const proEbooks = [
    {
      title: "Manual do Criador Profissional",
      pages: 200,
      category: "Criação",
    },
    {
      title: "Linhagens de Elite",
      pages: 150,
      category: "Genética",
    },
    {
      title: "Treino de Dressage",
      pages: 180,
      category: "Treino",
    },
    {
      title: "Saúde Equina Essencial",
      pages: 90,
      category: "Saúde",
    },
  ];

  const shareUrl = "https://portal-lusitano.com/ebook-gratis";
  const shareText = "Acabei de descarregar um ebook gratuito incrível sobre o Cavalo Lusitano! 🐴";

  const socialShare = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-sky-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-700",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      color: "hover:bg-green-600",
    },
  ];

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      {/* Success Hero */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Check className="text-green-500" size={48} />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">
            Parabéns! 🎉
          </h1>

          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            O teu ebook gratuito está pronto para download.
            Também enviámos uma cópia para o teu email.
          </p>

          {/* Download Button */}
          <motion.button
            onClick={handleDownload}
            disabled={downloading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 bg-[#C5A059] text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {downloading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                A descarregar...
              </>
            ) : (
              <>
                <Download size={20} />
                Descarregar Ebook Agora
              </>
            )}
          </motion.button>

          <motion.button
            onClick={handleViewOnline}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 text-[#C5A059] hover:text-white transition-colors mb-4 ml-4"
          >
            <Eye size={18} />
            Ver Online
          </motion.button>

          <p className="text-zinc-600 text-sm">
            PDF 2.2 MB • HTML interativo disponível
          </p>
        </motion.div>
      </section>

      {/* Next Steps */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif text-white mb-4">
            Próximos Passos
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {nextSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 border border-white/5 p-8 text-center"
            >
              <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <step.icon className="text-[#C5A059]" size={28} />
              </div>
              <h3 className="text-xl font-serif text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bonus Content */}
      <section className="max-w-6xl mx-auto px-6 mb-20 py-20 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-4">
            <Sparkles className="text-green-500" size={16} />
            <span className="text-green-500 text-sm font-medium">
              Bónus Incluídos
            </span>
          </div>
          <h2 className="text-3xl font-serif text-white mb-4">
            Mas Espera, Há Mais! 🎁
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Ao descarregares este ebook, também ganhaste acesso a:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {bonuses.map((bonus, index) => (
            <motion.div
              key={bonus.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-b from-[#C5A059]/5 to-transparent border border-[#C5A059]/20 p-8 text-center"
            >
              <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <bonus.icon className="text-[#C5A059]" size={28} />
              </div>
              <h3 className="text-lg font-serif text-white mb-3">{bonus.title}</h3>
              <p className="text-zinc-400 text-sm">{bonus.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Share Section */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-zinc-900/50 border border-white/5 rounded-2xl p-12 text-center"
        >
          <Share2 className="text-[#C5A059] mx-auto mb-6" size={40} />
          <h3 className="text-2xl font-serif text-white mb-4">
            Partilha com os Teus Amigos
          </h3>
          <p className="text-zinc-400 mb-8">
            Conheces alguém que gostaria deste ebook? Partilha nas redes sociais!
          </p>

          <div className="flex items-center justify-center gap-4">
            {socialShare.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center text-white transition-all ${social.color}`}
                title={`Partilhar no ${social.name}`}
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Upgrade to PRO */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-full px-4 py-2 mb-4">
            <Crown className="text-[#C5A059]" size={16} />
            <span className="text-[#C5A059] text-sm font-medium">
              Leva o Teu Conhecimento ao Próximo Nível
            </span>
          </div>
          <h2 className="text-4xl font-serif text-white mb-4">
            Gostaste? Temos Muito Mais!
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Este ebook gratuito é apenas o início. A nossa biblioteca PRO contém
            50+ ebooks completos sobre todos os aspectos do cavalo Lusitano.
          </p>
        </motion.div>

        {/* Sample PRO Ebooks */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {proEbooks.map((ebook, index) => (
            <motion.div
              key={ebook.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 border border-white/5 p-6 hover:border-[#C5A059]/30 transition-colors group"
            >
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#C5A059]/20 transition-colors">
                <FileText className="text-[#C5A059]" size={24} />
              </div>
              <div className="text-xs text-[#C5A059] uppercase tracking-wider mb-2">
                {ebook.category}
              </div>
              <h3 className="text-lg font-serif text-white mb-2">{ebook.title}</h3>
              <div className="text-sm text-zinc-500">{ebook.pages} páginas</div>
            </motion.div>
          ))}
        </div>

        {/* PRO CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-b from-[#C5A059]/10 to-transparent border border-[#C5A059]/30 rounded-2xl p-12 text-center"
        >
          <h3 className="text-3xl font-serif text-white mb-4">
            Usa o Código <span className="text-[#C5A059]">LUSITANO20</span>
          </h3>
          <p className="text-xl text-zinc-400 mb-8">
            Recebe 20% de desconto na primeira subscrição PRO
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pro/checkout?plan=criador&period=monthly&coupon=LUSITANO20"
              className="inline-flex items-center gap-3 bg-[#C5A059] text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors"
            >
              <Crown size={20} />
              Upgrade para PRO
            </Link>
            <Link
              href="/pro"
              className="inline-flex items-center gap-2 text-white hover:text-[#C5A059] transition-colors"
            >
              Ver Todos os Planos
              <ArrowRight size={16} />
            </Link>
          </div>

          <p className="text-zinc-600 text-sm mt-6">
            A partir de €49.99/mês • Cancela quando quiseres • Garantia 30 dias
          </p>
        </motion.div>
      </section>

      {/* Final Message */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-12 border-t border-white/5"
        >
          <p className="text-zinc-400 mb-2">
            Tens alguma dúvida ou precisas de ajuda?
          </p>
          <Link
            href="/faq"
            className="text-[#C5A059] hover:text-white transition-colors"
          >
            Visita a nossa página de FAQ →
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

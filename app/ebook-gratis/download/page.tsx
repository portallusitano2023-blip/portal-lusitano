"use client";

import {
  Check,
  Mail,
  BookOpen,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Sparkles,
  Gift,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { trackEbookFunnel, trackSocialShare } from "@/lib/analytics";

export default function DownloadPage() {
  // Track download page view
  useEffect(() => {
    trackEbookFunnel("download_pdf");
  }, []);

  const handleViewEbook = () => {
    window.open("/downloads/introducao-lusitano.html", "_blank");
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
      icon: Users,
      title: "Explora o Portal",
      description: "Descobre cavalos à venda, eventos, coudelarias e muito mais conteúdo.",
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
      title: "Conteúdo Exclusivo",
      description: "Acesso a artigos e guias especiais para subscritores",
    },
    {
      icon: Users,
      title: "Comunidade",
      description: "Faz parte da comunidade de aficionados do Cavalo Lusitano",
    },
  ];

  const shareUrl = "https://portal-lusitano.com/ebook-gratis";
  const shareText = "Acabei de descarregar um ebook gratuito incrível sobre o Cavalo Lusitano!";

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
        <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          {/* Success Icon */}
          <div
            className="w-24 h-24 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-8 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.2s" }}
          >
            <Check className="text-green-500" size={48} />
          </div>

          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">
            Parabéns!
          </h1>

          <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
            O teu ebook gratuito está pronto para leres.
            Também enviámos o link para o teu email.
          </p>

          {/* View Ebook Button */}
          <button
            onClick={handleViewEbook}
            className="inline-flex items-center gap-3 bg-[#C5A059] text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white hover:scale-[1.05] active:scale-[0.95] transition-all mb-4"
          >
            <BookOpen size={20} />
            Ler Ebook Agora
          </button>

          <p className="text-zinc-600 text-sm">
            Versão interativa otimizada para browser
          </p>
        </div>
      </section>

      {/* Next Steps */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div
          className="text-center mb-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <h2 className="text-3xl font-serif text-white mb-4">
            Próximos Passos
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {nextSteps.map((step, index) => (
            <div
              key={step.title}
              className="bg-zinc-900/50 border border-white/5 p-8 text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <step.icon className="text-[#C5A059]" size={28} />
              </div>
              <h3 className="text-xl font-serif text-white mb-3">{step.title}</h3>
              <p className="text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bonus Content */}
      <section className="max-w-6xl mx-auto px-6 mb-20 py-20 border-t border-white/5">
        <div
          className="text-center mb-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-4">
            <Sparkles className="text-green-500" size={16} />
            <span className="text-green-500 text-sm font-medium">
              Bónus Incluídos
            </span>
          </div>
          <h2 className="text-3xl font-serif text-white mb-4">
            Mas Espera, Há Mais!
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Ao descarregares este ebook, também ganhaste acesso a:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {bonuses.map((bonus, index) => (
            <div
              key={bonus.title}
              className="bg-gradient-to-b from-[#C5A059]/5 to-transparent border border-[#C5A059]/20 p-8 text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <bonus.icon className="text-[#C5A059]" size={28} />
              </div>
              <h3 className="text-lg font-serif text-white mb-3">{bonus.title}</h3>
              <p className="text-zinc-400 text-sm">{bonus.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Share Section */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <div
          className="bg-zinc-900/50 border border-white/5 rounded-2xl p-12 text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
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
        </div>
      </section>

      {/* Final Message */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <div
          className="py-12 border-t border-white/5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <p className="text-zinc-400 mb-2">
            Tens alguma dúvida ou precisas de ajuda?
          </p>
          <Link
            href="/faq"
            className="text-[#C5A059] hover:text-white transition-colors"
          >
            Visita a nossa página de FAQ
          </Link>
        </div>
      </section>
    </main>
  );
}

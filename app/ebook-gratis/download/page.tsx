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
import { useLanguage } from "@/context/LanguageContext";
import { trackEbookFunnel } from "@/lib/analytics";

export default function DownloadPage() {
  const { t } = useLanguage();

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
      title: t.ebook_download.check_email,
      description: t.ebook_download.check_email_desc,
    },
    {
      icon: BookOpen,
      title: t.ebook_download.read_ebook,
      description: t.ebook_download.read_ebook_desc,
    },
    {
      icon: Users,
      title: t.ebook_download.explore_portal,
      description: t.ebook_download.explore_portal_desc,
    },
  ];

  const bonuses = [
    {
      icon: Mail,
      title: t.ebook_download.weekly_newsletter,
      description: t.ebook_download.weekly_newsletter_desc,
    },
    {
      icon: Gift,
      title: t.ebook_download.exclusive_content,
      description: t.ebook_download.exclusive_content_desc,
    },
    {
      icon: Users,
      title: t.ebook_download.community,
      description: t.ebook_download.community_desc,
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
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20">
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

          <h1 className="text-5xl md:text-6xl font-serif text-[var(--foreground)] mb-6">
            {t.ebook_download.congratulations}
          </h1>

          <p className="text-xl text-[var(--foreground-secondary)] mb-8 max-w-2xl mx-auto">
            {t.ebook_download.ebook_ready}
          </p>

          {/* View Ebook Button */}
          <button
            onClick={handleViewEbook}
            className="inline-flex items-center gap-3 bg-[var(--gold)] text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-[var(--gold-hover)] hover:scale-[1.05] active:scale-[0.95] transition-all mb-4"
          >
            <BookOpen size={20} />
            {t.ebook_download.read_now}
          </button>

          <p className="text-[var(--foreground-muted)] text-sm">
            {t.ebook_download.browser_version}
          </p>
        </div>
      </section>

      {/* Next Steps */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div
          className="text-center mb-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <h2 className="text-3xl font-serif text-[var(--foreground)] mb-4">
            {t.ebook_download.next_steps}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {nextSteps.map((step, index) => (
            <div
              key={step.title}
              className="bg-[var(--background-secondary)]/50 border border-[var(--border)] p-8 text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <step.icon className="text-[var(--gold)]" size={28} />
              </div>
              <h3 className="text-xl font-serif text-[var(--foreground)] mb-3">{step.title}</h3>
              <p className="text-[var(--foreground-secondary)]">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bonus Content */}
      <section className="max-w-6xl mx-auto px-6 mb-20 py-20 border-t border-[var(--border)]">
        <div
          className="text-center mb-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-4">
            <Sparkles className="text-green-500" size={16} />
            <span className="text-green-500 text-sm font-medium">
              {t.ebook_download.bonus_included}
            </span>
          </div>
          <h2 className="text-3xl font-serif text-[var(--foreground)] mb-4">
            {t.ebook_download.but_wait}
          </h2>
          <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto">
            {t.ebook_download.bonus_intro}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {bonuses.map((bonus, index) => (
            <div
              key={bonus.title}
              className="bg-gradient-to-b from-[var(--gold)]/5 to-transparent border border-[var(--gold)]/20 p-8 text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <bonus.icon className="text-[var(--gold)]" size={28} />
              </div>
              <h3 className="text-lg font-serif text-[var(--foreground)] mb-3">{bonus.title}</h3>
              <p className="text-[var(--foreground-secondary)] text-sm">{bonus.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Share Section */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <div
          className="bg-[var(--background-secondary)]/50 border border-[var(--border)] rounded-2xl p-12 text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <Share2 className="text-[var(--gold)] mx-auto mb-6" size={40} />
          <h3 className="text-2xl font-serif text-[var(--foreground)] mb-4">
            {t.ebook_download.share_friends}
          </h3>
          <p className="text-[var(--foreground-secondary)] mb-8">{t.ebook_download.share_desc}</p>

          <div className="flex items-center justify-center gap-4">
            {socialShare.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 bg-[var(--background-card)] border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--foreground)] transition-all ${social.color}`}
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
          className="py-12 border-t border-[var(--border)] opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <p className="text-[var(--foreground-secondary)] mb-2">{t.ebook_download.questions}</p>
          <Link
            href="/faq"
            className="text-[var(--gold)] hover:text-[var(--foreground)] transition-colors"
          >
            {t.ebook_download.visit_faq}
          </Link>
        </div>
      </section>
    </main>
  );
}

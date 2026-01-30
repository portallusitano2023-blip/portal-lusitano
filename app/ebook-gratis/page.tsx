"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Download,
  Check,
  Star,
  Award,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Gift,
  Mail,
  FileText,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EbookGratisPage() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/ebook-gratis/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, nome }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar pedido");
      }

      setLoading(false);
      setSubmitted(true);

      // Redirecionar para página de download após 2 segundos
      setTimeout(() => {
        window.location.href = "/ebook-gratis/download";
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
      alert(error instanceof Error ? error.message : "Erro ao processar pedido. Tenta novamente.");
    }
  };

  const benefits = [
    {
      icon: BookOpen,
      title: "30 Páginas de Conteúdo Premium",
      description: "Informação essencial condensada num formato fácil de ler",
    },
    {
      icon: Clock,
      title: "Leitura Rápida (20 min)",
      description: "Aprende o essencial sobre o Lusitano numa tarde",
    },
    {
      icon: Award,
      title: "Conteúdo Certificado",
      description: "Informação validada por criadores profissionais",
    },
    {
      icon: FileText,
      title: "Formato PDF Profissional",
      description: "Design elegante, ilustrações e fácil de imprimir",
    },
  ];

  const chapters = [
    {
      number: "01",
      title: "O Que É o Cavalo Lusitano?",
      description: "Definição, história e características únicas",
      pages: 8,
    },
    {
      number: "02",
      title: "História em 10 Minutos",
      description: "Desde a Idade do Gelo até aos dias de hoje",
      pages: 8,
    },
    {
      number: "03",
      title: "Características Únicas",
      description: "Morfologia, andamentos, temperamento e aptidões",
      pages: 10,
    },
    {
      number: "04",
      title: "Próximos Passos",
      description: "Recursos, comunidade e como continuar a aprender",
      pages: 4,
    },
  ];

  const testimonials = [
    {
      name: "Ana Costa",
      role: "Cavaleira Amadora",
      text: "Incrível! Aprendi mais neste ebook gratuito do que em horas de pesquisa online.",
      avatar: "AC",
      rating: 5,
    },
    {
      name: "Rui Mendes",
      role: "Estudante de Veterinária",
      text: "Conteúdo de qualidade profissional. Perfeito para quem está a começar.",
      avatar: "RM",
      rating: 5,
    },
    {
      name: "Sofia Pereira",
      role: "Aficionada Lusitanos",
      text: "Um guia completo e bem estruturado. Recomendo a todos!",
      avatar: "SP",
      rating: 5,
    },
  ];

  const stats = [
    { value: "5.000+", label: "Downloads" },
    { value: "4.9/5", label: "Avaliação" },
    { value: "30", label: "Páginas" },
    { value: "100%", label: "Grátis" },
  ];

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="text-green-500" size={40} />
          </motion.div>
          <h2 className="text-3xl font-serif text-white mb-4">
            Sucesso! Verifica o teu email
          </h2>
          <p className="text-zinc-400 mb-2">
            Enviámos o link de download para <strong className="text-white">{email}</strong>
          </p>
          <p className="text-zinc-500 text-sm">
            A redirecionar para a página de download...
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#C5A059]/5 via-transparent to-transparent" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-full px-4 py-2 mb-6">
                <Gift className="text-[#C5A059]" size={16} />
                <span className="text-[#C5A059] text-sm font-medium">
                  Ebook Gratuito
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-serif text-white mb-6 leading-tight">
                Introdução ao{" "}
                <span className="bg-gradient-to-r from-[#C5A059] to-[#E8D5A3] bg-clip-text text-transparent">
                  Cavalo Lusitano
                </span>
              </h1>

              <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
                O guia essencial para quem quer conhecer a raça mais nobre da Península Ibérica.
                <strong className="text-white"> 30 páginas de puro conhecimento, 100% grátis.</strong>
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 mb-10">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-[#C5A059] mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Email Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="O teu nome"
                    required
                    className="w-full bg-zinc-900/50 border border-white/10 text-white px-6 py-4 focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="O teu melhor email"
                    required
                    className="w-full bg-zinc-900/50 border border-white/10 text-white px-6 py-4 focus:outline-none focus:border-[#C5A059] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C5A059] text-black py-5 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      A processar...
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      Descarregar Ebook Grátis
                    </>
                  )}
                </button>
              </form>

              <p className="text-zinc-600 text-xs mt-4 text-center">
                Sem spam. Cancela a qualquer momento. Os teus dados estão seguros.
              </p>
            </motion.div>

            {/* Right Column - Ebook Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[3/4] max-w-md mx-auto">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[#C5A059]/20 blur-3xl scale-110" />

                {/* Ebook cover mockup - Usando placeholder por agora */}
                <div className="relative bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 shadow-2xl flex flex-col items-center justify-center p-12 text-center">
                  <BookOpen className="text-[#C5A059] mb-6" size={64} />
                  <h3 className="text-2xl font-serif text-white mb-3">
                    Introdução ao Cavalo Lusitano
                  </h3>
                  <div className="w-16 h-1 bg-[#C5A059] mb-4" />
                  <p className="text-zinc-400 text-sm mb-6">
                    O Guia Essencial Para Iniciantes
                  </p>
                  <div className="text-xs text-zinc-600 uppercase tracking-widest">
                    Portal Lusitano PRO
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-6 -right-6 bg-green-500 text-white px-6 py-3 rounded-full font-bold shadow-lg"
              >
                100% GRÁTIS
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-zinc-900 border border-[#C5A059]/30 text-white px-6 py-3 rounded-full font-medium shadow-lg flex items-center gap-2"
              >
                <Sparkles className="text-[#C5A059]" size={16} />
                PDF de Alta Qualidade
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-white mb-4">
              O Que Vais Aprender
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Um guia completo estruturado em 4 capítulos essenciais
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900/50 border border-white/5 p-8 hover:border-[#C5A059]/30 transition-colors group"
              >
                <div className="flex items-start gap-6">
                  <div className="text-5xl font-serif text-[#C5A059]/20 group-hover:text-[#C5A059]/40 transition-colors">
                    {chapter.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-serif text-white mb-2">
                      {chapter.title}
                    </h3>
                    <p className="text-zinc-400 mb-3">{chapter.description}</p>
                    <div className="text-sm text-zinc-600">
                      {chapter.pages} páginas
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-white mb-4">
              Por Que Descarregar Este Ebook?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="text-[#C5A059]" size={28} />
                </div>
                <h3 className="text-lg font-serif text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-zinc-400 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-white/5 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-serif text-white mb-4">
              O Que Dizem Os Leitores
            </h2>
            <div className="flex items-center justify-center gap-2 text-[#C5A059] mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="fill-[#C5A059]" size={20} />
              ))}
            </div>
            <p className="text-zinc-400">Avaliação média: 4.9/5 (234 reviews)</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900/50 border border-white/5 p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center text-black font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{testimonial.name}</h4>
                    <p className="text-zinc-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-zinc-300 italic mb-4">"{testimonial.text}"</p>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-[#C5A059] fill-[#C5A059]"
                      size={14}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-[#C5A059]/10 to-transparent border border-[#C5A059]/30 rounded-2xl p-12 text-center"
          >
            <BookOpen className="text-[#C5A059] mx-auto mb-6" size={48} />
            <h2 className="text-4xl font-serif text-white mb-4">
              Pronto Para Começar?
            </h2>
            <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
              Insere o teu email acima e recebe imediatamente o ebook gratuito +
              acesso à nossa newsletter semanal com dicas exclusivas.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <Check className="text-green-500" size={16} />
                <span>Sem custos ocultos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-green-500" size={16} />
                <span>Cancela a qualquer momento</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="text-green-500" size={16} />
                <span>100% grátis para sempre</span>
              </div>
            </div>
          </motion.div>

          {/* Upgrade hint */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-zinc-500 mb-4">
              Gostaste deste ebook gratuito?
            </p>
            <Link
              href="/pro"
              className="inline-flex items-center gap-2 text-[#C5A059] hover:text-white transition-colors group"
            >
              <span className="font-medium">
                Descobre a biblioteca completa com 50+ ebooks PRO
              </span>
              <ArrowRight
                className="group-hover:translate-x-1 transition-transform"
                size={16}
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

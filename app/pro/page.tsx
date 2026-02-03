"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Award,
  Zap,
  Check,
  Star,
  TrendingUp,
  Shield,
  Clock,
  Gift,
  Search,
  Eye,
  BadgeCheck
} from "lucide-react";
import Link from "next/link";

// Features 100% automáticas - ZERO trabalho para ti
const features = [
  {
    icon: Eye,
    title: "Listagem em Destaque",
    description: "A tua coudelaria aparece no topo do diretório automaticamente",
  },
  {
    icon: BadgeCheck,
    title: "Badge Verificado",
    description: "Selo de verificação que transmite confiança aos compradores",
  },
  {
    icon: Search,
    title: "Prioridade na Pesquisa",
    description: "Os teus cavalos aparecem primeiro nos resultados de busca",
  },
  {
    icon: TrendingUp,
    title: "Anúncios em Destaque",
    description: "Até 10 anúncios de cavalos sempre no topo das listagens",
  },
];

const testimonials = [
  {
    name: "João Rodrigues",
    role: "Criador, Coudelaria Vale do Tejo",
    text: "Desde que aderimos ao PRO, as consultas à nossa coudelaria triplicaram. A visibilidade faz toda a diferença.",
    avatar: "JR",
  },
  {
    name: "Maria Santos",
    role: "Criadora, Herdade dos Lusitanos",
    text: "Vendi 3 cavalos no primeiro mês graças aos anúncios em destaque. O investimento compensou logo.",
    avatar: "MS",
  },
  {
    name: "Pedro Almeida",
    role: "Veterinário Equino",
    text: "A visibilidade no portal trouxe-me novos clientes todas as semanas.",
    avatar: "PA",
  },
];

export default function ProPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  const price = billingPeriod === "monthly" ? 29.99 : 299.90;
  const priceLabel = billingPeriod === "monthly" ? "/mês" : "/ano";

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-6">
            <Zap className="text-green-500" size={16} />
            <span className="text-green-500 text-sm font-medium">
              100% Automático • Zero Trabalho
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Portal Lusitano{" "}
            <span className="bg-gradient-to-r from-[#C5A059] to-[#E8D5A3] bg-clip-text text-transparent">
              PRO
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Destaca a tua coudelaria automaticamente.
            Tu pagas, o sistema faz tudo sozinho.
          </p>
        </motion.div>
      </section>

      {/* Single Plan Card */}
      <section className="max-w-xl mx-auto px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden ring-2 ring-[#C5A059]"
        >
          <div className="absolute top-0 left-0 right-0 bg-[#C5A059] text-black text-xs font-bold py-2 text-center uppercase tracking-widest">
            Plano Único • Tudo Incluído
          </div>

          <div className="bg-gradient-to-b from-[#C5A059] to-[#8B6914] p-8 pt-14">
            <Crown className="text-white/80 mb-4" size={40} />
            <h3 className="text-3xl font-serif text-white mb-2">PRO Destaque</h3>
            <p className="text-white/70 text-sm mb-6">
              Visibilidade máxima, 100% automática
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-white text-black"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  billingPeriod === "yearly"
                    ? "bg-white text-black"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                Anual
                <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  -17%
                </span>
              </button>
            </div>

            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-5xl font-bold text-white">€{price.toFixed(2)}</span>
              <span className="text-white/60">{priceLabel}</span>
            </div>

            <Link
              href={`/pro/checkout?plan=destaque&period=${billingPeriod}`}
              className="block w-full py-4 text-center text-sm font-bold uppercase tracking-widest bg-white text-black hover:bg-zinc-200 transition-all"
            >
              Ativar Agora
            </Link>
          </div>

          <div className="bg-zinc-900 p-8">
            <p className="text-[#C5A059] text-sm font-medium mb-4 uppercase tracking-wider">
              O que está incluído:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-zinc-300">Listagem no topo do diretório</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-zinc-300">Badge de Criador Verificado</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-zinc-300">Até 10 anúncios de cavalos em destaque</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-zinc-300">Prioridade nos resultados de pesquisa</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-zinc-300">Contacto direto visível para compradores</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                <span className="text-zinc-300">Ativação instantânea automática</span>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <Zap size={16} />
                <span>Tudo funciona automaticamente após o pagamento</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif text-white mb-4">
            Como Funciona
          </h2>
          <p className="text-zinc-400">
            3 passos simples, depois é tudo automático
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold text-xl">
              1
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Paga Online</h3>
            <p className="text-zinc-500 text-sm">Pagamento seguro via Stripe com cartão ou MB Way</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold text-xl">
              2
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Ativação Instantânea</h3>
            <p className="text-zinc-500 text-sm">O sistema ativa o teu perfil PRO automaticamente</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-12 h-12 bg-[#C5A059] rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold text-xl">
              3
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Visibilidade Imediata</h3>
            <p className="text-zinc-500 text-sm">Apareces em destaque sem fazer mais nada</p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif text-white mb-4">
            Tudo 100% Automático
          </h2>
          <p className="text-zinc-400">
            Não precisas de fazer nada. O sistema trata de tudo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 border border-white/5 p-6 hover:border-[#C5A059]/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#C5A059]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="text-[#C5A059]" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-1">{feature.title}</h3>
                  <p className="text-zinc-500 text-sm">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif text-white mb-4">
            O que dizem os nossos membros
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 border border-white/5 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#C5A059] rounded-full flex items-center justify-center text-black font-bold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">{testimonial.name}</h4>
                  <p className="text-zinc-500 text-xs">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-zinc-400 text-sm italic">"{testimonial.text}"</p>
              <div className="flex gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-[#C5A059] fill-[#C5A059]" size={14} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-b from-[#C5A059]/10 to-transparent border border-[#C5A059]/30 rounded-2xl p-10 text-center"
        >
          <Shield className="text-[#C5A059] mx-auto mb-4" size={40} />
          <h3 className="text-2xl font-serif text-white mb-3">
            Garantia de 30 Dias
          </h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
            Se não estiveres satisfeito, devolvemos o teu dinheiro. Sem perguntas.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>Cancela quando quiseres</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift size={14} />
              <span>Sem compromisso</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Final */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Pronto para destacar o teu negócio?
          </h2>
          <p className="text-zinc-400 mb-8">
            Ativa agora e aparece em destaque imediatamente.
          </p>
          <Link
            href={`/pro/checkout?plan=destaque&period=${billingPeriod}`}
            className="inline-flex items-center gap-3 bg-[#C5A059] text-black px-10 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors"
          >
            <Zap size={18} />
            Ativar PRO Agora
          </Link>
          <p className="text-zinc-600 text-sm mt-4">
            €{price.toFixed(2)}{priceLabel} • Cancela quando quiseres
          </p>
        </motion.div>
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  BookOpen,
  Video,
  Users,
  Award,
  Zap,
  Check,
  Star,
  Sparkles,
  GraduationCap,
  FileText,
  MessageCircle,
  TrendingUp,
  Shield,
  Clock,
  Gift
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const plans = [
  {
    id: "aficionado",
    name: "Aficionado",
    price: 9.99,
    period: "mês",
    description: "Para quem ama o Lusitano e quer aprender mais",
    icon: BookOpen,
    color: "from-zinc-600 to-zinc-800",
    popular: false,
    features: [
      { text: "5 Ebooks exclusivos por mês", included: true },
      { text: "Newsletter semanal premium", included: true },
      { text: "Comunidade online privada", included: true },
      { text: "Guias PDF descargáveis", included: true },
      { text: "Templates profissionais", included: false },
      { text: "Consultoria por email", included: false },
      { text: "Acesso ao arquivo completo", included: false },
    ],
  },
  {
    id: "criador",
    name: "Criador",
    price: 49.99,
    period: "mês",
    description: "Para criadores e profissionais do sector",
    icon: Crown,
    color: "from-[#C5A059] to-[#8B6914]",
    popular: true,
    features: [
      { text: "Tudo do plano Aficionado", included: true },
      { text: "Biblioteca completa (50+ Ebooks)", included: true },
      { text: "Templates e documentos PRO", included: true },
      { text: "Planners de gestão de coudelaria", included: true },
      { text: "Infográficos e checklists", included: true },
      { text: "Consultoria por email (2x/mês)", included: true },
      { text: "Certificados digitais", included: true },
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: 199,
    period: "mês",
    description: "Acesso total + consultoria personalizada",
    icon: Sparkles,
    color: "from-purple-600 to-purple-900",
    popular: false,
    features: [
      { text: "Tudo do plano Criador", included: true },
      { text: "Consultoria ilimitada (email/chat)", included: true },
      { text: "Análise personalizada de linhagens", included: true },
      { text: "Networking com criadores elite", included: true },
      { text: "Conteúdo exclusivo mensal", included: true },
      { text: "Suporte prioritário 24/7", included: true },
      { text: "Badge Elite verificado", included: true },
    ],
  },
];

const features = [
  {
    icon: BookOpen,
    title: "Biblioteca de Ebooks",
    description: "50+ guias completos sobre criação, linhagens, treino, saúde e genética",
  },
  {
    icon: FileText,
    title: "Templates Profissionais",
    description: "Documentos, contratos, planners e checklists prontos a usar",
  },
  {
    icon: GraduationCap,
    title: "Certificados Digitais",
    description: "Certificações de conclusão para valorizar o teu conhecimento",
  },
  {
    icon: Users,
    title: "Comunidade Exclusiva",
    description: "Conecta-te com criadores e profissionais de todo o mundo",
  },
  {
    icon: MessageCircle,
    title: "Consultoria Expert",
    description: "Acesso direto a especialistas para tirar dúvidas",
  },
  {
    icon: TrendingUp,
    title: "Ferramentas PRO",
    description: "Calculadoras, templates e software de gestão",
  },
];

const testimonials = [
  {
    name: "João Rodrigues",
    role: "Criador, Coudelaria Vale do Tejo",
    text: "O Portal Lusitano PRO transformou a forma como gerimos a nossa coudelaria. O conteúdo é de nível mundial.",
    avatar: "JR",
  },
  {
    name: "Maria Santos",
    role: "Cavaleira Profissional",
    text: "Os cursos de dressage são incríveis. Aprendi mais em 3 meses do que em anos de formação tradicional.",
    avatar: "MS",
  },
  {
    name: "Pedro Almeida",
    role: "Veterinário Equino",
    text: "A comunidade é fantástica. Já fiz contactos que levaram a colaborações internacionais.",
    avatar: "PA",
  },
];

export default function ProPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const { language } = useLanguage();

  const getPrice = (price: number) => {
    if (billingPeriod === "yearly") {
      return (price * 10).toFixed(2); // 2 meses grátis
    }
    return price.toFixed(2);
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="text-[#C5A059]" size={16} />
            <span className="text-[#C5A059] text-sm font-medium">
              Novo: Plataforma PRO lançada
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Portal Lusitano{" "}
            <span className="bg-gradient-to-r from-[#C5A059] to-[#E8D5A3] bg-clip-text text-transparent">
              PRO
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            A primeira plataforma de formação e comunidade dedicada exclusivamente
            ao cavalo Lusitano. Conhecimento de elite ao teu alcance.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-zinc-900 rounded-full p-1 mb-12">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingPeriod === "monthly"
                  ? "bg-[#C5A059] text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billingPeriod === "yearly"
                  ? "bg-[#C5A059] text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Anual
              <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                -17%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-2xl overflow-hidden ${
                plan.popular ? "ring-2 ring-[#C5A059]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-[#C5A059] text-black text-xs font-bold py-2 text-center uppercase tracking-widest">
                  Mais Popular
                </div>
              )}

              <div className={`bg-gradient-to-b ${plan.color} p-8 ${plan.popular ? "pt-12" : ""}`}>
                <plan.icon className="text-white/80 mb-4" size={32} />
                <h3 className="text-2xl font-serif text-white mb-2">{plan.name}</h3>
                <p className="text-white/60 text-sm mb-6">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">€{getPrice(plan.price)}</span>
                  <span className="text-white/60">
                    /{billingPeriod === "yearly" ? "ano" : plan.period}
                  </span>
                </div>

                <Link
                  href={`/pro/checkout?plan=${plan.id}&period=${billingPeriod}`}
                  className={`block w-full py-4 text-center text-sm font-bold uppercase tracking-widest transition-all ${
                    plan.popular
                      ? "bg-white text-black hover:bg-zinc-200"
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  }`}
                >
                  Começar Agora
                </Link>
              </div>

              <div className="bg-zinc-900 p-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                      ) : (
                        <div className="w-[18px] h-[18px] rounded-full border border-zinc-700 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-zinc-300" : "text-zinc-600"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif text-white mb-4">
            Tudo o que precisas para dominar o mundo Lusitano
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Uma plataforma completa com conteúdo exclusivo, ferramentas profissionais
            e uma comunidade de elite.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 border border-white/5 p-8 hover:border-[#C5A059]/30 transition-colors group"
            >
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#C5A059]/20 transition-colors">
                <feature.icon className="text-[#C5A059]" size={24} />
              </div>
              <h3 className="text-xl font-serif text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif text-white mb-4">
            O que dizem os nossos membros
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
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
              <p className="text-zinc-300 italic">"{testimonial.text}"</p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-[#C5A059] fill-[#C5A059]" size={16} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-b from-[#C5A059]/10 to-transparent border border-[#C5A059]/30 rounded-2xl p-12 text-center"
        >
          <Shield className="text-[#C5A059] mx-auto mb-6" size={48} />
          <h3 className="text-3xl font-serif text-white mb-4">
            Garantia de 30 Dias
          </h3>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8">
            Se não estiveres 100% satisfeito nos primeiros 30 dias, devolvemos
            o teu dinheiro. Sem perguntas, sem complicações.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>Cancela a qualquer momento</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift size={16} />
              <span>Mantém o conteúdo descarregado</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Pronto para elevar o teu conhecimento?
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Junta-te a centenas de criadores e profissionais que já fazem parte da elite.
          </p>
          <Link
            href="/pro/checkout?plan=criador&period=monthly"
            className="inline-flex items-center gap-3 bg-[#C5A059] text-black px-10 py-5 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors"
          >
            <Zap size={20} />
            Começar Agora
          </Link>
          <p className="text-zinc-600 text-sm mt-4">
            Começa com €49.99/mês • Cancela quando quiseres
          </p>
        </motion.div>
      </section>
    </main>
  );
}

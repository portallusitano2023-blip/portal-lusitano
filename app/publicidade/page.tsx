"use client";

import { motion } from "framer-motion";
import { Megaphone, Users, TrendingUp, Mail, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const content = {
  pt: {
    subtitle: "Publicidade",
    title: "Anuncie no Portal Lusitano",
    description: "Alcance milhares de entusiastas e profissionais do mundo equestre",
    stats: [
      { value: "10.000+", label: "Visitantes/mês" },
      { value: "50+", label: "Países" },
      { value: "100%", label: "Público qualificado" },
    ],
    audience: {
      title: "O Nosso Público",
      items: [
        "Criadores de cavalos Lusitanos",
        "Cavaleiros e amazonas",
        "Proprietários de coudelarias",
        "Profissionais equestres (veterinários, ferradores, treinadores)",
        "Entusiastas e colecionadores",
        "Empresas do setor equestre",
      ],
    },
    packages: [
      {
        name: "Banner Lateral",
        price: "€50",
        period: "/mês",
        features: [
          "Banner 300x250px",
          "Visível em todas as páginas",
          "Link direto para o seu site",
          "Relatório mensal de cliques",
        ],
        popular: false,
      },
      {
        name: "Destaque Premium",
        price: "€150",
        period: "/mês",
        features: [
          "Banner 728x90px no topo",
          "Banner lateral incluído",
          "Menção na newsletter",
          "Publicação nas redes sociais",
          "Relatório detalhado",
        ],
        popular: true,
      },
      {
        name: "Parceria Anual",
        price: "€1.200",
        period: "/ano",
        features: [
          "Tudo do Premium",
          "Artigo patrocinado",
          "Logo no footer",
          "2 meses grátis",
          "Suporte prioritário",
        ],
        popular: false,
      },
    ],
    other: {
      title: "Outras Opções",
      items: [
        { name: "Artigo Patrocinado", price: "€200 (único)" },
        { name: "Newsletter Dedicada", price: "€100 (por envio)" },
        { name: "Listagem Coudelaria Premium", price: "€30/mês" },
        { name: "Anúncio Cavalo Destacado", price: "€25 (30 dias)" },
      ],
    },
    cta: {
      title: "Interessado?",
      description: "Entre em contacto connosco para discutir a melhor solução para o seu negócio.",
      button: "Contactar",
      email: "publicidade@portal-lusitano.pt",
    },
  },
  en: {
    subtitle: "Advertising",
    title: "Advertise on Portal Lusitano",
    description: "Reach thousands of equestrian enthusiasts and professionals",
    stats: [
      { value: "10,000+", label: "Visitors/month" },
      { value: "50+", label: "Countries" },
      { value: "100%", label: "Qualified audience" },
    ],
    audience: {
      title: "Our Audience",
      items: [
        "Lusitano horse breeders",
        "Riders and equestrians",
        "Stud farm owners",
        "Equestrian professionals (vets, farriers, trainers)",
        "Enthusiasts and collectors",
        "Equestrian industry companies",
      ],
    },
    packages: [
      {
        name: "Sidebar Banner",
        price: "€50",
        period: "/month",
        features: [
          "300x250px banner",
          "Visible on all pages",
          "Direct link to your site",
          "Monthly click report",
        ],
        popular: false,
      },
      {
        name: "Premium Highlight",
        price: "€150",
        period: "/month",
        features: [
          "728x90px top banner",
          "Sidebar banner included",
          "Newsletter mention",
          "Social media post",
          "Detailed report",
        ],
        popular: true,
      },
      {
        name: "Annual Partnership",
        price: "€1,200",
        period: "/year",
        features: [
          "Everything in Premium",
          "Sponsored article",
          "Logo in footer",
          "2 months free",
          "Priority support",
        ],
        popular: false,
      },
    ],
    other: {
      title: "Other Options",
      items: [
        { name: "Sponsored Article", price: "€200 (one-time)" },
        { name: "Dedicated Newsletter", price: "€100 (per send)" },
        { name: "Premium Stud Listing", price: "€30/month" },
        { name: "Featured Horse Ad", price: "€25 (30 days)" },
      ],
    },
    cta: {
      title: "Interested?",
      description: "Contact us to discuss the best solution for your business.",
      button: "Contact",
      email: "publicidade@portal-lusitano.pt",
    },
  },
};

export default function PublicidadePage() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Megaphone className="text-[#C5A059]" size={32} />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] block mb-4">
            {t.subtitle}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            {t.title}
          </h1>
          <p className="text-zinc-400 font-serif italic max-w-xl mx-auto">
            {t.description}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-16"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {t.stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/[0.02] border border-white/5">
              <div className="text-3xl font-serif text-[#C5A059] mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Audience */}
        <motion.div
          className="mb-16 p-8 bg-white/[0.02] border border-white/5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-[#C5A059]" size={24} />
            <h2 className="text-2xl font-serif text-white">{t.audience.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {t.audience.items.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-zinc-400">
                <Check className="text-[#C5A059]" size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Packages */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-8 justify-center">
            <TrendingUp className="text-[#C5A059]" size={24} />
            <h2 className="text-2xl font-serif text-white">Pacotes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {t.packages.map((pkg, index) => (
              <div
                key={index}
                className={`p-6 border ${
                  pkg.popular
                    ? "bg-[#C5A059]/10 border-[#C5A059]/30"
                    : "bg-white/[0.02] border-white/5"
                } relative`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C5A059] text-black text-xs px-3 py-1 uppercase tracking-wider">
                    Popular
                  </div>
                )}
                <h3 className="text-xl font-serif text-white mb-2">{pkg.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-serif text-[#C5A059]">{pkg.price}</span>
                  <span className="text-zinc-500">{pkg.period}</span>
                </div>
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                      <Check className="text-[#C5A059] mt-0.5 flex-shrink-0" size={14} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Other Options */}
        <motion.div
          className="mb-16 p-8 bg-white/[0.02] border border-white/5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <h2 className="text-2xl font-serif text-white mb-6">{t.other.title}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.other.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-zinc-400">{item.name}</span>
                <span className="text-[#C5A059] font-medium">{item.price}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center p-10 bg-gradient-to-b from-[#C5A059]/10 to-transparent border border-[#C5A059]/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Mail className="text-[#C5A059] mx-auto mb-4" size={32} />
          <h2 className="text-2xl font-serif text-white mb-2">{t.cta.title}</h2>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            {t.cta.description}
          </p>
          <a
            href={`mailto:${t.cta.email}`}
            className="inline-block bg-[#C5A059] text-black px-8 py-3 text-sm uppercase tracking-widest hover:bg-white transition-colors"
          >
            {t.cta.button}
          </a>
          <p className="mt-4 text-zinc-500 text-sm">{t.cta.email}</p>
        </motion.div>
      </div>
    </main>
  );
}

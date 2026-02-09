"use client";

import { useState } from "react";
import { Megaphone, Users, TrendingUp, Mail, Check, X } from "lucide-react";
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
        price: "€25",
        period: "/mês",
        packageId: "lateral",
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
        price: "€75",
        period: "/mês",
        packageId: "premium",
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
        price: "€600",
        period: "/ano",
        packageId: "anual",
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
        price: "€25",
        period: "/month",
        packageId: "lateral",
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
        price: "€75",
        period: "/month",
        packageId: "premium",
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
        price: "€600",
        period: "/year",
        packageId: "anual",
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

  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    company: "",
    telefone: "",
  });

  const handleOpenCheckout = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowModal(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.company) {
      alert("Por favor preencha email e nome da empresa");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/publicidade/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package: selectedPackage,
          email: formData.email,
          company: formData.company,
          telefone: formData.telefone,
        }),
      });

      const data = await response.json();

      if (!data.url) {
        throw new Error(data.error || "Erro ao criar checkout");
      }

      window.location.href = data.url;
    } catch (error: unknown) {
      alert(`Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <div className="w-16 h-16 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Megaphone className="text-[#C5A059]" size={32} />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] block mb-4">
            {t.subtitle}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{t.title}</h1>
          <p className="text-zinc-400 font-serif italic max-w-xl mx-auto">{t.description}</p>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-4 mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
          {t.stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/[0.02] border border-white/5">
              <div className="text-3xl font-serif text-[#C5A059] mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Audience */}
        <div
          className="mb-16 p-8 bg-white/[0.02] border border-white/5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.15s" }}
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
        </div>

        {/* Pricing Packages */}
        <div
          className="mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.2s" }}
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
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                      <Check className="text-[#C5A059] mt-0.5 flex-shrink-0" size={14} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleOpenCheckout(pkg.packageId)}
                  className={`w-full py-3 text-sm uppercase tracking-wider font-bold transition-all ${
                    pkg.popular
                      ? "bg-[#C5A059] text-black hover:bg-white"
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {language === "pt" ? "Começar Agora" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Other Options */}
        <div
          className="mb-16 p-8 bg-white/[0.02] border border-white/5 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.25s" }}
        >
          <h2 className="text-2xl font-serif text-white mb-6">{t.other.title}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.other.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b border-white/5"
              >
                <span className="text-zinc-400">{item.name}</span>
                <span className="text-[#C5A059] font-medium">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="text-center p-10 bg-gradient-to-b from-[#C5A059]/10 to-transparent border border-[#C5A059]/20 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <Mail className="text-[#C5A059] mx-auto mb-4" size={32} />
          <h2 className="text-2xl font-serif text-white mb-2">{t.cta.title}</h2>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">{t.cta.description}</p>
          <a
            href={`mailto:${t.cta.email}`}
            className="inline-block bg-[#C5A059] text-black px-8 py-3 text-sm uppercase tracking-widest hover:bg-white transition-colors"
          >
            {t.cta.button}
          </a>
          <p className="mt-4 text-zinc-500 text-sm">{t.cta.email}</p>
        </div>
      </div>

      {/* Modal de Checkout */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-serif text-white mb-4">
              {language === "pt" ? "Dados da Empresa" : "Company Details"}
            </h3>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  {language === "pt" ? "Email" : "Email"} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  {language === "pt" ? "Nome da Empresa" : "Company Name"} *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  {language === "pt" ? "Telefone (Opcional)" : "Phone (Optional)"}
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded px-4 py-3 text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#C5A059] hover:bg-white text-black font-bold py-3 uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {loading
                  ? language === "pt"
                    ? "A processar..."
                    : "Processing..."
                  : language === "pt"
                    ? "Continuar para Pagamento"
                    : "Continue to Payment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

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
  es: {
    subtitle: "Publicidad",
    title: "Anuncie en Portal Lusitano",
    description: "Alcance a miles de entusiastas y profesionales del mundo ecuestre",
    stats: [
      { value: "10.000+", label: "Visitantes/mes" },
      { value: "50+", label: "Paises" },
      { value: "100%", label: "Publico cualificado" },
    ],
    audience: {
      title: "Nuestro Publico",
      items: [
        "Criadores de caballos Lusitanos",
        "Jinetes y amazonas",
        "Propietarios de yeguadas",
        "Profesionales ecuestres (veterinarios, herradores, entrenadores)",
        "Entusiastas y coleccionistas",
        "Empresas del sector ecuestre",
      ],
    },
    packages: [
      {
        name: "Banner Lateral",
        price: "€25",
        period: "/mes",
        packageId: "lateral",
        features: [
          "Banner 300x250px",
          "Visible en todas las paginas",
          "Enlace directo a su sitio",
          "Informe mensual de clics",
        ],
        popular: false,
      },
      {
        name: "Destacado Premium",
        price: "€75",
        period: "/mes",
        packageId: "premium",
        features: [
          "Banner 728x90px en la parte superior",
          "Banner lateral incluido",
          "Mencion en el boletin",
          "Publicacion en redes sociales",
          "Informe detallado",
        ],
        popular: true,
      },
      {
        name: "Asociacion Anual",
        price: "€600",
        period: "/ano",
        packageId: "anual",
        features: [
          "Todo lo del Premium",
          "Articulo patrocinado",
          "Logo en el pie de pagina",
          "2 meses gratis",
          "Soporte prioritario",
        ],
        popular: false,
      },
    ],
    other: {
      title: "Otras Opciones",
      items: [
        { name: "Articulo Patrocinado", price: "€200 (unico)" },
        { name: "Boletin Dedicado", price: "€100 (por envio)" },
        { name: "Listado Yeguada Premium", price: "€30/mes" },
        { name: "Anuncio Caballo Destacado", price: "€25 (30 dias)" },
      ],
    },
    cta: {
      title: "Interesado?",
      description: "Contacte con nosotros para discutir la mejor solucion para su negocio.",
      button: "Contactar",
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
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <div className="w-16 h-16 bg-[var(--gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Megaphone className="text-[var(--gold)]" size={32} />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] block mb-4">
            {t.subtitle}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">
            {t.title}
          </h1>
          <p className="text-[var(--foreground-secondary)] font-serif italic max-w-xl mx-auto">
            {t.description}
          </p>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-4 mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
          {t.stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-[var(--surface-hover)] border border-[var(--border)]"
            >
              <div className="text-3xl font-serif text-[var(--gold)] mb-1">{stat.value}</div>
              <div className="text-sm text-[var(--foreground-muted)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Audience */}
        <div
          className="mb-16 p-8 bg-[var(--surface-hover)] border border-[var(--border)] opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="text-[var(--gold)]" size={24} />
            <h2 className="text-2xl font-serif text-[var(--foreground)]">{t.audience.title}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {t.audience.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-[var(--foreground-secondary)]"
              >
                <Check className="text-[var(--gold)]" size={16} />
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
            <TrendingUp className="text-[var(--gold)]" size={24} />
            <h2 className="text-2xl font-serif text-[var(--foreground)]">Pacotes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {t.packages.map((pkg, index) => (
              <div
                key={index}
                className={`p-6 border ${
                  pkg.popular
                    ? "bg-[var(--gold)]/10 border-[var(--gold)]/30"
                    : "bg-[var(--surface-hover)] border-[var(--border)]"
                } relative`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--gold)] text-black text-xs px-3 py-1 uppercase tracking-wider">
                    Popular
                  </div>
                )}
                <h3 className="text-xl font-serif text-[var(--foreground)] mb-2">{pkg.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-serif text-[var(--gold)]">{pkg.price}</span>
                  <span className="text-[var(--foreground-muted)]">{pkg.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]"
                    >
                      <Check className="text-[var(--gold)] mt-0.5 flex-shrink-0" size={14} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleOpenCheckout(pkg.packageId)}
                  className={`w-full py-3 text-sm uppercase tracking-wider font-bold transition-all ${
                    pkg.popular
                      ? "bg-[var(--gold)] text-black hover:bg-[var(--gold-hover)]"
                      : "bg-[var(--surface-hover)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] border border-[var(--border)]"
                  }`}
                >
                  {language === "pt"
                    ? "Começar Agora"
                    : language === "es"
                      ? "Empezar Ahora"
                      : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Other Options */}
        <div
          className="mb-16 p-8 bg-[var(--surface-hover)] border border-[var(--border)] opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.25s" }}
        >
          <h2 className="text-2xl font-serif text-[var(--foreground)] mb-6">{t.other.title}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {t.other.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-3 border-b border-[var(--border)]"
              >
                <span className="text-[var(--foreground-secondary)]">{item.name}</span>
                <span className="text-[var(--gold)] font-medium">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="text-center p-10 bg-gradient-to-b from-[var(--gold)]/10 to-transparent border border-[var(--gold)]/20 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <Mail className="text-[var(--gold)] mx-auto mb-4" size={32} />
          <h2 className="text-2xl font-serif text-[var(--foreground)] mb-2">{t.cta.title}</h2>
          <p className="text-[var(--foreground-secondary)] mb-6 max-w-md mx-auto">
            {t.cta.description}
          </p>
          <a
            href={`mailto:${t.cta.email}`}
            className="inline-block bg-[var(--gold)] text-black px-8 py-3 text-sm uppercase tracking-widest hover:bg-[var(--gold-hover)] transition-colors"
          >
            {t.cta.button}
          </a>
          <p className="mt-4 text-[var(--foreground-muted)] text-sm">{t.cta.email}</p>
        </div>
      </div>

      {/* Modal de Checkout */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-serif text-[var(--foreground)] mb-4">
              {language === "pt"
                ? "Dados da Empresa"
                : language === "es"
                  ? "Datos de la Empresa"
                  : "Company Details"}
            </h3>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                  {language === "pt"
                    ? "Nome da Empresa"
                    : language === "es"
                      ? "Nombre de la Empresa"
                      : "Company Name"}{" "}
                  *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                  {language === "pt"
                    ? "Telefone (Opcional)"
                    : language === "es"
                      ? "Teléfono (Opcional)"
                      : "Phone (Optional)"}
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--gold)]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-black font-bold py-3 uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {loading
                  ? language === "pt"
                    ? "A processar..."
                    : language === "es"
                      ? "Procesando..."
                      : "Processing..."
                  : language === "pt"
                    ? "Continuar para Pagamento"
                    : language === "es"
                      ? "Continuar al Pago"
                      : "Continue to Payment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

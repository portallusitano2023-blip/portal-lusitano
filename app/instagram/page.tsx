"use client";

import { useState } from "react";
import {
  Instagram,
  Users,
  Heart,
  Send,
  Check,
  Image,
  Film,
  Sparkles,
  ArrowRight,
  Loader2,
  Mail,
  Building,
  FileText,
  CheckCircle2,
} from "lucide-react";

const stats = [
  { value: "19K+", label: "Seguidores", icon: Users },
  { value: "5%+", label: "Engagement", icon: Heart },
  { value: "100%", label: "Público Equestre", icon: Sparkles },
];

const packages = [
  {
    id: "story",
    name: "Story",
    price: 10,
    description: "1 Story com link",
    features: ["1 Story (24h visível)", "Link direto para o seu site", "Menção da marca"],
    icon: Image,
    popular: false,
  },
  {
    id: "post",
    name: "Post no Feed",
    price: 30,
    description: "1 Post permanente no feed",
    features: [
      "1 Post no feed (permanente)",
      "Caption personalizada",
      "Menção e tag da marca",
      "Hashtags relevantes",
    ],
    icon: Image,
    popular: true,
  },
  {
    id: "reels",
    name: "Reels",
    price: 50,
    description: "1 Vídeo Reels com maior alcance",
    features: ["1 Reels (até 60 seg)", "Maior alcance orgânico", "Caption e hashtags"],
    icon: Film,
    popular: false,
  },
  {
    id: "pack",
    name: "Pack Completo",
    price: 75,
    description: "1 Post + 3 Stories",
    features: ["1 Post no feed", "3 Stories ao longo da semana", "Menção na bio (1 semana)"],
    icon: Sparkles,
    popular: false,
  },
];

export default function InstagramPage() {
  const [selectedPackage, setSelectedPackage] = useState("post");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    email: "",
    instagram: "",
    pacote: "post",
    mensagem: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/instagram/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackage,
          nome: formData.nome,
          empresa: formData.empresa,
          email: formData.email,
          instagram: formData.instagram,
          mensagem: formData.mensagem,
          preco: packages.find((p) => p.id === selectedPackage)?.price,
        }),
      });

      const data = await response.json();

      if (!data.url) {
        throw new Error(data.error || "Erro ao criar checkout");
      }

      window.location.href = data.url;
    } catch (error: unknown) {
      if (process.env.NODE_ENV === "development") console.error("[Instagram]", error);
      alert(`Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <div className="relative text-center mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 800px 600px at 50% 30%, rgba(197,160,89,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(197,89,200,0.25)]">
            <Instagram className="text-white" size={40} />
          </div>

          <span className="inline-block text-xs uppercase tracking-[0.3em] text-[#C5A059] border border-[#C5A059]/30 rounded-full px-4 py-1 mb-6">
            Publicidade
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white mb-5 leading-tight">
            Promova no Nosso Instagram
          </h1>

          <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
            Alcance milhares de entusiastas do mundo equestre através da nossa comunidade
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C5A059]/50" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C5A059]/50" />
          </div>

          <a
            href="https://instagram.com/portal_lusitano"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity shadow-[0_4px_24px_rgba(197,89,200,0.25)]"
          >
            <Instagram size={18} />
            @portal_lusitano
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-4 mb-16 max-w-2xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-[#0A0A0A] border border-white/[0.08] rounded-2xl flex flex-col items-center"
            >
              <stat.icon className="text-[#C5A059] mb-3" size={22} />
              <div className="text-4xl font-serif text-white mb-1 leading-none">{stat.value}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Packages */}
        <div
          className="mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl text-white mb-4">Escolha o Pacote</h2>
            <div className="mx-auto w-16 h-px bg-[#C5A059]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {packages.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              const Icon = pkg.icon;

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className="relative rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-[#C5A059]/40"
                  style={{
                    backgroundColor: isSelected ? "rgba(197,160,89,0.03)" : "#0A0A0A",
                    border: isSelected ? "1px solid #C5A059" : "1px solid rgba(255,255,255,0.10)",
                    boxShadow: isSelected ? "inset 0 0 40px rgba(197,160,89,0.05)" : "none",
                  }}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <Check size={18} className="text-[#C5A059]" />
                    </div>
                  )}

                  {pkg.popular && (
                    <span className="bg-[#C5A059]/15 text-[#C5A059] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-3">
                      Mais Popular
                    </span>
                  )}

                  <div className="mb-4">
                    <Icon size={22} className="text-[#C5A059]" />
                  </div>

                  <h3 className="font-serif text-lg text-white mb-1">{pkg.name}</h3>
                  <p className="text-zinc-500 text-sm mb-5">{pkg.description}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-sm text-zinc-400">€</span>
                    <span className="font-serif text-4xl text-white">{pkg.price}</span>
                  </div>

                  <ul className="space-y-2.5">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-[#C5A059] mt-0.5 shrink-0" />
                        <span className="text-sm text-zinc-400 leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        {!submitted ? (
          <div
            className="max-w-2xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif text-white mb-3">Pedir Orçamento</h2>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-12 bg-[#C5A059]/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <div className="h-px w-12 bg-[#C5A059]/40" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-1.5 block">
                      Nome
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      placeholder="O seu nome"
                      className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white text-sm rounded-xl focus:outline-none focus:border-[#C5A059]/60 placeholder:text-zinc-700 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-1.5 block">
                      Empresa / Marca
                    </label>
                    <div className="relative">
                      <Building
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
                        size={16}
                      />
                      <input
                        type="text"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        placeholder="Nome da empresa"
                        className="w-full bg-black/40 border border-white/10 pl-10 pr-4 py-3 text-white text-sm rounded-xl focus:outline-none focus:border-[#C5A059]/60 placeholder:text-zinc-700 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-1.5 block">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
                        size={16}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="email@exemplo.com"
                        className="w-full bg-black/40 border border-white/10 pl-10 pr-4 py-3 text-white text-sm rounded-xl focus:outline-none focus:border-[#C5A059]/60 placeholder:text-zinc-700 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-1.5 block">
                      Instagram
                    </label>
                    <div className="relative">
                      <Instagram
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none"
                        size={16}
                      />
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        placeholder="@suamarca"
                        className="w-full bg-black/40 border border-white/10 pl-10 pr-4 py-3 text-white text-sm rounded-xl focus:outline-none focus:border-[#C5A059]/60 placeholder:text-zinc-700 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-1.5 block">
                    Pacote
                  </label>
                  <div className="relative">
                    <select
                      name="pacote"
                      value={selectedPackage}
                      onChange={(e) => {
                        setSelectedPackage(e.target.value);
                        handleInputChange(e);
                      }}
                      className="w-full appearance-none bg-black/40 border border-white/10 px-4 py-3 text-white text-sm rounded-xl focus:outline-none focus:border-[#C5A059]/60 transition-all duration-300 cursor-pointer"
                    >
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id} className="bg-[#0A0A0A]">
                          {pkg.name} — €{pkg.price}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 5L7 9L11 5"
                          stroke="#C5A059"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-zinc-600">Total:</span>
                    <span
                      className="text-xs font-bold tracking-wider px-2.5 py-0.5 rounded-full border"
                      style={{
                        color: "#C5A059",
                        borderColor: "rgba(197,160,89,0.25)",
                        backgroundColor: "rgba(197,160,89,0.08)",
                      }}
                    >
                      €{packages.find((p) => p.id === selectedPackage)?.price}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-1.5 block">
                    O que pretende promover
                  </label>
                  <div className="relative">
                    <FileText
                      className="absolute left-3 top-3.5 text-zinc-600 pointer-events-none"
                      size={16}
                    />
                    <textarea
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Descreva o produto, serviço ou evento que quer promover..."
                      className="w-full bg-black/40 border border-white/10 pl-10 pr-4 py-3 text-white text-sm rounded-xl focus:outline-none focus:border-[#C5A059]/60 placeholder:text-zinc-700 transition-all duration-300 resize-none"
                    />
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl py-4 text-sm font-bold uppercase tracking-widest text-[#0A0A0A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
                    style={{
                      background: "linear-gradient(135deg, #C5A059 0%, #D4AF70 50%, #C5A059 100%)",
                      boxShadow: isSubmitting ? "none" : "0 0 0 0 rgba(197,160,89,0)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting)
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 8px 32px rgba(197,160,89,0.35), 0 2px 8px rgba(197,160,89,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow =
                        "0 0 0 0 rgba(197,160,89,0)";
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={17} />A processar...
                      </>
                    ) : (
                      <>
                        <Send size={17} />
                        Continuar para Pagamento
                      </>
                    )}
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-1.5">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0"
                    >
                      <rect
                        x="1"
                        y="5"
                        width="10"
                        height="7"
                        rx="1.5"
                        stroke="#52525b"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M3.5 5V3.5a2.5 2.5 0 0 1 5 0V5"
                        stroke="#52525b"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                      <circle cx="6" cy="8.5" r="0.8" fill="#52525b" />
                    </svg>
                    <span className="text-xs text-zinc-500">Pagamento seguro via Stripe</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div
            className="max-w-xl mx-auto text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div
                className="absolute inset-0 rounded-full animate-ping"
                style={{ backgroundColor: "rgba(197,160,89,0.12)" }}
              />
              <div
                className="relative w-24 h-24 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(197,160,89,0.15)" }}
              >
                <div
                  className="absolute inset-2 rounded-full border"
                  style={{ borderColor: "rgba(197,160,89,0.3)" }}
                />
                <Check size={36} strokeWidth={2.5} style={{ color: "#C5A059" }} />
              </div>
            </div>

            <h2 className="text-3xl font-serif text-white mb-4">Pedido Enviado!</h2>
            <p className="text-zinc-400 mb-2 leading-relaxed">
              Obrigado pelo seu interesse. Vamos analisar o seu pedido e responder por email em
              menos de 24 horas.
            </p>
            <p className="text-zinc-500 text-sm mb-8">
              Verifique também a pasta de spam caso não receba resposta.
            </p>

            <div
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border"
              style={{
                backgroundColor: "rgba(197,160,89,0.07)",
                borderColor: "rgba(197,160,89,0.2)",
              }}
            >
              <span className="text-zinc-500 text-sm">Pacote selecionado:</span>
              <span className="text-sm font-semibold" style={{ color: "#C5A059" }}>
                {packages.find((p) => p.id === selectedPackage)?.name}
              </span>
              <div className="w-px h-4" style={{ backgroundColor: "rgba(197,160,89,0.25)" }} />
              <span className="text-sm font-bold" style={{ color: "#C5A059" }}>
                €{packages.find((p) => p.id === selectedPackage)?.price}
              </span>
            </div>
          </div>
        )}

        {/* Why Us */}
        <div
          className="mt-20 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="flex items-center gap-4 mb-14 max-w-3xl mx-auto">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-[#C5A059]/30" />
            <div className="w-2 h-2 rounded-full bg-[#C5A059]/50" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#C5A059]/30 to-[#C5A059]/30" />
          </div>

          <h2 className="text-3xl font-serif text-white text-center mb-10">
            Porquê Promover Connosco?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center mb-5">
                <Users className="text-[#C5A059]" size={22} />
              </div>
              <h3 className="text-white font-medium text-base mb-3">Audiência Qualificada</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                100% do nosso público é interessado em cavalos e equitação
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center mb-5">
                <Heart className="text-[#C5A059]" size={22} />
              </div>
              <h3 className="text-white font-medium text-base mb-3">Alto Engagement</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Comunidade ativa que interage genuinamente com o conteúdo
              </p>
            </div>

            <div className="bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center mb-5">
                <Sparkles className="text-[#C5A059]" size={22} />
              </div>
              <h3 className="text-white font-medium text-base mb-3">Conteúdo Premium</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Criamos conteúdo de qualidade que representa bem a sua marca
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

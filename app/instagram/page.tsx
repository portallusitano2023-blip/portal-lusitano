"use client";

import { useState } from "react";
import {
  Instagram,
  Users,
  Heart,
  MessageCircle,
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
  const [submitted, setSubmitted] = useState(false);
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
      // Criar checkout Stripe
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

      // Redirecionar para Stripe
      window.location.href = data.url;
    } catch (error: unknown) {
      console.error("Erro ao processar:", error);
      alert(`Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Instagram className="text-white" size={40} />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] block mb-4">
            Publicidade
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Promova no Nosso Instagram
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Alcance milhares de entusiastas do mundo equestre através da nossa comunidade no
            Instagram
          </p>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-4 mb-16 max-w-2xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.1s" }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-zinc-900/50 border border-white/5">
              <stat.icon className="text-[#C5A059] mx-auto mb-2" size={24} />
              <div className="text-3xl font-serif text-white mb-1">{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Instagram Preview */}
        <div
          className="mb-16 text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.2s" }}
        >
          <a
            href="https://instagram.com/portal_lusitano"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            <Instagram size={20} />
            @portal_lusitano
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Packages */}
        <div
          className="mb-16 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.3s" }}
        >
          <h2 className="text-2xl font-serif text-white text-center mb-8">Escolha o Pacote</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`cursor-pointer p-6 border transition-all ${
                  selectedPackage === pkg.id
                    ? "border-[#C5A059] bg-[#C5A059]/10"
                    : "border-white/10 bg-zinc-900/50 hover:border-white/30"
                } ${pkg.popular ? "ring-2 ring-[#C5A059]" : ""}`}
              >
                {pkg.popular && (
                  <div className="text-xs text-[#C5A059] font-bold uppercase mb-2">
                    Mais Popular
                  </div>
                )}
                <pkg.icon
                  className={`mb-3 ${selectedPackage === pkg.id ? "text-[#C5A059]" : "text-zinc-500"}`}
                  size={28}
                />
                <h3 className="text-lg font-medium text-white mb-1">{pkg.name}</h3>
                <div className="mb-3">
                  <span className="text-2xl font-bold text-white">€{pkg.price}</span>
                </div>
                <p className="text-zinc-500 text-sm mb-4">{pkg.description}</p>
                <ul className="space-y-2">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="text-green-500 flex-shrink-0 mt-0.5" size={14} />
                      <span className="text-zinc-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        {!submitted ? (
          <div
            className="max-w-2xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="bg-zinc-900/50 border border-white/10 p-8">
              <h2 className="text-2xl font-serif text-white mb-6 text-center">Pedir Orçamento</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Nome *</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-zinc-800 border border-white/10 px-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none"
                      placeholder="O seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Empresa/Marca</label>
                    <div className="relative">
                      <Building
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                        size={18}
                      />
                      <input
                        type="text"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-800 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none"
                        placeholder="Nome da empresa"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Email *</label>
                    <div className="relative">
                      <Mail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                        size={18}
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-zinc-800 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none"
                        placeholder="email@exemplo.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Instagram</label>
                    <div className="relative">
                      <Instagram
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                        size={18}
                      />
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-800 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none"
                        placeholder="@suamarca"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Pacote Selecionado</label>
                  <select
                    name="pacote"
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="w-full bg-zinc-800 border border-white/10 px-4 py-3 text-white focus:border-[#C5A059] focus:outline-none"
                  >
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - €{pkg.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    O que pretende promover? *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-zinc-500" size={18} />
                    <textarea
                      name="mensagem"
                      value={formData.mensagem}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full bg-zinc-800 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none resize-none"
                      placeholder="Descreva o produto, serviço ou evento que quer promover..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#C5A059] text-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />A processar...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Continuar para Pagamento
                    </>
                  )}
                </button>

                <p className="text-center text-zinc-500 text-sm">Pagamento seguro via Stripe</p>
              </form>
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto text-center opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-green-500" size={40} />
            </div>
            <h2 className="text-3xl font-serif text-white mb-4">Pedido Enviado!</h2>
            <p className="text-zinc-400 mb-6">
              Obrigado pelo seu interesse! Vamos analisar o seu pedido e responder por email em
              menos de 24 horas.
            </p>
            <p className="text-[#C5A059]">
              Pacote selecionado: {packages.find((p) => p.id === selectedPackage)?.name} - €
              {packages.find((p) => p.id === selectedPackage)?.price}
            </p>
          </div>
        )}

        {/* Why Us */}
        <div
          className="mt-20 max-w-3xl mx-auto opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
          style={{ animationDelay: "0.5s" }}
        >
          <h2 className="text-2xl font-serif text-white text-center mb-8">
            Porquê Promover Connosco?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-[#C5A059]" size={24} />
              </div>
              <h3 className="text-white font-medium mb-2">Audiência Qualificada</h3>
              <p className="text-zinc-500 text-sm">
                100% do nosso público é interessado em cavalos e equitação
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-[#C5A059]" size={24} />
              </div>
              <h3 className="text-white font-medium mb-2">Alto Engagement</h3>
              <p className="text-zinc-500 text-sm">
                Comunidade ativa que interage genuinamente com o conteúdo
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-[#C5A059]" size={24} />
              </div>
              <h3 className="text-white font-medium mb-2">Conteúdo Premium</h3>
              <p className="text-zinc-500 text-sm">
                Criamos conteúdo de qualidade que representa bem a sua marca
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

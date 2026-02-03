"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Check,
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  ArrowRight,
  Loader2,
  Info,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const especialidadesOptions = [
  "Dressage",
  "Alta Escola",
  "Saltos",
  "Equitação de Trabalho",
  "Toureio",
  "Lazer",
  "Reprodução",
  "Ensino",
  "Atrelagem",
];

const regioes = [
  "Ribatejo",
  "Alentejo",
  "Lisboa",
  "Norte",
  "Centro",
  "Algarve",
  "Açores",
  "Madeira",
];

type Plan = "gratuito" | "pro" | "pro_instagram";

const plans = {
  gratuito: {
    name: "Gratuito",
    price: 0,
    features: [
      "Listagem básica no diretório",
      "Nome e localização visíveis",
      "Descrição curta",
    ],
    notIncluded: [
      "Aparecer em destaque",
      "Badge verificado",
      "Contactos visíveis",
      "Fotos da coudelaria",
      "Promoção no Instagram",
    ],
  },
  pro: {
    name: "PRO Diretório",
    price: 29.99,
    features: [
      "Aparecer no TOPO do diretório",
      "Badge de Verificado",
      "Contactos visíveis (tel, email, site)",
      "Até 10 fotos da coudelaria",
      "Link para Instagram",
      "Descrição completa",
      "Estatísticas de visualização",
    ],
    notIncluded: [
      "Promoção no Instagram (19k seguidores)",
    ],
  },
  pro_instagram: {
    name: "PRO + Instagram",
    price: 49.99,
    features: [
      "TUDO do plano PRO",
      "1 post mensal no nosso Instagram",
      "Exposição a 19.000 seguidores",
      "Stories de destaque",
      "Maior visibilidade online",
    ],
    notIncluded: [],
  },
};

export default function RegistarCoudelariaPage() {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("pro");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    localizacao: "",
    regiao: "",
    telefone: "",
    email: "",
    website: "",
    instagram: "",
    num_cavalos: "",
    especialidades: [] as string[],
    fotos: [] as File[],
    logo: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEspecialidadeToggle = (esp: string) => {
    if (formData.especialidades.includes(esp)) {
      setFormData({
        ...formData,
        especialidades: formData.especialidades.filter((e) => e !== esp),
      });
    } else {
      setFormData({
        ...formData,
        especialidades: [...formData.especialidades, esp],
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Se for plano pago, redirecionar para checkout
    if (selectedPlan !== "gratuito") {
      // Guardar dados no localStorage para recuperar após pagamento
      localStorage.setItem("coudelaria_draft", JSON.stringify(formData));

      // Redirecionar para checkout
      window.location.href = `/pro/checkout?plan=${selectedPlan}&type=coudelaria`;
      return;
    }

    // Se for gratuito, submeter diretamente
    try {
      const response = await fetch("/api/coudelarias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          plan: selectedPlan,
        }),
      });

      if (response.ok) {
        setStep(4); // Sucesso
      }
    } catch (error) {
      console.error("Erro ao registar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-[#C5A059] block mb-4">
            Diretório de Coudelarias
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Registar Coudelaria
          </h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Junte-se ao maior diretório de coudelarias Lusitanas de Portugal
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= s
                    ? "bg-[#C5A059] text-black"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {step > s ? <Check size={16} /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-0.5 transition-colors ${
                    step > s ? "bg-[#C5A059]" : "bg-zinc-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Escolher Plano */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-serif text-white mb-6 text-center">
              Escolha o seu plano
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {(Object.keys(plans) as Plan[]).map((planKey) => {
                const plan = plans[planKey];
                const isSelected = selectedPlan === planKey;
                const isPro = planKey !== "gratuito";

                return (
                  <div
                    key={planKey}
                    onClick={() => setSelectedPlan(planKey)}
                    className={`cursor-pointer p-6 border transition-all ${
                      isSelected
                        ? "border-[#C5A059] bg-[#C5A059]/10"
                        : "border-white/10 bg-zinc-900/50 hover:border-white/30"
                    } ${planKey === "pro_instagram" ? "ring-2 ring-[#C5A059]" : ""}`}
                  >
                    {planKey === "pro_instagram" && (
                      <div className="text-xs text-[#C5A059] font-bold uppercase mb-2">
                        Recomendado
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      {isPro && <Crown className="text-[#C5A059]" size={18} />}
                      <h3 className="text-lg font-medium text-white">{plan.name}</h3>
                    </div>

                    <div className="mb-4">
                      {plan.price === 0 ? (
                        <span className="text-2xl font-bold text-white">Grátis</span>
                      ) : (
                        <>
                          <span className="text-2xl font-bold text-white">€{plan.price}</span>
                          <span className="text-zinc-500">/mês</span>
                        </>
                      )}
                    </div>

                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="text-green-500 flex-shrink-0 mt-0.5" size={14} />
                          <span className="text-zinc-300">{feature}</span>
                        </li>
                      ))}
                      {plan.notIncluded.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <div className="w-3.5 h-3.5 rounded-full border border-zinc-700 flex-shrink-0 mt-0.5" />
                          <span className="text-zinc-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div
                      className={`w-full py-2 text-center text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-[#C5A059] text-black"
                          : "bg-white/5 text-zinc-400"
                      }`}
                    >
                      {isSelected ? "Selecionado" : "Selecionar"}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 bg-[#C5A059] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors"
              >
                Continuar
                <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Informações */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-serif text-white mb-6 text-center">
              Informações da Coudelaria
            </h2>

            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Nome */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Nome da Coudelaria *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: Coudelaria Vale do Tejo"
                  className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Descrição *
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder="Descreva a sua coudelaria, história, especialidades..."
                  rows={4}
                  className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none resize-none"
                  required
                />
              </div>

              {/* Localização */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Localidade *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                      type="text"
                      name="localizacao"
                      value={formData.localizacao}
                      onChange={handleInputChange}
                      placeholder="Ex: Santarém"
                      className="w-full bg-zinc-900 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-2">
                    Região *
                  </label>
                  <select
                    name="regiao"
                    value={formData.regiao}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white focus:border-[#C5A059] focus:outline-none"
                    required
                  >
                    <option value="">Selecione...</option>
                    {regioes.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contactos (só para PRO) */}
              {selectedPlan !== "gratuito" && (
                <>
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-4">
                      <Crown className="text-[#C5A059]" size={18} />
                      <span className="text-[#C5A059] text-sm font-medium">Contactos PRO</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-zinc-400 mb-2">Telefone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                          <input
                            type="tel"
                            name="telefone"
                            value={formData.telefone}
                            onChange={handleInputChange}
                            placeholder="+351 912 345 678"
                            className="w-full bg-zinc-900 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-2">Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="email@coudelaria.pt"
                            className="w-full bg-zinc-900 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-2">Website</label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            placeholder="https://www.coudelaria.pt"
                            className="w-full bg-zinc-900 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-zinc-400 mb-2">Instagram</label>
                        <div className="relative">
                          <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                          <input
                            type="text"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleInputChange}
                            placeholder="@coudelaria"
                            className="w-full bg-zinc-900 border border-white/10 pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Número de cavalos */}
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      Número de Cavalos (aproximado)
                    </label>
                    <input
                      type="number"
                      name="num_cavalos"
                      value={formData.num_cavalos}
                      onChange={handleInputChange}
                      placeholder="Ex: 25"
                      className="w-full bg-zinc-900 border border-white/10 px-4 py-3 text-white placeholder-zinc-600 focus:border-[#C5A059] focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Especialidades */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">
                  Especialidades
                </label>
                <div className="flex flex-wrap gap-2">
                  {especialidadesOptions.map((esp) => (
                    <button
                      key={esp}
                      type="button"
                      onClick={() => handleEspecialidadeToggle(esp)}
                      className={`px-3 py-2 text-sm transition-colors ${
                        formData.especialidades.includes(esp)
                          ? "bg-[#C5A059] text-black"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      }`}
                    >
                      {esp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.nome || !formData.descricao || !formData.localizacao || !formData.regiao}
                  className="inline-flex items-center gap-2 bg-[#C5A059] text-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirmar */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-2xl font-serif text-white mb-6 text-center">
              Confirmar Registo
            </h2>

            <div className="max-w-2xl mx-auto">
              {/* Resumo */}
              <div className="bg-zinc-900/50 border border-white/10 p-6 mb-6">
                <h3 className="text-lg font-medium text-white mb-4">Resumo</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Coudelaria:</span>
                    <span className="text-white">{formData.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Localização:</span>
                    <span className="text-white">{formData.localizacao}, {formData.regiao}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Plano:</span>
                    <span className="text-[#C5A059] font-medium">{plans[selectedPlan].name}</span>
                  </div>
                  {selectedPlan !== "gratuito" && (
                    <div className="flex justify-between pt-3 border-t border-white/10">
                      <span className="text-zinc-500">Total mensal:</span>
                      <span className="text-white font-bold">€{plans[selectedPlan].price}/mês</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Info sobre pagamento */}
              {selectedPlan !== "gratuito" && (
                <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 p-4 mb-6 flex items-start gap-3">
                  <Info className="text-[#C5A059] flex-shrink-0 mt-0.5" size={18} />
                  <div className="text-sm">
                    <p className="text-white mb-1">Pagamento seguro via Stripe</p>
                    <p className="text-zinc-400">
                      Após clicar em "Finalizar", será redirecionado para o pagamento.
                      A sua coudelaria ficará ativa imediatamente após a confirmação.
                    </p>
                  </div>
                </div>
              )}

              {/* Auto badge */}
              <div className="flex items-center gap-2 text-green-500 text-sm mb-6">
                <Zap size={16} />
                <span>Ativação automática após {selectedPlan === "gratuito" ? "submissão" : "pagamento"}</span>
              </div>

              {/* Botões */}
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-[#C5A059] text-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      A processar...
                    </>
                  ) : (
                    <>
                      {selectedPlan === "gratuito" ? "Registar Grátis" : `Pagar €${plans[selectedPlan].price}`}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Sucesso */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-green-500" size={40} />
            </div>
            <h2 className="text-3xl font-serif text-white mb-4">
              Registo Submetido!
            </h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto">
              A sua coudelaria foi registada com sucesso.
              {selectedPlan === "gratuito"
                ? " Será revista e publicada em breve."
                : " Está agora visível no diretório."}
            </p>
            <Link
              href="/directorio"
              className="inline-flex items-center gap-2 bg-[#C5A059] text-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors"
            >
              Ver Diretório
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}

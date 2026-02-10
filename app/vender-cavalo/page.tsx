"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  AlertCircle,
  CheckCircle,
  Euro,
  FileText,
  Camera,
  Shield,
  CreditCard,
  Info,
  X,
  Plus,
  Trash2,
} from "lucide-react";

interface FormData {
  // Dados do Proprietário
  proprietario_nome: string;
  proprietario_email: string;
  proprietario_telefone: string;
  proprietario_nif: string;
  proprietario_morada: string;

  // Identificação do Cavalo
  nome: string;
  nome_registo: string; // Nome no Livro Azul
  numero_registo: string; // Número APSL
  microchip: string;
  passaporte_equino: string;

  // Linhagem
  pai_nome: string;
  pai_registo: string;
  mae_nome: string;
  mae_registo: string;
  coudelaria_origem: string;

  // Características
  data_nascimento: string;
  sexo: string;
  pelagem: string;
  altura: string;

  // Treino e Competição
  nivel_treino: string;
  disciplinas: string[];
  competicoes: string;
  premios: string;

  // Saúde
  estado_saude: string;
  vacinacao_atualizada: boolean;
  desparasitacao_atualizada: boolean;
  exame_veterinario: boolean;
  observacoes_saude: string;

  // Venda
  preco: string;
  negociavel: boolean;
  aceita_troca: boolean;
  localizacao: string;
  disponibilidade_visita: string;

  // Descrição
  descricao: string;
  videos_url: string;
}

const initialFormData: FormData = {
  proprietario_nome: "",
  proprietario_email: "",
  proprietario_telefone: "",
  proprietario_nif: "",
  proprietario_morada: "",
  nome: "",
  nome_registo: "",
  numero_registo: "",
  microchip: "",
  passaporte_equino: "",
  pai_nome: "",
  pai_registo: "",
  mae_nome: "",
  mae_registo: "",
  coudelaria_origem: "",
  data_nascimento: "",
  sexo: "",
  pelagem: "",
  altura: "",
  nivel_treino: "",
  disciplinas: [],
  competicoes: "",
  premios: "",
  estado_saude: "",
  vacinacao_atualizada: false,
  desparasitacao_atualizada: false,
  exame_veterinario: false,
  observacoes_saude: "",
  preco: "",
  negociavel: false,
  aceita_troca: false,
  localizacao: "",
  disponibilidade_visita: "",
  descricao: "",
  videos_url: "",
};

const pelagens = [
  "Ruço",
  "Castanho",
  "Preto",
  "Alazão",
  "Baio",
  "Palomino",
  "Tordilho",
  "Isabelo",
  "Malhado",
];
const niveis_treino = [
  "Potro (sem desbaste)",
  "Desbravado",
  "Iniciado",
  "Intermédio",
  "Avançado",
  "Alta Escola",
  "Competição",
];
const disciplinas_opcoes = [
  "Dressage",
  "Equitação de Trabalho",
  "Toureio",
  "Atrelagem",
  "Saltos",
  "Lazer",
  "Reprodução",
  "Ensino",
];
const disponibilidades = [
  "Imediata",
  "Após acordo",
  "Fins de semana",
  "Dias úteis",
  "Por marcação",
];

const PRECO_ANUNCIO = 49; // Preço base
const PRECO_DESTAQUE = 29; // Extra para destaque

export default function VenderCavaloPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imagens, setImagens] = useState<File[]>([]);
  const [documentos, setDocumentos] = useState<{
    livroAzul?: File;
    passaporte?: File;
    exameVet?: File;
  }>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [opcaoDestaque, setOpcaoDestaque] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof FormData, value: FormData[keyof FormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDisciplina = (disc: string) => {
    setFormData((prev) => ({
      ...prev,
      disciplinas: prev.disciplinas.includes(disc)
        ? prev.disciplinas.filter((d) => d !== disc)
        : [...prev.disciplinas, disc],
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: string[] = [];

    if (currentStep === 1) {
      if (!formData.proprietario_nome) newErrors.push("Nome do proprietário é obrigatório");
      if (!formData.proprietario_email) newErrors.push("Email é obrigatório");
      if (!formData.proprietario_telefone) newErrors.push("Telefone é obrigatório");
      if (!formData.proprietario_nif) newErrors.push("NIF é obrigatório");
    }

    if (currentStep === 2) {
      if (!formData.nome) newErrors.push("Nome do cavalo é obrigatório");
      if (!formData.nome_registo) newErrors.push("Nome de registo (Livro Azul) é obrigatório");
      if (!formData.numero_registo) newErrors.push("Número de registo APSL é obrigatório");
      if (!formData.microchip) newErrors.push("Número do microchip é obrigatório");
      if (!formData.data_nascimento) newErrors.push("Data de nascimento é obrigatória");
      if (!formData.sexo) newErrors.push("Sexo é obrigatório");
      if (!formData.pelagem) newErrors.push("Pelagem é obrigatória");
    }

    if (currentStep === 3) {
      if (!formData.pai_nome || !formData.pai_registo)
        newErrors.push("Dados do pai são obrigatórios");
      if (!formData.mae_nome || !formData.mae_registo)
        newErrors.push("Dados da mãe são obrigatórios");
      if (!documentos.livroAzul) newErrors.push("Upload do Livro Azul é obrigatório");
    }

    if (currentStep === 4) {
      if (!formData.nivel_treino) newErrors.push("Nível de treino é obrigatório");
      if (!formData.estado_saude) newErrors.push("Estado de saúde é obrigatório");
      if (!formData.vacinacao_atualizada) newErrors.push("Vacinação deve estar atualizada");
    }

    if (currentStep === 5) {
      if (!formData.preco) newErrors.push("Preço é obrigatório");
      if (!formData.localizacao) newErrors.push("Localização é obrigatória");
      if (!formData.descricao || formData.descricao.length < 100)
        newErrors.push("Descrição deve ter pelo menos 100 caracteres");
      if (imagens.length < 3) newErrors.push("Mínimo de 3 fotografias é obrigatório");
    }

    if (currentStep === 6) {
      if (!termsAccepted) newErrors.push("Deve aceitar os termos e condições");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imagens.length + files.length > 10) {
      setErrors(["Máximo de 10 imagens permitidas"]);
      return;
    }
    setImagens((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDocUpload = (type: "livroAzul" | "passaporte" | "exameVet", file: File) => {
    setDocumentos((prev) => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    setLoading(true);

    try {
      const response = await fetch("/api/vender-cavalo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anuncio: true,
          destaque: opcaoDestaque,
          formData: {
            // Proprietário
            proprietarioNome: formData.proprietario_nome,
            proprietarioEmail: formData.proprietario_email,
            proprietarioTelefone: formData.proprietario_telefone,
            proprietarioWhatsapp: formData.proprietario_telefone, // ou campo separado se existir
            // Cavalo
            nomeCavalo: formData.nome,
            nomeRegisto: formData.nome_registo,
            numeroRegisto: formData.numero_registo,
            microchip: formData.microchip,
            passaporteEquino: formData.passaporte_equino,
            // Linhagem
            pai: formData.pai_nome,
            paiRegisto: formData.pai_registo,
            mae: formData.mae_nome,
            maeRegisto: formData.mae_registo,
            coudelariaOrigem: formData.coudelaria_origem,
            linhagem: formData.coudelaria_origem,
            // Características
            dataNascimento: formData.data_nascimento,
            idade: calcularIdade(formData.data_nascimento),
            sexo: formData.sexo,
            pelagem: formData.pelagem,
            altura: formData.altura,
            // Treino
            nivelTreino: formData.nivel_treino,
            disciplinas: formData.disciplinas,
            competicoes: formData.competicoes,
            premios: formData.premios,
            // Saúde
            estadoSaude: formData.estado_saude,
            vacinacaoAtualizada: formData.vacinacao_atualizada,
            desparasitacaoAtualizada: formData.desparasitacao_atualizada,
            exameVeterinario: formData.exame_veterinario,
            observacoesSaude: formData.observacoes_saude,
            // Venda
            preco: formData.preco,
            precoNegociavel: formData.negociavel,
            localizacao: formData.localizacao,
            regiao: "Ribatejo", // Ou usar formData.regiao se existir
            descricao: formData.descricao,
            // Documentos
            registoAPSL: formData.numero_registo,
            documentosEmDia: formData.vacinacao_atualizada && formData.desparasitacao_atualizada,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar checkout");
      }

      if (!data.url) {
        throw new Error("URL de checkout não retornada");
      }

      // Redirect para Stripe Checkout
      window.location.href = data.url;
    } catch (error: unknown) {
      console.error("Erro ao processar pagamento:", error);
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      alert(
        `Erro ao processar pagamento: ${message}. Por favor, tente novamente ou contacte o suporte.`
      );
      setLoading(false);
    }
  };

  // Helper para calcular idade
  const calcularIdade = (dataNascimento: string): number => {
    if (!dataNascimento) return 0;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();
    if (
      mesAtual < mesNascimento ||
      (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
    ) {
      idade--;
    }
    return idade;
  };

  const precoTotal = PRECO_ANUNCIO + (opcaoDestaque ? PRECO_DESTAQUE : 0);

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3, 4, 5, 6].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              s === step
                ? "bg-[#C5A059] text-black"
                : s < step
                  ? "bg-green-500 text-white"
                  : "bg-zinc-800 text-zinc-500"
            }`}
          >
            {s < step ? <CheckCircle size={16} /> : s}
          </div>
          {s < 6 && <div className={`w-8 h-0.5 ${s < step ? "bg-green-500" : "bg-zinc-800"}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white pt-20 sm:pt-24 md:pt-32 pb-32 px-4 sm:px-6 md:px-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <Link
          href="/comprar"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-[#C5A059] transition-colors mb-6 touch-manipulation"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Voltar ao Marketplace</span>
        </Link>

        <div className="text-center">
          <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[9px] sm:text-[10px] font-bold block mb-2">
            Marketplace Lusitano
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif italic mb-4">
            Vender Cavalo Lusitano
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Anuncie o seu cavalo no maior marketplace de Lusitanos em Portugal. Todos os anúncios
            passam por verificação de documentação.
          </p>
        </div>
      </div>

      {/* Pricing Banner */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-[#C5A059]/20 to-[#C5A059]/5 border border-[#C5A059]/30 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Anúncio Premium</h3>
              <p className="text-sm text-zinc-400">
                30 dias de visibilidade + Verificação de documentos
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#C5A059]">{PRECO_ANUNCIO}€</div>
              <div className="text-xs text-zinc-500">pagamento único</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="max-w-3xl mx-auto">
        <StepIndicator />
      </div>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-400 mb-2">
                  Por favor corrija os seguintes erros:
                </p>
                <ul className="text-sm text-red-300 space-y-1">
                  {errors.map((error, i) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Proprietário */}
        {step === 1 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center text-black text-sm font-bold">
                1
              </span>
              Dados do Proprietário
            </h2>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={formData.proprietario_nome}
                    onChange={(e) => updateField("proprietario_nome", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">NIF *</label>
                  <input
                    type="text"
                    required
                    minLength={9}
                    maxLength={9}
                    pattern="\d{9}"
                    value={formData.proprietario_nif}
                    onChange={(e) => updateField("proprietario_nif", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="123456789"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.proprietario_email}
                    onChange={(e) => updateField("proprietario_email", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Telefone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.proprietario_telefone}
                    onChange={(e) => updateField("proprietario_telefone", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="+351 912 345 678"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">Morada</label>
                <input
                  type="text"
                  value={formData.proprietario_morada}
                  onChange={(e) => updateField("proprietario_morada", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                  placeholder="Morada completa"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Identificação do Cavalo */}
        {step === 2 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center text-black text-sm font-bold">
                2
              </span>
              Identificação do Cavalo
            </h2>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-300">
                  Todos os cavalos devem estar registados no Livro Azul da APSL (Associação
                  Portuguesa de Criadores do Cavalo Puro Sangue Lusitano).
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Nome do Cavalo *</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={formData.nome}
                    onChange={(e) => updateField("nome", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Nome pelo qual é conhecido"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">
                    Nome de Registo (Livro Azul) *
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={formData.nome_registo}
                    onChange={(e) => updateField("nome_registo", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Nome oficial no registo"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">
                    Número de Registo APSL *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.numero_registo}
                    onChange={(e) => updateField("numero_registo", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Ex: PSL-XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Número do Microchip *</label>
                  <input
                    type="text"
                    required
                    minLength={15}
                    maxLength={15}
                    pattern="\d{15}"
                    value={formData.microchip}
                    onChange={(e) => updateField("microchip", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="15 dígitos"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Número do Passaporte Equino
                </label>
                <input
                  type="text"
                  value={formData.passaporte_equino}
                  onChange={(e) => updateField("passaporte_equino", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                  placeholder="Número do documento"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Data de Nascimento *</label>
                  <input
                    type="date"
                    required
                    value={formData.data_nascimento}
                    onChange={(e) => updateField("data_nascimento", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Sexo *</label>
                  <select
                    required
                    value={formData.sexo}
                    onChange={(e) => updateField("sexo", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="">Selecionar</option>
                    <option value="Garanhão">Garanhão</option>
                    <option value="Égua">Égua</option>
                    <option value="Castrado">Castrado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Pelagem *</label>
                  <select
                    value={formData.pelagem}
                    onChange={(e) => updateField("pelagem", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="">Selecionar</option>
                    {pelagens.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">Altura (cm)</label>
                <input
                  type="number"
                  value={formData.altura}
                  onChange={(e) => updateField("altura", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                  placeholder="Ex: 162"
                  min={140}
                  max={180}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Linhagem e Documentos */}
        {step === 3 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center text-black text-sm font-bold">
                3
              </span>
              Linhagem e Documentação
            </h2>

            <div className="space-y-6">
              {/* Pai */}
              <div>
                <h3 className="text-sm font-medium text-[#C5A059] mb-3">Pai</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Nome do Pai *</label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      value={formData.pai_nome}
                      onChange={(e) => updateField("pai_nome", e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Registo APSL do Pai *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pai_registo}
                      onChange={(e) => updateField("pai_registo", e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>

              {/* Mãe */}
              <div>
                <h3 className="text-sm font-medium text-[#C5A059] mb-3">Mãe</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Nome da Mãe *</label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      value={formData.mae_nome}
                      onChange={(e) => updateField("mae_nome", e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">
                      Registo APSL da Mãe *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.mae_registo}
                      onChange={(e) => updateField("mae_registo", e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>
              </div>

              {/* Coudelaria */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Coudelaria de Origem</label>
                <input
                  type="text"
                  value={formData.coudelaria_origem}
                  onChange={(e) => updateField("coudelaria_origem", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                  placeholder="Nome da coudelaria onde nasceu"
                />
              </div>

              {/* Upload Documentos */}
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-[#C5A059]" />
                  Upload de Documentos Obrigatórios
                </h3>

                <div className="space-y-4">
                  {/* Livro Azul */}
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Livro Azul (APSL) *</span>
                      {documentos.livroAzul && <CheckCircle size={18} className="text-green-400" />}
                    </div>
                    <p className="text-xs text-zinc-500 mb-3">Cópia do registo oficial do cavalo</p>
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-zinc-600 rounded-lg cursor-pointer hover:border-[#C5A059] transition-colors touch-manipulation">
                      <Upload size={18} className="text-zinc-500" />
                      <span className="text-sm text-zinc-400">
                        {documentos.livroAzul
                          ? documentos.livroAzul.name
                          : "Escolher ficheiro (PDF ou imagem)"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] && handleDocUpload("livroAzul", e.target.files[0])
                        }
                      />
                    </label>
                  </div>

                  {/* Passaporte */}
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Passaporte Equino</span>
                      {documentos.passaporte && (
                        <CheckCircle size={18} className="text-green-400" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 mb-3">Documento de identificação europeu</p>
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-zinc-600 rounded-lg cursor-pointer hover:border-[#C5A059] transition-colors touch-manipulation">
                      <Upload size={18} className="text-zinc-500" />
                      <span className="text-sm text-zinc-400">
                        {documentos.passaporte ? documentos.passaporte.name : "Escolher ficheiro"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] && handleDocUpload("passaporte", e.target.files[0])
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Treino e Saúde */}
        {step === 4 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center text-black text-sm font-bold">
                4
              </span>
              Treino e Saúde
            </h2>

            <div className="space-y-6">
              {/* Treino */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Nível de Treino *</label>
                <select
                  required
                  value={formData.nivel_treino}
                  onChange={(e) => updateField("nivel_treino", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="">Selecionar</option>
                  {niveis_treino.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Disciplinas */}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Disciplinas</label>
                <div className="flex flex-wrap gap-2">
                  {disciplinas_opcoes.map((disc) => (
                    <button
                      key={disc}
                      type="button"
                      onClick={() => toggleDisciplina(disc)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors touch-manipulation ${
                        formData.disciplinas.includes(disc)
                          ? "bg-[#C5A059] text-black"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      }`}
                    >
                      {disc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Competições */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Competições</label>
                  <input
                    type="text"
                    value={formData.competicoes}
                    onChange={(e) => updateField("competicoes", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Competições em que participou"
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Prémios/Classificações</label>
                  <input
                    type="text"
                    value={formData.premios}
                    onChange={(e) => updateField("premios", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Resultados obtidos"
                  />
                </div>
              </div>

              {/* Saúde */}
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-[#C5A059]" />
                  Estado de Saúde
                </h3>

                <div>
                  <label className="block text-sm text-zinc-400 mb-2">Estado Geral *</label>
                  <select
                    required
                    value={formData.estado_saude}
                    onChange={(e) => updateField("estado_saude", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="">Selecionar</option>
                    <option value="Excelente">Excelente - Sem qualquer problema</option>
                    <option value="Bom">Bom - Pequenas questões menores</option>
                    <option value="Regular">Regular - Requer atenção específica</option>
                  </select>
                </div>

                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
                    <input
                      type="checkbox"
                      checked={formData.vacinacao_atualizada}
                      onChange={(e) => updateField("vacinacao_atualizada", e.target.checked)}
                      className="w-5 h-5 accent-[#C5A059]"
                    />
                    <span className="text-sm">Vacinação atualizada *</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
                    <input
                      type="checkbox"
                      checked={formData.desparasitacao_atualizada}
                      onChange={(e) => updateField("desparasitacao_atualizada", e.target.checked)}
                      className="w-5 h-5 accent-[#C5A059]"
                    />
                    <span className="text-sm">Desparasitação atualizada</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
                    <input
                      type="checkbox"
                      checked={formData.exame_veterinario}
                      onChange={(e) => updateField("exame_veterinario", e.target.checked)}
                      className="w-5 h-5 accent-[#C5A059]"
                    />
                    <span className="text-sm">Exame veterinário disponível</span>
                  </label>
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-zinc-400 mb-1">Observações de Saúde</label>
                  <textarea
                    value={formData.observacoes_saude}
                    onChange={(e) => updateField("observacoes_saude", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059] h-24 resize-none"
                    placeholder="Informações relevantes sobre a saúde do cavalo"
                  />
                </div>

                {/* Upload Exame Veterinário */}
                {formData.exame_veterinario && (
                  <div className="mt-4 bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Relatório Veterinário</span>
                      {documentos.exameVet && <CheckCircle size={18} className="text-green-400" />}
                    </div>
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-zinc-600 rounded-lg cursor-pointer hover:border-[#C5A059] transition-colors touch-manipulation">
                      <Upload size={18} className="text-zinc-500" />
                      <span className="text-sm text-zinc-400">
                        {documentos.exameVet ? documentos.exameVet.name : "Anexar relatório"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] && handleDocUpload("exameVet", e.target.files[0])
                        }
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Preço, Fotos e Descrição */}
        {step === 5 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center text-black text-sm font-bold">
                5
              </span>
              Preço e Apresentação
            </h2>

            <div className="space-y-6">
              {/* Preço */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Preço (€) *</label>
                  <div className="relative">
                    <Euro
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                    />
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.preco}
                      onChange={(e) => updateField("preco", e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                      placeholder="25000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Localização *</label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={formData.localizacao}
                    onChange={(e) => updateField("localizacao", e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                    placeholder="Distrito ou localidade"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
                  <input
                    type="checkbox"
                    checked={formData.negociavel}
                    onChange={(e) => updateField("negociavel", e.target.checked)}
                    className="w-5 h-5 accent-[#C5A059]"
                  />
                  <span className="text-sm">Preço negociável</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer touch-manipulation">
                  <input
                    type="checkbox"
                    checked={formData.aceita_troca}
                    onChange={(e) => updateField("aceita_troca", e.target.checked)}
                    className="w-5 h-5 accent-[#C5A059]"
                  />
                  <span className="text-sm">Aceita trocas</span>
                </label>
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Disponibilidade para Visitas
                </label>
                <select
                  value={formData.disponibilidade_visita}
                  onChange={(e) => updateField("disponibilidade_visita", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="">Selecionar</option>
                  {disponibilidades.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fotos */}
              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <Camera size={18} className="text-[#C5A059]" />
                  Fotografias * (mínimo 3, máximo 10)
                </h3>
                <p className="text-xs text-zinc-500 mb-4">
                  Inclua fotos de diferentes ângulos: perfil, frente, traseira, cascos, e em
                  movimento se possível.
                </p>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                  {imagens.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-zinc-800 rounded-lg relative overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Foto ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 touch-manipulation"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {imagens.length < 10 && (
                    <label className="aspect-square bg-zinc-800 rounded-lg border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center cursor-pointer hover:border-[#C5A059] transition-colors touch-manipulation">
                      <Plus size={24} className="text-zinc-500 mb-1" />
                      <span className="text-xs text-zinc-500">Adicionar</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Descrição * ({formData.descricao.length}/100 caracteres mínimos)
                </label>
                <textarea
                  required
                  minLength={100}
                  value={formData.descricao}
                  onChange={(e) => updateField("descricao", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059] h-40 resize-none"
                  placeholder="Descreva o cavalo em detalhe: temperamento, qualidades, razão da venda, características especiais..."
                />
              </div>

              {/* Vídeos */}
              <div>
                <label className="block text-sm text-zinc-400 mb-1">
                  Link para Vídeos (YouTube/Vimeo)
                </label>
                <input
                  type="url"
                  value={formData.videos_url}
                  onChange={(e) => updateField("videos_url", e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C5A059]"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Pagamento */}
        {step === 6 && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-serif mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center text-black text-sm font-bold">
                6
              </span>
              Revisão e Pagamento
            </h2>

            {/* Resumo */}
            <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium mb-4">Resumo do Anúncio</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-zinc-500">Cavalo:</span>
                <span>{formData.nome || "-"}</span>
                <span className="text-zinc-500">Registo:</span>
                <span>{formData.numero_registo || "-"}</span>
                <span className="text-zinc-500">Preço:</span>
                <span>
                  {formData.preco ? `${parseInt(formData.preco).toLocaleString()}€` : "-"}
                </span>
                <span className="text-zinc-500">Localização:</span>
                <span>{formData.localizacao || "-"}</span>
                <span className="text-zinc-500">Fotografias:</span>
                <span>{imagens.length} foto(s)</span>
              </div>
            </div>

            {/* Opção Destaque */}
            <div className="border border-[#C5A059]/30 rounded-lg p-4 mb-6">
              <label className="flex items-start gap-4 cursor-pointer touch-manipulation">
                <input
                  type="checkbox"
                  checked={opcaoDestaque}
                  onChange={(e) => setOpcaoDestaque(e.target.checked)}
                  className="w-5 h-5 accent-[#C5A059] mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Anúncio em Destaque</span>
                    <span className="px-2 py-0.5 bg-[#C5A059] text-black text-xs font-bold rounded">
                      +{PRECO_DESTAQUE}€
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">
                    Apareça no topo da lista e na homepage durante 7 dias. 3x mais visualizações!
                  </p>
                </div>
              </label>
            </div>

            {/* Preço Total */}
            <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-zinc-400">Total a pagar</span>
                  <div className="text-2xl font-bold text-[#C5A059]">{precoTotal}€</div>
                </div>
                <CreditCard size={32} className="text-[#C5A059]" />
              </div>
              <div className="text-xs text-zinc-500 mt-2">
                Anúncio base ({PRECO_ANUNCIO}€) {opcaoDestaque && `+ Destaque (${PRECO_DESTAQUE}€)`}
              </div>
            </div>

            {/* Termos */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer touch-manipulation">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 accent-[#C5A059] mt-0.5"
                />
                <span className="text-sm text-zinc-400">
                  Li e aceito os{" "}
                  <Link href="/termos" className="text-[#C5A059] hover:underline">
                    Termos e Condições
                  </Link>{" "}
                  e a{" "}
                  <Link href="/privacidade" className="text-[#C5A059] hover:underline">
                    Política de Privacidade
                  </Link>
                  . Confirmo que todas as informações fornecidas são verdadeiras e que sou o
                  proprietário legal do cavalo.
                </span>
              </label>
            </div>

            {/* Info Verificação */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-300">
                  <p className="font-medium mb-1">Verificação de Documentos</p>
                  <p className="text-blue-300/80">
                    Após o pagamento, a nossa equipa irá verificar a documentação (Livro Azul,
                    registo APSL). O anúncio será publicado em até 24 horas úteis após aprovação.
                  </p>
                </div>
              </div>
            </div>

            {/* Botão Pagamento */}
            <button
              onClick={handleSubmit}
              disabled={loading || !termsAccepted}
              className="w-full py-4 bg-[#C5A059] text-black font-semibold rounded-lg hover:bg-[#D4AF6A] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 touch-manipulation active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  A processar...
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  Pagar {precoTotal}€ e Publicar
                </>
              )}
            </button>

            <p className="text-center text-xs text-zinc-500 mt-4">
              Pagamento seguro processado por Stripe. Os seus dados estão protegidos.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors touch-manipulation"
            >
              Anterior
            </button>
          ) : (
            <div />
          )}

          {step < 6 && (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-[#C5A059] text-black font-medium rounded-lg hover:bg-[#D4AF6A] transition-colors touch-manipulation"
            >
              Continuar
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import type { FormData, Documentos, DocumentType } from "@/components/vender-cavalo/types";
import {
  initialFormData,
  PRECO_ANUNCIO,
  PRECO_DESTAQUE,
  TOTAL_STEPS,
  MAX_IMAGES,
  MIN_IMAGES,
  MIN_DESCRIPTION_LENGTH,
} from "@/components/vender-cavalo/data";
import PageHeader from "@/components/vender-cavalo/PageHeader";
import PricingBanner from "@/components/vender-cavalo/PricingBanner";
import HowItWorks from "@/components/vender-cavalo/HowItWorks";
import StepIndicator from "@/components/vender-cavalo/StepIndicator";
import FormErrors from "@/components/vender-cavalo/FormErrors";
import FormNavigation from "@/components/vender-cavalo/FormNavigation";
import StepProprietario from "@/components/vender-cavalo/StepProprietario";
import StepIdentificacao from "@/components/vender-cavalo/StepIdentificacao";
import StepLinhagem from "@/components/vender-cavalo/StepLinhagem";
import StepTreinoSaude from "@/components/vender-cavalo/StepTreinoSaude";
import StepPrecoApresentacao from "@/components/vender-cavalo/StepPrecoApresentacao";
import StepPagamento from "@/components/vender-cavalo/StepPagamento";
import { useLanguage } from "@/context/LanguageContext";

function calcularIdade(dataNascimento: string): number {
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
}

export default function VenderCavaloPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imagens, setImagens] = useState<File[]>([]);
  const [documentos, setDocumentos] = useState<Documentos>({});
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
      if (!formData.proprietario_nome) newErrors.push(t.form_validation.required_owner_name);
      if (!formData.proprietario_email) newErrors.push(t.form_validation.required_email);
      if (!formData.proprietario_telefone) newErrors.push(t.form_validation.required_phone);
      if (!formData.proprietario_nif) newErrors.push(t.form_validation.required_nif);
    }

    if (currentStep === 2) {
      if (!formData.nome) newErrors.push(t.form_validation.required_horse_name);
      if (!formData.nome_registo) newErrors.push(t.form_validation.required_registration_name);
      if (!formData.numero_registo) newErrors.push(t.form_validation.required_registration_number);
      if (!formData.microchip) newErrors.push(t.form_validation.required_microchip);
      if (!formData.data_nascimento) newErrors.push(t.form_validation.required_birth_date);
      if (!formData.sexo) newErrors.push(t.form_validation.required_sex);
      if (!formData.pelagem) newErrors.push(t.form_validation.required_coat);
    }

    if (currentStep === 3) {
      if (!formData.pai_nome || !formData.pai_registo)
        newErrors.push(t.form_validation.required_sire);
      if (!formData.mae_nome || !formData.mae_registo)
        newErrors.push(t.form_validation.required_dam);
      if (!documentos.livroAzul) newErrors.push(t.form_validation.required_blue_book);
    }

    if (currentStep === 4) {
      if (!formData.nivel_treino) newErrors.push(t.form_validation.required_training_level);
      if (!formData.estado_saude) newErrors.push(t.form_validation.required_health_status);
      if (!formData.vacinacao_atualizada) newErrors.push(t.form_validation.required_vaccination);
    }

    if (currentStep === 5) {
      if (!formData.preco) newErrors.push(t.form_validation.required_price);
      if (!formData.localizacao) newErrors.push(t.vender_cavalo.error_location_required);
      if (!formData.descricao || formData.descricao.length < MIN_DESCRIPTION_LENGTH)
        newErrors.push(t.vender_cavalo.error_description_min);
      if (imagens.length < MIN_IMAGES) newErrors.push(t.vender_cavalo.error_photos_min);
    }

    if (currentStep === 6) {
      if (!termsAccepted) newErrors.push(t.vender_cavalo.error_terms_required);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imagens.length + files.length > MAX_IMAGES) {
      setErrors([t.vender_cavalo.error_max_images]);
      return;
    }
    setImagens((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImagens((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDocUpload = (type: DocumentType, file: File) => {
    setDocumentos((prev) => ({ ...prev, [type]: file }));
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    setLoading(true);

    try {
      // 1. Upload images to Supabase Storage first
      let imageUrls: string[] = [];
      if (imagens.length > 0) {
        const uploadFormData = new FormData();
        imagens.forEach((img) => uploadFormData.append("images", img));

        const uploadRes = await fetch("/api/vender-cavalo/upload", {
          method: "POST",
          body: uploadFormData,
        });

        if (!uploadRes.ok) {
          const uploadErr = await uploadRes.json();
          throw new Error(uploadErr.error || "Erro ao fazer upload das imagens");
        }

        const { urls } = await uploadRes.json();
        imageUrls = urls as string[];
      }

      // 2. Create Stripe checkout session with image URLs
      const response = await fetch("/api/vender-cavalo/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anuncio: true,
          destaque: opcaoDestaque,
          formData: {
            proprietarioNome: formData.proprietario_nome,
            proprietarioEmail: formData.proprietario_email,
            proprietarioTelefone: formData.proprietario_telefone,
            proprietarioWhatsapp: formData.proprietario_telefone,
            nomeCavalo: formData.nome,
            nomeRegisto: formData.nome_registo,
            numeroRegisto: formData.numero_registo,
            microchip: formData.microchip,
            passaporteEquino: formData.passaporte_equino,
            pai: formData.pai_nome,
            paiRegisto: formData.pai_registo,
            mae: formData.mae_nome,
            maeRegisto: formData.mae_registo,
            coudelariaOrigem: formData.coudelaria_origem,
            linhagem: formData.coudelaria_origem,
            dataNascimento: formData.data_nascimento,
            idade: calcularIdade(formData.data_nascimento),
            sexo: formData.sexo,
            pelagem: formData.pelagem,
            altura: formData.altura,
            nivelTreino: formData.nivel_treino,
            disciplinas: formData.disciplinas,
            competicoes: formData.competicoes,
            premios: formData.premios,
            estadoSaude: formData.estado_saude,
            vacinacaoAtualizada: formData.vacinacao_atualizada,
            desparasitacaoAtualizada: formData.desparasitacao_atualizada,
            exameVeterinario: formData.exame_veterinario,
            observacoesSaude: formData.observacoes_saude,
            preco: formData.preco,
            precoNegociavel: formData.negociavel,
            localizacao: formData.localizacao,
            regiao: "Ribatejo",
            descricao: formData.descricao,
            registoAPSL: formData.numero_registo,
            documentosEmDia: formData.vacinacao_atualizada && formData.desparasitacao_atualizada,
            imageUrls,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.vender_cavalo.error_checkout);
      }

      if (!data.url) {
        throw new Error(t.vender_cavalo.error_no_checkout_url);
      }

      window.location.href = data.url;
    } catch (error: unknown) {
      if (process.env.NODE_ENV === "development") console.error("[VenderCavalo]", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(t.vender_cavalo.error_payment.replace("{message}", message));
      setLoading(false);
    }
  };

  const precoTotal = PRECO_ANUNCIO + (opcaoDestaque ? PRECO_DESTAQUE : 0);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20 sm:pt-24 md:pt-32 pb-32 px-4 sm:px-6 md:px-12">
      <PageHeader />
      <HowItWorks />
      <PricingBanner />

      <div className="max-w-3xl mx-auto">
        <StepIndicator currentStep={step} />
      </div>

      <div className="max-w-3xl mx-auto">
        <FormErrors errors={errors} />

        {step === 1 && <StepProprietario formData={formData} updateField={updateField} />}

        {step === 2 && <StepIdentificacao formData={formData} updateField={updateField} />}

        {step === 3 && (
          <StepLinhagem
            formData={formData}
            updateField={updateField}
            documentos={documentos}
            onDocUpload={handleDocUpload}
          />
        )}

        {step === 4 && (
          <StepTreinoSaude
            formData={formData}
            updateField={updateField}
            documentos={documentos}
            onDocUpload={handleDocUpload}
            onToggleDisciplina={toggleDisciplina}
          />
        )}

        {step === 5 && (
          <StepPrecoApresentacao
            formData={formData}
            updateField={updateField}
            imagens={imagens}
            onImageUpload={handleImageUpload}
            onRemoveImage={removeImage}
          />
        )}

        {step === 6 && (
          <StepPagamento
            formData={formData}
            imagens={imagens}
            opcaoDestaque={opcaoDestaque}
            onOpcaoDestaqueChange={setOpcaoDestaque}
            termsAccepted={termsAccepted}
            onTermsChange={setTermsAccepted}
            precoTotal={precoTotal}
            loading={loading}
            onSubmit={handleSubmit}
          />
        )}

        <FormNavigation step={step} onPrev={prevStep} onNext={nextStep} />
      </div>
    </main>
  );
}

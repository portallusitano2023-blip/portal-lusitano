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
import StepIndicator from "@/components/vender-cavalo/StepIndicator";
import FormErrors from "@/components/vender-cavalo/FormErrors";
import FormNavigation from "@/components/vender-cavalo/FormNavigation";
import StepProprietario from "@/components/vender-cavalo/StepProprietario";
import StepIdentificacao from "@/components/vender-cavalo/StepIdentificacao";
import StepLinhagem from "@/components/vender-cavalo/StepLinhagem";
import StepTreinoSaude from "@/components/vender-cavalo/StepTreinoSaude";
import StepPrecoApresentacao from "@/components/vender-cavalo/StepPrecoApresentacao";
import StepPagamento from "@/components/vender-cavalo/StepPagamento";

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
      if (!formData.descricao || formData.descricao.length < MIN_DESCRIPTION_LENGTH)
        newErrors.push("Descrição deve ter pelo menos 100 caracteres");
      if (imagens.length < MIN_IMAGES) newErrors.push("Mínimo de 3 fotografias é obrigatório");
    }

    if (currentStep === 6) {
      if (!termsAccepted) newErrors.push("Deve aceitar os termos e condições");
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
      setErrors(["Máximo de 10 imagens permitidas"]);
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

  const precoTotal = PRECO_ANUNCIO + (opcaoDestaque ? PRECO_DESTAQUE : 0);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-20 sm:pt-24 md:pt-32 pb-32 px-4 sm:px-6 md:px-12">
      <PageHeader />
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

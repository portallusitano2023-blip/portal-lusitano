"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Check, MapPin, ArrowLeft, User, Award, CheckCircle } from "lucide-react";
import { categorias } from "@/components/profissionais/constants";
import type { CategoriaProf } from "@/components/profissionais/types";
import { useLanguage } from "@/context/LanguageContext";
import type { FormData, Certificacao } from "@/components/profissionais/registar/types";
import StepIdentificacao from "@/components/profissionais/registar/StepIdentificacao";
import StepLocalizacao from "@/components/profissionais/registar/StepLocalizacao";
import StepCredenciais from "@/components/profissionais/registar/StepCredenciais";
import StepConfirmacao from "@/components/profissionais/registar/StepConfirmacao";

const categoriasOptions = categorias.filter((c) => c.id !== "todos") as {
  id: CategoriaProf;
  label: string;
  descricao: string;
}[];

export default function RegistarProfissionalPage() {
  const { t } = useLanguage();
  const tp = t.registar_profissional;

  const steps = useMemo(
    () => [
      { num: 1, label: tp.step_identity, icon: User },
      { num: 2, label: tp.step_location, icon: MapPin },
      { num: 3, label: tp.step_credentials, icon: Award },
      { num: 4, label: tp.step_confirm, icon: CheckCircle },
    ],
    [tp.step_identity, tp.step_location, tp.step_credentials, tp.step_confirm]
  );

  const DIAS_SEMANA = useMemo(
    () => [
      tp.day_monday,
      tp.day_tuesday,
      tp.day_wednesday,
      tp.day_thursday,
      tp.day_friday,
      tp.day_saturday,
      tp.day_sunday,
    ],
    [
      tp.day_monday,
      tp.day_tuesday,
      tp.day_wednesday,
      tp.day_thursday,
      tp.day_friday,
      tp.day_saturday,
      tp.day_sunday,
    ]
  );

  const IDIOMAS_OPCOES = useMemo(
    () => [tp.lang_portuguese, tp.lang_english, tp.lang_spanish, tp.lang_french, tp.lang_german],
    [tp.lang_portuguese, tp.lang_english, tp.lang_spanish, tp.lang_french, tp.lang_german]
  );

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    fotoBase64: "",
    nome: "",
    email: "",
    telefone: "",
    categoria: "",
    modalidade: "presencial",
    especialidade: "",
    anosExperiencia: 0,
    pais: "",
    cidade: "",
    distrito: "",
    morada: "",
    codigoPostal: "",
    raioServico: 0,
    aceitaDeslocacoes: false,
    servicos: [],
    precoMedio: "",
    idiomas: [tp.lang_portuguese],
    formacaoAcademica: "",
    certificacoes: [],
    associacoes: [],
    seguroProfissional: false,
    seguradora: "",
    disponibilidade: {
      dias: [],
      horaInicio: "",
      horaFim: "",
    },
    emergencias24h: false,
    descricao: "",
    website: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    documentos: [],
    aceitaTermos: false,
    declaracaoVeracidade: false,
    autorizaVerificacao: false,
  });

  // ── localStorage persistence ──────────────────────────────────────────
  const STORAGE_KEY = "profissional_registo_form";

  // Restore form from localStorage on mount (when user returns from Stripe cancel)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          step: number;
          formData: FormData;
          fotoPreview: string;
        };
        setFormData(parsed.formData);
        setStep(parsed.step);
        if (parsed.fotoPreview) setFotoPreview(parsed.fotoPreview);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save form to localStorage on every change
  const persistForm = useCallback((data: FormData, currentStep: number, foto: string) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ step: currentStep, formData: data, fotoPreview: foto })
      );
    } catch {
      // Ignore quota errors
    }
  }, []);

  const [fotoPreview, setFotoPreview] = useState("");
  const [servicoInput, setServicoInput] = useState("");
  const [associacaoInput, setAssociacaoInput] = useState("");
  const [novaCertificacao, setNovaCertificacao] = useState<Certificacao>({
    nome: "",
    entidade: "",
    ano: "",
  });

  // Persist form on every change
  useEffect(() => {
    persistForm(formData, step, fotoPreview);
  }, [formData, step, fotoPreview, persistForm]);

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else if (type === "number") {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError("");
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(tp.error_photo_size);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError(tp.error_photo_type);
      return;
    }
    setError("");

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 400;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > MAX) {
            h = (h * MAX) / w;
            w = MAX;
          }
        } else {
          if (h > MAX) {
            w = (w * MAX) / h;
            h = MAX;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);
        const base64 = canvas.toDataURL("image/jpeg", 0.8);
        setFotoPreview(base64);
        setFormData((prev) => ({ ...prev, fotoBase64: base64 }));
      };
      img.onerror = () => setError(tp.error_photo_type);
      img.src = ev.target?.result as string;
    };
    reader.onerror = () => setError(tp.error_photo_type);
    reader.readAsDataURL(file);
  };

  const handleRemoveFoto = () => {
    setFotoPreview("");
    setFormData((prev) => ({ ...prev, fotoBase64: "" }));
  };

  const handleAddServico = () => {
    const trimmed = servicoInput.trim();
    if (trimmed && !formData.servicos.includes(trimmed)) {
      setFormData({ ...formData, servicos: [...formData.servicos, trimmed] });
      setServicoInput("");
    }
  };

  const handleRemoveServico = (s: string) => {
    setFormData({ ...formData, servicos: formData.servicos.filter((x) => x !== s) });
  };

  const handleAddAssociacao = () => {
    const trimmed = associacaoInput.trim();
    if (trimmed && !formData.associacoes.includes(trimmed)) {
      setFormData({ ...formData, associacoes: [...formData.associacoes, trimmed] });
      setAssociacaoInput("");
    }
  };

  const handleRemoveAssociacao = (a: string) => {
    setFormData({ ...formData, associacoes: formData.associacoes.filter((x) => x !== a) });
  };

  const handleAddCertificacao = () => {
    if (novaCertificacao.nome.trim() && novaCertificacao.entidade.trim()) {
      setFormData({
        ...formData,
        certificacoes: [...formData.certificacoes, { ...novaCertificacao }],
      });
      setNovaCertificacao({ nome: "", entidade: "", ano: "" });
    }
  };

  const handleRemoveCertificacao = (index: number) => {
    setFormData({
      ...formData,
      certificacoes: formData.certificacoes.filter((_, i) => i !== index),
    });
  };

  const handleToggleIdioma = (idioma: string) => {
    const has = formData.idiomas.includes(idioma);
    setFormData({
      ...formData,
      idiomas: has ? formData.idiomas.filter((i) => i !== idioma) : [...formData.idiomas, idioma],
    });
  };

  const handleToggleDia = (dia: string) => {
    const has = formData.disponibilidade.dias.includes(dia);
    setFormData({
      ...formData,
      disponibilidade: {
        ...formData.disponibilidade,
        dias: has
          ? formData.disponibilidade.dias.filter((d) => d !== dia)
          : [...formData.disponibilidade.dias, dia],
      },
    });
  };

  const handleDocumentoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (formData.documentos.length + files.length > 3) {
      setError(tp.error_max_documents);
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setError(`${tp.error_file_size_prefix}${file.name}${tp.error_file_size_suffix}`);
        return;
      }
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        setError(`${tp.error_file_type_prefix}${file.name}${tp.error_file_type_suffix}`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          documentos: [...prev.documentos, base64],
        }));
      };
      reader.onerror = () =>
        setError(`${tp.error_file_type_prefix}${file.name}${tp.error_file_type_suffix}`);
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleRemoveDocumento = (index: number) => {
    setFormData({
      ...formData,
      documentos: formData.documentos.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/profissionais/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || tp.error_generic);
      }

      if (data.url) {
        // Keep localStorage — user may cancel at Stripe and return
        // It's cleared on the success page after payment
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : tp.error_generic);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Validations ───────────────────────────────────────────────────────

  const isStep1Valid =
    formData.nome.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.telefone.trim() !== "" &&
    formData.categoria !== "" &&
    formData.anosExperiencia > 0;

  const isStep2Valid =
    formData.servicos.length >= 1 &&
    (formData.modalidade !== "presencial" || formData.distrito !== "");

  const isStep3Valid = formData.descricao.trim().length >= 100;

  const isStep4Valid =
    formData.aceitaTermos && formData.declaracaoVeracidade && formData.autorizaVerificacao;

  const categoriaLabel =
    categoriasOptions.find((c) => c.id === formData.categoria)?.label || formData.categoria;

  // ── Shared input class ────────────────────────────────────────────────

  const styles = {
    inputClass:
      "w-full bg-[var(--background-secondary)] border border-[var(--border)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--gold)] focus:outline-none",
    labelClass: "block text-sm text-[var(--foreground-secondary)] mb-2",
    sectionTitleClass: "text-[var(--gold)] text-sm font-medium mb-4 block",
  };

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
          <Link
            href="/profissionais"
            className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--gold)] transition-colors mb-6"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">{tp.back}</span>
          </Link>
          <span className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] block mb-4">
            {tp.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[var(--foreground)] mb-4">
            {tp.title}
          </h1>
          <p className="text-[var(--foreground-secondary)] max-w-xl mx-auto">
            {tp.subtitle_before_price}
            <strong className="text-[var(--gold)]"> {tp.subtitle_price}</strong>
          </p>
        </div>

        {/* Progress Steps - 4 steps */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-12">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.num} className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (s.num < step) setStep(s.num);
                  }}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    s.num < step ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      step > s.num
                        ? "bg-[var(--gold)] text-black"
                        : step === s.num
                          ? "bg-[var(--gold)]/20 border-2 border-[var(--gold)] text-[var(--gold)]"
                          : "bg-[var(--background-card)] text-[var(--foreground-muted)] border border-[var(--border)]"
                    }`}
                  >
                    {step > s.num ? <Check size={18} /> : <Icon size={18} />}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs hidden sm:block ${
                      step >= s.num ? "text-[var(--gold)]" : "text-[var(--foreground-muted)]"
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 transition-colors ${
                      step > s.num ? "bg-[var(--gold)]" : "bg-[var(--background-card)]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Error display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6" role="alert" aria-live="assertive">
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm rounded">
              {error}
            </div>
          </div>
        )}

        {/* Step Components */}
        {step === 1 && (
          <StepIdentificacao
            formData={formData}
            tp={tp}
            styles={styles}
            error={error}
            fotoPreview={fotoPreview}
            handleInputChange={handleInputChange}
            handleFotoChange={handleFotoChange}
            handleRemoveFoto={handleRemoveFoto}
            setFormData={setFormData}
            isStep1Valid={isStep1Valid}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepLocalizacao
            formData={formData}
            tp={tp}
            styles={styles}
            error={error}
            servicoInput={servicoInput}
            setServicoInput={setServicoInput}
            handleInputChange={handleInputChange}
            handleAddServico={handleAddServico}
            handleRemoveServico={handleRemoveServico}
            handleToggleIdioma={handleToggleIdioma}
            IDIOMAS_OPCOES={IDIOMAS_OPCOES}
            isStep2Valid={isStep2Valid}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepCredenciais
            formData={formData}
            tp={tp}
            styles={styles}
            error={error}
            novaCertificacao={novaCertificacao}
            setNovaCertificacao={setNovaCertificacao}
            associacaoInput={associacaoInput}
            setAssociacaoInput={setAssociacaoInput}
            handleInputChange={handleInputChange}
            handleAddCertificacao={handleAddCertificacao}
            handleRemoveCertificacao={handleRemoveCertificacao}
            handleAddAssociacao={handleAddAssociacao}
            handleRemoveAssociacao={handleRemoveAssociacao}
            handleToggleDia={handleToggleDia}
            handleDocumentoUpload={handleDocumentoUpload}
            handleRemoveDocumento={handleRemoveDocumento}
            setFormData={setFormData}
            DIAS_SEMANA={DIAS_SEMANA}
            isStep3Valid={isStep3Valid}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <StepConfirmacao
            formData={formData}
            tp={tp}
            styles={styles}
            error={error}
            fotoPreview={fotoPreview}
            categoriaLabel={categoriaLabel}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isStep4Valid={isStep4Valid}
            onBack={() => setStep(3)}
          />
        )}
      </div>
    </main>
  );
}

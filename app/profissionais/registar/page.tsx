"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import NextImage from "next/image";
import {
  Check,
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Camera,
  X,
  User,
  Award,
  CheckCircle,
  Plus,
  Trash2,
  FileText,
  Facebook,
  Linkedin,
} from "lucide-react";
import { categorias, distritos, modalidades } from "@/components/profissionais/constants";
import type { CategoriaProf, Modalidade } from "@/components/profissionais/types";
import { useLanguage } from "@/context/LanguageContext";

const categoriasOptions = categorias.filter((c) => c.id !== "todos") as {
  id: CategoriaProf;
  label: string;
  descricao: string;
}[];

const distritosOptions = distritos.filter((d) => d !== "Todos");

interface Certificacao {
  nome: string;
  entidade: string;
  ano: string;
}

interface FormData {
  // Passo 1
  fotoBase64: string;
  nome: string;
  email: string;
  telefone: string;
  categoria: CategoriaProf | "";
  modalidade: Modalidade;
  especialidade: string;
  anosExperiencia: number;
  // Passo 2
  pais: string;
  cidade: string;
  distrito: string;
  morada: string;
  codigoPostal: string;
  raioServico: number;
  aceitaDeslocacoes: boolean;
  servicos: string[];
  precoMedio: string;
  idiomas: string[];
  // Passo 3
  formacaoAcademica: string;
  certificacoes: Certificacao[];
  associacoes: string[];
  seguroProfissional: boolean;
  seguradora: string;
  disponibilidade: {
    dias: string[];
    horaInicio: string;
    horaFim: string;
  };
  emergencias24h: boolean;
  descricao: string;
  website: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  documentos: string[];
  // Passo 4
  aceitaTermos: boolean;
  declaracaoVeracidade: boolean;
  autorizaVerificacao: boolean;
}

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
      img.src = ev.target?.result as string;
    };
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

  const inputClass =
    "w-full bg-[var(--background-secondary)] border border-[var(--border)] px-4 py-3 text-[var(--foreground)] placeholder-[var(--foreground-muted)] focus:border-[var(--gold)] focus:outline-none";
  const labelClass = "block text-sm text-[var(--foreground-secondary)] mb-2";
  const sectionTitleClass = "text-[var(--gold)] text-sm font-medium mb-4 block";

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
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm rounded">
              {error}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* PASSO 1 - Identificação */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <h2 className="text-2xl font-serif text-[var(--foreground)] mb-6 text-center">
              {tp.heading_identity}
            </h2>

            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Foto de Perfil */}
              <div>
                <label className={labelClass}>{tp.photo_label}</label>
                <div className="flex items-center gap-4">
                  {fotoPreview ? (
                    <div className="relative">
                      <NextImage
                        src={fotoPreview}
                        alt="Preview"
                        width={80}
                        height={80}
                        unoptimized
                        className="w-20 h-20 rounded-xl object-cover border border-[var(--gold)]/30"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveFoto}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-[var(--background-secondary)] border border-[var(--border)] border-dashed rounded-xl flex items-center justify-center">
                      <Camera size={24} className="text-[var(--foreground-muted)]" />
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] text-sm text-[var(--foreground-secondary)] hover:border-[var(--gold)]/50 hover:text-[var(--foreground)] transition-colors cursor-pointer">
                      <Camera size={16} />
                      {fotoPreview ? tp.photo_change : tp.photo_choose}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFotoChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-[var(--foreground-muted)] mt-1">
                      {tp.photo_hint}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nome Completo */}
              <div>
                <label className={labelClass}>{tp.field_name}</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder={tp.field_name_placeholder}
                  className={inputClass}
                />
              </div>

              {/* Email + Telefone */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{tp.field_email}</label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={tp.field_email_placeholder}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{tp.field_phone}</label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                      size={18}
                    />
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      placeholder={tp.field_phone_placeholder}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className={labelClass}>{tp.field_category}</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">{tp.field_category_placeholder}</option>
                  {categoriasOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} - {c.descricao}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modalidade de Serviço */}
              <div>
                <label className={labelClass}>{tp.field_modality}</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {modalidades.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, modalidade: m.id }))}
                      className={`p-3 border rounded-lg text-left transition-all ${
                        formData.modalidade === m.id
                          ? "border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--foreground)]"
                          : "border-[var(--border)] text-[var(--foreground-muted)] hover:border-[var(--foreground-muted)]"
                      }`}
                    >
                      <span className="block text-sm font-medium">{m.label}</span>
                      <span className="block text-xs mt-1 opacity-70">{m.descricao}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Especialidade + Anos Experiência */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{tp.field_specialty}</label>
                  <input
                    type="text"
                    name="especialidade"
                    value={formData.especialidade}
                    onChange={handleInputChange}
                    placeholder={tp.field_specialty_placeholder}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>{tp.field_experience}</label>
                  <input
                    type="number"
                    name="anosExperiencia"
                    value={formData.anosExperiencia || ""}
                    onChange={handleInputChange}
                    placeholder={tp.field_experience_placeholder}
                    min={1}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Botão Continuar */}
              <div className="flex justify-end pt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={!isStep1Valid}
                  className="inline-flex items-center gap-2 bg-[var(--gold)] text-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tp.btn_continue}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* PASSO 2 - Localização e Serviços */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <h2 className="text-2xl font-serif text-[var(--foreground)] mb-6 text-center">
              {tp.heading_location}
            </h2>

            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Modalidade info banner */}
              <div className="p-3 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-lg text-sm text-[var(--foreground-secondary)]">
                {formData.modalidade === "presencial" && tp.modality_presencial_info}
                {formData.modalidade === "online" && tp.modality_online_info}
                {formData.modalidade === "clinicas_internacionais" &&
                  tp.modality_international_info}
              </div>

              {/* País (only for online) */}
              {formData.modalidade === "online" && (
                <div>
                  <label className={labelClass}>{tp.field_country}</label>
                  <div className="relative">
                    <Globe
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                      size={18}
                    />
                    <input
                      type="text"
                      name="pais"
                      value={formData.pais}
                      onChange={handleInputChange}
                      placeholder={tp.field_country_placeholder}
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              )}

              {/* Cidade + Distrito (presencial or online) */}
              {formData.modalidade !== "clinicas_internacionais" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{tp.field_city}</label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                        size={18}
                      />
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        placeholder={tp.field_city_placeholder}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      {formData.modalidade === "presencial"
                        ? tp.field_district_required
                        : tp.field_district}
                    </label>
                    <select
                      name="distrito"
                      value={formData.distrito}
                      onChange={handleInputChange}
                      className={inputClass}
                    >
                      <option value="">{tp.field_district_placeholder}</option>
                      {distritosOptions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Morada + Código Postal (only presencial) */}
              {formData.modalidade === "presencial" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{tp.field_address}</label>
                    <input
                      type="text"
                      name="morada"
                      value={formData.morada}
                      onChange={handleInputChange}
                      placeholder={tp.field_address_placeholder}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{tp.field_postal_code}</label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleInputChange}
                      placeholder={tp.field_postal_code_placeholder}
                      className={inputClass}
                    />
                  </div>
                </div>
              )}

              {/* Raio de Serviço + Deslocações (only presencial) */}
              {formData.modalidade === "presencial" && (
                <div className="grid md:grid-cols-2 gap-4 items-end">
                  <div>
                    <label className={labelClass}>{tp.field_service_radius}</label>
                    <input
                      type="number"
                      name="raioServico"
                      value={formData.raioServico || ""}
                      onChange={handleInputChange}
                      placeholder={tp.field_service_radius_placeholder}
                      min={0}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex items-center gap-3 py-3">
                    <input
                      type="checkbox"
                      name="aceitaDeslocacoes"
                      checked={formData.aceitaDeslocacoes}
                      onChange={handleInputChange}
                      id="aceitaDeslocacoes"
                      className="w-4 h-4 accent-[#C5A059]"
                    />
                    <label
                      htmlFor="aceitaDeslocacoes"
                      className="text-sm text-[var(--foreground-secondary)]"
                    >
                      {tp.field_accepts_travel}
                    </label>
                  </div>
                </div>
              )}

              {/* Serviços Oferecidos */}
              <div className="pt-4 border-t border-[var(--border)]">
                <span className={sectionTitleClass}>{tp.section_services}</span>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={servicoInput}
                    onChange={(e) => setServicoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddServico();
                      }
                    }}
                    placeholder={tp.field_service_placeholder}
                    className={`flex-1 ${inputClass}`}
                  />
                  <button
                    type="button"
                    onClick={handleAddServico}
                    className="px-4 py-3 bg-[var(--gold)] text-black text-sm font-medium hover:bg-[var(--gold-hover)] transition-colors"
                  >
                    {tp.btn_add}
                  </button>
                </div>
                {formData.servicos.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.servicos.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--background-card)] text-sm text-[var(--foreground-secondary)] border border-[var(--border)]"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => handleRemoveServico(s)}
                          className="text-[var(--foreground-muted)] hover:text-red-400 ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {formData.servicos.length === 0 && (
                  <p className="text-xs text-[var(--foreground-muted)]">{tp.services_min_hint}</p>
                )}
              </div>

              {/* Preço Médio */}
              <div>
                <label className={labelClass}>{tp.field_average_price}</label>
                <input
                  type="text"
                  name="precoMedio"
                  value={formData.precoMedio}
                  onChange={handleInputChange}
                  placeholder={tp.field_average_price_placeholder}
                  className={inputClass}
                />
              </div>

              {/* Idiomas */}
              <div>
                <label className={labelClass}>{tp.field_languages}</label>
                <div className="flex flex-wrap gap-3">
                  {IDIOMAS_OPCOES.map((idioma) => (
                    <label key={idioma} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.idiomas.includes(idioma)}
                        onChange={() => handleToggleIdioma(idioma)}
                        className="w-4 h-4 accent-[#C5A059]"
                      />
                      <span className="text-sm text-[var(--foreground-secondary)]">{idioma}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                >
                  <ArrowLeft size={18} />
                  {tp.btn_back}
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!isStep2Valid}
                  className="inline-flex items-center gap-2 bg-[var(--gold)] text-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tp.btn_continue}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* PASSO 3 - Credenciais e Presença */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <h2 className="text-2xl font-serif text-[var(--foreground)] mb-6 text-center">
              {tp.heading_credentials}
            </h2>

            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Formação Académica */}
              <div>
                <label className={labelClass}>{tp.field_education}</label>
                <input
                  type="text"
                  name="formacaoAcademica"
                  value={formData.formacaoAcademica}
                  onChange={handleInputChange}
                  placeholder={tp.field_education_placeholder}
                  className={inputClass}
                />
              </div>

              {/* Certificações */}
              <div className="pt-4 border-t border-[var(--border)]">
                <span className={sectionTitleClass}>{tp.section_certifications}</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                  <input
                    type="text"
                    value={novaCertificacao.nome}
                    onChange={(e) =>
                      setNovaCertificacao({ ...novaCertificacao, nome: e.target.value })
                    }
                    placeholder={tp.field_cert_name_placeholder}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={novaCertificacao.entidade}
                    onChange={(e) =>
                      setNovaCertificacao({ ...novaCertificacao, entidade: e.target.value })
                    }
                    placeholder={tp.field_cert_entity_placeholder}
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={novaCertificacao.ano}
                      onChange={(e) =>
                        setNovaCertificacao({ ...novaCertificacao, ano: e.target.value })
                      }
                      placeholder={tp.field_cert_year_placeholder}
                      className={`flex-1 ${inputClass}`}
                    />
                    <button
                      type="button"
                      onClick={handleAddCertificacao}
                      className="px-3 py-2 bg-[var(--gold)] text-black hover:bg-[var(--gold-hover)] transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                {formData.certificacoes.length > 0 && (
                  <div className="space-y-2">
                    {formData.certificacoes.map((cert, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-2 bg-[var(--background-card)] border border-[var(--border)] text-sm"
                      >
                        <span className="text-[var(--foreground-secondary)]">
                          {cert.nome} — {cert.entidade} {cert.ano && `(${cert.ano})`}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCertificacao(i)}
                          className="text-[var(--foreground-muted)] hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Associações Profissionais */}
              <div>
                <label className={labelClass}>{tp.field_associations}</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={associacaoInput}
                    onChange={(e) => setAssociacaoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAssociacao();
                      }
                    }}
                    placeholder={tp.field_associations_placeholder}
                    className={`flex-1 ${inputClass}`}
                  />
                  <button
                    type="button"
                    onClick={handleAddAssociacao}
                    className="px-4 py-3 bg-[var(--gold)] text-black text-sm font-medium hover:bg-[var(--gold-hover)] transition-colors"
                  >
                    {tp.btn_add}
                  </button>
                </div>
                {formData.associacoes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.associacoes.map((a) => (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[var(--background-card)] text-sm text-[var(--foreground-secondary)] border border-[var(--border)]"
                      >
                        {a}
                        <button
                          type="button"
                          onClick={() => handleRemoveAssociacao(a)}
                          className="text-[var(--foreground-muted)] hover:text-red-400 ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Seguro Profissional */}
              <div className="grid md:grid-cols-2 gap-4 items-end">
                <div className="flex items-center gap-3 py-3">
                  <input
                    type="checkbox"
                    name="seguroProfissional"
                    checked={formData.seguroProfissional}
                    onChange={handleInputChange}
                    id="seguroProfissional"
                    className="w-4 h-4 accent-[#C5A059]"
                  />
                  <label
                    htmlFor="seguroProfissional"
                    className="text-sm text-[var(--foreground-secondary)]"
                  >
                    {tp.field_insurance}
                  </label>
                </div>
                {formData.seguroProfissional && (
                  <div>
                    <label className={labelClass}>{tp.field_insurer}</label>
                    <input
                      type="text"
                      name="seguradora"
                      value={formData.seguradora}
                      onChange={handleInputChange}
                      placeholder={tp.field_insurer_placeholder}
                      className={inputClass}
                    />
                  </div>
                )}
              </div>

              {/* Disponibilidade */}
              <div className="pt-4 border-t border-[var(--border)]">
                <span className={sectionTitleClass}>{tp.section_availability}</span>
                <div className="flex flex-wrap gap-2 mb-4">
                  {DIAS_SEMANA.map((dia) => (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => handleToggleDia(dia)}
                      className={`px-3 py-1.5 text-xs border transition-colors ${
                        formData.disponibilidade.dias.includes(dia)
                          ? "bg-[var(--gold)]/20 border-[var(--gold)] text-[var(--gold)]"
                          : "bg-[var(--background-card)] border-[var(--border)] text-[var(--foreground-muted)]"
                      }`}
                    >
                      {dia}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={labelClass}>{tp.field_start_time}</label>
                    <input
                      type="time"
                      value={formData.disponibilidade.horaInicio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          disponibilidade: {
                            ...formData.disponibilidade,
                            horaInicio: e.target.value,
                          },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{tp.field_end_time}</label>
                    <input
                      type="time"
                      value={formData.disponibilidade.horaFim}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          disponibilidade: { ...formData.disponibilidade, horaFim: e.target.value },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="emergencias24h"
                    checked={formData.emergencias24h}
                    onChange={handleInputChange}
                    id="emergencias24h"
                    className="w-4 h-4 accent-[#C5A059]"
                  />
                  <label
                    htmlFor="emergencias24h"
                    className="text-sm text-[var(--foreground-secondary)]"
                  >
                    {tp.field_emergencies}
                  </label>
                </div>
              </div>

              {/* Descrição Completa */}
              <div className="pt-4 border-t border-[var(--border)]">
                <label className={labelClass}>
                  {tp.field_description}{" "}
                  <span className="text-[var(--foreground-muted)]">{tp.field_description_min}</span>
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  placeholder={tp.field_description_placeholder}
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
                <p
                  className={`text-xs mt-1 ${formData.descricao.length >= 100 ? "text-green-400" : "text-[var(--foreground-muted)]"}`}
                >
                  {formData.descricao.length}/100 {tp.field_description_count}
                </p>
              </div>

              {/* Redes Sociais */}
              <div className="pt-4 border-t border-[var(--border)]">
                <span className={sectionTitleClass}>{tp.section_online_presence}</span>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{tp.field_website}</label>
                    <div className="relative">
                      <Globe
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                        size={18}
                      />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder={tp.field_website_placeholder}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{tp.field_instagram}</label>
                    <div className="relative">
                      <Instagram
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                        size={18}
                      />
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        placeholder={tp.field_instagram_placeholder}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{tp.field_facebook}</label>
                    <div className="relative">
                      <Facebook
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                        size={18}
                      />
                      <input
                        type="url"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        placeholder={tp.field_facebook_placeholder}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>{tp.field_linkedin}</label>
                    <div className="relative">
                      <Linkedin
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]"
                        size={18}
                      />
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder={tp.field_linkedin_placeholder}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documentos Comprovativos */}
              <div className="pt-4 border-t border-[var(--border)]">
                <span className={sectionTitleClass}>{tp.section_documents}</span>
                <p className="text-xs text-[var(--foreground-muted)] mb-3">{tp.documents_hint}</p>
                {formData.documentos.length < 3 && (
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--background-secondary)] border border-[var(--border)] text-sm text-[var(--foreground-secondary)] hover:border-[var(--gold)]/50 hover:text-[var(--foreground)] transition-colors cursor-pointer mb-3">
                    <FileText size={16} />
                    {tp.btn_select_file}
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleDocumentoUpload}
                      className="hidden"
                    />
                  </label>
                )}
                {formData.documentos.length > 0 && (
                  <div className="space-y-2">
                    {formData.documentos.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-2 bg-[var(--background-card)] border border-[var(--border)] text-sm"
                      >
                        <span className="text-[var(--foreground-secondary)]">
                          <FileText size={14} className="inline mr-2" />
                          {tp.document_label} {i + 1} (
                          {doc.startsWith("data:image") ? tp.document_image : tp.document_pdf})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDocumento(i)}
                          className="text-[var(--foreground-muted)] hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Botões */}
              <div className="flex justify-between pt-6">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                >
                  <ArrowLeft size={18} />
                  {tp.btn_back}
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!isStep3Valid}
                  className="inline-flex items-center gap-2 bg-[var(--gold)] text-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tp.btn_continue}
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* PASSO 4 - Termos e Pagamento */}
        {/* ════════════════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className="opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]">
            <h2 className="text-2xl font-serif text-[var(--foreground)] mb-6 text-center">
              {tp.heading_confirm}
            </h2>

            <div className="max-w-2xl mx-auto">
              {/* Resumo Completo */}
              <div className="bg-[var(--background-secondary)]/50 border border-[var(--border)] p-6 mb-6">
                <h3 className="text-lg font-medium text-[var(--foreground)] mb-4">
                  {tp.summary_title}
                </h3>

                {/* Identificação */}
                <div className="mb-4">
                  <span className={sectionTitleClass}>{tp.heading_identity}</span>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--foreground-muted)]">{tp.summary_name}</span>
                      <div className="flex items-center gap-3">
                        {fotoPreview && (
                          <NextImage
                            src={fotoPreview}
                            alt={formData.nome}
                            width={32}
                            height={32}
                            unoptimized
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        )}
                        <span className="text-[var(--foreground)]">{formData.nome}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">{tp.summary_email}</span>
                      <span className="text-[var(--foreground)]">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">{tp.summary_phone}</span>
                      <span className="text-[var(--foreground)]">{formData.telefone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">{tp.summary_category}</span>
                      <span className="text-[var(--foreground)]">{categoriaLabel}</span>
                    </div>
                    {formData.especialidade && (
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">
                          {tp.summary_specialty}
                        </span>
                        <span className="text-[var(--foreground)]">{formData.especialidade}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">
                        {tp.summary_experience}
                      </span>
                      <span className="text-[var(--foreground)]">
                        {formData.anosExperiencia} {tp.summary_experience_suffix}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Localização */}
                <div className="mb-4 pt-4 border-t border-[var(--border)]/50">
                  <span className={sectionTitleClass}>{tp.summary_section_location}</span>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--foreground-muted)]">{tp.summary_modality}</span>
                      <span className="text-[var(--foreground)]">
                        {modalidades.find((m) => m.id === formData.modalidade)?.label ||
                          formData.modalidade}
                      </span>
                    </div>
                    {(formData.distrito || formData.cidade || formData.pais) && (
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">
                          {tp.summary_location}
                        </span>
                        <span className="text-[var(--foreground)]">
                          {formData.modalidade === "clinicas_internacionais"
                            ? tp.summary_international
                            : formData.modalidade === "online"
                              ? formData.pais || tp.summary_online
                              : `${formData.cidade ? `${formData.cidade}, ` : ""}${formData.distrito}`}
                        </span>
                      </div>
                    )}
                    {formData.morada && (
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">{tp.summary_address}</span>
                        <span className="text-[var(--foreground)]">{formData.morada}</span>
                      </div>
                    )}
                    {formData.raioServico > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">{tp.summary_radius}</span>
                        <span className="text-[var(--foreground)]">{formData.raioServico} km</span>
                      </div>
                    )}
                    {formData.aceitaDeslocacoes && (
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">{tp.summary_travel}</span>
                        <span className="text-green-400">{tp.summary_yes}</span>
                      </div>
                    )}
                    {formData.servicos.length > 0 && (
                      <div>
                        <span className="text-[var(--foreground-muted)] block mb-1">
                          {tp.summary_services}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {formData.servicos.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 bg-[var(--background-card)] text-xs text-[var(--foreground-secondary)] border border-[var(--border)]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.idiomas.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">
                          {tp.summary_languages}
                        </span>
                        <span className="text-[var(--foreground)]">
                          {formData.idiomas.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Credenciais */}
                <div className="pt-4 border-t border-[var(--border)]/50">
                  <span className={sectionTitleClass}>{tp.summary_section_credentials}</span>
                  <div className="space-y-2 text-sm">
                    {formData.formacaoAcademica && (
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">
                          {tp.summary_education}
                        </span>
                        <span className="text-[var(--foreground)]">
                          {formData.formacaoAcademica}
                        </span>
                      </div>
                    )}
                    {formData.certificacoes.length > 0 && (
                      <div>
                        <span className="text-[var(--foreground-muted)] block mb-1">
                          {tp.summary_certifications}
                        </span>
                        {formData.certificacoes.map((c, i) => (
                          <p key={i} className="text-[var(--foreground-secondary)] text-xs ml-2">
                            {c.nome} — {c.entidade} {c.ano && `(${c.ano})`}
                          </p>
                        ))}
                      </div>
                    )}
                    {formData.seguroProfissional && (
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">
                          {tp.summary_insurance}
                        </span>
                        <span className="text-green-400">
                          {tp.summary_yes}
                          {formData.seguradora ? ` (${formData.seguradora})` : ""}
                        </span>
                      </div>
                    )}
                    {formData.emergencias24h && (
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">
                          {tp.summary_emergencies}
                        </span>
                        <span className="text-green-400">{tp.summary_yes}</span>
                      </div>
                    )}
                    {formData.documentos.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-[var(--foreground-muted)]">
                          {tp.summary_documents}
                        </span>
                        <span className="text-[var(--foreground)]">
                          {formData.documentos.length} {tp.summary_documents_suffix}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Plano */}
              <div className="bg-[var(--gold)]/10 border border-[var(--gold)]/30 p-6 mb-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="text-[var(--gold)]" size={24} />
                  <h3 className="text-lg font-medium text-[var(--foreground)]">
                    {tp.subscription_title}
                  </h3>
                </div>
                <div className="space-y-2 text-sm text-[var(--foreground-secondary)]">
                  <p>{tp.subscription_benefit_1}</p>
                  <p>{tp.subscription_benefit_2}</p>
                  <p>{tp.subscription_benefit_3}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--gold)]/20">
                  <span className="text-2xl font-bold text-[var(--gold)]">
                    {tp.subscription_price}
                  </span>
                  <span className="text-[var(--foreground-muted)]">{tp.subscription_period}</span>
                </div>
              </div>

              {/* Termos Obrigatórios */}
              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="aceitaTermos"
                    checked={formData.aceitaTermos}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-0.5 accent-[#C5A059]"
                  />
                  <span className="text-sm text-[var(--foreground-secondary)]">
                    {tp.terms_accept}
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="declaracaoVeracidade"
                    checked={formData.declaracaoVeracidade}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-0.5 accent-[#C5A059]"
                  />
                  <span className="text-sm text-[var(--foreground-secondary)]">
                    {tp.terms_truthfulness}
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="autorizaVerificacao"
                    checked={formData.autorizaVerificacao}
                    onChange={handleInputChange}
                    className="w-4 h-4 mt-0.5 accent-[#C5A059]"
                  />
                  <span className="text-sm text-[var(--foreground-secondary)]">
                    {tp.terms_verification}
                  </span>
                </label>
              </div>

              {/* Info */}
              <p className="text-xs text-[var(--foreground-muted)] mb-6">{tp.info_after_payment}</p>

              {/* Botões */}
              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
                >
                  <ArrowLeft size={18} />
                  {tp.btn_back}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !isStep4Valid}
                  className="inline-flex items-center gap-2 bg-[var(--gold)] text-black px-8 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      {tp.btn_processing}
                    </>
                  ) : (
                    <>
                      {tp.btn_subscribe}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

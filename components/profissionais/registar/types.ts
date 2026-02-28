import type { CategoriaProf, Modalidade } from "@/components/profissionais/types";

// =============================================================================
// TYPES - Registration Form Steps
// =============================================================================

export interface Certificacao {
  nome: string;
  entidade: string;
  ano: string;
}

export interface FormData {
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

/** Translation object for the registration page */
export type RegistarTranslations = {
  [key: string]: string;
};

/** Shared CSS class names passed from the page to step components */
export interface SharedStyles {
  inputClass: string;
  labelClass: string;
  sectionTitleClass: string;
}

/** Base props shared by all step components */
interface BaseStepProps {
  formData: FormData;
  tp: RegistarTranslations;
  styles: SharedStyles;
  error: string;
}

/** Props for Step 1 - Identificacao */
export interface StepIdentificacaoProps extends BaseStepProps {
  fotoPreview: string;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleFotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFoto: () => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isStep1Valid: boolean;
  onNext: () => void;
}

/** Props for Step 2 - Localizacao */
export interface StepLocalizacaoProps extends BaseStepProps {
  servicoInput: string;
  setServicoInput: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleAddServico: () => void;
  handleRemoveServico: (s: string) => void;
  handleToggleIdioma: (idioma: string) => void;
  IDIOMAS_OPCOES: string[];
  isStep2Valid: boolean;
  onNext: () => void;
  onBack: () => void;
}

/** Props for Step 3 - Credenciais */
export interface StepCredenciaisProps extends BaseStepProps {
  novaCertificacao: Certificacao;
  setNovaCertificacao: React.Dispatch<React.SetStateAction<Certificacao>>;
  associacaoInput: string;
  setAssociacaoInput: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleAddCertificacao: () => void;
  handleRemoveCertificacao: (index: number) => void;
  handleAddAssociacao: () => void;
  handleRemoveAssociacao: (a: string) => void;
  handleToggleDia: (dia: string) => void;
  handleDocumentoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveDocumento: (index: number) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  DIAS_SEMANA: string[];
  isStep3Valid: boolean;
  onNext: () => void;
  onBack: () => void;
}

/** Props for Step 4 - Confirmacao */
export interface StepConfirmacaoProps extends BaseStepProps {
  fotoPreview: string;
  categoriaLabel: string;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  isStep4Valid: boolean;
  onBack: () => void;
}

export interface FormData {
  // Dados do Proprietario
  proprietario_nome: string;
  proprietario_email: string;
  proprietario_telefone: string;
  proprietario_nif: string;
  proprietario_morada: string;

  // Identificacao do Cavalo
  nome: string;
  nome_registo: string;
  numero_registo: string;
  microchip: string;
  passaporte_equino: string;

  // Linhagem
  pai_nome: string;
  pai_registo: string;
  mae_nome: string;
  mae_registo: string;
  coudelaria_origem: string;

  // Caracteristicas
  data_nascimento: string;
  sexo: string;
  pelagem: string;
  altura: string;

  // Treino e Competicao
  nivel_treino: string;
  disciplinas: string[];
  competicoes: string;
  premios: string;

  // Saude
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

  // Descricao
  descricao: string;
  videos_url: string;
}

export interface Documentos {
  livroAzul?: File;
  passaporte?: File;
  exameVet?: File;
}

export type DocumentType = keyof Documentos;

export interface StepProps {
  formData: FormData;
  updateField: (field: keyof FormData, value: FormData[keyof FormData]) => void;
}

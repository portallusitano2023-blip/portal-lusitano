export interface FormData {
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

export interface Documentos {
  livroAzul?: File;
  passaporte?: File;
  exameVet?: File;
}

export const initialFormData: FormData = {
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

export const pelagens = [
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

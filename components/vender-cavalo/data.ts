import type { FormData } from "@/components/vender-cavalo/types";

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

export const niveisTreino = [
  "Potro (sem desbaste)",
  "Desbravado",
  "Iniciado",
  "Intermédio",
  "Avançado",
  "Alta Escola",
  "Competição",
];

export const disciplinasOpcoes = [
  "Dressage",
  "Equitação de Trabalho",
  "Toureio",
  "Atrelagem",
  "Saltos",
  "Lazer",
  "Reprodução",
  "Ensino",
];

export const disponibilidades = [
  "Imediata",
  "Após acordo",
  "Fins de semana",
  "Dias úteis",
  "Por marcação",
];

export const PRECO_ANUNCIO = 49;
export const PRECO_DESTAQUE = 29;

export const TOTAL_STEPS = 4;
export const MAX_IMAGES = 10;
export const MIN_IMAGES = 3;
export const MIN_DESCRIPTION_LENGTH = 100;

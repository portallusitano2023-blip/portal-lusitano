import type { FormData } from "@/components/vender-cavalo/types";

export const initialFormData: FormData = {
  // Proprietário
  proprietario_nome: "",
  proprietario_email: "",
  proprietario_telefone: "",
  proprietario_whatsapp: "",
  proprietario_nif: "",
  proprietario_morada: "",
  tipo_proprietario: "",
  pais_proprietario: "",
  website_coudelaria: "",
  // Identificação
  nome: "",
  nome_registo: "",
  numero_registo: "",
  microchip: "",
  passaporte_equino: "",
  raca_confirmada: "",
  pais_nascimento: "",
  peso: "",
  cor_olhos: "",
  cor_crina: "",
  nivel_apsl: "",
  // Linhagem
  pai_nome: "",
  pai_registo: "",
  mae_nome: "",
  mae_registo: "",
  avo_paterno_nome: "",
  avo_paterno_registo: "",
  avo_paterno_mae_nome: "",
  avo_paterno_mae_registo: "",
  avo_materno_nome: "",
  avo_materno_registo: "",
  avo_materno_mae_nome: "",
  avo_materno_mae_registo: "",
  linhagem_principal: "",
  coudelaria_origem: "",
  // Características
  data_nascimento: "",
  sexo: "",
  pelagem: "",
  altura: "",
  temperamento: "",
  marcas_distintivas: "",
  cor_casco: "",
  prova_aptidao_apsl: false,
  // Comportamento
  habituado_transporte: false,
  habituado_ferrador: false,
  habituado_veterinario: false,
  trabalha_em_grupo: false,
  trabalha_solto: false,
  trabalha_a_mao: false,
  habituado_campo: false,
  apto_criancas: false,
  // Maneio
  regime_estabulacao: "",
  tipo_alimentacao: "",
  horas_trabalho_semana: "",
  teste_dna_realizado: false,
  seguro_equino: false,
  // Treino
  nivel_treino: "",
  anos_treino: "",
  nivel_cavaleiro: "",
  treinador_atual: "",
  ginete_habitual: "",
  uso_atual: [],
  disciplinas: [],
  competicoes: "",
  premios: "",
  // Saúde
  estado_saude: "",
  vacinacao_atualizada: false,
  data_ultima_vacinacao: "",
  desparasitacao_atualizada: false,
  data_ultima_desparasitacao: "",
  exame_veterinario: false,
  radiografias_disponivel: false,
  piroplasmose_testado: false,
  data_ultima_ferragem: "",
  tipo_ferragem: "",
  nome_veterinario: "",
  historico_lesoes: "",
  observacoes_saude: "",
  // Venda
  preco: "",
  negociavel: false,
  aceita_troca: false,
  transporte_incluido: false,
  trial_possivel: false,
  duracao_trial: "",
  financiamento_possivel: false,
  exportacao_possivel: false,
  acompanhamento_pos_venda: false,
  disponivel_cobricao: false,
  preco_cobricao: "",
  regiao: "",
  localizacao: "",
  disponibilidade_visita: "",
  motivo_venda: "",
  aceita_visita_veterinario: false,
  equipamento_incluido: "",
  // Apresentação
  descricao: "",
  videos_url: "",
  videos_url_2: "",
  internato_possivel: false,
  aulas_incluidas: false,
};

export const tiposProprietario = [
  "Particular",
  "Coudelaria",
  "Marchante / Comerciante",
  "Leiloeiro",
  "Clube / Escola de Equitação",
];

export const paisesOpcoes = [
  "Portugal",
  "Espanha",
  "Brasil",
  "França",
  "Alemanha",
  "Reino Unido",
  "Holanda",
  "Bélgica",
  "Itália",
  "EUA",
  "Outro",
];

export const usosAtuais = [
  "Dressage",
  "Equitação de Trabalho",
  "Toureio",
  "Atrelagem",
  "Saltos",
  "Passeio / Lazer",
  "Reprodução",
  "Ensino / Escola",
  "Alta Escola",
  "Endurance",
];

export const regimesEstabulacao = [
  "Estábulo (box individual)",
  "Paddock individual",
  "Pastagem / campo aberto",
  "Misto (box + campo)",
  "Coudelaria coletiva",
];

export const tiposAlimentacao = [
  "Feno + concentrado",
  "Pastagem natural",
  "Pastagem + concentrado",
  "Feno + aveia",
  "Ração completa",
  "Dieta personalizada",
];

export const motivosVenda = [
  "Excesso de cavalos na coudelaria",
  "Mudança de disciplina",
  "Mudança de vida / situação pessoal",
  "Razões económicas",
  "Reforma do cavalo",
  "Incompatibilidade cavaleiro-cavalo",
  "Outro",
];

export const coresCrina = [
  "Loura",
  "Escura",
  "Prateada",
  "Mista (loura e escura)",
];

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

export const linhagensPrincipais = [
  "Veiga",
  "Andrade",
  "Coudelaria Nacional",
  "Alter Real",
  "Interagro",
  "Mistas",
];

export const tiposFerragemOpcoes = [
  "Ferrado (4 ferros)",
  "Ferrado (anterior)",
  "Ferrado (posterior)",
  "Descalço",
  "Com borrachas",
  "Misto",
];

export const coresOlhos = ["Castanho", "Âmbar", "Azul", "Heterocromia"];

export const coresCasco = ["Escuro", "Branco", "Misto (escuro e branco)", "Listado"];

export const temperamentosOpcoes = ["Calmo", "Sensível", "Energético", "Difícil"];

export const niveisCavaleiro = [
  "Principiante",
  "Intermédio",
  "Avançado",
  "Profissional / Competidor",
];

export const duracoesTrialOpcoes = [
  "1 semana",
  "2 semanas",
  "1 mês",
  "A combinar",
];

export const regioesPT = [
  "Aveiro",
  "Beja",
  "Braga",
  "Bragança",
  "Castelo Branco",
  "Coimbra",
  "Évora",
  "Faro",
  "Guarda",
  "Leiria",
  "Lisboa",
  "Portalegre",
  "Porto",
  "Santarém",
  "Setúbal",
  "Viana do Castelo",
  "Vila Real",
  "Viseu",
  "Açores",
  "Madeira",
];

export const TOTAL_STEPS = 4;
export const MIN_IMAGES = 3;
export const MIN_DESCRIPTION_LENGTH = 100;

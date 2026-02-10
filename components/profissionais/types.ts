// =============================================================================
// TIPOS E INTERFACES - Profissionais
// =============================================================================

export type NivelVerificacao = "basico" | "verificado" | "certificado" | "expert";
export type NivelExpertise = "iniciante" | "intermedio" | "avancado" | "especialista";
export type CategoriaProf =
  | "veterinario"
  | "ferrador"
  | "treinador"
  | "fotografo"
  | "tosquiador"
  | "dentista"
  | "quiropratico"
  | "nutricionista"
  | "transportador"
  | "juiz"
  | "inseminador"
  | "instrutor"
  | "seleiro"
  | "massagista";

export interface Especializacao {
  nome: string;
  nivel: NivelExpertise;
  certificado?: string;
  anoObtencao?: number;
  instituicao?: string;
}

export interface Testemunho {
  cliente: string;
  texto: string;
  data: string;
  avaliacao: number;
  verificado?: boolean;
  cavalo?: string;
}

export interface CasoSucesso {
  titulo: string;
  descricao: string;
  resultado: string;
  data: string;
  imagens?: number;
  destaque?: boolean;
}

export interface Formacao {
  titulo: string;
  instituicao: string;
  ano: number;
  tipo: "licenciatura" | "mestrado" | "doutoramento" | "certificacao" | "workshop" | "curso";
}

export interface Publicacao {
  titulo: string;
  revista?: string;
  ano: number;
  tipo: "artigo" | "livro" | "video" | "podcast";
  link?: string;
}

export interface Premio {
  titulo: string;
  ano: number;
  entidade: string;
}

export interface MetricasPerformance {
  tempoResposta: string;
  taxaSatisfacao: number;
  casosConcluidosAno: number;
  clientesRecorrentes: number;
  recomendacoes: number;
  anosAtivo: number;
  cavalosAtendidos: number;
  emergenciasAtendidas?: number;
}

export interface Disponibilidade {
  diasSemana: string[];
  horaInicio: string;
  horaFim: string;
  emergencias24h: boolean;
  raioServico: number;
  deslocacaoIncluida?: boolean;
  consultaOnline?: boolean;
  listaEspera?: string;
}

export interface RedesSociais {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  linkedin?: string;
  website?: string;
}

export interface Equipamento {
  nome: string;
  descricao: string;
}

export interface CursoOferecido {
  titulo: string;
  duracao: string;
  preco: string;
  proximaData?: string;
  vagas?: number;
}

export interface Profissional {
  id: string;
  nome: string;
  titulo: string;
  especialidade: string;
  categoria: CategoriaProf;
  localizacao: string;
  distrito: string;
  telefone: string;
  email: string;
  descricao: string;
  avaliacao: number;
  numAvaliacoes: number;
  servicos: string[];
  nivelVerificacao: NivelVerificacao;
  experienciaAnos: number;
  especializacoes: Especializacao[];
  credenciais: string[];
  testemunhos?: Testemunho[];
  casosSucesso?: CasoSucesso[];
  metricas: MetricasPerformance;
  disponibilidade: Disponibilidade;
  precoMedio?: string;
  idiomas: string[];
  associacoes: string[];
  formacao?: Formacao[];
  publicacoes?: Publicacao[];
  premios?: Premio[];
  redesSociais?: RedesSociais;
  equipamento?: Equipamento[];
  cursosOferecidos?: CursoOferecido[];
  seguroProfissional?: boolean;
  nif?: string;
  destaque?: boolean;
  disponivel?: boolean;
  ultimaAtividade?: string;
  fotoUrl?: string;
}

export interface Evento {
  id: string;
  titulo: string;
  tipo: "clinica" | "workshop" | "conferencia" | "curso" | "webinar";
  data: string;
  local: string;
  organizador: string;
  preco?: string;
  vagas?: number;
  descricao: string;
}

export interface ArtigoEducativo {
  id: string;
  titulo: string;
  autor: string;
  categoria: string;
  resumo: string;
  data: string;
  leituras: number;
}

export interface EstatisticasComunidade {
  totalProfissionais: number;
  profissionaisVerificados: number;
  avaliacoesTotal: number;
  mediaAvaliacoes: number;
  casosResolvidos: number;
  clientesSatisfeitos: number;
  anunciosAtivos: number;
  eventosProximos: number;
}

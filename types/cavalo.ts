/** Cavalo no marketplace (tipo completo) */
export interface Cavalo {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  sexo: string;
  idade: number;
  cor: string;
  altura: number;
  linhagem?: string;
  pai?: string;
  mae?: string;
  nivel_treino: string;
  disciplinas: string[];
  premios?: string[];
  caracteristicas?: string[];
  preco: number;
  preco_negociavel: boolean;
  preco_sob_consulta: boolean;
  coudelaria_id?: string;
  vendedor_nome?: string;
  vendedor_telefone?: string;
  vendedor_email?: string;
  vendedor_whatsapp?: string;
  localizacao: string;
  regiao: string;
  foto_principal?: string;
  fotos?: string[];
  video_url?: string;
  registro_apsl?: string;
  destaque: boolean;
  coudelarias?: {
    nome: string;
    slug: string;
  };
}

/** Cavalo na área admin (com campos de gestão) */
export interface CavaloAdmin {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  sexo: string;
  idade: number;
  cor: string;
  altura: number;
  linhagem?: string;
  nivel_treino: string;
  preco: number;
  preco_sob_consulta: boolean;
  localizacao: string;
  regiao: string;
  destaque: boolean;
  status: string;
  views_count: number;
}

/** Cavalo à venda (página de detalhe) */
export interface CavaloVenda {
  id: string;
  nome_cavalo: string;
  preco: number;
  idade: number;
  localizacao: string;
  linhagem: string;
  descricao: string;
  image_url: string;
  pai?: string;
  mae?: string;
  pontuacao_apsl?: number;
}

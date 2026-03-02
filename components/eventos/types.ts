export interface Evento {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  descricao_completa?: string;
  tipo: string;
  data_inicio: string;
  data_fim?: string;
  hora_inicio?: string;
  hora_fim?: string;
  localizacao: string;
  regiao?: string;
  organizador?: string;
  website?: string;
  preco_entrada?: string;
  imagem_capa?: string;
  tags?: string[];
  destaque: boolean;
  confirmado?: "confirmado" | "anual" | "provisorio";
  views_count?: number;
}

/** Review completa (usada no admin) */
export interface Review {
  id: string;
  coudelaria_id?: string;
  ferramenta_slug?: string;
  autor_nome: string;
  autor_email?: string;
  autor_localizacao?: string;
  avaliacao: number;
  titulo?: string;
  comentario: string;
  data_visita?: string;
  tipo_visita?: string;
  recomenda: boolean;
  status?: string;
  created_at: string;
  coudelarias?: {
    nome: string;
    slug: string;
  };
}

/** Estatísticas de reviews */
export interface ReviewStats {
  total: number;
  media: number;
}

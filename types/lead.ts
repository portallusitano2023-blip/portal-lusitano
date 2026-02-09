/** Lead do CRM */
export interface Lead {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  company: string | null;
  stage: string;
  estimated_value: number;
  probability: number;
  source_type: string | null;
  interests: string | null;
  notes: string | null;
  budget_min: number | null;
  budget_max: number | null;
  next_follow_up: string | null;
  created_at: string;
}

/** Estatísticas do CRM */
export interface CRMStats {
  total: number;
  novo: number;
  contactado: number;
  qualificado: number;
  proposta: number;
  negociacao: number;
  ganho: number;
  perdido: number;
}

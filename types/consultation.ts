export type ConsultationStatus = "pending" | "in_progress" | "answered" | "closed";

export type ConsultationType =
  | "linhagens" // Análise de linhagens
  | "acasalamento" // Plano de acasalamento
  | "morfologia" // Avaliação de morfologia
  | "contrato" // Revisão de contratos
  | "gestao" // Coaching de gestão
  | "marketing" // Marketing digital
  | "outro"; // Outro

export interface ConsultationTicket {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  user_plan: string; // Aficionado, Criador, Elite
  type: ConsultationType;
  subject: string;
  message: string;
  attachments?: string[]; // URLs dos ficheiros anexados
  status: ConsultationStatus;
  priority: "low" | "medium" | "high";
  admin_response?: string;
  admin_response_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateConsultationRequest {
  type: ConsultationType;
  subject: string;
  message: string;
  attachments?: File[];
}

export interface RespondConsultationRequest {
  ticket_id: string;
  response: string;
}

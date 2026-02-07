import { z } from "zod";

// Newsletter
export const newsletterSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

// Reviews
export const reviewSchema = z.object({
  coudelaria_id: z.string().min(1, "ID da coudelaria é obrigatório"),
  autor_nome: z.string().min(1, "Nome é obrigatório").max(100),
  autor_email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  autor_localizacao: z.string().max(100).optional().or(z.literal("")),
  avaliacao: z.number().int().min(1, "Mínimo 1").max(5, "Máximo 5"),
  titulo: z.string().max(200).optional().or(z.literal("")),
  comentario: z.string().min(1, "Comentário é obrigatório").max(2000),
  data_visita: z.string().optional().or(z.literal("")),
  tipo_visita: z.string().optional().or(z.literal("")),
  recomenda: z.boolean().optional().default(true),
});

// Login
export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Password é obrigatória"),
});

// Contacto
export const contactoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100),
  email: z.string().email("E-mail inválido"),
  mensagem: z.string().min(1, "Mensagem é obrigatória").max(5000),
  assunto: z.string().max(200).optional(),
});

// Coudelaria registration
export const coudelariaRegistoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(200),
  localizacao: z.string().min(1, "Localização é obrigatória").max(200),
  regiao: z.string().min(1, "Região é obrigatória"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres").max(5000),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  telefone: z.string().max(20).optional().or(z.literal("")),
  website: z.string().url("URL inválido").optional().or(z.literal("")),
});

// Utility: parse with Zod and return structured error
export function parseWithZod<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const firstError = result.error.issues[0];
  return { success: false, error: firstError?.message || "Dados inválidos" };
}

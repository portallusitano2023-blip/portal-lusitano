import { z } from "zod";

/**
 * Validação de variáveis de ambiente no servidor.
 * Importar este módulo no início da aplicação para validar
 * que todas as variáveis necessárias estão definidas.
 */

const serverEnvSchema = z.object({
  // Supabase (obrigatório)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL deve ser uma URL válida"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY é obrigatório"),

  // Auth (obrigatório em produção)
  ADMIN_SECRET: z.string().min(16, "ADMIN_SECRET deve ter pelo menos 16 caracteres").optional(),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL deve ser um email válido").optional(),
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD deve ter pelo menos 8 caracteres").optional(),

  // Stripe (opcional, necessário para pagamentos)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // Email (opcional, necessário para envio de emails)
  RESEND_API_KEY: z.string().optional(),

  // Sanity CMS (opcional, necessário para jornal)
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().optional(),

  // Site
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Cron
  CRON_SECRET: z.string().optional(),

  // Sentry
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let validated = false;

export function validateEnv(): ServerEnv {
  if (validated) return process.env as unknown as ServerEnv;

  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    if (process.env.NODE_ENV === "production") {
      throw new Error(`Variáveis de ambiente inválidas:\n${errors}`);
    } else {
      console.warn(`[env] Variáveis de ambiente com problemas (ignorado em dev):\n${errors}`);
    }
  }

  validated = true;
  return (result.success ? result.data : process.env) as unknown as ServerEnv;
}

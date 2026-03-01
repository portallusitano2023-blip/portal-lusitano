import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Verifica se o utilizador autenticado é um profissional aprovado.
 * Retorna { user, profissional } ou null.
 */
export async function getAuthenticatedProfissional() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const { data: profissional } = await supabaseAdmin
    .from("profissionais")
    .select("id, nome, email, plano, status")
    .eq("email", user.email)
    .eq("status", "aprovado")
    .is("deleted_at", null)
    .single();

  if (!profissional) return null;

  return { user, profissional };
}

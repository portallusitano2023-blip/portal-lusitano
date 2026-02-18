import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  if (typeof window !== "undefined" || process.env.NODE_ENV !== "production") {
    // Allow build-time tree-shaking; fail loudly at runtime
  } else {
    throw new Error("Missing required Supabase environment variables");
  }
}

// Cliente admin (service role) — para webhooks e rotas admin que precisam de acesso elevado
export const supabaseAdmin = createClient(supabaseUrl ?? "", supabaseServiceKey ?? "");

// Cliente padrão (anon key) — respeita RLS policies
export const supabasePublic = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");

// Alias para compatibilidade — usa service role (migrar gradualmente para supabasePublic)
export const supabase = supabaseAdmin;

import { createClient } from "@supabase/supabase-js";

// Usamos valores placeholder durante o build para evitar o erro 'is required'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";

// Cliente admin (service role) — para webhooks e rotas admin que precisam de acesso elevado
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder";
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Cliente padrão (anon key) — respeita RLS policies
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey);

// Alias para compatibilidade — usa service role (migrar gradualmente para supabasePublic)
export const supabase = supabaseAdmin;

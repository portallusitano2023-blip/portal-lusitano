import { createBrowserClient } from "@supabase/ssr";

// NEXT_PUBLIC_* vars must be referenced literally — dynamic access via
// process.env[variable] is NOT inlined by the Next.js bundler on the client.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Database types available at @/lib/database.types for typed queries:
//   import type { Database } from "@/lib/database.types";
//   const supabase = createSupabaseBrowserClient();
//   const { data } = await supabase.from("eventos").select("*");
//   // data is typed as Database["public"]["Tables"]["eventos"]["Row"][]
export function createSupabaseBrowserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

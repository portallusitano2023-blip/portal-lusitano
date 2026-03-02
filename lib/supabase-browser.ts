import { createBrowserClient } from "@supabase/ssr";

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

// Database types available at @/lib/database.types for typed queries:
//   import type { Database } from "@/lib/database.types";
//   const supabase = createSupabaseBrowserClient();
//   const { data } = await supabase.from("eventos").select("*");
//   // data is typed as Database["public"]["Tables"]["eventos"]["Row"][]
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

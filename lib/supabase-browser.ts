import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

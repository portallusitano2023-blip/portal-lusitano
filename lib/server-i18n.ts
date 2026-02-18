import { cookies } from "next/headers";
import pt from "@/locales/pt.json";

type Translations = typeof pt;
type Language = "pt" | "en" | "es";

const loaders: Record<string, () => Promise<{ default: Translations }>> = {
  en: () => import("@/locales/en.json") as Promise<{ default: Translations }>,
  es: () => import("@/locales/es.json") as Promise<{ default: Translations }>,
};

export async function getServerTranslations(): Promise<Translations> {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("locale")?.value || "pt") as Language;

  if (locale === "pt") return pt;

  try {
    const mod = await loaders[locale]();
    return mod.default;
  } catch {
    return pt;
  }
}

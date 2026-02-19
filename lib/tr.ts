/**
 * Cria uma função de tradução inline para componentes que precisam
 * de textos não cobertos pelos ficheiros de locales (pt.json/en.json/es.json).
 *
 * Uso:
 *   const { language } = useLanguage();
 *   const tr = createTranslator(language);
 *   // tr("Texto PT", "Text EN", "Texto ES")
 *   // tr("Texto PT", "Text EN") // ES = EN como fallback
 */
export function createTranslator(language: string) {
  return function tr(pt: string, en: string, es: string = en): string {
    if (language === "pt") return pt;
    if (language === "es") return es;
    return en;
  };
}

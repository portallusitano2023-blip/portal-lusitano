import { createTranslator } from "@/lib/tr";

export function getFreeTierFeatures(tr: ReturnType<typeof createTranslator>) {
  return [
    {
      text: tr(
        "1 uso gratuito por ferramenta",
        "1 free use per tool",
        "1 uso gratuito por herramienta"
      ),
      included: true,
    },
    { text: tr("Resultados básicos", "Basic results", "Resultados básicos"), included: true },
    {
      text: tr(
        "Acesso a todas as ferramentas",
        "Access to all tools",
        "Acceso a todas las herramientas"
      ),
      included: true,
    },
    { text: tr("Exportar PDF", "Export PDF", "Exportar PDF"), included: false },
    { text: tr("Guardar histórico", "Save history", "Guardar historial"), included: false },
    { text: tr("Partilhar resultados", "Share results", "Compartir resultados"), included: false },
    { text: tr("Usos ilimitados", "Unlimited uses", "Usos ilimitados"), included: false },
  ];
}

export function getProTierFeatures(tr: ReturnType<typeof createTranslator>) {
  return [
    {
      text: tr(
        "Usos ilimitados em todas as ferramentas",
        "Unlimited uses on all tools",
        "Usos ilimitados en todas las herramientas"
      ),
      included: true,
    },
    {
      text: tr(
        "Resultados detalhados e avançados",
        "Detailed and advanced results",
        "Resultados detallados y avanzados"
      ),
      included: true,
    },
    {
      text: tr(
        "Acesso a todas as ferramentas",
        "Access to all tools",
        "Acceso a todas las herramientas"
      ),
      included: true,
    },
    {
      text: tr("Exportar relatórios em PDF", "Export reports in PDF", "Exportar informes en PDF"),
      included: true,
    },
    {
      text: tr("Guardar histórico completo", "Save complete history", "Guardar historial completo"),
      included: true,
    },
    {
      text: tr(
        "Partilhar resultados com link",
        "Share results with link",
        "Compartir resultados con enlace"
      ),
      included: true,
    },
    { text: tr("Suporte prioritário", "Priority support", "Soporte prioritario"), included: true },
  ];
}

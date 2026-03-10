import type { Result } from "./types";

type TranslatorFn = (pt: string, en: string, es?: string) => string;

export function getShareUrl(
  result: Result | null,
  scores: Record<string, number>,
  subProfile?: string | null,
  confidence?: number
): string {
  if (!result) return "";
  const data: Record<string, unknown> = { profile: result.profile, scores };
  if (subProfile) data.subProfile = subProfile;
  if (typeof confidence === "number") data.confidence = confidence;
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  return `${typeof window !== "undefined" ? window.location.origin : ""}/analise-perfil?r=${encodeURIComponent(encoded)}`;
}

export function shareWhatsApp(
  result: Result | null,
  scores: Record<string, number>,
  subProfile: string | null,
  tr: TranslatorFn,
  confidence?: number
): void {
  if (!result) return;
  const totalS = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const pct = Math.round((scores[result.profile] / totalS) * 100);

  const shareUrl = getShareUrl(result, scores, subProfile, confidence);

  const SUB_PROFILE_LABELS: Record<string, string> = {
    competidor_elite: tr("Alta Competição FEI", "FEI High Competition", "Alta Competición FEI"),
    competidor_nacional: tr("Competição Nacional", "National Competition", "Competición Nacional"),
    competidor_trabalho: tr("Equitação de Trabalho", "Working Equitation", "Equitación de Trabajo"),
    amador_projeto: tr("Projecto Jovem", "Young Horse Project", "Proyecto Joven"),
    aprendiz_iniciante: tr("Cavaleiro Iniciante", "Beginner Rider", "Jinete Principiante"),
    aprendiz_transicao: tr("Cavaleiro em Transição", "Transitioning Rider", "Jinete en Transición"),
    tradicional_campeiro: tr("Tradição Campeira", "Campo Tradition", "Tradición Campera"),
    tradicional_classico: tr("Escola Clássica", "Classical School", "Escuela Clásica"),
    criador_selecao: tr("Criação Selectiva", "Selective Breeding", "Cría Selectiva"),
    criador_conservacao: tr("Conservação da Raça", "Breed Conservation", "Conservación de la Raza"),
  };

  const subProfileLabel = subProfile ? ` (${SUB_PROFILE_LABELS[subProfile] ?? ""})` : "";
  const text = encodeURIComponent(
    tr(
      `\u{1F434} Descobri o meu Perfil Equestre no Portal Lusitano!\n\nSou *${result.title}*${subProfileLabel} com ${pct}% de afinidade.\n\nDescobre o teu perfil em: ${shareUrl}`,
      `\u{1F434} I discovered my Equestrian Profile on Portal Lusitano!\n\nI am *${result.title}*${subProfileLabel} with ${pct}% affinity.\n\nDiscover your profile at: ${shareUrl}`,
      `\u{1F434} ¡Descubrí mi Perfil Ecuestre en Portal Lusitano!\n\nSoy *${result.title}*${subProfileLabel} con ${pct}% de afinidad.\n\nDescubre tu perfil en: ${shareUrl}`
    )
  );
  window.open(`https://wa.me/?text=${text}`, "_blank");
}

export function shareFacebook(shareUrl: string): void {
  const url = encodeURIComponent(shareUrl);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
}

export function shareInstagram(
  result: Result | null,
  scores: Record<string, number>,
  alertText: string,
  tr: TranslatorFn,
  onCopied?: (text: string) => void
): void {
  if (!result) return;
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const p = Math.round((scores[result.profile] / totalScore) * 100);
  const text = tr(
    `Fiz a Análise de Perfil do Cavaleiro!\n\nO meu perfil: ${result.title} (${p}%)\n"${result.subtitle}"\n\nDescobre o teu perfil em:\nportallusitano.pt/analise-perfil\n\n#Lusitano #CavaloLusitano #Equitacao #PortalLusitano`,
    `I took the Rider Profile Analysis!\n\nMy profile: ${result.title} (${p}%)\n"${result.subtitle}"\n\nDiscover your profile at:\nportallusitano.pt/analise-perfil\n\n#Lusitano #LusitanoHorse #Equestrian #PortalLusitano`,
    `¡Hice el Análisis de Perfil del Jinete!\n\nMi perfil: ${result.title} (${p}%)\n"${result.subtitle}"\n\nDescubre tu perfil en:\nportallusitano.pt/analise-perfil\n\n#Lusitano #CaballoLusitano #Equitacion #PortalLusitano`
  );
  navigator.clipboard.writeText(text).then(() => {
    if (onCopied) {
      onCopied(alertText);
    } else {
      alert(alertText);
    }
  }).catch(() => {
    if (onCopied) onCopied(tr("Erro ao copiar. Copie manualmente.", "Copy failed. Copy manually.", "Error al copiar. Copie manualmente."));
  });
}

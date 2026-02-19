import type { Result } from "./types";

const SUB_PROFILE_LABELS: Record<string, string> = {
  competidor_elite: "Alta Competição FEI",
  competidor_nacional: "Competição Nacional",
  competidor_trabalho: "Equitação de Trabalho",
  amador_projeto: "Projecto Jovem",
};

export function getShareUrl(result: Result | null, scores: Record<string, number>): string {
  if (!result) return "";
  const data = { profile: result.profile, scores };
  const encoded = btoa(JSON.stringify(data));
  return `${typeof window !== "undefined" ? window.location.origin : ""}/analise-perfil?r=${encoded}`;
}

export function shareWhatsApp(
  result: Result | null,
  scores: Record<string, number>,
  subProfile: string | null
): void {
  if (!result) return;
  const totalS = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const pct = Math.round((scores[result.profile] / totalS) * 100);
  const subProfileLabel = subProfile ? ` (${SUB_PROFILE_LABELS[subProfile] ?? ""})` : "";
  const text = encodeURIComponent(
    `\u{1F434} Descobri o meu Perfil Equestre no Portal Lusitano!\n\n` +
      `Sou *${result.title}*${subProfileLabel} com ${pct}% de afinidade.\n\n` +
      `Descobre o teu perfil em: portallusitano.pt/analise-perfil`
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
  alertText: string
): void {
  if (!result) return;
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const p = Math.round((scores[result.profile] / totalScore) * 100);
  const text = `Fiz a Análise de Perfil do Cavaleiro!\n\nO meu perfil: ${result.title} (${p}%)\n"${result.subtitle}"\n\nDescobre o teu perfil em:\nportallusitano.pt/analise-perfil\n\n#Lusitano #CavaloLusitano #Equitacao #PortalLusitano`;
  navigator.clipboard.writeText(text);
  alert(alertText);
}

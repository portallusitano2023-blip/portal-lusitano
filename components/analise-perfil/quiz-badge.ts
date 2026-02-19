import type { Result } from "./types";

export async function generateBadge(
  badgeElement: HTMLDivElement,
  result: Result,
  scores: Record<string, number>
): Promise<void> {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(badgeElement, {
    backgroundColor: "#050505",
    scale: 2,
    useCORS: true,
    logging: false,
    removeContainer: true,
  });
  const link = document.createElement("a");
  link.download = `perfil-${result.profile}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export function generateBadgeSVGFallback(result: Result, scores: Record<string, number>): void {
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
  const percentage = Math.round((scores[result.profile] / totalScore) * 100);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="540" viewBox="0 0 540 540">
        <rect width="540" height="540" fill="#050505"/>
        <rect x="20" y="20" width="500" height="500" fill="none" stroke="#C5A059" stroke-width="4"/>
        <text x="270" y="100" text-anchor="middle" fill="#C5A059" font-size="14" letter-spacing="3">PORTAL LUSITANO</text>
        <text x="270" y="200" text-anchor="middle" fill="#888" font-size="12" letter-spacing="2">O MEU PERFIL EQUESTRE</text>
        <text x="270" y="270" text-anchor="middle" fill="#fff" font-size="32" font-family="serif">${result.title}</text>
        <text x="270" y="310" text-anchor="middle" fill="#C5A059" font-size="18" font-style="italic">${result.subtitle}</text>
        <rect x="220" y="350" width="100" height="50" fill="#C5A059"/>
        <text x="270" y="385" text-anchor="middle" fill="#000" font-size="28" font-weight="bold">${percentage}%</text>
        <text x="270" y="480" text-anchor="middle" fill="#444" font-size="11">portallusitano.pt/analise-perfil</text>
      </svg>`;
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = `perfil-${result.profile}.svg`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

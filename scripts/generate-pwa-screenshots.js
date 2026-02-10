/**
 * Gera screenshots placeholder para o PWA manifest.
 * TODO: Substituir por screenshots reais do site em produção.
 *
 * Uso: node scripts/generate-pwa-screenshots.js
 *
 * Cria SVGs simples nas dimensões correctas em public/screenshots/
 */

const fs = require("fs");
const path = require("path");

const screenshotsDir = path.join(__dirname, "..", "public", "screenshots");

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const screenshots = [
  {
    name: "home-desktop",
    width: 1280,
    height: 720,
    label: "Portal Lusitano",
    subtitle: "Página Inicial",
  },
  {
    name: "marketplace-desktop",
    width: 1280,
    height: 720,
    label: "Marketplace",
    subtitle: "Cavalos Lusitanos à Venda",
  },
  {
    name: "loja-mobile",
    width: 750,
    height: 1334,
    label: "Loja",
    subtitle: "Equipamento Equestre",
  },
  {
    name: "jornal-mobile",
    width: 750,
    height: 1334,
    label: "Jornal",
    subtitle: "Artigos & Investigação",
  },
];

for (const s of screenshots) {
  const isMobile = s.height > s.width;
  const titleSize = isMobile ? 48 : 40;
  const subtitleSize = isMobile ? 24 : 20;
  const logoSize = isMobile ? 80 : 60;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s.width}" height="${s.height}" viewBox="0 0 ${s.width} ${s.height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#050505"/>
      <stop offset="100%" style="stop-color:#0A0A0A"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#B8963F"/>
      <stop offset="50%" style="stop-color:#C5A059"/>
      <stop offset="100%" style="stop-color:#D4B06A"/>
    </linearGradient>
  </defs>
  <rect width="${s.width}" height="${s.height}" fill="url(#bg)"/>
  <rect x="${s.width * 0.1}" y="${s.height * 0.4}" width="${s.width * 0.8}" height="1" fill="url(#gold)" opacity="0.3"/>
  <rect x="${s.width * 0.1}" y="${s.height * 0.6}" width="${s.width * 0.8}" height="1" fill="url(#gold)" opacity="0.3"/>
  <circle cx="${s.width / 2}" cy="${s.height * 0.35}" r="${logoSize}" fill="none" stroke="#C5A059" stroke-width="2" opacity="0.5"/>
  <text x="${s.width / 2}" y="${s.height * 0.35 + 6}" text-anchor="middle" font-family="Georgia, serif" font-size="${logoSize * 0.4}" fill="#C5A059" opacity="0.8">PL</text>
  <text x="${s.width / 2}" y="${s.height / 2 + titleSize * 0.4}" text-anchor="middle" font-family="Georgia, serif" font-size="${titleSize}" fill="#C5A059" font-weight="600">${s.label}</text>
  <text x="${s.width / 2}" y="${s.height / 2 + titleSize * 0.4 + subtitleSize * 2}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${subtitleSize}" fill="#888888">${s.subtitle}</text>
  <text x="${s.width / 2}" y="${s.height * 0.85}" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#555555">TODO: Substituir por screenshot real</text>
</svg>`;

  // Guardar como SVG (browsers suportam SVG em manifests)
  const svgPath = path.join(screenshotsDir, `${s.name}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`✅ Criado: ${svgPath}`);
}

console.log("\n📸 Screenshots placeholder criados em public/screenshots/");
console.log("⚠️  TODO: Substituir por screenshots reais quando o site estiver em produção.");

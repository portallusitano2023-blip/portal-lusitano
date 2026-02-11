/**
 * Script para gerar screenshots PWA em formato WebP
 * Usa sharp para criar imagens branded
 *
 * Executar: npx tsx scripts/generate-pwa-screenshots.ts
 */
import sharp from "sharp";
import path from "path";

const GOLD = "#C5A059";
const DARK = "#050505";
const DARK_SECONDARY = "#0A0A0A";

interface ScreenshotConfig {
  name: string;
  width: number;
  height: number;
  title: string;
  subtitle: string;
  form_factor: "wide" | "narrow";
}

const screenshots: ScreenshotConfig[] = [
  {
    name: "desktop-home",
    width: 1280,
    height: 720,
    title: "Portal Lusitano",
    subtitle: "O Portal de Excelencia do Cavalo Lusitano",
    form_factor: "wide",
  },
  {
    name: "desktop-marketplace",
    width: 1280,
    height: 720,
    title: "Marketplace",
    subtitle: "Compre e Venda Cavalos Lusitanos",
    form_factor: "wide",
  },
  {
    name: "mobile-home",
    width: 750,
    height: 1334,
    title: "Portal Lusitano",
    subtitle: "Cavalos Lusitanos",
    form_factor: "narrow",
  },
  {
    name: "mobile-marketplace",
    width: 750,
    height: 1334,
    title: "Marketplace",
    subtitle: "Cavalos a Venda",
    form_factor: "narrow",
  },
];

async function generateScreenshot(config: ScreenshotConfig) {
  const { width, height, title, subtitle, name } = config;

  // Create branded SVG
  const titleFontSize = config.form_factor === "wide" ? 48 : 40;
  const subtitleFontSize = config.form_factor === "wide" ? 24 : 20;
  const logoSize = config.form_factor === "wide" ? 80 : 60;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${DARK};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${DARK_SECONDARY};stop-opacity:1" />
        </linearGradient>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${GOLD};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8B6914;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bg)" />

      <!-- Decorative border -->
      <rect x="20" y="20" width="${width - 40}" height="${height - 40}"
            rx="16" ry="16" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.3" />

      <!-- Corner accents -->
      <rect x="30" y="30" width="60" height="3" fill="${GOLD}" opacity="0.6" rx="1" />
      <rect x="30" y="30" width="3" height="60" fill="${GOLD}" opacity="0.6" rx="1" />
      <rect x="${width - 90}" y="30" width="60" height="3" fill="${GOLD}" opacity="0.6" rx="1" />
      <rect x="${width - 33}" y="30" width="3" height="60" fill="${GOLD}" opacity="0.6" rx="1" />

      <!-- Logo circle -->
      <circle cx="${width / 2}" cy="${height / 2 - logoSize}" r="${logoSize}"
              fill="none" stroke="url(#gold)" stroke-width="3" />
      <text x="${width / 2}" y="${height / 2 - logoSize + titleFontSize * 0.35}"
            font-family="Georgia, serif" font-size="${titleFontSize}" font-weight="bold"
            fill="${GOLD}" text-anchor="middle">PL</text>

      <!-- Title -->
      <text x="${width / 2}" y="${height / 2 + logoSize * 0.5}"
            font-family="Georgia, serif" font-size="${titleFontSize}" font-weight="bold"
            fill="white" text-anchor="middle">${title}</text>

      <!-- Subtitle -->
      <text x="${width / 2}" y="${height / 2 + logoSize * 0.5 + subtitleFontSize * 2}"
            font-family="Arial, sans-serif" font-size="${subtitleFontSize}"
            fill="${GOLD}" text-anchor="middle" opacity="0.8">${subtitle}</text>

      <!-- Bottom decoration -->
      <rect x="${width / 2 - 40}" y="${height - 60}" width="80" height="2"
            fill="${GOLD}" opacity="0.4" rx="1" />
    </svg>
  `;

  const outputPath = path.join(process.cwd(), "public", "screenshots", `${name}.webp`);

  await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(outputPath);

  console.log(`Generated: ${outputPath} (${width}x${height})`);
}

async function main() {
  console.log("Generating PWA screenshots...\n");

  for (const config of screenshots) {
    await generateScreenshot(config);
  }

  console.log("\nAll screenshots generated successfully!");
  console.log("Update manifest.json with the new screenshot paths.");
}

main().catch(console.error);

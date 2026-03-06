const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.join(__dirname, "..");
const LOGO_PATH = path.join(ROOT, "public", "logo.png");

// Tamanhos para os ícones PWA
const PWA_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  console.log("A gerar ícones a partir de", LOGO_PATH);

  if (!fs.existsSync(LOGO_PATH)) {
    console.error("ERRO: public/logo.png não encontrado");
    process.exit(1);
  }

  // 1. Gerar favicon.ico (32x32 PNG → .ico)
  // Next.js aceita PNG como favicon.ico em modo moderno
  const faviconPath = path.join(ROOT, "app", "favicon.ico");
  await sharp(LOGO_PATH)
    .resize(48, 48, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(faviconPath);
  console.log("✓ app/favicon.ico (48x48)");

  // 2. Gerar app/icon.png (32x32) — usado pelo Next.js App Router como favicon moderno
  const iconPath = path.join(ROOT, "app", "icon.png");
  await sharp(LOGO_PATH)
    .resize(32, 32, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(iconPath);
  console.log("✓ app/icon.png (32x32)");

  // 3. Gerar app/apple-icon.png (180x180) — usado em iOS/Safari
  const appleIconPath = path.join(ROOT, "app", "apple-icon.png");
  await sharp(LOGO_PATH)
    .resize(180, 180, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile(appleIconPath);
  console.log("✓ app/apple-icon.png (180x180)");

  // 4. Gerar todos os tamanhos PWA em public/icons/
  const iconsDir = path.join(ROOT, "public", "icons");
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  for (const size of PWA_SIZES) {
    const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);
    await sharp(LOGO_PATH)
      .resize(size, size, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(outputPath);
    console.log(`✓ public/icons/icon-${size}x${size}.png`);
  }

  // 5. Gerar versão grande para Open Graph (1200x630) centrada
  const ogIconPath = path.join(ROOT, "public", "og-logo.png");
  await sharp(LOGO_PATH)
    .resize(300, 300, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(ogIconPath);
  console.log("✓ public/og-logo.png (300x300)");

  console.log("\n✅ Todos os ícones gerados com sucesso!");
  console.log("\nFicheiros criados:");
  console.log("  app/favicon.ico      — favicon padrão (48x48)");
  console.log("  app/icon.png         — favicon moderno Next.js (32x32)");
  console.log("  app/apple-icon.png   — ícone iOS/Safari (180x180)");
  console.log("  public/icons/        — ícones PWA (72px a 512px)");
  console.log("  public/og-logo.png   — logo para Open Graph");
}

generateIcons().catch((err) => {
  console.error("Erro ao gerar ícones:", err);
  process.exit(1);
});

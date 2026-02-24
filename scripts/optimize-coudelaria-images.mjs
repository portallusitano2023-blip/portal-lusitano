/**
 * Script para optimizar imagens das coudelarias.
 * Converte PNGs grandes para WebP comprimido e renomeia sem espaços/acentos.
 *
 * Uso: node scripts/optimize-coudelaria-images.mjs
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..");
const COUDELARIAS_DIR = path.join(ROOT, "public", "images", "coudelarias");

const MAX_WIDTH = 1920;
const QUALITY = 80;

async function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let converted = 0;
  let savedBytes = 0;

  // Get all image files (PNGs and large JPGs)
  const imageFiles = entries.filter(
    (e) =>
      e.isFile() &&
      /\.(png|PNG)$/i.test(e.name) &&
      fs.statSync(path.join(dirPath, e.name)).size > 100_000 // > 100KB
  );

  if (imageFiles.length === 0) return { converted: 0, savedBytes: 0 };

  const dirName = path.basename(dirPath);
  console.log(`\n📁 ${dirName}: ${imageFiles.length} imagens para optimizar`);

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const inputPath = path.join(dirPath, file.name);
    const originalSize = fs.statSync(inputPath).size;

    // Generate clean filename: imagem-01.webp, imagem-02.webp, etc.
    const outputName = `imagem-${String(i + 1).padStart(2, "0")}.webp`;
    const outputPath = path.join(dirPath, outputName);

    // Skip if WebP already exists
    if (fs.existsSync(outputPath)) {
      console.log(`  ⏭ ${outputName} já existe, a saltar`);
      continue;
    }

    try {
      await sharp(inputPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const newSize = fs.statSync(outputPath).size;
      const savings = originalSize - newSize;
      const pct = ((savings / originalSize) * 100).toFixed(1);

      console.log(
        `  ✅ ${file.name} (${(originalSize / 1024 / 1024).toFixed(1)}MB) → ${outputName} (${(newSize / 1024).toFixed(0)}KB) [-${pct}%]`
      );

      // Delete original PNG
      fs.unlinkSync(inputPath);

      converted++;
      savedBytes += savings;
    } catch (err) {
      console.error(`  ❌ Erro ao processar ${file.name}:`, err.message);
    }
  }

  return { converted, savedBytes };
}

async function main() {
  console.log("🖼️  Optimização de imagens de coudelarias");
  console.log(`📂 Directório: ${COUDELARIAS_DIR}`);
  console.log(`📐 Max largura: ${MAX_WIDTH}px | Qualidade WebP: ${QUALITY}`);

  if (!fs.existsSync(COUDELARIAS_DIR)) {
    console.error("❌ Directório de coudelarias não encontrado!");
    process.exit(1);
  }

  const subdirs = fs
    .readdirSync(COUDELARIAS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory());

  let totalConverted = 0;
  let totalSaved = 0;

  for (const subdir of subdirs) {
    const result = await processDirectory(
      path.join(COUDELARIAS_DIR, subdir.name)
    );
    totalConverted += result.converted;
    totalSaved += result.savedBytes;
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Concluído!`);
  console.log(`   Imagens convertidas: ${totalConverted}`);
  console.log(
    `   Espaço poupado: ${(totalSaved / 1024 / 1024).toFixed(1)}MB`
  );
  console.log("=".repeat(50));
}

main().catch(console.error);

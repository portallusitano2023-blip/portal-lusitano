/**
 * Script para sincronizar imagens dos cavalos famosos.
 *
 * Uso: npx tsx scripts/sync-cavalos-images.ts
 *
 * O que faz:
 * 1. Percorre cada pasta em public/images/cavalos-famosos/
 * 2. Para cada pasta, encontra a primeira imagem (PNG, JPG, JPEG, WEBP, BMP, TIFF)
 * 3. Converte para capa.webp optimizado (max 1920px largura, qualidade 82)
 * 4. Remove o ficheiro original (mantém apenas capa.webp)
 *
 * O utilizador só precisa de colocar qualquer captura de ecrã ou imagem
 * na pasta do cavalo e correr este script.
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";

const CAVALOS_DIR = path.join(process.cwd(), "public", "images", "cavalos-famosos");
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tiff", ".tif", ".gif"];
const MAX_WIDTH = 1920;
const QUALITY = 82;

async function processFolder(folderPath: string, folderName: string): Promise<string> {
  const files = fs.readdirSync(folderPath);

  // Verificar se já tem capa.webp
  const hasCapa = files.includes("capa.webp");

  // Encontrar ficheiros de imagem (excluindo capa.webp existente)
  const imageFiles = files.filter((f) => {
    const ext = path.extname(f).toLowerCase();
    if (f === "capa.webp") return false;
    return IMAGE_EXTENSIONS.includes(ext);
  });

  if (imageFiles.length === 0 && hasCapa) {
    return `✅ ${folderName} — capa.webp já existe`;
  }

  if (imageFiles.length === 0 && !hasCapa) {
    return `⬜ ${folderName} — sem imagem (coloca uma captura de ecrã na pasta)`;
  }

  // Usar o primeiro ficheiro de imagem encontrado
  const sourceFile = imageFiles[0];
  const sourcePath = path.join(folderPath, sourceFile);
  const outputPath = path.join(folderPath, "capa.webp");

  try {
    // Converter para WebP optimizado
    const image = sharp(sourcePath);
    const metadata = await image.metadata();

    let pipeline = image;

    // Redimensionar se maior que MAX_WIDTH
    if (metadata.width && metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, undefined, { withoutEnlargement: true });
    }

    await pipeline.webp({ quality: QUALITY }).toFile(outputPath);

    // Obter tamanhos para mostrar a compressão
    const originalSize = fs.statSync(sourcePath).size;
    const newSize = fs.statSync(outputPath).size;
    const reduction = Math.round((1 - newSize / originalSize) * 100);

    // Remover o ficheiro original
    fs.unlinkSync(sourcePath);

    // Remover outros ficheiros de imagem extra na pasta
    for (const extra of imageFiles.slice(1)) {
      fs.unlinkSync(path.join(folderPath, extra));
    }

    return `🔄 ${folderName} — ${sourceFile} → capa.webp (${formatSize(originalSize)} → ${formatSize(newSize)}, -${reduction}%)`;
  } catch (err) {
    return `❌ ${folderName} — erro ao converter ${sourceFile}: ${err}`;
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

async function main() {
  console.log("🐴 Sincronização de imagens — Cavalos Famosos\n");

  if (!fs.existsSync(CAVALOS_DIR)) {
    console.error(`❌ Pasta não encontrada: ${CAVALOS_DIR}`);
    process.exit(1);
  }

  const folders = fs
    .readdirSync(CAVALOS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  console.log(`📁 ${folders.length} pastas encontradas\n`);

  let converted = 0;
  let existing = 0;
  let missing = 0;
  let errors = 0;

  for (const folder of folders) {
    const result = await processFolder(path.join(CAVALOS_DIR, folder), folder);
    console.log(result);

    if (result.startsWith("🔄")) converted++;
    else if (result.startsWith("✅")) existing++;
    else if (result.startsWith("⬜")) missing++;
    else if (result.startsWith("❌")) errors++;
  }

  console.log(`\n--- Resumo ---`);
  console.log(`🔄 Convertidas: ${converted}`);
  console.log(`✅ Já existiam: ${existing}`);
  console.log(`⬜ Sem imagem: ${missing}`);
  if (errors > 0) console.log(`❌ Erros: ${errors}`);
  console.log(`\nTotal: ${folders.length} cavalos`);
}

main().catch(console.error);

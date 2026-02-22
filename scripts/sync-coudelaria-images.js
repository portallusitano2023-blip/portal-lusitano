/**
 * sync-coudelaria-images.js
 *
 * Scan public/images/coudelarias/<slug>/ folders, optimize images,
 * and update Supabase with the correct foto_capa + galeria paths.
 *
 * Features:
 *   - Auto-converts large PNGs to optimized JPEG (max 1920px, quality 82)
 *   - Auto-renames messy filenames (screenshots, spaces, accents) to capa/galeria-N
 *   - Updates Supabase coudelarias table automatically
 *
 * Convention:
 *   - capa.*          → foto_capa  (first image alphabetically if no "capa" file)
 *   - galeria-N.*     → galeria[]  (sorted numerically)
 *   - Any other image  → renamed to galeria-N and added to galeria[]
 *
 * Usage:  npm run sync-images
 *         npm run sync-images -- --dry-run   (preview without writing to DB)
 */

import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// ── Config ───────────────────────────────────────────────────────────────────

const PUBLIC_DIR = path.resolve("public/images/coudelarias");
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const CONVERTIBLE_EXTS = new Set([".png", ".webp", ".avif"]);
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1280;
const JPEG_QUALITY = 82;
const DRY_RUN = process.argv.includes("--dry-run");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ── Helpers ──────────────────────────────────────────────────────────────────

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("⚠️  sharp not available — skipping image optimization");
}

function isImage(file) {
  return IMAGE_EXTS.has(path.extname(file).toLowerCase());
}

/** Natural sort: galeria-2 before galeria-10 */
function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function isCleanName(file) {
  const name = path.parse(file).name.toLowerCase();
  return name === "capa" || /^galeria-\d+$/.test(name);
}

// ── Optimize & Rename ────────────────────────────────────────────────────────

async function optimizeAndRename(slugDir) {
  const files = fs.readdirSync(slugDir).filter(isImage).sort(naturalSort);
  if (files.length === 0) return;

  // Check if files need renaming (messy names like "Captura de ecrã...")
  const needsRename = files.some((f) => !isCleanName(f));

  if (needsRename) {
    let galeriaIndex = 1;
    const sorted = [...files].sort(naturalSort);

    for (const file of sorted) {
      const ext = path.extname(file);
      const oldPath = path.join(slugDir, file);
      let newName;

      if (galeriaIndex === 1 && !sorted.some((f) => path.parse(f).name.toLowerCase() === "capa")) {
        newName = `capa${ext}`;
        galeriaIndex--; // Don't increment for capa
      } else {
        newName = `galeria-${galeriaIndex}${ext}`;
      }
      galeriaIndex++;

      if (file !== newName) {
        const newPath = path.join(slugDir, newName);
        if (!DRY_RUN) fs.renameSync(oldPath, newPath);
        console.log(`      📝 ${file} → ${newName}`);
      }
    }
  }

  // Convert large non-JPEGs to optimized JPEG
  if (!sharp) return;

  const currentFiles = fs.readdirSync(slugDir).filter(isImage);
  for (const file of currentFiles) {
    const ext = path.extname(file).toLowerCase();
    const filePath = path.join(slugDir, file);
    const stats = fs.statSync(filePath);

    // Convert if PNG/WebP/AVIF, or if JPEG > 500KB
    const shouldConvert = CONVERTIBLE_EXTS.has(ext) || (ext === ".jpg" && stats.size > 500 * 1024);

    if (!shouldConvert) continue;

    const jpgName = path.parse(file).name + ".jpg";
    const jpgPath = path.join(slugDir, jpgName);

    if (DRY_RUN) {
      console.log(
        `      🔄 ${file} → ${jpgName} (${(stats.size / 1024 / 1024).toFixed(1)}MB → optimized)`
      );
      continue;
    }

    try {
      const info = await sharp(filePath)
        .jpeg({ quality: JPEG_QUALITY, progressive: true })
        .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: "inside", withoutEnlargement: true })
        .toFile(jpgPath + ".tmp");

      // Replace original with optimized version
      fs.unlinkSync(filePath);
      fs.renameSync(jpgPath + ".tmp", jpgPath);

      const reduction = Math.round(100 - (info.size / stats.size) * 100);
      console.log(
        `      🔄 ${file} → ${jpgName} (${(stats.size / 1024 / 1024).toFixed(1)}MB → ${(info.size / 1024).toFixed(0)}KB, -${reduction}%)`
      );
    } catch (err) {
      console.error(`      ❌ Erro ao converter ${file}: ${err.message}`);
      // Clean up temp file if it exists
      if (fs.existsSync(jpgPath + ".tmp")) fs.unlinkSync(jpgPath + ".tmp");
    }
  }
}

// ── Scan ─────────────────────────────────────────────────────────────────────

function scanSlugFolder(slug) {
  const dir = path.join(PUBLIC_DIR, slug);
  if (!fs.statSync(dir).isDirectory()) return null;

  const files = fs.readdirSync(dir).filter(isImage).sort(naturalSort);
  if (files.length === 0) return null;

  let capa = null;
  const galeria = [];

  for (const file of files) {
    const name = path.parse(file).name.toLowerCase();
    const webPath = `/images/coudelarias/${slug}/${file}`;

    if (name === "capa") {
      capa = webPath;
    } else {
      galeria.push(webPath);
    }
  }

  // If no explicit "capa" file, use the first image
  if (!capa && galeria.length > 0) {
    capa = galeria.shift();
  }

  return { capa, galeria };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error(`❌ Directory not found: ${PUBLIC_DIR}`);
    process.exit(1);
  }

  const slugs = fs
    .readdirSync(PUBLIC_DIR)
    .filter((entry) => {
      const full = path.join(PUBLIC_DIR, entry);
      return fs.statSync(full).isDirectory();
    })
    .sort();

  if (slugs.length === 0) {
    console.log("Nenhuma pasta encontrada em public/images/coudelarias/");
    return;
  }

  console.log(`\n🔍 Encontradas ${slugs.length} pastas de coudelarias`);
  if (DRY_RUN) console.log("⚠️  Modo --dry-run: nenhuma alteração será feita");
  console.log();

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const slug of slugs) {
    const dir = path.join(PUBLIC_DIR, slug);
    const hasImages = fs.readdirSync(dir).some(isImage);

    if (!hasImages) {
      skipped++;
      continue;
    }

    console.log(`  📂 ${slug}`);

    // Step 1: Optimize & rename files
    await optimizeAndRename(dir);

    // Step 2: Scan final state
    const result = scanSlugFolder(slug);
    if (!result) {
      skipped++;
      continue;
    }

    const { capa, galeria } = result;
    console.log(`      ✓ capa: ${capa ? "sim" : "não"}, galeria: ${galeria.length} fotos`);

    if (DRY_RUN) {
      updated++;
      continue;
    }

    // Step 3: Update Supabase
    const updateData = {};
    if (capa) updateData.foto_capa = capa;
    if (galeria.length > 0) updateData.galeria = galeria;

    if (Object.keys(updateData).length === 0) {
      skipped++;
      continue;
    }

    const { error } = await supabase.from("coudelarias").update(updateData).eq("slug", slug);

    if (error) {
      console.error(`      ❌ Erro DB: ${error.message}`);
      errors++;
    } else {
      console.log(`      ✓ Base de dados atualizada`);
      updated++;
    }
  }

  console.log(`\n${"─".repeat(50)}`);
  console.log(`✅ Atualizadas: ${updated}`);
  if (skipped > 0) console.log(`⏭  Sem imagens:  ${skipped}`);
  if (errors > 0) console.log(`❌ Erros:        ${errors}`);
  if (DRY_RUN) console.log(`\n⚠️  Modo --dry-run: nenhuma alteração foi feita`);
  console.log();
}

main().catch((err) => {
  console.error("Erro fatal:", err);
  process.exit(1);
});

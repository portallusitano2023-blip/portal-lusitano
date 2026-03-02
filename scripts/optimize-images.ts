/**
 * Image Optimization Script
 *
 * Processes images in public/images/ to generate:
 * - Multiple sizes (400w, 800w, 1200w, 1600w)
 * - WebP format (primary)
 * - AVIF format (best compression)
 * - JPEG fallback (legacy browsers)
 * - Blur placeholders (base64, 20px wide)
 *
 * Usage: npx tsx scripts/optimize-images.ts
 *
 * Output: public/images/optimized/ + lib/blur-data-generated.json
 */

import sharp from "sharp";
import { readdirSync, existsSync, mkdirSync, writeFileSync, statSync } from "fs";
import { join, parse, extname } from "path";

const SIZES = [400, 800, 1200, 1600];
const QUALITY = { webp: 80, avif: 60, jpeg: 85 };
const INPUT_DIR = "public/images";
const OUTPUT_DIR = "public/images/optimized";
const BLUR_DATA_FILE = "lib/blur-data-generated.json";
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// Skip already-optimized directories
const SKIP_DIRS = new Set(["optimized", "icons", "screenshots"]);

interface OptimizationResult {
  original: string;
  originalSize: number;
  outputs: { path: string; size: number; format: string; width: number }[];
  blurDataURL: string;
  savings: number; // percentage
}

async function processImage(filePath: string): Promise<OptimizationResult | null> {
  const { name, ext } = parse(filePath);

  if (!IMAGE_EXTENSIONS.has(ext.toLowerCase())) return null;

  const stats = statSync(filePath);
  const image = sharp(filePath);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) return null;

  const outputs: OptimizationResult["outputs"] = [];

  for (const width of SIZES) {
    // Skip sizes larger than original
    if (width > metadata.width) continue;

    const resized = image.clone().resize(width);

    // WebP (primary format)
    const webpPath = join(OUTPUT_DIR, `${name}-${width}w.webp`);
    await resized.clone().webp({ quality: QUALITY.webp }).toFile(webpPath);
    const webpStats = statSync(webpPath);
    outputs.push({ path: webpPath, size: webpStats.size, format: "webp", width });

    // AVIF (best compression, growing browser support)
    const avifPath = join(OUTPUT_DIR, `${name}-${width}w.avif`);
    await resized.clone().avif({ quality: QUALITY.avif }).toFile(avifPath);
    const avifStats = statSync(avifPath);
    outputs.push({ path: avifPath, size: avifStats.size, format: "avif", width });

    // JPEG fallback
    const jpegPath = join(OUTPUT_DIR, `${name}-${width}w.jpg`);
    await resized.clone().jpeg({ quality: QUALITY.jpeg, progressive: true }).toFile(jpegPath);
    const jpegStats = statSync(jpegPath);
    outputs.push({ path: jpegPath, size: jpegStats.size, format: "jpeg", width });
  }

  // Generate blur placeholder (20px wide, low quality)
  const blurBuffer = await image.clone().resize(20).webp({ quality: 20 }).toBuffer();
  const blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

  // Calculate savings (compare original with smallest WebP)
  const smallestWebp = outputs.find((o) => o.format === "webp" && o.width === 800);
  const savings = smallestWebp ? Math.round((1 - smallestWebp.size / stats.size) * 100) : 0;

  return {
    original: filePath,
    originalSize: stats.size,
    outputs,
    blurDataURL,
    savings,
  };
}

async function processDirectory(dir: string): Promise<OptimizationResult[]> {
  const results: OptimizationResult[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) {
        results.push(...(await processDirectory(fullPath)));
      }
      continue;
    }

    if (entry.isFile()) {
      const result = await processImage(fullPath);
      if (result) results.push(result);
    }
  }

  return results;
}

async function main() {
  console.log("🖼️  Portal Lusitano — Image Optimization\n");

  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created ${OUTPUT_DIR}\n`);
  }

  // Process all images
  console.log(`📂 Scanning ${INPUT_DIR}...\n`);
  const results = await processDirectory(INPUT_DIR);

  // Generate blur data JSON
  const blurData: Record<string, string> = {};
  for (const result of results) {
    const { name } = parse(result.original);
    blurData[name] = result.blurDataURL;
  }
  writeFileSync(BLUR_DATA_FILE, JSON.stringify(blurData, null, 2));

  // Report
  let totalOriginal = 0;
  let totalOptimized = 0;
  let totalOutputFiles = 0;

  for (const result of results) {
    const { name } = parse(result.original);
    totalOriginal += result.originalSize;
    const bestOutput = result.outputs
      .filter((o) => o.format === "webp" && o.width === 800)
      .reduce((best, o) => (o.size < best.size ? o : best), result.outputs[0]);
    if (bestOutput) totalOptimized += bestOutput.size;
    totalOutputFiles += result.outputs.length;

    console.log(
      `  ✅ ${name} — ${formatBytes(result.originalSize)} → ${result.outputs.length} variants (${result.savings}% savings)`
    );
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Images processed: ${results.length}`);
  console.log(`   Output files: ${totalOutputFiles}`);
  console.log(`   Original total: ${formatBytes(totalOriginal)}`);
  console.log(`   Optimized total (800w WebP): ${formatBytes(totalOptimized)}`);
  console.log(`   Overall savings: ${Math.round((1 - totalOptimized / totalOriginal) * 100)}%`);
  console.log(`   Blur data: ${BLUR_DATA_FILE} (${Object.keys(blurData).length} entries)`);
  console.log(`\n✨ Done!`);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

main().catch(console.error);

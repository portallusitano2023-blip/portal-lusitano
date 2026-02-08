#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * Compresses all images in /public/images
 * Generates blur placeholders for Next.js Image component
 *
 * Usage: node scripts/optimize-images.js
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const INPUT_DIR = path.join(__dirname, "../public/images");
const OUTPUT_DIR = path.join(__dirname, "../public/images-optimized");
const BLUR_DIR = path.join(__dirname, "../public/images-blur");

// Create output directories
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(BLUR_DIR)) fs.mkdirSync(BLUR_DIR, { recursive: true });

// Optimization settings
const QUALITY = 80; // JPEG quality
const MAX_WIDTH = 1920; // Max width in pixels
const BLUR_SIZE = 20; // Blur placeholder size

async function optimizeImage(inputPath, filename) {
  const outputPath = path.join(OUTPUT_DIR, filename);
  const blurPath = path.join(BLUR_DIR, filename.replace(/\.(jpg|jpeg|png)$/i, ".webp"));

  try {
    console.log(`Optimizing: ${filename}`);

    // Get original size
    const originalStats = fs.statSync(inputPath);
    const originalSize = (originalStats.size / 1024).toFixed(2);

    // Optimize main image
    await sharp(inputPath)
      .resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .jpeg({ quality: QUALITY, progressive: true })
      .toFile(outputPath);

    // Generate blur placeholder (tiny WebP)
    const blurBuffer = await sharp(inputPath)
      .resize(BLUR_SIZE, null, {
        fit: "inside",
      })
      .webp({ quality: 20 })
      .toBuffer();

    fs.writeFileSync(blurPath, blurBuffer);

    // Get optimized size
    const optimizedStats = fs.statSync(outputPath);
    const optimizedSize = (optimizedStats.size / 1024).toFixed(2);
    const savings = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);

    console.log(`  ✅ ${originalSize}KB → ${optimizedSize}KB (${savings}% saved)`);

    // Generate base64 for blur placeholder
    const blurBase64 = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

    return {
      filename,
      originalSize: originalStats.size,
      optimizedSize: optimizedStats.size,
      savings: parseFloat(savings),
      blurDataURL: blurBase64,
    };
  } catch (error) {
    console.error(`  ❌ Error optimizing ${filename}:`, error.message);
    return null;
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  const results = [];
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip directories
      continue;
    }

    if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const result = await optimizeImage(filePath, file);
      if (result) {
        results.push(result);
        totalOriginal += result.originalSize;
        totalOptimized += result.optimizedSize;
      }
    }
  }

  return { results, totalOriginal, totalOptimized };
}

async function generateBlurDataFile(results) {
  const blurData = {};

  results.forEach((r) => {
    blurData[r.filename] = r.blurDataURL;
  });

  const outputFile = path.join(__dirname, "../lib/blur-data.json");
  fs.writeFileSync(outputFile, JSON.stringify(blurData, null, 2));

  console.log(`\n📝 Blur data saved to: lib/blur-data.json`);
}

async function main() {
  console.log("🖼️  Image Optimization Script\n");
  console.log(`Input:  ${INPUT_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  if (!fs.existsSync(INPUT_DIR)) {
    console.error("❌ Input directory not found!");
    process.exit(1);
  }

  const { results, totalOriginal, totalOptimized } = await processDirectory(INPUT_DIR);

  const totalSavings = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
  const totalOriginalMB = (totalOriginal / 1024 / 1024).toFixed(2);
  const totalOptimizedMB = (totalOptimized / 1024 / 1024).toFixed(2);

  console.log(`\n📊 Summary:`);
  console.log(`   Images processed: ${results.length}`);
  console.log(`   Original size:    ${totalOriginalMB} MB`);
  console.log(`   Optimized size:   ${totalOptimizedMB} MB`);
  console.log(`   Total savings:    ${totalSavings}%`);

  await generateBlurDataFile(results);

  console.log("\n✅ Done! Move optimized images:");
  console.log(`   cp -r ${OUTPUT_DIR}/* ${INPUT_DIR}/`);
}

main().catch(console.error);

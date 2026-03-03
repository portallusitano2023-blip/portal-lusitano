#!/usr/bin/env node
/**
 * Copies public/logo.png to app/icon.png
 * Next.js App Router auto-generates favicon from app/icon.png
 * Run: node scripts/copy-favicon.js
 */
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "public", "logo.png");
const dest = path.join(__dirname, "..", "app", "icon.png");

fs.copyFileSync(src, dest);
console.log("✅ Copied public/logo.png → app/icon.png");
console.log("   Next.js will auto-generate favicon from app/icon.png on next build.");

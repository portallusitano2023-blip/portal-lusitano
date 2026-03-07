import { existsSync, readdirSync } from "fs";
import path from "path";

// ── Extensões de imagem suportadas ────────────────────────────────────────
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".bmp", ".tiff"]);

/**
 * Detecta qualquer imagem na pasta public/images/jornal/{slug}/.
 * SERVER ONLY — usa módulos Node.js (fs/path).
 * Importar apenas em Server Components ou Route Handlers.
 */
export function findLocalCover(slug: string): string | null {
  const dir = path.join(process.cwd(), "public", "images", "jornal", slug);
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir);
  const img = files.find((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()));
  return img ? `/images/jornal/${slug}/${img}` : null;
}

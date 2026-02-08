/**
 * Image Utilities
 *
 * Helper functions for optimized images with blur placeholders
 */

import blurDataJSON from "./blur-data.json";

const blurData: Record<string, string> = blurDataJSON;

/**
 * Get blur placeholder for image
 *
 * @param filename - Image filename (e.g., "hero.jpg")
 * @returns Base64 blur data URL or default shimmer
 */
export function getBlurDataURL(filename: string): string {
  return blurData[filename] || shimmer(700, 475);
}

/**
 * Generate shimmer placeholder (fallback)
 *
 * Creates a subtle loading animation as base64 SVG
 */
function shimmer(width: number, height: number): string {
  return `data:image/svg+xml;base64,${toBase64(
    `<svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#1a1a1a" offset="20%" />
          <stop stop-color="#2a2a2a" offset="50%" />
          <stop stop-color="#1a1a1a" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#1a1a1a" />
      <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
    </svg>`
  )}`;
}

function toBase64(str: string): string {
  return typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);
}

/**
 * Get optimized image props for Next.js Image component
 *
 * @example
 * ```tsx
 * <Image {...getImageProps('/images/hero.jpg')} alt="Hero" />
 * ```
 */
export function getImageProps(
  src: string,
  options?: {
    priority?: boolean;
    quality?: number;
  }
) {
  const filename = src.split("/").pop() || "";

  return {
    src,
    placeholder: "blur" as const,
    blurDataURL: getBlurDataURL(filename),
    quality: options?.quality || 85,
    priority: options?.priority || false,
  };
}

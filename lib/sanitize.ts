/**
 * Sanitize user input for use in PostgREST .or() filter strings.
 * Strips characters that act as structural delimiters in PostgREST syntax.
 */
export function sanitizeSearchInput(input: string): string {
  return input.replace(/[,().\\%]/g, "").trim();
}

/**
 * Escape HTML special characters to prevent XSS in email templates.
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

import crypto from "crypto";

/**
 * Generate HMAC-SHA256 token for secure unsubscribe links.
 * Uses UNSUBSCRIBE_SECRET env var (falls back to ADMIN_SECRET).
 */
export function generateUnsubscribeToken(email: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("UNSUBSCRIBE_SECRET or ADMIN_SECRET environment variable is required");
  }
  return crypto.createHmac("sha256", secret).update(email.toLowerCase().trim()).digest("hex");
}

/**
 * Verify HMAC token for unsubscribe requests.
 */
export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = generateUnsubscribeToken(email);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

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

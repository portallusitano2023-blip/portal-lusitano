export function encodeFormState(data: Record<string, unknown>): string {
  try {
    const json = JSON.stringify(data);
    return btoa(encodeURIComponent(json));
  } catch {
    return "";
  }
}

export function decodeFormState(encoded: string): Record<string, unknown> {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function getShareUrl(toolSlug: string, data: Record<string, unknown>): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "https://portal-lusitano.pt";
  const encoded = encodeFormState(data);
  return `${base}/${toolSlug}?dados=${encoded}`;
}

export function shareToWhatsApp(text: string, url: string): void {
  const msg = encodeURIComponent(`${text}\n${url}`);
  window.open(`https://wa.me/?text=${msg}`, "_blank");
}

export function shareToFacebook(url: string): void {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

export async function shareNative(title: string, text: string, url: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

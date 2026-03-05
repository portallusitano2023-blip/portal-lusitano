/**
 * Constantes do Portal Lusitano
 */

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

export const COLORS = {
  gold: "#C5A059",
  dark: "#1a1410",
  darkBg: "#050505",
} as const;

export const ARTICLE_IMAGE_SIZES = "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px";

/** Email principal de contacto / admin notifications */
export const CONTACT_EMAIL = "portal.lusitano2023@gmail.com";

/** Email de suporte */
export const SUPPORT_EMAIL = "portal.lusitano2023@gmail.com";

/** Links das redes sociais */
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/portal_lusitano",
  tiktok: "https://tiktok.com/@portal_lusitano",
} as const;

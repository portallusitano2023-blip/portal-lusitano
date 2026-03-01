/**
 * Listing Tiers for the Portal Lusitano Horse Marketplace
 *
 * Tiered pricing system replacing the single EUR 49 listing price.
 * Prices are stored in cents to avoid floating-point issues.
 */

/** A single listing tier definition */
export interface ListingTier {
  /** Unique identifier used in the database and Stripe metadata */
  id: string;
  /** Display name (Portuguese) */
  name: string;
  /** Price in euro cents */
  priceInCents: number;
  /** Listing duration in days */
  durationDays: number;
  /** Maximum number of photos allowed (-1 = unlimited) */
  maxPhotos: number;
  /** Number of days the listing appears in the featured/highlighted section */
  featuredDays: number;
  /** Badge label shown on the listing card, or null for no badge */
  badge: string | null;
  /** Human-readable feature descriptions for the pricing UI */
  features: string[];
}

export const LISTING_TIERS: Record<string, ListingTier> = {
  basico: {
    id: "basico",
    name: "Basico",
    priceInCents: 2900,
    durationDays: 15,
    maxPhotos: 5,
    featuredDays: 0,
    badge: null,
    features: [
      "Anuncio visivel durante 15 dias",
      "Ate 5 fotografias",
      "Posicionamento standard",
    ],
  },
  standard: {
    id: "standard",
    name: "Standard",
    priceInCents: 4900,
    durationDays: 30,
    maxPhotos: 10,
    featuredDays: 0,
    badge: null,
    features: [
      "Anuncio visivel durante 30 dias",
      "Ate 10 fotografias",
      "Posicionamento standard",
    ],
  },
  destaque: {
    id: "destaque",
    name: "Destaque",
    priceInCents: 7900,
    durationDays: 30,
    maxPhotos: 15,
    featuredDays: 14,
    badge: "Destaque",
    features: [
      "Anuncio visivel durante 30 dias",
      "Ate 15 fotografias",
      "Destaque durante 14 dias",
      'Badge "Destaque"',
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    priceInCents: 14900,
    durationDays: 60,
    maxPhotos: -1,
    featuredDays: 30,
    badge: "Premium",
    features: [
      "Anuncio visivel durante 60 dias",
      "Fotografias ilimitadas",
      "Destaque durante 30 dias",
      'Badge "Premium"',
      "Promocao nas redes sociais",
    ],
  },
} as const;

/**
 * Retrieve a listing tier by its id.
 * Returns `undefined` when the id does not match any known tier.
 */
export function getListingTier(tierId: string): ListingTier | undefined {
  return LISTING_TIERS[tierId];
}

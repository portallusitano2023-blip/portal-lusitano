import { revalidateTag } from "next/cache";

/**
 * Cache tag constants for tag-based revalidation.
 * Use these tags in fetch() calls with { next: { tags: [...] } }
 * and call invalidate() after mutations.
 */
export const CacheTags = {
  CAVALOS: "cavalos",
  COUDELARIAS: "coudelarias",
  PROFISSIONAIS: "profissionais",
  EVENTOS: "eventos",
  REVIEWS: "reviews",
  DEPOIMENTOS: "depoimentos",
  TASKS: "tasks",
  CRM: "crm",
} as const;

export type CacheTag = (typeof CacheTags)[keyof typeof CacheTags];

/**
 * Invalidate one or more cache tags after a mutation.
 * Call this in admin API route handlers after successful writes.
 */
export function invalidate(...tags: CacheTag[]) {
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
}

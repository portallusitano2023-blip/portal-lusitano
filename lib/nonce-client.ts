/**
 * Client-side nonce access.
 *
 * For client components that need the nonce (e.g., components rendered
 * with "use client"), read it from a data attribute on a meta tag or
 * through props from the parent Server Component.
 *
 * This file provides utilities for client-side script injection with nonce.
 */

export function getNonceFromMeta(): string {
  // In a production setup, you'd typically pass the nonce through:
  // 1. Meta tag set by Server Component
  // 2. Context/Provider
  // 3. Props from parent Server Component
  //
  // For now, this returns empty string. Client components should
  // receive nonce through props or context from parent Server Components.
  return "";
}

'use server';

import { headers } from 'next/headers';

/**
 * Get the CSP nonce for inline scripts in Server Components.
 *
 * The nonce is set by middleware.ts in the 'x-nonce' header
 * for each request, ensuring unique nonces per request.
 *
 * Usage in Server Components:
 * ```tsx
 * import { getNonce } from '@/lib/nonce';
 *
 * const nonce = await getNonce();
 *
 * <script nonce={nonce} dangerouslySetInnerHTML={{ __html: '...' }} />
 * ```
 */
export async function getNonce(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-nonce') || '';
}

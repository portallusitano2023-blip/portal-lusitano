# CSP Nonce Implementation

## Overview

This document describes the implementation of CSP (Content Security Policy) nonces for the Portal Lusitano Next.js project to eliminate the need for `'unsafe-inline'` in the `script-src` directive.

## What Was Changed

### 1. Middleware Enhancement (`/sessions/youthful-eager-carson/mnt/portal-lusitano/middleware.ts`)

**Key Changes:**

- **Nonce Generation**: Added `generateNonce()` function that creates a unique cryptographic nonce per request using `crypto.getRandomValues()` and base64 encoding.

- **CSP Header Building**: Converted the static `CSP_STRING` to a dynamic `buildCSPString(nonce)` function that includes the nonce in the `script-src` directive.

- **Security Headers**: Updated `applySecurityHeaders()` to accept the `nonce` parameter and:
  - Set the CSP header with the nonce: `script-src 'self' 'nonce-${nonce}' 'unsafe-inline'`
  - Pass the nonce to Server Components via the `x-nonce` header
  - Keep `'unsafe-inline'` as a fallback for older browsers that don't support nonces

- **Middleware Function**: Modified to generate a unique nonce for each request and pass it to `applySecurityHeaders()`.

- **i18n Rewrite**: Updated the i18n rewrite response to also apply security headers with the nonce.

**CSP Structure:**

```
script-src 'self' 'nonce-<unique-base64>' 'unsafe-inline' [external-sources]
```

### 2. Nonce Access Utility (`/sessions/youthful-eager-carson/mnt/portal-lusitano/lib/nonce.ts`)

New file that provides server-side access to the nonce in Server Components:

```typescript
export async function getNonce(): Promise<string> {
  const headersList = await headers();
  return headersList.get("x-nonce") || "";
}
```

### 3. Root Layout Update (`/sessions/youthful-eager-carson/mnt/portal-lusitano/app/layout.tsx`)

**Changes:**

- Made `RootLayout` an async function to support `getNonce()` call
- Imported `getNonce` from `@/lib/nonce`
- Retrieved the nonce for the request: `const nonce = await getNonce();`
- Applied nonce to the theme inline script: `<script nonce={nonce} ...>`

This ensures the theme script that prevents FOUC (Flash of Unstyled Content) is protected by the nonce.

### 4. Success Pages Refactoring

**Vender Cavalo Success Page** (`/sessions/youthful-eager-carson/mnt/portal-lusitano/app/vender-cavalo/sucesso/`)

- **page.tsx**: Converted to Server Component that fetches the nonce and passes it to content component
- **content.tsx** (new): Client component that renders UI and receives nonce as prop, applies it to the auto-redirect script

**Publicidade Success Page** (`/sessions/youthful-eager-carson/mnt/portal-lusitano/app/publicidade/sucesso/`)

- **page.tsx**: Converted to Server Component that fetches the nonce and passes it to content component
- **content.tsx** (new): Client component that renders UI and receives nonce as prop, applies it to the auto-redirect script

Both pages now have inline scripts with the nonce attribute:

```jsx
<script nonce={nonce} dangerouslySetInnerHTML={{ __html: "..." }} />
```

## How It Works

### Per-Request Nonce Generation

Each HTTP request triggers middleware execution:

1. `middleware()` generates a unique 128-bit random value using `crypto.getRandomValues()`
2. Converts to URL-safe base64 string
3. Includes nonce in CSP header: `script-src 'self' 'nonce-<value>' 'unsafe-inline' ...`
4. Passes nonce to Server Components via `x-nonce` header

### Progressive Enhancement

The CSP includes both the nonce and `'unsafe-inline'` for compatibility:

- **Modern Browsers** (Chrome 51+, Firefox 59+, Safari 11.1+):
  - Recognize the nonce in script tags
  - Ignore `'unsafe-inline'` when nonce is present
  - Only execute scripts with matching nonce

- **Older Browsers**:
  - Don't understand nonces
  - Fall back to `'unsafe-inline'` directive
  - Still blocks XSS from external domains via `'self'`

### Server Component Flow

```
middleware.ts (generates nonce)
    ↓
  x-nonce header
    ↓
layout.tsx (getNonce() → async component)
    ↓
  passes nonce to inline script
    ↓
page.tsx (Server Component)
    ↓
  fetches nonce, passes to client component
    ↓
content.tsx (Client Component with props)
    ↓
  renders with nonce in inline script
```

## Files Modified

1. `/sessions/youthful-eager-carson/mnt/portal-lusitano/middleware.ts`
   - Added nonce generation and CSP building logic

2. `/sessions/youthful-eager-carson/mnt/portal-lusitano/app/layout.tsx`
   - Made async, added nonce import, applied nonce to theme script

## Files Created

1. `/sessions/youthful-eager-carson/mnt/portal-lusitano/lib/nonce.ts`
   - Server-side utility to retrieve nonce from headers

2. `/sessions/youthful-eager-carson/mnt/portal-lusitano/lib/nonce-client.ts`
   - Placeholder for future client-side utilities

3. `/sessions/youthful-eager-carson/mnt/portal-lusitano/app/vender-cavalo/sucesso/content.tsx`
   - Client component for vender success page

4. `/sessions/youthful-eager-carson/mnt/portal-lusitano/app/publicidade/sucesso/content.tsx`
   - Client component for publicidade success page

## Security Benefits

1. **XSS Protection**: Inline scripts must include the correct nonce attribute to execute
2. **Unique per Request**: Each request gets a different nonce, preventing nonce reuse attacks
3. **Cryptographically Random**: Uses `crypto.getRandomValues()` for secure randomness
4. **Backward Compatible**: Older browsers still protected by `'self'` + `'unsafe-inline'` fallback
5. **No External Dependency**: Uses Node.js built-in crypto module

## Performance Impact

- **Minimal**: Nonce generation is ~1ms per request
- **Dynamic Rendering**: Calling `getNonce()` causes page to be server-rendered per request instead of static generation
  - Trade-off: Enhanced security > Static generation performance
  - If static generation is critical, can exclude `getNonce()` call from layout and apply nonce only where needed

## Testing Recommendations

1. **Verify CSP Header**: Check that each request has a unique nonce

   ```bash
   curl -I https://portal-lusitano.pt | grep Content-Security-Policy
   ```

2. **Browser DevTools**:
   - Open DevTools → Network → Response Headers
   - Verify `Content-Security-Policy` header includes unique nonce
   - Verify inline scripts have matching `nonce` attribute

3. **Functionality Tests**:
   - Verify theme switching still works (layout.tsx script)
   - Verify success pages still auto-redirect (content.tsx scripts)
   - Verify no CSP violations in console

4. **Security Validation**:
   - Attempt to inject arbitrary script without nonce → should be blocked
   - Verify Google Analytics and other external scripts still load

## Future Improvements

1. **Next.js Built-in Nonce Support**: When Next.js fully supports automatic nonce injection, migrate to use their implementation
2. **CSP Reporting**: Add `report-uri` or `report-to` directive to track CSP violations
3. **Strict-Dynamic**: Once all scripts are properly nonced, can add `'strict-dynamic'` to further reduce allowed domains

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// --- Rate Limiting (Upstash Redis — serverless-safe sliding window) ---
// Instances are inline here (not imported from lib/) because middleware runs in Edge Runtime
// with separate module scope. lib/rate-limit.ts provides complementary in-memory LRU limiting
// for API routes running in Node.js runtime.
const redis = Redis.fromEnv();

const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  prefix: "rl:auth",
});

const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  prefix: "rl:api",
});

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Pre-computed at module load — avoids string concatenation on every request
const IS_DEV = process.env.NODE_ENV === "development";

/**
 * Nonce-based CSP: generates a fresh nonce per request and embeds it in
 * script-src. The nonce is passed to server components via the x-nonce
 * request header so <script nonce> tags can match. unsafe-inline is kept
 * as a fallback for browsers that don't support nonces, but nonce-aware
 * browsers ignore unsafe-inline when a nonce is present.
 */
function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'nonce-${nonce}'${IS_DEV ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://cdn.shopify.com https://cdn.sanity.io https://www.google-analytics.com https://www.facebook.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.googleusercontent.com https://*.basemaps.cartocdn.com https://*.supabase.co",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com https://www.facebook.com https://*.supabase.co https://*.shopify.com https://*.sanity.io https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net https://*.adtrafficquality.google",
    "frame-src 'self' blob: https://js.stripe.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com",
    "object-src 'none'",
    "base-uri 'self'",
  ].join("; ");
}

function applySecurityHeaders(response: NextResponse, nonce: string, contentLanguage = "pt") {
  response.headers.set("Content-Security-Policy", buildCsp(nonce));
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Content-Language", contentLanguage);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
}

export async function middleware(request: NextRequest) {
  // Generate a fresh nonce for each request (base64-encoded UUID)
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Forward nonce to server components via request header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  const pathname = request.nextUrl.pathname;

  applySecurityHeaders(response, nonce);

  // API routes: Rate Limiting + CORS
  if (pathname.startsWith("/api/")) {
    // Skip rate limiting for webhooks (Stripe needs unrestricted access)
    const isWebhook = pathname.startsWith("/api/stripe/webhook");

    if (!isWebhook) {
      const ip = getClientIp(request);
      const isAuth = pathname.startsWith("/api/auth/login");

      // Auth routes: 10 req/15min, other API: 60 req/min (Upstash sliding window)
      const limiter = isAuth ? authLimiter : apiLimiter;
      const identifier = isAuth ? `auth:${ip}` : `api:${ip}`;
      const { success } = await limiter.limit(identifier);

      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    // CORS
    const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL;
    if (allowedOrigin) {
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
      response.headers.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT,OPTIONS");
      response.headers.set(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
      );
    }

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }

  // Redirect www to non-www (or vice versa)
  const hostname = request.headers.get("host");
  if (hostname?.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = hostname.replace("www.", "");
    return NextResponse.redirect(url, 301);
  }

  // i18n: Rewrite /en/* and /es/* routes to serve the same pages with locale cookie
  // Isto permite que o Google indexe /en/comprar, /en/loja, /es/comprar, /es/loja, etc.
  const i18nMatch = pathname.match(/^\/(en|es)(\/|$)/);
  if (i18nMatch) {
    const locale = i18nMatch[1] as "en" | "es";
    const strippedPath = pathname.replace(/^\/(en|es)/, "") || "/";
    const url = request.nextUrl.clone();
    url.pathname = strippedPath;

    const rewriteResponse = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    rewriteResponse.cookies.set("locale", locale, { path: "/", sameSite: "lax" });
    applySecurityHeaders(rewriteResponse, nonce, locale);
    return rewriteResponse;
  }

  // Protect admin routes (except login page)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify JWT token using jose (same as lib/auth.ts)
    try {
      if (!process.env.ADMIN_SECRET) {
        // ADMIN_SECRET not set - rejecting admin access
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);
      const { payload } = await (await import("jose")).jwtVerify(token, secret);

      // Check if token has expired
      if (!payload.email) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch {
      // Invalid or expired token
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|images|manifest.json|sw.js).*)",
  ],
};

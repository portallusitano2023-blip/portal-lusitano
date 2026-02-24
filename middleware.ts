import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { jwtVerify } from "jose";

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
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL || "https://portal-lusitano.pt";

/**
 * CSRF protection: validate Origin header on state-changing requests.
 * Rejects cross-origin POST/PUT/PATCH/DELETE unless from our own domain.
 * Skips webhooks (Stripe sends from its own servers) and preflight OPTIONS.
 */
function isValidOrigin(request: NextRequest): boolean {
  const method = request.method;
  // Only check state-changing methods
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return true;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Webhooks (Stripe, cron) don't send Origin — allow server-to-server calls
  if (!origin && !referer) return true;

  const allowedHosts = [new URL(ALLOWED_ORIGIN).host, "localhost:3000", "localhost:3001"];

  if (origin) {
    try {
      return allowedHosts.includes(new URL(origin).host);
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      return allowedHosts.includes(new URL(referer).host);
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * Nonce-based CSP: generates a fresh nonce per request and embeds it in
 * script-src. 'strict-dynamic' allows nonce-trusted scripts to load their
 * own dependencies. No 'unsafe-inline' — nonce-aware browsers ignore it
 * anyway, and removing it hardens CSP for all browsers.
 */
function buildCsp(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${IS_DEV ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net`,
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
  // CSP must be set here (needs per-request nonce). Other security headers
  // (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, etc.)
  // are already set in next.config.js headers() — no need to duplicate them.
  response.headers.set("Content-Security-Policy", buildCsp(nonce));
  response.headers.set("Content-Language", contentLanguage);
  response.headers.set("X-Download-Options", "noopen");
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

  // API routes: CSRF + Rate Limiting + CORS + Admin guard
  if (pathname.startsWith("/api/")) {
    // CSRF protection: reject cross-origin state-changing requests
    if (!isValidOrigin(request)) {
      return NextResponse.json({ error: "Forbidden: invalid origin" }, { status: 403 });
    }

    // Admin API guard (defense-in-depth — routes also check verifySession())
    if (pathname.startsWith("/api/admin/") && !pathname.startsWith("/api/admin/login")) {
      const token = request.cookies.get("admin_session")?.value;
      if (!token) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }
      try {
        if (!process.env.ADMIN_SECRET) {
          return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }
        const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (!payload.email || !payload.jti) {
          return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }
        const session = await redis.get(`session:${payload.jti}`);
        if (!session) {
          return NextResponse.json({ error: "Sessão expirada" }, { status: 401 });
        }
      } catch {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
      }
    }

    // Skip rate limiting for webhooks and read-only public endpoints (saves Redis round-trip)
    const skipRateLimit =
      pathname.startsWith("/api/stripe/webhook") ||
      (request.method === "GET" &&
        (pathname === "/api/cavalos" ||
          pathname === "/api/coudelarias" ||
          pathname === "/api/eventos" ||
          pathname === "/api/linhagens" ||
          pathname === "/api/profissionais" ||
          pathname === "/api/search" ||
          pathname === "/api/reviews" ||
          pathname === "/api/health" ||
          pathname === "/api/tools/stats" ||
          pathname.startsWith("/api/coudelarias/") ||
          pathname.startsWith("/api/eventos/") ||
          pathname.startsWith("/api/profissionais/")));

    if (!skipRateLimit) {
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

    // Prevent caching of auth-dependent and admin API responses
    if (
      pathname.startsWith("/api/admin/") ||
      pathname.startsWith("/api/auth/") ||
      pathname === "/api/favoritos" ||
      pathname === "/api/cart/get"
    ) {
      response.headers.set("Cache-Control", "private, no-store");
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
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      const secret = new TextEncoder().encode(process.env.ADMIN_SECRET);
      const { payload } = await jwtVerify(token, secret);

      if (!payload.email || !payload.jti) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      // Check Redis: session may have been revoked even if JWT is still valid
      const session = await redis.get(`session:${payload.jti}`);
      if (!session) {
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

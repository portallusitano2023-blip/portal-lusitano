import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// --- Rate Limiting (Edge-compatible, in-memory) ---
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > limit;
}

// Cleanup stale entries periodically
let requestCounter = 0;
function cleanupRateLimitMap() {
  requestCounter++;
  if (requestCounter % 1000 === 0) {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetTime) rateLimitMap.delete(key);
    }
  }
}

// Pre-computed at module load — avoids string concatenation on every request
const IS_DEV = process.env.NODE_ENV === "development";
const CSP_DIRECTIVES = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${IS_DEV ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://cdn.shopify.com https://cdn.sanity.io https://www.google-analytics.com https://www.facebook.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.googleusercontent.com https://*.basemaps.cartocdn.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://www.google-analytics.com https://www.facebook.com https://*.supabase.co https://*.shopify.com https://*.sanity.io https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net https://*.adtrafficquality.google",
  "frame-src 'self' https://js.stripe.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

function applySecurityHeaders(response: NextResponse, contentLanguage = "pt") {
  response.headers.set("Content-Security-Policy", CSP_DIRECTIVES);
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Content-Language", contentLanguage);
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  applySecurityHeaders(response);

  // API routes: Rate Limiting + CORS
  if (pathname.startsWith("/api/")) {
    cleanupRateLimitMap();

    // Skip rate limiting for webhooks (Stripe needs unrestricted access)
    const isWebhook = pathname.startsWith("/api/stripe/webhook");

    if (!isWebhook) {
      const ip = getClientIp(request);
      const isAuth = pathname.startsWith("/api/auth/login");

      // Auth routes: 10 req/15min, other API: 60 req/min
      const limit = isAuth ? 10 : 60;
      const window = isAuth ? 15 * 60 * 1000 : 60 * 1000;
      const key = isAuth ? `auth:${ip}` : `api:${ip}`;

      if (isRateLimited(key, limit, window)) {
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

    const rewriteResponse = NextResponse.rewrite(url);
    rewriteResponse.cookies.set("locale", locale, { path: "/", sameSite: "lax" });
    applySecurityHeaders(rewriteResponse, locale);
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

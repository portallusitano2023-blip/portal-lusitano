import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Additional security headers (beyond next.config.js)
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL;
    if (allowedOrigin) {
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET,DELETE,PATCH,POST,PUT,OPTIONS"
      );
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

  // i18n: Rewrite /en/* routes to serve the same pages with locale cookie
  // Isto permite que o Google indexe /en/comprar, /en/loja, etc.
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/en/") || pathname === "/en") {
    // Strip /en prefix and rewrite to the Portuguese route
    const strippedPath = pathname.replace(/^\/en/, "") || "/";
    const url = request.nextUrl.clone();
    url.pathname = strippedPath;

    const rewriteResponse = NextResponse.rewrite(url);
    // Set locale cookie so LanguageContext initializes in English
    rewriteResponse.cookies.set("locale", "en", { path: "/", sameSite: "lax" });
    // Copy security headers
    rewriteResponse.headers.set("X-DNS-Prefetch-Control", "on");
    rewriteResponse.headers.set("X-Download-Options", "noopen");
    rewriteResponse.headers.set("X-Permitted-Cross-Domain-Policies", "none");
    rewriteResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    // Set Content-Language header for SEO
    rewriteResponse.headers.set("Content-Language", "en");
    return rewriteResponse;
  }

  // Set Content-Language for Portuguese routes
  response.headers.set("Content-Language", "pt");

  // Protect admin routes (except login page)
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_session")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify JWT token using jose (same as lib/auth.ts)
    try {
      const secret = new TextEncoder().encode(process.env.ADMIN_SECRET || "fallback-secret-key");
      const { payload } = await (await import("jose")).jwtVerify(token, secret);

      // Check if token has expired
      if (!payload.email) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch (error) {
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

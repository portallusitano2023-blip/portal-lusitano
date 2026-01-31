import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Verify admin token using Web Crypto API (Edge compatible)
async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return false;

    const secret = process.env.ADMIN_SECRET || "change-this-in-production";
    const encoder = new TextEncoder();

    // Import key for HMAC
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    // Generate expected signature
    const signatureBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
    const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    if (signature !== expectedSignature) return false;

    // Parse and check expiration
    const payload = JSON.parse(atob(data.replace(/-/g, "+").replace(/_/g, "/")));
    if (Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

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

  // Protect admin routes (except login page)
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token || !(await verifyAdminToken(token))) {
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

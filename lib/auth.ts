import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

function getSecret() {
  if (!process.env.ADMIN_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SECRET environment variable is required in production");
  }
  return new TextEncoder().encode(process.env.ADMIN_SECRET || "dev-only-secret-not-for-production");
}

/**
 * TODO [MEDIUM Security]: Add JWT revocation mechanism
 *
 * Current JWT tokens are valid for 7 days with no way to revoke them.
 * If a token is stolen, the attacker has full access for the entire 7-day window.
 *
 * To fix:
 * 1. Store JTI (JWT ID) in Redis with 7-day TTL
 * 2. On password change / logout, add JTI to blacklist in Redis
 * 3. In verifySession(), check if JTI is blacklisted
 * 4. Optional: Implement token rotation (refresh + access tokens)
 *
 * Example with Upstash:
 * ```
 * const jti = crypto.randomUUID();
 * await redis.setex(`session:${jti}`, 604800, email); // 7 days
 * // In verifySession():
 * const exists = await redis.get(`session:${jti}`);
 * if (!exists) return null; // revoked
 * ```
 */
export async function createSession(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret());

  (await cookies()).set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return token;
}

export async function verifySession() {
  const cookie = (await cookies()).get("admin_session");

  if (!cookie?.value) {
    return null;
  }

  try {
    const verified = await jwtVerify(cookie.value, getSecret());
    return verified.payload.email as string;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete("admin_session");
}

export function checkCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPassword = process.env.ADMIN_PASSWORD || "";

  // Timing-safe email comparison
  const emailBytes = new TextEncoder().encode(email);
  const adminEmailBytes = new TextEncoder().encode(adminEmail);

  let emailMismatch = emailBytes.length ^ adminEmailBytes.length;
  const minEmailLen = Math.min(emailBytes.length, adminEmailBytes.length);
  for (let i = 0; i < minEmailLen; i++) {
    emailMismatch |= emailBytes[i] ^ adminEmailBytes[i];
  }

  // Timing-safe password comparison
  const passBytes = new TextEncoder().encode(password);
  const adminBytes = new TextEncoder().encode(adminPassword);

  let passMismatch = passBytes.length ^ adminBytes.length;
  const minPassLen = Math.min(passBytes.length, adminBytes.length);
  for (let i = 0; i < minPassLen; i++) {
    passMismatch |= passBytes[i] ^ adminBytes[i];
  }

  return emailMismatch === 0 && passMismatch === 0;
}

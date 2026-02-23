import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";

// HIGH-03 fix: Redis session store enables instant JWT revocation
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days in seconds

function getSecret() {
  if (!process.env.ADMIN_SECRET) {
    throw new Error("ADMIN_SECRET environment variable is required");
  }
  return new TextEncoder().encode(process.env.ADMIN_SECRET);
}

export async function createSession(email: string) {
  // JTI (JWT ID) uniquely identifies this token — deleting it from Redis revokes access instantly
  const jti = crypto.randomUUID();

  const token = await new SignJWT({ email, jti })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getSecret());

  // Register session in Redis — the source of truth for session validity
  await redis.setex(`session:${jti}`, SESSION_TTL, email);

  (await cookies()).set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL,
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
    const jti = verified.payload.jti as string | undefined;

    // Check Redis: session may have been revoked even if JWT signature is valid
    if (!jti) return null;
    const session = await redis.get(`session:${jti}`);
    if (!session) return null; // Revoked or expired in Redis

    return verified.payload.email as string;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookie = (await cookies()).get("admin_session");

  // Revoke JTI in Redis — the cookie JWT becomes permanently invalid even if extracted
  if (cookie?.value) {
    try {
      const verified = await jwtVerify(cookie.value, getSecret());
      const jti = verified.payload.jti as string | undefined;
      if (jti) await redis.del(`session:${jti}`);
    } catch {
      // Token already invalid, proceed to clear cookie
    }
  }

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

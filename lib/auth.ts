import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

// HIGH-03 fix: Redis session store enables instant JWT revocation
// Falls back gracefully if Redis is unavailable (JWT still works, just no revocation)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

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
  if (redis) {
    try {
      await redis.setex(`session:${jti}`, SESSION_TTL, email);
    } catch (err) {
      console.error("[auth] Redis setex failed, session will rely on JWT only:", err);
    }
  }

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
    if (redis) {
      try {
        const session = await redis.get(`session:${jti}`);
        if (!session) return null; // Revoked or expired in Redis
      } catch (err) {
        console.error("[auth] Redis get failed, accepting JWT as valid:", err);
        // Fall through — if Redis is down, trust the JWT signature
      }
    }

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
      if (jti && redis) {
        try {
          await redis.del(`session:${jti}`);
        } catch {
          // Redis down — token will expire naturally via JWT TTL
        }
      }
    } catch {
      // Token already invalid, proceed to clear cookie
    }
  }

  (await cookies()).delete("admin_session");
}

export function checkCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL || "";
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";

  if (!adminEmail || !adminPasswordHash) {
    return false;
  }

  // Timing-safe email comparison using crypto.timingSafeEqual with zero-padded buffers
  const maxEmailLen = Math.max(email.length, adminEmail.length);
  const emailBuf = Buffer.alloc(maxEmailLen);
  const adminEmailBuf = Buffer.alloc(maxEmailLen);
  Buffer.from(email).copy(emailBuf);
  Buffer.from(adminEmail).copy(adminEmailBuf);

  const emailMatch =
    email.length === adminEmail.length && crypto.timingSafeEqual(emailBuf, adminEmailBuf);

  // Password: SHA-256 hash comparison only (no plaintext fallback)
  const inputHash = crypto.createHash("sha256").update(password).digest();
  const storedHash = Buffer.from(adminPasswordHash, "hex");

  const passMatch =
    inputHash.length === storedHash.length && crypto.timingSafeEqual(inputHash, storedHash);

  return emailMatch && passMatch;
}

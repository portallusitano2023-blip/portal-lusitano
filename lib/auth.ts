import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

// HIGH-03 fix: Redis session store enables instant JWT revocation
// Falls back gracefully if Redis is unavailable (JWT still works, just no revocation)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

const SESSION_TTL = 60 * 60 * 2; // 2 hours in seconds

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
    .setExpirationTime("2h")
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

export async function refreshSession() {
  const cookie = (await cookies()).get("admin_session");

  if (!cookie?.value) {
    return null;
  }

  try {
    const verified = await jwtVerify(cookie.value, getSecret());
    const email = verified.payload.email as string | undefined;
    const issuedAt = verified.payload.iat as number | undefined;

    if (!email || !issuedAt) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    const ageSeconds = now - issuedAt;
    const oneHourSeconds = 60 * 60;

    // If token is older than 1 hour, create a new one
    if (ageSeconds > oneHourSeconds) {
      // Delete the old session
      const jti = verified.payload.jti as string | undefined;
      if (jti && redis) {
        try {
          await redis.del(`session:${jti}`);
        } catch {
          // Redis down — old token will expire naturally
        }
      }

      // Create new session
      return await createSession(email);
    }

    return cookie.value;
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

export function checkCredentials(email: string, password: string): boolean {
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

  if (!emailMatch) return false;

  // ---------------------------------------------------------------------------
  // Password verification — scrypt (new) with SHA-256 legacy fallback.
  //
  // New format  : "scrypt:<hex_salt>:<hex_hash>"
  //   Generated by hashPassword() below.  Resistant to GPU/ASIC brute-force
  //   because scrypt is intentionally memory-hard (N=16384, r=8, p=1).
  //
  // Legacy format: 64-char hex string (SHA-256)
  //   SECURITY NOTE: SHA-256 is a general-purpose hash, NOT a password hash.
  //   It has no salting and is trivially cracked with rainbow tables / GPUs.
  //   Migrate by running hashPassword(newPassword) and updating ADMIN_PASSWORD_HASH.
  // ---------------------------------------------------------------------------
  if (adminPasswordHash.startsWith("scrypt:")) {
    const parts = adminPasswordHash.split(":");
    if (parts.length !== 3) return false;

    const [, saltHex, expectedHashHex] = parts;
    try {
      const salt = Buffer.from(saltHex, "hex");
      const expectedHash = Buffer.from(expectedHashHex, "hex");
      // Must match parameters used in hashPassword() — changing these is a
      // breaking change that requires regenerating ADMIN_PASSWORD_HASH.
      const derivedKey = crypto.scryptSync(password, salt, 64, {
        N: 16384,
        r: 8,
        p: 1,
      });
      return (
        derivedKey.length === expectedHash.length &&
        crypto.timingSafeEqual(derivedKey, expectedHash)
      );
    } catch {
      return false;
    }
  }

  // Legacy SHA-256 path — kept for zero-downtime migration.
  // Once ADMIN_PASSWORD_HASH is updated to the scrypt format this branch is dead.
  const inputHash = crypto.createHash("sha256").update(password).digest();
  const storedHash = Buffer.from(adminPasswordHash, "hex");

  return inputHash.length === storedHash.length && crypto.timingSafeEqual(inputHash, storedHash);
}

/**
 * Hash a plain-text password with scrypt for storage in ADMIN_PASSWORD_HASH.
 *
 * Usage (run once in a Node REPL or script):
 *   import { hashPassword } from "@/lib/auth";
 *   console.log(hashPassword("my-new-password"));
 *   // → "scrypt:<hex_salt>:<hex_hash>"  (copy into .env as ADMIN_PASSWORD_HASH)
 *
 * Parameters: N=16384, r=8, p=1, keylen=64 bytes.
 * Approx. cost: ~150ms on a modern CPU — intentionally slow for brute-force resistance.
 */
export function hashPassword(plaintext: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(plaintext, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

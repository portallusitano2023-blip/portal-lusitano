import { createHmac, timingSafeEqual } from "crypto";

function getAdminSecret(): string {
  if (!process.env.ADMIN_SECRET && process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SECRET environment variable is required in production");
  }
  return process.env.ADMIN_SECRET || "dev-only-local-secret-min16chars";
}
const TOKEN_EXPIRY_HOURS = 24;

interface TokenPayload {
  email: string;
  exp: number;
}

// Base64url encode (compatible with Web Crypto API in middleware)
function toBase64Url(input: Buffer | string): string {
  const buffer = typeof input === "string" ? Buffer.from(input) : input;
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Generate a secure admin token
export function generateAdminToken(email: string): string {
  const exp = Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000;
  const payload: TokenPayload = { email, exp };
  const data = toBase64Url(JSON.stringify(payload));
  const signatureBuffer = createHmac("sha256", getAdminSecret()).update(data).digest();
  const signature = toBase64Url(signatureBuffer);
  return `${data}.${signature}`;
}

// Verify admin token
export function verifyAdminToken(token: string): TokenPayload | null {
  try {
    const [data, signature] = token.split(".");
    if (!data || !signature) return null;

    // Verify signature
    const expectedSignature = createHmac("sha256", getAdminSecret())
      .update(data)
      .digest("base64url");
    const signatureBuffer = Buffer.from(signature, "base64url");
    const expectedBuffer = Buffer.from(expectedSignature, "base64url");

    if (signatureBuffer.length !== expectedBuffer.length) return null;
    if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

    // Parse payload
    const payload: TokenPayload = JSON.parse(Buffer.from(data, "base64url").toString());

    // Check expiration
    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

// Verify admin credentials
export function verifyAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables");
    return false;
  }

  // Use timing-safe comparison for password
  const emailMatch = email.toLowerCase() === adminEmail.toLowerCase();
  const passwordBuffer = Buffer.from(password);
  const adminPasswordBuffer = Buffer.from(adminPassword);

  if (passwordBuffer.length !== adminPasswordBuffer.length) return false;
  const passwordMatch = timingSafeEqual(passwordBuffer, adminPasswordBuffer);

  return emailMatch && passwordMatch;
}

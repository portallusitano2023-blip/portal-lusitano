import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

if (!process.env.ADMIN_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("ADMIN_SECRET environment variable is required in production");
}
const secret = new TextEncoder().encode(process.env.ADMIN_SECRET || "dev-only-secret-not-for-production");

export async function createSession(email: string) {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

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
    const verified = await jwtVerify(cookie.value, secret);
    return verified.payload.email as string;
  } catch (error) {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete("admin_session");
}

export function checkCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  return email === adminEmail && password === adminPassword;
}

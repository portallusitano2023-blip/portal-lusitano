"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateAdminToken, verifyAdminCredentials } from "@/lib/admin-auth";

export async function adminLogin(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Por favor, preencha todos os campos." };
  }

  // Verify credentials
  if (!verifyAdminCredentials(email, password)) {
    // Add delay to prevent brute force
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { error: "Credenciais inválidas." };
  }

  // Generate token and set cookie
  const token = generateAdminToken(email);
  const cookieStore = await cookies();

  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  redirect("/admin");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/admin/login");
}

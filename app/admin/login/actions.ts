"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkCredentials, createSession } from "@/lib/auth";

export async function adminLogin(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Por favor, preencha todos os campos." };
  }

  // Verify credentials usando o sistema unificado
  if (!checkCredentials(email, password)) {
    // Add delay to prevent brute force
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { error: "Credenciais inválidas." };
  }

  // Criar sessão JWT unificada
  try {
    await createSession(email);
  } catch (err) {
    console.error("[adminLogin] Session creation failed:", err);
    return { error: "Erro ao criar sessão. Verifique a conexão ao servidor." };
  }

  redirect("/admin");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

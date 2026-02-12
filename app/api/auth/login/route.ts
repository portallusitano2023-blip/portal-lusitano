import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, createSession } from "@/lib/auth";
import { authLimiter } from "@/lib/rate-limit";
import { loginSchema, parseWithZod } from "@/lib/schemas";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 attempts per 15 minutes per IP
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    try {
      await authLimiter.check(5, ip);
    } catch {
      return NextResponse.json(
        { error: "Demasiadas tentativas. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = parseWithZod(loginSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const { email, password } = parsed.data;

    // Verificar credenciais
    if (!checkCredentials(email, password)) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    // Criar sessão
    await createSession(email);

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Login error:", error);
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}

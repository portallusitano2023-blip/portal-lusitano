import { NextResponse } from "next/server";
import { client } from "@/lib/client";
import { apiLimiter } from "@/lib/rate-limit";
import { newsletterSchema, parseWithZod } from "@/lib/schemas";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    try {
      await apiLimiter.check(10, ip);
    } catch {
      return NextResponse.json(
        { error: "Demasiados pedidos. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = parseWithZod(newsletterSchema, body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const { email } = parsed.data;

    // Escreve o novo subscritor diretamente no Sanity
    await client.create({
      _type: "subscritor",
      email: email,
      dataInscricao: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Subscrição concluída" }, { status: 200 });
  } catch (error) {
    logger.error("Erro na Newsletter:", error);
    return NextResponse.json({ error: "Erro ao salvar e-mail" }, { status: 500 });
  }
}

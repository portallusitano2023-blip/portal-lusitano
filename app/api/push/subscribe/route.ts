import { NextResponse } from "next/server";
import { apiLimiter } from "@/lib/rate-limit";
import { z } from "zod";

// Schema for validating the PushSubscription payload sent by the browser
const pushSubscriptionSchema = z.object({
  endpoint: z.string().url("Endpoint invalido"),
  keys: z
    .object({
      p256dh: z.string().min(1),
      auth: z.string().min(1),
    })
    .optional(),
  expirationTime: z.number().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    // Rate limit: 5 subscription requests per minute per IP
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    try {
      await apiLimiter.check(5, ip);
    } catch {
      return NextResponse.json(
        { error: "Demasiados pedidos. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = pushSubscriptionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados de subscricao invalidos.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const subscription = parsed.data;

    // TODO: Persist subscription to database (Sanity, Postgres, etc.)
    // For now, log the subscription so it can be verified during development.
    // In production, this should be stored and used with web-push to send
    // notifications to subscribed clients.
    console.log("[Push Subscribe] New subscription received:", {
      endpoint: subscription.endpoint,
      hasKeys: !!subscription.keys,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Subscricao registada com sucesso." }, { status: 201 });
  } catch (error) {
    console.error("[Push Subscribe] Error:", error);
    return NextResponse.json({ error: "Erro ao processar subscricao." }, { status: 500 });
  }
}

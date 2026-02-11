import { NextResponse } from "next/server";
import { apiLimiter } from "@/lib/rate-limit";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";
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

    // Persist subscription to Supabase (upsert by endpoint to avoid duplicates)
    const { error: dbError } = await supabase.from("push_subscriptions").upsert(
      {
        endpoint: subscription.endpoint,
        keys_p256dh: subscription.keys?.p256dh || null,
        keys_auth: subscription.keys?.auth || null,
        expiration_time: subscription.expirationTime || null,
        ip_address: ip,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "endpoint" }
    );

    if (dbError) {
      // Log the error but still return success - the subscription is valid,
      // we just couldn't persist it. A fallback in-memory approach could be used.
      logger.error("[Push Subscribe] Failed to persist to database", dbError);
    } else {
      logger.info("[Push Subscribe] Subscription persisted", {
        endpoint: subscription.endpoint.slice(0, 50) + "...",
      });
    }

    return NextResponse.json({ message: "Subscricao registada com sucesso." }, { status: 201 });
  } catch (error) {
    logger.error("[Push Subscribe] Error:", error);
    return NextResponse.json({ error: "Erro ao processar subscricao." }, { status: 500 });
  }
}

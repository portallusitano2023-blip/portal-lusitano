import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portal-lusitano.pt";

/**
 * POST /api/cart/track-abandonment
 *
 * Tracks an abandoned cart when user adds items but doesn't complete checkout.
 * Triggered by client-side cart state changes (debounced).
 *
 * Body:
 * {
 *   email: string (required if user logged in, otherwise optional)
 *   sessionId: string (required - browser session)
 *   cartItems: array (required)
 *   cartTotal: number (required)
 *   cartQuantity: number (required)
 *   utm: { source, medium, campaign } (optional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, sessionId, cartItems, cartTotal, cartQuantity, utm } = body;

    // Validation
    if (!sessionId || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (cartTotal <= 0 || cartQuantity <= 0) {
      return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
    }

    // If no email provided, can't send recovery email (skip tracking)
    if (!email) {
      return NextResponse.json({ tracked: false, reason: "no_email" });
    }

    // Generate secure recovery token
    const { data: tokenData } = await supabase.rpc("generate_recovery_token");
    const recoveryToken = tokenData as string;

    const recoveryUrl = `${siteUrl}/loja?recover=${encodeURIComponent(recoveryToken)}`;

    // Get user agent and IP
    const userAgent = request.headers.get("user-agent") || "";
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";

    // Check if cart already exists for this session (update instead of insert)
    const { data: existingCart } = await supabase
      .from("abandoned_carts")
      .select("id")
      .eq("session_id", sessionId)
      .eq("recovered", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (existingCart) {
      // Update existing cart
      const { error: updateError } = await supabase
        .from("abandoned_carts")
        .update({
          email,
          cart_items: cartItems,
          cart_total: cartTotal,
          cart_quantity: cartQuantity,
          utm_source: utm?.source,
          utm_medium: utm?.medium,
          utm_campaign: utm?.campaign,
          user_agent: userAgent,
          ip_address: ip,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingCart.id);

      if (updateError) {
        logger.error("Error updating abandoned cart:", updateError);
        return NextResponse.json({ error: "Failed to update cart tracking" }, { status: 500 });
      }

      return NextResponse.json({
        tracked: true,
        updated: true,
        cartId: existingCart.id,
      });
    }

    // Insert new abandoned cart
    const { data: cart, error: insertError } = await supabase
      .from("abandoned_carts")
      .insert({
        email,
        session_id: sessionId,
        cart_items: cartItems,
        cart_total: cartTotal,
        cart_quantity: cartQuantity,
        recovery_token: recoveryToken,
        recovery_url: recoveryUrl,
        utm_source: utm?.source,
        utm_medium: utm?.medium,
        utm_campaign: utm?.campaign,
        user_agent: userAgent,
        ip_address: ip,
      })
      .select()
      .single();

    if (insertError) {
      logger.error("Error inserting abandoned cart:", insertError);
      return NextResponse.json({ error: "Failed to track cart abandonment" }, { status: 500 });
    }

    return NextResponse.json({
      tracked: true,
      cartId: cart.id,
      recoveryToken: recoveryToken, // Return for client-side storage (optional)
    });
  } catch (error: unknown) {
    logger.error("Cart tracking error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

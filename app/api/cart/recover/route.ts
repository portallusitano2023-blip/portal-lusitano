import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/cart/recover?token=xyz
 *
 * Recovers an abandoned cart when user clicks email link.
 * Returns cart items to restore in client-side cart.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Missing recovery token" }, { status: 400 });
    }

    // Find cart by token
    const { data: cart, error } = await supabase
      .from("abandoned_carts")
      .select("*")
      .eq("recovery_token", token)
      .eq("recovered", false)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (error || !cart) {
      return NextResponse.json(
        {
          error: "Cart not found or expired",
          recovered: false,
        },
        { status: 404 }
      );
    }

    // Track that email was clicked
    await supabase.from("abandoned_carts").update({ email_clicked: true }).eq("id", cart.id);

    return NextResponse.json({
      recovered: true,
      cart: {
        items: cart.cart_items,
        total: cart.cart_total,
        quantity: cart.cart_quantity,
      },
      discount: cart.emails_sent >= 2 ? Math.round(cart.cart_total * 0.1) : 0, // 10% discount on final offer
    });
  } catch (error: unknown) {
    console.error("Cart recovery error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart/recover
 *
 * Marks cart as successfully recovered after checkout completion.
 *
 * Body:
 * {
 *   token: string
 *   orderId: string (optional - Stripe order ID or similar)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, orderId } = body;

    if (!token) {
      return NextResponse.json({ error: "Missing recovery token" }, { status: 400 });
    }

    // Mark as recovered using database function
    const { data, error } = await supabase.rpc("mark_cart_recovered", {
      p_recovery_token: token,
      p_order_id: orderId || null,
    });

    if (error) {
      console.error("Error marking cart as recovered:", error);
      return NextResponse.json({ error: "Failed to mark cart as recovered" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Cart not found or already recovered" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Cart marked as recovered",
    });
  } catch (error: unknown) {
    console.error("Cart recovery POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

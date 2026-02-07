import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function GET() {
  try {
    const email = await verifySession();

    if (!email) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      email,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}

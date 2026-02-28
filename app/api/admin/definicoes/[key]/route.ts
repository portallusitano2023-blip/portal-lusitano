import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// GET - Buscar uma definição específica
export async function GET(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { key } = await params;

    const { data: setting, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", key)
      .single();

    if (error || !setting) {
      return NextResponse.json({ error: "Definição não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ setting });
  } catch (error) {
    logger.error("Setting get error:", error);
    return NextResponse.json({ error: "Erro ao buscar definição" }, { status: 500 });
  }
}

// PATCH - Atualizar uma definição
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const adminEmail = await verifySession();
    if (!adminEmail) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { key } = await params;
    const body = await req.json();

    // Campos permitidos para atualização
    const allowedFields = [
      "value",
      "label",
      "description",
      "input_type",
      "options",
      "is_required",
      "validation_regex",
    ];

    const updateData: Record<string, unknown> = {
      updated_by: adminEmail,
    };

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const { data: setting, error } = await supabase
      .from("site_settings")
      .update(updateData)
      .eq("key", key)
      .select()
      .single();

    if (error) {
      logger.error("Setting update error:", error);
      throw error;
    }

    return NextResponse.json({ setting });
  } catch (error) {
    logger.error("Setting update error:", error);
    return NextResponse.json({ error: "Erro ao atualizar definição" }, { status: 500 });
  }
}

// DELETE - Eliminar uma definição (apenas custom, não as padrão)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { key } = await params;

    // Lista de keys protegidas que não podem ser eliminadas
    const protectedKeys = [
      "email_template_welcome",
      "email_template_anuncio_aprovado",
      "email_template_payment_received",
      "notifications_admin_email",
      "site_name",
      "site_url",
    ];

    if (protectedKeys.includes(key)) {
      return NextResponse.json(
        { error: "Esta definição está protegida e não pode ser eliminada" },
        { status: 403 }
      );
    }

    const { error } = await supabase.from("site_settings").delete().eq("key", key);

    if (error) {
      logger.error("Setting delete error:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Setting delete error:", error);
    return NextResponse.json({ error: "Erro ao eliminar definição" }, { status: 500 });
  }
}

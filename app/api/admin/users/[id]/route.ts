import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// GET - Ver um utilizador
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const { data: user, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!user) {
      return NextResponse.json({ error: "Utilizador não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    logger.error("User fetch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao buscar utilizador" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar utilizador
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminEmail = await verifySession();
    if (!adminEmail) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const updates = await req.json();

    // Buscar utilizador atual para comparar
    const { data: currentUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", id)
      .single();

    if (!currentUser) {
      return NextResponse.json({ error: "Utilizador não encontrado" }, { status: 404 });
    }

    // Não permitir desativar o próprio utilizador
    if (currentUser.email === adminEmail && updates.ativo === false) {
      return NextResponse.json({ error: "Não pode desativar a própria conta" }, { status: 400 });
    }

    // Não permitir remover role de super_admin se for o próprio
    if (
      currentUser.email === adminEmail &&
      currentUser.role === "super_admin" &&
      updates.role !== "super_admin"
    ) {
      return NextResponse.json(
        { error: "Não pode remover o próprio role de super_admin" },
        { status: 400 }
      );
    }

    // Atualizar
    const { data: user, error } = await supabase
      .from("admin_users")
      .update({
        nome: updates.nome,
        role: updates.role,
        ativo: updates.ativo,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Log da ação
    await supabase.from("admin_activity_log").insert({
      admin_email: adminEmail,
      action_type: "update",
      entity_type: "admin_user",
      entity_id: id,
      changes: updates,
    });

    return NextResponse.json({ user, message: "Utilizador atualizado" });
  } catch (error) {
    logger.error("User update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao atualizar utilizador" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar utilizador
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminEmail = await verifySession();
    if (!adminEmail) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Buscar utilizador
    const { data: user } = await supabase.from("admin_users").select("*").eq("id", id).single();

    if (!user) {
      return NextResponse.json({ error: "Utilizador não encontrado" }, { status: 404 });
    }

    // Não permitir eliminar o próprio utilizador
    if (user.email === adminEmail) {
      return NextResponse.json({ error: "Não pode eliminar a própria conta" }, { status: 400 });
    }

    // Eliminar
    const { error } = await supabase.from("admin_users").delete().eq("id", id);

    if (error) throw error;

    // Log da ação
    await supabase.from("admin_activity_log").insert({
      admin_email: adminEmail,
      action_type: "delete",
      entity_type: "admin_user",
      entity_id: id,
      changes: { email: user.email, nome: user.nome },
    });

    return NextResponse.json({ message: "Utilizador eliminado" });
  } catch (error) {
    logger.error("User deletion error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao eliminar utilizador" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// GET - Listar utilizadores admin
export async function GET(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const ativo = searchParams.get("ativo");

    let query = supabase
      .from("admin_users")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    if (ativo === "true") {
      query = query.eq("ativo", true);
    } else if (ativo === "false") {
      query = query.eq("ativo", false);
    }

    const { data: users, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({ users: users || [], total: count || 0 });
  } catch (error) {
    logger.error("Users list error:", error);
    return NextResponse.json({ error: "Erro ao listar utilizadores" }, { status: 500 });
  }
}

// POST - Criar novo utilizador admin
export async function POST(req: NextRequest) {
  try {
    const adminEmail = await verifySession();
    if (!adminEmail) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { email, nome, role } = await req.json();

    // Validações
    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    // Verificar se email já existe
    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Email já existe" }, { status: 400 });
    }

    // Criar utilizador
    const { data: user, error } = await supabase
      .from("admin_users")
      .insert({
        email,
        nome: nome || null,
        role: role || "admin",
        ativo: true,
      })
      .select()
      .single();

    if (error) throw error;

    // Log da ação
    await supabase.from("admin_activity_log").insert({
      admin_email: adminEmail,
      action_type: "create",
      entity_type: "admin_user",
      entity_id: user.id,
      changes: { email, nome, role },
    });

    return NextResponse.json({ user, message: "Utilizador criado com sucesso" });
  } catch (error) {
    logger.error("User creation error:", error);
    return NextResponse.json({ error: "Erro ao criar utilizador" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// GET - Listar todas as definições (com filtro opcional por categoria)
export async function GET(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // 'all' ou categoria específica

    let query = supabase
      .from("site_settings")
      .select("*")
      .order("category", { ascending: true })
      .order("label", { ascending: true });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data: settings, error } = await query;

    if (error) {
      logger.error("Error fetching settings:", error);
      throw error;
    }

    // Agrupar por categoria para facilitar na UI
    const grouped: Record<string, typeof settings> = {};
    settings?.forEach((setting) => {
      if (!grouped[setting.category]) {
        grouped[setting.category] = [];
      }
      grouped[setting.category].push(setting);
    });

    return NextResponse.json({
      settings: settings || [],
      grouped,
      categories: Object.keys(grouped),
    });
  } catch (error) {
    logger.error("Settings list error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao listar definições" },
      { status: 500 }
    );
  }
}

// POST - Criar nova definição (admin avançado)
export async function POST(req: NextRequest) {
  try {
    const adminEmail = await verifySession();
    if (!adminEmail) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      key,
      value,
      category,
      label,
      description,
      input_type,
      options,
      is_required,
      validation_regex,
    } = body;

    // Validações básicas
    if (!key || !value || !category || !label || !input_type) {
      return NextResponse.json({ error: "Campos obrigatórios em falta" }, { status: 400 });
    }

    const { data: setting, error } = await supabase
      .from("site_settings")
      .insert({
        key,
        value,
        category,
        label,
        description,
        input_type,
        options,
        is_required,
        validation_regex,
        updated_by: adminEmail,
      })
      .select()
      .single();

    if (error) {
      logger.error("Error creating setting:", error);
      throw error;
    }

    return NextResponse.json({ setting });
  } catch (error) {
    logger.error("Setting creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao criar definição" },
      { status: 500 }
    );
  }
}

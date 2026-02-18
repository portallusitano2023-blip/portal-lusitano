import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
    const adminEmail = await verifySession();
    if (!adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, ids, data } = await req.json();

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Ação e IDs são obrigatórios" }, { status: 400 });
    }

    let updateData: Record<string, unknown> = {};

    switch (action) {
      case "mark_read":
        updateData = {
          status: "lido",
          read_at: new Date().toISOString(),
        };
        break;

      case "mark_responded":
        updateData = {
          status: "respondido",
          responded_at: new Date().toISOString(),
          responded_by: adminEmail,
        };
        break;

      case "archive":
        updateData = {
          status: "arquivado",
          archived_at: new Date().toISOString(),
        };
        break;

      case "set_priority":
        if (!data?.priority) {
          return NextResponse.json({ error: "Prioridade é obrigatória" }, { status: 400 });
        }
        updateData = {
          priority: data.priority,
        };
        break;

      case "add_tag":
        if (!data?.tag) {
          return NextResponse.json({ error: "Tag é obrigatória" }, { status: 400 });
        }
        // Para tags, precisamos fazer update individual para adicionar ao array
        for (const id of ids) {
          const { data: current } = await supabase
            .from("contact_submissions")
            .select("tags")
            .eq("id", id)
            .single();

          if (current) {
            const currentTags = current.tags || [];
            if (!currentTags.includes(data.tag)) {
              await supabase
                .from("contact_submissions")
                .update({
                  tags: [...currentTags, data.tag],
                })
                .eq("id", id);
            }
          }
        }

        return NextResponse.json({
          success: true,
          updated: ids.length,
        });

      case "remove_tag":
        if (!data?.tag) {
          return NextResponse.json({ error: "Tag é obrigatória" }, { status: 400 });
        }
        // Para remover tags, update individual
        for (const id of ids) {
          const { data: current } = await supabase
            .from("contact_submissions")
            .select("tags")
            .eq("id", id)
            .single();

          if (current) {
            const currentTags = current.tags || [];
            await supabase
              .from("contact_submissions")
              .update({
                tags: currentTags.filter((t: string) => t !== data.tag),
              })
              .eq("id", id);
          }
        }

        return NextResponse.json({
          success: true,
          updated: ids.length,
        });

      case "assign":
        updateData = {
          assigned_to: data?.assignee || adminEmail,
        };
        break;

      case "unassign":
        updateData = {
          assigned_to: null,
        };
        break;

      default:
        return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }

    // Executar update em massa para ações que não precisam de lógica individual
    if (Object.keys(updateData).length > 0) {
      const { error } = await supabase.from("contact_submissions").update(updateData).in("id", ids);

      if (error) {
        logger.error("Bulk update error:", error);
        throw new Error(error.message);
      }
    }

    return NextResponse.json({
      success: true,
      updated: ids.length,
    });
  } catch (error) {
    logger.error("Bulk operation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro ao executar ação em massa" },
      { status: 500 }
    );
  }
}

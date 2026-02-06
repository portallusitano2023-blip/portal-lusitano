import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticação
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Mensagem não encontrada" },
        { status: 404 }
      );
    }

    // Marcar como lida se ainda estiver como 'novo'
    if (data.status === "novo") {
      await supabase
        .from("contact_submissions")
        .update({
          status: "lido",
          read_at: new Date().toISOString(),
        })
        .eq("id", id);

      data.status = "lido";
      data.read_at = new Date().toISOString();
    }

    return NextResponse.json({ message: data });
  } catch (error: any) {
    console.error("Message get error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao buscar mensagem" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticação
    const adminEmail = await verifySession();
    if (!adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const updates = await req.json();

    // Campos permitidos para atualização
    const allowedFields = [
      "status",
      "priority",
      "admin_notes",
      "admin_response",
      "tags",
      "assigned_to",
    ];

    const updateData: any = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    }

    // Se marcando como respondido, adicionar timestamp
    if (updates.status === "respondido" && !updates.responded_at) {
      updateData.responded_at = new Date().toISOString();
      updateData.responded_by = adminEmail;
    }

    // Se arquivando, adicionar timestamp
    if (updates.status === "arquivado" && !updates.archived_at) {
      updateData.archived_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("contact_submissions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Message update error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ message: data });
  } catch (error: any) {
    console.error("Message update error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar mensagem" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticação
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Soft delete - apenas arquivar
    const { error } = await supabase
      .from("contact_submissions")
      .update({
        status: "arquivado",
        archived_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Message delete error:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Message delete error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao eliminar mensagem" },
      { status: 500 }
    );
  }
}

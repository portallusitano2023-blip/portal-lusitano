import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";

// GET - Obter uma tarefa específica
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const { data: task, error } = await supabase
      .from("admin_tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!task) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error: any) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Erro ao carregar tarefa", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar tarefa
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const {
      title,
      description,
      task_type,
      due_date,
      status,
      priority,
      related_email,
      notes,
    } = body;

    // Construir objeto de atualização
    const updates: any = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (task_type !== undefined) updates.task_type = task_type;
    if (due_date !== undefined) updates.due_date = new Date(due_date).toISOString();
    if (priority !== undefined) updates.priority = priority;
    if (related_email !== undefined) updates.related_email = related_email;
    if (notes !== undefined) updates.notes = notes;

    // Se mudar para "concluida", adicionar completed_at
    if (status !== undefined) {
      updates.status = status;
      if (status === "concluida" && !body.completed_at) {
        updates.completed_at = new Date().toISOString();
      } else if (status !== "concluida") {
        updates.completed_at = null;
      }
    }

    // Atualizar
    const { data: task, error } = await supabase
      .from("admin_tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task });
  } catch (error: any) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar tarefa", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar tarefa
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from("admin_tasks")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Tarefa eliminada com sucesso" });
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Erro ao eliminar tarefa", details: error.message },
      { status: 500 }
    );
  }
}

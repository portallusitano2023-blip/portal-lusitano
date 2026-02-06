import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";

// GET - Listar tarefas com filtros
export async function GET(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
    const taskType = searchParams.get("task_type") || "all";
    const month = searchParams.get("month"); // YYYY-MM format
    const search = searchParams.get("search") || "";

    // Começar query
    let query = supabase
      .from("admin_tasks")
      .select("*", { count: "exact" })
      .order("due_date", { ascending: true });

    // Filtros
    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (priority !== "all") {
      query = query.eq("priority", priority);
    }

    if (taskType !== "all") {
      query = query.eq("task_type", taskType);
    }

    // Filtrar por mês específico
    if (month) {
      const [year, monthNum] = month.split("-");
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59);

      query = query
        .gte("due_date", startDate.toISOString())
        .lte("due_date", endDate.toISOString());
    }

    // Pesquisa
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,related_email.ilike.%${search}%`);
    }

    const { data: tasks, error, count } = await query;

    if (error) throw error;

    // Calcular estatísticas
    const now = new Date();
    const stats = {
      total: count || 0,
      pendente: tasks?.filter((t) => t.status === "pendente").length || 0,
      em_andamento: tasks?.filter((t) => t.status === "em_andamento").length || 0,
      concluida: tasks?.filter((t) => t.status === "concluida").length || 0,
      vencidas: tasks?.filter((t) => t.status !== "concluida" && new Date(t.due_date) < now).length || 0,
      hoje: tasks?.filter((t) => {
        const taskDate = new Date(t.due_date);
        return (
          taskDate.toDateString() === now.toDateString() &&
          t.status !== "concluida"
        );
      }).length || 0,
    };

    return NextResponse.json({
      tasks: tasks || [],
      stats,
    });
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Erro ao carregar tarefas", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Criar nova tarefa
export async function POST(req: NextRequest) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      task_type = "follow_up",
      due_date,
      priority = "normal",
      related_email,
      notes,
    } = body;

    // Validações
    if (!title || !due_date) {
      return NextResponse.json(
        { error: "Título e data são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar tarefa
    const { data: task, error } = await supabase
      .from("admin_tasks")
      .insert({
        title,
        description,
        task_type,
        due_date: new Date(due_date).toISOString(),
        priority,
        status: "pendente",
        related_email,
        notes,
        admin_email: email,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Erro ao criar tarefa", details: error.message },
      { status: 500 }
    );
  }
}

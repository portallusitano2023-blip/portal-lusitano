import { NextRequest, NextResponse } from "next/server";
import { EmailWorkflows } from "@/lib/resend";

// TODO: Adicionar autenticação de ADMIN
// Apenas administradores podem responder a tickets

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticket_id, response, admin_email } = body;

    // Validação básica
    if (!ticket_id || !response) {
      return NextResponse.json(
        { error: "Ticket ID e resposta são obrigatórios" },
        { status: 400 }
      );
    }

    // TODO: Verificar se o utilizador é admin
    // if (!isAdmin) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

    // TODO: Buscar ticket no Supabase
    // const ticket = await supabase.from('consultations').select('*').eq('id', ticket_id).single();

    // Simular dados do ticket
    const ticket = {
      id: ticket_id,
      user_email: "user@example.com",
      user_name: "João Silva",
      subject: "Análise de linhagem",
    };

    // TODO: Atualizar ticket no Supabase
    // await supabase.from('consultations').update({
    //   admin_response: response,
    //   admin_response_at: new Date().toISOString(),
    //   status: 'answered',
    //   updated_at: new Date().toISOString(),
    // }).eq('id', ticket_id);

    console.log(`Ticket ${ticket_id} respondido`);

    // Enviar email ao utilizador com a resposta
    try {
      await EmailWorkflows.sendConsultationAnswered(
        ticket.user_email,
        ticket.user_name,
        ticket_id
      );
    } catch (emailError) {
      console.error("Erro ao enviar email de resposta:", emailError);
      // Não falhar a resposta por causa do email
    }

    return NextResponse.json({
      success: true,
      message: "Resposta enviada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao responder ticket:", error);
    return NextResponse.json(
      { error: "Erro ao enviar resposta" },
      { status: 500 }
    );
  }
}

// GET - Listar todos os tickets (apenas para admins)
export async function GET(request: NextRequest) {
  try {
    // TODO: Verificar se é admin
    // TODO: Buscar todos os tickets no Supabase com filtros opcionais

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    // Mock data
    const allTickets = [
      {
        id: "CONS-1234567890-ABC",
        user_email: "user1@example.com",
        user_name: "João Silva",
        user_plan: "Criador",
        type: "linhagens",
        subject: "Análise de linhagem Andrade",
        message: "Gostaria de saber mais sobre a linhagem Andrade...",
        status: "pending",
        priority: "medium",
        created_at: new Date().toISOString(),
      },
      {
        id: "CONS-9876543210-XYZ",
        user_email: "user2@example.com",
        user_name: "Maria Santos",
        user_plan: "Elite",
        type: "morfologia",
        subject: "Avaliação morfológica",
        message: "Anexo fotos do meu cavalo para avaliação...",
        status: "in_progress",
        priority: "high",
        created_at: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ tickets: allTickets });
  } catch (error) {
    console.error("Erro ao listar tickets para admin:", error);
    return NextResponse.json(
      { error: "Erro ao carregar tickets" },
      { status: 500 }
    );
  }
}

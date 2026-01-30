import { NextRequest, NextResponse } from "next/server";
import { EmailWorkflows } from "@/lib/resend";
import { ConsultationTicket, ConsultationType } from "@/types/consultation";

// TODO: Adicionar autenticação com Supabase
// TODO: Validar que o utilizador tem um plano que permite consultorias

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, subject, message, user_email, user_name, user_plan } = body;

    // Validação básica
    if (!type || !subject || !message || !user_email || !user_name) {
      return NextResponse.json(
        { error: "Campos obrigatórios em falta" },
        { status: 400 }
      );
    }

    // Validar que o plano permite consultorias
    const consultationsAllowed = ["Criador", "Elite"];
    if (!consultationsAllowed.includes(user_plan)) {
      return NextResponse.json(
        {
          error: "O seu plano não inclui consultorias. Faça upgrade para Criador ou Elite.",
        },
        { status: 403 }
      );
    }

    // Gerar ID único para o ticket
    const ticketId = `CONS-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Criar ticket
    const ticket: ConsultationTicket = {
      id: ticketId,
      user_id: "temp", // TODO: Obter do Supabase Auth
      user_email,
      user_name,
      user_plan,
      type: type as ConsultationType,
      subject,
      message,
      status: "pending",
      priority: user_plan === "Elite" ? "high" : "medium",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // TODO: Guardar ticket no Supabase
    console.log("Ticket criado:", ticket);

    // Enviar email de confirmação ao utilizador
    try {
      await EmailWorkflows.sendConsultationReceived(
        user_email,
        user_name,
        ticketId
      );
    } catch (emailError) {
      console.error("Erro ao enviar email de confirmação:", emailError);
      // Não falhar a criação do ticket por causa do email
    }

    // TODO: Notificar admin por email
    // await EmailWorkflows.notifyAdminNewTicket(ticket);

    return NextResponse.json({
      success: true,
      ticket_id: ticketId,
      message: "Consultoria submetida com sucesso. Receberá resposta em 24-48h.",
    });
  } catch (error) {
    console.error("Erro ao criar ticket de consultoria:", error);
    return NextResponse.json(
      { error: "Erro ao submeter consultoria" },
      { status: 500 }
    );
  }
}

// GET - Listar tickets do utilizador
export async function GET(request: NextRequest) {
  try {
    // TODO: Obter user_id da sessão autenticada
    // TODO: Buscar tickets do utilizador no Supabase

    const mockTickets: ConsultationTicket[] = [
      {
        id: "CONS-1234567890-ABC",
        user_id: "user123",
        user_email: "user@example.com",
        user_name: "João Silva",
        user_plan: "Criador",
        type: "linhagens",
        subject: "Análise de linhagem Andrade",
        message: "Gostaria de saber mais sobre...",
        status: "answered",
        priority: "medium",
        admin_response: "A linhagem Andrade é conhecida por...",
        admin_response_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ tickets: mockTickets });
  } catch (error) {
    console.error("Erro ao listar tickets:", error);
    return NextResponse.json(
      { error: "Erro ao carregar consultorias" },
      { status: 500 }
    );
  }
}

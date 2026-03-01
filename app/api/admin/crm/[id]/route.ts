import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { verifySession } from "@/lib/auth";
import { logger } from "@/lib/logger";

// GET - Obter um lead específico
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const { data: lead, error } = await supabase
      .from("crm_leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!lead) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    logger.error("Error fetching lead:", error);
    return NextResponse.json(
      {
        error: "Erro ao carregar lead",
      },
      { status: 500 }
    );
  }
}

// PATCH - Atualizar lead (incluindo mover para outro stage)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const {
      name,
      email: leadEmail,
      telefone,
      company,
      stage,
      estimated_value,
      probability,
      source_type,
      interests,
      notes,
      budget_min,
      budget_max,
      next_follow_up,
      outcome_reason,
      actual_value,
    } = body;

    // Construir objeto de atualização
    const updates: Record<string, unknown> = {};

    if (name !== undefined) updates.name = name;
    if (leadEmail !== undefined) updates.email = leadEmail;
    if (telefone !== undefined) updates.telefone = telefone;
    if (company !== undefined) updates.company = company;
    if (stage !== undefined) updates.stage = stage;
    if (estimated_value !== undefined) updates.estimated_value = estimated_value;
    if (probability !== undefined) updates.probability = probability;
    if (source_type !== undefined) updates.source_type = source_type;
    if (interests !== undefined) updates.interests = interests;
    if (notes !== undefined) updates.notes = notes;
    if (budget_min !== undefined) updates.budget_min = budget_min;
    if (budget_max !== undefined) updates.budget_max = budget_max;
    if (next_follow_up !== undefined) {
      updates.next_follow_up = next_follow_up ? new Date(next_follow_up).toISOString() : null;
    }
    if (outcome_reason !== undefined) updates.outcome_reason = outcome_reason;
    if (actual_value !== undefined) updates.actual_value = actual_value;

    // Incrementar contact_count se adicionou nota ou mudou stage
    if (notes !== undefined || stage !== undefined) {
      // Buscar lead atual para incrementar contact_count
      const { data: currentLead } = await supabase
        .from("crm_leads")
        .select("contact_count")
        .eq("id", id)
        .single();

      if (currentLead) {
        updates.contact_count = (currentLead.contact_count || 0) + 1;
        updates.last_contact = new Date().toISOString();
      }
    }

    // Atualizar
    const { data: lead, error } = await supabase
      .from("crm_leads")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ lead });
  } catch (error) {
    logger.error("Error updating lead:", error);
    return NextResponse.json(
      {
        error: "Erro ao atualizar lead",
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar lead
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const email = await verifySession();
    if (!email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase.from("crm_leads").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Lead eliminado com sucesso" });
  } catch (error) {
    logger.error("Error deleting lead:", error);
    return NextResponse.json(
      {
        error: "Erro ao eliminar lead",
      },
      { status: 500 }
    );
  }
}

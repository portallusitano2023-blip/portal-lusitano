"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Plus, ArrowLeft } from "lucide-react";
import { EventStats, EventsList, EventForm } from "@/components/admin-app/eventos";

interface Evento {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  tipo: string;
  data_inicio: string;
  data_fim?: string;
  localizacao: string;
  regiao?: string;
  preco_entrada?: string;
  imagem_capa?: string;
  destaque: boolean;
  status: string;
  views_count: number;
}

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    slug: "",
    descricao: "",
    descricao_completa: "",
    tipo: "feira",
    data_inicio: "",
    data_fim: "",
    localizacao: "",
    regiao: "",
    organizador: "",
    website: "",
    preco_entrada: "",
    imagem_capa: "",
    destaque: false,
  });

  useEffect(() => {
    fetchEventos();
  }, []);

  async function fetchEventos() {
    try {
      const res = await fetch("/api/admin/eventos");
      if (res.ok) {
        const data = await res.json();
        setEventos(data.eventos || []);
      }
    } catch (error) {
      void error;
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingEvento ? `/api/admin/eventos/${editingEvento.id}` : "/api/admin/eventos";
      const method = editingEvento ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchEventos();
        resetForm();
      }
    } catch (error) {
      void error;
    }
  }

  async function deleteEvento(id: string) {
    if (!confirm("Tem a certeza que deseja eliminar este evento?")) return;

    try {
      const res = await fetch(`/api/admin/eventos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchEventos();
      }
    } catch (error) {
      void error;
    }
  }

  function startEdit(evento: Evento) {
    setEditingEvento(evento);
    setFormData({
      titulo: evento.titulo,
      slug: evento.slug,
      descricao: evento.descricao,
      descricao_completa: "",
      tipo: evento.tipo,
      data_inicio: evento.data_inicio,
      data_fim: evento.data_fim || "",
      localizacao: evento.localizacao,
      regiao: evento.regiao || "",
      organizador: "",
      website: "",
      preco_entrada: evento.preco_entrada || "",
      imagem_capa: evento.imagem_capa || "",
      destaque: evento.destaque,
    });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingEvento(null);
    setFormData({
      titulo: "",
      slug: "",
      descricao: "",
      descricao_completa: "",
      tipo: "feira",
      data_inicio: "",
      data_fim: "",
      localizacao: "",
      regiao: "",
      organizador: "",
      website: "",
      preco_entrada: "",
      imagem_capa: "",
      destaque: false,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="text-amber-600" />
                  Gestão de Eventos
                </h1>
                <p className="text-gray-600 text-sm">Criar, editar e gerir eventos equestres</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Novo Evento
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <EventStats eventos={eventos} />
        <EventsList
          eventos={eventos}
          loading={loading}
          onEdit={startEdit}
          onDelete={deleteEvento}
        />
      </div>

      <EventForm
        show={showForm}
        editingEvento={editingEvento}
        formData={formData}
        onClose={resetForm}
        onSubmit={handleSubmit}
        onChange={(data) => setFormData({ ...formData, ...data })}
        onTitleChange={(titulo, slug) => setFormData({ ...formData, titulo, slug })}
      />
    </div>
  );
}

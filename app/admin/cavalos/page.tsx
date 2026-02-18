"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { CavaloAdmin } from "@/types/cavalo";
import { HorseStats, HorseFilters, HorseTable, HorseForm } from "@/components/admin-app/cavalos";

export default function AdminCavalosPage() {
  const [cavalos, setCavalos] = useState<CavaloAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCavalo, setEditingCavalo] = useState<CavaloAdmin | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    slug: "",
    descricao: "",
    sexo: "macho",
    idade: "",
    cor: "",
    altura: "",
    linhagem: "",
    pai: "",
    mae: "",
    nivel_treino: "desbastado",
    disciplinas: [] as string[],
    preco: "",
    preco_negociavel: false,
    preco_sob_consulta: false,
    vendedor_nome: "",
    vendedor_telefone: "",
    vendedor_email: "",
    localizacao: "",
    regiao: "",
    destaque: false,
  });

  useEffect(() => {
    fetchCavalos();
  }, []);

  async function fetchCavalos() {
    try {
      const res = await fetch("/api/admin/cavalos");
      if (res.ok) {
        const data = await res.json();
        setCavalos(data.cavalos || []);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("[AdminCavalos]", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingCavalo ? `/api/admin/cavalos/${editingCavalo.id}` : "/api/admin/cavalos";
      const method = editingCavalo ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          idade: formData.idade ? parseInt(formData.idade) : null,
          altura: formData.altura ? parseFloat(formData.altura) : null,
          preco: formData.preco ? parseFloat(formData.preco) : null,
        }),
      });

      if (res.ok) {
        fetchCavalos();
        resetForm();
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("[AdminCavalos]", error);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/cavalos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchCavalos();
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("[AdminCavalos]", error);
    }
  }

  async function deleteCavalo(id: string) {
    if (!confirm("Tem a certeza que deseja eliminar este anúncio?")) return;

    try {
      const res = await fetch(`/api/admin/cavalos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCavalos();
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("[AdminCavalos]", error);
    }
  }

  function startEdit(cavalo: CavaloAdmin) {
    setEditingCavalo(cavalo);
    setFormData({
      nome: cavalo.nome,
      slug: cavalo.slug,
      descricao: cavalo.descricao,
      sexo: cavalo.sexo,
      idade: cavalo.idade?.toString() || "",
      cor: cavalo.cor || "",
      altura: cavalo.altura?.toString() || "",
      linhagem: cavalo.linhagem || "",
      pai: "",
      mae: "",
      nivel_treino: cavalo.nivel_treino || "desbastado",
      disciplinas: [],
      preco: cavalo.preco?.toString() || "",
      preco_negociavel: false,
      preco_sob_consulta: cavalo.preco_sob_consulta || false,
      vendedor_nome: "",
      vendedor_telefone: "",
      vendedor_email: "",
      localizacao: cavalo.localizacao || "",
      regiao: cavalo.regiao || "",
      destaque: cavalo.destaque,
    });
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingCavalo(null);
    setFormData({
      nome: "",
      slug: "",
      descricao: "",
      sexo: "macho",
      idade: "",
      cor: "",
      altura: "",
      linhagem: "",
      pai: "",
      mae: "",
      nivel_treino: "desbastado",
      disciplinas: [],
      preco: "",
      preco_negociavel: false,
      preco_sob_consulta: false,
      vendedor_nome: "",
      vendedor_telefone: "",
      vendedor_email: "",
      localizacao: "",
      regiao: "",
      destaque: false,
    });
  }

  const filteredCavalos = cavalos.filter(
    (c) =>
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.linhagem?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-2xl font-bold text-gray-900">
                  🐴 Marketplace - Cavalos à Venda
                </h1>
                <p className="text-gray-600 text-sm">Gerir anúncios de cavalos no marketplace</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Novo Anúncio
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <HorseStats cavalos={cavalos} />
        <HorseFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <HorseTable
          cavalos={filteredCavalos}
          loading={loading}
          onEdit={startEdit}
          onDelete={deleteCavalo}
          onUpdateStatus={updateStatus}
        />
      </div>

      <HorseForm
        show={showForm}
        editingCavalo={editingCavalo}
        formData={formData}
        onClose={resetForm}
        onSubmit={handleSubmit}
        onChange={(data) => setFormData({ ...formData, ...data })}
        onNameChange={(nome, slug) => setFormData({ ...formData, nome, slug })}
      />
    </div>
  );
}

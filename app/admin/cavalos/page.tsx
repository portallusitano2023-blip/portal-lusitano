"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Star,
  MapPin,
  X,
  Euro,
  Search,
} from "lucide-react";

interface Cavalo {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  sexo: string;
  idade: number;
  cor: string;
  altura: number;
  linhagem?: string;
  nivel_treino: string;
  preco: number;
  preco_sob_consulta: boolean;
  localizacao: string;
  regiao: string;
  destaque: boolean;
  status: string;
  views_count: number;
}

const sexoOptions = [
  { value: "macho", label: "Garanhão" },
  { value: "femea", label: "Égua" },
  { value: "castrado", label: "Castrado" },
];

const nivelOptions = [
  { value: "desbastado", label: "Desbastado" },
  { value: "iniciado", label: "Iniciado" },
  { value: "avancado", label: "Avançado" },
  { value: "competicao", label: "Competição" },
];

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  vendido: "bg-gray-100 text-gray-800",
  reservado: "bg-amber-100 text-amber-800",
  inativo: "bg-red-100 text-red-800",
};

export default function AdminCavalosPage() {
  const [cavalos, setCavalos] = useState<Cavalo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCavalo, setEditingCavalo] = useState<Cavalo | null>(null);
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
      console.error("Erro ao carregar cavalos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editingCavalo
        ? `/api/admin/cavalos/${editingCavalo.id}`
        : "/api/admin/cavalos";
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
      console.error("Erro ao guardar cavalo:", error);
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
      console.error("Erro ao atualizar status:", error);
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
      console.error("Erro ao eliminar cavalo:", error);
    }
  }

  function startEdit(cavalo: Cavalo) {
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

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  function formatPrice(cavalo: Cavalo) {
    if (cavalo.preco_sob_consulta) return "Sob consulta";
    if (!cavalo.preco) return "A definir";
    return `€${cavalo.preco.toLocaleString("pt-PT")}`;
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
                <p className="text-gray-600 text-sm">
                  Gerir anúncios de cavalos no marketplace
                </p>
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
        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-3xl font-bold text-gray-900">{cavalos.length}</p>
            <p className="text-gray-600">Total</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-3xl font-bold text-green-600">
              {cavalos.filter((c) => c.status === "active").length}
            </p>
            <p className="text-gray-600">Ativos</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-3xl font-bold text-amber-600">
              {cavalos.filter((c) => c.destaque).length}
            </p>
            <p className="text-gray-600">Destaque</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-3xl font-bold text-gray-600">
              {cavalos.filter((c) => c.status === "vendido").length}
            </p>
            <p className="text-gray-600">Vendidos</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-3xl font-bold text-blue-600">
              {cavalos.reduce((acc, c) => acc + (c.views_count || 0), 0)}
            </p>
            <p className="text-gray-600">Views</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Pesquisar por nome ou linhagem..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Cavalos List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cavalo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detalhes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCavalos.map((cavalo) => (
                  <tr key={cavalo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {cavalo.destaque && (
                          <Star size={16} className="text-amber-500 fill-amber-500" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{cavalo.nome}</p>
                          {cavalo.linhagem && (
                            <p className="text-sm text-amber-600">
                              Linhagem {cavalo.linhagem}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 text-sm">
                        {sexoOptions.find((s) => s.value === cavalo.sexo)?.label} •{" "}
                        {cavalo.idade} anos • {cavalo.cor}
                      </p>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <MapPin size={12} />
                        {cavalo.localizacao}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 flex items-center gap-1">
                        {formatPrice(cavalo)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={cavalo.status}
                        onChange={(e) => updateStatus(cavalo.id, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium ${statusColors[cavalo.status] || "bg-gray-100"}`}
                      >
                        <option value="active">Ativo</option>
                        <option value="reservado">Reservado</option>
                        <option value="vendido">Vendido</option>
                        <option value="inativo">Inativo</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {cavalo.views_count || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/marketplace/${cavalo.slug}`}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                          target="_blank"
                        >
                          <Eye size={18} />
                        </Link>
                        <button
                          onClick={() => startEdit(cavalo)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteCavalo(cavalo.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={resetForm}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full p-8 my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingCavalo ? "Editar Anúncio" : "Novo Anúncio"}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Cavalo *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        nome: e.target.value,
                        slug: generateSlug(e.target.value),
                      });
                    }}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexo *
                  </label>
                  <select
                    value={formData.sexo}
                    onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    {sexoOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Idade (anos)
                  </label>
                  <input
                    type="number"
                    value={formData.idade}
                    onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cor
                  </label>
                  <input
                    type="text"
                    value={formData.cor}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    placeholder="Ex: Ruço, Castanho, Preto"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Altura (metros)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.altura}
                    onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
                    placeholder="Ex: 1.65"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Linhagem
                  </label>
                  <input
                    type="text"
                    value={formData.linhagem}
                    onChange={(e) => setFormData({ ...formData, linhagem: e.target.value })}
                    placeholder="Ex: Veiga, Andrade, Alter Real"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nível de Treino
                  </label>
                  <select
                    value={formData.nivel_treino}
                    onChange={(e) => setFormData({ ...formData, nivel_treino: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    {nivelOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (€)
                  </label>
                  <input
                    type="number"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    disabled={formData.preco_sob_consulta}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.preco_sob_consulta}
                      onChange={(e) =>
                        setFormData({ ...formData, preco_sob_consulta: e.target.checked })
                      }
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-gray-700">Preço sob consulta</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Região
                  </label>
                  <input
                    type="text"
                    value={formData.regiao}
                    onChange={(e) => setFormData({ ...formData, regiao: e.target.value })}
                    placeholder="Ex: Ribatejo, Alentejo"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição *
                  </label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    required
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.destaque}
                      onChange={(e) => setFormData({ ...formData, destaque: e.target.checked })}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-gray-700">Anúncio em destaque</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.preco_negociavel}
                      onChange={(e) =>
                        setFormData({ ...formData, preco_negociavel: e.target.checked })
                      }
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-gray-700">Preço negociável</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition"
                >
                  {editingCavalo ? "Guardar Alterações" : "Criar Anúncio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

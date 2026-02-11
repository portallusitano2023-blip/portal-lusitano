"use client";

import Link from "next/link";
import { Edit, Trash2, Eye, Star, MapPin } from "lucide-react";

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

const tiposEvento = [
  { value: "feira", label: "Feira", color: "bg-amber-100 text-amber-800" },
  { value: "competicao", label: "Competição", color: "bg-blue-100 text-blue-800" },
  { value: "leilao", label: "Leilão", color: "bg-green-100 text-green-800" },
  { value: "exposicao", label: "Exposição", color: "bg-purple-100 text-purple-800" },
  { value: "workshop", label: "Workshop", color: "bg-pink-100 text-pink-800" },
];

interface EventsListProps {
  eventos: Evento[];
  loading: boolean;
  onEdit: (evento: Evento) => void;
  onDelete: (id: string) => void;
}

export default function EventsList({ eventos, loading, onEdit, onDelete }: EventsListProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Evento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Local
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
          {eventos.map((evento) => (
            <tr key={evento.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {evento.destaque && <Star size={16} className="text-amber-500 fill-amber-500" />}
                  <span className="font-medium text-gray-900">{evento.titulo}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    tiposEvento.find((t) => t.value === evento.tipo)?.color ||
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {tiposEvento.find((t) => t.value === evento.tipo)?.label || evento.tipo}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600">
                {new Date(evento.data_inicio).toLocaleDateString("pt-PT")}
              </td>
              <td className="px-6 py-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {evento.localizacao}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600">{evento.views_count || 0}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/eventos/${evento.slug}`}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    target="_blank"
                  >
                    <Eye size={18} />
                  </Link>
                  <button
                    onClick={() => onEdit(evento)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(evento.id)}
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
  );
}

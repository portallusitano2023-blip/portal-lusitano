"use client";

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

interface EventStatsProps {
  eventos: Evento[];
}

export default function EventStats({ eventos }: EventStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-3xl font-bold text-gray-900">{eventos.length}</p>
        <p className="text-gray-600">Total de Eventos</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-3xl font-bold text-amber-600">
          {eventos.filter((e) => e.destaque).length}
        </p>
        <p className="text-gray-600">Em Destaque</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-3xl font-bold text-green-600">
          {eventos.filter((e) => new Date(e.data_inicio) > new Date()).length}
        </p>
        <p className="text-gray-600">Futuros</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-3xl font-bold text-blue-600">
          {eventos.reduce((acc, e) => acc + (e.views_count || 0), 0)}
        </p>
        <p className="text-gray-600">Total Views</p>
      </div>
    </div>
  );
}

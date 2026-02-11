"use client";

import { CavaloAdmin } from "@/types/cavalo";

interface HorseStatsProps {
  cavalos: CavaloAdmin[];
}

export default function HorseStats({ cavalos }: HorseStatsProps) {
  return (
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
  );
}

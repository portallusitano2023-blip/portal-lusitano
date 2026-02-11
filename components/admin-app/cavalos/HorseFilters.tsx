"use client";

import { Search } from "lucide-react";

interface HorseFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function HorseFilters({ searchTerm, onSearchChange }: HorseFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Pesquisar por nome ou linhagem..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
        />
      </div>
    </div>
  );
}

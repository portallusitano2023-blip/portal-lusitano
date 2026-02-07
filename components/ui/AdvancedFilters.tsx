"use client";

import { useState, useEffect } from "react";
import { Filter, X, Save, Calendar, Search } from "lucide-react";

export interface FilterConfig {
  id: string;
  label: string;
  type: "text" | "select" | "dateRange" | "number";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface ActiveFilter {
  id: string;
  value: any;
  operator?: "equals" | "contains" | "gt" | "lt" | "between";
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: ActiveFilter[];
}

interface AdvancedFiltersProps {
  configs: FilterConfig[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  storageKey?: string;
}

export default function AdvancedFilters({
  configs,
  onFiltersChange,
  storageKey = "advanced-filters",
}: AdvancedFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Load saved filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`${storageKey}-saved`);
    if (saved) {
      setSavedFilters(JSON.parse(saved));
    }
  }, [storageKey]);

  // Save filters to localStorage
  const saveFiltersToStorage = (filters: SavedFilter[]) => {
    localStorage.setItem(`${storageKey}-saved`, JSON.stringify(filters));
    setSavedFilters(filters);
  };

  const addFilter = (configId: string) => {
    const config = configs.find((c) => c.id === configId);
    if (!config) return;

    const newFilter: ActiveFilter = {
      id: configId,
      value: config.type === "dateRange" ? { start: "", end: "" } : "",
      operator: "equals",
    };

    const updated = [...activeFilters, newFilter];
    setActiveFilters(updated);
    onFiltersChange(updated);
    setShowFilterMenu(false);
  };

  const updateFilter = (index: number, updates: Partial<ActiveFilter>) => {
    const updated = activeFilters.map((f, i) =>
      i === index ? { ...f, ...updates } : f
    );
    setActiveFilters(updated);
    onFiltersChange(updated);
  };

  const removeFilter = (index: number) => {
    const updated = activeFilters.filter((_, i) => i !== index);
    setActiveFilters(updated);
    onFiltersChange(updated);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    onFiltersChange([]);
  };

  const saveCurrentFilters = () => {
    if (!filterName.trim()) return;

    const newSavedFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: activeFilters,
    };

    const updated = [...savedFilters, newSavedFilter];
    saveFiltersToStorage(updated);
    setFilterName("");
    setShowSaveModal(false);
  };

  const loadSavedFilter = (saved: SavedFilter) => {
    setActiveFilters(saved.filters);
    onFiltersChange(saved.filters);
  };

  const deleteSavedFilter = (id: string) => {
    const updated = savedFilters.filter((f) => f.id !== id);
    saveFiltersToStorage(updated);
  };

  const renderFilterInput = (filter: ActiveFilter, index: number) => {
    const config = configs.find((c) => c.id === filter.id);
    if (!config) return null;

    switch (config.type) {
      case "text":
        return (
          <div className="flex items-center gap-2 flex-1">
            <select
              value={filter.operator || "contains"}
              onChange={(e) =>
                updateFilter(index, {
                  operator: e.target.value as ActiveFilter["operator"],
                })
              }
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            >
              <option value="equals">Igual a</option>
              <option value="contains">Contém</option>
            </select>
            <input
              type="text"
              value={filter.value || ""}
              onChange={(e) => updateFilter(index, { value: e.target.value })}
              placeholder={config.placeholder}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500"
            />
          </div>
        );

      case "select":
        return (
          <select
            value={filter.value || ""}
            onChange={(e) => updateFilter(index, { value: e.target.value })}
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
          >
            <option value="">Selecionar...</option>
            {config.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case "dateRange":
        return (
          <div className="flex items-center gap-2 flex-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={filter.value?.start || ""}
              onChange={(e) =>
                updateFilter(index, {
                  value: { ...filter.value, start: e.target.value },
                })
              }
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
            <span className="text-gray-400">até</span>
            <input
              type="date"
              value={filter.value?.end || ""}
              onChange={(e) =>
                updateFilter(index, {
                  value: { ...filter.value, end: e.target.value },
                })
              }
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
        );

      case "number":
        return (
          <div className="flex items-center gap-2 flex-1">
            <select
              value={filter.operator || "equals"}
              onChange={(e) =>
                updateFilter(index, {
                  operator: e.target.value as ActiveFilter["operator"],
                })
              }
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
            >
              <option value="equals">=</option>
              <option value="gt">&gt;</option>
              <option value="lt">&lt;</option>
              <option value="between">Entre</option>
            </select>
            <input
              type="number"
              value={filter.value || ""}
              onChange={(e) => updateFilter(index, { value: e.target.value })}
              placeholder={config.placeholder}
              className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const availableConfigs = configs.filter(
    (c) => !activeFilters.some((f) => f.id === c.id)
  );

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#C5A059]" />
            Filtros Avançados
          </h3>
          <div className="flex items-center gap-2">
            {activeFilters.length > 0 && (
              <>
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-3 py-1.5 bg-[#C5A059]/20 text-[#C5A059] rounded-lg text-sm font-medium hover:bg-[#C5A059]/30 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all"
                >
                  Limpar Todos
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter List */}
        <div className="space-y-3">
          {activeFilters.map((filter, index) => {
            const config = configs.find((c) => c.id === filter.id);
            return (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/5 rounded-lg p-3"
              >
                <span className="text-sm font-medium text-gray-300 min-w-[120px]">
                  {config?.label}
                </span>
                {renderFilterInput(filter, index)}
                <button
                  onClick={() => removeFilter(index)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            );
          })}

          {activeFilters.length === 0 && (
            <p className="text-gray-400 text-center py-4">
              Nenhum filtro ativo. Adiciona um filtro abaixo.
            </p>
          )}
        </div>

        {/* Add Filter Button */}
        {availableConfigs.length > 0 && (
          <div className="relative mt-4">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="px-4 py-2 bg-[#C5A059] text-black rounded-lg font-semibold hover:bg-[#B39048] transition-all"
            >
              + Adicionar Filtro
            </button>

            {showFilterMenu && (
              <div className="absolute top-full mt-2 bg-[#1A1A1A] border border-white/10 rounded-lg shadow-xl z-10 min-w-[200px]">
                {availableConfigs.map((config) => (
                  <button
                    key={config.id}
                    onClick={() => addFilter(config.id)}
                    className="w-full text-left px-4 py-2 text-white hover:bg-white/5 transition-all first:rounded-t-lg last:rounded-b-lg"
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl p-4">
          <h4 className="text-sm font-bold text-white mb-3">
            Filtros Guardados
          </h4>
          <div className="flex flex-wrap gap-2">
            {savedFilters.map((saved) => (
              <div
                key={saved.id}
                className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2"
              >
                <button
                  onClick={() => loadSavedFilter(saved)}
                  className="text-sm text-[#C5A059] hover:underline"
                >
                  {saved.name}
                </button>
                <button
                  onClick={() => deleteSavedFilter(saved.id)}
                  className="p-1 hover:bg-red-500/20 rounded transition-all"
                >
                  <X className="w-3 h-3 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Filter Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              Guardar Filtros
            </h3>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Nome do filtro..."
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={saveCurrentFilters}
                disabled={!filterName.trim()}
                className="flex-1 px-4 py-2 bg-[#C5A059] text-black rounded-lg font-semibold hover:bg-[#B39048] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setFilterName("");
                }}
                className="flex-1 px-4 py-2 bg-white/5 text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Search,
  Eye,
  Calendar,
  CheckCircle,
  Circle,
  ChevronDown,
  ShoppingCart,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  priority: "essential" | "important" | "optional";
}

interface ChecklistPhase {
  title: string;
  icon: string; // "search" | "eye" | "calendar"
  items: ChecklistItem[];
}

interface ShoppingChecklistTabProps {
  phases: ChecklistPhase[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<string, typeof Search> = {
  search: Search,
  eye: Eye,
  calendar: Calendar,
};

// Priority colors (labels are translated inside the component)
const PRIORITY_COLORS: Record<ChecklistItem["priority"], string> = {
  essential: "#ef4444",
  important: "#f59e0b",
  optional: "#71717a",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ShoppingChecklistTab({ phases }: ShoppingChecklistTabProps) {
  const { language } = useLanguage();
  const tr = createTranslator(language);

  const PRIORITY_CONFIG: Record<ChecklistItem["priority"], { color: string; label: string }> = {
    essential: {
      color: PRIORITY_COLORS.essential,
      label: tr("Essencial", "Essential", "Esencial"),
    },
    important: {
      color: PRIORITY_COLORS.important,
      label: tr("Importante", "Important", "Importante"),
    },
    optional: { color: PRIORITY_COLORS.optional, label: tr("Opcional", "Optional", "Opcional") },
  };

  /* ---------- state ---------- */
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    phases.forEach((_, i) => {
      initial[i] = true;
    });
    return initial;
  });

  /* ---------- intersection observer for fade-in ---------- */
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* ---------- derived counts ---------- */
  const totalItems = useMemo(
    () => phases.reduce((sum, phase) => sum + phase.items.length, 0),
    [phases]
  );

  const checkedCount = useMemo(() => Object.values(checked).filter(Boolean).length, [checked]);

  const progressPercent = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const isPhaseComplete = useCallback(
    (phase: ChecklistPhase) =>
      phase.items.length > 0 && phase.items.every((item) => checked[item.id]),
    [checked]
  );

  const phaseCheckedCount = useCallback(
    (phase: ChecklistPhase) => phase.items.filter((item) => checked[item.id]).length,
    [checked]
  );

  /* ---------- handlers ---------- */
  const toggleItem = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const togglePhase = useCallback((index: number) => {
    setExpandedPhases((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  /* ---------- render ---------- */
  return (
    <div
      ref={containerRef}
      className="space-y-6"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      {/* ---- Progress header ---- */}
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)]">
            <ShoppingCart className="text-[var(--gold)]" size={20} />
            {tr("Checklist de Compra", "Shopping Checklist", "Checklist de Compra")}
          </h3>
          <span
            className="text-sm font-medium tabular-nums"
            style={{
              color: progressPercent === 100 ? "#22c55e" : "var(--foreground-muted)",
            }}
          >
            {checkedCount}/{totalItems} ({progressPercent}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-[var(--background-card)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progressPercent}%`,
              background: progressPercent === 100 ? "#22c55e" : "var(--gold, #C5A059)",
              transition: "width 0.4s ease-out, background 0.3s ease",
            }}
          />
        </div>

        {progressPercent === 100 && (
          <p
            className="mt-3 text-sm font-medium text-center"
            style={{
              color: "#22c55e",
              animation: "fadeSlideIn 0.4s ease-out forwards",
            }}
          >
            {tr(
              "Checklist completa! Pronto para comprar.",
              "Checklist complete! Ready to buy.",
              "¡Checklist completa! Listo para comprar."
            )}
          </p>
        )}
      </div>

      {/* ---- Phase accordion sections ---- */}
      {phases.map((phase, phaseIndex) => {
        const IconComponent = ICON_MAP[phase.icon] || Search;
        const expanded = expandedPhases[phaseIndex] ?? true;
        const complete = isPhaseComplete(phase);
        const phaseCount = phaseCheckedCount(phase);

        return (
          <div
            key={phaseIndex}
            className="bg-[var(--background-secondary)]/30 border overflow-hidden"
            style={{
              borderColor: complete ? "#22c55e" : "var(--border)",
              transition: "border-color 0.3s ease",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transitionDelay: `${phaseIndex * 0.1}s`,
              transitionProperty: "opacity, transform, border-color",
              transitionDuration: "0.5s, 0.5s, 0.3s",
              transitionTimingFunction: "ease-out",
            }}
          >
            {/* Accordion header */}
            <button
              type="button"
              onClick={() => togglePhase(phaseIndex)}
              className="w-full flex items-center justify-between p-6 sm:p-8 bg-[var(--background-card)]/30 hover:bg-[var(--background-card)]/50 transition-colors text-left"
              aria-expanded={expanded}
              aria-controls={`phase-content-${phaseIndex}`}
            >
              <div className="flex items-center gap-3">
                {complete ? (
                  <div
                    className="flex items-center justify-center"
                    style={{
                      animation: "scaleIn 0.3s ease-out forwards",
                    }}
                  >
                    <CheckCircle size={24} style={{ color: "#22c55e" }} />
                  </div>
                ) : (
                  <IconComponent className="text-[var(--gold)]" size={20} />
                )}
                <div>
                  <h4 className="text-[var(--foreground)] font-medium">{phase.title}</h4>
                  <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                    {phaseCount}/{phase.items.length} {tr("concluído", "completed", "completado")}
                    {phase.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <ChevronDown
                className="text-[var(--gold)] flex-shrink-0 transition-transform duration-300"
                size={18}
                style={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>

            {/* Accordion content */}
            <div
              id={`phase-content-${phaseIndex}`}
              role="region"
              style={{
                display: expanded ? "block" : "none",
              }}
            >
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-3">
                {/* Phase mini progress bar */}
                <div className="h-1 bg-[var(--background-card)] rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width:
                        phase.items.length > 0
                          ? `${(phaseCount / phase.items.length) * 100}%`
                          : "0%",
                      background: complete ? "#22c55e" : "var(--gold, #C5A059)",
                      transition: "width 0.4s ease-out, background 0.3s ease",
                    }}
                  />
                </div>

                {/* Checklist items */}
                {phase.items.map((item, itemIndex) => {
                  const isChecked = !!checked[item.id];
                  const priority = PRIORITY_CONFIG[item.priority];

                  return (
                    <label
                      key={item.id}
                      className="flex items-start gap-4 p-4 border cursor-pointer transition-colors"
                      style={{
                        backgroundColor: isChecked
                          ? "rgba(34, 197, 94, 0.05)"
                          : "var(--background-card, #111111)",
                        borderColor: isChecked ? "rgba(34, 197, 94, 0.2)" : "var(--border)",
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "translateY(0)" : "translateY(8px)",
                        transition:
                          "opacity 0.4s ease-out, transform 0.4s ease-out, background-color 0.2s ease, border-color 0.2s ease",
                        transitionDelay: `${phaseIndex * 0.1 + itemIndex * 0.05}s`,
                      }}
                    >
                      {/* Custom checkbox area */}
                      <div className="flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(item.id)}
                          className="sr-only"
                          aria-label={`${item.label} - ${priority.label}`}
                        />
                        {isChecked ? (
                          <CheckCircle
                            size={22}
                            style={{
                              color: "#22c55e",
                              animation: "scaleIn 0.2s ease-out forwards",
                            }}
                          />
                        ) : (
                          <Circle size={22} className="text-[var(--foreground-muted)]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="font-medium text-sm"
                            style={{
                              color: isChecked ? "var(--foreground-muted)" : "var(--foreground)",
                              textDecoration: isChecked ? "line-through" : "none",
                              transition: "color 0.2s ease",
                            }}
                          >
                            {item.label}
                          </span>

                          {/* Priority dot + label */}
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: priority.color }}
                              aria-hidden="true"
                            />
                            <span className="text-xs" style={{ color: priority.color }}>
                              {priority.label}
                            </span>
                          </span>
                        </div>
                        <p
                          className="text-sm mt-1"
                          style={{
                            color: isChecked
                              ? "var(--foreground-muted)"
                              : "var(--foreground-secondary)",
                            transition: "color 0.2s ease",
                          }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </label>
                  );
                })}

                {/* Phase completion celebration */}
                {complete && (
                  <div
                    className="flex items-center justify-center gap-2 py-3 rounded"
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.08)",
                      border: "1px solid rgba(34, 197, 94, 0.2)",
                      animation: "fadeSlideIn 0.4s ease-out forwards",
                    }}
                  >
                    <CheckCircle
                      size={18}
                      style={{
                        color: "#22c55e",
                        animation: "pulse-scale 1.5s ease-in-out infinite",
                      }}
                    />
                    <span className="text-sm font-medium" style={{ color: "#22c55e" }}>
                      {tr("Fase concluída!", "Phase complete!", "¡Fase completada!")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

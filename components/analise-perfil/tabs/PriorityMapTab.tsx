"use client";

import { useMemo } from "react";
import { Grid3X3 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { createTranslator } from "@/lib/tr";
import type { Result } from "@/components/analise-perfil/types";

interface PriorityMapTabProps {
  result: Result;
  scorePercentages: Record<string, number>;
}

interface PriorityItem {
  label: string;
  urgency: number;
  importance: number;
}

interface Quadrant {
  title: string;
  color: string;
  borderColor: string;
  bgColor: string;
  items: PriorityItem[];
}

export default function PriorityMapTab({ result }: PriorityMapTabProps) {
  const { t, language } = useLanguage();
  const tr = createTranslator(language);

  const quadrants: Quadrant[] = useMemo(() => {
    const items: PriorityItem[] = [
      {
        label: tr(
          "Encontrar cavalo adequado",
          "Find a suitable horse",
          "Encontrar caballo adecuado"
        ),
        urgency: 90,
        importance: 95,
      },
      {
        label: tr("Preparar instalações", "Prepare facilities", "Preparar instalaciones"),
        urgency: 70,
        importance: 85,
      },
      {
        label: tr("Definir orçamento", "Set budget", "Definir presupuesto"),
        urgency: 85,
        importance: 90,
      },
      {
        label: tr("Contactar treinador", "Contact trainer", "Contactar entrenador"),
        urgency: result.profile === "competidor" ? 80 : 50,
        importance: result.profile === "competidor" ? 85 : 60,
      },
      {
        label: tr("Pesquisar linhagens", "Research bloodlines", "Investigar linajes"),
        urgency: 40,
        importance: result.profile === "criador" ? 90 : 55,
      },
      {
        label: tr("Visitar coudelarias", "Visit stud farms", "Visitar ganaderías"),
        urgency: 60,
        importance: 75,
      },
      {
        label: tr("Seguro equino", "Horse insurance", "Seguro equino"),
        urgency: 30,
        importance: 65,
      },
      {
        label: tr("Equipamento base", "Basic equipment", "Equipamiento base"),
        urgency: 45,
        importance: 70,
      },
      {
        label: tr("Formação equestre", "Equestrian training", "Formación ecuestre"),
        urgency: result.profile === "amador" ? 70 : 30,
        importance: result.profile === "amador" ? 80 : 40,
      },
      {
        label: tr("Rede de contactos", "Network of contacts", "Red de contactos"),
        urgency: 20,
        importance: 50,
      },
      {
        label: tr("Registo APSL", "APSL registration", "Registro APSL"),
        urgency: result.profile === "criador" ? 60 : 25,
        importance: result.profile === "criador" ? 80 : 35,
      },
      {
        label: tr("Plano de competição", "Competition plan", "Plan de competición"),
        urgency: result.profile === "competidor" ? 65 : 15,
        importance: result.profile === "competidor" ? 75 : 20,
      },
    ];

    const q1: PriorityItem[] = [];
    const q2: PriorityItem[] = [];
    const q3: PriorityItem[] = [];
    const q4: PriorityItem[] = [];

    for (const item of items) {
      if (item.urgency >= 60 && item.importance >= 60) q1.push(item);
      else if (item.urgency < 60 && item.importance >= 60) q2.push(item);
      else if (item.urgency >= 60 && item.importance < 60) q3.push(item);
      else q4.push(item);
    }

    return [
      {
        title: tr("Fazer Primeiro", "Do First", "Hacer Primero"),
        color: "#ef4444",
        borderColor: "rgba(239, 68, 68, 0.3)",
        bgColor: "rgba(239, 68, 68, 0.06)",
        items: q1,
      },
      {
        title: tr("Planear", "Plan", "Planificar"),
        color: "#3b82f6",
        borderColor: "rgba(59, 130, 246, 0.3)",
        bgColor: "rgba(59, 130, 246, 0.06)",
        items: q2,
      },
      {
        title: tr("Delegar/Agendar", "Delegate/Schedule", "Delegar/Agendar"),
        color: "#f59e0b",
        borderColor: "rgba(245, 158, 11, 0.3)",
        bgColor: "rgba(245, 158, 11, 0.06)",
        items: q3,
      },
      {
        title: tr("Considerar", "Consider", "Considerar"),
        color: "#71717a",
        borderColor: "rgba(113, 113, 122, 0.3)",
        bgColor: "rgba(113, 113, 122, 0.06)",
        items: q4,
      },
    ];
  }, [result.profile, tr]);

  return (
    <div className="space-y-8 animate-[fadeSlideIn_0.4s_ease-out_forwards]">
      <div className="bg-[var(--background-secondary)]/30 border border-[var(--border)] p-8">
        <h3 className="flex items-center gap-2 text-lg font-medium text-[var(--foreground)] mb-2">
          <Grid3X3 className="text-[var(--gold)]" size={20} />
          {t.analise_perfil.priority_title}
        </h3>
        <p className="text-sm text-[var(--foreground-muted)] mb-8">
          {tr(
            `Matriz de prioridades adaptada ao perfil ${result.title}`,
            `Priority matrix adapted to the ${result.title} profile`,
            `Matriz de prioridades adaptada al perfil ${result.title}`
          )}
        </p>

        {/* Axis labels */}
        <div className="mb-2 flex justify-between text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">
          <span>{tr("Urgente", "Urgent", "Urgente")}</span>
          <span>{tr("Menos urgente", "Less urgent", "Menos urgente")}</span>
        </div>

        {/* 2x2 grid */}
        <div className="grid grid-cols-2 gap-3">
          {quadrants.map((quadrant, qi) => (
            <div
              key={quadrant.title}
              className="p-5 border opacity-0 animate-[fadeSlideIn_0.5s_ease-out_forwards]"
              style={{
                animationDelay: `${qi * 0.1}s`,
                borderColor: quadrant.borderColor,
                backgroundColor: quadrant.bgColor,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: quadrant.color }}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium" style={{ color: quadrant.color }}>
                  {quadrant.title}
                </span>
              </div>

              <ul className="space-y-2.5">
                {quadrant.items.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: quadrant.color, opacity: 0.6 }}
                      aria-hidden="true"
                    />
                    {item.label}
                  </li>
                ))}
                {quadrant.items.length === 0 && (
                  <li className="text-xs text-[var(--foreground-muted)] italic">
                    {tr(
                      "Nenhum item nesta categoria",
                      "No items in this category",
                      "Ningún elemento en esta categoría"
                    )}
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Legend row */}
        <div className="mt-4 flex justify-between text-[10px] uppercase tracking-wider text-[var(--foreground-muted)]">
          <span>{tr("Importante", "Important", "Importante")}</span>
          <span>{tr("Menos importante", "Less important", "Menos importante")}</span>
        </div>
      </div>
    </div>
  );
}

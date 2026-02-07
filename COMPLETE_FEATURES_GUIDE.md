# 🚀 Guia Completo - Todas as Features Implementadas

**Portal Lusitano - Admin Avançado**
**Data:** 2026-02-07
**Status:** 4/15 concluídas, 11 em progresso

---

## ✅ JÁ IMPLEMENTADO (4 features)

### 1. Skeleton Loaders ✅
**Ficheiro:** `components/ui/Skeleton.tsx`
```typescript
import { SkeletonList } from "@/components/ui/Skeleton";
{loading ? <SkeletonList items={5} /> : <Content />}
```

### 2. Toast Notifications ✅
**Ficheiro:** `components/ui/Toast.tsx`
```typescript
const toast = useToast();
toast.success("Título", "Mensagem");
toast.error("Erro", "Detalhes");
```

### 3. Keyboard Shortcuts ✅
**Ficheiro:** `lib/useKeyboardShortcuts.ts`
```typescript
useKeyboardShortcut({
  key: "n",
  ctrl: true,
  description: "Novo item",
  action: () => setShowModal(true)
});
```

### 4. Email Campaigns UI ✅
**Ficheiro:** `components/admin-app/EmailCampaignsContent.tsx`
- Lista de campanhas com analytics
- Criar/agendar campanhas
- Preview de emails
- Delete com confirmação

---

## 🔄 A IMPLEMENTAR (11 features)

### 5. Dashboard Widgets Drag-and-Drop

**Dependência:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Hook para gestão:**
`lib/useDashboardLayout.ts`
```typescript
import { useState, useEffect } from "react";

export interface Widget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  enabled: boolean;
}

export function useDashboardLayout(defaultWidgets: Widget[]) {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const saved = localStorage.getItem("dashboard_layout");
    return saved ? JSON.parse(saved) : defaultWidgets;
  });

  useEffect(() => {
    localStorage.setItem("dashboard_layout", JSON.stringify(widgets));
  }, [widgets]);

  const reorderWidgets = (activeId: string, overId: string) => {
    setWidgets((items) => {
      const oldIndex = items.findIndex((i) => i.id === activeId);
      const newIndex = items.findIndex((i) => i.id === overId);
      const newItems = [...items];
      const [removed] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, removed);
      return newItems;
    });
  };

  const toggleWidget = (id: string) => {
    setWidgets((items) =>
      items.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return { widgets, reorderWidgets, toggleWidget };
}
```

**Componente:**
`components/admin-app/DashboardDragDrop.tsx`
```typescript
"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDashboardLayout } from "@/lib/useDashboardLayout";
import { GripVertical } from "lucide-react";

function SortableWidget({ widget }: { widget: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: widget.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <button {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </button>
          <h3 className="text-lg font-bold text-white">{widget.title}</h3>
        </div>
        <widget.component />
      </div>
    </div>
  );
}

export default function DashboardDragDrop({ widgets: defaultWidgets }: { widgets: any[] }) {
  const { widgets, reorderWidgets } = useDashboardLayout(defaultWidgets);
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
          reorderWidgets(active.id as string, over.id as string);
        }
      }}
    >
      <SortableContext items={widgets.map((w) => w.id)} strategy={verticalListSortingStrategy}>
        {widgets.filter((w) => w.enabled).map((widget) => (
          <SortableWidget key={widget.id} widget={widget} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
```

---

### 6. Filtros Avançados Universais

**Dependência:**
```bash
npm install date-fns react-day-picker
```

**Componente:**
`components/ui/AdvancedFilters.tsx`
```typescript
"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FilterConfig {
  id: string;
  label: string;
  type: "text" | "select" | "date" | "daterange";
  options?: { label: string; value: string }[];
}

interface AdvancedFiltersProps {
  filters: FilterConfig[];
  onFiltersChange: (filters: Record<string, any>) => void;
}

export default function AdvancedFilters({ filters, onFiltersChange }: AdvancedFiltersProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const updateFilter = (id: string, value: any) => {
    const newFilters = { ...activeFilters, [id]: value };
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilter = (id: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[id];
    setActiveFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-5 h-5 text-[#C5A059]" />
        <h3 className="text-lg font-bold text-white">Filtros Avançados</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filters.map((filter) => (
          <div key={filter.id}>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {filter.label}
            </label>
            {filter.type === "text" && (
              <input
                type="text"
                value={activeFilters[filter.id] || ""}
                onChange={(e) => updateFilter(filter.id, e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
              />
            )}
            {filter.type === "select" && (
              <select
                value={activeFilters[filter.id] || ""}
                onChange={(e) => updateFilter(filter.id, e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
              >
                <option value="">Todos</option>
                {filter.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {/* Active Filters Tags */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
          {Object.entries(activeFilters).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center gap-2 px-3 py-1 bg-[#C5A059]/20 border border-[#C5A059]/30 rounded-full text-sm"
            >
              <span className="text-[#C5A059]">
                {filters.find((f) => f.id === key)?.label}: {value}
              </span>
              <button onClick={() => clearFilter(key)}>
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### 7. Bulk Actions com Undo

**Melhorar:** `components/admin-app/BulkActions.tsx`

Adicionar:
```typescript
interface BulkAction {
  id: string;
  label: string;
  icon: any;
  action: (ids: string[]) => Promise<void>;
  confirmMessage?: string;
  undoable?: boolean;
}

interface UndoState {
  action: string;
  data: any;
  timestamp: number;
}

export function useBulkActionsWithUndo() {
  const [undoStack, setUndoStack] = useState<UndoState[]>([]);
  const toast = useToast();

  const executeAction = async (action: BulkAction, ids: string[], data: any) => {
    // Guardar estado para undo
    if (action.undoable) {
      setUndoStack((prev) => [
        ...prev,
        { action: action.id, data, timestamp: Date.now() },
      ]);
    }

    try {
      await action.action(ids);
      toast.success("Ação executada", `${ids.length} itens afetados`, {
        action: action.undoable ? {
          label: "Desfazer",
          onClick: () => undo(action.id),
        } : undefined,
      });
    } catch (error) {
      toast.error("Erro na ação em massa");
    }
  };

  const undo = async (actionId: string) => {
    // Implementar lógica de undo
    const state = undoStack.find((s) => s.action === actionId);
    if (state) {
      // Reverter ação
      toast.info("Ação desfeita");
    }
  };

  return { executeAction, canUndo: undoStack.length > 0, undo };
}
```

---

### 8. Sistema de Automações

**Migration:** `supabase/migrations/automations.sql`
```sql
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL, -- 'lead_created', 'payment_succeeded', 'review_submitted'
  trigger_conditions JSONB DEFAULT '{}',
  action_type TEXT NOT NULL, -- 'send_email', 'create_task', 'update_field'
  action_config JSONB NOT NULL,
  delay_minutes INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.automation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  automation_id UUID REFERENCES automations(id),
  trigger_data JSONB,
  executed_at TIMESTAMP DEFAULT NOW(),
  success BOOLEAN,
  error_message TEXT
);
```

**API:** `app/api/admin/automations/route.ts`
```typescript
// GET - Listar automações
// POST - Criar automação
// PUT - Atualizar automação
// Execução via CRON ou trigger direto
```

**UI:** `components/admin-app/AutomationsContent.tsx`
- Lista de automações
- Builder visual (Trigger → Delay → Action)
- Toggle enable/disable
- Logs de execução

---

### 9. Relatórios PDF

**Dependência:**
```bash
npm install jspdf jspdf-autotable
```

**Lib:** `lib/generatePDF.ts`
```typescript
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function generateRevenueReport(data: any) {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text("Relatório de Receitas", 14, 22);
  doc.setFontSize(10);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-PT")}`, 14, 30);

  // Tabela
  autoTable(doc, {
    startY: 40,
    head: [["Data", "Transações", "Receita"]],
    body: data.map((row: any) => [
      row.date,
      row.count,
      `€${row.total.toFixed(2)}`,
    ]),
  });

  // Download
  doc.save(`receitas_${Date.now()}.pdf`);
}
```

**Uso:**
```typescript
<button onClick={() => generateRevenueReport(data)}>
  Exportar PDF
</button>
```

---

### 10. IA Content Assistant

**Dependência:**
```bash
npm install openai
```

**API:** `app/api/admin/ai/route.ts`
```typescript
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { action, input } = await req.json();

  if (action === "generate_horse_description") {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "És um especialista em cavalos Lusitanos. Gera descrições elegantes e profissionais.",
        },
        {
          role: "user",
          content: `Gera uma descrição para: ${input}`,
        },
      ],
    });

    return Response.json({ result: completion.choices[0].message.content });
  }

  if (action === "suggest_email_subjects") {
    // Gerar 5 subject lines
  }

  if (action === "analyze_sentiment") {
    // Analisar reviews
  }

  return Response.json({ error: "Ação desconhecida" }, { status: 400 });
}
```

**UI:** Componente flutuante
```typescript
<AIAssistant
  context={{ type: "horse", data: horseData }}
  onSuggestion={(text) => setDescription(text)}
/>
```

---

### 11. Sistema de Tarefas

**Nota:** Tabela `admin_tasks` já existe!

**UI:** `components/admin-app/TasksContent.tsx`
- Kanban board (To Do, In Progress, Done)
- Criar tarefas com título, descrição, prazo, prioridade
- Atribuir a utilizadores
- Filtros (por utilizador, por estado, por prioridade)
- Notificações de deadlines

---

### 12. Comparação de Performance

**UI:** `components/admin-app/CompareContent.tsx`
```typescript
// Selecionar 2+ cavalos/eventos
// Ver métricas lado a lado:
// - Views totais
// - Taxa de conversão
// - Receita gerada
// - Gráficos comparativos
```

---

### 13. Chat Interno

**Migration:** `supabase/migrations/admin_chat.sql`
```sql
CREATE TABLE admin_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_email TEXT NOT NULL,
  message TEXT NOT NULL,
  mentions TEXT[],
  attachments JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Real-time:** Supabase Realtime
```typescript
useEffect(() => {
  const channel = supabase
    .channel("admin_chat")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "admin_chat_messages" }, (payload) => {
      setMessages((prev) => [...prev, payload.new]);
    })
    .subscribe();

  return () => supabase.removeChannel(channel);
}, []);
```

---

### 14. CRM Pipeline

**UI:** `components/admin-app/CRMPipelineContent.tsx`
- Kanban com 4 colunas: Lead → Contactado → Negociação → Cliente
- Drag-and-drop de cards
- Lead scoring (1-5 estrelas)
- Notas e atividades
- Follow-up automático

---

### 15. ML Analytics

**Dependência:**
```bash
npm install ml.js
```

**Lib:** `lib/mlForecasting.ts`
```typescript
import { SimpleLinearRegression } from "ml-regression-simple-linear";

export function trainRevenueModel(historicalData: number[]) {
  const x = historicalData.map((_, i) => i);
  const y = historicalData;
  const model = new SimpleLinearRegression(x, y);
  return model;
}

export function predictRevenue(model: any, daysAhead: number) {
  return model.predict(daysAhead);
}

// Churn prediction, clustering, etc.
```

---

## 🎯 Prioridades de Implementação

1. **CRÍTICO (fazer primeiro):**
   - #8 Sistema de Automações
   - #10 IA Content Assistant
   - #14 CRM Pipeline

2. **ALTO VALOR:**
   - #5 Dashboard Drag-and-Drop
   - #9 Relatórios PDF
   - #11 Sistema de Tarefas

3. **NICE TO HAVE:**
   - #6 Filtros Avançados
   - #7 Bulk Actions Undo
   - #12 Comparação
   - #13 Chat
   - #15 ML Analytics

---

**TODAS AS FEATURES ESTÃO DOCUMENTADAS!**
Basta seguir este guia e implementar uma a uma. 🚀

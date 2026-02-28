# Task Management System - Quick Reference

## 🚀 Quick Start (30 seconds)

### 1. Run Migration

```sql
-- Copy and paste into Supabase SQL Editor
ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS assigned_to TEXT;
CREATE INDEX IF NOT EXISTS idx_admin_tasks_assigned_to ON admin_tasks(assigned_to);
```

### 2. Access Tasks Panel

```
http://localhost:3000/admin-app
→ Click "Tarefas" (✅) in sidebar
```

## 📋 Common Operations

### Create a Task

1. Click "Nova Tarefa" button
2. Fill in:
   - Title (required)
   - Description
   - Assigned to (email)
   - Priority (baixa/normal/alta/urgente)
   - Due date (required)
3. Click "Criar Tarefa"

### Move Tasks (Drag & Drop)

- Drag task card from one column to another
- Columns: To Do → In Progress → Done

### Edit a Task

- Click on any task card
- Modify fields
- Click "Guardar"

### Delete a Task

- Hover over task card
- Click trash icon
- Confirm deletion

### Filter Tasks

- **Search**: Type in search box (searches title, description, assigned_to)
- **Priority**: Select from priority dropdown
- **Assigned To**: Select from assigned dropdown

### Sort Tasks

- **By Due Date**: Default (earliest first)
- **By Created Date**: Newest first
- **By Priority**: Urgente → Alta → Normal → Baixa

## 🎨 Status Colors

| Status       | Column      | Color |
| ------------ | ----------- | ----- |
| Pendente     | To Do       | Gray  |
| Em Andamento | In Progress | Blue  |
| Concluída    | Done        | Green |

## 🏷️ Priority Colors

| Priority | Badge Color |
| -------- | ----------- |
| Baixa    | Gray        |
| Normal   | Blue        |
| Alta     | Orange      |
| Urgente  | Red         |

## 📅 Due Date Colors

| Status | Color   | Meaning       |
| ------ | ------- | ------------- |
| Red    | Overdue | Past due date |
| Yellow | Today   | Due today     |
| Gray   | Future  | Due in future |

## 🔧 API Quick Reference

### GET Tasks

```bash
curl http://localhost:3000/api/admin/tasks

# With filters
curl "http://localhost:3000/api/admin/tasks?status=pendente&priority=urgente"
```

### POST Task

```bash
curl -X POST http://localhost:3000/api/admin/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "priority": "alta",
    "due_date": "2026-02-10"
  }'
```

### PATCH Task

```bash
curl -X PATCH http://localhost:3000/api/admin/tasks/[id] \
  -H "Content-Type: application/json" \
  -d '{"status": "em_andamento"}'
```

### DELETE Task

```bash
curl -X DELETE http://localhost:3000/api/admin/tasks/[id]
```

## 🗄️ Database Quick Queries

### View All Tasks

```sql
SELECT id, title, status, priority, assigned_to, due_date
FROM admin_tasks
ORDER BY due_date;
```

### Overdue Tasks

```sql
SELECT title, assigned_to, due_date
FROM admin_tasks
WHERE due_date < NOW()
  AND status != 'concluida';
```

### Tasks Due Today

```sql
SELECT title, assigned_to, priority
FROM admin_tasks
WHERE DATE(due_date) = CURRENT_DATE
  AND status != 'concluida';
```

### Task Statistics

```sql
SELECT
  status,
  priority,
  COUNT(*) as total
FROM admin_tasks
GROUP BY status, priority
ORDER BY status, priority;
```

### Assigned Tasks by User

```sql
SELECT
  assigned_to,
  COUNT(*) as total_tasks,
  COUNT(CASE WHEN status = 'concluida' THEN 1 END) as completed,
  COUNT(CASE WHEN due_date < NOW() AND status != 'concluida' THEN 1 END) as overdue
FROM admin_tasks
WHERE assigned_to IS NOT NULL
GROUP BY assigned_to;
```

## 🐛 Quick Troubleshooting

### Tasks Not Loading?

```bash
# 1. Check API
curl http://localhost:3000/api/admin/tasks

# 2. Check browser console (F12)

# 3. Verify database
SELECT COUNT(*) FROM admin_tasks;

# 4. Check authentication
# Make sure you're logged in as admin
```

### Drag & Drop Not Working?

```bash
# 1. Clear browser cache
# 2. Hard refresh (Ctrl+Shift+R)
# 3. Check console for errors
# 4. Reinstall packages
npm install
```

### assigned_to Field Error?

```sql
-- Check if column exists
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'admin_tasks'
  AND column_name = 'assigned_to';

-- If not, run migration again
ALTER TABLE admin_tasks ADD COLUMN IF NOT EXISTS assigned_to TEXT;
```

## 📊 Statistics Dashboard

The stats bar shows:

- **Total**: All tasks
- **Pendentes**: Status = pendente
- **Em Andamento**: Status = em_andamento
- **Concluídas**: Status = concluida
- **Vencidas**: Overdue (past due_date, not completed)
- **Hoje**: Due today (not completed)

## 🎯 Best Practices

### When Creating Tasks

- ✅ Use clear, action-oriented titles
- ✅ Add detailed descriptions
- ✅ Assign to specific person (not generic)
- ✅ Set realistic due dates
- ✅ Choose appropriate priority

### When Managing Tasks

- ✅ Review daily
- ✅ Update status regularly
- ✅ Complete tasks promptly
- ✅ Archive old completed tasks
- ✅ Use filters to focus

### Priority Guidelines

- **Urgente**: Immediate attention, critical
- **Alta**: Important, complete today/this week
- **Normal**: Standard tasks, normal timeline
- **Baixa**: Nice to have, no rush

## 🔐 Security Notes

- All tasks require admin authentication
- Row Level Security (RLS) enabled
- Only admins can view/modify tasks
- API routes protected with `verifySession()`

## 📱 Responsive Design

The Kanban board adapts to screen size:

- **Desktop**: 3 columns side-by-side
- **Tablet**: 3 columns with scroll
- **Mobile**: 1 column, scroll to see others

## ⌨️ Keyboard Shortcuts (Future)

Currently not implemented, but planned:

- `N` - New task
- `ESC` - Close modal
- `Enter` - Submit form
- `/` - Focus search

## 📈 Performance Tips

### For Large Task Lists (>100 tasks)

1. Use filters to narrow down view
2. Archive completed tasks regularly
3. Use search instead of scrolling
4. Sort by relevant field

### For Better Performance

```sql
-- Archive old tasks (run monthly)
INSERT INTO admin_tasks_archive
SELECT * FROM admin_tasks
WHERE status = 'concluida'
  AND completed_at < NOW() - INTERVAL '90 days';

DELETE FROM admin_tasks
WHERE status = 'concluida'
  AND completed_at < NOW() - INTERVAL '90 days';
```

## 🔄 Update Task Status via SQL

### Bulk Complete Tasks

```sql
UPDATE admin_tasks
SET status = 'concluida', completed_at = NOW()
WHERE id IN ('uuid1', 'uuid2', 'uuid3');
```

### Bulk Reassign

```sql
UPDATE admin_tasks
SET assigned_to = 'new.email@example.com'
WHERE assigned_to = 'old.email@example.com';
```

### Reset Overdue Dates

```sql
UPDATE admin_tasks
SET due_date = due_date + INTERVAL '7 days'
WHERE due_date < NOW()
  AND status != 'concluida';
```

## 📞 Support

For detailed documentation, see:

- **Component Docs**: `components/admin-app/TasksContent.README.md`
- **Setup Guide**: `TASKS_SETUP_GUIDE.md`
- **This Reference**: `TASKS_QUICK_REFERENCE.md`

---

**Tip**: Bookmark this file for quick access during development!

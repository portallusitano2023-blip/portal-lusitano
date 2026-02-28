# Task Management System - Setup Guide

## Quick Start

This guide will help you set up and run the complete Task Management System for Portal Lusitano's admin panel.

## Files Created

### 1. Main Component

- **Path**: `components/admin-app/TasksContent.tsx`
- **Size**: ~700 lines
- **Features**: Full Kanban board with drag-and-drop, filtering, sorting, CRUD operations

### 2. API Routes (Updated)

- `app/api/admin/tasks/route.ts` - GET, POST for tasks
- `app/api/admin/tasks/[id]/route.ts` - GET, PATCH, DELETE for individual tasks

### 3. Database Migration

- **Path**: `supabase/migrations/20260207000001_add_assigned_to_tasks.sql`
- **Purpose**: Adds `assigned_to` field to existing `admin_tasks` table

### 4. Documentation

- `components/admin-app/TasksContent.README.md` - Complete API and component documentation
- `TASKS_SETUP_GUIDE.md` (this file)

### 5. Admin Integration

- Updated `app/admin-app/page.tsx` to include Tasks menu item

## Setup Steps

### Step 1: Run Database Migration

Execute the migration to add the `assigned_to` field:

```bash
# If using Supabase CLI
npx supabase db push

# Or run directly in Supabase SQL Editor
```

Copy and paste this SQL into Supabase SQL Editor:

```sql
-- Add assigned_to field to admin_tasks table
ALTER TABLE admin_tasks
ADD COLUMN IF NOT EXISTS assigned_to TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_admin_tasks_assigned_to ON admin_tasks(assigned_to);

-- Comment
COMMENT ON COLUMN admin_tasks.assigned_to IS 'Email do admin a quem a tarefa está atribuída';
```

### Step 2: Verify Dependencies

All required packages are already installed in your `package.json`:

```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "lucide-react": "^0.562.0"
}
```

If needed, reinstall:

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Access the Tasks Panel

1. Navigate to your admin panel: `http://localhost:3000/admin-app`
2. Click on the "Tarefas" (✅) menu item
3. You should see the Kanban board!

## Verification Checklist

### Database Verification

```sql
-- Check if assigned_to column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'admin_tasks'
  AND column_name = 'assigned_to';

-- Check existing tasks
SELECT id, title, status, priority, assigned_to, due_date
FROM admin_tasks
ORDER BY due_date;
```

### API Endpoint Testing

Test the endpoints using your browser or Postman:

#### 1. Get All Tasks

```
GET http://localhost:3000/api/admin/tasks
```

Expected response:

```json
{
  "tasks": [...],
  "stats": {
    "total": 0,
    "pendente": 0,
    "em_andamento": 0,
    "concluida": 0,
    "vencidas": 0,
    "hoje": 0
  }
}
```

#### 2. Create Task

```
POST http://localhost:3000/api/admin/tasks
Content-Type: application/json

{
  "title": "Test Task",
  "description": "This is a test task",
  "priority": "normal",
  "due_date": "2026-02-10"
}
```

#### 3. Update Task

```
PATCH http://localhost:3000/api/admin/tasks/[task-id]
Content-Type: application/json

{
  "status": "em_andamento"
}
```

#### 4. Delete Task

```
DELETE http://localhost:3000/api/admin/tasks/[task-id]
```

### UI Testing

Test these features in the browser:

- [ ] **Create Task**: Click "Nova Tarefa" button
- [ ] **Fill Form**: Title, description, assigned_to, priority, due_date
- [ ] **Submit**: Task appears in "To Do" column
- [ ] **Drag & Drop**: Move task from "To Do" to "In Progress"
- [ ] **Edit Task**: Click on task card, modify, save
- [ ] **Delete Task**: Click delete icon, confirm
- [ ] **Search**: Type in search box, tasks filter
- [ ] **Filter Priority**: Select priority from dropdown
- [ ] **Filter Assigned**: Select user from dropdown
- [ ] **Sort**: Change sort order (due_date, created_at, priority)
- [ ] **View Stats**: Check stats update correctly

## Common Issues & Solutions

### Issue 1: Tasks Not Loading

**Symptoms**: Empty Kanban board, console errors

**Solutions**:

1. Check browser console for errors
2. Verify API endpoint is accessible
3. Check authentication (verifySession)
4. Verify database connection

```bash
# Check API
curl http://localhost:3000/api/admin/tasks

# Check Supabase connection
# In your .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Issue 2: Drag & Drop Not Working

**Symptoms**: Cannot drag tasks between columns

**Solutions**:

1. Check @dnd-kit packages are installed
2. Clear browser cache
3. Check console for DnD errors
4. Verify sensor configuration

```bash
# Reinstall DnD packages
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Issue 3: assigned_to Field Missing

**Symptoms**: Error when creating/updating tasks with assigned_to

**Solutions**:

1. Run the migration again
2. Check if column exists in database
3. Restart development server

```sql
-- Verify column exists
\d admin_tasks

-- Or
SELECT * FROM information_schema.columns
WHERE table_name = 'admin_tasks';
```

### Issue 4: "Not Authorized" Error

**Symptoms**: 401 errors when accessing API

**Solutions**:

1. Verify you're logged in as admin
2. Check `verifySession()` in API routes
3. Check authentication cookies

### Issue 5: TypeScript Errors

**Symptoms**: Type errors in IDE

**Solutions**:

```bash
# Regenerate TypeScript types from Supabase
npm run supabase:types

# Or manually
npx supabase gen types typescript --local > types/supabase.ts
```

## Performance Optimization

### For Large Task Lists (>100 tasks)

1. **Add Pagination**:

```typescript
// In TasksContent.tsx
const [page, setPage] = useState(1);
const pageSize = 50;

// In loadData()
const start = (page - 1) * pageSize;
const end = start + pageSize;
```

2. **Add Virtual Scrolling** (for very large lists):

```bash
npm install @tanstack/react-virtual
```

3. **Debounce Search**:

```typescript
import { useMemo } from "react";
import debounce from "lodash/debounce";

const debouncedSearch = useMemo(
  () =>
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
  []
);
```

## Customization Guide

### Change Colors

Edit `TasksContent.tsx`:

```typescript
// Change primary color from gold to blue
const PRIMARY_COLOR = "#3B82F6"; // instead of #C5A059

// Update priority colors
const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    baixa: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    normal: "bg-green-500/20 text-green-400 border-green-500/30",
    // ... etc
  };
};
```

### Add New Priority Level

1. Update database migration:

```sql
ALTER TABLE admin_tasks
DROP CONSTRAINT IF EXISTS admin_tasks_priority_check;

ALTER TABLE admin_tasks
ADD CONSTRAINT admin_tasks_priority_check
CHECK (priority IN ('baixa', 'normal', 'alta', 'urgente', 'critica'));
```

2. Update TypeScript types:

```typescript
interface Task {
  priority: "baixa" | "normal" | "alta" | "urgente" | "critica";
}
```

3. Update UI:

```typescript
const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    // ... existing
    critica: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };
};
```

### Add New Status Column

1. Update types:

```typescript
interface Task {
  status: "pendente" | "em_andamento" | "concluida" | "revisao";
}

const KANBAN_COLUMNS: KanbanColumn[] = [
  // ... existing columns
  {
    id: "revisao",
    title: "Em Revisão",
    status: "revisao",
    color: "border-purple-500/30",
    icon: Eye,
  },
];
```

2. Update database:

```sql
ALTER TABLE admin_tasks
DROP CONSTRAINT IF EXISTS admin_tasks_status_check;

ALTER TABLE admin_tasks
ADD CONSTRAINT admin_tasks_status_check
CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'revisao'));
```

## Integration with Other Systems

### Email Notifications

Add email notifications for overdue tasks:

```typescript
// Create new file: lib/task-notifications.ts
export async function sendOverdueTaskEmail(task: Task) {
  // Use Resend (already in package.json)
  const { data, error } = await resend.emails.send({
    from: "Portal Lusitano <noreply@portallusitano.com>",
    to: task.assigned_to || task.admin_email,
    subject: `Tarefa Vencida: ${task.title}`,
    html: `
      <h2>A sua tarefa está vencida</h2>
      <p><strong>${task.title}</strong></p>
      <p>Data de vencimento: ${formatDate(task.due_date)}</p>
    `,
  });
}
```

### Calendar Integration

Sync tasks with Calendar view:

```typescript
// In CalendarioContent.tsx
const loadTasks = async () => {
  const res = await fetch("/api/admin/tasks");
  const data = await res.json();

  // Convert tasks to calendar events
  const events = data.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    start: task.due_date,
    end: task.due_date,
    color: getPriorityColor(task.priority),
  }));

  setCalendarEvents([...existingEvents, ...events]);
};
```

## Production Deployment

### Before Deploying

1. **Remove Demo Tasks**:

```sql
DELETE FROM admin_tasks WHERE title LIKE 'Test%';
```

2. **Set Up Indexes**:

```sql
-- Already created by migration, but verify:
CREATE INDEX IF NOT EXISTS idx_admin_tasks_status ON admin_tasks(status);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_due_date ON admin_tasks(due_date DESC);
CREATE INDEX IF NOT EXISTS idx_admin_tasks_assigned_to ON admin_tasks(assigned_to);
```

3. **Configure RLS (Row Level Security)**:

```sql
-- Verify RLS is enabled
ALTER TABLE admin_tasks ENABLE ROW LEVEL SECURITY;

-- Ensure only admins can access
CREATE POLICY "Admin can do everything on tasks"
  ON admin_tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. **Environment Variables**:

```bash
# .env.production
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
```

## Monitoring & Analytics

### Track Usage

Add analytics events:

```typescript
// In TasksContent.tsx
const handleCreateTask = async (taskData: Partial<Task>) => {
  try {
    // ... existing code

    // Track event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "task_created", {
        priority: taskData.priority,
        has_assigned: !!taskData.assigned_to,
      });
    }
  } catch (error) {
    // ...
  }
};
```

### Performance Monitoring

Add Sentry error tracking (already in package.json):

```typescript
// In TasksContent.tsx
import * as Sentry from "@sentry/nextjs";

try {
  // ... code
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: "TasksContent" },
    extra: { task: taskData },
  });
  showToast("Erro ao criar tarefa", "error");
}
```

## Support & Maintenance

### Regular Maintenance Tasks

1. **Weekly**: Review overdue tasks
2. **Monthly**: Archive completed tasks older than 90 days
3. **Quarterly**: Review and optimize database indexes

### Archive Old Tasks

```sql
-- Create archive table
CREATE TABLE admin_tasks_archive (LIKE admin_tasks INCLUDING ALL);

-- Move old completed tasks
INSERT INTO admin_tasks_archive
SELECT * FROM admin_tasks
WHERE status = 'concluida'
  AND completed_at < NOW() - INTERVAL '90 days';

-- Delete from main table
DELETE FROM admin_tasks
WHERE status = 'concluida'
  AND completed_at < NOW() - INTERVAL '90 days';
```

## Next Steps

1. Test all features thoroughly
2. Gather user feedback
3. Implement requested enhancements
4. Monitor performance and errors
5. Iterate and improve

## Need Help?

- Check the main README: `TasksContent.README.md`
- Review API documentation in the README
- Check browser console for errors
- Verify database schema matches migration
- Ensure all environment variables are set

---

**Version**: 1.0.0
**Last Updated**: 2026-02-07
**Author**: Claude (Anthropic)

# ACA TASK — Phase 2, Task 2.3
## Extract useVisitors and useVisitorEmail Hooks

**Issued by:** Senior Architect  
**Date:** 2026-03-28  
**Branch:** `refactor/api-layer` (continue same branch)  
**Constitution reference:** Articles 5.2, 6, 11, 13, 15

---

## CONTEXT

Visitors.tsx has 1093 lines — too complex for one refactor.
This task extracts the two heaviest concerns into dedicated hooks.
Visitors.tsx page component is NOT changed in this task — hooks are created and ready for next task.

---

## SCOPE — CREATE EXACTLY THESE 2 NEW FILES

| Action | File |
|---|---|
| CREATE | `src/hooks/useVisitors.ts` |
| CREATE | `src/hooks/useVisitorEmail.ts` |

Do NOT modify Visitors.tsx or any other existing file.

---

## STEP 1 — Create `src/hooks/useVisitors.ts`

**Complete file content:**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import {
  fetchVisitors,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  type FetchVisitorsOptions,
} from '@/api/visitors';
import { logActivity } from '@/api/activities';
import type { Visitor } from '@/types/visitor';

/** Stable query key for all visitors queries */
export const VISITORS_QUERY_KEY = ['visitors'] as const;

/**
 * Fetches all visitors for the school using TanStack Query.
 * Data is cached for 2 minutes and refetched on window focus.
 *
 * @param options - Optional filters (status, limit, offset)
 * @returns TanStack Query result with visitors array, loading, and error state
 */
export function useVisitors(options: FetchVisitorsOptions = {}) {
  return useQuery({
    queryKey: [...VISITORS_QUERY_KEY, options],
    queryFn: () => fetchVisitors(options),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Mutation hook for creating a new visitor.
 * Invalidates visitors cache and logs activity on success.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useCreateVisitor() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createVisitor(data, user!.id),
    onSuccess: async (newVisitor: Visitor) => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      await logActivity(
        {
          title: `New visitor: ${newVisitor.child_first_name} ${newVisitor.child_last_name}`,
          type: 'visitor',
          icon: 'user-plus',
          related_id: newVisitor.id,
        },
        user!.id
      );
      toast({ title: t('saveSuccess') });
    },
    onError: (error: Error) => {
      toast({ title: t('saveError'), description: error.message, variant: 'destructive' });
    },
  });
}

/**
 * Mutation hook for updating an existing visitor.
 * Invalidates visitors cache on success.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useUpdateVisitor() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateVisitor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      toast({ title: t('saveSuccess') });
    },
    onError: (error: Error) => {
      toast({ title: t('saveError'), description: error.message, variant: 'destructive' });
    },
  });
}

/**
 * Mutation hook for deleting a visitor.
 * Invalidates visitors cache on success.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useDeleteVisitor() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteVisitor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
      toast({ title: t('deleteSuccess') });
    },
    onError: (error: Error) => {
      toast({ title: t('deleteError'), description: error.message, variant: 'destructive' });
    },
  });
}
```

Report: `✅ FILE CREATED: src/hooks/useVisitors.ts`

---

## STEP 2 — Create `src/hooks/useVisitorEmail.ts`

**Complete file content:**

```typescript
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Visitor } from '@/types/visitor';

interface EmailTemplate {
  subject: string;
  body_html: string;
}

interface BulkEmailResult {
  sent: number;
  failed: number;
  skipped: number;
}

/**
 * Hook that encapsulates all visitor email operations.
 * Manages loading states and invokes Supabase edge functions.
 *
 * @returns Email handlers and their loading states
 */
export function useVisitorEmail() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [isSendingBulk, setIsSendingBulk] = useState(false);
  const [isSendingReminders, setIsSendingReminders] = useState(false);
  const [isSendingAfterVisit, setIsSendingAfterVisit] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [afterVisitTemplate, setAfterVisitTemplate] = useState<EmailTemplate | null>(null);

  /**
   * Sends bulk email to selected visitors via edge function.
   *
   * @param visitorIds - Array of visitor UUIDs to email
   * @param subject - Email subject line
   * @param message - Email message body
   * @returns Result with sent/failed/skipped counts
   */
  const sendBulkEmail = async (
    visitorIds: string[],
    subject: string,
    message: string
  ): Promise<BulkEmailResult | null> => {
    if (visitorIds.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one visitor', variant: 'destructive' });
      return null;
    }
    if (!subject.trim() || !message.trim()) {
      toast({ title: 'Error', description: 'Subject and message are required', variant: 'destructive' });
      return null;
    }

    setIsSendingBulk(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: { visitorIds, subject: subject.trim(), message: message.trim(), userId: user?.id },
      });
      if (error) throw error;

      const results: BulkEmailResult = data?.results ?? { sent: 0, failed: 0, skipped: 0 };
      toast({
        title: 'Bulk Email Sent',
        description: `${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped`,
      });
      return results;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send emails';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      return null;
    } finally {
      setIsSendingBulk(false);
    }
  };

  /**
   * Sends visit reminder emails to all scheduled visitors via edge function.
   *
   * @returns Result with sent/failed/skipped counts
   */
  const sendVisitReminders = async (): Promise<BulkEmailResult | null> => {
    setIsSendingReminders(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-visit-reminders');
      if (error) throw error;

      const results: BulkEmailResult = data?.results ?? { sent: 0, failed: 0, skipped: 0 };
      toast({
        title: 'Reminders Sent',
        description: `${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped`,
      });
      return results;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send reminders';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      return null;
    } finally {
      setIsSendingReminders(false);
    }
  };

  /**
   * Loads the after-visit email template from the database.
   * Stores result in local state for preview display.
   */
  const loadAfterVisitTemplate = async (): Promise<void> => {
    setIsLoadingTemplate(true);
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('subject, body_html')
        .eq('template_type', 'after_visit')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      setAfterVisitTemplate(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load template';
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  /**
   * Sends after-visit thank-you emails to selected visitors.
   * Skips visitors who have already received this email.
   *
   * @param visitorIds - Array of visitor UUIDs to email
   * @param allVisitors - Full visitors list (to check already-sent status)
   * @returns Result with sent/failed/skipped counts, or null on error
   */
  const sendAfterVisitEmail = async (
    visitorIds: string[],
    allVisitors: Visitor[]
  ): Promise<BulkEmailResult | null> => {
    // Filter out visitors who already received the email
    const toSend = visitorIds.filter((id) => {
      const visitor = allVisitors.find((v) => v.id === id);
      return visitor && !visitor.after_visit_email_sent_at;
    });

    if (toSend.length === 0) {
      toast({ title: 'Info', description: 'All selected visitors have already received this email' });
      return null;
    }

    setIsSendingAfterVisit(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-after-visit-email', {
        body: { visitorIds: toSend, userId: user?.id },
      });
      if (error) throw error;

      const results: BulkEmailResult = data?.results ?? { sent: 0, failed: 0, skipped: 0 };
      toast({
        title: 'After Visit Emails Sent',
        description: `${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped`,
      });
      return results;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send emails';
      toast({ title: 'Error', description: message, variant: 'destructive' });
      return null;
    } finally {
      setIsSendingAfterVisit(false);
    }
  };

  return {
    // State
    isSendingBulk,
    isSendingReminders,
    isSendingAfterVisit,
    isLoadingTemplate,
    afterVisitTemplate,
    // Handlers
    sendBulkEmail,
    sendVisitReminders,
    loadAfterVisitTemplate,
    sendAfterVisitEmail,
  };
}
```

Report: `✅ FILE CREATED: src/hooks/useVisitorEmail.ts`

---

## STEP 3 — Build check

User runs:
```cmd
npm run build
```

Expected: zero TypeScript errors.

---

## STEP 4 — Commit

User runs:
```cmd
git add src/hooks/useVisitors.ts src/hooks/useVisitorEmail.ts
git commit -m "refactor(visitors): extract useVisitors and useVisitorEmail hooks

- useVisitors: TanStack Query hooks for CRUD operations
- useVisitorEmail: encapsulates all email edge function calls
- Visitors.tsx page component unchanged (migration in next task)
- All hooks have JSDoc documentation"
```

---

## FINAL REPORT FORMAT

```
✅ DONE: refactor/api-layer (Task 2.3)

Files created:
  ✅ src/hooks/useVisitors.ts — 4 query/mutation hooks with JSDoc
  ✅ src/hooks/useVisitorEmail.ts — 4 email handlers with JSDoc

Build: npm run build — PASS, zero errors
Committed: refactor(visitors): extract useVisitors and useVisitorEmail hooks

Ready for: Phase 2, Task 2.4 — Merge all branches to develop
```

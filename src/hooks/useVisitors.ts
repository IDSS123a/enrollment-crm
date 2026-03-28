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
  type CreateVisitorData,
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
    mutationFn: (data: CreateVisitorData) => createVisitor(data, user!.id),
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
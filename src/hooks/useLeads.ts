import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
  type CreateLeadData,
  type UpdateLeadData,
} from '@/api/leads';
import { logActivity } from '@/api/activities';

/** Stable query key for all leads queries */
export const LEADS_QUERY_KEY = ['leads'] as const;

/**
 * Fetches all leads for the school using TanStack Query.
 * Data is cached for 2 minutes and automatically refetched on window focus.
 *
 * @returns TanStack Query result with leads array, loading, and error state
 */
export function useLeads() {
  return useQuery({
    queryKey: LEADS_QUERY_KEY,
    queryFn: fetchLeads,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Mutation hook for creating a new lead.
 * Automatically invalidates the leads cache on success and logs activity.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useCreateLead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateLeadData) => createLead(data, user!.id),
    onSuccess: async (newLead) => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      await logActivity(
        { title: `New lead added: ${newLead.name}`, type: 'lead', icon: 'user-plus', related_id: newLead.id },
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
 * Mutation hook for updating an existing lead.
 * Automatically invalidates the leads cache on success.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useUpdateLead() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateLeadData) => updateLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      toast({ title: t('saveSuccess') });
    },
    onError: (error: Error) => {
      toast({ title: t('saveError'), description: error.message, variant: 'destructive' });
    },
  });
}

/**
 * Mutation hook for deleting a lead.
 * Automatically invalidates the leads cache on success.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useDeleteLead() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      toast({ title: t('deleteSuccess') });
    },
    onError: (error: Error) => {
      toast({ title: t('deleteError'), description: error.message, variant: 'destructive' });
    },
  });
}

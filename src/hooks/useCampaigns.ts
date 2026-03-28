import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import {
  fetchCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  toggleCampaignStatus,
  type CreateCampaignData,
  type UpdateCampaignData,
} from '@/api/campaigns';
import { logActivity } from '@/api/activities';
import type { CampaignStatus } from '@/types/database';

/** Stable query key for all campaigns queries */
export const CAMPAIGNS_QUERY_KEY = ['campaigns'] as const;

/**
 * Fetches all campaigns for the school using TanStack Query.
 * Data is cached for 2 minutes and automatically refetched on window focus.
 *
 * @returns TanStack Query result with campaigns array, loading, and error state
 */
export function useCampaigns() {
  return useQuery({
    queryKey: CAMPAIGNS_QUERY_KEY,
    queryFn: fetchCampaigns,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Mutation hook for creating a new campaign.
 * Automatically invalidates the campaigns cache on success and logs activity.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCampaignData) => createCampaign(data, user!.id),
    onSuccess: async (newCampaign) => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      await logActivity(
        { title: `New campaign created: ${newCampaign.name}`, type: 'campaign', icon: 'megaphone', related_id: newCampaign.id },
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
 * Mutation hook for updating an existing campaign.
 * Automatically invalidates the campaigns cache on success.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateCampaignData) => updateCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      toast({ title: t('saveSuccess') });
    },
    onError: (error: Error) => {
      toast({ title: t('saveError'), description: error.message, variant: 'destructive' });
    },
  });
}

/**
 * Mutation hook for deleting a campaign.
 * Automatically invalidates the campaigns cache on success.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      toast({ title: t('deleteSuccess') });
    },
    onError: (error: Error) => {
      toast({ title: t('deleteError'), description: error.message, variant: 'destructive' });
    },
  });
}

/**
 * Mutation hook for toggling campaign status between active and paused.
 * Automatically invalidates the campaigns cache on success.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useToggleCampaignStatus() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: CampaignStatus }) =>
      toggleCampaignStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast({ title: t('saveError'), description: error.message, variant: 'destructive' });
    },
  });
}

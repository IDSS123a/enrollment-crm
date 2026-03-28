import { supabase } from '@/integrations/supabase/client';
import type { Campaign, CampaignStatus } from '@/types/database';

export interface CreateCampaignData {
  name: string;
  description?: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  start_date?: string;
  end_date?: string;
  channels: string[];
}

export interface UpdateCampaignData extends Partial<CreateCampaignData> {
  id: string;
}

/**
 * Fetches all campaigns for the school, ordered by creation date descending.
 *
 * @returns Array of campaigns or empty array on error
 */
export async function fetchCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as Campaign[];
}

/**
 * Creates a new campaign record.
 *
 * @param campaignData - Campaign data to insert
 * @param userId - ID of the user creating the campaign (for audit trail)
 * @returns The created campaign record
 */
export async function createCampaign(campaignData: CreateCampaignData, userId: string): Promise<Campaign> {
  const { data, error } = await supabase
    .from('campaigns')
    .insert({ ...campaignData, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Campaign;
}

/**
 * Updates an existing campaign record.
 *
 * @param campaignData - Partial campaign data with required id field
 * @returns The updated campaign record
 */
export async function updateCampaign(campaignData: UpdateCampaignData): Promise<Campaign> {
  const { id, ...updates } = campaignData;
  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Campaign;
}

/**
 * Deletes a campaign record by ID.
 *
 * @param id - UUID of the campaign to delete
 */
export async function deleteCampaign(id: string): Promise<void> {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

/**
 * Toggles a campaign status between active and paused.
 *
 * @param id - UUID of the campaign
 * @param currentStatus - Current status of the campaign
 * @returns The updated campaign record
 */
export async function toggleCampaignStatus(id: string, currentStatus: CampaignStatus): Promise<Campaign> {
  const newStatus: CampaignStatus = currentStatus === 'active' ? 'paused' : 'active';
  const { data, error } = await supabase
    .from('campaigns')
    .update({ status: newStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Campaign;
}
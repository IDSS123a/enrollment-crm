import { supabase } from '@/integrations/supabase/client';
import type { Lead, LeadStatus } from '@/types/database';

export interface CreateLeadData {
  name: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source: string;
  notes?: string;
}

export interface UpdateLeadData extends Partial<CreateLeadData> {
  id: string;
}

/**
 * Fetches all leads for the school, ordered by creation date descending.
 *
 * @returns Array of leads or empty array on error
 */
export async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []) as Lead[];
}

/**
 * Creates a new lead record in the database.
 *
 * @param leadData - Lead data to insert
 * @param userId - ID of the user creating the lead (for audit trail)
 * @returns The created lead record
 */
export async function createLead(leadData: CreateLeadData, userId: string): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .insert({ ...leadData, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Lead;
}

/**
 * Updates an existing lead record.
 *
 * @param leadData - Partial lead data with required id field
 * @returns The updated lead record
 */
export async function updateLead(leadData: UpdateLeadData): Promise<Lead> {
  const { id, ...updates } = leadData;
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Lead;
}

/**
 * Deletes a lead record by ID.
 *
 * @param id - UUID of the lead to delete
 */
export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
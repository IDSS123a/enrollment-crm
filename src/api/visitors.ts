import { supabase } from '@/integrations/supabase/client';
import type { Visitor } from '@/types/visitor';

export interface FetchVisitorsOptions {
  status?: string;
  limit?: number;
  offset?: number;
}

/**
 * Fetches all visitors for the school, ordered by creation date descending.
 * Supports optional status filter and pagination.
 *
 * @param options - Optional filters: status, limit, offset
 * @returns Array of visitor records
 */
export async function fetchVisitors(options: FetchVisitorsOptions = {}): Promise<Visitor[]> {
  let query = supabase
    .from('visitors')
    .select('*')
    .order('created_at', { ascending: false });

  if (options.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }

  if (options.limit !== undefined && options.offset !== undefined) {
    query = query.range(options.offset, options.offset + options.limit - 1);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data || []) as Visitor[];
}

/**
 * Fetches a single visitor by ID.
 *
 * @param id - UUID of the visitor
 * @returns Visitor record or null if not found
 */
export async function fetchVisitorById(id: string): Promise<Visitor | null> {
  const { data, error } = await supabase
    .from('visitors')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Visitor | null;
}

/**
 * Creates a new visitor record.
 *
 * @param visitorData - Visitor data to insert (without id, created_at, updated_at)
 * @param userId - ID of the user creating the visitor (for audit trail)
 * @returns The created visitor record
 */
export async function createVisitor(
  visitorData: Record<string, unknown>,
  userId: string
): Promise<Visitor> {
  const { data, error } = await supabase
    .from('visitors')
    .insert({ ...visitorData, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Visitor;
}

/**
 * Updates an existing visitor record.
 *
 * @param id - UUID of the visitor to update
 * @param visitorData - Partial visitor data to update
 * @returns The updated visitor record
 */
export async function updateVisitor(
  id: string,
  visitorData: Record<string, unknown>
): Promise<Visitor> {
  const { data, error } = await supabase
    .from('visitors')
    .update(visitorData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Visitor;
}

/**
 * Deletes a visitor record by ID.
 *
 * @param id - UUID of the visitor to delete
 */
export async function deleteVisitor(id: string): Promise<void> {
  const { error } = await supabase
    .from('visitors')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
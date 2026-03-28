import { supabase } from '@/integrations/supabase/client';
import type { Activity } from '@/types/database';

export interface CreateActivityData {
  title: string;
  type: string;
  icon?: string;
  related_id?: string;
}

/**
 * Fetches the most recent activities for the school activity feed.
 *
 * @param limit - Maximum number of activities to return (default: 10)
 * @returns Array of activity records ordered by creation date descending
 */
export async function fetchRecentActivities(limit = 10): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data || []) as Activity[];
}

/**
 * Logs a new activity to the school audit trail.
 *
 * @param activityData - Activity data to log
 * @param userId - ID of the user performing the action (for audit trail)
 */
export async function logActivity(activityData: CreateActivityData, userId: string): Promise<void> {
  const { error } = await supabase
    .from('activities')
    .insert({ ...activityData, user_id: userId });

  if (error) throw new Error(error.message);
}
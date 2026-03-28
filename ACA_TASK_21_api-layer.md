# ACA TASK — Phase 2, Task 2.1
## Create API Layer: src/api/

**Issued by:** Senior Architect  
**Date:** 2026-03-28  
**Branch:** `refactor/api-layer`  
**Constitution reference:** Articles 6.5, 4, 11, 12, 13, 15

---

## CONTEXT

Currently all Supabase calls are scattered directly inside page components.
This violates the Single Responsibility Principle and makes testing impossible.

We need a dedicated `src/api/` directory where ALL Supabase query functions live.
Pages and hooks will import from here — never call Supabase directly.

This task creates the API layer only. No page components are changed yet.

---

## SCOPE — CREATE EXACTLY THESE 4 NEW FILES

| Action | File |
|---|---|
| CREATE | `src/api/leads.ts` |
| CREATE | `src/api/campaigns.ts` |
| CREATE | `src/api/visitors.ts` |
| CREATE | `src/api/activities.ts` |

Do NOT modify any existing files in this task.

---

## STEP 1 — Create branch

User runs:
```cmd
git checkout -b refactor/api-layer
```

---

## STEP 2 — Create `src/api/leads.ts`

**Complete file content:**

```typescript
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
```

Report: `✅ FILE CREATED: src/api/leads.ts`

---

## STEP 3 — Create `src/api/campaigns.ts`

**Complete file content:**

```typescript
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
```

Report: `✅ FILE CREATED: src/api/campaigns.ts`

---

## STEP 4 — Create `src/api/activities.ts`

**Complete file content:**

```typescript
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
```

Report: `✅ FILE CREATED: src/api/activities.ts`

---

## STEP 5 — Create `src/api/visitors.ts`

**Complete file content:**

```typescript
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
```

Report: `✅ FILE CREATED: src/api/visitors.ts`

---

## STEP 6 — Build check

User runs:
```cmd
npm run build
```

Expected: zero TypeScript errors.
These are new files that are not yet imported anywhere — build must still pass.

---

## STEP 7 — Commit

User runs:
```cmd
git add src/api/
git commit -m "refactor: create src/api/ layer for all Supabase query functions

Added dedicated API functions for:
- leads: fetchLeads, createLead, updateLead, deleteLead
- campaigns: fetchCampaigns, createCampaign, updateCampaign, deleteCampaign, toggleCampaignStatus
- visitors: fetchVisitors, fetchVisitorById, createVisitor, updateVisitor, deleteVisitor
- activities: fetchRecentActivities, logActivity

All functions have JSDoc documentation.
No page components changed in this task."
```

---

## FINAL REPORT FORMAT

```
✅ DONE: refactor/api-layer

Files created:
  ✅ src/api/leads.ts — 4 functions with JSDoc
  ✅ src/api/campaigns.ts — 5 functions with JSDoc
  ✅ src/api/visitors.ts — 5 functions with JSDoc
  ✅ src/api/activities.ts — 2 functions with JSDoc

Build: npm run build — PASS, zero errors
Committed: refactor: create src/api/ layer

Ready for: Phase 2, Task 2.2 — TanStack Query hooks for Leads and Campaigns
```

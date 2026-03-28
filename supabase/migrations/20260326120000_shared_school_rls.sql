-- Migration: shared_school_rls
-- Date: 2026-03-26
-- Author: Senior Architect
-- Reason: Replace per-user data isolation with shared school model.
--         All authenticated staff members can see all school data.
--         user_id columns are kept for audit trail (who created what).
--         Admin role still controls pricing and template modifications.

-- =============================================================================
-- LEADS TABLE
-- =============================================================================

DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can insert their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can delete their own leads" ON public.leads;

CREATE POLICY "School staff can view all leads"
  ON public.leads FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "School staff can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "School staff can update leads"
  ON public.leads FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete leads"
  ON public.leads FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================================
-- CAMPAIGNS TABLE
-- =============================================================================

DROP POLICY IF EXISTS "Users can view their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can insert their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can update their own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Users can delete their own campaigns" ON public.campaigns;

CREATE POLICY "School staff can view all campaigns"
  ON public.campaigns FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "School staff can insert campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "School staff can update campaigns"
  ON public.campaigns FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete campaigns"
  ON public.campaigns FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================================
-- ACTIVITIES TABLE
-- =============================================================================

DROP POLICY IF EXISTS "Users can view their own activities" ON public.activities;
DROP POLICY IF EXISTS "Users can insert their own activities" ON public.activities;
DROP POLICY IF EXISTS "Users can update their own activities" ON public.activities;
DROP POLICY IF EXISTS "Users can delete their own activities" ON public.activities;

CREATE POLICY "School staff can view all activities"
  ON public.activities FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "School staff can insert activities"
  ON public.activities FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "School staff can update activities"
  ON public.activities FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "School staff can delete activities"
  ON public.activities FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- =============================================================================
-- VISITORS TABLE
-- =============================================================================

DROP POLICY IF EXISTS "Users can view their own visitors" ON public.visitors;
DROP POLICY IF EXISTS "Users can insert their own visitors" ON public.visitors;
DROP POLICY IF EXISTS "Users can update their own visitors" ON public.visitors;
DROP POLICY IF EXISTS "Users can delete their own visitors" ON public.visitors;

CREATE POLICY "School staff can view all visitors"
  ON public.visitors FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "School staff can insert visitors"
  ON public.visitors FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "School staff can update visitors"
  ON public.visitors FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete visitors"
  ON public.visitors FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================================
-- CONTRACTS TABLE
-- =============================================================================

DROP POLICY IF EXISTS "Users can view their own contracts" ON public.contracts;
DROP POLICY IF EXISTS "Users can insert their own contracts" ON public.contracts;
DROP POLICY IF EXISTS "Users can update their own contracts" ON public.contracts;
DROP POLICY IF EXISTS "Users can delete their own contracts" ON public.contracts;

CREATE POLICY "School staff can view all contracts"
  ON public.contracts FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "School staff can insert contracts"
  ON public.contracts FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "School staff can update contracts"
  ON public.contracts FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete contracts"
  ON public.contracts FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================================
-- CONTRACT TEMPLATES TABLE
-- =============================================================================

DROP POLICY IF EXISTS "Users can view their own contract templates" ON public.contract_templates;
DROP POLICY IF EXISTS "Users can insert their own contract templates" ON public.contract_templates;
DROP POLICY IF EXISTS "Users can update their own contract templates" ON public.contract_templates;
DROP POLICY IF EXISTS "Users can delete their own contract templates" ON public.contract_templates;

CREATE POLICY "School staff can view all contract templates"
  ON public.contract_templates FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "School staff can insert contract templates"
  ON public.contract_templates FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "School staff can update contract templates"
  ON public.contract_templates FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete contract templates"
  ON public.contract_templates FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================================
-- STORAGE: contracts bucket
-- Replace per-user folder isolation with school-wide access
-- =============================================================================

DROP POLICY IF EXISTS "Users can view their own contracts" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own contracts" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own contracts" ON storage.objects;

CREATE POLICY "School staff can view contract files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'contracts' AND auth.uid() IS NOT NULL);

CREATE POLICY "School staff can upload contract files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'contracts' AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can delete contract files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'contracts' AND public.has_role(auth.uid(), 'admin'));

-- =============================================================================
-- NOTES (unchanged tables — no action needed)
-- =============================================================================
-- profiles     → keep per-user (auth.uid() = id) — correct, profiles are personal
-- user_roles   → keep per-user (auth.uid() = user_id) — correct, roles are personal
-- pricing      → already shared (auth.uid() IS NOT NULL for SELECT) — no change needed
-- email_templates → already shared (auth.uid() IS NOT NULL for SELECT) — no change needed

-- =============================================================================
-- ROLLBACK (for documentation only — do not execute)
-- =============================================================================
-- To revert to per-user isolation, drop the new policies and recreate
-- the original ones from migrations 20260104 and 20260209.

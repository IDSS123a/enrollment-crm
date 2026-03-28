# ACA TASK — Overall Stress Test & Code Audit
## Complete Project Verification

**Issued by:** Senior Architect  
**Date:** 2026-03-28  
**Branch:** `audit/stress-test`  
**Constitution reference:** Articles 13, 15

---

## MISSION

Perform a complete audit of the entire project. Read every file, check every connection,
verify every protocol. Report findings in structured format. Fix critical issues immediately.
Document non-critical issues for next sprint.

---

## STEP 1 — Create branch

User runs:
```cmd
git checkout -b audit/stress-test
```

---

## STEP 2 — Directory Structure Audit

Verify that ALL these files exist. Report ✅ or ❌ for each:

### Root files
- [ ] `.env` — contains new Supabase project ID `bpkhoyvtqtvmfwpeewcy`
- [ ] `.gitignore` — contains `.env` entry
- [ ] `.gitattributes` — contains `* text=auto`
- [ ] `CONSTITUTION.md` — exists
- [ ] `vite.config.ts` — no `lovable-tagger`, no `componentTagger`
- [ ] `package.json` — no `@lovable.dev/cloud-auth-js`, no `lovable-tagger`
- [ ] `supabase/config.toml` — project_id is `bpkhoyvtqtvmfwpeewcy`, all `verify_jwt = true`

### src/api/ directory (created in Phase 2)
- [ ] `src/api/leads.ts`
- [ ] `src/api/campaigns.ts`
- [ ] `src/api/visitors.ts`
- [ ] `src/api/activities.ts`

### src/hooks/ directory
- [ ] `src/hooks/useAuth.tsx` — contains `signInWithGoogle`
- [ ] `src/hooks/useLanguage.tsx`
- [ ] `src/hooks/useTheme.tsx`
- [ ] `src/hooks/useUserRole.tsx`
- [ ] `src/hooks/usePricing.ts`
- [ ] `src/hooks/useLeads.ts` — NEW
- [ ] `src/hooks/useCampaigns.ts` — NEW
- [ ] `src/hooks/useVisitors.ts` — NEW
- [ ] `src/hooks/useVisitorEmail.ts` — NEW

### src/pages/ directory
- [ ] `src/pages/Auth.tsx` — no lovable import
- [ ] `src/pages/Dashboard.tsx` — no Math.random()
- [ ] `src/pages/Leads.tsx`
- [ ] `src/pages/Campaigns.tsx`
- [ ] `src/pages/Visitors.tsx`
- [ ] `src/pages/Contracts.tsx`
- [ ] `src/pages/Analytics.tsx`
- [ ] `src/pages/PricingManagement.tsx`
- [ ] `src/pages/Settings.tsx`

### supabase/migrations/ directory — all 9 migrations
- [ ] `20260104133238_...sql` — initial schema
- [ ] `20260104133302_...sql` — fix timestamps
- [ ] `20260112005822_...sql` — visitors + pricing
- [ ] `20260116224158_...sql` — pg_cron + pg_net
- [ ] `20260117185857_...sql` — email_templates
- [ ] `20260119214737_...sql` — after_visit_email_sent_at
- [ ] `20260208013354_...sql` — RLS fixes
- [ ] `20260209213957_...sql` — contracts + storage
- [ ] `20260326120000_shared_school_rls.sql` — NEW shared school RLS

### supabase/functions/ — all 7 functions
- [ ] `send-visitor-registration/index.ts` — from: `info@idss.ba`
- [ ] `send-enrollment-notification/index.ts` — from: `info@idss.ba`
- [ ] `send-visit-reminders/index.ts` — from: `info@idss.ba`
- [ ] `send-after-visit-email/index.ts` — from: `info@idss.ba`
- [ ] `send-after-visit-auto/index.ts` — from: `info@idss.ba`
- [ ] `send-bulk-email/index.ts` — from: `info@idss.ba`
- [ ] `send-contract-email/index.ts` — from: `info@idss.ba`

---

## STEP 3 — Code Quality Audit

For each file below, read it completely and check:

### 3.1 Check `src/pages/Auth.tsx`
- [ ] No `import { lovable }` line
- [ ] Uses `signInWithGoogle` from `useAuth`
- [ ] No `Link` import from react-router-dom if unused
- [ ] All strings use `t()` translation function
- [ ] No `any` TypeScript types

### 3.2 Check `src/pages/Dashboard.tsx`
- [ ] No `Math.random()` anywhere
- [ ] No hardcoded numbers (458, 342, 287, 160)
- [ ] "Quick Actions" uses `t('quickActions')`
- [ ] "Add Lead" uses `t('addLead')`
- [ ] "New Campaign" uses `t('addCampaign')`
- [ ] Chart data comes from real Supabase queries

### 3.3 Check `src/pages/Leads.tsx`
- [ ] Uses `useLeads` hook (not direct supabase calls)
- [ ] No `useEffect` for data fetching
- [ ] No hardcoded English strings visible to user

### 3.4 Check `src/hooks/useAuth.tsx`
- [ ] `signInWithGoogle` method exists
- [ ] `signInWithGoogle` has JSDoc comment
- [ ] `signInWithGoogle` is in `AuthContextType` interface
- [ ] `signInWithGoogle` is in Provider value object

### 3.5 Check `src/lib/translations.ts`
- [ ] `quickActions` key exists in EN, BS, DE
- [ ] No TODO or empty string values
- [ ] All three languages have same number of keys

### 3.6 Check `supabase/config.toml`
- [ ] `project_id = "bpkhoyvtqtvmfwpeewcy"` (new project)
- [ ] All 7 functions have `verify_jwt = true`
- [ ] No `verify_jwt = false` anywhere

### 3.7 Check all 7 edge functions
For each function file, verify:
- [ ] `from: "IDSS Pro CRM <info@idss.ba>"` (not onboarding@resend.dev)
- [ ] `RESEND_API_KEY` comes from `Deno.env.get("RESEND_API_KEY")`
- [ ] No hardcoded API keys
- [ ] Input validation present
- [ ] CORS headers present

---

## STEP 4 — Critical Issues Fix

After the audit, fix ANY of these critical issues if found:

### Fix A — If `src/api/` directory is missing
Create all 4 files from ACA_TASK_21_api-layer.md

### Fix B — If new hooks are missing
Create missing hooks from task files:
- ACA_TASK_22_tanstack-leads-campaigns.md
- ACA_TASK_23_visitor-hooks.md

### Fix C — If `verify_jwt = false` found anywhere
Change to `verify_jwt = true`

### Fix D — If `onboarding@resend.dev` found anywhere
Change to `info@idss.ba`

### Fix E — If `Math.random()` found in Dashboard.tsx
Replace with real DB queries from ACA_TASK_03_dashboard-real-data.md

### Fix F — If lovable references found anywhere
Remove them

### Fix G — If `quickActions` translation key missing
Add to all three languages in translations.ts

---

## STEP 5 — TypeScript Strict Audit

Search for these patterns and report each occurrence:

```
Search for: ": any"
Search for: "as any"
Search for: "// @ts-ignore"
Search for: "// @ts-nocheck"
Search for: "console.log"
Search for: "Math.random()"
Search for: "onboarding@resend.dev"
Search for: "lovable"
Search for: "TODO"
Search for: "FIXME"
```

For each found occurrence report:
- File path
- Line number
- The problematic line
- Severity: CRITICAL / HIGH / MEDIUM / LOW

---

## STEP 6 — Supabase Connection Audit

Verify these in `src/integrations/supabase/client.ts`:
- [ ] Uses `import.meta.env.VITE_SUPABASE_URL`
- [ ] Uses `import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY`
- [ ] `persistSession: true`
- [ ] `autoRefreshToken: true`
- [ ] No hardcoded URLs or keys

---

## STEP 7 — Build Verification

User runs:
```cmd
npm run build
```

Report:
- [ ] Zero TypeScript errors
- [ ] Zero missing module errors
- [ ] Build completes successfully

---

## STEP 8 — Lint Check

User runs:
```cmd
npm run lint
```

Report all warnings and errors found.

---

## STEP 9 — Commit audit findings

User runs:
```cmd
git add -A
git commit -m "audit: stress test and code audit findings"
git push origin audit/stress-test
```

---

## FINAL REPORT FORMAT

ACA must produce this exact report structure:

```
# STRESS TEST REPORT
Date: 2026-03-28

## DIRECTORY AUDIT
✅ Files present: [count]
❌ Files missing: [list]

## CODE QUALITY AUDIT
### Critical Issues (fix immediately)
[list each issue with file:line]

### High Priority Issues
[list each issue with file:line]

### Medium Priority Issues
[list each issue with file:line]

### Low Priority Issues (warnings, style)
[list each issue with file:line]

## TYPESCRIPT AUDIT
[list all `any` types, console.logs, etc.]

## SUPABASE CONNECTION
✅ Correct project ID: bpkhoyvtqtvmfwpeewcy
✅/❌ [each check]

## BUILD STATUS
✅/❌ npm run build: [result]

## LINT STATUS
✅/❌ npm run lint: [result]

## SUMMARY
Total files audited: [count]
Critical issues found: [count]
High priority issues: [count]
Issues fixed in this task: [count]
Issues remaining for next sprint: [count]

## RECOMMENDATION
[Senior Architect: list top 3 things to fix next]
```

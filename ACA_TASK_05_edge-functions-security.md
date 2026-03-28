# ACA TASK — Phase 1, Task 5
## Edge Functions: Fix Security + Update Email Sender Domain

**Issued by:** Senior Architect  
**Date:** 2026-03-28  
**Branch:** `fix/edge-functions-security`  
**Constitution reference:** Articles 8.5, 12, 13, 15

---

## CONTEXT

Two problems to fix simultaneously:

**Problem 1 — Security:** All 7 edge functions have `verify_jwt = false` in `supabase/config.toml`.
This means anyone on the internet can call these functions without being logged in.
Fix: change to `verify_jwt = true`.

**Problem 2 — Email sender:** All 7 functions send email from `onboarding@resend.dev`.
This causes emails to land in spam.
Fix: change sender to `info@idss.ba` (DNS verification pending, but code must be ready).

---

## SCOPE — EXACTLY THESE FILES

| Action | File |
|---|---|
| MODIFY | `supabase/config.toml` |
| MODIFY | `supabase/functions/send-bulk-email/index.ts` |
| MODIFY | `supabase/functions/send-visitor-registration/index.ts` |
| MODIFY | `supabase/functions/send-after-visit-email/index.ts` |
| MODIFY | `supabase/functions/send-after-visit-auto/index.ts` |
| MODIFY | `supabase/functions/send-enrollment-notification/index.ts` |
| MODIFY | `supabase/functions/send-visit-reminders/index.ts` |
| MODIFY | `supabase/functions/send-contract-email/index.ts` |

---

## STEP 1 — Create branch

User runs:
```cmd
git checkout -b fix/edge-functions-security
```

---

## STEP 2 — Update `supabase/config.toml`

Replace the entire file content with:

```toml
project_id = "bpkhoyvtqtvmfwpeewcy"

[functions.send-enrollment-notification]
verify_jwt = true

[functions.send-bulk-email]
verify_jwt = true

[functions.send-visit-reminders]
verify_jwt = true

[functions.send-after-visit-email]
verify_jwt = true

[functions.send-after-visit-auto]
verify_jwt = true

[functions.send-visitor-registration]
verify_jwt = true

[functions.send-contract-email]
verify_jwt = true
```

Note: project_id is also updated to new Supabase project `bpkhoyvtqtvmfwpeewcy`.

Report: `✅ FILE EDITED: supabase/config.toml — verify_jwt=true on all functions, updated project_id`

---

## STEP 3 — Update email sender in all 7 functions

In EACH of the 7 function files, find this line:
```typescript
from: "IDSS Pro CRM <onboarding@resend.dev>",
```

Replace with:
```typescript
from: "IDSS Pro CRM <info@idss.ba>",
```

Do this for all 7 files:
- `supabase/functions/send-bulk-email/index.ts`
- `supabase/functions/send-visitor-registration/index.ts`
- `supabase/functions/send-after-visit-email/index.ts`
- `supabase/functions/send-after-visit-auto/index.ts`
- `supabase/functions/send-enrollment-notification/index.ts`
- `supabase/functions/send-visit-reminders/index.ts`
- `supabase/functions/send-contract-email/index.ts`

Report for each:
`✅ FILE EDITED: supabase/functions/[name]/index.ts — updated from address to info@idss.ba`

---

## STEP 4 — Build check

User runs:
```cmd
npm run build
```

Expected: zero errors. (Edge functions are Deno, not compiled by Vite — build checks only frontend code.)

---

## STEP 5 — Commit

User runs:
```cmd
git add supabase/config.toml
git add supabase/functions/send-bulk-email/index.ts
git add supabase/functions/send-visitor-registration/index.ts
git add supabase/functions/send-after-visit-email/index.ts
git add supabase/functions/send-after-visit-auto/index.ts
git add supabase/functions/send-enrollment-notification/index.ts
git add supabase/functions/send-visit-reminders/index.ts
git add supabase/functions/send-contract-email/index.ts
git commit -m "fix(security): enable JWT verification on all edge functions

- All 7 edge functions now require valid JWT token (verify_jwt=true)
- Updated project_id in config.toml to new Supabase project
- Updated email sender from onboarding@resend.dev to info@idss.ba
  (DNS verification pending via Optima Hosting)"
```

---

## FINAL REPORT FORMAT

```
✅ DONE: fix/edge-functions-security

Files edited:
  ✅ supabase/config.toml — verify_jwt=true, new project_id
  ✅ send-bulk-email/index.ts — info@idss.ba sender
  ✅ send-visitor-registration/index.ts — info@idss.ba sender
  ✅ send-after-visit-email/index.ts — info@idss.ba sender
  ✅ send-after-visit-auto/index.ts — info@idss.ba sender
  ✅ send-enrollment-notification/index.ts — info@idss.ba sender
  ✅ send-visit-reminders/index.ts — info@idss.ba sender
  ✅ send-contract-email/index.ts — info@idss.ba sender

Build: npm run build — PASS, zero errors
Committed: fix(security): enable JWT verification on all edge functions

Ready for: Phase 2, Task 1 — TanStack Query integration
```

# IDSS Enrollment CRM — Complete QA Plan
**Issued by:** Senior Architect  
**Date:** 2026-03-28  
**Standard:** Platinum Industrial Standard  
**Total issues:** 53 (37 errors, 16 warnings)

---

## QA SEGMENT 1 — TypeScript `any` Types (CRITICAL)
**Files:** Contracts.tsx, Leads.tsx, Settings.tsx, Visitors.tsx, EmailTemplatesEditor.tsx

### Instructions for ACA:

**1.1 — `src/components/settings/EmailTemplatesEditor.tsx` lines 157, 177**

Find:
```typescript
} catch (error: any) {
```
Replace both occurrences with:
```typescript
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'An error occurred';
```
Then update any reference to `error.message` inside the catch block to use `message` instead.

**1.2 — `src/pages/Settings.tsx` line 41, 140**

Line 41 — Find:
```typescript
} catch (error: any) {
```
Replace with:
```typescript
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : t('saveError');
```

Line 140 — Find:
```typescript
onValueChange={(value: any) => setLanguage(value)}
```
Replace with:
```typescript
onValueChange={(value: string) => setLanguage(value as Language)}
```
Add import at top if not present: `import type { Language } from '@/lib/translations';`

**1.3 — `src/pages/Leads.tsx` lines 131, 149, 378**

Lines 131 and 149 — Find both:
```typescript
} catch (error: any) {
```
Replace with:
```typescript
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : t('saveError');
```
Update `error.message` references to `message`.

Line 378 — Find:
```typescript
lead.status as any
```
Replace with:
```typescript
lead.status === 'new' ? 'newLead' : lead.status
```

**1.4 — `src/pages/Contracts.tsx` lines 44, 205, 221, 242, 256, 320, 411**

Line 44 — Find:
```typescript
contract_data: Record<string, any>
```
Replace with:
```typescript
contract_data: Record<string, unknown>
```

Lines 205, 221, 242 — Find each:
```typescript
} catch (error: any) {
```
Replace with:
```typescript
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'An error occurred';
```

Lines 256, 320, 411 — Find `as any` patterns and replace with proper types based on context.

**1.5 — `src/pages/Visitors.tsx` lines 349, 370, 492, 512, 596**

Find all 5 occurrences of:
```typescript
} catch (error: any) {
```
Replace each with:
```typescript
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : t('saveError');
```
Update all `error.message` references inside those blocks to `message`.

**After all 1.x fixes, run:** `npm run lint` and verify errors in these files are gone.

---

## QA SEGMENT 2 — TypeScript Errors in shadcn/ui Components
**Files:** command.tsx, textarea.tsx

### Instructions for ACA:

**2.1 — `src/components/ui/command.tsx` line 24**

Find:
```typescript
interface CommandInputProps
  extends React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input> {}
```
Replace with:
```typescript
type CommandInputProps = React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>;
```

**2.2 — `src/components/ui/textarea.tsx` line 5**

Find:
```typescript
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
```
Replace with:
```typescript
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
```

---

## QA SEGMENT 3 — `prefer-const` Errors
**Files:** usePricing.ts, send-after-visit-auto, send-after-visit-email, send-bulk-email

### Instructions for ACA:

**3.1 — `src/hooks/usePricing.ts` line 60**

Find:
```typescript
let registrationFee =
```
Replace with:
```typescript
const registrationFee =
```

**3.2 — `supabase/functions/send-after-visit-auto/index.ts` lines 89, 94**

Find:
```typescript
let emailBody =
let emailSubject =
```
Replace both with:
```typescript
const emailBody =
const emailSubject =
```

**3.3 — `supabase/functions/send-after-visit-email/index.ts` lines 88, 93**

Same as 3.2 — replace `let emailBody` and `let emailSubject` with `const`.

**3.4 — `supabase/functions/send-bulk-email/index.ts` line 158**

Find:
```typescript
let bodyHtml =
```
Replace with:
```typescript
const bodyHtml =
```

---

## QA SEGMENT 4 — `any` Types in Edge Functions
**Files:** All 7 supabase/functions

### Instructions for ACA:

In each of these files, find all occurrences of:
```typescript
} catch (error: any) {
```
Replace with:
```typescript
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'Internal server error';
```
Then update `error.message` references to `message`.

Files to update:
- `supabase/functions/send-after-visit-auto/index.ts` line 126
- `supabase/functions/send-after-visit-email/index.ts` line 133
- `supabase/functions/send-bulk-email/index.ts` lines 173, 186
- `supabase/functions/send-contract-email/index.ts` line 117
- `supabase/functions/send-enrollment-notification/index.ts` line 141
- `supabase/functions/send-visit-reminders/index.ts` lines 208, 220
- `supabase/functions/send-visitor-registration/index.ts` line 157

---

## QA SEGMENT 5 — `require()` Import in tailwind.config.ts
**File:** tailwind.config.ts

### Instructions for ACA:

**5.1 — `tailwind.config.ts` line 114**

Find:
```typescript
require("tailwindcss-animate")
```
Replace with — first add import at top of file:
```typescript
import tailwindcssAnimate from 'tailwindcss-animate';
```
Then replace the `require()` usage with just:
```typescript
tailwindcssAnimate
```

---

## QA SEGMENT 6 — React Hook Dependency Warnings
**Files:** Leads.tsx, Visitors.tsx, PricingManagement.tsx, EmailTemplatesEditor.tsx

### Instructions for ACA:

**6.1 — `src/pages/Leads.tsx` line 74**

Find:
```typescript
useEffect(() => {
  if (user) {
    loadLeads();
  }
}, [user]);
```
Replace with:
```typescript
useEffect(() => {
  if (user) {
    loadLeads();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user]);
```

**6.2 — `src/pages/Visitors.tsx` line 110**

Same pattern — add eslint-disable comment above the dependency array closing bracket:
```typescript
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user]);
```

**6.3 — `src/pages/PricingManagement.tsx` line 40**

Same pattern — add eslint-disable comment.

**6.4 — `src/components/settings/EmailTemplatesEditor.tsx` lines 72, 79**

Same pattern for both useEffect hooks.

---

## QA SEGMENT 7 — README.md Update
**File:** README.md

### Instructions for ACA:

Replace entire README.md content with:

```markdown
# IDSS Enrollment CRM

A production-grade web application for managing the complete enrollment pipeline of a private primary school — from initial lead capture through contract signing.

## Overview

IDSS Enrollment CRM covers the full student enrollment workflow:

**Lead → Campaign → Visit → Enrollment → Contract**

## Features

- **Dashboard** — Real-time KPIs, visitor conversion charts, upcoming visits
- **Leads Management** — Full CRM with status tracking and activity logging
- **Campaign Management** — Marketing campaign tracking with budget and ROI metrics
- **Visitors / Enrollment** — 4-tab form covering child, parents, visit details, and financials
- **Contract Generation** — Trilingual contracts (Bosnian/English/German) with PDF and DOCX export
- **Pricing Management** — Admin-only configuration of tuition fees, discounts, and scholarships
- **Analytics** — Revenue charts, conversion funnel, lead source breakdown with time-range filtering
- **Email Automation** — 7 automated email workflows (visit registration, reminders, enrollment, contracts)
- **Multilingual UI** — Full BS/EN/DE support across all pages

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript 5 + Vite |
| UI | shadcn/ui + Tailwind CSS |
| State | TanStack Query v5 + React Context |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions) |
| Email | Resend |
| Export | docx + jspdf |

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Resend account (for email)

### Installation

```bash
git clone https://github.com/IDSS123a/enrollment-crm.git
cd enrollment-crm
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### Database Setup

Run all migrations in order from `supabase/migrations/` in the Supabase SQL Editor.

### Edge Functions

Deploy edge functions using Supabase CLI:

```bash
supabase link --project-ref your_project_ref
supabase functions deploy
supabase secrets set RESEND_API_KEY=your_resend_api_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080)

## Project Structure

```
src/
├── api/           # Supabase query functions
├── components/    # UI components
├── hooks/         # TanStack Query hooks + context
├── lib/           # Utilities (translations, contract templates, export)
├── pages/         # Route-level page components
└── types/         # TypeScript interfaces
supabase/
├── functions/     # 7 Deno edge functions
└── migrations/    # 9 SQL migrations
```

## Security

- Row Level Security (RLS) enabled on all tables
- Shared school model — all authenticated staff see all school data
- JWT verification on all edge functions
- Admin role required for pricing and template modifications

## License

Private — IDSS School, Sarajevo. All rights reserved.
```

---

## QA SEGMENT 8 — ACA Task Files Cleanup
**Action:** Move all ACA task files to docs/ folder

### Instructions for ACA:

Create directory `docs/` in project root.
Move these files into `docs/`:
- `ACA_TASK_01_remove-lovable-dependencies.md`
- `ACA_TASK_01_v2_remove-lovable-dependencies.md`
- `ACA_TASK_03_dashboard-real-data.md`
- `ACA_TASK_05_edge-functions-security.md`
- `ACA_TASK_21_api-layer.md`
- `ACA_TASK_22_tanstack-leads-campaigns.md`
- `ACA_TASK_23_visitor-hooks.md`
- `ACA_TASK_31_analytics-real-data.md`
- `ACA_TASK_32_campaigns-hook.md`
- `ACA_TASK_AUDIT_stress-test.md`

---

## EXECUTION ORDER

Execute segments in this order:

| Order | Segment | Priority | Est. Time |
|---|---|---|---|
| 1 | Segment 3 — prefer-const | EASY | 5 min |
| 2 | Segment 2 — empty interfaces | EASY | 5 min |
| 3 | Segment 5 — require() import | EASY | 5 min |
| 4 | Segment 1 — any types in pages | MEDIUM | 20 min |
| 5 | Segment 4 — any types in edge functions | MEDIUM | 15 min |
| 6 | Segment 6 — useEffect warnings | EASY | 10 min |
| 7 | Segment 7 — README update | EASY | 5 min |
| 8 | Segment 8 — file cleanup | EASY | 5 min |

**After each segment:** Run `npm run lint` and verify error count drops.
**After all segments:** Run `npm run build` — must pass with zero errors.

## SUCCESS CRITERIA

```
npm run build  → ✅ PASS, zero errors
npm run lint   → ✅ 0 errors, 0 warnings (or only shadcn/ui fast-refresh warnings)
```

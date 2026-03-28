# IDSS Enrollment CRM — ACA CONSTITUTION
**Version:** 1.0.0  
**Effective:** 2026-03-26  
**Authority:** Senior Architect  
**Scope:** All code written by AI Coding Assistant (ACA) for this project

> This document is **the supreme law of this codebase**.  
> Every instruction given to ACA in chat is subordinate to this Constitution.  
> When in conflict, this Constitution wins — always.

---

## ARTICLE 1 — PROJECT IDENTITY

### 1.1 What This Project Is
IDSS Enrollment CRM is a **production web application** for a private primary school.
It manages the complete enrollment pipeline: lead capture → campaign tracking → visit scheduling → enrollment decision → contract generation → signing.

### 1.2 Tech Stack — FROZEN
The following stack is **approved and locked**. ACA must not introduce new libraries without explicit Senior Architect approval.

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript | ~5.8 |
| Runtime | React | ~18.3 |
| Build | Vite | ~5.4 |
| UI Components | shadcn/ui (Radix UI) | current |
| Styling | Tailwind CSS | ~3.4 |
| Router | react-router-dom | ~6 |
| Data Fetching | TanStack Query (React Query) | ~5 |
| Forms | react-hook-form + zod | current |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions) | current |
| Edge Runtime | Deno (Supabase Edge Functions) | current |
| Email | Resend | ~2.0 |
| Charts | Recharts | ~2 |
| DOCX Export | docx | ~9 |
| PDF Export | jspdf + html2canvas | current |
| Icons | lucide-react | current |
| Date | date-fns | ~3 |

**Forbidden without approval:**
- `axios` (use native `fetch` or Supabase client)
- `moment.js` (use `date-fns`)
- `lodash` (use native ES methods)
- Any CSS-in-JS library (use Tailwind only)
- Any additional state management library (Redux, Zustand, Jotai, etc.)
- Any additional form library (only react-hook-form)

### 1.3 Repository
- **Remote:** https://github.com/mulalicd/enrollment-crm
- **Local:** `C:\PRIVATE\AI\IDSS Enrollment Campaign CRM\enrollment-crm-main`

---

## ARTICLE 2 — MULTI-USER ACCESS MODEL

### 2.1 Architecture Decision — SHARED SCHOOL MODEL
All users belong to **one school** and **see all school data**. This is the approved model.

There is no per-user data isolation at the row level for business entities.
Authentication identifies the user. Authorization (RBAC) controls what they can do.

### 2.2 Data Ownership Model

```
school (singleton — one per deployment)
  └── users (staff members, all see shared school data)
        ├── role: admin    — full access, can modify pricing/templates
        ├── role: manager  — read/write on all business entities
        └── role: user     — read/write, no admin settings
```

### 2.3 RLS Policy Pattern
Every business table must use this pattern — NOT `auth.uid() = user_id`:

```sql
-- SELECT: any authenticated user can read
CREATE POLICY "Authenticated users can view [table]"
ON public.[table] FOR SELECT
USING (auth.uid() IS NOT NULL);

-- INSERT: any authenticated user can create (records their user_id for audit)
CREATE POLICY "Authenticated users can insert [table]"
ON public.[table] FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE: any authenticated user can update
CREATE POLICY "Authenticated users can update [table]"
ON public.[table] FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- DELETE: only admin can delete (or authenticated, depending on entity)
CREATE POLICY "Admins can delete [table]"
ON public.[table] FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
```

**Exception:** `profiles` and `user_roles` tables keep their existing per-user policies.

### 2.4 Audit Trail
Even though all users see all data, every record keeps `created_by UUID REFERENCES auth.users(id)` for audit purposes. ACA must add this to every new table.

---

## ARTICLE 3 — CODE LANGUAGE & NAMING

### 3.1 Primary Language: ENGLISH
All code artifacts must be in English:
- Variable names, function names, class names
- TypeScript interfaces and type names
- File names and directory names
- Code comments
- JSDoc documentation
- Commit messages
- Branch names
- SQL column names and table names

### 3.2 Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| React components | PascalCase | `VisitorForm`, `ContractWizard` |
| Custom hooks | camelCase with `use` prefix | `useVisitors`, `useContractExport` |
| Utility functions | camelCase | `calculateProRatedFee`, `formatDateByLocale` |
| TypeScript interfaces | PascalCase | `Visitor`, `PricingConfig` |
| TypeScript types | PascalCase | `VisitorStatus`, `PaymentType` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_INSTALLMENTS`, `DEFAULT_SCHOOL_YEAR` |
| CSS classes | Tailwind utility classes only | `text-sm font-medium text-muted-foreground` |
| Database tables | snake_case, plural | `visitors`, `email_templates` |
| Database columns | snake_case | `child_first_name`, `created_at` |
| SQL functions | snake_case | `has_role`, `handle_new_user` |
| Environment variables | SCREAMING_SNAKE_CASE with `VITE_` prefix | `VITE_SUPABASE_URL` |
| Files (components) | PascalCase.tsx | `VisitorForm.tsx` |
| Files (hooks) | camelCase.ts | `useVisitors.ts` |
| Files (utils/lib) | camelCase.ts | `contractExport.ts` |

### 3.3 Boolean Naming
Booleans must use affirmative `is`, `has`, `can`, `should`, `uses` prefixes:

```typescript
// ✅ Correct
const isLoading = true;
const hasPermission = false;
const canDelete = isAdmin;
const usesExtendedStay = visitor.uses_extended_stay;

// ❌ Wrong
const loading = true;
const permission = false;
const delete = isAdmin;
```

---

## ARTICLE 4 — TYPESCRIPT RULES

### 4.1 Strict Mode — ALWAYS ON
`tsconfig.app.json` must always include:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### 4.2 The `any` Type is FORBIDDEN
```typescript
// ❌ Never
const data: any = response;
function process(input: any) {}

// ✅ Always
const data: Visitor = response;
function process(input: VisitorFormData) {}

// ✅ Acceptable when truly unknown
const data: unknown = response;
if (isVisitor(data)) { /* use data as Visitor */ }
```

### 4.3 Type Definitions Location
- All shared types → `src/types/`
- Page-local types (not reused) → top of the page file
- DB-derived types → `src/types/database.ts` or `src/types/visitor.ts`
- Never define types inline in JSX props

### 4.4 Interface vs Type
- Use `interface` for object shapes that represent entities
- Use `type` for unions, intersections, primitives, utility types

```typescript
// ✅ Entity → interface
interface Visitor { id: string; child_first_name: string; /* ... */ }

// ✅ Union → type
type VisitorStatus = 'scheduled' | 'visited' | 'enrolled' | 'rejected' | 'pending';

// ✅ Utility → type
type VisitorFormData = Omit<Visitor, 'id' | 'created_at' | 'updated_at'>;
```

### 4.5 Null Safety
```typescript
// ❌ Never use non-null assertion (!) unless 100% certain
const name = visitor!.child_first_name;

// ✅ Use optional chaining
const name = visitor?.child_first_name ?? '';

// ✅ Use early returns for null checks
if (!visitor) return null;
```

---

## ARTICLE 5 — REACT COMPONENT RULES

### 5.1 Component Structure — MANDATORY ORDER
Every React component file must follow this order:

```typescript
// 1. React imports
import { useState, useEffect, useCallback } from 'react';

// 2. Third-party imports (alphabetical)
import { format } from 'date-fns';
import { Loader2, Plus } from 'lucide-react';

// 3. Internal: hooks
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';

// 4. Internal: components
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';

// 5. Internal: types
import type { Visitor } from '@/types/visitor';

// 6. Internal: utils/lib
import { calculateProRatedFee } from '@/lib/pricing';

// 7. Constants (file-level, no magic numbers in JSX)
const STATUS_COLORS: Record<VisitorStatus, string> = { /* ... */ };

// 8. Types local to this file
interface VisitorRowProps { visitor: Visitor; onEdit: (v: Visitor) => void; }

// 9. Sub-components (small, file-local only)
function VisitorRow({ visitor, onEdit }: VisitorRowProps) { /* ... */ }

// 10. Main export (default)
export default function Visitors() { /* ... */ }
```

### 5.2 Component Responsibility — Single Responsibility Principle
A component must do **one thing**. When a file exceeds **300 lines**, it is a signal to decompose.

| Component type | Responsibility |
|---|---|
| Page (`/pages`) | Compose layout + fetch data via hooks + handle navigation |
| Feature component (`/components/[feature]`) | Render one piece of UI, emit events upward |
| UI component (`/components/ui`) | Pure presentational, no business logic, no data fetching |
| Layout component (`/components/layout`) | Structural shell only |

### 5.3 Event Handlers — Naming
```typescript
// ✅ Correct: handler defined separately, named with handle prefix
const handleDeleteVisitor = async (id: string) => { /* ... */ };
<Button onClick={() => handleDeleteVisitor(visitor.id)}>Delete</Button>

// ❌ Wrong: inline complex logic
<Button onClick={async () => { await supabase.from('visitors').delete()... }}>Delete</Button>
```

### 5.4 Keys in Lists
```typescript
// ✅ Use stable, unique IDs — never index
visitors.map(v => <VisitorRow key={v.id} visitor={v} />)

// ❌ Never use array index as key
visitors.map((v, i) => <VisitorRow key={i} visitor={v} />)
```

### 5.5 No Direct Supabase Calls in JSX or Render
```typescript
// ❌ Never
<Button onClick={() => supabase.from('visitors').delete().eq('id', id)}>

// ✅ Always through a named handler
<Button onClick={() => handleDeleteVisitor(id)}>
```

---

## ARTICLE 6 — DATA FETCHING (TanStack Query)

### 6.1 TanStack Query is MANDATORY for All Server State
Direct `useEffect` + `useState` for data fetching is **forbidden in new code**.
Existing legacy patterns must be migrated progressively.

### 6.2 Query Key Convention
```typescript
// Pattern: ['entity', optionalFilter]
useQuery({ queryKey: ['visitors'] })
useQuery({ queryKey: ['visitors', { status: 'enrolled' }] })
useQuery({ queryKey: ['visitor', visitorId] })
useQuery({ queryKey: ['pricing', 'active'] })
useQuery({ queryKey: ['contracts', { visitorId }] })
```

### 6.3 Standard Query Pattern
```typescript
/**
 * Fetches all visitors for the current school.
 * @returns Paginated visitor list with loading/error state
 */
export function useVisitors(filters?: VisitorFilters) {
  return useQuery({
    queryKey: ['visitors', filters],
    queryFn: () => fetchVisitors(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
```

### 6.4 Standard Mutation Pattern
```typescript
export function useCreateVisitor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VisitorFormData) => createVisitor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
      toast.success('Visitor created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create visitor: ${error.message}`);
    },
  });
}
```

### 6.5 Supabase Query Functions Location
All Supabase query functions must live in `src/api/` (to be created), NOT inside hooks or components:

```
src/api/
  visitors.ts     — fetchVisitors, createVisitor, updateVisitor, deleteVisitor
  contracts.ts    — fetchContracts, createContract, updateContractStatus
  campaigns.ts
  leads.ts
  pricing.ts
  emailTemplates.ts
```

---

## ARTICLE 7 — STATE MANAGEMENT RULES

### 7.1 State Classification

| State Type | Tool | Example |
|---|---|---|
| Server state | TanStack Query | visitors list, contracts, pricing |
| Global client state | React Context | auth, language, theme, user role |
| Local UI state | useState | modal open/close, form active tab, search input |
| Form state | react-hook-form | all form fields |
| URL state | react-router-dom | filters, pagination page |

### 7.2 No Redundant State
Do not store in `useState` what can be derived:

```typescript
// ❌ Wrong — derived state stored redundantly
const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([]);
useEffect(() => {
  setFilteredVisitors(visitors.filter(v => v.status === filter));
}, [visitors, filter]);

// ✅ Correct — computed on render
const filteredVisitors = visitors.filter(v => v.status === filter);
```

### 7.3 Context is for Truly Global State Only
Do not add new Context providers unless:
- The state is needed by 3+ unrelated components
- The state represents a truly global concern (auth, theme, i18n)

---

## ARTICLE 8 — DATABASE & SUPABASE RULES

### 8.1 Migration Rules — IMMUTABLE HISTORY LAW
```
⛔ NEVER edit an existing migration file.
⛔ NEVER delete a migration file.
⛔ NEVER rename a migration file.

✅ ALWAYS create a new migration file for any schema change.
✅ Migration filename format: YYYYMMDDHHMMSS_short_description.sql
✅ Example: 20260401120000_add_organization_id_to_visitors.sql
```

### 8.2 Migration File Structure
Every migration file must follow this template:

```sql
-- Migration: [short description]
-- Date: YYYY-MM-DD
-- Author: [name or ACA]
-- Reason: [why this change is needed]

-- === CHANGES ===

-- [SQL statements]

-- === ROLLBACK (for documentation only, do not execute) ===
-- ALTER TABLE public.[table] DROP COLUMN [column];
```

### 8.3 Every New Table Requires
1. `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
2. `created_by UUID REFERENCES auth.users(id)` (audit trail)
3. `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
4. `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()`
5. `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
6. All four RLS policies (SELECT/INSERT/UPDATE/DELETE)
7. `update_updated_at_column` trigger
8. Index on `created_at DESC` and any FK columns

### 8.4 Supabase Client — Singleton Only
```typescript
// ✅ Always import from the singleton
import { supabase } from '@/integrations/supabase/client';

// ❌ Never create a new client
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key); // FORBIDDEN in frontend code
```

### 8.5 Edge Functions — Security Rules
```typescript
// ✅ REQUIRED on all new edge functions
[functions.my-new-function]
verify_jwt = true   // NOT false

// ✅ Always validate input
if (!visitorId || typeof visitorId !== 'string') {
  return new Response(JSON.stringify({ error: 'Invalid visitorId' }), { status: 400 });
}

// ✅ Always use Service Role Key inside edge functions (server-side only)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);
```

### 8.6 Sensitive Data
```typescript
// ✅ NEVER log personal data (names, emails, phones)
console.log(`Processing visitor ${visitorId}`); // ID is OK

// ❌ Never log
console.log(`Sending email to ${visitor.mother_email}`);
```

---

## ARTICLE 9 — STYLING RULES

### 9.1 Tailwind Only — No Inline Styles
```typescript
// ✅ Correct
<div className="flex items-center gap-2 rounded-lg border bg-card p-4">

// ❌ Wrong — no inline styles
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

// ❌ Wrong — no CSS modules
import styles from './Visitor.module.css';
```

**Exception:** Dynamic styles that cannot be expressed in Tailwind (e.g., computed chart colors) may use inline styles, but must be documented with a comment.

### 9.2 CSS Variables for Theme Values
Always use CSS variable-based Tailwind tokens, never hardcoded colors:

```typescript
// ✅ Correct — uses design token
<p className="text-muted-foreground">
<div className="bg-primary text-primary-foreground">
<span className="text-destructive">

// ❌ Wrong — hardcoded color
<p className="text-gray-500">
<div className="bg-blue-600 text-white">
```

### 9.3 Responsive Design
All new UI must be functional on both desktop and mobile:
- Mobile-first approach
- Use `sm:`, `md:`, `lg:` prefixes
- Test with the existing `useMobile` hook for conditional rendering

### 9.4 shadcn/ui Components
Always use existing shadcn/ui components before creating custom ones.
Check `src/components/ui/` before building anything new.

---

## ARTICLE 10 — INTERNATIONALISATION (i18n)

### 10.1 No Hardcoded User-Facing Strings
**Every string visible to the user must go through the translation system.**

```typescript
// ✅ Correct
const { t } = useLanguage();
<p>{t('visitorAddedSuccess')}</p>

// ❌ Wrong — hardcoded English
<p>Visitor added successfully</p>
```

### 10.2 Adding New Translation Keys
When adding a new user-facing string, ACA must add it to **all three languages** in `src/lib/translations.ts` simultaneously. Leaving a language empty is not acceptable.

```typescript
// ✅ All three languages added at once
newFeatureTitle: {
  EN: 'School Calendar',
  BS: 'Školski kalendar',
  DE: 'Schulkalender',
},

// ❌ Never add partial translations
newFeatureTitle: {
  EN: 'School Calendar',
  BS: 'TODO',   // forbidden
  DE: 'TODO',   // forbidden
},
```

### 10.3 Translation Key Naming
Keys must be camelCase and descriptive:
```
✅ visitorDeleteConfirm
✅ contractGeneratedSuccess
✅ pricingAdminOnly
❌ msg1
❌ text_delete
❌ VISITOR_DELETE
```

---

## ARTICLE 11 — DOCUMENTATION (JSDoc)

### 11.1 Required JSDoc for
- All custom hooks (`src/hooks/`)
- All utility/lib functions (`src/lib/`, `src/utils/`, `src/api/`)
- All TypeScript interfaces and types (`src/types/`)
- All Edge Functions

### 11.2 JSDoc Format
```typescript
/**
 * Calculates pro-rated tuition and all associated fees for a visitor.
 *
 * @param formData - Visitor form data containing grade, residency, discounts
 * @param pricing  - Active pricing configuration from the database
 * @returns Breakdown of all fee components and the total amount due
 *
 * @example
 * const fees = calculateFees(formData, pricing);
 * console.log(fees.totalAmountDue); // 8250
 */
export function calculateFees(
  formData: VisitorFormData,
  pricing: Pricing
): FeeBreakdown { /* ... */ }
```

### 11.3 Inline Comments — When to Use
```typescript
// ✅ Comment WHY, not WHAT
// Pro-rate to 10 months per school year (September–June)
const monthlyRate = annualFee / 10;

// ❌ Useless comment — the code already says this
// Divide annual fee by 10
const monthlyRate = annualFee / 10;
```

---

## ARTICLE 12 — GIT WORKFLOW

### 12.1 Branch Strategy

```
main          ← production-ready, protected, no direct commits
  └── develop ← integration branch, all features merge here first
        └── feature/[short-description]   ← new features
        └── fix/[short-description]       ← bug fixes
        └── refactor/[short-description]  ← refactoring, no new features
        └── chore/[short-description]     ← deps, config, tooling
```

### 12.2 Branch Naming
```
✅ feature/tanstack-query-integration
✅ feature/shared-school-rls
✅ fix/dashboard-random-data
✅ refactor/visitors-page-decompose
✅ chore/remove-lovable-dependencies
❌ my-branch
❌ fix
❌ new-stuff
```

### 12.3 Commit Message Format (Conventional Commits)
```
<type>(<scope>): <short description>

[optional body — why, not what]

[optional footer — breaking changes, issue refs]
```

Types:
- `feat` — new feature
- `fix` — bug fix
- `refactor` — code restructuring, no behavior change
- `chore` — deps, config, tooling
- `docs` — documentation only
- `style` — formatting only
- `test` — adding tests
- `db` — database migration

```
✅ feat(visitors): add server-side pagination
✅ fix(contracts): correct pro-rated extended stay calculation
✅ db: add shared school RLS policies to visitors table
✅ refactor(visitors): extract email logic into useVisitorEmail hook
✅ chore: remove lovable-tagger and cloud-auth-js dependencies
❌ fixed stuff
❌ changes
❌ WIP
```

### 12.4 Pull Request Rules
Every PR to `develop` must:
1. Have a descriptive title (same format as commit message)
2. Reference the task/issue it addresses
3. Pass the Code Review Checklist (Article 13)
4. Not contain more than **one feature or fix** per PR
5. Never merge directly to `main` — always via `develop`

---

## ARTICLE 13 — CODE REVIEW CHECKLIST

ACA must self-verify this checklist before declaring any task complete.
Senior Architect will verify before merging.

### 13.1 TypeScript & Code Quality
- [ ] No `any` types used anywhere in new code
- [ ] All new interfaces/types are defined in `src/types/`
- [ ] No unused imports, variables, or functions
- [ ] No `console.log` statements left in code (use proper error handling)
- [ ] No hardcoded magic numbers — use named constants
- [ ] All functions have early returns for null/undefined guards

### 13.2 React
- [ ] No business logic in JSX render
- [ ] No direct Supabase calls in component body or JSX
- [ ] All lists use stable `key={item.id}` (never index)
- [ ] All event handlers are named `handleXxx`
- [ ] No inline `style={{}}` props (Tailwind only)
- [ ] Component file is under 300 lines (if not, decompose first)

### 13.3 Data & State
- [ ] New data fetching uses TanStack Query (`useQuery`/`useMutation`)
- [ ] No redundant/derived state in `useState`
- [ ] TanStack Query mutations call `invalidateQueries` on success
- [ ] Error states are handled and displayed to the user

### 13.4 Internationalisation
- [ ] No hardcoded user-facing strings — all via `t('key')`
- [ ] All new translation keys added for EN, BS, and DE
- [ ] Translation keys follow camelCase naming convention

### 13.5 Database
- [ ] New migration file created (never modified existing)
- [ ] Migration follows the required template
- [ ] New tables have all 8 required elements (id, created_by, timestamps, RLS, trigger, indexes)
- [ ] RLS policies use shared school model, not per-user isolation
- [ ] No sensitive data logged in edge functions

### 13.6 Documentation
- [ ] All new hooks have JSDoc comments
- [ ] All new utility functions have JSDoc comments
- [ ] All new interfaces/types have JSDoc comments
- [ ] Inline comments explain WHY, not WHAT

### 13.7 Security
- [ ] New edge functions have `verify_jwt = true`
- [ ] All user input is validated before use
- [ ] No secrets or keys in frontend code
- [ ] No `.env` changes committed (`.env.local` only)

---

## ARTICLE 14 — FORBIDDEN PATTERNS

The following patterns are **absolutely forbidden** and must never appear in code:

```typescript
// ❌ 1. Type assertion to any
const data = response as any;

// ❌ 2. Non-null assertion without certainty
const user = getUser()!;

// ❌ 3. Direct DOM manipulation
document.getElementById('modal').style.display = 'block';

// ❌ 4. Fetching data inside component body (non-hook, non-effect)
export default function MyPage() {
  const data = await supabase.from('visitors').select(); // NEVER
}

// ❌ 5. Mutating props
function MyComponent({ items }: { items: Visitor[] }) {
  items.push(newItem); // NEVER — props are read-only
}

// ❌ 6. Boolean JSX traps with numbers
{visitors.length && <Table />}   // renders "0" when empty!
// ✅ Use:
{visitors.length > 0 && <Table />}

// ❌ 7. useEffect for derived state
useEffect(() => {
  setFiltered(visitors.filter(...));
}, [visitors]);
// ✅ Use: const filtered = visitors.filter(...)

// ❌ 8. Hardcoded user-visible strings
return <p>Visitor not found</p>
// ✅ Use: return <p>{t('visitorNotFound')}</p>

// ❌ 9. Retroactively editing migration files
// Just... don't. Create a new one.

// ❌ 10. Creating Supabase client outside singleton
import { createClient } from '@supabase/supabase-js';
const mySupabase = createClient(url, key);
```

---

## ARTICLE 15 — ACA OPERATING PROCEDURE

### 15.1 Before Starting Any Task
ACA must:
1. Read the relevant section of this Constitution
2. Identify which files will be affected
3. State the plan in 3-5 bullet points before writing code
4. Ask for clarification if ANY requirement is ambiguous

### 15.2 When Implementing
ACA must:
1. Work on **one file at a time**
2. Show the complete modified file (not just a diff) for files under 200 lines
3. Show a precise diff with context for files over 200 lines
4. Add all three language translations when adding any new UI string
5. Create a migration file for any database change
6. Run the Code Review Checklist (Article 13) before declaring done

### 15.3 When Finished
ACA must explicitly state:
- ✅ What was done
- ✅ Code Review Checklist: all items checked
- ✅ What to test manually (specific steps)
- ✅ What the next logical step is

### 15.4 When in Doubt
If ACA is uncertain about any of the following, it must **stop and ask** before proceeding:
- Business logic (pricing, enrollment rules, contract terms)
- Database schema changes
- Changes that affect security (RLS, auth, edge functions)
- Changes to `src/lib/translations.ts` (new keys that change meaning)
- Any change that touches more than 3 files simultaneously

### 15.5 ACA Must Never
- Refactor code that is not part of the current task
- Change naming conventions of existing code while fixing unrelated things
- Add libraries to `package.json` without explicit approval
- Delete files without explicit approval
- Modify `.env` file
- Modify any existing migration file
- Skip the Code Review Checklist

---

## ARTICLE 16 — ENVIRONMENT & SECRETS

### 16.1 Environment Files
```
.env             — committed, contains only public/anon keys (Supabase anon key is safe to commit)
.env.local       — NEVER committed, contains any local overrides
.env.production  — NEVER committed, managed via deployment platform
```

### 16.2 Required Environment Variables
```bash
# Frontend (Vite) — .env
VITE_SUPABASE_URL=https://rdymuwbotklotlxqiwyc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...   # anon key, safe to expose

# Edge Functions — Supabase Secrets (never in any file)
RESEND_API_KEY=re_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...       # auto-injected by Supabase
SUPABASE_URL=...                       # auto-injected by Supabase
```

### 16.3 Secrets That Must NEVER Appear in Code
- `RESEND_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- Any API key of any external service
- Any password or private key

---

## APPENDIX A — PROJECT DIRECTORY STRUCTURE (TARGET STATE)

```
src/
├── api/                         ← NEW: all Supabase query functions
│   ├── visitors.ts
│   ├── contracts.ts
│   ├── campaigns.ts
│   ├── leads.ts
│   ├── pricing.ts
│   └── emailTemplates.ts
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── visitors/                ← expand with more sub-components
│   ├── contracts/               ← NEW: extracted from Contracts.tsx
│   ├── settings/
│   └── ui/
├── hooks/
│   ├── useAuth.tsx
│   ├── useLanguage.tsx
│   ├── useTheme.tsx
│   ├── useUserRole.tsx
│   ├── usePricing.ts
│   ├── useVisitors.ts           ← NEW: TanStack Query wrapper
│   ├── useContracts.ts          ← NEW
│   ├── useLeads.ts              ← NEW
│   ├── useCampaigns.ts          ← NEW
│   └── use-mobile.tsx
├── lib/
│   ├── translations.ts
│   ├── contractTemplates.ts
│   ├── contractExport.ts
│   ├── numberToText.ts
│   ├── countries.ts
│   └── utils.ts
├── pages/                       ← slimmed down (logic moved to hooks/api)
├── types/
└── utils/
```

---

## APPENDIX B — QUICK REFERENCE CARD

```
MUST USE         → TanStack Query for all server state
MUST USE         → useLanguage().t() for all user-facing strings
MUST USE         → shadcn/ui components before creating new ones
MUST USE         → Tailwind classes, never inline styles
MUST CREATE      → New migration file for every DB change
MUST CHECK       → All 3 languages when adding translation keys
MUST FOLLOW      → Code Review Checklist before every "done"

NEVER USE        → any TypeScript type
NEVER USE        → direct Supabase calls in JSX
NEVER USE        → inline styles
NEVER USE        → hardcoded user-visible strings
NEVER EDIT       → existing migration files
NEVER COMMIT     → .env.local or any file with secret keys
NEVER ADD        → new npm packages without approval
```

---

*IDSS Enrollment CRM Constitution v1.0.0 — 2026-03-26*  
*Senior Architect authority. All contributors bound by this document.*

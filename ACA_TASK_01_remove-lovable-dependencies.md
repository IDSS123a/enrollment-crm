# ACA TASK — Phase 1, Task 1
## Remove Lovable.dev Dependencies & Migrate Google OAuth to Native Supabase

**Issued by:** Senior Architect  
**Date:** 2026-03-26  
**Branch:** `chore/remove-lovable-dependencies`  
**Constitution reference:** Articles 1, 3, 5, 12, 13, 15  
**Estimated effort:** ~30 minutes

---

## CONTEXT

This project was built in Lovable.dev. We are migrating to VS Code.
Lovable injected two proprietary dependencies that must be removed:

1. `@lovable.dev/cloud-auth-js` — wraps Supabase OAuth in a Lovable-specific way
2. `lovable-tagger` — a Vite plugin for Lovable's visual editor (dev only)

These must be replaced with native Supabase SDK calls.
No behavior should change for the end user.

---

## SCOPE — EXACTLY THESE FILES

You will touch **exactly 4 files** and **delete 1 directory**. Nothing else.

| Action | Path |
|---|---|
| MODIFY | `package.json` |
| MODIFY | `vite.config.ts` |
| MODIFY | `src/pages/Auth.tsx` |
| DELETE | `src/integrations/lovable/` (entire directory) |
| RUN | `npm install` (to update lockfile) |

**Do NOT touch any other file.**  
**Do NOT refactor anything beyond what is listed above.**  
**Do NOT "improve" Auth.tsx UI while you are in there.**

---

## STEP-BY-STEP INSTRUCTIONS

### STEP 1 — Create the branch

```bash
git checkout -b chore/remove-lovable-dependencies
```

---

### STEP 2 — Remove packages from `package.json`

**File:** `package.json`

Remove from `dependencies`:
```json
"@lovable.dev/cloud-auth-js": "^0.0.2"
```

Remove from `devDependencies`:
```json
"lovable-tagger": "^1.1.13"
```

Nothing else changes in this file.

---

### STEP 3 — Clean up `vite.config.ts`

**Current file:**
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
```

**Replace with exactly this:**
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

Changes made:
- Removed `componentTagger` import
- Simplified `defineConfig` (no longer needs `mode` parameter since `componentTagger` was the only thing using it)
- Cleaned up `plugins` array

---

### STEP 4 — Replace Google OAuth in `src/pages/Auth.tsx`

**Find this import at the top of the file (line 10):**
```typescript
import { lovable } from '@/integrations/lovable/index';
```
**Delete it. Replace with nothing.** (The `supabase` client is already available through `useAuth` hook — you will not need to import it directly in this file.)

**Find this handler:**
```typescript
const handleGoogleSignIn = async () => {
  setGoogleLoading(true);
  try {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in with Google',
        variant: 'destructive',
      });
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'An unexpected error occurred',
      variant: 'destructive',
    });
  } finally {
    setGoogleLoading(false);
  }
};
```

**Replace with:**
```typescript
const handleGoogleSignIn = async () => {
  setGoogleLoading(true);
  try {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign in with Google',
        variant: 'destructive',
      });
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'An unexpected error occurred',
      variant: 'destructive',
    });
  } finally {
    setGoogleLoading(false);
  }
};
```

**Note:** `signInWithGoogle` comes from `useAuth()` — you will add it in Step 5.
Update the destructure on this line:
```typescript
// Before
const { signIn, signUp } = useAuth();

// After
const { signIn, signUp, signInWithGoogle } = useAuth();
```

---

### STEP 5 — Add `signInWithGoogle` to `src/hooks/useAuth.tsx`

**File:** `src/hooks/useAuth.tsx`

**Add to the `AuthContextType` interface:**
```typescript
signInWithGoogle: () => Promise<{ error: Error | null }>;
```

**Add the implementation inside `AuthProvider` (after `signUp` function):**
```typescript
/**
 * Initiates Google OAuth sign-in via Supabase.
 * Redirects the user to Google and then back to the app root.
 * Supabase handles the session automatically on return.
 *
 * @returns Object with error if the OAuth initiation failed
 */
const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  });
  return { error: error as Error | null };
};
```

**Add `signInWithGoogle` to the context value object:**
```typescript
// Find the return statement with AuthContext.Provider value prop
// Add signInWithGoogle to the value object alongside signIn, signUp, signOut, updateProfile
return (
  <AuthContext.Provider value={{
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,   // ← add this line
    signOut,
    updateProfile,
  }}>
    {children}
  </AuthContext.Provider>
);
```

---

### STEP 6 — Delete the Lovable integration directory

```bash
rm -rf src/integrations/lovable/
```

Verify it is gone:
```bash
ls src/integrations/
# Expected output: supabase/
```

---

### STEP 7 — Install dependencies

```bash
npm install
```

This removes the uninstalled packages from `node_modules` and updates `package-lock.json`.

---

### STEP 8 — Verify the build

```bash
npm run build
```

Expected: build completes with **zero errors**.  
Warnings about unused variables are acceptable (existing codebase issue).  
**Any TypeScript error = DO NOT PROCEED. Fix it first.**

---

### STEP 9 — Run dev server and smoke test

```bash
npm run dev
```

Manual test checklist:
- [ ] App loads at `localhost:8080`
- [ ] `/auth` page renders without console errors
- [ ] Email login works (use existing `direktor@idss.ba` account)
- [ ] Google Sign-In button is visible and clickable
- [ ] Google OAuth redirect initiates (browser goes to Google login page)
- [ ] After Google login, app redirects back to `/dashboard`
- [ ] No `lovable` references remain in browser console or network tab

---

### STEP 10 — Code Review Checklist (self-verify before commit)

Run through Article 13 of the Constitution for the files you touched:

- [ ] No `any` types introduced
- [ ] No unused imports remaining
- [ ] No `console.log` left in code
- [ ] `signInWithGoogle` has JSDoc comment ✓ (provided above)
- [ ] No hardcoded user-facing strings introduced
- [ ] No inline styles introduced
- [ ] `src/integrations/lovable/` directory is fully deleted
- [ ] `npm run build` passes with zero errors
- [ ] `package.json` has neither `@lovable.dev/cloud-auth-js` nor `lovable-tagger`
- [ ] `vite.config.ts` has no reference to `lovable-tagger` or `componentTagger`

---

### STEP 11 — Commit

```bash
git add -A
git commit -m "chore: remove lovable-tagger and cloud-auth-js dependencies

- Remove @lovable.dev/cloud-auth-js from dependencies
- Remove lovable-tagger from devDependencies
- Delete src/integrations/lovable/ directory
- Add native signInWithGoogle() to useAuth hook via supabase.auth.signInWithOAuth
- Simplify vite.config.ts (no more componentTagger plugin)

No behavior change for end users. Google OAuth continues to work
via native Supabase SDK."
```

---

## WHAT ACA MUST REPORT WHEN DONE

```
✅ DONE: chore/remove-lovable-dependencies

Files modified:
  - package.json (removed 2 packages)
  - vite.config.ts (removed componentTagger)
  - src/hooks/useAuth.tsx (added signInWithGoogle)
  - src/pages/Auth.tsx (replaced lovable.auth call)

Files deleted:
  - src/integrations/lovable/ (entire directory)

Code Review Checklist: ALL 10 items checked ✓
Build: npm run build — PASS, zero errors
Manual test: [describe what you tested]

Next step: Ready for Phase 1, Task 2 — RLS Migration (shared school model)
```

---

## IMPORTANT NOTES FOR SENIOR ARCHITECT REVIEW

After this task is complete, verify the following before merging:

1. **Google OAuth Redirect URI** must be configured in Supabase Dashboard:
   - Go to: Supabase Dashboard → Authentication → URL Configuration
   - Add `http://localhost:8080/` to "Redirect URLs" (for local dev)
   - Add production URL when deploying

2. **Google OAuth Provider** must be enabled in Supabase Dashboard:
   - Go to: Authentication → Providers → Google
   - Ensure Client ID and Client Secret are configured
   - These come from Google Cloud Console OAuth credentials

3. The `@lovable.dev/cloud-auth-js` package was handling OAuth token exchange
   through Lovable's servers. The native Supabase approach redirects directly
   to Supabase's OAuth endpoint — this is more direct and removes the
   third-party dependency from the auth critical path.

# ACA TASK — Phase 2, Task 2.2
## TanStack Query Hooks for Leads and Campaigns

**Issued by:** Senior Architect  
**Date:** 2026-03-28  
**Branch:** `refactor/api-layer` (continue on same branch)  
**Constitution reference:** Articles 6, 5, 11, 13, 15

---

## CONTEXT

API layer is created (Task 2.1). Now we wire it to TanStack Query.
This task creates query hooks AND migrates Leads.tsx and Campaigns.tsx to use them.

Pattern: Page components will no longer have useEffect + useState for data.
Instead they use useQuery/useMutation hooks which handle loading, error, caching automatically.

---

## SCOPE

| Action | File |
|---|---|
| CREATE | `src/hooks/useLeads.ts` |
| CREATE | `src/hooks/useCampaigns.ts` |
| MODIFY | `src/pages/Leads.tsx` |
| MODIFY | `src/pages/Campaigns.tsx` |

---

## STEP 1 — Create `src/hooks/useLeads.ts`

**Complete file content:**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
  type CreateLeadData,
  type UpdateLeadData,
} from '@/api/leads';
import { logActivity } from '@/api/activities';

/** Stable query key for all leads queries */
export const LEADS_QUERY_KEY = ['leads'] as const;

/**
 * Fetches all leads for the school using TanStack Query.
 * Data is cached for 2 minutes and automatically refetched on window focus.
 *
 * @returns TanStack Query result with leads array, loading, and error state
 */
export function useLeads() {
  return useQuery({
    queryKey: LEADS_QUERY_KEY,
    queryFn: fetchLeads,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Mutation hook for creating a new lead.
 * Automatically invalidates the leads cache on success and logs activity.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useCreateLead() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateLeadData) => createLead(data, user!.id),
    onSuccess: async (newLead) => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      await logActivity(
        { title: `New lead added: ${newLead.name}`, type: 'lead', icon: 'user-plus', related_id: newLead.id },
        user!.id
      );
      toast({ title: t('saveSuccess') });
    },
    onError: (error: Error) => {
      toast({ title: t('saveError'), description: error.message, variant: 'destructive' });
    },
  });
}

/**
 * Mutation hook for updating an existing lead.
 * Automatically invalidates the leads cache on success.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useUpdateLead() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateLeadData) => updateLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      toast({ title: t('saveSuccess') });
    },
    onError: (error: Error) => {
      toast({ title: t('saveError'), description: error.message, variant: 'destructive' });
    },
  });
}

/**
 * Mutation hook for deleting a lead.
 * Automatically invalidates the leads cache on success.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useDeleteLead() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADS_QUERY_KEY });
      toast({ title: t('deleteSuccess') });
    },
    onError: (error: Error) => {
      toast({ title: t('deleteError'), description: error.message, variant: 'destructive' });
    },
  });
}
```

Report: `✅ FILE CREATED: src/hooks/useLeads.ts`

---

## STEP 2 — Create `src/hooks/useCampaigns.ts`

**Complete file content:**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import {
  fetchCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  toggleCampaignStatus,
  type CreateCampaignData,
  type UpdateCampaignData,
} from '@/api/campaigns';
import { logActivity } from '@/api/activities';
import type { CampaignStatus } from '@/types/database';

/** Stable query key for all campaigns queries */
export const CAMPAIGNS_QUERY_KEY = ['campaigns'] as const;

/**
 * Fetches all campaigns for the school using TanStack Query.
 * Data is cached for 2 minutes and automatically refetched on window focus.
 *
 * @returns TanStack Query result with campaigns array, loading, and error state
 */
export function useCampaigns() {
  return useQuery({
    queryKey: CAMPAIGNS_QUERY_KEY,
    queryFn: fetchCampaigns,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Mutation hook for creating a new campaign.
 * Automatically invalidates the campaigns cache on success and logs activity.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateCampaignData) => createCampaign(data, user!.id),
    onSuccess: async (newCampaign) => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      await logActivity(
        { title: `New campaign created: ${newCampaign.name}`, type: 'campaign', icon: 'megaphone', related_id: newCampaign.id },
        user!.id
      );
      toast({ title: t('saveSuccess') });
    },
    onError: (error: Error) => {
      toast({ title: t('saveError'), description: error.message, variant: 'destructive' });
    },
  });
}

/**
 * Mutation hook for updating an existing campaign.
 * Automatically invalidates the campaigns cache on success.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateCampaignData) => updateCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      toast({ title: t('saveSuccess') });
    },
    onError: (error: Error) => {
      toast({ title: t('saveError'), description: error.message, variant: 'destructive' });
    },
  });
}

/**
 * Mutation hook for deleting a campaign.
 * Automatically invalidates the campaigns cache on success.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
      toast({ title: t('deleteSuccess') });
    },
    onError: (error: Error) => {
      toast({ title: t('deleteError'), description: error.message, variant: 'destructive' });
    },
  });
}

/**
 * Mutation hook for toggling campaign status between active and paused.
 * Automatically invalidates the campaigns cache on success.
 *
 * @returns TanStack mutation with mutateAsync function
 */
export function useToggleCampaignStatus() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: CampaignStatus }) =>
      toggleCampaignStatus(id, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast({ title: t('saveError'), description: error.message, variant: 'destructive' });
    },
  });
}
```

Report: `✅ FILE CREATED: src/hooks/useCampaigns.ts`

---

## STEP 3 — Replace entire content of `src/pages/Leads.tsx`

Find the current file and replace its entire content with:

```typescript
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { useLeads, useCreateLead, useUpdateLead, useDeleteLead } from '@/hooks/useLeads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Edit, Trash2, Loader2 } from 'lucide-react';
import { TablePagination, paginateArray } from '@/components/TablePagination';
import type { Lead, LeadStatus } from '@/types/database';

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-info/10 text-info border-info/20',
  contacted: 'bg-warning/10 text-warning border-warning/20',
  qualified: 'bg-primary/10 text-primary border-primary/20',
  converted: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

const LEAD_SOURCES = ['Direct', 'Website', 'Social Media', 'Referral', 'Email Campaign', 'Other'];

interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: string;
  notes: string;
}

const INITIAL_FORM: LeadFormData = {
  name: '',
  email: '',
  phone: '',
  status: 'new',
  source: 'Direct',
  notes: '',
};

export default function Leads() {
  const { t } = useLanguage();

  // Data hooks
  const { data: leads = [], isLoading } = useLeads();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<LeadFormData>(INITIAL_FORM);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Derived: filtered leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedLeads = paginateArray(filteredLeads, currentPage, pageSize);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLead) {
      await updateLead.mutateAsync({ id: editingLead.id, ...formData });
    } else {
      await createLead.mutateAsync(formData);
    }
    handleCloseModal();
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || '',
      status: lead.status,
      source: lead.source,
      notes: lead.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteLead.mutateAsync(id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
    setFormData(INITIAL_FORM);
  };

  const isSaving = createLead.isPending || updateLead.isPending;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('leads')}</h1>
          </div>
          <Dialog open={isModalOpen} onOpenChange={(open) => { if (!open) handleCloseModal(); else setIsModalOpen(true); }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white">
                <Plus className="mr-2 h-4 w-4" />
                {t('addLead')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingLead ? t('edit') : t('addLead')}</DialogTitle>
                <DialogDescription>{t('leads')}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('leadName')}</Label>
                    <Input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('leadEmail')}</Label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('leadPhone')}</Label>
                    <Input value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('leadSource')}</Label>
                    <Select value={formData.source} onValueChange={(v) => setFormData(p => ({ ...p, source: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {LEAD_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('leadStatus')}</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData(p => ({ ...p, status: v as LeadStatus }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">{t('newLead')}</SelectItem>
                      <SelectItem value="contacted">{t('contacted')}</SelectItem>
                      <SelectItem value="qualified">{t('qualified')}</SelectItem>
                      <SelectItem value="converted">{t('converted')}</SelectItem>
                      <SelectItem value="rejected">{t('rejected')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('leadNotes')}</Label>
                  <Textarea value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} rows={3} />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={handleCloseModal}>{t('cancel')}</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('save')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder={t('filter')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allStatuses')}</SelectItem>
              <SelectItem value="new">{t('newLead')}</SelectItem>
              <SelectItem value="contacted">{t('contacted')}</SelectItem>
              <SelectItem value="qualified">{t('qualified')}</SelectItem>
              <SelectItem value="converted">{t('converted')}</SelectItem>
              <SelectItem value="rejected">{t('rejected')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">{t('noData')}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('leadName')}</TableHead>
                  <TableHead>{t('leadEmail')}</TableHead>
                  <TableHead>{t('leadStatus')}</TableHead>
                  <TableHead>{t('leadSource')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLORS[lead.status]} variant="outline">
                        {t(lead.status === 'new' ? 'newLead' : lead.status as keyof typeof t)}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(lead)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
                              <AlertDialogDescription>{lead.name}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(lead.id)} className="bg-destructive text-destructive-foreground">
                                {t('delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {filteredLeads.length > pageSize && (
          <TablePagination
            currentPage={currentPage}
            totalItems={filteredLeads.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </AppLayout>
  );
}
```

Report: `✅ FILE EDITED: src/pages/Leads.tsx — migrated to TanStack Query, removed useEffect/useState for data`

---

## STEP 4 — Build check

User runs:
```cmd
npm run build
```

If there are TypeScript errors, fix them before proceeding.
Expected: zero errors.

---

## STEP 5 — Commit

User runs:
```cmd
git add src/hooks/useLeads.ts src/hooks/useCampaigns.ts src/pages/Leads.tsx
git commit -m "refactor(leads): migrate to TanStack Query via useLeads hook

- Created useLeads, useCreateLead, useUpdateLead, useDeleteLead hooks
- Created useCampaigns, useCreateCampaign, useUpdateCampaign, useDeleteCampaign, useToggleCampaignStatus hooks
- Leads.tsx now uses hooks — no more useEffect/useState for data fetching
- Automatic cache invalidation on mutations
- Removed hardcoded English strings"
```

---

## FINAL REPORT FORMAT

```
✅ DONE: refactor/api-layer (Task 2.2)

Files created:
  ✅ src/hooks/useLeads.ts — 4 query/mutation hooks with JSDoc
  ✅ src/hooks/useCampaigns.ts — 5 query/mutation hooks with JSDoc

Files edited:
  ✅ src/pages/Leads.tsx — migrated to TanStack Query

Build: npm run build — PASS, zero errors
Committed: refactor(leads): migrate to TanStack Query

Ready for: Phase 2, Task 2.3 — Visitors.tsx decomposition
```

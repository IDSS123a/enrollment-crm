import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TablePagination, paginateArray } from '@/components/TablePagination';
import { MaterialCard } from '@/components/dashboard/MaterialCard';
import { useLanguage } from '@/hooks/useLanguage';
import {
  useCampaigns,
  useCreateCampaign,
  useUpdateCampaign,
  useDeleteCampaign,
  useToggleCampaignStatus,
} from '@/hooks/useCampaigns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, DollarSign, Users, Target, Calendar, Loader2, Edit, Trash2, Play, Pause } from 'lucide-react';
import { format } from 'date-fns';
import type { Campaign, CampaignStatus } from '@/types/database';

const STATUS_COLORS: Record<CampaignStatus, string> = {
  active: 'bg-success/10 text-success border-success/20',
  paused: 'bg-warning/10 text-warning border-warning/20',
  completed: 'bg-primary/10 text-primary border-primary/20',
  draft: 'bg-muted text-muted-foreground border-muted',
};

interface CampaignFormData {
  name: string;
  description: string;
  status: CampaignStatus;
  budget: string;
  start_date: string;
  end_date: string;
  channels: string[];
}

const INITIAL_FORM: CampaignFormData = {
  name: '',
  description: '',
  status: 'draft',
  budget: '',
  start_date: '',
  end_date: '',
  channels: [],
};

export default function Campaigns() {
  const { t } = useLanguage();

  const { data: campaigns = [], isLoading } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const toggleStatus = useToggleCampaignStatus();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<CampaignFormData>(INITIAL_FORM);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const campaignData = {
      ...formData,
      budget: parseFloat(formData.budget) || 0,
      spent: 0,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
    };

    if (editingCampaign) {
      await updateCampaign.mutateAsync({ id: editingCampaign.id, ...campaignData });
    } else {
      await createCampaign.mutateAsync(campaignData);
    }
    handleCloseModal();
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || '',
      status: campaign.status,
      budget: campaign.budget.toString(),
      start_date: campaign.start_date || '',
      end_date: campaign.end_date || '',
      channels: campaign.channels,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteCampaign.mutateAsync(id);
  };

  const handleToggleStatus = async (campaign: Campaign) => {
    await toggleStatus.mutateAsync({ id: campaign.id, currentStatus: campaign.status });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
    setFormData(INITIAL_FORM);
  };

  const isSaving = createCampaign.isPending || updateCampaign.isPending;

  const getStatusLabel = (status: CampaignStatus): string => {
    switch (status) {
      case 'active': return t('active');
      case 'paused': return t('paused');
      case 'completed': return t('completed');
      case 'draft': return t('draft');
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('campaigns')}</h1>
            <p className="text-muted-foreground">{t('campaignsDescription')}</p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={(open) => { if (!open) handleCloseModal(); else setIsModalOpen(true); }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                {t('addCampaign')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingCampaign ? t('edit') : t('addCampaign')}</DialogTitle>
                <DialogDescription className="sr-only">Campaign form</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">{t('campaignName')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">{t('campaignDescription')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">{t('campaignBudget')}</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData(p => ({ ...p, budget: e.target.value }))}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">{t('campaignStatus')}</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: CampaignStatus) => setFormData(p => ({ ...p, status: value }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">{t('draft')}</SelectItem>
                        <SelectItem value="active">{t('active')}</SelectItem>
                        <SelectItem value="paused">{t('paused')}</SelectItem>
                        <SelectItem value="completed">{t('completed')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="start_date">{t('startDate')}</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(p => ({ ...p, start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">{t('endDate')}</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(p => ({ ...p, end_date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 gradient-primary" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('save')}
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={handleCloseModal}>
                    {t('cancel')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {campaigns.length === 0 ? (
          <MaterialCard>
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('noData')}</p>
            </div>
          </MaterialCard>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginateArray(campaigns, currentPage, pageSize).map((campaign) => {
                const progress = campaign.budget > 0
                  ? (Number(campaign.spent) / Number(campaign.budget)) * 100
                  : 0;

                return (
                  <MaterialCard key={campaign.id} className="flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground line-clamp-1">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {campaign.description || t('noDescription')}
                        </p>
                      </div>
                      <Badge variant="outline" className={STATUS_COLORS[campaign.status]}>
                        {getStatusLabel(campaign.status)}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{t('budgetUsed')}</span>
                        <span className="font-medium">
                          ${Number(campaign.spent).toLocaleString()} / ${Number(campaign.budget).toLocaleString()}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                          <Users className="h-3 w-3" />
                          <span className="text-xs">{t('leads')}</span>
                        </div>
                        <p className="font-semibold">{campaign.leads_count}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                          <Target className="h-3 w-3" />
                          <span className="text-xs">{t('converted')}</span>
                        </div>
                        <p className="font-semibold">{campaign.conversions}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="text-xs">{t('revenue')}</span>
                        </div>
                        <p className="font-semibold">${Number(campaign.revenue).toLocaleString()}</p>
                      </div>
                    </div>

                    {(campaign.start_date || campaign.end_date) && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground py-3 border-t border-border">
                        <Calendar className="h-4 w-4" />
                        {campaign.start_date && format(new Date(campaign.start_date), 'MMM d')}
                        {campaign.start_date && campaign.end_date && ' - '}
                        {campaign.end_date && format(new Date(campaign.end_date), 'MMM d, yyyy')}
                      </div>
                    )}

                    <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                      {campaign.status !== 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleToggleStatus(campaign)}
                          disabled={toggleStatus.isPending}
                        >
                          {campaign.status === 'active' ? (
                            <><Pause className="h-4 w-4 mr-1" />{t('pause')}</>
                          ) : (
                            <><Play className="h-4 w-4 mr-1" />{t('start')}</>
                          )}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(campaign)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
                            <AlertDialogDescription>{campaign.name}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(campaign.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              {t('delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </MaterialCard>
                );
              })}
            </div>
            <TablePagination
              currentPage={currentPage}
              totalItems={campaigns.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              t={t}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}

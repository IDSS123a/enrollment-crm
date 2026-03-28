import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TablePagination, paginateArray } from '@/components/TablePagination';
import { MaterialCard } from '@/components/dashboard/MaterialCard';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { Campaign, CampaignStatus } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, DollarSign, Users, Target, Calendar, Loader2, Edit, Trash2, Play, Pause } from 'lucide-react';
import { format } from 'date-fns';

const statusColors: Record<CampaignStatus, string> = {
  active: 'bg-success/10 text-success border-success/20',
  paused: 'bg-warning/10 text-warning border-warning/20',
  completed: 'bg-primary/10 text-primary border-primary/20',
  draft: 'bg-muted text-muted-foreground border-muted',
};

export default function Campaigns() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft' as CampaignStatus,
    budget: '',
    start_date: '',
    end_date: '',
    channels: [] as string[],
  });

  useEffect(() => {
    if (user) {
      loadCampaigns();
    }
  }, [user]);

  const loadCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns((data || []) as Campaign[]);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const campaignData = {
        ...formData,
        budget: parseFloat(formData.budget) || 0,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      if (editingCampaign) {
        const { error } = await supabase
          .from('campaigns')
          .update(campaignData)
          .eq('id', editingCampaign.id);

        if (error) throw error;
        toast({ title: 'Success', description: t('saveSuccess') });
      } else {
        const { error } = await supabase
          .from('campaigns')
          .insert([{ ...campaignData, user_id: user?.id }]);

        if (error) throw error;

        await supabase.from('activities').insert([{
          user_id: user?.id,
          title: `New campaign created: ${formData.name}`,
          type: 'campaign',
          icon: 'megaphone',
        }]);
        
        toast({ title: 'Success', description: t('saveSuccess') });
      }

      setIsModalOpen(false);
      resetForm();
      loadCampaigns();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || t('saveError'),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const { error } = await supabase.from('campaigns').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: 'Success', description: t('deleteSuccess') });
      loadCampaigns();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || t('deleteError'),
        variant: 'destructive',
      });
    }
  };

  const toggleStatus = async (campaign: Campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', campaign.id);

      if (error) throw error;
      loadCampaigns();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
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

  const resetForm = () => {
    setEditingCampaign(null);
    setFormData({
      name: '',
      description: '',
      status: 'draft',
      budget: '',
      start_date: '',
      end_date: '',
      channels: [],
    });
  };

  if (loading) {
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('campaigns')}</h1>
            <p className="text-muted-foreground">Create and manage marketing campaigns</p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                {t('addCampaign')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingCampaign ? t('edit') : t('addCampaign')}
                </DialogTitle>
                <DialogDescription className="sr-only">Campaign form</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">{t('campaignName')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">{t('campaignDescription')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="10000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">{t('campaignStatus')}</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: CampaignStatus) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">{t('endDate')}</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 gradient-primary">
                    {t('save')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsModalOpen(false)}
                  >
                    {t('cancel')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Campaigns Grid */}
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
                const progress = campaign.budget > 0 ? (Number(campaign.spent) / Number(campaign.budget)) * 100 : 0;
                
                return (
                  <MaterialCard key={campaign.id} className="flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground line-clamp-1">{campaign.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {campaign.description || 'No description'}
                        </p>
                      </div>
                      <Badge variant="outline" className={statusColors[campaign.status]}>
                        {t(campaign.status as any)}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Budget Used</span>
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
                          <span className="text-xs">Leads</span>
                        </div>
                        <p className="font-semibold">{campaign.leads_count}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                          <Target className="h-3 w-3" />
                          <span className="text-xs">Conv.</span>
                        </div>
                        <p className="font-semibold">{campaign.conversions}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="text-xs">Revenue</span>
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
                          onClick={() => toggleStatus(campaign)}
                        >
                          {campaign.status === 'active' ? (
                            <>
                              <Pause className="h-4 w-4 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </>
                          )}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(campaign)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(campaign.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
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

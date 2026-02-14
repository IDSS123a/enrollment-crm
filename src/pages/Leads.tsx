import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TablePagination, paginateArray } from '@/components/TablePagination';
import { MaterialCard } from '@/components/dashboard/MaterialCard';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { Lead, LeadStatus } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Loader2, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-info/10 text-info border-info/20',
  contacted: 'bg-warning/10 text-warning border-warning/20',
  qualified: 'bg-primary/10 text-primary border-primary/20',
  converted: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function Leads() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'new' as LeadStatus,
    source: '',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      loadLeads();
    }
  }, [user]);

  const loadLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads((data || []) as Lead[]);
    } catch (error) {
      console.error('Failed to load leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to load leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLead) {
        const { error } = await supabase
          .from('leads')
          .update(formData)
          .eq('id', editingLead.id);

        if (error) throw error;
        
        toast({ title: 'Success', description: t('saveSuccess') });
      } else {
        const { error } = await supabase
          .from('leads')
          .insert([{ ...formData, user_id: user?.id }]);

        if (error) throw error;

        // Log activity
        await supabase.from('activities').insert([{
          user_id: user?.id,
          title: `New lead added: ${formData.name}`,
          type: 'lead',
          icon: 'user-plus',
        }]);
        
        toast({ title: 'Success', description: t('saveSuccess') });
      }

      setIsModalOpen(false);
      resetForm();
      loadLeads();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || t('saveError'),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      const { error } = await supabase.from('leads').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: 'Success', description: t('deleteSuccess') });
      loadLeads();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || t('deleteError'),
        variant: 'destructive',
      });
    }
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

  const resetForm = () => {
    setEditingLead(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'new',
      source: '',
      notes: '',
    });
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <h1 className="text-2xl font-bold text-foreground">{t('leads')}</h1>
            <p className="text-muted-foreground">Manage your leads and prospects</p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                {t('addLead')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingLead ? t('edit') : t('addLead')}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">{t('leadName')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('leadEmail')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('leadPhone')}</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">{t('leadStatus')}</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: LeadStatus) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">{t('newLead')}</SelectItem>
                        <SelectItem value="contacted">{t('contacted')}</SelectItem>
                        <SelectItem value="qualified">{t('qualified')}</SelectItem>
                        <SelectItem value="converted">{t('converted')}</SelectItem>
                        <SelectItem value="rejected">{t('rejected')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="source">{t('leadSource')}</Label>
                    <Input
                      id="source"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      placeholder="Website, Social Media..."
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="notes">{t('leadNotes')}</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
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

        {/* Filters */}
        <MaterialCard hover={false}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`${t('search')} leads...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('filter')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">{t('newLead')}</SelectItem>
                <SelectItem value="contacted">{t('contacted')}</SelectItem>
                <SelectItem value="qualified">{t('qualified')}</SelectItem>
                <SelectItem value="converted">{t('converted')}</SelectItem>
                <SelectItem value="rejected">{t('rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </MaterialCard>

        {/* Leads Table */}
        <MaterialCard hover={false}>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('noData')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('leadName')}</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>{t('leadStatus')}</TableHead>
                    <TableHead>{t('leadSource')}</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginateArray(filteredLeads, currentPage, pageSize).map((lead) => (
                    <TableRow key={lead.id} className="animate-fade-in">
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[lead.status]}>
                          {t(lead.status === 'new' ? 'newLead' : lead.status as any)}
                        </Badge>
                      </TableCell>
                      <TableCell>{lead.source || '-'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(lead.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(lead)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(lead.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                currentPage={currentPage}
                totalItems={filteredLeads.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                t={t}
              />
            </div>
          )}
        </MaterialCard>
      </div>
    </AppLayout>
  );
}

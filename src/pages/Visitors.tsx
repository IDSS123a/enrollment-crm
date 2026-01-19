import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MaterialCard } from '@/components/dashboard/MaterialCard';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { Visitor, VisitorFormData, initialVisitorFormData, VisitorStatus } from '@/types/visitor';
import { usePricing } from '@/hooks/usePricing';
import { ChildInfoSection } from '@/components/visitors/ChildInfoSection';
import { ParentInfoSection } from '@/components/visitors/ParentInfoSection';
import { VisitDetailsSection } from '@/components/visitors/VisitDetailsSection';
import { FinancialSection } from '@/components/visitors/FinancialSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Edit, Trash2, Loader2, Calendar, User, GraduationCap, TrendingUp, Mail, Bell, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { StatCard } from '@/components/dashboard/StatCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const statusColors: Record<VisitorStatus, string> = {
  scheduled: 'bg-info/10 text-info border-info/20',
  visited: 'bg-warning/10 text-warning border-warning/20',
  enrolled: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  pending: 'bg-muted text-muted-foreground border-muted',
};

export default function Visitors() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { calculateFees } = usePricing();
  
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [formData, setFormData] = useState<VisitorFormData>(initialVisitorFormData);
  const [activeTab, setActiveTab] = useState('child');
  
  // Bulk email state
  const [selectedVisitors, setSelectedVisitors] = useState<Set<string>>(new Set());
  const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
  const [bulkEmailSubject, setBulkEmailSubject] = useState('');
  const [bulkEmailMessage, setBulkEmailMessage] = useState('');
  const [sendingBulkEmail, setSendingBulkEmail] = useState(false);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [sendingAfterVisit, setSendingAfterVisit] = useState(false);

  useEffect(() => {
    if (user) {
      loadVisitors();
    }
  }, [user]);

  const loadVisitors = async () => {
    try {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVisitors((data || []) as unknown as Visitor[]);
    } catch (error) {
      console.error('Failed to load visitors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load visitors',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (data: Partial<VisitorFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate fees
    const fees = calculateFees(formData);
    
    const visitorData = {
      ...formData,
      user_id: user?.id,
      registration_fee: fees.registrationFee,
      deposit_amount: fees.depositAmount,
      tuition_fee: fees.baseTuition,
      extended_stay_fee: fees.extendedStayFee,
      total_tuition_after_discounts: fees.tuitionAfterDiscounts,
      total_amount_due: fees.totalAmountDue,
      // Convert empty strings to null
      mother_first_name: formData.mother_first_name || null,
      mother_last_name: formData.mother_last_name || null,
      mother_phone: formData.mother_phone || null,
      mother_email: formData.mother_email || null,
      mother_profession: formData.mother_profession || null,
      father_first_name: formData.father_first_name || null,
      father_last_name: formData.father_last_name || null,
      father_phone: formData.father_phone || null,
      father_email: formData.father_email || null,
      father_profession: formData.father_profession || null,
      guardian_phone: formData.guardian_phone || null,
      guardian_email: formData.guardian_email || null,
      referral_source: formData.referral_source || null,
      visit_date: formData.visit_date || null,
      visit_scheduled_at: formData.visit_scheduled_at || null,
      visit_notes: formData.visit_notes || null,
      enrollment_decision_notes: formData.enrollment_decision_notes || null,
      scholarship_type: formData.scholarship_type || null,
    };

    // Check if status is changing to enrolled (for notifications)
    const isNewEnrollment = formData.status === 'enrolled' && 
      (!editingVisitor || editingVisitor.status !== 'enrolled');
    
    // Check if status is changing to visited (for after visit email)
    const isNewVisit = formData.status === 'visited' && 
      (!editingVisitor || editingVisitor.status !== 'visited');

    try {
      if (editingVisitor) {
        const { error } = await supabase
          .from('visitors')
          .update(visitorData)
          .eq('id', editingVisitor.id);

        if (error) throw error;
        toast({ title: 'Success', description: t('saveSuccess') });
      } else {
        const { error } = await supabase
          .from('visitors')
          .insert([visitorData]);

        if (error) throw error;

        // Log activity
        await supabase.from('activities').insert([{
          user_id: user?.id,
          title: `New visitor: ${formData.child_first_name} ${formData.child_last_name}`,
          type: 'visitor',
          icon: 'user-plus',
        }]);
        
        toast({ title: 'Success', description: t('saveSuccess') });
      }

      // Send enrollment notification email if status changed to enrolled
      if (isNewEnrollment) {
        const parentEmail = formData.mother_email || formData.father_email || formData.guardian_email;
        
        if (parentEmail) {
          try {
            const { error: emailError } = await supabase.functions.invoke('send-enrollment-notification', {
              body: {
                visitorId: editingVisitor?.id || 'new',
                childFirstName: formData.child_first_name,
                childLastName: formData.child_last_name,
                parentEmail: parentEmail,
                targetGrade: formData.target_grade,
                schoolYear: formData.target_school_year,
              },
            });

            if (emailError) {
              console.error('Failed to send enrollment email:', emailError);
              toast({
                title: 'Note',
                description: 'Saved successfully, but enrollment email could not be sent.',
                variant: 'default',
              });
            } else {
              toast({
                title: 'Email Sent',
                description: `Enrollment confirmation sent to ${parentEmail}`,
              });
            }
          } catch (emailErr) {
            console.error('Email notification error:', emailErr);
          }
        }

        // Log enrollment activity
        await supabase.from('activities').insert([{
          user_id: user?.id,
          title: `Enrolled: ${formData.child_first_name} ${formData.child_last_name}`,
          type: 'enrollment',
          icon: 'graduation-cap',
        }]);
      }

      // Send after visit email if status changed to visited
      if (isNewVisit && editingVisitor) {
        try {
          const { error: afterVisitError } = await supabase.functions.invoke('send-after-visit-email', {
            body: {
              visitorIds: [editingVisitor.id],
              userId: user?.id,
            },
          });

          if (afterVisitError) {
            console.error('Failed to send after visit email:', afterVisitError);
          } else {
            toast({
              title: 'Email Sent',
              description: `After visit thank you email sent`,
            });
          }
        } catch (emailErr) {
          console.error('After visit email error:', emailErr);
        }
      }

      setIsModalOpen(false);
      resetForm();
      loadVisitors();
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: error.message || t('saveError'),
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      const { error } = await supabase.from('visitors').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: 'Success', description: t('deleteSuccess') });
      loadVisitors();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || t('deleteError'),
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (visitor: Visitor) => {
    setEditingVisitor(visitor);
    setFormData({
      child_first_name: visitor.child_first_name,
      child_last_name: visitor.child_last_name,
      child_date_of_birth: visitor.child_date_of_birth,
      child_citizenship: visitor.child_citizenship,
      child_address: visitor.child_address,
      mother_first_name: visitor.mother_first_name || '',
      mother_last_name: visitor.mother_last_name || '',
      mother_phone: visitor.mother_phone || '',
      mother_email: visitor.mother_email || '',
      mother_profession: visitor.mother_profession || '',
      father_first_name: visitor.father_first_name || '',
      father_last_name: visitor.father_last_name || '',
      father_phone: visitor.father_phone || '',
      father_email: visitor.father_email || '',
      father_profession: visitor.father_profession || '',
      guardian_phone: visitor.guardian_phone || '',
      guardian_email: visitor.guardian_email || '',
      referral_source: visitor.referral_source || '',
      visit_type: visitor.visit_type,
      visit_date: visitor.visit_date || '',
      visit_scheduled_at: visitor.visit_scheduled_at || '',
      visit_notes: visitor.visit_notes || '',
      status: visitor.status,
      enrollment_decision: visitor.enrollment_decision,
      enrollment_decision_notes: visitor.enrollment_decision_notes || '',
      target_grade: visitor.target_grade,
      target_school_year: visitor.target_school_year || '2025/2026',
      enrollment_semester: visitor.enrollment_semester,
      months_to_pay: visitor.months_to_pay,
      resident_type: visitor.resident_type,
      payment_type: visitor.payment_type,
      sibling_discount_percent: visitor.sibling_discount_percent,
      scholarship_percent: visitor.scholarship_percent,
      scholarship_type: visitor.scholarship_type || '',
      registration_fee_waived: visitor.registration_fee_waived,
      uses_extended_stay: visitor.uses_extended_stay,
    });
    setActiveTab('child');
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingVisitor(null);
    setFormData(initialVisitorFormData);
    setActiveTab('child');
  };

  // Bulk email handlers
  const handleSelectVisitor = (visitorId: string, checked: boolean) => {
    const newSelected = new Set(selectedVisitors);
    if (checked) {
      newSelected.add(visitorId);
    } else {
      newSelected.delete(visitorId);
    }
    setSelectedVisitors(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVisitors(new Set(filteredVisitors.map(v => v.id)));
    } else {
      setSelectedVisitors(new Set());
    }
  };

  const handleSendBulkEmail = async () => {
    if (selectedVisitors.size === 0) {
      toast({ title: 'Error', description: 'Please select at least one visitor', variant: 'destructive' });
      return;
    }

    if (!bulkEmailSubject.trim() || !bulkEmailMessage.trim()) {
      toast({ title: 'Error', description: 'Subject and message are required', variant: 'destructive' });
      return;
    }

    setSendingBulkEmail(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-bulk-email', {
        body: {
          visitorIds: Array.from(selectedVisitors),
          subject: bulkEmailSubject.trim(),
          message: bulkEmailMessage.trim(),
          userId: user?.id,
        },
      });

      if (error) throw error;

      const results = data?.results;
      toast({
        title: 'Bulk Email Sent',
        description: `${results?.sent || 0} sent, ${results?.failed || 0} failed, ${results?.skipped || 0} skipped (no email)`,
      });

      setIsBulkEmailModalOpen(false);
      setBulkEmailSubject('');
      setBulkEmailMessage('');
      setSelectedVisitors(new Set());
    } catch (error: any) {
      console.error('Bulk email error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to send emails', variant: 'destructive' });
    } finally {
      setSendingBulkEmail(false);
    }
  };

  const handleSendReminders = async () => {
    setSendingReminders(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-visit-reminders');

      if (error) throw error;

      const results = data?.results;
      toast({
        title: 'Reminders Sent',
        description: `${results?.sent || 0} reminders sent, ${results?.failed || 0} failed, ${results?.skipped || 0} skipped`,
      });
    } catch (error: any) {
      console.error('Reminder error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to send reminders', variant: 'destructive' });
    } finally {
      setSendingReminders(false);
    }
  };

  const handleSendAfterVisitEmail = async () => {
    if (selectedVisitors.size === 0) {
      toast({ title: 'Error', description: 'Please select at least one visitor', variant: 'destructive' });
      return;
    }

    setSendingAfterVisit(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-after-visit-email', {
        body: {
          visitorIds: Array.from(selectedVisitors),
          userId: user?.id,
        },
      });

      if (error) throw error;

      const results = data?.results;
      toast({
        title: 'After Visit Emails Sent',
        description: `${results?.sent || 0} sent, ${results?.failed || 0} failed, ${results?.skipped || 0} skipped (no email)`,
      });

      setSelectedVisitors(new Set());
    } catch (error: any) {
      console.error('After visit email error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to send emails', variant: 'destructive' });
    } finally {
      setSendingAfterVisit(false);
    }
  };

  const filteredVisitors = visitors.filter((visitor) => {
    const fullName = `${visitor.child_first_name} ${visitor.child_last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || visitor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalVisitors = visitors.length;
  const enrolledCount = visitors.filter(v => v.status === 'enrolled').length;
  const visitedCount = visitors.filter(v => v.status === 'visited' || v.status === 'enrolled').length;
  const conversionRate = visitedCount > 0 ? ((enrolledCount / visitedCount) * 100).toFixed(1) : '0';

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
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('totalVisitors')}
            value={totalVisitors.toString()}
            icon={<User />}
            trend={{ value: `${visitors.filter(v => {
              const date = new Date(v.created_at);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length} this month`, positive: true }}
          />
          <StatCard
            title={t('visitedCount')}
            value={visitedCount.toString()}
            icon={<Calendar />}
          />
          <StatCard
            title={t('enrolledCount')}
            value={enrolledCount.toString()}
            icon={<GraduationCap />}
            trend={{ value: `${enrolledCount} enrolled`, positive: true }}
          />
          <StatCard
            title={t('conversionRateVisit')}
            value={`${conversionRate}%`}
            icon={<TrendingUp />}
          />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('visitors')}</h1>
            <p className="text-muted-foreground">{t('visitorsDescription')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Send Reminders Button */}
            <Button
              variant="outline"
              onClick={handleSendReminders}
              disabled={sendingReminders}
            >
              {sendingReminders ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Bell className="h-4 w-4 mr-2" />
              )}
              Send Reminders
            </Button>

            {/* Bulk Email Button */}
            {selectedVisitors.size > 0 && (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setIsBulkEmailModalOpen(true)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email {selectedVisitors.size} Selected
                </Button>
                
                {/* After Visit Email Button */}
                <Button
                  variant="outline"
                  onClick={handleSendAfterVisitEmail}
                  disabled={sendingAfterVisit}
                >
                  {sendingAfterVisit ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Heart className="h-4 w-4 mr-2" />
                  )}
                  Send Thank You
                </Button>
              </>
            )}

            {/* Add Visitor Dialog */}
            <Dialog open={isModalOpen} onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addVisitor')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>
                    {editingVisitor ? t('editVisitor') : t('addVisitor')}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="child">{t('child')}</TabsTrigger>
                      <TabsTrigger value="parents">{t('parents')}</TabsTrigger>
                      <TabsTrigger value="visit">{t('visit')}</TabsTrigger>
                      <TabsTrigger value="financial">{t('financial')}</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-[60vh] mt-4 pr-4">
                      <TabsContent value="child" className="mt-0">
                        <ChildInfoSection formData={formData} onChange={handleFormChange} t={t} />
                      </TabsContent>
                      <TabsContent value="parents" className="mt-0">
                        <ParentInfoSection formData={formData} onChange={handleFormChange} t={t} />
                      </TabsContent>
                      <TabsContent value="visit" className="mt-0">
                        <VisitDetailsSection formData={formData} onChange={handleFormChange} t={t} />
                      </TabsContent>
                      <TabsContent value="financial" className="mt-0">
                        <FinancialSection formData={formData} onChange={handleFormChange} t={t} />
                      </TabsContent>
                    </ScrollArea>
                  </Tabs>
                  <div className="flex gap-3 pt-4 border-t mt-4">
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
        </div>

        {/* Bulk Email Modal */}
        <Dialog open={isBulkEmailModalOpen} onOpenChange={setIsBulkEmailModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send Bulk Email
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Sending email to {selectedVisitors.size} selected visitor(s). 
                Use <code className="bg-muted px-1 rounded">{'{child_name}'}</code> to personalize with the child's name.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input
                  id="email-subject"
                  placeholder="Enter email subject..."
                  value={bulkEmailSubject}
                  onChange={(e) => setBulkEmailSubject(e.target.value)}
                  maxLength={200}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-message">Message</Label>
                <Textarea
                  id="email-message"
                  placeholder="Enter your message..."
                  value={bulkEmailMessage}
                  onChange={(e) => setBulkEmailMessage(e.target.value)}
                  rows={6}
                  maxLength={5000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {bulkEmailMessage.length}/5000
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSendBulkEmail}
                  disabled={sendingBulkEmail || !bulkEmailSubject.trim() || !bulkEmailMessage.trim()}
                  className="flex-1 gradient-primary"
                >
                  {sendingBulkEmail ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Emails
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsBulkEmailModalOpen(false)}
                >
                  {t('cancel')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Filters */}
        <MaterialCard hover={false}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`${t('search')} ${t('visitors').toLowerCase()}...`}
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
                <SelectItem value="all">{t('allStatuses')}</SelectItem>
                <SelectItem value="scheduled">{t('scheduled')}</SelectItem>
                <SelectItem value="visited">{t('visited')}</SelectItem>
                <SelectItem value="enrolled">{t('enrolledStatus')}</SelectItem>
                <SelectItem value="rejected">{t('rejected')}</SelectItem>
                <SelectItem value="pending">{t('pending')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </MaterialCard>

        {/* Visitors Table */}
        <MaterialCard hover={false}>
          {filteredVisitors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('noData')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40px]">
                      <Checkbox
                        checked={selectedVisitors.size === filteredVisitors.length && filteredVisitors.length > 0}
                        onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>{t('childName')}</TableHead>
                    <TableHead>{t('targetGrade')}</TableHead>
                    <TableHead>{t('visitDate')}</TableHead>
                    <TableHead>{t('visitorStatus')}</TableHead>
                    <TableHead>{t('totalAmountDue')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitors.map((visitor) => (
                    <TableRow 
                      key={visitor.id} 
                      className={`animate-fade-in ${selectedVisitors.has(visitor.id) ? 'bg-muted/50' : ''}`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedVisitors.has(visitor.id)}
                          onCheckedChange={(checked) => handleSelectVisitor(visitor.id, checked as boolean)}
                          aria-label={`Select ${visitor.child_first_name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {visitor.child_first_name} {visitor.child_last_name}
                      </TableCell>
                      <TableCell>
                        {visitor.target_grade ? `${t('grade')} ${visitor.target_grade}` : '-'}
                      </TableCell>
                      <TableCell>
                        {visitor.visit_date 
                          ? format(new Date(visitor.visit_date), 'MMM d, yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[visitor.status]}>
                          {t(visitor.status === 'enrolled' ? 'enrolledStatus' : visitor.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {(visitor.total_amount_due ?? 0).toLocaleString()} KM
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(visitor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(visitor.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </MaterialCard>
      </div>
    </AppLayout>
  );
}

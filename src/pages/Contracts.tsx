import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  FileText, Search, Download, Send, CheckCircle2, Loader2,
  Plus, Eye, PenLine, FileDown,
} from 'lucide-react';
import { format } from 'date-fns';
import { numberToText, gradeNames, toRomanNumeral, formatDateByLocale, formatCurrencyByLocale, type NumberTextLanguage } from '@/lib/numberToText';
import { generateContractHTML, type ContractTemplateData } from '@/lib/contractTemplates';
import { exportContractPDF, exportContractDOCX } from '@/lib/contractExport';
import type { Visitor } from '@/types/visitor';

interface Contract {
  id: string;
  user_id: string;
  visitor_id: string;
  contract_number: string;
  academic_year: string;
  grade: number;
  language: string;
  contract_data: Record<string, any>;
  pdf_url: string | null;
  docx_url: string | null;
  status: string;
  sent_at: string | null;
  signed_at: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground border-muted',
  generated: 'bg-info/10 text-info border-info/20',
  sent: 'bg-warning/10 text-warning border-warning/20',
  signed: 'bg-success/10 text-success border-success/20',
};

export default function Contracts() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const [contracts, setContracts] = useState<Contract[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [selectedVisitorId, setSelectedVisitorId] = useState<string>('');
  const [contractLanguage, setContractLanguage] = useState<string>(language === 'BS' ? 'BA' : language);
  const [contractDate, setContractDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [firstPaymentDate, setFirstPaymentDate] = useState('2025-09-05');
  const [generating, setGenerating] = useState(false);
  const [previewContract, setPreviewContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [contractsRes, visitorsRes] = await Promise.all([
        supabase.from('contracts').select('*').order('created_at', { ascending: false }),
        supabase.from('visitors').select('*').eq('status', 'enrolled').order('child_last_name'),
      ]);

      if (contractsRes.error) throw contractsRes.error;
      if (visitorsRes.error) throw visitorsRes.error;

      setContracts((contractsRes.data || []) as unknown as Contract[]);
      setVisitors((visitorsRes.data || []) as unknown as Visitor[]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedVisitor = visitors.find(v => v.id === selectedVisitorId);

  const generateContractNumber = () => {
    const year = new Date().getFullYear();
    const seq = (contracts.length + 1).toString().padStart(3, '0');
    return `IDSS-${year}-${seq}`;
  };

  const handleGenerateContract = async () => {
    if (!selectedVisitor || !user) return;

    setGenerating(true);
    try {
      const lang = contractLanguage as NumberTextLanguage;
      const gradeNum = parseInt(selectedVisitor.target_grade || '1');
      const contractNum = generateContractNumber();

      const contractData = {
        grade_number: toRomanNumeral(gradeNum),
        grade_text: gradeNames[lang]?.[gradeNum - 1] || '',
        contract_date: formatDateByLocale(contractDate, lang),
        parent1_full_name: [selectedVisitor.mother_first_name, selectedVisitor.mother_last_name].filter(Boolean).join(' '),
        parent2_full_name: [selectedVisitor.father_first_name, selectedVisitor.father_last_name].filter(Boolean).join(' '),
        child_full_name: `${selectedVisitor.child_first_name} ${selectedVisitor.child_last_name}`,
        child_dob: formatDateByLocale(selectedVisitor.child_date_of_birth, lang),
        address: selectedVisitor.child_address,
        enrollment_fee_amount: (selectedVisitor.registration_fee || 0).toFixed(2),
        enrollment_fee_text: numberToText(selectedVisitor.registration_fee || 0, lang),
        deposit_amount: (selectedVisitor.deposit_amount || 0).toFixed(2),
        deposit_text: numberToText(selectedVisitor.deposit_amount || 0, lang),
        tuition_annual_amount: (selectedVisitor.tuition_fee || 0).toFixed(2),
        tuition_annual_text: numberToText(selectedVisitor.tuition_fee || 0, lang),
        total_after_discounts_amount: (selectedVisitor.total_tuition_after_discounts || 0).toFixed(2),
        total_after_discounts_text: numberToText(selectedVisitor.total_tuition_after_discounts || 0, lang),
        total_amount_due: (selectedVisitor.total_amount_due || 0).toFixed(2),
        total_amount_due_text: numberToText(selectedVisitor.total_amount_due || 0, lang),
        installments_number: String(selectedVisitor.months_to_pay || 10),
        installments_text: numberToText(selectedVisitor.months_to_pay || 10, lang),
        monthly_installment: selectedVisitor.months_to_pay
          ? ((selectedVisitor.total_tuition_after_discounts || 0) / selectedVisitor.months_to_pay).toFixed(2)
          : '0.00',
        first_payment_date: formatDateByLocale(firstPaymentDate, lang),
        extended_stay_amount: (selectedVisitor.extended_stay_fee || 0).toFixed(2),
        extended_stay_text: numberToText(selectedVisitor.extended_stay_fee || 0, lang),
        signature_date: formatDateByLocale(contractDate, lang),
        payment_type: selectedVisitor.payment_type,
        resident_type: selectedVisitor.resident_type,
        scholarship_percent: selectedVisitor.scholarship_percent || 0,
        sibling_discount_percent: selectedVisitor.sibling_discount_percent || 0,
        language: contractLanguage,
      };

      const { error } = await supabase.from('contracts').insert([{
        user_id: user.id,
        visitor_id: selectedVisitor.id,
        contract_number: contractNum,
        academic_year: selectedVisitor.target_school_year || '2025/2026',
        grade: gradeNum,
        language: contractLanguage.toLowerCase(),
        contract_data: contractData,
        status: 'generated',
      }]);

      if (error) throw error;

      // Log activity
      await supabase.from('activities').insert([{
        user_id: user.id,
        title: `Contract generated: ${contractNum} for ${selectedVisitor.child_first_name} ${selectedVisitor.child_last_name}`,
        type: 'contract',
        icon: 'file-text',
      }]);

      toast({ title: t('contractGenerateSuccess'), description: contractNum });
      setIsWizardOpen(false);
      resetWizard();
      loadData();
    } catch (error: any) {
      console.error('Contract generation error:', error);
      toast({ title: t('saveError'), description: error.message, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkSigned = async (contract: Contract) => {
    try {
      const { error } = await supabase.from('contracts')
        .update({ status: 'signed', signed_at: new Date().toISOString() })
        .eq('id', contract.id);
      if (error) throw error;
      toast({ title: t('contractSignedSuccess') });
      loadData();
    } catch (error: any) {
      toast({ title: t('saveError'), description: error.message, variant: 'destructive' });
    }
  };

  const handleSendContract = async (contract: Contract) => {
    const visitor = visitors.find(v => v.id === contract.visitor_id);
    const parentEmail = visitor?.mother_email || visitor?.father_email || visitor?.guardian_email;
    
    if (!parentEmail) {
      toast({ title: t('parentInfoMissing'), variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('send-contract-email', {
        body: { contractId: contract.id, recipientEmail: parentEmail, language: contract.language },
      });
      if (error) throw error;
      toast({ title: t('contractSendSuccess'), description: parentEmail });
      loadData();
    } catch (error: any) {
      toast({ title: t('saveError'), description: error.message, variant: 'destructive' });
    }
  };

  const resetWizard = () => {
    setWizardStep(0);
    setSelectedVisitorId('');
    setContractLanguage(language === 'BS' ? 'BA' : language);
    setContractDate(format(new Date(), 'yyyy-MM-dd'));
    setFirstPaymentDate('2025-09-05');
  };

  const buildTemplateData = (contract: Contract): ContractTemplateData => {
    const data = contract.contract_data as Record<string, any>;
    return {
      grade_number: data.grade_number || '',
      grade_text: data.grade_text || '',
      contract_date: data.contract_date || '',
      parent1_full_name: data.parent1_full_name || '',
      parent2_full_name: data.parent2_full_name || '',
      child_full_name: data.child_full_name || '',
      child_dob: data.child_dob || '',
      address: data.address || '',
      enrollment_fee_amount: data.enrollment_fee_amount || '0.00',
      enrollment_fee_text: data.enrollment_fee_text || '',
      deposit_amount: data.deposit_amount || '0.00',
      deposit_text: data.deposit_text || '',
      tuition_annual_amount: data.tuition_annual_amount || '0.00',
      tuition_annual_text: data.tuition_annual_text || '',
      installments_number: data.installments_number || '',
      installments_text: data.installments_text || '',
      first_payment_date: data.first_payment_date || '',
      extended_stay_amount: data.extended_stay_amount || '0.00',
      extended_stay_text: data.extended_stay_text || '',
      signature_date: data.signature_date || '',
      payment_type: data.payment_type || 'full',
      contract_number: contract.contract_number,
      academic_year: contract.academic_year,
      uses_extended_stay: parseFloat(data.extended_stay_amount || '0') > 0,
    };
  };

  const handleDownloadPDF = (contract: Contract) => {
    const tplData = buildTemplateData(contract);
    const html = generateContractHTML(tplData, contract.language);
    const filename = `${contract.contract_number}-${contract.language.toUpperCase()}.pdf`;
    exportContractPDF(html, filename);
  };

  const handleDownloadDOCX = async (contract: Contract) => {
    const tplData = buildTemplateData(contract);
    const filename = `${contract.contract_number}-${contract.language.toUpperCase()}.docx`;
    await exportContractDOCX(tplData, contract.language, filename);
  };

  const filteredContracts = contracts.filter(c => {
    const data = c.contract_data as Record<string, any>;
    const childName = (data?.child_full_name || '').toLowerCase();
    return childName.includes(searchQuery.toLowerCase()) || c.contract_number.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalContracts = contracts.length;
  const signedContracts = contracts.filter(c => c.status === 'signed').length;
  const pendingContracts = contracts.filter(c => c.status !== 'signed').length;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return t('contractDraft');
      case 'generated': return t('contractGenerated');
      case 'sent': return t('contractSent');
      case 'signed': return t('contractSigned');
      default: return status;
    }
  };

  const getLangLabel = (lang: string) => {
    switch (lang) {
      case 'ba': return '🇧🇦 BA';
      case 'en': return '🇬🇧 EN';
      case 'de': return '🇩🇪 DE';
      default: return lang.toUpperCase();
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('contractsList')}</h1>
            <p className="text-sm text-muted-foreground">{t('contractsDescription')}</p>
          </div>
          <Button onClick={() => { resetWizard(); setIsWizardOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('generateContract')}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title={t('totalContractsLabel')} value={totalContracts} icon={<FileText className="h-6 w-6" />} />
          <StatCard title={t('signedContractsLabel')} value={signedContracts} icon={<CheckCircle2 className="h-6 w-6" />} />
          <StatCard title={t('pendingContractsLabel')} value={pendingContracts} icon={<PenLine className="h-6 w-6" />} />
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Contracts Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('contractNumber')}</TableHead>
                  <TableHead>{t('childName')}</TableHead>
                  <TableHead>{t('schoolYear')}</TableHead>
                  <TableHead>{t('grade')}</TableHead>
                  <TableHead>{t('contractLanguage')}</TableHead>
                  <TableHead>{t('contractStatus')}</TableHead>
                  <TableHead>{t('contractDate')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {t('noContracts')}
                    </TableCell>
                  </TableRow>
                ) : filteredContracts.map((contract) => {
                  const data = contract.contract_data as Record<string, any>;
                  return (
                    <TableRow key={contract.id}>
                      <TableCell className="font-mono text-sm">{contract.contract_number}</TableCell>
                      <TableCell className="font-medium">{data?.child_full_name || '-'}</TableCell>
                      <TableCell>{contract.academic_year}</TableCell>
                      <TableCell>{contract.grade}</TableCell>
                      <TableCell>{getLangLabel(contract.language)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColors[contract.status] || ''}>
                          {getStatusLabel(contract.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(contract.created_at), 'dd.MM.yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost" size="icon"
                            onClick={() => setPreviewContract(contract)}
                            title={t('edit')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            onClick={() => handleDownloadPDF(contract)}
                            title={t('downloadPDF')}
                          >
                            <FileDown className="h-4 w-4 text-destructive" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            onClick={() => handleDownloadDOCX(contract)}
                            title={t('downloadDOCX')}
                          >
                            <Download className="h-4 w-4 text-primary" />
                          </Button>
                          {contract.status === 'generated' && (
                            <Button
                              variant="ghost" size="icon"
                              onClick={() => handleSendContract(contract)}
                              title={t('sendContract')}
                            >
                              <Send className="h-4 w-4 text-info" />
                            </Button>
                          )}
                          {contract.status !== 'signed' && (
                            <Button
                              variant="ghost" size="icon"
                              onClick={() => handleMarkSigned(contract)}
                              title={t('markSigned')}
                            >
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Contract Preview Dialog */}
        <Dialog open={!!previewContract} onOpenChange={() => setPreviewContract(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('enrollmentAgreement')} - {previewContract?.contract_number}</DialogTitle>
            </DialogHeader>
            {previewContract && (
              <ContractPreviewContent contract={previewContract} t={t} />
            )}
          </DialogContent>
        </Dialog>

        {/* Generation Wizard */}
        <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh]">
            <DialogHeader>
              <DialogTitle>{t('generateContract')}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[65vh] pr-4">
              <Tabs value={String(wizardStep)} onValueChange={(v) => setWizardStep(Number(v))}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="0">{t('verifyInformation')}</TabsTrigger>
                  <TabsTrigger value="1" disabled={!selectedVisitorId}>{t('confirmFinancials')}</TabsTrigger>
                  <TabsTrigger value="2" disabled={!selectedVisitorId}>{t('setDates')}</TabsTrigger>
                  <TabsTrigger value="3" disabled={!selectedVisitorId}>{t('previewGenerate')}</TabsTrigger>
                </TabsList>

                {/* Step 0: Select student & verify info */}
                <TabsContent value="0" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>{t('childName')}</Label>
                    <Select value={selectedVisitorId} onValueChange={setSelectedVisitorId}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectGrade')} />
                      </SelectTrigger>
                      <SelectContent>
                        {visitors.map(v => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.child_first_name} {v.child_last_name} — {t('grade')} {v.target_grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('contractLanguage')}</Label>
                    <Select value={contractLanguage} onValueChange={setContractLanguage}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BA">🇧🇦 Bosanski</SelectItem>
                        <SelectItem value="EN">🇬🇧 English</SelectItem>
                        <SelectItem value="DE">🇩🇪 Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedVisitor && (
                    <Card>
                      <CardHeader><CardTitle className="text-sm">{t('childInfo')}</CardTitle></CardHeader>
                      <CardContent className="space-y-1 text-sm">
                        <p><strong>{t('firstName')}:</strong> {selectedVisitor.child_first_name}</p>
                        <p><strong>{t('lastName')}:</strong> {selectedVisitor.child_last_name}</p>
                        <p><strong>{t('dateOfBirth')}:</strong> {selectedVisitor.child_date_of_birth}</p>
                        <p><strong>{t('address')}:</strong> {selectedVisitor.child_address}</p>
                        <Separator className="my-2" />
                        <p><strong>{t('mother')}:</strong> {[selectedVisitor.mother_first_name, selectedVisitor.mother_last_name].filter(Boolean).join(' ') || '-'}</p>
                        <p><strong>{t('father')}:</strong> {[selectedVisitor.father_first_name, selectedVisitor.father_last_name].filter(Boolean).join(' ') || '-'}</p>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={() => setWizardStep(1)} disabled={!selectedVisitorId}>{t('confirmFinancials')} →</Button>
                  </div>
                </TabsContent>

                {/* Step 1: Financial details */}
                <TabsContent value="1" className="space-y-4 mt-4">
                  {selectedVisitor && (
                    <Card>
                      <CardHeader><CardTitle className="text-sm">{t('financialDetails')}</CardTitle></CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <p className="text-muted-foreground">{t('registrationFee')}:</p>
                          <p className="font-medium">{formatCurrencyByLocale(selectedVisitor.registration_fee || 0, contractLanguage as NumberTextLanguage)}</p>
                          <p className="text-muted-foreground">{t('deposit')}:</p>
                          <p className="font-medium">{formatCurrencyByLocale(selectedVisitor.deposit_amount || 0, contractLanguage as NumberTextLanguage)}</p>
                          <p className="text-muted-foreground">{t('baseTuition')}:</p>
                          <p className="font-medium">{formatCurrencyByLocale(selectedVisitor.tuition_fee || 0, contractLanguage as NumberTextLanguage)}</p>
                          {selectedVisitor.uses_extended_stay && (
                            <>
                              <p className="text-muted-foreground">{t('extendedStay')}:</p>
                              <p className="font-medium">{formatCurrencyByLocale(selectedVisitor.extended_stay_fee || 0, contractLanguage as NumberTextLanguage)}</p>
                            </>
                          )}
                          <Separator className="col-span-2 my-1" />
                          <p className="text-muted-foreground font-semibold">{t('totalAmountDue')}:</p>
                          <p className="font-bold text-primary">{formatCurrencyByLocale(selectedVisitor.total_amount_due || 0, contractLanguage as NumberTextLanguage)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setWizardStep(0)}>← {t('verifyInformation')}</Button>
                    <Button onClick={() => setWizardStep(2)}>{t('setDates')} →</Button>
                  </div>
                </TabsContent>

                {/* Step 2: Dates */}
                <TabsContent value="2" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>{t('contractDate')}</Label>
                    <Input type="date" value={contractDate} onChange={e => setContractDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('firstPaymentDate')}</Label>
                    <Input type="date" value={firstPaymentDate} onChange={e => setFirstPaymentDate(e.target.value)} />
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setWizardStep(1)}>← {t('confirmFinancials')}</Button>
                    <Button onClick={() => setWizardStep(3)}>{t('previewGenerate')} →</Button>
                  </div>
                </TabsContent>

                {/* Step 3: Preview & Generate */}
                <TabsContent value="3" className="space-y-4 mt-4">
                  {selectedVisitor && (
                    <Card className="border-primary/20">
                      <CardHeader><CardTitle className="text-sm">{t('enrollmentAgreement')}</CardTitle></CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p><strong>{t('childName')}:</strong> {selectedVisitor.child_first_name} {selectedVisitor.child_last_name}</p>
                        <p><strong>{t('grade')}:</strong> {toRomanNumeral(parseInt(selectedVisitor.target_grade || '1'))} ({gradeNames[contractLanguage as NumberTextLanguage]?.[parseInt(selectedVisitor.target_grade || '1') - 1]})</p>
                        <p><strong>{t('contractDate')}:</strong> {formatDateByLocale(contractDate, contractLanguage as NumberTextLanguage)}</p>
                        <p><strong>{t('contractLanguage')}:</strong> {contractLanguage}</p>
                        <Separator className="my-2" />
                        <p><strong>{t('totalAmountDue')}:</strong> {formatCurrencyByLocale(selectedVisitor.total_amount_due || 0, contractLanguage as NumberTextLanguage)}</p>
                        <p className="text-muted-foreground italic">({numberToText(selectedVisitor.total_amount_due || 0, contractLanguage as NumberTextLanguage)} KM)</p>
                      </CardContent>
                    </Card>
                  )}
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setWizardStep(2)}>← {t('setDates')}</Button>
                    <Button onClick={handleGenerateContract} disabled={generating} className="gap-2">
                      {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                      {t('generateContract')}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

// Contract Preview Sub-component
function ContractPreviewContent({ contract, t }: { contract: Contract; t: (key: any) => string }) {
  const data = contract.contract_data as Record<string, any>;

  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-muted-foreground">{t('contractNumber')}</p>
          <p className="font-mono font-semibold">{contract.contract_number}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t('contractDate')}</p>
          <p>{data?.contract_date}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t('childName')}</p>
          <p className="font-medium">{data?.child_full_name}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t('grade')}</p>
          <p>{data?.grade_number} ({data?.grade_text})</p>
        </div>
      </div>

      <Separator />

      <div>
        <p className="font-medium mb-2">{t('parentInfo')}</p>
        <p>{data?.parent1_full_name}</p>
        {data?.parent2_full_name && <p>{data.parent2_full_name}</p>}
        <p className="text-muted-foreground">{data?.address}</p>
      </div>

      <Separator />

      <div>
        <p className="font-medium mb-2">{t('financialDetails')}</p>
        <div className="grid grid-cols-2 gap-1">
          <p className="text-muted-foreground">{t('registrationFee')}:</p>
          <p>{data?.enrollment_fee_amount} KM ({data?.enrollment_fee_text})</p>
          <p className="text-muted-foreground">{t('deposit')}:</p>
          <p>{data?.deposit_amount} KM ({data?.deposit_text})</p>
          <p className="text-muted-foreground">{t('annualTuition')}:</p>
          <p>{data?.tuition_annual_amount} KM ({data?.tuition_annual_text})</p>
          <p className="text-muted-foreground font-semibold">{t('totalAmountDue')}:</p>
          <p className="font-bold">{data?.total_amount_due} KM</p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-1">
        <p className="text-muted-foreground">{t('firstPaymentDate')}:</p>
        <p>{data?.first_payment_date}</p>
        <p className="text-muted-foreground">{t('signatureDate')}:</p>
        <p>{data?.signature_date}</p>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign, Save, AlertTriangle, Loader2 } from 'lucide-react';

interface PricingData {
  id: string;
  school_year: string;
  registration_fee_domestic: number;
  registration_fee_foreign: number;
  deposit_amount: number;
  tuition_1_4_domestic: number;
  tuition_1_4_foreign: number;
  tuition_5_9_domestic: number;
  tuition_5_9_foreign: number;
  extended_stay_fee: number;
  sibling_discount_2nd: number;
  sibling_discount_3rd: number;
  is_active: boolean;
}

export default function PricingManagement() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [pricing, setPricing] = useState<PricingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPricing();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPricing = async () => {
    const { data, error } = await supabase
      .from('pricing')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to load pricing data',
        variant: 'destructive',
      });
    } else if (data) {
      setPricing(data as PricingData);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!pricing) return;

    setSaving(true);
    const { error } = await supabase
      .from('pricing')
      .update({
        school_year: pricing.school_year,
        registration_fee_domestic: pricing.registration_fee_domestic,
        registration_fee_foreign: pricing.registration_fee_foreign,
        deposit_amount: pricing.deposit_amount,
        tuition_1_4_domestic: pricing.tuition_1_4_domestic,
        tuition_1_4_foreign: pricing.tuition_1_4_foreign,
        tuition_5_9_domestic: pricing.tuition_5_9_domestic,
        tuition_5_9_foreign: pricing.tuition_5_9_foreign,
        extended_stay_fee: pricing.extended_stay_fee,
        sibling_discount_2nd: pricing.sibling_discount_2nd,
        sibling_discount_3rd: pricing.sibling_discount_3rd,
        is_active: pricing.is_active,
      })
      .eq('id', pricing.id);

    setSaving(false);

    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update pricing',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Pricing updated successfully',
      });
    }
  };

  const updateField = (field: keyof PricingData, value: number | string | boolean) => {
    if (pricing) {
      setPricing({ ...pricing, [field]: value });
    }
  };

  if (roleLoading || loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <AlertTriangle className="h-16 w-16 text-destructive" />
          <h2 className="text-xl font-semibold">{t('accessDenied')}</h2>
          <p className="text-muted-foreground">{t('adminOnlyAccess')}</p>
        </div>
      </AppLayout>
    );
  }

  if (!pricing) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <AlertTriangle className="h-16 w-16 text-warning" />
          <h2 className="text-xl font-semibold">No Pricing Data</h2>
          <p className="text-muted-foreground">No active pricing configuration found.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('pricingManagement')}</h1>
            <p className="text-muted-foreground">{t('manageFees')}</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {t('saveChanges')}
          </Button>
        </div>

        {/* School Year & Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {t('generalSettings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="school_year">{t('schoolYear')}</Label>
              <Input
                id="school_year"
                value={pricing.school_year}
                onChange={(e) => updateField('school_year', e.target.value)}
                placeholder="2024-2025"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('activePricing')}</Label>
                <p className="text-sm text-muted-foreground">{t('activePricingDesc')}</p>
              </div>
              <Switch
                checked={pricing.is_active}
                onCheckedChange={(checked) => updateField('is_active', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Registration & Deposit */}
        <Card>
          <CardHeader>
            <CardTitle>{t('registrationDeposit')}</CardTitle>
            <CardDescription>{t('registrationDepositDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="registration_domestic">{t('registrationFeeDomestic')}</Label>
              <Input
                id="registration_domestic"
                type="number"
                value={pricing.registration_fee_domestic}
                onChange={(e) => updateField('registration_fee_domestic', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registration_foreign">{t('registrationFeeForeign')}</Label>
              <Input
                id="registration_foreign"
                type="number"
                value={pricing.registration_fee_foreign}
                onChange={(e) => updateField('registration_fee_foreign', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">{t('depositAmount')}</Label>
              <Input
                id="deposit"
                type="number"
                value={pricing.deposit_amount}
                onChange={(e) => updateField('deposit_amount', Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tuition Fees */}
        <Card>
          <CardHeader>
            <CardTitle>{t('tuitionFees')}</CardTitle>
            <CardDescription>{t('tuitionFeesDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Grades 1-4 */}
            <div>
              <h4 className="font-medium mb-3">{t('grades1to4')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tuition_1_4_domestic">{t('domesticTuition')}</Label>
                  <Input
                    id="tuition_1_4_domestic"
                    type="number"
                    value={pricing.tuition_1_4_domestic}
                    onChange={(e) => updateField('tuition_1_4_domestic', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tuition_1_4_foreign">{t('foreignTuition')}</Label>
                  <Input
                    id="tuition_1_4_foreign"
                    type="number"
                    value={pricing.tuition_1_4_foreign}
                    onChange={(e) => updateField('tuition_1_4_foreign', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Grades 5-9 */}
            <div>
              <h4 className="font-medium mb-3">{t('grades5to9')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tuition_5_9_domestic">{t('domesticTuition')}</Label>
                  <Input
                    id="tuition_5_9_domestic"
                    type="number"
                    value={pricing.tuition_5_9_domestic}
                    onChange={(e) => updateField('tuition_5_9_domestic', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tuition_5_9_foreign">{t('foreignTuition')}</Label>
                  <Input
                    id="tuition_5_9_foreign"
                    type="number"
                    value={pricing.tuition_5_9_foreign}
                    onChange={(e) => updateField('tuition_5_9_foreign', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Fees & Discounts */}
        <Card>
          <CardHeader>
            <CardTitle>{t('additionalFeesDiscounts')}</CardTitle>
            <CardDescription>{t('additionalFeesDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="extended_stay">{t('extendedStayFee')}</Label>
              <Input
                id="extended_stay"
                type="number"
                value={pricing.extended_stay_fee}
                onChange={(e) => updateField('extended_stay_fee', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sibling_2nd">{t('siblingDiscount2nd')} (%)</Label>
              <Input
                id="sibling_2nd"
                type="number"
                value={pricing.sibling_discount_2nd}
                onChange={(e) => updateField('sibling_discount_2nd', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sibling_3rd">{t('siblingDiscount3rd')} (%)</Label>
              <Input
                id="sibling_3rd"
                type="number"
                value={pricing.sibling_discount_3rd}
                onChange={(e) => updateField('sibling_discount_3rd', Number(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

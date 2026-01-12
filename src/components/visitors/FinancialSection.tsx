import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { VisitorFormData, GradeLevel, ResidentType, PaymentType } from '@/types/visitor';
import { usePricing } from '@/hooks/usePricing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinancialSectionProps {
  formData: VisitorFormData;
  onChange: (data: Partial<VisitorFormData>) => void;
  t: (key: string) => string;
}

export function FinancialSection({ formData, onChange, t }: FinancialSectionProps) {
  const { pricing, calculateFees } = usePricing();
  const fees = calculateFees(formData);

  const handleSemesterChange = (semester: number) => {
    // Adjust months to pay based on semester
    const months = semester === 1 ? 10 : 5;
    onChange({ enrollment_semester: semester, months_to_pay: months });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">{t('financialDetails')}</h3>
      
      {/* Enrollment Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="target_grade">{t('targetGrade')}</Label>
          <Select
            value={formData.target_grade || ''}
            onValueChange={(value: GradeLevel) => onChange({ target_grade: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('selectGrade')} />
            </SelectTrigger>
            <SelectContent>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {t('grade')} {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="target_school_year">{t('schoolYear')}</Label>
          <Select
            value={formData.target_school_year}
            onValueChange={(value) => onChange({ target_school_year: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024/2025">2024/2025</SelectItem>
              <SelectItem value="2025/2026">2025/2026</SelectItem>
              <SelectItem value="2026/2027">2026/2027</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="enrollment_semester">{t('enrollmentSemester')}</Label>
          <Select
            value={formData.enrollment_semester.toString()}
            onValueChange={(value) => handleSemesterChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">{t('semester1Full')}</SelectItem>
              <SelectItem value="2">{t('semester2Only')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="resident_type">{t('residentType')}</Label>
          <Select
            value={formData.resident_type}
            onValueChange={(value: ResidentType) => onChange({ resident_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="domestic">{t('domestic')}</SelectItem>
              <SelectItem value="foreign">{t('foreign')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="payment_type">{t('paymentType')}</Label>
          <Select
            value={formData.payment_type}
            onValueChange={(value: PaymentType) => onChange({ payment_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">{t('fullPayment')}</SelectItem>
              <SelectItem value="installments">{t('installments')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="months_to_pay">{t('monthsToPay')}</Label>
          <Input
            id="months_to_pay"
            type="number"
            min="1"
            max="10"
            value={formData.months_to_pay}
            onChange={(e) => onChange({ months_to_pay: parseInt(e.target.value) || 10 })}
          />
        </div>
      </div>

      {/* Discounts & Waivers */}
      <div className="space-y-4 pt-4">
        <h4 className="font-medium text-muted-foreground">{t('discountsWaivers')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sibling_discount_percent">{t('siblingDiscount')}</Label>
            <Select
              value={formData.sibling_discount_percent.toString()}
              onValueChange={(value) => onChange({ sibling_discount_percent: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">{t('noDiscount')}</SelectItem>
                <SelectItem value="10">10% ({t('secondChild')})</SelectItem>
                <SelectItem value="15">15% ({t('thirdChild')})</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="scholarship_percent">{t('scholarshipPercent')}</Label>
            <Input
              id="scholarship_percent"
              type="number"
              min="0"
              max="100"
              value={formData.scholarship_percent}
              onChange={(e) => onChange({ scholarship_percent: parseInt(e.target.value) || 0 })}
              placeholder="0-100"
            />
          </div>
          {formData.scholarship_percent > 0 && (
            <div className="md:col-span-2">
              <Label htmlFor="scholarship_type">{t('scholarshipType')}</Label>
              <Input
                id="scholarship_type"
                value={formData.scholarship_type}
                onChange={(e) => onChange({ scholarship_type: e.target.value })}
                placeholder={t('scholarshipTypePlaceholder')}
              />
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="registration_fee_waived" className="cursor-pointer">
              {t('registrationFeeWaived')}
            </Label>
            <Switch
              id="registration_fee_waived"
              checked={formData.registration_fee_waived}
              onCheckedChange={(checked) => onChange({ registration_fee_waived: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="uses_extended_stay" className="cursor-pointer">
              {t('usesExtendedStay')}
            </Label>
            <Switch
              id="uses_extended_stay"
              checked={formData.uses_extended_stay}
              onCheckedChange={(checked) => onChange({ uses_extended_stay: checked })}
            />
          </div>
        </div>
      </div>

      {/* Fee Summary */}
      {formData.target_grade && pricing && (
        <Card className="bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('feeSummary')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t('registrationFee')}</span>
              <span className={formData.registration_fee_waived ? 'line-through text-muted-foreground' : ''}>
                {fees.registrationFee.toLocaleString()} KM
              </span>
            </div>
            {fees.depositAmount > 0 && (
              <div className="flex justify-between">
                <span>{t('deposit')}</span>
                <span>{fees.depositAmount.toLocaleString()} KM</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{t('baseTuition')}</span>
              <span>{fees.baseTuition.toLocaleString()} KM</span>
            </div>
            {fees.siblingDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span>{t('siblingDiscountAmount')}</span>
                <span>-{fees.siblingDiscount.toLocaleString()} KM</span>
              </div>
            )}
            {fees.scholarshipDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span>{t('scholarshipDiscountAmount')}</span>
                <span>-{fees.scholarshipDiscount.toLocaleString()} KM</span>
              </div>
            )}
            {formData.uses_extended_stay && (
              <div className="flex justify-between">
                <span>{t('extendedStay')}</span>
                <span>{fees.extendedStayFee.toLocaleString()} KM</span>
              </div>
            )}
            {formData.months_to_pay < 10 && (
              <div className="flex justify-between text-info">
                <span>{t('proRated')} ({formData.months_to_pay} {t('months')})</span>
                <span>{fees.proRatedTuition.toLocaleString()} KM</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>{t('totalAmountDue')}</span>
              <span className="text-primary">{fees.totalAmountDue.toLocaleString()} KM</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VisitorFormData } from '@/types/visitor';

interface ChildInfoSectionProps {
  formData: VisitorFormData;
  onChange: (data: Partial<VisitorFormData>) => void;
  t: (key: string) => string;
}

export function ChildInfoSection({ formData, onChange, t }: ChildInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">{t('childInfo')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="child_first_name">{t('firstName')} *</Label>
          <Input
            id="child_first_name"
            value={formData.child_first_name}
            onChange={(e) => onChange({ child_first_name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="child_last_name">{t('lastName')} *</Label>
          <Input
            id="child_last_name"
            value={formData.child_last_name}
            onChange={(e) => onChange({ child_last_name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="child_date_of_birth">{t('dateOfBirth')} *</Label>
          <Input
            id="child_date_of_birth"
            type="date"
            value={formData.child_date_of_birth}
            onChange={(e) => onChange({ child_date_of_birth: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="child_citizenship">{t('citizenship')} *</Label>
          <Input
            id="child_citizenship"
            value={formData.child_citizenship}
            onChange={(e) => onChange({ child_citizenship: e.target.value })}
            placeholder="e.g., Bosnia and Herzegovina"
            required
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="child_address">{t('address')} *</Label>
          <Input
            id="child_address"
            value={formData.child_address}
            onChange={(e) => onChange({ child_address: e.target.value })}
            placeholder={t('addressPlaceholder')}
            required
          />
        </div>
      </div>
    </div>
  );
}

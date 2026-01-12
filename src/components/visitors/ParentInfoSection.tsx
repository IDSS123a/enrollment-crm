import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VisitorFormData } from '@/types/visitor';

interface ParentInfoSectionProps {
  formData: VisitorFormData;
  onChange: (data: Partial<VisitorFormData>) => void;
  t: (key: string) => string;
}

export function ParentInfoSection({ formData, onChange, t }: ParentInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">{t('parentInfo')}</h3>
      
      {/* Mother */}
      <div className="space-y-3">
        <h4 className="font-medium text-muted-foreground">{t('mother')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mother_first_name">{t('firstName')}</Label>
            <Input
              id="mother_first_name"
              value={formData.mother_first_name}
              onChange={(e) => onChange({ mother_first_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="mother_last_name">{t('lastName')}</Label>
            <Input
              id="mother_last_name"
              value={formData.mother_last_name}
              onChange={(e) => onChange({ mother_last_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="mother_phone">{t('phone')}</Label>
            <Input
              id="mother_phone"
              type="tel"
              value={formData.mother_phone}
              onChange={(e) => onChange({ mother_phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="mother_email">{t('email')}</Label>
            <Input
              id="mother_email"
              type="email"
              value={formData.mother_email}
              onChange={(e) => onChange({ mother_email: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="mother_profession">{t('profession')}</Label>
            <Input
              id="mother_profession"
              value={formData.mother_profession}
              onChange={(e) => onChange({ mother_profession: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Father */}
      <div className="space-y-3">
        <h4 className="font-medium text-muted-foreground">{t('father')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="father_first_name">{t('firstName')}</Label>
            <Input
              id="father_first_name"
              value={formData.father_first_name}
              onChange={(e) => onChange({ father_first_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="father_last_name">{t('lastName')}</Label>
            <Input
              id="father_last_name"
              value={formData.father_last_name}
              onChange={(e) => onChange({ father_last_name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="father_phone">{t('phone')}</Label>
            <Input
              id="father_phone"
              type="tel"
              value={formData.father_phone}
              onChange={(e) => onChange({ father_phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="father_email">{t('email')}</Label>
            <Input
              id="father_email"
              type="email"
              value={formData.father_email}
              onChange={(e) => onChange({ father_email: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="father_profession">{t('profession')}</Label>
            <Input
              id="father_profession"
              value={formData.father_profession}
              onChange={(e) => onChange({ father_profession: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Guardian */}
      <div className="space-y-3">
        <h4 className="font-medium text-muted-foreground">{t('guardian')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="guardian_phone">{t('phone')}</Label>
            <Input
              id="guardian_phone"
              type="tel"
              value={formData.guardian_phone}
              onChange={(e) => onChange({ guardian_phone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="guardian_email">{t('email')}</Label>
            <Input
              id="guardian_email"
              type="email"
              value={formData.guardian_email}
              onChange={(e) => onChange({ guardian_email: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

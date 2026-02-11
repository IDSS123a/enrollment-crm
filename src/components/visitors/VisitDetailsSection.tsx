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
import { VisitorFormData, VisitType, VisitorStatus, EnrollmentDecision } from '@/types/visitor';

interface VisitDetailsSectionProps {
  formData: VisitorFormData;
  onChange: (data: Partial<VisitorFormData>) => void;
  t: (key: string) => string;
}

export function VisitDetailsSection({ formData, onChange, t }: VisitDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold border-b pb-2">{t('visitDetails')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="visit_type">{t('visitType')}</Label>
          <Select
            value={formData.visit_type}
            onValueChange={(value: VisitType) => onChange({ visit_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in_person">{t('inPerson')}</SelectItem>
              <SelectItem value="online">{t('online')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="visit_date">{t('visitDate')}</Label>
          <Input
            id="visit_date"
            type="date"
            value={formData.visit_date}
            onChange={(e) => onChange({ visit_date: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="visit_time">{t('visitTime')}</Label>
          <Input
            id="visit_time"
            type="time"
            value={formData.visit_scheduled_at || ''}
            onChange={(e) => onChange({ visit_scheduled_at: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="status">{t('visitorStatus')}</Label>
          <Select
            value={formData.status}
            onValueChange={(value: VisitorStatus) => onChange({ status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">{t('scheduled')}</SelectItem>
              <SelectItem value="visited">{t('visited')}</SelectItem>
              <SelectItem value="enrolled">{t('enrolledStatus')}</SelectItem>
              <SelectItem value="rejected">{t('rejected')}</SelectItem>
              <SelectItem value="pending">{t('pending')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="referral_source">{t('referralSource')}</Label>
          <Input
            id="referral_source"
            value={formData.referral_source}
            onChange={(e) => onChange({ referral_source: e.target.value })}
            placeholder={t('referralSourcePlaceholder')}
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="visit_notes">{t('visitNotes')}</Label>
          <Textarea
            id="visit_notes"
            value={formData.visit_notes}
            onChange={(e) => onChange({ visit_notes: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      {/* Enrollment Decision */}
      <div className="space-y-3 pt-4">
        <h4 className="font-medium text-muted-foreground">{t('enrollmentAssessment')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="enrollment_decision">{t('enrollmentDecision')}</Label>
            <Select
              value={formData.enrollment_decision || ''}
              onValueChange={(value: EnrollmentDecision) => onChange({ enrollment_decision: value || null })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('selectDecision')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">{t('approved')}</SelectItem>
                <SelectItem value="conditional">{t('conditional')}</SelectItem>
                <SelectItem value="rejected">{t('decisionRejected')}</SelectItem>
                <SelectItem value="pending_review">{t('pendingReview')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="enrollment_decision_notes">{t('decisionNotes')}</Label>
            <Textarea
              id="enrollment_decision_notes"
              value={formData.enrollment_decision_notes}
              onChange={(e) => onChange({ enrollment_decision_notes: e.target.value })}
              rows={2}
              placeholder={t('decisionNotesPlaceholder')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

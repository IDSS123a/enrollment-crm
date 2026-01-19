export type VisitorStatus = 'scheduled' | 'visited' | 'enrolled' | 'rejected' | 'pending';
export type VisitType = 'in_person' | 'online';
export type EnrollmentDecision = 'approved' | 'conditional' | 'rejected' | 'pending_review';
export type ResidentType = 'domestic' | 'foreign';
export type GradeLevel = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type PaymentType = 'full' | 'installments';

export interface Visitor {
  id: string;
  user_id: string;
  
  // Child information
  child_first_name: string;
  child_last_name: string;
  child_date_of_birth: string;
  child_citizenship: string;
  child_address: string;
  
  // Mother information
  mother_first_name: string | null;
  mother_last_name: string | null;
  mother_phone: string | null;
  mother_email: string | null;
  mother_profession: string | null;
  
  // Father information
  father_first_name: string | null;
  father_last_name: string | null;
  father_phone: string | null;
  father_email: string | null;
  father_profession: string | null;
  
  // Guardian information
  guardian_phone: string | null;
  guardian_email: string | null;
  
  // Referral source
  referral_source: string | null;
  
  // Visit details
  visit_type: VisitType;
  visit_date: string | null;
  visit_scheduled_at: string | null;
  visit_notes: string | null;
  
  // Enrollment assessment
  status: VisitorStatus;
  enrollment_decision: EnrollmentDecision | null;
  enrollment_decision_notes: string | null;
  
  // Enrollment details
  target_grade: GradeLevel | null;
  target_school_year: string | null;
  enrollment_semester: number;
  months_to_pay: number;
  
  // Financial details
  resident_type: ResidentType;
  payment_type: PaymentType;
  
  // Base fees
  registration_fee: number;
  deposit_amount: number;
  tuition_fee: number;
  extended_stay_fee: number;
  
  // Discounts
  sibling_discount_percent: number;
  scholarship_percent: number;
  scholarship_type: string | null;
  registration_fee_waived: boolean;
  
  // Calculated totals
  total_tuition_after_discounts: number;
  total_amount_due: number;
  
  // Extended stay
  uses_extended_stay: boolean;
  
  // Email tracking
  after_visit_email_sent_at: string | null;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

export interface Pricing {
  id: string;
  school_year: string;
  registration_fee_domestic: number;
  registration_fee_foreign: number;
  deposit_amount: number;
  extended_stay_fee: number;
  tuition_1_4_domestic: number;
  tuition_1_4_foreign: number;
  tuition_5_9_domestic: number;
  tuition_5_9_foreign: number;
  sibling_discount_2nd: number;
  sibling_discount_3rd: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VisitorFormData {
  // Child information
  child_first_name: string;
  child_last_name: string;
  child_date_of_birth: string;
  child_citizenship: string;
  child_address: string;
  
  // Mother information
  mother_first_name: string;
  mother_last_name: string;
  mother_phone: string;
  mother_email: string;
  mother_profession: string;
  
  // Father information
  father_first_name: string;
  father_last_name: string;
  father_phone: string;
  father_email: string;
  father_profession: string;
  
  // Guardian information
  guardian_phone: string;
  guardian_email: string;
  
  // Referral source
  referral_source: string;
  
  // Visit details
  visit_type: VisitType;
  visit_date: string;
  visit_scheduled_at: string;
  visit_notes: string;
  
  // Enrollment assessment
  status: VisitorStatus;
  enrollment_decision: EnrollmentDecision | null;
  enrollment_decision_notes: string;
  
  // Enrollment details
  target_grade: GradeLevel | null;
  target_school_year: string;
  enrollment_semester: number;
  months_to_pay: number;
  
  // Financial details
  resident_type: ResidentType;
  payment_type: PaymentType;
  
  // Discounts
  sibling_discount_percent: number;
  scholarship_percent: number;
  scholarship_type: string;
  registration_fee_waived: boolean;
  
  // Extended stay
  uses_extended_stay: boolean;
}

export const initialVisitorFormData: VisitorFormData = {
  child_first_name: '',
  child_last_name: '',
  child_date_of_birth: '',
  child_citizenship: '',
  child_address: '',
  mother_first_name: '',
  mother_last_name: '',
  mother_phone: '',
  mother_email: '',
  mother_profession: '',
  father_first_name: '',
  father_last_name: '',
  father_phone: '',
  father_email: '',
  father_profession: '',
  guardian_phone: '',
  guardian_email: '',
  referral_source: '',
  visit_type: 'in_person',
  visit_date: '',
  visit_scheduled_at: '',
  visit_notes: '',
  status: 'scheduled',
  enrollment_decision: null,
  enrollment_decision_notes: '',
  target_grade: null,
  target_school_year: '2025/2026',
  enrollment_semester: 1,
  months_to_pay: 10,
  resident_type: 'domestic',
  payment_type: 'full',
  sibling_discount_percent: 0,
  scholarship_percent: 0,
  scholarship_type: '',
  registration_fee_waived: false,
  uses_extended_stay: false,
};

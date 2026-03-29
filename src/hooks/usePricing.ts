import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Pricing, ResidentType, GradeLevel, VisitorFormData } from '@/types/visitor';

export function usePricing() {
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      setPricing(data as Pricing | null);
    } catch (error) {
      console.error('Failed to load pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFees = useCallback((formData: VisitorFormData): {
    registrationFee: number;
    depositAmount: number;
    baseTuition: number;
    extendedStayFee: number;
    siblingDiscount: number;
    scholarshipDiscount: number;
    tuitionAfterDiscounts: number;
    proRatedTuition: number;
    totalAmountDue: number;
  } => {
    if (!pricing || !formData.target_grade) {
      return {
        registrationFee: 0,
        depositAmount: 0,
        baseTuition: 0,
        extendedStayFee: 0,
        siblingDiscount: 0,
        scholarshipDiscount: 0,
        tuitionAfterDiscounts: 0,
        proRatedTuition: 0,
        totalAmountDue: 0,
      };
    }

    const grade = parseInt(formData.target_grade);
    const isLowerGrades = grade >= 1 && grade <= 4;
    const isDomestic = formData.resident_type === 'domestic';

    // Base registration fee
    const registrationFee = formData.registration_fee_waived 
      ? 0 
      : (isDomestic ? pricing.registration_fee_domestic : pricing.registration_fee_foreign);

    // Deposit (only for installment payments)
    const depositAmount = formData.payment_type === 'installments' ? pricing.deposit_amount : 0;

    // Base tuition based on grade and residency
    let baseTuition: number;
    if (isLowerGrades) {
      baseTuition = isDomestic ? pricing.tuition_1_4_domestic : pricing.tuition_1_4_foreign;
    } else {
      baseTuition = isDomestic ? pricing.tuition_5_9_domestic : pricing.tuition_5_9_foreign;
    }

    // Extended stay fee
    const extendedStayFee = formData.uses_extended_stay ? pricing.extended_stay_fee : 0;

    // Calculate sibling discount on tuition
    const siblingDiscountPercent = formData.sibling_discount_percent;
    const siblingDiscount = baseTuition * (siblingDiscountPercent / 100);
    const tuitionAfterSibling = baseTuition - siblingDiscount;

    // Calculate scholarship discount on remaining tuition
    const scholarshipPercent = formData.scholarship_percent;
    const scholarshipDiscount = tuitionAfterSibling * (scholarshipPercent / 100);
    const tuitionAfterDiscounts = tuitionAfterSibling - scholarshipDiscount;

    // Pro-rate tuition based on months to pay (handles mid-year enrollment)
    // Full year = 10 months, so if enrolling in semester 2, might only pay 5 months
    const monthlyTuition = tuitionAfterDiscounts / 10;
    const proRatedTuition = monthlyTuition * formData.months_to_pay;

    // Pro-rate extended stay as well
    const monthlyExtendedStay = extendedStayFee / 10;
    const proRatedExtendedStay = monthlyExtendedStay * formData.months_to_pay;

    // Total amount due
    const totalAmountDue = registrationFee + depositAmount + proRatedTuition + proRatedExtendedStay;

    return {
      registrationFee,
      depositAmount,
      baseTuition,
      extendedStayFee,
      siblingDiscount,
      scholarshipDiscount,
      tuitionAfterDiscounts,
      proRatedTuition: proRatedTuition + proRatedExtendedStay,
      totalAmountDue,
    };
  }, [pricing]);

  return { pricing, loading, calculateFees };
}

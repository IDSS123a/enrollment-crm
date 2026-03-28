-- Create enum for visitor/enrollment status
CREATE TYPE visitor_status AS ENUM ('scheduled', 'visited', 'enrolled', 'rejected', 'pending');

-- Create enum for visit type
CREATE TYPE visit_type AS ENUM ('in_person', 'online');

-- Create enum for enrollment status decision
CREATE TYPE enrollment_decision AS ENUM ('approved', 'conditional', 'rejected', 'pending_review');

-- Create enum for resident type (affects pricing)
CREATE TYPE resident_type AS ENUM ('domestic', 'foreign');

-- Create enum for grade level
CREATE TYPE grade_level AS ENUM ('1', '2', '3', '4', '5', '6', '7', '8', '9');

-- Create enum for payment type
CREATE TYPE payment_type AS ENUM ('full', 'installments');

-- Create visitors table with all visitor form fields
CREATE TABLE public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Child information
  child_first_name TEXT NOT NULL,
  child_last_name TEXT NOT NULL,
  child_date_of_birth DATE NOT NULL,
  child_citizenship TEXT NOT NULL,
  child_address TEXT NOT NULL,
  
  -- Mother information
  mother_first_name TEXT,
  mother_last_name TEXT,
  mother_phone TEXT,
  mother_email TEXT,
  mother_profession TEXT,
  
  -- Father information
  father_first_name TEXT,
  father_last_name TEXT,
  father_phone TEXT,
  father_email TEXT,
  father_profession TEXT,
  
  -- Guardian information (if applicable)
  guardian_phone TEXT,
  guardian_email TEXT,
  
  -- Referral source
  referral_source TEXT,
  
  -- Visit details
  visit_type visit_type NOT NULL DEFAULT 'in_person',
  visit_date DATE,
  visit_scheduled_at TIMESTAMP WITH TIME ZONE,
  visit_notes TEXT,
  
  -- Enrollment assessment
  status visitor_status NOT NULL DEFAULT 'scheduled',
  enrollment_decision enrollment_decision,
  enrollment_decision_notes TEXT,
  
  -- Enrollment details
  target_grade grade_level,
  target_school_year TEXT, -- e.g., '2025/2026'
  enrollment_semester INTEGER DEFAULT 1, -- 1 = full year from start, 2 = second semester only
  months_to_pay INTEGER DEFAULT 10, -- Number of months to pay (can be less if enrolling mid-year)
  
  -- Financial details
  resident_type resident_type NOT NULL DEFAULT 'domestic',
  payment_type payment_type NOT NULL DEFAULT 'full',
  
  -- Base fees
  registration_fee NUMERIC DEFAULT 0, -- Upisnina
  deposit_amount NUMERIC DEFAULT 0, -- Depozit (only for installments)
  tuition_fee NUMERIC DEFAULT 0, -- Školarina
  extended_stay_fee NUMERIC DEFAULT 0, -- Produženi boravak
  
  -- Discounts and scholarships
  sibling_discount_percent NUMERIC DEFAULT 0, -- 0, 10 (2nd child), 15 (3rd child)
  scholarship_percent NUMERIC DEFAULT 0, -- 0-100
  scholarship_type TEXT, -- Type of scholarship if any
  registration_fee_waived BOOLEAN DEFAULT FALSE, -- Upisnina waived
  
  -- Calculated totals
  total_tuition_after_discounts NUMERIC DEFAULT 0,
  total_amount_due NUMERIC DEFAULT 0,
  
  -- Extended stay
  uses_extended_stay BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own visitors" 
ON public.visitors 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own visitors" 
ON public.visitors 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visitors" 
ON public.visitors 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own visitors" 
ON public.visitors 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create pricing table to store current prices
CREATE TABLE public.pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_year TEXT NOT NULL, -- e.g., '2025/2026'
  
  -- Registration fees
  registration_fee_domestic NUMERIC NOT NULL DEFAULT 1000,
  registration_fee_foreign NUMERIC NOT NULL DEFAULT 1500,
  
  -- Deposit (for installments)
  deposit_amount NUMERIC NOT NULL DEFAULT 1500,
  
  -- Extended stay
  extended_stay_fee NUMERIC NOT NULL DEFAULT 2000,
  
  -- Tuition grades 1-4
  tuition_1_4_domestic NUMERIC NOT NULL DEFAULT 9700,
  tuition_1_4_foreign NUMERIC NOT NULL DEFAULT 11970,
  
  -- Tuition grades 5-9
  tuition_5_9_domestic NUMERIC NOT NULL DEFAULT 11030,
  tuition_5_9_foreign NUMERIC NOT NULL DEFAULT 13700,
  
  -- Sibling discounts
  sibling_discount_2nd NUMERIC NOT NULL DEFAULT 10,
  sibling_discount_3rd NUMERIC NOT NULL DEFAULT 15,
  
  -- Metadata
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for pricing
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;

-- Pricing is readable by all authenticated users
CREATE POLICY "Authenticated users can view pricing" 
ON public.pricing 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Only admins can modify pricing (using has_role function)
CREATE POLICY "Admins can insert pricing" 
ON public.pricing 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pricing" 
ON public.pricing 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default pricing for 2025/2026
INSERT INTO public.pricing (
  school_year,
  registration_fee_domestic,
  registration_fee_foreign,
  deposit_amount,
  extended_stay_fee,
  tuition_1_4_domestic,
  tuition_1_4_foreign,
  tuition_5_9_domestic,
  tuition_5_9_foreign,
  sibling_discount_2nd,
  sibling_discount_3rd,
  is_active
) VALUES (
  '2025/2026',
  1000,
  1500,
  1500,
  2000,
  9700,
  11970,
  11030,
  13700,
  10,
  15,
  TRUE
);

-- Create trigger for updated_at on visitors
CREATE TRIGGER update_visitors_updated_at
BEFORE UPDATE ON public.visitors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on pricing
CREATE TRIGGER update_pricing_updated_at
BEFORE UPDATE ON public.pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
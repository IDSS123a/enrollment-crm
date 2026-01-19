-- Add column to track if after visit email was sent
ALTER TABLE public.visitors 
ADD COLUMN after_visit_email_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
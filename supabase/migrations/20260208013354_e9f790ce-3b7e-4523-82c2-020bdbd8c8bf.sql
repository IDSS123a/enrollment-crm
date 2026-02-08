-- Add missing RLS policies for better security

-- Allow users to delete their own activities
CREATE POLICY "Users can delete their own activities" 
ON public.activities 
FOR DELETE 
USING (auth.uid() = user_id);

-- Allow users to update their own activities
CREATE POLICY "Users can update their own activities" 
ON public.activities 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Allow admins to delete pricing records
CREATE POLICY "Admins can delete pricing" 
ON public.pricing 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));
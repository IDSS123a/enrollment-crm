-- Create email_templates table for customizable email templates
CREATE TABLE public.email_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_type TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  description TEXT,
  variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view templates
CREATE POLICY "Authenticated users can view templates"
ON public.email_templates
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Only admins can insert templates
CREATE POLICY "Admins can insert templates"
ON public.email_templates
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update templates
CREATE POLICY "Admins can update templates"
ON public.email_templates
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete templates
CREATE POLICY "Admins can delete templates"
ON public.email_templates
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default templates
INSERT INTO public.email_templates (template_type, name, subject, body_html, description, variables) VALUES
(
  'enrollment_confirmation',
  'Enrollment Confirmation',
  '🎉 Welcome to Our School - {child_name} is Enrolled!',
  '<div style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 20px 30px; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Enrollment Confirmed!</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="font-size: 16px; margin-bottom: 20px;">Dear Parent/Guardian,</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      We are thrilled to inform you that <strong>{child_name}</strong> has been officially enrolled at our school!
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #059669;">Enrollment Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Student Name:</td>
          <td style="padding: 8px 0; font-weight: 600;">{child_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Grade Level:</td>
          <td style="padding: 8px 0; font-weight: 600;">Grade {target_grade}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">School Year:</td>
          <td style="padding: 8px 0; font-weight: 600;">{school_year}</td>
        </tr>
      </table>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      We look forward to welcoming {child_name} to our school community. You will receive additional information about orientation and next steps shortly.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #6b7280; margin: 0;">
      Best regards,<br>
      <strong>The Admissions Team</strong>
    </p>
  </div>
  
  <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
    This is an automated message from IDSS Pro CRM.
  </p>
</div>',
  'Sent when a visitor status is changed to enrolled',
  ARRAY['child_name', 'target_grade', 'school_year']
),
(
  'visit_reminder',
  'Visit Reminder',
  '📅 Reminder: School Visit {urgency} - {child_name}',
  '<div style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px 30px; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 22px;">📅 Visit Reminder</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="font-size: 16px; margin-bottom: 20px;">Dear Parent/Guardian,</p>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      This is a friendly reminder about the upcoming school visit for <strong>{child_name}</strong>.
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #d97706;">Visit Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Student:</td>
          <td style="padding: 8px 0; font-weight: 600;">{child_name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Date:</td>
          <td style="padding: 8px 0; font-weight: 600;">{visit_date}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Type:</td>
          <td style="padding: 8px 0; font-weight: 600;">{visit_type}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280;">Target Grade:</td>
          <td style="padding: 8px 0; font-weight: 600;">Grade {target_grade}</td>
        </tr>
      </table>
    </div>
    
    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">
        {urgency_message}
      </p>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      We look forward to meeting you. If you need to reschedule, please contact us as soon as possible.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #6b7280; margin: 0;">
      Best regards,<br>
      <strong>The Admissions Team</strong>
    </p>
  </div>
  
  <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
    This is an automated reminder from IDSS Pro CRM.
  </p>
</div>',
  'Sent as a reminder for upcoming school visits',
  ARRAY['child_name', 'visit_date', 'visit_type', 'target_grade', 'urgency', 'urgency_message']
),
(
  'bulk_email',
  'Bulk Email',
  '{subject}',
  '<div style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px 30px; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 22px;">IDSS Pro CRM</h1>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      Dear Parent/Guardian of <strong>{child_name}</strong>,
    </p>
    
    <div style="font-size: 16px; margin-bottom: 20px;">
      {message}
    </div>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #6b7280; margin: 0;">
      Best regards,<br>
      <strong>The Admissions Team</strong>
    </p>
  </div>
  
  <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
    This is an automated message from IDSS Pro CRM.
  </p>
</div>',
  'Template for bulk email broadcasts',
  ARRAY['child_name', 'message', 'subject']
);
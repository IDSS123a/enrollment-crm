import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnrollmentNotificationRequest {
  visitorId: string;
  childFirstName: string;
  childLastName: string;
  parentEmail: string;
  targetGrade?: string;
  schoolYear?: string;
}

const DEFAULT_SUBJECT = "🎉 Welcome to Our School - {child_name} is Enrolled!";
const DEFAULT_BODY = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
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
      We look forward to welcoming your child to our school community.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #6b7280; margin: 0;">
      Best regards,<br>
      <strong>The Admissions Team</strong>
    </p>
  </div>
</div>`;

const handler = async (req: Request): Promise<Response> => {
  console.log("Enrollment notification function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      visitorId,
      childFirstName, 
      childLastName, 
      parentEmail,
      targetGrade,
      schoolYear
    }: EnrollmentNotificationRequest = await req.json();

    console.log(`Processing enrollment notification for ${childFirstName} ${childLastName}`);
    console.log(`Sending to: ${parentEmail}`);

    if (!parentEmail) {
      console.error("No parent email provided");
      return new Response(
        JSON.stringify({ error: "Parent email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Fetch custom template from database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let subject = DEFAULT_SUBJECT;
    let bodyHtml = DEFAULT_BODY;

    const { data: template, error: templateError } = await supabase
      .from("email_templates")
      .select("subject, body_html, is_active")
      .eq("template_type", "enrollment_confirmation")
      .maybeSingle();

    if (!templateError && template && template.is_active) {
      subject = template.subject;
      bodyHtml = template.body_html;
      console.log("Using custom enrollment template");
    } else {
      console.log("Using default enrollment template");
    }

    // Replace variables
    const childName = `${childFirstName} ${childLastName}`;
    const variables: Record<string, string> = {
      child_name: childName,
      target_grade: targetGrade || "N/A",
      school_year: schoolYear || "N/A",
    };

    Object.entries(variables).forEach(([key, value]) => {
      subject = subject.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
      bodyHtml = bodyHtml.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });

    const emailResponse = await resend.emails.send({
      from: "IDSS Pro CRM <onboarding@resend.dev>",
      to: [parentEmail],
      subject: subject,
      html: bodyHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending enrollment notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

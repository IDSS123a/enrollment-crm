import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

const handler = async (req: Request): Promise<Response> => {
  console.log("Enrollment notification function called");

  // Handle CORS preflight requests
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

    const gradeInfo = targetGrade ? `Grade ${targetGrade}` : "the school";
    const yearInfo = schoolYear ? ` for the ${schoolYear} school year` : "";

    const emailResponse = await resend.emails.send({
      from: "IDSS Pro CRM <onboarding@resend.dev>",
      to: [parentEmail],
      subject: `Enrollment Confirmed - ${childFirstName} ${childLastName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Enrollment Confirmation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Enrollment Confirmed!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Dear Parent/Guardian,
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              We are pleased to confirm that <strong>${childFirstName} ${childLastName}</strong> has been successfully enrolled in ${gradeInfo}${yearInfo}.
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #667eea;">Enrollment Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Student Name:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${childFirstName} ${childLastName}</td>
                </tr>
                ${targetGrade ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Grade Level:</td>
                  <td style="padding: 8px 0; font-weight: 600;">Grade ${targetGrade}</td>
                </tr>
                ` : ''}
                ${schoolYear ? `
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">School Year:</td>
                  <td style="padding: 8px 0; font-weight: 600;">${schoolYear}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Status:</td>
                  <td style="padding: 8px 0;"><span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 20px; font-size: 14px;">Enrolled</span></td>
                </tr>
              </table>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              We look forward to welcoming ${childFirstName} to our school community. You will receive additional information about orientation and next steps soon.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 0;">
              If you have any questions, please don't hesitate to contact us.
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
        </body>
        </html>
      `,
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

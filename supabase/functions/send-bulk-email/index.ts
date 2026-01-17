import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BulkEmailRequest {
  visitorIds: string[];
  subject: string;
  message: string;
  userId: string;
}

interface VisitorEmailData {
  id: string;
  child_first_name: string;
  child_last_name: string;
  mother_email: string | null;
  father_email: string | null;
  guardian_email: string | null;
}

const DEFAULT_BODY = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
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
</div>`;

const handler = async (req: Request): Promise<Response> => {
  console.log("Bulk email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { visitorIds, subject, message, userId }: BulkEmailRequest = await req.json();

    console.log(`Processing bulk email for ${visitorIds.length} visitors`);

    if (!visitorIds || visitorIds.length === 0) {
      return new Response(
        JSON.stringify({ error: "No visitors selected" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!subject || !message) {
      return new Response(
        JSON.stringify({ error: "Subject and message are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate input lengths
    if (subject.length > 200) {
      return new Response(
        JSON.stringify({ error: "Subject must be less than 200 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Message must be less than 5000 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch custom template
    let bodyTemplate = DEFAULT_BODY;

    const { data: template, error: templateError } = await supabase
      .from("email_templates")
      .select("body_html, is_active")
      .eq("template_type", "bulk_email")
      .single();

    if (!templateError && template && template.is_active) {
      bodyTemplate = template.body_html;
      console.log("Using custom bulk email template");
    } else {
      console.log("Using default bulk email template");
    }

    // Fetch visitor data
    const { data: visitors, error: fetchError } = await supabase
      .from("visitors")
      .select("id, child_first_name, child_last_name, mother_email, father_email, guardian_email")
      .in("id", visitorIds);

    if (fetchError) {
      console.error("Error fetching visitors:", fetchError);
      throw fetchError;
    }

    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
      details: [] as { name: string; status: string; email?: string }[],
    };

    // Send emails to each visitor
    for (const visitor of visitors as VisitorEmailData[]) {
      const email = visitor.mother_email || visitor.father_email || visitor.guardian_email;
      const childName = `${visitor.child_first_name} ${visitor.child_last_name}`;

      if (!email) {
        results.skipped++;
        results.details.push({ name: childName, status: "skipped", email: undefined });
        console.log(`Skipped ${childName}: No email address`);
        continue;
      }

      try {
        // Personalize message with child's name
        const personalizedMessage = message.replace(/\{child_name\}/g, childName);
        
        // Sanitize message for HTML (basic XSS prevention)
        const sanitizedMessage = personalizedMessage
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "<br>");

        // Replace variables in template
        let bodyHtml = bodyTemplate
          .replace(/\{child_name\}/g, childName)
          .replace(/\{message\}/g, sanitizedMessage)
          .replace(/\{subject\}/g, subject);

        await resend.emails.send({
          from: "IDSS Pro CRM <onboarding@resend.dev>",
          to: [email],
          subject: subject,
          html: bodyHtml,
        });

        results.sent++;
        results.details.push({ name: childName, status: "sent", email });
        console.log(`Email sent to ${email} for ${childName}`);
      } catch (emailError: any) {
        results.failed++;
        results.details.push({ name: childName, status: "failed", email });
        console.error(`Failed to send email to ${email}:`, emailError.message);
      }
    }

    console.log(`Bulk email complete: ${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped`);

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in bulk email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

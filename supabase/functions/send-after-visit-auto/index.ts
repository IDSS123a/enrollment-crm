import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("Starting automated after-visit email job...");

    // Fetch the after_visit template
    const { data: template, error: templateError } = await supabase
      .from("email_templates")
      .select("*")
      .eq("template_type", "after_visit")
      .eq("is_active", true)
      .maybeSingle();

    if (templateError || !template) {
      console.error("Template error:", templateError);
      return new Response(
        JSON.stringify({ error: "After visit template not found or inactive" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get date 24 hours ago
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateString = yesterday.toISOString().split('T')[0];

    // Fetch visitors who:
    // 1. Have status 'visited'
    // 2. Have visit_date = yesterday (24 hours ago)
    // 3. Haven't received after_visit email yet
    const { data: visitors, error: visitorsError } = await supabase
      .from("visitors")
      .select("*")
      .eq("status", "visited")
      .eq("visit_date", yesterdayDateString)
      .is("after_visit_email_sent_at", null);

    if (visitorsError) {
      console.error("Visitors error:", visitorsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch visitors" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Found ${visitors?.length || 0} visitors to send after-visit emails to`);

    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
    };

    for (const visitor of visitors || []) {
      const recipientEmail = visitor.mother_email || visitor.father_email || visitor.guardian_email;

      if (!recipientEmail) {
        console.log(`Skipping visitor ${visitor.id} - no email address`);
        results.skipped++;
        continue;
      }

      // Replace template variables
      const childName = `${visitor.child_first_name} ${visitor.child_last_name}`;
      const parentName = visitor.mother_first_name || visitor.father_first_name || "Parent/Guardian";
      const visitDate = visitor.visit_date 
        ? new Date(visitor.visit_date).toLocaleDateString("bs-BA") 
        : "N/A";

      let emailBody = template.body_html
        .replace(/{child_name}/g, childName)
        .replace(/{parent_name}/g, parentName)
        .replace(/{visit_date}/g, visitDate);

      let emailSubject = template.subject
        .replace(/{child_name}/g, childName)
        .replace(/{parent_name}/g, parentName)
        .replace(/{visit_date}/g, visitDate);

      try {
        await resend.emails.send({
          from: "School <onboarding@resend.dev>",
          to: [recipientEmail],
          subject: emailSubject,
          html: emailBody,
        });
        results.sent++;
        console.log(`After visit email sent to ${recipientEmail} for visitor ${visitor.id}`);

        // Mark as sent in database
        await supabase
          .from("visitors")
          .update({ after_visit_email_sent_at: new Date().toISOString() })
          .eq("id", visitor.id);
      } catch (emailErr) {
        console.error(`Failed to send to ${recipientEmail}:`, emailErr);
        results.failed++;
      }
    }

    console.log(`Automated after-visit email job complete:`, results);

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-after-visit-auto function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

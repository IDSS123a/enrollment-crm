import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VisitorWithVisit {
  id: string;
  child_first_name: string;
  child_last_name: string;
  mother_email: string | null;
  father_email: string | null;
  guardian_email: string | null;
  visit_date: string;
  visit_type: string;
  target_grade: string | null;
  user_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Visit reminder function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get tomorrow's date range
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStart = tomorrow.toISOString().split('T')[0];
    
    // Also check for visits in 2 days for advance notice
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const dayAfterTomorrowDate = dayAfterTomorrow.toISOString().split('T')[0];

    console.log(`Checking for visits on ${tomorrowStart} and ${dayAfterTomorrowDate}`);

    // Fetch visitors with upcoming visits
    const { data: visitors, error: fetchError } = await supabase
      .from("visitors")
      .select("id, child_first_name, child_last_name, mother_email, father_email, guardian_email, visit_date, visit_type, target_grade, user_id")
      .eq("status", "scheduled")
      .in("visit_date", [tomorrowStart, dayAfterTomorrowDate]);

    if (fetchError) {
      console.error("Error fetching visitors:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${visitors?.length || 0} upcoming visits`);

    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
    };

    if (!visitors || visitors.length === 0) {
      return new Response(JSON.stringify({ success: true, message: "No upcoming visits found", results }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    for (const visitor of visitors as VisitorWithVisit[]) {
      const email = visitor.mother_email || visitor.father_email || visitor.guardian_email;
      const childName = `${visitor.child_first_name} ${visitor.child_last_name}`;

      if (!email) {
        results.skipped++;
        console.log(`Skipped ${childName}: No email address`);
        continue;
      }

      const visitDate = new Date(visitor.visit_date);
      const formattedDate = visitDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      const isVisitTomorrow = visitor.visit_date === tomorrowStart;
      const urgencyText = isVisitTomorrow ? "Tomorrow" : "In 2 Days";
      const visitTypeText = visitor.visit_type === 'in_person' ? 'In-Person Visit' : 'Online Meeting';

      try {
        await resend.emails.send({
          from: "IDSS Pro CRM <onboarding@resend.dev>",
          to: [email],
          subject: `📅 Reminder: School Visit ${urgencyText} - ${childName}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 20px 30px; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 22px;">📅 Visit Reminder</h1>
              </div>
              
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Dear Parent/Guardian,
                </p>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                  This is a friendly reminder about the upcoming school visit for <strong>${childName}</strong>.
                </p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #d97706;">Visit Details</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Student:</td>
                      <td style="padding: 8px 0; font-weight: 600;">${childName}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Date:</td>
                      <td style="padding: 8px 0; font-weight: 600;">${formattedDate}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Type:</td>
                      <td style="padding: 8px 0; font-weight: 600;">${visitTypeText}</td>
                    </tr>
                    ${visitor.target_grade ? `
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">Target Grade:</td>
                      <td style="padding: 8px 0; font-weight: 600;">Grade ${visitor.target_grade}</td>
                    </tr>
                    ` : ''}
                  </table>
                </div>
                
                <div style="background: ${isVisitTomorrow ? '#fef3c7' : '#dbeafe'}; padding: 15px; border-radius: 8px; border-left: 4px solid ${isVisitTomorrow ? '#f59e0b' : '#3b82f6'}; margin: 20px 0;">
                  <p style="margin: 0; font-weight: 600; color: ${isVisitTomorrow ? '#92400e' : '#1e40af'};">
                    ${isVisitTomorrow ? '⚡ Your visit is tomorrow!' : '📆 Your visit is in 2 days.'}
                  </p>
                </div>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                  We look forward to meeting you and ${visitor.child_first_name}. If you need to reschedule, please contact us as soon as possible.
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
            </body>
            </html>
          `,
        });

        results.sent++;
        console.log(`Reminder sent to ${email} for ${childName}`);

        // Log activity
        await supabase.from("activities").insert([{
          user_id: visitor.user_id,
          title: `Visit reminder sent for ${childName}`,
          type: 'reminder',
          icon: 'bell',
        }]);

      } catch (emailError: any) {
        results.failed++;
        console.error(`Failed to send reminder to ${email}:`, emailError.message);
      }
    }

    console.log(`Reminders complete: ${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped`);

    return new Response(JSON.stringify({ success: true, results }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in visit reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);

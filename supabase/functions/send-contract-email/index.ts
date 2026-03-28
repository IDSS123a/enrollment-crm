import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { contractId, recipientEmail, language } = await req.json();

    if (!contractId || !recipientEmail) {
      throw new Error("Missing contractId or recipientEmail");
    }

    // Get contract
    const { data: contract, error: contractError } = await supabase
      .from("contracts")
      .select("*")
      .eq("id", contractId)
      .single();

    if (contractError || !contract) {
      throw new Error("Contract not found");
    }

    const data = contract.contract_data;
    const lang = (language || contract.language || "ba").toLowerCase();

    // Build email subject and body based on language
    const subjects: Record<string, string> = {
      ba: `Ugovor o upisu - ${data.child_full_name}`,
      en: `Enrollment Contract - ${data.child_full_name}`,
      de: `Einschreibungsvertrag - ${data.child_full_name}`,
    };

    const bodies: Record<string, string> = {
      ba: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">IDSS - Ugovor o upisu</h2>
          <p>Poštovani,</p>
          <p>U prilogu se nalazi ugovor o upisu vašeg djeteta <strong>${data.child_full_name}</strong> u ${data.grade_number} razred.</p>
          <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Broj ugovora:</strong> ${contract.contract_number}</p>
            <p><strong>Školska godina:</strong> ${contract.academic_year}</p>
            <p><strong>Ukupan iznos:</strong> ${data.total_amount_due} KM</p>
          </div>
          <p>Molimo vas da pregledate ugovor i potpišete ga.</p>
          <p>S poštovanjem,<br/>IDSS Tim</p>
        </div>
      `,
      en: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">IDSS - Enrollment Contract</h2>
          <p>Dear Parent,</p>
          <p>Please find attached the enrollment contract for your child <strong>${data.child_full_name}</strong> for Grade ${data.grade_number}.</p>
          <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Contract Number:</strong> ${contract.contract_number}</p>
            <p><strong>Academic Year:</strong> ${contract.academic_year}</p>
            <p><strong>Total Amount:</strong> ${data.total_amount_due} KM</p>
          </div>
          <p>Please review and sign the contract.</p>
          <p>Best regards,<br/>IDSS Team</p>
        </div>
      `,
      de: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a365d;">IDSS - Einschreibungsvertrag</h2>
          <p>Sehr geehrte Eltern,</p>
          <p>Anbei finden Sie den Einschreibungsvertrag für Ihr Kind <strong>${data.child_full_name}</strong> für die ${data.grade_number}. Klasse.</p>
          <div style="background: #f7fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Vertragsnummer:</strong> ${contract.contract_number}</p>
            <p><strong>Schuljahr:</strong> ${contract.academic_year}</p>
            <p><strong>Gesamtbetrag:</strong> ${data.total_amount_due} KM</p>
          </div>
          <p>Bitte überprüfen und unterzeichnen Sie den Vertrag.</p>
          <p>Mit freundlichen Grüßen,<br/>IDSS Team</p>
        </div>
      `,
    };

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resend = new Resend(resendApiKey);

    const emailResponse = await resend.emails.send({
      from: "IDSS Pro CRM <info@idss.ba>",
      to: [recipientEmail],
      subject: subjects[lang] || subjects.en,
      html: bodies[lang] || bodies.en,
    });

    // Update contract status
    await supabase
      .from("contracts")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", contractId);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contract-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);

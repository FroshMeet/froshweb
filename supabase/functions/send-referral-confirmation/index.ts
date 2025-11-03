import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReferralConfirmationRequest {
  to: string;
  referrerName: string;
  applicantName: string;
  applicantSchool: string;
  confirmLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, referrerName, applicantName, applicantSchool, confirmLink }: ReferralConfirmationRequest = await req.json();

    console.log("Sending referral confirmation email to:", to);

    const emailResponse = await resend.emails.send({
      from: "FroshMeet <noreply@frosh.app>",
      to: [to],
      subject: "Please Confirm Your Referral",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Confirm Your Referral</h1>
          <p>Hi ${referrerName},</p>
          <p>Great news! Someone has applied to be a FroshMeet Representative using your referral code.</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Applicant Details:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${applicantName}</p>
            <p style="margin: 5px 0;"><strong>School:</strong> ${applicantSchool}</p>
          </div>
          
          <p style="margin: 30px 0;">
            To confirm this referral and remain eligible for rewards, please click the button below within 7 days:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmLink}" style="background-color: #0066cc; color: white; padding: 15px 30px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
              Confirm Referral
            </a>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #fff5f5; border-left: 4px solid #ff6b6b;">
            <p style="margin: 0; color: #d63031;"><strong>Important:</strong></p>
            <p style="margin: 10px 0; color: #666;">
              If you did not refer this person, please ignore this email. Do not click the confirmation link.
            </p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f0f9ff; border-left: 4px solid #0066cc;">
            <h3 style="margin-top: 0;">Earning Potential:</h3>
            <p style="color: #666;">
              If your referral is hired and their school generates revenue, you will earn 10% of that revenue, up to $500.
            </p>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            If you're having trouble clicking the button, copy and paste this link into your browser:<br>
            <span style="word-break: break-all;">${confirmLink}</span>
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-referral-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

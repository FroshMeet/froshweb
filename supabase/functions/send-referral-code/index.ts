import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReferralCodeRequest {
  to: string;
  name: string;
  code: string;
  link: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, name, code, link }: ReferralCodeRequest = await req.json();

    console.log("Sending referral code email to:", to);

    const emailResponse = await resend.emails.send({
      from: "FroshMeet <noreply@frosh.app>",
      to: [to],
      subject: "Your FroshMeet Referral Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #000;">Your Referral Code</h1>
          <p>Hi ${name},</p>
          <p>Thank you for joining the FroshMeet Representative Referral Program!</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h2 style="color: #000; font-size: 32px; margin: 10px 0;">${code}</h2>
            <p style="color: #666; font-size: 14px;">This is your unique referral code</p>
          </div>
          
          <p>Share this link with potential representatives:</p>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; word-break: break-all;">
            <a href="${link}" style="color: #0066cc;">${link}</a>
          </p>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #0066cc;">
            <h3 style="margin-top: 0;">How It Works:</h3>
            <ul style="color: #666;">
              <li>Share your unique link with potential representatives</li>
              <li>When they apply using your code, you'll receive a confirmation email</li>
              <li>You must confirm the referral within 7 days</li>
              <li>If your referral is hired and their school generates revenue, you earn 10% up to $500</li>
            </ul>
          </div>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Important: Codes are unique and tied to your email. Self-referrals are not allowed.
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
    console.error("Error in send-referral-code function:", error);
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

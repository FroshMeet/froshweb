import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-INSTAGRAM-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { profileId } = await req.json();
    if (!profileId) throw new Error("Profile ID is required");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get the profile with the session ID
    const { data: profile, error: profileError } = await supabaseService
      .from("instagram_profiles")
      .select("stripe_session_id")
      .eq("id", profileId)
      .single();

    if (profileError || !profile?.stripe_session_id) {
      throw new Error("Profile or session not found");
    }

    logStep("Profile found", { sessionId: profile.stripe_session_id });

    // Check payment status with Stripe
    const session = await stripe.checkout.sessions.retrieve(profile.stripe_session_id);
    
    logStep("Session retrieved", { paymentStatus: session.payment_status });

    if (session.payment_status === "paid") {
      // Update profile to mark as paid
      const { error: updateError } = await supabaseService
        .from("instagram_profiles")
        .update({ is_paid: true })
        .eq("id", profileId);

      if (updateError) {
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }

      logStep("Profile marked as paid");

      return new Response(JSON.stringify({ 
        success: true, 
        paid: true,
        message: "Payment verified and profile activated!"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ 
        success: true, 
        paid: false,
        message: "Payment not completed yet"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
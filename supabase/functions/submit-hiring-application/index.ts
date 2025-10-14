import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-idempotency-key',
};

interface HiringApplicationRequest {
  fullName: string;
  instagramHandle?: string;
  email?: string;
  university: string; // This will be the school name from the form
  graduationYear: string;
  timeCommitment: string;
  whyFit: string;
  instagramFamiliarity: string;
  socialMediaExperience: string;
  socialMediaDetails?: string;
  agreementRevenue: boolean;
  agreementRepresent: boolean;
  idempotencyKey?: string;
}

// Generate school code from school name (slug format)
function generateSchoolCode(schoolName: string): string {
  return schoolName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
}

// Normalize Instagram handle (remove @, lowercase, trim)
function normalizeInstagram(handle: string | undefined): string | null {
  if (!handle) return null;
  return handle.trim().replace(/^@/, '').toLowerCase();
}

// Normalize email (lowercase, trim)
function normalizeEmail(email: string | undefined): string | null {
  if (!email) return null;
  return email.trim().toLowerCase();
}


// Create submission hash for deduplication (school_code + contact)
async function createSubmissionHash(schoolCode: string, contact: string): Promise<string> {
  const data = new TextEncoder().encode(`${schoolCode}:${contact}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    const requestData: HiringApplicationRequest = await req.json();
    const idempotencyKey = req.headers.get('x-idempotency-key') || requestData.idempotencyKey;
    
    console.log('Received application for:', requestData.university);

    // Server-side validation
    if (!requestData.fullName || requestData.fullName.length < 2 || requestData.fullName.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Full name must be between 2 and 100 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate at least one contact method
    if (!requestData.instagramHandle && !requestData.email) {
      return new Response(
        JSON.stringify({ error: 'Please provide either an Instagram handle or email' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and generate school code
    if (!requestData.university || requestData.university.length < 2) {
      return new Response(
        JSON.stringify({ error: 'Please select your university' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const schoolCode = generateSchoolCode(requestData.university);
    console.log('Generated school code:', schoolCode, 'for university:', requestData.university);

    // Validate graduation year
    const validYears = ['2026', '2027', '2028', '2029', '2030'];
    if (!validYears.includes(requestData.graduationYear)) {
      return new Response(
        JSON.stringify({ error: 'Invalid graduation year' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate agreements
    if (!requestData.agreementRevenue || !requestData.agreementRepresent) {
      return new Response(
        JSON.stringify({ error: 'You must agree to all terms to continue' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    if (!requestData.timeCommitment || !requestData.whyFit || !requestData.instagramFamiliarity || !requestData.socialMediaExperience) {
      return new Response(
        JSON.stringify({ error: 'All required fields must be filled' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize contact info
    const normalizedInstagram = normalizeInstagram(requestData.instagramHandle);
    const normalizedEmail = normalizeEmail(requestData.email);
    const primaryContact = normalizedInstagram || normalizedEmail!;

    // Create submission hash for deduplication
    const submissionHash = await createSubmissionHash(schoolCode, primaryContact);

    // Get client info
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Check for idempotency key first
    if (idempotencyKey) {
      const { data: existingByKey } = await supabase
        .from('hiring_applications')
        .select('id, status')
        .eq('idempotency_key', idempotencyKey)
        .maybeSingle();

      if (existingByKey) {
        console.log(`Idempotency key match: ${idempotencyKey}`);
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Application already submitted',
            applicationId: existingByKey.id,
            isDuplicate: true
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check for existing submission by hash (soft dedupe)
    const { data: existingByHash } = await supabase
      .from('hiring_applications')
      .select('id, status')
      .eq('submission_hash', submissionHash)
      .maybeSingle();

    if (existingByHash) {
      // Update existing record
      const { data: updated, error: updateError } = await supabase
        .from('hiring_applications')
        .update({
          full_name: requestData.fullName,
          instagram_handle: normalizedInstagram,
          email: normalizedEmail,
          graduation_year: requestData.graduationYear,
          time_commitment: requestData.timeCommitment,
          why_fit: requestData.whyFit,
          instagram_familiarity: requestData.instagramFamiliarity,
          social_media_experience: requestData.socialMediaExperience,
          social_media_details: requestData.socialMediaDetails,
          agreement_revenue: requestData.agreementRevenue,
          agreement_represent: requestData.agreementRepresent,
          idempotency_key: idempotencyKey,
          ip_address: ipAddress,
          user_agent: userAgent,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingByHash.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating application:', updateError);
        throw updateError;
      }

      console.log(`Updated existing application: ${existingByHash.id}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Application updated successfully',
          applicationId: updated.id,
          isUpdate: true
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new application
    const { data: newApp, error: insertError } = await supabase
      .from('hiring_applications')
      .insert({
        full_name: requestData.fullName,
        instagram_handle: normalizedInstagram,
        email: normalizedEmail,
        school_code: schoolCode,
        school_name: requestData.university,
        graduation_year: requestData.graduationYear,
        time_commitment: requestData.timeCommitment,
        why_fit: requestData.whyFit,
        instagram_familiarity: requestData.instagramFamiliarity,
        social_media_experience: requestData.socialMediaExperience,
        social_media_details: requestData.socialMediaDetails,
        agreement_revenue: requestData.agreementRevenue,
        agreement_represent: requestData.agreementRepresent,
        status: 'new',
        submission_hash: submissionHash,
        idempotency_key: idempotencyKey,
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating application:', insertError);
      throw insertError;
    }

    console.log(`Created new application: ${newApp.id} for ${requestData.university} (code: ${schoolCode})`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Application submitted successfully',
        applicationId: newApp.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred while processing your application. Please try again.',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

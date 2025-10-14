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
  university: string;
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
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Normalize Instagram handle (remove @, lowercase, trim)
function normalizeInstagram(handle: string | undefined): string | null {
  if (!handle || !handle.trim()) return null;
  return handle.trim().replace(/^@/, '').toLowerCase();
}

// Normalize email (lowercase, trim)
function normalizeEmail(email: string | undefined): string | null {
  if (!email || !email.trim()) return null;
  return email.trim().toLowerCase();
}

// Create contact fingerprint for deduplication
async function createContactFingerprint(email: string | null, instagram: string | null): Promise<string> {
  const contact = `${email || ''}|${instagram || ''}`.toLowerCase();
  const data = new TextEncoder().encode(contact);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Parse first IP from x-forwarded-for header
function parseIpAddress(req: Request): string | null {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take first IP from comma-separated list
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }
  
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  
  return null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 200 });
  }

  try {
    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request
    const requestData: HiringApplicationRequest = await req.json();
    const idempotencyKey = req.headers.get('x-idempotency-key') || requestData.idempotencyKey;
    
    console.log('Processing application for:', requestData.university);

    // Server-side validation
    if (!requestData.fullName || requestData.fullName.trim().length < 2 || requestData.fullName.length > 100) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Full name must be between 2 and 100 characters' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize contact info first
    const normalizedInstagram = normalizeInstagram(requestData.instagramHandle);
    const normalizedEmail = normalizeEmail(requestData.email);

    // Validate at least one contact method
    if (!normalizedInstagram && !normalizedEmail) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Please provide either an Instagram handle or email' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate and generate school code
    if (!requestData.university || requestData.university.trim().length < 2) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Please select your university' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    const schoolCode = generateSchoolCode(requestData.university);
    const schoolName = requestData.university;

    // Validate graduation year (accept 2025-2032)
    const gradYear = requestData.graduationYear;
    const gradYearNum = parseInt(gradYear);
    if (!gradYear || isNaN(gradYearNum) || gradYearNum < 2025 || gradYearNum > 2032) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid graduation year (must be 2025-2032)' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate agreements (coerce to boolean)
    const agreeRevenue = requestData.agreementRevenue === true || requestData.agreementRevenue === 'true';
    const agreeRepresent = requestData.agreementRepresent === true || requestData.agreementRepresent === 'true';
    
    if (!agreeRevenue || !agreeRepresent) {
      return new Response(
        JSON.stringify({ ok: false, error: 'You must agree to all terms to continue' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate required fields
    if (!requestData.timeCommitment || !requestData.whyFit || !requestData.instagramFamiliarity || !requestData.socialMediaExperience) {
      return new Response(
        JSON.stringify({ ok: false, error: 'All required fields must be filled' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create contact fingerprint for deduplication
    const contactFingerprint = await createContactFingerprint(normalizedEmail, normalizedInstagram);

    // Get client info (parse first IP from x-forwarded-for)
    const ipAddress = parseIpAddress(req);
    const userAgent = req.headers.get('user-agent') || null;

    // Check for idempotency key first
    if (idempotencyKey) {
      const { data: existingByKey } = await supabase
        .from('hiring_applications')
        .select('id, status')
        .eq('idempotency_key', idempotencyKey)
        .maybeSingle();

      if (existingByKey) {
        console.log(`Idempotency match - returning existing application ${existingByKey.id}`);
        return new Response(
          JSON.stringify({ 
            ok: true,
            deduped: true,
            applicationId: existingByKey.id
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check for existing submission by fingerprint (upsert behavior)
    const { data: existingByFingerprint } = await supabase
      .from('hiring_applications')
      .select('id, status')
      .eq('school_code', schoolCode)
      .eq('submission_hash', contactFingerprint)
      .maybeSingle();

    if (existingByFingerprint) {
      // Update existing record
      const { data: updated, error: updateError } = await supabase
        .from('hiring_applications')
        .update({
          full_name: requestData.fullName.trim(),
          instagram_handle: normalizedInstagram,
          email: normalizedEmail,
          school_name: schoolName,
          graduation_year: gradYear,
          time_commitment: requestData.timeCommitment,
          why_fit: requestData.whyFit,
          instagram_familiarity: requestData.instagramFamiliarity,
          social_media_experience: requestData.socialMediaExperience,
          social_media_details: requestData.socialMediaDetails || null,
          agreement_revenue: agreeRevenue,
          agreement_represent: agreeRepresent,
          idempotency_key: idempotencyKey,
          ip_address: ipAddress,
          user_agent: userAgent,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingByFingerprint.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating application:', updateError);
        return new Response(
          JSON.stringify({ ok: false, error: 'Failed to update application' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Updated existing application ${existingByFingerprint.id} for ${schoolName}`);
      return new Response(
        JSON.stringify({ 
          ok: true,
          deduped: true,
          applicationId: updated.id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new application
    const { data: newApp, error: insertError } = await supabase
      .from('hiring_applications')
      .insert({
        full_name: requestData.fullName.trim(),
        instagram_handle: normalizedInstagram,
        email: normalizedEmail,
        school_code: schoolCode,
        school_name: schoolName,
        graduation_year: gradYear,
        time_commitment: requestData.timeCommitment,
        why_fit: requestData.whyFit,
        instagram_familiarity: requestData.instagramFamiliarity,
        social_media_experience: requestData.socialMediaExperience,
        social_media_details: requestData.socialMediaDetails || null,
        agreement_revenue: agreeRevenue,
        agreement_represent: agreeRepresent,
        status: 'new',
        submission_hash: contactFingerprint,
        idempotency_key: idempotencyKey,
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating application:', insertError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to create application' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Created new application ${newApp.id} for ${schoolName} (${schoolCode})`);

    return new Response(
      JSON.stringify({ 
        ok: true,
        applicationId: newApp.id
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ 
        ok: false,
        error: 'An unexpected error occurred. Please try again.'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

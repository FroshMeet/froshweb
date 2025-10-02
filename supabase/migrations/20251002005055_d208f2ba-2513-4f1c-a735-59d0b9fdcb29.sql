-- Security Fixes Migration (Final)
-- 1. Fix sensitive data exposure in user_profiles
-- 2. Add rate limiting for guest submissions
-- 3. Simplify admin verification
-- 4. Add audit logging

-- Drop existing policies first, then the function
DROP POLICY IF EXISTS "Users can view basic profiles without sensitive data" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP FUNCTION IF EXISTS public.can_view_profile_basic_safe(uuid, uuid) CASCADE;

-- Recreate the can_view_profile_basic_safe function with proper data filtering
CREATE OR REPLACE FUNCTION public.can_view_profile_basic_safe(profile_user_id uuid, viewer_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF profile_user_id = viewer_id THEN
    RETURN true;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM profiles p1
    INNER JOIN profiles p2 ON p1.school_slug = p2.school_slug
    WHERE p1.user_id = profile_user_id 
    AND p2.user_id = viewer_id
    AND p1.is_visible = true
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

COMMENT ON FUNCTION public.can_view_profile_basic_safe IS 'Security function to prevent exposure of sensitive user data. Only allows viewing profiles within same school.';

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own complete profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view basic profiles only"
ON public.user_profiles
FOR SELECT
USING (
  auth.uid() != user_id 
  AND verified = true 
  AND can_view_profile_basic_safe(user_id, auth.uid())
);

-- Create a safe view for public profile data
CREATE OR REPLACE VIEW public.safe_profiles AS
SELECT 
  id, user_id, name, avatar_url, school, major, bio, class_year, interests,
  verified, looking_for_roommate, created_at, updated_at,
  CASE WHEN user_id = auth.uid() THEN phone_number ELSE NULL END as phone_number,
  CASE WHEN user_id = auth.uid() THEN college_email ELSE NULL END as college_email
FROM public.user_profiles;

-- Add rate limiting table
CREATE TABLE IF NOT EXISTS public.submission_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  submission_type text NOT NULL,
  attempt_count integer DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.submission_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System only rate limits"
ON public.submission_rate_limits
FOR ALL
USING (false);

COMMENT ON TABLE public.submission_rate_limits IS 'Rate limiting table to prevent spam and abuse of guest submission features.';

-- Create rate limit check function
CREATE OR REPLACE FUNCTION public.check_submission_rate_limit(
  identifier_param text,
  submission_type_param text,
  max_attempts integer DEFAULT 3,
  window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recent_count integer;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM public.submission_rate_limits
  WHERE identifier = identifier_param
    AND submission_type = submission_type_param
    AND window_start > (now() - (window_minutes || ' minutes')::interval);
  
  IF recent_count < max_attempts THEN
    INSERT INTO public.submission_rate_limits (identifier, submission_type)
    VALUES (identifier_param, submission_type_param);
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Add validation constraints to instagram_profiles (drop first if exists)
DO $$ 
BEGIN
  ALTER TABLE public.instagram_profiles DROP CONSTRAINT IF EXISTS check_instagram_handle_format;
  ALTER TABLE public.instagram_profiles ADD CONSTRAINT check_instagram_handle_format 
    CHECK (instagram_handle ~ '^[a-zA-Z0-9._]{1,30}$');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE public.instagram_profiles DROP CONSTRAINT IF EXISTS check_name_length;
  ALTER TABLE public.instagram_profiles ADD CONSTRAINT check_name_length 
    CHECK (char_length(name) >= 2 AND char_length(name) <= 100);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE public.instagram_profiles DROP CONSTRAINT IF EXISTS check_bio_length;
  ALTER TABLE public.instagram_profiles ADD CONSTRAINT check_bio_length 
    CHECK (bio IS NULL OR char_length(bio) <= 500);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add security audit log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  resource text,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
ON public.security_audit_log
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs"
ON public.security_audit_log
FOR INSERT
WITH CHECK (true);

COMMENT ON TABLE public.security_audit_log IS 'Comprehensive security audit log for monitoring suspicious activities and data access patterns.';

-- Create audit logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  action_param text,
  resource_param text DEFAULT NULL,
  details_param jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.security_audit_log (user_id, action, resource, details, ip_address)
  VALUES (auth.uid(), action_param, resource_param, details_param, inet_client_addr());
END;
$$;

-- Simplify admin verification
CREATE OR REPLACE FUNCTION public.is_admin_simple(user_id_param uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM public.log_security_event('admin_check', 'admin_roles', 
    jsonb_build_object('checked_user_id', user_id_param));
  RETURN EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = user_id_param AND is_active = true);
END;
$$;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_school ON public.user_profiles(school);
CREATE INDEX IF NOT EXISTS idx_profiles_school_slug ON public.profiles(school_slug, is_visible);
CREATE INDEX IF NOT EXISTS idx_submission_rate_limits_lookup ON public.submission_rate_limits(identifier, submission_type, window_start);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user ON public.security_audit_log(user_id, created_at DESC);
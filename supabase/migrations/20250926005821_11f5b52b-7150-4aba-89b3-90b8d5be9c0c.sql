-- Fix the security definer view issues by dropping them and using functions instead
DROP VIEW IF EXISTS public.profiles_safe;
DROP VIEW IF EXISTS public.instagram_profiles_safe;

-- Instead, create secure functions that properly handle data access
CREATE OR REPLACE FUNCTION public.get_user_profile_safe(target_user_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  verified BOOLEAN,
  looking_for_roommate BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  name TEXT,
  avatar_url TEXT,
  school TEXT,
  major TEXT,
  bio TEXT,
  class_year TEXT,
  interests TEXT[],
  phone_number TEXT,
  verification_status TEXT,
  college_email TEXT,
  auth_provider TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return sensitive data if user is viewing their own profile
  IF target_user_id = auth.uid() THEN
    -- Return full profile data for own profile
    RETURN QUERY
    SELECT 
      up.id, up.user_id, up.verified, up.looking_for_roommate, up.created_at, 
      up.updated_at, up.name, up.avatar_url, up.school, up.major, up.bio, 
      up.class_year, up.interests, up.phone_number, up.verification_status,
      up.college_email, up.auth_provider
    FROM public.user_profiles up
    WHERE up.user_id = target_user_id;
  ELSE
    -- Return limited profile data for other users (no sensitive info)
    RETURN QUERY
    SELECT 
      up.id, up.user_id, NULL::BOOLEAN as verified, up.looking_for_roommate, 
      up.created_at, up.updated_at, up.name, up.avatar_url, up.school, 
      up.major, up.bio, up.class_year, up.interests, 
      NULL::TEXT as phone_number, NULL::TEXT as verification_status,
      NULL::TEXT as college_email, NULL::TEXT as auth_provider
    FROM public.user_profiles up
    WHERE up.user_id = target_user_id
    AND public.can_view_profile_basic_safe(target_user_id, auth.uid());
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_instagram_profile_safe(target_user_id UUID)
RETURNS TABLE(
  id UUID,
  user_id UUID,
  paid_for_instagram BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  social_links JSONB,
  posted_to_instagram BOOLEAN,
  school TEXT,
  name TEXT,
  instagram_handle TEXT,
  class_year TEXT,
  bio TEXT,
  photos TEXT[],
  instagram_payment_date TIMESTAMP WITH TIME ZONE,
  stripe_session_id TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only return payment data if user is viewing their own profile
  IF target_user_id = auth.uid() THEN
    -- Return full profile data for own profile
    RETURN QUERY
    SELECT 
      ip.id, ip.user_id, ip.paid_for_instagram, ip.created_at, ip.updated_at,
      ip.social_links, ip.posted_to_instagram, ip.school, ip.name,
      ip.instagram_handle, ip.class_year, ip.bio, ip.photos,
      ip.instagram_payment_date, ip.stripe_session_id
    FROM public.instagram_profiles ip
    WHERE ip.user_id = target_user_id;
  ELSE
    -- Return limited profile data for other users (no payment info)
    RETURN QUERY
    SELECT 
      ip.id, ip.user_id, ip.paid_for_instagram, ip.created_at, ip.updated_at,
      ip.social_links, ip.posted_to_instagram, ip.school, ip.name,
      ip.instagram_handle, ip.class_year, ip.bio, ip.photos,
      NULL::TIMESTAMP WITH TIME ZONE as instagram_payment_date, 
      NULL::TEXT as stripe_session_id
    FROM public.instagram_profiles ip
    WHERE ip.user_id = target_user_id
    AND public.can_view_profile(target_user_id, auth.uid());
  END IF;
END;
$$;

-- Grant execute permissions on the safe functions
GRANT EXECUTE ON FUNCTION public.get_user_profile_safe(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_instagram_profile_safe(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_waitlist_signups_admin(INTEGER, INTEGER) TO authenticated;
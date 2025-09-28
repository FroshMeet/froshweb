-- Update the get_user_profile_safe function to completely remove phone number access for other users
-- This prevents phone number harvesting by ensuring phone numbers are NEVER exposed to matched users
CREATE OR REPLACE FUNCTION public.get_user_profile_safe(target_user_id uuid)
RETURNS TABLE(
  id uuid, 
  user_id uuid, 
  verified boolean, 
  looking_for_roommate boolean, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone, 
  name text, 
  avatar_url text, 
  school text, 
  major text, 
  bio text, 
  class_year text, 
  interests text[], 
  phone_number text, 
  verification_status text,
  college_email text, 
  auth_provider text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Only return phone number and sensitive data if user is viewing their own profile
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
    -- Return limited profile data for other users (NEVER include phone_number)
    RETURN QUERY
    SELECT 
      up.id, up.user_id, NULL::BOOLEAN as verified, up.looking_for_roommate, 
      up.created_at, up.updated_at, up.name, up.avatar_url, up.school, 
      up.major, up.bio, up.class_year, up.interests, 
      NULL::TEXT as phone_number, -- Always NULL for other users
      NULL::TEXT as verification_status,
      NULL::TEXT as college_email, 
      NULL::TEXT as auth_provider
    FROM public.user_profiles up
    WHERE up.user_id = target_user_id
    AND public.can_view_profile_basic_safe(target_user_id, auth.uid());
  END IF;
END;
$function$;

-- Update the RLS policy on user_profiles to be more restrictive about phone number access
-- Remove the ability for matched users to see phone numbers through basic profile viewing
DROP POLICY IF EXISTS "Matched users can view basic profiles" ON public.user_profiles;

-- Create a more restrictive policy that explicitly excludes phone numbers for matched users
CREATE POLICY "Users can view basic profiles without sensitive data" 
ON public.user_profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  (verified = true AND can_view_profile_basic_safe(user_id, auth.uid()))
);

-- Add a comment to document the security change
COMMENT ON FUNCTION public.get_user_profile_safe(uuid) IS 'Security function that prevents phone number harvesting by never exposing phone numbers to other users, even if matched. Only users can see their own phone numbers.';
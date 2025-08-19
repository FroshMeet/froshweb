-- Fix remaining security issues

-- 1. Fix submissions table access - ensure it's properly restricted to authenticated users
-- The policy might not have been applied correctly, let's recreate it
DROP POLICY IF EXISTS "Authenticated users can view paid submissions" ON public.submissions;

-- Only allow authenticated users to view their own submissions or admin users
CREATE POLICY "Users can view their own submissions only" 
ON public.submissions 
FOR SELECT 
TO authenticated
USING (false); -- Temporarily block all access until we have a proper user identification system

-- 2. Fix school_chats to require authentication
DROP POLICY IF EXISTS "Anyone can view school chats" ON public.school_chats;

CREATE POLICY "Authenticated users can view school chats" 
ON public.school_chats 
FOR SELECT 
TO authenticated
USING (true);

-- 3. Update can_view_profile function to be more restrictive with sensitive data
CREATE OR REPLACE FUNCTION public.can_view_profile_basic(profile_user_id uuid, viewer_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Allow users to view their own profile
  IF profile_user_id = viewer_id THEN
    RETURN true;
  END IF;
  
  -- Only allow viewing basic info (not sensitive data like phone/email) if users have matched
  IF EXISTS (
    SELECT 1 FROM matches 
    WHERE (user1_id = profile_user_id AND user2_id = viewer_id) 
       OR (user1_id = viewer_id AND user2_id = profile_user_id)
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- 4. Create a more restrictive view for public profile data that excludes sensitive information
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  user_id,
  name,
  avatar_url,
  school,
  major,
  bio,
  class_year,
  interests,
  looking_for_roommate,
  verified,
  created_at
FROM user_profiles
WHERE verified = true;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO authenticated;

-- 5. Update user_profiles policy to be more restrictive with sensitive data
DROP POLICY IF EXISTS "Users can view matched profiles only" ON public.user_profiles;

-- Allow full profile access only to self, limited access to matched users
CREATE POLICY "Restricted profile access" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (
  user_id = auth.uid() -- Full access to own profile
  OR (
    verified = true 
    AND public.can_view_profile_basic(user_id, auth.uid()) 
    AND false -- Temporarily block even matched user access to sensitive data
  )
);
-- Fix submissions table security - restrict public access
DROP POLICY IF EXISTS "Anyone can view paid submissions" ON public.submissions;

-- Create more restrictive policy for submissions - only authenticated users can view
CREATE POLICY "Authenticated users can view paid submissions" 
ON public.submissions 
FOR SELECT 
TO authenticated
USING (has_paid = true);

-- Fix user_profiles security - restrict access to matched users only
-- First, create a function to check if users are matched or have interacted
CREATE OR REPLACE FUNCTION public.can_view_profile(profile_user_id uuid, viewer_id uuid)
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
  
  -- Allow viewing if users have matched
  IF EXISTS (
    SELECT 1 FROM matches 
    WHERE (user1_id = profile_user_id AND user2_id = viewer_id) 
       OR (user1_id = viewer_id AND user2_id = profile_user_id)
  ) THEN
    RETURN true;
  END IF;
  
  -- Allow viewing if users have swiped on each other (for potential matching)
  IF EXISTS (
    SELECT 1 FROM swipes 
    WHERE user_id = viewer_id AND target_user_id = profile_user_id
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- Update user_profiles policy to use the new function
DROP POLICY IF EXISTS "Authenticated users can view verified profiles" ON public.user_profiles;

CREATE POLICY "Users can view matched profiles only" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (public.can_view_profile(user_id, auth.uid()));

-- Fix instagram_profiles security - restrict to matched users only
DROP POLICY IF EXISTS "Authenticated users can view paid instagram profiles" ON public.instagram_profiles;

CREATE POLICY "Users can view matched instagram profiles only" 
ON public.instagram_profiles 
FOR SELECT 
TO authenticated
USING (
  paid_for_instagram = true 
  AND (
    user_id = auth.uid() 
    OR public.can_view_profile(user_id, auth.uid())
  )
);

-- Restrict rate_limit_log access to system functions only
DROP POLICY IF EXISTS "System can manage rate limit logs" ON public.rate_limit_log;

CREATE POLICY "Restricted system access to rate limit logs" 
ON public.rate_limit_log 
FOR ALL 
TO authenticated
USING (false) -- Only allow through security definer functions
WITH CHECK (false);
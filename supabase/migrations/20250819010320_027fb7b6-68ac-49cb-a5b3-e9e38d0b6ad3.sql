-- Fix security definer view issue
DROP VIEW IF EXISTS public.public_profiles;

-- Instead of a view, we'll use the existing policies which are more secure
-- The policies already handle access control properly

-- Re-enable reasonable access to user profiles for matched users
DROP POLICY IF EXISTS "Restricted profile access" ON public.user_profiles;

-- Create a policy that allows viewing basic profile info for matched/swiped users
CREATE POLICY "Matched users can view basic profiles" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (
  user_id = auth.uid() -- Full access to own profile
  OR (
    verified = true 
    AND public.can_view_profile_basic(user_id, auth.uid())
  )
);

-- Create admin access for submissions (if needed)
-- For now, keep submissions locked down until proper admin system is implemented
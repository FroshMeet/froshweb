-- Fix security vulnerability: Remove public access to user profiles
-- Drop the policy that allows public access to verified profiles
DROP POLICY IF EXISTS "Public can view verified profiles" ON public.user_profiles;

-- Create new policy that only allows authenticated users to view verified profiles
CREATE POLICY "Authenticated users can view verified profiles" 
ON public.user_profiles 
FOR SELECT 
TO authenticated
USING (verified = true);

-- The existing policy "Users can view their own profile" remains unchanged
-- This ensures users can always see their own profile regardless of verification status
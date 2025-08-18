-- Fix security vulnerability: Remove public access to all Instagram profiles
-- Drop the overly permissive policy that allows public access to all profiles
DROP POLICY IF EXISTS "Public can view all profiles" ON public.instagram_profiles;

-- Update the existing policy to be more restrictive - only authenticated users can view paid profiles
DROP POLICY IF EXISTS "Public can view instagram paid profiles" ON public.instagram_profiles;

-- Create new policy that only allows authenticated users to view paid Instagram profiles
CREATE POLICY "Authenticated users can view paid instagram profiles" 
ON public.instagram_profiles 
FOR SELECT 
TO authenticated
USING (paid_for_instagram = true);

-- The existing policies for users to manage their own profiles remain unchanged:
-- "Users can insert own profiles", "Users can update own profiles", "Users can view own profiles"
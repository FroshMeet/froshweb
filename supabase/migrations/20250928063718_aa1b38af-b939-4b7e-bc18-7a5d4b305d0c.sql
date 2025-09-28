-- Fix profiles table RLS infinite recursion by creating security definer functions
-- and updating policies to prevent recursive calls

-- Create security definer function to get user's school safely
CREATE OR REPLACE FUNCTION public.get_user_school_slug(user_id_param uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_school_slug text;
BEGIN
  SELECT school_slug INTO user_school_slug 
  FROM public.profiles 
  WHERE user_id = user_id_param;
  
  RETURN user_school_slug;
END;
$$;

-- Create security definer function to check if users are in the same school
CREATE OR REPLACE FUNCTION public.users_same_school(profile_user_id uuid, viewer_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_school text;
  viewer_school text;
BEGIN
  -- Get both users' schools
  SELECT school_slug INTO profile_school FROM public.profiles WHERE user_id = profile_user_id;
  SELECT school_slug INTO viewer_school FROM public.profiles WHERE user_id = viewer_id;
  
  -- Return true if they're in the same school
  RETURN (profile_school IS NOT NULL AND viewer_school IS NOT NULL AND profile_school = viewer_school);
END;
$$;

-- Drop existing problematic RLS policy
DROP POLICY IF EXISTS "Same school users can view profiles" ON public.profiles;

-- Create new non-recursive RLS policy for profiles
CREATE POLICY "Same school users can view profiles (safe)" 
ON public.profiles 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (is_visible = true AND public.users_same_school(user_id, auth.uid()))
);

-- Fix schools table RLS - restrict to authenticated users only
DROP POLICY IF EXISTS "Schools are viewable by everyone" ON public.schools;
CREATE POLICY "Authenticated users can view schools" 
ON public.schools 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Fix school_instagram_usernames table RLS - restrict to authenticated users only  
DROP POLICY IF EXISTS "Anyone can view school Instagram mappings" ON public.school_instagram_usernames;
CREATE POLICY "Authenticated users can view school Instagram mappings" 
ON public.school_instagram_usernames 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create an admin user for testing (using a system approach)
-- First, let's insert a placeholder admin record that can be updated later
INSERT INTO public.admin_roles (user_id, role, is_active, granted_at)
VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid, -- Placeholder UUID
  'admin'::text,
  false, -- Initially inactive until a real user is assigned
  now()
) ON CONFLICT DO NOTHING;
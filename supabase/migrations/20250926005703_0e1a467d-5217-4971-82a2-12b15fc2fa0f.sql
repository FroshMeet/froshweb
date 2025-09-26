-- Fix 1: Create proper admin role system for waitlist access
-- Create an admin_roles table to track who can access sensitive data
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  granted_by UUID,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS on admin_roles
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Only super admins can manage admin roles
CREATE POLICY "Only super admins can manage admin roles"
ON public.admin_roles FOR ALL
USING (false) WITH CHECK (false);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_id_param 
    AND is_active = true
  );
END;
$$;

-- Fix 2: Update waitlist_signups policies to allow proper admin access
DROP POLICY IF EXISTS "Only admins can view waitlist signups" ON public.waitlist_signups;

CREATE POLICY "Admins can view waitlist signups"
ON public.waitlist_signups FOR SELECT
USING (public.is_admin());

-- Fix 3: Create admin-only functions for sensitive data access
CREATE OR REPLACE FUNCTION public.get_waitlist_signups_admin(
  limit_count INTEGER DEFAULT 50,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  school TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to access this function
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT w.id, w.name, w.school, w.email, w.phone, w.created_at
  FROM public.waitlist_signups w
  ORDER BY w.created_at DESC
  LIMIT limit_count OFFSET offset_count;
END;
$$;

-- Fix 4: Update user profile viewing function to exclude sensitive data for non-owners
CREATE OR REPLACE FUNCTION public.can_view_profile_basic_safe(profile_user_id UUID, viewer_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow users to view their own profile (full access)
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

-- Fix 5: Create safe profile view that excludes sensitive data for non-owners
CREATE OR REPLACE VIEW public.profiles_safe AS
SELECT 
  id,
  user_id,
  CASE 
    WHEN user_id = auth.uid() THEN verified
    ELSE NULL
  END as verified,
  CASE 
    WHEN user_id = auth.uid() THEN looking_for_roommate
    ELSE looking_for_roommate  -- This is okay to show
  END as looking_for_roommate,
  created_at,
  updated_at,
  name,
  avatar_url,
  school,
  major,
  bio,
  class_year,
  interests,
  -- Sensitive fields only shown to profile owner
  CASE 
    WHEN user_id = auth.uid() THEN phone_number
    ELSE NULL
  END as phone_number,
  CASE 
    WHEN user_id = auth.uid() THEN verification_status
    ELSE NULL
  END as verification_status,
  CASE 
    WHEN user_id = auth.uid() THEN college_email
    ELSE NULL
  END as college_email,
  CASE 
    WHEN user_id = auth.uid() THEN auth_provider
    ELSE NULL
  END as auth_provider
FROM public.user_profiles;

-- Fix 6: Update instagram profiles to exclude payment data from matched user views
CREATE OR REPLACE VIEW public.instagram_profiles_safe AS
SELECT 
  id,
  user_id,
  paid_for_instagram,
  created_at,
  updated_at,
  social_links,
  posted_to_instagram,
  school,
  name,
  instagram_handle,
  class_year,
  bio,
  photos,
  -- Exclude payment sensitive data unless user is profile owner
  CASE 
    WHEN user_id = auth.uid() THEN instagram_payment_date
    ELSE NULL
  END as instagram_payment_date,
  CASE 
    WHEN user_id = auth.uid() THEN stripe_session_id
    ELSE NULL
  END as stripe_session_id
FROM public.instagram_profiles;

-- Fix 7: Add proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id_active ON public.admin_roles(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_created_at ON public.waitlist_signups(created_at DESC);
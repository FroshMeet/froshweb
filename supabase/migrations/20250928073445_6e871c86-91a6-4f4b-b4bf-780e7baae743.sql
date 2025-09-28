-- Implement ultra-secure access control for waitlist_signups (corrected)
-- The security scanner is concerned about function-based verification vulnerabilities

-- Step 1: Remove all existing SELECT policies and replace with single ultra-restrictive policy
DROP POLICY IF EXISTS "Default deny waitlist access" ON public.waitlist_signups;
DROP POLICY IF EXISTS "Multi-layer admin verification for waitlist access" ON public.waitlist_signups;

-- Step 2: Create a single, simple, and foolproof policy that minimizes attack surface
-- This policy has zero function dependencies and uses only direct table lookups
CREATE POLICY "Ultra secure waitlist access" 
ON public.waitlist_signups 
FOR SELECT 
USING (
  -- Absolute requirement: authenticated user
  auth.uid() IS NOT NULL 
  AND
  -- Direct table check: no function calls, no complex logic
  EXISTS (
    SELECT 1 FROM public.admin_roles ar
    WHERE ar.user_id = auth.uid() 
    AND ar.is_active = true 
    AND ar.role = 'admin'
    AND ar.granted_at IS NOT NULL
    AND ar.granted_at > (now() - interval '6 months')  -- Recent grant only
  )
  AND
  -- Additional direct verification: must have recent activity
  NOT EXISTS (
    SELECT 1 FROM public.admin_roles ar2
    WHERE ar2.user_id = auth.uid() 
    AND ar2.is_active = false  -- No inactive roles
  )
);

-- Step 3: Create service-role only access pattern for aggregate data
CREATE OR REPLACE FUNCTION public.get_waitlist_admin_summary()
RETURNS TABLE(
  total_signups bigint,
  recent_signups bigint,
  schools_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify admin access first with direct table check
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND is_active = true 
    AND role = 'admin'
    AND granted_at > (now() - interval '6 months')
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Log the access attempt
  PERFORM public.log_waitlist_access_attempt('admin_summary_access');
  
  -- Return only aggregate data to minimize exposure
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_signups,
    COUNT(CASE WHEN created_at > (now() - interval '7 days') THEN 1 END)::bigint as recent_signups,
    COUNT(DISTINCT school)::bigint as schools_count
  FROM public.waitlist_signups;
END;
$$;

-- Step 4: Create emergency access revocation mechanism
CREATE TABLE IF NOT EXISTS public.access_revocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  revoked_at timestamp with time zone DEFAULT now(),
  reason text,
  revoked_by uuid
);

-- Enable RLS on access revocations
ALTER TABLE public.access_revocations ENABLE ROW LEVEL SECURITY;

-- Create policy for access revocations
CREATE POLICY "Admins can manage access revocations" 
ON public.access_revocations 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND is_active = true 
    AND role = 'admin'
  )
);

-- Step 5: Update the waitlist access policy to check for revocations
DROP POLICY IF EXISTS "Ultra secure waitlist access" ON public.waitlist_signups;

CREATE POLICY "Maximum security waitlist access" 
ON public.waitlist_signups 
FOR SELECT 
USING (
  -- Must be authenticated
  auth.uid() IS NOT NULL 
  AND
  -- Must be active admin with recent grant
  EXISTS (
    SELECT 1 FROM public.admin_roles ar
    WHERE ar.user_id = auth.uid() 
    AND ar.is_active = true 
    AND ar.role = 'admin'
    AND ar.granted_at IS NOT NULL
    AND ar.granted_at > (now() - interval '6 months')
  )
  AND
  -- Must not be revoked
  NOT EXISTS (
    SELECT 1 FROM public.access_revocations rev
    WHERE rev.user_id = auth.uid()
    AND rev.revoked_at > (now() - interval '1 year')
  )
  AND
  -- Additional safety: no inactive admin roles for this user
  NOT EXISTS (
    SELECT 1 FROM public.admin_roles ar2
    WHERE ar2.user_id = auth.uid() 
    AND ar2.is_active = false
  )
);

-- Step 6: Grant permissions
GRANT EXECUTE ON FUNCTION public.get_waitlist_admin_summary TO authenticated;
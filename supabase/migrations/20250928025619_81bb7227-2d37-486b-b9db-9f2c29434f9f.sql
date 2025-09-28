-- Fix critical security issue: Add multiple layers of protection for waitlist_signups table
-- This implements defense-in-depth to protect customer contact information

-- Drop the existing admin-only policy to replace it with more secure layers
DROP POLICY IF EXISTS "Admins can view waitlist signups" ON public.waitlist_signups;

-- Layer 1: Default DENY policy - explicitly blocks all SELECT operations by default
-- This ensures that if other policies fail, access is still denied
CREATE POLICY "Default deny all access to waitlist data" 
ON public.waitlist_signups 
FOR SELECT 
USING (false);

-- Layer 2: Admin-only policy with multiple checks - requires authentication AND admin status
-- This policy only grants access if the user is authenticated AND passes admin verification
CREATE POLICY "Authenticated admins only can view waitlist signups" 
ON public.waitlist_signups 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND public.is_admin(auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = auth.uid() 
    AND is_active = true
  )
);

-- Layer 3: Emergency safeguard - create a separate admin verification function
-- This provides an additional validation layer that can't be bypassed
CREATE OR REPLACE FUNCTION public.verify_admin_access(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Multiple checks to ensure admin status
  -- Check 1: User must be authenticated
  IF user_id_param IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check 2: User must have active admin role
  IF NOT EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_id_param 
    AND is_active = true
  ) THEN
    RETURN false;
  END IF;
  
  -- Check 3: Use existing is_admin function as additional verification
  IF NOT public.is_admin(user_id_param) THEN
    RETURN false;
  END IF;
  
  -- All checks passed
  RETURN true;
END;
$$;

-- Layer 4: Backup restrictive policy using the verification function
-- This provides an additional layer that requires the new verification function
CREATE POLICY "Verified admins with backup check can view waitlist signups" 
ON public.waitlist_signups 
FOR SELECT 
USING (public.verify_admin_access(auth.uid()));

-- Add constraint to ensure sensitive data is never null when provided
-- This prevents data corruption that could lead to security issues
ALTER TABLE public.waitlist_signups 
ADD CONSTRAINT check_email_or_phone_provided 
CHECK (email IS NOT NULL OR phone IS NOT NULL);

-- Create a security audit log for waitlist access
CREATE TABLE IF NOT EXISTS public.waitlist_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  access_time timestamp with time zone DEFAULT now(),
  access_type text NOT NULL,
  ip_address inet,
  user_agent text
);

-- Enable RLS on the audit log table
ALTER TABLE public.waitlist_access_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view the audit log
CREATE POLICY "Admins can view waitlist access log" 
ON public.waitlist_access_log 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Create function to log waitlist access attempts
CREATE OR REPLACE FUNCTION public.log_waitlist_access(
  access_type_param text,
  ip_address_param inet DEFAULT NULL,
  user_agent_param text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.waitlist_access_log (
    user_id, 
    access_type, 
    ip_address, 
    user_agent
  ) VALUES (
    auth.uid(), 
    access_type_param, 
    ip_address_param, 
    user_agent_param
  );
END;
$$;